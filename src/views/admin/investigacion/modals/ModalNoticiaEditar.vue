<template>
  <BaseModal v-model="isShow" title="Editar Investigación" size="xl" persistent @close="handleClose">
    <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <!-- TIPO (solo lectura) -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium" style="color:var(--text)">Tipo</label>
        <input type="text" class="input-base opacity-70 cursor-default" readonly
          :value="selects.categorias?.find(t => t.value === modelo.TIPO)?.text || '-'" />
      </div>

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
        <div v-if="modelo.IMAGEN && !file" class="mt-1">
          <a :href="resourcesUrl + modelo.IMAGEN" target="_blank"
             class="inline-flex items-center gap-1.5 text-[0.8rem] text-indigo-500 no-underline font-medium py-1 px-2.5 border border-indigo-200 rounded-md bg-indigo-50 transition-all hover:bg-indigo-100">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar imagen actual
          </a>
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

      <!-- PDF -->
      <div v-if="modelo.TIPO" class="sm:col-span-2">
        <label class="text-sm font-medium mb-1.5 block" style="color:var(--text)">
          Documento PDF
          <span v-if="!modelo.ARCHIVO" class="text-brand-pink ml-0.5">*</span>
        </label>
        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-4 px-5 cursor-pointer flex items-center gap-2.5 transition-colors duration-200 hover:border-brand-blue hover:text-brand-blue"
             style="color:var(--text-muted)" @click="triggerPdfSelect">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p class="m-0 text-sm truncate">{{ pdfFileName || (modelo.ARCHIVO ? modelo.ARCHIVO.split('/').pop() : 'Haz clic para seleccionar un PDF') }}</p>
          <input type="file" ref="pdfInput" accept="application/pdf" @change="handlePdf" hidden />
        </div>
        <div v-if="modelo.ARCHIVO && !pdfFile" class="mt-2">
          <a :href="resourcesUrl + modelo.ARCHIVO" target="_blank"
             class="inline-flex items-center gap-1.5 text-[0.8rem] text-indigo-500 no-underline font-medium py-1 px-2.5 border border-indigo-200 rounded-md bg-indigo-50 transition-all hover:bg-indigo-100">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar PDF actual
          </a>
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
  name: 'ModalNoticiaEditar',
  props: {
    show:    { type: Boolean,  default: false },
    close:   { type: Function, default: () => {} },
    update:  { type: Function, default: () => {} },
    data:    { type: Object,   default: () => ({}) },
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
        ID: null, TIPO: null, TITULO: null, SUBTITULO: null, IMAGEN: null,
        IDAUTORES: [], ORGANO: null, FCHPUB: null, FCHCONSULTA: null, ARCHIVO: null,
      },
    };
  },
  computed: {
    // process.env no es un global permitido dentro del <template> del compilador
    // de Vue 3 (rompe con "Cannot read properties of undefined (reading 'env')"),
    // por eso se resuelve aquí y se usa como computed en el template.
    resourcesUrl() {
      return process.env.VUE_APP_RESOURCES_URL || 'https://resources.jurissearch.com';
    },
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
      if (!this.modelo.ID) return toast.warning('No se encontró el identificador del registro', { toastId: 'warn-id' });
      if (!this.file && !this.modelo.IMAGEN) return toast.warning('Seleccione una imagen de portada', { toastId: 'warn-img' });
      if (this.modelo.TIPO && !this.pdfFile && !this.modelo.ARCHIVO) return toast.warning('El documento PDF es requerido para este tipo', { toastId: 'warn-pdf' });

      const valid = await this.$validate();
      if (!valid) return;

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');

      const formData = new FormData();
      formData.append('ID', this.modelo.ID);
      formData.append('TIPO', this.modelo.TIPO);
      formData.append('TITULO', this.modelo.TITULO);
      formData.append('SUBTITULO', this.modelo.SUBTITULO || '');
      formData.append('IMAGEN', this.modelo.IMAGEN || '');
      formData.append('ARCHIVO', this.modelo.ARCHIVO || '');
      formData.append('FCHPUB', this.modelo.FCHPUB || '');
      formData.append('FCHCONSULTA', this.modelo.FCHCONSULTA || '');
      formData.append('ORGANO', this.modelo.ORGANO || '');
      formData.append('IDAUTORES', this.modelo.IDAUTORES?.length ? this.modelo.IDAUTORES.join(',') : '');
      if (this.file) formData.append('files', this.file);
      if (this.pdfFile) formData.append('pdf', this.pdfFile);

      await MantenimientoProxy.edit(formData)
        .then(r => {
          const result = r?.DATA ?? r;
          if (result.STATUS) {
            toast.success('Registro editado correctamente');
            this.reset(); this.update(); this.close();
          } else {
            toast.error(result.MESSAGE || 'Error al editar el registro');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al editar el registro'))
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
        ID: null, TIPO: null, TITULO: null, SUBTITULO: null, IMAGEN: null,
        IDAUTORES: [], ORGANO: null, FCHPUB: null, FCHCONSULTA: null, ARCHIVO: null,
      };
      this.preview = null; this.file = null; this.pdfFile = null; this.pdfFileName = null;
      this.validation.reset();
    },
  },
  watch: {
    show(val) {
      if (val && this.data) {
        const idAutores = this.data.IDAUTORES ?? this.data.idAutores;
        this.modelo = {
          ID:          this.data.ID          ?? this.data.id,
          TIPO:        this.data.TIPO        ?? this.data.tipo        ?? null,
          TITULO:      this.data.TITULO      ?? this.data.titulo      ?? null,
          SUBTITULO:   this.data.SUBTITULO   ?? this.data.subtitulo   ?? null,
          IMAGEN:      this.data.IMAGEN      ?? this.data.imagen      ?? null,
          IDAUTORES:   idAutores ? String(idAutores).split(',').map(Number).filter(Boolean) : [],
          ORGANO:      this.data.ORGANO      ? Number(this.data.ORGANO)      : (this.data.organo ? Number(this.data.organo) : null),
          FCHPUB:      (this.data.FCHPUB ?? this.data.fchPub ?? this.data.fechaPublicacion)           ? (this.data.FCHPUB ?? this.data.fchPub ?? this.data.fechaPublicacion).substring(0, 10)           : null,
          FCHCONSULTA: (this.data.FCHCONSULTA ?? this.data.fchConsulta ?? this.data.fechaConsulta) ? (this.data.FCHCONSULTA ?? this.data.fchConsulta ?? this.data.fechaConsulta).substring(0, 10) : null,
          ARCHIVO:     this.data.ARCHIVO     ?? this.data.archivo     ?? null,
        };
        this.preview = this.modelo.IMAGEN ? (`${this.resourcesUrl}/` + this.modelo.IMAGEN) : null;
        this.file = null; this.pdfFile = null; this.pdfFileName = null;
        this.$nextTick(() => { if (this.$refs.fileInput) this.$refs.fileInput.value = null; });
      }
      this.isShow = val;
      if (!val) setTimeout(() => this.reset(), 200);
    },
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
