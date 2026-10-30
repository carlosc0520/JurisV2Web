const RESOURCES_URL = process.env.VUE_APP_RESOURCES_URL || 'https://resources.jurissearch.com';

// Antepone el dominio de recursos a una ruta relativa de almacenamiento propio;
// si ya es una URL absoluta (imagen externa elegida en la biblioteca), la deja tal cual.
export function urlDeMedia(ruta) {
  if (!ruta) return '';
  return /^https?:\/\//i.test(ruta) ? ruta : `${RESOURCES_URL}${ruta}`;
}
