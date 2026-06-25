<template>
    <BaseModal v-model="show" size="2xl" bodyPadding="p-0" @close="show = false">

        <!-- Header: título + botón copiar -->
        <template #header>
            <div class="flex-1 flex items-start gap-2 min-w-0 pr-2">
                <h4 :class="['flex-1 m-0 text-[1.1rem] font-bold leading-[1.3] transition-colors duration-300',
                    data.ISOPEN === 1 ? 'text-[#9B30FF] dark:text-[#93c5fd]' : 'text-[#1864FF] dark:text-[#60a5fa]']"
                    v-html="highlightText(datos.TITULO)">
                </h4>
                <div v-if="puedeAcceder('busqueda.copiar')" class="relative flex items-center flex-shrink-0">
                    <button @click="copyToClipboard()"
                        class="bg-transparent border border-[#e9ecef] rounded-[6px] p-[0.375rem] cursor-pointer flex items-center justify-center transition-all duration-200 text-[#6c757d] hover:bg-[#f8f9fa] hover:border-[#ced4da] hover:text-[#495057] active:scale-95 active:bg-[#e9ecef] dark:border-[#374151] dark:text-[#94a3b8] dark:hover:bg-[#374151] dark:hover:border-[#4b5563] dark:hover:text-[#e2e8f0] dark:active:bg-[#4b5563]"
                        title="Copiar título">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
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
        </template>

        <!-- Botones de navegación laterales (fixed en pantalla) -->
        <button v-if="show && showNavigation" @click="$emit('navigate', 'prev')" :disabled="currentIndex <= 0"
            class="nav-btn-side fixed top-1/2 -translate-y-1/2 left-5 max-[768px]:left-2.5 bg-white/95 border-2 border-[#dee2e6] rounded-full w-12 h-12 max-[768px]:w-10 max-[768px]:h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1060] backdrop-blur-[10px] disabled:bg-[rgba(233,236,239,0.5)] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[rgba(30,41,59,0.95)] dark:border-[#374151] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:disabled:bg-[rgba(17,24,39,0.5)] dark:disabled:border-[#374151]"
            title="Anterior (Resultado {{ currentIndex }} de {{ totalResults }})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>
        <button v-if="show && showNavigation" @click="$emit('navigate', 'next')"
            :disabled="currentIndex >= totalResults - 1"
            class="nav-btn-side fixed top-1/2 -translate-y-1/2 right-5 max-[768px]:right-2.5 bg-white/95 border-2 border-[#dee2e6] rounded-full w-12 h-12 max-[768px]:w-10 max-[768px]:h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1060] backdrop-blur-[10px] disabled:bg-[rgba(233,236,239,0.5)] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[rgba(30,41,59,0.95)] dark:border-[#374151] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:disabled:bg-[rgba(17,24,39,0.5)] dark:disabled:border-[#374151]"
            title="Siguiente (Resultado {{ currentIndex + 2 }} de {{ totalResults }})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>

        <!-- Subtítulo (solo vista búsqueda) -->
        <p v-if="!isFav && datos.TITLEALT"
            class="px-5 pt-3 pb-0 m-0 text-[0.875rem] text-[#6c757d] dark:text-[#94a3b8]">
            {{ datos.TITLEALT }}
        </p>

        <!-- Contenido principal con tabs propios -->
        <div v-if="show">
            <!-- ── Navegación tabs ── -->
            <div class="modal-tabs-nav">
                <button @click="activeTab = 'tab1'" :class="['mtab', { active: activeTab === 'tab1' }]">
                    Documento
                </button>
                <button v-if="datos.TYPE === 'jurisprudences'" @click="activeTab = 'tab2'"
                    :class="['mtab', { active: activeTab === 'tab2' }]">
                    Resumen Ejecutivo
                </button>
            </div>

            <!-- ── TAB 1: Documento ── -->
            <div v-show="activeTab === 'tab1'" class="modal-tab-body">
                <div class="modal-two-col">

                    <!-- Columna info — jurisprudencias -->
                    <div v-if="datos.TYPE === 'jurisprudences'" class="modal-info-col">
                        <div class="mif"><span class="mif-lbl">Delito</span>
                            <span v-html="datos.DELITO?.length > 0 ? highlightText(datos.DELITO.map(d => d.DESCP).join(', ')) : '-'"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Órgano Jurisdiccional</span>
                            <span v-html="datos.OJURISDICCIONAL?.length > 0 ? highlightText(datos.OJURISDICCIONAL.map(o => o.DESCP).join(', ')) : '-'"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Tema</span>
                            <p v-html="datos.TEMA" class="m-0"></p>
                        </div>
                        <div class="mif"><span class="mif-lbl">Subtema</span>
                            <p v-html="datos.SUBTEMA" class="m-0"></p>
                        </div>
                        <div class="mif"><span class="mif-lbl">Palabras Clave</span>
                            <span v-html="highlightText(datos.KEYWORDS?.split(',').map(p => p.trim()).join(', ') || '-')"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Fecha Resolución</span>
                            <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                        </div>

                        <!-- Resumen IA con typewriter -->
                        <div v-if="datos.RESUMEN" class="mif resumen-ia-block">
                            <span class="mif-lbl">
                                Resumen
                                <span class="ia-badge">
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M12 2L13.4 8.26L19.5 9L13.4 9.74L12 16L10.6 9.74L4.5 9L10.6 8.26Z"/>
                                        <path d="M5 3l.6 2 2 .5-2 .5-.6 2-.6-2-2-.5 2-.5z"/>
                                    </svg>
                                    IA
                                </span>
                            </span>
                            <div class="resumen-body" @click="skipTyping">
                                <template v-if="!resumenDone">
                                    <p class="resumen-typing-text">{{ typedResumen }}<span class="cursor-blink">|</span></p>
                                </template>
                                <template v-else>
                                    <div v-html="datos.RESUMEN"></div>
                                </template>
                            </div>
                        </div>

                        <div v-if="normasVinculadas.length > 0" class="mif-normas">
                            <span class="mif-lbl">Normas Vinculadas</span>
                            <ul class="normas-list">
                                <li v-for="norma in normasVinculadasPaged" :key="norma.ID">
                                    <a href="#" @click.prevent="navigateToNorma(norma)">{{ norma.TITLE }}</a>
                                </li>
                            </ul>
                            <div v-if="normasTotalPages > 1" class="normas-pagination">
                                <b-pagination v-model="normasPage" :total-rows="normasVinculadas.length" :per-page="normasPerPage" class="my-2" />
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button v-if="puedeAcceder('favoritos') && !(datos.IDFAV > 0) && isFav" @click="addFavorite(datos)" class="maction-btn maction-fav">
                                <span>☆</span> Agregar a favoritos
                            </button>
                            <button v-if="puedeAcceder('favoritos') && datos.IDFAV > 0 && isFav" @click="deleteFavorite(datos)" class="maction-btn maction-fav--active">
                                <span>★</span> Quitar de favoritos
                            </button>
                            <button v-if="puedeAcceder('busqueda.descargar')" @click="descargarResolucion(1)" class="maction-btn maction-download">
                                <img src="@/assets/img/icons/download.svg" alt="" style="width:16px;height:16px;filter:brightness(0)invert(1);">
                                Descargar Resolución
                            </button>
                        </div>
                    </div>

                    <!-- Columna info — otros tipos -->
                    <div v-else class="modal-info-col">
                        <div class="mif"><span class="mif-lbl">Numeración</span>
                            <span>{{ datos.NMRCN || '-' }}</span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Denominación oficial</span>
                            <span v-html="highlightText(datos.RTITLE || '-')"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Tipo de Norma</span>
                            <span v-html="datos.TPONRMA?.length > 0 ? highlightText(datos.TPONRMA.map(o => o.DESCP).join(', ')) : '-'"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Órgano emisor</span>
                            <span v-html="datos.OEMISOR?.length > 0 ? highlightText(datos.OEMISOR.map(o => o.DESCP).join(', ')) : '-'"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Fecha de publicación</span>
                            <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Estado</span>
                            <span>{{ datos.SITUACION || '-' }}</span>
                        </div>
                        <div v-if="normasVinculadas.length > 0" class="mif-normas">
                            <span class="mif-lbl">Normas Vinculadas</span>
                            <ul class="normas-list">
                                <li v-for="norma in normasVinculadasPaged" :key="norma.ID">
                                    <a href="#" @click.prevent="navigateToNorma(norma)">{{ norma.TITLE }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="modal-actions">
                            <button v-if="puedeAcceder('favoritos') && !(datos.IDFAV > 0)" @click="addFavorite(datos)" class="maction-btn maction-fav">
                                <span>☆</span> Agregar a favoritos
                            </button>
                            <button v-if="puedeAcceder('favoritos') && datos.IDFAV > 0" @click="deleteFavorite(datos)" class="maction-btn maction-fav--active">
                                <span>★</span> Quitar de favoritos
                            </button>
                            <button v-if="puedeAcceder('busqueda.descargar')" @click="descargarResolucion(1)" class="maction-btn maction-download">
                                <img src="@/assets/img/icons/download.svg" alt="" style="width:16px;height:16px;filter:brightness(0)invert(1);">
                                Descargar Resolución
                            </button>
                        </div>
                    </div>

                    <!-- Columna PDF -->
                    <div class="modal-pdf-col">
                        <div v-if="!pdfUrl || isLoadingNavigation" class="pdf-load-area">
                            <div class="pdf-spinner"></div>
                            <p>{{ isLoadingNavigation ? 'Cargando siguiente documento...' : 'Cargando documento...' }}</p>
                        </div>
                        <iframe v-else :src="pdfUrl + '#zoom=100&view=fitH&controls=0&toolbar=0'"
                            style="width:100%;height:100%;border:none;border-radius:10px;background:white;"></iframe>
                    </div>
                </div>
            </div>

            <!-- ── TAB 2: Resumen Ejecutivo ── -->
            <div v-show="activeTab === 'tab2'" v-if="datos.TYPE === 'jurisprudences'" class="modal-tab-body">
                <div class="modal-two-col">
                    <div class="modal-info-col">
                        <div class="mif"><span class="mif-lbl">Tipo de Recurso</span>
                            <span v-html="datos.RECURSO?.length > 0 ? highlightText(datos.RECURSO.map(d => d.DESCP).join(', ')) : '-'"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Delitos</span>
                            <span v-html="datos.DELITO?.length > 0 ? highlightText(datos.DELITO.map(d => d.DESCP).join(', ')) : '-'"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Vinculante</span>
                            <span>{{ datos.INDICADOR ? 'Sí' : 'No' }}</span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Tema</span>
                            <p v-html="datos.TEMA" class="m-0"></p>
                        </div>
                        <div class="mif"><span class="mif-lbl">Subtema</span>
                            <p v-html="datos.SUBTEMA" class="m-0"></p>
                        </div>
                        <div class="mif"><span class="mif-lbl">Palabras Clave</span>
                            <span v-html="highlightText(datos.KEYWORDS?.split(',').map(p => p.trim()).join(', ') || '-')"></span>
                        </div>
                        <div class="mif"><span class="mif-lbl">Fecha Resolución</span>
                            <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                        </div>

                        <!-- Resumen IA con typewriter -->
                        <div v-if="datos.RESUMEN" class="mif resumen-ia-block">
                            <span class="mif-lbl">
                                Resumen
                                <span class="ia-badge">
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M12 2L13.4 8.26L19.5 9L13.4 9.74L12 16L10.6 9.74L4.5 9L10.6 8.26Z"/>
                                        <path d="M5 3l.6 2 2 .5-2 .5-.6 2-.6-2-2-.5 2-.5z"/>
                                    </svg>
                                    IA
                                </span>
                            </span>
                            <div class="resumen-body" @click="skipTyping">
                                <template v-if="!resumenDone">
                                    <p class="resumen-typing-text">{{ typedResumen }}<span class="cursor-blink">|</span></p>
                                </template>
                                <template v-else>
                                    <div v-html="datos.RESUMEN"></div>
                                </template>
                            </div>
                        </div>

                        <div v-if="normasVinculadas.length > 0" class="mif-normas">
                            <span class="mif-lbl">Normas Vinculadas</span>
                            <ul class="normas-list">
                                <li v-for="norma in normasVinculadasPaged" :key="norma.ID">
                                    <a href="#" @click.prevent="navigateToNorma(norma)">{{ norma.TITLE }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="modal-actions">
                            <button v-if="puedeAcceder('busqueda.descargar')" @click="descargarResolucion(2)" class="maction-btn maction-outline">
                                <img src="@/assets/img/icons/download-dark.svg" alt="" style="width:16px;height:16px;">
                                Descargar Resumen
                            </button>
                        </div>
                    </div>
                    <div class="modal-pdf-col">
                        <div v-if="!pdfUrlResumen || isLoadingNavigation" class="pdf-load-area">
                            <div class="pdf-spinner"></div>
                            <p>{{ isLoadingNavigation ? 'Cargando siguiente resumen...' : 'Cargando resumen...' }}</p>
                        </div>
                        <iframe v-else :src="pdfUrlResumen + '#zoom=100&view=fitH&controls=0&toolbar=0'"
                            style="width:100%;height:100%;border:none;border-radius:10px;background:white;"></iframe>
                    </div>
                </div>
            </div>
        </div><!-- /v-else content -->
    </BaseModal>
</template>

<script>
import { BPagination } from 'bootstrap-vue-next';
import BaseModal from '@/components/ui/BaseModal.vue';
import AdminEntriesProxy from '@/proxies/AdminEntriesProxy';
import { toast } from 'vue3-toastify';
import createPDFHelper from "@/assets/helpers/generatePdfHelper.js";
import { ref } from "vue";
import UserProxy from '@/proxies/UserProxy.js';
import { useAuthStore } from '@/stores/auth.store';

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
        BaseModal,
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
            pdfLoaded: false,
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
            normasPage: 1,
            normasPerPage: 5,
            typedResumen: '',
            resumenDone: false,
            typingTimer: null,
        };
    },
    methods: {
        startTypingResumen() {
            if (this.typingTimer) clearTimeout(this.typingTimer);
            this.typedResumen = '';
            this.resumenDone  = false;

            const html      = this.datos?.RESUMEN || '';
            const plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            if (!plainText) { this.resumenDone = true; return; }

            // Velocidad adaptativa: terminar en 5-8 segundos independiente del largo
            const duration = Math.min(8000, Math.max(4000, plainText.length * 15));
            const speed    = duration / plainText.length;
            let i          = 0;

            const step = () => {
                if (i < plainText.length) {
                    this.typedResumen += plainText[i++];
                    this.typingTimer  = setTimeout(step, speed);
                } else {
                    this.resumenDone = true;
                }
            };
            step();
        },
        skipTyping() {
            // Click en el resumen → salta al texto completo
            if (!this.resumenDone) {
                if (this.typingTimer) clearTimeout(this.typingTimer);
                const html      = this.datos?.RESUMEN || '';
                this.typedResumen = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                this.resumenDone  = true;
            }
        },
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
                .finally(() => {
                    this.pdfLoaded = true;
                });
        },
        async printResumen(item) {
            try {
                this.pdfUrlResumen = "data:application/pdf;base64," + (await createPDFHelper.generate(item, true));
            } catch (error) {
                console.error("Error al generar el PDF:", error);
            }
        },
        puedeAcceder(clave) {
            return useAuthStore().puedeAcceder(clave);
        },
        descargarResolucion(tipo) {
            if (!this.puedeAcceder('busqueda.descargar')) {
                toast.warn('No tienes acceso a descargar documentos en tu plan actual');
                return;
            }
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
            if (!this.puedeAcceder('favoritos')) {
                toast.warn('No tienes acceso a favoritos en tu plan actual');
                return;
            }
            if (item.IDFAV > 0) return

            this.isLoading = true;
            await UserProxy.addFavorite(item.ID)
                .then((response) => {
                    const res = response?.DATA ?? response;
                    if (res?.STATUS ?? response?.STATUS) {
                        toast.success("Documento agregado a favoritos", { toastId: "success" });
                        item.IDFAV = res?.IDFAV ?? response?.IDFAV ?? 1;
                    } else {
                        toast.error(res?.MESSAGE || response?.MESSAGE || 'Error al agregar a favoritos', { toastId: "error" });
                    }
                })
                .catch(() => {
                    toast.error("Ocurrió un error al agregar a favoritos", { toastId: "error" });
                })
                .finally(() => this.isLoading = false);
        },
        async deleteFavorite(item) {
            this.isLoading = true;
            await UserProxy.deleteFavorite(item.IDFAV)
                .then((response) => {
                    const res = response?.DATA ?? response;
                    if (res?.STATUS ?? response?.STATUS) {
                        toast.success("Documento eliminado de favoritos");
                        item.IDFAV = 0;
                    } else {
                        toast.error(res?.MESSAGE || response?.MESSAGE || 'Error al eliminar de favoritos');
                    }
                })
                .catch(() => toast.error('Error al eliminar de favoritos', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
        },
        copyToClipboard() {
            if (!this.puedeAcceder('busqueda.copiar')) {
                toast.warn('No tienes acceso a copiar en tu plan actual');
                return;
            }
            let textToCopy = '';

            if (this.datos.TYPE === 'jurisprudences') {
                textToCopy = this.datos.TITULO || '';
            } else if (this.datos.TYPE === 'legislations') {
                const titulo = this.datos.TITULO || '';
                const denominacion = this.datos.RTITLE || '';
                textToCopy = denominacion ? `${titulo} - ${denominacion}` : titulo;
            } else {
                textToCopy = this.datos.TITULO || '';
            }

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    this.showCopyMessage = true;
                    setTimeout(() => {
                        this.showCopyMessage = false;
                    }, 1500);
                })
                .catch(() => {});
        },
        prevNormasPage() {
            if (this.normasPage > 1) this.normasPage--;
        },
        nextNormasPage() {
            if (this.normasPage < this.normasTotalPages) this.normasPage++;
        },
        highlightText(text) {
            if (!text || !this.searchText) return text;

            const searchTextValue = typeof this.searchText === 'object' ? this.searchText.DESCP : this.searchText;
            if (!searchTextValue || searchTextValue.trim() === '') return text;

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

            const searchWords = searchTextValue.trim().split(/\s+/);

            let regex;
            if (this.modoBusqueda === 1 || this.modoBusqueda === 2) {
                const filteredWords = searchWords.filter(word =>
                    !stopWords.includes(word.toLowerCase()) && word.length > 0
                );

                if (filteredWords.length === 0) {
                    return text;
                }

                const escapedWords = filteredWords.map(word =>
                    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                );

                regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
            } else if (this.modoBusqueda === 3) {
                const escapedPhrase = searchTextValue.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regex = new RegExp(`(${escapedPhrase})`, 'gi');
            }

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
                        this.$nextTick(() => this.startTypingResumen());
                    } finally {
                        this.isLoadingNavigation = false;
                    }
                }
            },
            deep: true
        },
        activeTab(val) {
            // Al cambiar a cualquier tab, reiniciar typewriter para el nuevo contexto
            if (val === 'tab1' || val === 'tab2') {
                this.$nextTick(() => this.startTypingResumen());
            }
        },
        show(val) {
            if (!val) {
                this.toggleModal();
                this.pdfUrl        = '';
                this.pdfUrlResumen = '';
                this.pdfLoaded     = false;
                this.datos         = {};
                this.activeTab     = 'tab1';
                if (this.typingTimer) clearTimeout(this.typingTimer);
                this.typedResumen  = '';
                this.resumenDone   = false;
            } else {
                this.pdfLoaded = false;
                this.print(this.data.ENTRIEFILE);
                this.printResumen(this.data);
                this.datos = this.data;
                // Iniciar typewriter al abrir el modal (tab1 es el default)
                this.$nextTick(() => this.startTypingResumen());
            }
        },
    }
}
</script>

