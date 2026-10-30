import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { VueRenderer } from '@tiptap/vue-3';
import SlashCommandList from './SlashCommandList.vue';
import { urlEmbedVideo } from './VideoNode';

// Estado a nivel de módulo (no depende de `this` dentro de los callbacks de
// Suggestion, cuyo binding interno en Tiptap no es confiable para arrow
// functions definidas dentro de addOptions()).
const estado = { onRequestImage: null };
export function setOnRequestImage(fn) { estado.onRequestImage = fn; }

function buildItems(onRequestImage) {
  return [
    {
      title: 'Encabezado', description: 'Título de sección',
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
    },
    {
      title: 'Párrafo', description: 'Texto normal',
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('paragraph').run(),
    },
    {
      title: 'Lista', description: 'Lista con viñetas',
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
      title: 'Lista numerada', description: 'Lista ordenada',
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
      title: 'Cita', description: 'Bloque de cita',
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    },
    {
      title: 'Imagen o documento', description: 'Subir o elegir de la biblioteca',
      command: ({ editor, range }) => {
        // Borra el "/imagen" y cierra el menú de inmediato — la biblioteca
        // se abre después, de lo contrario el menú "/" queda flotando por
        // encima del modal mientras se espera la selección.
        editor.chain().focus().deleteRange(range).run();
        if (!onRequestImage) return;
        onRequestImage().then((media) => {
          if (!media?.url) return;
          if (media.categoria === 'documento') {
            editor.chain().focus().insertContent({
              type: 'documentoAdjunto',
              attrs: { url: media.url, nombre: media.nombre || 'Documento adjunto' },
            }).run();
          } else {
            editor.chain().focus().setImage({ src: media.url }).run();
          }
        });
      },
    },
    {
      title: 'Video', description: 'Enlace de YouTube o Vimeo',
      command: async ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        const { default: Swal } = await import('sweetalert2');
        const { value: url } = await Swal.fire({
          title: 'Insertar video',
          input: 'url',
          inputPlaceholder: 'https://www.youtube.com/watch?v=…',
          inputLabel: 'Pega el enlace de YouTube o Vimeo',
          showCancelButton: true,
          confirmButtonText: 'Insertar',
          cancelButtonText: 'Cancelar',
          inputValidator: (v) => (urlEmbedVideo(v) ? null : 'Solo se admiten enlaces de YouTube o Vimeo'),
        });
        if (url) editor.chain().focus().insertContent({ type: 'videoEmbed', attrs: { url: url.trim() } }).run();
      },
    },
    {
      title: 'Recuadro destacado', description: 'Resalta una idea clave',
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range)
        .insertContent({ type: 'destacado', content: [{ type: 'text', text: 'Escribe la idea clave aquí…' }] }).run(),
    },
    {
      title: 'Lista de pasos', description: 'Pasos numerados',
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range)
        .insertContent({ type: 'pasos', attrs: { titulo: '', items: [{ titulo: '', descripcion: '' }] } }).run(),
    },
  ];
}

function updatePosition(clientRect, el) {
  const rect = clientRect ? clientRect() : null;
  if (!rect || !el) return;
  el.style.position = 'fixed';
  el.style.left = `${rect.left}px`;
  el.style.top = `${rect.bottom + 6}px`;
  el.style.zIndex = '9999';
}

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        command: ({ editor, range, props }) => props.command({ editor, range }),
        items: ({ query }) =>
          buildItems(estado.onRequestImage)
            .filter((i) => i.title.toLowerCase().includes(query.toLowerCase())).slice(0, 10),
        render: () => {
          let component;
          let popupEl;

          return {
            onStart: (props) => {
              component = new VueRenderer(SlashCommandList, { props, editor: props.editor });
              popupEl = document.createElement('div');
              popupEl.className = 'slash-popup';
              popupEl.appendChild(component.element);
              document.body.appendChild(popupEl);
              updatePosition(props.clientRect, popupEl);
            },
            onUpdate: (props) => {
              component.updateProps(props);
              updatePosition(props.clientRect, popupEl);
            },
            onKeyDown: (props) => {
              if (props.event.key === 'Escape') { popupEl?.remove(); return true; }
              return component?.ref?.onKeyDown(props) ?? false;
            },
            onExit: () => { popupEl?.remove(); component?.destroy(); },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
