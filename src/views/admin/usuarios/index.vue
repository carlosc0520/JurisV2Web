<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Usuarios" subtitle="Gestión de subscriptores, digitadores y administradores">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-4 flex flex-col gap-4">

      <!-- Tabs -->
      <div
        class="flex gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <button v-for="tab in tabs" :key="tab.id" @click="updateActive(tab.id)"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
            active === tab.id
              ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800']">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            v-html="tab.icon" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Filters -->
      <SectionCard>
        <div class="flex flex-wrap items-center gap-3">

          <!-- Input de búsqueda -->
          <search-bar class="flex-1 min-w-[240px]" placeholder="Buscar por nombres, apellidos o correo..."
            @search="q => { filter.NOMBRES = q || null; search(1, grid.perPage); }" />

          <!-- Selector estado -->
          <app-select v-model="filter.CDESTDO" @change="search(1, grid.perPage)">
            <option :value="''">Todos los estados</option>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </app-select>

          <!-- Botón buscar -->
          <search-button @click="search(1, grid.perPage)" />


          <!-- Acciones -->
          <export-button v-if="canAccessReport" label="Reporte" :loading="isLoading" @click="exportarReporte" />
          <new-button v-if="canAccessCreate" label="Crear" @click="modalAgregarUsuario.show = true" />

        </div>
      </SectionCard>

      <!-- Table -->
      <data-table :active="active" :search="search" :fields="fields" :items="data" :grid="grid"
        :actions="availableActions" />
    </div>

    <!-- Modales -->
    <ModalUsuarioInsertar :role="role" :show="modalAgregarUsuario.show" :close="() => modalAgregarUsuario.show = false"
      :update="() => search(grid.currentPage, grid.perPage)" :selects="selects"
      :userType="Number(active == 'Administradores' ? 3 : active === 'Digitadores' ? 2 : 1)" />
    <ModalUsuarioEditar :role="role" :show="modalEditarUsuario.show" :close="() => modalEditarUsuario.show = false"
      :update="() => search(grid.currentPage, grid.perPage)" :selects="selects" :data="modalEditarUsuario.data"
      :userType="Number(active == 'Administradores' ? 3 : active === 'Digitadores' ? 2 : 1)" />
    <ModalEliminar message="¿Está seguro de cambiar el estado de este registro?, el usuario perdera su acceso."
      buttonOk="Si, cambiar" :action="deleteRow" :openDelete="modalEliminar.show"
      :closeHandler="() => modalEliminar.show = false" />
  </section>
</template>

<script>
import DataTable from "@/components/Tables/DataTable.vue";
import { toast } from 'vue3-toastify';
import defaultAvatar from '@/assets/img/resources/perfil.png';
import * as XLSX from 'xlsx-js-style';
import ModalEliminar from "../shared/ModalEliminar.vue";
import ModalUsuarioInsertar from "./modals/ModalUsuarioInsertar.vue";
import ModalUsuarioEditar from "./modals/ModalUsuarioEditar.vue";
import userProxy from "@/proxies/UserProxy.js";
import MantenimientoProxy from "@/proxies/MantenimientoProxy.js";

