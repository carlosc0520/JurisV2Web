// Utilidades para leer un documento Tiptap (JSON) sin instanciar un editor.

function walk(node, visit) {
  if (!node) return;
  visit(node);
  (node.content || []).forEach((child) => walk(child, visit));
}

// Las imagenes se guardan como nodo "imageResize" (extension de redimension),
// pero los articulos creados antes usan "image": sin esta conversion
// generateHTML falla con "nodo desconocido" y la pagina queda en blanco.
export function normalizarDoc(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const copia = { ...doc, type: doc.type === 'image' ? 'imageResize' : doc.type };
  if (Array.isArray(doc.content)) copia.content = doc.content.map(normalizarDoc);
  return copia;
}

export function extractPlainText(doc) {
  let text = '';
  walk(doc, (node) => {
    if (node.type === 'text') text += `${node.text} `;
    if (node.type === 'pasos') {
      (node.attrs?.items || []).forEach((item) => {
        text += `${item.titulo || ''} ${item.descripcion || ''} `;
      });
    }
  });
  return text.trim();
}

// Solo encabezados de nivel 2 y títulos de "pasos" cuentan como secciones del
// índice — deben coincidir en orden y cantidad con el selector
// `h2, .bloque-pasos-titulo` usado al inyectar anclas en el HTML público
// (ver renderPublicHtml.js), por eso se filtran igual en ambos lados.
export function extractHeadings(doc) {
  const headings = [];
  let i = 0;
  walk(doc, (node) => {
    if (node.type === 'heading' && (node.attrs?.level || 2) === 2) {
      headings.push({ id: `seccion-${i++}`, texto: (node.content || []).map((c) => c.text || '').join('') });
    } else if (node.type === 'pasos' && node.attrs?.titulo) {
      headings.push({ id: `seccion-${i++}`, texto: node.attrs.titulo });
    }
  });
  return headings;
}

export function countWords(doc) {
  const text = extractPlainText(doc);
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}
