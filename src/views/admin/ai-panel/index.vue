<template>
  <div class="ai-panel-page">

    <!-- Header -->
    <div class="ai-panel-header">
      <div>
        <h1 class="ai-panel-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="ai-title-icon">
            <path d="M12 2l2 6h6l-5 3.6 1.9 5.9L12 14l-4.9 3.5L9 11.6 4 8h6z"/>
            <path d="M5 3l.8 2.5L8 6l-2.2.5L5 9l-.8-2.5L2 6l2.2-.5z"/>
            <path d="M19 15l.6 2 2 .5-2 .5-.6 2-.6-2-2-.5 2-.5z"/>
          </svg>
          Panel IA
        </h1>
        <p class="ai-panel-subtitle">Control de búsqueda semántica por embeddings</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="cache-badge">
          <span class="cache-dot"></span>
          Cache: {{ stats ? stats.cacheSize : '–' }} vectores en memoria
        </span>
        <button class="btn-secondary" @click="loadStats" :disabled="loadingStats">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            :class="loadingStats ? 'animate-spin' : ''">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Actualizar
        </button>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="stats-grid" v-if="stats">
      <div class="stat-card">
        <div class="stat-icon stat-icon--blue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div>
          <p class="stat-value">{{ stats.totalEntradas.toLocaleString() }}</p>
          <p class="stat-label">Entradas activas</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--green">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <p class="stat-value">{{ stats.totalEmbeddings.toLocaleString() }}</p>
          <p class="stat-label">Vectorizadas</p>
          <div class="stat-bar-bg">
            <div class="stat-bar-fill stat-bar-fill--green"
              :style="{ width: stats.totalEntradas ? (stats.totalEmbeddings / stats.totalEntradas * 100) + '%' : '0%' }"></div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div :class="['stat-icon', stats.missing > 0 ? 'stat-icon--orange' : 'stat-icon--green']">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div>
          <p :class="['stat-value', stats.missing > 0 ? 'text-orange-500' : 'text-green-500']">
            {{ stats.missing.toLocaleString() }}
          </p>
          <p class="stat-label">Sin embedding</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--purple">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <p class="stat-value">{{ stats.usage ? stats.usage.length : 0 }}</p>
          <p class="stat-label">Usuarios activos ({{ stats.month }})</p>
        </div>
      </div>
    </div>

    <!-- Skeleton cards -->
    <div class="stats-grid" v-else>
      <div v-for="i in 4" :key="i" class="stat-card animate-pulse">
        <div class="stat-icon-sk"></div>
        <div class="flex-1">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
        </div>
      </div>
    </div>

    <!-- Acción reindexar -->
    <div class="reindex-bar">
      <div class="flex items-center gap-3 flex-1">
        <div v-if="reindexing" class="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Generando embeddings… esto puede tardar 2-3 minutos para 1400 entradas
        </div>
        <div v-else-if="reindexResult" class="flex items-center gap-2 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-green-500">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span class="text-green-600 dark:text-green-400">
            Completado: {{ reindexResult.processed }} procesadas, {{ reindexResult.errors }} errores,
            {{ reindexResult.cached }} vectores en cache
          </span>
        </div>
        <span v-else class="text-sm text-gray-400 dark:text-gray-500">
          Genera embeddings para todas las entradas activas (lotes de 50)
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-secondary" @click="doReloadLimits" :disabled="reloadingLimits" title="Recarga los límites de planes desde la BD sin reiniciar el servidor">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            :class="reloadingLimits ? 'animate-spin' : ''">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          {{ reloadingLimits ? 'Recargando…' : 'Recargar límites' }}
        </button>
        <button class="btn-primary" @click="doReindex" :disabled="reindexing">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l2 6h6l-5 3.6 1.9 5.9L12 14l-4.9 3.5L9 11.6 4 8h6z"/>
          </svg>
          {{ reindexing ? 'Reindexando…' : 'Reindexar todo' }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-bar">
      <button :class="['tab-btn', activeTab === 'usage' ? 'tab-btn--active' : '']" @click="activeTab = 'usage'">
        Uso por usuario
        <span v-if="stats && stats.usage" class="tab-badge">{{ stats.usage.length }}</span>
      </button>
      <button :class="['tab-btn', activeTab === 'historial' ? 'tab-btn--active' : '']"
        @click="activeTab = 'historial'; loadHistorial()">
        Historial
      </button>
      <button :class="['tab-btn', activeTab === 'missing' ? 'tab-btn--active' : '']"
        @click="activeTab = 'missing'; loadMissing()">
        Sin embedding
        <span v-if="stats && stats.missing > 0" class="tab-badge tab-badge--orange">{{ stats.missing }}</span>
      </button>
    </div>

    <!-- Tab: Uso por usuario -->
    <div v-if="activeTab === 'usage'" class="panel-table-wrap">
      <div v-if="!stats" class="table-loading">Cargando…</div>
      <div v-else-if="!stats.usage || stats.usage.length === 0" class="table-empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-300 dark:text-gray-600 mb-2">
          <circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
        No hay búsquedas IA registradas este mes
      </div>
      <table v-else class="ai-table">
        <thead>
          <tr>
            <th style="width:36px"></th>
            <th>Usuario</th>
            <th>Búsquedas usadas</th>
            <th>Límite</th>
            <th>Progreso</th>
            <th>Tokens usados</th>
            <th>Última actividad</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in stats.usage" :key="row.userId">
            <tr class="usage-row" @click="toggleUserExpand(row.userId)">
              <td>
                <span class="expand-btn" :class="expandedUserId === row.userId ? 'expand-btn--open' : ''">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              </td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">
                    <img v-if="row.fotoRuta" :src="row.fotoRuta" :alt="row.nombre" class="user-avatar-img" />
                    <span v-else class="user-avatar-initials">{{ initials(row.nombre) }}</span>
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ row.nombre || 'Sin nombre' }}</span>
                    <span class="user-email">{{ row.email || `#${row.userId}` }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['usage-num', row.searchesUsed >= row.searchesLimit ? 'usage-num--full' : '']">
                  {{ row.searchesUsed }}
                </span>
              </td>
              <td class="text-gray-400">{{ row.searchesLimit }}</td>
              <td>
                <div class="progress-bg">
                  <div class="progress-fill"
                    :class="row.searchesUsed >= row.searchesLimit ? 'progress-fill--full' : ''"
                    :style="{ width: Math.min(100, (row.searchesUsed / row.searchesLimit) * 100) + '%' }">
                  </div>
                </div>
              </td>
              <td class="text-gray-400 text-xs">{{ row.tokensUsed?.toLocaleString() || 0 }}</td>
              <td class="text-gray-400 text-xs">{{ formatDate(row.updatedAt) }}</td>
            </tr>

            <!-- Fila expandida: mini gráfico del usuario -->
            <tr v-if="expandedUserId === row.userId" class="expanded-row">
              <td colspan="7">
                <div class="user-chart-panel">
                  <div v-if="userMonthlyLoading[row.userId]" class="user-chart-loading">
                    <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    Cargando historial…
                  </div>
                  <div v-else-if="userMonthlyData[row.userId] && !userMonthlyData[row.userId].length" class="user-chart-empty">
                    Sin búsquedas en los últimos 6 meses
                  </div>
                  <div v-else class="user-chart-inner">
                    <p class="user-chart-title">Búsquedas últimos 6 meses — {{ row.nombre }}</p>
                    <div class="user-chart-canvas-wrap">
                      <canvas :id="`user-chart-${row.userId}`" height="160"></canvas>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Tab: Historial mensual -->
    <div v-if="activeTab === 'historial'" class="panel-table-wrap">
      <div v-if="loadingMonthly" class="table-loading">
        <svg class="animate-spin mb-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Cargando historial…
      </div>
      <div v-else-if="!monthlyStats.length" class="table-empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-300 dark:text-gray-600 mb-2">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
        Sin datos de búsquedas aún
      </div>
      <div v-else class="historial-section">
        <!-- Pills de resumen -->
        <div class="historial-pills">
          <div class="h-pill">
            <span class="h-pill-val">{{ totalSearches.toLocaleString() }}</span>
            <span class="h-pill-lbl">Total búsquedas</span>
          </div>
          <div class="h-pill">
            <span class="h-pill-val">{{ totalTokens.toLocaleString() }}</span>
            <span class="h-pill-lbl">Tokens usados</span>
          </div>
          <div class="h-pill">
            <span class="h-pill-val">{{ avgSearches }}</span>
            <span class="h-pill-lbl">Promedio / mes</span>
          </div>
          <div class="h-pill">
            <span class="h-pill-val">{{ maxUniqueUsers }}</span>
            <span class="h-pill-lbl">Pico de usuarios</span>
          </div>
        </div>

        <!-- Gráfico de barras -->
        <div class="historial-chart-wrap">
          <p class="historial-chart-title">Búsquedas IA por mes — últimos 6 meses</p>
          <div class="historial-canvas-wrap">
            <canvas id="monthly-chart" height="260"></canvas>
          </div>
        </div>

        <!-- Tabla de detalle por mes -->
        <table class="ai-table">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Búsquedas</th>
              <th>Tokens</th>
              <th>Usuarios únicos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in monthlyStats" :key="row.month">
              <td class="font-medium">{{ formatMonth(row.month) }}</td>
              <td>
                <span class="usage-num">{{ row.searches }}</span>
              </td>
              <td class="text-gray-400 text-xs">{{ Number(row.tokens).toLocaleString() }}</td>
              <td class="text-gray-400 text-xs">{{ row.uniqueUsers }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab: Sin embedding -->
    <div v-if="activeTab === 'missing'" class="panel-table-wrap">
      <div v-if="loadingMissing" class="table-loading">Cargando entradas sin embedding…</div>
      <div v-else-if="missing.total === 0" class="table-empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-green-400 mb-2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Todas las entradas están vectorizadas
      </div>
      <template v-else>
        <table class="ai-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in missing.data" :key="row.id">
              <td class="font-mono text-xs text-gray-400">#{{ row.id }}</td>
              <td class="max-w-[360px] truncate text-sm">{{ row.titulo || '—' }}</td>
              <td>
                <span :class="['type-badge', row.type === 'jurisprudences' ? 'type-badge--juris' : 'type-badge--leg']">
                  {{ row.type === 'jurisprudences' ? 'Jurisp.' : 'Legis.' }}
                </span>
              </td>
              <td class="text-xs text-gray-400">{{ formatDate(row.fcrcn) }}</td>
              <td>
                <button class="btn-index" @click="doIndexEntry(row.id)" :disabled="indexingId === row.id">
                  <svg v-if="indexingId === row.id" class="animate-spin" width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M12 2l2 6h6l-5 3.6 1.9 5.9L12 14l-4.9 3.5L9 11.6 4 8h6z"/>
                  </svg>
                  {{ indexingId === row.id ? '…' : 'Indexar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div class="missing-pag">
          <span class="text-xs text-gray-400">{{ missing.total }} entradas sin embedding</span>
          <div class="flex gap-1">
            <button class="pag-btn-sm" :disabled="missingPage <= 1" @click="missingPage--; loadMissing()">‹</button>
            <span class="text-xs px-2 py-1">{{ missingPage }}</span>
            <button class="pag-btn-sm" :disabled="missingPage >= missingPages" @click="missingPage++; loadMissing()">›</button>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import Chart from 'chart.js';
import { toast } from 'vue3-toastify';
import AiSearchProxy from '@/proxies/AiSearchProxy.js';

export default {
  data() {
    return {
      activeTab:       'usage',
      stats:           null,
      loadingStats:    false,
      reindexing:      false,
      reindexResult:   null,
      missing:         { data: [], total: 0 },
      loadingMissing:  false,
      missingPage:     1,
      missingLimit:    20,
      indexingId:      null,
      reloadingLimits: false,
      // Historial mensual global
      monthlyStats:    [],
      loadingMonthly:  false,
      historialLoaded: false,
      // Expansión por usuario
      expandedUserId:  null,
      userMonthlyData:    {},
      userMonthlyLoading: {},
    };
  },
  computed: {
    missingPages() {
      return Math.max(1, Math.ceil(this.missing.total / this.missingLimit));
    },
    totalSearches() {
      return this.monthlyStats.reduce((s, r) => s + Number(r.searches), 0);
    },
    totalTokens() {
      return this.monthlyStats.reduce((s, r) => s + Number(r.tokens), 0);
    },
    avgSearches() {
      if (!this.monthlyStats.length) return 0;
      return Math.round(this.totalSearches / this.monthlyStats.length);
    },
    maxUniqueUsers() {
      if (!this.monthlyStats.length) return 0;
      return Math.max(...this.monthlyStats.map(r => Number(r.uniqueUsers)));
    },
  },
  methods: {
    // ── Stats generales ───────────────────────────────────────────────────────
    async loadStats() {
      this.loadingStats = true;
      try {
        this.stats = await AiSearchProxy.getStats();
      } catch {
        toast.error('Error al cargar estadísticas', { toastId: 'ai-stats-err' });
      } finally {
        this.loadingStats = false;
      }
    },

    // ── Sin embedding ─────────────────────────────────────────────────────────
    async loadMissing() {
      this.loadingMissing = true;
      try {
        this.missing = await AiSearchProxy.getMissing(this.missingPage, this.missingLimit);
      } catch {
        toast.error('Error al cargar entradas faltantes', { toastId: 'ai-miss-err' });
      } finally {
        this.loadingMissing = false;
      }
    },

    // ── Reindexar ─────────────────────────────────────────────────────────────
    async doReindex() {
      if (!confirm('¿Reindexar todas las entradas activas? El proceso puede tardar 2-3 minutos.')) return;
      this.reindexing   = true;
      this.reindexResult = null;
      try {
        this.reindexResult = await AiSearchProxy.reindex();
        toast.success(`Completado: ${this.reindexResult.processed} entradas vectorizadas`);
        await this.loadStats();
        if (this.activeTab === 'missing') await this.loadMissing();
      } catch {
        toast.error('Error durante el reindexado', { toastId: 'ai-reindex-err' });
      } finally {
        this.reindexing = false;
      }
    },

    async doIndexEntry(id) {
      this.indexingId = id;
      try {
        await AiSearchProxy.indexEntry(id);
        toast.success(`Entrada #${id} indexada`);
        this.missing.data  = this.missing.data.filter(r => r.id !== id);
        this.missing.total = Math.max(0, this.missing.total - 1);
        if (this.stats) {
          this.stats.totalEmbeddings++;
          this.stats.missing = Math.max(0, this.stats.missing - 1);
          this.stats.cacheSize++;
        }
      } catch {
        toast.error(`Error indexando entrada #${id}`, { toastId: 'ai-idx-err' });
      } finally {
        this.indexingId = null;
      }
    },

    async doReloadLimits() {
      this.reloadingLimits = true;
      try {
        const res = await AiSearchProxy.reloadLimits();
        toast.success(`Límites recargados: ${JSON.stringify(res.limits)}`);
      } catch {
        toast.error('Error al recargar límites', { toastId: 'ai-reload-err' });
      } finally {
        this.reloadingLimits = false;
      }
    },

    // ── Historial mensual global ──────────────────────────────────────────────
    async loadHistorial() {
      if (this.historialLoaded && this.monthlyStats.length) {
        await this.$nextTick();
        this.renderMonthlyChart();
        return;
      }
      this.loadingMonthly = true;
      try {
        this.monthlyStats   = await AiSearchProxy.getMonthlyStats();
        this.historialLoaded = true;
        await this.$nextTick();
        this.renderMonthlyChart();
      } catch {
        toast.error('Error al cargar historial', { toastId: 'ai-monthly-err' });
      } finally {
        this.loadingMonthly = false;
      }
    },

    renderMonthlyChart() {
      const canvas = document.getElementById('monthly-chart');
      if (!canvas || !this.monthlyStats.length) return;
      if (this._monthlyChart) {
        this._monthlyChart.destroy();
        this._monthlyChart = null;
      }
      const labels   = this.monthlyStats.map(r => this.formatMonth(r.month));
      const searches = this.monthlyStats.map(r => Number(r.searches));
      const self     = this;
      this._monthlyChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Búsquedas IA',
            backgroundColor: 'rgba(147,51,234,0.75)',
            borderColor: '#9333ea',
            borderWidth: 0,
            data: searches,
          }],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: { display: false },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              afterLabel(item) {
                const tokens = self.monthlyStats[item.index]?.tokens;
                const users  = self.monthlyStats[item.index]?.uniqueUsers;
                return [
                  tokens ? `Tokens: ${Number(tokens).toLocaleString()}` : '',
                  users  ? `Usuarios: ${users}` : '',
                ].filter(Boolean).join('\n');
              },
            },
          },
          scales: {
            xAxes: [{
              gridLines: { display: false },
              ticks: { fontColor: '#94a3b8' },
            }],
            yAxes: [{
              ticks: { beginAtZero: true, stepSize: 1, fontColor: '#94a3b8' },
              gridLines: { color: 'rgba(148,163,184,0.12)', drawBorder: false },
            }],
          },
        },
      });
    },

    // ── Expansión de usuario (mini gráfico) ───────────────────────────────────
    async toggleUserExpand(userId) {
      if (this.expandedUserId === userId) {
        if (this._userCharts?.[userId]) {
          this._userCharts[userId].destroy();
          delete this._userCharts[userId];
        }
        this.expandedUserId = null;
        return;
      }
      this.expandedUserId = userId;

      if (!this.userMonthlyData[userId]) {
        this.userMonthlyLoading = { ...this.userMonthlyLoading, [userId]: true };
        try {
          const data = await AiSearchProxy.getUserMonthly(userId);
          this.userMonthlyData = { ...this.userMonthlyData, [userId]: data };
        } catch {
          toast.error('Error al cargar historial del usuario', { toastId: 'ai-usr-monthly' });
        } finally {
          const loading = { ...this.userMonthlyLoading };
          delete loading[userId];
          this.userMonthlyLoading = loading;
        }
      }

      await this.$nextTick();
      this.renderUserChart(userId);
    },

    renderUserChart(userId) {
      const canvas = document.getElementById(`user-chart-${userId}`);
      if (!canvas) return;
      const data = this.userMonthlyData[userId] || [];
      if (!this._userCharts) this._userCharts = {};
      if (this._userCharts[userId]) this._userCharts[userId].destroy();

      const labels   = data.map(r => this.formatMonth(r.month));
      const searches = data.map(r => Number(r.searches));

      this._userCharts[userId] = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: labels.length ? labels : ['Sin datos'],
          datasets: [{
            data: searches.length ? searches : [0],
            backgroundColor: 'rgba(147,51,234,0.08)',
            borderColor: '#9333ea',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#9333ea',
            fill: true,
            lineTension: 0.3,
          }],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: { display: false },
          tooltips: { mode: 'index', intersect: false },
          scales: {
            xAxes: [{
              gridLines: { display: false },
              ticks: { fontColor: '#94a3b8', fontSize: 11 },
            }],
            yAxes: [{
              ticks: { beginAtZero: true, stepSize: 1, fontColor: '#94a3b8', fontSize: 11 },
              gridLines: { color: 'rgba(148,163,184,0.10)', drawBorder: false },
            }],
          },
        },
      });
    },

    // ── Utilidades ────────────────────────────────────────────────────────────
    formatMonth(ym) {
      if (!ym) return '';
      const [year, month] = ym.split('-');
      const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      return `${names[Number(month) - 1]} ${year}`;
    },

    initials(nombre) {
      if (!nombre) return '?';
      return nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    },

    formatDate(val) {
      if (!val) return '—';
      try {
        return new Date(val).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch { return val; }
    },
  },

  beforeUnmount() {
    if (this._monthlyChart) this._monthlyChart.destroy();
    if (this._userCharts)   Object.values(this._userCharts).forEach(c => c.destroy());
  },

  mounted() {
    this.loadStats();
  },
};
</script>

