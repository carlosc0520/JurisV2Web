<template>
  <div class="tiptap-doc" v-html="html"></div>
</template>

<script>
import { renderPublicHtml } from './tiptap/renderPublicHtml';
import '@/assets/styles/tiptap-blocks.css';

export default {
  name: 'BlockRenderer',
  props: {
    documento: { type: Object, default: null },
  },
  computed: {
    html() { return renderPublicHtml(this.documento); },
  },
};
</script>
