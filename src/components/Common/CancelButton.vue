<template>
  <button
    type="button"
    @click="$emit('click')"
    :disabled="disabled"
    :class="['btn btn-secondary whitespace-nowrap font-semibold', sizeClass]"
  >
    <svg :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'CancelButton',
  emits: ['click'],
  props: {
    label:    { type: String,  default: 'Cancelar' },
    disabled: { type: Boolean, default: false      },
    size:     { type: String,  default: 'md'       }, // sm | md | lg
  },
  computed: {
    sizeClass() {
      return { sm: 'h-8 px-3 text-xs', md: 'h-9 px-4 text-sm', lg: 'btn-lg' }[this.size] ?? 'h-9 px-4 text-sm';
    },
    iconSize() {
      return this.size === 'sm' ? 12 : this.size === 'lg' ? 16 : 13;
    },
  },
};
</script>
