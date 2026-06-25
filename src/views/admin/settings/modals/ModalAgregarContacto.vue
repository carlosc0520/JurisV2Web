<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"/>

      <!-- Panel -->
      <div class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-modal overflow-hidden animate-fade-up">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 m-0 flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Agregar Contacto
          </h3>
          <button @click="close"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5">
          <!-- Search input -->
          <div class="relative mb-4">
            <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref="searchInput"
              v-model="query"
              @input="onInput"
              type="text"
              placeholder="Buscar por nombre o correo (mín. 6 caracteres)..."
              style="padding-left:2rem"
              class="w-full h-10 pr-4 text-sm rounded-xl border border-slate-200 dark:border-gray-600
                     bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200
                     placeholder-slate-400 focus:outline-none focus:border-purple-400
                     focus:ring-2 focus:ring-purple-400/15 transition-colors"
            />
            <button v-if="query" @click="query = ''; results = []"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <span class="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"/>
          </div>

          <!-- Sin resultados -->
          <div v-else-if="query.length >= 6 && !filteredResults.length" class="text-center py-8">
            <svg class="w-10 h-10 text-gray-200 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            <p class="text-sm text-gray-400 m-0">No se encontraron usuarios</p>
          </div>

          <!-- Hint mínimo -->
          <div v-else-if="!query || query.length < 6" class="text-center py-8">
            <p class="text-xs text-gray-400 m-0">Escribe al menos 6 caracteres para buscar</p>
          </div>

          <!-- Resultados -->
          <div v-else class="flex flex-col gap-1 max-h-72 overflow-y-auto -mx-2 px-2">
            <div v-for="opt in filteredResults" :key="opt.ID"
              class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div class="flex items-center gap-3 min-w-0">
                <img :src="opt.RTAFTO || defaultAvatar" referrerpolicy="no-referrer"
                  @error="e => e.target.src = defaultAvatar"
                  class="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-gray-100 dark:border-gray-700"
                  alt="avatar"/>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 m-0 truncate">{{ opt.DESCP }}</p>
                  <span class="text-xs text-gray-400">{{ (opt.EMAIL || '').toLowerCase() }}</span>
                </div>
              </div>
              <button type="button" @click="agregar(opt)"
                :disabled="adding === opt.ID"
                class="btn btn-create ml-3 flex-shrink-0 h-8 px-3 text-xs font-semibold rounded-lg">
                <svg v-if="adding !== opt.ID" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span v-if="adding !== opt.ID">Agregar</span>
                <span v-else class="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { toast } from 'vue3-toastify';
import UserProxy from '@/proxies/UserProxy';
import team2 from '@/assets/img/resources/perfil.png';

export default {
  name: 'ModalAgregarContacto',

  props: {
    modelValue:  { type: Boolean, default: false },
    existingIds: { type: Array,   default: () => [] }, // IDRECEPT ya agregados
  },
  emits: ['update:modelValue', 'added'],

  data() {
    return {
      defaultAvatar: team2,
      query:   '',
      results: [],
      loading: false,
      adding:  null,
      timer:   null,
    };
  },

  computed: {
    filteredResults() {
      return this.results.filter(r => !this.existingIds.includes(r.ID));
    },
  },

  watch: {
    modelValue(v) {
      if (v) {
        this.$nextTick(() => this.$refs.searchInput?.focus());
      } else {
        this.query   = '';
        this.results = [];
        this.adding  = null;
      }
    },
  },

  methods: {
    close() { this.$emit('update:modelValue', false); },

    onInput() {
      clearTimeout(this.timer);
      if (this.query.length < 6) { this.results = []; return; }
      this.timer = setTimeout(() => this.fetchResults(), 350);
    },

    async fetchResults() {
      this.loading = true;
      try {
        const data = await UserProxy.list(
          { ROWS: 10000, INIT: 0, DESC: this.query.trim(), CESTDO: 'A' }, '10'
        );
        this.results = (data || []).map(item => ({
          ...item,
          DESCP: this.fmt(`${item.NOMBRES||''} ${item.APATERNO||''} ${item.AMATERNO||''}`),
        }));
      } catch (err) {
        toast.error(err?.MESSAGE || 'Error al buscar usuarios');
      } finally {
        this.loading = false;
      }
    },

    async agregar(opt) {
      this.adding = opt.ID;
      try {
        const res = await UserProxy.createContacto({ IDRECEPT: opt.ID, ESTADO: 'false', CDESTDO: 'A' });
        if (res.STATUS) {
          toast.success('Contacto agregado correctamente');
          this.$emit('added');
          // quitar de resultados localmente para no mostrarlo de nuevo
          this.results = this.results.filter(r => r.ID !== opt.ID);
        } else {
          toast.error(res.MESSAGE);
        }
      } catch (err) {
        toast.error(err?.MESSAGE || 'Error al agregar contacto');
      } finally {
        this.adding = null;
      }
    },

    fmt(t) {
      return t.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    },
  },
};
</script>
