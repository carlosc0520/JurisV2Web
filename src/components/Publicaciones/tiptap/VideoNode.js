import { Node, mergeAttributes } from '@tiptap/core';

// Convierte un enlace de YouTube o Vimeo en la URL de su reproductor
// incrustable. Devuelve null si el enlace no es de un servicio soportado.
export function urlEmbedVideo(enlace) {
  let u;
  try { u = new URL(String(enlace || '').trim()); } catch { return null; }
  const host = u.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtu.be' || host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
    const id = host === 'youtu.be'
      ? u.pathname.slice(1)
      : u.searchParams.get('v') || (u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/) || [])[1];
    if (!id || !/^[\w-]{6,}$/.test(id)) return null;
    const inicio = parseInt(u.searchParams.get('t') || u.searchParams.get('start') || '', 10);
    return `https://www.youtube-nocookie.com/embed/${id}${inicio > 0 ? `?start=${inicio}` : ''}`;
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = u.pathname.match(/(?:\/video)?\/(\d+)(?:\/([\da-f]+))?/);
    if (!m) return null;
    const hash = m[2] || u.searchParams.get('h');
    return `https://player.vimeo.com/video/${m[1]}${hash ? `?h=${hash}` : ''}`;
  }

  return null;
}

export const VideoNode = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video"]', getAttrs: el => ({ url: el.getAttribute('data-url') }) }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const src = urlEmbedVideo(node.attrs.url);
    const wrap = mergeAttributes(HTMLAttributes, { 'data-type': 'video', 'data-url': node.attrs.url, class: 'bloque-video' });
    if (!src) return ['div', wrap, ['p', { class: 'bloque-video-error' }, 'Enlace de video no válido']];
    return ['div', wrap, ['iframe', {
      src,
      title: 'Video',
      loading: 'lazy',
      frameborder: '0',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      allowfullscreen: 'true',
      referrerpolicy: 'strict-origin-when-cross-origin',
    }]];
  },
});
