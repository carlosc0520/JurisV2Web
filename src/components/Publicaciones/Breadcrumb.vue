<template>
  <nav class="flex items-center gap-2 text-sm flex-wrap">
    <template v-for="(crumb, idx) in items" :key="idx">
      <router-link v-if="crumb.to && idx !== items.length - 1" :to="crumb.to"
        class="no-underline hover:underline" style="color:var(--text-muted)">
        {{ crumb.label }}
      </router-link>
      <span v-else class="font-semibold" style="color:var(--text)">{{ crumb.label }}</span>
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
