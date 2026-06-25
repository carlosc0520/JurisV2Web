<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium mb-1.5" style="color:var(--text)">
      {{ label }}
      <span v-if="required" class="text-brand-pink ml-0.5">*</span>
    </label>

    <div :class="['app-tree-select-wrap', { 'app-tree-select-wrap--error': !!error }]">
      <el-tree-select
        v-bind="treeAttrs"
        :model-value="modelValue"
        style="width: 100%"
        @update:model-value="$emit('update:modelValue', $event)"
        @change="$emit('change', $event)"
      />
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
import { computed, useAttrs } from 'vue'

const props = defineProps({
  modelValue: { default: null },
  label:      { type: String },
  required:   { type: Boolean, default: false },
  error:      { type: String },
})

defineEmits(['update:modelValue', 'change'])
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const treeAttrs = computed(() => {
  const isMultiple = 'multiple' in attrs
  return {
    renderAfterExpand: false,
    placeholder:       'Seleccione una opción',
    noDataText:        'No hay opciones disponibles',
    checkStrictly:     true,
    checkOnClickNode:  true,
    filterable:        true,
    clearable:         true,
    // Al ser múltiple, activa checkboxes y colapsa tags por defecto
    ...(isMultiple ? { showCheckbox: true, collapseTags: true, maxCollapseTags: 1 } : {}),
    ...attrs,
  }
})
</script>

<style scoped>
:deep(.el-select__selected-item.el-select__placeholder span){
  padding: 0.25rem 0.75rem !important;
}
/* ── Wrapper principal ─────────────────────────────────────────── */
:deep(.el-select__wrapper) {
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 10px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06) !important;
  background: white !important;
  min-height: 42px !important;
  padding: 6px 10px !important;
  transition: border-color 0.2s, box-shadow 0.2s !important;
}
:deep(.el-select__wrapper:hover) {
  border-color: #cbd5e1 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08) !important;
}
:deep(.el-select__wrapper.is-focused) {
  border-color: #9ca3af !important;
  box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.25) !important;
}

/* ── El input de búsqueda interno (filterable) no debe tener borde ── */
:deep(.el-select__wrapper .el-input__wrapper),
:deep(.el-select__wrapper .el-input__wrapper:hover),
:deep(.el-select__wrapper .el-input__wrapper.is-focus) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  min-height: unset !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

/* ── Elementos internos: sin borde ni fondo propio ─────────────── */
:deep(.el-select__selected-item),
:deep(.el-select__input-wrapper),
:deep(.el-input__inner) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  outline: none !important;
  margin: 0 !important;
}

/* ── Input de búsqueda interno: anula los estilos globales de modal-styles.css ── */
:deep(.el-select__input) {
  font-size: 0.875rem !important;
  color: #1e293b !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  background-color: transparent !important;
  width: auto !important;
  min-width: 4px !important;
  transform: none !important;
}
:deep(.el-select__input:hover),
:deep(.el-select__input:focus) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-color: transparent !important;
  transform: none !important;
}
:deep(.el-input__inner) {
  font-size: 0.875rem !important;
  color: #1e293b !important;
  padding: 0 !important;
}
:deep(.el-select__placeholder span),
:deep(.el-input__placeholder) {
  color: #94a3b8 !important;
  font-size: 0.875rem !important;
  padding: 0 !important;
}

/* ── Estado error ─────────────────────────────────────────────── */
.app-tree-select-wrap--error :deep(.el-select__wrapper) {
  border-color: #ef4444 !important;
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.1) !important;
}
.app-tree-select-wrap--error :deep(.el-select__wrapper:hover),
.app-tree-select-wrap--error :deep(.el-select__wrapper.is-focused) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

/* ── Dark mode ────────────────────────────────────────────────── */
:global(.dark) :deep(.el-select__wrapper) {
  background: #0f172a !important;
  border-color: #374151 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}
:global(.dark) :deep(.el-select__wrapper.is-focused) {
  border-color: #6b7280 !important;
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.25) !important;
}
:global(.dark) :deep(.el-select__input),
:global(.dark) :deep(.el-input__inner) {
  color: #e2e8f0 !important;
}
</style>
