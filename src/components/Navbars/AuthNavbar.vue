<template>
  <nav
    class="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white dark:bg-gray-800 shadow transition-colors duration-300">
    <div class="container m-0 py-2 px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
        <button
          class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button" v-on:click="setNavbarOpen">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <div class="lg:flex flex-grow items-center" :class="[navbarOpen ? 'block' : 'hidden']"
        id="example-navbar-warning">
        <ul class="flex flex-col lg:flex-row list-none mr-auto p-0 m-0">
          <li>
            <router-link to="/">
              <a class="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4  uppercase" href="#pablo">
                <img :src="logoJuris" alt="" width="100" />
              </a>
            </router-link>
          </li>
          <li class="flex items-center">
            <router-link to="/"
              class="hover:text-blueGray-500 text-blueGray-700 px-3 py-2 flex items-center text-xs uppercase font-bold">
              <i class="text-blueGray-400 text-lg leading-lg mr-2 fas fa-home" />
              Inicio
            </router-link>
          </li>
          <li class="flex items-center">
            <router-link to="/noticias"
              class="hover:text-blueGray-500 text-blueGray-700 px-3 py-2 flex items-center text-xs uppercase font-bold">
              <i class="text-blueGray-400 text-lg leading-lg mr-2 fas fa-newspaper" />
              Noticias
            </router-link>
          </li>
          <li class="flex items-center">
            <router-link to="/contacto"
              class="hover:text-blueGray-500 text-blueGray-700 px-3 py-2 flex items-center text-xs uppercase font-bold">
              <i class="text-blueGray-400 text-lg leading-lg mr-2 fas fa-envelope" />
              Contacto
            </router-link>
          </li>
        </ul>
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto p-0 m-0">
          <li class="flex items-center">
            <!-- <dark-mode-toggle class="mr-3" /> -->
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import logoJuris from "@/assets/img/logos/logo.png";
// import DarkModeToggle from "@/components/DarkModeToggle.vue";

export default {
  components: {
    // DarkModeToggle,
  },
  data() {
    return {
      logoJuris,
      navbarOpen: false,
    };
  },
  methods: {
    setNavbarOpen: function () {
      this.navbarOpen = !this.navbarOpen;
    },
    locations() {
      return window.location.href.includes('auth/login')
    },
  }
};
</script>