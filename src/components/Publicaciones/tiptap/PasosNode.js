import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import PasosNodeView from './PasosNodeView.vue';

export const PasosNode = Node.create({
  name: 'pasos',
  group: 'block',
  atom: true,
  defining: true,

  addAttributes() {
    return {
      titulo: { default: '' },
      items: {
        default: [],
        parseHTML: (el) => {
          try { return JSON.parse(el.getAttribute('data-items') || '[]'); } catch { return []; }
        },
        renderHTML: (attrs) => ({ 'data-items': JSON.stringify(attrs.items || []) }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pasos"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const items = node.attrs.items || [];
    const titulo = node.attrs.titulo;
    const children = [];
    if (titulo) children.push(['h2', { class: 'bloque-pasos-titulo' }, titulo]);

    const lista = ['div', { class: 'bloque-pasos-lista' }];
    items.forEach((item, i) => {
      lista.push([
        'div', { class: 'bloque-pasos-item' },
        ['span', { class: 'bloque-pasos-numero' }, String(i + 1)],
        ['div', { class: 'bloque-pasos-contenido' },
          ['h3', {}, item.titulo || ''],
          ['p', {}, item.descripcion || ''],
        ],
      ]);
    });
    children.push(lista);

    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'pasos', class: 'bloque-pasos' }), ...children];
  },

  addNodeView() {
    return VueNodeViewRenderer(PasosNodeView);
  },
});
