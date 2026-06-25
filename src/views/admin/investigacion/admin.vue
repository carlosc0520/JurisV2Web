<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Investigación" subtitle="Gestión de noticias, autores, categorías y recursos">
      <template #icon>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-4 flex flex-col gap-4">

      <!-- Tabs -->
      <div class="flex gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <button v-for="tab in tabs" :key="tab.id" @click="updateActive(tab.id)"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
            active === tab.id
              ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800']">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="tab.icon"/>
          {{ tab.label }}
        </button>
      </div>

      <!-- Filters -->
      <SectionCard>
        <div class="flex flex-wrap items-center gap-3">

          <search-bar
            class="flex-1 min-w-[240px]"
            :placeholder="`Buscar por ${active==='noticias'?'investigación':active==='autores'?'autor':active==='categorias'?'categoría':'recurso'}...`"
            @search="q => { filter.NOMBRES = q || null; triggerSearch(); }"
          />

          <app-select v-if="active === 'noticias'" v-model="filter.TIPO" @change="triggerSearch">
            <option :value="''">-- Seleccione Tipo</option>
            <option v-for="opt in selects.categorias" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </app-select>

          <app-select v-model="filter.CDESTDO" @change="triggerSearch">
            <option :value="''">Todos los estados</option>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </app-select>

          <search-button @click="triggerSearch" />
          <new-button label="Crear" @click="openCreateModal" />

        </div>
      </SectionCard>

      <!-- Tables -->
      <data-table v-if="active==='noticias'"   :active="active" title="" :search="searchNoticias"   :fields="fieldsNoticias"   :items="dataNoticia"    :grid="grid" :actions="actionsNoticias"/>
      <data-table v-if="active==='autores'"     :active="active" title="" :search="searchAutores"     :fields="fieldsAutores"     :items="dataAutores"     :grid="grid" :actions="actionsAutores"/>
      <data-table v-if="active==='categorias'"  :active="active" title="" :search="searchCategorias"  :fields="fieldsCategorias"  :items="dataCategorias"  :grid="grid" :actions="actionsCategorias"/>
      <data-table v-if="active==='recursos'"    :active="active" title="" :search="searchRecursos"    :fields="fieldsRecursos"    :items="dataRecursos"    :grid="grid" :actions="actionsRecursos"/>
    </div>

    <!-- Modales -->
    <ModalNoticiaAgregar  :role="role" :show="modalAgregarNoticia.show"  :close="() => modalAgregarNoticia.show = false"  :selects="selects" :update="() => searchNoticias(grid.currentPage, grid.perPage)"/>
    <ModalNoticiaEditar   :role="role" :show="modalEditarNoticia.show"   :close="() => modalEditarNoticia.show = false"   :selects="selects" :update="() => searchNoticias(grid.currentPage, grid.perPage)" :data="modalEditarNoticia.data"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado de la investigación?" buttonOk="Sí, cambiar" :action="deleteRowNoticia" :openDelete="modalEliminarNoticia.show" :closeHandler="() => modalEliminarNoticia.show = false"/>

    <ModalAutorAgregar    :role="role" :show="modalAgregarAutor.show"    :close="() => modalAgregarAutor.show = false"    :update="() => searchAutores(grid.currentPage, grid.perPage)"/>
    <ModalAutorEditar     :role="role" :show="modalEditarAutor.show"     :close="() => modalEditarAutor.show = false"     :update="() => searchAutores(grid.currentPage, grid.perPage)" :data="modalEditarAutor.data"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado del autor?" buttonOk="Sí, cambiar" :action="deleteAutor" :openDelete="modalEliminarAutor.show" :closeHandler="() => modalEliminarAutor.show = false"/>

    <ModalCategoriaAgregar :role="role" :show="modalAgregarCategoria.show" :close="() => modalAgregarCategoria.show = false" :update="updateCategoriasData"/>
    <ModalCategoriaEditar  :role="role" :show="modalEditarCategoria.show"  :close="() => modalEditarCategoria.show = false"  :update="updateCategoriasData" :data="modalEditarCategoria.data"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado de la categoría?" buttonOk="Sí, cambiar" :action="deleteCategoria" :openDelete="modalEliminarCategoria.show" :closeHandler="() => modalEliminarCategoria.show = false"/>

    <ModalRecursoAgregar  :role="role" :show="modalAgregarRecurso.show"  :close="() => modalAgregarRecurso.show = false"  :update="() => searchRecursos(grid.currentPage, grid.perPage)"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado del recurso?" buttonOk="Sí, cambiar" :action="deleteRecurso" :openDelete="modalEliminarRecurso.show" :closeHandler="() => modalEliminarRecurso.show = false"/>
  </section>
