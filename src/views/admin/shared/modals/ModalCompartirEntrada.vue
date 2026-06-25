<template>
    <BaseModal v-model="show" title="Compartir documento" size="lg" persistent @close="show = false">
        <div class="flex flex-col gap-4">
            <!-- Search -->
            <div class="flex flex-wrap gap-2 items-center">
                <search-bar
                    class="flex-1"
                    style="min-width:180px;"
                    placeholder="Buscar por nombre o email"
                    @search="q => { SEARCH = q; getContactos(); }"
                />
                <search-button @click="getContactos()"/>
            </div>

            <!-- Counter -->
            <p class="text-sm m-0" style="color:var(--text-muted)">
                <span class="font-semibold" style="color:var(--color-primary)">{{ contactosSelected.length }}</span>
                contacto{{ contactosSelected.length !== 1 ? 's' : '' }} seleccionado{{ contactosSelected.length !== 1 ? 's' : '' }}
            </p>

            <!-- List -->
            <div class="flex flex-col gap-2" style="max-height:320px;overflow-y:auto;">
                <div v-if="contactos.length === 0" class="py-10 text-center text-sm" style="color:var(--text-muted)">
                    <svg class="mx-auto mb-2 opacity-40" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    No hay contactos disponibles
                </div>
                <div v-for="(contacto, i) in contactos" :key="i"
                    class="flex items-center gap-3 p-3 rounded-xl border transition-all"
                    :class="contacto.CHECKED ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:bg-gray-50'"
                    style="border-color:var(--border)">
                    <!-- checkbox -->
                    <input type="checkbox" :checked="contacto.CHECKED"
                        @change="onSelectedContactos(contacto, $event.target.checked)"
                        class="rounded flex-shrink-0" style="cursor:pointer;"/>
                    <!-- avatar -->
                    <img :src="contacto.RTAFTO || 'https://placehold.co/40x40'"
                        class="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="">
                    <!-- info -->
                    <div class="flex flex-col flex-1 min-w-0">
                        <span class="text-sm font-semibold" style="color:var(--text)">
                            {{ contacto.NOMBRES + ' ' + contacto.APELLIDOS }}
                        </span>
                        <span class="text-xs" style="color:var(--text-muted)">{{ contacto.EMAIL }}</span>
                    </div>
                    <!-- permiso individual -->
                    <app-select
                        v-if="contacto.CHECKED"
                        :model-value="getPermiso(contacto)"
                        @update:model-value="v => setPermiso(contacto, v)"
                        style="min-width:100px;flex-shrink:0;"
                    >
                        <option value="1">Lector</option>
                        <option value="2">Editor</option>
                    </app-select>
                    <span v-else class="text-xs px-2 py-1 rounded-full"
                        style="background:var(--bg-raised);color:var(--text-muted);flex-shrink:0;white-space:nowrap;">
                        Lector
                    </span>
                </div>
            </div>
        </div>

        <template #footer>
            <CancelButton @click="show = false"/>
            <SaveButton @click="submit($event)"/>
        </template>
    </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import UserProxy from '@/proxies/UserProxy';

export default {
    name: "ModalCompartirEntrada",
    data() {
        return {
            show: false,
            SEARCH: "",
            contactos: [],
            contactosSelected: [],   // [{ ...contacto, ISPERM: 1|2 }]
        }
    },
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
        }
    },
    methods: {
        async getContactos() {
            await UserProxy.getContactos({ ESTADO: true, INIT: 0, ROWS: 10, DESC: this.SEARCH, IDFAV: this.data.ID })
                .then((response) => {
                    this.contactos = response.map(contacto => ({
                        ...contacto,
                        CHECKED: this.contactosSelected.some(s => s.ID === contacto.ID)
                    }));
                })
                .catch(() => {
                    this.contactos = [];
                    toast.error("Error al obtener los contactos");
                });
        },
        getPermiso(contacto) {
            const sel = this.contactosSelected.find(c => c.ID === contacto.ID);
            return sel ? sel.ISPERM : 1;
        },
        setPermiso(contacto, value) {
            const sel = this.contactosSelected.find(c => c.ID === contacto.ID);
            if (sel) sel.ISPERM = Number(value);
        },
        onSelectedContactos(item, checked) {
            // Actualizar CHECKED en el array para que v-if reaccione
            const c = this.contactos.find(c => c.ID === item.ID);
            if (c) c.CHECKED = checked;

            if (checked) {
                if (!this.contactosSelected.some(c => c.ID === item.ID)) {
                    this.contactosSelected.push({ ...item, ISPERM: 1 });
                }
            } else {
                this.contactosSelected = this.contactosSelected.filter(c => c.ID !== item.ID);
            }
        },
        async submit(e) {
            if (e && e.preventDefault) e.preventDefault();
            if (this.contactosSelected.length === 0) {
                toast.error("Selecciona al menos un contacto");
                return;
            }
            const entradas = Array.isArray(this.data.ID) ? this.data.ID : [this.data.ID];
            const destinatarios = this.contactosSelected.map(c => ({
                ID: c.IDRECEPT || c.ID,
                ISPERM: c.ISPERM ?? 1,
            }));
            await UserProxy.setCompartirEntrada({
                ENTRADAS: entradas,
                DESTINATARIOS: destinatarios,
            })
                .then((response) => {
                    if (response.STATUS) {
                        this.show = false;
                        toast.success("Documentos compartidos correctamente");
                    } else {
                        toast.error(response.MESSAGE);
                    }
                })
                .catch(() => {
                    toast.error("Error al compartir los documentos");
                });
        },
    },
    watch: {
        openModal(val) {
            this.show = val;
        },
        show(val) {
            if (!val) {
                this.toggleModal();
                this.SEARCH = "";
                this.contactos = [];
                this.contactosSelected = [];
            } else {
                this.getContactos();
            }
        },
    },
}
</script>
