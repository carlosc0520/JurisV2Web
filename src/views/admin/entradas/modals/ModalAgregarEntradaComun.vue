<template>
  <BaseModal v-model="isShow" title="Agregar Jurisprudencia Común" size="xl" persistent @close="handleClose">
    <form @submit.prevent="submit" class="flex flex-col gap-4">

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BaseInput label="Título de entrada" required 
          v-model="modelo.TITLE"
          :error="validation.hasError('modelo.TITLE') ? validation.firstError('modelo.TITLE') : undefined"/>
        <BaseInput label="Título Descriptivo"
          v-model="modelo.RTITLE"/>
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
        TITLE: null, RTITLE: null, ISBINDING: false,
        AMBIT: [], FRESOLUTION: null,
        OJURISDICCIONAL: [], MAGISTRATES: [],
        VDESIDENTE: [], CVOTE: [],
        ENTRIEFILE: null, ENTRIEFILERESUMEN: null,
        KEYWORDS: [], TEMA: null, SUBTEMA: null,
        SHORTSUMMARY: null, RESUMEN: null,
        RECURSO: [], DELITO: [], MATERIA: [],
        JURISDICCION: [], JURISDICCIONV: [], IDSVIN: [],
      },
    };
  },
  validators: {
    'modelo.TITLE':          v => Validator.value(v).required("Campo requerido"),
    'modelo.AMBIT':          v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.FRESOLUTION':    v => Validator.value(v).required("Campo requerido"),
    'modelo.OJURISDICCIONAL':v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.JURISDICCION':   v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.MAGISTRATES':    v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.ENTRIEFILE':     v => Validator.value(v).required("Campo requerido"),
    'modelo.KEYWORDS':       v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
    'modelo.TEMA':           v => Validator.value(v).required("Campo requerido"),
    'modelo.SUBTEMA':        v => Validator.value(v).required("Campo requerido"),
    'modelo.SHORTSUMMARY':   v => Validator.value(v).required("Campo requerido"),
    'modelo.RESUMEN':        v => Validator.value(v).required("Campo requerido"),
    'modelo.RECURSO':        v => Validator.value(v).required("Campo requerido").regex(/[^[]/, "Campo requerido"),
  },
  methods: {
    // ── Aplanar árbol de selects a [{id, label}] ──────────────────────────
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

    // ── Analizar PDF con IA y autocompletar campos ────────────────────────
    async analyzeWithAI() {
      if (!this.modelo.ENTRIEFILE) return;
      this.loadingExtract = true;
      this.extractTokens  = null;
      try {
        const catalogs = {
          magistrados:      this.flattenCatalog(this.selects.magistrados),
          jurisdiccionales: this.flattenCatalog(this.selects.jurisdiccionales),
          ambitos:          this.flattenCatalog(this.selects.ambitos),
          recursos:         this.flattenCatalog(this.selects.recursos),
          materias:         this.flattenCatalog(this.selects.materias),
          delitos:          this.flattenCatalog(this.selects.delitos),
          jurisdicion:      this.flattenCatalog(this.selects.jurisdicion),
        };

        const res = await AiSearchProxy.extractFromPdf(this.modelo.ENTRIEFILE, 'jurisprudences', catalogs);
        const d   = res.data ?? res;
        this.extractTokens = res.tokensUsed ?? null;

        // Campos de texto libre
        if (d.TITLE)        this.modelo.TITLE        = d.TITLE;
        if (d.RTITLE)       this.modelo.RTITLE       = d.RTITLE;
        if (d.FRESOLUTION)  this.modelo.FRESOLUTION  = d.FRESOLUTION;
        if (d.ISBINDING !== undefined) this.modelo.ISBINDING = Boolean(d.ISBINDING);
        if (d.KEYWORDS?.length)  this.modelo.KEYWORDS  = d.KEYWORDS;
        if (d.TEMA)              this.modelo.TEMA       = d.TEMA;
        if (d.SUBTEMA)           this.modelo.SUBTEMA    = d.SUBTEMA;
        if (d.SHORTSUMMARY)      this.modelo.SHORTSUMMARY = d.SHORTSUMMARY;
        if (d.RESUMEN)           this.modelo.RESUMEN    = d.RESUMEN;

        // Campos de catálogo (IDs directos del GPT)
        if (d.MAGISTRATES?.length)    this.modelo.MAGISTRATES    = d.MAGISTRATES.map(Number);
        if (d.OJURISDICCIONAL?.length) this.modelo.OJURISDICCIONAL = d.OJURISDICCIONAL.map(Number);
        if (d.AMBIT?.length)          this.modelo.AMBIT           = d.AMBIT.map(Number);
        if (d.RECURSO?.length)        this.modelo.RECURSO         = d.RECURSO.map(Number);
        if (d.MATERIA?.length)        this.modelo.MATERIA         = d.MATERIA.map(Number);
        if (d.DELITO?.length)         this.modelo.DELITO          = d.DELITO.map(Number);
        if (d.JURISDICCION?.length)   this.modelo.JURISDICCION    = d.JURISDICCION.map(Number);

        toast.success('Campos autocargados — revisa y ajusta antes de guardar');
      } catch (err) {
        toast.error('Error al analizar el PDF con IA');
        console.error('[AI-EXTRACT]', err);
      } finally {
        this.loadingExtract = false;
      }
    },

    handleClose() { this.close(); },
    localStorageSave() { localStorage.setItem("commonEntrie", JSON.stringify(this.modelo)); },
    UpdateLocaleStorage() {
      const data = JSON.parse(localStorage.getItem("commonEntrie"));
      if (data) this.modelo = data;
    },
    async submit() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });
      const validate = await this.$validate();
      if (!validate) return;

      const formData = new FormData();
      formData.append("files", this.modelo.ENTRIEFILE);
      formData.append("files", this.modelo.ENTRIEFILERESUMEN);
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
      formData.append("DELITO", this.modelo.DELITO.join(",") || "");
      formData.append("RECURSO", this.modelo.RECURSO.join(",") || "");
      formData.append("MATERIA", this.modelo.MATERIA.join(",") || "");
      formData.append("JURISDICCION", this.modelo.JURISDICCION.join(","));
      formData.append("JURISDICCIONV", this.modelo.JURISDICCIONV.join(","));
      formData.append("IDSVIN", Array.isArray(this.modelo.IDSVIN) ? this.modelo.IDSVIN.join(",") : "");

      this.loadingSubmit = true;
      const loadingToast = toast.loading("Espere un momento...");
      await adminEntriesProxy.create(formData)
        .then(response => {
          if (response.STATUS) {
            toast.success("Entrada creada con éxito");
            this.reset(); this.update(); this.close();
          } else {
            toast.error(response.MESSAGE);
          }
        })
        .catch(err => toast.error(err?.MESSAGE || "Error al crear la entrada"))
        .finally(() => { toast.remove(loadingToast); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = {
        TITLE: null, RTITLE: null, ISBINDING: false,
        AMBIT: [], FRESOLUTION: null,
        OJURISDICCIONAL: [], MAGISTRATES: [],
        VDESIDENTE: [], CVOTE: [],
        ENTRIEFILE: null, ENTRIEFILERESUMEN: null,
        KEYWORDS: [], TEMA: null, SUBTEMA: null,
        SHORTSUMMARY: null, RESUMEN: null,
        RECURSO: [], DELITO: [], MATERIA: [],
        JURISDICCION: [], JURISDICCIONV: [], IDSVIN: [],
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