</template>

<script>
import DataTable from "@/components/Tables/DataTable.vue";
import { toast } from 'vue3-toastify';
import ModalEliminar from "../shared/ModalEliminar.vue";
import ModalNoticiaAgregar from "./modals/ModalNoticiaAgregar.vue";
import ModalNoticiaEditar from "./modals/ModalNoticiaEditar.vue";
import ModalCategoriaAgregar from "./modals/ModalCategoriaAgregar.vue";
import ModalCategoriaEditar from "./modals/ModalCategoriaEditar.vue";
import ModalAutorAgregar from "./modals/ModalAutorAgregar.vue";
import ModalAutorEditar from "./modals/ModalAutorEditar.vue";
import ModalRecursoAgregar from "./modals/ModalRecursoAgregar.vue";
import MantenimientoProxy from '@/proxies/MantenimientoProxy';
import filterProxy from '@/proxies/FilterProxy';

export default {
  components: {
    DataTable,
    ModalEliminar, ModalNoticiaAgregar, ModalNoticiaEditar,
    ModalCategoriaAgregar, ModalCategoriaEditar,
    ModalAutorAgregar, ModalAutorEditar, ModalRecursoAgregar,
  },
  data() {
    return {
      tabs: [
        { id: 'noticias',   label: 'Investigación', icon: '<path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>' },
        { id: 'autores',    label: 'Autores',       icon: '<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>' },
        { id: 'categorias', label: 'Categorías',    icon: '<path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>' },
        { id: 'recursos',   label: 'Recursos',      icon: '<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
      ],
      active: 'noticias',
      dataNoticia: [], dataAutores: [], dataCategorias: [], dataRecursos: [],
      grid: { items: [], currentPage: 1, perPage: 10, totalRows: 0, isLoading: true, pageOptions: [5,10,15,50] },
      fieldsNoticias: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'DTIPO', label: 'Tipo', width: '15%' },
        { key: 'TITULO', label: 'Título', width: '30%' },
        { key: 'FCRCN', label: 'Fecha de Creación', sortable: true, class: 'text-center' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
      ],
      fieldsAutores: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'AUTOR', label: 'Nombres y Apellidos', width: '50%', formatter: (_v, _k, item) => `<div class="d-flex align-items-center" style="gap:1rem;max-width:400px"><div style="flex-shrink:0"><img src="${item.RUTA||'https://placehold.co/50x50'}" onerror="this.src='https://placehold.co/50x50'" alt="Foto" class="rounded-circle border" style="width:50px;height:50px;object-fit:cover"/></div><div><h6 class="mb-1 text-dark">${item.NOMBRES||''} ${item.APELLIDOS||''}</h6></div></div>` },
        { key: 'FCRCN', label: 'Fecha de Creación', sortable: true, class: 'text-center' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
      ],
      fieldsCategorias: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'DESCP', label: 'Descripción', width: '30%' },
        { key: 'DETALLE', label: 'Detalle', width: '40%' },
        { key: 'FCRCN', label: 'Fecha de Creación', sortable: true, class: 'text-center' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
      ],
      fieldsRecursos: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'NOMBRE', label: 'Archivo', width: '30%' },
        { key: 'ENLACE', label: 'Enlace', width: '40%' },
        { key: 'FCRCN', label: 'Fecha de Creación', sortable: true, class: 'text-center' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
      ],
      actionsNoticias:   { edit: { label: 'Editar', icon: 'fas fa-edit', class: 'btn-edit', action: null }, delete: { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: null } },
      actionsAutores:    { edit: { label: 'Editar', icon: 'fas fa-edit', class: 'btn-edit', action: null }, delete: { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: null } },
      actionsCategorias: { edit: { label: 'Editar', icon: 'fas fa-edit', class: 'btn-edit', action: null }, delete: { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: null } },
      actionsRecursos:   { delete: { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: null } },
      modalAgregarNoticia:   { show: false, data: null }, modalEditarNoticia:   { show: false, data: null }, modalEliminarNoticia:   { show: false, data: null },
      modalAgregarAutor:     { show: false, data: null }, modalEditarAutor:     { show: false, data: null }, modalEliminarAutor:     { show: false, data: null },
      modalAgregarCategoria: { show: false, data: null }, modalEditarCategoria: { show: false, data: null }, modalEliminarCategoria: { show: false, data: null },
      modalAgregarRecurso:   { show: false, data: null }, modalEliminarRecurso: { show: false, data: null },
      filter: { NOMBRES: null, CDESTDO: '', TIPO: '' },
      selects: { categorias: [], autores: [], organos: [], planes: [] },
    };
  },
  props: { role: { type: Object, default: () => ({}) } },
  methods: {
    triggerSearch() {
      if      (this.active === 'noticias')   this.searchNoticias(1, this.grid.perPage);
      else if (this.active === 'autores')    this.searchAutores(1, this.grid.perPage);
      else if (this.active === 'categorias') this.searchCategorias(1, this.grid.perPage);
      else if (this.active === 'recursos')   this.searchRecursos(1, this.grid.perPage);
    },
    openCreateModal() {
      if      (this.active === 'noticias')   this.modalAgregarNoticia.show = true;
      else if (this.active === 'autores')    this.modalAgregarAutor.show = true;
      else if (this.active === 'categorias') this.modalAgregarCategoria.show = true;
      else if (this.active === 'recursos')   this.modalAgregarRecurso.show = true;
    },
    async searchNoticias(currentPage, perPage) {
      this.grid.isLoading = true;
      await MantenimientoProxy.list({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.NOMBRES||null, CESTDO: this.filter?.CDESTDO||null, TIPO: this.filter?.TIPO||null }, this.active)
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.dataNoticia = rows.map((u, i) => ({
            ...u,
            RN:          i + 1 + (currentPage - 1) * perPage,
            ID:          u.ID          ?? u.id,
            TIPO:        u.TIPO        ?? u.tipo,
            DTIPO:       u.DTIPO       ?? u.dtipo       ?? u.categoriaNombre ?? null,
            TITULO:      u.TITULO      ?? u.titulo      ?? '—',
            SUBTITULO:   u.SUBTITULO   ?? u.subtitulo   ?? null,
            IMAGEN:      u.IMAGEN      ?? u.imagen      ?? null,
            IDAUTORES:   u.IDAUTORES   ?? u.idAutores   ?? u.idautores ?? null,
            ORGANO:      u.ORGANO      ?? u.organo      ?? null,
            FCHPUB:      u.FCHPUB      ?? u.fchPub      ?? u.fchpub      ?? null,
            FCHCONSULTA: u.FCHCONSULTA ?? u.fchConsulta ?? u.fchconsulta ?? null,
            ARCHIVO:     u.ARCHIVO     ?? u.archivo     ?? null,
            CDESTDO:     u.CDESTDO     ?? u.estado      ?? 'I',
            FCRCN:       u.FCRCN       ?? u.fechaCreacion   ?? null,
            UCRCN:       u.UCRCN       ?? u.usuarioCreacion ?? '—',
            FEDCN:       u.FEDCN       ?? u.fechaEdicion    ?? null,
            UEDCN:       u.UEDCN       ?? u.usuarioEdicion  ?? '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => {
          this.dataNoticia = [];
          const msg = err?.response?.data?.message;
          const text = Array.isArray(msg) ? msg.join(', ') : (msg || err?.MESSAGE || 'Error al cargar las noticias');
          toast.error(text, { toastId: 'error-noticias' });
        })
        .finally(() => this.grid.isLoading = false);
    },
    async searchAutores(currentPage, perPage) {
      this.grid.isLoading = true;
      await MantenimientoProxy.listAutores({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.NOMBRES||null, CESTDO: this.filter?.CDESTDO||null })
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.dataAutores = rows.map((u, i) => ({
            ...u,
            RN:        i + 1 + (currentPage - 1) * perPage,
            ID:        u.ID        ?? u.id,
            NOMBRES:   u.NOMBRES   ?? u.nombres   ?? '—',
            APELLIDOS: u.APELLIDOS ?? u.apellidos ?? '',
            RUTA:      u.RUTA      ?? u.ruta      ?? u.fotografia ?? u.FOTOGRAFIA ?? null,
            REDES:     u.REDES     ?? u.redes     ?? null,
            DETALLE:   u.DETALLE   ?? u.detalle   ?? null,
            CDESTDO:   u.CDESTDO   ?? u.estado    ?? 'I',
            FCRCN:     u.FCRCN     ?? u.fechaCreacion   ?? null,
            UCRCN:     u.UCRCN     ?? u.usuarioCreacion ?? '—',
            FEDCN:     u.FEDCN     ?? u.fechaEdicion    ?? null,
            UEDCN:     u.UEDCN     ?? u.usuarioEdicion  ?? '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => {
          this.dataAutores = [];
          const msg = err?.response?.data?.message;
          const text = Array.isArray(msg) ? msg.join(', ') : (msg || err?.MESSAGE || 'Error al cargar los autores');
          toast.error(text, { toastId: 'error-autores' });
        })
        .finally(() => this.grid.isLoading = false);
    },
    async searchCategorias(currentPage, perPage) {
      this.grid.isLoading = true;
      await MantenimientoProxy.listCategorias({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.NOMBRES||null, CESTDO: this.filter?.CDESTDO||null })
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.dataCategorias = rows.map((u, i) => ({
            ...u,
            RN:      i + 1 + (currentPage - 1) * perPage,
            ID:      u.ID      ?? u.id,
            DESCP:   u.DESCP   ?? u.descp   ?? u.descripcion ?? u.DESCRIPCION ?? '—',
            DETALLE: u.DETALLE ?? u.detalle ?? null,
            CDESTDO: u.CDESTDO ?? u.estado  ?? 'I',
            FCRCN:   u.FCRCN   ?? u.fechaCreacion   ?? null,
            UCRCN:   u.UCRCN   ?? u.usuarioCreacion ?? '—',
            FEDCN:   u.FEDCN   ?? u.fechaEdicion    ?? null,
            UEDCN:   u.UEDCN   ?? u.usuarioEdicion  ?? '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => {
          this.dataCategorias = [];
          const msg = err?.response?.data?.message;
          const text = Array.isArray(msg) ? msg.join(', ') : (msg || err?.MESSAGE || 'Error al cargar las categorías');
          toast.error(text, { toastId: 'error-categorias' });
        })
        .finally(() => this.grid.isLoading = false);
    },
    async searchRecursos(currentPage, perPage) {
      this.grid.isLoading = true;
      await MantenimientoProxy.listRecursos({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.NOMBRES||null, CESTDO: this.filter?.CDESTDO||null })
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.dataRecursos = rows.map((u, i) => ({
            ...u,
            RN:      i + 1 + (currentPage - 1) * perPage,
            ID:      u.ID      ?? u.id,
            NOMBRE:  u.NOMBRE  ?? u.nombre  ?? u.NOMBRES ?? u.nombres ?? '—',
            ENLACE:  u.ENLACE  ?? u.enlace  ?? null,
            VLR1:    u.VLR1    ?? u.vlr1    ?? u.valor1 ?? null,
            VLR2:    u.VLR2    ?? u.vlr2    ?? u.valor2 ?? null,
            VLR3:    u.VLR3    ?? u.vlr3    ?? u.valor3 ?? null,
            CDESTDO: u.CDESTDO ?? u.estado  ?? 'I',
            FCRCN:   u.FCRCN   ?? u.fechaCreacion   ?? null,
            UCRCN:   u.UCRCN   ?? u.usuarioCreacion ?? '—',
            FEDCN:   u.FEDCN   ?? u.fechaEdicion    ?? null,
            UEDCN:   u.UEDCN   ?? u.usuarioEdicion  ?? '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => {
          this.dataRecursos = [];
          const msg = err?.response?.data?.message;
          const text = Array.isArray(msg) ? msg.join(', ') : (msg || err?.MESSAGE || 'Error al cargar los recursos');
          toast.error(text, { toastId: 'error-recursos' });
        })
        .finally(() => this.grid.isLoading = false);
    },
    async editNoticia(data)   { if (!data.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-edit' }); this.modalEditarNoticia.data = data; this.modalEditarNoticia.show = true; },
    async editAutor(data)     { if (!data.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-edit' }); this.modalEditarAutor.data = data; this.modalEditarAutor.show = true; },
    async editCategoria(data) { if (!data.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-edit' }); this.modalEditarCategoria.data = data; this.modalEditarCategoria.show = true; },
    async deleteRowNoticia() {
      if (this.role.IDR == 1) return toast.warning('Sin permisos', { toastId: 'warning-delete' });
      if (!this.modalEliminarNoticia.data?.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-delete' });
      await MantenimientoProxy.delete(this.modalEliminarNoticia.data.ID)
        .then(r => {
          if (r.STATUS) { toast.success('Estado cambiado correctamente', { toastId: 'success-delete' }); this.searchNoticias(this.grid.currentPage, this.grid.perPage); this.modalEliminarNoticia.show = false; }
          else toast.error(r.MESSAGE, { toastId: 'error-delete' });
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error', { toastId: 'error-delete' }));
    },
    async deleteAutor() {
      if (this.role.IDR == 1) return toast.warning('Sin permisos', { toastId: 'warning-delete' });
      if (!this.modalEliminarAutor.data?.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-delete' });
      await MantenimientoProxy.deleteAutor(this.modalEliminarAutor.data.ID)
        .then(r => {
          if (r.STATUS) { toast.success('Estado cambiado correctamente', { toastId: 'success-delete' }); this.searchAutores(this.grid.currentPage, this.grid.perPage); this.modalEliminarAutor.show = false; }
          else toast.error(r.MESSAGE, { toastId: 'error-delete' });
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error', { toastId: 'error-delete' }));
    },
    async deleteCategoria() {
      if (this.role.IDR == 1) return toast.warning('Sin permisos', { toastId: 'warning-delete' });
      if (!this.modalEliminarCategoria.data?.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-delete' });
      await MantenimientoProxy.deleteCategoria(this.modalEliminarCategoria.data.ID)
        .then(r => {
          if (r.STATUS) { toast.success('Estado cambiado correctamente', { toastId: 'success-delete' }); this.updateCategoriasData(); this.modalEliminarCategoria.show = false; }
          else toast.error(r.MESSAGE, { toastId: 'error-delete' });
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error', { toastId: 'error-delete' }));
    },
    async deleteRecurso() {
      if (this.role.IDR == 1) return toast.warning('Sin permisos', { toastId: 'warning-delete' });
      if (!this.modalEliminarRecurso.data?.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-delete' });
      await MantenimientoProxy.deleteRecurso(this.modalEliminarRecurso.data.ID, this.modalEliminarRecurso.data.ENLACE)
        .then(r => {
          if (r.STATUS) { toast.success('Estado cambiado correctamente', { toastId: 'success-delete' }); this.searchRecursos(this.grid.currentPage, this.grid.perPage); this.modalEliminarRecurso.show = false; }
          else toast.error(r.MESSAGE, { toastId: 'error-delete' });
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error', { toastId: 'error-delete' }));
    },
    async updateCategoriasData() {
      await this.searchCategorias(this.grid.currentPage, this.grid.perPage);
      await this.loadCategorias();
    },
    async loadCategorias() {
      try {
        const r = await MantenimientoProxy.listCategorias({ CESTDO: 'A', ROWS: 1000, INIT: 0 });
        const payload = r?.DATA ?? r;
        const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
        this.selects.categorias = rows.map(i => ({ value: i.ID ?? i.id, text: i.DESCP ?? i.descp ?? i.descripcion ?? i.DESCRIPCION ?? '—' }));
      } catch (e) { console.error(e); }
    },
    async selectAllPromises() {
      const extractRows = r => {
        const p = r?.DATA ?? r;
        return Array.isArray(p) ? p : (p?.data ?? []);
      };
      try {
        const [autoresRes, categoriasRes, filters] = await Promise.all([
          MantenimientoProxy.listAutores({ ROWS: 1000, INIT: 0 }).catch(() => ({})),
          MantenimientoProxy.listCategorias({ CESTDO: 'A', ROWS: 1000, INIT: 0 }),
          filterProxy.list({ NIVEL: 5 }, null).catch(() => []),
        ]);

        const autores    = extractRows(autoresRes);
        const categorias = extractRows(categoriasRes);

        this.selects.autores = autores.map(i => ({
          value: i.ID ?? i.id,
          label: `${i?.NOMBRES ?? i?.nombres ?? ''} ${i?.APELLIDOS ?? i?.apellidos ?? ''}`.trim() || `Autor ${i.ID ?? i.id}`,
        }));
        this.selects.categorias = categorias.map(i => ({ value: i.ID ?? i.id, text: i.DESCP ?? i.descp ?? i.descripcion ?? i.DESCRIPCION ?? '—' }));

        try {
          const organoItem = (filters||[]).find(f => f.LABEL?.toUpperCase() === 'ÓRGANO JURISDICCIONAL');
          console.log(filters)
          if (organoItem?.NIVEL_2) {
            const N2 = JSON.parse(organoItem.NIVEL_2);
            this.selects.organos = N2.map(i => ({
              value: i.VALUE, label: i.LABEL,
              children: (i.NIVEL_3||[]).map(i2 => ({
                value: i2.VALUE, label: i2.LABEL,
                children: (i2.NIVEL_4||[]).map(i3 => ({ value: i3.VALUE, label: i3.LABEL }))
              }))
            }));
          }
        } catch { /* organos no disponibles */ }
      } catch (err) {
        toast.error(err?.MESSAGE || 'Error al cargar los selects', { toastId: 'error-selects' });
      }
    },
    updateActive(text) {
      this.active = text;
      this.filter = { NOMBRES: null, CDESTDO: null, TIPO: null };
      this.grid = { ...this.grid, perPage: 10, currentPage: 1, loading: false };
      if (text === 'noticias')   this.searchNoticias(1, this.grid.perPage);
      if (text === 'autores')    this.searchAutores(1, this.grid.perPage);
      if (text === 'categorias') this.searchCategorias(1, this.grid.perPage);
      if (text === 'recursos')   this.searchRecursos(1, this.grid.perPage);
    },
  },
  mounted() {
    this.selectAllPromises();
    this.actionsNoticias   = { ...this.actionsNoticias,   edit: { ...this.actionsNoticias.edit,   action: d => this.editNoticia(d) },  delete: { ...this.actionsNoticias.delete,   action: d => { this.modalEliminarNoticia.show = true; this.modalEliminarNoticia.data = d; } } };
    this.actionsAutores    = { ...this.actionsAutores,    edit: { ...this.actionsAutores.edit,    action: d => this.editAutor(d) },    delete: { ...this.actionsAutores.delete,    action: d => { this.modalEliminarAutor.show = true; this.modalEliminarAutor.data = d; } } };
    this.actionsCategorias = { ...this.actionsCategorias, edit: { ...this.actionsCategorias.edit, action: d => this.editCategoria(d) }, delete: { ...this.actionsCategorias.delete, action: d => { this.modalEliminarCategoria.show = true; this.modalEliminarCategoria.data = d; } } };
    this.actionsRecursos   = { ...this.actionsRecursos,   delete: { ...this.actionsRecursos.delete, action: d => { this.modalEliminarRecurso.show = true; this.modalEliminarRecurso.data = d; } } };
    const paramsId = Number(this.$route.query.paramsId || 0);
    if (paramsId) {
      MantenimientoProxy.list({ ROWS: 1, INIT: 0, ID: paramsId }, 'noticias')
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          if (rows[0]) this.$nextTick(() => this.editNoticia({ ...rows[0], ID: rows[0].ID ?? rows[0].id }));
        })
        .catch(() => {});
      this.searchNoticias(1, this.grid.perPage);
    } else {
      this.searchNoticias(this.grid.currentPage, this.grid.perPage);
    }
  },
  watch: {
    active(v) { if (v === 'noticias') this.selectAllPromises(); },
  },
};
</script>
