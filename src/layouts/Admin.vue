<template>
  <div class="navbarDesign dark:bg-gray-900" :class="{ collapsed: isCollapsed }">
    <!-- Sidebar -->
    <div class="sidebar dark:bg-gray-800" :class="isCollapsed ? 'w-content-0' : 'w-content-10'">
      <sidebar :is-collapsed="isCollapsed" :toggleSidebar="toggleSidebar" :menu="menu" :role="role" />
    </div>

    <!-- Contenido principal -->
    <div class="main-content transition-all duration-300 dark:bg-gray-900" :class="isCollapsed ? 'w-content-100' : 'w-content-90'">
      <admin-navbar :RTAFTO="RTAFTO" :toggleSidebar="toggleSidebar" :is-collapsed="isCollapsed" />
      <div class="content-wrapper dark:bg-gray-900">
        <router-view :RTAFTO="RTAFTO" :UPDATERTAFTO="UPDATERTAFTO" />
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from "@/components/Navbars/AdminNavbar.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import homeIcon from '@/assets/img/icons/home.svg';
import busquedaIcon from '@/assets/img/icons/busqueda.svg';
import perfilIcon from '@/assets/img/icons/perfil.svg';
import mantenimientoIcon from '@/assets/img/icons/mantenimiento.svg';
import filtersIcon from '@/assets/img/icons/filters.svg';
import usersIcon from '@/assets/img/icons/users.svg';
import jurisIcon from '@/assets/img/icons/juris.svg';
import estrellaIcon from '@/assets/img/icons/estrella.svg';
import noticiasIcon from '@/assets/img/icons/noticias.svg';
import emailIcon from '@/assets/img/icons/email.svg';
import aiIcon from '@/assets/img/icons/ai.svg';
import subscripcionIcon from '@/assets/img/icons/subscripcion.svg';
import settingsIcon from '@/assets/img/icons/settings.svg';
import { useAuthStore } from '@/stores/auth.store';

export default {
  name: "admin-layout",
  components: {
    AdminNavbar,
    Sidebar,
  },
  data() {
    return {
      RTAFTO: "",
      isCollapsed: false,
      isVisible: true,
      allMenu: [
        { name: 'Inicio',        route: '/admin/dashboard',    icon: homeIcon },
        { name: 'Búsqueda',      route: '/admin/busqueda',     icon: busquedaIcon },
        { name: 'Perfil',        route: '/admin/settings',     icon: perfilIcon },
        { name: 'Resoluciones',  route: '/admin/entradas',     icon: jurisIcon },
        { name: 'Usuarios',      route: '/admin/usuarios',     icon: usersIcon },
        { name: 'Filtros',       route: '/admin/filtros',      icon: filtersIcon },
        { name: 'Mantenimiento', route: '/admin/mantenimiento',icon: mantenimientoIcon },
        { name: 'Favoritos',     route: '/admin/favoritos',    icon: estrellaIcon },
        { name: 'Investigación', route: '/admin/investigacion',icon: noticiasIcon },
        { name: 'Correo',        route: '/admin/email-config', icon: emailIcon,  permission: 'email.config' },
        { name: 'Panel IA',      route: '/admin/ai-panel',     icon: aiIcon,      permission: 'ai.panel' },
        { name: 'Auditoría IA',  route: '/admin/ai-audit',     icon: aiIcon,      permission: 'ai.audit' },
        { name: 'JurisGPT',     route: '/admin/jurisgpt',     icon: jurisIcon,    permission: 'jurisgpt' },
        { name: 'Suscripción',   route: '/admin/subscripcion', icon: subscripcionIcon },
        { name: 'Permisos',      route: '/admin/permisos',     icon: settingsIcon, permission: 'permisos' },
      ],
    };
  },

  computed: {
    menu() {
      const perms = this.role?.PERM ?? [];
      return this.allMenu.filter(item => !item.permission || perms.includes(item.permission));
    },
  },
  props: {
    role: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    UPDATERTAFTO() {
      this.RTAFTO = JSON.parse(localStorage.getItem("user"))?.RTAFTO;
    },
    checkScreenSize() {
      this.isCollapsed = window.innerWidth < 768;
    },
  },
  // wathc al router
  watch: {
    $route(to) {
      this.isVisible = !['/admin/busqueda', '/admin/reportes'].includes(to.path);
    },
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem("user"));
    let RTAFTO = user?.RTAFTO;
    if (RTAFTO?.includes("comnull")) RTAFTO = null;
    this.RTAFTO = RTAFTO;
    this.isVisible = !['/admin/busqueda', '/admin/reportes'].includes(this.$route.path);
    
    // Establecer estado inicial del sidebar según tamaño de pantalla
    this.checkScreenSize();
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
};
</script>

<style>
html {
    min-height: 100%;
    position: relative;
}

body {
    margin: 0;
    background-color: #f9fafb !important;
}

.dark body {
    background-color: #1a202c !important;
}

.content-wrapper {
    padding-top: 0;
    min-height: calc(100vh - 60px);
    width: 100%;
    overflow-x: hidden;
    background-color: transparent;
}

hr {
    margin-top: 0;
    margin-bottom: 0;
    border: 0;
    border-top: 1.5px solid rgba(0, 0, 0, 0.1);
    width: 90%;
    margin: 0 auto;
}

.dark hr {
    border-top-color: rgba(255, 255, 255, 0.1);
}


@media (min-width: 768px) {
    .ml-24 {
        margin-left: 6rem;
    }

    .ml-64 {
        margin-left: 16rem;
    }

    .w-calc100-6rem {
        width: calc(100% - 6rem);
    }

    .w-calc100-16rem {
        width: calc(100% - 16rem);
    }
}

.padding-view-usuario {
    padding-top: 6rem;
}

@media (max-width: 768px) {
    .padding-view-usuario {
        padding-top: 1rem;
    }
}

@media (max-width: 767px) {
    .content-wrapper {
        min-height: calc(100vh - 60px);
    }

    .calculator {
        margin: 0 !important;
    }
}
</style>