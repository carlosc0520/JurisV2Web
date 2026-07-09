<template>
  <div class="audit-page">
    <div class="audit-header">
      <h1 class="audit-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
        Auditoría IA
      </h1>
      <p class="audit-subtitle">Qué preguntan los usuarios y qué les respondió la IA</p>
    </div>

    <!-- Tabs -->
    <div class="tabs-bar">
      <button :class="['tab-btn', activeTab === 'busqueda' ? 'tab-btn--active' : '']" @click="switchTab('busqueda')">
        Búsqueda IA
      </button>
      <button :class="['tab-btn', activeTab === 'jurisgpt' ? 'tab-btn--active' : '']" @click="switchTab('jurisgpt')">
        JurisGPT
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters-bar">
      <input
        v-if="activeTab === 'busqueda'"
        v-model="qInput"
        @keyup.enter="applyFilters"
        type="text"
        class="filter-input"
        placeholder="Buscar por texto de la query…"
      />
      <select v-model="hasResultsFilter" @change="applyFilters" class="filter-select">
        <option :value="undefined">Todas</option>
        <option :value="true">Con resultados</option>
        <option :value="false">Sin resultados</option>
      </select>
      <button class="btn-secondary" @click="applyFilters" :disabled="loading">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :class="loading ? 'animate-spin' : ''">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Filtrar
      </button>
      <span class="filter-total">{{ total }} registros</span>
    </div>

    <!-- Tabla: Búsqueda IA -->
    <div v-if="activeTab === 'busqueda'" class="audit-table-wrap">
      <div v-if="loading" class="table-loading">Cargando…</div>
      <div v-else-if="!rows.length" class="table-empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-300 dark:text-gray-600 mb-2">
          <circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
        Sin registros para este filtro
      </div>
      <table v-else class="audit-table">
        <thead>
          <tr>
            <th style="width:36px"></th>
            <th>Usuario</th>
            <th>Query</th>
            <th>Resultados</th>
            <th>Sugerencia</th>
            <th>Tokens</th>
            <th>Duración</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in rows" :key="row.id">
            <tr class="audit-row" @click="toggleExpand(row.id)">
              <td>
                <span class="expand-btn" :class="expandedId === row.id ? 'expand-btn--open' : ''">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              </td>
              <td>
                <div class="user-cell">
                  <span class="user-name">{{ row.usuario || 'Sin nombre' }}</span>
                  <span class="user-email">{{ row.email || `#${row.userId}` }}</span>
                </div>
              </td>
              <td class="query-cell">{{ row.query }}</td>
              <td>
                <span :class="['results-badge', row.resultsCount === 0 ? 'results-badge--empty' : '']">
                  {{ row.resultsCount }}
                </span>
              </td>
              <td>
                <span v-if="row.hadSuggestion" class="suggestion-chip" :title="row.suggestion">{{ row.suggestion }}</span>
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="text-gray-400 text-xs">{{ row.tokensTotal }}</td>
              <td :class="['text-xs', durationClass(row.durationMs)]">{{ formatDuration(row.durationMs) }}</td>
              <td class="text-gray-400 text-xs">{{ formatDate(row.fecha) }}</td>
            </tr>

            <tr v-if="expandedId === row.id" class="expanded-row">
              <td colspan="8">
                <div class="detail-panel">
                  <p v-if="row.queryExpanded" class="detail-line">
                    <strong>Query expandida:</strong> {{ row.queryExpanded }}
                  </p>
                  <p v-if="row.filters" class="detail-line">
                    <strong>Filtros:</strong> {{ row.filters }}
                  </p>
                  <div v-if="row.results && row.results.length" class="entries-list">
                    <p class="detail-line"><strong>Entradas devueltas ({{ row.results.length }}):</strong></p>
                    <div v-for="r in row.results" :key="r.ranking" class="entry-chip" @click.stop="goToEntry(r.id)">
                      <span class="entry-rank">#{{ r.ranking }}</span>
                      <span class="entry-title">{{ r.titulo || `Entrada ${r.id}` }}</span>
                      <span v-if="r.score !== null" class="entry-score">{{ Math.round(r.score * 100) }}%</span>
                      <span v-else class="entry-score entry-score--filter" title="Coincidencia por filtro (magistrado/fecha), no por similitud semántica">filtro</span>
                    </div>
                  </div>
                  <p v-else class="detail-empty">No se encontraron entradas — posible hueco de data o query mal formulada.</p>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Tabla: JurisGPT -->
    <div v-if="activeTab === 'jurisgpt'" class="audit-table-wrap">
      <div v-if="loading" class="table-loading">Cargando…</div>
      <div v-else-if="!rows.length" class="table-empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-300 dark:text-gray-600 mb-2">
          <circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
        Sin registros para este filtro
      </div>
      <table v-else class="audit-table">
        <thead>
          <tr>
            <th style="width:36px"></th>
            <th>Usuario</th>
            <th>Pregunta</th>
            <th>Fuentes</th>
            <th>Tokens</th>
            <th>Duración</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in rows" :key="row.id">
            <tr class="audit-row" @click="toggleExpand(row.id)">
              <td>
                <span class="expand-btn" :class="expandedId === row.id ? 'expand-btn--open' : ''">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              </td>
              <td>
                <div class="user-cell">
                  <span class="user-name">{{ row.usuario || 'Sin nombre' }}</span>
                  <span class="user-email">{{ row.email || `#${row.userId}` }}</span>
                </div>
              </td>
              <td class="query-cell">{{ row.question || '—' }}</td>
              <td>
                <span :class="['results-badge', !row.sources.length ? 'results-badge--empty' : '']">
                  {{ row.sources.length }}
                </span>
              </td>
              <td class="text-gray-400 text-xs">{{ row.tokens }}</td>
              <td :class="['text-xs', durationClass(row.durationMs)]">{{ formatDuration(row.durationMs) }}</td>
              <td class="text-gray-400 text-xs">{{ formatDate(row.fecha) }}</td>
            </tr>

            <tr v-if="expandedId === row.id" class="expanded-row">
              <td colspan="7">
                <div class="detail-panel">
                  <p class="detail-line"><strong>Respuesta:</strong></p>
                  <p class="detail-answer">{{ row.answer }}</p>
                  <div v-if="row.sources.length" class="entries-list">
                    <p class="detail-line"><strong>Fuentes citadas ({{ row.sources.length }}):</strong></p>
                    <div v-for="s in row.sources" :key="s.id" class="entry-chip" @click.stop="goToEntry(s.id)">
                      <span class="entry-title">{{ s.titulo || `Entrada ${s.id}` }}</span>
                      <span class="entry-score">{{ s.score }}%</span>
                    </div>
                  </div>
                  <p v-else class="detail-empty">JurisGPT no encontró contexto relevante para responder — posible hueco de data.</p>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="audit-pag" v-if="total > 0">
      <span class="text-xs text-gray-400">Página {{ page }} de {{ totalPages }}</span>
      <div class="flex gap-1">
        <button class="pag-btn-sm" :disabled="page <= 1" @click="page--; load()">‹</button>
        <button class="pag-btn-sm" :disabled="page >= totalPages" @click="page++; load()">›</button>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import AiSearchProxy from '@/proxies/AiSearchProxy.js';
