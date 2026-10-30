import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import DestacadoNodeView from './DestacadoNodeView.vue';

export const DestacadoNode = Node.create({
  name: 'destacado',
  group: 'block',
  content: 'inline*',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-type="destacado"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'destacado', class: 'bloque-destacado' }),
      ['span', { class: 'bloque-destacado-label' }, 'La idea clave'],
      ['div', { class: 'bloque-destacado-texto' }, 0],
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(DestacadoNodeView);
  },
});
