<template>
  <BaseModal v-model="isShow" title="Agregar Investigación" size="xl" persistent @close="handleClose">
    <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <!-- TIPO -->
      <BaseSelect
        v-model="modelo.TIPO"
        label="Tipo"
        required
        :error="validation.firstError('modelo.TIPO')"
      >
        <option :value="''">-- Seleccione un tipo --</option>
        <option v-for="t in selects.categorias" :key="t.value" :value="t.value">{{ t.text }}</option>
      </BaseSelect>

      <!-- TITULO -->
      <BaseInput
        v-model="modelo.TITULO"
        label="Título"
        placeholder="Ingrese el título"
        required
        :error="validation.firstError('modelo.TITULO')"
      />

      <!-- SUBTITULO (condicional) -->
      <div v-if="isView.SUBTITULOS.includes(modelo.TIPO)" class="sm:col-span-2">
        <BaseInput
          v-model="modelo.SUBTITULO"
          label="Subtítulo"
          placeholder="Ingrese el subtítulo"
          required
          :error="validation.firstError('modelo.SUBTITULO')"
        />
      </div>

      <!-- IMAGEN -->
      <div class="sm:col-span-2 flex flex-col gap-1.5">
        <label class="text-sm font-medium" style="color:var(--text)">
          Imagen de portada <span class="text-brand-pink ml-0.5">*</span>
        </label>
        <div class="dropzone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileSelect">
          <p v-if="!preview">Arrastra una imagen aquí o haz clic para seleccionar</p>
          <img v-if="preview" :src="preview" class="preview" />
          <input type="file" ref="fileInput" accept="image/*" @change="handleFile" hidden />
        </div>
      </div>

      <!-- AUTORES -->
      <div class="sm:col-span-2">
        <AppTreeSelect
          v-model="modelo.IDAUTORES"
          label="Autores"
          required
          :data="selects.autores"
          multiple
          :error="validation.firstError('modelo.IDAUTORES')"
        />
      </div>

      <!-- ORGANO (condicional) -->
      <div v-if="isView.ORGANOS.includes(modelo.TIPO)">
        <AppTreeSelect
          v-model="modelo.ORGANO"
          label="Órgano jurisdiccional"
          required
          :data="selects.organos"
          placeholder="Seleccione un órgano"
          :error="validation.firstError('modelo.ORGANO')"
        />
      </div>

      <!-- FECHA PUBLICACIÓN (condicional) -->
      <BaseInput
        v-if="isView.FECHAS_PUB.includes(modelo.TIPO)"
        v-model="modelo.FCHPUB"
        type="date"
        label="Fecha de publicación"
        required
        :error="validation.firstError('modelo.FCHPUB')"
      />

      <!-- FECHA CONSULTA (condicional) -->
      <BaseInput
        v-if="isView.FECHAS_CONSULTA.includes(modelo.TIPO)"
        v-model="modelo.FCHCONSULTA"
        type="date"
        label="Fecha de consulta"
        required
        :error="validation.firstError('modelo.FCHCONSULTA')"
      />

      <!-- PDF (condicional: cuando hay tipo seleccionado) -->
      <div v-if="modelo.TIPO" class="sm:col-span-2">
        <label class="text-sm font-medium mb-1.5 block" style="color:var(--text)">
          Documento PDF <span class="text-brand-pink ml-0.5">*</span>
        </label>
        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-4 px-5 cursor-pointer flex items-center gap-2.5 transition-colors duration-200 hover:border-brand-blue hover:text-brand-blue"
             style="color:var(--text-muted)" @click="triggerPdfSelect">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p class="m-0 text-sm truncate">{{ pdfFileName || 'Haz clic para seleccionar un PDF' }}</p>
          <input type="file" ref="pdfInput" accept="application/pdf" @change="handlePdf" hidden />
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
  name: 'ModalNoticiaAgregar',
  props: {
    show:    { type: Boolean,  default: false },
    close:   { type: Function, default: () => {} },
    update:  { type: Function, default: () => {} },
    role:    { type: Object,   default: () => ({}) },
    selects: { type: Object,   default: () => ({}) },
  },
  data() {
    return {
      isView: {
        SUBTITULOS:      [8, 10, "8", "10"],
        FECHAS_PUB:      [6, 8, 10, 11, "6", "8", "10", "11"],
        FECHAS_CONSULTA: [9, "9"],
        ORGANOS:         [8, "8"],
      },
      isShow: false,
      loadingSubmit: false,
      preview: null,
      file: null,
      pdfFile: null,
      pdfFileName: null,
      modelo: {
        TIPO: '', TITULO: null, SUBTITULO: null, IMAGEN: null,
        IDAUTORES: [], ORGANO: null, FCHPUB: null, FCHCONSULTA: null, ARCHIVO: null,
      },
    };
  },
  validators: {
    'modelo.TIPO':    v => Validator.value(v).required('Campo requerido'),
    'modelo.TITULO':  v => Validator.value(v).required('Campo requerido'),
    'modelo.IDAUTORES': v => Validator.value(v).required('Campo requerido'),
    'modelo.SUBTITULO': function (v) {
      if (this.isView.SUBTITULOS.includes(this.modelo.TIPO))
        return Validator.value(v).required('Campo requerido');
    },
    'modelo.ORGANO': function (v) {
      if (this.isView.ORGANOS.includes(this.modelo.TIPO))
        return Validator.value(v).required('Campo requerido');
    },
    'modelo.FCHPUB': function (v) {
      if (this.isView.FECHAS_PUB.includes(this.modelo.TIPO))
        return Validator.value(v).required('Campo requerido');
    },
    'modelo.FCHCONSULTA': function (v) {
      if (this.isView.FECHAS_CONSULTA.includes(this.modelo.TIPO))
        return Validator.value(v).required('Campo requerido');
    },
  },
  methods: {
    handleClose() { this.isShow = false; this.close(); },
    async submit() {
      if (this.role?.IDR === 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warn-perm' });
      const valid = await this.$validate();
      if (!valid) return;
      if (!this.file) return toast.warning('Seleccione una imagen de portada', { toastId: 'warn-img' });
      if (this.modelo.TIPO && !this.pdfFile) return toast.warning('El documento PDF es requerido para este tipo', { toastId: 'warn-pdf' });

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');

      const formData = new FormData();
      formData.append('TIPO', this.modelo.TIPO);
      formData.append('TITULO', this.modelo.TITULO);
      formData.append('SUBTITULO', this.modelo.SUBTITULO || '');
      formData.append('FCHPUB', this.modelo.FCHPUB || '');
      formData.append('FCHCONSULTA', this.modelo.FCHCONSULTA || '');
      formData.append('ORGANO', this.modelo.ORGANO || '');
      formData.append('files', this.file);
      formData.append('IDAUTORES', this.modelo.IDAUTORES?.length ? this.modelo.IDAUTORES.join(',') : '');
      if (this.pdfFile) formData.append('pdf', this.pdfFile);

      await MantenimientoProxy.create(formData)
        .then(r => {
          const result = r?.DATA ?? r;
          if (result.STATUS) {
            toast.success('Registro creado con éxito');
            this.reset(); this.update(); this.close();
          } else {
            toast.error(result.MESSAGE || 'Error al crear el registro');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al crear el registro'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    triggerFileSelect() { this.$refs.fileInput.click(); },
    triggerPdfSelect()  { this.$refs.pdfInput.click(); },
    handleFile(event) {
      const file = event.target.files[0];
      if (file?.type.startsWith('image/')) { this.preview = URL.createObjectURL(file); this.file = file; }
      else { this.preview = null; this.file = null; }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) { this.preview = URL.createObjectURL(file); this.file = file; }
    },
    handlePdf(event) {
      const file = event.target.files[0];
      if (file?.type === 'application/pdf') { this.pdfFile = file; this.pdfFileName = file.name; }
      else { this.pdfFile = null; this.pdfFileName = null; }
    },
    reset() {
      this.modelo = {
        TIPO: null, TITULO: null, SUBTITULO: null, IMAGEN: null,
        IDAUTORES: [], ORGANO: null, FCHPUB: null, FCHCONSULTA: null, ARCHIVO: null,
      };
      this.preview = null; this.file = null; this.pdfFile = null; this.pdfFileName = null;
      this.validation.reset();
    },
  },
  watch: {
    show(val) {
      this.isShow = val;
      // Resetea después de que la animación de cierre termine (leave: 150ms)
      if (!val) setTimeout(() => this.reset(), 200);
    },
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
