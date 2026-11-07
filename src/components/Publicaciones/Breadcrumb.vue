<template>
  <nav class="flex items-center gap-2 text-sm flex-wrap">
    <template v-for="(crumb, idx) in items" :key="idx">
      <!-- Con enlace siempre se puede volver, aunque sea el último (la categoría de un artículo) -->
      <router-link v-if="crumb.to" :to="crumb.to"
        :class="['no-underline hover:underline', idx === items.length - 1 ? 'font-semibold' : '']"
        :style="{ color: idx === items.length - 1 ? 'var(--text)' : 'var(--text-muted)' }">
        {{ crumb.label }}
      </router-link>
      <span v-else-if="idx === items.length - 1" class="font-semibold" style="color:var(--text)">{{ crumb.label }}</span>
      <span v-else style="color:var(--text-muted)">{{ crumb.label }}</span>
      <svg v-if="idx !== items.length - 1" class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" style="color:var(--text-muted)">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </template>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    items: { type: Array, required: true }, // [{ label, to? }]
  },
};
</script>