export default {
  components: { DataTable, ModalEliminar, ModalUsuarioInsertar, ModalUsuarioEditar },
  data() {
    return {
      defaultAvatar,
      tabs: [
        { id: 'Subscriptores', label: 'Subscriptores', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>' },
        { id: 'Digitadores', label: 'Digitadores', icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
        { id: 'Administradores', label: 'Administradores', icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
      ],
      active: 'Subscriptores',
      data: [],
      grid: { items: [], currentPage: 1, perPage: 10, totalRows: 120, isLoading: true, pageOptions: [5, 10, 15, 50] },
      fields: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        {
          key: 'RTAFTO', label: 'Usuario', html: true,
          formatter: (v, _k, item) => {
            const src = (v && v !== 'null') ? v : defaultAvatar;
            return `<div class="flex items-center gap-3">
              <img src="${src}" referrerpolicy="no-referrer"
                onerror="this.onerror=null;this.src='${defaultAvatar}'"
                class="w-9 h-9 rounded-full object-cover border-2 border-gray-100 flex-shrink-0" alt="avatar"/>
              <div class="min-w-0">
                <p class="font-semibold text-gray-800 dark:text-gray-100 m-0 text-sm leading-tight truncate">
                  ${item?.APATERNO || ''} ${item?.AMATERNO || ''}, ${item?.NOMBRES || ''}
                </p>
                <span class="text-xs text-gray-400">${(item?.EMAIL || '').toLowerCase()}</span>
              </div>
            </div>`;
          },
        },
        {
          key: 'DESCRIPCION', label: 'Plan', html: true,
          formatter: v => {
            if (!v || v === '—') return '<span class="text-gray-400 text-xs">Sin plan</span>';
            return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">${v}</span>`;
          },
        },
        { key: 'FCRCN', label: 'Ingreso', class: 'text-center' },
        { key: 'UCRCN', label: 'Creado por', class: 'text-center' },
        { key: 'FEDCN', label: 'Últ. edición', class: 'text-center' },
        { key: 'UEDCN', label: 'Editado por', class: 'text-center' },
        { key: 'CDESTDO', label: 'Estado', class: 'text-center' },
      ],
      isLoading: false,
      modalAgregarUsuario: { show: false, data: null },
      modalEditarUsuario: { show: false, data: null },
      modalEliminar: { show: false, data: null },
      filter: { NOMBRES: null, CDESTDO: "" },
      selects: { planes: [] },
      emailsAutorizadosReporte: ['CCARBAJALMT0520@GMAIL.COM', 'mbasurto@ccfirma.com'],
      emailsAutorizadosCrear: ['CCARBAJALMT0520@GMAIL.COM'],
      emailsAutorizadosEditar: ['CCARBAJALMT0520@GMAIL.COM'],
      emailsAutorizadosEliminar: ['CCARBAJALMT0520@GMAIL.COM'],
    };
  },
  computed: {
    canAccessReport() { return this.verificarAcceso(this.emailsAutorizadosReporte); },
    canAccessCreate() { return this.verificarAcceso(this.emailsAutorizadosCrear); },
    canAccessEdit() { return this.verificarAcceso(this.emailsAutorizadosEditar); },
    canAccessDelete() { return this.verificarAcceso(this.emailsAutorizadosEliminar); },
    availableActions() {
      const actions = {};
      if (this.canAccessEdit) actions.edit = { label: 'Editar', icon: 'fas fa-edit', class: 'btn-edit', action: d => this.edit(d) };
      if (this.canAccessEdit) actions.renew = { label: 'Renovar plan', icon: 'fas fa-sync-alt', class: 'btn-edit', action: d => this.renewRow(d) };
      if (this.canAccessDelete) actions.delete = { label: 'Eliminar', icon: 'fas fa-trash', class: 'btn-delete', action: d => { this.modalEliminar.show = true; this.modalEliminar.data = d; } };
      return actions;
    },
  },
  props: { role: { type: Object, default: () => ({}) } },
  methods: {
    verificarAcceso(emailsList) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userEmail = user?.EMAIL?.toUpperCase();
        if (!userEmail) return false;
        return emailsList.some(e => e.toUpperCase() === userEmail);
      } catch { return false; }
    },

    async search(currentPage, perPage) {
      this.grid.isLoading = true;
      const typeMap = { Administradores: 3, Digitadores: 2, Subscriptores: 1 };
      const type = typeMap[this.active] ?? 2;
      await userProxy.list({ ROWS: perPage, INIT: (currentPage - 1) * perPage, DESC: this.filter?.NOMBRES || null, CESTDO: this.filter?.CDESTDO || null }, type)
        .then(r => {
          // Soporte para respuesta nueva { STATUS, DATA: { data, total } } y antigua (array directo)
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          const total = payload?.total ?? rows[0]?.TOTALROWS ?? rows.length;
          this.data = rows.map((u, i) => ({
            ...u,
            RN: i + 1 + (currentPage - 1) * perPage,
            CDESTDO: u.CDESTDO || u.estado || 'I',
            FCRCN: u.FCRCN || u.fechaCreacion || null,
            UCRCN: u.UCRCN || u.usuarioCreacion || '—',
            FEDCN: u.FEDCN || u.fechaEdicion || null,
            UEDCN: u.UEDCN || u.usuarioEdicion || '—',
            DESCRIPCION: u.DESCRIPCION || u.plan?.descripcion || '—',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => { this.data = []; toast.error(err?.MESSAGE || 'Error al cargar los usuarios', { toastId: 'error-usuarios' }); })
        .finally(() => this.grid.isLoading = false);
    },
    updateActive(text) {
      this.active = text;
      this.filter = { NOMBRES: null, CDESTDO: null };
      this.grid = { ...this.grid, perPage: 10, currentPage: 1, loading: false };
      this.search(this.grid.currentPage, this.grid.perPage);
    },
    async edit(data) {
      if (!data.ID) return toast.warning('No se encontró el identificador del usuario', { toastId: 'warning-edit' });
      this.modalEditarUsuario.data = data; this.modalEditarUsuario.show = true;
    },
    async renewRow(data) {
      if (!data.ID) return toast.warning('No se encontró el identificador del usuario', { toastId: 'warning-renew' });
      const result = await this.$swal({
        title: '¿Renovar plan?',
        text: `Se renovará el plan activo de ${data.NOMBRES || ''} ${data.APATERNO || ''}. Se desactivará la suscripción actual y se creará una nueva.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, renovar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3B82F6',
      });
      if (!result.isConfirmed) return;

      await userProxy.renewPlan(data.ID)
        .then(r => {
          if (r.STATUS) {
            toast.success('Plan renovado correctamente');
            this.search(this.grid.currentPage, this.grid.perPage);
          } else {
            toast.error(r.MESSAGE || 'Error al renovar el plan');
          }
        })
        .catch(e => toast.error(e?.response?.data?.message || 'Error al renovar el plan'));
    },
    async deleteRow() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });
      if (!this.modalEliminar.data.ID) return toast.warning('No se encontró el identificador del usuario', { toastId: 'warning-delete' });
      await userProxy.delete(this.modalEliminar.data.ID)
        .then(r => { if (r.STATUS) { toast.success('Usuario eliminado correctamente', { toastId: 'success-delete' }); this.search(this.grid.currentPage, this.grid.perPage); this.modalEliminar.show = false; } else toast.error(r.MESSAGE, { toastId: 'error-delete' }); })
        .catch(err => toast.error(err?.MESSAGE || 'Error al eliminar al usuario', { toastId: 'error-delete' }));
    },
    async getPlanes() {
      await MantenimientoProxy.listPlanes({ INIT: 0, ROWS: 10000 })
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
          this.selects.planes = rows.map(i => ({ value: i.id || i.ID, text: i.descripcion || i.DESCRIPCION }));
        })
        .catch(() => { this.selects.planes = []; toast.error('Error al cargar los planes', { toastId: 'error-planes' }); });
    },
    async exportarReporte() {
      this.isLoading = true;
      try {
        const typeMap = { Administradores: 3, Digitadores: 2, Subscriptores: 1 };
        const type = typeMap[this.active] ?? 2;
        const raw = await userProxy.list({ ROWS: 10000, INIT: 0, DESC: this.filter?.NOMBRES || null, CESTDO: this.filter?.CDESTDO || null }, type);
        const payload = raw?.DATA ?? raw;
        const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
        if (!rows.length) { toast.warning('No hay datos para exportar', { toastId: 'warning-export' }); return; }
        const excelData = rows.map((item, index) => ({
          'N°': index + 1,
          'Apellido Paterno': (item.APATERNO || item.apellidoPaterno || '').trim(),
          'Apellido Materno': (item.AMATERNO || item.apellidoMaterno || '').trim(),
          'Nombres': item.NOMBRES || item.nombres || '',
          'Correo Electrónico': item.EMAIL || item.email || '',
          'Teléfono': item.TELEFONO || item.telefono || '',
          'Plan': item.DESCRIPCION || item.planDescripcion || '',
          'Fecha de Nacimiento': (item.FNACIMIENTO || item.fechaNacimiento)
            ? new Date(item.FNACIMIENTO || item.fechaNacimiento).toLocaleDateString('es-PE') : '',
          'Fecha de Creación': (item.FCRCN || item.fechaCreacion)
            ? new Date(item.FCRCN || item.fechaCreacion).toLocaleDateString('es-PE') : '',
          'Estado': (item.CDESTDO || item.estado) === 'A' ? 'Activo' : 'Inactivo',
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        ws['!cols'] = [6, 20, 20, 25, 35, 15, 30, 18, 18, 12].map(w => ({ wch: w }));
        const range = XLSX.utils.decode_range(ws['!ref']);
        const headerStyle = { fill: { patternType: 'solid', fgColor: { rgb: 'FF8B5CF6' } }, font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFFFF' } }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: 'FF000000' } }, bottom: { style: 'thin', color: { rgb: 'FF000000' } }, left: { style: 'thin', color: { rgb: 'FF000000' } }, right: { style: 'thin', color: { rgb: 'FF000000' } } } };
        for (let c = range.s.c; c <= range.e.c; c++) { const addr = XLSX.utils.encode_cell({ r: 0, c }); if (ws[addr]) ws[addr].s = headerStyle; }
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            if (!ws[addr]) continue;
            ws[addr].s = { fill: { patternType: 'solid', fgColor: { rgb: r % 2 === 0 ? 'FFF8FAFC' : 'FFFFFFFF' } }, font: { name: 'Calibri', sz: 11, color: { rgb: 'FF1F2937' } }, alignment: { horizontal: c === 0 ? 'center' : 'left', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: 'FFE5E7EB' } }, bottom: { style: 'thin', color: { rgb: 'FFE5E7EB' } }, left: { style: 'thin', color: { rgb: 'FFE5E7EB' } }, right: { style: 'thin', color: { rgb: 'FFE5E7EB' } } } };
            if (c === range.e.c) { ws[addr].s.alignment.horizontal = 'center'; ws[addr].s.font.bold = true; ws[addr].s.font.color = { rgb: ws[addr].v === 'Activo' ? 'FF10B981' : 'FFEF4444' }; }
          }
        }
        XLSX.utils.book_append_sheet(wb, ws, this.active || 'Usuarios');
        XLSX.writeFile(wb, `Reporte_${this.active || 'Usuarios'}_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.xlsx`);
        toast.success('Reporte generado exitosamente', { toastId: 'success-export' });
      } catch (error) {
        toast.error(error?.MESSAGE || 'Error al generar el reporte', { toastId: 'error-export' });
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() { this.getPlanes(); this.search(this.grid.currentPage, this.grid.perPage); },
};
</script>
