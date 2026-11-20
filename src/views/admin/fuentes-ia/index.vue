<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Fuentes de la IA" subtitle="Normas y siglas que usa la búsqueda con IA">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          <path d="M9 7h7M9 11h5"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-4 flex flex-col gap-4">

      <!-- Resumen -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div v-for="n in resumen.normas" :key="n.codigo" class="fia-card">
          <p class="fia-card-titulo">{{ n.nombre }}</p>
          <p class="fia-card-num">{{ fmt(n.activos) }} <span>artículos</span></p>
          <p class="fia-card-det">Art. {{ n.desde }} al {{ n.hasta }} · {{ fmt(n.vigentes) }} vigentes · {{ fmt(n.modificados) }} modificados · {{ fmt(n.derogados) }} derogados</p>
          <p v-for="f in n.fuentes" :key="f.fuente" class="fia-card-fuente" :title="f.fuente">
            Art. {{ f.desde }}–{{ f.hasta }}: {{ f.fuente }}
          </p>
        </div>
        <div class="fia-card">
          <p class="fia-card-titulo">Glosario de siglas</p>
          <p class="fia-card-num">{{ fmt(resumen.glosario.activas) }} <span>siglas</span></p>
          <p class="fia-card-det">La IA las usa para entender consultas como "UIF", "RPPJ" o "PJ".</p>
        </div>
        <div class="fia-card">
          <p class="fia-card-titulo">Resoluciones</p>
          <p class="fia-card-num">{{ fmt(resumen.resoluciones.indexadas) }} <span>preparadas</span></p>
          <p class="fia-card-det">Resoluciones de la base listas para la búsqueda por significado. Se gestionan en Resoluciones.</p>
        </div>
      </div>

      <!-- Estado de la IA -->
      <SectionCard>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="m-0 text-sm" style="color:var(--text)">
            <strong>La IA está usando</strong> {{ fmt(resumen.ia.articulos) }} artículos y {{ fmt(resumen.ia.siglas) }} siglas
            <span v-if="resumen.ia.articulosCargadosEn" style="color:var(--text-muted)"> · actualizada el {{ fecha(resumen.ia.articulosCargadosEn) }}</span>
            <br><span class="text-xs" style="color:var(--text-muted)">Cada cambio se aplica al guardarlo. Usa "Generar actualización" si algo no se refleja.</span>
          </p>
          <button type="button" class="fia-btn-actualizar" :disabled="recargando" @click="recargar">
            <svg class="w-4 h-4" :class="{ 'animate-spin': recargando }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>
            {{ recargando ? 'Actualizando…' : 'Generar actualización' }}
          </button>
        </div>
      </SectionCard>

      <!-- Pestañas -->
      <div class="fia-tabs" role="tablist">
        <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id"
          :class="['fia-tab', { 'fia-tab-activa': tab === t.id }]" @click="cambiarTab(t.id)">{{ t.nombre }}</button>
      </div>

      <SectionCard>
        <div class="flex flex-wrap items-center gap-3">
          <search-bar :key="tab" class="flex-1 min-w-[240px]"
            :placeholder="tab === 'SIGLAS' ? 'Buscar sigla o significado…' : 'Buscar por número (387), sumilla o texto…'"
            @search="q => { filtro.q = q || ''; buscar(); }" />
          <app-select v-if="tab !== 'SIGLAS'" v-model="filtro.estado" aria-label="Estado" @change="buscar">
            <option value="">Todos</option>
            <option value="vigente">Vigentes</option>
            <option value="modificado">Modificados</option>
            <option value="derogado">Derogados</option>
            <option value="inactivo">Desactivados</option>
          </app-select>
          <app-select v-else v-model="filtro.grupo" aria-label="Grupo" @change="buscar">
            <option value="">Todos los grupos</option>
            <option v-for="g in grupos" :key="g" :value="g">{{ g }}</option>
          </app-select>
          <search-button @click="buscar" />
          <new-button :label="tab === 'SIGLAS' ? 'Nueva sigla' : 'Nuevo artículo'" @click="nuevo" />
        </div>
      </SectionCard>

      <data-table v-if="tab !== 'SIGLAS'" :key="'art-' + tab" :search="buscarArticulos" :fields="camposArticulos"
        :items="articulos" :grid="grid" :actions="accionesArticulos" emptyText="No hay artículos con ese filtro" />
      <data-table v-else key="siglas" :search="buscarSiglas" :fields="camposSiglas"
        :items="siglasPagina" :grid="grid" :actions="accionesSiglas" emptyText="No hay siglas con ese filtro" />

      <!-- Últimos cambios -->
      <SectionCard v-if="resumen.ultimosCambios.length">
        <p class="m-0 mb-2 text-sm font-bold" style="color:var(--text)">Últimos cambios</p>
        <ul class="fia-cambios">
          <li v-for="c in resumen.ultimosCambios" :key="c.ID">
            <strong>{{ c.REGISTRO || '—' }}</strong> · {{ accion(c.ACCION) }}<span v-if="c.ACCION === 'EDITADO' && c.DETALLE">: {{ c.DETALLE }}</span>
            <span style="color:var(--text-muted)"> · {{ c.NOMBRE }} · {{ fecha(c.FECHA) }}</span>
          </li>
        </ul>
      </SectionCard>
    </div>

    <ModalArticulo :show="modalArticulo.show" :codigo="tab === 'SIGLAS' ? 'CP' : tab" :id="modalArticulo.id"
      :close="() => modalArticulo.show = false" :update="alGuardar" />
    <ModalSigla :show="modalSigla.show" :data="modalSigla.data" :grupos="grupos"
      :close="() => modalSigla.show = false" :update="alGuardar" />
    <ModalEliminar :message="confirmar.mensaje" buttonOk="Sí, cambiar" :action="cambiarEstado"
      :openDelete="confirmar.show" :closeHandler="() => confirmar.show = false" />
  </section>
