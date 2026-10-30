<template>
  <div class="seo-panel">
    <div class="flex items-center gap-4">
      <div class="relative w-16 h-16 flex-shrink-0">
        <canvas ref="canvas" width="64" height="64"></canvas>
        <div class="absolute inset-0 flex items-center justify-center text-sm font-extrabold" :style="`color:${colorPuntaje}`">
          {{ puntaje }}
        </div>
      </div>
      <div>
        <p class="text-sm font-bold m-0" style="color:var(--text)">Puntaje SEO</p>
        <p class="text-xs m-0" style="color:var(--text-muted)">{{ etiquetaPuntaje }}</p>
      </div>
    </div>

    <ul class="list-none p-0 m-0 mt-4 flex flex-col gap-2">
      <li v-for="regla in reglas" :key="regla.id" class="flex items-start gap-2 text-xs">
        <span :class="['seo-icon', `seo-icon-${regla.estado}`]">
          <span v-if="regla.estado === 'ok'">✓</span>
          <span v-else-if="regla.estado === 'warn'">⚠</span>
          <span v-else>✗</span>
        </span>
        <span style="color:var(--text)">{{ regla.mensaje }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Chart from 'chart.js';
import { extractPlainText, extractHeadings, countWords } from '@/components/Publicaciones/tiptap/docUtils';

export default {
  name: 'SeoPanel',
  props: {
    titulo:       { type: String, default: '' },
    resumen:      { type: String, default: '' },
    idCategoria:  { type: [Number, String], default: null },
    imagen:       { type: Boolean, default: false },
    palabraClave: { type: String, default: '' },
    documento:    { type: Object, default: null },
  },
  computed: {
    textoPlano() { return this.documento ? extractPlainText(this.documento) : ''; },
    numPalabras() { return this.documento ? countWords(this.documento) : 0; },
    tieneH2() { return this.documento ? extractHeadings(this.documento).length > 0 : false; },

    reglas() {
      const r = [];

      const lt = this.titulo?.length || 0;
      r.push({ id: 'titulo', estado: lt >= 40 && lt <= 60 ? 'ok' : lt >= 20 && lt <= 70 ? 'warn' : 'fail',
        mensaje: lt === 0 ? 'Falta el título' : `Título de ${lt} caracteres (ideal: 40-60)` });

      const lr = this.resumen?.length || 0;
      r.push({ id: 'resumen', estado: lr >= 120 && lr <= 160 ? 'ok' : lr >= 60 && lr <= 200 ? 'warn' : 'fail',
        mensaje: lr === 0 ? 'Falta el resumen (meta descripción)' : `Resumen de ${lr} caracteres (ideal: 120-160)` });

      r.push({ id: 'categoria', estado: this.idCategoria ? 'ok' : 'fail',
        mensaje: this.idCategoria ? 'Categoría seleccionada' : 'Falta seleccionar una categoría' });

      r.push({ id: 'imagen', estado: this.imagen ? 'ok' : 'fail',
        mensaje: this.imagen ? 'Imagen de portada presente' : 'Falta la imagen de portada' });

      r.push({ id: 'h2', estado: this.tieneH2 ? 'ok' : 'fail',
        mensaje: this.tieneH2 ? 'El contenido tiene al menos un encabezado' : 'Agrega al menos un encabezado (H2) al contenido' });

      const np = this.numPalabras;
      r.push({ id: 'longitud', estado: np >= 300 ? 'ok' : np >= 150 ? 'warn' : 'fail',
        mensaje: `El contenido tiene ${np} palabras (ideal: 300+)` });

      if (this.palabraClave?.trim()) {
        const kw = this.palabraClave.trim().toLowerCase();
        const enTitulo = this.titulo?.toLowerCase().includes(kw);
        r.push({ id: 'kw-titulo', estado: enTitulo ? 'ok' : 'warn',
          mensaje: enTitulo ? 'La palabra clave aparece en el título' : 'La palabra clave no aparece en el título' });

        const enResumen = this.resumen?.toLowerCase().includes(kw);
        r.push({ id: 'kw-resumen', estado: enResumen ? 'ok' : 'warn',
          mensaje: enResumen ? 'La palabra clave aparece en el resumen' : 'La palabra clave no aparece en el resumen' });

        const primerParrafo = this.textoPlano.slice(0, 200).toLowerCase();
        const enPrimerParrafo = primerParrafo.includes(kw);
        r.push({ id: 'kw-contenido', estado: enPrimerParrafo ? 'ok' : 'warn',
          mensaje: enPrimerParrafo ? 'La palabra clave aparece al inicio del contenido' : 'La palabra clave no aparece en el primer párrafo' });
      }

      return r;
    },

    puntaje() {
      if (!this.reglas.length) return 0;
      const valores = { ok: 1, warn: 0.5, fail: 0 };
      const total = this.reglas.reduce((acc, r) => acc + valores[r.estado], 0);
      return Math.round((total / this.reglas.length) * 100);
    },
    colorPuntaje() {
      if (this.puntaje >= 80) return '#22c55e';
      if (this.puntaje >= 50) return '#f59e0b';
      return '#ef4444';
    },
    etiquetaPuntaje() {
      if (this.puntaje >= 80) return 'Muy buen SEO';
      if (this.puntaje >= 50) return 'Se puede mejorar';
      return 'Necesita trabajo';
    },
  },
  methods: {
    // La instancia de Chart.js va en `this.chart` sin declararla en data():
    // si Vue la vuelve reactiva, Chart falla al actualizar ("reading 'length'")
    // y ese error cortaba el renderizado de todo el editor.
    dibujar() {
      if (!this.$refs.canvas) return;
      const valores = [this.puntaje, 100 - this.puntaje];
      const colores = [this.colorPuntaje, 'rgba(148,163,184,0.15)'];
      try {
        if (this.chart) {
          const ds = this.chart.data.datasets[0];
          ds.data = valores;
          ds.backgroundColor = colores;
          this.chart.update();
          return;
        }
        this.chart = new Chart(this.$refs.canvas.getContext('2d'), {
          type: 'doughnut',
          data: { datasets: [{ data: valores, backgroundColor: colores, borderWidth: 0 }] },
          options: { cutoutPercentage: 72, legend: { display: false }, tooltips: { enabled: false }, animation: { duration: 300 } },
        });
      } catch (err) {
        console.warn('[SeoPanel] No se pudo dibujar el gráfico de puntaje:', err);
      }
    },
  },
  mounted() { this.chart = null; this.dibujar(); },
  beforeUnmount() { this.chart?.destroy(); this.chart = null; },
  watch: {
    puntaje() { this.dibujar(); },
  },
};
</script>

<style scoped>
.seo-panel { padding: 0.25rem 0; }
.seo-icon {
  width: 1rem; height: 1rem; border-radius: 9999px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem; font-weight: 800; margin-top: 0.05rem;
}
.seo-icon-ok   { background: rgba(34,197,94,0.15); color: #16a34a; }
.seo-icon-warn { background: rgba(245,158,11,0.15); color: #d97706; }
.seo-icon-fail { background: rgba(239,68,68,0.15); color: #dc2626; }
</style>
