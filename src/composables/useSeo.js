/**
 * SEO: título, descripción, Open Graph, URL canónica, robots y datos estructurados (JSON-LD).
 *
 * - Cada navegación aplica los valores de la ruta (`seoDeRuta`, desde main.js).
 * - Las páginas con datos propios (blog) marcan su ruta con `meta: { seoPropio: true }`
 *   y llaman a `defineSeo({...})` cuando ya tienen los datos.
 *
 * Nota: esto corre en el navegador. Google lo ve; WhatsApp, LinkedIn o Bing no ejecutan
 * JavaScript y solo leen lo que trae public/index.html (fase con PHP para eso).
 */
import { watchEffect, onUnmounted } from 'vue'

export const SITE_NAME = 'Juris Search'
export const SITE_URL  = (process.env.VUE_APP_SITE_URL || 'https://jurissearch.com').replace(/\/+$/, '')
const OG_IMAGE = `${SITE_URL}/og-default.png`
const LOGO     = `${SITE_URL}/og-logo.png`

const DESCRIPCION = 'Plataforma especializada de búsqueda jurídica del Perú. Jurisprudencia, doctrina y legislación actualizada.'

// Rutas privadas o de plantilla: nunca en buscadores (también bloqueadas en robots.txt)
const PRIVADAS = ['/admin', '/usuario', '/auth', '/redirect', '/landing', '/profile', '/blog/previa']

// Páginas públicas sin datos propios
const PAGINAS = {
  '/':                     { description: DESCRIPCION },
  '/contacto':             { title: 'Contacto', description: 'Escríbenos para conocer Juris Search, resolver dudas o solicitar una demostración.' },
  '/questions':            { title: 'Preguntas frecuentes', description: 'Respuestas a las preguntas más comunes sobre Juris Search.' },
  '/politicas&privacidad': { title: 'Políticas de privacidad' },
  '/cookies':              { title: 'Política de cookies' },
  '/politica-ia':          { title: 'Política de uso de inteligencia artificial' },
}

const recortar = (txt, max = 160) => {
  const t = String(txt ?? '').replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t
}

// ── DOM ──────────────────────────────────────────────────────
function upsertMeta(attr, attrValue, content) {
  let el = document.querySelector(`meta[${attr}="${attrValue}"]`)
  if (content == null || content === '') { if (el) el.remove(); return }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, attrValue)
    document.head.appendChild(el)
  }
  el.content = String(content)
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!href) { if (el) el.remove(); return }
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertJsonLd(datos) {
  let el = document.getElementById('seo-jsonld')
  if (!datos) { if (el) el.remove(); return }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'seo-jsonld'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(datos)
}

// ── Aplicar ──────────────────────────────────────────────────
/**
 * opts: { title, description, image, url, type, noindex, publishedAt, modifiedAt,
 *         author, section, tags, jsonLd }
 */
function applyMeta(opts = {}) {
  const title       = opts.title ? `${opts.title} | ${SITE_NAME}` : `${SITE_NAME} | Búsqueda jurídica del Perú`
  const description = recortar(opts.description || DESCRIPCION)
  const image       = opts.image || OG_IMAGE
  const url         = opts.url || (SITE_URL + window.location.pathname)
  const esArticulo  = opts.type === 'article'

  document.title = title
  document.documentElement.lang = 'es'

  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', opts.noindex ? 'noindex, nofollow' : 'index, follow')

  upsertMeta('property', 'og:site_name',   SITE_NAME)
  upsertMeta('property', 'og:title',       opts.title || title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:image',       image)
  upsertMeta('property', 'og:url',         url)
  upsertMeta('property', 'og:type',        esArticulo ? 'article' : 'website')
  upsertMeta('property', 'og:locale',      'es_PE')

  upsertMeta('name', 'twitter:card',        'summary_large_image')
  upsertMeta('name', 'twitter:title',       opts.title || title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image',       image)

  // Una página privada no declara URL canónica
  upsertLink('canonical', opts.noindex ? null : url)

  // Datos del artículo: se quitan al salir de él (la app no recarga la página)
  upsertMeta('property', 'article:published_time', esArticulo ? opts.publishedAt : null)
  upsertMeta('property', 'article:modified_time',  esArticulo ? opts.modifiedAt : null)
  upsertMeta('property', 'article:author',         esArticulo ? opts.author : null)
  upsertMeta('property', 'article:section',        esArticulo ? opts.section : null)
  document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove())
  if (esArticulo) (opts.tags || []).forEach(t => {
    const el = document.createElement('meta')
    el.setAttribute('property', 'article:tag')
    el.content = t
    document.head.appendChild(el)
  })

  upsertJsonLd(opts.noindex ? null : (opts.jsonLd || null))
}

// ── Datos estructurados ──────────────────────────────────────
export function organizacionJsonLd() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organizacion`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO,
  }
}

export function migasJsonLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nombre,
      ...(it.url ? { item: it.url } : {}),
    })),
  }
}

// Valores de una ruta sin datos propios (se llama en cada navegación)
export function seoDeRuta(to) {
  const noindex = PRIVADAS.some(p => to.path === p || to.path.startsWith(`${p}/`))
  const pagina  = PAGINAS[to.path] || {}
  const jsonLd  = to.path === '/'
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          organizacionJsonLd(),
          { '@type': 'WebSite', '@id': `${SITE_URL}/#sitio`, name: SITE_NAME, url: SITE_URL, inLanguage: 'es-PE', publisher: { '@id': `${SITE_URL}/#organizacion` } },
        ],
      }
    : null
  applyMeta({ ...pagina, title: pagina.title || (noindex ? to.meta?.title : null), noindex, jsonLd })
}

// ── API para componentes ─────────────────────────────────────
/** Composition API: se reaplica cuando cambian los datos reactivos que use `options`. */
export function useSeo(options = {}) {
  const stop = watchEffect(() => {
    const opts = typeof options === 'function' ? options() : (options.value ?? options)
    applyMeta(opts)
  })
  onUnmounted(stop)
}

/** Options API: llamar cuando la página ya tiene sus datos. */
export function defineSeo(options = {}) {
  applyMeta(typeof options === 'function' ? options() : options)
}

export default useSeo
