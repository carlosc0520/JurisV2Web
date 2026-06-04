<template>
    <b-modal id="modalAgregarNoticia" v-model="isShow" @ok="submit" @cancel="close" @hidden="close" size="xl"
        ok-title="Guardar" cancel-title="Cancelar" title="Agregar Investigación" bodyScrolling no-close-on-backdrop
        no-close-on-esc :hide-footer="loadingSubmit">

        <form id="formAgregarNoticia" @submit.prevent="submit">
            <div class="row">
                <!-- TIPO -->
                <div class="col-md-6 col-12 mb-3">
                    <label class="form-label">Tipo <span class="text-danger">*</span></label>
                    <select v-model="modelo.TIPO" class="form-control"
                        :class="{ error: validation.hasError('modelo.TIPO') }">
                        <option :value="null">-- Seleccione un tipo --</option>
                        <option v-for="t in selects.categorias" :key="t.value" :value="t.value">{{ t.text }}</option>
                    </select>
                    <span class="message" v-if="validation.hasError('modelo.TIPO')">
                        {{ validation.firstError('modelo.TIPO') }}
                    </span>
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
                    <input type="text" :class="{ error: validation.hasError('modelo.SUBTITULO') }"
                        v-model="modelo.SUBTITULO" class="form-control" />
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
                    <el-tree-select v-model="modelo.ORGANO" :class="{ error: validation.hasError('modelo.ORGANO') }"
                        :data="selects.organos" :render-after-expand="false" placeholder="Seleccione un órgano"
                        check-strictly check-on-click-node filterable no-data-text="No hay opciones disponibles"
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
                    <label class="form-label">Documento PDF <span class="text-danger">*</span></label>
                    <div class="dropzone-pdf" @click="triggerPdfSelect">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <p>{{ pdfFileName || 'Haz clic para seleccionar un PDF' }}</p>
                        <input type="file" ref="pdfInput" accept="application/pdf" @change="handlePdf" hidden />
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
        close: { type: Function, default: () => { } },
        update: { type: Function, default: () => { } },
        role: { type: Object, default: () => { } },
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

            const validate = await this.$validate();
            if (!validate) return;

            if (!this.file) return toast.warning('Seleccione una imagen de portada', { toastId: 'warning-imagen' });
            if (this.modelo.TIPO && !this.pdfFile) {
                return toast.warning('El documento PDF es requerido para este tipo', { toastId: 'warning-pdf' });
            }

            this.loadingSubmit = true;
            const loadingToast = toast.loading('Espere un momento...');

            const formData = new FormData();
            formData.append('TIPO', this.modelo.TIPO);
            formData.append('TITULO', this.modelo.TITULO);
            formData.append('SUBTITULO', this.modelo.SUBTITULO || '');
            formData.append('FCHPUB', this.modelo.FCHPUB || '');
            formData.append('FCHCONSULTA', this.modelo.FCHCONSULTA || '');
            formData.append('ORGANO', this.modelo.ORGANO || '');
            formData.append('files', this.file);
            formData.append('IDAUTORES', this.modelo.IDAUTORES?.length ? this.modelo.IDAUTORES.join(',') : '');
            if (this.pdfFile) formData.append('pdf', this.pdfFile);

            await MantenimientoProxy.create(formData)
                .then(response => {
                    if (response.STATUS) {
                        toast.success('Registro creado con éxito');
                        this.reset();
                        this.update();
                        this.close();
                    } else {
                        toast.error(response.MESSAGE || 'Error al crear el registro');
                    }
                })
                .catch(err => toast.error(err?.MESSAGE || 'Error al crear el registro'))
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
            } else {
                this.preview = null;
                this.file = null;
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
            } else {
                this.pdfFile = null;
                this.pdfFileName = null;
            }
        },
        reset() {
            this.modelo = {
                TIPO: null, TITULO: null, SUBTITULO: null, IMAGEN: null,
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
                if (!value) this.reset();
                this.isShow = value;
            }
        }
    }
}


</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
<style scoped>
.dropzone-pdf {
    border: 2px dashed #CBD5E1;
    border-radius: 10px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: border-color 0.2s;
    background: #F8FAFC;
    color: #64748B;
    font-size: 0.875rem;
}

.dropzone-pdf:hover {
    border-color: #185CE6;
    color: #185CE6;
}

.dropzone-pdf p {
    margin: 0;
}
</style>
