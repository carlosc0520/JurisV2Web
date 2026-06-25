<template>
  <div class="bg-white rounded-b-[20px] px-4 py-2 sm:px-5 sm:py-6">
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 pt-2 pb-4">
      <div class="overflow-x-auto">
        <div class="flex items-center gap-4 mb-2 ml-6 flex-wrap">
          <select v-model="perPage" @change="() => myCallback(currentPage, perPage)"
            class="h-[42px] w-[95px] rounded-xl border-2 border-slate-200 px-3 text-[12.5px] text-slate-600 bg-white cursor-pointer transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 hover:border-violet-300">
            <option v-for="opt in grid.pageOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <p class="text-sm text-slate-500 m-0 p-0">
            Se están mostrando {{ items.length }} de {{ grid.perPage }} registros por página (total: {{ grid.totalRows }} registros)
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
              <input type="checkbox" class="form-check-input"
                @change="(e) => actions.checkeoud.actionFull(e.target.checked)" />
            </div>
          </template>

          <template #cell(CHECK)="data">
            <input type="checkbox" class="form-check-input" :checked="data.item?.checked"
              v-model="data.item.checked" @change="(e) => actions.checkeoud.action(e.target.checked, data.item)" />
          </template>

          <template #cell(FEDCN)="data">
            <span>{{ formatoFecha(data.value) }}</span>
          </template>

          <template #cell(CDESTDO)="data">
            <span :style="{
              display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%',
              background: data.value === 'A' ? '#22c55e' : '#ef4444', cursor: 'pointer'
            }" :title="data.value === 'A' ? 'Activo' : 'Inactivo'"></span>
          </template>

          <template #cell(ESTADO)="data">
            <span :class="['inline-block w-4 h-4 rounded-full cursor-pointer transition-shadow',
              data.value
                ? 'bg-gradient-to-br from-green-200 to-emerald-700 shadow-[0_2px_8px_rgba(39,174,96,0.15)]'
                : 'bg-gradient-to-br from-red-200 to-red-600 shadow-[0_2px_8px_rgba(255,77,77,0.15)]']"
              :title="data.value ? 'Activo' : 'Inactivo'"></span>
          </template>

          <template #cell(IMAGEN)="data">
            <div class="w-[100px] h-[100px]">
              <a :href="data.value" target="_blank">
                <img :src="data.value" alt="imagen" class="w-full h-full object-cover" />
              </a>
            </div>
          </template>

          <template #cell(TITLEALT)="data">
            <div v-html="data.value" @click="actions.execute.action(data.item)" class="cursor-pointer"></div>
          </template>

          <template #cell(BAN)="data"><div v-html="data.value"></div></template>
          <template #cell(DDIRECTORIO)="data"><div v-html="data.value"></div></template>

          <template #cell(BOLETIN)="data">
            <a :href="data.value" target="_blank">
              <span>{{ data.value.length > 30 ? data.value.substring(0, 30) + '...' : data.value }}</span>
            </a>
          </template>

          <template #cell(TEMA)="data"><span v-html="data.value"></span></template>
          <template #cell(DETALLE)="data"><span v-html="data.value"></span></template>
          <template #cell(AUTOR)="data"><span v-html="data.value"></span></template>
          <template #cell(DESCRIPCION)="data"><span v-html="data.value"></span></template>
          <template #cell(RTAFTO)="data"><span v-html="data.value"></span></template>

          <template #cell(EXPANDIR)="data">
            <button @click="data.toggleDetails"
              :class="['w-9 h-9 rounded-[10px] border inline-flex items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,92,246,0.3)]',
                data.detailsShowing
                  ? 'bg-gradient-to-br from-brand-pink via-purple-500 to-brand-blue border-transparent'
                  : 'bg-white border-slate-200']"
              :title="data.detailsShowing ? 'Ocultar auditoría' : 'Ver auditoría'">
              <svg :class="['w-5 h-5 transition-all duration-300', data.detailsShowing ? 'text-white rotate-180' : 'text-purple-500']"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </template>

          <template #row-details="data">
            <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 my-4 border-2 border-slate-200 animate-fade-up">
              <div class="flex items-center gap-2.5 mb-5 pb-4 border-b-2 border-slate-200">
                <svg class="w-5 h-5 text-purple-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <h4 class="text-base font-bold m-0 text-gradient-brand-section">
                  Información de Auditoría
                </h4>
              </div>
              <div class="flex flex-row gap-4 flex-wrap sm:flex-col">
                <div v-if="data.item.FCRCN" class="bg-white p-4 rounded-[10px] border border-slate-200">
                  <label class="block text-[12px] font-semibold text-slate-500 uppercase tracking-[0.5px] mb-2">Fecha de Creación:</label>
                  <span class="block text-sm font-medium text-slate-800">{{ formatoFecha(data.item.FCRCN) }}</span>
                </div>
                <div v-if="data.item.UCRCN" class="bg-white p-4 rounded-[10px] border border-slate-200">
                  <label class="block text-[12px] font-semibold text-slate-500 uppercase tracking-[0.5px] mb-2">Usuario Creación:</label>
                  <span class="block text-sm font-medium text-slate-800">{{ data.item.UCRCN }}</span>
                </div>
                <div v-if="data.item.FEDCN" class="bg-white p-4 rounded-[10px] border border-slate-200">
                  <label class="block text-[12px] font-semibold text-slate-500 uppercase tracking-[0.5px] mb-2">Fecha de Edición:</label>
                  <span class="block text-sm font-medium text-slate-800">{{ formatoFecha(data.item.FEDCN) }}</span>
                </div>
                <div v-if="data.item.UEDCN" class="bg-white p-4 rounded-[10px] border border-slate-200">
                  <label class="block text-[12px] font-semibold text-slate-500 uppercase tracking-[0.5px] mb-2">Usuario Edición:</label>
                  <span class="block text-sm font-medium text-slate-800">{{ data.item.UEDCN }}</span>
                </div>
              </div>
            </div>
          </template>

          <template #cell(ACCIONES)="data">
            <div class="flex items-center justify-center gap-0">
              <button v-if="actions.edit" :title="actions.edit.label" @click="actions.edit.action(data.item)"
                class="group relative w-10 h-10 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md overflow-hidden mx-px">
                <span class="absolute inset-0 bg-gradient-to-br from-purple-500 to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <img src="@/assets/img/icons/edit.svg" alt="edit" class="relative z-10 w-6 h-6 group-hover:brightness-0 group-hover:invert" />
              </button>

              <button v-if="actions.delete && deleteRole && (data.item?.PROP === undefined || data.item.PROP === 1)"
                :title="actions.delete.label" @click="actions.delete.action(data.item)"
                class="group relative w-10 h-10 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md overflow-hidden mx-px">
                <span class="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <img src="@/assets/img/icons/delete.svg" alt="delete" class="relative z-10 w-6 h-6 group-hover:brightness-0 group-hover:invert" />
              </button>

              <button v-if="actions.shared && (data.item?.PROP === undefined || data.item.PROP === 1)"
                :title="actions.shared.label" @click="actions.shared.action(data.item)"
                class="group relative w-10 h-10 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md overflow-hidden mx-px">
                <span class="absolute inset-0 bg-gradient-to-br from-brand-pink to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <img src="@/assets/img/icons/shared.svg" alt="share" class="relative z-10 w-6 h-6 group-hover:brightness-0 group-hover:invert" />
              </button>

              <button v-if="actions.users" :title="actions.users.label" @click="actions.users.action(data.item)"
                class="group relative w-10 h-10 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md overflow-hidden mx-px">
                <span class="absolute inset-0 bg-gradient-to-br from-brand-pink to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <img src="@/assets/img/icons/usersshared.svg" alt="users" class="relative z-10 w-6 h-6 group-hover:brightness-0 group-hover:invert" />
              </button>

              <button v-if="actions.updateShared && (data.item?.PROP === undefined || data.item.PROP === 1)"
                :title="actions.updateShared.label" @click="actions.updateShared.action(data.item)"
                class="group relative w-10 h-10 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md overflow-hidden mx-px">
                <span class="absolute inset-0 bg-gradient-to-br from-brand-pink to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <img src="@/assets/img/icons/settings.svg" alt="settings" class="relative z-10 w-6 h-6 group-hover:brightness-0 group-hover:invert" />
              </button>

              <button v-if="actions.view" :title="actions.view.label" @click="actions.view.action(data.item)"
                class="group relative w-10 h-10 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md overflow-hidden mx-px">
                <span class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <img src="@/assets/img/icons/eyeView.svg" alt="visualizar" class="relative z-10 w-6 h-6 group-hover:brightness-0 group-hover:invert" />
              </button>

              <div v-if="actions.download">
                <button v-if="!actions.download.dropdown" :title="actions.download.label"
                  @click="actions.download.action(data.item)"
                  class="mr-2 w-10 h-10 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md mx-px">
                  <i :class="actions.download.icon"></i>
                </button>
                <b-dropdown v-else :text="actions.download.label" variant="primary" size="sm" no-caret>
                  <template #button-content>
                    <i :class="actions.download.icon"></i>
                  </template>
                  <b-dropdown-item v-for="(item, index) in actions.download.dropdown.items" :key="index"
                    @click="item.action(data.item)">
                    <i :class="item.icon"></i> {{ item.label }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          </template>
        </b-table>
      </div>

      <div class="flex justify-start mb-3 gap-2 flex-col md:flex-row ml-6">
        <b-pagination v-model="currentPage" :total-rows="grid.totalRows" @update:model-value="myCallback"
          :per-page="grid.perPage" aria-controls="my-table" class="my-0" />
      </div>
    </div>
  </div>
</template>

<script>
import { BPagination, BTable, BDropdown, BDropdownItem } from 'bootstrap-vue-next';
import moment from 'moment';

export default {
  data() {
    return { currentPage: 1, perPage: 10 };
  },
  components: { BPagination, BTable, BDropdown, BDropdownItem },
  props: {
    search: { type: Function, default: () => {} },
    fields: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    grid: {
      type: Object,
      default: () => ({ items: [], currentPage: 1, perPage: 10, totalRows: 0, isLoading: true, pageOptions: [5, 10, 15, 50] }),
    },
    actions: { type: Object, default: () => {} },
    deleteRole: { type: Boolean, default: true },
  },
  computed: {
    computedFields() {
      const hasAuditData = this.items.some(item => item.FCRCN || item.UCRCN || item.FEDCN || item.UEDCN);
      const hasExpandirColumn = this.fields.some(field => field.key === 'EXPANDIR');
      if (hasAuditData && !hasExpandirColumn) {
        const auditKeys = ['FCRCN', 'UCRCN', 'FEDCN', 'UEDCN'];
        let filteredFields = this.fields.filter(field => !auditKeys.includes(field.key));
        const accionesIndex = filteredFields.findIndex(field => field.key === 'ACCIONES');
        const expandirCol = { key: 'EXPANDIR', label: 'Auditoría', class: 'text-center', sortable: false };
        if (accionesIndex === -1) return [...filteredFields, expandirCol];
        const newFields = [...filteredFields];
        newFields.splice(accionesIndex, 0, expandirCol);
        return newFields;
      }
      return this.fields;
    }
  },
  methods: {
    async myCallback(page) { await this.search(page, this.perPage); },
    formatoFecha(fecha) {
      try { return moment.utc(fecha).local().format('DD/MM/YYYY, h:mm a'); }
      catch (e) { return ""; }
    },
  },
  mounted() { this.search(this.grid.currentPage, this.grid.perPage); }
};
</script>

<style>
table {
  width: 100% !important;
  font-family: Lato, sans-serif;
  font-size: 15px !important;
  border-collapse: separate !important;
  border-spacing: 0 !important;
}
table th, table td { padding: .9rem 1.5rem !important; }
table tbody tr td {
  padding: 16px;
  color: #4a5568 !important;
  background-color: #ffffff !important;
  transition: background-color 0.2s ease;
}
table tbody tr:hover td { background-color: #f8fafc !important; }
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
table tbody tr { border-bottom: 1px solid #e2e8f0 !important; }
table tbody tr:last-child td:first-child { border-bottom-left-radius: 12px; }
table tbody tr:last-child td:last-child { border-bottom-right-radius: 12px; }
.pagination { gap: 6px; }
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
@media (max-width: 1024px) {
  table th, table td { padding: 0.7rem 0.7rem !important; font-size: 13px !important; }
}
@media (max-width: 768px) {
  table { font-size: 14px !important; }
  table th, table td { padding: .6rem 1rem !important; }
  table thead tr th:first-child { border-top-left-radius: 12px; }
  table thead tr th:last-child { border-top-right-radius: 12px; }
}
</style>
