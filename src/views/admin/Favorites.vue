<template>
    <section class="favorites-container">
        <div class="favorites-header">
            <div class="favorites-header-content">
                <div class="header-title-section">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        class="header-icon">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <div>
                        <h1 class="favorites-title">Mis Favoritos</h1>
                        <p class="favorites-subtitle">Gestiona tus documentos y directorios favoritos</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="favorites-content">
            <div class="tabs-modern">
                <button class="tab-button" :class="{ 'tab-active': active === 'documentos' }"
                    @click="updateActive('documentos')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>Documentos</span>
                </button>
                <button class="tab-button" :class="{ 'tab-active': active === 'directorios' }"
                    @click="updateActive('directorios')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                    </svg>
                    <span>Directorios</span>
                </button>
            </div>

            <div class="tab-content">
                <!-- DOCUMENTOS SECTION -->
                <div v-if="active === 'documentos'" class="fade-in">
                    <div class="filters-card">
                        <div class="filters-grid">
                            <div class="form-group form-group-half">
                                <label class="form-label">Buscar documentos</label>
                                <div class="input-wrapper">
                                    <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    <input v-model="filter.SEARCH" class="form-input" type="text"
                                        placeholder="Buscar por nombre, título alternativo..." />
                                </div>
                            </div>

                            <div class="form-group form-group-quarter" v-if="active === 'documentos' || !visibleDirectorios.visible">
                                <label class="form-label">Directorio</label>
                                <div class="input-wrapper">
                                    <el-select v-model="filter.IDDIRECTORIO" :disabled="!visibleDirectorios.visible"
                                        filterable clearable placeholder="Seleccione un directorio"
                                        class="form-input-select" no-data-text="No hay opciones disponibles">
                                        <el-option v-for="item in directorios" :key="item.ID" :value="item.ID"
                                            :label="item.DSCRPCN">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>

                            <div class="form-group form-group-quarter" v-if="active === 'documentos' || !visibleDirectorios.visible">
                                <label class="form-label">Tipo</label>
                                <div class="input-wrapper">
                                    <select v-model="filter.SHARED" class="form-input form-select form-select-no-icon">
                                        <option value="T">Todos</option>
                                        <option value="M">Mis Documentos</option>
                                        <option value="C">Documentos Compartidos</option>
                                    </select>
                                </div>
                            </div>

                            <div class="filters-actions">
                                <button class="btn-search"
                                    @click="active === 'documentos' || !visibleDirectorios.visible ? searchDocuments() : searchDirectorios()">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="documents-table-card">
                        <card-table :search="searchDocuments" :fields="fieldsDocumentos" :items="dataDocuments"
                            :grid="grid" :actions="actionsDocuments" />
                    </div>
                </div>

                <!-- DIRECTORIOS SECTION -->
                <div v-if="active === 'directorios'" class="fade-in">
                    <!-- Filters for directorios search -->
                    <div class="filters-card">
                        <div class="filters-grid">
                            <div class="form-group form-group-full">
                                <label class="form-label">Buscar directorios</label>
                                <div class="input-wrapper">
                                    <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    <input v-model="filter.SEARCH" class="form-input" type="text"
                                        placeholder="Buscar por nombre de directorios..." />
                                </div>
                            </div>

                            <div class="filters-actions">
                                <button class="btn-search" @click="searchDirectorios()">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    Buscar
                                </button>
                                <button class="btn-create" @click="createDirectory">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    Nuevo
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Directory actions when directory is visible -->
                    <div class="directory-actions-bar" v-if="visibleDirectorios.visible">
                        <button class="action-bar-btn" @click="saveNameDirectory">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Cambiar nombre
                        </button>
                        <button class="action-bar-btn action-bar-btn-delete" @click="deleteDirectorys">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                            Eliminar
                        </button>
                    </div>

                    <!-- Directories Grid -->
                    <div v-if="visibleDirectorios.visible" class="directories-grid">
                        <div v-for="(item, index) in directoriosUser" :key="index" class="directory-card"
                            @click="isVisibleTable(item)">
                            <div class="directory-card-header">
                                <div class="directory-icon-lg">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path
                                            d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                                    </svg>
                                </div>
                                <label class="directory-checkbox" @click.stop>
                                    <input type="checkbox" @change="saveSelectedDirectory(item)"
                                        class="checkbox-input" />
                                    <span class="checkbox-custom"></span>
                                </label>
                            </div>
                            <div class="directory-card-body">
                                <h4 class="directory-name">{{ item.label }}</h4>
                                <div class="directory-stats">
                                    <div class="stat-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                        <span>{{ item.children.length }} {{ item.children.length == 1 ? 'documento' :
                                            'documentos' }}</span>
                                    </div>
                                    <div class="stat-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <span>{{ item.fcrcn }}</span>
                                    </div>
                                </div>
                                <div class="directory-creator">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <span>{{ item.ucrcn }}</span>
                                </div>
                                <div class="directory-actions">
                                    <button class="directory-action-btn directory-action-download"
                                        @click.stop="downloadDirectory(item)" title="Descargar directorio">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        <span>Descargar</span>
                                    </button>
                                    <button class="directory-action-btn directory-action-shared"
                                        @click.stop="viewDirectorySharedUsers(item)" title="Ver usuarios compartidos">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M23 21v-2a4 4 0 00-3-3.87" />
                                            <path d="M16 3.13a4 4 0 010 7.75" />
                                        </svg>
                                        <span>Usuarios</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Back button and table view for selected directory -->
                    <div v-else class="directory-detail-view">
                        <button class="btn-back" @click="visibleDirectorios.visible = true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Regresar
                        </button>
                        <div class="documents-table-card">
                            <card-table :search="searchDocuments" :fields="fieldsDocumentos" :items="dataDocuments"
                                :grid="grid" :actions="actionsDocuments" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LoadingOverlay :active="isLoading" :is-full-page="false" :loader="'bars'" />

        <ModalMostrarResolucion :openModal="openModal" :toggleModal="() => this.openModal = !this.openModal"
            :pdfUrl="pdfUrl" :data="rowData" :isFav="false" :role="role" />

        <ModalCompartirEntrada :openModal="openModalCompartir"
            :toggleModal="() => this.openModalCompartir = !this.openModalCompartir" :data="rowDataCompartir" />

        <ModalUsuariosCompartidos :openModal="openModalUsuariosCompartidos"
            :toggleModal="() => this.openModalUsuariosCompartidos = !this.openModalUsuariosCompartidos"
            :data="rowDataUsuariosCompartidos" />

        <ModalDirectorioCompartido :openModal="openModalDirectorioCompartido"
            :toggleModal="() => this.openModalDirectorioCompartido = !this.openModalDirectorioCompartido"
            :data="rowDataDirectorioCompartido" />
    </section>

