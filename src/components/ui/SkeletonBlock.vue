<!--
  Uso:
    <SkeletonBlock h="20px" w="100%" />
    <SkeletonBlock :circle="true" h="40px" w="40px" />
    <SkeletonBlock class="h-5 w-32 mb-2" />   ← también acepta clases Tailwind
-->
<template>
  <div
    class="skeleton"
    :class="[circle && 'rounded-full', customClass]"
    :style="inlineStyle"
    aria-hidden="true"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  h:      { type: String },   // '20px' | '1.25rem' | etc.
  w:      { type: String },   // '100%' | '8rem' | etc.
  circle: { type: Boolean, default: false },
  class:  { type: String },   // tailwind classes extra
})

defineOptions({ inheritAttrs: false })

const customClass = computed(() => props.class ?? '')

const inlineStyle = computed(() => {
  const s = {}
  if (props.h) s.height = props.h
  if (props.w) s.width  = props.w
  if (props.circle && props.h) s.borderRadius = '9999px'
  return s
})
</script>
