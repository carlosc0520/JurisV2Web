<template>
  <section class="min-h-screen flex flex-col" style="background:var(--bg-sunken)">

    <PageHeader :title="isEdit ? 'Editar publicación' : 'Nueva publicación'" subtitle="Editor de contenido con bloques, arrastre y SEO en vivo">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </template>
    </PageHeader>

    <div v-if="loadingInicial" class="flex items-center justify-center py-24">
      <span class="w-8 h-8 border-[3px] border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Editor -->
    <div v-else class="max-w-6xl mx-auto px-4 pt-4 grid lg:grid-cols-[1fr_320px] gap-5">

      <!-- Columna principal -->
      <div class="flex flex-col gap-4 min-w-0">
        <SectionCard>
          <BaseInput v-model="modelo.titulo" label="Título" placeholder="Ingrese el título" required
            :error="validation.firstError('modelo.titulo')" />
        </SectionCard>

        <SectionCard title="Contenido">
          <TiptapEditor v-model="modelo.documento" />
        </SectionCard>
      </div>

      <!-- Sidebar -->
      <aside class="flex flex-col gap-4">
        <SectionCard title="Publicación">
          <template #headerAction>
            <span :class="['estado-pill', `estado-${estadoActual}`]">{{ ESTADOS[estadoActual] }}</span>
          </template>
          <div class="flex flex-col gap-3">
            <BaseInput v-model="modelo.subtitulo" label="Subtítulo" placeholder="Bajada en la página del artículo" />
            <div>
              <label for="pub-resumen" class="block text-sm font-medium mb-1.5 text-content">Resumen</label>
              <textarea id="pub-resumen" v-model="modelo.resumen" rows="4" maxlength="500"
                placeholder="Descripción corta para la tarjeta" class="input-base resumen-textarea" />
              <p class="m-0 mt-1 text-right text-[11px]" style="color:var(--text-muted)">{{ (modelo.resumen || '').length }}/500</p>
            </div>
            <CategoriaSelect v-model="modelo.idCategoria" :categorias="categorias" label="Categoría" required
              :error="validation.firstError('modelo.idCategoria')" />
            <BaseInput v-model="modelo.autor" label="Autor" placeholder="Equipo editorial Juris Search" />

            <div class="flex items-center gap-2.5">
              <input type="checkbox" v-model="modelo.destacado" id="destacado" class="w-4 h-4 rounded cursor-pointer" />
              <label for="destacado" class="text-sm font-medium cursor-pointer" style="color:var(--text)">Destacado</label>
              <span class="text-[11px]" style="color:var(--text-muted)">· reemplaza al destacado actual</span>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium" style="color:var(--text)">
                Imagen de portada <span class="text-brand-pink ml-0.5">*</span>
              </label>
              <div class="dropzone-pub" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileSelect">
                <p v-if="!preview" class="text-xs m-0" style="color:var(--text-muted)">Arrastra o haz clic para seleccionar</p>
                <img v-if="preview" :src="preview" class="w-full max-h-40 object-cover rounded-lg" />
                <input type="file" ref="fileInput" accept="image/*" @change="handleFile" hidden />
              </div>
              <button type="button" class="elegir-biblioteca-btn" @click="bibliotecaAbierta = true">
                O elegir de la biblioteca de medios
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="SEO">
          <BaseInput v-model="modelo.palabraClave" label="Palabra clave objetivo" placeholder="Ej. motivación de sentencias" />
          <div class="mt-3">
            <SeoPanel
              :titulo="modelo.titulo"
              :resumen="modelo.resumen"
              :id-categoria="modelo.idCategoria"
              :imagen="!!preview"
              :palabra-clave="modelo.palabraClave"
              :documento="modelo.documento"
            />
          </div>
        </SectionCard>

        <SectionCard v-if="isEdit" title="Historial de cambios">
          <HistorialPublicacion :key="historialKey" :id-publicacion="id" :limite="4" />
        </SectionCard>
      </aside>
    </div>

    <!-- Barra inferior: se queda abajo al desplazar, solo sobre el área de contenido -->
    <div class="sticky bottom-0 z-30 mt-auto pt-6">
      <div class="barra-acciones">
        <div class="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button v-if="!loadingInicial" type="button" class="preview-toggle" :disabled="generandoPrevia" @click="abrirVistaPrevia">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {{ generandoPrevia ? 'Generando…' : 'Vista previa' }}
            </button>
            <button v-if="previaUrl" type="button" class="preview-toggle" title="Copiar el enlace temporal (válido 24 h)" @click="copiarPrevia">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.17 1.17"/><path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.17-1.17"/></svg>
              Copiar enlace
            </button>
          </div>
          <div class="flex gap-3">
            <CancelButton @click="$router.push('/admin/publicaciones')" :disabled="loadingSubmit" />
            <template v-if="esBorrador">
              <button type="button" class="btn-borrador" :disabled="loadingSubmit" @click="submit('borrador')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Guardar borrador
              </button>
              <button type="button" class="btn-publicar" :disabled="loadingSubmit" @click="submit('publicar')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Publicar
              </button>
            </template>
            <button v-if="!esBorrador && modelo.estado === 'A'" type="button" class="btn-borrador" :disabled="loadingSubmit" @click="pasarABorrador">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Pasar a borrador
            </button>
            <button v-if="!esBorrador" type="button" class="btn-publicar" :disabled="loadingSubmit" @click="submit('guardar')">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <MediaLibraryModal v-model:show="bibliotecaAbierta" tipo-filtro="imagen" @select="onImagenPortadaElegida" />
  </section>
