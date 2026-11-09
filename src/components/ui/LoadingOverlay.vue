<template>
  <transition name="lo-fade">
    <div v-if="active" ref="capa" :class="['lo-capa', isFullPage ? 'lo-pagina' : 'lo-seccion']"
      role="status" aria-live="polite" :aria-label="texto">
      <svg class="lo-spinner" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle cx="28" cy="28" r="22" stroke-width="4" style="stroke:var(--border-strong)" />
        <path d="M28 6 a22 22 0 0 1 22 22" stroke-width="4" stroke-linecap="round" style="stroke:var(--brand-pink)" />
      </svg>
    </div>
  </transition>
</template>

<script>
// Indicador de carga sobre una sección, o sobre toda la página con is-full-page.
// Registro, recuperar contraseña y noticias lo usaban con la API de vue-loading-overlay,
// que nunca se instaló: no se veía nada. Acepta las mismas props (loader se ignora).
export default {
  name: 'LoadingOverlay',
  props: {
    active:     { type: Boolean, default: false },
    isFullPage: { type: Boolean, default: true },
    loader:     { type: String, default: null },
    texto:      { type: String, default: 'Cargando' },
  },
  watch: {
    active(v) { if (v) this.$nextTick(this.ubicar); },
  },
  mounted() {
    if (this.active) this.ubicar();
  },
  methods: {
    // Sobre una sección, el contenedor tiene que estar posicionado para que la capa lo cubra
    ubicar() {
      const padre = this.$refs.capa?.parentElement;
      if (!this.isFullPage && padre && getComputedStyle(padre).position === 'static') padre.style.position = 'relative';
    },
  },
};
</script>

<style scoped>
.lo-capa {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.65);
  border-radius: inherit;
  z-index: 20;
}
.dark .lo-capa { background: rgba(15, 23, 42, 0.55); }
.lo-seccion { position: absolute; inset: 0; }
.lo-pagina { position: fixed; inset: 0; z-index: 9999; }
.lo-spinner { width: 44px; height: 44px; animation: lo-girar 0.9s linear infinite; }
@keyframes lo-girar { to { transform: rotate(360deg); } }
.lo-fade-enter-active, .lo-fade-leave-active { transition: opacity 0.15s; }
.lo-fade-enter-from, .lo-fade-leave-to { opacity: 0; }
</style>
