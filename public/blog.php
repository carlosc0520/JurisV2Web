<?php
/**
 * SEO del blog en el servidor.
 *
 * La web es una app Vue: el hosting entrega siempre el mismo index.html y el contenido
 * aparece al ejecutarse JavaScript. WhatsApp, LinkedIn, Facebook y Bing no ejecutan
 * JavaScript, así que veían el mismo título e imagen en todo el blog.
 *
 * El .htaccess manda aquí /blog/<articulo> y /blog/categoria/<categoria>. Este archivo pide
 * los datos a la API, completa el <head> del index.html (título, descripción, imagen para
 * compartir, URL canónica y datos estructurados) y lo entrega. En el navegador, Vue arranca
 * igual que siempre. Si la API no responde, se entrega el index.html sin cambios: el blog
 * nunca deja de cargar por esto.
 *
 * En el navegador, src/composables/useSeo.js mantiene lo mismo al navegar sin recargar.
 */
declare(strict_types=1);

// Variables de entorno solo para pruebas locales; en el hosting rigen estos valores.
define('SITIO', rtrim(getenv('JURIS_SITIO') ?: 'https://jurissearch.com', '/'));
define('API', rtrim(getenv('JURIS_API') ?: 'https://apiv2.jurissearch.com', '/'));
const RECURSOS = 'https://resources.jurissearch.com';
const MARCA = 'Juris Search';
const DESCRIPCION = 'Plataforma especializada de búsqueda jurídica del Perú. Jurisprudencia, doctrina y legislación actualizada.';

$index = @file_get_contents(__DIR__ . '/index.html');
if ($index === false) { http_response_code(500); exit; }

