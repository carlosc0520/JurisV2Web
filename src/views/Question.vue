<template>
  <div :class="resumeSection ? '' : 'flex flex-col min-h-screen bg-[#f1f5f9] dark:bg-gray-950'">
    <navbar v-if="!resumeSection" />

    <main class="flex-1">

      <!-- Vista completa -->
      <template v-if="!resumeSection">

        <!-- Hero -->
        <page-hero
          badge="Soporte · 24/7"
          title="Preguntas"
          title-highlight="Frecuentes"
          subtitle="Resuelve tus dudas aquí. Si necesitas más ayuda, no dudes en contactarnos."
          variant="indigo"
        >
          <template #icon>
            <svg class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </template>
        </page-hero>

        <!-- Preguntas -->
        <div class="max-w-[900px] mx-auto px-4 py-8 max-sm:px-3">

          <!-- Loading -->
          <div v-if="loading" class="text-center py-12">
            <div class="w-11 h-11 border-[3px] border-indigo-100 border-t-indigo-500 dark:border-indigo-900 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-3"/>
            <p class="text-gray-500 dark:text-gray-400 text-[0.88rem] font-medium">Cargando preguntas...</p>
          </div>

          <!-- Lista de preguntas -->
          <div v-else class="flex flex-col gap-3 aparecer-r-to-l">
            <div
              v-for="(pregunta, index) in preguntas"
              :key="pregunta.ID"
              class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden
                     shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                     transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            >
              <button
                @click="togglePregunta(pregunta.ID)"
                class="w-full flex justify-between items-center px-5 py-4 border-none cursor-pointer transition-all duration-200 text-left"
                :class="isOpen(pregunta.ID)
                  ? 'bg-indigo-50/70 dark:bg-gray-900/60'
                  : 'bg-transparent hover:bg-gray-50/80 dark:bg-gray-800 dark:hover:bg-gray-900/40'"
              >
                <div class="flex items-center gap-3 flex-1">
                  <div class="min-w-[28px] h-7 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-500 text-white rounded-lg font-bold text-[0.75rem] flex-shrink-0">
                    {{ index + 1 }}
                  </div>
                  <span class="text-[0.85rem] font-semibold text-gray-800 dark:text-gray-100 leading-[1.5]">
                    {{ pregunta?.DESCRIPCION || "" }}
                  </span>
                </div>
                <div
                  class="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0 ml-3 transition-all duration-200"
                  :class="isOpen(pregunta.ID) ? 'bg-gradient-to-br from-indigo-400 to-violet-500' : 'bg-indigo-50 dark:bg-gray-700'"
                >
                  <svg
                    class="w-3.5 h-3.5 transition-transform duration-300"
                    :class="isOpen(pregunta.ID) ? 'text-white rotate-180' : 'text-indigo-400'"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>

              <transition name="slide-fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                <div
                  v-show="isOpen(pregunta.ID)"
                  class="question-answer px-5 pb-5 pt-3 text-gray-600 dark:text-gray-300 leading-[1.65] text-[0.85rem]
                         border-t border-gray-100 dark:border-gray-700"
                  v-html="pregunta?.HTMLTEXT || ''"
                />
              </transition>
            </div>
          </div>

          <!-- CTA -->
          <div class="cta-gradient-bg rounded-2xl mt-8 px-8 py-12 max-sm:px-6 max-sm:py-9 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div class="cta-orb-1 hidden sm:block"/>
            <div class="cta-orb-2 hidden sm:block"/>
            <div class="cta-orb-3 hidden sm:block"/>
            <div class="relative z-10 max-w-[600px] mx-auto">
              <h2 class="text-2xl max-sm:text-xl font-extrabold text-white mb-2">¿Necesitas más ayuda?</h2>
              <p class="text-sm text-white/70 mb-6 leading-relaxed">Contáctanos y con gusto atenderemos tu consulta.</p>
              <router-link to="/contacto"
                class="group inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold
                       px-8 py-3 rounded-xl text-sm no-underline shadow-lg
                       transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                Escríbenos
                <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </router-link>
            </div>
          </div>

        </div>
      </template>

      <!-- Vista resumida (componente embebido) -->
      <section v-if="resumeSection">
        <div class="flex flex-col gap-2 aparecer-r-to-l">
          <div
            v-for="(pregunta, index) in preguntas.slice(0, 3)"
            :key="pregunta.ID"
            class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <button
              @click="togglePregunta(pregunta.ID)"
              class="w-full flex justify-between items-center px-4 py-3.5 cursor-pointer text-left transition-colors duration-200"
              :class="isOpen(pregunta.ID)
                ? 'bg-indigo-50/60 dark:bg-gray-900/60'
                : 'bg-transparent hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-900/40'"
            >
              <div class="flex items-center gap-2.5 flex-1">
                <div class="min-w-[24px] h-6 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-500 text-white rounded-md font-bold text-[0.7rem] flex-shrink-0">
                  {{ index + 1 }}
                </div>
                <span class="text-[0.82rem] font-semibold text-gray-800 dark:text-gray-100 leading-snug">
                  {{ pregunta?.DESCRIPCION || "" }}
                </span>
              </div>
              <svg
                class="w-3.5 h-3.5 flex-shrink-0 ml-2 text-indigo-400 transition-transform duration-200"
                :class="isOpen(pregunta.ID) ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <transition name="slide-fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
              <div
                v-show="isOpen(pregunta.ID)"
                class="question-answer px-4 pb-4 pt-2.5 text-gray-600 dark:text-gray-300 text-[0.82rem] leading-relaxed border-t border-gray-100 dark:border-gray-700"
                v-html="pregunta?.HTMLTEXT || ''"
              />
            </transition>
          </div>
        </div>
      </section>

    </main>

    <footer-component v-if="!resumeSection" />
  </div>
