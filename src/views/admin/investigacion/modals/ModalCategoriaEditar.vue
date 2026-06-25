<template>
  <BaseModal v-model="isShow" title="Editar Categoría" size="lg" persistent @close="handleClose">
    <form @submit.prevent="submit" class="flex flex-col gap-4">

      <BaseInput
        v-model="modelo.DESCP"
        label="Descripción"
        placeholder="Ingrese descripción de la categoría"
        required
        :error="validation.firstError('modelo.DESCP')"
      />

      <BaseRichInput
        v-model="modelo.DETALLE"
        label="Detalle"
      />

    </form>
    <template #footer>
      <CancelButton @click="handleClose" :disabled="loadingSubmit" />
      <SaveButton nativeType="button" @click="submit" :loading="loadingSubmit" />
    </template>
  </BaseModal>
</template>

<script>
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';
import MantenimientoProxy from '@/proxies/MantenimientoProxy';

export default {
  name: 'ModalCategoriaEditar',
  props: {
    show:   { type: Boolean,  default: false },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
    data:   { type: Object,   default: () => ({}) },
    role:   { type: Object,   default: () => ({}) },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: { ID: null, DESCP: null, DETALLE: null },
    };
  },
  validators: {
    'modelo.DESCP': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    handleClose() { this.reset(); this.close(); },
    async submit() {
      if (this.role?.IDR === 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warn-perm' });
      if (!this.modelo.ID) return toast.warning('No se encontró el identificador del registro', { toastId: 'warn-id' });
      const valid = await this.$validate();
      if (!valid) return;

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');

      await MantenimientoProxy.editCategoria(this.modelo)
        .then(r => {
          if (r.STATUS) {
            toast.success('Categoría editada correctamente');
            this.reset(); this.update(); this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al editar la categoría');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al editar la categoría'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    reset() { this.modelo = { ID: null, DESCP: null, DETALLE: null }; this.validation.reset(); },
  },
  watch: {
    show(val) {
      if (val && this.data) {
        this.modelo = {
          ID:      this.data.ID      ?? this.data.id,
          DESCP:   this.data.DESCP   ?? this.data.descp   ?? null,
          DETALLE: this.data.DETALLE ?? this.data.detalle ?? null,
        };
      }
      if (!val) this.reset();
      this.isShow = val;
    },
  },
};
</script>
