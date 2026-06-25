<template>
  <BaseModal v-model="isShow" title="Agregar Recurso" size="lg" persistent @close="handleClose">
    <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <div class="sm:col-span-3">
        <BaseInput
          v-model="modelo.NOMBRES"
          label="Nombre"
          placeholder="Ingrese nombre del recurso"
          required
          :error="validation.firstError('modelo.NOMBRES')"
        />
      </div>

      <!-- Dropzone recurso -->
      <div class="sm:col-span-3 flex flex-col gap-1.5">
        <label class="text-sm font-medium" style="color:var(--text)">
          Recurso <span class="text-brand-pink ml-0.5">*</span>
        </label>
        <div class="dropzone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileSelect">
          <p>{{ preview || 'Arrastra un recurso aquí o haz clic para seleccionar' }}</p>
          <input type="file" ref="fileInput" @change="handleFile" hidden />
        </div>
      </div>

      <BaseInput v-model="modelo.VLR1" label="Valor 1" placeholder="" />
      <BaseInput v-model="modelo.VLR2" label="Valor 2" placeholder="" />
      <BaseInput v-model="modelo.VLR3" label="Valor 3" placeholder="" />

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
  name: 'ModalRecursoAgregar',
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
      preview: null,
      file: null,
      modelo: { NOMBRES: null, VLR1: null, VLR2: null, VLR3: null },
    };
  },
  validators: {
    'modelo.NOMBRES': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    handleClose() { this.reset(); this.close(); },
    async submit() {
      if (this.role?.IDR === 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warn-perm' });
      const valid = await this.$validate();
      if (!valid) return;
      if (!this.file) return toast.warning('Seleccione un archivo', { toastId: 'warn-file' });

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');

      const formData = new FormData();
      formData.append('NOMBRES', this.modelo.NOMBRES);
      formData.append('VLR1', this.modelo.VLR1 || '');
      formData.append('VLR2', this.modelo.VLR2 || '');
      formData.append('VLR3', this.modelo.VLR3 || '');
      formData.append('files', this.file);

      await MantenimientoProxy.createRecurso(formData)
        .then(r => {
          if (r.STATUS) {
            toast.success('Recurso creado correctamente');
            this.reset(); this.update(); this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al crear el recurso');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al crear el recurso'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    triggerFileSelect() { this.$refs.fileInput.click(); },
    handleFile(event) {
      const file = event.target.files[0];
      if (file) { this.preview = file.name; this.file = file; }
      else { this.preview = null; this.file = null; }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) { this.preview = file.name; this.file = file; }
    },
    reset() {
      this.modelo = { NOMBRES: null, VLR1: null, VLR2: null, VLR3: null };
      this.preview = null; this.file = null;
      if (this.$refs.fileInput) this.$refs.fileInput.value = '';
      this.validation.reset();
    },
  },
  watch: {
    show(val) { if (!val) this.reset(); this.isShow = val; },
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
