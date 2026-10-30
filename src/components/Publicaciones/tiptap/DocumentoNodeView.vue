<template>
  <NodeViewWrapper class="bloque-documento-wrap" data-type="documento-adjunto">
    <a :href="node.attrs.url" target="_blank" rel="noopener noreferrer" class="bloque-documento" @click.stop>
      <span class="bloque-documento-icono">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </span>
      <span class="bloque-documento-nombre">{{ node.attrs.nombre || 'Documento adjunto' }}</span>
      <span class="bloque-documento-abrir">Abrir ↗</span>
    </a>
  </NodeViewWrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-3';

export default {
  name: 'DocumentoNodeView',
  components: { NodeViewWrapper },
  props: {
    node: { type: Object, required: true },
  },
};
</script>
