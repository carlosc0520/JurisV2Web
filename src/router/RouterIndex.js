// layouts

// Cada pantalla se descarga al abrirla (antes iban todas en la carga inicial).
// Solo la página de inicio va incluida, para que abra lo más rápido posible.
const Admin = () => import("@/layouts/Admin.vue");
const Usuario = () => import("@/layouts/Usuario.vue");
const Auth = () => import("@/layouts/Auth.vue");

// views for Auth layout
const Login = () => import("@/views/auth/Login.vue");
const Recovery = () => import("@/views/auth/Recovery.vue");
const Register = () => import("@/views/auth/Register.vue");

// views without layouts
const Landing = () => import("@/views/Landing.vue");
const Profile = () => import("@/views/Profile.vue");
import Index from "@/views/Index.vue";
const Contacto = () => import("@/views/Contacto.vue");
const Question = () => import("@/views/Question.vue");
const Politicas = () => import("@/views/Politicas.vue");
const Cookies = () => import("@/views/Cookies.vue");
const PoliticaIA = () => import("@/views/PoliticaIA.vue");

// * ADMIN — feature folders
const Dashboard = () => import("@/views/admin/dashboard/index.vue");
const DashboardUser = () => import("@/views/admin/dashboard/user.vue");
const Settings = () => import("@/views/admin/settings/index.vue");
const Entradas = () => import("@/views/admin/entradas/index.vue");
const Usuarios = () => import("@/views/admin/usuarios/index.vue");
const Mantenimiento = () => import("@/views/admin/mantenimiento/index.vue");
const Filtros = () => import("@/views/admin/filtros/index.vue");
const Noticias = () => import("@/views/admin/investigacion/admin.vue");

// * Still in flat structure (CSS migration pending)
const Busqueda = () => import("@/views/admin/busqueda/index.vue");
const Favorites = () => import("@/views/admin/favoritos/index.vue");
const Investigacion = () => import("@/views/admin/investigacion/user.vue");
const Boletines = () => import("@/views/admin/boletines/index.vue");
const Subscripcion = () => import("@/views/admin/subscripcion/index.vue");
const Reporte = () => import("@/views/admin/reporte/index.vue");
const JurisGPT = () => import("@/views/admin/jurisgpt/index.vue");
const EmailConfig = () => import("@/views/admin/email-config/index.vue");
const AiPanel = () => import("@/views/admin/ai-panel/index.vue");
const AiAudit = () => import("@/views/admin/ai-audit/index.vue");
const InformeIA = () => import("@/views/admin/informe-ia/index.vue");
const Permisos = () => import("@/views/admin/permisos/index.vue");

import UserProxy from "@/proxies/UserProxy";

// Decodifica el JWT del localStorage y verifica si el permiso está en PERM
function puedeAccederRuta(permission) {
  if (!permission) return true;
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('user-token');
    if (!token) return false;
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64));
    const perms = payload.PERM ?? [];
    return perms.includes(permission) || perms.some(p => p.startsWith(permission + '.'));
  } catch { return false; }
}

const ifAuthenticatedAuth = async (to, from, next) => {
  await UserProxy.validate()
    .then((response) => {
      const isUsuario = response.DATA?.IDR === 2 || response.DATA?.ROLE === "USUARIO";
      if (response?.STATUS && isUsuario) {
        to.params.role = response.DATA;
        // Verificar permiso usando PERM fresco del backend (recalculado desde BD)
        if (to.meta?.permission) {
          const perms = response.DATA?.PERM ?? [];
          // Para rutas: match exacto solamente — revocar el padre bloquea la ruta
          // aunque el usuario conserve permisos de acciones hijas (busqueda.ia, etc.)
          if (!perms.includes(to.meta.permission)) {
            next("/usuario/sin-acceso");
            return;
          }
        }
        next();
      } else {
        next("/auth/login");
      }
    })
    .catch(() => {
      next("/auth/login");
    });
};

const ifAuthenticatedAdmin = async (to, from, next) => {
  try {
    await UserProxy.validate()
      .then((response) => {
        // Verificar IDR=0/1 O ROLE="ADMIN"/"SUPERADMIN" (compatibilidad con diferentes respuestas del backend)
        const isAdmin = (response.DATA?.IDR === 0 || response.DATA?.IDR === 1) || 
                        (response.DATA?.ROLE === "ADMIN" || response.DATA?.ROLE === "SUPERADMIN");
        if (response?.STATUS && isAdmin) {
          to.params.role = response.DATA;
          if (to.meta?.permission) {
            const perms = response.DATA?.PERM ?? [];
            if (!perms.includes(to.meta.permission)) {
              next("/admin/dashboard");
              return;
            }
          }
          next();
        } else {
          next("/auth/login");
        }
      })
      .catch(() => {
        next("/auth/login");
      });
  } catch (error) {
    next("/auth/login");
  }
};