</template>

<script>
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';
import TiptapEditor from './TiptapEditor.vue';
import SeoPanel from './SeoPanel.vue';
import MediaLibraryModal from '@/components/Media/MediaLibraryModal.vue';
import CategoriaSelect from '@/components/Publicaciones/CategoriaSelect.vue';
import HistorialPublicacion from '@/components/Publicaciones/HistorialPublicacion.vue';
import { urlDeMedia } from '@/utils/mediaUrl';
import PublicacionesProxy from '@/proxies/PublicacionesProxy';

const DOC_VACIO = { type: 'doc', content: [{ type: 'paragraph' }] };
const LATIDO_MS = 30000;
const API_URL = process.env.VUE_APP_API_URL || 'https://api.jurissearch.com';

// Identifica a esta pestaña del editor (dos pestañas del mismo usuario también se bloquean)
function nuevoToken() {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
}

const escapar = (t) => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default {
  name: 'PublicacionEditor',
  components: { TiptapEditor, SeoPanel, MediaLibraryModal, CategoriaSelect, HistorialPublicacion },
  props: {
    id: { type: [String, Number], default: null },
  },
  data() {
    return {
      loadingInicial: true,
      loadingSubmit: false,
      generandoPrevia: false,
      previaToken: null,
      previaUrl: '',
      bloqueoToken: nuevoToken(),
      latidoTimer: null,
      historialKey: 0,
      ESTADOS: { nuevo: 'Nuevo', B: 'Borrador', A: 'Publicado', I: 'Inactivo' },
      categorias: [],
      preview: null,
      file: null,
      imagenActual: null,
      bibliotecaAbierta: false,
      modelo: {
        id: null, titulo: '', subtitulo: '', resumen: '',
        idCategoria: null, autor: '', destacado: false, palabraClave: '',
        documento: { ...DOC_VACIO }, estado: null,
      },
    };
  },
  computed: {
    isEdit() { return !!this.id; },
    estadoActual() { return this.modelo.estado || 'nuevo'; },
    // Nuevo o borrador: se puede guardar sin publicar. Publicado/inactivo: "Guardar cambios" conserva el estado.
    esBorrador() { return !this.modelo.estado || this.modelo.estado === 'B'; },
  },
  validators: {
    'modelo.titulo':      v => Validator.value(v).required('Campo requerido'),
    'modelo.idCategoria': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    async cargarCategorias() {
      const r = await PublicacionesProxy.listCategorias({ ROWS: 1000, INIT: 0, CESTDO: 'A' });
      const payload = r?.DATA ?? r;
      this.categorias = payload?.data ?? [];
    },
    async cargarPublicacion() {
      const r = await PublicacionesProxy.findOne(this.id);
      const data = r?.DATA ?? r;
      let documento = { ...DOC_VACIO };
      try { documento = JSON.parse(data.contenido || '{}'); if (!documento.type) documento = { ...DOC_VACIO }; } catch { documento = { ...DOC_VACIO }; }

      this.modelo = {
        id: data.id, titulo: data.titulo, subtitulo: data.subtitulo || '',
        resumen: data.resumen || '', idCategoria: data.idCategoria ? Number(data.idCategoria) : null,
        autor: data.autor || '', destacado: !!data.destacado,
        palabraClave: data.palabraClave || '', documento,
        estado: data.estado || 'A',
      };
      this.imagenActual = data.imagen || null;
      if (data.imagen) this.preview = urlDeMedia(data.imagen);
    },
    triggerFileSelect() { this.$refs.fileInput.click(); },
    handleFile(event) {
      const file = event.target.files[0];
      if (file?.type.startsWith('image/')) { this.preview = URL.createObjectURL(file); this.file = file; this.imagenActual = null; }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) { this.preview = URL.createObjectURL(file); this.file = file; this.imagenActual = null; }
    },
    onImagenPortadaElegida(media) {
      this.preview = media.url;
      this.imagenActual = media.ruta || media.url;
      this.file = null;
    },
    // ── Bloqueo de edición ─────────────────────────────────────
    async tomarBloqueo(forzar = false) {
      const r = await PublicacionesProxy.adquirirBloqueo(this.id, { TOKEN: this.bloqueoToken, FORZAR: forzar });
      const res = r?.DATA ?? r;
      if (res?.STATUS) { this.iniciarLatido(); return true; }
      if (!res?.BLOQUEADO) { toast.error(res?.MESSAGE || 'No se pudo abrir el artículo'); this.salir(); return false; }

      const desde = res.DESDE ? new Date(res.DESDE).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '';
      const { default: Swal } = await import('sweetalert2');
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: 'Artículo en edición',
        html: `<b>${escapar(res.NOMBRE || 'Otro usuario')}</b> lo está editando${desde ? ` desde las ${desde}` : ''}.<br><br>`
          + 'Si tomas posesión, esa persona ya no podrá guardar sus cambios.',
        showCancelButton: true,
        confirmButtonText: 'Tomar posesión',
        cancelButtonText: 'Volver al listado',
        reverseButtons: true,
        allowOutsideClick: false,
      });
      if (isConfirmed) return this.tomarBloqueo(true);
      this.salir();
      return false;
    },
    iniciarLatido() {
      clearInterval(this.latidoTimer);
      this.latidoTimer = setInterval(this.latido, LATIDO_MS);
    },
    async latido() {
      let res;
      try { const r = await PublicacionesProxy.latidoBloqueo(this.id, { TOKEN: this.bloqueoToken }); res = r?.DATA ?? r; }
      catch { return; } // un fallo de red puntual no quita el bloqueo
      if (res?.STATUS || !res?.PERDIDO) return;
      // Se liberó sin que nadie lo tomara (p. ej. la página volvió del historial): se recupera en silencio
      if (!res.NOMBRE) { this.tomarBloqueo(false); return; }

      clearInterval(this.latidoTimer);
      const { default: Swal } = await import('sweetalert2');
      const { isConfirmed } = await Swal.fire({
        icon: 'info',
        title: 'Otro usuario tomó posesión',
        html: `<b>${escapar(res.NOMBRE)}</b> está editando ahora este artículo. Tus cambios sin guardar no se guardarán.`,
        showCancelButton: true,
        confirmButtonText: 'Recuperar posesión',
        cancelButtonText: 'Salir al listado',
        reverseButtons: true,
        allowOutsideClick: false,
      });
      if (isConfirmed) this.tomarBloqueo(true);
      else this.salir();
    },
    liberarBloqueo() {
      clearInterval(this.latidoTimer);
      this.latidoTimer = null;
      if (this.isEdit) PublicacionesProxy.liberarBloqueo(this.id, { TOKEN: this.bloqueoToken }).catch(() => {});
    },
    // Al cerrar la pestaña: keepalive permite que la petición termine aunque la página se descargue
    liberarAlCerrar() {
      if (!this.isEdit || !this.latidoTimer) return;
      try {
        fetch(`${API_URL}/admin/publicaciones/${this.id}/bloqueo/liberar`, {
          method: 'POST', keepalive: true,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` },
          body: JSON.stringify({ TOKEN: this.bloqueoToken }),
        });
      } catch { /* sin conexión: el bloqueo vence solo a los 90 s */ }
    },
    salir() {
      clearInterval(this.latidoTimer);
      this.latidoTimer = null;
      this.$router.push('/admin/publicaciones');
    },

    // ── Vista previa: enlace temporal a la página pública real ──
    datosFormulario() {
      const formData = new FormData();
      if (this.modelo.id) formData.append('ID', this.modelo.id);
      formData.append('TITULO', this.modelo.titulo || '');
      formData.append('SUBTITULO', this.modelo.subtitulo || '');
      formData.append('RESUMEN', this.modelo.resumen || '');
      formData.append('IDCATEGORIA', this.modelo.idCategoria || '');
      formData.append('AUTOR', this.modelo.autor || '');
      formData.append('PALABRA_CLAVE', this.modelo.palabraClave || '');
      formData.append('DESTACADO', this.modelo.destacado ? 'true' : 'false');
      formData.append('DOCUMENTO', JSON.stringify(this.modelo.documento));
      if (this.imagenActual) formData.append('IMAGEN', this.imagenActual);
      if (this.file) formData.append('imagen', this.file);
      return formData;
    },
    async abrirVistaPrevia() {
      // La pestaña se abre ya (dentro del clic) para que el navegador no la bloquee
      const ventana = window.open('', '_blank');
      this.generandoPrevia = true;
      try {
        const formData = this.datosFormulario();
        if (this.previaToken) formData.append('TOKEN_PREVIA', this.previaToken);
        const r = await PublicacionesProxy.guardarPrevia(formData);
        const res = r?.DATA ?? r;
        if (!res?.STATUS) throw new Error(res?.MESSAGE);
        this.previaToken = res.TOKEN;
        this.previaUrl = `${window.location.origin}/publicaciones/previa/${res.TOKEN}`;
        if (ventana) ventana.location.href = this.previaUrl;
        else window.open(this.previaUrl, '_blank');
      } catch (e) {
        ventana?.close();
        toast.error(e?.message || 'No se pudo generar la vista previa');
      } finally {
        this.generandoPrevia = false;
      }
    },
    async copiarPrevia() {
      try {
        await navigator.clipboard.writeText(this.previaUrl);
        toast.success('Enlace de vista previa copiado (válido 24 h)');
      } catch {
        toast.error('No se pudo copiar el enlace');
      }
    },

    // Despublica: el artículo deja de verse en el sitio y vuelve a borrador (con los cambios actuales)
    async pasarABorrador() {
      const { default: Swal } = await import('sweetalert2');
      const { isConfirmed } = await Swal.fire({
        icon: 'question',
        title: '¿Pasar a borrador?',
        html: 'El artículo <b>dejará de verse en el sitio</b> hasta que lo vuelvas a publicar.<br>Los cambios actuales se guardan en el borrador.',
        showCancelButton: true,
        confirmButtonText: 'Sí, pasar a borrador',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      });
      if (isConfirmed) this.submit('borrador');
    },
    // modo: 'borrador' (solo exige título, no publica), 'publicar' o 'guardar' (conserva el estado)
    async submit(modo = 'guardar') {
      if (modo === 'borrador') {
        if (!(await this.$validate('modelo.titulo'))) return;
      } else {
        if (!(await this.$validate())) return;
        if (!this.file && !this.imagenActual) return toast.warning('Seleccione una imagen de portada', { toastId: 'warn-img' });
      }

      this.loadingSubmit = true;
      const loading = toast.loading(modo === 'publicar' ? 'Publicando...' : 'Guardando...');

      const formData = this.datosFormulario();
      formData.append('BLOQUEO_TOKEN', this.bloqueoToken);
      formData.append('MODO', modo);

      await PublicacionesProxy.save(formData)
        .then(r => {
          const result = r?.DATA ?? r;
          if (result.STATUS) {
            if (modo !== 'borrador') {
              toast.success(modo === 'publicar' ? 'Artículo publicado' : 'Cambios guardados');
              this.$router.push('/admin/publicaciones');
              return;
            }
            // Borrador: se sigue editando; si era nuevo, se pasa a la URL de edición del borrador creado
            toast.success('Borrador guardado');
            this.modelo.estado = 'B';
            if (!this.modelo.id && result.ID) this.$router.replace(`/admin/publicaciones/${result.ID}/editar`);
            else this.historialKey++;
          } else {
            toast.error(result.MESSAGE || 'Error al guardar la publicación', { autoClose: result.BLOQUEADO ? 6000 : 3500 });
          }
        })
        .catch(e => toast.error(e?.response?.data?.message || e?.MESSAGE || 'Error al guardar la publicación'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
  },
  beforeUnmount() {
    window.removeEventListener('pagehide', this.liberarAlCerrar);
    this.liberarBloqueo();
  },
  async mounted() {
    this.loadingInicial = true;
    try {
      await this.cargarCategorias();
      if (this.isEdit) {
        await this.cargarPublicacion();
        window.addEventListener('pagehide', this.liberarAlCerrar);
        await this.tomarBloqueo(false);
      }
    } catch (e) {
      toast.error('Error al cargar los datos', { toastId: 'error-cargar' });
    } finally {
      this.loadingInicial = false;
    }
  },
};
</script>

<style scoped>
.dropzone-pub {
  @apply border-2 border-dashed rounded-xl p-4 cursor-pointer flex items-center justify-center transition-colors duration-200;
  border-color: var(--border);
  min-height: 90px;
}
.dropzone-pub:hover { border-color: var(--brand-blue, #1864ff); }
.elegir-biblioteca-btn {
  @apply text-xs font-semibold mt-1 self-start;
  color: var(--brand-blue, #1864ff);
  background: none; border: none; cursor: pointer; padding: 0;
}
.elegir-biblioteca-btn:hover { text-decoration: underline; }
.resumen-textarea { height: auto; min-height: 96px; resize: vertical; line-height: 1.5; padding-top: 10px; padding-bottom: 10px; }
.estado-pill {
  @apply inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold;
}
.estado-pill::before { content: ''; width: 6px; height: 6px; border-radius: 9999px; background: currentColor; }
.estado-nuevo, .estado-B { background: #fff4d6; color: #a16207; }
.estado-A { background: #e7f8ef; color: #15803d; }
.estado-I { background: #f1f2f5; color: #6b7280; }
.btn-borrador, .btn-publicar {
  @apply inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all;
}
.btn-borrador { background: var(--bg-card); border: 1px solid var(--border); color: var(--text); }
.btn-borrador:hover:not(:disabled) { border-color: #a16207; color: #a16207; }
.btn-publicar { background: linear-gradient(135deg, #e71fb3, #1864ff); color: #fff; box-shadow: 0 6px 16px rgba(110, 60, 230, 0.25); }
.btn-publicar:hover:not(:disabled) { box-shadow: 0 8px 22px rgba(110, 60, 230, 0.35); }
.btn-borrador:disabled, .btn-publicar:disabled { opacity: 0.6; cursor: wait; }
.barra-acciones {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  box-shadow: 0 -6px 18px rgba(15, 23, 42, 0.05);
}
.preview-toggle {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
}
.preview-toggle:disabled { opacity: 0.6; cursor: wait; }
.preview-toggle:hover { border-color: var(--brand-blue, #1864ff); color: var(--brand-blue, #1864ff); }
</style>
