<template>
    <section class="mantenimiento-container">
        <!-- Header con Título -->
        <div class="mantenimiento-header">
            <div class="mantenimiento-header-content">
                <div class="header-title-section">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="header-icon">
                        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                    </svg>
                    <div>
                        <h1 class="mantenimiento-title">Mantenimiento</h1>
                        <p class="mantenimiento-subtitle">Gestión de preguntas frecuentes y planes</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mantenimiento-content">
            <!-- Modern Tabs -->
            <div class="tabs-modern">
                <button
                    class="tab-button"
                    :class="{ 'tab-active': active === 'preguntas' }"
                    @click="updateActive('preguntas')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span>Preguntas</span>
                </button>
                <button
                    class="tab-button"
                    :class="{ 'tab-active': active === 'planes' }"
                    @click="updateActive('planes')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>Planes</span>
                </button>
            </div>

            <!-- Filtros Modernos -->
            <div class="filters-section">
                <div class="search-input-wrapper">
                    <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        class="modern-input"
                        :placeholder="`Buscar por descripción...`"
                        v-model="filter.NOMBRES"
                        id="name" />
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

                <div class="button-group">
                    <button class="modern-btn btn-search" @click="() => {
                        if (active === 'preguntas') searchPregunta(grid.currentPage, grid.perPage);
                        if (active === 'planes') searchPlanes(grid.currentPage, grid.perPage);
                    }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <span>Buscar</span>
                    </button>
                    <button class="modern-btn btn-create" @click="() => {
                        if (active === 'preguntas') modalAgregarPregunta.show = true;
                        if (active === 'planes') modalAgregarPlanes.show = true;
                    }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Crear</span>
                    </button>
                </div>
            </div>

            <!-- Tablas -->
            <div class="table-section">
                <card-table v-if="active === 'preguntas'" :active="active" title="Preguntas" :search="searchPregunta"
                    :fields="fieldsPreguntas" :items="dataPregunta" :grid="grid" :actions="actionsPreguntas" />

                <card-table v-if="active === 'planes'" :active="active" title="Planes" :search="searchPlanes"
                    :fields="fieldsPlanes" :items="dataPlanes" :grid="grid" :actions="actionsPlanes" />
            </div>

            <LoadingOverlay :active="isLoading" :is-full-page="false" :loader="'bars'" />


            <!-- PREGUNTAS -->
            <ModalPreguntaAgregar :role="role" :show="modalAgregarPregunta.show"
                :close="() => modalAgregarPregunta.show = false"
                :update="() => searchPregunta(grid.currentPage, grid.perPage)" />

            <ModalPreguntaEditar :role="role" :show="modalEditarPregunta.show"
                :close="() => modalEditarPregunta.show = false"
                :update="() => searchPregunta(grid.currentPage, grid.perPage)" :data="modalEditarPregunta.data" />

            <ModalEliminar :message="'¿Está cambiar el estado de la pregunta?'" :buttonOk="'Si, eliminar'"
                :action="deleteRowPregunta" :openDelete="modalEliminarPregunta.show"
                :closeHandler="() => modalEliminarPregunta.show = false" />

            <!-- PLANES -->
            <ModalPlanAgregar :role="role" :show="modalAgregarPlanes.show"
                :close="() => modalAgregarPlanes.show = false"
                :update="() => searchPlanes(grid.currentPage, grid.perPage)" />

            <ModalPlanEditar :role="role" :show="modalEditarPlanes.show" :close="() => modalEditarPlanes.show = false"
                :update="() => searchPlanes(grid.currentPage, grid.perPage)" :data="modalEditarPlanes.data" />

            <ModalEliminar :message="'¿Está cambiar el estado del plan?'" :buttonOk="'Si, eliminar'"
                :action="deleteRowPlanes" :openDelete="modalEliminarPlanes.show"
                :closeHandler="() => modalEliminarPlanes.show = false" />
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
import ModalPreguntaAgregar from "./ModalesMantenimiento/ModalPreguntaAgregar.vue";
import ModalPreguntaEditar from "./ModalesMantenimiento/ModalPreguntaEditar.vue";
import ModalPlanAgregar from "./ModalesMantenimiento/ModalPlanAgregar.vue";
import ModalPlanEditar from "./ModalesMantenimiento/ModalPlanEditar.vue";

