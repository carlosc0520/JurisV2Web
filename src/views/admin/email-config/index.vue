<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Configuración de Correo" subtitle="Gestiona los parámetros SMTP y los eventos de correo del sistema">
      <template #icon>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-4 flex flex-col gap-4">

      <!-- Tabs -->
      <div class="flex gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <button v-for="tab in tabs" :key="tab.id"
          @click="active = tab.id"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
            active === tab.id
              ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800']">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="tab.icon"/>
          {{ tab.label }}
        </button>
      </div>

      <!-- Filtros + acción -->
      <SectionCard>
        <div class="flex flex-wrap items-center gap-3">
          <search-bar
            class="flex-1 min-w-[240px]"
            placeholder="Buscar..."
            @search="q => { filter.NOMBRES = q || null; load(); }"
          />
          <app-select v-model="filter.CDESTDO" @change="load">
            <option value="">Todos los estados</option>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </app-select>
          <search-button @click="load" />
          <new-button
            :label="active === 'CONFIG' ? 'Nuevo' : 'Nuevo'"
            @click="openModal(active)"
          />
        </div>
      </SectionCard>

      <!-- Tablas -->
      <data-table
        v-if="active === 'CONFIG'"
        :search="load"
        :fields="fieldsConfig"
        :items="configItems"
        :grid="grid"
        :actions="actionsConfig"
      />
      <data-table
        v-if="active === 'EVENTO'"
        :search="load"
        :fields="fieldsEvento"
        :items="eventoItems"
        :grid="grid"
        :actions="actionsEvento"
      />

    </div>

    <!-- Modal Crear/Editar -->
    <BaseModal
      v-model="modal.show"
      :title="`${modal.isNew ? 'Nuevo' : 'Editar'} ${modal.tipo === 'CONFIG' ? 'Parámetro SMTP' : 'Evento de Correo'}`"
      size="sm"
      persistent
      @close="handleClose"
    >
      <form @submit.prevent="save" class="flex flex-col gap-4">

        <BaseInput
          v-model="modal.form.CLAVE"
          label="Clave"
          required
          placeholder="Ej: GMAIL_USER, CONTACTO..."
          maxlength="60"
          :disabled="!modal.isNew"
          :error="errors.CLAVE"
        />

        <BaseInput
          v-model="modal.form.DESCRIPCION"
          label="Descripción"
          placeholder="Descripción breve del parámetro"
          maxlength="200"
        />

        <!-- CONFIG fields -->
        <template v-if="modal.tipo === 'CONFIG'">
          <div>
            <BaseInput
              v-model="modal.form.VALOR"
              label="Valor"
              required
              :type="isSensitive(modal.form.CLAVE) ? 'password' : 'text'"
              placeholder="Valor del parámetro"
              maxlength="500"
              :error="errors.VALOR"
            />
            <p v-if="isSensitive(modal.form.CLAVE)" class="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Campo sensible — se oculta al visualizar
            </p>
          </div>
        </template>

        <!-- EVENTO fields -->
        <template v-if="modal.tipo === 'EVENTO'">
          <div>
            <BaseInput
              v-model="modal.form.ASUNTO"
              label="Asunto del correo"
              placeholder="Ej: Nueva investigación {{TITULO}}"
              maxlength="200"
            />
            <p class="mt-1.5 text-xs text-gray-400">
              Puedes usar variables como <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">&#123;&#123;NOMBRES&#125;&#125;</code>
            </p>
          </div>
          <BaseInput
            v-model="modal.form.DESTINATARIOS"
            label="Destinatarios"
            placeholder="email1@dominio.com, email2@dominio.com"
            maxlength="1000"
            hint="Separar múltiples correos con coma"
          />
          <BaseInput
            v-model="modal.form.PLACEHOLDER"
            label="Preheader"
            placeholder="Texto corto que aparece en la bandeja de entrada"
            maxlength="300"
            hint="Preview del correo en el cliente de email"
          />
        </template>

      </form>

      <template #footer>
        <CancelButton @click="handleClose" :disabled="isSaving" />
        <SaveButton   @click="save"        :loading="isSaving" />
      </template>
    </BaseModal>

  </section>
