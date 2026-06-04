<template>
    <b-modal id="modal-resolucion-visualizar" v-model="show" title="" hide-footer centered size="xl"
        modal-class="custom-modal">
        <!-- Botones de navegación laterales -->
        <button v-if="show && showNavigation" @click="$emit('navigate', 'prev')" :disabled="currentIndex <= 0"
            class="nav-btn-side nav-prev-side" title="Anterior (Resultado {{ currentIndex }} de {{ totalResults }})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>
        <button v-if="show && showNavigation" @click="$emit('navigate', 'next')"
            :disabled="currentIndex >= totalResults - 1" class="nav-btn-side nav-next-side"
            title="Siguiente (Resultado {{ currentIndex + 2 }} de {{ totalResults }})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>

        <div class="modal-header-custom">
            <div class="title-with-copy">
                <h4 :class="['text-title', { 'text-title-opened': data.ISOPEN === 1 }]"
                    v-html="highlightText(datos.TITULO)">
                </h4>
                <div class="copy-btn-container-modal">
                    <button @click="copyToClipboard()" class="copy-btn-modal" title="Copiar título">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    <transition name="fade-scale">
                        <span v-if="showCopyMessage" class="copy-message-modal">Texto copiado</span>
                    </transition>
                </div>
            </div>

            <p class="text-subtitle" v-if="!isFav">
                <span>{{ datos.TITLEALT }}</span>
            </p>
        </div>

        <b-tabs content-class="mt-2" v-model="activeTab" class="custom-tabs">
            <!-- TAB 1 -->
            <b-tab event-key="tab1" title="Documento" active>
                <b-row class="g-4">
                    <!-- Primera columna -->
                    <b-col v-if="datos.TYPE == 'jurisprudences'" cols="12" lg="5">
                        <div class="info-card">
                            <b-list-group class="info-list">
                                <b-list-group-item><strong>Delito:</strong>
                                    <span
                                        v-html="datos.DELITO?.length > 0 ? highlightText(datos.DELITO?.map(d => d.DESCP).join(', ')) : '-'"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Órgano Jurisdiccional:</strong>
                                    <span
                                        v-html="datos.OJURISDICCIONAL?.length > 0 ? highlightText(datos.OJURISDICCIONAL?.map(o => o.DESCP).join(', ')) : '-'"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Tema:</strong>
                                    <p v-html="datos.TEMA"></p>
                                </b-list-group-item>
                                <b-list-group-item><strong>Subtema:</strong>
                                    <p v-html="datos.SUBTEMA"></p>
                                </b-list-group-item>
                                <b-list-group-item><strong>Palabras Clave:</strong>
                                    <span
                                        v-html="highlightText(datos.KEYWORDS?.split(',').map(p => p.trim()).join(', ') || '-')"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Fecha Resolución:</strong>
                                    <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                                </b-list-group-item>
                            </b-list-group>

                            <div v-if="normasVinculadas.length > 0" class="normas-vinculadas-section">
                                <strong class="normas-vinculadas-title">Normas Vinculadas:</strong>
                                <ul class="normas-vinculadas-list">
                                    <li v-for="norma in normasVinculadasPaged" :key="norma.ID">
                                        <a href="#" class="normas-vinculadas-item"
                                            @click.prevent="navigateToNorma(norma)">
                                            {{ norma.TITLE }}
                                        </a>
                                    </li>
                                </ul>
                                <div class="normas-pagination" v-if="normasTotalPages > 1">
                                    <b-pagination v-model="normasPage" :total-rows="normasVinculadas.length" :per-page="normasPerPage" class="my-2" />
                                </div>
                            </div>

                            <div class="action-buttons">
                                <button v-if="datos.IDFAV == null && isFav" @click="addFavorite(datos)"
                                    class="favorito-btn">
                                    <span class="favorito-icon">☆</span>
                                    <span class="favorito-text">Agregar a favoritos</span>
                                </button>

                                <button v-if="datos.IDFAV != null && isFav" @click="deleteFavorite(datos)"
                                    class="favorito-btn favorito-active">
                                    <span class="favorito-icon">★</span>
                                    <span class="favorito-text">Quitar de favoritos</span>
                                </button>

                                <button class="button-download" @click="descargarResolucion(1)">
                                    <img src="@/assets/img/icons/download.svg" alt="Descargar" class="descargar-icon">
                                    <span>Descargar Resolución</span>
                                </button>
                            </div>
                        </div>
                    </b-col>

                    <b-col v-if="datos.TYPE != 'jurisprudences'" cols="12" lg="5">
                        <div class="info-card">
                            <b-list-group class="info-list">
                                <b-list-group-item><strong>Numeración:</strong>
                                    <span>{{ datos.NMRCN }}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Denominación oficial:</strong>
                                    <span v-html="highlightText(datos.RTITLE || '-')"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Tipo de Norma:</strong>
                                    <span
                                        v-html="datos.TPONRMA?.length > 0 ? highlightText(datos.TPONRMA?.map(o => o.DESCP).join(', ')) : '-'"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Órgano emisor:</strong>
                                    <span
                                        v-html="datos.OEMISOR?.length > 0 ? highlightText(datos.OEMISOR?.map(o => o.DESCP).join(', ')) : '-'"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Fecha de publicación:</strong>
                                    <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Estado:</strong>
                                    <span>{{ datos.SITUACION }}</span>
                                </b-list-group-item>
                            </b-list-group>

                            <div v-if="normasVinculadas.length > 0" class="normas-vinculadas-section">
                                <strong class="normas-vinculadas-title">Normas Vinculadas:</strong>
                                <ul class="normas-vinculadas-list">
                                    <li v-for="norma in normasVinculadasPaged" :key="norma.ID">
                                        <a href="#" class="normas-vinculadas-item"
                                            @click.prevent="navigateToNorma(norma)">
                                            {{ norma.TITLE }}
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div class="action-buttons">
                                <button v-if="datos.IDFAV == null" @click="addFavorite(datos)" class="favorito-btn">
                                    <span class="favorito-icon">☆</span>
                                    <span class="favorito-text">Agregar a favoritos</span>
                                </button>

                                <button v-if="datos.IDFAV != null" @click="deleteFavorite(datos)"
                                    class="favorito-btn favorito-active">
                                    <span class="favorito-icon">★</span>
                                    <span class="favorito-text">Quitar de favoritos</span>
                                </button>

                                <button class="button-download" @click="descargarResolucion(1)">
                                    <img src="@/assets/img/icons/download.svg" alt="Descargar" class="descargar-icon">
                                    <span>Descargar Resolución</span>
                                </button>
                            </div>
                        </div>
                    </b-col>

                    <!-- Segunda columna -->
                    <b-col cols="12" lg="7">
                        <div class="pdf-container">
                            <!-- Efecto de carga -->
                            <div v-if="!pdfUrl || isLoadingNavigation" class="pdf-loader">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                                <p class="loading-text">{{ isLoadingNavigation ? 'Cargando siguiente documento...' :
                                    'Cargando documento...' }}</p>
                            </div>

                            <!-- PDF -->
                            <iframe v-else :src="pdfUrl + '#zoom=100&view=fitH' + '&controls=0&toolbar=0'"
                                class="pdf-viewer"></iframe>
                        </div>
                    </b-col>
                </b-row>
            </b-tab>

            <!-- TAB 2 -->
            <b-tab v-if="datos.TYPE == 'jurisprudences'" event-key="tab2" title="Resumen Ejecutivo">
                <b-row class="g-4">
                    <!-- Primera columna -->
                    <b-col cols="12" lg="5">
                        <div class="info-card">
                            <b-list-group class="info-list">
                                <b-list-group-item><strong>Tipo de Recurso:</strong>
                                    <span
                                        v-html="datos.RECURSO?.length > 0 ? highlightText(datos.RECURSO?.map(d => d.DESCP).join(', ')) : '-'"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Delitos:</strong>
                                    <span
                                        v-html="datos.DELITO?.length > 0 ? highlightText(datos.DELITO?.map(d => d.DESCP).join(', ')) : '-'"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Vinculante:</strong>
                                    <span>{{ datos.INDICADOR ? 'Sí' : 'No' }}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Tema:</strong>
                                    <p v-html="datos.TEMA"></p>
                                </b-list-group-item>
                                <b-list-group-item><strong>Subtema:</strong>
                                    <p v-html="datos.SUBTEMA"></p>
                                </b-list-group-item>
                                <b-list-group-item><strong>Palabras Clave:</strong>
                                    <span
                                        v-html="highlightText(datos.KEYWORDS?.split(',').map(p => p.trim()).join(', ') || '-')"></span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Fecha Resolución:</strong>
                                    <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                                </b-list-group-item>
                            </b-list-group>

                            <div v-if="normasVinculadas.length > 0" class="normas-vinculadas-section">
                                <strong class="normas-vinculadas-title">Normas Vinculadas:</strong>
                                <ul class="normas-vinculadas-list">
                                    <li v-for="norma in normasVinculadasPaged" :key="norma.ID">
                                        <a href="#" class="normas-vinculadas-item"
                                            @click.prevent="navigateToNorma(norma)">
                                            {{ norma.TITLE }}
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div class="action-buttons">
                                <button class="button-download-outline" @click="descargarResolucion(2)">
                                    <img src="@/assets/img/icons/download-dark.svg" alt="Descargar"
                                        class="descargar-icon">
                                    <span>Descargar Resumen</span>
                                </button>
                            </div>
                        </div>
                    </b-col>

                    <!-- Segunda columna -->
                    <b-col cols="12" lg="7">
                        <div class="pdf-container">
                            <div v-if="!pdfUrlResumen || isLoadingNavigation" class="pdf-loader">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                                <p class="loading-text">{{ isLoadingNavigation ? 'Cargando siguiente resumen...' :
                                    'Cargando resumen...' }}</p>
                            </div>

                            <iframe v-else :src="pdfUrlResumen + '#zoom=100&view=fitH' + '&controls=0&toolbar=0'"
                                class="pdf-viewer"></iframe>
                        </div>
                    </b-col>
                </b-row>
            </b-tab>
        </b-tabs>
    </b-modal>
