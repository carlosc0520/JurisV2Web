<template>
    <b-modal id="modal-noticia-crear" v-model="show" title="Solo lectura" hide-footer centered size="xl"
        ok-title="Crear" cancel-title="Cancelar">
        <div class="relative rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <iframe ref="pdfEmbed" :src="pdfUrl + '#zoom=100&view=fitH'"
                class="border-none w-full h-[calc(100vh-140px)] rounded-xl block"></iframe>
            <!-- <div class="overlay" v-if="show"></div>
            <div class="overlay" v-if="show"></div>
            <div class="overlay" v-if="show"></div>
            <div class="overlay" v-if="show"></div>
            <div class="overlay" v-if="show"></div>
            <div class="overlay" v-if="show"></div>
            <div class="overlay" v-if="show"></div>
            <div class="overlay" v-if="show"></div>
            <div class="overlay" v-if="show"></div> -->
        </div>
    </b-modal>
</template>

<script>
import { BModal } from 'bootstrap-vue-next';


export default {
    name: "ModalMostrarPDF",
    props: {
        openModal: {
            type: Boolean,
            default: false
        },
        toggleModal: {
            type: Function,
            required: true
        },
        pdfUrl: {
            type: String,
            required: true
        }
    },
    components: {
        BModal
    },
    data() {
        return {
            show: false,
        };
    },
    watch: {
        openModal() {
            this.show = this.openModal;
        },
        show(val) {
            if (!val) {
                this.toggleModal();
            }
        },
    },
    methods: {
    }
};
</script>

<style scoped>
:deep(.modal-header) {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

:deep(.modal-body) {
    padding: 1rem;
    background: #f8fafc;
}
</style>
