<template>
  <div class="flex flex-col min-h-screen bg-[#f1f5f9] dark:bg-gray-950">
    <navbar />

    <main class="flex-1">

      <!-- Hero -->
      <page-hero badge="Privacidad · Navegación" title="Política de" title-highlight="Cookies"
        subtitle="Conoce cómo utilizamos las cookies para mejorar tu experiencia de navegación en nuestra plataforma."
        variant="indigo">
        <template #icon>
          <svg class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </template>
      </page-hero>

      <!-- Content -->
      <div class="max-w-[1400px] mx-auto px-4 py-10 max-sm:py-8">
        <div class="grid grid-cols-[260px_1fr] max-lg:grid-cols-1 gap-8 items-start">

          <!-- Sidebar -->
          <aside class="relative">
            <div
              class="sticky top-[100px] max-lg:relative max-lg:top-0 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-700">
              <h3
                class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                Navegación Rápida</h3>
              <nav class="flex flex-col gap-1.5">
                <a v-for="item in navItems" :key="item.href" :href="item.href" class="flex items-center justify-between px-3 py-2.5 rounded-xl text-[0.82rem] font-medium
                         text-gray-600 dark:text-gray-300 no-underline
                         hover:bg-amber-50 hover:text-amber-700
                         dark:hover:bg-amber-900/20 dark:hover:text-amber-300
                         transition-all duration-200">
                  <span>{{ item.label }}</span>
                  <svg class="w-3.5 h-3.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </a>
              </nav>
            </div>
          </aside>

          <!-- Artículo -->
          <article
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden border border-gray-100 dark:border-gray-700">
            <div class="p-8 max-sm:p-6 max-[480px]:p-4">

              <!-- Intro card -->
              <div
                class="bg-amber-50/60 dark:bg-gray-900 p-5 rounded-xl border border-amber-100 dark:border-gray-700 mb-8">
                <h2 class="text-[1.1rem] font-bold text-amber-700 dark:text-amber-300 mb-2.5">Política de Cookies</h2>
                <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-3">
                  A continuación, se informa sobre la Política de Cookies utilizada por parte de <span
                    class="text-amber-600 dark:text-amber-300 font-semibold">JURIS SEARCH PENAL &amp; COMPLIANCE</span>
                  (en
                  adelante "Juris Search"), con domicilio legal ubicado en la Avenida Víctor Andrés Belaunde Nro. 370,
                  San
                  Isidro.
                </p>
                <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75]">
                  Al acceder a nuestro sitio web o suscribirse a nuestros servicios online acepta haber leído y prestado
                  su
                  consentimiento de forma informada, libre, previa, expresa e inequívoca. Asimismo, la Política de
                  Cookies de
                  Juris Search puede actualizarse en cualquier momento en cuyo caso se le informará y se publicará la
                  versión
                  actualizada en el presente sitio web.
                </p>
              </div>

              <h3 id="why"
                class="text-[1.1rem] font-bold text-amber-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">
                ¿Qué son las cookies y para qué las usamos?
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-6">
                Una cookie es un archivo que envía su ordenador, celular o tablet al navegador web para almacenar
                información
                sobre su navegación. Nuestro sitio web usa Cookies para recolectar información sobre su interacción con
                el
                sitio web a fin de mejorar su experiencia de navegación y poder realizar analítica sobre las visitas a
                la web.
              </p>

              <h3 id="types"
                class="text-[1.1rem] font-bold text-amber-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">
                ¿Qué tipo de cookies utilizamos?
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">
                Usamos cookies propias y de terceros. A continuación, se detalla el tipo de cookie utilizadas, así como
                la
                función que cumple:
              </p>
              <ul class="flex flex-col gap-2.5 list-none m-0 p-0">
                <li v-for="item in cookiesTypes" :key="item.title"
                  class="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 px-5 flex items-start gap-3 transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 hover:shadow-sm">
                  <svg class="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <div class="flex-1 text-gray-600 dark:text-gray-300 leading-[1.7] text-[0.85rem]">
                    <span class="font-bold text-amber-600 dark:text-amber-300">{{ item.title }}:</span>
                    {{ item.desc }}
                  </div>
                </li>
              </ul>

            </div>
          </article>
        </div>
      </div>

      <!-- CTA -->
      <div class="max-w-[1400px] mx-auto px-4 pb-12 max-sm:pb-8">
        <div
          class="cta-gradient-bg rounded-2xl px-8 py-12 max-sm:px-6 max-sm:py-9 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div class="cta-orb-1 hidden sm:block" />
          <div class="cta-orb-2 hidden sm:block" />
          <div class="cta-orb-3 hidden sm:block" />
          <div class="relative z-10 max-w-[600px] mx-auto">
            <h2 class="text-2xl max-sm:text-xl font-extrabold text-white mb-2">¿Tienes alguna duda?</h2>
            <p class="text-sm text-white/70 mb-6 leading-relaxed">Contáctanos y resolveremos cualquier consulta sobre el
              uso
              de cookies.</p>
            <router-link to="/contacto" class="group inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold
                     px-8 py-3 rounded-xl text-sm no-underline shadow-lg
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              Contáctanos
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none"
                stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
import PageHero from "@/components/Shared/PageHero.vue";

export default {
  components: { Navbar, FooterComponent, PageHero },
  data() {
    return {
      navItems: [
        { href: '#why', label: '¿Qué son las cookies?' },
        { href: '#types', label: 'Tipos de cookies' },
      ],
      cookiesTypes: [
        { title: 'Cookies técnicas', desc: 'Permiten la navegación y el uso de las diferentes opciones o servicios que existen en la web.' },
        { title: 'Cookies de análisis', desc: 'Permiten el seguimiento y análisis del comportamiento de los usuarios en el sitio web.' },
        { title: 'Cookies de personalización', desc: 'Permiten acceder al servicio con algunas características de carácter general predefinidas.' },
      ],
    };
  },
};
</script>
