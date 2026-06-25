<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium mb-1.5" style="color:var(--text)">
      {{ label }}
      <span v-if="required" class="text-brand-pink ml-0.5">*</span>
    </label>

    <div :class="['app-autocomplete-wrap', { 'app-autocomplete-wrap--error': !!error }]">
      <el-autocomplete
        v-bind="$attrs"
        :model-value="modelValue"
        popper-class="app-autocomplete-panel"
        style="width:100%"
        @update:model-value="$emit('update:modelValue', $event)"
        @select="$emit('select', $event)"
      >
        <template v-if="$slots.default" #default="slotProps">
          <slot :item="slotProps.item" />
        </template>
      </el-autocomplete>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { default: '' },
  label:      { type: String },
  required:   { type: Boolean, default: false },
  error:      { type: String },
})

defineEmits(['update:modelValue', 'select'])
defineOptions({ inheritAttrs: false })
</script>

<style scoped>
/* ── Wrapper principal ─────────────────────────────────────────── */
:deep(.el-input__wrapper) {
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 10px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06) !important;
  background: white !important;
  min-height: 42px !important;
  padding: 6px 12px !important;
  transition: border-color 0.2s, box-shadow 0.2s !important;
}
:deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08) !important;
}
:deep(.el-input__wrapper.is-focus) {
  border-color: #9ca3af !important;
  box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.25) !important;
}

/* ── Input interno: anula estilos globales de modal-styles.css ── */
:deep(.el-input__inner) {
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  background-color: transparent !important;
  padding: 0 !important;
  width: 100% !important;
  min-height: unset !important;
  font-size: 0.875rem !important;
  color: #1e293b !important;
  transform: none !important;
}
:deep(.el-input__inner:hover),
:deep(.el-input__inner:focus) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-color: transparent !important;
  transform: none !important;
}
:deep(.el-input__inner::placeholder) {
  color: #94a3b8 !important;
  font-size: 0.875rem !important;
}

/* ── Estado error ─────────────────────────────────────────────── */
.app-autocomplete-wrap--error :deep(.el-input__wrapper) {
  border-color: #ef4444 !important;
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.1) !important;
}
.app-autocomplete-wrap--error :deep(.el-input__wrapper:hover),
.app-autocomplete-wrap--error :deep(.el-input__wrapper.is-focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

/* ── Dark mode ────────────────────────────────────────────────── */
:global(.dark) :deep(.el-input__wrapper) {
  background: #0f172a !important;
  border-color: #374151 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}
:global(.dark) :deep(.el-input__wrapper.is-focus) {
  border-color: #6b7280 !important;
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.25) !important;
}
:global(.dark) :deep(.el-input__inner) {
  color: #e2e8f0 !important;
}

/* ── Panel dropdown: teleportado al body, requiere :global ─────── */
:global(.app-autocomplete-panel) {
  max-width: min(680px, calc(100vw - 48px)) !important;
  width: max-content !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
  border-radius: 10px !important;
  border: 1px solid #e2e8f0 !important;
  overflow: hidden !important;
}
:global(.app-autocomplete-panel .el-autocomplete-suggestion__list li) {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  word-break: break-word !important;
  font-size: 0.875rem !important;
  padding: 8px 14px !important;
  color: #1e293b !important;
  line-height: 1.4 !important;
}
:global(.app-autocomplete-panel .el-autocomplete-suggestion__list li:hover) {
  background: #f1f5f9 !important;
}
:global(.dark .app-autocomplete-panel) {
  background: #1e293b !important;
  border-color: #374151 !important;
}
:global(.dark .app-autocomplete-panel .el-autocomplete-suggestion__list li) {
  color: #e2e8f0 !important;
}
:global(.dark .app-autocomplete-panel .el-autocomplete-suggestion__list li:hover) {
  background: #334155 !important;
}
</style>
