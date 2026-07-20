<template>
    <BaseModal v-model="show" :title="tituloModal" size="lg" persistent @close="show = false">

        <!-- Tabs -->
        <div class="flex gap-1 mb-4 p-1 rounded-xl" style="background:var(--bg-raised)">
            <button v-for="t in tabs" :key="t.id"
                class="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all"
                :style="activeTab === t.id
                    ? 'background:#fff;color:var(--color-primary);box-shadow:0 1px 4px rgba(0,0,0,.08)'
                    : 'background:transparent;color:var(--text-muted)'"
                @click="activeTab = t.id">
                {{ t.label }}
            </button>
        </div>

        <!-- TAB: Compartir (agregar contactos) -->
        <div v-if="activeTab === 'add'" class="flex flex-col gap-4">
            <div class="flex flex-wrap gap-2 items-center">
                <search-bar
                    class="flex-1"
                    style="min-width:180px;"
                    placeholder="Buscar por nombre o email"
                    @search="q => { SEARCH = q; getContactos(); }"
                />
                <search-button @click="getContactos()"/>
            </div>

            <p class="text-sm m-0" style="color:var(--text-muted)">
                <span class="font-semibold" style="color:var(--color-primary)">{{ contactosSelected.length }}</span>
                contacto{{ contactosSelected.length !== 1 ? 's' : '' }} seleccionado{{ contactosSelected.length !== 1 ? 's' : '' }}
            </p>

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
                    <input type="checkbox" :checked="contacto.CHECKED"
                        @change="onSelectedContactos(contacto, $event.target.checked)"
                        class="rounded flex-shrink-0" style="cursor:pointer;"/>
                    <avatar-initials :src="contacto.RTAFTO" :name="contacto.NOMBRES + ' ' + contacto.APELLIDOS" :size="40"/>
                    <div class="flex flex-col flex-1 min-w-0">
                        <span class="text-sm font-semibold" style="color:var(--text)">
                            {{ contacto.NOMBRES + ' ' + contacto.APELLIDOS }}
                        </span>
                        <span class="text-xs" style="color:var(--text-muted)">{{ contacto.EMAIL }}</span>
                    </div>
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

        <!-- TAB: Con acceso (gestionar) -->
        <div v-else class="flex flex-col gap-3">
            <div class="flex gap-2">
                <search-bar class="flex-1" placeholder="Buscar por nombre o email..." @search="q => { searchManage = q; filterManage(); }"/>
                <search-button @click="filterManage()"/>
            </div>
            <div class="flex flex-col gap-2" style="max-height:320px;overflow-y:auto;">
                <div v-if="loadingManage" class="py-8 flex flex-col items-center gap-2" style="color:var(--text-muted)">
                    <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/>
                    </svg>
                    <span class="text-sm">Cargando...</span>
                </div>
                <div v-else-if="filteredManage.length === 0" class="py-8 text-center text-sm" style="color:var(--text-muted)">
                    Nadie tiene acceso aún
                </div>
                <div v-else v-for="(u, i) in filteredManage" :key="i"
                    class="flex items-center justify-between p-3 rounded-xl border"
                    style="border-color:var(--border);background:var(--bg-raised)">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <avatar-initials :src="u.RTAFTO" :name="u.NOMBRES + ' ' + u.APELLIDOS" :size="36"/>
                        <div class="flex flex-col min-w-0">
                            <span class="text-sm font-semibold truncate" style="color:var(--text)">{{ u.NOMBRES + ' ' + u.APELLIDOS }}</span>
                            <span class="text-xs truncate" style="color:var(--text-muted)">{{ u.EMAIL }}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <app-select v-model="u.ISPERM" style="min-width:96px;">
                            <option value="1">Lector</option>
                            <option value="2">Editor</option>
                        </app-select>
                        <button @click="removeAcceso(u)" title="Quitar acceso"
                            class="flex items-center justify-center rounded-lg"
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
            <SaveButton v-if="activeTab === 'add'" @click="submit($event)"/>
            <SaveButton v-else-if="filteredManage.length > 0" label="Guardar cambios"
                @click="submitManage" :loading="savingManage"/>
        </template>
    </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import UserProxy from '@/proxies/UserProxy';
import NoticiaEspacioProxy from '@/proxies/NoticiaEspacioProxy';

