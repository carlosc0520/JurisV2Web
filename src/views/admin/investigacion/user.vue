<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Investigación" subtitle="Descubre las últimas actualizaciones, análisis y noticias del mundo jurídico" />

    <template v-if="activePanel === 'explorar'">
    <div class="max-w-6xl mx-auto px-4 pt-2">

      <!-- Filtros -->
      <SectionCard class="mb-6">
        <div class="flex flex-wrap items-center gap-3">
          <search-bar
            class="flex-1 min-w-[240px] max-sm:w-full"
            placeholder="Buscar por título o contenido…"
            @search="onSearch"
          />
          <app-select v-model="filter.TIPO" @change="applyFilters">
            <option value="">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat.value" :value="cat.value">{{ cat.text }}</option>
          </app-select>
          <app-select v-model="sortOrder" @change="grid.currentPage = 1">
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguas</option>
          </app-select>
          <button v-if="filter.NOMBRES || filter.TIPO" @click="resetFilters" class="btn btn-secondary btn-sm">
            Limpiar filtros
          </button>
          <button class="btn btn-secondary btn-sm inline-flex items-center gap-1.5" @click="activePanel = 'miespacio'">
            <span>Ir a Mi espacio</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </SectionCard>

      <!-- Loading skeleton -->
      <div v-if="grid.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div v-for="i in 6" :key="i" class="card overflow-hidden animate-pulse">
          <div class="h-44 bg-gray-100 dark:bg-gray-800"></div>
          <div class="p-4 space-y-3">
            <div class="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full w-1/4"></div>
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
            <div class="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3 mt-3"></div>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else-if="paginatedNoticias.length === 0" class="card py-20 text-center">
        <svg class="w-14 h-14 mx-auto mb-4 text-gray-200 dark:text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
        <h3 class="text-base font-bold text-gray-500 dark:text-gray-400 mb-1">No encontramos publicaciones</h3>
        <p class="text-sm text-gray-400">Prueba con otros términos o cambia los filtros</p>
        <button v-if="filter.NOMBRES || filter.TIPO" @click="resetFilters" class="btn btn-secondary btn-sm mt-4">
          Limpiar filtros
        </button>
      </div>

      <!-- Grid de noticias -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <article
          v-for="noticia in paginatedNoticias" :key="noticia.id"
          class="card overflow-hidden flex flex-col cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md p-0"
          @click="openModal(noticia)"
        >
          <!-- Imagen -->
          <div class="relative overflow-hidden h-44 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
            <img v-if="noticia.imagen"
              :src="`${resourcesUrl}${noticia.imagen}`"
              :alt="noticia.titulo"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 dark:from-gray-800 dark:to-gray-700">
              <svg class="w-12 h-12 text-blue-200 dark:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
            </div>
            <!-- Badge categoría -->
            <span v-if="noticia.categoriaNombre"
              class="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/90 text-brand-blue text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm border border-blue-100 dark:border-blue-900">
              {{ noticia.categoriaNombre }}
            </span>
            <!-- Guardar en mi espacio -->
            <button type="button"
              class="absolute bottom-3 right-3 bg-white/95 dark:bg-gray-900/90 p-1.5 rounded-full shadow-sm transition-colors"
              :class="savedIds.has(noticia.id) ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-blue'"
              :title="savedIds.has(noticia.id) ? 'Quitar de mi espacio' : 'Guardar en mi espacio'"
              @click.stop="toggleSave(noticia)">
              <svg width="14" height="14" viewBox="0 0 24 24" :fill="savedIds.has(noticia.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
            </button>
            <!-- Indicador de documento -->
            <span v-if="noticia.archivo"
              class="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400 p-1.5 rounded-full shadow-sm">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </span>
          </div>

          <!-- Contenido -->
          <div class="p-4 flex-1 flex flex-col gap-1.5">
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
              {{ noticia.titulo }}
            </h3>
            <!-- Subtítulo siempre visible si existe -->
            <p v-if="noticia.subtitulo"
              class="text-gray-700 dark:text-gray-300 text-xs font-medium leading-snug line-clamp-2">
              {{ noticia.subtitulo }}
            </p>
            <!-- Preview descripción cuando no hay subtítulo -->
            <p v-else-if="noticia.descripcion"
              class="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">
              {{ stripHtml(noticia.descripcion) }}
            </p>
            <!-- Autores -->
            <div v-if="noticia.autores?.length" class="flex items-center gap-1.5 mt-0.5">
              <div class="flex -space-x-1.5">
                <template v-for="a in noticia.autores.slice(0, 3)" :key="a.id">
                  <img v-if="a.fotografia"
                    :src="a.fotografia"
                    :title="`${a.nombres} ${a.apellidos}`.trim()"
                    class="w-5 h-5 rounded-full border border-white dark:border-gray-800 object-cover" />
                  <span v-else
                    class="w-5 h-5 rounded-full border border-white dark:border-gray-800 bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[9px] font-bold text-brand-blue">
                    {{ a.nombres?.charAt(0) }}
                  </span>
                </template>
              </div>
              <span class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {{ noticia.autores.map(a => `${a.nombres} ${a.apellidos}`.trim()).join(', ') }}
              </span>
            </div>
            <!-- Meta -->
            <div class="flex items-center gap-3 text-[11px] text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800 mt-auto">
              <span v-if="noticia.fechaPublicacion" class="flex items-center gap-1 shrink-0">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ formatDate(noticia.fechaPublicacion) }}
              </span>
              <span v-if="noticia.organoNombre" class="flex items-center gap-1 truncate">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <span class="truncate">{{ noticia.organoNombre }}</span>
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Paginación -->
      <div v-if="!grid.isLoading && totalPages > 1" class="flex justify-center items-center gap-2">
        <button @click="changePage(grid.currentPage - 1)" :disabled="grid.currentPage === 1"
          class="btn btn-secondary btn-sm disabled:opacity-40 disabled:pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button v-for="p in visiblePages" :key="p" @click="changePage(p)"
          :class="['btn btn-sm', p === grid.currentPage ? 'btn-primary' : 'btn-secondary']">
          {{ p }}
        </button>
        <button @click="changePage(grid.currentPage + 1)" :disabled="grid.currentPage === totalPages"
          class="btn btn-secondary btn-sm disabled:opacity-40 disabled:pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

    </div>
    </template>
    <MiEspacioPanel v-else @open-noticia="openNoticiaById" @volver="activePanel = 'explorar'" />

    <!-- Modal detalle -->
    <BaseModal v-model="modal.open" size="2xl" :bodyPadding="'p-0'" @close="modal.open = false">
      <template v-if="modal.item" #default>
        <div class="md:flex">
          <!-- Imagen — columna izquierda, tamaño completo -->
          <div v-if="modal.item.imagen" class="md:w-[42%] flex-shrink-0 bg-gray-100 dark:bg-gray-800">
            <img :src="`${resourcesUrl}${modal.item.imagen}`"
              :alt="modal.item.titulo" class="w-full h-56 md:h-full md:max-h-[600px] object-cover" />
          </div>

          <!-- Detalle — columna derecha -->
          <div class="flex-1 min-w-0 px-6 py-5 space-y-4 md:max-h-[600px] md:overflow-y-auto">
            <!-- Tipo + título -->
            <div>
              <span v-if="modal.item.categoriaNombre"
                class="inline-block text-brand-blue text-[10px] font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full mb-1.5">
                {{ modal.item.categoriaNombre }}
              </span>
              <h4 class="text-[1.05rem] font-bold text-gray-900 dark:text-gray-100 leading-snug">
                {{ modal.item.titulo }}
              </h4>
              <p v-if="modal.item.subtitulo" class="text-gray-600 dark:text-gray-300 font-semibold text-sm leading-relaxed mt-1.5">
                {{ modal.item.subtitulo }}
              </p>
            </div>

            <!-- Meta -->
            <div class="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 pb-4 border-b border-gray-100 dark:border-gray-800">
              <span v-if="modal.item.fechaPublicacion" class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ formatDate(modal.item.fechaPublicacion) }}
              </span>
              <span v-if="modal.item.organoNombre" class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {{ modal.item.organoNombre }}
              </span>
              <!-- Autores en el modal -->
              <div v-if="modal.item.autores?.length" class="flex items-center gap-2 w-full">
                <div class="flex -space-x-2">
                  <template v-for="a in modal.item.autores" :key="a.id">
                    <img v-if="a.fotografia" :src="a.fotografia"
                      :title="`${a.nombres} ${a.apellidos}`.trim()"
                      class="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 object-cover" />
                    <span v-else
                      class="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] font-bold text-brand-blue">
                      {{ a.nombres?.charAt(0) }}
                    </span>
                  </template>
                </div>
                <span class="text-gray-600 dark:text-gray-300">
                  {{ modal.item.autores.map(a => `${a.nombres} ${a.apellidos}`.trim()).join(' · ') }}
                </span>
              </div>
            </div>

            <!-- Descripción rich text -->
            <div v-if="modal.item.descripcion"
              class="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
              v-html="modal.item.descripcion" />

            <!-- Botón documento -->
            <div v-if="modal.item.archivo" class="pt-3 border-t border-gray-100 dark:border-gray-800">
              <button type="button" @click="downloadArticleFile(modal.item)" :disabled="downloadingFile"
                class="btn btn-export btn-sm w-full justify-center disabled:opacity-60 disabled:cursor-wait">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {{ downloadingFile ? 'Descargando...' : 'Descargar documento' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </BaseModal>

  </section>
</template>

<script>
import { toast } from 'vue3-toastify';
import MantenimientoProxy from '@/proxies/MantenimientoProxy';
import NoticiaEspacioProxy from '@/proxies/NoticiaEspacioProxy';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import SectionCard from '@/components/ui/SectionCard.vue';
import SearchBar from '@/components/Common/SearchBar.vue';
import AppSelect from '@/components/Common/AppSelect.vue';
import MiEspacioPanel from './MiEspacioPanel.vue';

export default {
  name: 'InvestigacionUser',
  components: { PageHeader, BaseModal, SectionCard, SearchBar, AppSelect, MiEspacioPanel },
  data() {
    return {
      activePanel: 'explorar', // 'explorar' | 'miespacio'
      dataNoticia: [],
      categorias: [],
      filter: { NOMBRES: null, TIPO: null },
      sortOrder: 'desc',
      grid: { currentPage: 1, perPage: 18, totalRows: 0, isLoading: true },
      modal: { open: false, item: null },
      downloadingFile: false,
      savedIds: new Set(),
      savedIdMap: {},
    };
  },
  computed: {
    // process.env no es un global permitido dentro del <template> del compilador
    // de Vue 3 (rompe con "Cannot read properties of undefined (reading 'env')"),
    // por eso se resuelve aquí y se usa como computed en el template.
    resourcesUrl() {
      return process.env.VUE_APP_RESOURCES_URL || 'https://resources.jurissearch.com';
    },
    sortedNoticias() {
      if (!this.dataNoticia?.length) return [];
      return [...this.dataNoticia].sort((a, b) => {
        const da = a.fechaPublicacion ? new Date(a.fechaPublicacion).getTime() : 0;
        const db = b.fechaPublicacion ? new Date(b.fechaPublicacion).getTime() : 0;
        return this.sortOrder === 'desc' ? db - da : da - db;
      });
    },
    filteredNoticias() {
      if (!this.filter.NOMBRES) return this.sortedNoticias;
      const q = this.filter.NOMBRES.toLowerCase();
      return this.sortedNoticias.filter(n =>
        n.titulo?.toLowerCase().includes(q) ||
        n.subtitulo?.toLowerCase().includes(q) ||
        n.descripcion?.toLowerCase().includes(q)
      );
    },
    paginatedNoticias() {
      const start = (this.grid.currentPage - 1) * this.grid.perPage;
      return this.filteredNoticias.slice(start, start + this.grid.perPage);
    },
    totalPages() {
      return Math.ceil(this.filteredNoticias.length / this.grid.perPage);
    },
    visiblePages() {
      const total = this.totalPages;
      const cur = this.grid.currentPage;
      const delta = 2;
      const pages = [];
      for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) pages.push(i);
      return pages;
    },
  },
  methods: {
    async downloadArticleFile(item) {
      if (!item?.archivo || this.downloadingFile) return;
      this.downloadingFile = true;
      try {
        const blob = await MantenimientoProxy.downloadFile(item.archivo);
        const objectUrl = URL.createObjectURL(new Blob([blob]));
        const ext = item.archivo.split('.').pop();
        const a = document.createElement('a');
        a.href = objectUrl;
        a.setAttribute('download', `${item.titulo || 'documento'}.${ext}`);
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
      } catch {
        toast.error('Error al descargar el documento', { toastId: 'error-download-noticia' });
      } finally {
        this.downloadingFile = false;
      }
    },

    async searchNoticias() {
      this.grid.isLoading = true;
      const params = { ROWS: 1000, INIT: 0, CESTDO: 'A' };
      if (this.filter.TIPO) params.TIPO = this.filter.TIPO;
      await MantenimientoProxy.list(params)
        .then(r => {
          const payload = r?.DATA ?? r;
          const items = Array.isArray(payload) ? payload : (payload?.data ?? []);
          this.dataNoticia = items;
          this.grid.totalRows = this.dataNoticia.length;
          this.grid.currentPage = 1;
        })
        .catch(() => {
          this.dataNoticia = [];
          toast.error('Error al cargar las publicaciones', { toastId: 'error-noticias' });
        })
        .finally(() => { this.grid.isLoading = false; });
    },
    async loadCategorias() {
      try {
        const r = await MantenimientoProxy.listCategorias({ CESTDO: 'A', ROWS: 1000, INIT: 0 });
        const payload = r?.DATA ?? r;
        const items = Array.isArray(payload) ? payload : (payload?.data ?? []);
        this.categorias = items.map(i => ({ value: i.id, text: i.descripcion }));
      } catch { /* ignore */ }
    },
    onSearch(q) {
      this.filter.NOMBRES = q || null;
      this.grid.currentPage = 1;
    },
    applyFilters() {
      this.grid.currentPage = 1;
      this.searchNoticias();
    },
    resetFilters() {
      this.filter.NOMBRES = null;
      this.filter.TIPO = null;
      this.sortOrder = 'desc';
      this.searchNoticias();
    },
    changePage(p) {
      if (p < 1 || p > this.totalPages) return;
      this.grid.currentPage = p;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    openModal(item) { this.modal.item = item; this.modal.open = true; },
    formatDate(dateString) {
      if (!dateString) return '';
      // Fechas tipo "YYYY-MM-DD" (sin hora) se parsean como UTC midnight → agrega T12:00:00 para evitar offset TZ
      const d = typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)
        ? new Date(dateString + 'T12:00:00')
        : new Date(dateString);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    stripHtml(html) {
      if (!html) return '';
      const el = document.createElement('div');
      el.innerHTML = html;
      return (el.textContent || el.innerText || '').trim();
    },

    async loadSavedIds() {
      try {
        const res = await NoticiaEspacioProxy.list({ ROL: 'mios', ROWS: 1000, INIT: 0 });
        const items = Array.isArray(res) ? res : [];
        this.savedIds = new Set(items.map(i => i.IDNOTICIA));
        this.savedIdMap = Object.fromEntries(items.map(i => [i.IDNOTICIA, i.ID]));
      } catch { /* silencioso */ }
    },
    async toggleSave(noticia) {
      const id = noticia.id ?? noticia.ID;
      try {
        if (this.savedIds.has(id)) {
          const savedId = this.savedIdMap[id];
          if (!savedId) return;
          await NoticiaEspacioProxy.unsave(savedId);
          this.savedIds.delete(id);
          delete this.savedIdMap[id];
          toast.success('Quitado de tu espacio');
        } else {
          const res = await NoticiaEspacioProxy.save(id);
          if (res?.STATUS === false && !res?.ID) { toast.error(res.MESSAGE || 'Error al guardar'); return; }
          this.savedIds.add(id);
          if (res?.ID) this.savedIdMap[id] = res.ID;
          toast.success('Guardado en tu espacio');
        }
      } catch {
        toast.error('Error al actualizar tu espacio');
      }
    },
    async openNoticiaById(idNoticia) {
      const existing = this.dataNoticia.find(n => Number(n.id ?? n.ID) === Number(idNoticia));
      if (existing) { this.openModal(existing); return; }
      try {
        const r = await MantenimientoProxy.list({ ID: idNoticia, ROWS: 1, INIT: 0 });
        const payload = r?.DATA ?? r;
        const items = Array.isArray(payload) ? payload : (payload?.data ?? []);
        if (items[0]) this.openModal(items[0]);
        else toast.error('El artículo ya no está disponible');
      } catch {
        toast.error('Error al abrir el artículo');
      }
    },
  },
  watch: {
    activePanel(val) {
      if (val === 'explorar') this.loadSavedIds();
    },
  },
  mounted() {
    this.loadCategorias();
    this.loadSavedIds();
    this.searchNoticias().then(() => {
      if (this.$route.query.panel === 'miespacio') { this.activePanel = 'miespacio'; return; }
      const id = Number(this.$route.query.paramsId || 0);
      if (id) {
        const item = this.dataNoticia.find(n => Number(n.id ?? n.ID) === id);
        if (item) this.$nextTick(() => this.openModal(item));
      }
    });
  },
};
</script>
