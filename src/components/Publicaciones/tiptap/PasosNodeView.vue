<template>
  <NodeViewWrapper class="bloque-pasos" data-type="pasos">
    <input v-model="tituloLocal" @input="guardarTitulo" placeholder="Título de la sección (opcional)"
      class="bloque-pasos-input-titulo" />
    <div class="bloque-pasos-lista">
      <div v-for="(item, i) in itemsLocal" :key="i" class="bloque-pasos-item-editor">
        <span class="bloque-pasos-numero">{{ i + 1 }}</span>
        <div class="bloque-pasos-campos">
          <input v-model="item.titulo" @input="guardarItems" placeholder="Título del paso" />
          <input v-model="item.descripcion" @input="guardarItems" placeholder="Descripción breve" />
        </div>
        <button type="button" @click="quitar(i)" class="bloque-pasos-quitar" title="Quitar paso">✕</button>
      </div>
    </div>
    <button type="button" @click="agregar" class="bloque-pasos-agregar">+ Agregar paso</button>
  </NodeViewWrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-3';

export default {
  name: 'PasosNodeView',
  components: { NodeViewWrapper },
  props: {
    node: { type: Object, required: true },
    updateAttributes: { type: Function, required: true },
  },
  data() {
    return {
      tituloLocal: this.node.attrs.titulo || '',
      itemsLocal: (this.node.attrs.items || []).map((i) => ({ ...i })),
    };
  },
  methods: {
    guardarTitulo() { this.updateAttributes({ titulo: this.tituloLocal }); },
    guardarItems() { this.updateAttributes({ items: this.itemsLocal }); },
    agregar() { this.itemsLocal.push({ titulo: '', descripcion: '' }); this.guardarItems(); },
    quitar(i) { this.itemsLocal.splice(i, 1); this.guardarItems(); },
  },
};
</script>
