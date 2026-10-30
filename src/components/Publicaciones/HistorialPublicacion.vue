<template>
  <div>
    <div v-if="cargando" class="flex flex-col gap-3">
      <div v-for="n in 3" :key="n" class="flex gap-2.5">
        <span class="sk w-6 h-6 rounded-full flex-shrink-0" />
        <div class="flex flex-col gap-1.5 flex-1"><span class="sk h-3.5 w-2/3" /><span class="sk h-3 w-1/3" /></div>
      </div>
    </div>

    <p v-else-if="!items.length" class="m-0 text-xs" style="color:var(--text-muted)">Aún no hay cambios registrados.</p>

    <ol v-else class="hist-lista">
      <li v-for="h in visibles" :key="h.id" class="hist-item">
        <span :class="['hist-icono', `hist-${(h.accion || '').toLowerCase()}`]" aria-hidden="true">
          <svg v-if="h.accion === 'CREADO'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <svg v-else-if="h.accion === 'EDITADO'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <svg v-else-if="h.accion === 'PUBLICADO'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <svg v-else-if="h.accion === 'BORRADOR'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <svg v-else-if="h.accion === 'DESTACADO' || h.accion === 'NO_DESTACADO'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg v-else-if="h.accion === 'POSESION'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
        </span>
        <div class="min-w-0 flex-1">
          <p class="hist-texto" :title="`${h.nombre || h.usuario || ''} ${verbo(h.accion)}${h.detalle ? ': ' + h.detalle : ''}`">
            <strong>{{ nombreCorto(h) }}</strong> {{ verbo(h.accion) }}<span v-if="h.detalle" class="hist-detalle"> · {{ h.detalle }}</span>
          </p>
          <p class="hist-fecha" :title="fechaCompleta(h.fecha)">{{ haceCuanto(h.fecha) }}</p>
        </div>
      </li>
    </ol>

    <button v-if="!cargando && items.length > limite" type="button" class="hist-mas" :aria-expanded="todos" @click="todos = !todos">
      {{ todos ? 'Ver menos' : `Ver ${items.length - limite} más` }}
      <svg :class="['hist-chevron', { girado: todos }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
  </div>
</template>

<script>
import PublicacionesProxy from '@/proxies/PublicacionesProxy';

// Del más reciente al primero (el API ya los devuelve en ese orden)
const VERBOS = {
  CREADO: 'lo creó',
  EDITADO: 'editó',
  ACTIVADO: 'lo activó',
  DESACTIVADO: 'lo desactivó',
  POSESION: 'tomó posesión',
  PUBLICADO: 'lo publicó',
  BORRADOR: 'lo pasó a borrador',
  DESTACADO: 'lo marcó como destacado',
  NO_DESTACADO: 'le quitó el destacado',
};

// Línea de tiempo de quién creó, editó o cambió el estado de una publicación.
export default {
  name: 'HistorialPublicacion',
  props: {
    idPublicacion: { type: [Number, String], required: true },
    limite: { type: Number, default: 1000 },
  },
  data() {
    return { cargando: true, items: [], todos: false };
  },
  computed: {
    visibles() { return this.todos ? this.items : this.items.slice(0, this.limite); },
  },
  watch: {
    idPublicacion() { this.cargar(); },
  },
  mounted() { this.cargar(); },
  methods: {
    async cargar() {
      this.cargando = true;
      this.todos = false;
      try {
        const r = await PublicacionesProxy.historial(this.idPublicacion);
        this.items = r?.DATA ?? r ?? [];
      } catch {
        this.items = [];
      } finally {
        this.cargando = false;
      }
    },
    verbo(accion) { return VERBOS[accion] || accion?.toLowerCase(); },
    // "Carlos Carbajal Matias" -> "Carlos Carbajal"
    nombreCorto(h) {
      const n = (h.nombre || h.usuario || 'Usuario').trim().split(/\s+/);
      return n.slice(0, 2).join(' ');
    },
    fechaCompleta(f) {
      return f ? new Date(f).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) : '';
    },
    haceCuanto(f) {
      if (!f) return '';
      const seg = Math.round((Date.now() - new Date(f).getTime()) / 1000);
      if (seg < 60) return 'hace un momento';
      const min = Math.round(seg / 60);
      if (min < 60) return `hace ${min} min`;
      const h = Math.round(min / 60);
      if (h < 24) return `hace ${h} h`;
      const d = Math.round(h / 24);
      if (d < 7) return d === 1 ? 'ayer' : `hace ${d} días`;
      return this.fechaCompleta(f);
    },
  },
};
</script>

<style scoped>
.hist-lista { list-style: none; margin: 0; padding: 0; position: relative; }
.hist-item { position: relative; display: flex; gap: 10px; padding-bottom: 12px; }
.hist-item:not(:last-child)::before {
  content: ''; position: absolute; left: 11px; top: 26px; bottom: 2px; width: 1.5px; background: var(--border);
}
.hist-icono {
  width: 24px; height: 24px; flex-shrink: 0; border-radius: 9999px;
  display: inline-flex; align-items: center; justify-content: center;
}
.hist-icono svg { width: 12px; height: 12px; }
.hist-texto {
  margin: 0; font-size: 12px; line-height: 1.35; color: var(--text);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.hist-texto strong { font-weight: 600; }
.hist-detalle { color: var(--text-muted); }
.hist-fecha { margin: 2px 0 0; font-size: 11px; color: var(--text-muted); }
.hist-creado { background: #e7f8ef; color: #15803d; }
.hist-editado { background: #e8f0ff; color: #1864ff; }
.hist-activado { background: #e7f8ef; color: #15803d; }
.hist-desactivado { background: #fdecec; color: #dc2626; }
.hist-posesion { background: #eef2ff; color: #4338ca; }
.hist-publicado { background: #fde4f4; color: #c0168f; }
.hist-borrador { background: #fff4d6; color: #a16207; }
.hist-destacado { background: #fff4d6; color: #ca8a04; }
.hist-no_destacado { background: #f1f2f5; color: #6b7280; }
.dark .hist-creado, .dark .hist-activado { background: rgba(34, 197, 94, 0.16); color: #86efac; }
.dark .hist-editado { background: rgba(24, 100, 255, 0.18); color: #93b4ff; }
.dark .hist-desactivado { background: rgba(239, 68, 68, 0.16); color: #fca5a5; }
.dark .hist-posesion { background: rgba(99, 102, 241, 0.18); color: #c7d2fe; }
.hist-mas {
  width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  margin-top: 2px; padding: 6px; border-radius: 8px; border: 0; cursor: pointer;
  background: transparent; color: var(--text-muted); font-size: 11.5px; font-weight: 600;
}
.hist-mas:hover { background: rgba(148, 163, 184, 0.12); color: var(--text); }
.hist-chevron { width: 14px; height: 14px; transition: transform 0.2s; }
.hist-chevron.girado { transform: rotate(180deg); }
.sk {
  display: block; border-radius: 6px;
  background: linear-gradient(90deg, var(--border) 0%, var(--bg-card) 50%, var(--border) 100%);
  background-size: 200% 100%; animation: sk-brillo 1.4s ease-in-out infinite; opacity: 0.7;
}
.sk.rounded-full { border-radius: 9999px; }
@keyframes sk-brillo { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
</style>
