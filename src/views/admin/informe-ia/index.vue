<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">
    <PageHeader title="Errores de la búsqueda con IA" subtitle="Comprobación manual: valida o rechaza cada error reportado" />

    <div class="max-w-6xl mx-auto px-4 pt-4 flex flex-col gap-3">
      <SectionCard>
        <div class="flex flex-wrap items-center gap-3">
          <app-select v-model="filtros.estado" aria-label="Estado">
            <option value="">Todos ({{ errores.length }})</option>
            <option value="pendiente">Pendientes ({{ cuenta.pendiente }})</option>
            <option value="O">Validados ({{ cuenta.O }})</option>
            <option value="F">Rechazados ({{ cuenta.F }})</option>
          </app-select>
          <app-select v-model="filtros.informe" aria-label="Informe">
            <option value="">Todos los informes</option>
            <option v-for="i in informes" :key="i" :value="i">{{ i }}</option>
          </app-select>
          <input v-model="filtros.texto" type="search" class="input-base err-buscar" placeholder="Buscar…" />
          <span class="err-resumen">
            <span class="err-ok">{{ cuenta.O }} validados</span> ·
            <span class="err-mal">{{ cuenta.F }} rechazados</span> ·
            {{ cuenta.pendiente }} pendientes
          </span>
        </div>
      </SectionCard>

      <ul class="err-lista">
        <li v-for="e in filtrados" :key="e.id" :class="['err-item', clase(e.id)]">
          <div class="err-datos">
            <div class="err-cab">
              <span class="err-id">{{ e.id }}</span>
              <span class="err-informe">{{ e.informe }}</span>
            </div>
            <p class="err-consulta">{{ e.consulta }}</p>
            <p class="err-linea"><span class="err-tag err-tag--antes">Antes</span>{{ e.antes }}</p>
            <p class="err-linea"><span class="err-tag err-tag--ahora">Ahora<template v-if="e.fecha"> · {{ e.fecha }}</template></span>{{ e.ahora }}</p>
          </div>
          <div class="err-acciones">
            <textarea v-model="notas[e.id]" rows="2" maxlength="1000" class="input-base err-nota" placeholder="Nota"
              @blur="guardarNota(e.id)" />
            <div class="err-botones">
              <button type="button" :class="['err-btn', 'err-btn--ok', { activo: estado(e.id) === 'O' }]" :aria-pressed="estado(e.id) === 'O'" @click="marcar(e.id, 'O')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                Validar
              </button>
              <button type="button" :class="['err-btn', 'err-btn--mal', { activo: estado(e.id) === 'F' }]" :aria-pressed="estado(e.id) === 'F'" @click="marcar(e.id, 'F')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Rechazar
              </button>
            </div>
            <span v-if="revision[e.id]" class="err-firma">{{ revision[e.id].usuario || '—' }} · {{ fecha(revision[e.id].fecha) }}</span>
          </div>
        </li>
      </ul>
      <p v-if="!filtrados.length" class="err-vacio">Ningún error coincide con los filtros.</p>
    </div>
  </section>
</template>

<script>
import datos from '@/data/informeBusquedaIA.json';
import AiInformeProxy from '@/proxies/AiInformeProxy';
import { toast } from 'vue3-toastify';

