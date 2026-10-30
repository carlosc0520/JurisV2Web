<template>
  <NodeViewWrapper class="bloque-destacado" data-type="destacado">
    <span class="bloque-destacado-label">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      La idea clave
    </span>
    <NodeViewContent class="bloque-destacado-texto" as="div" />
  </NodeViewWrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';

export default {
  name: 'DestacadoNodeView',
  components: { NodeViewWrapper, NodeViewContent },
};
</script>
