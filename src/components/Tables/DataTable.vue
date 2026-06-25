<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">

    <!-- Optional title header -->
    <div v-if="title || $slots.headerAction"
      class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700">
      <h3 v-if="title" class="text-sm font-semibold text-gray-700 dark:text-gray-200 m-0 flex items-center gap-2">
        {{ title }}
        <span class="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full font-semibold">
          {{ effectiveTotalRows }}
        </span>
      </h3>
      <slot name="headerAction"/>
    </div>

    <!-- Toolbar: per-page + summary -->
    <div class="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex-wrap">
      <div class="relative">
        <select v-model="localPerPage" @change="onPerPageChange"
          style="width:60px;padding: 5px !important;text-align-last: center;"
          class="appearance-none h-8 rounded-lg border border-slate-200 dark:border-gray-600 text-xs font-medium text-slate-600 dark:text-gray-300 bg-white dark:bg-gray-800 cursor-pointer transition-colors focus:outline-none focus:border-purple-400 hover:border-slate-300">
          <option v-for="opt in effectivePageOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <!-- chevron icon -->
        <svg class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <p class="text-xs text-slate-500 dark:text-gray-400 m-0 flex-1">
        Se están mostrando
        <span class="font-semibold text-gray-700 dark:text-gray-200">{{ fromRow }}</span>–<span
          class="font-semibold text-gray-700 dark:text-gray-200">{{ toRow }}</span>
        de <span class="font-semibold text-gray-700 dark:text-gray-200">{{ effectiveTotalRows }}</span> registros
      </p>
    </div>

    <!-- Loading -->
    <div v-if="effectiveLoading" class="flex items-center justify-center py-16">
      <span class="w-8 h-8 border-[3px] border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Empty -->
    <div v-else-if="!pagedItems.length" class="flex flex-col items-center justify-center py-16 gap-3">
      <svg class="w-14 h-14 text-gray-200 dark:text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
      <p class="text-sm text-gray-400 m-0">{{ emptyText || 'No hay datos disponibles' }}</p>
    </div>

    <!-- Table content -->
    <template v-else>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800/60">
              <!-- Checkbox header -->
              <th v-if="hasCheckbox"
                class="px-4 py-3 w-10 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                <input v-if="actions.checkeoud?.actionFull" type="checkbox"
                  @change="(e) => actions.checkeoud.actionFull(e.target.checked)"
                  class="w-4 h-4 rounded border-slate-300 text-purple-500 cursor-pointer" />
              </th>
              <!-- Field headers -->
              <th v-for="field in dataFields" :key="field.key"
                :class="['px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap', field.thClass || alignClass(field.class) || 'text-left']">
                {{ field.label }}
              </th>
              <!-- Actions column -->
              <th v-if="showActionsCol"
                class="px-4 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide w-36">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, idx) in pagedItems" :key="rowKey(item, idx)">

              <!-- Main row -->
              <tr
                class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
                <!-- Checkbox cell -->
                <td v-if="hasCheckbox" class="px-4 py-3 text-center align-middle">
                  <input type="checkbox" :checked="item.checked" v-model="item.checked"
                    @change="(e) => actions.checkeoud.action(e.target.checked, item)"
                    class="w-4 h-4 rounded border-slate-300 text-purple-500 focus:ring-purple-500/20 cursor-pointer" />
                </td>

                <!-- Data cells -->
                <td v-for="field in dataFields" :key="field.key"
                  :class="['px-4 py-3 text-gray-700 dark:text-gray-300 align-middle', field.class || field.tdClass || '']">

                  <!-- TITLEALT: html + optional execute click -->
                  <span v-if="field.key === 'TITLEALT'" v-html="cellValue(field, item)"
                    :class="actions.execute ? 'cursor-pointer' : ''"
                    @click="actions.execute && actions.execute.action(item)" />

                  <!-- Generic HTML field (html:true or known html keys) -->
                  <span v-else-if="isHtmlField(field)" v-html="cellValue(field, item)" />

                  <!-- CDESTDO: badge status -->
                  <span v-else-if="field.key === 'CDESTDO'"
                    :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold',
                      item.CDESTDO === 'A'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400']">
                    <span
                      :class="['w-1.5 h-1.5 rounded-full', item.CDESTDO === 'A' ? 'bg-emerald-500' : 'bg-red-400']" />
                    {{ item.CDESTDO === 'A' ? 'Activo' : 'Inactivo' }}
                  </span>

                  <!-- ESTADO: badge boolean -->
                  <span v-else-if="field.key === 'ESTADO'"
                    :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold',
                      item.ESTADO
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400']">
                    <span :class="['w-1.5 h-1.5 rounded-full', item.ESTADO ? 'bg-emerald-500' : 'bg-red-400']" />
                    {{ item.ESTADO ? 'Activo' : 'Inactivo' }}
                  </span>

                  <!-- IMAGEN -->
                  <div v-else-if="field.key === 'IMAGEN'" class="w-16 h-16">
                    <a :href="item.IMAGEN" target="_blank">
                      <img :src="item.IMAGEN" alt="imagen" referrerpolicy="no-referrer"
                        class="w-full h-full object-cover rounded-lg" />
                    </a>
                  </div>

                  <!-- BOLETIN: truncated link -->
                  <a v-else-if="field.key === 'BOLETIN'" :href="item.BOLETIN" target="_blank"
                    class="text-brand-blue hover:underline text-xs break-all">
                    {{ item.BOLETIN?.length > 35 ? item.BOLETIN.substring(0, 35) + '…' : item.BOLETIN }}
                  </a>

                  <!-- Default text (with optional formatter) -->
                  <span v-else>{{ cellValue(field, item) }}</span>
                </td>

                <!-- Actions cell -->
                <td v-if="showActionsCol" class="px-4 py-3 text-center align-middle">
                  <div class="flex items-center justify-center gap-1">

                    <!-- Audit expand -->
                    <button v-if="itemHasAudit(item)" @click="toggleExpand(rowKey(item, idx))"
                      :title="isExpanded(rowKey(item, idx)) ? 'Ocultar auditoría' : 'Ver auditoría'"
                      :class="['w-8 h-8 rounded-[8px] border inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5',
                        isExpanded(rowKey(item, idx))
                          ? 'bg-gradient-to-br from-brand-pink via-purple-500 to-brand-blue border-transparent text-white shadow-[0_2px_8px_rgba(139,92,246,0.4)]'
                          : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-slate-500 hover:border-purple-300 hover:text-purple-500']">
                      <svg
                        :class="['w-4 h-4 transition-transform duration-300', isExpanded(rowKey(item, idx)) ? 'rotate-180' : '']"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <!-- Edit -->
                    <button v-if="actions.edit" :title="actions.edit.label || 'Editar'"
                      @click="actions.edit.action(item)" class="action-btn group">
                      <span
                        class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-purple-500 to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src="@/assets/img/icons/edit.svg" alt="edit"
                        class="relative z-10 w-4 h-4 brightness-0 dark:invert group-hover:brightness-0 group-hover:invert" />
                    </button>

                    <!-- Renew plan (solo si el plan expiró) -->
                    <button v-if="actions.renew && isPlanExpired(item)"
                      :title="actions.renew.label || 'Renovar plan'"
                      @click="actions.renew.action(item)" class="action-btn group">
                      <span class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <svg class="relative z-10 w-4 h-4 text-slate-500 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                      </svg>
                    </button>

                    <!-- Delete -->
                    <button
                      v-if="actions.delete && deleteRole && (item?.PROP === undefined || item.PROP === 1)"
                      :title="actions.delete.label || 'Eliminar'" @click="actions.delete.action(item)"
                      class="action-btn group">
                      <span
                        class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src="@/assets/img/icons/delete.svg" alt="delete"
                        class="relative z-10 w-4 h-4 brightness-0 dark:invert group-hover:brightness-0 group-hover:invert" />
                    </button>

                    <!-- Shared -->
                    <button v-if="actions.shared && (item?.PROP === undefined || item.PROP === 1)"
                      :title="actions.shared.label || 'Compartir'" @click="actions.shared.action(item)"
                      class="action-btn group">
                      <span
                        class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-brand-pink to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src="@/assets/img/icons/shared.svg" alt="compartir"
                        class="relative z-10 w-4 h-4 brightness-0 dark:invert group-hover:brightness-0 group-hover:invert" />
                    </button>

                    <!-- Users -->
                    <button v-if="actions.users" :title="actions.users.label || 'Usuarios'"
                      @click="actions.users.action(item)" class="action-btn group">
                      <span
                        class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-brand-pink to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src="@/assets/img/icons/usersshared.svg" alt="usuarios"
                        class="relative z-10 w-4 h-4 brightness-0 dark:invert group-hover:brightness-0 group-hover:invert" />
                    </button>

                    <!-- Update Shared -->
                    <button
                      v-if="actions.updateShared && (item?.PROP === undefined || item.PROP === 1)"
                      :title="actions.updateShared.label || 'Actualizar'" @click="actions.updateShared.action(item)"
                      class="action-btn group">
                      <span
                        class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-brand-pink to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src="@/assets/img/icons/settings.svg" alt="actualizar"
                        class="relative z-10 w-4 h-4 brightness-0 dark:invert group-hover:brightness-0 group-hover:invert" />
                    </button>

                    <!-- View -->
                    <button v-if="actions.view" :title="actions.view.label || 'Ver'"
                      @click="actions.view.action(item)" class="action-btn group">
                      <span
                        class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src="@/assets/img/icons/eyeView.svg" alt="ver"
                        class="relative z-10 w-4 h-4 brightness-0 dark:invert group-hover:brightness-0 group-hover:invert" />
                    </button>

                    <!-- Download simple -->
                    <button v-if="actions.download && !actions.download.dropdown"
                      :title="actions.download.label || 'Descargar'" @click="actions.download.action(item)"
                      class="action-btn group">
                      <span
                        class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src="@/assets/img/icons/download.svg" alt="descargar"
                        class="relative z-10 w-4 h-4 brightness-0 dark:invert group-hover:brightness-0 group-hover:invert" />
                    </button>

                    <!-- Download dropdown -->
                    <div v-if="actions.download?.dropdown" class="relative">
                      <button :title="actions.download.label || 'Descargar'"
                        :disabled="actions.download.loadingId === item.ID"
                        @click.stop="actions.download.loadingId !== item.ID && (activeDropdown = activeDropdown === rowKey(item, idx) ? null : rowKey(item, idx))"
                        class="action-btn group disabled:cursor-wait">
                        <span
                          class="absolute inset-0 rounded-[8px] bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <svg v-if="actions.download.loadingId === item.ID" class="animate-spin relative z-10 w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <img v-else src="@/assets/img/icons/download.svg" alt="descargar"
                          class="relative z-10 w-4 h-4 brightness-0 dark:invert group-hover:brightness-0 group-hover:invert" />
                      </button>
                      <div v-if="activeDropdown === rowKey(item, idx)"
                        class="absolute right-0 z-50 mt-1 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-slate-200 dark:border-gray-700 py-1">
                        <button v-for="(dItem, di) in actions.download.dropdown.items" :key="di"
                          @click="dItem.action(item); activeDropdown = null"
                          class="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors">
                          <i v-if="dItem.icon" :class="dItem.icon" class="text-xs opacity-60" />
                          {{ dItem.label }}
                        </button>
                      </div>
                    </div>

                  </div>
                </td>
              </tr>

              <!-- Audit expand row -->
              <tr v-if="isExpanded(rowKey(item, idx))"
                class="border-t border-purple-100/60 dark:border-purple-900/20 bg-gradient-to-r from-slate-50 to-slate-50/30 dark:from-gray-800/40 dark:to-gray-800/10">
                <td :colspan="totalColumns" class="px-6 py-4">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-4 h-4 text-purple-500 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <h4
                      class="text-xs font-bold m-0 text-gradient-brand-section uppercase tracking-wide">
                      Información de Auditoría
                    </h4>
                  </div>
                  <div class="flex flex-row gap-3 flex-wrap">
                    <div class="bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
                      <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-[0.5px] mb-1">Fecha de Creación</label>
                      <span class="block text-xs font-medium text-slate-700 dark:text-gray-200">{{ item.FCRCN ? fmtFecha(item.FCRCN) : '—' }}</span>
                    </div>
                    <div class="bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
                      <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-[0.5px] mb-1">Usuario Creación</label>
                      <span class="block text-xs font-medium text-slate-700 dark:text-gray-200">{{ item.UCRCN || '—' }}</span>
                    </div>
                    <div class="bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
                      <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-[0.5px] mb-1">Fecha de Edición</label>
                      <span class="block text-xs font-medium text-slate-700 dark:text-gray-200">{{ item.FEDCN ? fmtFecha(item.FEDCN) : '—' }}</span>
                    </div>
                    <div class="bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
                      <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-[0.5px] mb-1">Usuario Edición</label>
                      <span class="block text-xs font-medium text-slate-700 dark:text-gray-200">{{ item.UEDCN || '—' }}</span>
                    </div>
                  </div>
                </td>
              </tr>

            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between gap-4 px-5 py-3.5 border-t border-gray-100 dark:border-gray-700 flex-wrap">
        <span class="text-xs text-gray-400 dark:text-gray-500">
          Página <span class="font-semibold text-gray-600 dark:text-gray-300">{{ currentPage }}</span>
          de <span class="font-semibold text-gray-600 dark:text-gray-300">{{ totalPages }}</span>
        </span>
        <div class="flex items-center gap-1">
          <button @click="goTo(1)" :disabled="currentPage === 1" class="pag-btn" title="Primera página">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
          <button @click="goTo(currentPage - 1)" :disabled="currentPage === 1" class="pag-btn">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button v-for="p in pageNumbers" :key="p" @click="goTo(p)"
            :class="['pag-btn', p === currentPage
              ? '!bg-gradient-to-br !from-brand-pink !via-purple-500 !to-brand-blue !border-transparent !text-white font-semibold shadow-[0_2px_8px_rgba(139,92,246,0.3)]'
              : '']">
            {{ p }}
          </button>
          <button @click="goTo(currentPage + 1)" :disabled="currentPage === totalPages" class="pag-btn">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button @click="goTo(totalPages)" :disabled="currentPage === totalPages" class="pag-btn"
            title="Última página">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import moment from 'moment';

