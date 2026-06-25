<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Boletines" subtitle="Administra los boletines de la plataforma">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-6xl mx-auto px-4">
      <SectionCard class="mb-4">
        <div class="grid grid-cols-12 gap-4 items-end">
          <div class="col-span-6 max-sm:col-span-12 flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Búsqueda</label>
            <input type="text" v-model="filter.NOMBRES" class="input-base" placeholder="Buscar boletines..." />
          </div>
          <div class="col-span-12 flex gap-4">
            <button class="btn btn-primary" @click="search(grid.currentPage, grid.perPage)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              Buscar
            </button>
            <button class="btn bg-gradient-to-r from-emerald-400 to-emerald-600 text-white" @click="modalAgregarBoletin.show = true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Crear
            </button>
          </div>
        </div>
      </SectionCard>

        <data-table :active="active" title="Boletines" :search="search" :fields="fields" :items="data" :grid="grid" :actions="actions"/>
    </div>

    <ModalAgregarBoletin :role="role" :show="modalAgregarBoletin.show"
      :close="() => modalAgregarBoletin.show = false" :update="() => search()"/>

  </section>
</template>

<script>
import DataTable from "@/components/Tables/DataTable.vue";
import { toast } from 'vue3-toastify';
import ModalAgregarBoletin from "./modals/ModalAgregarBoletin.vue";
import boletinProxy from "@/proxies/boletinProxy.js";

export default {
    components: {
        DataTable,
        ModalAgregarBoletin,
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
                { key: "RN", label: "" },
                { key: "TITLE", label: "DESCRIPCION", sortable: true },
                { key: "IMAGEN", label: "IMAGEN", sortable: true },
                { key: "BOLETIN", label: "BOLETIN", sortable: true },
                { key: "FCRCN", label: "Fecha de Ingreso", sortable: true, class: "text-center w-130" },
                { key: "UCRCN", label: "U. Creación", sortable: true, class: "text-center w-130" },
                { key: "FEDCN", label: "Fecha de Edición", sortable: true, class: "text-center w-130" },
                { key: "UEDCN", label: "U. Edición", sortable: true, class: "text-center w-130" },
            ],
            actions: {},
            isLoading: false,
            modalAgregarBoletin: { show: false, data: null },
            filter: { NOMBRES: null, CDESTDO: null },
        };
    },
    props: {
        role: { type: Object, default: () => {} }
    },
    methods: {
        async search(currentPage, perPage) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;
            this.grid.isLoading = true;
            await boletinProxy.list({
                ROWS: rows,
                INIT: init,
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
            }, this.active)
                .then((response) => {
                    this.data = response || [];
                    this.grid.totalRows = response[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.data = [];
                    toast.error(error?.MESSAGE || 'Error al cargar los boletines', { toastId: 'error-planes' });
                })
                .finally(() => this.grid.isLoading = false);
        },
    },
    watch: {
        'modalAgregarBoletin.show': { handler() {} }
    },
    mounted() {}
};
</script>
