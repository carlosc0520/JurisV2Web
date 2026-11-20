<template>
  <BaseModal v-model="isShow" :title="titulo" size="xl" persistent @close="handleClose">
    <p v-if="cargando" class="m-0 text-sm" style="color:var(--text-muted)">Cargando artículo…</p>
    <form v-else class="flex flex-col gap-4" @submit.prevent="guardar">
      <div class="grid grid-cols-1 sm:grid-cols-[140px_1fr_170px] gap-3">
        <BaseInput v-model="modelo.numero" label="Número" placeholder="Ej. 387 o 108-B" required :error="errores.numero" />
        <BaseInput v-model="modelo.sumilla" label="Sumilla" placeholder="Ej. Peculado doloso y culposo" />
        <div>
          <label for="fia-estado" class="fia-label">Estado</label>
          <app-select id="fia-estado" v-model="modelo.estado" class="w-full">
            <option value="vigente">Vigente</option>
            <option value="modificado">Modificado</option>
            <option value="derogado">Derogado</option>
          </app-select>
        </div>
      </div>

      <div>
        <label for="fia-texto" class="fia-label">Texto vigente del artículo <span class="text-red-500">*</span></label>
        <textarea id="fia-texto" v-model="modelo.texto" rows="11" class="input-base fia-area" />
        <p v-if="errores.texto" class="fia-error">{{ errores.texto }}</p>
        <p class="fia-ayuda">Es el texto que la IA usa para entender las búsquedas que citan este artículo y el que ve el usuario en pantalla.</p>
      </div>

      <div>
        <label for="fia-notas" class="fia-label">Notas (modificaciones, concordancias)</label>
        <textarea id="fia-notas" v-model="modelo.notas" rows="4" class="input-base fia-area" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-[1fr_190px] gap-3">
        <BaseInput v-model="modelo.fuente" label="Fuente" placeholder="Ej. SPIJ (Minjus) - acceso libre, consultado el 20/11/2026" />
        <div>
          <label for="fia-fecha" class="fia-label">Fecha de la fuente</label>
          <input id="fia-fecha" v-model="modelo.fechaFuente" type="date" class="input-base w-full" />
        </div>
      </div>

      <HistorialFuente v-if="modelo.id" :items="historial" />
    </form>
    <template #footer>
      <CancelButton @click="handleClose" :disabled="guardando" />
      <SaveButton nativeType="button" @click="guardar" :loading="guardando" :disabled="cargando" />
    </template>
  </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import FuentesIaProxy from '@/proxies/FuentesIaProxy';
import HistorialFuente from './HistorialFuente.vue';

const NOMBRES = { CP: 'Código Penal', NCPP: 'Código Procesal Penal' };
const hoy = () => new Date().toLocaleDateString('en-CA'); // AAAA-MM-DD en hora local

export default {
  name: 'ModalArticulo',
  components: { HistorialFuente },
  props: {
    show:   { type: Boolean,  default: false },
    codigo: { type: String,   default: 'CP' },
    id:     { type: Number,   default: null },
    close:  { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
  },
  data() {
    return { isShow: false, cargando: false, guardando: false, modelo: this.vacio(), historial: [], errores: {} };
  },
  computed: {
    titulo() {
      const norma = NOMBRES[this.codigo] || this.codigo;
      return this.modelo.id ? `Art. ${this.modelo.numero || ''} · ${norma}` : `Nuevo artículo · ${norma}`;
    },
  },
  methods: {
    vacio() {
      return { id: null, numero: '', sumilla: '', texto: '', notas: '', estado: 'vigente', fuente: '', fechaFuente: hoy() };
    },
    handleClose() { this.isShow = false; this.close(); },
    async cargar() {
      this.errores = {};
      this.historial = [];
      if (!this.id) { this.modelo = this.vacio(); return; }
      this.cargando = true;
      try {
        const r = await FuentesIaProxy.obtenerArticulo(this.id);
        const a = r?.DATA ?? r;
        this.modelo = {
          id: a.ID, numero: a.NUMERO, sumilla: a.SUMILLA || '', texto: a.TEXTO || '', notas: a.NOTAS || '',
          estado: a.ESTADO || 'vigente', fuente: a.FUENTE || '', fechaFuente: a.FECHA_FUENTE || '',
        };
        this.historial = a.historial || [];
      } catch {
        toast.error('No se pudo cargar el artículo', { toastId: 'error-fia-art' });
        this.handleClose();
      } finally {
        this.cargando = false;
      }
    },
    validar() {
      const e = {};
      const numero = String(this.modelo.numero || '').trim().toUpperCase().replace(/\s*-\s*/, '-');
      if (!/^\d{1,3}(-[A-Z])?$/.test(numero)) e.numero = 'Debe ser como 387 o 108-B';
      if (!String(this.modelo.texto || '').trim()) e.texto = 'El texto es obligatorio';
      this.errores = e;
      return !Object.keys(e).length;
    },
    async guardar() {
      if (this.guardando || !this.validar()) return;
      this.guardando = true;
      try {
        const m = this.modelo;
        const r = await FuentesIaProxy.guardarArticulo({
          ...(m.id ? { id: m.id } : {}),
          codigo: this.codigo, numero: m.numero, sumilla: m.sumilla, texto: m.texto, notas: m.notas,
          estado: m.estado, fuente: m.fuente, fechaFuente: m.fechaFuente || null,
        });
        const res = r?.DATA ?? r;
        if (res?.STATUS) {
          toast.success(res.MESSAGE || 'Artículo guardado');
          this.update(); this.handleClose();
        } else {
          toast.error(res?.MESSAGE || 'No se pudo guardar el artículo');
        }
      } catch (e) {
        toast.error(e?.MESSAGE || e?.response?.data?.message?.[0] || 'No se pudo guardar el artículo');
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
.fia-area { width: 100%; resize: vertical; line-height: 1.5; font-size: 14px; }
.fia-ayuda { margin: 6px 0 0; font-size: 11px; line-height: 1.4; color: var(--text-muted); }
.fia-error { margin: 4px 0 0; font-size: 12px; color: #dc2626; }
</style>
