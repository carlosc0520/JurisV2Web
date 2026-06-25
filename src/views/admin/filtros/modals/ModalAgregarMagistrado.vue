<template>
  <BaseModal v-model="isShow" title="Agregar Magistrado" size="md" persistent>
    <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <BaseInput
        v-model="modelo.NOMBRES"
        label="Nombres"
        placeholder="Ingrese nombres"
      />

      <BaseInput
        v-model="modelo.APELLIDOS"
        label="Apellidos"
        placeholder="Ingrese apellidos"
        required
        :error="validation.firstError('modelo.APELLIDOS')"
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
import MagistradoProxy from "@/proxies/Magistrados.Proxy";

export default {
  name: 'ModalAgregarMagistrado',
  props: {
    show:   { type: Boolean,  default: false },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: { NOMBRES: null, APELLIDOS: null },
    };
  },
  validators: {
    'modelo.APELLIDOS': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    handleClose() {
      this.reset();
      this.close();
    },
    async submit() {
      const valid = await this.$validate();
      if (!valid) return;

      this.loadingSubmit = true;
      const loadingToast = toast.loading('Espere un momento...');
      await MagistradoProxy.create({ ...this.modelo })
        .then(r => {
          if (r.STATUS) {
            toast.success('Magistrado creado con éxito');
            this.reset();
            this.update();
            this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al crear el magistrado');
          }
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al crear el magistrado'))
        .finally(() => { toast.remove(loadingToast); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = { NOMBRES: null, APELLIDOS: null };
      this.validation.reset();
    },
  },
  watch: {
    show(val) {
      if (!val) this.reset();
      this.isShow = val;
    },
  },
};
</script>
