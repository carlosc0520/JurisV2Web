<template>
  <button
    :type="nativeType"
    @click="$emit('click')"
    :disabled="disabled || loading"
    :class="['btn btn-primary whitespace-nowrap font-semibold', sizeClass]"
  >
    <span v-if="loading"
      class="inline-block border-2 border-white border-t-transparent rounded-full animate-spin"
      :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
    />
    <svg v-else :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
    {{ loading ? loadingLabel : label }}
  </button>
</template>

<script>
export default {
  name: 'SaveButton',
  emits: ['click'],
  props: {
    label:        { type: String,  default: 'Guardar'      },
    loadingLabel: { type: String,  default: 'Guardando...' },
    loading:      { type: Boolean, default: false          },
    disabled:     { type: Boolean, default: false          },
    nativeType:   { type: String,  default: 'submit'       },
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
