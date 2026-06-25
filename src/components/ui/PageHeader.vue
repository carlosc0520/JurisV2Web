<template>
  <span v-if="false" />
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title:    { type: String, required: true },
    subtitle: { type: String, default: null },
    spinning: { type: Boolean, default: false },
  },
};
</script>
