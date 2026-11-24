<template>
  <NodeViewWrapper :class="['bloque-boton-editor', { 'bloque-boton-editor--abierto': abierto }]" data-type="boton">
    <div class="bloque-boton-wrap" :data-alineacion="node.attrs.alineacion">
      <span :class="vista.clase" :style="vista.style">{{ node.attrs.texto || 'Ver más' }}</span>
      <button type="button" class="bb-editar" contenteditable="false" :title="abierto ? 'Cerrar edición' : 'Editar botón'"
        :aria-label="abierto ? 'Cerrar edición' : 'Editar botón'" @click="abierto = !abierto">
        <svg v-if="!abierto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
    </div>

    <div v-if="abierto" class="bb-panel" contenteditable="false">
      <div class="bb-fila">
        <input class="bb-input" :value="node.attrs.texto" maxlength="60" placeholder="Texto del botón" aria-label="Texto del botón"
          @input="e => updateAttributes({ texto: e.target.value })" />
        <input class="bb-input" :class="{ 'bb-input--error': urlInvalida }" :value="node.attrs.url"
          placeholder="Enlace (opcional): https://… o /contacto" aria-label="Enlace del botón"
          @input="e => updateAttributes({ url: e.target.value.trim() })" />
      </div>
      <div class="bb-fila bb-fila--opciones">
        <label class="bb-check">
          <input type="checkbox" :checked="node.attrs.nuevaPestana" @change="e => updateAttributes({ nuevaPestana: e.target.checked })" />
          Otra pestaña
        </label>
        <select class="bb-select" :value="node.attrs.estilo" aria-label="Estilo" @change="e => updateAttributes({ estilo: e.target.value })">
          <option value="relleno">Relleno</option>
          <option value="borde">Borde</option>
        </select>
        <select class="bb-select" :value="node.attrs.alineacion" aria-label="Alineación" @change="e => updateAttributes({ alineacion: e.target.value })">
          <option value="izquierda">Izquierda</option>
          <option value="centro">Centro</option>
        </select>
        <span class="bb-colores" role="group" aria-label="Color">
          <button v-for="c in COLORES" :key="c.valor" type="button" :title="c.nombre" :aria-label="c.nombre"
            :class="['bb-muestra', { 'bb-muestra--activa': (node.attrs.color || '') === c.valor }]"
            :style="{ background: c.valor || 'linear-gradient(135deg, #e71fb3, #1864ff)' }"
            @click="updateAttributes({ color: c.valor })" />
          <label :class="['bb-muestra', 'bb-muestra--propio', { 'bb-muestra--activa': colorPropio }]" title="Otro color"
            :style="colorPropio ? { background: node.attrs.color } : null">
            <input type="color" :value="node.attrs.color || '#1864ff'" aria-label="Elegir otro color"
              @input="e => updateAttributes({ color: e.target.value })" />
            <span v-if="!colorPropio" aria-hidden="true">+</span>
          </label>
        </span>
      </div>
      <p v-if="urlInvalida" class="bb-aviso">Enlace no válido: usa https://…, www…, mailto:, tel: o una ruta como /contacto.</p>
    </div>
  </NodeViewWrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-3';
import { urlSegura, apariencia } from './BotonNode';

// '' = degradado de la marca (el color de siempre)
const COLORES = [
  { valor: '', nombre: 'Degradado de la marca' },
  { valor: '#1864ff', nombre: 'Azul' },
  { valor: '#e71fb3', nombre: 'Rosado' },
  { valor: '#16a34a', nombre: 'Verde' },
  { valor: '#d97706', nombre: 'Ámbar' },
  { valor: '#0f172a', nombre: 'Oscuro' },
];

export default {
  name: 'BotonNodeView',
  components: { NodeViewWrapper },
  props: {
    node: { type: Object, required: true },
    updateAttributes: { type: Function, required: true },
  },
  data() {
    // Recién insertado (sin enlace) se abre para editarlo; los ya armados se ven cerrados
    return { COLORES, abierto: !this.node.attrs.url };
  },
  computed: {
    vista() {
      return apariencia(this.node.attrs);
    },
    colorPropio() {
      const c = this.node.attrs.color || '';
      return !!c && !COLORES.some(x => x.valor === c);
    },
    urlInvalida() {
      return !!this.node.attrs.url && !urlSegura(this.node.attrs.url);
    },
  },
};
</script>