// Keys that are always rendered as HTML (same as CardTable built-in slots)
const HTML_KEYS = new Set(['TITLEALT', 'BAN', 'DDIRECTORIO', 'TEMA', 'DETALLE', 'AUTOR', 'DESCRIPCION', 'RTAFTO']);
// Audit keys are shown in expand row, not as regular columns
const AUDIT_KEYS = new Set(['FCRCN', 'UCRCN', 'FEDCN', 'UEDCN']);

export default {
  name: 'DataTable',

  props: {
    items:      { type: Array,    default: () => [] },
    fields:     { type: Array,    default: () => [] },
    actions:    { type: Object,   default: () => ({}) },
    search:     { type: Function, default: null },
    deleteRole: { type: Boolean,  default: true },
    emptyText:  { type: String,   default: '' },
    title:      { type: String,   default: '' },

    // grid prop — same shape as CardTable for drop-in compatibility.
    // When null, falls back to individual loading/totalRows/perPage/pageOptions props.
    grid: {
      type: Object,
      default: null,
    },

    // Individual prop overrides (used when grid is not provided)
    loading:     { type: Boolean, default: false },
    totalRows:   { type: Number,  default: null },
    perPage:     { type: Number,  default: 10 },
    pageOptions: { type: Array,   default: null },

  },

  data() {
    return {
      currentPage:    1,
      localPerPage:   this.grid?.perPage ?? this.perPage,
      expandedKeys:   [],
      activeDropdown: null,
    };
  },

  computed: {
    effectiveLoading()     { return this.grid != null ? this.grid.isLoading : this.loading; },
    effectiveTotalRows() {
      if (this.grid != null) return this.grid.totalRows;
      return this.totalRows !== null ? this.totalRows : this.items.length;
    },
    effectivePageOptions() { return this.grid?.pageOptions ?? this.pageOptions ?? [5, 10, 15, 50]; },

    hasCheckbox() { return !!this.actions.checkeoud; },

    // Fields shown as columns: skip audit keys, EXPANDIR, ACCIONES (handled internally)
    visibleFields() {
      return this.fields.filter(f =>
        !AUDIT_KEYS.has(f.key) && f.key !== 'EXPANDIR' && f.key !== 'ACCIONES'
      );
    },
    // Data cells: exclude CHECK (rendered separately as first column)
    dataFields() { return this.visibleFields.filter(f => f.key !== 'CHECK'); },

    hasAuditInItems() {
      return this.items.some(i => i.FCRCN || i.UCRCN || i.FEDCN || i.UEDCN);
    },
    hasActionButtons() {
      return ['edit','renew','delete','shared','users','updateShared','view','download','execute'].some(k => !!this.actions[k]);
    },
    showActionsCol()  { return this.hasAuditInItems || this.hasActionButtons; },
    totalColumns()    { return this.visibleFields.length + (this.showActionsCol ? 1 : 0); },

    totalPages() { return Math.max(1, Math.ceil(this.effectiveTotalRows / this.localPerPage)); },

    pagedItems() {
      if (this.search) return this.items; // server-side: parent already sliced
      const start = (this.currentPage - 1) * this.localPerPage;
      return this.items.slice(start, start + this.localPerPage);
    },

    fromRow() {
      return this.effectiveTotalRows === 0 ? 0 : (this.currentPage - 1) * this.localPerPage + 1;
    },
    toRow() {
      return Math.min(this.currentPage * this.localPerPage, this.effectiveTotalRows);
    },

    pageNumbers() {
      const total = this.totalPages;
      const curr  = this.currentPage;
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
      let start = Math.max(1, curr - 2);
      let end   = Math.min(total, curr + 2);
      if (curr - 2 < 1)     end   = Math.min(total, end + (2 - curr + 1));
      if (curr + 2 > total) start = Math.max(1, start - (curr + 2 - total));
      const pages = [];
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },

  methods: {
    // Stable row identifier used for expand state and dropdown
    rowKey(item, idx) {
      const id = item.ID ?? item.id ?? item.IDMGT ?? item.IDNTRD
        ?? item.IDCNTCTO ?? item.IDFILTRO ?? item.IDDIRECTORIO
        ?? item.IDPREGUNTA ?? item.IDPLAN ?? item.IDRECURSO ?? item.IDNEWS;
      return id !== undefined ? String(id) : `row-${idx}`;
    },

    itemHasAudit(item) {
      return !!(item.FCRCN || item.UCRCN || item.FEDCN || item.UEDCN);
    },

    // Render cell: formatter takes priority, otherwise raw value
    cellValue(field, item) {
      const raw = item[field.key];
      if (field.formatter) return field.formatter(raw, field.key, item);
      return raw ?? '';
    },

    // Extract only the text-alignment class from a field's class string for use in <th>
    alignClass(cls) {
      const m = cls?.match(/\btext-(left|center|right)\b/);
      return m ? m[0] : '';
    },

    // A field renders as HTML if explicitly declared or its key is a known HTML key
    isHtmlField(field) {
      return field.html === true || HTML_KEYS.has(field.key);
    },

    isPlanExpired(item) {
      if (!item.FFIN) return false;
      return new Date() > new Date(item.FFIN);
    },

    fmtFecha(f) {
      try { return moment.utc(f).local().format('DD/MM/YYYY, HH:mm'); }
      catch { return ''; }
    },

    toggleExpand(key) {
      const idx = this.expandedKeys.indexOf(key);
      if (idx >= 0) this.expandedKeys.splice(idx, 1);
      else this.expandedKeys.push(key);
    },
    isExpanded(key) { return this.expandedKeys.includes(key); },

    goTo(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      if (this.search) this.search(page, this.localPerPage);
    },

    onPerPageChange() {
      this.currentPage = 1;
      if (this.search) this.search(1, this.localPerPage);
    },

    closeDropdown() { this.activeDropdown = null; },
  },

  watch: {
    items() {
      if (!this.search) this.currentPage = 1;
      this.expandedKeys = [];
    },
    'grid.perPage'(val) { if (val) this.localPerPage = val; },
  },

  mounted() {
    document.addEventListener('click', this.closeDropdown);
    if (this.search) this.search(this.currentPage, this.localPerPage);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  },
};
</script>

<style scoped>
.action-btn {
  @apply relative w-8 h-8 rounded-[8px] border border-slate-200 dark:border-gray-700
         bg-white dark:bg-gray-900 inline-flex items-center justify-center cursor-pointer
         transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden;
}

.pag-btn {
  @apply w-8 h-8 rounded-[8px] border border-slate-200 dark:border-gray-700
         bg-white dark:bg-gray-900 inline-flex items-center justify-center text-xs
         text-slate-500 dark:text-gray-400 transition-all
         hover:border-purple-300 hover:text-purple-500
         disabled:opacity-40 disabled:cursor-not-allowed
         hover:-translate-y-0.5;
}
</style>
