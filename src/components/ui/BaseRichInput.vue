<template>
  <div class="w-full flex flex-col">
    <label v-if="label" class="block text-sm font-medium mb-1.5" style="color:var(--text)">
      {{ label }} <span v-if="required" class="text-brand-pink ml-0.5">*</span>
    </label>

    <div
      class="rounded-lg overflow-hidden"
      :class="error
        ? 'ring-1 ring-red-400 border border-red-400'
        : 'border border-gray-200 dark:border-gray-700'"
      style="border-color: var(--border);"
    >
      <vue-editor
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        class="base-rich-editor"
      />
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs" style="color:var(--text-muted)">{{ hint }}</p>
  </div>
</template>

<script setup>
import { VueEditor } from 'vue3-editor'

defineProps({
  modelValue: { type: String, default: '' },
  label:      { type: String },
  required:   { type: Boolean, default: false },
  error:      { type: String },
  hint:       { type: String },
})
defineEmits(['update:modelValue'])
</script>

<style>
/* Quill toolbar dropdowns need to escape the modal's overflow:hidden */
.base-rich-editor .ql-toolbar {
  position: relative;
  z-index: 60;
  background: var(--bg-card, #fff);
  border-bottom: 1px solid var(--border, #e5e7eb) !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
}

.base-rich-editor .ql-container {
  max-height: 240px;
  overflow-y: auto;
  border: none !important;
  font-size: 0.875rem;
}

.base-rich-editor .ql-editor {
  min-height: 160px;
}

/* Picker dropdowns must float above the modal footer */
.base-rich-editor .ql-picker-options {
  z-index: 9999 !important;
}
</style>
