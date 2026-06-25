<template>
    <BaseModal v-model="show" title="Usuarios con acceso" size="lg" persistent @close="show = false">
        <div class="flex flex-col gap-4">
            <!-- Search -->
            <div class="flex gap-2">
                <search-bar
                    class="flex-1"
                    placeholder="Buscar por nombre o email"
                    @search="q => { SEARCH = q; getContactos(); }"
                />
                <search-button @click="getContactos()"/>
            </div>

            <!-- List -->
            <div class="flex flex-col gap-2" style="max-height:360px;overflow-y:auto;">
                <div v-if="loading" class="py-10 flex flex-col items-center gap-3" style="color:var(--text-muted)">
                    <svg class="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/>
                    </svg>
                    <span class="text-sm">Cargando usuarios...</span>
                </div>
                <div v-else-if="contactos.length === 0" class="py-10 text-center text-sm" style="color:var(--text-muted)">
                    No hay usuarios compartidos
                </div>
                <div v-else v-for="(contacto, i) in contactos" :key="i"
                    class="flex items-center justify-between p-3 rounded-xl border"
                    style="border-color:var(--border);background:var(--bg-raised)">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <img :src="contacto.RTAFTO || 'https://placehold.co/40x40'"
                            class="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="">
                        <div class="flex flex-col min-w-0">
                            <span class="text-sm font-semibold truncate" style="color:var(--text)">
                                {{ contacto.NOMBRES + ' ' + contacto.APELLIDOS }}
                            </span>
                            <span class="text-xs truncate" style="color:var(--text-muted)">{{ contacto.EMAIL }}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <app-select v-model="contacto.ISPERM" :disabled="data.PROP == 0" style="min-width:100px;">
                            <option value="1">Lector</option>
                            <option value="2">Editor</option>
                        </app-select>
                        <button v-if="data.PROP != 0" @click="removeAcceso(contacto)" title="Quitar acceso"
                            class="flex items-center justify-center rounded-lg transition-colors"
                            style="width:30px;height:30px;background:#FEE2E2;color:#DC2626;border:none;cursor:pointer;flex-shrink:0;"
                            onmouseover="this.style.background='#FECACA'" onmouseout="this.style.background='#FEE2E2'">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <CancelButton @click="show = false"/>
            <SaveButton v-if="data.PROP != 0" @click="submit($event)"/>
        </template>
    </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import UserProxy from '@/proxies/UserProxy';

export default {
    name: "ModalUsuariosCompartidos",
    data() {
        return {
            show: false,
            loading: false,
            SEARCH: "",
            contactos: [],
            toRemove: [],
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
            this.loading = true;
            try {
                const response = await UserProxy.getContactosSelecteds({ INIT: 0, ROWS: 10000, IDFAV: this.data.ID, DESC: this.SEARCH });
                this.contactos = response.map(contacto => ({
                    ...contacto,
                    ISPERM: contacto.ISPERM.toString(),
                }));
            } catch {
                this.contactos = [];
                toast.error("Error al obtener los contactos");
            } finally {
                this.loading = false;
            }
        },
        async removeAcceso(contacto) {
            try {
                const res = await UserProxy.updatePermisosFav({
                    IDFAV: this.data.ID,
                    UPDATES: [{ IDUSERD: contacto.ID, ISPERM: 3 }],
                });
                if (res.STATUS) {
                    this.contactos = this.contactos.filter(c => c.ID !== contacto.ID);
                    toast.success('Acceso removido');
                } else {
                    toast.error(res.MESSAGE || 'Error al remover acceso');
                }
            } catch {
                toast.error('Error al remover acceso');
            }
        },
        async submit(e) {
            if (e && e.preventDefault) e.preventDefault();
            const updates = this.contactos.map(c => ({ IDUSERD: c.ID, ISPERM: +c.ISPERM }));
            await UserProxy.updatePermisosFav({ IDFAV: this.data.ID, UPDATES: updates })
                .then((response) => {
                    if (response.STATUS) {
                        this.show = false;
                        toast.success("Permisos actualizados correctamente");
                    } else {
                        toast.error(response.MESSAGE);
                    }
                })
                .catch(() => {
                    toast.error("Error al actualizar los permisos");
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
                this.contactos = [];
                this.toRemove = [];
                this.SEARCH = "";
            } else {
                this.getContactos();
            }
        },
    },
}
</script>
