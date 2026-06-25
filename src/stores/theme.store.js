import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    dark: localStorage.getItem('darkMode') === 'true',
  }),

  getters: {
    isDark: (s) => s.dark,
  },

  actions: {
    init() {
      // Respect OS preference on first visit
      if (localStorage.getItem('darkMode') === null) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.set(prefersDark)
      } else {
        this._syncClass()
      }
    },

    toggle() {
      this.dark = !this.dark
      this._persist()
      this._syncClass()
    },

    set(value) {
      this.dark = Boolean(value)
      this._persist()
      this._syncClass()
    },

    _persist() {
      try { localStorage.setItem('darkMode', String(this.dark)) } catch (e) { /* storage unavailable */ }
    },

    _syncClass() {
      document.documentElement.classList.toggle('dark', this.dark)
    },
  },
})
