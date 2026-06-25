<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium mb-1.5" style="color:var(--text)">
      {{ label }} <span v-if="required" class="text-brand-pink ml-0.5">*</span>
    </label>

    <div
      class="rounded-xl px-2 py-1.5 flex flex-wrap gap-1.5 min-h-[42px] cursor-text transition-[border-color,box-shadow]"
      :class="error ? 'border border-red-400 ring-2 ring-red-200' : 'border focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-400/25'"
      style="border-color: var(--border);"
    >
      <span v-for="(tag, i) in modelValue" :key="i"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
        {{ tag }}
        <button type="button" @click.prevent="remove(i)"
          class="hover:text-red-500 leading-none ml-0.5 transition-colors">×</button>
      </span>
      <input type="text"
        class="flex-1 min-w-[100px] text-sm outline-none bg-transparent"
        :placeholder="modelValue?.length ? '' : (placeholder || 'Escribe y presiona Enter o coma...')"
        @keydown="onKeydown"
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
const props = defineProps({
  modelValue:  { type: Array,   default: () => [] },
  label:       { type: String },
  placeholder: { type: String },
  required:    { type: Boolean, default: false },
  error:       { type: String },
  hint:        { type: String },
})

const emit = defineEmits(['update:modelValue'])

function remove(i) {
  const next = [...props.modelValue]
  next.splice(i, 1)
  emit('update:modelValue', next)
}

function onKeydown(e) {
  if (e.key !== 'Enter' && e.key !== ',') return
  e.preventDefault()
  const val = (e.target.value || '').trim()
  if (val && !props.modelValue.includes(val)) {
    emit('update:modelValue', [...props.modelValue, val])
  }
  e.target.value = ''
}
</script>

<style scoped>
/* Anula los estilos globales de modal-styles.css para input[type="text"] */
input[type="text"] {
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  background-color: transparent !important;
  padding: 0 !important;
  width: auto !important;
  transform: none !important;
}
input[type="text"]:hover,
input[type="text"]:focus {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-color: transparent !important;
  transform: none !important;
}
</style>
