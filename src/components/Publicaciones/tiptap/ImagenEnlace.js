import ImageResize from 'tiptap-extension-resize-image';

const esExterno = (href) => /^https?:\/\//i.test(href || '');
const escapar = (t) => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICONO_ENLACE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.17 1.17"/><path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.17-1.17"/></svg>';

async function pedirEnlace(actual) {
  const { default: Swal } = await import('sweetalert2');
  const r = await Swal.fire({
    title: actual ? 'Editar enlace de la imagen' : 'Enlazar imagen',
    input: 'text',
    inputValue: actual || '',
    inputPlaceholder: 'https://… o /publicaciones/…',
    inputLabel: 'Al hacer clic en la imagen se abrirá esta dirección',
    showCancelButton: true,
    showDenyButton: !!actual,
    confirmButtonText: 'Guardar',
    denyButtonText: 'Quitar enlace',
    cancelButtonText: 'Cancelar',
    inputValidator: (v) => {
      const t = (v || '').trim();
      if (!t) return actual ? null : 'Ingresa una dirección';
      return /^(https?:\/\/|\/|mailto:)/i.test(t) ? null : 'Debe empezar con https://, / o mailto:';
    },
  });
  if (r.isDenied) return '';            // quitar
  if (!r.isConfirmed) return null;      // cancelar
  return (r.value || '').trim();
}

// Imagen redimensionable con enlace opcional (atributo `href`). Mantiene el
// nombre "imageResize", así que los documentos existentes no cambian.
export const ImagenEnlace = ImageResize.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        parseHTML: (el) => el.closest('a')?.getAttribute('href') || null,
        renderHTML: () => ({}), // se aplica en el <a> que envuelve la imagen
      },
    };
  },

  renderHTML(props) {
    const img = this.parent?.(props);
    const { href } = props.node.attrs;
    if (!href) return img;
    return ['a', {
      href,
      class: 'img-enlace',
      ...(esExterno(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    }, img];
  },

  // Vista del editor: la de la librería (con cambio de tamaño) más un botón de enlace
  addNodeView() {
    const crearVista = this.parent?.();
    return (props) => {
      const vista = crearVista(props);
      if (!props.editor.isEditable || !vista?.dom) return vista;

      let nodo = props.node;
      const contenedor = vista.dom.firstElementChild || vista.dom;
      contenedor.classList.add('img-enlace-contenedor');

      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'img-enlace-btn';
      boton.contentEditable = 'false';
      contenedor.appendChild(boton);

      const pintar = () => {
        const href = nodo.attrs.href;
        boton.classList.toggle('activo', !!href);
        boton.innerHTML = `${ICONO_ENLACE}<span>${href ? escapar(href.replace(/^https?:\/\//, '').slice(0, 32)) : 'Enlace'}</span>`;
        boton.title = href ? `Enlace: ${href} (clic para cambiar)` : 'Agregar un enlace a la imagen';
      };
      pintar();

      boton.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); });
      boton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nuevo = await pedirEnlace(nodo.attrs.href);
        if (nuevo === null || typeof props.getPos !== 'function') return;
        const pos = props.getPos();
        props.editor.chain().command(({ tr }) => {
          tr.setNodeMarkup(pos, undefined, { ...nodo.attrs, href: nuevo || null });
          return true;
        }).run();
      });

      const actualizar = vista.update;
      vista.update = (n) => {
        const ok = actualizar ? actualizar(n) : n.type === nodo.type;
        if (ok) { nodo = n; pintar(); }
        return ok;
      };
      vista.ignoreMutation = () => true;
      return vista;
    };
  },
});