</template>

<script>
import DataTable from '@/components/Tables/DataTable.vue';
import ModalEliminar from '../shared/ModalEliminar.vue';
import ModalArticulo from './ModalArticulo.vue';
import ModalSigla from './ModalSigla.vue';
import FuentesIaProxy from '@/proxies/FuentesIaProxy';
import { toast } from 'vue3-toastify';
import moment from 'moment';

const ESTADOS = { vigente: 'Vigente', modificado: 'Modificado', derogado: 'Derogado' };
const ACCIONES = { CREADO: 'Creado', EDITADO: 'Editado', DESACTIVADO: 'Desactivado', ACTIVADO: 'Activado' };
const sinTildes = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default {
  name: 'FuentesIA',
  components: { DataTable, ModalEliminar, ModalArticulo, ModalSigla },
  data() {
    return {
      tabs: [
        { id: 'CP', nombre: 'Código Penal' },
        { id: 'NCPP', nombre: 'Código Procesal Penal' },
        { id: 'SIGLAS', nombre: 'Glosario de siglas' },
      ],
      tab: 'CP',
      resumen: { normas: [], glosario: {}, resoluciones: {}, ia: {}, ultimosCambios: [] },
      recargando: false,
      filtro: { q: '', estado: '', grupo: '' },
      grid: { items: [], currentPage: 1, perPage: 20, totalRows: 0, isLoading: true, pageOptions: [20, 50, 100] },
      articulos: [],
      siglas: [],
      siglasPagina: [],
      camposArticulos: [
        { key: 'NUMERO_C', label: 'Artículo', class: 'w-24 font-semibold' },
        { key: 'SUMILLA_C', label: 'Sumilla' },
        { key: 'ESTADO_C', label: 'Estado', class: 'w-28' },
        { key: 'EDITADO_C', label: 'Última edición', class: 'w-48 text-xs' },
        { key: 'CDESTDO', label: 'En la IA', class: 'text-center w-28' },
        { key: 'ACCIONES', label: 'Acciones', class: 'text-center w-28' },
      ],
      camposSiglas: [
        { key: 'SIGLA', label: 'Sigla', class: 'w-40 font-semibold' },
        { key: 'SIGNIFICADO', label: 'Significado' },
        { key: 'CONTEXTO_C', label: 'Cuándo aplica' },
        { key: 'GRUPO_C', label: 'Grupo', class: 'w-40 text-xs' },
        { key: 'CDESTDO', label: 'En la IA', class: 'text-center w-28' },
        { key: 'ACCIONES', label: 'Acciones', class: 'text-center w-28' },
      ],
      accionesArticulos: {
        edit:   { label: 'Ver / editar', action: d => { this.modalArticulo.id = d.ID; this.modalArticulo.show = true; } },
        delete: { label: 'Activar / desactivar', action: d => this.pedirCambio('ARTICULO', d) },
      },
      accionesSiglas: {
        edit:   { label: 'Editar', action: d => { this.modalSigla.data = d; this.modalSigla.show = true; } },
        delete: { label: 'Activar / desactivar', action: d => this.pedirCambio('SIGLA', d) },
      },
      modalArticulo: { show: false, id: null },
      modalSigla: { show: false, data: null },
      confirmar: { show: false, tipo: null, id: null, mensaje: '' },
    };
  },
  computed: {
    grupos() {
      return [...new Set(this.siglas.map(s => s.GRUPO).filter(Boolean))];
    },
  },
  mounted() {
    this.cargarResumen();
  },
  methods: {
    fmt(n) { return n === null || n === undefined ? '—' : new Intl.NumberFormat('es-PE').format(n); },
    fecha(f) { return f ? moment.utc(f).local().format('DD/MM/YYYY HH:mm') : ''; },
    accion(a) { return ACCIONES[a] || a; },
    async cargarResumen() {
      try {
        const r = await FuentesIaProxy.resumen();
        this.resumen = r?.DATA ?? r;
      } catch {
        toast.error('No se pudo cargar el resumen', { toastId: 'error-fia-resumen' });
      }
    },
    async recargar() {
      this.recargando = true;
      try {
        const r = await FuentesIaProxy.recargar();
        const res = r?.DATA ?? r;
        toast.success(res?.MESSAGE || 'IA actualizada');
        await this.cargarResumen();
      } catch (e) {
        toast.error(e?.MESSAGE || 'No se pudo actualizar la IA');
      } finally {
        this.recargando = false;
      }
    },
    cambiarTab(t) {
      if (this.tab === t) return;
      this.tab = t;
      this.filtro = { q: '', estado: '', grupo: '' };
      this.grid.currentPage = 1;
    },
    buscar() {
      if (this.tab === 'SIGLAS') this.buscarSiglas(1, this.grid.perPage, true);
      else this.buscarArticulos(1, this.grid.perPage);
    },
    nuevo() {
      if (this.tab === 'SIGLAS') { this.modalSigla.data = null; this.modalSigla.show = true; }
      else { this.modalArticulo.id = null; this.modalArticulo.show = true; }
    },
    alGuardar() {
      this.cargarResumen();
      if (this.tab === 'SIGLAS') this.buscarSiglas(this.grid.currentPage, this.grid.perPage, true);
      else this.buscarArticulos(this.grid.currentPage, this.grid.perPage);
    },
    async buscarArticulos(currentPage, perPage) {
      this.grid.isLoading = true;
      this.grid.currentPage = currentPage;
      this.grid.perPage = perPage;
      try {
        const r = await FuentesIaProxy.listarArticulos({
          codigo: this.tab, q: this.filtro.q || undefined, estado: this.filtro.estado || undefined,
          INIT: (currentPage - 1) * perPage, ROWS: perPage,
        });
        const payload = r?.DATA ?? r;
        this.articulos = (payload?.data ?? []).map(a => ({
          ...a,
          NUMERO_C: `Art. ${a.NUMERO}`,
          SUMILLA_C: a.SUMILLA || (a.EXTRACTO ? `${a.EXTRACTO}…` : '—'),
          ESTADO_C: ESTADOS[a.ESTADO] || a.ESTADO,
          EDITADO_C: a.USUARIO ? `${a.USUARIO} · ${moment.utc(a.FECHA).local().format('DD/MM/YYYY')}` : '—',
        }));
        this.grid.totalRows = payload?.total ?? 0;
      } catch (e) {
        this.articulos = [];
        toast.error(e?.MESSAGE || 'No se pudieron cargar los artículos', { toastId: 'error-fia-articulos' });
      } finally {
        this.grid.isLoading = false;
      }
    },
    // Son pocas (≈90): se traen todas y se filtran y paginan aquí
    async buscarSiglas(currentPage, perPage, recargar = false) {
      this.grid.isLoading = true;
      this.grid.currentPage = currentPage;
      this.grid.perPage = perPage;
      try {
        if (recargar || !this.siglas.length) {
          const r = await FuentesIaProxy.listarSiglas();
          this.siglas = r?.DATA ?? r ?? [];
        }
        const q = sinTildes(this.filtro.q);
        const filtradas = this.siglas.filter(s =>
          (!this.filtro.grupo || s.GRUPO === this.filtro.grupo) &&
          (!q || sinTildes(`${s.SIGLA} ${s.SIGNIFICADO} ${s.CONTEXTO || ''}`).includes(q)));
        this.grid.totalRows = filtradas.length;
        this.siglasPagina = filtradas.slice((currentPage - 1) * perPage, currentPage * perPage).map(s => ({
          ...s, CONTEXTO_C: s.CONTEXTO || '—', GRUPO_C: s.GRUPO || '—',
        }));
      } catch (e) {
        this.siglasPagina = [];
        toast.error(e?.MESSAGE || 'No se pudo cargar el glosario', { toastId: 'error-fia-siglas' });
      } finally {
        this.grid.isLoading = false;
      }
    },
    pedirCambio(tipo, d) {
      const activo = d.CDESTDO === 'A';
      const nombre = tipo === 'SIGLA' ? `la sigla "${d.SIGLA}"` : `el artículo ${d.NUMERO}`;
      this.confirmar = {
        show: true, tipo, id: d.ID,
        mensaje: activo
          ? `¿Desactivar ${nombre}? La IA dejará de usarlo hasta que lo vuelvas a activar.`
          : `¿Activar ${nombre}? La IA volverá a usarlo.`,
      };
    },
    async cambiarEstado() {
      const { tipo, id } = this.confirmar;
      try {
        const r = tipo === 'SIGLA' ? await FuentesIaProxy.toggleSigla(id) : await FuentesIaProxy.toggleArticulo(id);
        const res = r?.DATA ?? r;
        if (res?.STATUS) toast.success(res.MESSAGE || 'Estado actualizado');
        else toast.error(res?.MESSAGE || 'No se pudo cambiar el estado');
        this.confirmar.show = false;
        this.alGuardar();
      } catch (e) {
        toast.error(e?.MESSAGE || 'No se pudo cambiar el estado');
      }
    },
  },
};
</script>

<style scoped>
.fia-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; min-width: 0; }
.fia-card-titulo { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: .02em; text-transform: uppercase; color: var(--text-muted); }
.fia-card-num { margin: 4px 0 2px; font-size: 26px; font-weight: 800; color: var(--text); line-height: 1.2; }
.fia-card-num span { font-size: 13px; font-weight: 600; color: var(--text-muted); }
.fia-card-det { margin: 0; font-size: 12px; line-height: 1.45; color: var(--text-muted); }
.fia-card-fuente { margin: 6px 0 0; font-size: 11px; line-height: 1.4; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.fia-btn-actualizar {
  display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 10px; border: 0; cursor: pointer;
  font-size: 14px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #DF2DB2, #185CE6);
}
.fia-btn-actualizar:disabled { opacity: .6; cursor: default; }
.fia-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.fia-tab {
  padding: 8px 14px; border-radius: 999px; border: 1px solid var(--border); background: var(--bg-card);
  color: var(--text); font-size: 14px; font-weight: 600; cursor: pointer;
}
.fia-tab-activa { background: #185CE6; border-color: #185CE6; color: #fff; }
.fia-cambios { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text); }
</style>
