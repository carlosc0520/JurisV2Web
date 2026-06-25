<template>
  <div class="card p-5">
    <!-- Section header with icon + title -->
    <div v-if="title" class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
      <div v-if="$slots.icon" class="flex-shrink-0 text-brand-blue">
        <slot name="icon" />
      </div>
      <h3 class="text-base font-bold text-gray-800 dark:text-gray-100 m-0">{{ title }}</h3>
      <div v-if="$slots.headerAction" class="ml-auto">
        <slot name="headerAction" />
      </div>
    </div>
    <!-- Body -->
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SectionCard',
  props: {
    title: { type: String, default: null },
  },
}
</script>
