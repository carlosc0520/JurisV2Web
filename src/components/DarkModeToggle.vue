<template>
  <button
    @click="toggleTheme"
    :class="['inline-flex items-center justify-center p-1.5 rounded-lg cursor-pointer select-none transition-colors duration-200 border',
      isDarkMode
        ? 'bg-amber-400 text-gray-900 border-amber-300/40 hover:bg-amber-500'
        : 'bg-[#764ba2] text-white border-transparent hover:bg-[#6a3f96]']"
    :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
  >
    <svg v-if="!isDarkMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
    </svg>
    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
    </svg>
  </button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DarkModeToggle',
  computed: {
    ...mapGetters('theme', ['isDarkMode'])
  },
  methods: {
    ...mapActions('theme', ['toggleDarkMode']),
    toggleTheme() { this.toggleDarkMode(); }
  }
};
</script>
