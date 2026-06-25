<template>
  <BaseModal v-model="isShow" title="Editar Legislación" size="xl" persistent @close="handleClose">
    <form @submit.prevent="submit" class="flex flex-col gap-4">

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput label="Número" required v-model="modelo.NMRCN"
          :error="validation.hasError('modelo.NMRCN') ? validation.firstError('modelo.NMRCN') : undefined"/>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Situación</label>
          <AppSelect v-model="modelo.SITUACION" full-width>
            <option value="">Seleccione...</option>
            <option value="Vigente">Vigente</option>
            <option value="Modificado">Modificado</option>
            <option value="Derogado">Derogado</option>
          </AppSelect>
        </div>
        <BaseInput label="Título" required  v-model="modelo.TITLE"
          :error="validation.hasError('modelo.TITLE') ? validation.firstError('modelo.TITLE') : undefined"/>
        <BaseInput label="Título Descriptivo" v-model="modelo.RTITLE"/>
      </div>

      <div class="border-t border-slate-200 dark:border-gray-700 pt-2">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Identificación</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppTreeSelect label="Tipo de norma" required v-model="modelo.TPONRMA" :data="selects.tiponorma"
          :error="validation.hasError('modelo.TPONRMA') ? validation.firstError('modelo.TPONRMA') : undefined"/>
        <AppTreeSelect label="Órgano emisor" required v-model="modelo.OEMISOR" :data="selects.organismos" multiple
          :error="validation.hasError('modelo.OEMISOR') ? validation.firstError('modelo.OEMISOR') : undefined"/>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Fecha de publicación <span class="text-red-500">*</span></label>
          <input type="date" class="input-base" :class="{'border-red-400': validation.hasError('modelo.FRESOLUTION')}" v-model="modelo.FRESOLUTION"/>
          <p v-if="validation.hasError('modelo.FRESOLUTION')" class="text-[11px] text-red-500">{{ validation.firstError('modelo.FRESOLUTION') }}</p>
        </div>
      </div>

      <div class="border-t border-slate-200 dark:border-gray-700 pt-2">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Documentos</p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Documento Principal</label>
        <input class="custom-input" type="file" accept=".pdf" @change="modelo.NENTRIEFILE = $event.target.files[0]">
        <div v-if="modelo.ENTRIEFILE" class="flex items-center gap-3 mt-1">
          <span class="text-xs text-slate-600 dark:text-gray-400">
            <span class="font-semibold">Archivo actual:</span> {{ formatNameFile(modelo.ENTRIEFILE) }}
          </span>
          <a @click.prevent="downloadFile(modelo.ENTRIEFILE, 'LEGISLACION')"
            class="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 cursor-pointer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 18a3.5 3.5 0 0 0 0-7h-1a5 4.5 0 0 0-11-2a4.6 4.4 0 0 0-2.1 8.4"/>
              <path d="M12 13l0 9"/><path d="M9 19l3 3l3-3"/>
            </svg>
            Descargar
          </a>
        </div>
        <p class="text-[11px] text-amber-500">* Si sube un nuevo archivo, el anterior será reemplazado</p>
      </div>

      <BaseRichInput label="Resumen / Descripción (opcional)" v-model="modelo.RESUMEN"/>

      <div class="flex flex-col gap-1.5">
        <AppAutocomplete label="Normas Vinculadas" v-model="searchQueryNormas"
          :fetch-suggestions="fetchNormasSuggestions"
          placeholder="Escribe para buscar normas..." :trigger-on-focus="false" clearable
          @select="handleSelectNorma">
          <template #default="{ item }">
            <div class="flex justify-between items-center"><span>{{ item.label }}</span></div>
          </template>
        </AppAutocomplete>
        <div v-if="normasSeleccionadas.length > 0" class="flex flex-col gap-1.5 mt-1">
          <div v-for="norma in normasSeleccionadas" :key="norma.value"
            class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <span class="text-xs text-slate-600 dark:text-gray-300">{{ norma.label }}</span>
            <button type="button" @click="removeNorma(norma.value)" class="text-red-400 hover:text-red-600 ml-2 text-sm leading-none">×</button>
          </div>
        </div>
      </div>

      <div class="flex gap-2 pt-2 border-t border-slate-200 dark:border-gray-700">
        <button type="button" class="btn btn-sm text-xs" @click="localStorageSave">Guardar borrador</button>
        <button type="button" class="btn btn-sm text-xs" @click="UpdateLocaleStorage">Cargar borrador</button>
      </div>

    </form>
    <template #footer>
      <CancelButton @click="handleClose" :disabled="loadingSubmit"/>
      <SaveButton label="Guardar" loadingLabel="Guardando..." @click="submit" :loading="loadingSubmit"/>
    </template>
  </BaseModal>
</template>

<script>
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';
import adminEntriesProxy from "@/proxies/AdminEntriesProxy.js";

