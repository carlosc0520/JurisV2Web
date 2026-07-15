<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Filtros y Magistrados" subtitle="Gestión de filtros jerárquicos y magistrados del sistema">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-4 flex flex-col gap-4">

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <button v-for="tab in tabs" :key="tab.id"
          :disabled="tab.disabled"
          @click="!tab.disabled && updateActive(tab.id)"
          :class="['flex flex-1 items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all',
            active == tab.id
              ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue'
              : tab.disabled
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800']">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="tab.icon"/>
          {{ tab.label }}
        </button>
      </div>

      <!-- Breadcrumb when navigating filter levels -->
      <div v-if="active > 1" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        <span class="font-medium">
          {{ active == 2 ? title.ID2 :
             active == 3 ? `${title.ID2} > ${title.ID3}` :
             active == 4 ? `${title.ID2} > ${title.ID3} > ${title.ID4}` :
             active == 5 ? `${title.ID2} > ${title.ID3} > ${title.ID4} > ${title.ID5}` :
             active == 6 ? `${title.ID2} > ${title.ID3} > ${title.ID4} > ${title.ID5} > ${title.ID6}` : '' }}
        </span>
      </div>

      <!-- Filters -->
      <SectionCard>
        <div class="flex flex-wrap items-center gap-3">

          <search-bar
            class="flex-1 min-w-[240px]"
            :placeholder="active == 0 ? 'Buscar por nombres, apellidos...' : 'Buscar por descripción...'"
            @search="q => { filter.NOMBRES = q || null; triggerSearch(); }"
          />

          <app-select v-if="active != 0" v-model="filter.OPTION" @change="triggerSearch">
            <option value="1">Jurisprudencia</option>
            <option value="2">Legislación</option>
          </app-select>

          <app-select v-model="filter.CDESTDO" @change="triggerSearch">
            <option :value="''">Todos los estados</option>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </app-select>

          <search-button @click="triggerSearch" />
          <new-button label="Crear" @click="() => { if (active == 0) modalAgregarMagistrados.show = true; else modalAgregarFiltros.show = true; }" />

          <button v-if="[2,3,4,5,6].includes(Number(active))"
            type="button"
            class="btn h-9 px-4 text-sm font-semibold rounded-xl inline-flex items-center gap-2 transition-all"
            style="background:var(--bg-card); color:var(--text); border:1px solid var(--border);"
            @click="goBack">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Regresar
          </button>

        </div>
      </SectionCard>

      <!-- Tables -->
      <data-table v-if="active == 0" :search="searchMagistrados" :fields="fieldsMagistrados" :items="dataMagistrados" :grid="grid" :actions="actionsMagistrados"/>
      <data-table v-if="active != 0" :search="searchFiltros"     :fields="fieldsFiltros"     :items="dataFiltros"     :grid="grid" :actions="actionsFiltros"/>
    </div>

    <!-- Modales -->
    <ModalAgregarFIltro :show="modalAgregarFiltros.show" :close="() => modalAgregarFiltros.show = false"
      :update="() => searchFiltros(grid.currentPage, grid.perPage, active==1 ? null : Niveles?.[`ID${Number(active)-1}`])"
      :active="active" :data="dataFilter" :niveles="Niveles"/>
    <ModalEditarFiltro :show="modalEditarFiltros.show" :close="() => modalEditarFiltros.show = false"
      :update="() => searchFiltros(grid.currentPage, grid.perPage, active==1 ? null : Niveles?.[`ID${Number(active)-1}`])"
      :active="active" :data="modalEditarFiltros.data" :niveles="Niveles"/>
    <ModalAgregarMagistrado :show="modalAgregarMagistrados.show" :close="() => modalAgregarMagistrados.show = false"
      :update="() => searchMagistrados(grid.currentPage, grid.perPage)"/>
    <ModalEditarMagistrado :show="modalEditarMagistrados.show" :close="() => modalEditarMagistrados.show = false"
      :update="() => searchMagistrados(grid.currentPage, grid.perPage)" :data="modalEditarMagistrados.data"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado de este registro?" buttonOk="Si, cambiar"
      :action="deleteRowMagistrados" :openDelete="modalEliminarMagistrados.show"
      :closeHandler="() => modalEliminarMagistrados.show = false"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado de este registro?" buttonOk="Si, cambiar"
      :action="deleteRowFiltros" :openDelete="modalEliminarFiltros.show"
      :closeHandler="() => modalEliminarFiltros.show = false"/>
  </section>
