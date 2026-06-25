<template>
    <div class="navbarDesign dark:bg-gray-900" :class="{ collapsed: isCollapsed }">
        <div class="sidebar dark:bg-gray-800" :class="isCollapsed ? 'w-content-0' : 'w-content-10'">
            <sidebar :is-collapsed="isCollapsed" :toggleSidebar="toggleSidebar" :menu="menu" :role="role" />
        </div>
        <div class="main-content transition-all duration-300 dark:bg-gray-900"
            :class="isCollapsed ? 'w-content-100' : 'w-content-90'">
            <admin-navbar :RTAFTO="RTAFTO" :toggleSidebar="toggleSidebar" />
            <div class="content-wrapper dark:bg-gray-900">
                <router-view :RTAFTO="RTAFTO" :UPDATERTAFTO="UPDATERTAFTO" />
            </div>
        </div>
    </div>
</template>

<script>
import AdminNavbar from "@/components/Navbars/AdminNavbar.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import { useAuthStore } from '@/stores/auth.store';

import busquedaIcon from '@/assets/img/icons/busqueda.svg';
import perfilIcon from '@/assets/img/icons/perfil.svg';
import estrellaIcon from '@/assets/img/icons/estrella.svg';
import subscripcionIcon from '@/assets/img/icons/subscripcion.svg';
import noticiasIcon from '@/assets/img/icons/noticias.svg';
import aiIcon from '@/assets/img/icons/ai.svg';

export default {
    name: "admin-layout",
    components: {
        AdminNavbar,
        Sidebar,
    },
    props: {
        role: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            RTAFTO: JSON.parse(localStorage.getItem("user"))?.RTAFTO,
            isCollapsed: false,
        };
    },
    computed: {
        menu() {
            const auth = useAuthStore();
            const allItems = [
                { name: 'Búsqueda',     route: '/usuario/busqueda',     icon: busquedaIcon,     permission: 'busqueda' },
                { name: 'Favoritos',    route: '/usuario/favoritos',    icon: estrellaIcon,     permission: 'favoritos' },
                { name: 'Investigación',route: '/usuario/investigacion', icon: noticiasIcon,    permission: 'investigacion' },
                { name: 'JurisGPT',    route: '/usuario/jurisgpt',     icon: aiIcon,           permission: 'jurisgpt' },
                { name: 'Perfil',       route: '/usuario/settings',     icon: perfilIcon },
                { name: 'Suscripción',  route: '/usuario/subscripcion', icon: subscripcionIcon },
            ];
            return allItems.filter(item => !item.permission || auth.puedeAccederRuta(item.permission));
        },
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
    mounted() {
        let user = JSON.parse(localStorage.getItem("user"));
        let RTAFTO = user?.RTAFTO;
        if (RTAFTO?.includes("comnull")) RTAFTO = null;
        this.RTAFTO = RTAFTO;

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
    min-height: calc(100vh - 60px);
    width: 100%;
    overflow-x: hidden;
    background-color: #f9fafb;
}

hr {
    margin-top: 0;
    margin-bottom: 0;
    border: 0;
    border-top: 1.5px solid rgba(0, 0, 0, 0.1);
    width: 90%;
    margin: 0 auto;
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