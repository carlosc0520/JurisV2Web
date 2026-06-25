<template>
  <select
    :value="modelValue"
    @change="onChange"
    :class="['app-select', { 'app-select--full': fullWidth }]"
  >
    <slot />
  </select>
</template>

<script>
export default {
  name: 'AppSelect',
  emits: ['update:modelValue'],
  props: {
    modelValue: { default: null },
    fullWidth: { type: Boolean, default: false },
  },
  methods: {
    onChange(e) {
      const v = e.target.value;
      this.$emit('update:modelValue', v === '' || v === 'null' ? null : v);
    },
  },
};
</script>

<style scoped>
.app-select {
  height: 2.25rem !important;
  padding-left:  0.75rem !important;
  padding-right: 2.25rem !important;
  padding-top:    0 !important;
  padding-bottom: 0 !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  border-radius: 0.75rem !important;
  border: 1px solid #e2e8f0 !important;
  background-color: #ffffff !important;
  color: #334155 !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  cursor: pointer !important;
  min-width: 9rem !important;
  width: auto !important;
  transition: border-color 0.15s, box-shadow 0.15s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 0.6rem center !important;
  background-size: 1rem 1rem !important;
}

.app-select--full {
  width: 100% !important;
  min-width: 0 !important;
}

.app-select:focus {
  outline: none;
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.2);
}

/* Dark mode */
:global(.dark) .app-select {
  border-color: #4b5563;
  background-color: #1f2937;
  color: #e5e7eb;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
}
:global(.dark) .app-select:focus {
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.2);
}
</style>
