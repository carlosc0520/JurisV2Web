<template>
  <BaseModal v-model="isShow" :title="modelo.id ? `Sigla ${data?.SIGLA || ''}` : 'Nueva sigla'" size="lg" persistent @close="handleClose">
    <form class="flex flex-col gap-4" @submit.prevent="guardar">
      <div class="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3">
        <BaseInput v-model="modelo.sigla" label="Sigla" placeholder="Ej. UIF / UIF-Perú" required :error="errores.sigla" />
        <BaseInput v-model="modelo.significado" label="Significado" placeholder="Ej. Unidad de Inteligencia Financiera del Perú" required :error="errores.significado" />
      </div>
      <BaseInput v-model="modelo.contexto" label="Cuándo aplica (opcional)"
        placeholder="Ej. en compliance: oficial de cumplimiento"
        hint="Úsalo para siglas con más de un significado: le dice a la IA en qué contexto usar cada uno." />
      <div>
        <label for="fia-grupo" class="fia-label">Grupo</label>
        <input id="fia-grupo" v-model="modelo.grupo" list="fia-grupos" class="input-base w-full" placeholder="Ej. Instituciones" />
        <datalist id="fia-grupos">
          <option v-for="g in grupos" :key="g" :value="g" />
        </datalist>
      </div>
      <HistorialFuente v-if="modelo.id" :items="historial" />
    </form>
    <template #footer>
      <CancelButton @click="handleClose" :disabled="guardando" />
      <SaveButton nativeType="button" @click="guardar" :loading="guardando" />
    </template>
  </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import FuentesIaProxy from '@/proxies/FuentesIaProxy';
import HistorialFuente from './HistorialFuente.vue';

export default {
  name: 'ModalSigla',
  components: { HistorialFuente },
  props: {
    show:   { type: Boolean,  default: false },
    data:   { type: Object,   default: null },
    grupos: { type: Array,    default: () => [] },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
  },
  data() {
    return { isShow: false, guardando: false, modelo: {}, historial: [], errores: {} };
  },
  methods: {
    handleClose() { this.isShow = false; this.close(); },
    async cargar() {
      const d = this.data;
      this.errores = {};
      this.historial = [];
      this.modelo = d
        ? { id: d.ID, sigla: d.SIGLA, significado: d.SIGNIFICADO, contexto: d.CONTEXTO || '', grupo: d.GRUPO || '' }
        : { id: null, sigla: '', significado: '', contexto: '', grupo: '' };
      if (d?.ID) {
        try {
          const r = await FuentesIaProxy.historialSigla(d.ID);
          this.historial = r?.DATA ?? r ?? [];
        } catch { /* el historial es informativo */ }
      }
    },
    async guardar() {
      const e = {};
      if (!String(this.modelo.sigla || '').trim()) e.sigla = 'Obligatorio';
      if (!String(this.modelo.significado || '').trim()) e.significado = 'Obligatorio';
      this.errores = e;
      if (Object.keys(e).length || this.guardando) return;
      this.guardando = true;
      try {
        const m = this.modelo;
        const r = await FuentesIaProxy.guardarSigla({
          ...(m.id ? { id: m.id } : {}), sigla: m.sigla, significado: m.significado, contexto: m.contexto, grupo: m.grupo,
        });
        const res = r?.DATA ?? r;
        if (res?.STATUS) {
          toast.success(res.MESSAGE || 'Sigla guardada');
          this.update(); this.handleClose();
        } else {
          toast.error(res?.MESSAGE || 'No se pudo guardar la sigla');
        }
      } catch (err) {
        toast.error(err?.MESSAGE || 'No se pudo guardar la sigla');
      } finally {
        this.guardando = false;
      }
    },
  },
  watch: {
    show(val) {
      this.isShow = val;
      if (val) this.cargar();
    },
  },
};
</script>
<style scoped src="@/assets/styles/modal-styles.css"></style>
<style scoped>
.fia-label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: var(--text); }
</style>
