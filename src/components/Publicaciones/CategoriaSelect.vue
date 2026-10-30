<template>
  <div class="w-full" ref="raiz">
    <label v-if="label" class="block text-sm font-medium mb-1.5" style="color:var(--text)">
      {{ label }}
      <span v-if="required" class="text-brand-pink ml-0.5">*</span>
    </label>

    <div class="relative">
      <button type="button" ref="disparador"
        :class="['cs-disparador', { abierto, error: !!error }]"
        :aria-expanded="abierto" aria-haspopup="listbox"
        @click="alternar" @keydown.down.prevent="abrir" @keydown.enter.prevent="abrir">
        <span v-if="seleccionada" class="cs-valor">{{ seleccionada.label }}</span>
        <span v-else class="cs-placeholder">{{ placeholder }}</span>
        <svg :class="['cs-chevron', { girado: abierto }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      <transition name="cs-panel">
        <div v-if="abierto" class="cs-panel" @keydown.esc.prevent="cerrar(true)">
          <div class="cs-buscador">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input ref="buscador" v-model="texto" type="text" placeholder="Buscar categoría…"
              @keydown.down.prevent="mover(1)" @keydown.up.prevent="mover(-1)"
              @keydown.enter.prevent="elegirResaltada" @keydown.tab="cerrar()" />
          </div>
          <ul ref="lista" class="cs-lista" role="listbox">
            <li v-for="(op, i) in filtradas" :key="op.value" role="option"
              :aria-selected="esSeleccionada(op)"
              :class="['cs-opcion', { resaltada: i === resaltada, seleccionada: esSeleccionada(op) }]"
              @mouseenter="resaltada = i" @click="elegir(op)">
              <span class="truncate">{{ op.label }}</span>
              <svg v-if="esSeleccionada(op)" class="cs-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </li>
            <li v-if="!filtradas.length" class="cs-vacio">Sin resultados para “{{ texto }}”</li>
          </ul>
        </div>
      </transition>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script>
const normalizar = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Selector de categoría con buscador, usado solo en el editor de publicaciones.
export default {
  name: 'CategoriaSelect',
  props: {
    modelValue:  { default: null },
    categorias:  { type: Array, default: () => [] },
    label:       { type: String, default: '' },
    placeholder: { type: String, default: 'Selecciona una categoría' },
    required:    { type: Boolean, default: false },
    error:       { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  data() {
    return { abierto: false, texto: '', resaltada: 0 };
  },
  computed: {
    opciones() {
      return this.categorias
        .map(c => ({ value: Number(c.id ?? c.ID), label: c.descripcion ?? c.DESCRIPCION }))
        .sort((a, b) => a.label.localeCompare(b.label, 'es'));
    },
    filtradas() {
      const q = normalizar(this.texto.trim());
      return q ? this.opciones.filter(o => normalizar(o.label).includes(q)) : this.opciones;
    },
    seleccionada() {
      return this.opciones.find(o => o.value === Number(this.modelValue)) || null;
    },
  },
  watch: {
    texto() { this.resaltada = 0; },
  },
  mounted() { document.addEventListener('mousedown', this.clickFuera); },
  beforeUnmount() { document.removeEventListener('mousedown', this.clickFuera); },
  methods: {
    esSeleccionada(op) { return this.seleccionada?.value === op.value; },
    alternar() { this.abierto ? this.cerrar() : this.abrir(); },
    abrir() {
      if (this.abierto) return;
      this.texto = '';
      this.abierto = true;
      const idx = this.filtradas.findIndex(o => this.esSeleccionada(o));
      this.resaltada = idx >= 0 ? idx : 0;
      this.$nextTick(() => { this.$refs.buscador?.focus(); this.asegurarVisible(); });
    },
    cerrar(devolverFoco = false) {
      this.abierto = false;
      if (devolverFoco) this.$refs.disparador?.focus();
    },
    elegir(op) {
      this.$emit('update:modelValue', op.value);
      this.cerrar(true);
    },
    elegirResaltada() {
      const op = this.filtradas[this.resaltada];
      if (op) this.elegir(op);
    },
    mover(d) {
      if (!this.filtradas.length) return;
      this.resaltada = (this.resaltada + d + this.filtradas.length) % this.filtradas.length;
      this.$nextTick(this.asegurarVisible);
    },
    asegurarVisible() {
      this.$refs.lista?.children[this.resaltada]?.scrollIntoView({ block: 'nearest' });
    },
    clickFuera(e) {
      if (this.abierto && !this.$refs.raiz?.contains(e.target)) this.cerrar();
    },
  },
};
</script>

<style scoped>
.cs-disparador {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 9px 12px; border-radius: 10px; text-align: left;
  border: 1px solid var(--border); background: var(--bg-card); color: var(--text); font-size: 14px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.cs-disparador:hover { border-color: #cbd0d8; }
.cs-disparador.abierto, .cs-disparador:focus-visible { outline: none; border-color: #cbd0d8; box-shadow: none; }
.cs-disparador.error { border-color: #ef4444; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15); }
.cs-valor { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-placeholder { color: var(--text-muted); }
.cs-chevron { width: 16px; height: 16px; flex-shrink: 0; color: var(--text-muted); transition: transform 0.2s; }
.cs-chevron.girado { transform: rotate(180deg); }

.cs-panel {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 60;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14); overflow: hidden;
}
.cs-buscador { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--border); }
.cs-buscador svg { width: 15px; height: 15px; flex-shrink: 0; color: var(--text-muted); }
/* !important: los estilos globales de input le ponen borde y anillo de foco */
.cs-buscador input { flex: 1; min-width: 0; border: 0 !important; outline: none !important; background: transparent !important; color: var(--text); font-size: 13.5px; padding: 0; box-shadow: none !important; }

.cs-lista { list-style: none; margin: 0; padding: 6px; max-height: 240px; overflow-y: auto; }
.cs-opcion {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 8px 10px; border-radius: 8px; font-size: 13.5px; color: var(--text); cursor: pointer;
}
.cs-opcion.resaltada { background: #f3f4f6; }
.dark .cs-opcion.resaltada { background: rgba(255, 255, 255, 0.06); }
.cs-opcion.seleccionada { font-weight: 600; }
.cs-check { width: 15px; height: 15px; flex-shrink: 0; }
.cs-vacio { padding: 14px 10px; text-align: center; font-size: 13px; color: var(--text-muted); }

.cs-panel-enter-active, .cs-panel-leave-active { transition: opacity 0.15s, transform 0.15s; }
.cs-panel-enter-from, .cs-panel-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
