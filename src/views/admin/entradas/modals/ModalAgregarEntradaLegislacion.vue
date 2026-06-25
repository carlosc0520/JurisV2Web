<template>
  <BaseModal v-model="isShow" title="Agregar Legislación" size="xl" persistent @close="handleClose">
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
        <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Documento Principal <span class="text-red-500">*</span></label>
        <input class="custom-input" :class="{ error: validation.hasError('modelo.ENTRIEFILE') }" type="file" accept=".pdf"
          @change="modelo.ENTRIEFILE = $event.target.files[0]">
        <p v-if="validation.hasError('modelo.ENTRIEFILE')" class="text-[11px] text-red-500">{{ validation.firstError('modelo.ENTRIEFILE') }}</p>

        <!-- Analizar con IA -->
        <div class="ai-extract-wrap">
          <button type="button" class="ai-extract-btn"
            :disabled="!modelo.ENTRIEFILE || loadingExtract"
            @click="analyzeWithAI">
            <svg v-if="loadingExtract" class="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2L13.4 8.26L19.5 9L13.4 9.74L12 16L10.6 9.74L4.5 9L10.6 8.26Z"/>
              <path d="M5 3l.6 2 2 .5-2 .5-.6 2-.6-2-2-.5 2-.5z"/>
            </svg>
            {{ loadingExtract ? 'Analizando PDF…' : 'Analizar con IA' }}
          </button>
          <span v-if="!modelo.ENTRIEFILE" class="ai-extract-hint">
            Sube el PDF primero para autocompletar los campos con IA
          </span>
          <span v-else-if="extractTokens" class="ai-extract-tokens">
            {{ extractTokens.toLocaleString() }} tokens usados
          </span>
        </div>
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
import AiSearchProxy from "@/proxies/AiSearchProxy.js";

export default {
  props: {
    show:    { type: Boolean,  default: false },
    close:   { type: Function, default: () => {} },
    update:  { type: Function, default: () => {} },
    selects: { type: Object,   default: () => {} },
    role:    { type: Object,   default: () => {} },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      loadingExtract: false,
      extractTokens: null,
      searchQueryNormas: '',
      normasSeleccionadas: [],
      modelo: {
        TITLE: null, RTITLE: null, SITUACION: null,
        TPONRMA: null, OEMISOR: [], NMRCN: null,
        FRESOLUTION: null, ENTRIEFILE: null, RESUMEN: null, IDSVIN: [],
      },
    };
  },
  validators: {
    'modelo.TITLE':      v => Validator.value(v).required("Campo requerido"),
    'modelo.NMRCN':      v => Validator.value(v).required("Campo requerido"),
    'modelo.TPONRMA':    v => Validator.value(v).required("Campo requerido"),
    'modelo.OEMISOR':    v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.FRESOLUTION':v => Validator.value(v).required("Campo requerido"),
    'modelo.ENTRIEFILE': v => Validator.value(v).required("Campo requerido"),
  },
  methods: {
    flattenCatalog(nodes = []) {
      const result = [];
      const walk = (list) => {
        for (const n of list) {
          const id    = n.value ?? n.id ?? n.ID;
          const label = n.label ?? n.text ?? n.nombre ?? n.NOMBRE ?? '';
          if (id != null && label) result.push({ id: Number(id), label: String(label) });
          if (n.children?.length) walk(n.children);
        }
      };
      walk(Array.isArray(nodes) ? nodes : []);
      return result;
    },

    async analyzeWithAI() {
      if (!this.modelo.ENTRIEFILE) return;
      this.loadingExtract = true;
      this.extractTokens  = null;
      try {
        const catalogs = {
          tiponorma: this.flattenCatalog(this.selects.tiponorma),
          organismos: this.flattenCatalog(this.selects.organismos),
          materias:   this.flattenCatalog(this.selects.materias),
          delitos:    this.flattenCatalog(this.selects.delitos),
        };

        const res = await AiSearchProxy.extractFromPdf(this.modelo.ENTRIEFILE, 'legislations', catalogs);
        const d   = res.data ?? res;
        this.extractTokens = res.tokensUsed ?? null;

        if (d.NMRCN)       this.modelo.NMRCN       = d.NMRCN;
        if (d.TITLE)       this.modelo.TITLE        = d.TITLE;
        if (d.RTITLE)      this.modelo.RTITLE       = d.RTITLE;
        if (d.FRESOLUTION) this.modelo.FRESOLUTION  = d.FRESOLUTION;
        if (d.SITUACION)   this.modelo.SITUACION    = d.SITUACION;
        if (d.TPONRMA)         this.modelo.TPONRMA  = Number(d.TPONRMA);
        if (d.OEMISOR?.length) this.modelo.OEMISOR  = d.OEMISOR.map(Number);
        if (d.RESUMEN)         this.modelo.RESUMEN  = d.RESUMEN;

        toast.success('Campos autocargados — revisa y ajusta antes de guardar');
      } catch (err) {
        toast.error('Error al analizar el PDF con IA');
        console.error('[AI-EXTRACT]', err);
      } finally {
        this.loadingExtract = false;
      }
    },

    handleClose() { this.close(); },
    localStorageSave() { localStorage.setItem("legislationEntrie", JSON.stringify(this.modelo)); },
    UpdateLocaleStorage() {
      const data = JSON.parse(localStorage.getItem("legislationEntrie"));
      if (data) this.modelo = data;
    },
    async submit() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });
      const validate = await this.$validate();
      if (!validate) return;

      const tipoNormal = [];
      if (this.modelo.TPONRMA) tipoNormal.push(this.modelo.TPONRMA);

      const formData = new FormData();
      formData.append("files", this.modelo.ENTRIEFILE);
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
      await adminEntriesProxy.createSingle(formData)
        .then(response => {
          if (response.STATUS) {
            toast.success("Legislación creada con éxito");
            this.reset(); this.update(); this.close();
          } else {
            toast.error(response.MESSAGE);
          }
        })
        .catch(err => toast.error(err?.MESSAGE || "Error al crear la legislación"))
        .finally(() => { toast.remove(loadingToast); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = {
        TITLE: null, RTITLE: null, SITUACION: null,
        TPONRMA: null, OEMISOR: [], NMRCN: null,
        FRESOLUTION: null, ENTRIEFILE: null, RESUMEN: null, IDSVIN: [],
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
        if (!value) this.reset();
        this.isShow = value;
      }
    }
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
<style scoped>
.ai-extract-wrap {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  background: #faf5ff; border: 1px dashed #c084fc; border-radius: 8px;
  margin-top: 2px;
}
.dark .ai-extract-wrap { background: #1e1033; border-color: #6b21a8; }

.ai-extract-btn {
  display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
  padding: 5px 12px; border-radius: 7px; font-size: .75rem; font-weight: 600;
  background: linear-gradient(135deg, #9333ea, #7c3aed);
  color: #fff; border: none; cursor: pointer; transition: all .2s;
  white-space: nowrap;
}
.ai-extract-btn:hover:not(:disabled) { box-shadow: 0 3px 10px rgba(124,58,237,.4); }
.ai-extract-btn:disabled { opacity: .45; cursor: not-allowed; }

.ai-extract-hint {
  font-size: .7rem; color: #94a3b8; font-style: italic;
}
.ai-extract-tokens {
  font-size: .7rem; color: #a78bfa; font-weight: 500;
}
</style>
