import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { ImagenEnlace } from './ImagenEnlace';
import LinkExt from '@tiptap/extension-link';
import { DestacadoNode } from './DestacadoNode';
import { PasosNode } from './PasosNode';
import { DocumentoNode } from './DocumentoNode';
import { VideoNode } from './VideoNode';
import { extractHeadings, extractPlainText, normalizarDoc } from './docUtils';

const EXTENSIONS = [
  StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
  ImagenEnlace.configure({ minWidth: 80, maxWidth: 900 }),
  LinkExt,
  DestacadoNode,
  PasosNode,
  DocumentoNode,
  VideoNode,
];

// Genera el HTML del documento (sin instanciar un editor, liviano para el
// público) e inyecta los mismos id de ancla que usa el índice "En este
// artículo", en el mismo orden (ver docUtils.extractHeadings).
export function renderPublicHtml(doc) {
  if (!doc) return '';
  let html;
  try {
    html = generateHTML(normalizarDoc(doc), EXTENSIONS);
  } catch (err) {
    // Un nodo que no se pueda renderizar no debe dejar la pagina en blanco:
    // se muestra al menos el texto del articulo.
    console.error('[Publicaciones] No se pudo renderizar el documento:', err);
    const p = document.createElement('p');
    p.textContent = extractPlainText(doc);
    return p.outerHTML;
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, 'text/html');
  const anclas = parsed.querySelectorAll('h2, .bloque-pasos-titulo');
  anclas.forEach((el, i) => { el.id = `seccion-${i}`; });

  return parsed.body.innerHTML;
}

export function headingsOf(doc) {
  return extractHeadings(doc);
}
