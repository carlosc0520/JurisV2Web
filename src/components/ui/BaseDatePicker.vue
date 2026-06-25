<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-medium mb-1.5"
      :class="disabled ? 'text-subtle' : 'text-content'"
    >
      {{ label }}
      <span v-if="required" class="text-brand-pink ml-0.5">*</span>
    </label>

    <date-picker
      ref="dp"
      :value="modelValue"
      :disabled="disabled"
      :disabled-date="disabledDate"
      :placeholder="placeholder"
      value-type="format"
      :format="format"
      :append-to-body="true"
      :class="['input-base', { 'input-error': !!error }]"
      style="width:100%; display:block;"
      @change="v => $emit('update:modelValue', v)"
    />

    <p v-if="error" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs" style="color:var(--text-muted)">{{ hint }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseDatePicker',
  props: {
    modelValue:   { default: null },
    label:        { type: String },
    placeholder:  { type: String, default: 'Seleccionar fecha' },
    format:       { type: String, default: 'YYYY-MM-DD' },
    error:        { type: String },
    hint:         { type: String },
    required:     { type: Boolean, default: false },
    disabled:     { type: Boolean, default: false },
    disabledDate: { type: Function, default: null },
  },
  emits: ['update:modelValue'],
  beforeUnmount() {
    // Cierra el popup si estaba abierto al desmontar (ej: v-if padre cambia a false)
    const dp = this.$refs.dp;
    if (dp && typeof dp.closePopup === 'function') dp.closePopup();
  },
};
</script>

<style scoped>
/* modal-styles.css aplica indigo a .mx-input:focus — lo pisamos con gris
   para que coincida con el focus del input-base del resto del proyecto */
:deep(.mx-input:focus),
:deep(.mx-input:focus-within) {
  border-color: #9ca3af !important;
  box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.25) !important;
  outline: none !important;
}
:global(.dark) :deep(.mx-input:focus) {
  border-color: #6b7280 !important;
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.25) !important;
}
</style>

<style>
/* El popup se appendea al <body> — necesita z-index mayor que el modal (z-50 = 50) */
.mx-datepicker-popup {
  z-index: 9999 !important;
}
</style>
