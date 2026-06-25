<template>
    <b-modal id="modal-resolucion-visualizar" v-model="show" title="" hide-footer centered size="xl" modal-class="custom-modal">
        <!-- Botones de navegación laterales -->
        <button
            v-if="show && showNavigation"
            @click="$emit('navigate', 'prev')"
            :disabled="currentIndex <= 0"
            class="nav-btn-side fixed top-1/2 -translate-y-1/2 left-5 max-sm:left-2.5 bg-white/95 border-2 border-[#dee2e6] rounded-full w-12 h-12 max-sm:w-10 max-sm:h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1060] backdrop-blur-[10px] disabled:bg-[rgba(233,236,239,0.5)] disabled:cursor-not-allowed disabled:opacity-40"
            title="Anterior (Resultado {{ currentIndex }} de {{ totalResults }})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <button
            v-if="show && showNavigation"
            @click="$emit('navigate', 'next')"
            :disabled="currentIndex >= totalResults - 1"
            class="nav-btn-side fixed top-1/2 -translate-y-1/2 right-5 max-sm:right-2.5 bg-white/95 border-2 border-[#dee2e6] rounded-full w-12 h-12 max-sm:w-10 max-sm:h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1060] backdrop-blur-[10px] disabled:bg-[rgba(233,236,239,0.5)] disabled:cursor-not-allowed disabled:opacity-40"
            title="Siguiente (Resultado {{ currentIndex + 2 }} de {{ totalResults }})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

        <div class="pb-6 border-b-2 border-[#f0f0f0] mb-4">
            <h4 class="text-2xl font-bold text-[#1864FF] mb-2 leading-[1.4]">{{ datos.TITULO }}</h4>
            <p class="text-[0.95rem] text-[#6c757d] mb-0 mt-2" v-if="!isFav">
                <span>{{ datos.TITLEALT }}</span>
            </p>
        </div>

        <b-tabs content-class="mt-4" v-model="activeTab" class="custom-tabs">
            <!-- TAB 1 -->
            <b-tab event-key="tab1" title="Documento" active>
                <b-row class="g-4">
                    <!-- Primera columna -->
                    <b-col v-if="datos.TYPE == 'jurisprudences'" cols="12" lg="4">
                        <div class="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 h-full transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] max-sm:p-4">
                            <b-list-group class="info-list">
                                <b-list-group-item><strong>Delito:</strong>
                                    <span>{{datos.DELITO?.length > 0 ? datos.DELITO?.map(d => d.DESCP).join(', ') : '-'}}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Órgano Jurisdiccional:</strong>
                                    <span>{{datos.OJURISDICCIONAL?.length > 0 ? datos.OJURISDICCIONAL?.map(o => o.DESCP).join(', ') : '-'}}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Tema:</strong>
                                    <p v-html="datos.TEMA"></p>
                                </b-list-group-item>
                                <b-list-group-item><strong>Subtema:</strong>
                                    <p v-html="datos.SUBTEMA"></p>
                                </b-list-group-item>
                                <b-list-group-item><strong>Palabras Clave:</strong>
                                    <span>{{datos.KEYWORDS?.split(',').map(p => p.trim()).join(', ')}}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Fecha Resolución:</strong>
                                    <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                                </b-list-group-item>
                            </b-list-group>

                            <div class="flex flex-col gap-3 mt-6 pt-6 border-t-2 border-[#f0f0f0]" v-if="puedeAcceder('favoritos') || puedeAcceder('busqueda.descargar')">
                                <button v-if="puedeAcceder('favoritos') && datos.IDFAV == null && isFav" @click="addFavorite(datos)"
                                    class="group text-[0.875rem] font-medium bg-white text-[#666] border-[1.5px] border-[#e0e0e0] py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 hover:border-[#ffc107] hover:bg-[#fffbf0] hover:text-[#333]">
                                    <span class="text-[1.1rem] leading-none transition-transform duration-200 group-hover:scale-110">☆</span>
                                    <span>Agregar a favoritos</span>
                                </button>
                                <button v-if="puedeAcceder('favoritos') && datos.IDFAV != null && isFav" @click="deleteFavorite(datos)"
                                    class="group text-[0.875rem] font-medium bg-[#fff8e1] text-[#f57c00] border-[1.5px] border-[#ffc107] py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-[#ffecb3]">
                                    <span class="text-[#ffc107] text-[1.1rem] leading-none">★</span>
                                    <span>Quitar de favoritos</span>
                                </button>
                                <button v-if="puedeAcceder('busqueda.descargar')" class="group text-[0.9rem] font-semibold bg-gradient-to-br from-[#1864FF] to-[#0047CC] text-white border-0 py-3 px-5 rounded-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_2px_8px_rgba(24,100,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(24,100,255,0.4)] hover:from-[#0047CC] hover:to-[#003399] active:translate-y-0 max-sm:text-[0.85rem] max-sm:py-2.5 max-sm:px-4" @click="descargarResolucion(1)">
                                    <img src="@/assets/img/icons/download.svg" alt="Descargar" class="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-y-0.5">
                                    <span>Descargar Resolución</span>
                                </button>
                            </div>
                        </div>
                    </b-col>

                    <b-col v-if="datos.TYPE != 'jurisprudences'" cols="12" lg="4">
                        <div class="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 h-full transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] max-sm:p-4">
                            <b-list-group class="info-list">
                                <b-list-group-item><strong>Numeración:</strong>
                                    <span>{{ datos.NMRCN }}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Denominación oficial:</strong>
                                    <span>{{ datos.RTITLE }}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Tipo de Norma:</strong>
                                    <span>{{datos.TPONRMA?.length > 0 ? datos.TPONRMA?.map(o => o.DESCP).join(', ') : '-'}}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Órgano emisor:</strong>
                                    <span>{{datos.OEMISOR?.length > 0 ? datos.OEMISOR?.map(o => o.DESCP).join(', ') : '-'}}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Fecha de publicación:</strong>
                                    <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Estado:</strong>
                                    <span>{{ datos.SITUACION }}</span>
                                </b-list-group-item>
                            </b-list-group>

                            <div class="flex flex-col gap-3 mt-6 pt-6 border-t-2 border-[#f0f0f0]" v-if="puedeAcceder('favoritos') || puedeAcceder('busqueda.descargar')">
                                <button v-if="puedeAcceder('favoritos') && datos.IDFAV == null" @click="addFavorite(datos)"
                                    class="group text-[0.875rem] font-medium bg-white text-[#666] border-[1.5px] border-[#e0e0e0] py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 hover:border-[#ffc107] hover:bg-[#fffbf0] hover:text-[#333]">
                                    <span class="text-[1.1rem] leading-none transition-transform duration-200 group-hover:scale-110">☆</span>
                                    <span>Agregar a favoritos</span>
                                </button>
                                <button v-if="puedeAcceder('favoritos') && datos.IDFAV != null" @click="deleteFavorite(datos)"
                                    class="group text-[0.875rem] font-medium bg-[#fff8e1] text-[#f57c00] border-[1.5px] border-[#ffc107] py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-[#ffecb3]">
                                    <span class="text-[#ffc107] text-[1.1rem] leading-none">★</span>
                                    <span>Quitar de favoritos</span>
                                </button>
                                <button v-if="puedeAcceder('busqueda.descargar')" class="group text-[0.9rem] font-semibold bg-gradient-to-br from-[#1864FF] to-[#0047CC] text-white border-0 py-3 px-5 rounded-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_2px_8px_rgba(24,100,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(24,100,255,0.4)] hover:from-[#0047CC] hover:to-[#003399] active:translate-y-0 max-sm:text-[0.85rem] max-sm:py-2.5 max-sm:px-4" @click="descargarResolucion(1)">
                                    <img src="@/assets/img/icons/download.svg" alt="Descargar" class="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-y-0.5">
                                    <span>Descargar Resolución</span>
                                </button>
                            </div>
                        </div>
                    </b-col>

                    <!-- Segunda columna -->
                    <b-col cols="12" lg="8">
                        <div class="bg-[#f8f9fa] rounded-xl p-4 h-[calc(100vh-150px)] min-h-[600px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-lg:h-[500px]">
                            <div v-if="!pdfUrl || isLoadingNavigation" class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-lg gap-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                                <p class="text-base text-[#6c757d] m-0">{{ isLoadingNavigation ? 'Cargando siguiente documento...' : 'Cargando documento...' }}</p>
                            </div>
                            <iframe v-else
                                :src="pdfUrl + '#zoom=100&view=fitH' + (['2', '3', '4'].includes(role?.IDPLN) ? '' : '&controls=0&toolbar=0')"
                                class="border border-[#dee2e6] rounded-lg w-full h-full bg-white"></iframe>
                        </div>
                    </b-col>
                </b-row>
            </b-tab>

            <!-- TAB 2 -->
            <b-tab v-if="datos.TYPE == 'jurisprudences' && puedeAcceder('busqueda.descargar')" event-key="tab2" title="Resumen Ejecutivo">
                <b-row class="g-4">
                    <!-- Primera columna -->
                    <b-col cols="12" lg="4">
                        <div class="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 h-full transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] max-sm:p-4">
                            <b-list-group class="info-list">
                                <b-list-group-item><strong>Tipo de Recurso:</strong>
                                    <span>{{datos.RECURSO?.length > 0 ? datos.RECURSO?.map(d => d.DESCP).join(', ') : '-'}}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Delitos:</strong>
                                    <span>{{datos.DELITO?.length > 0 ? datos.DELITO?.map(d => d.DESCP).join(', ') : '-'}}</span>
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
                                    <span>{{datos.KEYWORDS?.split(',').map(p => p.trim()).join(', ')}}</span>
                                </b-list-group-item>
                                <b-list-group-item><strong>Fecha Resolución:</strong>
                                    <span>{{ formateReverse(datos.FRESOLUTION) }}</span>
                                </b-list-group-item>
                            </b-list-group>

                            <div class="flex flex-col gap-3 mt-6 pt-6 border-t-2 border-[#f0f0f0]">
                                <button class="group text-[0.9rem] font-semibold bg-white border-2 border-[#1864FF] text-[#1864FF] py-3 px-5 rounded-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#1864FF] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(24,100,255,0.3)] active:translate-y-0 max-sm:text-[0.85rem] max-sm:py-2.5 max-sm:px-4" @click="descargarResolucion(2)">
                                    <img src="@/assets/img/icons/download-dark.svg" alt="Descargar" class="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-y-0.5">
                                    <span>Descargar Resumen</span>
                                </button>
                            </div>
                        </div>
                    </b-col>

                    <!-- Segunda columna -->
                    <b-col cols="12" lg="8">
                        <div class="bg-[#f8f9fa] rounded-xl p-4 h-[calc(100vh-150px)] min-h-[600px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-lg:h-[500px]">
                            <div v-if="!pdfUrlResumen || isLoadingNavigation" class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-lg gap-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                                <p class="text-base text-[#6c757d] m-0">{{ isLoadingNavigation ? 'Cargando siguiente resumen...' : 'Cargando resumen...' }}</p>
                            </div>
                            <iframe v-else :src="pdfUrlResumen + '#zoom=100&view=fitH' + (['2', '3', '4'].includes(role?.IDPLN) ? '' : '&controls=0&toolbar=0')"
                                class="border border-[#dee2e6] rounded-lg w-full h-full bg-white"></iframe>
                        </div>
                    </b-col>
                </b-row>
            </b-tab>
        </b-tabs>
    </b-modal>
