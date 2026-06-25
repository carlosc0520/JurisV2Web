<template>
  <button
    type="button"
    @click="$emit('click')"
    :disabled="disabled || loading"
    :class="['btn btn-danger whitespace-nowrap font-semibold', sizeClass]"
  >
    <span v-if="loading"
      class="inline-block border-2 border-white border-t-transparent rounded-full animate-spin"
      :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
    />
    <svg v-else :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
    {{ loading ? loadingLabel : label }}
  </button>
</template>

<script>
export default {
  name: 'DeleteButton',
  emits: ['click'],
  props: {
    label:        { type: String,  default: 'Eliminar'      },
    loadingLabel: { type: String,  default: 'Eliminando...' },
    loading:      { type: Boolean, default: false           },
    disabled:     { type: Boolean, default: false           },
    size:     { type: String,  default: 'md'       }, // sm | md | lg
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
