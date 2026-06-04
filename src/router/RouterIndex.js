// layouts

import Admin from "@/layouts/Admin.vue";
import Usuario from "@/layouts/Usuario.vue";
import Auth from "@/layouts/Auth.vue";

// views for Admin layout

import Dashboard from "@/views/admin/Dashboard.vue";
import Settings from "@/views/admin/Settings.vue";
// import Tables from "@/views/admin/Tables.vue";

// views for Auth layout

import Login from "@/views/auth/Login.vue";

// views without layouts

import Landing from "@/views/Landing.vue";
import Profile from "@/views/Profile.vue";
import Index from "@/views/Index.vue";

// * CONTACTO
import Contacto from "@/views/Contacto.vue";
import Question from "@/views/Question.vue";
import Politicas from "@/views/Politicas.vue";
import Cookies from "@/views/Cookies.vue";

// * ADMIN
import Usuarios from "@/views/admin/Usuarios.vue";
import Mantenimiento from "@/views/admin/Mantenimiento.vue";
import Entradas from "@/views/admin/Entradas.vue";
import Filtros from "@/views/admin/Filtros.vue";
import Busqueda from "@/views/admin/Busqueda.vue";
import Favorites from "../views/admin/Favorites.vue";
import Boletines from "../views/admin/Boletines.vue";
import Investigacion from "../views/admin/Investigacion.vue";

import UserProxy from "../proxies/UserProxy";
import BusquedaUser from "../views/admin/BusquedaUser.vue";
import FavoritesUser from "../views/admin/FavoritesUser.vue";
import DashboardUser from "../views/admin/DashboardUser.vue";
import Reporte from "../views/admin/Reporte.vue";
import Recovery from "../views/auth/Recovery.vue";
import Noticias from "../views/admin/Noticias.vue";
import Register from "../views/auth/Register.vue";
import Subscripcion from "../views/admin/Subscripcion.vue";
import JurisGPT from "../views/admin/JurisGPT.vue";

const ifAuthenticatedAuth = async (to, from, next) => {
  await UserProxy.validate()
    .then((response) => {
      // Verificar IDR=2 O ROLE="USUARIO" (compatibilidad con diferentes respuestas del backend)
      const isUsuario = response.DATA?.IDR === 2 || response.DATA?.ROLE === "USUARIO";
      if (response?.STATUS && isUsuario) {
        to.params.role = response.DATA;
        if(to.fullPath === "/usuario/favoritos" && ["1"].includes(response.DATA.IDPLN)) {
          next("/usuario/busqueda");
          return;
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
          next("/usuario/busqueda");
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
              if (response.DATA.IDR === 0 || response.DATA.IDR === 1) {
                next("/admin");
              }

              if (response.DATA.IDR === 2) {
                next("/usuario");
              }
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
      },
      {
        path: "/admin/entradas",
        beforeEnter: ifAuthenticatedAdmin,
        component: Entradas,
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
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/admin/jurisgpt",
        beforeEnter: ifAuthenticatedAdmin,
        component: JurisGPT,
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
      }
    ],
  },
  {
    path: "/usuario",
    redirect: "/usuario/busqueda",
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
      },
      {
        path: "/usuario/settings",
        component: Settings,
        beforeEnter: ifAuthenticatedAuth,
      },
      {
        path: "/usuario/busqueda",
        component: BusquedaUser,
        beforeEnter: ifAuthenticatedAuth,
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        },
      },
      {
        path: "/usuario/favoritos",
        component: FavoritesUser,
        beforeEnter: ifAuthenticatedAuth,
        props: (route) => ({
          role: route?.params?.role || [],
        }),
      },
      {
        path: "/usuario/subscripcion",
        component: Subscripcion,
        beforeEnter: ifAuthenticatedAuth,
        props: (route) => ({
          role: route?.params?.role || [],
        }),
      },
      {
        path: "/usuario/reportes",
        beforeEnter: ifAuthenticatedAuth,
        component: Reporte,
        props: (route) => {
          return {
            isUser: true,
            role: route?.params?.role || [],
          };
        }
      },
      {
        path: "/usuario/investigacion",
        beforeEnter: ifAuthenticatedAuth,
        component: Investigacion,
        props: (route) => {
          return {
            role: route?.params?.role || [],
          };
        }
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
    path: "/publicaciones",
    component: () => import("@/views/Publicaciones.vue"),
  },

    {
      path: "/noticias/:title/newsletter/:id",
      name: "noticiaNewsletter",
      component: () => import("@/views/NoticiaIndividual.vue"),
    },
  
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export default routes;
