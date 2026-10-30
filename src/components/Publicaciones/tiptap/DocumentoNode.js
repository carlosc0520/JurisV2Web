import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import DocumentoNodeView from './DocumentoNodeView.vue';

const ICONO = [
  'svg',
  { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'white', 'stroke-width': '2' },
  ['path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }],
  ['polyline', { points: '14 2 14 8 20 8' }],
];

export const DocumentoNode = Node.create({
  name: 'documentoAdjunto',
  group: 'block',
  atom: true,
  defining: true,

  addAttributes() {
    return {
      url: { default: '' },
      nombre: { default: 'Documento adjunto' },
    };
  },

  parseHTML() {
    return [{ tag: 'a[data-type="documento-adjunto"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'documento-adjunto',
        class: 'bloque-documento',
        href: node.attrs.url,
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
      ['span', { class: 'bloque-documento-icono' }, ICONO],
      ['span', { class: 'bloque-documento-nombre' }, node.attrs.nombre || 'Documento adjunto'],
      ['span', { class: 'bloque-documento-abrir' }, 'Abrir ↗'],
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(DocumentoNodeView);
  },
});