</template>

<script>
import { BModal, BTabs, BTab, BRow, BCol, BListGroup, BListGroupItem, BPagination } from 'bootstrap-vue-next';
import AdminEntriesProxy from '../../../proxies/AdminEntriesProxy';
import { toast } from 'vue3-toastify';
import createPDFHelper from "../../../assets/helpers/generatePdfHelper.js";
import { ref } from "vue";
import UserProxy from '../../../proxies/UserProxy.js';

export default {
    name: "ModalMostrarResolucion",
    props: {
        openModal: {
            type: Boolean,
            default: false
        },
        toggleModal: {
            type: Function,
            required: true
        },
        data: {
            type: Object,
            required: true
        },
        isFav: {
            type: Boolean,
            default: true
        },
        role: {
            type: Object,
            default: () => { }
        },
        currentIndex: {
            type: Number,
            default: 0
        },
        totalResults: {
            type: Number,
            default: 0
        },
        showNavigation: {
            type: Boolean,
            default: false
        },
        searchText: {
            type: [String, Object],
            default: null
        },
        modoBusqueda: {
            type: Number,
            default: 1
        }
    },
    components: {
        BModal,
        BTabs, BTab, BRow, BCol, BListGroup, BListGroupItem,
        BPagination
    },
    computed: {
        normasVinculadas() {
            if (!this.datos.JIDSVIN) return [];
            try {
                const parsed = JSON.parse(this.datos.JIDSVIN);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        },
        normasTotalPages() {
            return Math.max(1, Math.ceil(this.normasVinculadas.length / this.normasPerPage));
        },
        normasVinculadasPaged() {
            const start = (this.normasPage - 1) * this.normasPerPage;
            return this.normasVinculadas.slice(start, start + this.normasPerPage);
        }
    },
    data() {
        return {
            show: false,
            activeTab: ref("tab1"),
            pdfUrl: '',
            pdfUrlResumen: '',
            isLoadingNavigation: false,
            showCopyMessage: false,
            datos: {
                pretension: '',
                organo: '',
                tema: '',
                subtema: '',
                palabrasClave: '',
                fechaResolucion: ''
            },
            // pagination for normas vinculadas
            normasPage: 1,
            normasPerPage: 5,
        };
    },
    methods: {
        navigateToNorma(norma) {
            const basePath = this.$route.path.includes('/admin/') ? '/admin/busqueda' : '/usuario/busqueda';
            const route = this.$router.resolve({ path: basePath, query: { id: norma.ID, search: norma.TITLE } });
            window.open(route.href, '_blank');
        },
        formateReverse(date) {
            try {
                if (!date) return null;
                const parts = date.split('-');
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            } catch (error) {
                console.error("Error al formatear la fecha:", error);
                return null;
            }
        },
        async print(path) {
            await AdminEntriesProxy.downloadFile({
                PATH: path
            })
                .then(async (response) => {
                    const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
                    this.pdfUrl = url;
                })
                .catch(() => {
                    toast.error("Ocurrió un error al descargar el archivo", { toastId: "error" });
                })
        },
        async printResumen(item) {
            try {
                this.pdfUrlResumen = "data:application/pdf;base64," + (await createPDFHelper.generate(item, true));
            } catch (error) {
                console.error("Error al generar el PDF:", error);
            }
        },
        descargarResolucion(tipo) {
            if (tipo === 1) {
                const linkSource = this.pdfUrl;
                const downloadLink = document.createElement("a");
                const fileName = this.data.TITULO + " - Resolución.pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            } else {
                const linkSource = this.pdfUrlResumen;
                const downloadLink = document.createElement("a");
                const fileName = this.data.TITULO + " - Resumen.pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }
        },
        async addFavorite(item) {
            if (item.IDFAV) return

            this.isLoading = true;
            await UserProxy.addFavorite(item.ID)
                .then((response) => {
                    const toastMessage = response.MESSAGE;
                    if (response.STATUS) {
                        toast.success("Documento agregado a favoritos", { toastId: "success" });
                        item.IDFAV = 1;
                    }
                    else toast.error(toastMessage, { toastId: "error" });
                })
                .catch(() => {
                    toast.error("Ocurrió un error al agregar a favoritos", { toastId: "error" });
                })
                .finally(() => this.isLoading = false);
        },
        async deleteFavorite(item) {
            let IDENTRIE = item.ID;
            this.isLoading = true;
            await UserProxy.addFavorite(IDENTRIE)
                .then((response) => {
                    const toastMessage = response.MESSAGE;
                    if (response.STATUS) {
                        toast.success("Documento eliminado de favoritos");
                        item.IDFAV = null;
                    } else {
                        toast.error(toastMessage);
                    }
                })
                .catch((error) => toast.error(error?.MESSAGE || 'Error al eliminar de favoritos', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },
        copyToClipboard() {
            let textToCopy = '';

            if (this.datos.TYPE === 'jurisprudences') {
                // Para jurisprudencia: solo copiar el título
                textToCopy = this.datos.TITULO || '';
            } else if (this.datos.TYPE === 'legislations') {
                // Para legislación: copiar título y denominación oficial separados por " - "
                const titulo = this.datos.TITULO || '';
                const denominacion = this.datos.RTITLE || '';
                textToCopy = denominacion ? `${titulo} - ${denominacion}` : titulo;
            } else {
                // Por defecto: solo el título
                textToCopy = this.datos.TITULO || '';
            }

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    this.showCopyMessage = true;
                    setTimeout(() => {
                        this.showCopyMessage = false;
                    }, 1500);
                })
                .catch(() => {
                    // Silencioso en caso de error
                });
        },
        prevNormasPage() {
            if (this.normasPage > 1) this.normasPage--;
        },
        nextNormasPage() {
            if (this.normasPage < this.normasTotalPages) this.normasPage++;
        },
        highlightText(text) {
            if (!text || !this.searchText) return text;

            // Obtener el texto de búsqueda
            const searchTextValue = typeof this.searchText === 'object' ? this.searchText.DESCP : this.searchText;
            if (!searchTextValue || searchTextValue.trim() === '') return text;

            // Lista de palabras comunes que no deben resaltarse
            const stopWords = [
                'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
                'de', 'del', 'al', 'a', 'ante', 'bajo', 'con', 'contra', 'desde', 'en', 'entre', 'hacia', 'hasta',
                'para', 'por', 'según', 'sin', 'sobre', 'tras',
                'y', 'e', 'o', 'u', 'ni', 'que', 'pero', 'sino', 'mas',
                'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas',
                'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
                'se', 'lo', 'le', 'les', 'me', 'te', 'nos', 'os',
                'es', 'son', 'está', 'están', 'fue', 'fueron', 'ha', 'han', 'había', 'habían',
                'como', 'cuando', 'donde', 'cual', 'cuales', 'quien', 'quienes'
            ];

            // Limpiar el texto de búsqueda y dividirlo en palabras
            const searchWords = searchTextValue.trim().split(/\s+/);

            // Dependiendo del modo de búsqueda
            let regex;
            if (this.modoBusqueda === 1 || this.modoBusqueda === 2) {
                // Modo 1: Contenga solamente estas palabras
                // Modo 2: Contenga alguna de estas palabras
                const filteredWords = searchWords.filter(word =>
                    !stopWords.includes(word.toLowerCase()) && word.length > 0
                );

                if (filteredWords.length === 0) {
                    return text;
                }

                // Escape caracteres especiales de regex
                const escapedWords = filteredWords.map(word =>
                    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                );

                // Resaltar cada palabra significativa individualmente
                regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
            } else if (this.modoBusqueda === 3) {
                // Modo 3: Contenga la frase completa
                const escapedPhrase = searchTextValue.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regex = new RegExp(`(${escapedPhrase})`, 'gi');
            }

            // Reemplazar las coincidencias con el texto resaltado
            return text.replace(regex, '<mark class="highlight-text">$1</mark>');
        },
    },
    watch: {
        openModal() {
            this.show = this.openModal;
        },
        data: {
            async handler(newVal) {
                if (newVal && this.show) {
                    this.isLoadingNavigation = true;
                    this.pdfUrl = '';
                    this.pdfUrlResumen = '';
                    this.datos = newVal;

                    try {
                        await this.print(newVal.ENTRIEFILE);
                        await this.printResumen(newVal);
                    } finally {
                        this.isLoadingNavigation = false;
                    }
                }
            },
            deep: true
        },
        show(val) {
            if (!val) {
                this.toggleModal();
                this.pdfUrl = '';
                this.pdfUrlResumen = '';
                this.datos = {}
                this.activeTab = "tab1";

            } else {
                this.print(this.data.ENTRIEFILE);
                this.printResumen(this.data);
                this.datos = this.data
            }
        },
    }
}
</script>

<style scoped>
/* Modal Header */
.modal-header-custom {
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 0.75rem;
}

.title-with-copy {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.text-title {
    flex: 1;
    margin: 0;
    line-height: 1.3;
    color: #3B82F6;
    transition: color 0.3s ease;
}

.text-title-opened {
    color: #9B30FF;
}

.copy-btn-container-modal {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-top: 0.1rem;
}

.copy-btn-modal {
    background: transparent;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 0.375rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: #6c757d;
}

.copy-btn-modal svg {
    width: 14px;
    height: 14px;
}

.copy-btn-modal:hover {
    background: #f8f9fa;
    border-color: #ced4da;
    color: #495057;
}

.copy-btn-modal:active {
    transform: scale(0.95);
    background: #e9ecef;
}

.copy-message-modal {
    position: absolute;
    left: calc(100% + 0.5rem);
    top: 50%;
    transform: translateY(-50%);
    background: #28a745;
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    z-index: 1000;
}

.copy-message-modal::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: #28a745;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.2s ease;
}

.fade-scale-enter-from {
    opacity: 0;
    transform: translateY(-50%) translateX(-5px);
}

.fade-scale-leave-to {
    opacity: 0;
    transform: translateY(-50%) translateX(-5px);
}

@media (max-width: 768px) {
    .title-with-copy {
        gap: 0.75rem;
    }

    .copy-btn-modal {
        padding: 0.35rem;
    }

    .copy-btn-modal svg {
        width: 13px;
        height: 13px;
    }

    .copy-message-modal {
        font-size: 0.75rem;
        padding: 0.35rem 0.65rem;
    }
}

/* Botones de navegación laterales */
.nav-btn-side {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #dee2e6;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1060;
    backdrop-filter: blur(10px);
}

.nav-prev-side {
    left: 20px;
}

.nav-next-side {
    right: 20px;
}

.nav-btn-side:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #1864FF;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(24, 100, 255, 0.25);
}

.nav-btn-side:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
}

