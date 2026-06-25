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

    <app-select
      :model-value="modelValue"
      :full-width="true"
      :disabled="disabled"
      :class="{ 'select-error': !!error }"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <slot />
    </app-select>

    <p v-if="error" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-muted">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { default: null },
  label:      { type: String },
  required:   { type: Boolean, default: false },
  disabled:   { type: Boolean, default: false },
  error:      { type: String },
  hint:       { type: String },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
:deep(.app-select.select-error) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) !important;
}
</style>
