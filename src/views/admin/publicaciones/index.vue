<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Publicaciones" subtitle="Gestión del blog y sus categorías">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-4 flex flex-col gap-4">

      <!-- Filtros -->
      <SectionCard>
        <div class="flex flex-wrap items-center gap-3">
          <button v-if="active == 'categorias'" type="button" class="btn-volver" @click="active = 'articulos'">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Artículos
          </button>
          <span v-if="active == 'categorias'" class="text-sm font-bold" style="color:var(--text)">Categorías</span>
          <search-bar :key="active" class="flex-1 min-w-[240px]"
            :placeholder="active == 'articulos' ? 'Buscar por título...' : 'Buscar por descripción...'"
            @search="q => { filter.DESC = q || null; triggerSearch(); }"
          />
          <app-select v-model="filter.CDESTDO" @change="triggerSearch">
            <option :value="''">Todos los estados</option>
            <option value="A">{{ active == 'articulos' ? 'Publicado' : 'Activo' }}</option>
            <option v-if="active == 'articulos'" value="B">Borrador</option>
            <option value="I">Inactivo</option>
          </app-select>
          <search-button @click="triggerSearch" />
          <new-button :label="active == 'articulos' ? 'Crear' : 'Nueva categoría'" @click="onCrear" />
          <button v-if="active == 'articulos'" type="button" class="btn-ajustes" title="Gestionar categorías"
            aria-label="Gestionar categorías" @click="active = 'categorias'">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
        </div>
      </SectionCard>

      <!-- Artículos: lista o cuadrícula de tarjetas -->
      <div v-if="active == 'articulos'" class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-3 px-1">
          <p class="m-0 text-sm" style="color:var(--text-muted)">
            <template v-if="grid.isLoading">Cargando artículos…</template>
            <template v-else>
              <strong style="color:var(--text)">{{ grid.totalRows }}</strong> {{ grid.totalRows === 1 ? 'artículo' : 'artículos' }}
              <span v-if="grid.totalRows"> · mostrando {{ rangoInicio }}–{{ rangoFin }}</span>
            </template>
          </p>
          <div class="vista-toggle" role="group" aria-label="Tipo de vista">
            <button type="button" :class="{ activo: vista === 'lista' }" @click="cambiarVista('lista')" aria-label="Vista de lista" title="Lista">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <button type="button" :class="{ activo: vista === 'grid' }" @click="cambiarVista('grid')" aria-label="Vista de cuadrícula" title="Cuadrícula">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            </button>
          </div>
        </div>

        <!-- Esqueleto -->
        <div v-if="grid.isLoading" :class="vista === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'">
          <div v-for="n in (vista === 'grid' ? 6 : 5)" :key="n" :class="['art-card', vista === 'grid' ? 'flex flex-col overflow-hidden' : 'flex items-center gap-4 p-3']">
            <span :class="['sk', vista === 'grid' ? 'h-[150px] rounded-none' : 'w-[132px] h-[88px] rounded-xl flex-shrink-0']" />
            <div :class="['flex flex-col gap-2 flex-1', vista === 'grid' ? 'p-4' : '']">
              <span class="sk h-4 w-24 rounded-full" />
              <span class="sk h-5 w-3/4" />
              <span class="sk h-3 w-1/2" />
            </div>
          </div>
        </div>

        <!-- Vacío -->
        <div v-else-if="!dataArticulos.length" class="art-card flex flex-col items-center text-center gap-2 py-14 px-6">
          <div class="vacio-icono">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <h3 class="m-0 text-base font-bold" style="color:var(--text)">No hay artículos para mostrar</h3>
          <p class="m-0 text-sm" style="color:var(--text-muted)">Prueba con otro término o estado, o crea un artículo nuevo.</p>
          <button type="button" class="btn-primario mt-2" @click="onCrear">+ Crear artículo</button>
        </div>

        <!-- Lista -->
        <div v-else-if="vista === 'lista'" class="flex flex-col gap-3">
          <article v-for="(a, i) in dataArticulos" :key="a.ID" class="art-card art-fila group"
            v-motion :initial="{ opacity: 0, y: 8 }" :enter="{ opacity: 1, y: 0, transition: { duration: 260, delay: i * 30 } }">
            <div class="art-thumb" @click="editArticulo(a)">
              <img v-if="a.IMAGEN_URL" :src="a.IMAGEN_URL" :alt="a.TITULO" loading="lazy" />
              <svg v-else class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div class="flex-1 min-w-0 flex flex-col gap-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="chip-cat">{{ a.CATEGORIA_C }}</span>
                <span v-if="a.destacado" class="chip-destacado">★ Destacado</span>
                <span v-if="a.EDITANDO" class="chip-editando" :title="`${a.EDITANDO} está editando este artículo`">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Editando: {{ a.EDITANDO }}
                </span>
              </div>
              <h3 class="art-titulo" @click="editArticulo(a)">{{ a.TITULO }}</h3>
              <p v-if="a.resumen" class="art-resumen">{{ a.resumen }}</p>
              <div class="art-meta">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{{ a.FCHPUB_C }}</span>
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{{ a.TIEMPOLECTURA_C }}</span>
                <span class="hidden md:inline-flex"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>{{ a.autor || 'Equipo editorial' }}</span>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row items-end sm:items-center gap-3 flex-shrink-0">
              <span :class="['chip-estado', estadoClase(a.CDESTDO)]">{{ estadoLabel(a.CDESTDO) }}</span>
              <div class="flex items-center gap-1.5">
                <a v-if="a.CDESTDO === 'A'" :href="`/publicaciones/${a.slug}`" target="_blank" rel="noopener" class="accion" title="Ver en el sitio" aria-label="Ver en el sitio">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </a>
                <button type="button" :class="['accion accion-estrella', { activa: a.destacado }]"
                  :title="a.destacado ? 'Quitar destacado' : (a.CDESTDO === 'A' ? 'Marcar como destacado' : 'Solo se destacan artículos publicados')"
                  :aria-label="a.destacado ? 'Quitar destacado' : 'Marcar como destacado'"
                  :disabled="destacando === a.ID || (!a.destacado && a.CDESTDO !== 'A')" @click="alternarDestacado(a)">
                  <svg viewBox="0 0 24 24" :fill="a.destacado ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
                <button type="button" class="accion" title="Duplicar como borrador" aria-label="Duplicar" :disabled="duplicando === a.ID" @click="duplicar(a)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
                <button type="button" class="accion" title="Historial de cambios" aria-label="Historial de cambios" @click="verHistorial(a)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 106 5.3L3 8"/><polyline points="12 7 12 12 15 14"/></svg>
                </button>
                <button type="button" class="accion" title="Editar" aria-label="Editar" @click="editArticulo(a)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button v-if="a.CDESTDO !== 'B'" type="button" class="accion peligro" :title="a.CDESTDO === 'A' ? 'Desactivar' : 'Activar'" :aria-label="a.CDESTDO === 'A' ? 'Desactivar' : 'Activar'" @click="pedirToggle(a)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Cuadrícula -->
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article v-for="(a, i) in dataArticulos" :key="a.ID" class="art-card group flex flex-col overflow-hidden"
            v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 280, delay: i * 35 } }">
            <div class="relative h-[150px] overflow-hidden cursor-pointer art-thumb-grid" @click="editArticulo(a)">
              <img v-if="a.IMAGEN_URL" :src="a.IMAGEN_URL" :alt="a.TITULO" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <span :class="['chip-estado absolute top-3 left-3', estadoClase(a.CDESTDO)]">{{ estadoLabel(a.CDESTDO) }}</span>
              <span v-if="a.destacado" class="chip-destacado absolute top-3 right-3">★ Destacado</span>
            </div>
            <div class="p-4 flex flex-col gap-2 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="chip-cat">{{ a.CATEGORIA_C }}</span>
                <span v-if="a.EDITANDO" class="chip-editando" :title="`${a.EDITANDO} está editando este artículo`">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Editando: {{ a.EDITANDO }}
                </span>
              </div>
              <h3 class="art-titulo" @click="editArticulo(a)">{{ a.TITULO }}</h3>
              <div class="art-meta mt-auto">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{{ a.FCHPUB_C }}</span>
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{{ a.TIEMPOLECTURA_C }}</span>
              </div>
            </div>
            <div class="flex items-center justify-end gap-1.5 px-4 py-3" style="border-top:1px solid var(--border)">
              <a v-if="a.CDESTDO === 'A'" :href="`/publicaciones/${a.slug}`" target="_blank" rel="noopener" class="accion" title="Ver en el sitio" aria-label="Ver en el sitio">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </a>
              <button type="button" :class="['accion accion-estrella', { activa: a.destacado }]"
                  :title="a.destacado ? 'Quitar destacado' : (a.CDESTDO === 'A' ? 'Marcar como destacado' : 'Solo se destacan artículos publicados')"
                  :aria-label="a.destacado ? 'Quitar destacado' : 'Marcar como destacado'"
                  :disabled="destacando === a.ID || (!a.destacado && a.CDESTDO !== 'A')" @click="alternarDestacado(a)">
                  <svg viewBox="0 0 24 24" :fill="a.destacado ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
                <button type="button" class="accion" title="Duplicar como borrador" aria-label="Duplicar" :disabled="duplicando === a.ID" @click="duplicar(a)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
                <button type="button" class="accion" title="Historial de cambios" aria-label="Historial de cambios" @click="verHistorial(a)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 106 5.3L3 8"/><polyline points="12 7 12 12 15 14"/></svg>
                </button>
                <button type="button" class="accion" title="Editar" aria-label="Editar" @click="editArticulo(a)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button v-if="a.CDESTDO !== 'B'" type="button" class="accion peligro" :title="a.CDESTDO === 'A' ? 'Desactivar' : 'Activar'" :aria-label="a.CDESTDO === 'A' ? 'Desactivar' : 'Activar'" @click="pedirToggle(a)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
              </button>
            </div>
          </article>
        </div>

        <!-- Paginación -->
        <div v-if="!grid.isLoading && grid.totalRows > 0" class="flex flex-wrap items-center justify-between gap-3 px-1 pt-1">
          <label class="flex items-center gap-2 text-sm" style="color:var(--text-muted)">
            Mostrar
            <select v-model.number="grid.perPage" class="pag-select" @change="searchArticulos(1, grid.perPage)">
              <option v-for="n in [6, 12, 24, 48]" :key="n" :value="n">{{ n }}</option>
            </select>
            por página
          </label>
          <div v-if="totalPaginas > 1" class="flex items-center gap-1.5">
            <button type="button" class="pag-btn" :disabled="grid.currentPage === 1" @click="irAPagina(grid.currentPage - 1)" aria-label="Anterior">‹</button>
            <button v-for="n in totalPaginas" :key="n" type="button" :class="['pag-btn', { activo: n === grid.currentPage }]" @click="irAPagina(n)">{{ n }}</button>
            <button type="button" class="pag-btn" :disabled="grid.currentPage === totalPaginas" @click="irAPagina(grid.currentPage + 1)" aria-label="Siguiente">›</button>
          </div>
        </div>
      </div>

      <data-table v-if="active == 'categorias'" :search="searchCategorias" :fields="fieldsCategorias" :items="dataCategorias" :grid="grid" :actions="actionsCategorias"/>
    </div>

    <!-- Historial de cambios de un artículo -->
    <BaseModal v-model="historial.show" :title="historial.titulo ? `Historial · ${historial.titulo}` : 'Historial de cambios'" size="md">
      <div class="max-h-[60vh] overflow-y-auto pr-1">
        <HistorialPublicacion v-if="historial.show && historial.id" :id-publicacion="historial.id" />
      </div>
    </BaseModal>

    <!-- Modal categoría (crear/editar) -->
    <ModalPublicacionCategoria :show="modalCategoria.show" :data="modalCategoria.data"
      :close="() => modalCategoria.show = false"
      :update="() => searchCategorias(grid.currentPage, grid.perPage)"/>

    <ModalEliminar message="¿Está seguro de cambiar el estado de este registro?" buttonOk="Sí, cambiar"
      :action="toggleArticulo" :openDelete="modalEliminarArticulo.show"
      :closeHandler="() => modalEliminarArticulo.show = false"/>
    <ModalEliminar message="¿Está seguro de cambiar el estado de esta categoría?" buttonOk="Sí, cambiar"
      :action="toggleCategoria" :openDelete="modalEliminarCategoria.show"
      :closeHandler="() => modalEliminarCategoria.show = false"/>
  </section>