</template>

<script>
import { toast } from 'vue3-toastify';
import UserProxy from '../../proxies/UserProxy';
import AdminEntriesProxy from '../../proxies/AdminEntriesProxy';
import CardTable from "@/components/Cards/CardTable.vue";
import ModalMostrarResolucion from './Modales/ModalMostrarResolucion.vue';
import ModalCompartirEntrada from './Modales/ModalCompartirEntrada.vue';
import ModalUsuariosCompartidos from './Modales/ModalUsuariosCompartidos.vue';
import ModalDirectorioCompartido from './Modales/ModalDirectorioCompartido.vue';

export default {
    components: {
        CardTable,
        ModalMostrarResolucion,
        ModalCompartirEntrada,
        ModalUsuariosCompartidos,
        ModalDirectorioCompartido
    },
    props: {
        role: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            // directorios
            visibleDirectorios: {
                visible: true,
            },
            isLoading: false,
            active: 'documentos',

            filter: {
                TYPE: "jurisprudences",
                IDDIRECTORIO: null,
                SEARCH: '',
                SHARED: 'T',
                CDESTDO: 'T',
            },
            grid: {
                items: [],
                currentPage: 1,
                perPage: 10,
                totalRows: 120,
                isLoading: true,
                pageOptions: [5, 10, 15, 50],
            },
            pdfUrl: '',
            openModal: false,
            rowData: {},

            openModalCompartir: false,
            rowDataCompartir: {},

            openModalUsuariosCompartidos: false,
            rowDataUsuariosCompartidos: {},

            openModalDirectorioCompartido: false,
            rowDataDirectorioCompartido: {},

            selectedDirectorios: [],
            directorios: [],
            directoriosUser: [],
            dataDocuments: [],
            fieldsDocumentos: [
                // {
                //     key: "CHECK", label: 'CHECK',
                //     class: "text-center",
                // },
                {
                    key: "TITLEALT", label: 'Archivos',
                    formatter: (value, key, item) => {
                        return `
                        <div class="d-flex flex-column">
                            <p class="mb-0">
                                <small>${this.formatearNulidad(item.TITLEALT, 'Ingrese un titulo alternativo')}</small>
                            </p>
                            <p class="mb-0" style="color:#1864FF;">
                                <strong>${item.TITULO}</strong>
                            </p>
                        </div>
                        `
                    }
                },
                {
                    key: "AUTOR", label: 'Propietario',
                    formatter: (value, key, item) => {
                        return `
                        <div style="display: flex; align-items: center; gap: 5px">
                            <img src="${item.RTAFTO || 'https://placehold.co/50x50'}" alt="user" style="width: 50px; height: 50px; border-radius: 50%;cursor: pointer;" />
                            <p class="mb-0">
                                <small>${item?.PROP == 1 ? 'Yo' : this.formatearNulidad(item.AUTOR, 'Sin autor')}</small>
                            </p>
                        </div>
                        `
                    }
                },
                {
                    key: "FEDCN", label: 'Ult. Modificación',
                },
                {
                    key: "DDIRECTORIO", label: 'Directorio',
                    formatter: (value, key, item) => {
                        return `
                        <div style="background-color: #E7E7E6; border-radius: 5px; padding: 6px;">
                            <p class="mb-0" style="color:#262626;text-align: center;">
                              ${this.formatearNulidad(item.DDIRECTORIO, 'Sin directorio')}
                            </p>
                        </div>
                        `
                    }
                },
                { key: "ACCIONES", label: "Acciones", class: "text-center" },

            ],
            actionsDocuments: {
                checkeoud: {
                    label: "",
                    icon: "fas fa-check",
                    class: "btn-check",
                    action: null,
                    actionFull: null
                },
                view: {
                    label: "Ver",
                    icon: "fas fa-eye",
                    class: "btn-view",
                    action: null
                },
                shared: {
                    label: "Compartir",
                    icon: "fas fa-share-alt",
                    class: "btn-shared",
                    action: null,
                },
                users: {
                    label: "Usuarios",
                    icon: "fas fa-users",
                    class: "btn-users",
                    action: null,
                },
                delete: {
                    label: "Eliminar",
                    icon: "fas fa-trash",
                    class: "btn-delete",
                    action: null,
                },
                updateShared: {
                    label: "Actualizar",
                    icon: "fas fa-sync-alt",
                    class: "btn-update",
                    action: null,
                }
            },

        }
    },
    methods: {
        formatearNulidad(valor, defect = '-') {
            if ([undefined, null, 'null', 'undefined'].includes(valor)) {
                return defect;
            }

            return valor;
        },
        updateActive(tab) {
            this.active = tab;
        },
        formatearFecha(fecha) {
            if (!fecha) return '';
            const date = new Date(fecha);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        openModalWithData(item) {
            this.rowData = item;
            this.openModal = true;
        },
        setPalabras(palabra, cantidad = 15, isBandera = true) {
            if (!palabra) return "";
            return palabra.split(" ").slice(0, cantidad).join(" ") + (isBandera ? "..." : "") || "";
        },
        // DOCUMENTOS ...
        async searchDocuments() {
            this.grid.isLoading = true;
            await AdminEntriesProxy.searchFavorites({
                GLOBAL: this.filter.SEARCH,
                TYPE: this.filter.TYPE,
                ROWS: this.grid.perPage,
                INIT: this.grid.perPage * (this.grid.currentPage - 1),
                IDDIRECTORIO: this.filter.IDDIRECTORIO,
                SHARED: this.filter.SHARED,
            })
                .then((response) => {
                    this.dataDocuments = response.map((item) => {
                        return {
                            ...item,
                            checked: false,
                            DELITO: JSON.parse(item.DELITO),
                            OJURISDICCIONAL: JSON.parse(item.OJURISDICCIONAL),
                            OEMISOR: JSON.parse(item.OEMISOR),
                            TPONRMA: JSON.parse(item.TPONRMA),
                            RECURSO: JSON.parse(item.RECURSO),
                            AMBIT: JSON.parse(item.AMBIT),
                            JURISDICCION: JSON.parse(item.JURISDICCION),
                            MAGISTRATES: JSON.parse(item.MAGISTRATES),
                            FRESOLUTION: item.FRESOLUTION ? item.FRESOLUTION.split("T")[0] : null,
                            TEMA: ![null, undefined, ""].includes(item?.TEMA) ? item.TEMA : null,
                            SUBTEMA: ![null, undefined, ""].includes(item?.SUBTEMA) ? item.SUBTEMA : null,
                            SHORTSUMMARY: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? item.SHORTSUMMARY : null,
                            SHORTSUMMARY2: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? this.setPalabras(item.SHORTSUMMARY.replace(/<[^>]*>?/gm, ''), 18) : null,
                            SHORTSUMMARY3: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? this.setPalabras(item.SHORTSUMMARY.replace(/<[^>]*>?/gm, ''), 10000, false) : null,
                        }
                    });
                    this.grid.totalRows = response[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    toast.error(error?.MESSAGE || 'Error al cargar los documentos', { toastId: 'error-documentos' });
                })
                .finally(() => this.grid.isLoading = false);
        },

        // DIRECTORIOS ... 
        async searchDirectorios() {
            this.isLoading = true;
            await UserProxy.listDirectory({
                TYPE: this.filter.TYPE,
                DSCRPCN: this.filter.SEARCH,
            })
                .then((response) => {
                    this.directoriosUser = response?.map((item) => {
                        let childrens = JSON.parse(item.ENTRADAS) || [];
                        return {
                            key: item.id,
                            fcrcn: this.formatearFecha(item.FCRCN),
                            label: item.DSCRPCN,
                            icon: 'fa fa-folder',
                            isDirectory: true,
                            ucrcn: item.UCRCN,
                            directorio: item.ID,
                            shared: item.SHARED,
                            COMPARTIDS: item.COMPARTIDS,
                            children: childrens.map((entrie) => {
                                return {
                                    key: entrie.ID,
                                    id: entrie.ID,
                                    directorio: item.ID,
                                    isDirectory: false,
                                    label: entrie.TITULO,
                                    icon: 'fa fa-file',
                                    FCRCN: entrie.FCRCN,
                                    FLGDOC: entrie.FLGDOC,
                                    ENTRIEFILE: entrie.ENTRIEFILE,
                                }
                            })
                        };
                    });

                })
                .catch((error) => {
                    toast.error(error?.MESSAGE || 'Error al cargar los directorios', { toastId: 'error-directorios' });
                    this.directoriosUser = [];
                })
                .finally(() => this.isLoading = false);
        },
        async getDirectorios() {
            await UserProxy.listDirectoryAll()
                .then((response) => {
                    if (response.length > 0) {
                        response.unshift({
                            ID: null,
                            DSCRPCN: "-- Seleccione",
                        });
                    }
                    this.directorios = (typeof response === 'string') ? [] : response
                })
                .catch(() => {
                    this.directorios = [];
                    toast.error("Error al obtener los directorios");
                })
                .finally(() => this.isLoading = false);
        },

        // * ACTIONS ... 
        saveSelectedDirectory(item) {
            if (this.selectedDirectorios.some((i) => i.directorio === item.directorio)) {
                this.selectedDirectorios = this.selectedDirectorios.filter((i) => i.directorio !== item.directorio);
            } else {
                this.selectedDirectorios.push(item);
            }
        },
        async createDirectory() {
            this.$swal({
                title: '<span style="color:#185CE6;font-weight:700;">Crear nuevo directorio</span>',
                html: `<div style='font-size:1.1em;'>¿Deseas crear un nuevo directorio?<br><span style='color:#6B7280;'>Ingresa el nombre a continuación.</span></div>`,
                input: "text",
                inputPlaceholder: "Nombre del directorio",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#38a169",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancelar",
                confirmButtonText: "Crear directorio",
                inputValidator: (value) => {
                    if (!value) {
                        return "Debes ingresar un nombre";
                    }
                },
                customClass: {
                    confirmButton: 'swal2-confirm btn btn-success',
                    cancelButton: 'swal2-cancel btn btn-danger'
                }
            }).then(async (result) => {
                if (result.isConfirmed && result.value) {
                    this.isLoading = true;
                    await UserProxy.createDirectory({
                        DSCRPCN: result.value,
                        CDESTDO: 'A'
                    })
                        .then((response) => {
                            if (response.STATUS) {
                                toast.success("Directorio creado con éxito");
                                this.searchDirectorios();
                                this.getDirectorios();
                            } else {
                                toast.error(response.MESSAGE);
                            }
                        })
                        .catch((err) => toast.error(err?.MESSAGE || 'Error al crear el directorio'))
                        .finally(() => this.isLoading = false);
                }
            }).catch((err) => toast.error(err?.MESSAGE || 'Error al crear el directorio'));
        },
        async saveNameDirectory() {
            if (this.selectedDirectorios.length === 0) {
                toast.warning("Debes seleccionar un directorio");
                return;
            }

            if (this.selectedDirectorios.length > 1) {
                toast.warning("Solo puedes cambiar el nombre de un directorio a la vez");
                return;
            }

            this.$swal({
                title: '<span style="color:#185CE6;font-weight:700;">Renombrar directorio</span>',
                html: `<div style='font-size:1.1em;'>¿Quieres cambiar el nombre del directorio <strong style='color:#185CE6;'>${this.selectedDirectorios[0].label}</strong>?<br><span style='color:#6B7280;'>Ingresa el nuevo nombre a continuación.</span></div>`,
                input: "text",
                inputPlaceholder: "Nuevo nombre del directorio",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#185CE6",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancelar",
                confirmButtonText: "Renombrar",
                inputValidator: (value) => {
                    if (!value) {
                        return "Debes ingresar un nuevo nombre";
                    }
                },
                customClass: {
                    confirmButton: 'swal2-confirm btn btn-primary',
                    cancelButton: 'swal2-cancel btn btn-danger'
                }
            }).then(async (result) => {
                if (result.isConfirmed && result.value) {
                    this.isLoading = true;

                    await UserProxy.updateDirectory({
                        ID: this.selectedDirectorios[0].directorio,
                        DSCRPCN: result.value,
                    })
                        .then((response) => {
                            if (response.STATUS) {
                                toast.success("Nombre cambiado con éxito");
                                this.searchDirectorios();
                            } else {
                                toast.error(response.MESSAGE);
                            }
                        })
                        .catch((err) => toast.error(err?.MESSAGE || 'Error al cambiar el nombre'))
                        .finally(() => this.isLoading = false);
                }
            }).catch((err) => toast.error(err?.MESSAGE || 'Error al cambiar el nombre'));

        },
        async deleteDirectorys() {
            if (this.selectedDirectorios.length === 0) {
                toast.warning("Debes seleccionar un directorio");
                return;
            }

            this.$swal({
                title: '<span style="color:#e53e3e;font-weight:700;">Eliminar directorios</span>',
                html: `<div style='font-size:1.1em;'>¿Seguro que deseas eliminar <strong>${this.selectedDirectorios.length}</strong> directorios?<br><span style='color:#e53e3e;font-size:12px;'>Esta acción eliminará todos los documentos dentro de cada carpeta.</span></div>
                <ul style="list-style: none; padding-left: 0; margin-top:10px;">
                    ${this.selectedDirectorios.map((item) => `<li style="padding: 5px 0; font-size: 14px; color: #000000;"><i class='fa fa-folder'></i> <strong>${item.label}</strong></li>`).join('')}
                </ul>`,
                icon: "error",
                showCancelButton: true,
                confirmButtonColor: "#e53e3e",
                cancelButtonColor: "#6B7280",
                cancelButtonText: "Cancelar",
                confirmButtonText: "Eliminar todo",
                customClass: {
                    confirmButton: 'swal2-confirm btn btn-danger',
                    cancelButton: 'swal2-cancel btn btn-secondary'
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.isLoading = true;
                    let DIRECTORIOS_STRING = this.selectedDirectorios
                        .map((item) => item.directorio)
                        .filter((val) => /^[0-9]+$/.test(val))
                        .join(',');

                    await UserProxy.deleteDirectory(
                        DIRECTORIOS_STRING,
                    )
                        .then((response) => {
                            if (response.STATUS) {
                                toast.success("Directorios eliminados con éxito");
                                this.searchDirectorios();
                                this.selectedDirectorios = [];
                            } else {
                                toast.error(response.MESSAGE);
                            }
                        })
                        .catch((err) => toast.error(err?.MESSAGE || 'Error al eliminar los directorios'))
                        .finally(() => this.isLoading = false);
                }
            }).catch((err) => toast.error(err?.MESSAGE || 'Error al eliminar los directorios'));
        },
        async updateSharedActions(item) {
            if (item.IDENTRIE === null || item.IDENTRIE === null) {
                toast.warning("No se puede actualizar el documento");
                return;
            }

            if (this.directorios.length === 0) {
                toast.warning("No hay directorios disponibles");
                return;
            }

            if (item.ID === null || item.ID === null) {
                toast.warning("No se puede actualizar el documento");
                return;
            }

            // Variable temporal para almacenar el valor seleccionado
            let selectedDirectorio = item.IDDIRECTORIO || null;
            // Guardar referencia a directorios antes de entrar al modal
            const directoriosRef = this.directorios;
            
            this.$swal.fire({
                title: '<span style="color:#185CE6;font-weight:700;font-size: 25px;">Actualizar datos del documento</span>',
                html: `
                    <div class="row" style="text-align: left;">
                        <div class="col-md-12 mb-3">
                            <label class="mb-1" style="text-align: left; font-size: 14px; color: #185CE6; font-weight:600;">Directorio</label>
                            <div id="directorio-select-container" style="position: relative;"></div>
                        </div>
                        <div class="col-md-12 mb-3">
                            <label class="mb-1" style="text-align: left; font-size: 14px; color: #185CE6; font-weight:600;" for="swal-input-name">Título alternativo</label>
                            <input value="${item.TITLEALT || ''}" id="swal-input-name" class="m-0 swal2-input" placeholder="Ingrese un nombre" style="border: 1px solid #ccc; border-radius: 5px; padding: 10px; width: 100%;" />
                        </div>
                    </div>
                `,
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#185CE6",
                cancelButtonColor: "#6B7280",
                cancelButtonText: "Cancelar",
                confirmButtonText: "Guardar cambios",
                customClass: {
                    popup: 'crear-directorio-swal',
                    confirmButton: 'swal2-confirm btn btn-primary',
                    cancelButton: 'swal2-cancel btn btn-secondary'
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                showLoaderOnConfirm: true,
                didOpen: () => {
                    const container = document.getElementById('directorio-select-container');
                    const selectId = 'swal-directorio-input';
                    const dropdownId = 'swal-directorio-dropdown';
                    
                    // Filtrar "-- Seleccione" del dropdown
                    const directoriosFiltered = directoriosRef.filter(d => d.ID !== null);
                    
                    const currentDir = directoriosFiltered.find(d => d.ID == selectedDirectorio);
                    const displayValue = (selectedDirectorio && currentDir) ? currentDir.DSCRPCN : '';
                    
                    container.innerHTML = `
                        <div style="position: relative;">
                            <input 
                                type="text"
                                id="${selectId}"
                                value="${displayValue}"
                                placeholder="Seleccione o busque un directorio..."
                                autocomplete="off"
                                style="
                                    border: 1px solid #D1D5DB;
                                    border-radius: 8px;
                                    padding: 12px 16px;
                                    width: 100%;
                                    margin: 0;
                                    font-size: 14px;
                                    color: #1F2937;
                                    background: white;
                                    transition: all 0.2s;
                                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                                "
                                onfocus="this.style.borderColor='#185CE6'; this.style.boxShadow='0 0 0 3px rgba(24,92,230,0.1)';"
                                onblur="this.style.borderColor='#D1D5DB'; this.style.boxShadow='0 1px 2px rgba(0,0,0,0.05)';"
                            />
                            <div 
                                id="${dropdownId}"
                                style="
                                    position: absolute;
                                    top: 100%;
                                    left: 0;
                                    right: 0;
                                    max-height: 280px;
                                    overflow-y: auto;
                                    background: white;
                                    border: 1px solid #E5E7EB;
                                    border-radius: 8px;
                                    margin-top: 8px;
                                    z-index: 99999;
                                    display: none;
                                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                                    scrollbar-width: thin;
                                    scrollbar-color: #D1D5DB transparent;
                                "
                            ></div>
                            <style>
                                #${dropdownId}::-webkit-scrollbar {
                                    width: 6px;
                                }
                                #${dropdownId}::-webkit-scrollbar-track {
                                    background: transparent;
                                }
                                #${dropdownId}::-webkit-scrollbar-thumb {
                                    background-color: #D1D5DB;
                                    border-radius: 3px;
                                }
                                #${dropdownId}::-webkit-scrollbar-thumb:hover {
                                    background-color: #9CA3AF;
                                }
                            </style>
                        </div>
                    `;
                    
                    const input = document.getElementById(selectId);
                    const dropdown = document.getElementById(dropdownId);
                    
                    const renderOptions = (filter = '') => {
                        // Filtrar directorios excluyendo "-- Seleccione" y aplicando el filtro de búsqueda
                        const filtered = directoriosFiltered.filter(d => {
                            if (!d.DSCRPCN) return false;
                            return d.DSCRPCN.toLowerCase().includes(filter.toLowerCase());
                        });
                        
                        if (filtered.length === 0) {
                            dropdown.innerHTML = `
                                <div style="
                                    padding: 20px;
                                    color: #9CA3AF;
                                    text-align: center;
                                    font-size: 14px;
                                ">
                                    <i class="fa fa-search" style="margin-right: 8px;"></i>
                                    No se encontraron directorios
                                </div>`;
                            return;
                        }
                        
                        dropdown.innerHTML = filtered.map(d => {
                            const isSelected = (d.ID == selectedDirectorio);
                            return `
                            <div 
                                class="dropdown-option"
                                data-id="${d.ID}"
                                data-name="${d.DSCRPCN || ''}"
                                style="
                                    padding: 12px 16px;
                                    cursor: pointer;
                                    border-bottom: 1px solid #F3F4F6;
                                    transition: all 0.15s ease;
                                    font-size: 14px;
                                    color: #1F2937;
                                    display: flex;
                                    align-items: center;
                                    ${isSelected ? 'background: #EFF6FF; color: #185CE6; font-weight: 600; border-left: 3px solid #185CE6;' : 'border-left: 3px solid transparent;'}
                                "
                            >
                                <i class="fa fa-folder" style="margin-right: 10px; color: ${isSelected ? '#185CE6' : '#9CA3AF'};"></i>
                                ${d.DSCRPCN}
                            </div>
                        `}).join('');
                        
                        // Agregar listeners a las opciones
                        dropdown.querySelectorAll('.dropdown-option').forEach(option => {
                            option.addEventListener('mouseover', function() {
                                const dataId = this.getAttribute('data-id');
                                const isThisSelected = parseInt(dataId) == selectedDirectorio;
                                if (!isThisSelected) {
                                    this.style.background = '#F9FAFB';
                                }
                            });
                            option.addEventListener('mouseout', function() {
                                const dataId = this.getAttribute('data-id');
                                const isThisSelected = parseInt(dataId) == selectedDirectorio;
                                this.style.background = isThisSelected ? '#EFF6FF' : 'white';
                            });
                            option.addEventListener('click', (e) => {
                                const clickedElement = e.target.closest('.dropdown-option');
                                const id = clickedElement.getAttribute('data-id');
                                const name = clickedElement.getAttribute('data-name');
                                
                                const parsedId = parseInt(id);
                                selectedDirectorio = isNaN(parsedId) ? null : parsedId;
                                
                                input.value = name;
                                dropdown.style.display = 'none';
                                
                                // Actualizar estilos de todas las opciones
                                renderOptions(input.value);
                            });
                        });
                    };
                    
                    input.addEventListener('focus', () => {
                        renderOptions(input.value);
                        dropdown.style.display = 'block';
                    });
                    
                    input.addEventListener('input', (e) => {
                        renderOptions(e.target.value);
                        dropdown.style.display = 'block';
                    });
                    
                    // Cerrar dropdown al hacer click fuera
                    const closeHandler = (e) => {
                        if (!container.contains(e.target)) {
                            dropdown.style.display = 'none';
                        }
                    };
                    document.addEventListener('click', closeHandler);
                    
                    // Renderizar opciones iniciales
                    renderOptions();
                },
                preConfirm: async () => {
                    let name = document.getElementById('swal-input-name').value.trim();
                    let directorio = selectedDirectorio;

                    if (['null', 'undefined', undefined, null].includes(directorio)) {
                        directorio = 0;
                    }

                    if ([null, undefined, ''].includes(name)) {
                        name = "";
                    }

                    await UserProxy.saveAddDirectory({
                        IDDIRECTORIO: directorio,
                        IDENTRIE: item.IDENTRIE,
                        TITLEALT: name,
                        IDFAV: item.ID,
                    })
                        .then((response) => {
                            if (response.STATUS) {
                                toast.success("Datos actualizados con éxito");
                                this.searchDocuments();
                                return true;
                            } else {
                                toast.error(response.MESSAGE);
                            }
                        })
                        .catch((err) => {
                            toast.error(err?.MESSAGE || 'Error al actualizar los datos')
                            return false;
                        })
                        .finally(() => this.isLoading = false);
                }
            })
        },
        isVisibleTable(item) {
            this.filter.IDDIRECTORIO = item.directorio;
            this.filter.SEARCH = '';
            this.filter.SHARED = 'T';
            this.visibleDirectorios.visible = false;
        },
        async downloadDirectory(item) {
            if (!item.children || item.children.length === 0) {
                toast.warning('Este directorio no tiene documentos para descargar');
                return;
            }

            this.$swal({
                title: "Descargar directorio",
                html: `¿Está seguro de que desea descargar todos los documentos del directorio <strong>${item.label}</strong>?<br><small>Se descargarán ${item.children.length} ${item.children.length === 1 ? 'documento' : 'documentos'}</small>`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancelar",
                confirmButtonText: "Sí, descargar",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.isLoading = true;
                    try {
                        toast.info(`Iniciando descarga de ${item.children.length} documentos...`);
                        
                        const paths = JSON.stringify(item.children.map(doc => ({
                            FLGDOC: doc.FLGDOC,
                            ENTRIEFILE: doc.ENTRIEFILE,
                            TITLE: doc.label,
                            ID: doc.id,
                            FCRCN: doc.FCRCN,
                        })));

                        const blob = await AdminEntriesProxy.getDocumentZipAll({ paths });
                        
                        // Verificar que el blob tiene contenido
                        if (!blob || blob.size === 0) {
                            throw new Error('El archivo descargado está vacío');
                        }
                        
                        const url = window.URL.createObjectURL(new Blob([blob]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${item.label.replace(/[^a-z0-9]/gi, '_')}_${new Date().getTime()}.zip`);
                        document.body.appendChild(link);
                        link.click();
                        
                        // Limpiar después de un pequeño delay
                        setTimeout(() => {
                            link.remove();
                            window.URL.revokeObjectURL(url);
                        }, 100);
                        
                        toast.success('Descarga completada con éxito');
                    } catch (error) {
                        toast.error(error?.MESSAGE || 'Error al descargar el directorio');
                    } finally {
                        this.isLoading = false;
                    }
                }
            });
        },
        viewDirectorySharedUsers(item) {
            this.rowDataDirectorioCompartido = item;
            this.openModalDirectorioCompartido = true;
        },
        async viewDirectoryShared(item) {
            this.isLoading = true;
            try {
                // Verificar si el directorio está compartido
                if (item.shared === 0 || !item.shared) {
                    toast.info('Este directorio no está compartido con otros usuarios');
                    this.isLoading = false;
                    return;
                }

                // Aquí puedes hacer una llamada al backend para obtener los usuarios con los que está compartido
                await UserProxy.getDirectorySharedUsers(item.directorio)
                    .then((response) => {
                        if (response && response.length > 0) {
                            const usersList = response.map(user =>
                                `<li style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <img src="${user.RTAFTO || 'https://placehold.co/40x40'}" 
                                             style="width: 40px; height: 40px; border-radius: 50%;" />
                                        <div>
                                            <strong>${user.NOMBRE}</strong><br>
                                            <small style="color: #718096;">${user.EMAIL}</small>
                                        </div>
                                    </div>
                                </li>`
                            ).join('');

                            this.$swal({
                                title: "Usuarios con acceso",
                                html: `
                                    <div style="text-align: left;">
                                        <p style="margin-bottom: 15px;">El directorio <strong>${item.label}</strong> está compartido con:</p>
                                        <ul style="list-style: none; padding: 0; max-height: 400px; overflow-y: auto;">
                                            ${usersList}
                                        </ul>
                                    </div>
                                `,
                                icon: "info",
                                confirmButtonText: "Cerrar",
                                width: '600px'
                            });
                        } else {
                            toast.info('Este directorio no está compartido con otros usuarios');
                        }
                    })
                    .catch((error) => {
                        toast.error(error?.MESSAGE || 'Error al obtener los usuarios compartidos');
                    });
            } catch (error) {
                toast.error(error?.MESSAGE || 'Error al consultar usuarios compartidos');
            } finally {
                this.isLoading = false;
            }
        },
    },
    // escucha de active
    watch: {
        active(newValue) {
            this.filter.SEARCH = '';
            this.filter.IDDIRECTORIO = null;
            this.filter.SHARED = 'T';
            if (newValue === 'documentos') {
                this.searchDocuments();
                this.getDirectorios();
            } else if (newValue === 'directorios') {
                this.visibleDirectorios.visible = true;
                this.searchDirectorios();
            }
        },
    },
    mounted() {
        this.searchDocuments();
        this.getDirectorios();

        this.actionsDocuments = {
            ...this.actionsDocuments,
            execute: {
                action: (item) => {
                    this.openModalWithData(item);
                }
            },
            view: {
                ...this.actionsDocuments.view,
                action: (item) => {
                    this.openModalWithData(item);
                }
            },
            delete: {
                ...this.actionsDocuments.delete,
                action: (item) => {
                    this.$swal({
                        title: '<span style="color:#e53e3e;font-weight:700;">Eliminar documento</span>',
                        html: `<div style='font-size:1.1em;'>¿Seguro que deseas eliminar el documento <strong style='color:#e53e3e;'>${item.TITULO}</strong>?<br>${item.CANT > 0 ? `<span style='color:#e53e3e;font-size:12px;'>Este documento está compartido con ${item.CANT} usuario(s). Si lo eliminas, se eliminará para todos.</span>` : ''}</div>`,
                        icon: "error",
                        showCancelButton: true,
                        confirmButtonColor: "#e53e3e",
                        cancelButtonColor: "#6B7280",
                        cancelButtonText: "Cancelar",
                        confirmButtonText: "Eliminar",
                        customClass: {
                            confirmButton: 'swal2-confirm btn btn-danger',
                            cancelButton: 'swal2-cancel btn btn-secondary'
                        }
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            this.isLoading = true;
                            await UserProxy.deleteFavorite(item.ID)
                                .then((response) => {
                                    if (response.STATUS) {
                                        toast.success("Entrada eliminada de favoritos con éxito");
                                        this.searchDocuments();
                                    } else {
                                        toast.error(response.MESSAGE);
                                    }
                                })
                                .catch((err) => {
                                    toast.error(err?.MESSAGE || 'Error al eliminar la entrada de favoritos')
                                })
                                .finally(() => this.isLoading = false);
                        }
                    }).catch((err) => toast.error(err?.MESSAGE || 'Error al eliminar la entrada de favoritos'));
                }
            },
            checkeoud: {
                ...this.actionsDocuments.checkeoud,
                action: (check, item) => {
                    this.dataDocuments = this.dataDocuments.map((doc) => {
                        if (doc.ID === item.ID) {
                            return {
                                ...doc,
                                checked: check
                            }
                        }
                        return doc;
                    });
                },
                actionFull: (check) => {
                    this.dataDocuments = this.dataDocuments.map((item) => {
                        return {
                            ...item,
                            checked: check
                        }
                    });
                }
            },
            shared: {
                ...this.actionsDocuments.shared,
                action: (item) => {
                    this.rowDataCompartir = item;
                    this.openModalCompartir = true;
                }
            },
            users: {
                ...this.actionsDocuments.users,
                action: (item) => {
                    this.rowDataUsuariosCompartidos = item;
                    this.openModalUsuariosCompartidos = true;
                }
            },
            updateShared: {
                ...this.actionsDocuments.updateShared,
                action: (item) => {
                    this.updateSharedActions(item);
                }
            }
        }
    },

}
</script>

<style scoped>
/* ===== FAVORITES MODERN UI ===== */
.favorites-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 0rem;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.favorites-header {
    background: white;
    border-bottom: 1px solid #E5E7EB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 0.5rem 0;
    margin-bottom: 1rem;
}

.favorites-header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.5rem 2rem 0 2rem;
}

.header-title-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}

.header-title-section > div {
    flex: 1;
    min-width: 0;
    max-width: 100%;
}

.header-icon,
.favorites-icon {
    flex-shrink: 0;
    color: #185CE6;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

.favorites-title {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    max-width: 100%;
    width: 100%;
}

.favorites-subtitle {
    color: #6B7280;
    font-size: 0.8rem;
    margin: 0.25rem 0 0 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
    max-width: 100%;
    width: 100%;
}

.favorites-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 0 1.5rem 0;
}

.tabs-modern {
    display: flex;
    gap: 8px;
    margin-bottom: 1rem;
    padding: 8px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    background: transparent;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-button svg {
    width: 18px;
    height: 18px;
}

.tab-button:hover {
    background: rgba(24, 92, 230, 0.05);
    color: #185CE6;
}

.tab-button:hover svg {
    transform: none;
}

.tab-button.active,
.tab-button.tab-active {
    background: rgba(24, 92, 230, 0.05);
    color: #185CE6 !important;
}

.tab-button.active:hover,
.tab-button.tab-active:hover {
    background: rgba(24, 92, 230, 0.08);
    color: #185CE6;
}

.tab-content {
    min-height: 400px;
}

.fade-in {
    animation: fadeIn 0.4s ease-in;
}

.filters-card {
    background: white;
    border-radius: 16px;
    padding: 1.25rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
}

.filters-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #F3F4F6;
}

.filters-header svg {
    color: #185CE6;
    flex-shrink: 0;
}

.filters-header h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
    align-items: end;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group-full {
    grid-column: 1 / -1;
}

.form-group-half {
    grid-column: span 6;
}

.form-group-quarter {
    grid-column: span 3;
}

.form-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 0.875rem;
    color: #9CA3AF;
    pointer-events: none;
    z-index: 10;
    flex-shrink: 0;
}

.form-input {
    width: 100%;
    padding: 0.65rem 0.875rem 0.65rem 2.5rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    font-size: 0.9rem;
    color: #1F2937;
    background: white;
    transition: all 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
    position: relative;
    z-index: 1;
}

.form-input::placeholder {
    color: #9CA3AF;
}

.form-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 3rem;
    cursor: pointer;
    background-color: transparent;
}

.form-input:disabled {
    background-color: #F9FAFB;
    color: #9CA3AF;
    cursor: not-allowed;
}

.form-select-no-icon {
    padding-left: 1rem !important;
}

/* El-Select Custom Styles */
.form-input-select {
    width: 100%;
}

:deep(.form-input-select .el-select__wrapper) {
    padding: 0.65rem 0.875rem 0.65rem 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    font-size: 0.9rem;
    color: #1F2937;
    background: white;
    transition: all 0.3s ease;
    box-shadow: none;
}

:deep(.form-input-select .el-select__wrapper:hover) {
    border-color: #185CE6;
}

:deep(.form-input-select.is-focused .el-select__wrapper) {
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

:deep(.form-input-select .el-select__placeholder) {
    color: #9CA3AF;
    font-size: 0.9rem;
}

:deep(.form-input-select .el-select__input) {
    color: #1F2937;
    font-size: 0.9rem;
}

:deep(.form-input-select.is-disabled .el-select__wrapper) {
    background-color: #F9FAFB;
    color: #9CA3AF;
    cursor: not-allowed;
}

:deep(.el-select-dropdown__item) {
    font-size: 0.9rem;
    padding: 0.65rem 1rem;
}

:deep(.el-select-dropdown__item:hover) {
    background-color: #F3F4F6;
}

:deep(.el-select-dropdown__item.is-selected) {
    color: #185CE6;
    font-weight: 600;
}

.filters-actions {
    display: flex;
    gap: 1rem;
    grid-column: 1 / -1;
}

.btn-search,
.btn-create {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-search {
    background: linear-gradient(135deg, #8B5CF6 0%, #185CE6 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(24, 92, 230, 0.3);
}

.btn-search:hover {
    box-shadow: 0 6px 20px rgba(24, 92, 230, 0.4);
}

.btn-create {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.btn-create:hover {
    box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
}

.documents-table-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.directory-actions-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 0.875rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-bar-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-weight: 600;
    color: #2d3748;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-bar-btn:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
}

.action-bar-btn-delete {
    color: #e53e3e;
}

.directories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.directory-card {
    background: white;
    border-radius: 14px;
    padding: 1.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
}

.directory-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    /* // un azul bebe */
    border-color: rgba(24, 92, 230, 0.05);
}

.directory-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.directory-icon-lg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #E71FB3 0%, #FF6B9D 100%);
    border-radius: 12px;
}

.directory-icon-lg svg {
    color: white;
}

/* Custom Checkbox Styles */
.directory-checkbox {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
}

.checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.checkbox-custom {
    position: relative;
    width: 22px;
    height: 22px;
    border: 2.5px solid #CBD5E0;
    border-radius: 6px;
    background: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.checkbox-custom::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 11px;
    border: solid white;
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg) scale(0);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    top: 2px;
}

.checkbox-input:checked + .checkbox-custom {
    background: linear-gradient(135deg, #185CE6 0%, #4F7BF7 100%);
    border-color: #185CE6;
    box-shadow: 0 2px 8px rgba(24, 92, 230, 0.3);
}

.checkbox-input:checked + .checkbox-custom::after {
    transform: rotate(45deg) scale(1);
}

.directory-checkbox:hover .checkbox-custom {
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

.checkbox-input:checked + .checkbox-custom:hover {
    background: linear-gradient(135deg, #1250CE 0%, #3D6AE5 100%);
}

.directory-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 1rem;
}

.directory-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #718096;
}

.directory-creator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #718096;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
}

.btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    margin-bottom: 1rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-weight: 600;
    color: #2d3748;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-back:hover {
    background: #f7fafc;
}

.directory-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    justify-content: flex-end;
}

.directory-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    transition: background 0.2s ease;
}

.directory-action-btn span {
    display: none;
}

.directory-action-download,
.directory-action-shared {
    background: transparent;
    color: #6B7280;
    box-shadow: none;
}

.directory-action-download:hover {
    background: rgba(107, 114, 128, 0.1);
    color: #4B5563;
}

.directory-action-shared:hover {
    background: rgba(107, 114, 128, 0.1);
    color: #4B5563;
}

.directory-action-btn svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
}

@media (max-width: 768px) {
    .favorites-container {
        padding: 0rem;
    }

    .favorites-header {
        padding: 0.75rem 0;
    }

    .favorites-header-content {
        padding: 0 1rem;
    }

    .header-title-section {
        gap: 0.875rem;
        flex-wrap: wrap;
    }

    .header-icon {
        width: 28px;
        height: 28px;
    }

    .favorites-title {
        font-size: 1.5rem;
    }

    .favorites-subtitle {
        font-size: 0.875rem;
    }

    .favorites-content {
        padding: 0 1rem;
    }

    .tabs-modern {
        gap: 0.5rem;
        padding: 0.375rem;
    }

    .tab-button {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 0.5rem;
        font-size: 0.875rem;
    }

    .tab-button svg {
        width: 18px;
        height: 18px;
    }

    .filters-card {
        padding: 1rem;
        border-radius: 14px;
    }

    .filters-header h3 {
        font-size: 1rem;
    }

    .filters-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .form-group-half,
    .form-group-quarter {
        grid-column: 1 / -1;
    }

    .form-input {
        padding: 0.65rem 0.875rem 0.65rem 2.5rem;
        font-size: 0.9rem;
    }

    .input-icon {
        left: 0.875rem;
        width: 16px;
        height: 16px;
    }

    .form-label {
        font-size: 0.85rem;
    }

    .filters-actions {
        flex-direction: column;
        gap: 0.75rem;
    }

    .btn-search,
    .btn-create {
        width: 100%;
        justify-content: center;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
    }

    .documents-table-card {
        padding: 1.25rem 1rem;
        border-radius: 14px;
    }

    .directories-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .directory-card {
        padding: 1rem;
        border-radius: 12px;
    }

    .directory-card-header {
        margin-bottom: 1rem;
    }

    .directory-icon-lg {
        width: 48px;
        height: 48px;
        border-radius: 10px;
    }

    .directory-icon-lg svg {
        width: 28px;
        height: 28px;
    }

    .checkbox-input {
        width: 18px;
        height: 18px;
    }

    .directory-name {
        font-size: 1rem;
        margin-bottom: 0.75rem;
    }

    .directory-stats {
        gap: 0.375rem;
        margin-bottom: 0.75rem;
    }

    .stat-item {
        font-size: 0.8rem;
    }

    .stat-item svg {
        width: 13px;
        height: 13px;
    }

    .directory-creator {
        font-size: 0.8rem;
        padding-top: 0.625rem;
    }

    .directory-creator svg {
        width: 13px;
        height: 13px;
    }

    .directory-actions {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
    }
}

@media (max-width: 480px) {
    .favorites-header-content {
        padding: 0 0.875rem;
    }

    .favorites-title {
        font-size: 1.25rem;
    }

    .favorites-subtitle {
        font-size: 0.8rem;
    }

    .header-title-section {
        gap: 0.75rem;
    }

    .header-icon {
        width: 24px;
        height: 24px;
    }

    .filters-card {
        padding: 1rem 0.875rem;
    }

    .filters-header h3 {
        font-size: 1rem;
    }

    .form-input {
        padding: 0.65rem 0.75rem 0.65rem 2.25rem;
        font-size: 0.875rem;
    }

    .tab-button {
        padding: 0.625rem 0.375rem;
        font-size: 0.8rem;
    }

    .btn-search,
    .btn-create {
        padding: 0.65rem 1rem;
        font-size: 0.875rem;
    }

    .documents-table-card {
        padding: 1rem 0.75rem;
    }

    .directory-card {
        padding: 0.75rem;
    }

    .directory-icon-lg {
        width: 40px;
        height: 40px;
        border-radius: 8px;
    }

    .directory-icon-lg svg {
        width: 24px;
        height: 24px;
    }

    .checkbox-input {
        width: 16px;
        height: 16px;
    }

    .directory-name {
        font-size: 0.9rem;
        margin-bottom: 0.625rem;
    }

    .directory-stats {
        gap: 0.25rem;
        margin-bottom: 0.625rem;
    }

    .stat-item,
    .directory-creator {
        font-size: 0.75rem;
    }

    .stat-item svg,
    .directory-creator svg {
        width: 12px;
        height: 12px;
    }

    .directory-actions {
        margin-top: 0.625rem;
        padding-top: 0.625rem;
    }

    .directory-action-btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
    }

    .directory-action-btn svg {
        width: 14px;
        height: 14px;
    }
}
</style>