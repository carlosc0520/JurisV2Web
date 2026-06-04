<template>
  <section class="dashboard-container">
    <div class="dashboard-wrapper">
      <!-- Header con Título -->
      <div class="dashboard-header">
        <div class="dashboard-header-content">
          <div class="header-title-section">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="header-icon">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <div>
              <h1 class="dashboard-title">Dashboard</h1>
              <p class="dashboard-subtitle">Vista general de estadísticas y métricas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-card-resoluciones">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Resoluciones</p>
            <p class="stat-value">{{ getTotalValue(head.ENTRADAS) }}</p>
          </div>
        </div>

        <div class="stat-card stat-card-usuarios">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Usuarios</p>
            <p class="stat-value">{{ getTotalValue(head.USUARIOS) }}</p>
          </div>
        </div>

        <div class="stat-card stat-card-busquedas">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Búsquedas</p>
            <p class="stat-value">{{ head.PALABRAS?.length || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="chart-tabs">
        <button 
          class="tab-button" 
          :class="{ 'active': active === 'Resoluciones' }" 
          @click="updateActive('Resoluciones')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="tab-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Resoluciones
        </button>
        <button 
          class="tab-button" 
          :class="{ 'active': active === 'Usuarios' }" 
          @click="updateActive('Usuarios')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="tab-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Usuarios
        </button>
      </div>

      <!-- Gráficos -->
      <div class="charts-grid">
        <div class="chart-container">
          <div v-if="active === 'Resoluciones'">
            <card-area-chart :DATA="head.ENTRADAS" title="Iteración de Resoluciones"/>
          </div>
          <div v-if="active === 'Usuarios'">
            <card-area-chart :DATA="head.USUARIOS" title="Iteración de Usuarios"/>
          </div>
        </div>

        <div class="table-container">
          <card-page-palabras TITLE="Últimas búsquedas" :data="head.PALABRAS" />
        </div>
      </div>

      <LoadingOverlay :active="isLoading" :is-full-page="false" :loader="'bars'" />
    </div>
  </section>
</template>


<script>
import CardPagePalabras from "../../components/Cards/CardPagePalabras.vue";
import CardAreaChart from "@/components/Cards/CardAreaChart.vue";
import { toast } from 'vue3-toastify';
import searchIcon from "@/assets/img/icons/search.svg";
import helpersProxy from "../../proxies/helpersProxy";

// PROXIES
// import MantenimientoProxy from '../../proxies/MantenimientoProxy';

export default {
  components: {
    CardAreaChart,
    CardPagePalabras
  },
  data() {
    return {
      searchIcon,
      isLoading: false,
      active: "Resoluciones",
      head: {
        USUARIOS: 0,
        ENTRADAS: 0,
        PALABRAS: 0,
      },
    };
  },
  props: {
    role: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    updateActive(text) {
      this.active = text;
    },
    getTotalValue(data) {
      if (!Array.isArray(data) || data.length === 0) return 0;
      return data.reduce((sum, item) => sum + (item.VALUE || 0), 0);
    },
    async getHead() {
      await helpersProxy.getHead(2)
        .then((response) => {
          if (typeof response !== 'undefined') {
            this.head = {
              USUARIOS: JSON.parse(response?.[0]?.USUARIOS) || [],
              ENTRADAS: JSON.parse(response?.[0]?.ENTRADAS) || [],
              PALABRAS: JSON.parse(response?.[0]?.PALABRAS) || []
            }
          }
        })
        .catch((error) => toast.error(error, { toastId: 'error-head' }));
    },
  },
  mounted() {
    this.getHead();
  },
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.dashboard-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 0 0 0.75rem 0;
  margin: 0 -1rem 1.25rem -1rem;
}

.dashboard-header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 1rem 0 1rem;
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

.dashboard-title {
  font-family: Lato, sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
}

.dashboard-subtitle {
  font-family: Lato, sans-serif;
  color: #6B7280;
  font-size: 0.8rem;
  margin: 0.15rem 0 0 0;
  font-weight: 500;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #F3F4F6;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #60A5FA;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.stat-card-resoluciones .stat-icon {
  background: linear-gradient(135deg, #DF2DB2 0%, #E71FB3 100%);
}

.stat-card-usuarios .stat-icon {
  background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
}

.stat-card-busquedas .stat-icon {
  background: linear-gradient(135deg, #185CE6 0%, #1E40AF 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-family: Lato, sans-serif;
  font-size: 12px;
  color: #64748b;
  margin: 0 0 2px 0;
  font-weight: 500;
}

.stat-value {
  font-family: Lato, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1;
}

/* Chart Tabs */
.chart-tabs {
  display: flex;
  gap: 0.625rem;
  margin-bottom: 1rem;
  background: white;
  padding: 0.375rem;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-family: Lato, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-icon {
  width: 16px;
  height: 16px;
}

.tab-button:hover {
  background: rgba(24, 92, 230, 0.05);
  color: #185CE6;
  border: 2px solid #60A5FA;
}

.tab-button.active {
  background: rgba(24, 92, 230, 0.08);
  color: #185CE6;
  border: 2px solid #185CE6;
}

.tab-button {
  border: 2px solid transparent;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.chart-container,
.table-container {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  padding: 1rem;
  border: 1px solid #F3F4F6;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-wrapper {
    padding: 0 1.5rem;
  }

  .dashboard-header {
    margin: 0 -1.5rem 2rem -1.5rem;
  }

  .dashboard-header-content {
    padding: 1.5rem 1.5rem 0 1.5rem;
  }

  .charts-grid {
    gap: 1.25rem;
  }
}
@media (max-width: 768px) {
  .dashboard-wrapper {
    padding: 0 1rem;
  }

  .dashboard-header {
    padding: 0 0 1.25rem 0;
    margin: 0 -1rem 1.5rem -1rem;
  }

  .dashboard-header-content {
    padding: 1.25rem 1rem 0 1rem;
  }

  .header-title-section {
    gap: 0.875rem;
  }

  .header-icon {
    width: 26px;
    height: 26px;
  }

  .dashboard-title {
    font-size: 1.35rem;
    line-height: 1.3;
  }

  .dashboard-subtitle {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1.25rem;
    border-radius: 14px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
  }

  .stat-icon svg {
    width: 24px;
    height: 24px;
  }

  .stat-label {
    font-size: 13px;
  }

  .stat-value {
    font-size: 26px;
  }

  .chart-tabs {
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

  .tab-icon {
    width: 18px;
    height: 18px;
  }

  .chart-container,
  .table-container {
    padding: 1.25rem;
    border-radius: 14px;
  }

  .charts-grid {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .dashboard-wrapper {
    padding: 0 0.875rem;
  }

  .dashboard-header {
    padding: 0 0 1rem 0;
    margin: 0 -0.875rem 1.25rem -0.875rem;
  }

  .dashboard-header-content {
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

  .dashboard-title {
    font-size: 1.05rem;
    line-height: 1.3;
    overflow-wrap: break-word;
  }

  .dashboard-subtitle {
    font-size: 0.72rem;
    line-height: 1.3;
    overflow-wrap: break-word;
  }

  .stats-grid {
    gap: 0.875rem;
  }

  .stat-card {
    padding: 1rem;
    border-radius: 12px;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 9px;
  }

  .stat-icon svg {
    width: 22px;
    height: 22px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-tabs {
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

  .tab-icon {
    width: 16px;
    height: 16px;
  }

  .chart-container,
  .table-container {
    padding: 1rem;
    border-radius: 12px;
  }

  .charts-grid {
    gap: 0.875rem;
  }
}
</style>