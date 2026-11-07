// Mismo criterio que los slugs de la API: sin tildes, en minúsculas y con guiones.
// "Derecho Penal Económico" -> "derecho-penal-economico"
export function slugDe(texto) {
  return String(texto ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
