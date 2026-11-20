<template>
  <div class="hist">
    <p class="hist-titulo">Historial de cambios</p>
    <p v-if="!items.length" class="hist-vacio">Sin cambios registrados desde el admin.</p>
    <ul v-else class="hist-lista">
      <li v-for="h in items" :key="h.ID">
        <div class="hist-linea">
          <strong>{{ accion(h.ACCION) }}</strong>
          <span v-if="h.DETALLE && h.ACCION === 'EDITADO'">: {{ h.DETALLE }}</span>
          <span class="hist-meta"> · {{ h.NOMBRE || h.USUARIO }} · {{ fecha(h.FECHA) }}</span>
          <button v-if="h.ANTERIOR" type="button" class="hist-ver" @click="abierto = abierto === h.ID ? null : h.ID">
            {{ abierto === h.ID ? 'Ocultar' : 'Ver lo anterior' }}
          </button>
        </div>
        <dl v-if="abierto === h.ID && h.ANTERIOR" class="hist-anterior">
          <template v-for="(v, k) in h.ANTERIOR" :key="k">
            <dt>{{ etiqueta(k) }}</dt>
            <dd>{{ v === null || v === '' ? '(vacío)' : v }}</dd>
          </template>
        </dl>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment';

const ETIQUETAS = {
  NUMERO: 'Número', SUMILLA: 'Sumilla', TEXTO: 'Texto', NOTAS: 'Notas', ESTADO: 'Estado',
  FUENTE: 'Fuente', FECHA_FUENTE: 'Fecha de la fuente',
  SIGLA: 'Sigla', SIGNIFICADO: 'Significado', CONTEXTO: 'Contexto', GRUPO: 'Grupo',
};
const ACCIONES = { CREADO: 'Creado', EDITADO: 'Editado', DESACTIVADO: 'Desactivado', ACTIVADO: 'Activado' };

export default {
  name: 'HistorialFuente',
  props: { items: { type: Array, default: () => [] } },
  data() { return { abierto: null }; },
  methods: {
    etiqueta(k) { return ETIQUETAS[k] || k; },
    accion(a) { return ACCIONES[a] || a; },
    fecha(f) { return f ? moment.utc(f).local().format('DD/MM/YYYY HH:mm') : ''; },
  },
};
</script>

<style scoped>
.hist { border-top: 1px solid var(--border); padding-top: 12px; }
.hist-titulo { margin: 0 0 6px; font-size: 13px; font-weight: 700; color: var(--text); }
.hist-vacio { margin: 0; font-size: 12px; color: var(--text-muted); }
.hist-lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; max-height: 220px; overflow-y: auto; }
.hist-linea { font-size: 12px; color: var(--text); line-height: 1.5; }
.hist-meta { color: var(--text-muted); }
.hist-ver { margin-left: 6px; font-size: 12px; font-weight: 600; color: #185CE6; background: none; border: 0; cursor: pointer; padding: 0; }
.hist-anterior { margin: 6px 0 2px; padding: 8px 10px; border-radius: 8px; background: var(--bg-sunken); font-size: 12px; }
.hist-anterior dt { font-weight: 700; color: var(--text-muted); margin-top: 4px; }
.hist-anterior dd { margin: 0; white-space: pre-wrap; color: var(--text); max-height: 160px; overflow-y: auto; }
</style>
