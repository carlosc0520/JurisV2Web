<template>
  <footer class="bg-[#0f172a] bg-gradient-to-br from-[#1e293b] to-[#0f172a] pt-16 relative overflow-hidden">
    <!-- Borde superior decorativo -->
    <div class="absolute top-0 left-0 right-0 h-px"
      style="background: linear-gradient(90deg, transparent 0%, #DF2DB2 20%, #185CE6 50%, #DF2DB2 80%, transparent 100%)"></div>

    <div class="max-w-[1280px] mx-auto px-8 sm:px-6">
      <!-- Contenido principal -->
      <div class="grid lg:grid-cols-[1.5fr_2fr] grid-cols-1 gap-16 pb-12 border-b border-white/10">
        <!-- Marca -->
        <div class="flex flex-col gap-6">
          <router-link to="/" class="inline-block transition-transform hover:scale-105">
            <img :src="logoJuris" alt="Juris Search" class="h-[50px] w-auto" />
          </router-link>
          <p class="text-white/70 text-[0.9375rem] leading-relaxed max-w-[350px]">
            Plataforma líder en búsqueda jurídica inteligente para profesionales del derecho en Perú.
          </p>
          <div class="flex gap-4">
            <a href="https://www.instagram.com/juris.search/" target="_blank" rel="noreferrer" aria-label="Instagram"
              class="relative w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-[10px] text-white/70 transition-all hover:-translate-y-1 overflow-hidden group">
              <span class="absolute inset-0 bg-gradient-to-br from-brand-pink to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <svg class="relative z-10 w-5 h-5 transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/juris-search/" target="_blank" rel="noreferrer" aria-label="LinkedIn"
              class="relative w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-[10px] text-white/70 transition-all hover:-translate-y-1 overflow-hidden group">
              <span class="absolute inset-0 bg-gradient-to-br from-brand-pink to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <svg class="relative z-10 w-5 h-5 transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Navegación -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="flex flex-col gap-4">
            <h3 class="text-base font-bold m-0 bg-gradient-to-br from-[#DF2DB2] via-purple-500 to-[#185CE6] bg-clip-text text-transparent">Navegación</h3>
            <ul class="list-none p-0 m-0 flex flex-col gap-3">
              <li v-for="link in navLinks" :key="link.to">
                <router-link :to="link.to" class="group relative inline-block text-white/70 hover:text-white transition-all hover:translate-x-1 text-[0.9375rem]">
                  {{ link.label }}
                  <span class="absolute bottom-[-2px] left-0 h-0.5 w-0 bg-gradient-to-r from-[#DF2DB2] to-[#185CE6] transition-all duration-300 group-hover:w-full"></span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-4">
            <h3 class="text-base font-bold m-0 bg-gradient-to-br from-[#DF2DB2] via-purple-500 to-[#185CE6] bg-clip-text text-transparent">Soporte</h3>
            <ul class="list-none p-0 m-0 flex flex-col gap-3">
              <li v-for="link in supportLinks" :key="link.to">
                <router-link :to="link.to" class="group relative inline-block text-white/70 hover:text-white transition-all hover:translate-x-1 text-[0.9375rem]">
                  {{ link.label }}
                  <span class="absolute bottom-[-2px] left-0 h-0.5 w-0 bg-gradient-to-r from-[#DF2DB2] to-[#185CE6] transition-all duration-300 group-hover:w-full"></span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-4">
            <h3 class="text-base font-bold m-0 bg-gradient-to-br from-[#DF2DB2] via-purple-500 to-[#185CE6] bg-clip-text text-transparent">Contacto</h3>
            <ul class="list-none p-0 m-0 flex flex-col gap-4">
              <li class="flex items-center gap-3 text-white/70 text-[0.9375rem]">
                <svg class="w-5 h-5 text-brand-pink flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>jsearch@ccfirma.com</span>
              </li>
              <li class="flex items-start gap-3 text-white/70 text-[0.9375rem]">
                <svg class="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Caro &amp; Asociados Lima — Av. Víctor A. Belaúnde 370, San Isidro 15073</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer bottom -->
      <div class="py-8">
        <div class="flex flex-col items-center gap-2 text-center">
          <p class="text-white/60 text-sm m-0">
            © {{ date }}
            <span class="font-bold bg-gradient-to-br from-[#DF2DB2] via-purple-500 to-[#185CE6] bg-clip-text text-transparent">Juris Search</span>
            • Todos los derechos reservados
          </p>
          <p class="text-white/40 text-[0.8125rem] italic m-0">Desarrollado con pasión para profesionales del derecho</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import logoJuris from "@/assets/img/resources/logo-jurissearch.png";

export default {
  data() {
    return {
      date: new Date().getFullYear(),
      logoJuris,
      navLinks: [
        { to: "/", label: "Inicio" },
        { to: "/noticias", label: "Noticias" },
        { to: "/contacto", label: "Contáctanos" },
      ],
      supportLinks: [
        { to: "/questions", label: "Preguntas Frecuentes" },
        { to: "/politicas&privacidad", label: "Políticas de Privacidad" },
        { to: "/cookies", label: "Políticas de Cookies" },
      ],
    };
  },
};
</script>
