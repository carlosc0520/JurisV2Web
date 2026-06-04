<template>
    <b-modal id="modalEditarNoticia" v-model="isShow" @ok="submit" @cancel="close" @hidden="close" size="xl"
        ok-title="Guardar" cancel-title="Cancelar" title="Editar Investigación" bodyScrolling no-close-on-backdrop
        no-close-on-esc :hide-footer="loadingSubmit">

        <form id="formEditarNoticia" @submit.prevent="submit">
            <div class="row">
                <!-- TIPO (solo lectura) -->
                <div class="col-md-6 col-12 mb-3">
                    <label class="form-label">Tipo</label>
                    <input type="text" class="form-control" readonly
                        :value="selects.categorias?.find(t => t.value === modelo.TIPO)?.text || '-'" />
                </div>

                <!-- TITULO -->
                <div class="col-md-6 col-12 mb-3">
                    <label class="form-label">Título <span class="text-danger">*</span></label>
                    <input type="text" :class="{ error: validation.hasError('modelo.TITULO') }" v-model="modelo.TITULO"
                        class="form-control" />
                    <span class="message" v-if="validation.hasError('modelo.TITULO')">
                        {{ validation.firstError('modelo.TITULO') }}
                    </span>
                </div>

                <!-- SUBTITULO -->
                <div class="col-12 mb-3" v-if="isView.SUBTITULOS.includes(modelo.TIPO)">
                    <label class="form-label">Subtítulo <span class="text-danger">*</span></label>
                    <input type="text" :class="{ error: validation.hasError('modelo.SUBTITULO') }" v-model="modelo.SUBTITULO"
                        class="form-control" />
                    <span class="message" v-if="validation.hasError('modelo.SUBTITULO')">
                        {{ validation.firstError('modelo.SUBTITULO') }}
                    </span>
                </div>

                <!-- IMAGEN -->
                <div class="col-12 mb-3">
                    <label class="form-label">Imagen de portada <span class="text-danger">*</span></label>
                    <div class="dropzone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileSelect">
                        <p v-if="!preview">Arrastra una imagen aquí o haz clic para seleccionar</p>
                        <img v-if="preview" :src="preview" class="preview" />
                        <input type="file" ref="fileInput" accept="image/*" @change="handleFile" hidden />
                    </div>
                    <div v-if="modelo.IMAGEN" class="mt-2">
                        <a :href="'https://jurissearch.com' + modelo.IMAGEN" target="_blank" class="btn-download">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Descargar imagen actual
                        </a>
                    </div>
                </div>

                <!-- AUTORES -->
                <div class="col-12 mb-3">
                    <label class="form-label">Autores <span class="text-danger">*</span></label>
                    <el-tree-select :class="{ error: validation.hasError('modelo.IDAUTORES') }"
                        v-model="modelo.IDAUTORES" :data="selects.autores" multiple :render-after-expand="false"
                        placeholder="Seleccione una opción" show-checkbox check-strictly check-on-click-node filterable
                        no-data-text="No hay opciones disponibles" clearable collapse-tags :max-collapse-tags="1" />
                    <span class="message" v-if="validation.hasError('modelo.IDAUTORES')">
                        {{ validation.firstError('modelo.IDAUTORES') }}
                    </span>
                </div>

                <!-- ORGANO -->
                <div class="col-md-6 col-12 mb-3" v-if="isView.ORGANOS.includes(modelo.TIPO)">
                    <label class="form-label">Órgano jurisdiccional <span class="text-danger">*</span></label>
                    <el-tree-select
                        v-model="modelo.ORGANO"
                        :class="{ error: validation.hasError('modelo.ORGANO') }"
                        :data="selects.organos"
                        :render-after-expand="false"
                        placeholder="Seleccione un órgano"
                        check-strictly
                        check-on-click-node
                        filterable
                        no-data-text="No hay opciones disponibles"
                        clearable />
                    <span class="message" v-if="validation.hasError('modelo.ORGANO')">
                        {{ validation.firstError('modelo.ORGANO') }}
                    </span>
                </div>

                <!-- FECHA PUBLICACIÓN -->
                <div class="col-md-6 col-12 mb-3" v-if="isView.FECHAS_PUB.includes(modelo.TIPO)">
                    <label class="form-label">Fecha de publicación <span class="text-danger">*</span></label>
                    <input type="date" v-model="modelo.FCHPUB" class="form-control"
                        :class="{ error: validation.hasError('modelo.FCHPUB') }" />
                    <span class="message" v-if="validation.hasError('modelo.FCHPUB')">
                        {{ validation.firstError('modelo.FCHPUB') }}
                    </span>
                </div>

                <!-- FECHA CONSULTA -->
                <div class="col-md-6 col-12 mb-3" v-if="isView.FECHAS_CONSULTA.includes(modelo.TIPO)">
                    <label class="form-label">Fecha de consulta <span class="text-danger">*</span></label>
                    <input type="date" v-model="modelo.FCHCONSULTA" class="form-control"
                        :class="{ error: validation.hasError('modelo.FCHCONSULTA') }" />
                    <span class="message" v-if="validation.hasError('modelo.FCHCONSULTA')">
                        {{ validation.firstError('modelo.FCHCONSULTA') }}
                    </span>
                </div>

                <!-- PDF (todos los tipos) -->
                <div class="col-12 mb-3" v-if="modelo.TIPO">
                    <label class="form-label">Documento PDF <span v-if="!modelo.ARCHIVO" class="text-danger">*</span></label>
                    <div class="dropzone-pdf" @click="triggerPdfSelect">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <p>{{ pdfFileName || (modelo.ARCHIVO ? modelo.ARCHIVO.split('/').pop() : 'Haz clic para seleccionar un PDF') }}</p>
                        <input type="file" ref="pdfInput" accept="application/pdf" @change="handlePdf" hidden />
                    </div>
                    <div v-if="modelo.ARCHIVO && !pdfFile" class="mt-2">
                        <a :href="'https://jurissearch.com' + modelo.ARCHIVO" target="_blank" class="btn-download">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Descargar PDF actual
                        </a>
                    </div>
                </div>
            </div>
        </form>
        <template #footer>
            <div class="modal-footer d-flex flex-wrap justify-content-center gap-3">
                <button type="button" class="btn btn-primary" @click="submit">Guardar</button>
                <button type="button" class="btn btn-secondary" @click="close">Cancelar</button>
            </div>
        </template>
    </b-modal>
