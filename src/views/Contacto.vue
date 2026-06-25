<template>
  <div class="flex flex-col min-h-screen bg-[#f1f5f9] dark:bg-gray-950">
    <navbar />

    <main class="flex-1">



      <!-- ══ CONTENIDO ══ -->
      <div class="max-w-[1060px] mx-auto px-4 py-10 max-sm:py-6">

        <!-- Tarjeta principal split -->
        <div class="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                    border border-gray-200/60 dark:border-gray-700">
          <div class="grid lg:grid-cols-[320px_1fr]">

            <!-- ─ Sidebar claro ─ -->
            <aside class="flex flex-col gap-6 p-8 max-sm:p-6
                          bg-[#f8fafc] dark:bg-gray-900
                          border-r border-gray-100 dark:border-gray-700">

              <!-- Encabezado -->
              <div>
                <p class="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-indigo-500 dark:text-indigo-400 mb-2">Contacto</p>
                <h2 class="text-xl font-extrabold text-gray-900 dark:text-white leading-snug mb-2">
                  Información de contacto
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Elige el canal que prefieras o usa el formulario.
                </p>
              </div>

              <!-- Info cards -->
              <div class="flex flex-col gap-3">
                <a v-for="item in contactItems" :key="item.label"
                  :href="item.href" target="_blank"
                  class="group flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-gray-800
                         border border-gray-100 dark:border-gray-700
                         shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                         hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(99,102,241,0.1)]
                         hover:border-indigo-100 dark:hover:border-indigo-700
                         transition-all duration-200 no-underline">
                  <div class="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center
                              bg-gradient-to-br from-blue-50 to-indigo-100
                              dark:from-indigo-900/40 dark:to-indigo-800/40">
                    <svg class="w-[17px] h-[17px] text-indigo-500 dark:text-indigo-400"
                      fill="none" stroke="currentColor" stroke-width="1.8"
                      viewBox="0 0 24 24" v-html="item.icon"/>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[0.68rem] font-bold uppercase tracking-wide text-indigo-500 dark:text-indigo-400 mb-0.5">{{ item.label }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300 truncate m-0">{{ item.value }}</p>
                  </div>
                </a>
              </div>

              <!-- Separador -->
              <div class="h-px bg-gray-200 dark:bg-gray-700"/>

              <!-- Features -->
              <ul class="flex flex-col gap-2.5">
                <li v-for="feat in features" :key="feat"
                  class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <span class="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/40
                               flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-indigo-500 dark:text-indigo-400"
                      fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  {{ feat }}
                </li>
              </ul>
            </aside>

            <!-- ─ Formulario ─ -->
            <section class="bg-white dark:bg-gray-800 p-8 max-sm:p-6 flex flex-col">
              <div class="mb-6">
                <h3 class="text-lg font-extrabold text-gray-900 dark:text-white mb-1">
                  Envíanos un mensaje
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Todos los campos marcados con <span class="text-indigo-500 font-semibold">*</span> son obligatorios.
                </p>
              </div>

              <form @submit.prevent="submit" class="flex flex-col gap-4 flex-1">

                <!-- Nombre + Correo -->
                <div class="grid sm:grid-cols-2 gap-4">
                  <div class="field-group">
                    <label class="field-label">Nombre y apellidos <span class="text-indigo-500">*</span></label>
                    <input v-model="modelo.NOMBRES" type="text"
                      placeholder="Tu nombre completo"
                      :class="['field-input', validation.hasError('modelo.NOMBRES') && 'field-input--err']"
                      maxlength="200"/>
                    <span v-if="validation.hasError('modelo.NOMBRES')" class="field-err">
                      {{ validation.firstError('modelo.NOMBRES') }}
                    </span>
                  </div>
                  <div class="field-group">
                    <label class="field-label">Correo electrónico <span class="text-indigo-500">*</span></label>
                    <input v-model="modelo.CORREO" type="email"
                      placeholder="correo@ejemplo.com"
                      :class="['field-input', validation.hasError('modelo.CORREO') && 'field-input--err']"
                      maxlength="100"/>
                    <span v-if="validation.hasError('modelo.CORREO')" class="field-err">
                      {{ validation.firstError('modelo.CORREO') }}
                    </span>
                  </div>
                </div>

                <!-- Motivo -->
                <div class="field-group">
                  <label class="field-label">Motivo <span class="text-indigo-500">*</span></label>
                  <input v-model="modelo.ASUNTO" type="text"
                    placeholder="¿En qué podemos ayudarte?"
                    :class="['field-input', validation.hasError('modelo.ASUNTO') && 'field-input--err']"
                    maxlength="100"/>
                  <span v-if="validation.hasError('modelo.ASUNTO')" class="field-err">
                    {{ validation.firstError('modelo.ASUNTO') }}
                  </span>
                </div>

                <!-- Mensaje -->
                <div class="field-group flex-1 flex flex-col">
                  <label class="field-label">Mensaje <span class="text-indigo-500">*</span></label>
                  <textarea v-model="modelo.MENSAJE"
                    placeholder="Escribe aquí tu consulta o mensaje..."
                    :class="['field-input field-textarea', validation.hasError('modelo.MENSAJE') && 'field-input--err']"
                    maxlength="1000"/>
                  <div class="flex items-center justify-between mt-1">
                    <span v-if="validation.hasError('modelo.MENSAJE')" class="field-err">
                      {{ validation.firstError('modelo.MENSAJE') }}
                    </span>
                    <span v-else class="text-xs text-gray-400"/>
                    <span class="text-xs text-gray-400 ml-auto">
                      {{ (modelo.MENSAJE || '').length }}/1000
                    </span>
                  </div>
                </div>

                <!-- Aviso -->
                <p class="text-xs text-gray-400 dark:text-gray-500">
                  Al enviar este formulario, aceptas nuestra
                  <router-link to="/politicas&privacidad" class="text-indigo-500 hover:text-indigo-600 no-underline">política de privacidad</router-link>.
                </p>

                <!-- Botón -->
                <button type="submit" :disabled="isLoading" class="submit-btn">
                  <template v-if="isLoading">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Enviando mensaje...
                  </template>
                  <template v-else>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Enviar Mensaje
                  </template>
                </button>

              </form>
            </section>

          </div>
        </div>

        <!-- ══ CTA ══ -->
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
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';
import SettingsProxy from "@/proxies/SettingsProxy.js";

