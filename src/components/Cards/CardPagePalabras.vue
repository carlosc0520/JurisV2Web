<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-soft overflow-hidden">
    <!-- Header -->
    <div class="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style="background:linear-gradient(135deg,#185CE6,#1E40AF)">
        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <h3 class="text-sm font-bold m-0 text-slate-800 dark:text-gray-100">{{ TITLE }}</h3>
    </div>

    <!-- List -->
    <div class="px-4 py-3 flex flex-col divide-y divide-slate-100 dark:divide-gray-800">
      <div v-if="!data || !data.length" class="py-6 text-center text-sm text-slate-400">
        Sin búsquedas registradas
      </div>

      <div v-for="(item, i) in data" :key="item.id || i"
        class="flex items-center gap-3 py-2.5 hover:bg-slate-50 dark:hover:bg-gray-800 -mx-4 px-4 transition-colors rounded-lg">
        <!-- Rank -->
        <span class="text-[11px] font-bold w-5 text-right flex-shrink-0 text-slate-400">
          {{ i + 1 }}.
        </span>
        <!-- Keyword -->
        <span class="flex-1 min-w-0 text-sm font-semibold text-purple-600 truncate" :title="item.LABEL">
          {{ item.LABEL }}
        </span>
        <!-- Count badge -->
        <span class="flex-shrink-0 inline-flex items-center justify-center min-w-[26px] h-[22px] px-1.5
          rounded-lg text-[11px] font-bold text-white"
          style="background:linear-gradient(135deg,#185CE6,#1E40AF)">
          {{ item.VALUE }}
        </span>
        <!-- Time ago -->
        <span class="flex-shrink-0 text-[11px] text-slate-400 w-20 text-right">
          {{ timeAgo(item.FECHA) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardPagePalabras",
  props: {
    data:  Array,
    TITLE: String,
  },
  methods: {
    timeAgo(dateVal) {
      if (!dateVal) return '';
      const date = new Date(dateVal);
      if (isNaN(date.getTime())) return '';
      const diffMs   = Date.now() - date.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffDays === 0)  return 'hoy';
      if (diffDays === 1)  return 'hace 1 día';
      if (diffDays <  7)   return `hace ${diffDays}d`;
      const weeks = Math.floor(diffDays / 7);
      if (weeks < 5)       return `hace ${weeks}s`;
      const months = Math.floor(diffDays / 30);
      if (months < 12)     return `hace ${months}m`;
      return `hace ${Math.floor(diffDays / 365)}a`;
    },
  },
};
</script>
