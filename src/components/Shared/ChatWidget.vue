<template>
  <div class="fixed bottom-6 max-sm:bottom-4 right-3 z-[1000] flex flex-col items-end gap-3">

    <!-- ══ Panel del chat ══ -->
    <transition name="chat-pop">
      <div v-if="isOpen"
           class="w-[340px] max-sm:w-[calc(100vw-20px)] rounded-2xl overflow-hidden bg-white dark:bg-gray-800
                  shadow-[0_20px_60px_rgba(0,0,0,0.16),0_0_0_1px_rgba(0,0,0,0.06)]
                  dark:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]">

        <!-- Header -->
        <div class="bg-gradient-to-r from-[#e71fb3] to-[#1864ff] px-4 py-3 flex items-center gap-3">

          <div class="flex-1 min-w-0">
            <p class="text-white font-bold text-sm leading-tight">JurisSearch</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse flex-shrink-0"/>
              <span class="text-white/80 text-[0.68rem]">En línea · Respondemos rápido</span>
            </div>
          </div>
          <button @click="close"
                  class="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- ── Paso: opciones ── -->
        <div v-if="step === 'options'" class="p-4">
          <!-- Burbuja del bot -->
          <div class="flex items-start gap-2 mb-4">
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-[#e71fb3] to-[#1864ff] flex-shrink-0 flex items-center justify-center mt-0.5">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
              </svg>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/80 rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm">
              <p class="text-gray-700 dark:text-gray-200 text-[0.8rem] leading-relaxed">
                ¡Hola! 👋 Bienvenido/a a <strong>JurisSearch</strong>.<br>
                ¿Cómo deseas comunicarte con nosotros?
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <!-- Opción WhatsApp — visible pero sin acción a pedido (no debe llevar a ningún número) -->
            <button class="group flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left transition-all duration-200
                           bg-[#25D366]/[0.06] hover:bg-[#25D366]/[0.12] border-[#25D366]/25 hover:border-[#25D366]/50 cursor-default">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex-shrink-0 flex items-center justify-center shadow-sm">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-[0.82rem] font-semibold text-gray-800 dark:text-gray-100">Escribir por WhatsApp</p>
                <p class="text-[0.7rem] text-gray-500 dark:text-gray-400">Respuesta en minutos</p>
              </div>
              <svg class="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- Opción Mensaje -->
            <button @click="step = 'form'"
                    class="group flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left transition-all duration-200
                           bg-indigo-50/60 hover:bg-indigo-50 border-indigo-100
                           dark:bg-indigo-900/10 dark:hover:bg-indigo-900/20 dark:border-indigo-800/30">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex-shrink-0 flex items-center justify-center shadow-sm">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-[0.82rem] font-semibold text-gray-800 dark:text-gray-100">Dejar un mensaje</p>
                <p class="text-[0.7rem] text-gray-500 dark:text-gray-400">Respuesta en menos de 24 hs</p>
              </div>
              <svg class="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- ── Paso: formulario ── -->
        <div v-else-if="step === 'form'" class="p-4">
          <button @click="step = 'options'"
                  class="flex items-center gap-1 text-[0.75rem] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-3 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver
          </button>

          <div class="chat-form flex flex-col gap-2">
            <input v-model="modelo.NOMBRES" type="text" placeholder="Tu nombre *" />
            <input v-model="modelo.CORREO"  type="email" placeholder="Tu correo *" />
            <input v-model="modelo.ASUNTO"  type="text" placeholder="Asunto *" />
            <textarea v-model="modelo.MENSAJE" placeholder="Tu mensaje *" rows="3" />
            <button @click="submit" :disabled="isLoading"
                    class="w-full py-2.5 rounded-xl text-sm font-bold text-white
                           bg-gradient-to-r from-indigo-500 to-violet-600
                           hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 flex items-center justify-center gap-2 mt-0.5">
              <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ isLoading ? 'Enviando...' : 'Enviar mensaje' }}
            </button>
          </div>
        </div>

        <!-- ── Paso: enviado ── -->
        <div v-else-if="step === 'sent'" class="p-6 text-center">
          <div class="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-gray-800 dark:text-white mb-1">¡Mensaje enviado!</h3>
          <p class="text-[0.75rem] text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            Gracias por escribirnos. Te responderemos pronto al correo indicado.
          </p>
          <button @click="reset"
                  class="text-[0.78rem] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline transition-colors">
            Enviar otro mensaje
          </button>
        </div>

      </div>
    </transition>

    <!-- ══ Botón flotante ══ -->
    <button @click="toggle"
            class="relative bg-gradient-to-br from-[#e71fb3] to-[#1864ff] rounded-full w-16 h-16 max-sm:w-14 max-sm:h-14
                   flex items-center justify-center
                   shadow-[0_8px_24px_rgba(231,31,179,0.4)] hover:shadow-[0_12px_32px_rgba(231,31,179,0.55)]
                   transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            :class="isOpen ? '' : 'wa-bounce'">
      <transition name="icon-flip" mode="out-in">
        <!-- Cerrar -->
        <svg v-if="isOpen" key="close" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <!-- Chat soporte (burbuja con puntos) -->
        <svg v-else key="chat" class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
        </svg>
      </transition>
      <span v-if="!isOpen" class="absolute inset-0 rounded-full bg-[rgba(231,31,179,0.4)] -z-[1] wa-pulse"/>
    </button>

  </div>
