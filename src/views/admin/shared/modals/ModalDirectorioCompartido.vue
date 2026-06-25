<template>
    <BaseModal v-model="show" title="Compartir carpeta" size="lg" persistent @close="show = false">

        <!-- Directory info -->
        <div class="flex items-center gap-3 p-3 rounded-xl border mb-4"
            style="background:var(--bg-raised);border-color:var(--border)">
            <div class="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-white"
                :style="{ background: data.COLOR || 'var(--color-primary)' }">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                </svg>
            </div>
            <span class="text-sm font-semibold" style="color:var(--text)">{{ data.DSCRPCN || 'Carpeta' }}</span>
        </div>

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

        <!-- TAB: Compartir (agregar usuarios) -->
        <div v-if="activeTab === 'add'" class="flex flex-col gap-3">
            <div class="flex gap-2">
                <search-bar class="flex-1" placeholder="Buscar contacto..." @search="q => { searchAdd = q; loadContactos(); }"/>
                <search-button @click="loadContactos()"/>
            </div>
            <p class="text-sm m-0" style="color:var(--text-muted)">
                <span class="font-semibold" style="color:var(--color-primary)">{{ selected.length }}</span>
                contacto{{ selected.length !== 1 ? 's' : '' }} seleccionado{{ selected.length !== 1 ? 's' : '' }}
            </p>
            <div class="flex flex-col gap-2" style="max-height:300px;overflow-y:auto;">
                <div v-if="loadingContacts" class="py-8 flex flex-col items-center gap-2" style="color:var(--text-muted)">
                    <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/>
                    </svg>
                    <span class="text-sm">Cargando...</span>
                </div>
                <div v-else-if="contactos.length === 0" class="py-8 text-center text-sm" style="color:var(--text-muted)">
                    No hay contactos disponibles
                </div>
                <div v-else v-for="(c, i) in contactos" :key="i"
                    class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer"
                    :class="c.CHECKED ? 'border-blue-300 bg-blue-50' : 'hover:bg-gray-50'"
                    style="border-color:var(--border)"
                    @click="toggleContact(c)">
                    <input type="checkbox" :checked="c.CHECKED" @click.stop @change="toggleContact(c)" class="rounded flex-shrink-0"/>
                    <img :src="c.RTAFTO || 'https://placehold.co/40x40'" class="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="">
                    <div class="flex flex-col flex-1 min-w-0">
                        <span class="text-sm font-semibold truncate" style="color:var(--text)">{{ c.NOMBRES + ' ' + c.APELLIDOS }}</span>
                        <span class="text-xs truncate" style="color:var(--text-muted)">{{ c.EMAIL }}</span>
                    </div>
                    <app-select v-if="c.CHECKED" :model-value="getPermiso(c)" @update:model-value="v => setPermiso(c, v)"
                        style="min-width:96px;flex-shrink:0;" @click.stop>
                        <option value="1">Lector</option>
                        <option value="2">Editor</option>
                    </app-select>
                    <span v-else class="text-xs px-2 py-1 rounded-full flex-shrink-0"
                        style="background:var(--bg-raised);color:var(--text-muted)">Lector</span>
                </div>
            </div>
        </div>

        <!-- TAB: Con acceso (gestionar) -->
        <div v-else class="flex flex-col gap-3">
            <div class="flex gap-2">
                <search-bar class="flex-1" placeholder="Buscar por nombre o email..." @search="q => { searchManage = q; filterManage(); }"/>
                <search-button @click="filterManage()"/>
            </div>
            <div class="flex flex-col gap-2" style="max-height:300px;overflow-y:auto;">
                <div v-if="loadingManage" class="py-8 flex flex-col items-center gap-2" style="color:var(--text-muted)">
                    <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/>
                    </svg>
                    <span class="text-sm">Cargando...</span>
                </div>
                <div v-else-if="filteredManage.length === 0" class="py-8 text-center text-sm" style="color:var(--text-muted)">
                    Nadie tiene acceso a esta carpeta aún
                </div>
                <div v-else v-for="(u, i) in filteredManage" :key="i"
                    class="flex items-center justify-between p-3 rounded-xl border"
                    style="border-color:var(--border);background:var(--bg-raised)">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <img :src="u.RTAFTO || 'https://placehold.co/40x40'" class="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="">
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
            <CancelButton @click="show = false" :disabled="saving"/>
            <!-- Agregar tab -->
            <SaveButton v-if="activeTab === 'add'" label="Compartir" loadingLabel="Compartiendo..."
                @click="submitShare" :loading="saving" :disabled="selected.length === 0"/>
            <!-- Con acceso tab -->
            <SaveButton v-else-if="filteredManage.length > 0" label="Guardar cambios"
                @click="submitManage" :loading="saving"/>
        </template>
    </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import UserProxy from '@/proxies/UserProxy';

