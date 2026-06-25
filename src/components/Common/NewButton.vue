<template>
  <button
    type="button"
    @click="$emit('click')"
    class="btn btn-create h-9 px-4 text-sm font-semibold whitespace-nowrap">
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'NewButton',
  emits: ['click'],
  props: {
    label: { type: String, default: 'Nuevo' },
  },
};
</script>
