<template>
    <section class="noticias-container">
        <!-- Header con Título -->
        <div class="noticias-header">
            <div class="noticias-header-content">
                <div class="header-title-section">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="header-icon">
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                    <div>
                        <h1 class="noticias-title">Investigación</h1>
                        <p class="noticias-subtitle">Gestión de noticias, autores, categorías y recursos</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="noticias-content">
            <!-- Modern Tabs -->
            <div class="tabs-modern">
                <button
                    class="tab-button"
                    :class="{ 'tab-active': active === 'noticias' }"
                    @click="updateActive('noticias')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                    <span>Investigación</span>
                </button>
                <button
                    class="tab-button"
                    :class="{ 'tab-active': active === 'autores' }"
                    @click="updateActive('autores')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span>Autores</span>
                </button>
                <button
                    class="tab-button"
                    :class="{ 'tab-active': active === 'categorias' }"
                    @click="updateActive('categorias')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    <span>Categorías</span>
                </button>
                <button
                    class="tab-button"
                    :class="{ 'tab-active': active === 'recursos' }"
                    @click="updateActive('recursos')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span>Recursos</span>
                </button>
            </div>
            <!-- Filtros Modernos -->
            <div class="filters-section" :class="{'filters-section-with-tipo': active === 'noticias'}">
                <div class="search-input-wrapper">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        class="modern-input"
                        :placeholder="`Buscar por ${active === 'noticias' ? 'investigación' : active === 'autores' ? 'autor' : active === 'categorias' ? 'categoría' : 'recurso'}...`"
                        v-model="filter.NOMBRES"
                        id="name" />
                </div>

                <div class="select-wrapper" v-if="active === 'noticias'">
                    <b-form-select
                        v-model="filter.TIPO"
                        class="modern-select"
                        :options="[
                            { text: '-- Seleccione Tipo', value: null },
                            ...selects.categorias
                        ]">
                    </b-form-select>
                </div>

                <div class="select-wrapper">
                    <b-form-select
                        v-model="filter.CDESTDO"
                        class="modern-select"
                        :options="[
                            { text: '-- Seleccione Estado', value: null },
                            { text: 'Activo', value: 'A' },
                            { text: 'Inactivo', value: 'I' }]">
                    </b-form-select>
                </div>

                <div class="button-group">
                    <button class="modern-btn btn-search" @click="() => {
                        if (active === 'noticias') searchNoticias(grid.currentPage, grid.perPage);
                        if (active === 'autores') searchAutores(grid.currentPage, grid.perPage);
                        if (active === 'categorias') searchCategorias(grid.currentPage, grid.perPage);
                        if (active === 'recursos') searchRecursos(grid.currentPage, grid.perPage);
                    }">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <span>Buscar</span>
                    </button>
                    <button class="modern-btn btn-create" @click="() => {
                        if (active === 'noticias') modalAgregarNoticia.show = true;
                        if (active === 'autores') modalAgregarAutor.show = true;
                        if (active === 'categorias') modalAgregarCategoria.show = true;
                        if (active === 'recursos') modalAgregarRecurso.show = true;
                    }">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Crear</span>
                    </button>
                </div>
            </div>

            <!-- Tablas -->
            <div class="table-section">
                <card-table v-if="active == 'noticias'" :active="active" title="" :search="searchNoticias"
                    :fields="fieldsNoticias" :items="dataNoticia" :grid="grid" :actions="actionsNoticias" />
                <card-table v-if="active == 'autores'" :active="active" title="" :search="searchAutores"
                    :fields="fieldsAutores" :items="dataAutores" :grid="grid" :actions="actionsAutores" />
                <card-table v-if="active == 'categorias'" :active="active" title="" :search="searchCategorias"
                    :fields="fieldsCategorias" :items="dataCategorias" :grid="grid" :actions="actionsCategorias" />
                <card-table v-if="active == 'recursos'" :active="active" title="" :search="searchRecursos"
                    :fields="fieldsRecursos" :items="dataRecursos" :grid="grid" :actions="actionsRecursos" />
            </div>

            <LoadingOverlay :active="isLoading" :is-full-page="false" :loader="'bars'" />

            <!-- NOTICIAS -->
            <ModalNoticiaAgregar :role="role" :show="modalAgregarNoticia.show"
                :close="() => modalAgregarNoticia.show = false" :selects="selects"
                :update="() => searchNoticias(grid.currentPage, grid.perPage)" />

            <ModalNoticiaEditar :role="role" :show="modalEditarNoticia.show"
                :close="() => modalEditarNoticia.show = false" :selects="selects"
                :update="() => searchNoticias(grid.currentPage, grid.perPage)" :data="modalEditarNoticia.data" />

            <ModalEliminar :message="'¿Está cambiar el estado de la noticia?'" :buttonOk="'Si, Cambiar'"
                :action="deleteRowNoticia" :openDelete="modalEliminarNoticia.show"
                :closeHandler="() => modalEliminarNoticia.show = false" />

            <!-- PREGUNTAS -->
            <ModalAutorAgregar :role="role" :show="modalAgregarAutor.show" :close="() => modalAgregarAutor.show = false"
                :update="() => searchAutores(grid.currentPage, grid.perPage)" />

            <ModalAutorEditar :role="role" :show="modalEditarAutor.show" :close="() => modalEditarAutor.show = false"
                :update="() => searchAutores(grid.currentPage, grid.perPage)" :data="modalEditarAutor.data" />

            <ModalEliminar :message="'¿Está cambiar el estado de la pregunta?'" :buttonOk="'Si, Cambiar'"
                :action="deleteAutor" :openDelete="modalEliminarAutor.show"
                :closeHandler="() => modalEliminarAutor.show = false" />

            <!-- CATEGORIAS -->
            <ModalCategoriaAgregar :role="role" :show="modalAgregarCategoria.show"
                :close="() => modalAgregarCategoria.show = false"
                :update="updateCategoriasData" />

            <ModalCategoriaEditar :role="role" :show="modalEditarCategoria.show"
                :close="() => modalEditarCategoria.show = false"
                :update="updateCategoriasData" :data="modalEditarCategoria.data" />

            <ModalEliminar :message="'¿Está seguro de cambiar el estado del registro?'" :buttonOk="'Si, Cambiar'"
                :action="deleteCategoria" :openDelete="modalEliminarCategoria.show"
                :closeHandler="() => modalEliminarCategoria.show = false" />

            <!-- RECURSOS -->
            <ModalRecursoAgregar :role="role" :show="modalAgregarRecurso.show"
                :close="() => modalAgregarRecurso.show = false"
                :update="() => searchRecursos(grid.currentPage, grid.perPage)" />

            <ModalEliminar :message="'¿Está seguro de cambiar el estado del registro?'" :buttonOk="'Si, Cambiar'"
                :action="deleteRecurso" :openDelete="modalEliminarRecurso.show"
                :closeHandler="() => modalEliminarRecurso.show = false" />
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
import ModalNoticiaAgregar from "./ModalesMantenimiento/ModalNoticiaAgregar.vue";
import ModalNoticiaEditar from "./ModalesMantenimiento/ModalNoticiaEditar.vue";