export default {
    name: "ModalDirectorioCompartido",
    data() {
        return {
            show: false,
            activeTab: 'add',
            tabs: [
                { id: 'add',    label: 'Compartir'   },
                { id: 'manage', label: 'Con acceso'  },
            ],
            // Tab Compartir
            searchAdd: '',
            contactos: [],
            selected: [],
            loadingContacts: false,
            // Tab Con acceso
            searchManage: '',
            usersManage: [],
            filteredManage: [],
            loadingManage: false,
            saving: false,
        };
    },
    props: {
        openModal:    { type: Boolean,  default: false     },
        toggleModal:  { type: Function, required: true     },
        data:         { type: Object,   required: true     },
    },
    methods: {
        // ── Tab Compartir ──────────────────────────────────────
        async loadContactos() {
            this.loadingContacts = true;
            try {
                const res = await UserProxy.getContactos({
                    ESTADO: true, INIT: 0, ROWS: 100,
                    DESC: this.searchAdd, IDDIR: this.data.ID,
                });
                this.contactos = res.map(c => ({
                    ...c,
                    CHECKED: this.selected.some(s => s.ID === c.ID),
                }));
            } catch {
                this.contactos = [];
                toast.error('Error al cargar contactos');
            } finally {
                this.loadingContacts = false;
            }
        },
        toggleContact(c) {
            const item = this.contactos.find(x => x.ID === c.ID);
            if (!item) return;
            item.CHECKED = !item.CHECKED;
            if (item.CHECKED) {
                if (!this.selected.some(s => s.ID === c.ID))
                    this.selected.push({ ...item, ISPERM: 1 });
            } else {
                this.selected = this.selected.filter(s => s.ID !== c.ID);
            }
        },
        getPermiso(c) {
            return (this.selected.find(s => s.ID === c.ID)?.ISPERM ?? 1).toString();
        },
        setPermiso(c, val) {
            const s = this.selected.find(s => s.ID === c.ID);
            if (s) s.ISPERM = +val;
        },
        async submitShare() {
            if (!this.selected.length) return;
            this.saving = true;
            try {
                const res = await UserProxy.sharedDirectory({
                    ID: this.data.ID,
                    DESTINATARIOS: this.selected.map(c => ({
                        ID: c.IDRECEPT || c.ID,
                        ISPERM: c.ISPERM ?? 1,
                    })),
                });
                if (res.STATUS) {
                    toast.success('Carpeta compartida correctamente');
                    this.selected = [];
                    // Recargar tab de gestión
                    await this.loadManage();
                    this.activeTab = 'manage';
                } else {
                    toast.error(res.MESSAGE);
                }
            } catch {
                toast.error('Error al compartir');
            } finally {
                this.saving = false;
            }
        },

        // ── Tab Con acceso ─────────────────────────────────────
        async loadManage() {
            if (!this.data?.ID) return;
            this.loadingManage = true;
            try {
                const res = await UserProxy.getDirUsers({ IDDIR: this.data.ID });
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
                const res = await UserProxy.updatePermisosDir({
                    IDDIR: this.data.ID,
                    UPDATES: [{ IDUSERD: u.ID, ISPERM: 3 }],
                });
                if (res.STATUS) {
                    this.usersManage = this.usersManage.filter(x => x.ID !== u.ID);
                    this.filteredManage = this.filteredManage.filter(x => x.ID !== u.ID);
                    // Recargar lista de contactos disponibles
                    await this.loadContactos();
                    toast.success('Acceso removido');
                } else {
                    toast.error(res.MESSAGE);
                }
            } catch {
                toast.error('Error al remover acceso');
            }
        },
        async submitManage() {
            this.saving = true;
            try {
                const updates = this.usersManage.map(u => ({ IDUSERD: u.ID, ISPERM: +u.ISPERM }));
                const res = await UserProxy.updatePermisosDir({ IDDIR: this.data.ID, UPDATES: updates });
                if (res.STATUS) {
                    this.show = false;
                    toast.success('Permisos actualizados');
                } else {
                    toast.error(res.MESSAGE);
                }
            } catch {
                toast.error('Error al actualizar permisos');
            } finally {
                this.saving = false;
            }
        },
    },
    watch: {
        openModal(val) { this.show = val; },
        show(val) {
            if (!val) {
                this.toggleModal();
                this.activeTab = 'add';
                this.contactos = [];
                this.selected = [];
                this.usersManage = [];
                this.filteredManage = [];
                this.searchAdd = '';
                this.searchManage = '';
            } else {
                this.loadContactos();
                this.loadManage();
            }
        },
        activeTab(val) {
            if (val === 'add' && !this.contactos.length) this.loadContactos();
            if (val === 'manage' && !this.usersManage.length) this.loadManage();
        },
    },
}
</script>
