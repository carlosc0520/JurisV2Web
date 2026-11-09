// Estadísticas propias del blog: registra la lectura de un artículo y, al salir, cuánto
// tiempo estuvo visible y hasta dónde bajó. Sin cookies: el servidor calcula una huella
// anónima diaria. La API no cuenta robots ni recargas dentro de 30 minutos.
import PublicacionesProxy from '@/proxies/PublicacionesProxy';

const API = (process.env.VUE_APP_API_URL || 'https://api.jurissearch.com').replace(/\/+$/, '');

export function iniciarVisita(slug) {
  let visita = null;
  let activoMs = 0;
  let desde = document.visibilityState === 'visible' ? Date.now() : null; // solo cuenta el tiempo con la pestaña visible
  let scroll = 0;
  let terminado = false;

  const medirScroll = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const p = total > 0 ? (window.scrollY / total) * 100 : 100;
    if (p > scroll) scroll = Math.min(100, p);
  };
  const segundos = () => Math.round((activoMs + (desde ? Date.now() - desde : 0)) / 1000);
  // Se envía varias veces (al ocultar la pestaña, al salir); el servidor guarda el mayor valor
  const enviar = () => {
    if (!visita) return;
    const url = `${API}/publicaciones/visita/${visita.ID}/fin?c=${visita.CLAVE}&s=${segundos()}&p=${Math.round(scroll)}`;
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(url);
      else fetch(url, { method: 'POST', keepalive: true });
    } catch { /* sin estadística, la página sigue igual */ }
  };
  const alCambiarVisibilidad = () => {
    if (document.visibilityState === 'hidden') {
      if (desde) { activoMs += Date.now() - desde; desde = null; }
      enviar();
    } else if (!desde) desde = Date.now();
  };

  window.addEventListener('scroll', medirScroll, { passive: true });
  document.addEventListener('visibilitychange', alCambiarVisibilidad);
  window.addEventListener('pagehide', enviar);
  medirScroll();

  // Origen: si se llegó navegando dentro de la web, "interno"; si es la primera página, el sitio de donde vino
  const interno = !!window.history.state?.back;
  const q = new URLSearchParams(window.location.search);
  PublicacionesProxy.registrarVisita(slug, {
    ref: interno ? '' : document.referrer,
    interno,
    utmFuente: q.get('utm_source') || undefined,
    utmCampana: q.get('utm_campaign') || undefined,
  })
    .then((r) => { const d = r?.DATA ?? r; if (d?.ID && d?.CLAVE) visita = d; })
    .catch(() => { /* sin estadística, la página sigue igual */ });

  return function terminar() {
    if (terminado) return;
    terminado = true;
    if (desde) { activoMs += Date.now() - desde; desde = null; }
    enviar();
    window.removeEventListener('scroll', medirScroll);
    document.removeEventListener('visibilitychange', alCambiarVisibilidad);
    window.removeEventListener('pagehide', enviar);
  };
}
