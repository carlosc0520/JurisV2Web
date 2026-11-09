<template>
  <BaseModal v-model="isShow" :title="isEdit ? 'Editar categoría' : 'Nueva categoría'" size="lg" persistent @close="handleClose">
    <form @submit.prevent="submit" class="flex flex-col gap-4">
      <BaseInput
        v-model="modelo.descripcion"
        label="Nombre"
        placeholder="Ej. El criterio y sus límites"
        required
        :error="validation.firstError('modelo.descripcion')"
      />
      <div>
        <label for="cat-resumen" class="block text-sm font-medium mb-1.5" style="color:var(--text)">Descripción</label>
        <textarea id="cat-resumen" v-model="modelo.resumen" rows="3" maxlength="300" class="input-base cat-resumen"
          placeholder="Ej. Análisis de los alcances y límites del criterio judicial en la jurisprudencia peruana." />
        <p class="cat-resumen-pie">
          <span>Se muestra bajo el título de la categoría y es la descripción que ve Google. Ideal: 120 a 160 caracteres.</span>
          <span :class="{ 'cat-resumen-largo': largoResumen > 160 }">{{ largoResumen }}/300</span>
        </p>
      </div>
      <div>
        <p v-if="cargandoEtiquetas" class="m-0 text-sm" style="color:var(--text-muted)">Cargando etiquetas…</p>
        <EtiquetasInput v-else v-model="modelo.etiquetas" :maximo="30" />
        <p class="m-0 mt-1.5 text-[11px] leading-snug" style="color:var(--text-muted)">
          Son los filtros de esta categoría en el blog y las que se pueden elegir en sus artículos.
          Si quitas una que ya usan artículos, se oculta en lugar de borrarse.
        </p>
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
import PublicacionesProxy from '@/proxies/PublicacionesProxy';
import EtiquetasInput from '@/components/Publicaciones/EtiquetasInput.vue';

export default {
  name: 'ModalPublicacionCategoria',
  components: { EtiquetasInput },
  props: {
    show:   { type: Boolean,  default: false },
    data:   { type: Object,   default: null },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
  },
  data() {
    return {
      isShow: false,
      loadingSubmit: false,
      modelo: { id: null, descripcion: '', resumen: '', etiquetas: [] },
      cargandoEtiquetas: false,
      // Las etiquetas solo se envían si se llegaron a cargar (si no, se borrarían las actuales)
      etiquetasListas: true,
    };
  },
  computed: {
    isEdit() { return !!this.modelo.id; },
    largoResumen() { return (this.modelo.resumen || '').length; },
  },
  validators: {
    'modelo.descripcion': v => Validator.value(v).required('Campo requerido'),
  },
  methods: {
    handleClose() { this.isShow = false; this.close(); },
    async submit() {
      const valid = await this.$validate();
      if (!valid || this.cargandoEtiquetas) return;

      this.loadingSubmit = true;
      const loading = toast.loading('Espere un momento...');

      const { etiquetas, ...categoria } = this.modelo;
      await PublicacionesProxy.saveCategoria(this.etiquetasListas ? { ...categoria, etiquetas } : categoria)
        .then(r => {
          const result = r?.DATA ?? r;
          if (result.STATUS) {
            toast.success(result.MESSAGE || 'Categoría guardada con éxito');
            this.update(); this.close();
          } else {
            toast.error(result.MESSAGE || 'Error al guardar la categoría');
          }
        })
        .catch(e => toast.error(e?.MESSAGE || 'Error al guardar la categoría'))
        .finally(() => { toast.remove(loading); this.loadingSubmit = false; });
    },
    reset() {
      this.modelo = this.data
        ? { id: this.data.ID ?? this.data.id, descripcion: this.data.descripcion ?? this.data.DESCRIPCION ?? '', resumen: this.data.resumen || '', etiquetas: [] }
        : { id: null, descripcion: '', resumen: '', etiquetas: [] };
      this.validation?.reset();
    },
    async cargarEtiquetas() {
      const id = this.modelo.id;
      this.etiquetasListas = !id;
      if (!id) return;
      this.cargandoEtiquetas = true;
      try {
        const r = await PublicacionesProxy.listEtiquetas({ idCategoria: id });
        if (id !== this.modelo.id) return;
        this.modelo.etiquetas = (r?.DATA ?? r ?? []).filter(e => e.estado === 'A').map(e => e.nombre);
        this.etiquetasListas = true;
      } catch {
        toast.error('No se pudieron cargar las etiquetas de la categoría', { toastId: 'error-etiquetas-cat' });
      } finally {
        this.cargandoEtiquetas = false;
      }
    },
  },
  watch: {
    show(val) {
      this.isShow = val;
      if (val) { this.reset(); this.cargarEtiquetas(); }
      else setTimeout(() => this.reset(), 200);
    },
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
<style scoped>
.cat-resumen { width: 100%; min-height: 76px; resize: vertical; line-height: 1.45; }
.cat-resumen-pie {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 6px 0 0;
  font-size: 11px;
  line-height: 1.4;
  color: var(--text-muted);
}
.cat-resumen-largo { color: #d97706; font-weight: 700; }
</style>