import JurisGPTProxy from '@/proxies/JurisGPTProxy.js';

export default {
  name: 'AiAudit',
  props: { role: { type: [Object, Array], default: () => ({}) } },

  data() {
    return {
      activeTab: 'busqueda',
      rows: [],
      total: 0,
      page: 1,
      limit: 20,
      loading: false,
      expandedId: null,
      qInput: '',
      q: '',
      hasResultsFilter: undefined,
    };
  },

  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.limit));
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    switchTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;
      this.page = 1;
      this.expandedId = null;
      this.qInput = '';
      this.q = '';
      this.hasResultsFilter = undefined;
      this.load();
    },

    applyFilters() {
      this.q = this.qInput.trim();
      this.page = 1;
      this.load();
    },

    toggleExpand(id) {
      this.expandedId = this.expandedId === id ? null : id;
    },

    async load() {
      this.loading = true;
      this.expandedId = null;
      try {
        if (this.activeTab === 'busqueda') {
          const res = await AiSearchProxy.getAudit({
            page: this.page,
            limit: this.limit,
            hasResults: this.hasResultsFilter,
            q: this.q || undefined,
          });
          this.rows  = res?.data ?? [];
          this.total = res?.total ?? 0;
        } else {
          const res = await JurisGPTProxy.getAudit({
            page: this.page,
            limit: this.limit,
            hasSources: this.hasResultsFilter,
          });
          this.rows  = res?.data ?? [];
          this.total = res?.total ?? 0;
        }
      } catch (e) {
        console.error('Error cargando auditoría:', e);
        toast.error('Error al cargar la auditoría', { toastId: 'ai-audit-err' });
      } finally {
        this.loading = false;
      }
    },

    goToEntry(entryId) {
      const route = this.role?.IDR === 2
        ? `/usuario/busqueda?id=${entryId}`
        : `/admin/busqueda?id=${entryId}`;
      const url = this.$router.resolve(route).href;
      window.open(url, '_blank');
    },

    formatDate(val) {
      if (!val) return '—';
      try {
        return new Date(val).toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      } catch { return val; }
    },

    formatDuration(ms) {
      if (ms === null || ms === undefined) return '—';
      return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
    },

    durationClass(ms) {
      if (ms === null || ms === undefined) return 'text-gray-400';
      if (ms >= 12000) return 'text-red-500';
      if (ms >= 6000) return 'text-orange-500';
      return 'text-gray-400';
    },
  },
};
</script>

