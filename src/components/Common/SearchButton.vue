<template>
  <button
    type="button"
    @click="$emit('click')"
    :disabled="disabled"
    :class="['btn btn-search whitespace-nowrap font-semibold', sizeClass]"
  >
    <svg :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'SearchButton',
  emits: ['click'],
  props: {
    label:    { type: String,  default: 'Buscar'  },
    disabled: { type: Boolean, default: false     },
    size:     { type: String,  default: 'md'      },
  },
  computed: {
    sizeClass() {
      return { sm: 'h-8 px-3 text-xs', md: 'h-9 px-4 text-sm', lg: 'btn-lg' }[this.size] ?? 'h-9 px-4 text-sm';
    },
    iconSize() {
      return this.size === 'sm' ? 12 : this.size === 'lg' ? 17 : 14;
    },
  },
};
</script>
