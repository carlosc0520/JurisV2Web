<template>
  <BaseModal v-model="isShow" :title="isEdit ? 'Editar categoría' : 'Nueva categoría'" size="sm" persistent @close="handleClose">
    <form @submit.prevent="submit" class="flex flex-col gap-4">
      <BaseInput
        v-model="modelo.descripcion"
        label="Descripción"
        placeholder="Ej. El criterio y sus límites"
        required
        :error="validation.firstError('modelo.descripcion')"
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
import PublicacionesProxy from '@/proxies/PublicacionesProxy';

export default {
  name: 'ModalPublicacionCategoria',
  props: {
    show:   { type: Boolean,  default: false },
    data:   { type: Object,   default: null },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: { id: null, descripcion: '' },
    };
  },
  computed: {
    isEdit() { return !!this.modelo.id; },
  },
  validators: {
    'modelo.descripcion': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    handleClose() { this.isShow = false; this.close(); },
    async submit() {
      const valid = await this.$validate();
      if (!valid) return;

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');

      await PublicacionesProxy.saveCategoria(this.modelo)
        .then(r => {
          const result = r?.DATA ?? r;
          if (result.STATUS) {
            toast.success(result.MESSAGE || 'Categoría guardada con éxito');
            this.update(); this.close();
          } else {
            toast.error(result.MESSAGE || 'Error al guardar la categoría');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al guardar la categoría'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = this.data
        ? { id: this.data.ID ?? this.data.id, descripcion: this.data.descripcion ?? this.data.DESCRIPCION ?? '' }
        : { id: null, descripcion: '' };
      this.validation?.reset();
    },
  },
  watch: {
    show(val) {
      this.isShow = val;
      if (val) this.reset();
      else setTimeout(() => this.reset(), 200);
    },
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
