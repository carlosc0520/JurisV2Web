<?php
/**
 * jurissearch.com/sitemap.xml (vía .htaccess): entrega el sitemap que genera la API.
 * Así el sitemap vive en el mismo dominio que las páginas, que es lo más simple para
 * Google Search Console.
 */
declare(strict_types=1);

$api = rtrim(getenv('JURIS_API') ?: 'https://api.jurissearch.com', '/');
$ctx = stream_context_create(['http' => ['timeout' => 8, 'ignore_errors' => true]]);
$xml = @file_get_contents($api . '/sitemap.xml', false, $ctx);

if ($xml === false || strpos($xml, '<urlset') === false) {
    http_response_code(503);
    header('Retry-After: 3600');
    exit;
}
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');
echo $xml;