.nav-btn-side:disabled {
    background: rgba(233, 236, 239, 0.5);
    border-color: #dee2e6;
    cursor: not-allowed;
    opacity: 0.4;
}

.nav-btn-side svg {
    stroke: #495057;
    transition: stroke 0.3s ease;
}

.nav-btn-side:hover:not(:disabled) svg {
    stroke: #1864FF;
}

.nav-btn-side:disabled svg {
    stroke: #adb5bd;
}

@media (max-width: 768px) {
    .nav-btn-side {
        width: 40px;
        height: 40px;
    }

    .nav-prev-side {
        left: 10px;
    }

    .nav-next-side {
        right: 10px;
    }
}

.text-title {
    font-family: 'Lato', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: #1864FF;
    margin-bottom: 0.25rem;
    line-height: 1.3;
}

.text-subtitle {
    font-family: 'Lato', sans-serif;
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 0;
    margin-top: 0.25rem;
}

/* Normas Vinculadas */
.normas-vinculadas-section {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e9ecef;
}

.normas-vinculadas-title {
    font-size: 0.75rem;
    color: #495057;
    display: block;
    margin-bottom: 0.4rem;
}

/* Paginación reducida específica para el modal (normas vinculadas) */
.normas-pagination {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

/* Target internal pagination markup generated by bootstrap-vue-next */
.normas-pagination ::v-deep(.pagination) {
    margin: 0;
    font-size: 0.78rem;
}

.normas-pagination ::v-deep(.page-link) {
    padding: 0.28rem 0.5rem;
    min-width: 30px;
    height: 32px;
    line-height: 1.1;
    border-radius: 6px;
}

.normas-pagination ::v-deep(.page-item.active .page-link) {
    background: linear-gradient(135deg, #6B5CFF 0%, #5BC0DE 100%);
    color: #ffffff;
    border-color: transparent;
    box-shadow: none;
}

.normas-pagination ::v-deep(.page-item.disabled .page-link) {
    opacity: 0.6;
}

.normas-vinculadas-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow-y: auto;
}

.normas-vinculadas-item {
    font-size: 0.65rem;
    color: #1864FF;
    padding: 0.3rem 0.5rem;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    line-height: 1.3;
    text-decoration: none;
    display: block;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}

.normas-vinculadas-item:hover {
    background: #e8f0fe;
    color: #0d47a1;
    text-decoration: underline;
}

/* Custom Tabs */
.custom-tabs :deep(.nav-tabs) {
    border-bottom: 2px solid #e9ecef;
    gap: 0.5rem;
}

.custom-tabs :deep(.nav-link) {
    font-family: 'Lato', sans-serif;
    font-weight: 600;
    color: #6c757d;
    border: none;
    border-bottom: 3px solid transparent;
    padding: 0.5rem 1.25rem;
    transition: all 0.3s ease;
}

.custom-tabs :deep(.nav-link:hover) {
    color: #1864FF;
    border-bottom-color: #1864FF;
}

.custom-tabs :deep(.nav-link.active) {
    color: #1864FF;
    background: transparent;
    border-bottom-color: #1864FF;
}

/* Info Card */
.info-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    height: 100%;
    overflow-y: auto;
    transition: box-shadow 0.3s ease;
}

