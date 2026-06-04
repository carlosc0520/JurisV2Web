<template>
    <section class="filtros-container">
        <!-- Header con Título -->
        <div class="filtros-header">
            <div class="filtros-header-content">
                <div class="header-title-section">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="header-icon">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                    </svg>
                    <div>
                        <h1 class="filtros-title">Filtros y Magistrados</h1>
                        <p class="filtros-subtitle">Gestión de filtros jerárquicos y magistrados del sistema</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="filtros-content">
            <!-- Modern Tabs con Navegación Multinivel -->
            <div class="tabs-modern">
                <button
                    class="tab-button"
                    :class="{ 'tab-active': active == '0' }"
                    @click="updateActive('0')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Magistrados</span>
                </button>
                <button
                    class="tab-button"
                    :class="{ 'tab-active': active == '1' }"
                    @click="updateActive('1')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                    </svg>
                    <span>Filtros</span>
                </button>
                <button
                    class="tab-button tab-disabled"
                    disabled
                    :class="{ 'tab-active': active == '2' }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <span>Nivel 2</span>
                </button>
                <button
                    class="tab-button tab-disabled"
                    disabled
                    :class="{ 'tab-active': active == '3' }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <span>Nivel 3</span>
                </button>
                <button
                    class="tab-button tab-disabled"
                    disabled
                    :class="{ 'tab-active': active == '4' }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <span>Nivel 4</span>
                </button>
                <button
                    class="tab-button tab-disabled"
                    disabled
                    :class="{ 'tab-active': active == '5' }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <span>Nivel 5</span>
                </button>
                <button
                    class="tab-button tab-disabled"
                    disabled
                    :class="{ 'tab-active': active == '6' }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <span>Nivel 6</span>
                </button>
            </div>

            <!-- Breadcrumb de Navegación -->
            <div class="breadcrumb-modern" v-if="active > 1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
                <span class="breadcrumb-text">
                    {{
                        active == 2 ? `${this.title.ID2}` :
                        active == 3 ? `${this.title.ID2} > ${this.title.ID3}` :
                        active == 4 ? `${this.title.ID2} > ${this.title.ID3} > ${this.title.ID4}` :
                        active == 5 ? `${this.title.ID2} > ${this.title.ID3} > ${this.title.ID4} > ${this.title.ID5}` :
                        active == 6 ? `${this.title.ID2} > ${this.title.ID3} > ${this.title.ID4} > ${this.title.ID5} > ${this.title.ID6}` : ''
                    }}
                </span>
            </div>

            <!-- Filtros Modernos -->
            <div class="filters-section">
                <div class="search-input-wrapper" :class="active == 0 ? 'col-span-2' : ''">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        class="modern-input"
                        :placeholder="active == 0 ? 'Buscar por nombres, apellidos...' : 'Buscar por descripción...'"
                        v-model="filter.NOMBRES"
                        id="name" />
                </div>

                <div class="select-wrapper" v-if="active != 0">
                    <b-form-select
                        v-model="filter.OPTION"
                        class="modern-select"
                        :options="[
                            { text: 'JURISPRUDENCIA', value: '1' },
                            { text: 'LEGISLACIÓN', value: '2' }]">
                    </b-form-select>
                </div>

                <div class="select-wrapper">
                    <b-form-select
                        v-model="filter.CDESTDO"
                        class="modern-select"
                        :options="[
                            { text: '-- Seleccione Estado ', value: null },
                            { text: 'Activo', value: 'A' },
                            { text: 'Inactivo', value: 'I' }]">
                    </b-form-select>
                </div>

                <div class="button-group-extended">
                    <button class="modern-btn btn-search" @click="() => {
                        if (active == 0) searchMagistrados(grid.currentPage, grid.perPage);
                        else searchFiltros(grid.currentPage, grid.perPage,
                            (Number(active) == 1) ? null : this.Niveles[`ID${Number(active) - 1}`]);
                    }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <span>Buscar</span>
                    </button>
                    <button class="modern-btn btn-create" @click="() => {
                        if (active == 0) modalAgregarMagistrados.show = true;
                        else modalAgregarFiltros.show = true;
                    }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Crear</span>
                    </button>
                    <button class="modern-btn btn-back" v-if="[2, 3, 4, 5, 6].includes(Number(active))" @click="() => {
                        this.active = String(Number(active) - 1);
                        this.IDFILTER = (Number(this.active) == 1) ? null : this.Niveles[`ID${Number(this.active) - 1}`];
                        this.searchFiltros(grid.currentPage, grid.perPage,
                            (Number(this.active) == 1) ? null : this.Niveles[`ID${Number(this.active) - 1}`]);
                    }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                        <span>Regresar</span>
                    </button>
                </div>
            </div>

            <!-- Tablas -->
            <div class="table-section">
                <card-table v-if="active == 0" :active="active" title="Magistrados" :search="searchMagistrados"
                    :fields="fieldsMagistrados" :items="dataMagistrados" :grid="grid" :actions="actionsMagistrados" />

                <card-table v-if="active == 1" :active="active" title="Filtros" :search="searchFiltros"
                    :fields="fieldsFiltros" :items="dataFiltros" :grid="grid" :actions="actionsFiltros" />
                <card-table v-if="active == 2" :active="active" title="Filtros" :search="searchFiltros"
                    :fields="fieldsFiltros" :items="dataFiltros" :grid="grid" :actions="actionsFiltros" />
                <card-table v-if="active == 3" :active="active" title="Filtros" :search="searchFiltros"
                    :fields="fieldsFiltros" :items="dataFiltros" :grid="grid" :actions="actionsFiltros" />
                <card-table v-if="active == 4" :active="active" title="Filtros" :search="searchFiltros"
                    :fields="fieldsFiltros" :items="dataFiltros" :grid="grid" :actions="actionsFiltros" />
                <card-table v-if="active == 5" :active="active" title="Filtros" :search="searchFiltros"
                    :fields="fieldsFiltros" :items="dataFiltros" :grid="grid" :actions="actionsFiltros" />
                <card-table v-if="active == 6" :active="active" title="Filtros" :search="searchFiltros"
                    :fields="fieldsFiltros" :items="dataFiltros" :grid="grid" :actions="actionsFiltros" />
            </div>

            <LoadingOverlay :active="isLoading" :is-full-page="false" :loader="'bars'" />

            <ModalAgregarFIltro :show="modalAgregarFiltros.show" :close="() => modalAgregarFiltros.show = false"
                :update="() => searchFiltros(grid.currentPage, grid.perPage, active == 1 ? null : this.Niveles?.[`ID${Number(active) - 1}`])"
                :active="active" :data="dataFilter" :niveles="Niveles" />

            <ModalEditarFiltro :show="modalEditarFiltros.show" :close="() => modalEditarFiltros.show = false"
                :update="() => searchFiltros(grid.currentPage, grid.perPage, active == 1 ? null : this.Niveles?.[`ID${Number(active) - 1}`])"
                :active="active" :data="modalEditarFiltros.data" :niveles="Niveles" />

            <ModalAgregarMagistrado :show="modalAgregarMagistrados.show" :close="() => modalAgregarMagistrados.show = false"
                :update="() => searchMagistrados(grid.currentPage, grid.perPage)" />

            <ModalEditarMagistrado :show="modalEditarMagistrados.show" :close="() => modalEditarMagistrados.show = false"
                :update="() => searchMagistrados(grid.currentPage, grid.perPage)" :data="modalEditarMagistrados.data" />

            <ModalEliminar :message="'¿Está seguro de cambiar el estado de este registro?'" :buttonOk="'Si, cambiar'"
                :action="deleteRowMagistrados" :openDelete="modalEliminarMagistrados.show"
                :closeHandler="() => modalEliminarMagistrados.show = false" />

            <ModalEliminar :message="'¿Está seguro de cambiar el estado de este registro?'" :buttonOk="'Si, cambiar'"
                :action="deleteRowFiltros" :openDelete="modalEliminarFiltros.show"
                :closeHandler="() => modalEliminarFiltros.show = false" />
        </div>
    </section>