// PROXIES
import MantenimientoProxy from '../../proxies/MantenimientoProxy';

export default {
    components: {
        CardTable,
        BFormSelect,

        // MODALES
        ModalEliminar,

        ModalPreguntaAgregar,
        ModalPreguntaEditar,

        ModalPlanAgregar,
        ModalPlanEditar
    },
    data() {
        return {
            searchIcon,
            currentPage: 10,
            dataPregunta: [],
            dataPlanes: [],
            grid: {
                items: [],
                currentPage: 1,
                perPage: 10,
                totalRows: 120,
                isLoading: true,
                pageOptions: [5, 10, 15, 50],
            },
            fieldsPreguntas: [
                { key: "RN", label: "" },
                { key: "DESCRIPCION", label: "Descripción", width: "50%" },
                {
                    key: "FCRCN",
                    label: "Fecha de Creación",
                    sortable: true,
                },
                {
                    key: "CDESTDO",
                    label: "Estado",
                    sortable: true,
                    class: "text-center w-130",
                },
                { key: "ACCIONES", label: "Acciones", class: "text-center" },
            ],
            fieldsPlanes: [
                { key: "RN", label: "" },
                { key: "DESCRIPCION", label: "Descripción", width: "30%" },
                {
                    key: "TIEMPO", label: "Duración", width: "20%", class: "text-center",
                    formatter: (value) => {
                        return value ? `${value} días` : '0 días';
                    }
                },
                {
                    key: "PRECIO", label: "Precio", width: "20%", class: "text-center",
                    formatter: (value) => {
                        return value ? `S/. ${value}` : 'S/. 0.00';
                    }
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
                { key: "ACCIONES", label: "Acciones", class: "text-center" },
            ],
            actionsPreguntas: {
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
            actionsPlanes: {
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

            // OPENINGS MODALES
            modalAgregarPregunta: {
                show: false,
                data: null,
            },
            modalEditarPregunta: {
                show: false,
                data: null,
            },

            modalAgregarPlanes: {
                show: false,
                data: null,
            },
            modalEditarPlanes: {
                show: false,
                data: null,
            },

            modalEliminarPregunta: {
                show: false,
                data: null,
            },
            modalEliminarPlanes: {
                show: false,
                data: null,
            },

            // SELECTS
            filter: {
                NOMBRES: null,
                CDESTDO: null,
            },
            selects: {
                planes: [],
            },
            isLoading: false,
            // TABS
            active: "preguntas",
        };
    },
    props: {
        role: {
            type: Object,
            default: () => { }
        }
    },
    methods: {
        async searchPregunta(currentPage, perPage) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;

            this.grid.isLoading = true;
            await MantenimientoProxy.listPreguntas({
                ROWS: rows,
                INIT: init,
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
            }, this.active)
                .then((response) => {
                    this.dataPregunta = response || [];
                    this.grid.totalRows = response[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.dataPregunta = [];
                    toast.error(error?.MESSAGE || 'Error al cargar las preguntas', { toastId: 'error-preguntas' });
                })
                .finally(() => this.grid.isLoading = false);
        },
        async searchPlanes(currentPage, perPage) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;

            this.grid.isLoading = true;
            await MantenimientoProxy.listPlanes({
                ROWS: rows,
                INIT: init,
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
            }, this.active)
                .then((response) => {
                    this.dataPlanes = response || [];
                    this.grid.totalRows = response[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.dataPlanes = [];
                    toast.error(error?.MESSAGE || 'Error al cargar los planes', { toastId: 'error-planes' });
                })
                .finally(() => this.grid.isLoading = false);
        },
        async editPregunta(data) {
            if (!data.ID) return toast.warning('No se encontró el identificador de la pregunta', { toastId: 'warning-edit' });
            this.modalEditarPregunta.data = data;
            this.modalEditarPregunta.show = true;
        },
        async editPlanes(data) {
            if (!data.ID) return toast.warning('No se encontró el identificador del plan', { toastId: 'warning-edit' });
            this.modalEditarPlanes.data = data;
            this.modalEditarPlanes.show = true;
        },


        async deleteRowPregunta() {
            if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });

            if (!this.modalEliminarPregunta.data.ID) return toast.warning('No se encontró el identificador de la pregunta', { toastId: 'warning-delete' });

            this.isLoading = true;
            await MantenimientoProxy.deletePregunta(this.modalEliminarPregunta.data.ID)
                .then((response) => {
                    const toastMessage = response?.MESSAGE || 'Ocurrió un error al eliminar la pregunta';

                    if (response.STATUS) {
                        toast.success('Pregunta eliminada correctamente', { toastId: 'success-delete' });
                        this.searchPregunta(this.grid.currentPage, this.grid.perPage);
                        this.modalEliminarPregunta.show = false;

                    } else toast.error(toastMessage, { toastId: 'error-delete' });
                })
                .catch((err) => toast.error(err?.MESSAGE || 'Error al eliminar la pregunta', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },
        async deleteRowPlanes() {
            if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });

            if (!this.modalEliminarPlanes.data.ID) return toast.warning('No se encontró el identificador del plan', { toastId: 'warning-delete' });

            this.isLoading = true;
            await MantenimientoProxy.deletePlan(this.modalEliminarPlanes.data.ID)
                .then((response) => {
                    const toastMessage = response?.MESSAGE || 'Ocurrió un error al eliminar el plan';

                    if (response.STATUS) {
                        toast.success('Plan eliminado correctamente', { toastId: 'success-delete' });
                        this.searchPlanes(this.grid.currentPage, this.grid.perPage);
                        this.modalEliminarPlanes.show = false;

                    } else toast.error(toastMessage, { toastId: 'error-delete' });
                })
                .catch((err) => toast.error(err?.MESSAGE || 'Error al eliminar el plan', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },

        updateActive(text) {
            this.active = text;
            this.selectedFilter = {
                NOMBRES: null,
                CDESTDO: 'A',
            };
            this.grid = {
                ...this.grid,
                perPage: 10,
                currentPage: 1,
                loading: false,
            };

            if (text == 'preguntas') this.searchPregunta(this.grid.currentPage, this.grid.perPage);
            if (text == 'planes') this.searchPlanes(this.grid.currentPage, this.grid.perPage);
        },
    },
    mounted() {
        this.actionsPreguntas = {
            ...this.actionsPreguntas,
            edit: {
                ...this.actionsPreguntas.edit,
                action: (data) => this.editPregunta(data),
            },
            delete: {
                ...this.actionsPreguntas.delete,
                action: (data) => {
                    this.modalEliminarPregunta.show = true;
                    this.modalEliminarPregunta.data = data;
                }
            },
        }

        this.actionsPlanes = {
            ...this.actionsPlanes,
            edit: {
                ...this.actionsPlanes.edit,
                action: (data) => this.editPlanes(data),
            },
            delete: {
                ...this.actionsPlanes.delete,
                action: (data) => {
                    this.modalEliminarPlanes.show = true;
                    this.modalEliminarPlanes.data = data;
                }
            },
        }

    }
};
</script>

<style scoped>
/* Container Principal */
/* Container Principal */
.mantenimiento-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 0 2rem;
}

/* Header */
/* Header */
.mantenimiento-header {
    background: white;
    border-bottom: 1px solid #E5E7EB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 0 0 0.5rem 0;
    margin: 0 -2rem 1rem -2rem;
}

/* Header Content */
.mantenimiento-header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.5rem 2rem 0 2rem;
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

.mantenimiento-title {
    font-family: Lato, sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

.mantenimiento-subtitle {
    font-family: Lato, sans-serif;
    color: #6B7280;
    font-size: 0.8rem;
    margin: 0.25rem 0 0 0;
}

/* Content */
/* Content Wrapper */
.mantenimiento-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 0 1.5rem 0;
}

/* Modern Tabs */
.tabs-modern {
    display: flex;
    gap: 8px;
    margin-bottom: 1rem;
    background: white;
    padding: 8px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-button {
    flex: 1;
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

.tab-button:hover {
    background: rgba(24, 92, 230, 0.05);
    color: #185CE6;
}

.tab-button.tab-active {
    background: rgba(24, 92, 230, 0.05);
    color: #185CE6 !important;
}

.tab-button svg {
    width: 18px;
    height: 18px;
}

/* Filters Section */
/* Filters Section */
.filters-section {
    background: white;
    border-radius: 16px;
    padding: 1.25rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 1rem;
    align-items: center;
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

/* Search Input */
/* Search Input */
.modern-input {
    width: 100%;
    padding: 0.65rem 0.875rem 0.65rem 2.5rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    font-family: Lato, sans-serif;
    font-size: 0.9rem;
    color: #1F2937;
    transition: all 0.3s ease;
    background: white;
}

.modern-input:focus {
    outline: none;
    border-color: #185CE6;
    background: white;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

.modern-input::placeholder {
    color: #9CA3AF;
}

/* Select Wrapper */
.select-wrapper {
    position: relative;
}

/* Select Wrapper */
/* Select Wrapper */
.modern-select {
    width: 100%;
    padding: 0.65rem 0.875rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    font-family: Lato, sans-serif;
    font-size: 0.9rem;
    color: #1F2937;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.modern-select:focus {
    outline: none;
    border-color: #185CE6;
    background: white;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

/* Button Group */
.button-group {
    display: flex;
    gap: 10px;
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

/* Table Section */
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
    .mantenimiento-container {
        padding: 0 1.5rem;
    }
    .mantenimiento-header {
        margin: 0 -1.5rem 2rem -1.5rem;
    }
    .mantenimiento-header-content {
        padding: 1.5rem 1.5rem 0 1.5rem;
    }
}

@media (max-width: 768px) {
    .mantenimiento-container {
        padding: 0 1rem;
    }
    .mantenimiento-header {
        padding: 0 0 0.75rem 0;
        margin: 0 -1rem 1rem -1rem;
    }
    .mantenimiento-header-content {
        padding: 0.75rem 1rem 0 1rem;
    }
    .header-title-section {
        gap: 0.875rem;
    }
    .header-icon {
        width: 26px;
        height: 26px;
    }
    .mantenimiento-title {
        font-size: 1.35rem;
        line-height: 1.3;
    }
    .mantenimiento-subtitle {
        font-size: 0.8rem;
        line-height: 1.4;
    }
    .mantenimiento-content {
        padding: 0 1rem 1rem;
    }
    .tabs-modern {
        flex-direction: column;
        gap: 8px;
    }
    .tab-button {
        width: 100%;
        padding: 12px 20px;
    }
    .filters-section {
        grid-template-columns: 1fr;
        padding: 1rem;
        border-radius: 14px;
    }
    .button-group {
        width: 100%;
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
    .mantenimiento-container {
        padding: 0 0.875rem;
    }
    .mantenimiento-header {
        padding: 0 0 0.5rem 0;
        margin: 0 -0.875rem 1rem -0.875rem;
    }
    .mantenimiento-header-content {
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
    .mantenimiento-title {
        font-size: 1.05rem;
        line-height: 1.3;
        overflow-wrap: break-word;
    }
    .mantenimiento-subtitle {
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
        padding: 1rem;
        border-radius: 14px;
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
    .button-group {
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