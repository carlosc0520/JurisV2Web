<template>
  <section class="entradas-container">
    <!-- Header con Título -->
    <div class="entradas-header">
      <div class="entradas-header-content">
        <div class="header-title-section">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="header-icon">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <div>
            <h1 class="entradas-title">Entradas</h1>
            <p class="entradas-subtitle">Gestión de jurisprudencia y legislación</p>
          </div>
        </div>
      </div>
    </div>

    <div class="entradas-content">
      <!-- Modern Tabs -->
      <div class="tabs-modern">
        <button
          class="tab-button"
          :class="{ 'tab-active': active === 'jurisprudences' }"
          @click="updateActive('jurisprudences')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>Jurisprudencia</span>
        </button>
        <button
          class="tab-button"
          :class="{ 'tab-active': active === 'legislations' }"
          @click="updateActive('legislations')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>Legislación</span>
        </button>
      </div>

      <!-- Filtros Avanzados -->
      <div class="filters-advanced">
        <div class="filters-grid">
          <div class="filter-item">
            <label for="name" class="filter-label">Título</label>
            <input type="text" v-model="selectedFilter.name" id="name" class="modern-input" />
          </div>

          <div class="filter-item">
            <label for="RTITLE" class="filter-label">
              {{ active === 'jurisprudences' ? 'Título alternativo' : 'Denominación oficial' }}
            </label>
            <input type="text" v-model="selectedFilter.RTITLE" id="RTITLE" class="modern-input" />
          </div>

          <div class="filter-item">
            <label for="BLOG3" class="filter-label">
              {{ active === 'jurisprudences' ? 'Fecha de resolución' : 'Fecha de publicación' }}
            </label>
            <date-picker v-model="selectedFilter.FRESOLUTION" :value="selectedFilter.FRESOLUTION" valueType="format"
              :disabledDate="time => time.getTime() > Date.now()"
              @change="(date) => selectedFilter.FRESOLUTION = date" class="modern-datepicker"></date-picker>
          </div>

          <div class="filter-item">
            <label for="FCRCN" class="filter-label">Fecha de Ingreso</label>
            <date-picker v-model="selectedFilter.FCRCN" :value="selectedFilter.FCRCN" valueType="format"
              :disabledDate="time => time.getTime() > Date.now()"
              @change="(date) => selectedFilter.FCRCN = date" class="modern-datepicker"></date-picker>
          </div>

          <div class="filter-item">
            <label for="TEMA" class="filter-label">Tema</label>
            <input type="text" v-model="selectedFilter.TEMA" id="TEMA" class="modern-input" />
          </div>

          <div class="filter-item">
            <label for="BLOG2" class="filter-label">Tipo de entrada</label>
            <b-form-select v-model="selectedFilter.BLOG" class="modern-select" :options="[
              { text: '-- Seleccione ', value: null },
              { text: 'Común', value: 'common' },
              { text: 'Emblemático', value: 'emblematic' },
              { text: 'Ejecutivo', value: 'executive' }]">
            </b-form-select>
          </div>

          <div class="filter-item">
            <label for="CDESTDO" class="filter-label">Estado</label>
            <b-form-select v-model="selectedFilter.CDESTDO" class="modern-select" :options="[
              { text: '-- Seleccione ', value: null },
              { text: 'Activo', value: 'A' },
              { text: 'Inactivo', value: 'I' }]">
            </b-form-select>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="actions-row">
          <button class="modern-btn btn-search" @click="getEntries(grid.currentPage, grid.perPage)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <span>Buscar</span>
          </button>

          <div v-if="active == 'jurisprudences'" class="dropdown-modern">
            <button class="modern-btn btn-create dropdown-toggle" type="button" id="dropdownCreate" data-bs-toggle="dropdown" aria-expanded="false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Ingresar</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-modern" aria-labelledby="dropdownCreate">
              <li @click="loadFiltersIfNeeded().then(() => modalEntradaComun.show = true)" class="dropdown-item-modern">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span>Jurisprudencia Común</span>
              </li>
              <li @click="loadFiltersIfNeeded().then(() => modalAgregarEntradaEmble.show = true)" class="dropdown-item-modern">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Jurisprudencia Emblemático</span>
              </li>
            </ul>
          </div>
          <button v-else class="modern-btn btn-create" @click="loadFiltersIfNeeded().then(() => modalAgregarEntradalegislacion.show = true)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Ingresar</span>
          </button>

          <div class="dropdown-modern">
            <button class="modern-btn btn-export dropdown-toggle" type="button" id="dropdownExport" data-bs-toggle="dropdown" aria-expanded="false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Exportar</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-modern" aria-labelledby="dropdownExport">
              <li @click="onClickExportar(1)" class="dropdown-item-modern">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span>Resumen Ejecutivo</span>
              </li>
              <li @click="onClickExportar(2)" class="dropdown-item-modern">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <span>Resoluciones</span>
              </li>
              <li @click="onClickExportar(3)" class="dropdown-item-modern">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <span>Exportar Pág.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tablas -->
      <div class="table-section">
        <card-table v-if="active === 'jurisprudences'" :active="active" title="Entradas de Jurisprudencias"
          :search="getEntries" :fields="fields" :items="data" :grid="grid" :actions="actions"
          :deleteRole="role.IDR == 0" />

        <card-table v-if="active === 'legislations'" :active="active" title="Entradas de Legislación"
          :search="getEntries" :fields="fields.filter((field) => field.key !== 'TEMA')" :items="data" :grid="grid"
          :actions="actions" :deleteRole="role.IDR == 0" />
      </div>

      <LoadingOverlay :active="isLoading" :is-full-page="false" :loader="'bars'" />

      <!-- Loading Overlay para filtros -->
      <div v-if="isLoadingFilters" class="filters-loading-overlay">
        <div class="filters-loading-content">
          <div class="loading-spinner"></div>
          <p class="loading-text">Cargando filtros...</p>
          <p class="loading-subtext">Preparando formulario</p>
        </div>
      </div>

      <ModalAgregarEntradaComun :role="role" :show="modalEntradaComun.show" :close="() => modalEntradaComun.show = false"
        :update="() => getEntries(grid.currentPage, grid.perPage)" :selects="selects" />

      <ModalEditarEntradaComun :role="role" :show="modalEditarEntradaComun.show"
        :close="() => modalEditarEntradaComun.show = false" :update="() => getEntries(grid.currentPage, grid.perPage)"
        :selects="selects" :data="modalEditarEntradaComun.data" />

      <ModalAgregarEntradaEmble :role="role" :show="modalAgregarEntradaEmble.show"
        :close="() => modalAgregarEntradaEmble.show = false" :update="() => getEntries(grid.currentPage, grid.perPage)"
        :selects="selects" />

      <ModalEditarEntradaEmble :role="role" :show="modalEditarEntradaEmble.show"
        :close="() => modalEditarEntradaEmble.show = false" :update="() => getEntries(grid.currentPage, grid.perPage)"
        :selects="selects" :data="modalEditarEntradaEmble.data" />

      <ModalAgregarEntradalegislacion :role="role" :show="modalAgregarEntradalegislacion.show"
        :close="() => modalAgregarEntradalegislacion.show = false"
        :update="() => getEntries(grid.currentPage, grid.perPage)" :selects="selects" />

      <ModalEditarEntradaLegislacion :role="role" :show="modalEditarEntradalegislacion.show"
        :close="() => modalEditarEntradalegislacion.show = false"
        :update="() => getEntries(grid.currentPage, grid.perPage)" :selects="selects"
        :data="modalEditarEntradalegislacion.data" />

      <ModalEliminar :role="role" :message="'¿Está seguro de cambiar el estado de este registro?'"
        :buttonOk="'Si, cambiar'" :action="deleteRow" :openDelete="modalEliminar.show"
        :closeHandler="() => modalEliminar.show = false" />
    </div>
  </section>
