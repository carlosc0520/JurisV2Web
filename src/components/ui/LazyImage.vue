<!--
  Carga la imagen solo cuando entra al viewport (IntersectionObserver).
  Muestra skeleton mientras carga y fallback en caso de error.

  Uso:
    <LazyImage
      src="https://..."
      alt="Descripción"
      wrapper-class="h-48 w-full rounded-xl"
      img-class="object-cover w-full h-full"
    />
-->
<template>
  <div ref="containerRef" class="relative overflow-hidden" :class="wrapperClass">

    <!-- Imagen -->
    <Transition
      enter-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <img
        v-if="inView && !hasError"
        :src="src"
        :alt="alt"
        :loading="eager ? 'eager' : 'lazy'"
        :decoding="eager ? 'sync' : 'async'"
        class="w-full h-full"
        :class="[imgClass, imageReady ? 'opacity-100' : 'opacity-0']"
        @load="imageReady = true"
        @error="hasError = true"
      />
    </Transition>

    <!-- Skeleton mientras no ha cargado -->
    <div
      v-if="!imageReady && !hasError"
      class="absolute inset-0 skeleton"
    />

    <!-- Fallback de error -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2"
      style="background-color:var(--bg-overlay); color:var(--text-subtle);"
    >
      <slot name="error">
        <svg class="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs">Sin imagen</span>
      </slot>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  src:          { type: String, required: true },
  alt:          { type: String, default: '' },
  wrapperClass: { type: String },
  imgClass:     { type: String },
  eager:        { type: Boolean, default: false }, // sin lazy loading
  rootMargin:   { type: String, default: '150px' },
})

const containerRef = ref(null)
const inView       = ref(props.eager)
const imageReady   = ref(false)
const hasError     = ref(false)
let observer       = null

// Reset cuando cambia el src
watch(() => props.src, () => {
  imageReady.value = false
  hasError.value   = false
})

onMounted(() => {
  if (props.eager || !('IntersectionObserver' in window)) {
    inView.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        inView.value = true
        observer?.disconnect()
        observer = null
      }
    },
    { rootMargin: props.rootMargin },
  )

  if (containerRef.value) observer.observe(containerRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>
