<template>
  <component
    :is="resolvedTag"
    v-bind="attrs"
    class="btn"
    :class="[
      sizeClass,
      variantClass,
      { 'w-full': block, 'pointer-events-none opacity-50': disabled || loading },
    ]"
  >
    <!-- Spinner de carga -->
    <span
      v-if="loading"
      class="inline-block shrink-0 w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
    />
    <!-- Icono izquierdo (slot o prop) -->
    <slot name="icon-left" />
    <!-- Contenido principal -->
    <slot />
    <!-- Icono derecho -->
    <slot name="icon-right" />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost | danger | success | outline
  size:    { type: String, default: 'md' },       // xs | sm | md | lg | xl
  tag:     { type: String, default: 'button' },
  type:    { type: String, default: 'button' },
  href:    { type: String, default: undefined },
  to:      { type: [String, Object], default: undefined },
  disabled:{ type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block:   { type: Boolean, default: false },
})

const resolvedTag = computed(() => {
  if (props.to)   return 'router-link'
  if (props.href) return 'a'
  return props.tag
})

const attrs = computed(() => {
  const a = {}
  if (resolvedTag.value === 'button') {
    a.type     = props.type
    a.disabled = props.disabled || props.loading
  }
  if (resolvedTag.value === 'a')           a.href = props.href
  if (resolvedTag.value === 'router-link') a.to   = props.to
  return a
})

const variantClass = computed(() => ({
  primary:  'btn-primary',
  secondary:'btn-secondary',
  ghost:    'btn-ghost',
  danger:   'btn-danger',
  success:  'btn-success',
  outline:  'btn-secondary ring-brand',
}[props.variant] ?? 'btn-primary'))

const sizeClass = computed(() => ({
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
}[props.size] ?? 'btn-md'))
</script>
