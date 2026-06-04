<template>
  <button
    @click="toggleTheme"
    class="mr-3" 
    :class="isDarkMode ? 'dark-mode-active' : 'light-mode-active'"
    :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
  >
    <!-- Moon Icon (Dark Mode) -->
    <svg
      v-if="!isDarkMode"
      class="toggle-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
    <!-- Sun Icon (Light Mode) -->
    <svg
      v-else
      class="toggle-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
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
    toggleTheme() {
      this.toggleDarkMode();
    }
  }
};
</script>

<style scoped>
.dark-mode-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.toggle-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

/* Light Mode (muestra luna) */
.light-mode-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.light-mode-active:hover {
  transform: scale(1.05) rotate(-5deg);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
}

.light-mode-active .toggle-icon {
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
}

/* Dark Mode (muestra sol) */
.dark-mode-active {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1f2937;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
  border-color: rgba(251, 191, 36, 0.3);
}

.dark-mode-active:hover {
  transform: scale(1.05) rotate(15deg);
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.6);
  border-color: rgba(251, 191, 36, 0.5);
}

.dark-mode-active .toggle-icon {
  filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.8));
}
</style>
