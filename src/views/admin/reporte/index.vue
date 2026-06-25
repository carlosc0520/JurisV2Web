<template>
  <section :class="['pb-10', isUser ? '' : 'min-h-screen']" style="background:var(--bg-sunken)">
    <PageHeader v-if="!isUser" title="Reportes" subtitle="Estadísticas y análisis de la plataforma">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </template>
    </PageHeader>

    <div :class="isUser ? '' : 'max-w-6xl mx-auto px-4'">
      <SectionCard class="mb-6">
        <div class="grid grid-cols-12 gap-4 items-end">
          <div class="col-span-3 max-sm:col-span-12 flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Estadística por</label>
            <select v-model="formData.IND" class="input-base" @change="search()">
              <option :value="null" disabled>Seleccione una opción</option>
              <option v-for="opt in selects.IND" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>

          <div class="col-span-3 max-sm:col-span-12 flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Magistrado</label>
            <el-tree-select v-model="formData.MAGISTRADOS" :data="selects.MAGISTRADOS" multiple
              :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox check-strictly
              check-on-click-node filterable clearable collapse-tags :max-collapse-tags="1"
              no-data-text="No hay opciones disponibles" popper-append-to-body class="custom-tree-select w-full" />
          </div>

          <div v-if="![1].includes(formData.IND)" class="col-span-3 max-sm:col-span-12 flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Delito</label>
            <el-tree-select :disabled="[1].includes(formData.IND)" v-model="formData.DELITOS"
              :data="selects.DELITOS" multiple :render-after-expand="false"
              placeholder="Seleccione una opción" show-checkbox check-strictly check-on-click-node filterable
              clearable collapse-tags :max-collapse-tags="1" no-data-text="No hay opciones disponibles"
              popper-append-to-body class="custom-tree-select w-full" />
          </div>

          <div class="col-span-12 flex justify-end">
            <button class="btn btn-primary" type="button" @click="search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              Buscar
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <CardLineChartMagistrados :DATA="head.REPORTE"
          :TITLE="head.REPORTE?.length > 0 ? (formData.IND === 1 ? 'Magistrados' : formData.IND === 2 ? 'Delitos' : '') : 'Palabras'"
          :SUBTITLE="head.REPORTE?.length > 0 ? (formData.IND === 1 ? 'Top 20 Magistrados' : formData.IND === 2 ? 'Top 20 Delitos' : '') : 'Top Palabras'" />
      </SectionCard>
    </div>
  </section>
</template>

<script>
import CardLineChartMagistrados from "@/components/Cards/CardLineChartMagistrados.vue";
import helpersProxy from "@/proxies/helpersProxy";
import { toast } from 'vue3-toastify';
import MagistradoProxy from "@/proxies/Magistrados.Proxy";
import FilterProxy from "@/proxies/FilterProxy";
import UserProxy from "@/proxies/UserProxy";

export default {
    name: "reporte-page",
    components: { CardLineChartMagistrados },
    props: {
        isUser: { type: Boolean, default: () => false },
    },
    data() {
        return {
            formData: { IND: 1, MAGISTRADOS: [], DELITOS: [] },
            selects: {
                IND: [
                    { value: 1, text: "Magistrados" },
                    { value: 2, text: "Delitos" },
                ],
                MAGISTRADOS: [],
                DELITOS: [],
            },
            head: { REPORTE: [] },
        };
    },
    methods: {
        async search() {
            this.head.REPORTE = [];
            await UserProxy.getReporte({
                ...this.formData,
                MAGISTRADOS: this.formData.MAGISTRADOS.join(','),
                DELITOS: this.formData.DELITOS.join(','),
            })
                .then((response) => {
                    switch (this.formData.IND) {
                        case 1: this.head.REPORTE = response.slice(0, 20); break;
                        case 2: this.head.REPORTE = response.slice(0, 20); break;
                        case 3: this.head.REPORTE = response; break;
                    }
                })
                .catch((error) => {
                    this.head.REPORTE = [];
                    toast.error(error, { toastId: 'error-search' });
                });
        },
        async selects_all() {
            try {
                const [magistradosResponse, filtrosResponse] = await Promise.all([
                    MagistradoProxy.list({ ROWS: 1000, INIT: 0, DESC: null }),
                    FilterProxy.list({ NIVEL: 5 }, null)
                ]);
                this.selects.MAGISTRADOS = magistradosResponse.map(item => ({
                    value: item.ID,
                    label: `${item.APELLIDOS}${item?.NOMBRES ? `, ${item.NOMBRES}` : ''}`
                }));
                if (filtrosResponse?.length) {
                    const DELITOS = filtrosResponse.find(item => item.LABEL === "DELITOS");
                    if (DELITOS?.NIVEL_2) {
                        DELITOS.NIVEL_2 = JSON.parse(DELITOS.NIVEL_2);
                        this.selects.DELITOS = await this.generate_select(DELITOS.NIVEL_2);
                    }
                } else {
                    this.selects.FILTROS = [];
                }
            } catch (error) {
                this.selects.MAGISTRADOS = [];
                this.selects.FILTROS = [];
            }
        },
        async generate_select(NIVEL_2) {
            return NIVEL_2.map(item => ({
                value: item.VALUE, label: item.LABEL,
                children: item.NIVEL_3.map(item2 => ({
                    value: item2.VALUE, label: item2.LABEL,
                    children: item2.NIVEL_4.map(item3 => ({
                        value: item3.VALUE, label: item3.LABEL,
                        children: item3.NIVEL_5.map(item4 => ({
                            value: item4.VALUE, label: item4.LABEL,
                            children: item4.NIVEL_6.map(item5 => ({ value: item5.VALUE, label: item5.LABEL })),
                        })),
                    })),
                })),
            }));
        }
    },
    mounted() {
        this.selects_all();
        this.search();
    },
};
</script>

<style scoped>
:deep(.custom-tree-select) { width: 100% !important; }
:deep(.custom-tree-select .el-select__wrapper) { min-height: 40px; border: 1.5px solid #E5E7EB; border-radius: 8px; }
</style>