</template>


<script>
import CardTable from "@/components/Cards/CardTable.vue";
import { BFormSelect } from 'bootstrap-vue-next';
import { toast } from 'vue3-toastify';
import adminEntriesProxy from "../../proxies/AdminEntriesProxy.js";

// MODALES
import ModalAgregarEntradaComun from "./Modales/ModalAgregarEntradaComun.vue";
import ModalEditarEntradaComun from "./Modales/ModalEditarEntradaComun.vue";
import ModalAgregarEntradaEmble from "./Modales/ModalAgregarEntradaEmble.vue";
import ModalEditarEntradaEmble from "./Modales/ModalEditarEntradaEmble.vue";
import ModalAgregarEntradalegislacion from "./Modales/ModalAgregarEntradalegislacion.vue";
import ModalEditarEntradaLegislacion from "./Modales/ModalEditarEntradaLegislacion.vue";

// PROXIES
import MagistradoProxy from "../../proxies/Magistrados.Proxy";
import filterProxy from "../../proxies/FilterProxy.js";
import ModalEliminar from "./Modales/ModalEliminar.vue";
import createPDFHelper from "../../assets/helpers/generatePdfHelper.js";

export default {
  components: {
    CardTable,
    BFormSelect,

    // MODALES
    ModalAgregarEntradaComun,
    ModalEditarEntradaComun,
    ModalAgregarEntradaEmble,
    ModalEditarEntradaEmble,
    ModalAgregarEntradalegislacion,
    ModalEditarEntradaLegislacion,
    ModalEliminar
    // ModalAgregarEntradaEmble,
  },
  data() {
    return {
      currentPage: 10,
      data: [],
      grid: {
        items: [],
        currentPage: 1,
        perPage: 10,
        totalRows: 120,
        isLoading: true,
        pageOptions: [5, 10, 15, 50],
      },
      fields: [
        {
          key: "RN",
          label: "",
        },
        {
          key: "FRESOLUTION",
          label: "Publicación",
          sortable: true,
          formatter: (value) => {
            return value.split('T')[0].split('-').reverse().join('/');
          },
        },
        {
          key: "TITLE",
          label: "Título",
          class: "w-130",
          sortable: true,
        },
        {
          key: "RTITLE",
          label: `Título alternativo`,
          class: "text-left",
          sortable: true,
          formatter: (value) => [null, undefined, "null"].includes(value) ? "" : value,
        },
        {
          key: "TEMA",
          label: "Tema",
        },
        {
          key: "BLOG",
          label: "Tipo de entrada",
          sortable: true,
          class: "text-center w-130",
          width: "30px",
        },
        {
          key: "FCRCN",
          label: "Fecha de Ingreso",
          sortable: true,
          class: "text-center w-130",
        },
        {
          key: "UCRCN",
          label: "U. Creación",
          sortable: true,
          class: "text-center w-130",
        },
        {
          key: "FEDCN",
          label: "Fecha de Edición",
          sortable: true,
          class: "text-center w-130",
        },
        {
          key: "UEDCN",
          label: "U. Edición",
          sortable: true,
          class: "text-center w-130",
        },
        {
          key: "CDESTDO",
          label: "Estado",
          sortable: true,
          class: "text-center w-130",
        },
        {
          key: "ACCIONES",
          label: "Acciones",
          class: "text-center w-130",
        },
      ],
      actions: {
        edit: {
          label: "Editar",
          icon: "fas fa-edit",
          class: "btn-edit",
          action: null,
        },
        delete: {
          label: "Eliminar",
          icon: "fas fa-trash",
          class: "btn-delete",
          action: null,
        },
        download: {
          label: "Descargar",
          icon: "fas fa-download",
          class: "btn-download",
          action: null,
          dropdown: {
            label: "Descargar",
            items: {
              "RESOLUCIÓN": {
                label: "RESOLUCIÓN",
                icon: "fas fa-file-pdf",
                action: null,
              },
              "DOC. RESUMEN": {
                label: "DOC. RESUMEN",
                icon: "fas fa-file-word",
                action: null,
              },
              "PDF. RESUMEN": {
                label: "PDF. RESUMEN",
                icon: "fas fa-file-word",
                action: null,
              }
            }
          }
        }
      },

      isLoading: false,
      // TABS
      active: "jurisprudences",
      selectedFilter: {
        name: null,
        CDESTDO: 'A',
        BLOG: null,
        FRESOLUTION: null,
        TEMA: null,
        RTITLE: null,
        FCRCN: null,
      },

      // OPENINGS MODALES
      modalEntradaComun: {
        show: false,
        data: null,
      },
      modalEditarEntradaComun: {
        show: false,
        data: null,
      },

      modalAgregarEntradaEmble: {
        show: false,
        data: null,
      },
      modalEditarEntradaEmble: {
        show: false,
        data: null,
      },

      modalAgregarEntradalegislacion: {
        show: false,
        data: null,
      },

      modalEditarEntradalegislacion: {
        show: false,
        data: null,
      },

      modalEliminar: {
        show: false,
        data: null,
      },

      // SELECTS
      selects: {
        magistrados: [],
        ambitos: [],
        jurisdiccionales: [],
        delitos: [],
        recursos: [],
        materias: [],
        jurisdicion: [],
        jurisdicionV: [],
        normas: [],
      },
      // Control de carga de filtros
      filtersLoaded: false,
      isLoadingFilters: false,
    };
  },
  props: {
    role: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    async getEntries(currentPage, perPage) {
      const init = (currentPage - 1) * perPage;
      const rows = perPage;

      this.grid.isLoading = true;
      await adminEntriesProxy.listdata({
        ROWS: rows,
        INIT: init,
        DESC: this.selectedFilter?.name || null,
        CESTDO: this.selectedFilter?.CDESTDO || null,
        BLOG: this.selectedFilter?.BLOG || null,
        FRESOLUTION: this.selectedFilter?.FRESOLUTION || null,
        TEMA: this.selectedFilter?.TEMA || null,
        RTITLE: this.selectedFilter?.RTITLE || null,
        FCRCN: this.selectedFilter?.FCRCN || null,
      }, this.active)
        .then((entries) => {
          this.data = entries
          console.log("this.data", this.data)
          this.grid.totalRows = entries[0]?.TOTALROWS || 0;
        })
        .catch((error) => {
          this.data = [];
          toast.error(error?.MESSAGE || 'Error al cargar las entradas', { toastId: 'error-entries' });
        })
        .finally(() => this.grid.isLoading = false);
    },
    updateActive(text) {
      this.active = text;
      this.selectedFilter = {
        name: null,
        CDESTDO: 'A',
        BLOG: null,
        FRESOLUTION: null,
        TEMA: null,
        RTITLE: null,
        FCRCN: null,
      };
      this.grid = {
        ...this.grid,
        perPage: 10,
        currentPage: 1,
        loading: false,
      };
      this.getEntries(this.grid.currentPage, this.grid.perPage);
    },
    async onClickExportar(typeFilter) {
      if (typeFilter == 3) {
        if (this.data.length == 0) {
          toast.warning('No se encontraron datos para exportar', { toastId: 'warning-export' });
          return
        }

        let paths = this.data.map((item) => {
          return {
            ENTRIEFILE: item.ENTRIEFILE,
            TITLE: item.TITLE,
            FCRCN: item.FCRCN,
            FLGDOC: item.FLGDOC,
          }
        });

        this.isLoading = true;
        await adminEntriesProxy.getDocumentZipAll({
          paths: JSON.stringify(paths),
        })
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Reporte.zip`);
            document.body.appendChild(link);
            link.click();

          })
          .catch((error) => toast.error(error?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-export' }))
          .finally(() => this.isLoading = false);
        return
      }


      if (!this.selectedFilter.RTITLE) {
        toast.warning('Debe seleccionar un filtro para exportar', { toastId: 'warning-export' });
        return;
      }

      this.isLoading = true;
      if (typeFilter == 1) {
        await adminEntriesProxy.listSearchDataFull({ RTITLE: this.selectedFilter.RTITLE, TYPE: this.active, BLOG: this.selectedFilter.BLOG })
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Reporte-${this.selectedFilter.RTITLE}-${this.active}.zip`);
            document.body.appendChild(link);
            link.click();

          })
          .catch((error) => toast.error(error?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-export' }))
          .finally(() => this.isLoading = false);
        return
      }

      await adminEntriesProxy.getDocumentZip({ RTITLE: this.selectedFilter.RTITLE, TYPE: this.active, BLOG: this.selectedFilter.BLOG })
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Reporte-${this.selectedFilter.RTITLE}-${this.active}.zip`);
          document.body.appendChild(link);
          link.click();

        })
        .catch((error) => toast.error(error?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-export' }))
        .finally(() => this.isLoading = false);

    },

    // ACTIONS ... 
    async edit(data) {
      await this.loadFiltersIfNeeded();
      if (data.BLOG === 'common' || data.BLOG === 'undefined') {
        this.modalEditarEntradaComun.data = await this.obtenerDatosEdit(data.ID);
        if (this.modalEditarEntradaComun.data) this.modalEditarEntradaComun.show = true;
      }

      if (data.BLOG === 'emblematic') {
        this.modalEditarEntradaEmble.data = await this.obtenerDatosEdit(data.ID);
        if (this.modalEditarEntradaEmble.data) this.modalEditarEntradaEmble.show = true;
      }

      if (data.BLOG === "executive") {
        this.modalEditarEntradalegislacion.data = await this.obtenerDatosEdit(data.ID);
        if (this.modalEditarEntradalegislacion.data) this.modalEditarEntradalegislacion.show = true;
      }
    },
    async deleteRow() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });

      if (!this.modalEliminar.data.ID) return toast.warning('No se encontró el ID de la entrada');

      this.isLoading = true;
      await adminEntriesProxy.delete(this.modalEliminar.data.ID)
        .then((response) => {
          const toastMessage = response?.MESSAGE || 'Ocurrió un error al eliminar la entrada';

          if (response.STATUS) {
            toast.success('Entrada eliminada correctamente', { toastId: 'success-delete' });
            this.getEntries(this.grid.currentPage, this.grid.perPage);
            this.modalEliminar.show = false;

          } else toast.error(toastMessage, { toastId: 'error-delete' });
        })
        .catch((err) => toast.error(err?.MESSAGE || 'Error al eliminar la entrada', { toastId: 'error-delete' }))
        .finally(() => this.isLoading = false);
    },
    async downloadFile(item) {
      let tipo = 'ENTRADA PRINCIPAL';
      let path = item?.ENTRIEFILE || "";

      this.isLoading = true;
      await adminEntriesProxy.downloadFile({ PATH: path })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement('a');
          link.href = url;
          const extension = path.split('.').pop();
          link.setAttribute('download', (item?.TITLE || "") + "-" + tipo + '.' + extension);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => toast.error(error?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-download' }))
        .finally(() => this.isLoading = false);
    },
    async viewEntrie(entrie, type) {
      this.isLoading = true;
      try {
        let blog = entrie.BLOG;
        let data = await this.obtenerDatos(entrie.ID);

        if (Object.keys(data).length === 0) {
          toast.warning('No se encontraron datos para la entrada', { toastId: 'warning-entrie' });
          this.isLoading = false;
          return;
        }

        if (['common', 'emblematic'].includes(blog)) {
          if (type == 1) this.generateWord(entrie, blog);
          // if (type == 2) createPDFHelper.generate(data, blog);
          if (type == 2) createPDFHelper.generate(data);
        }

      } catch (error) {
        toast.error(error?.MESSAGE || 'Error al obtener el archivo');
      } finally {
        this.isLoading = false;
      }
    },
    async generateWord(data) {
      await adminEntriesProxy.getDocument({
        ID: data.ID
      })
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${data.TITLE.toUpperCase()} - RESUMEN EJECUTIVO.docx`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => toast.error(error?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-export' }))
        .finally(() => this.isLoading = false);
    },
    async obtenerDatos(id) {
      let data = {}
      await adminEntriesProxy.getPrint({
        ID: id
      })
        .then((response) => {
          let ambit = JSON.parse(response.AMBIT)?.[0]?.LABEL || '';
          ambit = ambit ? ambit.replace(/\s*,/g, ',') : '';
          let magistrados = JSON.parse(response.MAGISTRADOS)?.[0]?.LABEL || '';
          magistrados = magistrados ? magistrados.replace(/\s*,/g, ',') : '';
          let delitos = JSON.parse(response.DELITO)?.[0]?.LABEL || '';
          delitos = delitos ? delitos.replace(/\s*,/g, ',') : '';
          let ojurisdiccional = JSON.parse(response.OJURISDICCIONAL)?.[0]?.LABEL || '';
          ojurisdiccional = ojurisdiccional ? ojurisdiccional.replace(/\s*,/g, ',') : '';
          let recursos = JSON.parse(response.RECURSO)?.[0]?.LABEL || '';
          recursos = recursos ? recursos.replace(/\s*,/g, ',') : '';
          let materias = JSON.parse(response.MATERIA)?.[0]?.LABEL || '';
          materias = materias ? materias.replace(/\s*,/g, ',') : '';
          let jurisdiccion = JSON.parse(response.JURISDICCION)?.[0]?.LABEL || '';
          jurisdiccion = jurisdiccion ? jurisdiccion.replace(/\s*,/g, ',') : '';


          data = {
            ID: response.ID,
            TITLE: response.TITLE,
            ISBINDING: response.ISBINDING === "1" ? "SI" : "NO",
            AMBIT: ambit,
            FRESOLUTION: response.FRESOLUTION ? new Date(response.FRESOLUTION).toLocaleDateString("es-PE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : '',
            OJURISDICCIONAL: ojurisdiccional,
            MAGISTRATES: magistrados,
            VDESIDENTE: response.VDESIDENTE,
            CVOTE: response.CVOTE,
            ENTRIEFILE: response.ENTRIEFILE,
            ENTRIEFILERESUMEN: response.ENTRIEFILERESUMEN,
            KEYWORDS: response.KEYWORDS?.replace(/\s*,/g, ', '),
            TEMA: response.TEMA,
            SUBTEMA: response.SUBTEMA,
            SHORTSUMMARY: response.SHORTSUMMARY,
            RESUMEN: response.RESUMEN,
            NENTRIEFILERESUMEN: null,
            NENTRIEFILE: null,
            DELITO: delitos,
            RECURSO: recursos,
            MATERIA: materias,
            JURISDICCION: jurisdiccion,
            FRESOLUTIONSTRING: response.FRESOLUTIONSTRING
          }

        })
        .catch((error) => {
          data = {}
          toast.error(error?.MESSAGE || 'Error al obtener los datos', { toastId: 'error-entries' });
        });

      return data;
    },
    async obtenerDatosEdit(id) {
      try {
        this.isLoading = true;
        const response = await adminEntriesProxy.get({ ID: id });

        let ambit = !response.AMBIT ? [] : response.AMBIT.split(",").map((item) => parseInt(item)) || [];
        let ojurisdiccional = !response.OJURISDICCIONAL ? [] : response.OJURISDICCIONAL.split(",").map((item) => parseInt(item)) || [];
        let magistrados = !response.MAGISTRATES ? [] : response.MAGISTRATES.split(",").map((item) => parseInt(item)) || [];
        let delitos = !response.DELITO ? [] : response.DELITO.split(",").map((item) => parseInt(item)) || [];
        let recursos = !response.RECURSO ? [] : response.RECURSO.split(",").map((item) => parseInt(item)) || [];
        let materias = !response.MATERIA ? [] : response.MATERIA.split(",").map((item) => parseInt(item)) || [];
        let norma = !response?.TPONRMA ? [] : response?.TPONRMA?.split(",")?.map((item) => parseInt(item)) || [];
        let oemisor = !response?.OEMISOR ? [] : response?.OEMISOR?.split(",")?.map((item) => parseInt(item)) || [];
        let jurisdiccion = !response?.JURISDICCION ? [] : response?.JURISDICCION?.split(",")?.map((item) => parseInt(item)) || [];
        let jurisdiccionV = !response?.JURISDICCIONV ? [] : response?.JURISDICCIONV?.split(",")?.map((item) => parseInt(item)) || [];

        if (!response?.ID) {
          toast.warning('No se encontraron datos para la entrada', { toastId: 'warning-entrie' });
          return null;
        }

        let retorno = {
          ID: response.ID,
          TITLE: response.TITLE,
          RTITLE: response?.RTITLE || "",
          ISBINDING: response.ISBINDING,
          AMBIT: ambit,
          FRESOLUTION: response.FRESOLUTION,
          OJURISDICCIONAL: ojurisdiccional,
          MAGISTRATES: magistrados,
          VDESIDENTE: response?.VDESIDENTE?.split(",").filter((item) => item.trim() !== "") || [],
          CVOTE: response?.CVOTE?.split(",").filter((item) => item.trim() !== "") || [],
          KEYWORDS: response?.KEYWORDS?.split(",")?.filter((item) => item.trim() !== "") || [],
          ENTRIEFILE: response.ENTRIEFILE,
          ENTRIEFILERESUMEN: response.ENTRIEFILERESUMEN,
          TEMA: this.stripHTML(response.TEMA),
          SUBTEMA: this.stripHTML(response.SUBTEMA),
          SHORTSUMMARY: this.stripHTML(response.SHORTSUMMARY),
          RESUMEN: this.stripHTML(response.RESUMEN),
          NENTRIEFILERESUMEN: null,
          NENTRIEFILE: null,
          RESUMEN2: response.RESUMEN2,
          CASO: response.CASO,
          DELITO: delitos,
          RECURSO: recursos,
          TPONRMA: norma,
          NMRCN: response.NMRCN,
          OEMISOR: oemisor,
          MATERIA: materias,
          JURISDICCION: jurisdiccion,
          JURISDICCIONV: jurisdiccionV,
          SITUACION: response.SITUACION,
          JIDSVIN: response.JIDSVIN,
          IDSVIN: response.IDSVIN
        };

        return retorno;

      } catch (error) {
        toast.error(error?.MESSAGE || 'Error al obtener los datos', { toastId: 'error-entries' });
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    stripHTML(html) {
      if ([undefined, null, ''].includes(html)) return '';
      html = html.replace(/\r\n/g, "\n");
      html = html.replace(/style="[^"]*"/g, "");
      html = html.replace(/>\s+</g, "><");
      return html;
    },
    // Lazy loading de filtros - solo cargar cuando sea necesario
    async loadFiltersIfNeeded() {
      if (this.filtersLoaded || this.isLoadingFilters) {
        return; // Ya están cargados o en proceso de carga
      }
      await this.getAllFilters();
    },
    // Buscar normas dinámicamente
    async searchNormas(query) {
      if (!query || query.length < 3) {
        this.selects.normas = [];
        return;
      }

      try {
        const normasResponse = await adminEntriesProxy.listSearchNames({ 
          ROWS: 40, 
          INIT: 0, 
          DESC: query,
          CESTDO: 'A',
          TYPE: this.active,
        });

        this.selects.normas = normasResponse.map(item => ({
          value: item.ID,
          label: item.TITLE || item.RTITLE || 'Sin título',
        }));
      } catch (error) {
        this.selects.normas = [];
      }
    },
    // COMUN
    async getAllFilters() {
      try {
        this.isLoadingFilters = true;
        const [magistradosResponse, filtersResponse, filtersResponse2] = await Promise.all([
          MagistradoProxy.list({ ROWS: 1000, INIT: 0, DESC: null, CESTDO: null }, 2),
          filterProxy.list({ NIVEL: 5, CESTDO: "" }, "1", 2),
          filterProxy.list({ NIVEL: 5, CESTDO: "" }, "2", 2),
        ]);

        this.selects.magistrados = magistradosResponse.map(item => ({
          value: item.ID,
          label: (item.APELLIDOS + " " + item.NOMBRES).replace(/null/g, ""),
        }));

        if (filtersResponse && filtersResponse.length > 0) {
          const ambitos = this.configFilter(filtersResponse, "ÁMBITO");
          const jurisdiccionales = this.configFilter(filtersResponse, "ÓRGANO JURISDICCIONAL");
          const delitos = this.configFilter(filtersResponse, "DELITOS");
          const recursos = this.configFilter(filtersResponse, "TIPO DE RECURSO");
          const materias = this.configFilter(filtersResponse, "MATERIA");
          const jurisdicion = this.configFilter(filtersResponse, "JURISDICCIÓN");
          const jurisdicionV = this.configFilter(filtersResponse, "JURISPRUDENCIA VINCULANTE");

          this.selects.ambitos = this.mapNivel(ambitos?.NIVEL_2);
          this.selects.jurisdiccionales = this.mapNivel(jurisdiccionales?.NIVEL_2);
          this.selects.delitos = this.mapNivel(delitos?.NIVEL_2);
          this.selects.recursos = this.mapNivel(recursos?.NIVEL_2);
          this.selects.materias = this.mapNivel(materias?.NIVEL_2);
          this.selects.jurisdicion = this.mapNivel(jurisdicion?.NIVEL_2);
          this.selects.jurisdicionV = this.mapNivel(jurisdicionV?.NIVEL_2);
        }


        if (filtersResponse2 && filtersResponse2.length > 0) {
          const norma = this.configFilter(filtersResponse2, "TIPO DE NORMA");
          this.selects.norma = this.mapNivel(norma?.NIVEL_2);

          let oemisor = this.configFilter(filtersResponse2, "ÓRGANO EMISOR");
          this.selects.oemisor = this.mapNivel(oemisor?.NIVEL_2);
        }


      } catch (error) {
        toast.error(error?.MESSAGE || 'Error al cargar los datos', { toastId: 'error-filters' });
        this.selects.magistrados = [];
      }
      finally {
        this.isLoadingFilters = false;
        this.filtersLoaded = true; // Marcar como cargados
      }
    },
    mapNivel(nivel) {
      return nivel?.map(item => ({
        value: item.VALUE,
        label: item.LABEL,
        children: this.mapNivel2(item.NIVEL_3),
      })) || [];
    },
    mapNivel2(nivel) {
      return nivel?.map(item => ({
        value: item.VALUE,
        label: item.LABEL,
        children: this.mapNivel3(item.NIVEL_4),
      })) || [];
    },
    mapNivel3(nivel) {
      return nivel?.map(item => ({
        value: item.VALUE,
        label: item.LABEL,
        children: this.mapNivel4(item.NIVEL_5),
      })) || [];
    },
    mapNivel4(nivel) {
      return nivel?.map(item => ({
        value: item.VALUE,
        label: item.LABEL,
        children: this.mapNivel5(item.NIVEL_6),
      })) || [];
    },
    mapNivel5(nivel) {
      return nivel?.map(item => ({
        value: item.VALUE,
        label: item.LABEL,
      })) || [];
    },

    configFilter(data, label) {
      try {
        return data.filter(item => item.LABEL.toUpperCase() === label.toUpperCase())
          .map(item => ({
            ...item,
            NIVEL_2: JSON.parse(item.NIVEL_2)
          }))[0] || {};
      } catch (error) {
        return {};
      }
    }
  },
  mounted() {
    // Cargar entradas inmediatamente para mostrar datos rápido
    this.getEntries(this.grid.currentPage, this.grid.perPage);
    
    // Los filtros se cargarán cuando se necesiten (al abrir modales)
    // this.getAllFilters(); - Comentado para lazy loading
    
    // agregar a la lista de acciones
    this.actions = {
      ...this.actions,
      edit: {
        ...this.actions.edit,
        action: (data) => this.edit(data),
      },
      delete: {
        ...this.actions.delete,
        action: (data) => {
          this.modalEliminar.show = true;
          this.modalEliminar.data = data;
        }
      },
      download: {
        ...this.actions.download,
        action: null,
        dropdown: {
          ...this.actions.download.dropdown,
          items: {
            ...this.actions.download.dropdown.items,
            "RESOLUCIÓN": {
              ...this.actions.download.dropdown.items["RESOLUCIÓN"],
              action: (data) => this.downloadFile(data),
            },
            "DOC. RESUMEN": {
              ...this.actions.download.dropdown.items["DOC. RESUMEN"],
              action: (data) => this.viewEntrie(data, 1),
            },
            "PDF. RESUMEN": {
              ...this.actions.download.dropdown.items["PDF. RESUMEN"],
              action: (data) => this.viewEntrie(data, 2),
            }
          }
        }
      }
    }

  }
};
</script>

<style scoped>
/* Container Principal */
.entradas-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header */
.entradas-header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 0 0 0.5rem 0;
  margin: 0 -2rem 1rem -2rem;
}

.entradas-header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.5rem 2rem 0 2rem;
}

.header-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  flex-shrink: 0;
  color: #185CE6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.entradas-title {
  font-family: Lato, sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.entradas-subtitle {
  font-family: Lato, sans-serif;
  color: #6B7280;
  font-size: 0.8rem;
  margin: 0.2rem 0 0 0;
}

/* Content Wrapper */
.entradas-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 0 2rem;
}

