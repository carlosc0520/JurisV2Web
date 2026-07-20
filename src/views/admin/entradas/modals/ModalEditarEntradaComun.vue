<template>
  <BaseModal v-model="isShow" title="Editar Jurisprudencia Común" size="xl" persistent @close="handleClose">
    <form @submit.prevent="submit" class="flex flex-col gap-4">

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BaseInput label="Título de entrada" required 
          v-model="modelo.TITLE"
          :error="validation.hasError('modelo.TITLE') ? validation.firstError('modelo.TITLE') : undefined"/>
        <BaseInput label="Título Descriptivo" v-model="modelo.RTITLE"/>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Vinculatoriedad</label>
          <div class="flex items-center gap-2 mt-1">
            <button type="button" @click="modelo.ISBINDING = !modelo.ISBINDING"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
              :class="modelo.ISBINDING ? 'bg-purple-600' : 'bg-gray-300'">
              <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                :class="modelo.ISBINDING ? 'translate-x-6' : 'translate-x-1'"/>
            </button>
            <span class="text-xs text-slate-500">{{ modelo.ISBINDING ? 'Sí' : 'No' }}</span>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200 dark:border-gray-700 pt-2">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Identificación</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Fecha de resolución <span class="text-red-500">*</span></label>
          <input type="date" class="input-base" :class="{'border-red-400': validation.hasError('modelo.FRESOLUTION')}" v-model="modelo.FRESOLUTION"/>
          <p v-if="validation.hasError('modelo.FRESOLUTION')" class="text-[11px] text-red-500">{{ validation.firstError('modelo.FRESOLUTION') }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppTreeSelect label="Ámbito" required v-model="modelo.AMBIT" :data="selects.ambitos" multiple
          :error="validation.hasError('modelo.AMBIT') ? validation.firstError('modelo.AMBIT') : undefined"/>
        <AppTreeSelect label="Delito" v-model="modelo.DELITO" :data="selects.delitos" multiple/>
        <AppTreeSelect label="Recurso" required v-model="modelo.RECURSO" :data="selects.recursos" multiple
          :error="validation.hasError('modelo.RECURSO') ? validation.firstError('modelo.RECURSO') : undefined"/>
        <AppTreeSelect label="Materia" v-model="modelo.MATERIA" :data="selects.materias" multiple/>
        <AppTreeSelect label="Jurisdicción" required v-model="modelo.JURISDICCION" :data="selects.jurisdicion" multiple
          :error="validation.hasError('modelo.JURISDICCION') ? validation.firstError('modelo.JURISDICCION') : undefined"/>
        <AppTreeSelect label="Jurisprudencia vinculante" v-model="modelo.JURISDICCIONV" :data="selects.jurisdicionV" multiple/>
        <AppTreeSelect label="Órgano jurisdiccional" required v-model="modelo.OJURISDICCIONAL" :data="selects.jurisdiccionales" multiple
          :error="validation.hasError('modelo.OJURISDICCIONAL') ? validation.firstError('modelo.OJURISDICCIONAL') : undefined"/>
        <AppTreeSelect label="Magistrados" required v-model="modelo.MAGISTRATES" :data="selects.magistrados" multiple
          :error="validation.hasError('modelo.MAGISTRATES') ? validation.firstError('modelo.MAGISTRATES') : undefined"/>
        <TagInput label="Voto Disidente" hint="discrepa del fallo final" v-model="modelo.VDESIDENTE"/>
        <TagInput label="Voto Concurrente" hint="disiente de la argumentación, no del fallo" v-model="modelo.CVOTE"/>
      </div>

      <div class="border-t border-slate-200 dark:border-gray-700 pt-2">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Documentos</p>
      </div>

      <label class="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-gray-400 cursor-pointer w-fit">
        <input type="checkbox" v-model="modelo.REQUIERE_ENLACE_EXTERNO" class="rounded"/>
        No se puede adjuntar el documento (remitir a fuente oficial)
      </label>

      <div v-if="!modelo.REQUIERE_ENLACE_EXTERNO" class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Documento Principal</label>
        <input class="custom-input" type="file" accept=".pdf" @change="modelo.NENTRIEFILE = $event.target.files[0]">
        <div v-if="modelo.ENTRIEFILE" class="flex items-center gap-3 mt-1">
          <span class="text-xs text-slate-600 dark:text-gray-400">
            <span class="font-semibold">Archivo actual:</span> {{ formatNameFile(modelo.ENTRIEFILE) }}
          </span>
          <a @click.prevent="downloadFile(modelo.ENTRIEFILE, 'ENTRADA PRINCIPAL')"
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

      <div v-else class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Enlace a fuente oficial <span class="text-red-500">*</span></label>
        <BaseInput
          v-model="modelo.ENLACE_OFICIAL"
          placeholder="https://..."
          :error="validation.hasError('modelo.ENLACE_OFICIAL') ? validation.firstError('modelo.ENLACE_OFICIAL') : undefined">
          <template v-if="modelo.ENLACE_OFICIAL" #append>
            <button type="button" title="Abrir enlace" tabindex="-1"
              class="pointer-events-auto text-slate-400 hover:text-brand-blue transition-colors"
              @click="openEnlaceOficial">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </button>
          </template>
        </BaseInput>
      </div>

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

      <div class="border-t border-slate-200 dark:border-gray-700 pt-2">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contenido</p>
      </div>

      <TagInput label="Palabras clave" required v-model="modelo.KEYWORDS"
        :error="validation.hasError('modelo.KEYWORDS') ? validation.firstError('modelo.KEYWORDS') : undefined"/>

      <BaseRichInput label="Tema" required v-model="modelo.TEMA"
        :error="validation.hasError('modelo.TEMA') ? validation.firstError('modelo.TEMA') : undefined"/>

      <BaseRichInput label="Subtema" required v-model="modelo.SUBTEMA"
        :error="validation.hasError('modelo.SUBTEMA') ? validation.firstError('modelo.SUBTEMA') : undefined"/>

      <BaseRichInput label="Síntesis de los fundamentos jurídicos relevantes" required v-model="modelo.SHORTSUMMARY"
        :error="validation.hasError('modelo.SHORTSUMMARY') ? validation.firstError('modelo.SHORTSUMMARY') : undefined"/>

      <BaseRichInput label="Fundamentos jurídicos relevantes" required v-model="modelo.RESUMEN"
        :error="validation.hasError('modelo.RESUMEN') ? validation.firstError('modelo.RESUMEN') : undefined"/>

      <div class="flex flex-col gap-1.5">
        <label class="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-gray-400 cursor-pointer w-fit">
          <input type="checkbox" v-model="modelo.MOSTRAR_DISCLAIMER" class="rounded"/>
          Mostrar disclaimer en el resumen ejecutivo
        </label>
        <BaseRichInput v-if="modelo.MOSTRAR_DISCLAIMER" label="Texto del disclaimer" v-model="modelo.DISCLAIMER_TEXTO"/>
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

const DEFAULT_DISCLAIMER = 'Resumen elaborado por Juris Search, basado en la resolución judicial del Centro de Documentación Judicial (CENDOJ), de fecha [dd/mm/aaaa]. La última actualización del documento es de fecha [dd/mm/aaaa]';

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
        ID: null, TITLE: null, RTITLE: null, ISBINDING: false,
        AMBIT: [], FRESOLUTION: null,
        OJURISDICCIONAL: [], MAGISTRATES: [],
        VDESIDENTE: [], CVOTE: [],
        ENTRIEFILE: null, NENTRIEFILE: null,
        ENTRIEFILERESUMEN: null, NNTRIEFILERESUMEN: null,
        KEYWORDS: [], TEMA: null, SUBTEMA: null,
        SHORTSUMMARY: null, RESUMEN: null,
        DELITO: [], RECURSO: [], MATERIA: [],
        JURISDICCION: [], JURISDICCIONV: [], IDSVIN: [],
        MOSTRAR_DISCLAIMER: false, DISCLAIMER_TEXTO: DEFAULT_DISCLAIMER,
        REQUIERE_ENLACE_EXTERNO: false, ENLACE_OFICIAL: null,
      },
    };
  },
  validators: {
    'modelo.ID':             v => Validator.value(v).required("Campo requerido"),
    'modelo.TITLE':          v => Validator.value(v).required("Campo requerido"),
    'modelo.AMBIT':          v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.FRESOLUTION':    v => Validator.value(v).required("Campo requerido"),
    'modelo.OJURISDICCIONAL':v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.JURISDICCION':   v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.MAGISTRATES':    v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.KEYWORDS':       v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.TEMA':           v => Validator.value(v).required("Campo requerido"),
    'modelo.SUBTEMA':        v => Validator.value(v).required("Campo requerido"),
    'modelo.SHORTSUMMARY':   v => Validator.value(v).required("Campo requerido"),
    'modelo.RESUMEN':        v => Validator.value(v).required("Campo requerido"),
    'modelo.RECURSO':        v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.ENLACE_OFICIAL': function (v) {
      if (this.modelo.REQUIERE_ENLACE_EXTERNO)
        return Validator.value(v).required("Campo requerido").regex(/^https?:\/\/[^\s]+\.[^\s]+/i, "Ingrese un enlace válido (https://...)");
    },
  },
  methods: {
    handleClose() { this.close(); },
    openEnlaceOficial() {
      if (!this.modelo.ENLACE_OFICIAL) return;
      window.open(this.modelo.ENLACE_OFICIAL, '_blank', 'noopener');
    },
    addTag(field, e) {
      if (e.key !== 'Enter' && e.key !== ',') return;
      e.preventDefault();
      const val = (e.target.value || '').trim();
      if (val && !this.modelo[field].includes(val)) this.modelo[field].push(val);
      e.target.value = '';
    },
    formatNameFile(file) {
      if (!file) return "";
      const regex = /^jurisprudences\/common\/(.+?)\/[a-f0-9-]+\.pdf$/;
      const match = file.match(regex);
      return match ? `${match[1]}.pdf` : file.split('/').pop() || "";
    },
    localStorageSave() { localStorage.setItem("commonEntrieEdit", JSON.stringify(this.modelo)); },
    UpdateLocaleStorage() {
      const data = JSON.parse(localStorage.getItem("commonEntrieEdit"));
      if (data) this.modelo = data;
    },
    async submit() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });
      const validate = await this.$validate();
      if (!validate) return;

      const formData = new FormData();
      formData.append("ID", this.modelo.ID);
      formData.append("files", this.modelo.NENTRIEFILE);
      formData.append("files", this.modelo.NNTRIEFILERESUMEN);
      formData.append("ENTRIEFILE", this.modelo.ENTRIEFILE);
      formData.append("ENTRIEFILERESUMEN", this.modelo.ENTRIEFILERESUMEN);
      formData.append("TITLE", this.modelo.TITLE);
      formData.append("RTITLE", this.modelo.RTITLE);
      formData.append("ISBINDING", this.modelo.ISBINDING);
      formData.append("AMBIT", this.modelo.AMBIT.join(","));
      formData.append("FRESOLUTION", this.modelo.FRESOLUTION);
      formData.append("OJURISDICCIONAL", this.modelo.OJURISDICCIONAL);
      formData.append("MAGISTRATES", this.modelo.MAGISTRATES.join(","));
      formData.append("VDESIDENTE", this.modelo.VDESIDENTE);
      formData.append("CVOTE", this.modelo.CVOTE);
      formData.append("KEYWORDS", this.modelo.KEYWORDS.join(","));
      formData.append("TEMA", this.modelo.TEMA);
      formData.append("SUBTEMA", this.modelo.SUBTEMA);
      formData.append("SHORTSUMMARY", this.modelo.SHORTSUMMARY);
      formData.append("RESUMEN", this.modelo.RESUMEN);
      formData.append("TYPE", "jurisprudences");
      formData.append("TIPO", "common");
      formData.append("DELITO", this.modelo.DELITO?.join(","));
      formData.append("RECURSO", this.modelo.RECURSO?.join(","));
      formData.append("MATERIA", this.modelo.MATERIA?.join(","));
      formData.append("JURISDICCION", this.modelo.JURISDICCION.join(","));
      formData.append("JURISDICCIONV", this.modelo.JURISDICCIONV.join(","));
      formData.append("IDSVIN", Array.isArray(this.modelo.IDSVIN) ? this.modelo.IDSVIN.join(",") : "");
      formData.append("MOSTRAR_DISCLAIMER", this.modelo.MOSTRAR_DISCLAIMER);
      formData.append("DISCLAIMER_TEXTO", this.modelo.MOSTRAR_DISCLAIMER ? (this.modelo.DISCLAIMER_TEXTO || '') : '');
      formData.append("REQUIERE_ENLACE_EXTERNO", this.modelo.REQUIERE_ENLACE_EXTERNO);
      formData.append("ENLACE_OFICIAL", this.modelo.REQUIERE_ENLACE_EXTERNO ? (this.modelo.ENLACE_OFICIAL || '') : '');

      this.loadingSubmit = true;
      const loadingToast = toast.loading("Espere un momento...");
      await adminEntriesProxy.edit(formData)
        .then(response => {
          if (response.STATUS) {
            toast.success("Entrada editada con éxito");
            this.reset(); this.update(); this.close();
          } else {
            toast.error(response.MESSAGE);
          }
        })
        .catch(err => toast.error(err?.MESSAGE || "Error al editar la entrada"))
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
        ID: null, TITLE: null, RTITLE: null, ISBINDING: false,
        AMBIT: [], FRESOLUTION: null,
        OJURISDICCIONAL: [], MAGISTRATES: [],
        VDESIDENTE: [], CVOTE: [],
        ENTRIEFILE: null, NENTRIEFILE: null,
        ENTRIEFILERESUMEN: null, NNTRIEFILERESUMEN: null,
        KEYWORDS: [], TEMA: null, SUBTEMA: null,
        SHORTSUMMARY: null, RESUMEN: null,
        DELITO: [], RECURSO: [], MATERIA: [],
        JURISDICCION: [], JURISDICCIONV: [], IDSVIN: [],
        MOSTRAR_DISCLAIMER: false, DISCLAIMER_TEXTO: DEFAULT_DISCLAIMER,
        REQUIERE_ENLACE_EXTERNO: false, ENLACE_OFICIAL: null,
      };
      document.querySelectorAll("input[type='file']").forEach(i => i.value = "");
      this.searchQueryNormas = '';
      this.normasSeleccionadas = [];
      this.validation.reset();
    },
    async fetchNormasSuggestions(queryString, cb) {
      if (!queryString || queryString.length < 2) return cb([]);
      try {
        const res = await adminEntriesProxy.listSearchNames({ search: queryString, TYPE: "jurisprudences" });
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
          this.modelo = this.data;
          if (!this.modelo.DISCLAIMER_TEXTO) this.modelo.DISCLAIMER_TEXTO = DEFAULT_DISCLAIMER;
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
