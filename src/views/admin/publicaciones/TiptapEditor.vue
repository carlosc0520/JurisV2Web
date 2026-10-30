<template>
  <div class="tiptap-editor-wrap">
    <!-- Barra flotante al seleccionar texto -->
    <div ref="bubbleMenuEl" class="bubble-menu" style="visibility:hidden; position:absolute; top:0; left:0;">
      <button type="button" class="bubble-menu-btn" :class="{ 'bubble-menu-btn-active': editor?.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()"><b>B</b></button>
      <button type="button" class="bubble-menu-btn" :class="{ 'bubble-menu-btn-active': editor?.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()"><i>I</i></button>
      <button type="button" class="bubble-menu-btn" :class="{ 'bubble-menu-btn-active': editor?.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
      <button type="button" class="bubble-menu-btn" :class="{ 'bubble-menu-btn-active': editor?.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()">❝</button>
      <button type="button" class="bubble-menu-btn" :class="{ 'bubble-menu-btn-active': editor?.isActive('link') }" @click="toggleLink">🔗</button>
    </div>

    <div class="tiptap-toolbar">
      <span class="tiptap-hint">Escribe <kbd>/</kbd> para insertar un encabezado, imagen, video, recuadro destacado o lista de pasos</span>
      <a :href="GUIA_URL" target="_blank" rel="noopener" class="guia-btn" title="Abre la guía en PDF en otra pestaña">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        Guía de comandos ↗
      </a>
    </div>

    <editor-content :editor="editor" class="tiptap-doc tiptap-editable" />

    <MediaLibraryModal v-model:show="bibliotecaAbierta" @select="onMediaSeleccionado" />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ImagenEnlace } from '@/components/Publicaciones/tiptap/ImagenEnlace';
import LinkExt from '@tiptap/extension-link';
import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import { DestacadoNode } from '@/components/Publicaciones/tiptap/DestacadoNode';
import { PasosNode } from '@/components/Publicaciones/tiptap/PasosNode';
import { DocumentoNode } from '@/components/Publicaciones/tiptap/DocumentoNode';
import { VideoNode } from '@/components/Publicaciones/tiptap/VideoNode';
import { SlashCommand, setOnRequestImage } from '@/components/Publicaciones/tiptap/SlashCommand';
import { normalizarDoc } from '@/components/Publicaciones/tiptap/docUtils';
import MediaLibraryModal from '@/components/Media/MediaLibraryModal.vue';
import '@/assets/styles/tiptap-blocks.css';

const RESOURCES_URL = process.env.VUE_APP_RESOURCES_URL || 'https://resources.jurissearch.com';
// Guía en PDF subida a la biblioteca de medios (scripts/subir-guia-comandos.ts en la API)
const GUIA_URL = `${RESOURCES_URL}/uploads/media/documentos/2026/10/2ff86d2e50ac1c92c5946d4a6f6d8f4389a11a97895aaeb128bf3f5ca14cd643.pdf`;

export default {
  name: 'TiptapEditor',
  components: { EditorContent, MediaLibraryModal },
  props: {
    modelValue: { type: Object, default: null },
  },
  emits: ['update:modelValue'],
  data() {
    return { editor: null, bibliotecaAbierta: false, resolverBiblioteca: null, GUIA_URL };
  },
  mounted() {
    setOnRequestImage(() => this.abrirBiblioteca());
    this.editor = new Editor({
      content: normalizarDoc(this.modelValue) || { type: 'doc', content: [{ type: 'paragraph' }] },
      extensions: [
        StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
        Placeholder.configure({ placeholder: 'Escribe el contenido del artículo…' }),
        ImagenEnlace.configure({ minWidth: 80, maxWidth: 900 }),
        LinkExt.configure({ openOnClick: false }),
        DestacadoNode,
        PasosNode,
        DocumentoNode,
        VideoNode,
        SlashCommand,
        GlobalDragHandle.configure({ customNodes: ['destacado', 'pasos', 'documentoAdjunto', 'videoEmbed'] }),
      ],
      onUpdate: ({ editor }) => {
        this.$emit('update:modelValue', editor.getJSON());
      },
    });

    // Barra flotante (BubbleMenu v3 es un plugin, no un componente — se registra manualmente)
    if (this.$refs.bubbleMenuEl) {
      this.editor.registerPlugin(
        BubbleMenuPlugin({
          pluginKey: 'bubbleMenu',
          editor: this.editor,
          element: this.$refs.bubbleMenuEl,
        }),
      );
    }
  },
  methods: {
    toggleLink() {
      if (this.editor.isActive('link')) { this.editor.chain().focus().unsetLink().run(); return; }
      const url = window.prompt('URL del enlace');
      if (url) this.editor.chain().focus().setLink({ href: url }).run();
    },
    abrirBiblioteca() {
      this.bibliotecaAbierta = true;
      return new Promise((resolve) => { this.resolverBiblioteca = resolve; });
    },
    onMediaSeleccionado(media) {
      this.resolverBiblioteca?.(media);
      this.resolverBiblioteca = null;
    },
  },
  beforeUnmount() {
    this.editor?.destroy();
  },
  watch: {
    bibliotecaAbierta(val) {
      // Se cerró sin elegir nada (click en backdrop/X) — no dejar la promesa colgada
      if (!val && this.resolverBiblioteca) { this.resolverBiblioteca(null); this.resolverBiblioteca = null; }
    },
    modelValue(val) {
      if (!this.editor) return;
      const current = JSON.stringify(this.editor.getJSON());
      const normalizado = normalizarDoc(val);
      const incoming = JSON.stringify(normalizado);
      if (current !== incoming) this.editor.commands.setContent(normalizado || { type: 'doc', content: [{ type: 'paragraph' }] }, false);
    },
  },
};
</script>

<style scoped>
.tiptap-editor-wrap { position: relative; }
.tiptap-toolbar { margin-bottom: 0.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 12px; }
.guia-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px;
  border: 1px solid var(--border); background: var(--bg-card); color: var(--text-muted);
  font-size: 0.75rem; font-weight: 600; text-decoration: none; transition: color 0.15s, border-color 0.15s;
}
.guia-btn:hover { color: #1864ff; border-color: rgba(24, 100, 255, 0.4); }
.tiptap-hint { font-size: 0.75rem; color: var(--text-muted); }
.tiptap-editable {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
}
</style>
