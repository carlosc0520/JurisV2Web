<template>
  <div class="flex flex-col gap-4" :style="{ '--est-1': paleta[0], '--est-2': paleta[1], '--est-3': paleta[2] }">
    <!-- Filtros en una sola fila -->
    <SectionCard>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="btn-volver" @click="$emit('volver')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Artículos
        </button>
        <span class="text-sm font-bold" style="color:var(--text)">Estadísticas del blog</span>
        <span class="flex-1" />
        <div class="est-periodos" role="group" aria-label="Período">
          <button v-for="p in periodos" :key="p.dias" type="button" :aria-pressed="dias === p.dias"
            :class="['est-periodo', { 'est-periodo--activo': dias === p.dias }]" @click="dias = p.dias">{{ p.label }}</button>
        </div>
        <app-select v-model="idCategoria" aria-label="Categoría">
          <option :value="''">Todas las categorías</option>
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
        </app-select>
      </div>
    </SectionCard>

    <p v-if="error" class="est-aviso">{{ error }}</p>

    <!-- Indicadores -->
    <div class="est-kpis">
      <div v-for="k in kpis" :key="k.clave" class="est-kpi">
        <span class="est-kpi-titulo">{{ k.titulo }}</span>
        <span class="est-kpi-valor">
          <span v-if="k.clave === 'vivo'" class="est-vivo" aria-hidden="true" />
          {{ cargando ? '—' : k.valor }}
        </span>
        <span v-if="!cargando" :class="['est-kpi-delta', k.delta.clase]">
          <svg v-if="k.delta.clase === 'sube'" viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
          <svg v-else-if="k.delta.clase === 'baja'" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
          {{ k.delta.texto }}
        </span>
      </div>
    </div>

    <div v-if="!cargando && datos && !datos.actual.visitas" class="est-vacio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>
      <p class="m-0 font-semibold" style="color:var(--text)">Todavía no hay visitas en este período</p>
      <p class="m-0 text-sm" style="color:var(--text-muted)">Las lecturas de los artículos se cuentan desde que se activó esta función.</p>
    </div>

    <template v-else>
      <!-- Visitas en el tiempo -->
      <SectionCard>
        <div class="est-cabecera">
          <h3 class="est-titulo">Visitas en el tiempo</h3>
          <div class="est-leyenda">
            <span><i class="est-leyenda-linea" style="background:var(--est-1)" />Visitas</span>
            <span><i class="est-leyenda-linea" style="background:var(--est-2)" />Visitantes</span>
          </div>
        </div>
        <div class="est-lienzo est-lienzo--alto"><canvas ref="serie" role="img" :aria-label="`Visitas y visitantes por ${datos?.agrupacion === 'mes' ? 'mes' : 'día'}`" /></div>
      </SectionCard>

      <div class="est-dos">
        <!-- Origen del tráfico -->
        <SectionCard>
          <h3 class="est-titulo">De dónde llegan</h3>
          <ul class="est-barras">
            <li v-for="o in datos?.origenes || []" :key="o.nombre" :title="`${o.nombre}: ${fmt(o.visitas)} visitas`">
              <span class="est-barra-nombre">{{ o.nombre }}</span>
              <span class="est-barra-pista"><span class="est-barra" :style="{ width: ancho(o.visitas, datos.origenes) }" /></span>
              <span class="est-barra-valor">{{ fmt(o.visitas) }} <small>{{ porcentaje(o.visitas, datos.actual.visitas) }}</small></span>
            </li>
          </ul>
        </SectionCard>

        <!-- Dispositivos: una barra dividida + leyenda con valores -->
        <SectionCard>
          <h3 class="est-titulo">Dispositivos</h3>
          <div class="est-segmentos" role="img" :aria-label="dispositivosTexto">
            <span v-for="(d, i) in datos?.dispositivos || []" :key="d.nombre" class="est-segmento"
              :style="{ flexGrow: d.visitas, background: colorDispositivo(d.nombre, i) }" :title="`${d.nombre}: ${porcentaje(d.visitas, datos.actual.visitas)}`" />
          </div>
          <ul class="est-dispositivos">
            <li v-for="(d, i) in datos?.dispositivos || []" :key="d.nombre">
              <i class="est-punto" :style="{ background: colorDispositivo(d.nombre, i) }" />
              <span class="flex-1">{{ d.nombre }}</span>
              <strong>{{ porcentaje(d.visitas, datos.actual.visitas) }}</strong>
              <span class="est-tenue">{{ fmt(d.visitas) }}</span>
            </li>
          </ul>
        </SectionCard>
      </div>

      <div class="est-dos">
        <!-- Categorías -->
        <SectionCard>
          <h3 class="est-titulo">Visitas por categoría</h3>
          <ul class="est-barras">
            <li v-for="c in datos?.categorias || []" :key="c.nombre" :title="`${c.nombre}: ${fmt(c.visitas)} visitas`">
              <span class="est-barra-nombre">{{ c.nombre }}</span>
              <span class="est-barra-pista"><span class="est-barra" :style="{ width: ancho(c.visitas, datos.categorias) }" /></span>
              <span class="est-barra-valor">{{ fmt(c.visitas) }} <small>{{ porcentaje(c.visitas, datos.actual.visitas) }}</small></span>
            </li>
          </ul>
        </SectionCard>

        <!-- Hora del día -->
        <SectionCard>
          <div class="est-cabecera">
            <h3 class="est-titulo">Hora del día</h3>
            <span class="est-tenue text-xs">Hora de Perú{{ horaPico !== null ? ` · más visitas a las ${horaPico}:00` : '' }}</span>
          </div>
          <div class="est-lienzo"><canvas ref="horas" role="img" aria-label="Visitas por hora del día" /></div>
        </SectionCard>
      </div>

      <!-- Ranking de artículos -->
      <SectionCard>
        <h3 class="est-titulo">Artículos más leídos</h3>
        <div class="overflow-x-auto">
          <table class="est-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Artículo</th>
                <th class="text-right">Visitas</th>
                <th class="text-right">Visitantes</th>
                <th class="text-right" title="Promedio de tiempo con el artículo en pantalla">Tiempo medio</th>
                <th class="text-right" title="Visitas que bajaron al menos hasta el 75 % del artículo">Lectura completa</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in datos?.articulos || []" :key="a.id">
                <td class="est-tenue">{{ i + 1 }}</td>
                <td>
                  <a :href="`/blog/${a.slug}`" target="_blank" rel="noopener" class="est-enlace">{{ a.titulo }}</a>
                  <span class="est-barra-pista est-barra-pista--fina"><span class="est-barra" :style="{ width: ancho(a.visitas, datos.articulos) }" /></span>
                </td>
                <td class="text-right font-semibold">{{ fmt(a.visitas) }}</td>
                <td class="text-right">{{ fmt(a.visitantes) }}</td>
                <td class="text-right">{{ duracion(a.segundos) }}</td>
                <td class="text-right">{{ a.completas == null ? '—' : `${a.completas} %` }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div class="est-dos">
        <SectionCard>
          <h3 class="est-titulo">Sitios que enlazan</h3>
          <ul v-if="datos?.referentes?.length" class="est-barras">
            <li v-for="r in datos.referentes" :key="r.nombre">
              <span class="est-barra-nombre">{{ r.nombre }}</span>
              <span class="est-barra-pista"><span class="est-barra" :style="{ width: ancho(r.visitas, datos.referentes) }" /></span>
              <span class="est-barra-valor">{{ fmt(r.visitas) }}</span>
            </li>
          </ul>
          <p v-else class="est-tenue text-sm m-0">Ningún otro sitio ha enlazado tus artículos en este período.</p>
        </SectionCard>

        <SectionCard>
          <h3 class="est-titulo">Campañas</h3>
          <ul v-if="datos?.campanas?.length" class="est-barras">
            <li v-for="c in datos.campanas" :key="`${c.fuente}-${c.campana}`">
              <span class="est-barra-nombre">{{ c.campana || c.fuente }}<small v-if="c.campana && c.fuente"> · {{ c.fuente }}</small></span>
              <span class="est-barra-pista"><span class="est-barra" :style="{ width: ancho(c.visitas, datos.campanas) }" /></span>
              <span class="est-barra-valor">{{ fmt(c.visitas) }}</span>
            </li>
          </ul>
          <div v-else class="text-sm est-tenue">
            <p class="m-0">Para medir una publicación en redes o un correo, agrega al enlace:</p>
            <code class="est-codigo">?utm_source=linkedin&amp;utm_campaign=nombre-de-la-campana</code>
          </div>
        </SectionCard>
      </div>

      <p class="est-nota">
        Se cuenta cada lectura de un artículo publicado. No se cuentan robots ni vistas previas de redes sociales, las recargas de
        la misma persona dentro de 30 minutos ni las visitas de administradores. Sin cookies: "visitantes" son personas
        distintas por día.
      </p>
    </template>
  </div>
</template>

<script>
import Chart from 'chart.js';
import PublicacionesProxy from '@/proxies/PublicacionesProxy';

// Paleta validada (dataviz) contra las superficies de la app: claro #ffffff, oscuro #1e293b
const COLORES = {
  claro: ['#2a78d6', '#eb6834', '#1baf7a'],
  oscuro: ['#3987e5', '#d95926', '#199e70'],
};
const ORDEN_DISPOSITIVOS = ['Computadora', 'Celular', 'Tableta']; // el color sigue al dispositivo, no a su puesto

export default {
  name: 'EstadisticasBlog',
  props: {
    categorias: { type: Array, default: () => [] }, // [{ id, nombre }]
  },
  emits: ['volver'],
  data() {
    return {
      periodos: [
        { dias: 7, label: '7 días' }, { dias: 30, label: '30 días' }, { dias: 90, label: '90 días' }, { dias: 365, label: '12 meses' },
      ],
      dias: 30,
      idCategoria: '',
      datos: null,
      cargando: true,
      error: '',
      oscuro: document.documentElement.classList.contains('dark'),
    };
  },
  computed: {
    paleta() { return this.oscuro ? COLORES.oscuro : COLORES.claro; },
    kpis() {
      const a = this.datos?.actual || {}, b = this.datos?.anterior || {};
      const textoPeriodo = this.dias === 365 ? 'los 12 meses anteriores' : `los ${this.dias} días anteriores`;
      return [
        { clave: 'visitas', titulo: 'Visitas', valor: this.fmt(a.visitas), delta: this.delta(a.visitas, b.visitas, textoPeriodo) },
        { clave: 'visitantes', titulo: 'Visitantes', valor: this.fmt(a.visitantes), delta: this.delta(a.visitantes, b.visitantes, textoPeriodo) },
        { clave: 'tiempo', titulo: 'Tiempo medio de lectura', valor: this.duracion(a.segundos), delta: this.delta(a.segundos, b.segundos, textoPeriodo) },
        { clave: 'completas', titulo: 'Lectura completa', valor: a.completas == null ? '—' : `${a.completas} %`, delta: this.deltaPuntos(a.completas, b.completas, textoPeriodo) },
        { clave: 'vivo', titulo: 'Leyendo ahora', valor: this.fmt(this.datos?.enVivo?.visitantes), delta: { clase: 'neutro', texto: 'últimos 30 minutos' } },
      ];
    },
    horaPico() {
      const h = this.datos?.porHora || [];
      const max = Math.max(0, ...h);
      return max > 0 ? h.indexOf(max) : null;
    },
    dispositivosTexto() {
      return (this.datos?.dispositivos || []).map(d => `${d.nombre} ${this.porcentaje(d.visitas, this.datos.actual.visitas)}`).join(', ');
    },
  },
  watch: {
    dias() { this.cargar(); },
    idCategoria() { this.cargar(); },
  },
  methods: {
    async cargar() {
      this.cargando = true;
      this.error = '';
      try {
        const r = await PublicacionesProxy.estadisticas({ dias: this.dias, idCategoria: this.idCategoria || undefined });
        this.datos = r?.DATA ?? r;
      } catch {
        this.error = 'No se pudieron cargar las estadísticas.';
      } finally {
        this.cargando = false;
        this.$nextTick(this.dibujar);
      }
    },
    // ── Formato ──────────────────────────────────────────────
    fmt(n) { return n == null ? '—' : new Intl.NumberFormat('es-PE').format(n); },
    porcentaje(n, total) { return total ? `${Math.round((n / total) * 100)} %` : '—'; },
    ancho(n, lista) { const max = Math.max(1, ...lista.map(x => x.visitas)); return `${Math.max(2, (n / max) * 100)}%`; },
    duracion(s) {
      if (s == null) return '—';
      const m = Math.floor(s / 60), r = s % 60;
      return m ? `${m} min ${String(r).padStart(2, '0')} s` : `${r} s`;
    },
    delta(actual, anterior, periodo) {
      if (actual == null || anterior == null || (!actual && !anterior)) return { clase: 'neutro', texto: `sin datos de ${periodo}` };
      if (!anterior) return { clase: 'sube', texto: `nuevo frente a ${periodo}` };
      const p = Math.round(((actual - anterior) / anterior) * 100);
      if (p === 0) return { clase: 'neutro', texto: `igual que ${periodo}` };
      return { clase: p > 0 ? 'sube' : 'baja', texto: `${p > 0 ? '+' : ''}${p} % vs. ${periodo}` };
    },
    deltaPuntos(actual, anterior, periodo) {
      if (actual == null || anterior == null) return { clase: 'neutro', texto: `sin datos de ${periodo}` };
      const d = actual - anterior;
      if (!d) return { clase: 'neutro', texto: `igual que ${periodo}` };
      return { clase: d > 0 ? 'sube' : 'baja', texto: `${d > 0 ? '+' : ''}${d} pts vs. ${periodo}` };
    },
    etiquetaPeriodo(p) {
      const [y, m, d] = p.split('-').map(Number);
      const f = new Date(Date.UTC(y, m - 1, d || 1));
      return new Intl.DateTimeFormat('es-PE', d ? { day: '2-digit', month: 'short', timeZone: 'UTC' } : { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(f);
    },
    colorDispositivo(nombre, i) {
      const k = ORDEN_DISPOSITIVOS.indexOf(nombre);
      return `var(--est-${(k >= 0 ? k : i) % 3 + 1})`;
    },
    // ── Gráficos ─────────────────────────────────────────────
    tema() {
      const css = getComputedStyle(document.documentElement);
      return {
        serie: this.paleta,
        texto: css.getPropertyValue('--text-muted').trim() || '#6b7280',
        linea: css.getPropertyValue('--border').trim() || '#e5e7eb',
        fondo: css.getPropertyValue('--bg-card').trim() || '#ffffff',
      };
    },
    destruir() {
      ['graficoSerie', 'graficoHoras'].forEach(k => { if (this[k]) { this[k].destroy(); this[k] = null; } });
    },
    dibujar() {
      this.destruir();
      if (!this.datos || !this.datos.actual.visitas) return;
      const t = this.tema();
      const fmt = this.fmt;
      // Línea vertical en el punto señalado (Chart.js 2 no la trae)
      const guia = {
        afterDatasetsDraw(chart) {
          const activo = chart.tooltip && chart.tooltip._active;
          if (!activo || !activo.length) return;
          const x = activo[0]._view.x, y = chart.scales['y-axis-0'], ctx = chart.ctx;
          ctx.save(); ctx.beginPath(); ctx.moveTo(x, y.top); ctx.lineTo(x, y.bottom);
          ctx.lineWidth = 1; ctx.strokeStyle = t.texto; ctx.globalAlpha = 0.5; ctx.stroke(); ctx.restore();
        },
      };
      const ejes = (opciones = {}) => ({
        xAxes: [{ gridLines: { display: false, drawBorder: false }, ticks: { fontColor: t.texto, fontSize: 11, autoSkip: true, maxTicksLimit: 8, maxRotation: 0 }, ...opciones.x }],
        yAxes: [{ gridLines: { color: t.linea, zeroLineColor: t.linea, drawBorder: false }, ticks: { fontColor: t.texto, fontSize: 11, beginAtZero: true, precision: 0, maxTicksLimit: 5, padding: 8, callback: v => fmt(v) } }],
      });
      const tooltip = {
        mode: 'index', intersect: false, backgroundColor: this.oscuro ? '#0f172a' : '#111827', titleFontSize: 12, bodyFontSize: 12,
        xPadding: 10, yPadding: 8, cornerRadius: 8, displayColors: true,
        callbacks: { label: (it, d) => ` ${d.datasets[it.datasetIndex].label}: ${fmt(it.yLabel)}` },
      };

      const serie = this.datos.serie;
      const pocos = serie.length <= 31;
      if (this.$refs.serie) {
        this.graficoSerie = new Chart(this.$refs.serie.getContext('2d'), {
          type: 'line',
          data: {
            labels: serie.map(p => this.etiquetaPeriodo(p.periodo)),
            datasets: [
              { label: 'Visitas', data: serie.map(p => p.visitas), borderColor: t.serie[0], backgroundColor: t.serie[0], borderWidth: 2, fill: false, lineTension: 0.25, pointRadius: pocos ? 3 : 0, pointHoverRadius: 5, pointBorderColor: t.fondo, pointBorderWidth: 2 },
              { label: 'Visitantes', data: serie.map(p => p.visitantes), borderColor: t.serie[1], backgroundColor: t.serie[1], borderWidth: 2, fill: false, lineTension: 0.25, pointRadius: pocos ? 3 : 0, pointHoverRadius: 5, pointBorderColor: t.fondo, pointBorderWidth: 2 },
            ],
          },
          options: { responsive: true, maintainAspectRatio: false, legend: { display: false }, animation: { duration: 300 }, hover: { mode: 'index', intersect: false }, tooltips: tooltip, scales: ejes() },
          plugins: [guia],
        });
      }
      if (this.$refs.horas) {
        this.graficoHoras = new Chart(this.$refs.horas.getContext('2d'), {
          type: 'bar',
          data: {
            labels: Array.from({ length: 24 }, (_, h) => `${h}h`),
            datasets: [{ label: 'Visitas', data: this.datos.porHora, backgroundColor: t.serie[0], hoverBackgroundColor: t.serie[0], borderWidth: 0, barPercentage: 0.8, categoryPercentage: 0.9 }],
          },
          options: {
            responsive: true, maintainAspectRatio: false, legend: { display: false }, animation: { duration: 300 },
            tooltips: { ...tooltip, mode: 'nearest', intersect: false, displayColors: false, callbacks: { title: it => `${it[0].index}:00 – ${it[0].index}:59`, label: it => ` ${fmt(it.yLabel)} visitas` } },
            scales: ejes({ x: { ticks: { fontColor: t.texto, fontSize: 10, autoSkip: true, maxTicksLimit: 12, maxRotation: 0 } } }),
          },
        });
      }
    },
  },
  mounted() {
    this.cargar();
    // Modo claro / oscuro: los gráficos se redibujan con los colores del tema
    this.observador = new MutationObserver(() => {
      const oscuro = document.documentElement.classList.contains('dark');
      if (oscuro !== this.oscuro) { this.oscuro = oscuro; this.$nextTick(this.dibujar); }
    });
    this.observador.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  },
  beforeUnmount() {
    this.destruir();
    if (this.observador) this.observador.disconnect();
  },
};
</script>

<style scoped>
.btn-volver {
  display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border: 1px solid var(--border);
  border-radius: 10px; background: var(--bg-card); color: var(--text); font-size: 13px; font-weight: 600; cursor: pointer;
}
.est-periodos { display: inline-flex; padding: 3px; border: 1px solid var(--border); border-radius: 10px; background: var(--bg-card); }
.est-periodo { padding: 5px 11px; border: 0; border-radius: 7px; background: transparent; color: var(--text-muted); font-size: 12.5px; font-weight: 600; cursor: pointer; }
.est-periodo--activo { background: rgba(24, 100, 255, 0.1); color: #1864ff; }
.dark .est-periodo--activo { background: rgba(99, 102, 241, 0.2); color: #c7d2fe; }

.est-aviso { margin: 0; padding: 10px 14px; border-radius: 10px; background: rgba(220, 38, 38, 0.08); color: #b91c1c; font-size: 13px; }

.est-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.est-kpi {
  display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border: 1px solid var(--border);
  border-radius: 14px; background: var(--bg-card);
}
.est-kpi-titulo { font-size: 12px; font-weight: 600; color: var(--text-muted); }
.est-kpi-valor { display: flex; align-items: center; gap: 8px; font-size: 26px; line-height: 1.15; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; }
.est-kpi-delta { display: inline-flex; align-items: center; gap: 3px; font-size: 11.5px; font-weight: 600; color: var(--text-muted); }
.est-kpi-delta svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 3; }
.est-kpi-delta.sube { color: #15803d; }
.est-kpi-delta.baja { color: #b91c1c; }
.dark .est-kpi-delta.sube { color: #4ade80; }
.dark .est-kpi-delta.baja { color: #f87171; }
.est-vivo { width: 9px; height: 9px; border-radius: 50%; background: #16a34a; box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.5); animation: est-pulso 1.8s infinite; }
@keyframes est-pulso { 70% { box-shadow: 0 0 0 8px rgba(22, 163, 74, 0); } 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); } }

.est-vacio {
  display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 48px 20px; text-align: center;
  border: 1px dashed var(--border); border-radius: 14px; background: var(--bg-card);
}
.est-vacio svg { width: 36px; height: 36px; color: var(--text-muted); margin-bottom: 4px; }

.est-dos { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
.est-cabecera { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; }
.est-titulo { margin: 0 0 12px; font-size: 14px; font-weight: 700; color: var(--text); }
.est-leyenda { display: flex; gap: 14px; font-size: 12px; color: var(--text-muted); }
.est-leyenda span { display: inline-flex; align-items: center; gap: 6px; }
.est-leyenda-linea { display: inline-block; width: 14px; height: 2px; border-radius: 2px; }
.est-lienzo { position: relative; height: 220px; }
.est-lienzo--alto { height: 280px; }

.est-barras { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.est-barras li { display: grid; grid-template-columns: minmax(90px, 32%) 1fr auto; align-items: center; gap: 10px; font-size: 13px; }
.est-barra-nombre { color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.est-barra-nombre small { color: var(--text-muted); }
.est-barra-pista { display: block; height: 8px; border-radius: 4px; background: var(--border); overflow: hidden; }
.est-barra-pista--fina { height: 4px; margin-top: 6px; max-width: 280px; }
.est-barra { display: block; height: 100%; border-radius: 4px; background: var(--est-1, #2a78d6); }
.est-barra-valor { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; text-align: right; min-width: 64px; }
.est-barra-valor small { font-weight: 500; color: var(--text-muted); margin-left: 2px; }

.est-segmentos { display: flex; gap: 2px; height: 14px; margin-bottom: 14px; }
.est-segmento { min-width: 3px; border-radius: 4px; }
.est-dispositivos { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--text); }
.est-dispositivos li { display: flex; align-items: center; gap: 10px; }
.est-dispositivos strong { font-variant-numeric: tabular-nums; }
.est-punto { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.est-tenue { color: var(--text-muted); }

.est-tabla { width: 100%; border-collapse: collapse; font-size: 13px; color: var(--text); }
.est-tabla th { padding: 8px 10px; border-bottom: 1px solid var(--border); font-size: 11.5px; font-weight: 700; color: var(--text-muted); text-align: left; white-space: nowrap; }
.est-tabla th.text-right, .est-tabla td.text-right { text-align: right; }
.est-tabla td { padding: 10px; border-bottom: 1px solid var(--border); vertical-align: top; font-variant-numeric: tabular-nums; }
.est-tabla tr:last-child td { border-bottom: 0; }
.est-enlace { color: var(--text); font-weight: 600; text-decoration: none; }
.est-enlace:hover { color: #1864ff; text-decoration: underline; }
.est-codigo { display: block; margin-top: 6px; padding: 8px 10px; border-radius: 8px; background: var(--bg-sunken, rgba(0,0,0,0.04)); font-size: 12px; word-break: break-all; color: var(--text); }
.est-nota { margin: 0; padding: 0 4px; font-size: 11.5px; line-height: 1.5; color: var(--text-muted); }
</style>