</template>

<script>
import SettingsProxy from '@/proxies/SettingsProxy.js';
import { toast } from 'vue3-toastify';

const WA_NUMBER = '51902430068';

export default {
  name: 'ChatWidget',
  data() {
    return {
      isOpen: false,
      step: 'options',
      isLoading: false,
      modelo: { NOMBRES: null, CORREO: null, ASUNTO: null, MENSAJE: null },
    };
  },
  methods: {
    toggle() { this.isOpen = !this.isOpen; },
    close()  { this.isOpen = false; },

    goWhatsApp() {
      const msg = 'Hola, tengo una consulta sobre JurisSearch.';
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    validate() {
      const { NOMBRES, CORREO, ASUNTO, MENSAJE } = this.modelo;
      if (!NOMBRES?.trim()) { toast.warning('Ingresa tu nombre'); return false; }
      if (!CORREO?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CORREO)) {
        toast.warning('Ingresa un correo válido'); return false;
      }
      if (!ASUNTO?.trim())  { toast.warning('Ingresa el asunto'); return false; }
      if (!MENSAJE?.trim()) { toast.warning('Ingresa tu mensaje'); return false; }
      return true;
    },

    async submit() {
      if (!this.validate()) return;
      this.isLoading = true;
      const tid = toast.loading('Enviando mensaje...');
      await SettingsProxy.create(this.modelo)
        .then(res => {
          if (res?.STATUS) {
            toast.update(tid, { render: '¡Mensaje enviado!', type: 'success', isLoading: false, autoClose: 3000 });
            this.step = 'sent';
          } else {
            toast.update(tid, { render: res?.MESSAGE || 'Error al enviar.', type: 'error', isLoading: false, autoClose: 4000 });
          }
        })
        .catch(() => {
          toast.update(tid, { render: 'No se pudo enviar. Intenta nuevamente.', type: 'error', isLoading: false, autoClose: 4000 });
        })
        .finally(() => { this.isLoading = false; });
    },

    reset() {
      this.step = 'options';
      this.modelo = { NOMBRES: null, CORREO: null, ASUNTO: null, MENSAJE: null };
    },
  },
};
</script>

<style scoped>
/* Popup slide-up */
.chat-pop-enter-active, .chat-pop-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.chat-pop-enter-from, .chat-pop-leave-to       { opacity: 0; transform: translateY(12px) scale(0.97); }

/* Icono flip */
.icon-flip-enter-active, .icon-flip-leave-active { transition: opacity 0.15s, transform 0.15s; }
.icon-flip-enter-from, .icon-flip-leave-to       { opacity: 0; transform: scale(0.6) rotate(20deg); }

/* Animaciones botón */
.wa-bounce { animation: wa-b 2.2s ease-in-out infinite; }
@keyframes wa-b { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
.wa-pulse  { animation: wa-p 2s ease-out infinite; }
@keyframes wa-p { 0% { transform: scale(1); opacity:.6; } 100% { transform: scale(1.55); opacity:0; } }

/* ── Formulario — override de estilos globales de App.vue ── */
.chat-form {
  padding: 0 !important;
}
.chat-form input[type="text"],
.chat-form input[type="email"],
.chat-form textarea {
  width: 100% !important;
  border-radius: 0.75rem !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.8rem !important;
  background-color: #f9fafb !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: none !important;
  margin: 0 !important;
  color: #374151 !important;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.chat-form input:focus,
.chat-form textarea:focus {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 2px rgba(99,102,241,0.15) !important;
}
.chat-form textarea {
  resize: none !important;
  min-height: 72px;
}

/* Dark mode overrides */
:global(.dark) .chat-form input[type="text"],
:global(.dark) .chat-form input[type="email"],
:global(.dark) .chat-form textarea {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
  color: #f3f4f6 !important;
}
:global(.dark) .chat-form input::placeholder,
:global(.dark) .chat-form textarea::placeholder {
  color: #9ca3af !important;
}
</style>