export default {
  props: {
    show:    { type: Boolean,  default: false },
    close:   { type: Function, default: () => {} },
    update:  { type: Function, default: () => {} },
    selects: { type: Object,   default: () => {} },
    data:    { type: Object,   default: () => {} },
    role:    { type: Object,   default: () => {} },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      searchQueryNormas: '',
      normasSeleccionadas: [],
      modelo: {
        ID: null, TITLE: null, RTITLE: null, SITUACION: null,
        TPONRMA: null, OEMISOR: [], NMRCN: null,
        FRESOLUTION: null, ENTRIEFILE: null, NENTRIEFILE: null, RESUMEN: null, IDSVIN: [],
      },
    };
  },
  validators: {
    'modelo.ID':         v => Validator.value(v).required("Campo requerido"),
    'modelo.TITLE':      v => Validator.value(v).required("Campo requerido"),
    'modelo.NMRCN':      v => Validator.value(v).required("Campo requerido"),
    'modelo.TPONRMA':    v => Validator.value(v).required("Campo requerido"),
    'modelo.OEMISOR':    v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.FRESOLUTION':v => Validator.value(v).required("Campo requerido"),
  },
  methods: {
    handleClose() { this.close(); },
    formatNameFile(file) {
      if (!file) return "";
      return file.split('/').pop() || "";
    },
    localStorageSave() { localStorage.setItem("legislationEntrieEdit", JSON.stringify(this.modelo)); },
    UpdateLocaleStorage() {
      const data = JSON.parse(localStorage.getItem("legislationEntrieEdit"));
      if (data) this.modelo = data;
    },
    async submit() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });
      const validate = await this.$validate();
      if (!validate) return;

      const tipoNormal = [];
      if (this.modelo.TPONRMA) tipoNormal.push(this.modelo.TPONRMA);

      const formData = new FormData();
      formData.append("ID", this.modelo.ID);
      formData.append("files", this.modelo.NENTRIEFILE);
      formData.append("ENTRIEFILE", this.modelo.ENTRIEFILE);
      formData.append("TITLE", this.modelo.TITLE);
      formData.append("RTITLE", this.modelo.RTITLE);
      formData.append("SITUACION", this.modelo.SITUACION);
      formData.append("TPONRMA", tipoNormal.join(","));
      formData.append("OEMISOR", this.modelo.OEMISOR.join(","));
      formData.append("NMRCN", this.modelo.NMRCN);
      formData.append("FRESOLUTION", this.modelo.FRESOLUTION);
      formData.append("TYPE", "legislations");
      formData.append("TIPO", "executive");
      formData.append("RESUMEN", this.modelo.RESUMEN || "");
      formData.append("IDSVIN", Array.isArray(this.modelo.IDSVIN) ? this.modelo.IDSVIN.join(",") : "");

      this.loadingSubmit = true;
      const loadingToast = toast.loading("Espere un momento...");
      await adminEntriesProxy.edit(formData)
        .then(response => {
          if (response.STATUS) {
            toast.success("Legislación editada con éxito");
            this.reset(); this.update(); this.close();
          } else {
            toast.error(response.MESSAGE);
          }
        })
        .catch(err => toast.error(err?.MESSAGE || "Error al editar la legislación"))
        .finally(() => { toast.remove(loadingToast); this.loadingSubmit = false; });
    },
    async downloadFile(path, tipo = "") {
      const loadingToast = toast.loading("Espere un momento...");
      this.loadingSubmit = true;
      await adminEntriesProxy.downloadFile({ PATH: path })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement('a');
          link.href = url;
          const ext = path.split('.').pop();
          link.setAttribute('download', (this.modelo.TITLE + "-" + tipo).toUpperCase() + '.' + ext);
          document.body.appendChild(link);
          link.click();
          toast.success("Archivo descargado correctamente", { toastId: "success" });
        })
        .catch(error => toast.error(error?.MESSAGE || "Error al descargar el archivo", { toastId: "error" }))
        .finally(() => { toast.remove(loadingToast); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = {
        ID: null, TITLE: null, RTITLE: null, SITUACION: null,
        TPONRMA: null, OEMISOR: [], NMRCN: null,
        FRESOLUTION: null, ENTRIEFILE: null, NENTRIEFILE: null, RESUMEN: null, IDSVIN: [],
      };
      document.querySelectorAll("input[type='file']").forEach(i => i.value = "");
      this.searchQueryNormas = '';
      this.normasSeleccionadas = [];
      this.validation.reset();
    },
    async fetchNormasSuggestions(queryString, cb) {
      if (!queryString || queryString.length < 2) return cb([]);
      try {
        const res = await adminEntriesProxy.listSearchNames({ search: queryString, TYPE: "legislations" });
        cb(res.map(item => ({ value: item.ID, label: item.TITLE || item.RTITLE || 'Sin título' })));
      } catch { cb([]); }
    },
    handleSelectNorma(item) {
      if (!this.normasSeleccionadas.find(n => n.value === item.value)) {
        this.normasSeleccionadas.unshift({ value: item.value, label: item.label });
        this.modelo.IDSVIN = this.normasSeleccionadas.map(n => n.value);
      }
      this.searchQueryNormas = '';
    },
    removeNorma(id) {
      this.normasSeleccionadas = this.normasSeleccionadas.filter(n => n.value !== id);
      this.modelo.IDSVIN = this.normasSeleccionadas.map(n => n.value);
    },
  },
  watch: {
    show: {
      handler(value) {
        if (value) {
          this.modelo = {
            ...this.data,
            TPONRMA: this.data.TPONRMA && this.data.TPONRMA.length > 0 ? this.data.TPONRMA[0] : null,
          };
          if (this.data.JIDSVIN) {
            try {
              const normas = JSON.parse(this.data.JIDSVIN);
              if (Array.isArray(normas)) {
                this.normasSeleccionadas = normas.map(n => ({ value: n.ID, label: n.TITLE }));
                this.modelo.IDSVIN = normas.map(n => n.ID);
              }
            } catch (e) { console.error('Error parsing JIDSVIN:', e); }
          } else {
            this.normasSeleccionadas = [];
            this.modelo.IDSVIN = [];
          }
        }
        if (!value) this.reset();
        this.isShow = value;
      }
    }
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