const ifAuthenticatedAuthToken = async (to, from, next) => {
  // Si no hay tokens, permitir acceso directo a rutas de auth
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    next();
    return;
  }
  
  try {
    await UserProxy.validate()
      .then((response) => {
        if (response?.STATUS && response.DATA.IDR === 2) {
          next("/redirect");
        } else if (response?.STATUS && (response.DATA.IDR === 0 || response.DATA.IDR === 1)) {
          next("/admin/dashboard");
        } else {
          next();
        }
      })
      .catch(() => {
        next();
      });
  } catch (error) {
    next();
  }
}

const routes = [
  {
    path: "/redirect",
    beforeEnter: async (to, from, next) => {
      try {
        await UserProxy.validate()
          .then((response) => {
            if (response?.STATUS) {
              const IDR  = response.DATA?.IDR;
              const ROLE = response.DATA?.ROLE;
              const isAdmin   = IDR === 0 || IDR === 1 || ROLE === 'ADMINISTRADOR' || ROLE === 'DIGITADOR';
              const isUsuario = !isAdmin && (IDR === 2 || ROLE === 'USUARIO' || ROLE === 'SUSCRIPTOR');
              if (isAdmin)   { next("/admin"); return; }
              if (isUsuario) {
                // Si tiene plan pendiente de compra, llevarlo directo a la suscripción
                const IDPLN_PENDING = response.DATA?.IDPLN_PENDING;
                if (IDPLN_PENDING) {
                  next(`/usuario/subscripcion?plan=${IDPLN_PENDING}`);
                  return;
                }

                // Redirigir al primer módulo disponible según PERM (fresco del backend)
                const PERM = response.DATA?.PERM ?? [];
                const hasPerm = (clave) => PERM.includes(clave);
                const rutas = [
                  { route: '/usuario/busqueda',      perm: 'busqueda' },
                  { route: '/usuario/investigacion', perm: 'investigacion' },
                  { route: '/usuario/favoritos',     perm: 'favoritos' },
                  { route: '/usuario/reportes',      perm: 'reportes' },
                  { route: '/usuario/jurisgpt',      perm: 'jurisgpt' },
                ];
                const primera = rutas.find(r => hasPerm(r.perm));
                next(primera?.route || '/usuario/sin-acceso');
                return;
              }
            }
            next("/auth/login");
          })
          .catch(() => next("/auth/login"));
      } catch (error) {
        next("/auth/login");
      }
    },
  },
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    component: Admin,
    props: (route) => {
      return {
        role: route?.params?.role || [],
      };
    },
    children: [
      {
        path: "/admin/dashboard",
        beforeEnter: ifAuthenticatedAdmin,
        component: Dashboard,
        meta: { title: 'Dashboard', subtitle: 'Vista general de estadísticas y métricas' },
      },
      {
        path: "/admin/entradas",
        beforeEnter: ifAuthenticatedAdmin,
        component: Entradas,
        meta: { title: 'Entradas', subtitle: 'Gestión de jurisprudencia y legislación' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/usuarios",
        beforeEnter: ifAuthenticatedAdmin,
        component: Usuarios,
        meta: { title: 'Usuarios', subtitle: 'Gestión de subscriptores, digitadores y administradores' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/mantenimiento",
        beforeEnter: ifAuthenticatedAdmin,
        component: Mantenimiento,
        meta: { title: 'Mantenimiento', subtitle: 'Gestión de preguntas frecuentes y planes' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/filtros",
        beforeEnter: ifAuthenticatedAdmin,
        component: Filtros,
        meta: { title: 'Filtros y Magistrados', subtitle: 'Gestión de filtros jerárquicos y magistrados del sistema' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/settings",
        beforeEnter: ifAuthenticatedAdmin,
        component: Settings,
        meta: { title: 'Configuración de Cuenta', subtitle: 'Gestiona tu información personal y contactos' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/busqueda",
        beforeEnter: ifAuthenticatedAdmin,
        component: Busqueda,
        meta: { title: 'Búsqueda', subtitle: 'Busca jurisprudencia y legislación' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/favoritos",
        beforeEnter: ifAuthenticatedAdmin,
        component: Favorites,
        meta: { title: 'Mis Favoritos', subtitle: 'Gestiona tus documentos y directorios favoritos' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/boletines",
        beforeEnter: ifAuthenticatedAdmin,
        component: Boletines,
        meta: { title: 'Boletines', subtitle: 'Administra los boletines de la plataforma' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/reportes",
        beforeEnter: ifAuthenticatedAdmin,
        component: Reporte,
        meta: { title: 'Reportes', subtitle: 'Estadísticas y análisis de la plataforma' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/investigacion",
        beforeEnter: ifAuthenticatedAdmin,
        component: Noticias,
        meta: { title: 'Investigación', subtitle: 'Gestión de investigaciones, autores, categorías y recursos' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/blog",
        beforeEnter: ifAuthenticatedAdmin,
        component: () => import("@/views/admin/publicaciones/index.vue"),
        meta: { title: 'Blog', subtitle: 'Gestión de artículos, categorías y etiquetas' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/blog/nuevo",
        beforeEnter: ifAuthenticatedAdmin,
        component: () => import("@/views/admin/publicaciones/Editor.vue"),
        meta: { title: 'Nueva publicación', subtitle: 'Redacta un nuevo artículo' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/blog/:id/editar",
        beforeEnter: ifAuthenticatedAdmin,
        component: () => import("@/views/admin/publicaciones/Editor.vue"),
        meta: { title: 'Editar publicación', subtitle: 'Edita un artículo existente' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
            id: route?.params?.id,
          };
        }
      },
      {
        path: "/admin/jurisgpt",
        beforeEnter: ifAuthenticatedAdmin,
        component: JurisGPT,
        meta: { title: 'JurisGPT', subtitle: 'Consulta inteligente sobre jurisprudencia', permission: 'jurisgpt' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/email-config",
        beforeEnter: ifAuthenticatedAdmin,
        component: EmailConfig,
        meta: { title: 'Configuración de Correo', subtitle: 'Gestiona los parámetros SMTP y los eventos de correo del sistema', permission: 'email.config' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/ai-panel",
        beforeEnter: ifAuthenticatedAdmin,
        component: AiPanel,
        meta: { title: 'Panel IA', subtitle: 'Control de búsqueda semántica por embeddings', permission: 'ai.panel' },
      },
      {
        path: "/admin/informe-ia",
        beforeEnter: ifAuthenticatedAdmin,
        component: InformeIA,
        meta: { title: 'Errores IA', subtitle: 'Comprobación manual de los errores reportados en la búsqueda con IA' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/ai-audit",
        beforeEnter: ifAuthenticatedAdmin,
        component: AiAudit,
        meta: { title: 'Auditoría IA', subtitle: 'Qué preguntan los usuarios y qué les respondió la IA', permission: 'ai.audit' },
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/subscripcion",
        beforeEnter: ifAuthenticatedAdmin,
        component: Subscripcion,
        meta: { title: 'Planes y Suscripción', subtitle: 'Gestión de planes y suscripciones' },
        props: (route) => ({ role: route?.params?.role || [] }),
      },
      {
        path: "/admin/permisos",
        beforeEnter: ifAuthenticatedAdmin,
        component: Permisos,
        meta: { title: 'Permisos', subtitle: 'Control de acceso a módulos por plan y usuario', permission: 'permisos' },
      }
    ],
  },
  {
    path: "/usuario",
    redirect: "/redirect",
    component: Usuario,
    props: (route) => {
      return {
        role: route?.params?.role || [],
      };
    },
    children: [
      {
        path: "/usuario/dashboard",
        component: DashboardUser,
        beforeEnter: ifAuthenticatedAuth,
        meta: { title: 'Dashboard', subtitle: 'Vista general de tu actividad' },
      },
      {
        path: "/usuario/settings",
        component: Settings,
        beforeEnter: ifAuthenticatedAuth,
        meta: { title: 'Configuración de Cuenta', subtitle: 'Gestiona tu información personal y contactos' },
      },
      {
        path: "/usuario/busqueda",
        component: Busqueda,
        beforeEnter: ifAuthenticatedAuth,
        meta: { title: 'Búsqueda', subtitle: 'Busca jurisprudencia y legislación', permission: 'busqueda' },
        props: (route) => ({ role: route?.params?.role || [] }),
      },
      {
        path: "/usuario/favoritos",
        component: Favorites,
        beforeEnter: ifAuthenticatedAuth,
        meta: { title: 'Mis Favoritos', subtitle: 'Gestiona tus documentos y directorios favoritos', permission: 'favoritos' },
        props: (route) => ({ role: route?.params?.role || [] }),
      },
      {
        path: "/usuario/subscripcion",
        component: Subscripcion,
        beforeEnter: ifAuthenticatedAuth,
        meta: { title: 'Planes y Suscripción', subtitle: 'Elige el plan perfecto para tus necesidades legales' },
        props: (route) => ({ role: route?.params?.role || [] }),
      },
      {
        path: "/usuario/reportes",
        beforeEnter: ifAuthenticatedAuth,
        component: Reporte,
        meta: { title: 'Reportes', subtitle: 'Estadísticas y análisis de la plataforma', permission: 'reportes' },
        props: (route) => ({ isUser: true, role: route?.params?.role || [] }),
      },
      {
        path: "/usuario/investigacion",
        beforeEnter: ifAuthenticatedAuth,
        component: Investigacion,
        meta: { title: 'Investigación', subtitle: 'Descubre las últimas actualizaciones y noticias del mundo jurídico', permission: 'investigacion' },
        props: (route) => ({ role: route?.params?.role || [] }),
      },
      {
        path: "/usuario/jurisgpt",
        component: JurisGPT,
        beforeEnter: ifAuthenticatedAuth,
        meta: { title: 'JurisGPT', subtitle: 'Consulta inteligente sobre jurisprudencia', permission: 'jurisgpt' },
        props: (route) => ({ role: route?.params?.role || [] }),
      },
      {
        path: "/usuario/sin-acceso",
        beforeEnter: ifAuthenticatedAuth,
        component: () => import('@/views/admin/SinAcceso.vue'),
        meta: { title: 'Sin Acceso', subtitle: 'No tienes permiso para acceder a esta sección' },
      }
    ],
  },
  {
    path: "/auth",
    redirect: "/auth",
    component: Auth,
    beforeEnter: ifAuthenticatedAuthToken,
    children: [
      {
        path: "/auth/login",
        component: Login,
      },
      {
        path: "/auth/register",
        component: Register
      },
      {
        path: "/auth/autoUser/:token",
        component: Register,
      },
      {
        path: "/auth/recovery/:token",
        component: Recovery,
      },
      {
        path: "/auth/verify-email/:token",
        component: () => import('@/views/auth/VerifyEmail.vue'),
      }
    ],
  },
  {
    path: "/landing",
    component: Landing,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/",
    component: Index,
  },
  {
    path: "/contacto",
    component: Contacto,
  },
  {
    path: "/questions",
    component: Question,
  },
  {
    path: "/politicas&privacidad",
    component: Politicas,
  },
  {
    path: "/cookies",
    component: Cookies,
  },
  {
    path: "/politica-ia",
    component: PoliticaIA,
  },
  {
    // Blog nuevo o feed de Instagram según la bandera BLOG_PUBLICACIONES (o ?preview=true)
    path: "/blog",
    component: () => import("@/views/PublicacionesEntrada.vue"),
    meta: { seoPropio: true },
  },
  {
    // Categoría elegida en el menú del blog: misma página, filtrada
    path: "/blog/categoria/:categoria",
    component: () => import("@/views/PublicacionesEntrada.vue"),
    meta: { seoPropio: true },
  },
  {
    // Vista previa de un borrador: la misma página pública del artículo
    path: "/blog/previa/:token",
    component: () => import("@/views/PublicacionDetalle.vue"),
    meta: { seoPropio: true },
  },
  {
    path: "/blog/:slug",
    component: () => import("@/views/PublicacionDetalle.vue"),
    meta: { seoPropio: true },
  },
  // Direcciones anteriores: los enlaces ya compartidos siguen funcionando.
  { path: "/publicaciones", redirect: to => ({ path: "/blog", query: to.query }) },
  // Admin: las direcciones anteriores llevan a las nuevas (pasan por el mismo control de acceso)
  { path: "/admin/publicaciones", redirect: to => ({ path: "/admin/blog", query: to.query }) },
  { path: "/admin/publicaciones/nuevo", redirect: to => ({ path: "/admin/blog/nuevo", query: to.query }) },
  { path: "/admin/publicaciones/:id/editar", redirect: to => ({ path: `/admin/blog/${to.params.id}/editar`, query: to.query }) },
  { path: "/publicaciones/previa/:token", redirect: to => ({ path: `/blog/previa/${to.params.token}`, query: to.query }) },
  { path: "/publicaciones/:slug", redirect: to => ({ path: `/blog/${to.params.slug}`, query: to.query }) },

    {
      path: "/noticias/:title/newsletter/:id",
      name: "noticiaNewsletter",
      component: () => import("@/views/NoticiaIndividual.vue"),
    },
  
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export default routes;
