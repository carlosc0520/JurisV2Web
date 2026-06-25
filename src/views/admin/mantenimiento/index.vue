<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Mantenimiento" subtitle="Gestión de preguntas frecuentes y planes">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
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
            placeholder="Buscar por descripción..."
            @search="q => { filter.NOMBRES = q || null; triggerSearch(); }"
          />

          <app-select v-model="filter.CDESTDO" @change="triggerSearch">
            <option :value="''">Todos los estados</option>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </app-select>

          <search-button @click="triggerSearch" />
          <new-button label="Crear" @click="active === 'preguntas' ? modalAgregarPregunta.show = true : modalAgregarPlanes.show = true" />

        </div>
      </SectionCard>

      <!-- Tables -->
      <data-table v-if="active === 'preguntas'" :search="searchPregunta" :fields="fieldsPreguntas" :items="dataPregunta" :grid="grid" :actions="actionsPreguntas"/>
      <data-table v-if="active === 'planes'"    :search="searchPlanes"   :fields="fieldsPlanes"    :items="dataPlanes"    :grid="grid" :actions="actionsPlanes"/>
    </div>

    <!-- Modales -->
    <ModalPreguntaAgregar :show="modalAgregarPregunta.show" :close="() => modalAgregarPregunta.show = false"
      :update="() => searchPregunta(grid.currentPage, grid.perPage)" :role="role"/>
    <ModalPreguntaEditar :show="modalEditarPregunta.show" :close="() => modalEditarPregunta.show = false"
      :update="() => searchPregunta(grid.currentPage, grid.perPage)" :data="modalEditarPregunta.data" :role="role"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado de esta pregunta? Si está activa se inactivará y viceversa." buttonOk="Si, cambiar"
      :action="deleteRowPregunta" :openDelete="modalEliminarPregunta.show"
      :closeHandler="() => modalEliminarPregunta.show = false"/>
    <ModalPlanAgregar :show="modalAgregarPlanes.show" :close="() => modalAgregarPlanes.show = false"
      :update="() => searchPlanes(grid.currentPage, grid.perPage)" :role="role"/>
    <ModalPlanEditar :show="modalEditarPlanes.show" :close="() => modalEditarPlanes.show = false"
      :update="() => searchPlanes(grid.currentPage, grid.perPage)" :data="modalEditarPlanes.data" :role="role"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado del plan?" buttonOk="Si, cambiar"
      :action="deleteRowPlanes" :openDelete="modalEliminarPlanes.show"
      :closeHandler="() => modalEliminarPlanes.show = false"/>
  </section>
</template>

<script>
import DataTable from "@/components/Tables/DataTable.vue";
import { toast } from 'vue3-toastify';
import ModalEliminar from "../shared/ModalEliminar.vue";
import ModalPreguntaAgregar from "./modals/ModalPreguntaAgregar.vue";
import ModalPreguntaEditar from "./modals/ModalPreguntaEditar.vue";
import ModalPlanAgregar from "./modals/ModalPlanAgregar.vue";
import ModalPlanEditar from "./modals/ModalPlanEditar.vue";
import MantenimientoProxy from '@/proxies/MantenimientoProxy';