import ModalCategoriaAgregar from "./ModalesMantenimiento/ModalCategoriaAgregar.vue";
import ModalCategoriaEditar from "./ModalesMantenimiento/ModalCategoriaEditar.vue";

import ModalAutorAgregar from "./ModalesMantenimiento/ModalAutorAgregar.vue";
import ModalAutorEditar from "./ModalesMantenimiento/ModalAutorEditar.vue";

import ModalRecursoAgregar from "./ModalesMantenimiento/ModalRecursoAgregar.vue";

// PROXIES
import MantenimientoProxy from '../../proxies/MantenimientoProxy';
import filterProxy from '../../proxies/FilterProxy';

export default {
    components: {
        CardTable,
        BFormSelect,

        // MODALES
        ModalEliminar,
        ModalNoticiaAgregar,
        ModalNoticiaEditar,

        ModalCategoriaAgregar,
        ModalCategoriaEditar,

        ModalAutorAgregar,
        ModalAutorEditar,

        ModalRecursoAgregar
    },
    data() {
        return {
            searchIcon,
            currentPage: 10,
            dataNoticia: [],
            dataAutores: [],
            dataCategorias: [],
            dataRecursos: [],
            grid: {
                items: [],
                currentPage: 1,
                perPage: 10,
                totalRows: 120,
                isLoading: true,
                pageOptions: [5, 10, 15, 50],
            },
            fieldsNoticias: [
                { key: "RN", label: "" },
                { key: "DTIPO", label: "Tipo", width: "15%" },
                { key: "TITULO", label: "Título", width: "30%" },
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
            fieldsAutores: [
                { key: "RN", label: "" },
                {
                    key: "AUTOR", label: "Nombres y Apellidos", width: "50%",
                    formatter: (value, key, item) => {
                        return `
                            <div class="d-flex align-items-center" style="gap: 1rem; max-width: 400px;">
                                <div style="flex-shrink: 0;">
                                    <img 
                                        src="${item.RUTA || 'https://placehold.co/50x50'}" 
                                        onerror="this.onerror=null; this.src='https://placehold.co/50x50" 
                                        alt="Foto del autor" 
                                        class="rounded-circle border"
                                        style="width: 50px; height: 50px; object-fit: cover;"
                                    />
                                </div>
                                <div>
                                    <h6 class="mb-1 text-dark">${item.NOMBRES} ${item.APELLIDOS}</h6>
                                </div>
                            </div>
                        `;
                    }
                },
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
            fieldsCategorias: [
                { key: "RN", label: "" },
                { key: "DESCP", label: "Descripción", width: "30%" },
                { key: "DETALLE", label: "Detalle", width: "40%" },
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
            fieldsRecursos: [
                { key: "RN", label: "" },
                { key: "NOMBRE", label: "Archivo", width: "30%" },
                { key: "ENLACE", label: "Enlace", width: "40%" },
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
            actionsNoticias: {
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
            actionsAutores: {
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
            actionsCategorias: {
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
            actionsRecursos: {
                delete: {
                    label: "Eliminar",
                    icon: "fas fa-trash",
                    class: "btn-delete",
                    action: null,
                },
            },

            // OPENINGS MODALES
            modalAgregarNoticia: {
                show: false,
                data: null,
            },
            modalEditarNoticia: {
                show: false,
                data: null,
            },

            modalAgregarAutor: {
                show: false,
                data: null,
            },
            modalEditarAutor: {
                show: false,
                data: null,
            },

            modalAgregarCategoria: {
                show: false,
                data: null,
            },
            modalEditarCategoria: {
                show: false,
                data: null,
            },

            modalEliminarNoticia: {
                show: false,
                data: null,
            },
            modalEliminarAutor: {
                show: false,
                data: null,
            },
            modalEliminarCategoria: {
                show: false,
                data: null,
            },

            modalAgregarRecurso: {
                show: false,
                data: null,
            },
            modalEliminarRecurso: {
                show: false,
                data: null,
            },
            // SELECTS
            filter: {
                NOMBRES: null,
                CDESTDO: null,
                TIPO: null,
            },

            isLoading: false,
            active: "noticias",
            selects: {
                categorias: [],
                autores: [],
                organos: [],
                planes: [],
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
        async searchNoticias(currentPage, perPage) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;

            this.grid.isLoading = true;
            await MantenimientoProxy.list({
                ROWS: rows,
                INIT: init,
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
                TIPO: this.filter?.TIPO || null,
            }, this.active)
                .then((response) => {
                    this.dataNoticia = response || [];
                    this.grid.totalRows = response[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.dataNoticia = [];
                    toast.error(error?.MESSAGE || 'Error al cargar las noticias', { toastId: 'error-noticias' });
                })
                .finally(() => this.grid.isLoading = false);
        },
        async searchAutores(currentPage, perPage) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;

            this.grid.isLoading = true;
            await MantenimientoProxy.listAutores({
                ROWS: rows,
                INIT: init,
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
            }, this.active)
                .then((response) => {
                    this.dataAutores = response || [];
                    this.grid.totalRows = response[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.dataAutores = [];
                    toast.error(error?.MESSAGE || 'Error al cargar las preguntas', { toastId: 'error-preguntas' });
                })
                .finally(() => this.grid.isLoading = false);
        },
        async searchCategorias(currentPage, perPage) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;

            this.grid.isLoading = true;
            await MantenimientoProxy.listCategorias({
                ROWS: rows,
                INIT: init,
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
            }, this.active)
                .then((response) => {
                    this.dataCategorias = response || [];
                    this.grid.totalRows = response[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.dataCategorias = [];
                    toast.error(error?.MESSAGE || 'Error al cargar los planes', { toastId: 'error-planes' });
                })
                .finally(() => this.grid.isLoading = false);
        },
        async searchRecursos(currentPage, perPage) {
            const init = (currentPage - 1) * perPage;
            const rows = perPage;

            this.grid.isLoading = true;
            await MantenimientoProxy.listRecursos({
                ROWS: rows,
                INIT: init,
                DESC: this.filter?.NOMBRES || null,
                CESTDO: this.filter?.CDESTDO || null,
            }, this.active)
                .then((response) => {
                    this.dataRecursos = response || [];
                    this.grid.totalRows = response[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.dataRecursos = [];
                    toast.error(error?.MESSAGE || 'Error al cargar los recursos', { toastId: 'error-recursos' });
                })
                .finally(() => this.grid.isLoading = false);
        },
        async editNoticia(data) {
            if (!data.ID) return toast.warning('No se encontró el identificador de la noticia', { toastId: 'warning-edit' });
            this.modalEditarNoticia.data = data;
            this.modalEditarNoticia.show = true;
        },
        async editAutor(data) {
            if (!data.ID) return toast.warning('No se encontró el identificador de la pregunta', { toastId: 'warning-edit' });
            this.modalEditarAutor.data = data;
            this.modalEditarAutor.show = true;
        },
        async editCategoria(data) {
            if (!data.ID) return toast.warning('No se encontró el identificador de la categoria', { toastId: 'warning-edit' });
            this.modalEditarCategoria.data = data;
            this.modalEditarCategoria.show = true;
        },

        async selectAllPromises() {
            try {
                const [autores, categorias, filters] = await Promise.all([
                    MantenimientoProxy.listAutores({ CESTDO: '', ROWS: 1000, INIT: 0 }),
                    MantenimientoProxy.listCategorias({ CESTDO: 'A', ROWS: 1000, INIT: 0 }),
                    filterProxy.list({ NIVEL: 5 }, null).catch(() => []),
                ]);
                this.selects.autores = autores?.map(item => ({ value: item.ID, label: (item?.NOMBRES || '') + ' ' + (item?.APELLIDOS || '') })) || [];
                this.selects.categorias = categorias?.map(item => ({ value: item.ID, text: item.DESCP })) || [];

                const organoItem = (filters || []).find(f => f.LABEL?.toUpperCase() === 'ÓRGANO JURISDICCIONAL');
                if (organoItem) {
                    const NIVEL_2 = JSON.parse(organoItem.NIVEL_2);
                    this.selects.organos = NIVEL_2.map(item => ({
                        value: item.VALUE,
                        label: item.LABEL,
                        children: (item.NIVEL_3 || []).map(item2 => ({
                            value: item2.VALUE,
                            label: item2.LABEL,
                            children: (item2.NIVEL_4 || []).map(item3 => ({
                                value: item3.VALUE,
                                label: item3.LABEL,
                            })),
                        })),
                    }));
                }
            } catch (error) {
                toast.error(error?.MESSAGE || 'Error al cargar los selects', { toastId: 'error-selects' });
            }
        },

        async deleteRowNoticia() {
            if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });

            if (!this.modalEliminarNoticia.data.ID) return toast.warning('No se encontró el identificador de la noticia', { toastId: 'warning-delete' });

            this.isLoading = true;
            await MantenimientoProxy.delete(this.modalEliminarNoticia.data.ID)
                .then((response) => {
                    const toastMessage = response?.MESSAGE || 'Ocurrió un error al cambiar el estado de la noticia';

                    if (response.STATUS) {
                        toast.success('Registro cambiado de estado correctamente', { toastId: 'success-delete' });
                        this.searchNoticias(this.grid.currentPage, this.grid.perPage);
                        this.modalEliminarNoticia.show = false;

                    } else toast.error(toastMessage, { toastId: 'error-delete' });
                })
                .catch((err) => toast.error(err?.MESSAGE || 'Error al cambiar el estado del registro', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },
        async deleteAutor() {
            if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });

            if (!this.modalEliminarAutor.data.ID) return toast.warning('No se encontró el identificador de la pregunta', { toastId: 'warning-delete' });

            this.isLoading = true;
            await MantenimientoProxy.deleteAutor(this.modalEliminarAutor.data.ID)
                .then((response) => {
                    const toastMessage = response?.MESSAGE || 'Ocurrió un error al cambiar el estado del registro';

                    if (response.STATUS) {
                        toast.success('Registro cambiado de estado correctamente', { toastId: 'success-delete' });
                        this.searchAutores(this.grid.currentPage, this.grid.perPage);
                        this.modalEliminarAutor.show = false;

                    } else toast.error(toastMessage, { toastId: 'error-delete' });
                })
                .catch((err) => toast.error(err?.MESSAGE || 'Error al cambiar el estado del registro', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },
        async deleteCategoria() {
            if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });

            if (!this.modalEliminarCategoria.data.ID) return toast.warning('No se encontró el identificador de la categoria', { toastId: 'warning-delete' });

            this.isLoading = true;
            await MantenimientoProxy.deleteCategoria(this.modalEliminarCategoria.data.ID)
                .then((response) => {
                    const toastMessage = response?.MESSAGE || 'Ocurrió un error al cambiar el estado del registro';

                    if (response.STATUS) {
                        toast.success('Registro cambiado de estado correctamente', { toastId: 'success-delete' });
                        this.updateCategoriasData();
                        this.modalEliminarCategoria.show = false;
                    } else toast.error(toastMessage, { toastId: 'error-delete' });
                })
                .catch((err) => toast.error(err?.MESSAGE || 'Error al cambiar el estado del registro', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },
        async deleteRecurso() {
            if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });

            if (!this.modalEliminarRecurso.data.ID) return toast.warning('No se encontró el identificador del recurso', { toastId: 'warning-delete' });

            this.isLoading = true;
            await MantenimientoProxy.deleteRecurso(this.modalEliminarRecurso.data.ID, this.modalEliminarRecurso.data.ENLACE)
                .then((response) => {
                    const toastMessage = response?.MESSAGE || 'Ocurrió un error al cambiar el estado del registro';

                    if (response.STATUS) {
                        toast.success('Registro cambiado de estado correctamente', { toastId: 'success-delete' });
                        this.searchRecursos(this.grid.currentPage, this.grid.perPage);
                        this.modalEliminarRecurso.show = false;
                    } else toast.error(toastMessage, { toastId: 'error-delete' });
                })
                .catch((err) => toast.error(err?.MESSAGE || 'Error al cambiar el estado del registro', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },

        async updateCategoriasData() {
            await this.searchCategorias(this.grid.currentPage, this.grid.perPage);
            await this.loadCategorias();
        },

        async loadCategorias() {
            try {
                let categorias = await MantenimientoProxy.listCategorias({ CESTDO: 'A', ROWS: 1000, INIT: 0 });
                this.selects.categorias = categorias?.map(item => ({ value: item.ID, text: item.DESCP })) || [];
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        },

        updateActive(text) {
            this.active = text;
            this.filter = {
                NOMBRES: null,
                CDESTDO: null,
                TIPO: null,
            };
            this.grid = {
                ...this.grid,
                perPage: 10,
                currentPage: 1,
                loading: false,
            };

            if (text == 'noticias') this.searchNoticias(this.grid.currentPage, this.grid.perPage);
            if (text == 'autores') this.searchAutores(this.grid.currentPage, this.grid.perPage);
            if (text == 'categorias') this.searchCategorias(this.grid.currentPage, this.grid.perPage);
            if (text == 'recursos') this.searchRecursos(this.grid.currentPage, this.grid.perPage);
        },
    },
    mounted() {
        this.selectAllPromises();
        this.actionsNoticias = {
            ...this.actionsNoticias,
            edit: {
                ...this.actionsNoticias.edit,
                action: (data) => this.editNoticia(data),
            },
            delete: {
                ...this.actionsNoticias.delete,
                action: (data) => {
                    this.modalEliminarNoticia.show = true;
                    this.modalEliminarNoticia.data = data;
                }
            },
        }

        this.actionsAutores = {
            ...this.actionsAutores,
            edit: {
                ...this.actionsAutores.edit,
                action: (data) => this.editAutor(data),
            },
            delete: {
                ...this.actionsAutores.delete,
                action: (data) => {
                    this.modalEliminarAutor.show = true;
                    this.modalEliminarAutor.data = data;
                }
            },
        }

        this.actionsCategorias = {
            ...this.actionsCategorias,
            edit: {
                ...this.actionsCategorias.edit,
                action: (data) => this.editCategoria(data),
            },
            delete: {
                ...this.actionsCategorias.delete,
                action: (data) => {
                    this.modalEliminarCategoria.show = true;
                    this.modalEliminarCategoria.data = data;
                }
            },
        }

        this.actionsRecursos = {
            ...this.actionsRecursos,
            delete: {
                ...this.actionsRecursos.delete,
                action: (data) => {
                    this.modalEliminarRecurso.show = true;
                    this.modalEliminarRecurso.data = data;
                }
            },
        }
    },
    watch: {
        active(newValue) {
            if (newValue == 'noticias') this.selectAllPromises();
        },
    },
};
</script>

<style scoped>
/* Container Principal */
.noticias-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header */
.noticias-header {
    background: white;
    border-bottom: 1px solid #E5E7EB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 0.75rem 0;
    margin-bottom: 1.25rem;
}

.noticias-header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
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

.noticias-title {
    font-family: Lato, sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

.noticias-subtitle {
    font-family: Lato, sans-serif;
    color: #6B7280;
    font-size: 0.8rem;
    margin: 0.15rem 0 0 0;
}

/* Content */
.noticias-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem 1rem;
}

/* Modern Tabs */
.tabs-modern {
    display: flex;
    gap: 8px;
    margin-bottom: 1.25rem;
    background: white;
    padding: 5px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-button {
    flex: 1;
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 7px;
    font-family: Lato, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
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
    width: 16px;
    height: 16px;
}

/* Filters Section */
.filters-section {
    background: white;
    border-radius: 12px;
    padding: 0.875rem 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.75rem;
    align-items: center;
}

.filters-section.filters-section-with-tipo {
    grid-template-columns: 1fr 1fr 1fr auto;
}

/* Search Input */
.search-input-wrapper {
    position: relative;
    flex: 1;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
}

/* Modern Input (Settings.vue style) */
.modern-input {
    width: 100%;
    padding: 0.625rem 0.75rem 0.625rem 2.75rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    font-size: 0.8125rem;
    color: #1F2937;
    background: white;
    transition: all 0.3s ease;
    height: 42px;
}

.modern-input:focus {
    outline: none;
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

.modern-input::placeholder {
    color: #9CA3AF;
}

/* Select Wrapper */
.select-wrapper {
    position: relative;
}

/* Modern Select (Settings.vue style) */
.modern-select {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    font-size: 0.8125rem;
    color: #1F2937;
    background: white;
    transition: all 0.3s ease;
    cursor: pointer;
    height: 42px;
}

.modern-select:focus {
    outline: none;
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

/* Button Group */
.button-group {
    display: flex;
    gap: 10px;
}

.modern-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 10px;
    font-family: Lato, sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
}

.modern-btn svg {
    width: 15px;
    height: 15px;
}

.btn-search {
    background: linear-gradient(135deg, #8B5CF6 0%, #185CE6 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-search:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.btn-create {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(223, 45, 178, 0.3);
}

.btn-create:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(223, 45, 178, 0.4);
}

/* Table Section */
/* Table Section (Settings.vue style) */
.table-section {
    background: white;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
}

/* Responsive (Settings.vue style) */
@media (max-width: 1024px) {
    .noticias-header-content {
        padding: 0 1.5rem;
    }
}

@media (max-width: 768px) {
    .noticias-header-content {
        padding: 0 1rem;
    }
    .header-title-section {
        gap: 1rem;
    }
    .header-icon {
        width: 24px;
        height: 24px;
    }
    .noticias-title {
        font-size: 1.5rem;
    }
    .noticias-subtitle {
        font-size: 0.85rem;
    }
    .noticias-content {
        padding: 0 1rem 1rem;
    }
    .tabs-modern {
        padding: 0.25rem;
        gap: 0.375rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    .tab-button {
        width: 100%;
        padding: 0.625rem 0.5rem;
        gap: 0.25rem;
    }
    .tab-button svg {
        width: 16px;
        height: 16px;
    }
    .tab-button span {
        font-size: 0.75rem;
    }
    .filters-section,
    .filters-section.filters-section-with-tipo {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
    .button-group {
        width: 100%;
    }
    .modern-btn {
        flex: 1;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .noticias-container {
        padding-bottom: 2rem;
    }
    .noticias-header {
        padding: 1rem 0;
    }
    .noticias-header-content {
        padding: 0 0.875rem;
    }
    .header-title-section {
        gap: 0.625rem;
        align-items: flex-start;
        width: 100%;
    }
    .header-title-section > div {
        flex: 1;
        min-width: 0;
        max-width: calc(100% - 30px);
    }
    .header-icon {
        width: 22px;
        height: 22px;
        margin-top: 0.125rem;
    }
    .noticias-title {
        font-size: 1.05rem;
        line-height: 1.3;
        overflow-wrap: break-word;
        word-wrap: break-word;
        max-width: 100%;
        width: 100%;
    }
    .noticias-subtitle {
        font-size: 0.72rem;
        overflow-wrap: break-word;
        word-wrap: break-word;
        max-width: 100%;
        width: 100%;
        line-height: 1.3;
    }
    .noticias-content {
        padding: 0 0.875rem;
    }
    .tabs-modern {
        padding: 0.25rem;
        gap: 0.375rem;
    }
    .tab-button {
        padding: 0.625rem 0.5rem;
        gap: 0.25rem;
    }
    .tab-button svg {
        width: 16px;
        height: 16px;
    }
    .tab-button span {
        font-size: 0.75rem;
    }
    .table-section,
    .filters-section,
    .button-group {
        padding: 1rem;
        border-radius: 14px;
    }
    .modern-btn {
        flex: 1;
        justify-content: center;
    }
}
</style>