</template>

<script>
import { toast } from 'vue3-toastify';
import DataTable from '@/components/Tables/DataTable.vue';
import EmailConfigProxy from '@/proxies/EmailConfigProxy';

const SENSITIVE_KEYS = ['password', 'pass', 'secret', 'key', 'token', 'pwd'];

const emptyForm = (tipo = 'CONFIG') => ({
  ID: null, CLAVE: '', TIPO: tipo, VALOR: '', ASUNTO: '', DESTINATARIOS: '', PLACEHOLDER: '', DESCRIPCION: '',
});

export default {
  name: 'EmailConfigView',
  components: { DataTable },
  data() {
    return {
      isLoading: false,
      isSaving:  false,
      active: 'CONFIG',
      filter: { NOMBRES: null, CDESTDO: '' },
      tabs: [
        { id: 'CONFIG', label: 'SMTP / Conexión',   icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
        { id: 'EVENTO', label: 'Eventos de Correo', icon: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>' },
      ],
      grid: { currentPage: 1, perPage: 10, totalRows: 0, isLoading: false, pageOptions: [5, 10, 15, 50] },
      items: [],
      errors: { CLAVE: '', VALOR: '' },
      modal: { show: false, isNew: true, tipo: 'CONFIG', form: emptyForm() },
      actionsConfig: {
        edit:   { label: 'Editar',   action: item => this.openModal('CONFIG', item) },
        delete: { label: 'Eliminar', action: item => this.confirmDelete(item) },
      },
      actionsEvento: {
        edit:   { label: 'Editar',   action: item => this.openModal('EVENTO', item) },
        delete: { label: 'Eliminar', action: item => this.confirmDelete(item) },
      },
      fieldsConfig: [
        { key: 'RN',          label: '#',           class: 'w-10 text-gray-400 text-xs' },
        { key: 'CLAVE',       label: 'Clave',       formatter: (_v, _k, item) => `<span class="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">${item.clave ?? ''}</span>`, html: true },
        { key: 'VALOR',       label: 'Valor',       formatter: (_v, _k, item) => this.isSensitive(item.clave) ? '<span class="text-gray-400">••••••••</span>' : (item.valor || '—'), html: true },
        { key: 'DESCRIPCION', label: 'Descripción', formatter: (_v, _k, item) => item.descripcion || '—' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
      ],
      fieldsEvento: [
        { key: 'RN',           label: '#',            class: 'w-10 text-gray-400 text-xs' },
        { key: 'CLAVE',        label: 'Clave',        formatter: (_v, _k, item) => `<span class="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-semibold">${item.clave ?? ''}</span>`, html: true },
        { key: 'ASUNTO',       label: 'Asunto',       formatter: (_v, _k, item) => item.asunto || '(sin asunto)' },
        { key: 'DESTINATARIOS',label: 'Destinatarios',formatter: (_v, _k, item) => item.destinatarios || '—' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
      ],
    };
  },
  computed: {
    configItems() {
      const q  = (this.filter.NOMBRES || '').toLowerCase();
      return this.items
        .filter(i => i.tipo === 'CONFIG'
          && (!q || i.clave?.toLowerCase().includes(q)
                 || i.valor?.toLowerCase().includes(q)
                 || i.descripcion?.toLowerCase().includes(q)))
        .map((i, idx) => ({
          ...i,
          RN:     idx + 1,
          CDESTDO: i.estado,
          FCRCN:  i.fechaCreacion   ?? null,
          UCRCN:  i.usuarioCreacion ?? null,
          FEDCN:  i.fechaEdicion    ?? null,
          UEDCN:  i.usuarioEdicion  ?? null,
        }));
    },
    eventoItems() {
      const q  = (this.filter.NOMBRES || '').toLowerCase();
      return this.items
        .filter(i => i.tipo === 'EVENTO'
          && (!q || i.clave?.toLowerCase().includes(q)
                 || i.asunto?.toLowerCase().includes(q)
                 || i.destinatarios?.toLowerCase().includes(q)))
        .map((i, idx) => ({
          ...i,
          RN:     idx + 1,
          CDESTDO: i.estado,
          FCRCN:  i.fechaCreacion   ?? null,
          UCRCN:  i.usuarioCreacion ?? null,
          FEDCN:  i.fechaEdicion    ?? null,
          UEDCN:  i.usuarioEdicion  ?? null,
        }));
    },
  },
  methods: {
    isSensitive(clave = '') {
      return SENSITIVE_KEYS.some(k => clave.toLowerCase().includes(k));
    },
    async load() {
      this.grid.isLoading = true;
      await EmailConfigProxy.list(this.filter.CDESTDO)
        .then(data => {
          this.items = Array.isArray(data) ? data : [];
          this.grid.totalRows = this.items.length;
        })
        .catch(() => toast.error('Error al cargar parámetros'))
        .finally(() => { this.grid.isLoading = false; });
    },
    openModal(tipo, item = null) {
      this.modal.tipo  = tipo;
      this.modal.isNew = !item;
      this.modal.form  = item
        ? { ID: item.id, CLAVE: item.clave, TIPO: item.tipo, VALOR: item.valor || '', ASUNTO: item.asunto || '', DESTINATARIOS: item.destinatarios || '', PLACEHOLDER: item.placeholder || '', DESCRIPCION: item.descripcion || '' }
        : emptyForm(tipo);
      this.errors = { CLAVE: '', VALOR: '' };
      this.modal.show = true;
    },
    handleClose() {
      this.modal.show = false;
      setTimeout(() => {
        this.modal.form = emptyForm(this.modal.tipo);
        this.errors = { CLAVE: '', VALOR: '' };
      }, 200);
    },
    async save() {
      this.errors = { CLAVE: '', VALOR: '' };
      let valid = true;
      if (!this.modal.form.CLAVE.trim()) { this.errors.CLAVE = 'La clave es requerida'; valid = false; }
      if (this.modal.tipo === 'CONFIG' && !this.modal.form.VALOR.trim()) { this.errors.VALOR = 'El valor es requerido'; valid = false; }
      if (!valid) return;

      this.isSaving = true;
      await EmailConfigProxy.save({ ...this.modal.form })
        .then(r => {
          if (r.STATUS) { toast.success(r.MESSAGE || 'Guardado correctamente'); this.handleClose(); this.load(); }
          else          { toast.error(r.MESSAGE || 'Error al guardar'); }
        })
        .catch(() => toast.error('Error al guardar'))
        .finally(() => { this.isSaving = false; });
    },
    async confirmDelete(item) {
      const esActivo = item.estado === 'A';
      const ok = await this.$swal({
        title: `¿${esActivo ? 'Inactivar' : 'Activar'} parámetro?`,
        text: `"${item.clave}" pasará a estado ${esActivo ? 'Inactivo' : 'Activo'}.`,
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: esActivo ? '#ef4444' : '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: `Sí, ${esActivo ? 'inactivar' : 'activar'}`,
        cancelButtonText: 'Cancelar',
      });
      if (!ok.isConfirmed) return;
      await EmailConfigProxy.remove(item.id)
        .then(r => {
          if (r.STATUS) { toast.success(r.MESSAGE || 'Eliminado'); this.load(); }
          else          { toast.error(r.MESSAGE || 'Error al eliminar'); }
        })
        .catch(() => toast.error('Error al eliminar'));
    },
  },
  mounted() { this.load(); },
};
</script>