.info-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* List Group */
.info-list {
    --bs-list-group-border-width: 0;
    margin-bottom: 1.5rem;
}

.list-group-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid #f0f0f0 !important;
    background: transparent;
    transition: background-color 0.2s ease;
}

.list-group-item:last-child {
    border-bottom: none !important;
}

.list-group-item strong {
    color: #495057;
    font-family: 'Lato', sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.list-group-item span,
.list-group-item p {
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    font-weight: 400;
    color: #212529;
    line-height: 1.6;
    margin: 0;
}

/* Action Buttons Container */
.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #f0f0f0;
}

/* Favorito Button */
.favorito-btn {
    font-family: 'Lato', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    background: #fff;
    color: #666;
    border: 1.5px solid #e0e0e0;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    transition: all 0.2s ease;
}

.favorito-btn:hover {
    border-color: #ffc107;
    background: #fffbf0;
    color: #333;
}

.favorito-btn.favorito-active {
    background: #fff8e1;
    border-color: #ffc107;
    color: #f57c00;
}

.favorito-btn.favorito-active:hover {
    background: #ffecb3;
}

.favorito-icon {
    font-size: 1.1rem;
    line-height: 1;
    transition: transform 0.2s ease;
}

.favorito-btn:hover .favorito-icon {
    transform: scale(1.15);
}

