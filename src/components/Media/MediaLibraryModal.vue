<template>
  <BaseModal v-model="isShow" title="Biblioteca de medios" size="2xl" @close="handleClose">
    <div class="flex flex-col gap-4">

      <!-- Subir -->
      <div class="upload-zone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileSelect">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span v-if="!subiendo">Arrastra un archivo aquí o haz clic para subirlo</span>
        <span v-else>Subiendo… {{ progreso }}%</span>
        <input type="file" ref="fileInput" accept="image/*,application/pdf" @change="handleFile" hidden />
      </div>
      <p class="text-xs -mt-2" style="color:var(--text-muted)">Imágenes hasta {{ maxImagen }}MB · PDF hasta {{ maxDocumento }}MB</p>

      <!-- Filtros -->
      <div class="flex flex-wrap items-center gap-2">
        <button v-for="t in tabs" :key="t.value" type="button" @click="cambiarTab(t.value)"
          :class="['tab-btn', tab === t.value ? 'tab-btn-active' : '']">{{ t.label }}</button>
        <div class="flex-1 min-w-[160px]">
          <BaseInput v-model="busqueda" placeholder="Buscar por nombre…" @enter="buscar" />
        </div>
      </div>

      <!-- Grid -->
      <div v-if="cargando && !items.length" class="flex items-center justify-center py-16">
        <span class="w-7 h-7 border-[3px] border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
      <div v-else-if="!items.length" class="text-center py-16 text-sm" style="color:var(--text-muted)">
        No hay archivos todavía.
      </div>
      <div v-else class="media-grid">
        <button v-for="m in items" :key="m.id" type="button" class="media-item" @click="seleccionar(m)">
          <img v-if="m.categoria === 'imagen'" :src="urlDe(m.ruta)" :alt="m.nombre" loading="lazy" />
          <div v-else class="media-item-doc">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <span class="media-item-nombre">{{ m.nombre }}</span>
          <span class="media-item-eliminar" @click.stop="eliminar(m)" title="Eliminar">✕</span>
        </button>
      </div>

      <button v-if="hayMas" type="button" class="cargar-mas" :disabled="cargando" @click="cargarMas">
        {{ cargando ? 'Cargando…' : 'Cargar más' }}
      </button>

      <!-- Enlace externo -->
      <div class="pt-3" style="border-top:1px solid var(--border)">
        <label class="text-xs font-medium block mb-1.5" style="color:var(--text-muted)">O pega el enlace de una imagen externa</label>
        <div class="flex gap-2">
          <BaseInput v-model="urlExterna" placeholder="https://…" class="flex-1" />
          <button type="button" class="usar-url-btn" :disabled="!urlExterna" @click="usarUrlExterna">Usar</button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import MediaProxy from '@/proxies/MediaProxy';

const RESOURCES_URL = process.env.VUE_APP_RESOURCES_URL || 'https://resources.jurissearch.com';
const PER_PAGE = 18;