// Lista de errores reportados en los informes de la búsqueda con IA, para comprobarlos a mano.
// Validar = ya funciona bien; Rechazar = sigue fallando. Se guarda en JURIS.AI_INFORME_REVISION.
export default {
  name: 'ErroresBusquedaIA',
  data() {
    return {
      errores: datos.errores,
      revision: {},
      notas: {},
      filtros: { estado: '', informe: '', texto: '' },
    };
  },
  computed: {
    informes() { return [...new Set(this.errores.map(e => e.informe))]; },
    cuenta() {
      const c = { O: 0, F: 0, pendiente: 0 };
      this.errores.forEach(e => { const s = this.estado(e.id); if (s) c[s]++; else c.pendiente++; });
      return c;
    },
    filtrados() {
      const { estado, informe, texto } = this.filtros;
      const t = texto.trim().toLowerCase();
      return this.errores.filter(e => {
        const s = this.estado(e.id);
        if (estado === 'pendiente' && s) return false;
        if ((estado === 'O' || estado === 'F') && s !== estado) return false;
        if (informe && e.informe !== informe) return false;
        if (t && !`${e.id} ${e.consulta} ${e.antes} ${e.ahora} ${this.notas[e.id] || ''}`.toLowerCase().includes(t)) return false;
        return true;
      });
    },
  },
  methods: {
    estado(id) { return this.revision[id]?.estado || ''; },
    clase(id) { const s = this.estado(id); return s === 'O' ? 'err-item--ok' : s === 'F' ? 'err-item--mal' : ''; },
    fecha(f) { try { return new Date(f).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }); } catch { return ''; } },
    async cargar() {
      try {
        const r = await AiInformeProxy.listar();
        const mapa = {}, notas = {};
        (r?.DATA ?? r ?? []).forEach(f => { mapa[f.caso] = f; notas[f.caso] = f.nota || ''; });
        this.revision = mapa;
        this.notas = notas;
      } catch {
        toast.error('No se pudo cargar la comprobación', { toastId: 'err-cargar' });
      }
    },
    // Pulsar de nuevo el mismo botón quita la marca (vuelve a pendiente)
    marcar(id, estado) { this.guardar(id, this.estado(id) === estado ? '' : estado); },
    // La nota se guarda junto con la marca; si ya está marcado, al salir del campo
    guardarNota(id) {
      const actual = this.revision[id];
      if (actual && (actual.nota || '') !== (this.notas[id] || '')) this.guardar(id, actual.estado);
    },
    async guardar(id, estado) {
      try {
        const r = await AiInformeProxy.guardar(id, { ESTADO: estado, NOTA: this.notas[id] || '' });
        const res = r?.DATA ?? r;
        if (res && res.STATUS === false) throw new Error(res.MESSAGE);
        const copia = { ...this.revision };
        if (estado) copia[id] = { caso: id, estado, nota: this.notas[id] || '', usuario: 'tú', fecha: new Date().toISOString() };
        else delete copia[id];
        this.revision = copia;
      } catch (e) {
        toast.error(e?.message || 'No se pudo guardar', { toastId: 'err-guardar' });
      }
    },
  },
  mounted() { this.cargar(); },
};
</script>

<style scoped>
.err-buscar { flex: 1; min-width: 200px; }
.err-resumen { font-size: 13px; color: var(--text-muted); }
.err-ok { color: #15803d; font-weight: 700; }
.err-mal { color: #b91c1c; font-weight: 700; }
.dark .err-ok { color: #4ade80; }
.dark .err-mal { color: #f87171; }

.err-lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.err-item {
  display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 16px; align-items: start;
  padding: 12px 14px; border: 1px solid var(--border); border-left: 4px solid var(--border); border-radius: 12px; background: var(--bg-card);
}
@media (max-width: 760px) { .err-item { grid-template-columns: 1fr; } }
.err-item--ok { border-left-color: #16a34a; }
.err-item--mal { border-left-color: #dc2626; }
.err-cab { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.err-id { padding: 1px 7px; border-radius: 6px; font-size: 12px; font-weight: 800; color: #1864ff; background: rgba(24, 100, 255, 0.08); }
.err-informe { font-size: 11.5px; font-weight: 600; color: var(--text-muted); }
.err-consulta { margin: 0; font-size: 14px; font-weight: 700; line-height: 1.35; color: var(--text); }
.err-linea { margin: 5px 0 0; font-size: 13px; line-height: 1.45; color: var(--text); }
.err-tag {
  display: inline-block; margin-right: 8px; padding: 0 7px; border-radius: 5px; font-size: 10.5px; font-weight: 800;
  letter-spacing: .02em; text-transform: uppercase; vertical-align: 1px;
}
.err-tag--antes { color: #b91c1c; background: rgba(220, 38, 38, 0.09); }
.err-tag--ahora { color: #1864ff; background: rgba(24, 100, 255, 0.09); }
.dark .err-tag--antes { color: #fca5a5; background: rgba(248, 113, 113, 0.15); }
.dark .err-tag--ahora { color: #93b4ff; background: rgba(99, 102, 241, 0.2); }
.err-acciones { display: flex; flex-direction: column; gap: 6px; }
.err-nota { width: 100%; min-height: 54px; resize: vertical; font-size: 12.5px; line-height: 1.4; }
.err-botones { display: flex; gap: 6px; }
.err-btn {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px;
  border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card); color: var(--text);
  font-size: 12.5px; font-weight: 700; cursor: pointer;
}
.err-btn svg { width: 14px; height: 14px; }
.err-btn--ok:not(.activo):hover { color: #15803d; border-color: rgba(22, 163, 74, 0.5); }
.err-btn--mal:not(.activo):hover { color: #b91c1c; border-color: rgba(220, 38, 38, 0.5); }
.err-btn--ok.activo { color: #fff; background: #16a34a; border-color: #16a34a; }
.err-btn--mal.activo { color: #fff; background: #dc2626; border-color: #dc2626; }
.err-firma { font-size: 11px; color: var(--text-muted); text-align: right; }
.err-vacio { margin: 0; padding: 30px; text-align: center; color: var(--text-muted); }
</style>
