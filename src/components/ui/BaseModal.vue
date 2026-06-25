<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="relative z-50" @close="onClose">

      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-150 ease-in"  leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />
      </TransitionChild>

      <!-- Scroll container -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-end sm:items-center justify-center p-3 sm:p-4">

          <!-- Panel -->
          <TransitionChild
            as="template"
            enter="duration-200 ease-out"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="duration-150 ease-in"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-2 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full shadow-modal border overflow-hidden"
              :class="[sizeClass, 'rounded-2xl sm:rounded-2xl rounded-t-2xl', 'bg-surface border-surface']"
              style="background-color:var(--bg-card); border-color:var(--border);"
            >

              <!-- Header -->
              <div
                v-if="title || $slots.header || !hideClose"
                class="flex items-center justify-between px-5 py-4"
                style="border-bottom: 1px solid var(--border);"
              >
                <slot name="header">
                  <DialogTitle
                    v-if="title"
                    as="h3"
                    class="text-base font-semibold"
                    style="color:var(--text);"
                  >
                    {{ title }}
                  </DialogTitle>
                  <span v-else />
                </slot>

                <button
                  v-if="!hideClose"
                  type="button"
                  class="p-1.5 rounded-lg transition-all duration-150"
                  style="color:var(--text-muted);"
                  @mouseenter="($event.target.style.backgroundColor = 'var(--bg-overlay)')"
                  @mouseleave="($event.target.style.backgroundColor = '')"
                  @click="forceClose"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div :class="bodyPadding ?? 'px-5 py-5'">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="px-5 py-4 flex flex-wrap items-center justify-end gap-3"
                style="border-top: 1px solid var(--border); background-color: var(--bg-raised);"
              >
                <slot name="footer" />
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed } from 'vue'
import {
  TransitionRoot, TransitionChild,
  Dialog, DialogPanel, DialogTitle,
} from '@headlessui/vue'

const props = defineProps({
  modelValue:  { type: Boolean, default: false },
  title:       { type: String },
  size:        { type: String, default: 'md' }, // xs | sm | md | lg | xl | 2xl | full
  persistent:  { type: Boolean, default: false },
  hideClose:   { type: Boolean, default: false },
  bodyPadding: { type: String },
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeClass = computed(() => ({
  xs:   'max-w-xs',
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  '2xl':'max-w-6xl',
  full: 'max-w-full mx-2',
}[props.size] ?? 'max-w-lg'))

function onClose() {
  if (props.persistent) return
  emit('update:modelValue', false)
  emit('close')
}

function forceClose() {
  emit('update:modelValue', false)
  emit('close')
}
</script>
