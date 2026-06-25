<template>
  <div class="flex flex-col min-h-screen bg-[#f1f5f9] dark:bg-gray-950">
    <navbar />

    <main class="flex-1">

      <!-- ══ CONTENIDO ══ -->
      <div class="max-w-[960px] mx-auto px-4 py-10 max-sm:py-6">

        <!-- Tarjeta Instagram -->
        <div class="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                    border border-gray-200/60 dark:border-gray-700 bg-white dark:bg-gray-800">

          <!-- Header de la tarjeta -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-3.5">
              <!-- Avatar con gradiente Instagram -->
              <div class="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0">
                <div class="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img src="@/assets/img/logos/logo-nav.png" alt="Juris Search"
                    class="w-8 h-8 object-contain"/>
                </div>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white leading-none mb-0.5">juris.search</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Juris Search · Legal &amp; Compliance</p>
              </div>
            </div>

            <!-- Botón seguir -->
            <a href="https://www.instagram.com/juris.search/" target="_blank"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold no-underline
                     text-white bg-gradient-to-r from-pink-500 to-orange-400
                     hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(236,72,153,0.35)]
                     transition-all duration-200">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Seguir
            </a>
          </div>

          <!-- iframe -->
          <div class="relative bg-gray-50 dark:bg-gray-900">
            <!-- Skeleton loader -->
            <div v-if="loading"
              class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-900 z-10">
              <div class="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin"/>
              <p class="text-sm text-gray-400 font-medium">Cargando publicaciones...</p>
            </div>
            <iframe
              src="https://www.instagram.com/juris.search/embed"
              class="w-full border-none block"
              style="height: 800px"
              frameborder="0"
              scrolling="yes"
              allowfullscreen
              loading="lazy"
              @load="loading = false"
            />
          </div>

          <!-- Footer de la tarjeta -->
          <div class="px-6 py-3.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p class="text-xs text-gray-400 dark:text-gray-500">
              Contenido embebido desde Instagram
            </p>
            <a href="https://www.instagram.com/juris.search/" target="_blank"
              class="text-xs font-semibold text-pink-500 hover:text-pink-600 no-underline transition-colors">
              Ver perfil completo →
            </a>
          </div>
        </div>

        <!-- CTA -->
        <div class="cta-gradient-bg rounded-2xl mt-8 px-8 py-12 max-sm:px-6 max-sm:py-9 text-center
                    shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div class="cta-orb-1 hidden sm:block"/>
          <div class="cta-orb-2 hidden sm:block"/>
          <div class="cta-orb-3 hidden sm:block"/>
          <div class="relative z-10 max-w-[600px] mx-auto">
            <h2 class="text-2xl max-sm:text-xl font-extrabold text-white mb-2">
              Descubre el plan que se adapta a ti
            </h2>
            <p class="text-sm text-white/70 mb-6 leading-relaxed">
              Accede a todos los beneficios de JurisSearch
            </p>
            <router-link to="/#mi-seccion-planes"
              class="group inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold
                     px-8 py-3 rounded-xl text-sm no-underline shadow-lg
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              Ver Planes
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </router-link>
          </div>
        </div>

      </div>
    </main>

    <footer-component />
  </div>
</template>

<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";

export default {
  name: "Publicaciones",
  components: { Navbar, FooterComponent },
  data() {
    return { loading: true };
  },
};
</script>
