<template>
  <button
    type="button"
    @click="$emit('click')"
    :disabled="disabled"
    :class="['btn btn-warning whitespace-nowrap font-semibold', sizeClass]"
  >
    <svg :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'EditButton',
  emits: ['click'],
  props: {
    label:    { type: String,  default: 'Editar' },
    disabled: { type: Boolean, default: false    },
    size:     { type: String,  default: 'md'     }, // sm | md | lg
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
