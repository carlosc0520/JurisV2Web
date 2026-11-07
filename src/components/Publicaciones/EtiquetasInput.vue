<template>
  <div class="relative" v-click-fuera="() => (abierto = false)">
    <label :for="idInput" class="block text-sm font-medium mb-1.5 text-content">Etiquetas</label>
    <div class="etq-caja input-base" @click="$refs.entrada.focus()">
      <span v-for="(e, i) in modelValue" :key="e" class="etq-chip">
        {{ e }}
        <button type="button" class="etq-quitar" :aria-label="`Quitar ${e}`" @click.stop="quitar(i)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
        </button>
      </span>
      <input :id="idInput" ref="entrada" v-model="texto" type="text" class="etq-entrada"
        :placeholder="modelValue.length >= maximo ? 'Llegaste al máximo' : modelValue.length ? 'Agregar otra…' : 'Escribe una etiqueta y presiona Enter'"
        :disabled="modelValue.length >= maximo"
        @focus="abierto = true" @input="abierto = true"
        @keydown.enter.prevent="agregar(resaltada ?? texto)"
        @keydown="alTeclear" @blur="agregarSiHayComa" />
    </div>
    <ul v-if="abierto && sugeridas.length" class="etq-sugerencias" role="listbox">
      <li v-for="(s, i) in sugeridas" :key="s" role="option" :aria-selected="i === indice"
        :class="['etq-sugerencia', i === indice ? 'etq-sugerencia-activa' : '']"
        @mousedown.prevent="agregar(s)">{{ s }}</li>
    </ul>
    <p class="etq-pie">
      <span>Enter o coma para agregar · Retroceso para quitar la última</span>
      <span :class="{ 'etq-tope': modelValue.length >= maximo }">{{ modelValue.length }}/{{ maximo }}</span>
    </p>
  </div>
</template>

<script>
import { slugDe } from '@/utils/slug';

let siguienteId = 0;

export default {
  name: 'EtiquetasInput',
  props: {
    modelValue: { type: Array, default: () => [] },
    sugerencias: { type: Array, default: () => [] },
    maximo: { type: Number, default: 10 },
  },
  emits: ['update:modelValue'],
  directives: {
    clickFuera: {
      mounted(el, binding) {
        el._clickFuera = (e) => { if (!el.contains(e.target)) binding.value(e); };
        document.addEventListener('click', el._clickFuera);
      },
      unmounted(el) { document.removeEventListener('click', el._clickFuera); },
    },
  },
  data() {
    return { texto: '', abierto: false, indice: -1, idInput: `etiquetas-${++siguienteId}` };
  },
  computed: {
    sugeridas() {
      const elegidas = new Set(this.modelValue.map(slugDe));
      const buscado = slugDe(this.texto);
      return this.sugerencias
        .filter(s => !elegidas.has(slugDe(s)) && (!buscado || slugDe(s).includes(buscado)))
        .slice(0, 8);
    },
    resaltada() { return this.indice >= 0 ? this.sugeridas[this.indice] ?? null : null; },
  },
  watch: {
    texto() { this.indice = -1; },
  },
  methods: {
    agregar(valor) {
      const nombre = String(valor ?? '').replace(/[,;]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);
      this.texto = '';
      this.indice = -1;
      if (!nombre || this.modelValue.length >= this.maximo) return;
      // Si ya existe con otra escritura ("penal" y "Penal"), se usa la existente
      const existente = this.sugerencias.find(s => slugDe(s) === slugDe(nombre));
      const final = existente || nombre;
      if (this.modelValue.some(e => slugDe(e) === slugDe(final))) return;
      this.$emit('update:modelValue', [...this.modelValue, final]);
    },
    quitar(i) {
      this.$emit('update:modelValue', this.modelValue.filter((_, k) => k !== i));
    },
    alTeclear(e) {
      if (e.key === ',' || e.key === ';') { e.preventDefault(); this.agregar(this.texto); return; }
      if (e.key === 'Backspace' && !this.texto && this.modelValue.length) this.quitar(this.modelValue.length - 1);
      if (e.key === 'ArrowDown' && this.sugeridas.length) { e.preventDefault(); this.indice = (this.indice + 1) % this.sugeridas.length; }
      if (e.key === 'ArrowUp' && this.sugeridas.length) { e.preventDefault(); this.indice = this.indice <= 0 ? this.sugeridas.length - 1 : this.indice - 1; }
      if (e.key === 'Escape') this.abierto = false;
    },
    // Al salir del campo no se pierde lo escrito
    agregarSiHayComa() { if (this.texto.trim()) this.agregar(this.texto); },
  },
};
</script>

<style scoped>
.etq-caja {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 46px;
  height: auto;
  padding: 7px 10px;
  cursor: text;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.etq-caja:focus-within {
  border-color: #1864ff;
  box-shadow: 0 0 0 3px rgba(24, 100, 255, 0.12);
}
.etq-chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 28px;
  padding: 0 4px 0 11px;
  border: 1px solid rgba(24, 100, 255, 0.18);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #1864ff;
  background: rgba(24, 100, 255, 0.07);
}
.dark .etq-chip { color: #c7d2fe; border-color: rgba(129, 140, 248, 0.3); background: rgba(99, 102, 241, 0.18); }
.etq-quitar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  color: inherit;
  opacity: 0.7;
  background: transparent;
}
.etq-quitar svg { width: 11px; height: 11px; }
.etq-quitar:hover { opacity: 1; background: rgba(24, 100, 255, 0.14); }
/* El campo de texto va "dentro" de la caja: sin borde ni anillo propios (los estilos globales de input los agregan) */
.etq-caja .etq-entrada,
.etq-caja .etq-entrada:focus {
  flex: 1;
  min-width: 160px;
  height: 28px;
  padding: 0 2px;
  border: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  font-size: 14px;
  color: var(--text);
}
.etq-entrada::placeholder { color: var(--text-muted); }
.etq-pie {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 6px 0 0;
  font-size: 11px;
  color: var(--text-muted);
}
.etq-tope { color: #e71fb3; font-weight: 700; }
.etq-sugerencias {
  position: absolute;
  z-index: 30;
  left: 0;
  right: 0;
  margin: 4px 0 0;
  padding: 4px;
  list-style: none;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-card);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}
.etq-sugerencia {
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text);
}
.etq-sugerencia:hover,
.etq-sugerencia-activa { background: rgba(24, 100, 255, 0.08); color: #1864ff; }
</style>