.favorito-btn.favorito-active .favorito-icon {
    color: #ffc107;
}

/* Download Button */
.button-download {
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    background: linear-gradient(135deg, #1864FF 0%, #0047CC 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(24, 100, 255, 0.3);
}

.button-download:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 100, 255, 0.4);
    background: linear-gradient(135deg, #0047CC 0%, #003399 100%);
}

.button-download:active {
    transform: translateY(0);
}

/* Download Outline Button */
.button-download-outline {
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    background: white;
    border: 2px solid #1864FF;
    color: #1864FF;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.button-download-outline:hover {
    background: #1864FF;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 100, 255, 0.3);
}

.descargar-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
}

.button-download:hover .descargar-icon,
.button-download-outline:hover .descargar-icon {
    transform: translateY(2px);
}

/* PDF Container */
.pdf-container {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1rem;
    height: calc(100vh - 150px);
    min-height: 600px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* PDF Loader */
.pdf-loader {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 8px;
    gap: 1rem;
}

.loading-text {
    font-family: 'Lato', sans-serif;
    font-size: 1rem;
    color: #6c757d;
    margin: 0;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}

/* PDF Viewer */
.pdf-viewer {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    width: 100%;
    height: 100%;
    background: white;
}

/* Responsive */
@media (max-width: 991px) {
    .info-card {
        margin-bottom: 1.5rem;
    }

    .pdf-container {
        height: 500px;
    }
}

@media (max-width: 768px) {
    .text-title {
        font-size: 1.25rem;
    }

    .custom-tabs :deep(.nav-link) {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }

    .info-card {
        padding: 1rem;
    }

    .action-buttons {
        gap: 0.5rem;
    }

    .button-download,
    .button-download-outline,
    .favorito-btn {
        font-size: 0.85rem;
        padding: 0.65rem 1rem;
    }
}

/* Resaltado de texto en búsqueda */
.highlight-text {
    background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-weight: 500;
    color: #1f2937;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* ==================== DARK MODE ==================== */

/* Modal header custom */
.dark .modal-header-custom {
    border-bottom-color: #374151;
}

/* Title */
.dark .text-title {
    color: #60a5fa;
}

.dark .text-title-opened {
    color: #93c5fd;
}

/* Subtitle */
.dark .text-subtitle {
    color: #94a3b8;
}

/* Copy button */
.dark .copy-btn-modal {
    border-color: #374151;
    color: #94a3b8;
}

.dark .copy-btn-modal:hover {
    background: #374151;
    border-color: #4b5563;
    color: #e2e8f0;
}

.dark .copy-btn-modal:active {
    background: #4b5563;
}

/* Navigation buttons */
.dark .nav-btn-side {
    background: rgba(30, 41, 59, 0.95);
    border-color: #374151;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.dark .nav-btn-side:hover:not(:disabled) {
    background: #1e293b;
    border-color: #93c5fd;
    box-shadow: 0 6px 20px rgba(147, 197, 253, 0.25);
}

.dark .nav-btn-side:disabled {
    background: rgba(17, 24, 39, 0.5);
    border-color: #374151;
}

.dark .nav-btn-side svg {
    stroke: #94a3b8;
}

.dark .nav-btn-side:hover:not(:disabled) svg {
    stroke: #93c5fd;
}

.dark .nav-btn-side:disabled svg {
    stroke: #4b5563;
}

/* Tabs */
.dark .custom-tabs :deep(.nav-tabs) {
    border-bottom-color: #374151;
    background: transparent;
}

.dark .custom-tabs :deep(.nav-link) {
    color: #94a3b8;
    background: transparent !important;
}

.dark .custom-tabs :deep(.nav-link:hover) {
    color: #93c5fd;
    border-bottom-color: #93c5fd;
    background: transparent !important;
}

.dark .custom-tabs :deep(.nav-link.active) {
    color: #93c5fd;
    border-bottom-color: #93c5fd;
    background: transparent !important;
}

/* Info Card */
.dark .info-card {
    background: #0f172a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .info-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* List Group */
.dark .list-group-item {
    border-bottom-color: #374151 !important;
}

.dark .list-group-item strong {
    color: #94a3b8;
}

.dark .list-group-item span,
.dark .list-group-item p {
    color: #e2e8f0;
}

/* Normas Vinculadas */
.dark .normas-vinculadas-section {
    border-top-color: #374151;
}

.dark .normas-vinculadas-title {
    color: #94a3b8;
}

.dark .normas-vinculadas-item {
    background: #1e293b;
    border-color: #374151;
    color: #93c5fd;
}

.dark .normas-vinculadas-item:hover {
    background: #374151;
    color: #bfdbfe;
}

/* Action Buttons */
.dark .action-buttons {
    border-top-color: #374151;
}

/* Favorito Button */
.dark .favorito-btn {
    background: #0f172a;
    border-color: #374151;
    color: #94a3b8;
}

.dark .favorito-btn:hover {
    border-color: #fbbf24;
    background: rgba(251, 191, 36, 0.1);
    color: #e2e8f0;
}

.dark .favorito-btn.favorito-active {
    background: rgba(245, 158, 11, 0.15);
    border-color: #fbbf24;
    color: #fbbf24;
}

.dark .favorito-btn.favorito-active:hover {
    background: rgba(245, 158, 11, 0.25);
}

.dark .favorito-btn.favorito-active .favorito-icon {
    color: #fbbf24;
}

/* Download Outline Button */
.dark .button-download-outline {
    background: transparent;
    border-color: #93c5fd;
    color: #93c5fd;
}

.dark .button-download-outline:hover {
    background: #93c5fd;
    color: #0f172a;
}

/* PDF Container */
.dark .pdf-container {
    background: #0f172a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* PDF Loader */
.dark .pdf-loader {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.dark .loading-text {
    color: #94a3b8;
}

/* PDF Viewer */
.dark .pdf-viewer {
    border-color: #374151;
    background: #1e293b;
}

/* Highlight text */
.dark .highlight-text {
    background: linear-gradient(135deg, #854d0e 0%, #a16207 100%);
    color: #fef08a;
}
</style>

<style>
/* Unscoped: close button in dark mode (modal teleported to body) */
html.dark #modal-resolucion-visualizar .btn-close {
    filter: brightness(0) invert(1) !important;
    background-color: transparent !important;
    opacity: 1 !important;
}
</style>