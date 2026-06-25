<template>
  <section class="relative overflow-hidden">
    <!-- Orbe decorativo sutil -->
    <div
      class="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-[0.08] dark:opacity-[0.04] pointer-events-none"
      :style="{ background: v.orb }"
    />

    <div class="relative z-10 max-w-4xl mx-auto px-6 py-7 max-sm:py-5 text-center">

      <!-- Badge -->
      <div v-if="badge" class="mb-2">
        <span
          class="inline-flex items-center gap-1 text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full border"
          :class="v.badge"
        >
          <span class="w-1 h-1 rounded-full" :class="v.dot" />
          {{ badge }}
        </span>
      </div>

      <!-- Título en una sola línea -->
      <h1 class="text-[1.55rem] max-sm:text-[1.3rem] font-extrabold leading-snug text-gray-900 dark:text-white">
        {{ title }}
        <span v-if="titleHighlight" :style="v.gradient"> {{ titleHighlight }}</span>
      </h1>

      <!-- Subtítulo -->
      <p
        v-if="subtitle"
        class="text-[0.82rem] text-gray-500 dark:text-gray-400 mt-1.5 max-w-xl mx-auto leading-relaxed"
      >
        {{ subtitle }}
      </p>

    </div>
  </section>
</template>

<script>
const G = { WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

const VARIANTS = {
  indigo: {
    orb:    'radial-gradient(circle at center, #6366f1, #4338ca)',
    iconBg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    badge:  'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/40',
    dot:    'bg-indigo-500',
    gradient: { background: 'linear-gradient(135deg, #6366f1, #7c3aed)', ...G },
  },
  pink: {
    orb:    'radial-gradient(circle at center, #e71fb3, #7c3aed)',
    iconBg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    badge:  'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800/40',
    dot:    'bg-pink-500',
    gradient: { background: 'linear-gradient(135deg, #e71fb3, #7c3aed)', ...G },
  },
  amber: {
    orb:    'radial-gradient(circle at center, #f59e0b, #d97706)',
    iconBg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    badge:  'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40',
    dot:    'bg-amber-500',
    gradient: { background: 'linear-gradient(135deg, #f59e0b, #ea580c)', ...G },
  },
  emerald: {
    orb:    'radial-gradient(circle at center, #10b981, #059669)',
    iconBg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    badge:  'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40',
    dot:    'bg-emerald-500',
    gradient: { background: 'linear-gradient(135deg, #10b981, #0891b2)', ...G },
  },
};

export default {
  name: 'PageHero',
  props: {
    badge:          String,
    title:          { type: String, required: true },
    titleHighlight: String,
    subtitle:       String,
    variant:        { type: String, default: 'indigo' },
  },
  computed: {
    v() { return VARIANTS[this.variant] || VARIANTS.indigo; },
  },
};
</script>
