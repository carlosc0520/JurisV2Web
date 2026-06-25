/**
 * useSeo — Gestión de meta tags para SEO y Open Graph.
 * Uso:
 *   import { useSeo } from '@/composables/useSeo'
 *   useSeo({ title: 'Búsqueda', description: 'Encuentra resoluciones...' })
 *
 * También exporta `defineSeo` para uso en Options API via created()
 */
import { watchEffect, onUnmounted } from 'vue'

const SITE_NAME = 'JurisSearch'
const SITE_URL  = process.env.VUE_APP_SITE_URL || 'https://jurissearch.com'
const OG_IMAGE  = `${SITE_URL}/og-default.png`
const TWITTER   = '@jurissearch'

const DEFAULTS = {
  title:       SITE_NAME,
  description: 'Plataforma especializada de búsqueda jurídica del Perú. Jurisprudencia, doctrina y legislación actualizada.',
  image:       OG_IMAGE,
  type:        'website',
  noindex:     false,
}

// ── Internal helpers ─────────────────────────────────────────
function upsertMeta(attr, attrValue, content) {
  if (content == null) return
  let el = document.querySelector(`meta[${attr}="${attrValue}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, attrValue)
    document.head.appendChild(el)
  }
  el.content = String(content)
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function applyMeta(opts) {
  const title       = opts.title ? `${opts.title} — ${SITE_NAME}` : SITE_NAME
  const description = opts.description ?? DEFAULTS.description
  const image       = opts.image ?? DEFAULTS.image
  const url         = opts.url ?? (SITE_URL + window.location.pathname)
  const type        = opts.type ?? DEFAULTS.type

  // Title
  document.title = title

  // Standard meta
  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', opts.noindex ? 'noindex, nofollow' : 'index, follow')

  // Open Graph
  upsertMeta('property', 'og:site_name',  SITE_NAME)
  upsertMeta('property', 'og:title',       title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:image',       image)
  upsertMeta('property', 'og:url',         url)
  upsertMeta('property', 'og:type',        type)
  upsertMeta('property', 'og:locale',      'es_PE')

  // Twitter Card
  upsertMeta('name', 'twitter:card',        'summary_large_image')
  upsertMeta('name', 'twitter:site',        TWITTER)
  upsertMeta('name', 'twitter:title',       title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image',       image)

  // Canonical
  upsertLink('canonical', url)

  // Article-specific
  if (opts.publishedAt) upsertMeta('property', 'article:published_time', opts.publishedAt)
  if (opts.author)      upsertMeta('property', 'article:author',         opts.author)
}

// ── Composable ────────────────────────────────────────────────
/**
 * @param {Object|import('vue').Ref<Object>} options
 * options: { title, description, image, url, type, noindex, publishedAt, author }
 */
export function useSeo(options = {}) {
  const stop = watchEffect(() => {
    const opts = typeof options === 'function' ? options() : (options.value ?? options)
    applyMeta(opts)
  })

  onUnmounted(() => {
    stop()
    // Restaurar title al desmontar la vista
    document.title = SITE_NAME
  })
}

/** Para usar en Options API dentro de created() */
export function defineSeo(options = {}) {
  applyMeta(typeof options === 'function' ? options() : options)
}

export default useSeo
