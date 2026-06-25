<template>
  <div class="relative flex-1">
    <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input
      v-model="query"
      @input="onInput"
      @keyup.enter="apply"
      type="text"
      :placeholder="placeholder"
      style="padding-left: 2rem"
      class="w-full h-9 pr-8 text-sm rounded-xl border border-slate-200 dark:border-gray-600
             bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200
             placeholder-slate-400 dark:placeholder-gray-500
             focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-400/25
             transition-colors"
    />
    <button v-if="query" @click="clear"
      class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 transition-colors">
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    placeholder: { type: String, default: 'Buscar...' },
    debounce:    { type: Number, default: 350 },
  },
  emits: ['search'],
  data() {
    return {
      query: '',
      timer: null,
    };
  },
  methods: {
    onInput() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.$emit('search', this.query.trim()), this.debounce);
    },
    apply() {
      clearTimeout(this.timer);
      this.$emit('search', this.query.trim());
    },
    clear() {
      this.query = '';
      this.$emit('search', '');
    },
  },
};
</script>