<style scoped>
/* ::before pseudo-element — no Tailwind equivalent */
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

/* Vue transition classes */
.fade-scale-enter-active,
.fade-scale-leave-active { transition: all 0.2s ease; }
.fade-scale-enter-from { opacity: 0; transform: translateY(-50%) translateX(-5px); }
.fade-scale-leave-to { opacity: 0; transform: translateY(-50%) translateX(-5px); }

/* :not(:disabled) compound selectors — no Tailwind equivalent */
.nav-btn-side:hover:not(:disabled) { background: #f8f9fa; border-color: #1864FF; transform: translateY(-50%) scale(1.1); box-shadow: 0 6px 20px rgba(24, 100, 255, 0.25); }
.nav-btn-side:active:not(:disabled) { transform: translateY(-50%) scale(0.95); }
.nav-btn-side svg { stroke: #495057; transition: stroke 0.3s ease; }
.nav-btn-side:hover:not(:disabled) svg { stroke: #1864FF; }
.nav-btn-side:disabled svg { stroke: #adb5bd; }
.dark .nav-btn-side:hover:not(:disabled) { background: #1e293b; border-color: #93c5fd; box-shadow: 0 6px 20px rgba(147, 197, 253, 0.25); }
.dark .nav-btn-side svg { stroke: #94a3b8; }
.dark .nav-btn-side:hover:not(:disabled) svg { stroke: #93c5fd; }
.dark .nav-btn-side:disabled svg { stroke: #4b5563; }

/* ── Tab navigation ── */
.modal-tabs-nav {
    display: flex;
    gap: 4px;
    padding: 0 1.25rem;
    border-bottom: 2px solid #e9ecef;
    margin-bottom: 0;
}
.dark .modal-tabs-nav { border-bottom-color: #374151; }

.mtab {
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    padding: 0.55rem 1.25rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #6c757d;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
}
.mtab:hover { color: #1864FF; border-bottom-color: #1864FF; }
.mtab.active { color: #1864FF; border-bottom-color: #1864FF; }
.dark .mtab { color: #94a3b8; }
.dark .mtab:hover, .dark .mtab.active { color: #93c5fd; border-bottom-color: #93c5fd; }

/* ── Tab body ── */
.modal-tab-body { padding: 1rem 1.25rem 1.25rem; }

/* ── Two-column layout ── */
.modal-two-col {
    display: flex;
    gap: 1.25rem;
    align-items: stretch;
    height: calc(100vh - 240px);
    min-height: 480px;
}
@media (max-width: 768px) {
    .modal-two-col { flex-direction: column; height: auto; }
}

.modal-info-col {
    width: 38%;
    min-width: 240px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    overflow-y: auto;
}
.dark .modal-info-col { background: #0f172a; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
@media (max-width: 768px) {
    .modal-info-col { width: 100%; }
}

.modal-pdf-col {
    flex: 1;
    min-width: 0;
    border-radius: 12px;
    overflow: hidden;
    background: #f8f9fa;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.dark .modal-pdf-col { background: #0f172a; }
@media (max-width: 768px) {
    .modal-pdf-col { width: 100%; height: 420px; min-height: 320px; }
}

/* ── Info fields ── */
.mif {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.88rem;
    color: #212529;
    line-height: 1.5;
}
.mif:last-of-type { border-bottom: none; }
.mif-lbl {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #6c757d;
}
.dark .mif { border-bottom-color: #374151; color: #e2e8f0; }
.dark .mif-lbl { color: #94a3b8; }

/* ── Normas vinculadas ── */
.mif-normas { padding: 0.75rem 0 0; border-top: 1px solid #f0f0f0; margin-top: 0.25rem; }
.dark .mif-normas { border-top-color: #374151; }
.normas-list { list-style: none; padding: 0; margin: 0.4rem 0 0; display: flex; flex-direction: column; gap: 4px; }
.normas-list a {
    display: block;
    font-size: 0.72rem;
    color: #1864FF;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 0.3rem 0.5rem;
    text-decoration: none;
    line-height: 1.4;
    transition: background 0.15s, color 0.15s;
}
.normas-list a:hover { background: #e8f0fe; color: #0d47a1; text-decoration: underline; }
.dark .normas-list a { background: #1e293b; border-color: #374151; color: #93c5fd; }
.dark .normas-list a:hover { background: #374151; color: #bfdbfe; }

/* ── Action buttons ── */
.modal-actions { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 1rem; padding-top: 1rem; border-top: 1.5px solid #f0f0f0; }
.dark .modal-actions { border-top-color: #374151; }
.maction-btn {
    display: flex; align-items: center; justify-content: center;
    gap: 0.4rem;
    padding: 0.6rem 1rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}
.maction-download {
    background: linear-gradient(135deg, #1864FF 0%, #0047CC 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(24,100,255,0.25);
}
.maction-download:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(24,100,255,0.35); }
.maction-outline {
    background: transparent;
    border: 2px solid #1864FF !important;
    color: #1864FF;
}
.maction-outline:hover { background: #1864FF; color: #fff; }
.dark .maction-outline { border-color: #93c5fd !important; color: #93c5fd; }
.dark .maction-outline:hover { background: #93c5fd; color: #0f172a; }
.maction-fav { background: #fff; color: #555; border: 1.5px solid #e0e0e0 !important; }
.maction-fav:hover { border-color: #ffc107 !important; background: #fffbf0; color: #333; }
.maction-fav--active { background: #fff8e1; color: #f57c00; border: 1.5px solid #ffc107 !important; }
.maction-fav--active:hover { background: #ffecb3; }
.dark .maction-fav { background: #0f172a; border-color: #374151 !important; color: #94a3b8; }
.dark .maction-fav:hover { border-color: #fbbf24 !important; background: rgba(251,191,36,0.1); color: #e2e8f0; }

/* ── PDF loading area ── */
.pdf-load-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1rem;
    color: #6c757d;
    font-size: 0.9rem;
}
.pdf-load-area p { margin: 0; }

/* Paginación normas vinculadas — ::v-deep() */
.normas-pagination { margin-top: 0.5rem; display: flex; align-items: center; gap: 0.4rem; }
.normas-pagination ::v-deep(.pagination) { margin: 0; font-size: 0.78rem; }
.normas-pagination ::v-deep(.page-link) { padding: 0.28rem 0.5rem; min-width: 30px; height: 32px; line-height: 1.1; border-radius: 6px; }
.normas-pagination ::v-deep(.page-item.active .page-link) { background: linear-gradient(135deg, #6B5CFF 0%, #5BC0DE 100%); color: #ffffff; border-color: transparent; box-shadow: none; }
.normas-pagination ::v-deep(.page-item.disabled .page-link) { opacity: 0.6; }

/* highlight-text aplicado via v-html — no targeteable con Tailwind */
.highlight-text { background: linear-gradient(135deg, #fef08a 0%, #fde047 100%); padding: 0.125rem 0.25rem; border-radius: 3px; font-weight: 500; color: #1f2937; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.dark .highlight-text { background: linear-gradient(135deg, #854d0e 0%, #a16207 100%); color: #fef08a; }

/* ── Resumen IA ── */
.resumen-ia-block { border-top: 1px solid #f0f0f0; padding-top: 0.75rem; }
.dark .resumen-ia-block { border-top-color: #374151; }

.ia-badge {
    display: inline-flex; align-items: center; gap: 3px;
    background: linear-gradient(135deg, #9333ea, #7c3aed);
    color: #fff; font-size: 0.58rem; font-weight: 700;
    padding: 1px 5px; border-radius: 4px;
    letter-spacing: 0.5px; vertical-align: middle; margin-left: 5px;
}

.resumen-body {
    margin-top: 0.35rem; font-size: 0.85rem; line-height: 1.65;
    color: #374151; cursor: pointer;
}
.dark .resumen-body { color: #d1d5db; }
.resumen-body p { margin: 0 0 0.5rem; }
.resumen-body p:last-child { margin-bottom: 0; }

.resumen-typing-text {
    margin: 0; white-space: pre-wrap; word-break: break-word;
    font-size: 0.85rem; color: inherit; line-height: 1.65;
}

.cursor-blink {
    display: inline-block; margin-left: 1px;
    color: #7c3aed; font-weight: 300; font-size: 1rem; line-height: 1;
    animation: blink-caret 0.75s step-end infinite;
}
@keyframes blink-caret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>

<style>
/* PDF loading spinner */
.pdf-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 3px solid #e9ecef;
    border-top-color: #1864FF;
    animation: pdf-spin 0.7s linear infinite;
}
@keyframes pdf-spin {
    to { transform: rotate(360deg); }
}
</style>
