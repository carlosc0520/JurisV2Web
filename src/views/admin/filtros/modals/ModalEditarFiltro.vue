<template>
  <BaseModal v-model="isShow" title="Editar Filtro" size="md" persistent>
    <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <BaseInput
        v-model="modelo.NIVEL"
        label="Nivel"
        disabled
      />

      <div class="w-full flex flex-col">
        <label class="block text-sm font-medium mb-1.5" style="color:var(--text)">
          Tipo <span class="text-red-500">*</span>
        </label>
        <AppSelect v-model="modelo.TIPO" :fullWidth="true" disabled>
          <option :value="null">-- Seleccione</option>
          <option :value="1">JURISPRUDENCIA</option>
          <option :value="2">LEGISLACIÓN</option>
        </AppSelect>
        <p v-if="validation.hasError('modelo.TIPO')" class="mt-1 text-xs text-red-500">
          {{ validation.firstError('modelo.TIPO') }}
        </p>
      </div>

      <div class="sm:col-span-2">
        <BaseInput
          v-model="modelo.LABEL"
          label="Etiqueta"
          placeholder="Ingrese la etiqueta"
          required
          :error="validation.firstError('modelo.LABEL')"
        />
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
import FilterProxy from "@/proxies/FilterProxy";

export default {
  name: 'ModalEditarFiltro',
  props: {
    show:    { type: Boolean,  default: false },
    close:   { type: Function, default: () => {} },
    update:  { type: Function, default: () => {} },
    active:  { default: null },
    data:    { type: Object,   default: () => ({}) },
    niveles: { type: Object,   default: () => ({}) },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: { ID: null, NIVEL: null, TIPO: null, IDPARENT: null, LABEL: null },
    };
  },
  validators: {
    'modelo.ID':    v => Validator.value(v).required('Campo requerido'),
    'modelo.TIPO':  v => Validator.value(v).required('Campo requerido'),
    'modelo.LABEL': v => Validator.value(v).required('Campo requerido'),
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
      await FilterProxy.edit({ ...this.modelo })
        .then(r => {
          if (r.STATUS) {
            toast.success('Filtro editado con éxito');
            this.reset();
            this.update();
            this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al editar el filtro');
          }
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al editar el filtro'))
        .finally(() => { toast.remove(loadingToast); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = { ID: null, NIVEL: null, TIPO: null, IDPARENT: null, LABEL: null };
      this.validation.reset();
    },
  },
  watch: {
    show(val) {
      if (val && this.data) {
        this.modelo = {
          ID:       this.data.VALUE || this.data.ID || this.data.id || null,
          NIVEL:    this.data.NIVEL || `NIVEL ${this.active}`,
          TIPO:     this.data.TIPO === 'JURISPRUDENCIA' ? 1 : this.data.TIPO === 'LEGISLACIÓN' ? 2 : (this.data.TIPO || null),
          IDPARENT: this.data.IDPARENT || null,
          LABEL:    this.data.LABEL || this.data.descripcion || null,
        };
      }
      if (!val) this.reset();
      this.isShow = val;
    },
  },
};
</script>