</template>

<script>
import DataTable from "@/components/Tables/DataTable.vue";
import { toast } from 'vue3-toastify';
import ModalEliminar from "../shared/ModalEliminar.vue";
import ModalPublicacionCategoria from "./modals/ModalPublicacionCategoria.vue";
import HistorialPublicacion from "@/components/Publicaciones/HistorialPublicacion.vue";
import PublicacionesProxy from "@/proxies/PublicacionesProxy";
import moment from 'moment';
import { urlDeMedia } from '@/utils/mediaUrl';

const VISTA_KEY = 'admin-publicaciones-vista';
function leerVista() {
  try { return localStorage.getItem(VISTA_KEY) === 'grid' ? 'grid' : 'lista'; } catch { return 'lista'; }
}

export default {
  components: { DataTable, ModalEliminar, ModalPublicacionCategoria, HistorialPublicacion },
  data() {
    return {
      active: 'articulos',
      dataArticulos: [], dataCategorias: [],
      grid: { items: [], currentPage: 1, perPage: 12, totalRows: 0, isLoading: true, pageOptions: [5,10,15,50] },
      fieldsArticulos: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'TITULO', label: 'Título' },
        { key: 'CATEGORIA_C', label: 'Categoría', class: 'text-left' },
        { key: 'DESTACADO_C', label: 'Destacado', class: 'text-center w-100' },
        { key: 'TIEMPOLECTURA_C', label: 'Lectura', class: 'text-center w-100' },
        { key: 'FCHPUB_C', label: 'Publicación', class: 'text-center w-130' },
        { key: 'CDESTDO', label: 'Estado', class: 'text-center w-130' },
        { key: 'ACCIONES', label: 'Acciones', class: 'text-center w-130' },
      ],
      actionsArticulos: {
        edit:   { label: 'Editar',  icon: 'fas fa-edit',  class: 'btn-edit',   action: null },
        delete: { label: 'Cambiar estado', icon: 'fas fa-trash', class: 'btn-delete', action: null },
      },
      fieldsCategorias: [
        { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'CDESTDO', label: 'Estado', class: 'text-center w-130' },
        { key: 'ACCIONES', label: 'Acciones', class: 'text-center w-130' },
      ],
      actionsCategorias: {
        edit:   { label: 'Editar',  icon: 'fas fa-edit',  class: 'btn-edit',   action: null },
        delete: { label: 'Cambiar estado', icon: 'fas fa-trash', class: 'btn-delete', action: null },
      },
      modalCategoria:        { show: false, data: null },
      modalEliminarArticulo:  { show: false, data: null },
      modalEliminarCategoria: { show: false, data: null },
      filter: { DESC: null, CDESTDO: '' },
      vista: leerVista(),
      historial: { show: false, id: null, titulo: '' },
      duplicando: null,
      destacando: null,
    };
  },
  computed: {
    totalPaginas() { return Math.max(1, Math.ceil(this.grid.totalRows / this.grid.perPage)); },
    rangoInicio() { return (this.grid.currentPage - 1) * this.grid.perPage + 1; },
    rangoFin() { return Math.min(this.grid.totalRows, this.grid.currentPage * this.grid.perPage); },
  },
  methods: {
    cambiarVista(v) {
      this.vista = v;
      try { localStorage.setItem(VISTA_KEY, v); } catch { /* sin almacenamiento */ }
    },
    irAPagina(n) {
      if (n < 1 || n > this.totalPaginas || n === this.grid.currentPage) return;
      this.searchArticulos(n, this.grid.perPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    estadoLabel(e) { return { A: 'Publicado', B: 'Borrador' }[e] || 'Inactivo'; },
    estadoClase(e) { return { A: 'activo', B: 'borrador' }[e] || 'inactivo'; },
    // Solo hay un destacado: al marcar uno, el anterior pierde la estrella (se recarga la página actual)
    async alternarDestacado(a) {
      this.destacando = a.ID;
      try {
        const r = await PublicacionesProxy.destacar(a.ID, !a.destacado);
        const res = r?.DATA ?? r;
        if (!res?.STATUS) throw new Error(res?.MESSAGE);
        if (res.MESSAGE) toast.success(a.destacado ? 'Se quitó el destacado' : 'Ahora es el artículo destacado', { toastId: 'destacado' });
        await this.searchArticulos(this.grid.currentPage, this.grid.perPage);
      } catch (e) {
        toast.error(e?.message || 'No se pudo cambiar el destacado');
      } finally {
        this.destacando = null;
      }
    },
    async duplicar(a) {
      this.duplicando = a.ID;
      try {
        const r = await PublicacionesProxy.duplicar(a.ID);
        const res = r?.DATA ?? r;
        if (!res?.STATUS) throw new Error(res?.MESSAGE);
        toast.success('Artículo duplicado como borrador');
        this.$router.push(`/admin/publicaciones/${res.ID}/editar`);
      } catch (e) {
        toast.error(e?.message || 'No se pudo duplicar el artículo');
      } finally {
        this.duplicando = null;
      }
    },
    verHistorial(a) {
      this.historial = { show: true, id: a.ID, titulo: a.TITULO };
    },
    pedirToggle(a) {
      this.modalEliminarArticulo.data = a;
      this.modalEliminarArticulo.show = true;
    },
    triggerSearch() {
      if (this.active == 'articulos') this.searchArticulos(1, this.grid.perPage);
      else this.searchCategorias(1, this.grid.perPage);
    },
    fmtFecha(f) {
      if (!f) return '—';
      try { return moment.utc(f).local().format('DD/MM/YYYY'); } catch { return '—'; }
    },
    async loadCategoriasMap() {
      if (this.categoriasMap) return this.categoriasMap;
      const r = await PublicacionesProxy.listCategorias({ ROWS: 1000, INIT: 0 });
      const payload = r?.DATA ?? r;
      const rows = payload?.data ?? [];
      this.categoriasMap = new Map(rows.map(c => [Number(c.id ?? c.ID), c.descripcion ?? c.DESCRIPCION]));
      return this.categoriasMap;
    },
    async searchArticulos(currentPage, perPage) {
      this.grid.isLoading = true;
      this.grid.currentPage = currentPage;
      this.grid.perPage = perPage;
      const categoriasMap = await this.loadCategoriasMap();
      // Quién está editando cada artículo (si falla, la lista se muestra igual)
      const editando = new Map();
      try {
        const rb = await PublicacionesProxy.bloqueos();
        (rb?.DATA ?? rb ?? []).forEach(b => editando.set(Number(b.id), b.nombre));
      } catch { /* sin datos de bloqueo */ }
      await PublicacionesProxy.list({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.DESC||null, CESTDO: this.filter?.CDESTDO||null })
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = payload?.data ?? [];
          const total = payload?.total ?? 0;
          this.dataArticulos = rows.map((u, i) => ({
            ...u,
            RN: i + 1 + (currentPage - 1) * perPage,
            ID: u.id ?? u.ID,
            TITULO: u.titulo || '—',
            IMAGEN_URL: urlDeMedia(u.imagen),
            EDITANDO: editando.get(Number(u.id ?? u.ID)) || null,
            CATEGORIA_C: categoriasMap.get(Number(u.idCategoria)) || 'Sin categoría',
            DESTACADO_C: u.destacado ? '⭐ Sí' : '—',
            TIEMPOLECTURA_C: `${u.tiempoLectura || 1} min de lectura`,
            FCHPUB_C: u.fechaPublicacion ? this.fmtFecha(u.fechaPublicacion) : 'Sin fecha',
            CDESTDO: u.estado || u.CDESTDO || 'I',
          }));
          this.grid.totalRows = total;
        })
        .catch(err => { this.dataArticulos = []; toast.error(err?.MESSAGE||'Error al cargar las publicaciones', { toastId: 'error-publicaciones' }); })
        .finally(() => this.grid.isLoading = false);
    },
    async searchCategorias(currentPage, perPage) {
      this.grid.isLoading = true;
      await PublicacionesProxy.listCategorias({ ROWS: perPage, INIT: (currentPage-1)*perPage, DESC: this.filter?.DESC||null, CESTDO: this.filter?.CDESTDO||null })
        .then(r => {
          const payload = r?.DATA ?? r;
          const rows = payload?.data ?? [];
          const total = payload?.total ?? 0;
          this.dataCategorias = rows.map((u, i) => ({
            ...u,
            RN: i + 1 + (currentPage - 1) * perPage,
            ID: u.id ?? u.ID,
            CDESTDO: u.estado || u.CDESTDO || 'I',
          }));
          this.grid.totalRows = total;
          this.categoriasMap = null; // invalida el caché simple para que refleje cambios
        })
        .catch(err => { this.dataCategorias = []; toast.error(err?.MESSAGE||'Error al cargar las categorías', { toastId: 'error-categorias' }); })
        .finally(() => this.grid.isLoading = false);
    },
    onCrear() {
      if (this.active == 'articulos') this.$router.push('/admin/publicaciones/nuevo');
      else { this.modalCategoria.data = null; this.modalCategoria.show = true; }
    },
    editArticulo(data) { this.$router.push(`/admin/publicaciones/${data.ID}/editar`); },
    async toggleArticulo() {
      const id = this.modalEliminarArticulo.data?.ID;
      if (!id) return toast.warning('No se encontró el ID', { toastId: 'warning-toggle' });
      await PublicacionesProxy.toggle(id)
        .then(r => {
          const result = r?.DATA ?? r;
          if (result.STATUS) { toast.success(result.MESSAGE || 'Estado actualizado', { toastId: 'success-toggle' }); this.searchArticulos(this.grid.currentPage, this.grid.perPage); this.modalEliminarArticulo.show = false; }
          else toast.error(result.MESSAGE, { toastId: 'error-toggle' });
        })
        .catch(err => toast.error(err?.MESSAGE||'Error', { toastId: 'error-toggle' }));
    },
    editCategoria(data) { this.modalCategoria.data = data; this.modalCategoria.show = true; },
    async toggleCategoria() {
      const id = this.modalEliminarCategoria.data?.ID;
      if (!id) return toast.warning('No se encontró el ID', { toastId: 'warning-toggle-cat' });
      await PublicacionesProxy.toggleCategoria(id)
        .then(r => {
          const result = r?.DATA ?? r;
          if (result.STATUS) { toast.success(result.MESSAGE || 'Estado actualizado', { toastId: 'success-toggle-cat' }); this.searchCategorias(this.grid.currentPage, this.grid.perPage); this.modalEliminarCategoria.show = false; }
          else toast.error(result.MESSAGE, { toastId: 'error-toggle-cat' });
        })
        .catch(err => toast.error(err?.MESSAGE||'Error', { toastId: 'error-toggle-cat' }));
    },
  },
  mounted() {
    this.actionsArticulos = { ...this.actionsArticulos,
      edit:   { ...this.actionsArticulos.edit,   action: d => this.editArticulo(d) },
      delete: { ...this.actionsArticulos.delete, action: d => { this.modalEliminarArticulo.show = true; this.modalEliminarArticulo.data = d; } },
    };
    this.actionsCategorias = { ...this.actionsCategorias,
      edit:   { ...this.actionsCategorias.edit,   action: d => this.editCategoria(d) },
      delete: { ...this.actionsCategorias.delete, action: d => { this.modalEliminarCategoria.show = true; this.modalEliminarCategoria.data = d; } },
    };
    this.searchArticulos(this.grid.currentPage, this.grid.perPage);
  },
  watch: {
    active(v) {
      this.filter = { DESC: null, CDESTDO: '' };
      this.grid = { ...this.grid, perPage: v == 'articulos' ? 12 : 10, currentPage: 1 };
      if (v == 'articulos') this.searchArticulos(1, this.grid.perPage);
      else this.searchCategorias(1, this.grid.perPage);
    },
  },
};
</script>