</template>

<script>
import { BModal, BTabs, BTab, BRow, BCol, BListGroup, BListGroupItem } from 'bootstrap-vue-next';
import AdminEntriesProxy from '@/proxies/AdminEntriesProxy';
import { toast } from 'vue3-toastify';
import createPDFHelper from "@/assets/helpers/generatePdfHelper.js";
import { ref } from "vue";
import UserProxy from '@/proxies/UserProxy.js';
import { useAuthStore } from '@/stores/auth.store';

export default {
    name: "ModalMostrarResolucion",
    props: {
        openModal: { type: Boolean, default: false },
        toggleModal: { type: Function, required: true },
        data: { type: Object, required: true },
        isFav: { type: Boolean, default: true },
        role: { type: Object, default: () => { } },
        currentIndex: { type: Number, default: 0 },
        totalResults: { type: Number, default: 0 },
        showNavigation: { type: Boolean, default: false }
    },
    components: {
        BModal,
        BTabs, BTab, BRow, BCol, BListGroup, BListGroupItem
    },
    data() {
        return {
            show: false,
            activeTab: ref("tab1"),
            pdfUrl: '',
            pdfUrlResumen: '',
            isLoadingNavigation: false,
            datos: {
                pretension: '',
                organo: '',
                tema: '',
                subtema: '',
                palabrasClave: '',
                fechaResolucion: ''
            },
        };
    },
    methods: {
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
            await AdminEntriesProxy.downloadFile({ PATH: path })
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
        puedeAcceder(clave) {
            return useAuthStore().puedeAcceder(clave);
        },
        descargarResolucion(tipo) {
            if (!this.puedeAcceder('busqueda.descargar')) {
                toast.warn('No tienes acceso a descargar documentos en tu plan actual');
                return;
            }
            if (tipo === 1) {
                const downloadLink = document.createElement("a");
                downloadLink.href = this.pdfUrl;
                downloadLink.download = this.data.TITULO + " - Resolución.pdf";
                downloadLink.click();
            } else {
                const downloadLink = document.createElement("a");
                downloadLink.href = this.pdfUrlResumen;
                downloadLink.download = this.data.TITULO + " - Resumen.pdf";
                downloadLink.click();
            }
        },
        async addFavorite(item) {
            if (!this.puedeAcceder('favoritos')) {
                toast.warn('No tienes acceso a favoritos en tu plan actual');
                return;
            }
            if (item.IDFAV) return
            this.isLoading = true;
            await UserProxy.addFavorite(item.ID)
                .then((response) => {
                    if (response.STATUS) {
                        toast.success("Documento agregado a favoritos", { toastId: "success" });
                        item.IDFAV = 1;
                    } else toast.error(response.MESSAGE, { toastId: "error" });
                })
                .catch(() => { toast.error("Ocurrió un error al agregar a favoritos", { toastId: "error" }); })
                .finally(() => this.isLoading = false);
        },
        async deleteFavorite(item) {
            this.isLoading = true;
            await UserProxy.addFavorite(item.ID)
                .then((response) => {
                    if (response.STATUS) {
                        toast.success("Documento eliminado de favoritos");
                        item.IDFAV = null;
                    } else { toast.error(response.MESSAGE); }
                })
                .catch((error) => toast.error(error?.MESSAGE || 'Error al eliminar de favoritos', { toastId: 'error-delete' }))
                .finally(() => this.isLoading = false);
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
/* :not(:disabled) compound selectors — no Tailwind equivalent */
.nav-btn-side:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #1864FF;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(24, 100, 255, 0.25);
}
.nav-btn-side:active:not(:disabled) { transform: translateY(-50%) scale(0.95); }
.nav-btn-side svg { stroke: #495057; transition: stroke 0.3s ease; }
.nav-btn-side:hover:not(:disabled) svg { stroke: #1864FF; }
.nav-btn-side:disabled svg { stroke: #adb5bd; }

/* Bootstrap tabs :deep() */
.custom-tabs :deep(.nav-tabs) { border-bottom: 2px solid #e9ecef; gap: 0.5rem; }
.custom-tabs :deep(.nav-link) { font-weight: 600; color: #6c757d; border: none; border-bottom: 3px solid transparent; padding: 0.75rem 1.5rem; transition: all 0.3s ease; }
.custom-tabs :deep(.nav-link:hover) { color: #1864FF; border-bottom-color: #1864FF; }
.custom-tabs :deep(.nav-link.active) { color: #1864FF; background: transparent; border-bottom-color: #1864FF; }
@media (max-width: 768px) {
    .custom-tabs :deep(.nav-link) { padding: 0.5rem 1rem; font-size: 0.9rem; }
}

/* Bootstrap list group overrides */
.info-list { --bs-list-group-border-width: 0; margin-bottom: 1.5rem; }
.list-group-item { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem 0; border-bottom: 1px solid #f0f0f0 !important; background: transparent; }
.list-group-item:last-child { border-bottom: none !important; }
.list-group-item strong { color: #495057; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.list-group-item span, .list-group-item p { font-size: 0.95rem; color: #212529; line-height: 1.6; margin: 0; }
</style>