</template>

<script>
import CardTable from "@/components/Cards/CardTable.vue";
import { BFormSelect } from 'bootstrap-vue-next';
import { toast } from 'vue3-toastify';
import searchIcon from "@/assets/img/icons/search.svg";

// MODALES
import ModalEliminar from "./Modales/ModalEliminar.vue";
import ModalAgregarMagistrado from "./ModalesFiltros/ModalAgregarMagistrado.vue";
import ModalEditarMagistrado from "./ModalesFiltros/ModalEditarMagistrado.vue";
import ModalAgregarFIltro from "./ModalesFiltros/ModalAgregarFIltro.vue";
import ModalEditarFiltro from "./ModalesFiltros/ModalEditarFiltro.vue";

// PROXIES
import MagistradoProxy from "../../proxies/Magistrados.Proxy";
import FilterProxy from '../../proxies/FilterProxy';

export default {
    components: {
        CardTable,
        BFormSelect,

        // MODALES
        ModalEliminar,

        ModalAgregarMagistrado,
        ModalEditarMagistrado,

        ModalAgregarFIltro,
        ModalEditarFiltro
    },
    data() {
        return {
            searchIcon,
            currentPage: 10,
            dataMagistrados: [],
            dataFiltros: [],
            active: "0",

            grid: {
                items: [],
                currentPage: 1,
                perPage: 10,
                totalRows: 120,
                isLoading: true,
                pageOptions: [5, 10, 15, 50],
            },
            fieldsMagistrados: [
                {
                    key: "RN",
                    label: "",
                },
                {
                    key: "NOMBRES_C",
                    label: "Nombres y Apellidos"
                },
                {
                    key: "FEDCN",
                    label: "Fecha de Edición",
                    sortable: true,
                    class: "text-center w-130",
                },
                {
                    key: "UEDCN",
                    label: "U. Edición",
                    sortable: true,
                    class: "text-center w-130",
                },
                {
                    key: "CDESTDO",
                    label: "Estado",
                    sortable: true,
                    class: "text-center w-130",
                },
                {
                    key: "ACCIONES",
                    label: "Acciones",
                    class: "text-center w-130",
                },
            ],
            actionsMagistrados: {
                edit: {
                    label: "Editar",
                    icon: "fas fa-edit",
                    class: "btn-edit",
                    action: null,
                },
                delete: {
                    label: "Eliminar",
                    icon: "fas fa-trash",
                    class: "btn-delete",
                    action: null,
                },
            },

            fieldsFiltros: [
                {
                    key: "RN",
                    label: "",
                },
                {
                    key: "VALUE",
                    label: "",
                    class: "d-none"
                },
                {
                    key: "LABEL",
                    label: "Descripción",
                    width: "30%"
                },
                {
                    key: "TIPO",
                    label: "Tipo",
                    class: "text-left"
                },
                {
                    key: "FCRCN",
                    label: "Fecha de Ingreso",
                    sortable: true,
                    class: "text-center w-130",
                },
                {
                    key: "UCRCN",
                    label: "U. Creación",
                    sortable: true,
                    class: "text-center w-130",
                },
                {
                    key: "FEDCN",
                    label: "Fecha de Edición",
                    sortable: true,
                    class: "text-center w-130",
                },
                {
                    key: "UEDCN",
                    label: "U. Edición",
                    sortable: true,
                    class: "text-center w-130",
                },
                {
                    key: "CDESTDO",
                    label: "Estado",
                    sortable: true,
                    class: "text-center w-130",
                },
                {
                    key: "ACCIONES",
                    label: "Acciones",
                    class: "text-center w-130",
                },
            ],
            actionsFiltros: {
                edit: {
                    label: "Editar",
                    icon: "fas fa-edit",
                    class: "btn-edit",
                    action: null,
                },
                delete: {
                    label: "Eliminar",
                    icon: "fas fa-trash",
                    class: "btn-delete",
                    action: null,
                },
                view: {
                    label: "Ver",
                    icon: "fas fa-eye",
                    class: "btn-view",
                    action: null,
                },
            },

            isLoading: false,

            // OPENINGS MODALES
            modalAgregarMagistrados: {
                show: false,
                data: null,
            },
            modalEditarMagistrados: {
                show: false,
                data: null,
            },
            modalEliminarMagistrados: {
                show: false,
                data: null,
            },


            modalAgregarFiltros: {
                show: false,
                data: null,
            },
            modalEditarFiltros: {
                show: false,
                data: null,
            },
            modalEliminarFiltros: {
                show: false,
                data: null,
            },

            // SELECTS
            filter: {
                NOMBRES: null,
                CDESTDO: null,
                OPTION: '1',
            },
            Niveles: {
                ID1: null,
                ID2: null,
                ID3: null,
                ID4: null,
                ID5: null,
                ID6: null,
            },
            title: {
                ID2: null,
                ID3: null,
                ID4: null,
                ID5: null,
                ID6: null,
            },
            dataFilter: {},
            IDFILTER: null,
        };
    },
    methods: {
        async searchMagistrados(currentPage, perPage) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;

            this.grid.isLoading = true;
            await MagistradoProxy.list({
                ROWS: rows,
                INIT: init,
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
            }, this.active)
                .then((dataresponse) => {
                    this.dataMagistrados = dataresponse
                    this.grid.totalRows = dataresponse[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.data = [];
                    toast.error(error?.MESSAGE || 'Error al cargar los magistrados', { toastId: 'error-magistrados' });
                })
                .finally(() => this.grid.isLoading = false);
        },
        async searchFiltros(currentPage, perPage, ID = null) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;
            ID = this.IDFILTER || ID;


            this.grid.isLoading = true;
            await FilterProxy.list({
                ROWS: rows,
                INIT: init,
                NIVEL: Number(this.active) == 5 ? 6 : Number(this.active) == 6 ? 7 : Number(this.active),
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
                ID: ID || null,
            }, this.filter.OPTION, 2)
                .then((dataresponse) => {
                    this.dataFiltros = dataresponse
                    this.grid.totalRows = dataresponse[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.data = [];
                    toast.error(error?.MESSAGE || 'Error al cargar los filtros', { toastId: 'error-filtros' });
                })
                .finally(() => this.grid.isLoading = false);
        },
        updateActive(text) {
            this.active = text;
            this.selectedFilter = {
                NOMBRES: null,
                CDESTDO: null,
                OPTION: null,
            };
            this.grid = {
                ...this.grid,
                perPage: 10,
                currentPage: 1,
                loading: false,
            };

            if (text == '0') this.searchMagistrados(this.grid.currentPage, this.grid.perPage);
            else {
                this.searchFiltros(this.grid.currentPage, this.grid.perPage);
                if (text == "1") {
                    this.Niveles = {
                        ID1: null,
                        ID2: null,
                        ID3: null,
                        ID4: null,
                        ID5: null,
                        ID6: null,
                    }
                }
            }
        },

        // ACTIONS ... 
        async editMagistrados(data) {
            if (!data.ID) return toast.warning('No se encontró el identificador del magistrado', { toastId: 'warning-edit' });
            this.modalEditarMagistrados.data = data;
            this.modalEditarMagistrados.show = true;
        },
        async deleteRowMagistrados() {
            if (!this.modalEliminarMagistrados.data.ID) return toast.warning('No se encontró el identificador del magistrado', { toastId: 'warning-delete' });

            this.isLoading = true;
            await MagistradoProxy.delete(this.modalEliminarMagistrados.data.ID)
                .then((response) => {
                    const toastMessage = response?.MESSAGE || 'Ocurrió un error al eliminar al magistrado';

                    if (response.STATUS) {
                        toast.success('Magistrado eliminado correctamente', { toastId: 'success-delete' });
                        this.searchMagistrados(this.grid.currentPage, this.grid.perPage);
                        this.modalEliminarMagistrados.show = false;

                    } else toast.error(toastMessage, { toastId: 'error-delete' });
                })
                .catch((err) => toast.error(err?.MESSAGE || 'Error al eliminar al magistrado', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },
        async editFiltros(data) {
            if (!data.VALUE) return toast.warning('No se encontró el identificador del filtro', { toastId: 'warning-edit' });
            this.modalEditarFiltros.data = data;
            this.modalEditarFiltros.show = true;
        },
        async deleteRowFiltros() {
            if (!this.modalEliminarFiltros.data.VALUE) return toast.warning('No se encontró el identificador del filtro', { toastId: 'warning-delete' });

            this.isLoading = true;
            await FilterProxy.delete(this.modalEliminarFiltros.data.VALUE)
                .then((response) => {
                    const toastMessage = response?.MESSAGE || 'Ocurrió un error al eliminar el filtro';

                    if (response.STATUS) {
                        toast.success('Filtro eliminado correctamente', { toastId: 'success-delete' });
                        this.searchFiltros(this.grid.currentPage, this.grid.perPage, this.active == 1 ? null : this.Niveles?.[`ID${Number(this.active) - 1}`]);
                        this.modalEliminarFiltros.show = false;

                    } else toast.error(toastMessage, { toastId: 'error-delete' });
                })
                .catch((err) => toast.error(err?.MESSAGE || 'Error al eliminar al filtro', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },
        async viewFiltros(data) {
            this.dataFilter = data;
            if (this.active == 6) return;
            this.filter = {
                NOMBRES: null,
                CDESTDO: null,
                OPTION: '1',
            }
            this.Niveles = { ...this.Niveles, [`ID${Number(this.active)}`]: data?.VALUE || null }
            this.active = Number(this.active) + 1
            this.title = { ...this.title, [`ID${Number(this.active)}`]: data?.LABEL || "" }
            this.IDFILTER = data?.VALUE || null;
            // this.searchFiltros(this.grid.currentPage, this.grid.perPage, data.VALUE);
        },
    },
    mounted() {
        this.actionsMagistrados = {
            ...this.actionsMagistrados,
            edit: {
                ...this.actionsMagistrados.edit,
                action: (data) => this.editMagistrados(data),
            },
            delete: {
                ...this.actionsMagistrados.delete,
                action: (data) => {
                    this.modalEliminarMagistrados.show = true;
                    this.modalEliminarMagistrados.data = data;
                }
            },
        }

        this.actionsFiltros = {
            ...this.actionsFiltros,
            edit: {
                ...this.actionsFiltros.edit,
                action: (data) => this.editFiltros(data),
            },
            delete: {
                ...this.actionsFiltros.delete,
                action: (data) => {
                    this.modalEliminarFiltros.show = true;
                    this.modalEliminarFiltros.data = data;
                }
            },
            view: {
                ...this.actionsFiltros.view,
                action: (data) => this.viewFiltros(data),
            },
        }


    },
    // cuando cambie active
    watch: {
        active: function (newVal) {
            this.grid = {
                ...this.grid,
                perPage: 10,
                currentPage: 1,
                loading: false,
            };

            if (newVal == 0) {
                this.searchMagistrados(this.grid.currentPage, this.grid.perPage);
            }

            if (newVal > 0) {
                // this.dataFilter = {};
                // this.searchFiltros(this.grid.currentPage, this.grid.perPage);
            }
        }
    }
};
</script>

<style scoped>
/* Container Principal */
.filtros-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header */
.filtros-header {
    background: white;
    border-bottom: 1px solid #E5E7EB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 0.5rem 0;
    margin-bottom: 1rem;
}

.filtros-header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
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

.filtros-title {
    font-family: Lato, sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

.filtros-subtitle {
    font-family: Lato, sans-serif;
    color: #6B7280;
    font-size: 0.8rem;
    margin: 0.25rem 0 0 0;
}

/* Content */
.filtros-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem 2rem;
}

/* Modern Tabs con muchos niveles */
.tabs-modern {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
    margin-bottom: 1rem;
    background: white;
    padding: 8px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-button {
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-family: Lato, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.tab-button:not(.tab-disabled):hover {
    background: rgba(24, 92, 230, 0.05);
    color: #185CE6;
}

.tab-button.tab-active {
    background: rgba(24, 92, 230, 0.05);
    color: #185CE6 !important;
}

.tab-button.tab-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

.tab-button svg {
    width: 18px;
    height: 18px;
}

/* Breadcrumb Moderno */
.breadcrumb-modern {
    background: white;
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    gap: 10px;
}

.breadcrumb-modern svg {
    color: #8B5CF6;
    flex-shrink: 0;
}

.breadcrumb-text {
    font-family: Lato, sans-serif;
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

/* Filters Section */
.filters-section {
    background: white;
    border-radius: 16px;
    padding: 1.25rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 1rem;
    align-items: center;
}

.filters-section .col-span-2 {
    grid-column: span 2;
}

/* Search Input */
.search-input-wrapper {
    position: relative;
    flex: 1;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
}

.modern-input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-family: Lato, sans-serif;
    font-size: 14px;
    color: #1e293b;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: #f8fafc;
}


.modern-input:focus {
    outline: none;
    border-color: #185CE6;
    background: white;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

.modern-input::placeholder {
    color: #94a3b8;
}

/* Select Wrapper */
.select-wrapper {
    position: relative;
}

.modern-select {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-family: Lato, sans-serif;
    font-size: 14px;
    color: #1e293b;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}


.modern-select:focus {
    outline: none;
    border-color: #185CE6;
    background: white;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

/* Button Group Extended */
.button-group-extended {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.modern-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-family: Lato, sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
}

.modern-btn svg {
    width: 16px;
    height: 16px;
}

.btn-search {
    background: linear-gradient(135deg, #8B5CF6 0%, #185CE6 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-search:hover {
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.btn-create {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(223, 45, 178, 0.3);
}

.btn-create:hover {
    box-shadow: 0 6px 16px rgba(223, 45, 178, 0.4);
}

.btn-back {
    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
}

.btn-back:hover {
    box-shadow: 0 6px 16px rgba(100, 116, 139, 0.4);
}

/* Table Section */
.table-section {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
}

/* Responsive */
@media (max-width: 1024px) {
    .filtros-container {
        padding: 0 1.5rem;
    }
    .filtros-header {
        margin: 0 -1.5rem 2rem -1.5rem;
    }
    .filtros-header-content {
        padding: 1.5rem 1.5rem 0 1.5rem;
    }
}

@media (max-width: 768px) {
    .filtros-container {
        padding: 0 0.5rem;
    }
    .filtros-content {
        padding: 0 0.5rem 1rem 0.5rem;
    }
    .filtros-header {
        padding: 0 0 0.75rem 0;
        margin: 0 -0.5rem 1rem -0.5rem;
    }
    .filtros-header-content {
        padding: 0.75rem 0.5rem 0 0.5rem;
    }
    .header-title-section {
        gap: 0.875rem;
    }
    .header-icon {
        width: 26px;
        height: 26px;
    }
    .filtros-title {
        font-size: 1.35rem;
        line-height: 1.3;
    }
    .filtros-subtitle {
        font-size: 0.8rem;
        line-height: 1.4;
    }
    .tabs-modern {
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
    .tab-button svg {
        width: 18px;
        height: 18px;
    }
    .filters-section {
        padding: 1rem;
        border-radius: 14px;
        grid-template-columns: 1fr;
    }
    .button-group-extended {
        width: 100%;
        flex-direction: column;
        gap: 12px;
    }
    .modern-btn {
        flex: 1;
        justify-content: center;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
    }
    .table-section {
        border-radius: 14px;
    }
}

@media (max-width: 480px) {
    .filtros-container {
        padding: 0 0.875rem;
    }
    .filtros-header {
        padding: 0 0 0.5rem 0;
        margin: 0 -0.875rem 1rem -0.875rem;
    }
    .filtros-header-content {
        padding: 0.5rem 0.875rem 0 0.875rem;
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
    .filtros-title {
        font-size: 1.05rem;
        line-height: 1.3;
        overflow-wrap: break-word;
    }
    .filtros-subtitle {
        font-size: 0.72rem;
        line-height: 1.3;
        overflow-wrap: break-word;
    }
    .tabs-modern {
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
    .tab-button svg {
        width: 16px;
        height: 16px;
    }
    .filters-section {
        padding: 1.25rem;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .search-input-wrapper,
    .select-wrapper {
        width: 100%;
    }
    .modern-input,
    .modern-select {
        padding: 1rem 1.25rem;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
    }
    .button-group-extended {
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }
    .modern-btn {
        padding: 1rem 1.5rem;
        font-size: 1rem;
        width: 100%;
        justify-content: center;
    }
    .table-section {
        border-radius: 14px;
    }
}
</style>