</template>

<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import PageHero from "@/components/Shared/PageHero.vue";
import LoginProxy from "@/proxies/LoginProxy";
import { toast } from 'vue3-toastify';

export default {
  props: {
    resumeSection: Boolean,
  },
  components: { Navbar, FooterComponent, PageHero },
  data() {
    return {
      preguntas: [],
      openPreguntaId: null,
      loading: false,
    };
  },
  methods: {
    async preguntasAll() {
      this.loading = true;
      LoginProxy.listpreguntas({ INIT: 0, ROWS: 100000, DESC: null, CESTDO: 'A' })
        .then((response) => {
          const items = Array.isArray(response) ? response : (response?.DATA ?? response?.data ?? []);
          this.preguntas = items.map(pregunta => ({
            ...pregunta,
            HTMLTEXT: pregunta.HTMLTEXT ? pregunta.HTMLTEXT.replace(/<p><br><\/p>/gi, '') : '',
          }));
        })
        .catch((error) => toast.error(error.message))
        .finally(() => { this.loading = false; });
    },
    togglePregunta(id) {
      this.openPreguntaId = this.openPreguntaId === id ? null : id;
    },
    isOpen(id) { return this.openPreguntaId === id; },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = 'translateX(-20px)';
    },
    enter(el, done) {
      el.offsetHeight;
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = 1;
      el.style.transform = 'translateX(0)';
      done();
    },
    leave(el, done) {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = 0;
      el.style.transform = 'translateX(-20px)';
      done();
    },
  },
  mounted() { this.preguntasAll(); },
};
</script>

<style scoped>
/* Animación de entrada */
.aparecer-r-to-l { animation: aparecer-r-to-l 0.8s ease-out; }
@keyframes aparecer-r-to-l {
  0%   { opacity: 0; transform: translateX(30px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* Vue transitions */
.slide-fade-enter-active,
.slide-fade-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-fade-enter-from,
.slide-fade-leave-to     { opacity: 0; transform: translateY(-10px); }

/* Contenido HTML dinámico de respuestas */
.question-answer :deep(p)  { margin-bottom: 0.75rem; }
.question-answer :deep(ul),
.question-answer :deep(ol) { margin-left: 1.5rem; margin-bottom: 0.75rem; }
.question-answer :deep(li) { margin-bottom: 0.5rem; }
.question-answer :deep(strong) { color: #1F2937; font-weight: 600; }
.dark .question-answer :deep(strong) { color: #f3f4f6; }

/* Resume section */
.content-title-question { font-family: Lato, sans-serif; }
</style>