export default {
  components: { Navbar, FooterComponent },
  data() {
    return {
      contactItems: [
        {
          label: 'Email',
          value: 'jsearch@ccfirma.com',
          href: 'mailto:jsearch@ccfirma.com',
          icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
        },
        {
          label: 'Formulario',
          value: 'Respuesta en menos de 24 hs',
          href: '#',
          icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
        },
        {
          label: 'Plataforma',
          value: 'jurissearch.com',
          href: process.env.VUE_APP_SITE_URL || 'https://jurissearch.com',
          icon: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>',
        },
      ],
      features: [
        'Respuesta rápida y personalizada',
        'Equipo especializado en derecho',
        'Soporte técnico incluido',
      ],
      modelo: { NOMBRES: null, CORREO: null, ASUNTO: null, MENSAJE: null },
      isLoading: false,
    };
  },
  validators: {
    'modelo.NOMBRES': v => Validator.value(v).required('Campo requerido'),
    'modelo.CORREO':  v => Validator.value(v).required('Campo requerido').email('Correo no válido'),
    'modelo.ASUNTO':  v => Validator.value(v).required('Campo requerido'),
    'modelo.MENSAJE': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    async submit() {
      const valid = await this.$validate();
      if (!valid) return;

      this.isLoading = true;
      const tid = toast.loading('Enviando mensaje...');

      await SettingsProxy.create(this.modelo)
        .then(res => {
          if (res?.STATUS) {
            this.modelo = { NOMBRES: null, CORREO: null, ASUNTO: null, MENSAJE: null };
            this.validation.reset();
            toast.update(tid, {
              render: '¡Mensaje enviado! Te responderemos pronto.',
              type: 'success', isLoading: false, autoClose: 4000,
            });
          } else {
            toast.update(tid, {
              render: res?.MESSAGE || 'Error al enviar el mensaje.',
              type: 'error', isLoading: false, autoClose: 4000,
            });
          }
        })
        .catch(() => {
          toast.update(tid, {
            render: 'No se pudo enviar el mensaje. Intenta nuevamente.',
            type: 'error', isLoading: false, autoClose: 4000,
          });
        })
        .finally(() => { this.isLoading = false; });
    },
  },
};
</script>

<style scoped>
/* ── Sidebar dot pattern ── */
.sidebar-dots {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: radial-gradient(circle, #fff 1.5px, transparent 1.5px);
  background-size: 40px 40px;
}

/* ── Field ── */
.field-group { display: flex; flex-direction: column; gap: 0.25rem; }

.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4B5563;
}
.dark .field-label { color: #9CA3AF; }

.field-input {
  width: 100%;
  padding: 0.62rem 0.9rem;
  font-size: 0.85rem;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  background: #FAFAFA;
  color: #111827;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}
.field-input:hover  { border-color: #D1D5DB; background: #fff; }
.field-input:focus  {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
}
.field-input--err   {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
}
.field-textarea {
  min-height: 130px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
  flex: 1;
}
.field-err {
  font-size: 0.72rem;
  color: #EF4444;
  font-weight: 500;
}

.dark .field-input  { background: #1F2937; color: #F9FAFB; border-color: #374151; }
.dark .field-input:hover { background: #1F2937; border-color: #4B5563; }
.dark .field-input:focus { background: #111827; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
.dark .field-input::placeholder { color: #6B7280; }

/* ── Submit ── */
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 8px 24px rgba(79,70,229,0.35);
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(79,70,229,0.45);
}
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
</style>