<style scoped>
.audit-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.audit-header { margin-bottom: 18px; }
.audit-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}
:root.dark .audit-title { color: #f1f5f9; }
.audit-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}
:root.dark .audit-subtitle { color: #9ca3af; }

/* ── Tabs ─────────────────────────────────────────────────────── */
.tabs-bar {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}
:root.dark .tabs-bar { border-color: #334155; }
.tab-btn {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.tab-btn:hover { color: #185CE6; }
.tab-btn--active { color: #185CE6; border-bottom-color: #185CE6; font-weight: 700; }
:root.dark .tab-btn { color: #94a3b8; }
:root.dark .tab-btn--active { color: #93c5fd; border-bottom-color: #93c5fd; }

/* ── Filtros ──────────────────────────────────────────────────── */
.filters-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filter-input, .filter-select {
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 13px;
  background: #fff;
  color: #111827;
}
.filter-input { flex: 1; min-width: 200px; }
:root.dark .filter-input, :root.dark .filter-select {
  background: #1e293b; border-color: #334155; color: #e2e8f0;
}
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.btn-secondary:hover:not(:disabled) { border-color: #185CE6; color: #185CE6; }
.btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
:root.dark .btn-secondary { background: #1e293b; color: #94a3b8; border-color: #334155; }

.filter-total {
  margin-left: auto;
  font-size: 12px;
  color: #9ca3af;
}

/* ── Tabla ────────────────────────────────────────────────────── */
.audit-table-wrap {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}
:root.dark .audit-table-wrap { background: #1e293b; border-color: #334155; }

.table-loading, .table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #9ca3af;
  font-size: 13px;
}

.audit-table { width: 100%; border-collapse: collapse; }
.audit-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #9ca3af;
  padding: 10px 14px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}
:root.dark .audit-table th { background: #0f172a; border-color: #334155; color: #64748b; }
.audit-table td {
  padding: 10px 14px;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}
:root.dark .audit-table td { color: #cbd5e1; border-bottom-color: #1e293b; }
.audit-table tr:last-child td { border-bottom: none; }
.audit-row { cursor: pointer; transition: background 0.12s; }
.audit-row:hover { background: #f9fafb; }
:root.dark .audit-row:hover { background: #263449; }

.expand-btn {
  display: inline-flex;
  transition: transform 0.15s;
  color: #9ca3af;
}
.expand-btn--open { transform: rotate(90deg); }

.user-cell { display: flex; flex-direction: column; }
.user-name { font-weight: 600; font-size: 12.5px; }
.user-email { font-size: 11px; color: #9ca3af; }

.query-cell {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.results-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: #eff6ff;
  color: #2563eb;
}
:root.dark .results-badge { background: #1e3a5f; color: #60a5fa; }
.results-badge--empty { background: #fef2f2; color: #dc2626; }
:root.dark .results-badge--empty { background: #431414; color: #f87171; }

.suggestion-chip {
  display: inline-block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: #b45309;
  background: #fffbeb;
  padding: 2px 8px;
  border-radius: 6px;
}
:root.dark .suggestion-chip { background: #422006; color: #fbbf24; }

/* ── Fila expandida ───────────────────────────────────────────── */
.expanded-row td { background: #f9fafb; }
:root.dark .expanded-row td { background: #0f172a; }
.detail-panel { padding: 6px 4px 10px; }
.detail-line { font-size: 12.5px; color: #4b5563; margin: 0 0 6px; }
:root.dark .detail-line { color: #94a3b8; }
.detail-answer {
  font-size: 13px;
  color: #1f2937;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0 0 10px;
}
:root.dark .detail-answer { color: #e2e8f0; }
.detail-empty { font-size: 12.5px; color: #dc2626; font-style: italic; }
:root.dark .detail-empty { color: #f87171; }

.entries-list { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
.entry-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.entry-chip:hover { border-color: #185CE6; }
:root.dark .entry-chip { background: #1e293b; border-color: #334155; }
.entry-rank { color: #9ca3af; font-weight: 700; min-width: 22px; }
.entry-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #1f2937; }
:root.dark .entry-title { color: #e2e8f0; }
.entry-score {
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
}
:root.dark .entry-score { background: #14532d; color: #4ade80; }
.entry-score--filter { color: #7c3aed; background: #f5f3ff; }
:root.dark .entry-score--filter { background: #3b1d8e; color: #c084fc; }

/* ── Paginación ───────────────────────────────────────────────── */
.audit-pag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px 0;
}
.pag-btn-sm {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  font-size: 13px;
}
.pag-btn-sm:hover:not(:disabled) { border-color: #185CE6; color: #185CE6; }
.pag-btn-sm:disabled { opacity: 0.35; cursor: not-allowed; }
:root.dark .pag-btn-sm { background: #1e293b; border-color: #334155; color: #94a3b8; }

.animate-spin { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