export default {
    name: "ModalCompartirNoticia",
    data() {
        return {
            show: false,
            activeTab: 'add',
            tabs: [
                { id: 'add', label: 'Compartir' },
                { id: 'manage', label: 'Con acceso' },
            ],
            SEARCH: "",
            contactos: [],
            contactosSelected: [],
            searchManage: "",
            usersManage: [],
            filteredManage: [],
            loadingManage: false,
            savingManage: false,
        }
    },
    props: {
        openModal: { type: Boolean, default: false },
        toggleModal: { type: Function, required: true },
        data: { type: Object, required: true },
    },
    computed: {
        tituloModal() {
            return this.data?.TIPO === 'CARPETA' ? 'Compartir carpeta' : 'Compartir artículo';
        },
    },
    methods: {
        async getContactos() {
            await UserProxy.getContactos({ ESTADO: true, INIT: 0, ROWS: 10, DESC: this.SEARCH })
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
            const destinatarios = this.contactosSelected.map(c => ({
                ID: c.IDRECEPT || c.ID,
                ISPERM: c.ISPERM ?? 1,
            }));
            await NoticiaEspacioProxy.share({
                TIPO: this.data.TIPO,
                ID: this.data.ID,
                DESTINATARIOS: destinatarios,
            })
                .then(async (response) => {
                    if (response.STATUS) {
                        toast.success(this.data.TIPO === 'CARPETA' ? 'Carpeta compartida correctamente' : 'Artículo compartido correctamente');
                        this.contactosSelected = [];
                        await this.loadManage();
                        this.activeTab = 'manage';
                    } else {
                        toast.error(response.MESSAGE);
                    }
                })
                .catch(() => {
                    toast.error("Error al compartir");
                });
        },

        async loadManage() {
            if (!this.data?.ID || !this.data?.TIPO) return;
            this.loadingManage = true;
            try {
                const res = await NoticiaEspacioProxy.getShareContacts(this.data.ID, this.data.TIPO);
                this.usersManage = res.map(u => ({ ...u, ISPERM: u.ISPERM?.toString() || '1' }));
                this.filteredManage = [...this.usersManage];
            } catch {
                toast.error('Error al cargar usuarios');
            } finally {
                this.loadingManage = false;
            }
        },
        filterManage() {
            const q = this.searchManage.toLowerCase().trim();
            if (!q) { this.filteredManage = [...this.usersManage]; return; }
            this.filteredManage = this.usersManage.filter(u => {
                const name = `${u.NOMBRES} ${u.APELLIDOS}`.toLowerCase();
                return name.includes(q) || (u.EMAIL || '').toLowerCase().includes(q);
            });
        },
        async removeAcceso(u) {
            try {
                const res = await NoticiaEspacioProxy.updatePermisos({
                    TIPO: this.data.TIPO,
                    ID: this.data.ID,
                    UPDATES: [{ IDUSERD: u.ID, ISPERM: 3 }],
                });
                if (res.STATUS) {
                    this.usersManage = this.usersManage.filter(x => x.ID !== u.ID);
                    this.filteredManage = this.filteredManage.filter(x => x.ID !== u.ID);
                    await this.getContactos();
                    toast.success('Acceso removido');
                } else {
                    toast.error(res.MESSAGE);
                }
            } catch {
                toast.error('Error al remover acceso');
            }
        },
        async submitManage() {
            this.savingManage = true;
            try {
                const updates = this.usersManage.map(u => ({ IDUSERD: u.ID, ISPERM: +u.ISPERM }));
                const res = await NoticiaEspacioProxy.updatePermisos({ TIPO: this.data.TIPO, ID: this.data.ID, UPDATES: updates });
                if (res.STATUS) {
                    this.show = false;
                    toast.success('Permisos actualizados');
                } else {
                    toast.error(res.MESSAGE);
                }
            } catch {
                toast.error('Error al actualizar permisos');
            } finally {
                this.savingManage = false;
            }
        },
    },
    watch: {
        openModal(val) {
            this.show = val;
        },
        show(val) {
            if (!val) {
                this.toggleModal();
                this.activeTab = 'add';
                this.SEARCH = "";
                this.contactos = [];
                this.contactosSelected = [];
                this.searchManage = "";
                this.usersManage = [];
                this.filteredManage = [];
            } else {
                this.getContactos();
                this.loadManage();
            }
        },
        activeTab(val) {
            if (val === 'add' && !this.contactos.length) this.getContactos();
            if (val === 'manage' && !this.usersManage.length) this.loadManage();
        },
    },
}
</script>
