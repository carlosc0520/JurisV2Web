<template>
    <b-modal id="modalAgregarBoletin" v-model="isShow" @ok="submit" @cancel="close" @hidden="close" size="xl"
        ok-title="Guardar" cancel-title="Cancelar" title="Agregar Boletin" bodyScrolling
        no-close-on-backdrop no-close-on-esc :hide-footer="loadingSubmit">

        <form id="formAgregarBoletin" @submit.prevent="submit">
            <div class="row">
                <div class="col-md-12 col-12 mb-3" :class="{ error: validation.hasError('modelo.TITLE') }">
                    <label for="name" class="form-label">Descripción de Correo <span class="text-danger">*</span></label>
                    <input type="text" v-model="modelo.TITLE" id="TITLE" class="form-control" />
                    <span class="message" v-if="validation.hasError('modelo.TITLE')">
                        {{ validation.firstError('modelo.TITLE') }}
                    </span>
                </div>

                <div class="col-md-12 col-12 mb-3 flex flex-col"
                    :class="{ error: validation.hasError('modelo.IMAGEN') }">
                    <label for="file" class="forml-label">Imagen <span class="text-danger">*</span></label>
                    <input class="custom-input" type="file" accept=".jpg, .jpeg, .png, .gif, .bmp, .svg"
                     name="file_input" placeholder="Escribe aquí"
                        @change="modelo.IMAGEN = $event.target.files[0]">
                    <span class="message" v-if="validation.hasError('modelo.IMAGEN')">
                        {{ validation.firstError('modelo.IMAGEN') }}
                    </span>
                </div>

                <div class="col-md-12 col-12 mb-3 flex flex-col"
                    :class="{ error: validation.hasError('modelo.BOLETIN') }">
                    <label for="file" class="forml-label">PDF <span class="text-danger">*</span></label>
                    <input class="custom-input" type="file" accept=".pdf" name="file_input" placeholder="Escribe aquí"
                        @change="modelo.BOLETIN = $event.target.files[0]">
                    <span class="message" v-if="validation.hasError('modelo.BOLETIN')">
                        {{ validation.firstError('modelo.BOLETIN') }}
                    </span>
                </div>
            </div>
        </form>
    </b-modal>
</template>


<script>
import { BModal } from 'bootstrap-vue-next';
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';

// * PROXY
import boletinProxy from "@/proxies/boletinProxy.js";


export default {
    components: {
        BModal
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        close: {
            type: Function,
            default: () => { }
        },
        update: {
            type: Function,
            default: () => { }
        },
    },
    data() {
        return {
            isShow: false,
            loadingSubmit: false,
            modelo: {
                TITLE: null,
                IMAGEN: null,
                BOLETIN: null
            },
        }
    },
    validators: {
        'modelo.TITLE': function (value) {
            return Validator.value(value).required("Campo requerido");
        },
    },
    methods: {
        async submit(e) {
            e.preventDefault();

            let validate = await this.$validate();
            if (!validate) return;

            if(this.modelo.IMAGEN === null || this.modelo.BOLETIN === null) {
                toast.error("Debe seleccionar una imagen y un pdf");
                return;
            }


            this.loadingSubmit = true;
            const loadingToast = toast.loading("Espere un momento...");
            let formData = new FormData();
            formData.append("TITLE", this.modelo.TITLE);
            formData.append("files", this.modelo.IMAGEN);
            formData.append("files", this.modelo.BOLETIN);

            await boletinProxy.create(formData)
                .then(response => {
                    const toastMessage = response.STATUS ? response.MESSAGE : response?.MESSAGE || "Error al crear el boletin";
                    if (response.STATUS) {
                        toast.success(toastMessage);
                        this.reset();
                        this.update();
                        this.close();
                    } else {
                        toast.error(toastMessage);
                    }

                })
                .catch(err => toast.error(err?.MESSAGE || "Error al crear al crear el boletin"))
                .finally(() => {
                    toast.remove(loadingToast);
                    this.loadingSubmit = false;
                });
        },
        reset() {
            this.modelo = {
                TITLE: null,
                IMAGEN: null,
                BOLETIN: null
            }

            this.validation.reset();
        }
    },
    watch: {
        show: {
            handler(value) {
                if (!value) {
                    this.reset();
                }
                this.isShow = value;
            }
        }
    }
}


</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
