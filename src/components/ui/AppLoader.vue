<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        role="status"
        :aria-label="text"
      >
        <div
          class="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl shadow-modal"
          style="background-color:var(--bg-card); border:1px solid var(--border);"
        >
          <!-- Animated spinner with brand gradient -->
          <div class="relative w-14 h-14">
            <div class="absolute inset-0 rounded-full opacity-20 animate-ping"
              style="background: var(--brand-gradient);" />
            <svg class="relative w-14 h-14 animate-spin" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="22" stroke-width="4"
                style="stroke:var(--border-strong);" />
              <path d="M28 6 a22 22 0 0 1 22 22" stroke-width="4" stroke-linecap="round"
                style="stroke:var(--brand-pink);" />
            </svg>
          </div>
          <p class="text-sm font-medium" style="color:var(--text-muted);">{{ text }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  text: { type: String, default: 'Cargando...' },
})
</script>
