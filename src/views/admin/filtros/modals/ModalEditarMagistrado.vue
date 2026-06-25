<template>
  <BaseModal v-model="isShow" title="Editar Magistrado" size="md" persistent>
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
  name: 'ModalEditarMagistrado',
  props: {
    show:   { type: Boolean,  default: false },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
    data:   { type: Object,   default: () => ({}) },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: { ID: null, NOMBRES: null, APELLIDOS: null },
    };
  },
  validators: {
    'modelo.ID':       v => Validator.value(v).required('Campo requerido'),
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
      await MagistradoProxy.edit({ ...this.modelo })
        .then(r => {
          if (r.STATUS) {
            toast.success('Magistrado editado con éxito');
            this.reset();
            this.update();
            this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al editar el magistrado');
          }
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al editar el magistrado'))
        .finally(() => { toast.remove(loadingToast); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = { ID: null, NOMBRES: null, APELLIDOS: null };
      this.validation.reset();
    },
  },
  watch: {
    show(val) {
      if (val && this.data) {
        this.modelo = {
          ID:        this.data.ID        || this.data.id        || null,
          NOMBRES:   this.data.NOMBRES   || this.data.nombres   || null,
          APELLIDOS: this.data.APELLIDOS || this.data.apellidos || null,
        };
      }
      if (!val) this.reset();
      this.isShow = val;
    },
  },
};
</script>