</template>

<script>
import DataTable from "@/components/Tables/DataTable.vue";
import { toast } from 'vue3-toastify';
import ModalEliminar from "../shared/ModalEliminar.vue";
import ModalAgregarMagistrado from "./modals/ModalAgregarMagistrado.vue";
import ModalEditarMagistrado from "./modals/ModalEditarMagistrado.vue";
import ModalAgregarFIltro from "./modals/ModalAgregarFIltro.vue";
import ModalEditarFiltro from "./modals/ModalEditarFiltro.vue";
import MagistradoProxy from "@/proxies/Magistrados.Proxy";
import FilterProxy from '@/proxies/FilterProxy';

export default {
  components: { DataTable, ModalEliminar, ModalAgregarMagistrado, ModalEditarMagistrado, ModalAgregarFIltro, ModalEditarFiltro },
  data() {
    return {
      tabs: [
        { id: '0', label: 'Magistrados', disabled: false, icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
        { id: '1', label: 'Filtros',     disabled: false, icon: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>' },
        { id: '2', label: 'Nivel 2',     disabled: true,  icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
        { id: '3', label: 'Nivel 3',     disabled: true,  icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
        { id: '4', label: 'Nivel 4',     disabled: true,  icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
        { id: '5', label: 'Nivel 5',     disabled: true,  icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
        { id: '6', label: 'Nivel 6',     disabled: true,  icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
      ],
      active: '0',
      dataMagistrados: [], dataFiltros: [],
      grid: { items: [], currentPage: 1, perPage: 10, totalRows: 120, isLoading: true, pageOptions: [5,10,15,50] },
      fieldsMagistrados: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'NOMBRES_C', label: 'Nombres y Apellidos' },
        { key: 'FEDCN', label: 'Fecha de Edición', sortable: true, class: 'text-center w-130' },
        { key: 'UEDCN', label: 'U. Edición', sortable: true, class: 'text-center w-130' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
        { key: 'ACCIONES', label: 'Acciones', class: 'text-center w-130' },
      ],
      actionsMagistrados: { edit: { label: 'Editar', icon: 'fas fa-edit', class: 'btn-edit', action: null }, delete: { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: null } },
      fieldsFiltros: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'VALUE', label: '', class: 'd-none' },
        { key: 'LABEL', label: 'Descripción', width: '30%' },
        { key: 'TIPO', label: 'Tipo', class: 'text-left' },
        { key: 'FCRCN', label: 'Fecha de Ingreso', sortable: true, class: 'text-center w-130' },
        { key: 'UCRCN', label: 'U. Creación', sortable: true, class: 'text-center w-130' },
        { key: 'FEDCN', label: 'Fecha de Edición', sortable: true, class: 'text-center w-130' },
        { key: 'UEDCN', label: 'U. Edición', sortable: true, class: 'text-center w-130' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
        { key: 'ACCIONES', label: 'Acciones', class: 'text-center w-130' },
      ],
      actionsFiltros: { edit: { label: 'Editar', icon: 'fas fa-edit', class: 'btn-edit', action: null }, delete: { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: null }, view: { label: 'Ver', icon: 'fas fa-eye', class: 'btn-view', action: null } },
      modalAgregarMagistrados: { show: false, data: null }, modalEditarMagistrados: { show: false, data: null }, modalEliminarMagistrados: { show: false, data: null },
      modalAgregarFiltros:     { show: false, data: null }, modalEditarFiltros:     { show: false, data: null }, modalEliminarFiltros:     { show: false, data: null },
      filter: { NOMBRES: null, CDESTDO: '', OPTION: '1' },
      Niveles: { ID1: null, ID2: null, ID3: null, ID4: null, ID5: null, ID6: null },
      title:   { ID2: null, ID3: null, ID4: null, ID5: null, ID6: null },
      dataFilter: {},
      IDFILTER: null,
    };
  },
  methods: {
    triggerSearch() {
      if (this.active == '0') this.searchMagistrados(1, this.grid.perPage);
      else this.searchFiltros(1, this.grid.perPage, Number(this.active) === 1 ? null : this.Niveles[`ID${Number(this.active)-1}`]);
    },
    async searchMagistrados(currentPage, perPage) {
      this.grid.isLoading = true;
      await MagistradoProxy.list({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.NOMBRES||null, CESTDO: this.filter?.CDESTDO||null }, this.active)
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.dataMagistrados = rows.map((u, i) => ({
            ...u,
            RN: i + 1 + (currentPage - 1) * perPage,
            ID: u.ID || u.id,
            NOMBRES_C: u.NOMBRES_C || (u.apellidos ? `${u.apellidos}, ${u.nombres || ''}` : u.nombres) || '—',
            CDESTDO: u.CDESTDO || u.estado || 'I',
            FCRCN: u.FCRCN || u.fechaCreacion || null,
            UCRCN: u.UCRCN || u.usuarioCreacion || '—',
            FEDCN: u.FEDCN || u.fechaEdicion || null,
            UEDCN: u.UEDCN || u.usuarioEdicion || '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => { this.dataMagistrados = []; toast.error(err?.MESSAGE||'Error al cargar los magistrados', { toastId: 'error-magistrados' }); })
        .finally(() => this.grid.isLoading = false);
    },
    tipoLabel(tipo) {
      if (!tipo || tipo === '—') return '—';
      if (tipo === '1' || tipo === 1 || String(tipo).toUpperCase() === 'JURISPRUDENCIA') return 'JURISPRUDENCIA';
      if (tipo === '2' || tipo === 2 || String(tipo).toUpperCase() === 'LEGISLACIÓN' || String(tipo).toUpperCase() === 'LEGISLACION') return 'LEGISLACIÓN';
      return String(tipo);
    },
    async searchFiltros(currentPage, perPage, ID = null) {
      ID = this.IDFILTER || ID;
      this.grid.isLoading = true;
      const nivel = Number(this.active) === 5 ? 6 : Number(this.active) === 6 ? 7 : Number(this.active);
      await FilterProxy.list({ ROWS: perPage, INIT: (currentPage-1)*perPage, NIVEL: nivel, DESC: this.filter?.NOMBRES||null, ID: ID||null }, this.filter.OPTION, this.filter?.CDESTDO||null)
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.dataFiltros = rows.map((u, i) => ({
            ...u,
            RN: i + 1 + (currentPage - 1) * perPage,
            VALUE: u.VALUE ?? u.id,
            LABEL: u.LABEL || u.descripcion || '—',
            TIPO: this.tipoLabel(u.TIPO || u.tipo),
            CDESTDO: u.CDESTDO || u.estado || 'I',
            FCRCN: u.FCRCN || u.fechaCreacion || null,
            UCRCN: u.UCRCN || u.usuarioCreacion || '—',
            FEDCN: u.FEDCN || u.fechaEdicion || null,
            UEDCN: u.UEDCN || u.usuarioEdicion || '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => {
          this.dataFiltros = [];
          const msg = err?.response?.data?.message;
          const text = Array.isArray(msg) ? msg.join(', ') : (msg || err?.MESSAGE || 'Error al cargar los filtros');
          toast.error(text, { toastId: 'error-filtros' });
        })
        .finally(() => this.grid.isLoading = false);
    },
    updateActive(text) {
      this.active = text;
      this.filter = { NOMBRES: null, CDESTDO: null, OPTION: '1' };
      this.grid = { ...this.grid, perPage: 10, currentPage: 1, loading: false };
      if (text == '0') this.searchMagistrados(1, this.grid.perPage);
      else {
        if (text == '1') this.Niveles = { ID1: null, ID2: null, ID3: null, ID4: null, ID5: null, ID6: null };
        this.searchFiltros(1, this.grid.perPage);
      }
    },
    goBack() {
      this.active = String(Number(this.active) - 1);
      this.IDFILTER = Number(this.active) === 1 ? null : this.Niveles[`ID${Number(this.active)-1}`];
      this.searchFiltros(1, this.grid.perPage, this.IDFILTER);
    },
    async editMagistrados(data) { if (!data.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-edit' }); this.modalEditarMagistrados.data = data; this.modalEditarMagistrados.show = true; },
    async deleteRowMagistrados() {
      if (!this.modalEliminarMagistrados.data?.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-delete' });
      await MagistradoProxy.delete(this.modalEliminarMagistrados.data.ID)
        .then(r => { if (r.STATUS) { toast.success('Magistrado eliminado correctamente', { toastId: 'success-delete' }); this.searchMagistrados(this.grid.currentPage, this.grid.perPage); this.modalEliminarMagistrados.show = false; } else toast.error(r.MESSAGE, { toastId: 'error-delete' }); })
        .catch(err => toast.error(err?.MESSAGE||'Error', { toastId: 'error-delete' }));
    },
    async editFiltros(data) { if (!data.VALUE) return toast.warning('No se encontró el ID', { toastId: 'warning-edit' }); this.modalEditarFiltros.data = data; this.modalEditarFiltros.show = true; },
    async deleteRowFiltros() {
      if (!this.modalEliminarFiltros.data?.VALUE) return toast.warning('No se encontró el ID', { toastId: 'warning-delete' });
      await FilterProxy.delete(this.modalEliminarFiltros.data.VALUE)
        .then(r => { if (r.STATUS) { toast.success('Filtro eliminado correctamente', { toastId: 'success-delete' }); this.searchFiltros(this.grid.currentPage, this.grid.perPage, this.active==1?null:this.Niveles?.[`ID${Number(this.active)-1}`]); this.modalEliminarFiltros.show = false; } else toast.error(r.MESSAGE, { toastId: 'error-delete' }); })
        .catch(err => toast.error(err?.MESSAGE||'Error', { toastId: 'error-delete' }));
    },
    async viewFiltros(data) {
      this.dataFilter = data;
      if (this.active == 6) return;
      this.filter = { NOMBRES: null, CDESTDO: null, OPTION: '1' };
      this.Niveles = { ...this.Niveles, [`ID${Number(this.active)}`]: data?.VALUE||null };
      this.active = String(Number(this.active) + 1);
      this.title = { ...this.title, [`ID${Number(this.active)}`]: data?.LABEL||'' };
      this.IDFILTER = data?.VALUE||null;
      this.searchFiltros(1, this.grid.perPage, this.IDFILTER);
    },
  },
  mounted() {
    this.actionsMagistrados = { ...this.actionsMagistrados, edit: { ...this.actionsMagistrados.edit, action: d => this.editMagistrados(d) }, delete: { ...this.actionsMagistrados.delete, action: d => { this.modalEliminarMagistrados.show = true; this.modalEliminarMagistrados.data = d; } } };
    this.actionsFiltros     = { ...this.actionsFiltros, edit: { ...this.actionsFiltros.edit, action: d => this.editFiltros(d) }, delete: { ...this.actionsFiltros.delete, action: d => { this.modalEliminarFiltros.show = true; this.modalEliminarFiltros.data = d; } }, view: { ...this.actionsFiltros.view, action: d => this.viewFiltros(d) } };
    this.searchMagistrados(this.grid.currentPage, this.grid.perPage);
  },
  watch: {
    active(v) {
      this.grid = { ...this.grid, perPage: 10, currentPage: 1, loading: false };
      if (v == '0') this.searchMagistrados(1, this.grid.perPage);
    },
  },
};
</script>
