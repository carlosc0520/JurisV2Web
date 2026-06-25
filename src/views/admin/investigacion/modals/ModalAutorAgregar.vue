<template>
  <BaseModal v-model="isShow" title="Agregar Autor" size="lg" persistent @close="handleClose">
    <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <!-- Imagen -->
      <div class="sm:col-span-2 flex flex-col gap-1.5">
        <label class="text-sm font-medium" style="color:var(--text)">Imagen</label>
        <div class="dropzone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileSelect">
          <p v-if="!preview">Arrastra una imagen aquí o haz clic para seleccionar</p>
          <img v-if="preview" :src="preview" class="preview" />
          <input type="file" ref="fileInput" accept="image/*" @change="handleFile" hidden />
        </div>
      </div>

      <BaseInput
        v-model="modelo.NOMBRES"
        label="Nombres"
        placeholder="Ingrese nombres"
        required
        :error="validation.firstError('modelo.NOMBRES')"
      />

      <BaseInput
        v-model="modelo.APELLIDOS"
        label="Apellidos"
        placeholder="Ingrese apellidos"
      />

      <!-- Tags: Redes sociales -->
      <div class="sm:col-span-2 flex flex-col gap-1.5">
        <label class="text-sm font-medium" style="color:var(--text)">Redes sociales</label>
        <div
          class="flex flex-wrap gap-1.5 p-2 border rounded-lg min-h-[42px] cursor-text"
          style="background:var(--bg-input);border-color:var(--border)"
          @click="$refs.tagInputRef?.focus()">
          <span v-for="(tag, i) in modelo.REDES" :key="i"
            class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {{ tag }}
            <button type="button" @click.stop="modelo.REDES.splice(i, 1)"
              class="leading-none opacity-70 hover:opacity-100">&times;</button>
          </span>
          <input
            ref="tagInputRef"
            v-model="tagInput"
            @keydown.enter.prevent="addTag"
            type="text"
            class="flex-1 min-w-[140px] bg-transparent outline-none text-sm"
            placeholder="Escribe y presiona Enter o coma..."
            style="color:var(--text)"
            />
            <!-- @keydown.188.prevent="addTag" -->
        </div>
      </div>

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
  name: 'ModalAutorAgregar',
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
      tagInput: '',
      modelo: { NOMBRES: null, APELLIDOS: null, REDES: [], DETALLE: null },
    };
  },
  validators: {
    'modelo.NOMBRES': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    handleClose() { this.reset(); this.close(); },
    addTag() {
      const v = this.tagInput.trim();
      if (v) { this.modelo.REDES.push(v); this.tagInput = ''; }
    },
    async submit() {
      if (this.role?.IDR === 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warn-perm' });
      const valid = await this.$validate();
      if (!valid) return;

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');

      const formData = new FormData();
      formData.append('NOMBRES', this.modelo.NOMBRES);
      formData.append('APELLIDOS', this.modelo.APELLIDOS || '');
      formData.append('REDES', this.modelo.REDES.join(','));
      formData.append('DETALLE', this.modelo.DETALLE || '');
      formData.append('RUTA', '');
      if (this.file) formData.append('files', this.file);

      await MantenimientoProxy.createAutor(formData)
        .then(r => {
          if (r.STATUS) {
            toast.success('Autor creado correctamente');
            this.reset(); this.update(); this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al crear el autor');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al crear el autor'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    triggerFileSelect() { this.$refs.fileInput.click(); },
    handleFile(event) {
      const file = event.target.files[0];
      if (file?.type.startsWith('image/')) { this.preview = URL.createObjectURL(file); this.file = file; }
      else { this.preview = null; this.file = null; }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) { this.preview = URL.createObjectURL(file); this.file = file; }
    },
    reset() {
      this.modelo = { NOMBRES: null, APELLIDOS: null, REDES: [], DETALLE: null };
      this.preview = null; this.file = null; this.tagInput = '';
      this.validation.reset();
    },
  },
  watch: {
    show(val) { if (!val) this.reset(); this.isShow = val; },
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
