<template>
  <div class="flex flex-col min-h-screen bg-[#f1f5f9] dark:bg-gray-950">
    <navbar />

    <main class="flex-1">

      <!-- Hero -->
      <page-hero
        badge="Inteligencia Artificial"
        title="Política de"
        title-highlight="Inteligencia Artificial"
        subtitle="Conoce cómo utilizamos la Inteligencia Artificial en nuestra plataforma de búsqueda jurídica."
        variant="indigo"
      >
        <template #icon>
          <svg class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
          </svg>
        </template>
      </page-hero>

      <!-- Content -->
      <div class="max-w-[1000px] mx-auto px-4 py-10 max-sm:py-8">
        <article class="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden border border-gray-100 dark:border-gray-700">
          <div class="p-8 max-sm:p-6 max-[480px]:p-4">
            <div class="flex flex-col items-center text-center py-16 gap-3">
              <svg class="w-10 h-10 text-indigo-300 dark:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
              </svg>
              <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Contenido en preparación</h2>
              <p class="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                Estamos redactando la Política de Inteligencia Artificial. Vuelve pronto para conocer los detalles sobre cómo usamos la IA en nuestra plataforma.
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- CTA -->
      <div class="max-w-[1400px] mx-auto px-4 pb-12 max-sm:pb-8">
        <div class="cta-gradient-bg rounded-2xl px-8 py-12 max-sm:px-6 max-sm:py-9 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div class="cta-orb-1 hidden sm:block"/>
          <div class="cta-orb-2 hidden sm:block"/>
          <div class="cta-orb-3 hidden sm:block"/>
          <div class="relative z-10 max-w-[600px] mx-auto">
            <h2 class="text-2xl max-sm:text-xl font-extrabold text-white mb-2">¿Tienes alguna consulta?</h2>
            <p class="text-sm text-white/70 mb-6 leading-relaxed">Contáctanos y resolveremos tus dudas sobre el uso de Inteligencia Artificial en la plataforma.</p>
            <router-link to="/contacto"
              class="group inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold
                     px-8 py-3 rounded-xl text-sm no-underline shadow-lg
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              Contáctanos
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
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
import PageHero from "@/components/Shared/PageHero.vue";

export default {
  name: "PoliticaIA",
  components: { Navbar, FooterComponent, PageHero },
};
</script>
