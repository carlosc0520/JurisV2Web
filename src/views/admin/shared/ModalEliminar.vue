<template>
  <BaseModal v-model="isOpen" size="sm" :hideClose="true" persistent>

    <div class="flex flex-col items-center text-center gap-4 py-2">
      <!-- Icono -->
      <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
        style="background: linear-gradient(135deg, #FFB2B2, #FCA5A5); box-shadow: 0 8px 24px rgba(255,77,77,0.25);">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <!-- Texto -->
      <div>
        <h3 class="text-lg font-bold mb-1" style="color:var(--text)">Estado del registro</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-muted)">{{ message }}</p>
      </div>
    </div>

    <template #footer>
      <CancelButton @click="closeHandler" label="Cancelar" :disabled="loading" />
      <button
        type="button"
        class="btn h-9 px-4 text-sm font-semibold text-white rounded-xl whitespace-nowrap inline-flex items-center gap-2"
        style="background: linear-gradient(135deg,#FF4D4D,#FF1744); box-shadow: 0 4px 12px rgba(255,77,77,0.3);"
        :disabled="loading"
        @click="handleAction"
      >
        <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
        <template v-else>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </template>
        {{ loading ? 'Procesando...' : buttonOk }}
      </button>
    </template>

  </BaseModal>
</template>

<script>
export default {
  name: 'ModalEliminar',
  props: {
    message:      { type: String,   default: '¿Está seguro de cambiar el estado de este registro?' },
    buttonOk:     { type: String,   default: 'Sí, cambiar' },
    action:       { type: Function, required: true },
    closeHandler: { type: Function, default: () => {} },
    openDelete:   { type: Boolean,  default: false },
  },
  data() {
    return { loading: false };
  },
  computed: {
    isOpen: {
      get() { return this.openDelete; },
      set(v) { if (!v) this.closeHandler(); },
    },
  },
  methods: {
    async handleAction() {
      this.loading = true;
      try {
        await this.action();
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