<style scoped>
.art-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.art-card:hover { box-shadow: 0 10px 26px rgba(110, 60, 230, 0.10); border-color: rgba(124, 92, 255, 0.28); }
.art-fila { display: flex; align-items: center; gap: 18px; padding: 12px 16px 12px 12px; }

.art-thumb {
  width: 132px; height: 88px; flex-shrink: 0; border-radius: 12px; overflow: hidden; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, rgba(231, 31, 179, 0.10), rgba(24, 100, 255, 0.10)); color: rgba(24, 100, 255, 0.45);
}
.art-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.art-fila:hover .art-thumb img { transform: scale(1.06); }
.art-thumb-grid { background: linear-gradient(135deg, rgba(231, 31, 179, 0.10), rgba(24, 100, 255, 0.10)); color: rgba(24, 100, 255, 0.45); }

.art-titulo {
  margin: 0; font-size: 0.98rem; font-weight: 700; line-height: 1.35; color: var(--text); cursor: pointer;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.art-titulo:hover { color: #6d3fe0; }
.art-resumen {
  margin: 0; font-size: 0.82rem; color: var(--text-muted);
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.art-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; font-size: 0.78rem; color: var(--text-muted); }
.art-meta span { display: inline-flex; align-items: center; gap: 5px; }
.art-meta svg { width: 14px; height: 14px; }

.chip-cat {
  display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px;
  background: #ede6fd; color: #6d3fe0; font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
}
.dark .chip-cat { background: rgba(124, 92, 255, 0.18); color: #c4b2ff; }
.chip-destacado {
  display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px;
  background: #fff4d6; color: #a16207; font-size: 11px; font-weight: 700;
}
.dark .chip-destacado { background: rgba(234, 179, 8, 0.18); color: #fcd34d; }
.chip-editando {
  display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px;
  background: #eef2ff; color: #4338ca; font-size: 11px; font-weight: 700;
}
.chip-editando svg { width: 12px; height: 12px; }
.dark .chip-editando { background: rgba(99, 102, 241, 0.18); color: #c7d2fe; }
.chip-estado {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 9999px;
  font-size: 11.5px; font-weight: 700;
}
.chip-estado::before { content: ''; width: 6px; height: 6px; border-radius: 9999px; background: currentColor; }
.chip-estado.activo { background: #e7f8ef; color: #15803d; }
.chip-estado.inactivo { background: #f1f2f5; color: #6b7280; }
.chip-estado.borrador { background: #fff4d6; color: #a16207; }
.dark .chip-estado.borrador { background: rgba(234, 179, 8, 0.18); color: #fcd34d; }
.dark .chip-estado.activo { background: rgba(34, 197, 94, 0.16); color: #86efac; }
.dark .chip-estado.inactivo { background: rgba(148, 163, 184, 0.16); color: #cbd5e1; }

.accion {
  width: 34px; height: 34px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); background: var(--bg-card); color: var(--text-muted);
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.accion svg { width: 16px; height: 16px; }
.accion:disabled { opacity: 0.4; cursor: not-allowed; }
.accion-estrella:hover:not(:disabled) { background: rgba(234, 179, 8, 0.1); color: #ca8a04; border-color: rgba(234, 179, 8, 0.45); }
.accion-estrella.activa { background: #fff4d6; color: #ca8a04; border-color: rgba(234, 179, 8, 0.45); }
.dark .accion-estrella.activa { background: rgba(234, 179, 8, 0.18); color: #fcd34d; }
.accion:hover { background: rgba(24, 100, 255, 0.08); color: #1864ff; border-color: rgba(24, 100, 255, 0.35); }
.accion.peligro:hover { background: rgba(239, 68, 68, 0.08); color: #dc2626; border-color: rgba(239, 68, 68, 0.35); }

.btn-ajustes {
  width: 42px; height: 42px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); background: var(--bg-card); color: var(--text-muted);
  transition: color 0.2s, border-color 0.2s, transform 0.4s;
}
.btn-ajustes:hover { color: #6d3fe0; border-color: rgba(124, 92, 255, 0.45); }
.btn-ajustes:hover svg { transform: rotate(60deg); }
.btn-ajustes svg { transition: transform 0.4s; }
.btn-volver {
  display: inline-flex; align-items: center; gap: 4px; padding: 8px 12px 8px 8px; border-radius: 10px;
  font-size: 13.5px; font-weight: 600; color: #1864ff; background: rgba(24, 100, 255, 0.08);
}
.btn-volver:hover { background: rgba(24, 100, 255, 0.14); }

.vista-toggle { display: inline-flex; padding: 3px; border-radius: 10px; background: var(--bg-card); border: 1px solid var(--border); }
.vista-toggle button { width: 34px; height: 30px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; color: var(--text-muted); }
.vista-toggle button.activo { background: rgba(24, 100, 255, 0.1); color: #1864ff; }

.vacio-icono { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: #ede6fd; color: #6d3fe0; }
.btn-primario { padding: 9px 18px; border-radius: 10px; background: linear-gradient(135deg, #e71fb3, #1864ff); color: #fff; font-size: 13.5px; font-weight: 600; }

.pag-select { padding: 5px 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text); font-size: 13px; }
.pag-btn {
  min-width: 34px; height: 34px; padding: 0 8px; border-radius: 10px; font-size: 13.5px; font-weight: 600;
  border: 1px solid var(--border); background: var(--bg-card); color: var(--text);
}
.pag-btn:hover:not(:disabled):not(.activo) { border-color: rgba(24, 100, 255, 0.4); color: #1864ff; }
.pag-btn.activo { background: linear-gradient(135deg, #e71fb3, #1864ff); color: #fff; border-color: transparent; }
.pag-btn:disabled { opacity: 0.4; cursor: default; }

/* Esqueleto de carga */
.sk {
  display: block; border-radius: 6px;
  background: linear-gradient(90deg, var(--border) 0%, var(--bg-card) 50%, var(--border) 100%);
  background-size: 200% 100%; animation: sk-brillo 1.4s ease-in-out infinite; opacity: 0.7;
}
.sk.rounded-full { border-radius: 9999px; }
.sk.rounded-xl { border-radius: 12px; }
.sk.rounded-none { border-radius: 0; }
@keyframes sk-brillo { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

@media (max-width: 640px) {
  .art-fila { flex-wrap: wrap; }
  .art-thumb { width: 96px; height: 68px; }
}
</style>
