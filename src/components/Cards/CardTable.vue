<template>
  <div class="billing-table-card">
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6rounded pt-2 pb-4">
      <div class="overflow-x-auto">
        <div class="table-perOptions" style="margin-left: 1.5rem;">
          <b-form-select v-model="perPage" :options="grid.pageOptions" style="width: 95px; height: 42px;"
            @change="() => myCallback(currentPage, perPage)" />
          <p style="font-size: 14px; color: #727370 !important; margin: 0; padding: 0; font-family: Lato;">
            Se están mostrando {{ items.length }} de {{ grid.perPage }} registros por página (total: {{ grid.totalRows
            }}
            registros)
          </p>
        </div>

        <b-table :items="items" :fields="computedFields" :busy="grid.isLoading" busyLoadingText="Cargando..."
          no-local-sorting responsive="sm" :noProviderSorting="false" :noProviderFiltering="false"
          :noSortableIcon="true" class="mb-4">
          <template #emptyText>
            <div class="text-center my-3">
              <b-icon icon="exclamation-circle-fill"></b-icon>
              <p>No existen datos</p>
            </div>
          </template>

          <template #cell(FCRCN)="data">
            <span>{{ formatoFecha(data.value) }}</span>
          </template>

          <template #head(CHECK)>
            <div class="flex items-center justify-center">
              <input type="checkbox" class="check-head form-check-input"
                @change="(e) => actions.checkeoud.actionFull(e.target.checked)" />
            </div>
          </template>


          <template #cell(CHECK)="data">
            <input type="checkbox" class="check-item form-check-input" :checked="data.item?.checked"
              v-model="data.item.checked" @change="(e) => actions.checkeoud.action(e.target.checked, data.item)" />
          </template>

          <template #cell(FEDCN)="data">
            <span>{{ formatoFecha(data.value) }}</span>
          </template>

          <template #cell(CDESTDO)="data">
            <span :style="{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: data.value === 'A' ? '#22c55e' : '#ef4444',
              cursor: 'pointer'
            }" :title="data.value === 'A' ? 'Activo' : 'Inactivo'"></span>
          </template>


          <template #cell(ESTADO)="data">
            <span :class="data.value ? 'estado-circle estado-active' : 'estado-circle estado-inactive'"
              :title="data.value ? 'Activo' : 'Inactivo'"
              style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; cursor: pointer;"></span>
          </template>

          <template #cell(IMAGEN)="data">
            <div style="width: 100px; height: 100px;">
              <a :href="data.value" target="_blank">
                <img :src="data.value" alt="imagen" style="width: 100%; height: 100%; object-fit: cover;">
              </a>
            </div>
          </template>

          <template #cell(TITLEALT)="data">
            <div v-html="data.value" @click="actions.execute.action(data.item)" style="cursor: pointer;">

            </div>
          </template>

          <template #cell(BAN)="data">
            <div v-html="data.value"></div>
          </template>

          <template #cell(DDIRECTORIO)="data">
            <div v-html="data.value"></div>
          </template>


          <template #cell(BOLETIN)="data">
            <a :href="data.value" target="_blank">
              <span>{{
                data.value.length > 30 ? data.value.substring(0, 30) + '...' : data.value
              }}</span>
            </a>
          </template>

          <!-- // HTML -->
          <template #cell(TEMA)="data">
            <span v-html="data.value"></span>
          </template>

          <template #cell(DETALLE)="data">
            <span v-html="data.value"></span>
          </template>

          <template #cell(AUTOR)="data">
            <span v-html="data.value"></span>
          </template>

          <template #cell(DESCRIPCION)="data">
            <span v-html="data.value"></span>
          </template>

          <template #cell(RTAFTO)="data">
            <span v-html="data.value"></span>
          </template>

          <!-- COLUMNA EXPANDIR -->
          <template #cell(EXPANDIR)="data">
            <button @click="data.toggleDetails" class="expand-btn" :class="{ 'expanded': data.detailsShowing }"
              :title="data.detailsShowing ? 'Ocultar auditoría' : 'Ver auditoría'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </template>

          <!-- DETALLES DE AUDITORÍA -->
          <template #row-details="data">
            <div class="audit-details">
              <div class="audit-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h4>Información de Auditoría</h4>
              </div>
              <div class="audit-grid">
                <div v-if="data.item.FCRCN" class="audit-item">
                  <label>Fecha de Creación:</label>
                  <span>{{ formatoFecha(data.item.FCRCN) }}</span>
                </div>
                <div v-if="data.item.UCRCN" class="audit-item">
                  <label>Usuario Creación:</label>
                  <span>{{ data.item.UCRCN }}</span>
                </div>
                <div v-if="data.item.FEDCN" class="audit-item">
                  <label>Fecha de Edición:</label>
                  <span>{{ formatoFecha(data.item.FEDCN) }}</span>
                </div>
                <div v-if="data.item.UEDCN" class="audit-item">
                  <label>Usuario Edición:</label>
                  <span>{{ data.item.UEDCN }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- ACCIONES -->
          <template #cell(ACCIONES)="data">
            <div class="flex items-center justify-center gap-0">
              <b-button v-if="actions.edit" :title="actions.edit.label" @click="actions.edit.action(data.item)"
                class="action-btn action-btn-edit">
                <img src="@/assets/img/icons/edit.svg" alt="edit" width="24" height="24" />
              </b-button>
              <b-button v-if="actions.delete && deleteRole && (data.item?.PROP === undefined || data.item.PROP === 1)"
                :title="actions.delete.label" @click="actions.delete.action(data.item)"
                class="action-btn action-btn-delete">
                <img src="@/assets/img/icons/delete.svg" alt="delete" width="24" height="24" />
              </b-button>

              <b-button v-if="actions.shared && (data.item?.PROP === undefined || data.item.PROP === 1)"
                :title="actions.shared.label" @click="actions.shared.action(data.item)"
                class="action-btn action-btn-shared">
                <img src="@/assets/img/icons/shared.svg" alt="share" width="24" height="24" />
              </b-button>

              <b-button v-if="actions.users" :title="actions.users.label" @click="actions.users.action(data.item)"
                class="action-btn action-btn-users">
                <img src="@/assets/img/icons/usersshared.svg" alt="users" width="24" height="24" />
              </b-button>

              <b-button v-if="actions.updateShared && (data.item?.PROP === undefined || data.item.PROP === 1)"
                :title="actions.updateShared.label" @click="actions.updateShared.action(data.item)"
                class="action-btn action-btn-settings">
                <img src="@/assets/img/icons/settings.svg" alt="users" width="24" height="24" />
              </b-button>

              <b-button v-if="actions.view" :title="actions.view.label" @click="actions.view.action(data.item)"
                class="action-btn action-btn-view">
                <img src="@/assets/img/icons/eyeView.svg" alt="visualizar" width="24" height="24" />
              </b-button>

              <div v-if="actions.download">
                <b-button v-if="!actions.download.dropdown" :title="actions.download.label"
                  @click="actions.download.action(data.item)" class="mr-2 btn-delete" size="sm">
                  <i :class="actions.download.icon"></i>
                </b-button>

                <b-dropdown v-else :text="actions.download.label" variant="primary" size="sm" no-caret>
                  <template #button-content>
                    <i :class="actions.download.icon"></i>
                  </template>

                  <b-dropdown-item v-for="(item, index) in actions.download.dropdown.items" :key="index"
                    @click="item.action(data.item)">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          </template>
        </b-table>

      </div>

      <div class="flex justify-start mb-3 gap-2 flex-col md:flex-row" style="margin-left: 1.5rem;">
        <b-pagination v-model="currentPage" :total-rows="grid.totalRows" @update:model-value="myCallback"
          :per-page="grid.perPage" aria-controls="my-table" class="my-0" />
        <!-- <b-input type="number" v-model="currentPage" @input="currentPage" placeholder="Buscar..." class="ml-2"
        style="width: 70px;height: 37px" /> -->
      </div>
    </div>
  </div>
</template>
<script>

import { BPagination, BTable, BButton, BDropdown, BDropdownItem, BFormSelect } from 'bootstrap-vue-next';
import moment from 'moment';

export default {
  data() {
    return {
      currentPage: 1,
      perPage: 10,
    };
  },
  components: {
    BPagination,
    BTable,
    BButton,
    BDropdown,
    BDropdownItem,
    BFormSelect
  },
  props: {
    search: {
      type: Function,
      default: () => { },
    },
    fields: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    grid: {
      type: Object,
      default: () => {
        return {
          items: [],
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          isLoading: true,
          pageOptions: [5, 10, 15, 50],
        };
      },
    },
    actions: {
      type: Object,
      default: () => { },
    },
    deleteRole: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    computedFields() {
      // Verificar si hay datos de auditoría en los items
      const hasAuditData = this.items.some(item =>
        item.FCRCN || item.UCRCN || item.FEDCN || item.UEDCN
      );

      // Verificar si ya existe la columna EXPANDIR
      const hasExpandirColumn = this.fields.some(field => field.key === 'EXPANDIR');

      // Si hay auditoría y no existe EXPANDIR, agregarla y quitar columnas de auditoría
      if (hasAuditData && !hasExpandirColumn) {
        // Buscar el índice de ACCIONES para insertar EXPANDIR antes
        const accionesIndex = this.fields.findIndex(field => field.key === 'ACCIONES');
        // Filtrar las columnas de auditoría
        const auditKeys = ['FCRCN', 'UCRCN', 'FEDCN', 'UEDCN'];
        let filteredFields = this.fields.filter(field => !auditKeys.includes(field.key));
        if (accionesIndex === -1) {
          // No hay columna ACCIONES, agregar EXPANDIR al final
          return [...filteredFields, {
            key: 'EXPANDIR',
            label: 'Auditoría',
            class: 'text-center',
            sortable: false
          }];
        }
        // Insertar EXPANDIR antes de ACCIONES
        const newFields = [...filteredFields];
        const idx = newFields.findIndex(field => field.key === 'ACCIONES');
        newFields.splice(idx, 0, {
          key: 'EXPANDIR',
          label: 'Auditoría',
          class: 'text-center',
          sortable: false
        });
        return newFields;
      }
      return this.fields;
    }
  },
  methods: {
    async myCallback(page) {
      await this.search(page, this.perPage)
    },
    formatoFecha(fecha) {
      try {
        return moment.utc(fecha).local().format('DD/MM/YYYY, h:mm a');
      } catch (error) {
        return "";
      }
    },
    toggleDetails(item) {
      this.$set(item, '_showDetails', !item._showDetails);
    }
  },
  mounted() {
    this.search(this.grid.currentPage, this.grid.perPage)
  }
};
</script>


<style>
/* Responsive Table Improvements */
.overflow-x-auto {
  width: 100%;
  overflow-x: auto;
}


/* Auditoría: fila en desktop, columna en móvil */
.audit-grid {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .audit-grid {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 1024px) {

  table th,
  table td {
    padding: 0.7rem 0.7rem !important;
    font-size: 13px !important;
  }

  .table-perOptions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 768px) {
  .overflow-x-auto {
    padding-bottom: 1rem;
  }

  table {
    font-size: 12px !important;
    min-width: 600px;
  }

  table th,
  table td {
    padding: 0.5rem 0.5rem !important;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    margin: 0 1px;
  }

  .audit-details {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .overflow-x-auto {
    padding-bottom: 1.5rem;
  }

  table {
    font-size: 11px !important;
    min-width: 480px;
  }

  .table-perOptions {
    gap: 0.25rem;
  }

  .audit-details {
    padding: 0.5rem;
  }
}

/* "items-center w-full bg-transparent border-collapse */
table {
  width: 100% !important;
  font-family: Lato, sans-serif;
  font-size: 15px !important;
  border-collapse: separate !important;
  border-spacing: 0 !important;
}

table th,
table td {
  padding: .9rem 1.5rem !important;
}

table tbody tr td {
  padding: 16px;
  color: #4a5568 !important;
  background-color: #ffffff !important;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

table tbody tr:hover td {
  background-color: #f8fafc !important;
}

table thead tr th {
  padding: 14px 20px;
  background: rgba(139, 92, 246, 0.04) !important;
  color: #4a5568 !important;
  vertical-align: middle !important;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  border: none !important;
  border-bottom: 1px solid rgba(139, 92, 246, 0.12) !important;
}

table tbody tr {
  border-bottom: 1px solid #e2e8f0 !important;
}

table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 12px;
}

table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 12px;
}

.table-perOptions {
  display: flex;
  justify-content: start;
  margin-bottom: .5rem;
  gap: 1rem;
  flex-direction: row;
  align-items: center;
}

.table-perOptions select {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: Lato, sans-serif;
  font-size: 12.5px;
  color: #4a5568;
  background-color: white;
  transition: all 0.2s ease;
  cursor: pointer;
}

.table-perOptions select:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.table-perOptions select:hover {
  border-color: #c4b5fd;
}

/* Expand Button */
.expand-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-btn svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #8B5CF6;
}

.expand-btn:hover {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.expand-btn:hover svg {
  color: white;
}

.expand-btn.expanded svg {
  transform: rotate(180deg);
}

.expand-btn.expanded {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  border-color: transparent;
}

.expand-btn.expanded svg {
  color: white;
}

/* Audit Details */
.audit-details {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 2px solid #e2e8f0;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.audit-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.audit-header svg {
  color: #8B5CF6;
  flex-shrink: 0;
}

.audit-header h4 {
  font-family: Lato, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

/* border-top-left-radius: 12px; */
/* border-top-right-radius: 12px; */
.audit-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.audit-item {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  /* border-bottom-left-radius: 12px; */
  /* border-bottom-right-radius: 12px; */
}

.audit-item label {
  display: block;
  font-family: Lato, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.audit-item span {
  display: block;
  font-family: Lato, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

/* Action Buttons */
.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 3px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn-edit:hover {
  background: linear-gradient(135deg, #8B5CF6 0%, #185CE6 100%);
  border-color: transparent;
}

.action-btn-edit:hover img {
  filter: brightness(0) invert(1);
}

.action-btn-delete:hover {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF1744 100%);
  border-color: transparent;
}

.action-btn-delete:hover img {
  filter: brightness(0) invert(1);
}

.action-btn-shared:hover,
.action-btn-users:hover,
.action-btn-settings:hover {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 100%);
  border-color: transparent;
}

.action-btn-shared:hover img,
.action-btn-users:hover img,
.action-btn-settings:hover img {
  filter: brightness(0) invert(1);
}

.action-btn-view:hover {
  background: linear-gradient(135deg, #27AE60 0%, #00C853 100%);
  border-color: transparent;
}

.action-btn-view:hover img {
  filter: brightness(0) invert(1);
}

.action-btn:active {
  transform: translateY(0);
}

/* Estado Circle */
.estado-circle {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: box-shadow 0.2s;
}

.estado-active {
  background: linear-gradient(135deg, #C7FFDE 0%, #047857 100%);
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.15);
}

.estado-inactive {
  background: linear-gradient(135deg, #FFB2B2 0%, #DC2626 100%);
  box-shadow: 0 2px 8px rgba(255, 77, 77, 0.15);
}

/* Pagination Styling */
.pagination {
  gap: 6px;
}

.page-item .page-link {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #4a5568;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  margin: 0 2px;
  transition: all 0.2s ease;
}

.page-item .page-link:hover {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.page-item.disabled .page-link {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
  color: #cbd5e1;
}

/* // en celular */
@media (max-width: 768px) {
  .table-perOptions {
    flex-direction: column;
    align-items: start;
  }

  table {
    font-size: 14px !important;
  }

  table th,
  table td {
    padding: .6rem 1rem !important;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    margin: 0 2px;
  }

  .action-btn img {
    width: 1.1rem !important;
    height: 1.1rem !important;
  }


  table thead tr th:first-child {
    border-top-left-radius: 12px;
  }

  table thead tr th:last-child {
    border-top-right-radius: 12px;
  }
}


.billing-table-card {
  background: white !important;
  border-radius: 0 0 20px 20px !important;
  padding: .5rem 1rem !important;
}

@media (max-width: 768px) {
  .billing-table-card {
    padding: 1.5rem 1.25rem !important;
    border-radius: 0 0 20px 20px !important;
  }
}


@media (max-width: 480px) {
  .billing-table-card {
    padding: 1.25rem 1rem !important;
  }
}
</style>