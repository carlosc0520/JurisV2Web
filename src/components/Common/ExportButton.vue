<template>
  <button
    type="button"
    @click="$emit('click')"
    :disabled="disabled || loading"
    :class="['btn btn-export whitespace-nowrap font-semibold', sizeClass]"
  >
    <span v-if="loading"
      class="inline-block border-2 border-white border-t-transparent rounded-full animate-spin"
      :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
    />
    <svg v-else :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    {{ loading ? loadingLabel : label }}
  </button>
</template>

<script>
export default {
  name: 'ExportButton',
  emits: ['click'],
  props: {
    label:        { type: String,  default: 'Exportar'     },
    loadingLabel: { type: String,  default: 'Exportando...' },
    loading:      { type: Boolean, default: false          },
    disabled:     { type: Boolean, default: false          },
    size:         { type: String,  default: 'md'           }, // sm | md | lg
  },
  computed: {
    sizeClass() {
      return { sm: 'h-8 px-3 text-xs', md: 'h-9 px-4 text-sm', lg: 'btn-lg' }[this.size] ?? 'h-9 px-4 text-sm';
    },
    iconSize() {
      return this.size === 'sm' ? 13 : this.size === 'lg' ? 17 : 14;
    },
  },
};
</script>