<style scoped>
.ai-panel-page {
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-page, #f8fafc);
}
.dark .ai-panel-page { background: #0f172a; }

/* Header */
.ai-panel-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
}
.ai-panel-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 1.375rem; font-weight: 700;
  color: #1e293b; margin: 0 0 4px;
}
.dark .ai-panel-title { color: #f1f5f9; }
.ai-title-icon { color: #9333ea; flex-shrink: 0; }
.ai-panel-subtitle { font-size: .8125rem; color: #64748b; margin: 0; }
.dark .ai-panel-subtitle { color: #94a3b8; }

.cache-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 10px; background: #f3e8ff; border: 1px solid #e9d5ff;
  border-radius: 8px; font-size: .75rem; font-weight: 500; color: #7c3aed;
}
.dark .cache-badge { background: #2e1065; border-color: #6b21a8; color: #c084fc; }
.cache-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,.25);
}

/* Stats */
.stats-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px; margin-bottom: 18px;
}
.stat-card {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
  padding: 16px 18px;
}
.dark .stat-card { background: #1e293b; border-color: #334155; }
.stat-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-icon--blue   { background: #eff6ff; color: #3b82f6; }
.stat-icon--green  { background: #f0fdf4; color: #22c55e; }
.stat-icon--orange { background: #fff7ed; color: #f97316; }
.stat-icon--purple { background: #faf5ff; color: #9333ea; }
.dark .stat-icon--blue   { background: #1e3a5f; color: #60a5fa; }
.dark .stat-icon--green  { background: #14532d; color: #4ade80; }
.dark .stat-icon--orange { background: #431407; color: #fb923c; }
.dark .stat-icon--purple { background: #2e1065; color: #c084fc; }
.stat-icon-sk { width: 40px; height: 40px; border-radius: 10px; background: #e2e8f0; flex-shrink: 0; }
.dark .stat-icon-sk { background: #334155; }
.stat-value { font-size: 1.375rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; line-height: 1; }
.dark .stat-value { color: #f1f5f9; }
.stat-label { font-size: .75rem; color: #64748b; margin: 0 0 6px; }
.dark .stat-label { color: #94a3b8; }
.stat-bar-bg { height: 4px; background: #e2e8f0; border-radius: 2px; width: 80px; }
.dark .stat-bar-bg { background: #334155; }
.stat-bar-fill { height: 4px; border-radius: 2px; background: #22c55e; transition: width .4s; }
.stat-bar-fill--green { background: #22c55e; }

/* Reindex bar */
.reindex-bar {
  display: flex; align-items: center; gap: 16px;
  background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px;
  padding: 14px 18px; margin-bottom: 20px;
}
.dark .reindex-bar { background: #1e1033; border-color: #4c1d95; }

/* Buttons */
.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; background: linear-gradient(135deg, #9333ea, #7c3aed);
  color: #fff; border: none; border-radius: 8px; font-size: .8125rem;
  font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap;
}
.btn-primary:hover:not(:disabled) { background: linear-gradient(135deg, #7c3aed, #6d28d9); box-shadow: 0 4px 12px rgba(124,58,237,.35); }
.btn-primary:disabled { opacity: .55; cursor: not-allowed; }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 12px; background: #fff; color: #475569;
  border: 1px solid #e2e8f0; border-radius: 8px; font-size: .8125rem;
  font-weight: 500; cursor: pointer; transition: all .2s;
}
.btn-secondary:hover:not(:disabled) { border-color: #94a3b8; color: #1e293b; }
.btn-secondary:disabled { opacity: .5; cursor: not-allowed; }
.dark .btn-secondary { background: #1e293b; color: #94a3b8; border-color: #334155; }
.dark .btn-secondary:hover:not(:disabled) { border-color: #64748b; color: #e2e8f0; }

/* Tabs */
.tabs-bar {
  display: flex; gap: 4px; border-bottom: 1px solid #e2e8f0;
  margin-bottom: 0;
}
.dark .tabs-bar { border-color: #334155; }
.tab-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; font-size: .8125rem; font-weight: 500;
  color: #64748b; background: transparent; border: none;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  cursor: pointer; transition: all .2s;
}
.tab-btn:hover { color: #9333ea; }
.tab-btn--active { color: #9333ea; border-bottom-color: #9333ea; font-weight: 600; }
.dark .tab-btn { color: #94a3b8; }
.dark .tab-btn--active { color: #c084fc; border-bottom-color: #c084fc; }
.tab-badge {
  background: #ede9fe; color: #7c3aed; border-radius: 10px;
  padding: 1px 6px; font-size: .6875rem; font-weight: 700;
}
.dark .tab-badge { background: #3b1d8e; color: #c084fc; }
.tab-badge--orange { background: #fff7ed; color: #ea580c; }
.dark .tab-badge--orange { background: #431407; color: #fb923c; }

/* Table wrap */
.panel-table-wrap {
  background: #fff; border: 1px solid #e2e8f0; border-top: none;
  border-radius: 0 0 14px 14px; overflow: hidden;
}
.dark .panel-table-wrap { background: #1e293b; border-color: #334155; }

.table-loading, .table-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 48px 16px;
  font-size: .875rem; color: #94a3b8;
}
.ai-table { width: 100%; border-collapse: collapse; }
.ai-table th {
  padding: 10px 14px; text-align: left; font-size: .6875rem;
  font-weight: 600; text-transform: uppercase; letter-spacing: .05em;
  color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
}
.dark .ai-table th { background: #0f172a; border-color: #334155; color: #64748b; }
.ai-table td {
  padding: 11px 14px; font-size: .8125rem; color: #334155;
  border-bottom: 1px solid #f1f5f9;
}
.dark .ai-table td { color: #cbd5e1; border-bottom-color: #1e293b; }
.ai-table tr:last-child td { border-bottom: none; }

/* Fila de uso (clickeable) */
.usage-row { cursor: pointer; transition: background .15s; }
.usage-row:hover td { background: #faf5ff; }
.dark .usage-row:hover td { background: #1a1040; }

/* Expand button */
.expand-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 6px;
  color: #94a3b8; transition: all .2s;
}
.expand-btn svg { transition: transform .2s; }
.expand-btn--open svg { transform: rotate(90deg); }
.usage-row:hover .expand-btn { color: #9333ea; }

/* Fila expandida */
.expanded-row td { padding: 0 !important; border-bottom: 2px solid #e9d5ff !important; }
.dark .expanded-row td { border-bottom-color: #4c1d95 !important; }
.user-chart-panel {
  background: #faf5ff; padding: 16px 20px;
}
.dark .user-chart-panel { background: #1a1040; }
.user-chart-loading, .user-chart-empty {
  display: flex; align-items: center; gap: 8px;
  font-size: .8125rem; color: #94a3b8; padding: 8px 0;
}
.user-chart-inner { }
.user-chart-title {
  font-size: .75rem; font-weight: 600; color: #7c3aed;
  margin: 0 0 12px; text-transform: uppercase; letter-spacing: .05em;
}
.dark .user-chart-title { color: #c084fc; }
.user-chart-canvas-wrap { height: 160px; position: relative; }

/* Historial tab */
.historial-section { padding: 20px; display: flex; flex-direction: column; gap: 20px; }

.historial-pills {
  display: flex; gap: 12px; flex-wrap: wrap;
}
.h-pill {
  display: flex; flex-direction: column; gap: 2px;
  background: #f3e8ff; border: 1px solid #e9d5ff; border-radius: 10px;
  padding: 12px 18px; min-width: 120px;
}
.dark .h-pill { background: #2e1065; border-color: #6b21a8; }
.h-pill-val {
  font-size: 1.25rem; font-weight: 700; color: #7c3aed;
}
.dark .h-pill-val { color: #c084fc; }
.h-pill-lbl {
  font-size: .6875rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em;
}

.historial-chart-wrap {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;
}
.dark .historial-chart-wrap { background: #0f172a; border-color: #334155; }
.historial-chart-title {
  font-size: .8125rem; font-weight: 600; color: #475569; margin: 0 0 14px;
}
.dark .historial-chart-title { color: #94a3b8; }
.historial-canvas-wrap { height: 260px; position: relative; }

/* Usage numbers */
.usage-num {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 28px; height: 24px; padding: 0 6px;
  background: #ede9fe; color: #7c3aed; border-radius: 6px;
  font-size: .8125rem; font-weight: 700;
}
.usage-num--full { background: #fef2f2; color: #dc2626; }
.dark .usage-num { background: #3b1d8e; color: #c084fc; }
.dark .usage-num--full { background: #450a0a; color: #f87171; }

.progress-bg { height: 6px; background: #e2e8f0; border-radius: 3px; width: 80px; }
.dark .progress-bg { background: #334155; }
.progress-fill { height: 6px; border-radius: 3px; background: #9333ea; transition: width .3s; }
.progress-fill--full { background: #dc2626; }

.type-badge {
  display: inline-block; padding: 2px 7px; border-radius: 6px;
  font-size: .6875rem; font-weight: 600;
}
.type-badge--juris { background: #eff6ff; color: #2563eb; }
.type-badge--leg   { background: #f0fdf4; color: #16a34a; }
.dark .type-badge--juris { background: #1e3a5f; color: #60a5fa; }
.dark .type-badge--leg   { background: #14532d; color: #4ade80; }

.btn-index {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; background: #f3e8ff; color: #7c3aed;
  border: 1px solid #ddd6fe; border-radius: 6px; font-size: .75rem;
  font-weight: 600; cursor: pointer; transition: all .18s;
}
.btn-index:hover:not(:disabled) { background: #9333ea; color: #fff; border-color: #7c3aed; }
.btn-index:disabled { opacity: .5; cursor: not-allowed; }
.dark .btn-index { background: #2e1065; border-color: #6b21a8; color: #c084fc; }
.dark .btn-index:hover:not(:disabled) { background: #7c3aed; color: #fff; }

/* Paginación missing */
.missing-pag {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; border-top: 1px solid #f1f5f9;
}
.dark .missing-pag { border-color: #334155; }
.pag-btn-sm {
  width: 28px; height: 28px; border: 1px solid #e2e8f0;
  border-radius: 6px; background: #fff; color: #64748b;
  font-size: .875rem; cursor: pointer; transition: all .15s;
  display: flex; align-items: center; justify-content: center;
}
.pag-btn-sm:hover:not(:disabled) { border-color: #9333ea; color: #9333ea; }
.pag-btn-sm:disabled { opacity: .35; cursor: not-allowed; }
.dark .pag-btn-sm { background: #1e293b; border-color: #334155; color: #94a3b8; }

/* Usuario cell */
.user-cell {
  display: flex; align-items: center; gap: 10px;
}
.user-avatar {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  overflow: hidden; background: linear-gradient(135deg, #9333ea, #7c3aed);
  display: flex; align-items: center; justify-content: center;
}
.user-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.user-avatar-initials {
  font-size: .6875rem; font-weight: 700; color: #fff; letter-spacing: .04em;
}
.user-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.user-name {
  font-size: .8125rem; font-weight: 600; color: #1e293b;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;
}
.dark .user-name { color: #e2e8f0; }
.user-email {
  font-size: .6875rem; color: #94a3b8;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;
}
</style>
