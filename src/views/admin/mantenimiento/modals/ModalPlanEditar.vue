<template>
  <BaseModal v-model="isShow" title="Editar Plan" size="lg" persistent @close="handleClose">
    <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <div class="sm:col-span-2">
        <BaseInput
          v-model="modelo.DESCRIPCION"
          label="Descripción"
          placeholder="Ingrese descripción del plan"
          required
          :error="validation.firstError('modelo.DESCRIPCION')"
        />
      </div>

      <BaseInput
        v-model="modelo.VALOR"
        label="Código"
        type="number"
        placeholder="Ej: 1, 2, 3…"
        required
        hint="Código de tier (máx. 2 dígitos: 1=Free, 2=Premium, etc.)"
        :error="validation.firstError('modelo.VALOR')"
      />

      <BaseInput
        v-model="modelo.TIEMPO"
        label="Tiempo (días)"
        type="number"
        placeholder="30"
        required
        :error="validation.firstError('modelo.TIEMPO')"
      />

      <BaseInput
        v-model="modelo.PRECIO"
        label="Precio (S/.)"
        type="number"
        placeholder="0.00"
        required
        :error="validation.firstError('modelo.PRECIO')"
      />

      <BaseInput
        v-model="modelo.AI_LIMIT"
        label="Límite IA (búsquedas/mes)"
        type="number"
        placeholder="5"
        hint="Número de búsquedas IA permitidas por mes para este plan"
        :error="validation.firstError('modelo.AI_LIMIT')"
      />

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium" style="color:var(--text)">Restricciones</label>
        <label v-for="op in restriccionesOps" :key="op.value" class="flex items-center gap-2 text-sm cursor-pointer" style="color:var(--text-muted)">
          <input type="checkbox" :value="op.value" v-model="modelo.RESTRICIONES" class="accent-blue-500" />
          {{ op.label }}
        </label>
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
  name: 'ModalPlanEditar',
  props: {
    show:   { type: Boolean,  default: false },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
    data:   { type: Object,   default: () => ({}) },
    role:   { type: Object,   default: () => ({}) },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: this.emptyModel(),
      restriccionesOps: [
        { value: '1', label: 'Visualizar' },
        { value: '2', label: 'Descargar' },
        { value: '3', label: 'Agregar a favoritos' },
      ],
    };
  },
  validators: {
    'modelo.ID':          v => Validator.value(v).required('Campo requerido'),
    'modelo.DESCRIPCION': v => Validator.value(v).required('Campo requerido'),
    'modelo.VALOR':       v => Validator.value(v).required('Campo requerido').regex(/^\d{1,2}$/, 'Solo 1 o 2 dígitos (ej: 1, 2, 3)'),
    'modelo.TIEMPO':      v => Validator.value(v).required('Campo requerido').regex(/^\d+$/, 'Solo se permiten números'),
    'modelo.PRECIO':      v => Validator.value(v).required('Campo requerido').regex(/^\d+(\.\d{1,2})?$/, 'Solo se permiten números'),
    'modelo.AI_LIMIT':    v => Validator.value(v).required('Campo requerido').regex(/^\d+$/, 'Solo se permiten números enteros'),
  },
  methods: {
    emptyModel() {
      return { ID: null, DESCRIPCION: null, VALOR: null, TIEMPO: null, PRECIO: null, RESTRICIONES: [], AI_LIMIT: 5 };
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

      await MantenimientoProxy.editPlan({
        ...this.modelo,
        RESTRICIONES: this.modelo.RESTRICIONES?.length > 0 ? this.modelo.RESTRICIONES.join(',') : null,
      })
        .then(r => {
          if (r.STATUS) {
            toast.success('Plan editado con éxito');
            this.reset();
            this.update();
            this.close();
          } else {
            toast.error(r.MESSAGE || 'Error al editar el plan');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al editar el plan'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = this.emptyModel();
      this.validation.reset();
    },
  },
  watch: {
    show(val) {
      if (val && this.data) {
        const restricciones = this.data.RESTRICIONES ?? this.data.restricciones;
        this.modelo = {
          ID:          this.data.ID          ?? this.data.id,
          DESCRIPCION: this.data.DESCRIPCION ?? this.data.descripcion,
          VALOR:       this.data.VALOR       ?? this.data.valor,
          TIEMPO:      this.data.TIEMPO      ?? this.data.tiempo,
          PRECIO:      this.data.PRECIO      ?? this.data.precio,
          RESTRICIONES: restricciones ? String(restricciones).split(',').filter(Boolean) : [],
          AI_LIMIT:    this.data.AI_LIMIT    ?? this.data.aiLimit ?? 5,
        };
      }
      if (!val) this.reset();
      this.isShow = val;
    },
  },
};
</script>