export default {
  components: {
    DataTable,
    ModalEliminar, ModalPreguntaAgregar, ModalPreguntaEditar, ModalPlanAgregar, ModalPlanEditar,
  },
  props: { role: { type: Object, default: () => ({}) } },
  data() {
    return {
      tabs: [
        { id: 'preguntas', label: 'Preguntas', icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
        { id: 'planes',    label: 'Planes',    icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
      ],
      active: 'preguntas',
      dataPregunta: [],
      dataPlanes: [],
      grid: { items: [], currentPage: 1, perPage: 10, totalRows: 0, isLoading: true, pageOptions: [5,10,15,50] },
      fieldsPreguntas: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'DESCRIPCION', label: 'Descripción', width: '50%' },
        { key: 'FCRCN', label: 'Fecha de Creación', sortable: true, class: 'text-center' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
      ],
      fieldsPlanes: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'DESCRIPCION', label: 'Descripción', width: '30%' },
        { key: 'TIEMPO', label: 'Duración', width: '20%', class: 'text-center', formatter: v => v ? `${v} días` : '0 días' },
        { key: 'PRECIO', label: 'Precio', width: '20%', class: 'text-center', formatter: v => v ? `S/. ${v}` : 'S/. 0.00' },
        { key: 'AI_LIMIT', label: 'Límite IA', width: '10%', class: 'text-center', formatter: v => v != null ? `${v} búsq.` : '—' },
        { key: 'FCRCN', label: 'Fecha de Ingreso', sortable: true, class: 'text-center w-130' },
        { key: 'UCRCN', label: 'U. Creación', sortable: true, class: 'text-center w-130' },
        { key: 'FEDCN', label: 'Fecha de Edición', sortable: true, class: 'text-center w-130' },
        { key: 'UEDCN', label: 'U. Edición', sortable: true, class: 'text-center w-130' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
      ],
      actionsPreguntas: { edit: { label: 'Editar', icon: 'fas fa-edit', class: 'btn-edit', action: null }, delete: { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: null } },
      actionsPlanes:    { edit: { label: 'Editar', icon: 'fas fa-edit', class: 'btn-edit', action: null }, delete: { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: null } },
      modalAgregarPregunta:  { show: false, data: null },
      modalEditarPregunta:   { show: false, data: null },
      modalEliminarPregunta: { show: false, data: null },
      modalAgregarPlanes:    { show: false, data: null },
      modalEditarPlanes:     { show: false, data: null },
      modalEliminarPlanes:   { show: false, data: null },
      filter: { NOMBRES: null, CDESTDO: '' },
    };
  },
  methods: {
    triggerSearch() {
      if (this.active === 'preguntas') this.searchPregunta(1, this.grid.perPage);
      else this.searchPlanes(1, this.grid.perPage);
    },
    async searchPregunta(currentPage, perPage) {
      this.grid.isLoading = true;
      await MantenimientoProxy.listPreguntas({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.NOMBRES||null, CESTDO: this.filter?.CDESTDO||null })
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.dataPregunta = rows.map((u, i) => ({
            ...u,
            RN:          i + 1 + (currentPage - 1) * perPage,
            ID:          u.ID          ?? u.id,
            DESCRIPCION: u.DESCRIPCION ?? u.descripcion ?? '—',
            HTMLTEXT:    u.HTMLTEXT ?? u.htmlText ?? u.htmltext ?? u.respuesta ?? null,
            ORDEN:       u.ORDEN       ?? u.orden       ?? null,
            CDESTDO:     u.CDESTDO     ?? u.estado           ?? 'I',
            FCRCN:       u.FCRCN       ?? u.fechaCreacion   ?? null,
            UCRCN:       u.UCRCN       ?? u.usuarioCreacion ?? '—',
            FEDCN:       u.FEDCN       ?? u.fechaEdicion    ?? null,
            UEDCN:       u.UEDCN       ?? u.usuarioEdicion  ?? '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => {
          this.dataPregunta = [];
          const msg = err?.response?.data?.message;
          const text = Array.isArray(msg) ? msg.join(', ') : (msg || err?.MESSAGE || 'Error al cargar las preguntas');
          toast.error(text, { toastId: 'error-preguntas' });
        })
        .finally(() => this.grid.isLoading = false);
    },
    async searchPlanes(currentPage, perPage) {
      this.grid.isLoading = true;
      await MantenimientoProxy.listPlanes({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.NOMBRES||null, CESTDO: this.filter?.CDESTDO||null })
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.dataPlanes = rows.map((p, i) => ({
            ...p,
            RN:           i + 1 + (currentPage - 1) * perPage,
            ID:           p.ID          ?? p.id,
            DESCRIPCION:  p.DESCRIPCION ?? p.descripcion,
            VALOR:        p.VALOR       ?? p.valor,
            TIEMPO:       p.TIEMPO      ?? p.tiempo,
            PRECIO:       p.PRECIO      ?? p.precio,
            RESTRICIONES: p.RESTRICIONES ?? p.restricciones,
            PRINCIPAL:    p.PRINCIPAL   ?? p.principal,
            AI_LIMIT:     p.AI_LIMIT    ?? p.aiLimit ?? null,
            CDESTDO:      p.CDESTDO     ?? p.estado      ?? 'I',
            FCRCN:        p.FCRCN       ?? p.fechaCreacion   ?? null,
            UCRCN:        p.UCRCN       ?? p.usuarioCreacion ?? '—',
            FEDCN:        p.FEDCN       ?? p.fechaEdicion    ?? null,
            UEDCN:        p.UEDCN       ?? p.usuarioEdicion  ?? '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => {
          this.dataPlanes = [];
          const msg = err?.response?.data?.message;
          const text = Array.isArray(msg) ? msg.join(', ') : (msg || err?.MESSAGE || 'Error al cargar los planes');
          toast.error(text, { toastId: 'error-planes' });
        })
        .finally(() => this.grid.isLoading = false);
    },
    async editPregunta(data) {
      if (!data.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-edit' });
      this.modalEditarPregunta.data = data;
      this.modalEditarPregunta.show = true;
    },
    async editPlanes(data) {
      if (!data.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-edit' });
      this.modalEditarPlanes.data = data;
      this.modalEditarPlanes.show = true;
    },
    async deleteRowPregunta() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });
      if (!this.modalEliminarPregunta.data?.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-delete' });
      await MantenimientoProxy.deletePregunta(this.modalEliminarPregunta.data.ID)
        .then(r => {
          if (r.STATUS) { toast.success(r.MESSAGE || 'Estado cambiado correctamente', { toastId: 'success-delete' }); this.searchPregunta(this.grid.currentPage, this.grid.perPage); this.modalEliminarPregunta.show = false; }
          else toast.error(r.MESSAGE, { toastId: 'error-delete' });
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al eliminar la pregunta', { toastId: 'error-delete' }));
    },
    async deleteRowPlanes() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });
      if (!this.modalEliminarPlanes.data?.ID) return toast.warning('No se encontró el ID', { toastId: 'warning-delete' });
      await MantenimientoProxy.deletePlan(this.modalEliminarPlanes.data.ID)
        .then(r => {
          if (r.STATUS) { toast.success('Plan eliminado correctamente', { toastId: 'success-delete' }); this.searchPlanes(this.grid.currentPage, this.grid.perPage); this.modalEliminarPlanes.show = false; }
          else toast.error(r.MESSAGE, { toastId: 'error-delete' });
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al eliminar el plan', { toastId: 'error-delete' }));
    },
    updateActive(text) {
      this.active = text;
      this.filter = { NOMBRES: null, CDESTDO: null };
      this.grid = { ...this.grid, perPage: 10, currentPage: 1, loading: false };
      if (text === 'preguntas') this.searchPregunta(1, this.grid.perPage);
      else this.searchPlanes(1, this.grid.perPage);
    },
  },
  mounted() {
    this.actionsPreguntas = { ...this.actionsPreguntas,
      edit:   { ...this.actionsPreguntas.edit,   action: d => this.editPregunta(d) },
      delete: { ...this.actionsPreguntas.delete, action: d => { this.modalEliminarPregunta.show = true; this.modalEliminarPregunta.data = d; } },
    };
    this.actionsPlanes = { ...this.actionsPlanes,
      edit:   { ...this.actionsPlanes.edit,   action: d => this.editPlanes(d) },
      delete: { ...this.actionsPlanes.delete, action: d => { this.modalEliminarPlanes.show = true; this.modalEliminarPlanes.data = d; } },
    };
    this.searchPregunta(this.grid.currentPage, this.grid.perPage);
  },
};
</script>
