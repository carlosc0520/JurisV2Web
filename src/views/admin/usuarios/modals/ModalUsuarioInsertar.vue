<template>
  <BaseModal v-model="isShow" title="Agregar Usuario" size="lg" persistent @close="handleClose">
    <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <BaseInput
        v-model="modelo.APATERNO"
        label="Apellido Paterno"
        placeholder="Ingrese apellido paterno"
        required
        :error="validation.firstError('modelo.APATERNO')"
      />

      <BaseInput
        v-model="modelo.AMATERNO"
        label="Apellido Materno"
        placeholder="Ingrese apellido materno"
        required
        :error="validation.firstError('modelo.AMATERNO')"
      />

      <BaseInput
        v-model="modelo.NOMBRES"
        label="Nombres"
        placeholder="Ingrese nombres"
        required
        :error="validation.firstError('modelo.NOMBRES')"
      />

      <BaseInput
        v-model="modelo.EMAIL"
        label="Correo electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        required
        :error="validation.firstError('modelo.EMAIL')"
      />

      <BaseInput
        v-model="modelo.TELEFONO"
        label="Teléfono"
        type="number"
        placeholder="999999999"
        required
        :error="validation.firstError('modelo.TELEFONO')"
      />

      <BaseDatePicker
        v-model="modelo.FNACIMIENTO"
        label="Fecha Nacimiento"
        required
        :disabledDate="time => time.getTime() > Date.now()"
        :error="validation.firstError('modelo.FNACIMIENTO')"
      />

      <!-- Plan -->
      <div class="w-full flex flex-col">
        <label class="block text-sm font-medium mb-1.5" style="color:var(--text)">Plan</label>
        <AppSelect v-model="modelo.IDPLAN" :fullWidth="true">
          <option :value="null">Sin plan</option>
          <option v-for="p in selects.planes" :key="p.value" :value="p.value">{{ p.text }}</option>
        </AppSelect>
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
import userProxy from '@/proxies/UserProxy.js';

export default {
  name: 'ModalUsuarioInsertar',
  props: {
    show:     { type: Boolean,   default: false },
    close:    { type: Function,  default: () => {} },
    update:   { type: Function,  default: () => {} },
    selects:  { type: Object,    default: () => ({}) },
    userType: { type: Number,    default: 2 },
    role:     { type: Object,    default: () => ({}) },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: this.emptyModel(),
    };
  },
  validators: {
    'modelo.APATERNO': v => Validator.value(v).required('Campo requerido'),
    'modelo.AMATERNO': v => Validator.value(v).required('Campo requerido'),
    'modelo.NOMBRES':  v => Validator.value(v).required('Campo requerido'),
    'modelo.EMAIL':    v => Validator.value(v).required('Campo requerido').email('Correo inválido'),
    'modelo.TELEFONO': v => Validator.value(v).required('Campo requerido').minLength(9, 'Mínimo 9 dígitos').maxLength(9, 'Máximo 9 dígitos'),
    'modelo.FNACIMIENTO': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    emptyModel() {
      return { APATERNO: null, AMATERNO: null, NOMBRES: null, EMAIL: null, TELEFONO: null, FNACIMIENTO: null, IDPLAN: null, IDROLE: null };
    },
    handleClose() {
      this.reset();
      this.close();
    },
    async submit() {
      if (this.role?.IDR === 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warn-perm' });
      const valid = await this.$validate();
      if (!valid) return;

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');
      this.modelo.IDROLE = this.userType;

      await userProxy.create(this.modelo)
        .then(r => {
          if (r.STATUS) {
            toast.success('Usuario creado con éxito');
            this.reset();
            this.update();
            this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al crear el usuario');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al crear el usuario'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = this.emptyModel();
      this.validation.reset();
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