/* Content */
.entradas-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0 1.5rem 0;
}

/* Modern Tabs */
.tabs-modern {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 8px 16px;
  border: 2px solid transparent;
  background: transparent;
  border-radius: 10px;
  font-family: Lato, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.tab-button:hover {
  background: rgba(24, 92, 230, 0.05);
  color: #185CE6;
  border-color: #60A5FA;
}

.tab-button.tab-active {
  background: rgba(24, 92, 230, 0.08);
  color: #185CE6 !important;
  border-color: #185CE6;
}

.tab-button svg {
  width: 18px;
  height: 18px;
}

/* Filters Advanced */
.filters-advanced {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #F3F4F6;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-family: Lato, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin: 0;
}

.modern-input {
  width: 100%;
  padding: 0.65rem 0.875rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-family: Lato, sans-serif;
  font-size: 0.9rem;
  color: #1F2937;
  transition: all 0.3s ease;
  background: white;
}

.modern-input:focus {
  outline: none;
  border-color: #185CE6;
  background: white;
  box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

.modern-input::placeholder {
  color: #9CA3AF;
}

.modern-select {
  width: 100%;
  padding: 0.65rem 0.875rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-family: Lato, sans-serif;
  font-size: 0.95rem;
  color: #1F2937;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modern-select:focus {
  outline: none;
  border-color: #185CE6;
  background: white;
  box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

/* DatePicker Styling */
.modern-datepicker :deep(.mx-input) {
  padding: 0.65rem 0.875rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-family: Lato, sans-serif;
  font-size: 0.9rem;
  color: #1F2937;
  background: white;
  transition: all 0.3s ease;
}

.modern-datepicker :deep(.mx-input:focus) {
  border-color: #185CE6;
  background: white;
  box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

/* Actions Row */
.actions-row {
  display: flex;
  gap: 10px;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.modern-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-family: Lato, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.modern-btn svg {
  width: 16px;
  height: 16px;
}

.btn-search {
  background: linear-gradient(135deg, #8B5CF6 0%, #185CE6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-search:hover {
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.btn-create {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(223, 45, 178, 0.3);
}

.btn-create:hover {
  box-shadow: 0 6px 16px rgba(223, 45, 178, 0.4);
}

.btn-export {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-export:hover {
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

/* Dropdown Modern */
.dropdown-modern {
  position: relative;
}

.dropdown-menu-modern {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 6px;
  margin-top: 6px;
  min-width: 200px;
}

.dropdown-item-modern {
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: Lato, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.dropdown-item-modern:hover {
  background: rgba(139, 92, 246, 0.08);
  color: #8B5CF6;
}

.dropdown-item-modern svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #F3F4F6;
}

/* Filters Loading Overlay */
.filters-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.filters-loading-content {
  background: white;
  border-radius: 20px;
  padding: 3rem 4rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.loading-spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #8B5CF6;
  border-right: 4px solid #DF2DB2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: Lato, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
}

.loading-subtext {
  font-family: Lato, sans-serif;
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .entradas-container {
    padding: 0 1.5rem;
  }

  .entradas-header {
    margin: 0 -1.5rem 2rem -1.5rem;
  }

  .entradas-header-content {
    padding: 1.5rem 1.5rem 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .entradas-container {
    padding: 0 1rem;
  }

  .entradas-header {
    padding: 0 0 1.25rem 0;
    margin: 0 -1rem 1.5rem -1rem;
  }

  .entradas-header-content {
    padding: 1.25rem 1rem 0 1rem;
  }

  .header-title-section {
    gap: 0.875rem;
  }

  .header-icon {
    width: 26px;
    height: 26px;
  }

  .entradas-title {
    font-size: 1.35rem;
    line-height: 1.3;
  }

  .entradas-subtitle {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .tabs-modern {
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.375rem;
    border-radius: 14px;
  }

  .tab-button {
    padding: 0.75rem 0.625rem;
    font-size: 0.85rem;
    flex-direction: column;
    gap: 0.375rem;
    border-radius: 10px;
  }

  .tab-button svg {
    width: 18px;
    height: 18px;
  }

  .filters-advanced {
    padding: 1.25rem;
    border-radius: 16px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions-row {
    flex-direction: column;
  }

  .modern-btn {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .table-section {
    border-radius: 16px;
  }
}

@media (max-width: 480px) {
  .entradas-container {
    padding: 0 0.875rem;
  }

  .entradas-header {
    padding: 0 0 1rem 0;
    margin: 0 -0.875rem 1.25rem -0.875rem;
  }

  .entradas-header-content {
    padding: 1rem 0.875rem 0 0.875rem;
  }

  .header-title-section {
    gap: 0.625rem;
    align-items: flex-start;
  }

  .header-icon {
    width: 22px;
    height: 22px;
    margin-top: 0.125rem;
  }

  .entradas-title {
    font-size: 1.05rem;
    line-height: 1.3;
    overflow-wrap: break-word;
  }

  .entradas-subtitle {
    font-size: 0.72rem;
    line-height: 1.3;
    overflow-wrap: break-word;
  }

  .tabs-modern {
    padding: 0.25rem;
    gap: 0.375rem;
    border-radius: 12px;
  }

  .tab-button {
    padding: 0.625rem 0.5rem;
    gap: 0.25rem;
    border-radius: 8px;
    font-size: 0.8rem;
  }

  .tab-button svg {
    width: 16px;
    height: 16px;
  }

  .filters-advanced {
    padding: 1rem;
    border-radius: 14px;
  }

  .filter-label {
    font-size: 13px;
  }

  .modern-input,
  .modern-select {
    padding: 0.75rem 0.875rem;
    font-size: 0.875rem;
  }

  .modern-btn {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .table-section {
    border-radius: 14px;
  }
}
</style>