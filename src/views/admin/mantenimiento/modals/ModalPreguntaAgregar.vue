<template>
  <BaseModal v-model="isShow" title="Agregar Pregunta" size="xl" persistent>
    <form class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <BaseInput
        v-model="modelo.DESCRIPCION"
        label="Descripción"
        placeholder="Ingrese la descripción"
        required
        :error="validation.firstError('modelo.DESCRIPCION')"
      />

      <BaseInput
        v-model="modelo.ORDEN"
        label="Orden"
        type="number"
        placeholder="0"
        required
        :error="validation.firstError('modelo.ORDEN')"
      />

      <div class="sm:col-span-2">
        <BaseRichInput
          v-model="modelo.HTMLTEXT"
          label="Respuesta"
          required
          :error="validation.firstError('modelo.HTMLTEXT')"
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
import MantenimientoProxy from '@/proxies/MantenimientoProxy';

export default {
  name: 'ModalPreguntaAgregar',
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
      modelo: { DESCRIPCION: null, HTMLTEXT: null, ORDEN: null },
    };
  },
  validators: {
    'modelo.DESCRIPCION': v => Validator.value(v).required('Campo requerido'),
    'modelo.HTMLTEXT':    v => Validator.value(v).required('Campo requerido'),
    'modelo.ORDEN':       v => Validator.value(v).required('Campo requerido').regex(/^\d+$/, 'Solo se permiten números'),
  },
  methods: {
    handleClose() {
      this.reset();
      this.close();
    },
    reset() {
      this.modelo = { DESCRIPCION: null, HTMLTEXT: null, ORDEN: null };
      this.validation.reset();
    },
    async submit() {
      if (this.role?.IDR === 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warn-perm' });
      const valid = await this.$validate();
      if (!valid) return;

      this.loadingSubmit = true;
      const loadingToast = toast.loading('Espere un momento...');
      await MantenimientoProxy.createPregunta({ ...this.modelo })
        .then(r => {
          if (r.STATUS) {
            toast.success('Pregunta creada con éxito');
            this.reset();
            this.update();
            this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al crear la pregunta');
          }
        })
        .catch(err => {
          const msg = err?.response?.data?.message;
          toast.error(Array.isArray(msg) ? msg.join(', ') : (msg || err?.MESSAGE || 'Error al crear la pregunta'));
        })
        .finally(() => { toast.remove(loadingToast); this.loadingSubmit = false; });
    },
  },
  watch: {
    show(val) {
      if (!val) this.reset();
      this.isShow = val;
    },
  },
};
</script>
