import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import BotonNodeView from './BotonNodeView.vue';

// Enlace seguro: http(s), correo, teléfono o ruta del propio sitio ("/contacto").
// "www.sitio.com" se completa con https://. Cualquier otra cosa (p. ej. javascript:) se descarta.
export function urlSegura(valor) {
  const url = String(valor || '').trim();
  if (!url) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url;
  if (/^\/(?!\/)/.test(url)) return url;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(url)) return `https://${url}`;
  return '';
}

// Color propio del botón ('' = degradado de la marca). Solo se acepta #rrggbb.
export function colorSeguro(valor) {
  const c = String(valor || '').trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(c) ? c : '';
}

// Texto blanco u oscuro según qué se lea mejor sobre el color de fondo
export function textoSobre(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#0f172a' : '#ffffff';
}

// Clases y variables CSS del botón (las usan el editor y la página pública)
export function apariencia({ estilo, color }) {
  const c = colorSeguro(color);
  return {
    clase: `bloque-boton bloque-boton--${estilo === 'borde' ? 'borde' : 'relleno'}${c ? ' bloque-boton--color' : ''}`,
    style: c ? `--boton-color: ${c}; --boton-texto: ${textoSobre(c)};` : null,
  };
}

export const BotonNode = Node.create({
  name: 'boton',
  group: 'block',
  atom: true,
  defining: true,

  addAttributes() {
    return {
      texto: { default: 'Ver más' },
      url: { default: '' },
      nuevaPestana: { default: true },
      estilo: { default: 'relleno' },     // relleno | borde
      alineacion: { default: 'izquierda' }, // izquierda | centro
      color: { default: '' },               // '' = degradado de la marca
    };
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="boton"]',
      getAttrs: (el) => {
        const b = el.querySelector('.bloque-boton');
        return {
          texto: b?.textContent || 'Ver más',
          url: b?.getAttribute('href') || '',
          nuevaPestana: b?.getAttribute('target') === '_blank',
          estilo: b?.classList.contains('bloque-boton--borde') ? 'borde' : 'relleno',
          alineacion: el.getAttribute('data-alineacion') === 'centro' ? 'centro' : 'izquierda',
          color: colorSeguro((b?.getAttribute('style') || '').match(/--boton-color:\s*(#[0-9a-f]{6})/i)?.[1]),
        };
      },
    }];
  },

  renderHTML({ node }) {
    const { texto, nuevaPestana, alineacion } = node.attrs;
    const href = urlSegura(node.attrs.url);
    const { clase, style } = apariencia(node.attrs);
    const extra = style ? { style } : {};
    // Sin enlace se muestra igual, pero no es clicable
    const boton = href
      ? ['a', { class: clase, href, ...extra, ...(nuevaPestana ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }, texto || 'Ver más']
      : ['span', { class: `${clase} bloque-boton--sin-enlace`, ...extra }, texto || 'Ver más'];
    return [
      'div',
      mergeAttributes({ 'data-type': 'boton', 'data-alineacion': alineacion === 'centro' ? 'centro' : 'izquierda', class: 'bloque-boton-wrap' }),
      boton,
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(BotonNodeView);
  },
});
