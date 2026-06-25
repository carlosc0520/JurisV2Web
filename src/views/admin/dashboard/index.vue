<template>
  <section class="min-h-screen pb-12" style="background:var(--bg-sunken)">

    <PageHeader title="Dashboard" subtitle="Vista general de métricas del sistema">
      <template #icon>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-6">

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-5">

        <!-- Resoluciones -->
        <div class="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-medium transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background:linear-gradient(135deg,#E91E8C,#b5167a)">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <span v-if="trend.resoluciones !== null"
              :class="trend.resoluciones >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'"
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {{ trend.resoluciones >= 0 ? '+' : '' }}{{ trend.resoluciones }}%
            </span>
          </div>
          <div>
            <p class="text-2xl font-extrabold m-0 leading-tight" style="color:var(--text)">
              {{ (stats.RESOLUCIONES || 0).toLocaleString() }}
            </p>
            <p class="text-[11px] font-medium m-0 mt-0.5 uppercase tracking-wide" style="color:var(--text-muted)">Resoluciones</p>
          </div>
        </div>

        <!-- Usuarios activos -->
        <div class="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-medium transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background:linear-gradient(135deg,#7C3AED,#5b21b6)">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span v-if="stats.USUARIOS" class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style="background:var(--bg-raised);color:var(--text-muted)">
              {{ stats.USUARIOS }} total
            </span>
          </div>
          <div>
            <p class="text-2xl font-extrabold m-0 leading-tight" style="color:var(--text)">
              {{ (stats.USUARIOS_ACTIVOS || 0).toLocaleString() }}
            </p>
            <p class="text-[11px] font-medium m-0 mt-0.5 uppercase tracking-wide" style="color:var(--text-muted)">Usuarios Activos</p>
          </div>
        </div>

        <!-- Favoritos -->
        <div class="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-medium transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background:linear-gradient(135deg,#F59E0B,#d97706)">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
          </div>
          <div>
            <p class="text-2xl font-extrabold m-0 leading-tight" style="color:var(--text)">
              {{ (stats.FAVORITOS || 0).toLocaleString() }}
            </p>
            <p class="text-[11px] font-medium m-0 mt-0.5 uppercase tracking-wide" style="color:var(--text-muted)">Favoritos</p>
          </div>
        </div>

        <!-- Carpetas -->
        <div class="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-medium transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background:linear-gradient(135deg,#10B981,#059669)">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
              </svg>
            </div>
          </div>
          <div>
            <p class="text-2xl font-extrabold m-0 leading-tight" style="color:var(--text)">
              {{ (stats.CARPETAS || 0).toLocaleString() }}
            </p>
            <p class="text-[11px] font-medium m-0 mt-0.5 uppercase tracking-wide" style="color:var(--text-muted)">Carpetas</p>
          </div>
        </div>

        <!-- Compartidos -->
        <div class="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-medium transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background:linear-gradient(135deg,#3B82F6,#1d4ed8)">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
            </div>
          </div>
          <div>
            <p class="text-2xl font-extrabold m-0 leading-tight" style="color:var(--text)">
              {{ (stats.COMPARTIDOS || 0).toLocaleString() }}
            </p>
            <p class="text-[11px] font-medium m-0 mt-0.5 uppercase tracking-wide" style="color:var(--text-muted)">Compartidos</p>
          </div>
        </div>

      </div>

      <!-- Area Chart + Top Materias -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

        <!-- Area chart (2/3) -->
        <div class="lg:col-span-2 card overflow-hidden">
          <div class="px-5 pt-5 pb-3 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700">
            <button v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border"
              :class="activeTab === tab.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'">
              {{ tab.label }}
            </button>
          </div>
          <card-area-chart v-if="activeTab === 'resoluciones'" :DATA="head.ENTRADAS" title="Resoluciones por mes"/>
          <card-area-chart v-if="activeTab === 'usuarios'"     :DATA="head.USUARIOS"  title="Usuarios por mes"/>
        </div>

        <!-- Top Materias (1/3) -->
        <div class="card p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background:linear-gradient(135deg,#6366F1,#4338CA)">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-sm font-bold m-0" style="color:var(--text)">Top Materias</h3>
          </div>

          <div v-if="isLoadingStats" class="flex-1 flex items-center justify-center py-6">
            <svg class="animate-spin w-5 h-5" style="color:var(--color-primary)" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4"/>
            </svg>
          </div>

          <div v-else class="flex flex-col gap-3">
            <div v-for="(m, i) in stats.TOP_MATERIAS" :key="i" class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium truncate max-w-[150px]" style="color:var(--text)" :title="m.MATERIA">
                  {{ m.MATERIA }}
                </span>
                <span class="text-xs font-bold flex-shrink-0" style="color:var(--text-muted)">
                  {{ Number(m.TOTAL).toLocaleString() }}
                </span>
              </div>
              <div class="h-1.5 rounded-full overflow-hidden" style="background:var(--bg-raised)">
                <div class="h-full rounded-full transition-all duration-500"
                  :style="`width:${materiaPct(m.TOTAL)}%;background:${materiaColor(i)}`">
                </div>
              </div>
            </div>
            <p v-if="!stats.TOP_MATERIAS?.length" class="text-xs text-center py-4" style="color:var(--text-muted)">
              Sin datos
            </p>
          </div>
        </div>

      </div>

      <!-- Bottom row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Búsquedas recientes -->
        <div class="card overflow-hidden">
          <card-page-palabras TITLE="Últimas búsquedas" :data="head.PALABRAS"/>
        </div>

        <!-- Últimas resoluciones -->
        <div class="card p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background:linear-gradient(135deg,#E91E8C,#b5167a)">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-sm font-bold m-0" style="color:var(--text)">Últimas resoluciones</h3>
          </div>

          <div v-if="isLoadingStats" class="flex items-center justify-center py-6">
            <svg class="animate-spin w-5 h-5" style="color:var(--color-primary)" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4"/>
            </svg>
          </div>

          <div v-else class="flex flex-col gap-2">
            <div v-for="(r, i) in stats.RECIENTES_RESOLUCIONES" :key="i"
              class="p-3 rounded-xl border" style="border-color:var(--border);background:var(--bg-raised)">
              <p class="text-xs font-semibold m-0 mb-1 line-clamp-2" style="color:var(--text)">
                {{ r.TITULO }}
              </p>
              <div class="flex items-center gap-2 flex-wrap">
                <span v-if="r.AMBIT" class="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style="background:#EEF2FF;color:#4338CA">{{ r.AMBIT }}</span>
                <span class="text-[10px]" style="color:var(--text-muted)">{{ timeAgo(r.FRESOLUTION) }}</span>
              </div>
            </div>
            <p v-if="!stats.RECIENTES_RESOLUCIONES?.length" class="text-xs text-center py-4" style="color:var(--text-muted)">
              Sin datos
            </p>
          </div>
        </div>

        <!-- Últimos usuarios + Top magistrados -->
        <div class="flex flex-col gap-4">

          <!-- Últimos usuarios -->
          <div class="card p-5 flex flex-col gap-3">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                style="background:linear-gradient(135deg,#7C3AED,#5b21b6)">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3 class="text-sm font-bold m-0" style="color:var(--text)">Últimos usuarios</h3>
            </div>

            <div v-if="isLoadingStats" class="flex items-center justify-center py-4">
              <svg class="animate-spin w-5 h-5" style="color:var(--color-primary)" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4"/>
              </svg>
            </div>

            <div v-else class="flex flex-col gap-2">
              <div v-for="(u, i) in stats.RECIENTES_USUARIOS" :key="i"
                class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
                  :style="`background:${avatarColor(i)}`">
                  {{ (u.NOMBRES || '?').charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold m-0 truncate" style="color:var(--text)">
                    {{ u.NOMBRES }} {{ u.APELLIDOS }}
                  </p>
                  <p class="text-[10px] m-0 truncate" style="color:var(--text-muted)">{{ u.EMAIL }}</p>
                </div>
                <span class="text-[10px] flex-shrink-0" style="color:var(--text-muted)">{{ u.FCRCN }}</span>
              </div>
              <p v-if="!stats.RECIENTES_USUARIOS?.length" class="text-xs text-center py-3" style="color:var(--text-muted)">
                Sin datos
              </p>
            </div>
          </div>

          <!-- Top magistrados -->
          <div class="card p-5 flex flex-col gap-3">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                style="background:linear-gradient(135deg,#F59E0B,#d97706)">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <h3 class="text-sm font-bold m-0" style="color:var(--text)">Top magistrados</h3>
            </div>

            <div v-if="isLoadingStats" class="flex items-center justify-center py-4">
              <svg class="animate-spin w-5 h-5" style="color:var(--color-primary)" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4"/>
              </svg>
            </div>

            <div v-else class="flex flex-col gap-2">
              <div v-for="(m, i) in stats.TOP_MAGISTRADOS" :key="i"
                class="flex items-center gap-2">
                <span class="text-[11px] font-bold w-5 flex-shrink-0 text-right" style="color:var(--text-muted)">
                  {{ i + 1 }}.
                </span>
                <div class="flex-1 min-w-0">
                  <div class="h-1.5 rounded-full overflow-hidden mb-0.5" style="background:var(--bg-raised)">
                    <div class="h-full rounded-full"
                      :style="`width:${magistradoPct(m.TOTAL)}%;background:${materiaColor(i)}`"/>
                  </div>
                  <p class="text-[11px] m-0 truncate" style="color:var(--text)" :title="m.MAGISTRATE">
                    {{ m.MAGISTRATE }}
                  </p>
                </div>
                <span class="text-[11px] font-bold flex-shrink-0" style="color:var(--text-muted)">
                  {{ Number(m.TOTAL).toLocaleString() }}
                </span>
              </div>
              <p v-if="!stats.TOP_MAGISTRADOS?.length" class="text-xs text-center py-3" style="color:var(--text-muted)">
                Sin datos
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<script>
import CardPagePalabras from "@/components/Cards/CardPagePalabras.vue";
import CardAreaChart from "@/components/Cards/CardAreaChart.vue";
import { toast } from 'vue3-toastify';
import helpersProxy from "@/proxies/helpersProxy";

const PALETTE = ['#6366F1','#E91E8C','#F59E0B','#10B981','#3B82F6','#EF4444','#8B5CF6','#14B8A6'];

export default {
  components: { CardAreaChart, CardPagePalabras },
  props: {
    role: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      isLoading:     false,
      isLoadingStats: false,
      activeTab: 'resoluciones',
      tabs: [
        { id: 'resoluciones', label: 'Resoluciones' },
        { id: 'usuarios',     label: 'Usuarios' },
      ],
      head:  { USUARIOS: [], ENTRADAS: [], PALABRAS: [] },
      stats: {
        RESOLUCIONES: 0, USUARIOS: 0, USUARIOS_ACTIVOS: 0,
        FAVORITOS: 0, CARPETAS: 0, COMPARTIDOS: 0,
        COMENTARIOS: 0, CASOS: 0, BUSQUEDAS: 0,
        TOP_MATERIAS: [], TOP_MAGISTRADOS: [],
        RECIENTES_RESOLUCIONES: [], RECIENTES_USUARIOS: [],
      },
    };
  },
  computed: {
    trend() {
      const calc = (arr) => {
        if (!Array.isArray(arr) || arr.length < 2) return null;
        const prev = arr[arr.length - 2]?.VALUE || 0;
        const curr = arr[arr.length - 1]?.VALUE || 0;
        if (prev === 0) return curr > 0 ? 100 : 0;
        return Math.round(((curr - prev) / prev) * 100);
      };
      return {
        resoluciones: calc(this.head.ENTRADAS),
        usuarios:     calc(this.head.USUARIOS),
      };
    },
    maxMateria() {
      const tops = this.stats.TOP_MATERIAS || [];
      return tops.length ? Math.max(...tops.map(m => Number(m.TOTAL))) : 1;
    },
    maxMagistrado() {
      const tops = this.stats.TOP_MAGISTRADOS || [];
      return tops.length ? Math.max(...tops.map(m => Number(m.TOTAL))) : 1;
    },
  },
  methods: {
    timeAgo(dateVal) {
      if (!dateVal) return '';
      const date = new Date(dateVal);
      if (isNaN(date.getTime())) return '';
      const diffMs   = Date.now() - date.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffDays === 0)  return 'hoy';
      if (diffDays === 1)  return 'hace 1 día';
      if (diffDays <  7)   return `hace ${diffDays} días`;
      const weeks = Math.floor(diffDays / 7);
      if (weeks === 1)     return 'hace 1 semana';
      if (weeks <  4)      return `hace ${weeks} semanas`;
      const months = Math.floor(diffDays / 30);
      if (months === 1)    return 'hace 1 mes';
      if (months < 12)     return `hace ${months} meses`;
      const years = Math.floor(diffDays / 365);
      return years === 1 ? 'hace 1 año' : `hace ${years} años`;
    },
    materiaPct(total) {
      return Math.round((Number(total) / this.maxMateria) * 100);
    },
    magistradoPct(total) {
      return Math.round((Number(total) / this.maxMagistrado) * 100);
    },
    materiaColor(i) { return PALETTE[i % PALETTE.length]; },
    avatarColor(i)  { return PALETTE[i % PALETTE.length]; },

    async loadHead() {
      this.isLoading = true;
      try {
        const res = await helpersProxy.getHead(2);
        if (res?.[0]) {
          this.head = {
            USUARIOS: JSON.parse(res[0].USUARIOS || '[]'),
            ENTRADAS: JSON.parse(res[0].ENTRADAS || '[]'),
            PALABRAS: JSON.parse(res[0].PALABRAS || '[]'),
          };
        }
      } catch { toast.error('Error al cargar historial', { toastId: 'err-head' }); }
      finally { this.isLoading = false; }
    },

    async loadStats() {
      this.isLoadingStats = true;
      try {
        const res = await helpersProxy.getDashboardStats();
        if (res) this.stats = res;
      } catch { toast.error('Error al cargar estadísticas', { toastId: 'err-stats' }); }
      finally { this.isLoadingStats = false; }
    },
  },
  mounted() {
    this.loadHead();
    this.loadStats();
  },
};
</script>