export default {
  name: 'MediaLibraryModal',
  props: {
    show:        { type: Boolean, default: false },
    tipoFiltro:  { type: String,  default: null }, // 'imagen' | 'documento' | null
  },
  emits: ['update:show', 'select'],
  data() {
    return {
      isShow: false,
      items: [],
      pagina: 1,
      total: 0,
      cargando: false,
      subiendo: false,
      progreso: 0,
      busqueda: '',
      tab: this.tipoFiltro || '',
      urlExterna: '',
      maxImagen: 5,
      maxDocumento: 15,
    };
  },
  computed: {
    tabs() {
      const base = [{ label: 'Todas', value: '' }, { label: 'Imágenes', value: 'imagen' }, { label: 'Documentos', value: 'documento' }];
      return this.tipoFiltro ? base.filter((t) => !t.value || t.value === this.tipoFiltro) : base;
    },
    hayMas() { return this.items.length < this.total; },
  },
  methods: {
    urlDe(ruta) { return `${RESOURCES_URL}${ruta}`; },
    async cargarPagina(reset) {
      this.cargando = true;
      try {
        const r = await MediaProxy.list({
          ROWS: PER_PAGE, INIT: reset ? 0 : this.items.length,
          DESC: this.busqueda || undefined, categoria: this.tab || undefined,
        });
        const payload = r?.DATA ?? r;
        const nuevos = payload?.data ?? [];
        this.items = reset ? nuevos : [...this.items, ...nuevos];
        this.total = payload?.total ?? 0;
      } catch {
        toast.error('Error al cargar la biblioteca de medios', { toastId: 'error-media' });
      } finally {
        this.cargando = false;
      }
    },
    cargarMas() { this.cargarPagina(false); },
    buscar() { this.cargarPagina(true); },
    cambiarTab(v) { this.tab = v; this.cargarPagina(true); },
    triggerFileSelect() { this.$refs.fileInput.click(); },
    handleFile(e) { const f = e.target.files[0]; if (f) this.subirArchivo(f); },
    handleDrop(e) { const f = e.dataTransfer.files[0]; if (f) this.subirArchivo(f); },
    async subirArchivo(file) {
      this.subiendo = true;
      this.progreso = 0;
      await MediaProxy.upload(file, (evt) => { this.progreso = Math.round((evt.loaded / evt.total) * 100); })
        .then((r) => {
          const result = r?.DATA ?? r;
          if (result.STATUS) {
            toast.success('Archivo subido correctamente');
            this.items.unshift(result.MEDIA);
            this.total += 1;
          } else {
            toast.error(result.MESSAGE || 'Error al subir el archivo');
          }
        })
        .catch((e) => toast.error(e?.response?.data?.message || e?.MESSAGE || 'Error al subir el archivo'))
        .finally(() => { this.subiendo = false; if (this.$refs.fileInput) this.$refs.fileInput.value = ''; });
    },
    async eliminar(m) {
      if (!window.confirm(`¿Eliminar "${m.nombre}"? Esta acción no se puede deshacer.`)) return;
      await MediaProxy.remove(m.id)
        .then((r) => {
          const result = r?.DATA ?? r;
          if (result.STATUS) {
            toast.success('Archivo eliminado');
            this.items = this.items.filter((i) => i.id !== m.id);
            this.total -= 1;
          } else toast.error(result.MESSAGE);
        })
        .catch(() => toast.error('Error al eliminar el archivo'));
    },
    seleccionar(m) {
      this.$emit('select', { url: this.urlDe(m.ruta), ruta: m.ruta, nombre: m.nombre, categoria: m.categoria });
      this.handleClose();
    },
    usarUrlExterna() {
      if (!this.urlExterna) return;
      this.$emit('select', { url: this.urlExterna, ruta: null, nombre: this.urlExterna, categoria: 'imagen' });
      this.urlExterna = '';
      this.handleClose();
    },
    handleClose() { this.$emit('update:show', false); },
  },
  watch: {
    show(val) {
      this.isShow = val;
      if (val) { this.tab = this.tipoFiltro || ''; this.busqueda = ''; this.cargarPagina(true); }
    },
  },
};
</script>

<style scoped>
.upload-zone {
  @apply flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-5 cursor-pointer text-sm transition-colors;
  border-color: var(--border);
  color: var(--text-muted);
}
.upload-zone:hover { border-color: var(--brand-blue, #1864ff); color: var(--brand-blue, #1864ff); }

.tab-btn {
  @apply px-3 py-1.5 rounded-lg text-xs font-semibold transition-all;
  background: var(--bg-sunken);
  color: var(--text-muted);
}
.tab-btn-active { background: linear-gradient(135deg, #e71fb3, #1864ff); color: #fff; }

.media-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.75rem;
  max-height: 340px; overflow-y: auto; overflow-x: hidden;
  padding: 4px; margin: -4px;
}
.media-item {
  position: relative; aspect-ratio: 1; border-radius: 0.6rem; overflow: hidden;
  border: 1px solid var(--border); background: var(--bg-sunken); cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 0.4rem; transition: all 0.15s;
}
.media-item:hover { border-color: var(--brand-blue, #1864ff); transform: translateY(-2px); }
.media-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 0.4rem; }
.media-item-doc { display: flex; flex-direction: column; align-items: center; color: var(--text-muted); padding-top: 0.5rem; }
.media-item-nombre {
  position: absolute; bottom: 0; left: 0; right: 0; padding: 0.25rem 0.4rem;
  font-size: 0.6rem; color: #fff; background: rgba(0,0,0,0.55);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.media-item-eliminar {
  position: absolute; top: 0.25rem; right: 0.25rem; width: 1.1rem; height: 1.1rem; border-radius: 9999px;
  background: rgba(0,0,0,0.6); color: #fff; font-size: 0.6rem; display: flex; align-items: center; justify-content: center;
}
.media-item-eliminar:hover { background: #dc2626; }

.cargar-mas {
  @apply self-center text-xs font-semibold px-4 py-2 rounded-lg transition-all;
  background: var(--bg-sunken); color: var(--text);
}
.cargar-mas:hover { color: var(--brand-blue, #1864ff); }

.usar-url-btn {
  @apply px-4 rounded-lg text-sm font-semibold transition-all;
  background: var(--bg-sunken); color: var(--text);
}
.usar-url-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.usar-url-btn:not(:disabled):hover { color: var(--brand-blue, #1864ff); }
</style>