// ── Utilidades ───────────────────────────────────────────────────────────────
function e($texto): string {
    return htmlspecialchars((string) $texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function recortar($texto, int $max = 160): string {
    $t = trim(preg_replace('/\s+/u', ' ', (string) $texto));
    return mb_strlen($t) > $max ? rtrim(mb_substr($t, 0, $max - 1)) . '…' : $t;
}

// Igual que slugDe() de la web: sin tildes, minúsculas, guiones
function slugDe($texto): string {
    $t = mb_strtolower((string) $texto, 'UTF-8');
    $t = strtr($t, ['á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a', 'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
        'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i', 'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o',
        'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u', 'ñ' => 'n', 'ç' => 'c']);
    return trim(preg_replace('/[^a-z0-9]+/', '-', $t), '-');
}

function media($ruta): ?string {
    if (!$ruta) return null;
    return preg_match('#^https?://#i', $ruta) ? $ruta : RECURSOS . $ruta;
}

function iso($fecha): ?string {
    if (!$fecha) return null;
    $t = strtotime((string) $fecha);
    return $t ? gmdate('Y-m-d\TH:i:s\Z', $t) : null;
}

// GET a la API pública. null si falla o tarda (la página igual se entrega).
function api(string $ruta) {
    $ctx = stream_context_create(['http' => ['timeout' => 4, 'ignore_errors' => true, 'header' => "Accept: application/json\r\n"]]);
    $cuerpo = @file_get_contents(API . $ruta, false, $ctx);
    if ($cuerpo === false) return null;
    $json = json_decode($cuerpo, true);
    if (!is_array($json)) return null;
    return array_key_exists('DATA', $json) ? $json['DATA'] : $json;
}

// Las categorías cambian poco: se guardan 10 minutos en un archivo temporal
function categorias(): array {
    $cache = sys_get_temp_dir() . '/jurissearch_blog_categorias.json';
    if (is_file($cache) && time() - filemtime($cache) < 600) {
        $guardadas = json_decode((string) @file_get_contents($cache), true);
        if (is_array($guardadas)) return $guardadas;
    }
    $lista = api('/publicaciones/categorias');
    if (!is_array($lista)) return [];
    @file_put_contents($cache, json_encode($lista));
    return $lista;
}

// Reemplaza el SEO por defecto del index.html y lo entrega
function entregar(string $index, array $seo, int $estado = 200): void {
    $titulo = $seo['titulo'] ? $seo['titulo'] . ' | ' . MARCA : MARCA . ' | Búsqueda jurídica del Perú';
    $descripcion = recortar($seo['descripcion'] ?? '' ?: DESCRIPCION);
    $imagen = $seo['imagen'] ?? null ?: SITIO . '/og-default.png';
    $noindex = !empty($seo['noindex']);

    $h = [];
    $h[] = '<title>' . e($titulo) . '</title>';
    $h[] = '<meta name="description" content="' . e($descripcion) . '">';
    $h[] = '<meta name="robots" content="' . ($noindex ? 'noindex, nofollow' : 'index, follow') . '">';
    if (!$noindex && !empty($seo['url'])) $h[] = '<link rel="canonical" href="' . e($seo['url']) . '">';
    $og = [
        'og:site_name' => MARCA, 'og:title' => $seo['titulo'] ?: $titulo, 'og:description' => $descripcion,
        'og:image' => $imagen, 'og:url' => $seo['url'] ?? SITIO, 'og:type' => $seo['tipo'] ?? 'website', 'og:locale' => 'es_PE',
        'article:published_time' => $seo['publicado'] ?? null, 'article:modified_time' => $seo['modificado'] ?? null,
        'article:author' => $seo['autor'] ?? null, 'article:section' => $seo['seccion'] ?? null,
    ];
    foreach ($og as $prop => $valor) if ($valor) $h[] = '<meta property="' . $prop . '" content="' . e($valor) . '">';
    foreach ($seo['tags'] ?? [] as $tag) $h[] = '<meta property="article:tag" content="' . e($tag) . '">';
    $h[] = '<meta name="twitter:card" content="summary_large_image">';
    $h[] = '<meta name="twitter:title" content="' . e($seo['titulo'] ?: $titulo) . '">';
    $h[] = '<meta name="twitter:description" content="' . e($descripcion) . '">';
    $h[] = '<meta name="twitter:image" content="' . e($imagen) . '">';
    if (!$noindex && !empty($seo['jsonLd'])) {
        $h[] = '<script type="application/ld+json" id="seo-jsonld">'
            . json_encode($seo['jsonLd'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . '</script>';
    }

    // Quita lo que trae el index.html (el build puede quitar las comillas de los atributos)
    $html = preg_replace('#<title>.*?</title>#is', '', $index, 1);
    $html = preg_replace('#<meta\s[^>]*(?:name|property)\s*=\s*["\']?(?:description|robots|og:[\w:]+|twitter:[\w:]+|article:[\w:]+)["\']?[^>]*>\s*#i', '', $html);
    $html = preg_replace('#<link\s[^>]*rel\s*=\s*["\']?canonical["\']?[^>]*>\s*#i', '', $html);
    $html = preg_replace('#</head>#i', implode("\n", $h) . "\n</head>", $html, 1);
    // Texto visible para quien no ejecuta JavaScript (Bing, lectores sin JS)
    if (!empty($seo['noscript'])) {
        $html = preg_replace('#(<body[^>]*>)#i', '$1<noscript>' . $seo['noscript'] . '</noscript>', $html, 1);
    }

    http_response_code($estado);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache');
    echo $html;
}

function migas(array $items): array {
    $lista = [];
    foreach ($items as $i => $it) {
        $lista[] = array_filter(['@type' => 'ListItem', 'position' => $i + 1, 'name' => $it[0], 'item' => $it[1] ?? null]);
    }
    return ['@type' => 'BreadcrumbList', 'itemListElement' => $lista];
}

$organizacion = ['@type' => 'Organization', '@id' => SITIO . '/#organizacion', 'name' => MARCA, 'url' => SITIO, 'logo' => SITIO . '/og-logo.png'];

// ── Categoría ────────────────────────────────────────────────────────────────
$slugCategoria = isset($_GET['categoria']) ? slugDe($_GET['categoria']) : '';
if ($slugCategoria !== '') {
    $cats = categorias();
    if (!$cats) { echo $index; exit; } // API caída: la app se encarga
    $cat = null;
    foreach ($cats as $c) if (slugDe($c['descripcion'] ?? $c['DESCRIPCION'] ?? '') === $slugCategoria) { $cat = $c; break; }
    if (!$cat) { entregar($index, ['titulo' => 'Categoría no encontrada', 'noindex' => true], 404); exit; }
    $nombre = $cat['descripcion'] ?? $cat['DESCRIPCION'];
    $resumen = trim((string) ($cat['resumen'] ?? '')) ?: 'Artículos y análisis de ' . $nombre . ' en el blog de ' . MARCA . '.';
    $url = SITIO . '/blog/categoria/' . $slugCategoria;
    entregar($index, [
        'titulo' => $nombre . ' · Blog',
        'descripcion' => $resumen,
        'url' => $url,
        'jsonLd' => ['@context' => 'https://schema.org', '@graph' => [
            ['@type' => 'CollectionPage', 'name' => $nombre, 'url' => $url, 'inLanguage' => 'es-PE'],
            migas([['Inicio', SITIO . '/'], [$nombre]]),
        ]],
        'noscript' => '<h1>' . e($nombre) . '</h1><p>' . e($resumen) . '</p>',
    ]);
    exit;
}

// ── Artículo ─────────────────────────────────────────────────────────────────
$slug = isset($_GET['slug']) ? preg_replace('/[^a-z0-9-]/', '', strtolower((string) $_GET['slug'])) : '';
if ($slug === '') { echo $index; exit; }

$ctx = stream_context_create(['http' => ['timeout' => 4, 'ignore_errors' => true]]);
$p = api('/publicaciones/' . rawurlencode($slug));
if ($p === null && @file_get_contents(API . '/publicaciones/categorias', false, $ctx) === false) {
    echo $index; exit; // la API no responde: no se puede saber si existe
}
if (!is_array($p) || empty($p['slug'])) {
    entregar($index, ['titulo' => 'Artículo no encontrado', 'noindex' => true], 404);
    exit;
}

$categoria = null;
foreach (categorias() as $c) if ((int) ($c['id'] ?? $c['ID'] ?? 0) === (int) ($p['idCategoria'] ?? -1)) { $categoria = $c; break; }
$nombreCategoria = $categoria ? ($categoria['descripcion'] ?? $categoria['DESCRIPCION']) : null;
$urlCategoria = $nombreCategoria ? SITIO . '/blog/categoria/' . slugDe($nombreCategoria) : null;

$url = SITIO . '/blog/' . $p['slug'];
$imagen = media($p['imagenListado'] ?? null) ?: media($p['imagen'] ?? null);
$tags = array_values(array_filter(array_map(fn($t) => $t['nombre'] ?? null, $p['etiquetas'] ?? [])));
$autor = !empty($p['autor'])
    ? ['@type' => preg_match('/equipo|juris ?search/i', $p['autor']) ? 'Organization' : 'Person', 'name' => $p['autor']]
    : ['@id' => SITIO . '/#organizacion'];

entregar($index, [
    'titulo' => $p['titulo'],
    'descripcion' => $p['resumen'] ?? $p['subtitulo'] ?? '',
    'imagen' => $imagen,
    'url' => $url,
    'tipo' => 'article',
    'publicado' => iso($p['fechaPublicacion'] ?? null),
    'modificado' => iso($p['fechaEdicion'] ?? null),
    'autor' => $p['autor'] ?? null,
    'seccion' => $nombreCategoria,
    'tags' => $tags,
    'jsonLd' => ['@context' => 'https://schema.org', '@graph' => [
        array_filter([
            '@type' => 'BlogPosting',
            'headline' => $p['titulo'],
            'description' => $p['resumen'] ?? null,
            'image' => $imagen ? [$imagen] : null,
            'datePublished' => iso($p['fechaPublicacion'] ?? null),
            'dateModified' => iso($p['fechaEdicion'] ?? null) ?: iso($p['fechaPublicacion'] ?? null),
            'author' => $autor,
            'publisher' => ['@id' => SITIO . '/#organizacion'],
            'mainEntityOfPage' => $url,
            'articleSection' => $nombreCategoria,
            'keywords' => $tags ? implode(', ', $tags) : null,
            'inLanguage' => 'es-PE',
        ]),
        $organizacion,
        migas([['Inicio', SITIO . '/'], [$nombreCategoria ?: 'Blog', $urlCategoria], [$p['titulo']]]),
    ]],
    'noscript' => '<article><h1>' . e($p['titulo']) . '</h1>'
        . (!empty($p['resumen']) ? '<p>' . e($p['resumen']) . '</p>' : '')
        . ($urlCategoria ? '<p><a href="' . e($urlCategoria) . '">Más artículos de ' . e($nombreCategoria) . '</a></p>' : '')
        . '</article>',
]);
