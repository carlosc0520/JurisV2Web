<template>
  <BaseModal v-model="isShow" title="Orden de las categorías" size="md" persistent @close="handleClose">
    <p class="m-0 mb-3 text-sm" style="color:var(--text-muted)">
      Arrastra o usa las flechas. Es el orden del menú y de la página del blog.
    </p>
    <p v-if="cargando" class="m-0 text-sm" style="color:var(--text-muted)">Cargando categorías…</p>
    <p v-else-if="!lista.length" class="m-0 text-sm" style="color:var(--text-muted)">No hay categorías.</p>
    <ol v-else class="orden-lista">
      <li v-for="(c, i) in lista" :key="c.id" class="orden-item"
        :class="{ 'orden-arrastrando': arrastrando === i, 'orden-inactiva': !c.activa }"
        draggable="true" @dragstart="arrastrando = i" @dragover.prevent="moverA(i)" @dragend="arrastrando = null">
        <span class="orden-asa" aria-hidden="true">⋮⋮</span>
        <span class="orden-num">{{ i + 1 }}</span>
        <span class="orden-nombre">{{ c.nombre }}<small v-if="!c.activa"> · inactiva</small></span>
        <button type="button" class="orden-btn" :disabled="i === 0" :aria-label="`Subir ${c.nombre}`" @click="mover(i, i - 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button type="button" class="orden-btn" :disabled="i === lista.length - 1" :aria-label="`Bajar ${c.nombre}`" @click="mover(i, i + 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </li>
    </ol>
    <template #footer>
      <CancelButton @click="handleClose" :disabled="guardando" />
      <SaveButton nativeType="button" @click="guardar" :loading="guardando" :disabled="cargando || !lista.length" />
    </template>
  </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import PublicacionesProxy from '@/proxies/PublicacionesProxy';

export default {
  name: 'ModalOrdenCategorias',
  props: {
    show:   { type: Boolean,  default: false },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
  },
  data() {
    return { isShow: false, cargando: false, guardando: false, lista: [], arrastrando: null };
  },
  methods: {
    handleClose() { this.isShow = false; this.close(); },
    async cargar() {
      this.cargando = true;
      this.lista = [];
      try {
        // El API ya las devuelve en el orden del blog
        const r = await PublicacionesProxy.listCategorias({ ROWS: 1000, INIT: 0 });
        const rows = (r?.DATA ?? r)?.data ?? [];
        this.lista = rows.map(c => ({ id: Number(c.id ?? c.ID), nombre: c.descripcion ?? c.DESCRIPCION, activa: (c.estado ?? c.CDESTDO) === 'A' }));
      } catch {
        toast.error('No se pudieron cargar las categorías', { toastId: 'error-orden-cat' });
      } finally {
        this.cargando = false;
      }
    },
    mover(desde, hasta) {
      if (hasta < 0 || hasta >= this.lista.length || desde === hasta) return;
      const [item] = this.lista.splice(desde, 1);
      this.lista.splice(hasta, 0, item);
    },
    moverA(i) {
      if (this.arrastrando === null || this.arrastrando === i) return;
      this.mover(this.arrastrando, i);
      this.arrastrando = i;
    },
    async guardar() {
      this.guardando = true;
      try {
        const r = await PublicacionesProxy.ordenCategorias(this.lista.map(c => c.id));
        const res = r?.DATA ?? r;
        if (res?.STATUS) {
          toast.success(res.MESSAGE || 'Orden guardado');
          this.update(); this.handleClose();
        } else {
          toast.error(res?.MESSAGE || 'No se pudo guardar el orden');
        }
      } catch (e) {
        toast.error(e?.MESSAGE || 'No se pudo guardar el orden');
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
.orden-lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; max-height: 60vh; overflow-y: auto; }
.orden-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px;
  background: var(--bg-card); color: var(--text); cursor: grab; user-select: none;
}
.orden-arrastrando { opacity: .5; border-style: dashed; }
.orden-inactiva .orden-nombre { color: var(--text-muted); }
.orden-asa { color: var(--text-muted); font-size: 12px; letter-spacing: -2px; }
.orden-num { width: 22px; text-align: right; font-size: 12px; font-weight: 700; color: var(--text-muted); }
.orden-nombre { flex: 1; min-width: 0; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.orden-nombre small { font-size: 11px; }
.orden-btn {
  width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); border-radius: 8px; background: transparent; color: var(--text); cursor: pointer;
}
.orden-btn svg { width: 16px; height: 16px; }
.orden-btn:hover:not(:disabled) { border-color: #185CE6; color: #185CE6; }
.orden-btn:disabled { opacity: .35; cursor: default; }
</style>
