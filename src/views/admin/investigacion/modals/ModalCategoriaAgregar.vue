<template>
  <BaseModal v-model="isShow" title="Agregar Categoría" size="lg" persistent @close="handleClose">
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
  name: 'ModalCategoriaAgregar',
  props: {
    show:   { type: Boolean,  default: false },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
    role:   { type: Object,   default: () => ({}) },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: { DESCP: null, DETALLE: null },
    };
  },
  validators: {
    'modelo.DESCP': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    handleClose() { this.reset(); this.close(); },
    async submit() {
      if (this.role?.IDR === 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warn-perm' });
      const valid = await this.$validate();
      if (!valid) return;

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');

      await MantenimientoProxy.createCategoria(this.modelo)
        .then(r => {
          if (r.STATUS) {
            toast.success('Categoría creada correctamente');
            this.reset(); this.update(); this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al crear la categoría');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al crear la categoría'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    reset() { this.modelo = { DESCP: null, DETALLE: null }; this.validation.reset(); },
  },
  watch: {
    show(val) { if (!val) this.reset(); this.isShow = val; },
  },
};
</script>
