<template>
    <b-modal id="modalShared" v-model="isShow" @ok="submit" @cancel="close" @hidden="close" size="xl"
        ok-title="Guardar" cancel-title="Cancelar" title="Compartir Directorio" bodyScrolling no-close-on-backdrop
        no-close-on-esc :hide-footer="loadingSubmit">

        <form id="formShared" @submit.prevent="submit">
            <div class="row">
                <div class="col-12 mb-3" :class="{ error: validation.hasError('modelo.LABEL') }">
                    <label for="LABEL" class="form-label">Correo de Usuario <span class="text-danger">*</span></label>
                    <input type="email"
                    autocomplete="off"
                    v-model="modelo.LABEL" id="LABEL" class="form-control" />
                    <span class="message" v-if="validation.hasError('modelo.LABEL')">
                        {{ validation.firstError('modelo.LABEL') }}
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
import UserProxy from "@/proxies/UserProxy.js";


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
        data: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            isShow: false,
            loadingSubmit: false,
            modelo: {
                LABEL: null
            },
        }
    },
    validators: {
        'modelo.LABEL': function (value) {
            return Validator.value(value).required("Campo requerido").regex(
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                "Correo no válido"
            );
        },
    },
    methods: {
        async submit(e) {
            e.preventDefault();

            let validate = await this.$validate();
            if (!validate) return;


            this.loadingSubmit = true;
            const loadingToast = toast.loading("Espere un momento...");
            await UserProxy.sharedDirectory({ 
                CORREO: this.modelo.LABEL,
                IDDIRECTORIO: this.data.directorio
             })
                .then(response => {
                    const toastMessage = response.STATUS ? "Directorio compartido con éxito" : response.MESSAGE;
                    if (response.STATUS) {
                        toast.success(toastMessage);
                        this.reset();
                        // this.update();
                        this.close();
                    } else {
                        toast.error(toastMessage);
                    }

                })
                .catch(err =>{
                    toast.error(err?.MESSAGE || "Error al compartir el directorio")
                })
                .finally(() => {
                    toast.remove(loadingToast);
                    this.loadingSubmit = false;
                });
        },
        reset() {
            this.modelo = {
                LABEL: null
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