</template>


<script>
import { BModal } from 'bootstrap-vue-next';
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';

// * PROXY
import MantenimientoProxy from "../../../proxies/MantenimientoProxy";

export default {
    components: { BModal },
    props: {
        show: { type: Boolean, default: false },
        close: { type: Function, default: () => {} },
        update: { type: Function, default: () => {} },
        data: { type: Object, default: () => ({}) },
        role: { type: Object, default: () => {} },
        selects: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            isView: {
                SUBTITULOS: [8, 10],
                FECHAS_PUB: [6, 8, 10, 11],
                FECHAS_CONSULTA: [9],
                ORGANOS: [8],
            },
            isShow: false,
            loadingSubmit: false,
            preview: null,
            file: null,
            pdfFile: null,
            pdfFileName: null,
            modelo: {
                ID: null,
                TIPO: null,
                TITULO: null,
                SUBTITULO: null,
                IMAGEN: null,
                IDAUTORES: [],
                ORGANO: null,
                FCHPUB: null,
                FCHCONSULTA: null,
                ARCHIVO: null,
            },
        };
    },
    validators: {
        'modelo.TIPO': function (value) {
            return Validator.value(value).required('Campo requerido');
        },
        'modelo.TITULO': function (value) {
            return Validator.value(value).required('Campo requerido');
        },
        'modelo.IDAUTORES': function (value) {
            return Validator.value(value).required('Campo requerido');
        },
        'modelo.SUBTITULO': function (value) {
            if (this.isView.SUBTITULOS.includes(this.modelo.TIPO)) {
                return Validator.value(value).required('Campo requerido');
            }
        },
        'modelo.ORGANO': function (value) {
            if (this.isView.ORGANOS.includes(this.modelo.TIPO)) {
                return Validator.value(value).required('Campo requerido');
            }
        },
        'modelo.FCHPUB': function (value) {
            if (this.isView.FECHAS_PUB.includes(this.modelo.TIPO)) {
                return Validator.value(value).required('Campo requerido');
            }
        },
        'modelo.FCHCONSULTA': function (value) {
            if (this.isView.FECHAS_CONSULTA.includes(this.modelo.TIPO)) {
                return Validator.value(value).required('Campo requerido');
            }
        },
    },
    methods: {
        async submit(e) {
            e.preventDefault();
            if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-permisos' });
            if (!this.modelo.ID) return toast.warning('No se encontró el identificador del registro', { toastId: 'warning-id' });
            if (!this.file && !this.modelo.IMAGEN) return toast.warning('Seleccione una imagen de portada', { toastId: 'warning-imagen' });
            if (this.modelo.TIPO && !this.pdfFile && !this.modelo.ARCHIVO) {
                return toast.warning('El documento PDF es requerido para este tipo', { toastId: 'warning-pdf' });
            }

            const validate = await this.$validate();
            if (!validate) return;

            this.loadingSubmit = true;
            const loadingToast = toast.loading('Espere un momento...');

            const formData = new FormData();
            formData.append('ID', this.modelo.ID);
            formData.append('TIPO', this.modelo.TIPO);
            formData.append('TITULO', this.modelo.TITULO);
            formData.append('SUBTITULO', this.modelo.SUBTITULO || '');
            formData.append('IMAGEN', this.modelo.IMAGEN || '');
            formData.append('ARCHIVO', this.modelo.ARCHIVO || '');
            formData.append('FCHPUB', this.modelo.FCHPUB || '');
            formData.append('FCHCONSULTA', this.modelo.FCHCONSULTA || '');
            formData.append('ORGANO', this.modelo.ORGANO || '');
            formData.append('IDAUTORES', this.modelo.IDAUTORES?.length ? this.modelo.IDAUTORES.join(',') : '');
            if (this.file) formData.append('files', this.file);
            if (this.pdfFile) formData.append('pdf', this.pdfFile);

            await MantenimientoProxy.edit(formData)
                .then(response => {
                    if (response.STATUS) {
                        toast.success('Registro editado correctamente');
                        this.reset();
                        this.update();
                        this.close();
                    } else {
                        toast.error(response.MESSAGE || 'Error al editar el registro');
                    }
                })
                .catch(err => toast.error(err?.MESSAGE || 'Error al editar el registro'))
                .finally(() => {
                    toast.remove(loadingToast);
                    this.loadingSubmit = false;
                });
        },
        triggerFileSelect() {
            this.$refs.fileInput.click();
        },
        triggerPdfSelect() {
            this.$refs.pdfInput.click();
        },
        handleFile(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.preview = URL.createObjectURL(file);
                this.file = file;
            }
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.preview = URL.createObjectURL(file);
                this.file = file;
            }
        },
        handlePdf(event) {
            const file = event.target.files[0];
            if (file && file.type === 'application/pdf') {
                this.pdfFile = file;
                this.pdfFileName = file.name;
            }
        },
        reset() {
            this.modelo = {
                ID: null, TIPO: null, TITULO: null, SUBTITULO: null, IMAGEN: null,
                IDAUTORES: [], ORGANO: null, FCHPUB: null, FCHCONSULTA: null, ARCHIVO: null,
            };
            this.preview = null;
            this.file = null;
            this.pdfFile = null;
            this.pdfFileName = null;
            this.validation.reset();
        },
    },
    watch: {
        show: {
            handler(value) {
                if (value && this.data) {
                    this.modelo = {
                        ID: this.data.ID,
                        TIPO: this.data.TIPO || 1,
                        TITULO: this.data.TITULO,
                        SUBTITULO: this.data.SUBTITULO || null,
                        IMAGEN: this.data.IMAGEN || null,
                        IDAUTORES: this.data.IDAUTORES ? this.data.IDAUTORES.split(',').map(Number) : [],
                        ORGANO: this.data.ORGANO ? Number(this.data.ORGANO) : null,
                        FCHPUB: this.data.FCHPUB ? this.data.FCHPUB.substring(0, 10) : null,
                        FCHCONSULTA: this.data.FCHCONSULTA ? this.data.FCHCONSULTA.substring(0, 10) : null,
                        ARCHIVO: this.data.ARCHIVO || null,
                    };
                    this.preview = this.data.IMAGEN ? ('https://jurissearch.com/' + this.data.IMAGEN) : null;
                    this.file = null;
                    this.pdfFile = null;
                    this.pdfFileName = null;
                    this.$nextTick(() => {
                        if (this.$refs.fileInput) this.$refs.fileInput.value = null;
                    });
                }
                if (!value) this.reset();
                this.isShow = value;
            }
        },
    }
}
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
<style scoped>
.dropzone-pdf {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 16px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #555;
    transition: border-color 0.2s, color 0.2s;
}
.dropzone-pdf:hover {
    border-color: #3b82f6;
    color: #3b82f6;
}
.dropzone-pdf p {
    margin: 0;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.btn-download {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    padding: 4px 10px;
    border: 1px solid #c7d2fe;
    border-radius: 6px;
    background: #eef2ff;
    transition: all 0.2s;
}
.btn-download:hover {
    background: #e0e7ff;
    border-color: #818cf8;
    color: #4338ca;
}
</style>
