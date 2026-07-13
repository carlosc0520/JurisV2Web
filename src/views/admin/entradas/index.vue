<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)" @click="showDropdownIngresar = false; showDropdownExportar = false">

    <PageHeader title="Entradas" subtitle="Gestión de jurisprudencia y legislación">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col gap-4">

      <!-- Tabs -->
      <div class="flex gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <button v-for="tab in tabs" :key="tab.id" @click="updateActive(tab.id)"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border-2',
            active === tab.id
              ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue border-brand-blue'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-blue hover:border-blue-200']">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="tab.icon"/>
          {{ tab.label }}
        </button>
      </div>

      <!-- Filtros -->
      <SectionCard>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Título</label>
            <input type="text" v-model="selectedFilter.name" class="input-base" placeholder="Buscar por título..." />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">
              {{ active === 'jurisprudences' ? 'Título alternativo' : 'Denominación oficial' }}
            </label>
            <input type="text" v-model="selectedFilter.RTITLE" class="input-base" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">
              {{ active === 'jurisprudences' ? 'Fecha de resolución' : 'Fecha de publicación' }}
            </label>
            <input type="date" v-model="selectedFilter.FRESOLUTION" class="input-base" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Fecha de Ingreso</label>
            <input type="date" v-model="selectedFilter.FCRCN" class="input-base" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Tema</label>
            <input type="text" v-model="selectedFilter.TEMA" class="input-base" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Tipo de entrada</label>
            <app-select v-model="selectedFilter.BLOG" full-width>
              <option :value="''">-- Seleccione</option>
              <option value="common">Común</option>
              <option value="emblematic">Emblemático</option>
              <option value="executive">Ejecutivo</option>
            </app-select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Estado</label>
            <app-select v-model="selectedFilter.CDESTDO" full-width>
              <option :value="''">-- Seleccione</option>
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </app-select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Ordenar por</label>
            <div class="flex gap-1.5">
              <app-select v-model="selectedFilter.SORT" full-width>
                <option value="FCRCN">Fecha de ingreso</option>
                <option value="FRESOLUTION">Fecha de resolución</option>
                <option value="TITLE">Título</option>
                <option value="RTITLE">Título alternativo</option>
                <option value="BLOG">Tipo de entrada</option>
                <option value="CDESTDO">Estado</option>
                <option value="FEDCN">Fecha de edición</option>
              </app-select>
              <button type="button" @click="selectedFilter.DIR = selectedFilter.DIR === 'ASC' ? 'DESC' : 'ASC'"
                class="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-semibold text-slate-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors select-none"
                :title="selectedFilter.DIR === 'ASC' ? 'Ascendente' : 'Descendente'">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <template v-if="selectedFilter.DIR === 'ASC'">
                    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                  </template>
                  <template v-else>
                    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                  </template>
                </svg>
                {{ selectedFilter.DIR }}
              </button>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-200 dark:border-gray-700">
          <SearchButton @click="getEntries(grid.currentPage, grid.perPage)" />

          <!-- Ingresar: jurisprudencia dropdown, legislación simple -->
          <div v-if="active === 'jurisprudences'" class="relative" @click.stop>
            <NewButton label="Ingresar" @click="showDropdownIngresar = !showDropdownIngresar; showDropdownExportar = false" />
            <div v-show="showDropdownIngresar" class="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-modal border border-slate-100 dark:border-gray-700 p-1.5 min-w-[200px]">
              <div @click="showDropdownIngresar = false; openModalAgregar('common')"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 cursor-pointer hover:bg-purple-50 hover:text-purple-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Jurisprudencia Común
              </div>
              <div @click="showDropdownIngresar = false; openModalAgregar('emblematic')"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 cursor-pointer hover:bg-purple-50 hover:text-purple-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Jurisprudencia Emblemático
              </div>
            </div>
          </div>
          <NewButton v-else label="Ingresar" @click="openModalAgregar('executive')" />

          <!-- Exportar dropdown -->
          <!-- <div class="relative" @click.stop>
            <ExportButton @click="showDropdownExportar = !showDropdownExportar; showDropdownIngresar = false" />
            <div v-show="showDropdownExportar" class="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-modal border border-slate-100 dark:border-gray-700 p-1.5 min-w-[200px]">
              <div @click="showDropdownExportar = false; onClickExportar(1)"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Resumen Ejecutivo
              </div>
              <div @click="showDropdownExportar = false; onClickExportar(2)"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                Resoluciones
              </div>
              <div @click="showDropdownExportar = false; onClickExportar(3)"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                Exportar Pág.
              </div>
            </div>
          </div> -->

          <!-- Botón exportar entradas JSON (oculto a pedido) -->
          <button v-if="false" @click="exportEntradasJson" :disabled="exportJsonLoading"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors shadow-sm">
            <svg v-if="exportJsonLoading" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {{ exportJsonLoading ? 'Exportando...' : 'Exportar JSON' }}
          </button>

          <!-- Botón de migración S3 → Hostinger (oculto a pedido) -->
          <button v-if="false" @click="openMigration"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            Migrar S3 → Hostinger
          </button>

          <!-- Indicador de estado de filtros -->
          <div v-if="isLoadingFilters" class="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-700 select-none">
            <div class="w-3 h-3 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin flex-shrink-0"></div>
            Cargando filtros...
          </div>

        </div>
      </SectionCard>

      <!-- Tablas -->
        <data-table v-if="active === 'jurisprudences'" :active="active" title="Entradas de Jurisprudencias"
          :search="getEntries" :fields="fields" :items="data" :grid="grid" :actions="actions"
          :deleteRole="role.IDR == 0"/>
        <data-table v-if="active === 'legislations'" :active="active" title="Entradas de Legislación"
          :search="getEntries" :fields="fields.filter(f => f.key !== 'TEMA')" :items="data" :grid="grid"
          :actions="actions" :deleteRole="role.IDR == 0"/>

    </div>

    <!-- Cargando datos de edición overlay -->
    <div v-if="isLoadingEdit" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fade-in">
      <div class="bg-white dark:bg-gray-900 rounded-2xl px-16 py-12 text-center shadow-modal animate-scale-in">
        <div class="w-14 h-14 mx-auto mb-5 rounded-full border-4 border-slate-200 border-t-blue-500 border-r-brand-pink animate-spin"></div>
        <p class="text-lg font-bold text-brand-gradient mb-1">Cargando entrada...</p>
        <p class="text-sm text-slate-500">Preparando formulario de edición</p>
      </div>
    </div>

<ModalAgregarEntradaComun :role="role" :show="modalEntradaComun.show"
      :close="() => modalEntradaComun.show = false"
      :update="() => getEntries(grid.currentPage, grid.perPage)" :selects="selects"/>

    <ModalEditarEntradaComun :role="role" :show="modalEditarEntradaComun.show"
      :close="() => modalEditarEntradaComun.show = false"
      :update="() => getEntries(grid.currentPage, grid.perPage)"
      :selects="selects" :data="modalEditarEntradaComun.data"/>

    <ModalAgregarEntradaEmble :role="role" :show="modalAgregarEntradaEmble.show"
      :close="() => modalAgregarEntradaEmble.show = false"
      :update="() => getEntries(grid.currentPage, grid.perPage)" :selects="selects"/>

    <ModalEditarEntradaEmble :role="role" :show="modalEditarEntradaEmble.show"
      :close="() => modalEditarEntradaEmble.show = false"
      :update="() => getEntries(grid.currentPage, grid.perPage)"
      :selects="selects" :data="modalEditarEntradaEmble.data"/>

    <ModalAgregarEntradalegislacion :role="role" :show="modalAgregarEntradalegislacion.show"
      :close="() => modalAgregarEntradalegislacion.show = false"
      :update="() => getEntries(grid.currentPage, grid.perPage)" :selects="selects"/>

    <ModalEditarEntradaLegislacion :role="role" :show="modalEditarEntradalegislacion.show"
      :close="() => modalEditarEntradalegislacion.show = false"
      :update="() => getEntries(grid.currentPage, grid.perPage)"
      :selects="selects" :data="modalEditarEntradalegislacion.data"/>

    <ModalEliminar :role="role" message="¿Está seguro de cambiar el estado de este registro?"
      buttonOk="Si, cambiar" :action="deleteRow" :openDelete="modalEliminar.show"
      :closeHandler="() => modalEliminar.show = false"/>

    <!-- Modal: Descarga ZIP S3 -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="s3Zip.show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="s3Zip.show = false">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-sky-500 to-blue-600">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-white font-bold text-base">Descargar ZIP de S3</h3>
                  <p class="text-sky-200 text-xs">Con estructura de carpetas original</p>
                </div>
              </div>
              <button @click="s3Zip.show = false" class="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="px-6 py-5 flex flex-col gap-4">
              <!-- Selector de prefijo -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-600 dark:text-gray-400">Carpeta a descargar</label>
                <select v-model="s3Zip.prefix" class="input-base text-sm">
                  <option value="">Todas (jurisprudences/ + legislations/)</option>
                  <option value="jurisprudences/">Solo jurisprudences/</option>
                  <option value="legislations/">Solo legislations/</option>
                </select>
              </div>

              <!-- Advertencia -->
              <div class="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700 rounded-xl p-3 flex items-start gap-2">
                <svg class="flex-shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p class="text-xs text-sky-700 dark:text-sky-300">
                  El servidor listará y empaquetará todos los archivos de S3 con la misma estructura de carpetas. Puede tardar varios minutos. El archivo ZIP puede ser grande (varios GB).
                </p>
              </div>

              <!-- Progreso -->
              <div v-if="s3Zip.loading" class="flex flex-col gap-2">
                <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                  <div class="w-4 h-4 rounded-full border-2 border-slate-200 border-t-sky-500 animate-spin flex-shrink-0"></div>
                  <span>{{ s3Zip.status }}</span>
                </div>
                <div v-if="s3Zip.downloaded > 0" class="text-xs text-sky-600 dark:text-sky-400 font-mono">
                  {{ (s3Zip.downloaded / 1024 / 1024).toFixed(1) }} MB descargados
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-gray-700">
                <button @click="s3Zip.show = false" :disabled="s3Zip.loading"
                  class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors">
                  Cerrar
                </button>
                <button @click="startS3ZipDownload" :disabled="s3Zip.loading"
                  class="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2">
                  <div v-if="s3Zip.loading" class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {{ s3Zip.loading ? 'Generando...' : 'Descargar ZIP' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Modal: Migración S3 → Hostinger -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="migration.show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="closeMigration">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col gap-0 overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-violet-600 to-purple-700">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-white font-bold text-base leading-tight">Migración S3 → Hostinger</h3>
                  <p class="text-violet-200 text-xs">Archivos de JURIS.ENTRADA</p>
                </div>
              </div>
              <button @click="closeMigration" class="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="px-6 py-5 flex flex-col gap-4">

              <!-- Preview / antes de iniciar -->
              <div v-if="migration.status === 'idle'" class="flex flex-col gap-4">
                <div v-if="migration.loading" class="flex items-center gap-2 text-sm text-slate-500">
                  <div class="w-4 h-4 rounded-full border-2 border-slate-200 border-t-violet-600 animate-spin"></div>
                  Consultando registros pendientes...
                </div>
                <div v-else class="grid grid-cols-3 gap-3">
                  <div class="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 text-center border border-violet-100 dark:border-violet-800">
                    <p class="text-2xl font-bold text-violet-700 dark:text-violet-300">{{ migration.preview.total }}</p>
                    <p class="text-xs text-violet-500 dark:text-violet-400 mt-0.5">Total entradas activas</p>
                  </div>
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800">
                    <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">{{ migration.preview.withFile }}</p>
                    <p class="text-xs text-blue-500 dark:text-blue-400 mt-0.5">ENTRIEFILE en AWS</p>
                  </div>
                  <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center border border-emerald-100 dark:border-emerald-800">
                    <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{{ migration.preview.withResumen }}</p>
                    <p class="text-xs text-emerald-500 dark:text-emerald-400 mt-0.5">ENTRIEFILERESUMEN en AWS</p>
                  </div>
                </div>
                <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 flex items-start gap-2">
                  <svg class="flex-shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <p class="text-xs text-amber-700 dark:text-amber-300">
                    Este proceso descargará cada archivo de AWS S3 y lo subirá al servidor Hostinger vía FTP. Puede tardar varios minutos dependiendo de la cantidad de archivos. No cierres esta ventana mientras está en progreso.
                  </p>
                </div>
                <div class="flex justify-end gap-2">
                  <button @click="closeMigration" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg transition-colors">Cancelar</button>
                  <button @click="startMigration" :disabled="migration.loading || (migration.preview.withFile === 0 && migration.preview.withResumen === 0)"
                    class="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Iniciar migración
                  </button>
                </div>
              </div>

              <!-- En progreso / terminado -->
              <div v-else class="flex flex-col gap-4">
                <!-- Progress bar -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-semibold text-slate-600 dark:text-gray-400">
                      {{ migration.processed }} de {{ migration.total }} archivos
                    </span>
                    <span class="text-xs font-bold text-violet-600 dark:text-violet-400">{{ migration.percent }}%</span>
                  </div>
                  <div class="h-2.5 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="migration.status === 'error' ? 'bg-red-500' : migration.status === 'done' ? 'bg-emerald-500' : 'bg-violet-500'"
                      :style="{ width: migration.percent + '%' }">
                    </div>
                  </div>
                </div>

                <!-- Status badges -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                    :class="migration.status === 'running' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                           : migration.status === 'done'    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                           : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'">
                    <span v-if="migration.status === 'running'" class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                    <span v-else-if="migration.status === 'done'" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span v-else class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {{ migration.status === 'running' ? 'En progreso' : migration.status === 'done' ? 'Completado' : 'Error' }}
                  </span>
                  <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                    ✓ {{ migration.done }} OK
                  </span>
                  <span v-if="migration.errors > 0" class="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">
                    ✗ {{ migration.errors }} error{{ migration.errors !== 1 ? 'es' : '' }}
                  </span>
                </div>

                <!-- Current file -->
                <div class="bg-slate-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-slate-100 dark:border-gray-700 min-h-[36px]">
                  <p class="text-xs text-slate-500 dark:text-gray-400 truncate font-mono">{{ migration.currentFile }}</p>
                </div>

                <!-- Actions when done -->
                <div v-if="migration.status === 'done' || migration.status === 'error'" class="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-gray-700">
                  <button @click="closeMigration" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg transition-colors">Cerrar</button>
                  <button @click="downloadMissingZip" :disabled="migration.zipLoading"
                    class="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2">
                    <svg v-if="migration.zipLoading" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
                    {{ migration.zipLoading ? 'Generando ZIP...' : 'ZIP Faltantes' }}
                  </button>
                  <button v-if="migration.status === 'done'" @click="downloadMigrationExcel"
                    class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Descargar Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Modal: S3 sin BD (huérfanos) -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="orphan.show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="closeOrphanScan">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <h3 class="text-white font-bold text-base">Archivos S3 sin registro en BD</h3>
                  <p class="text-orange-100 text-xs">Comparando S3 vs JURIS.ENTRADA</p>
                </div>
              </div>
              <button @click="closeOrphanScan" class="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-5 flex flex-col gap-4">
              <!-- Fase actual -->
              <div class="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                <svg v-if="orphan.status === 'running'" class="animate-spin shrink-0 text-orange-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <svg v-else-if="orphan.status === 'done'" class="shrink-0 text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <svg v-else class="shrink-0 text-red-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <p class="text-sm text-gray-700 dark:text-gray-200 font-medium">{{ orphan.phase || 'Iniciando...' }}</p>
              </div>

              <!-- Stats -->
              <div v-if="orphan.s3Total > 0 || orphan.dbCount > 0" class="grid grid-cols-3 gap-3">
                <div class="text-center p-3 rounded-xl bg-slate-50 dark:bg-gray-800">
                  <p class="text-xl font-bold text-orange-600">{{ orphan.s3Juris.toLocaleString() }}</p>
                  <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">jurisprudences/</p>
                </div>
                <div class="text-center p-3 rounded-xl bg-slate-50 dark:bg-gray-800">
                  <p class="text-xl font-bold text-orange-600">{{ orphan.s3Legis.toLocaleString() }}</p>
                  <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">legislations/</p>
                </div>
                <div class="text-center p-3 rounded-xl bg-slate-50 dark:bg-gray-800">
                  <p class="text-xl font-bold text-blue-600">{{ orphan.dbCount.toLocaleString() }}</p>
                  <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Entradas AWS en BD</p>
                </div>
              </div>

              <!-- Resultado final -->
              <div v-if="orphan.status === 'done'" class="text-center p-4 rounded-xl" :class="orphan.orphanCount > 0 ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'">
                <p class="text-3xl font-bold" :class="orphan.orphanCount > 0 ? 'text-red-600' : 'text-emerald-600'">{{ orphan.orphanCount.toLocaleString() }}</p>
                <p class="text-sm mt-1" :class="orphan.orphanCount > 0 ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'">
                  {{ orphan.orphanCount > 0 ? 'archivos en S3 sin registro en BD' : '¡Todo S3 está en la BD!' }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-gray-700">
                <button @click="closeOrphanScan" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 rounded-lg transition-colors">Cerrar</button>
                <button v-if="orphan.status === 'done' && orphan.orphanCount > 0" @click="downloadOrphanZip"
                  class="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18"/></svg>
                  Descargar ZIP ({{ orphan.orphanCount }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </section>
</template>

<script>
import DataTable from "@/components/Tables/DataTable.vue";
import { toast } from 'vue3-toastify';
import adminEntriesProxy from "@/proxies/AdminEntriesProxy.js";
import MagistradoProxy from "@/proxies/Magistrados.Proxy";
import filterProxy from "@/proxies/FilterProxy.js";
import createPDFHelper from "@/assets/helpers/generatePdfHelper.js";
import FileMigrationProxy from "@/proxies/FileMigrationProxy.js";

import ModalAgregarEntradaComun from "./modals/ModalAgregarEntradaComun.vue";
import ModalEditarEntradaComun from "./modals/ModalEditarEntradaComun.vue";
import ModalAgregarEntradaEmble from "./modals/ModalAgregarEntradaEmble.vue";
import ModalEditarEntradaEmble from "./modals/ModalEditarEntradaEmble.vue";
import ModalAgregarEntradalegislacion from "./modals/ModalAgregarEntradaLegislacion.vue";
import ModalEditarEntradaLegislacion from "./modals/ModalEditarEntradaLegislacion.vue";
import ModalEliminar from "../shared/ModalEliminar.vue";

export default {
  components: {
    DataTable,
    ModalAgregarEntradaComun, ModalEditarEntradaComun,
    ModalAgregarEntradaEmble, ModalEditarEntradaEmble,
    ModalAgregarEntradalegislacion, ModalEditarEntradaLegislacion,
    ModalEliminar,
  },
  props: { role: { type: Object, default: () => ({}) } },
  data() {
    return {
      tabs: [
        { id: 'jurisprudences', label: 'Jurisprudencia', icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
        { id: 'legislations',   label: 'Legislación',   icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' },
      ],
      active: 'jurisprudences',
      data: [],
      grid: { items: [], currentPage: 1, perPage: 10, totalRows: 120, isLoading: true, pageOptions: [5,10,15,50] },
      fields: [
        { key: 'RN', label: '' },
        { key: 'FRESOLUTION', label: 'Publicación', sortable: true,
          formatter: v => v ? v.split('T')[0].split('-').reverse().join('/') : '' },
        { key: 'TITLE', label: 'Título', class: 'w-130', sortable: true },
        { key: 'RTITLE', label: 'Título alternativo', class: 'text-left', sortable: true,
          formatter: v => [null, undefined, 'null'].includes(v) ? '' : v },
        { key: 'TEMA', label: 'Tema' },
        { key: 'BLOG', label: 'Tipo de entrada', sortable: true, class: 'text-center w-130' },
        { key: 'FCRCN', label: 'Fecha de Ingreso', sortable: true, class: 'text-center w-130' },
        { key: 'UCRCN', label: 'U. Creación', sortable: true, class: 'text-center w-130' },
        { key: 'FEDCN', label: 'Fecha de Edición', sortable: true, class: 'text-center w-130' },
        { key: 'UEDCN', label: 'U. Edición', sortable: true, class: 'text-center w-130' },
        { key: 'CDESTDO', label: 'Estado', sortable: true, class: 'text-center w-130' },
        { key: 'ACCIONES', label: 'Acciones', class: 'text-center w-130' },
      ],
      actions: {
        edit:     { label: 'Editar',    icon: 'fas fa-edit',     class: 'btn-edit',     action: null },
        delete:   { label: 'Eliminar',  icon: 'fas fa-trash',    class: 'btn-delete',   action: null },
        download: {
          label: 'Descargar', icon: 'fas fa-download', class: 'btn-download', action: null, loadingId: null,
          dropdown: {
            label: 'Descargar',
            items: {
              'RESOLUCIÓN':   { label: 'RESOLUCIÓN',   icon: 'fas fa-file-pdf',  action: null },
              'DOC. RESUMEN': { label: 'DOC. RESUMEN', icon: 'fas fa-file-word', action: null },
              'PDF. RESUMEN': { label: 'PDF. RESUMEN', icon: 'fas fa-file-word', action: null },
            }
          }
        }
      },
      selectedFilter: { name: null, CDESTDO: 'A', BLOG: '', FRESOLUTION: null, TEMA: null, RTITLE: null, FCRCN: null, SORT: 'TITLE', DIR: 'ASC' },
      modalEntradaComun:          { show: false, data: null },
      modalEditarEntradaComun:    { show: false, data: null },
      modalAgregarEntradaEmble:   { show: false, data: null },
      modalEditarEntradaEmble:    { show: false, data: null },
      modalAgregarEntradalegislacion: { show: false, data: null },
      modalEditarEntradalegislacion:  { show: false, data: null },
      modalEliminar: { show: false, data: null },
      selects: { magistrados: [], ambitos: [], jurisdiccionales: [], delitos: [], recursos: [], materias: [], jurisdicion: [], jurisdicionV: [], tiponorma: [], organismos: [] },
      filtersLoaded: false,
      isLoadingFilters: false,
      isLoadingEdit: false,
      isLoading: false,
      showDropdownIngresar: false,
      showDropdownExportar: false,
      exportJsonLoading: false,
      orphan: {
        show: false,
        jobId: null,
        status: 'idle',
        phase: '',
        s3Total: 0,
        s3Juris: 0,
        s3Legis: 0,
        dbCount: 0,
        orphanCount: 0,
        _pollTimer: null,
      },
      s3Zip: {
        show: false,
        loading: false,
        prefix: '',
        status: 'Preparando descarga...',
        downloaded: 0,
      },
      migration: {
        show: false,
        loading: false,
        zipLoading: false,
        status: 'idle',
        jobId: null,
        total: 0,
        processed: 0,
        percent: 0,
        currentFile: '',
        done: 0,
        errors: 0,
        _pollTimer: null,
        preview: { total: 0, withFile: 0, withResumen: 0 },
      },
    };
  },
  methods: {
    mapEntry(e) {
      return {
        ID: e.id, TITLE: e.titulo, RTITLE: e.rTitle, ISBINDING: e.isBinding,
        AMBIT: e.ambit, FRESOLUTION: e.fResolution, OJURISDICCIONAL: e.oJurisdiccional,
        MAGISTRATES: e.magistrates, VDESIDENTE: e.vDesidente, CVOTE: e.cVote,
        ENTRIEFILE: e.entrieFile, ENTRIEFILERESUMEN: e.entrieFileResumen,
        KEYWORDS: e.keywords, TEMA: e.tema, SUBTEMA: e.subtema,
        SHORTSUMMARY: e.shortSummary, RESUMEN: e.resumen, RESUMEN2: e.resumen2,
        TYPE: e.type, BLOG: e.blog, CASO: e.caso, TPONRMA: e.tpoNrma,
        NMRCN: e.nmRcn, DELITO: e.delito, RECURSO: e.recurso, MATERIA: e.materia,
        OEMISOR: e.oEmisor, JURISDICCION: e.jurisdiccion, FLGDOC: e.flgDoc,
        JURISDICCIONV: e.jurisdiccionV, SITUACION: e.situacion, IDSVIN: e.idsVin,
        CDESTDO: e.cdestdo, UCRCN: e.ucrcn, FCRCN: e.fcrcn, UEDCN: e.uedcn, FEDCN: e.fedcn,
      };
    },
    async getEntries(currentPage, perPage) {
      this.grid.isLoading = true;
      await adminEntriesProxy.listdata({
        ROWS: perPage, INIT: (currentPage - 1) * perPage,
        DESC: this.selectedFilter?.name || null,
        CESTDO: this.selectedFilter?.CDESTDO || null,
        BLOG: this.selectedFilter?.BLOG || null,
        FRESOLUTION: this.selectedFilter?.FRESOLUTION || null,
        TEMA: this.selectedFilter?.TEMA || null,
        RTITLE: this.selectedFilter?.RTITLE || null,
        FCRCN: this.selectedFilter?.FCRCN || null,
        SORT: this.selectedFilter?.SORT || 'TITLE',
        DIR: this.selectedFilter?.DIR || 'ASC',
      }, this.active)
        .then(res => {
          const list = res?.DATA?.data ?? res?.data ?? [];
          const total = res?.DATA?.total ?? res?.total ?? 0;
          this.data = list.map(e => this.mapEntry(e));
          this.grid.totalRows = total;
        })
        .catch(err => { this.data = []; toast.error(err?.MESSAGE || 'Error al cargar las entradas', { toastId: 'error-entries' }); })
        .finally(() => this.grid.isLoading = false);
    },
    updateActive(text) {
      this.active = text;
      this.selectedFilter = { name: null, CDESTDO: 'A', BLOG: null, FRESOLUTION: null, TEMA: null, RTITLE: null, FCRCN: null, SORT: 'TITLE', DIR: 'ASC' };
      this.grid = { ...this.grid, perPage: 10, currentPage: 1, loading: false };
      this.getEntries(this.grid.currentPage, this.grid.perPage);
    },
    async onClickExportar(typeFilter) {
      if (typeFilter == 3) {
        if (!this.data.length) return toast.warning('No se encontraron datos para exportar', { toastId: 'warning-export' });
        this.isLoading = true;
        await adminEntriesProxy.getDocumentZipAll({ paths: JSON.stringify(this.data.map(i => ({ ENTRIEFILE: i.ENTRIEFILE, TITLE: i.TITLE, FCRCN: i.FCRCN, FLGDOC: i.FLGDOC }))) })
          .then(blob => { const u = URL.createObjectURL(new Blob([blob])); const a = document.createElement('a'); a.href=u; a.setAttribute('download','Reporte.zip'); document.body.appendChild(a); a.click(); })
          .catch(err => toast.error(err?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-export' }))
          .finally(() => this.isLoading = false);
        return;
      }
      if (!this.selectedFilter.RTITLE) return toast.warning('Debe seleccionar un filtro para exportar', { toastId: 'warning-export' });
      this.isLoading = true;
      const params = { RTITLE: this.selectedFilter.RTITLE, TYPE: this.active, BLOG: this.selectedFilter.BLOG };
      const fn = typeFilter == 1 ? adminEntriesProxy.listSearchDataFull(params) : adminEntriesProxy.getDocumentZip(params);
      await fn
        .then(blob => { const u = URL.createObjectURL(new Blob([blob])); const a = document.createElement('a'); a.href=u; a.setAttribute('download',`Reporte-${this.selectedFilter.RTITLE}-${this.active}.zip`); document.body.appendChild(a); a.click(); })
        .catch(err => toast.error(err?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-export' }))
        .finally(() => this.isLoading = false);
    },
    async edit(data) {
      if (!this.checkFiltersReady()) return;
      this.isLoadingEdit = true;
      try {
        if (data.BLOG === 'common' || data.BLOG === 'undefined') {
          this.modalEditarEntradaComun.data = await this.obtenerDatosEdit(data.ID);
          if (this.modalEditarEntradaComun.data) this.modalEditarEntradaComun.show = true;
        }
        if (data.BLOG === 'emblematic') {
          this.modalEditarEntradaEmble.data = await this.obtenerDatosEdit(data.ID);
          if (this.modalEditarEntradaEmble.data) this.modalEditarEntradaEmble.show = true;
        }
        if (data.BLOG === 'executive') {
          this.modalEditarEntradalegislacion.data = await this.obtenerDatosEdit(data.ID);
          if (this.modalEditarEntradalegislacion.data) this.modalEditarEntradalegislacion.show = true;
        }
      } finally {
        this.isLoadingEdit = false;
      }
    },
    async deleteRow() {
      if (this.role.IDR == 1) return toast.warning('No tiene permisos para realizar esta acción', { toastId: 'warning-delete' });
      if (!this.modalEliminar.data.ID) return toast.warning('No se encontró el ID de la entrada');
      this.isLoading = true;
      await adminEntriesProxy.delete(this.modalEliminar.data.ID)
        .then(r => { if (r.STATUS) { toast.success('Entrada eliminada correctamente', { toastId: 'success-delete' }); this.getEntries(this.grid.currentPage, this.grid.perPage); this.modalEliminar.show = false; } else toast.error(r.MESSAGE, { toastId: 'error-delete' }); })
        .catch(err => toast.error(err?.MESSAGE || 'Error al eliminar la entrada', { toastId: 'error-delete' }))
        .finally(() => this.isLoading = false);
    },
    async downloadFile(item) {
      this.isLoading = true;
      await adminEntriesProxy.downloadFile({ PATH: item?.ENTRIEFILE || '' })
        .then(r => { const u = URL.createObjectURL(new Blob([r])); const a = document.createElement('a'); a.href=u; const ext = (item?.ENTRIEFILE||'').split('.').pop(); a.setAttribute('download', (item?.TITLE||'')+'-ENTRADA PRINCIPAL.'+ext); document.body.appendChild(a); a.click(); })
        .catch(err => toast.error(err?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-download' }))
        .finally(() => this.isLoading = false);
    },
    async viewEntrie(entrie, type) {
      this.isLoading = true;
      try {
        const data = await this.obtenerDatos(entrie.ID);
        if (!Object.keys(data).length) { toast.warning('No se encontraron datos para la entrada', { toastId: 'warning-entrie' }); return; }
        if (['common','emblematic'].includes(entrie.BLOG)) {
          if (type == 1) this.generateWord(entrie);
          if (type == 2) createPDFHelper.generate(data);
        }
      } catch (err) { toast.error(err?.MESSAGE || 'Error al obtener el archivo'); }
      finally { this.isLoading = false; }
    },
    async generateWord(data) {
      await adminEntriesProxy.getDocument({ ID: data.ID })
        .then(blob => { const u = URL.createObjectURL(new Blob([blob])); const a = document.createElement('a'); a.href=u; a.setAttribute('download',`${data.TITLE.toUpperCase()} - RESUMEN EJECUTIVO.docx`); document.body.appendChild(a); a.click(); a.parentNode.removeChild(a); URL.revokeObjectURL(u); })
        .catch(err => toast.error(err?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-export' }))
        .finally(() => this.isLoading = false);
    },
    async obtenerDatos(id) {
      let data = {};
      await adminEntriesProxy.getPrint({ ID: id })
        .then(res => {
          const r = res?.DATA ?? res;
          const clean = s => { const v = JSON.parse(r[s])?.[0]?.LABEL||''; return v ? v.replace(/\s*,/g,',') : ''; };
          data = { ID: r.ID, TITLE: r.TITLE, ISBINDING: r.ISBINDING==='1'?'SI':'NO',
            AMBIT: clean('AMBIT'), FRESOLUTION: r.FRESOLUTION ? new Date(r.FRESOLUTION).toLocaleDateString('es-PE',{year:'numeric',month:'long',day:'numeric'}) : '',
            OJURISDICCIONAL: clean('OJURISDICCIONAL'), MAGISTRATES: clean('MAGISTRADOS'),
            VDESIDENTE: r.VDESIDENTE, CVOTE: r.CVOTE, ENTRIEFILE: r.ENTRIEFILE, ENTRIEFILERESUMEN: r.ENTRIEFILERESUMEN,
            KEYWORDS: r.KEYWORDS?.replace(/\s*,/g,', '), TEMA: r.TEMA, SUBTEMA: r.SUBTEMA,
            SHORTSUMMARY: r.SHORTSUMMARY, RESUMEN: r.RESUMEN, NENTRIEFILERESUMEN: null, NENTRIEFILE: null,
            DELITO: clean('DELITO'), RECURSO: clean('RECURSO'), MATERIA: clean('MATERIA'),
            JURISDICCION: clean('JURISDICCION'), FRESOLUTIONSTRING: r.FRESOLUTIONSTRING };
        })
        .catch(err => { data = {}; toast.error(err?.MESSAGE||'Error al obtener los datos', { toastId: 'error-entries' }); });
      return data;
    },
    async obtenerDatosEdit(id) {
      try {
        this.isLoading = true;
        const res = await adminEntriesProxy.get({ ID: id });
        const r = res?.DATA ?? res;
        if (!r?.ID) { toast.warning('No se encontraron datos para la entrada', { toastId: 'warning-entrie' }); return null; }
        const parseArr = (s) => !s ? [] : s.split(',').map(i => parseInt(i));
        return {
          ID: r.ID, TITLE: r.TITLE, RTITLE: r?.RTITLE||'', ISBINDING: r.ISBINDING,
          AMBIT: parseArr(r.AMBIT), FRESOLUTION: r.FRESOLUTION, OJURISDICCIONAL: parseArr(r.OJURISDICCIONAL),
          MAGISTRATES: parseArr(r.MAGISTRATES), VDESIDENTE: r?.VDESIDENTE?.split(',').filter(i=>i.trim()) || [],
          CVOTE: r?.CVOTE?.split(',').filter(i=>i.trim()) || [],
          KEYWORDS: r?.KEYWORDS?.split(',')?.filter(i=>i.trim()) || [],
          ENTRIEFILE: r.ENTRIEFILE, ENTRIEFILERESUMEN: r.ENTRIEFILERESUMEN,
          TEMA: this.stripHTML(r.TEMA), SUBTEMA: this.stripHTML(r.SUBTEMA),
          SHORTSUMMARY: this.stripHTML(r.SHORTSUMMARY), RESUMEN: this.stripHTML(r.RESUMEN),
          NENTRIEFILERESUMEN: null, NENTRIEFILE: null, RESUMEN2: r.RESUMEN2, CASO: r.CASO,
          DELITO: parseArr(r.DELITO), RECURSO: parseArr(r.RECURSO),
          TPONRMA: parseArr(r?.TPONRMA), NMRCN: r.NMRCN, OEMISOR: parseArr(r?.OEMISOR),
          MATERIA: parseArr(r.MATERIA), JURISDICCION: parseArr(r?.JURISDICCION),
          JURISDICCIONV: parseArr(r?.JURISDICCIONV),
          SITUACION: r.SITUACION, JIDSVIN: r.JIDSVIN, IDSVIN: r.IDSVIN
        };
      } catch (err) {
        toast.error(err?.MESSAGE || 'Error al obtener los datos', { toastId: 'error-entries' });
        return null;
      } finally { this.isLoading = false; }
    },
    stripHTML(html) {
      if ([undefined, null, ''].includes(html)) return '';
      return html.replace(/\r\n/g,'\n').replace(/style="[^"]*"/g,'').replace(/>\s+</g,'><');
    },
    checkFiltersReady() {
      if (this.isLoadingFilters) {
        toast.warning('Los filtros aún se están cargando, espere un momento...', { toastId: 'filters-not-ready' });
        return false;
      }
      return true;
    },
    openModalAgregar(tipo) {
      if (!this.checkFiltersReady()) return;
      if (tipo === 'common')     this.modalEntradaComun.show = true;
      if (tipo === 'emblematic') this.modalAgregarEntradaEmble.show = true;
      if (tipo === 'executive')  this.modalAgregarEntradalegislacion.show = true;
    },
    openS3Zip() {
      this.s3Zip.show = true;
      this.s3Zip.loading = false;
      this.s3Zip.downloaded = 0;
      this.s3Zip.status = 'Preparando descarga...';
    },
    async startS3ZipDownload() {
      this.s3Zip.loading = true;
      this.s3Zip.downloaded = 0;
      this.s3Zip.status = 'Listando archivos en S3...';
      try {
        const blob = await FileMigrationProxy
          .onZipProgress(evt => {
            this.s3Zip.downloaded = evt.loaded ?? 0;
            this.s3Zip.status = 'Empaquetando y descargando...';
          })
          .downloadS3Zip(this.s3Zip.prefix);
        const label = this.s3Zip.prefix
          ? this.s3Zip.prefix.replace('/', '') + '-backup'
          : 's3-backup';
        const url = URL.createObjectURL(new Blob([blob], { type: 'application/zip' }));
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', `${label}.zip`);
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success('ZIP descargado correctamente', { toastId: 's3-zip-done' });
        this.s3Zip.show = false;
      } catch (err) {
        toast.error(err?.MESSAGE || 'Error al generar el ZIP', { toastId: 's3-zip-error' });
      } finally {
        this.s3Zip.loading = false;
      }
    },
    async openMigration() {
      this.migration.show = true;
      this.migration.status = 'idle';
      this.migration.loading = true;
      try {
        const data = await FileMigrationProxy.preview();
        this.migration.preview = data;
      } catch { /* ignora */ }
      finally { this.migration.loading = false; }
    },
    closeMigration() {
      if (this.migration.status === 'running') {
        toast.warning('La migración sigue en progreso en el servidor.', { toastId: 'migration-warning' });
      }
      if (this.migration._pollTimer) { clearInterval(this.migration._pollTimer); this.migration._pollTimer = null; }
      this.migration.show = false;
    },
    async startMigration() {
      try {
        const { jobId } = await FileMigrationProxy.start();
        this.migration.jobId = jobId;
        this.migration.status = 'running';
        this.migration.processed = 0;
        this.migration.percent = 0;
        this.migration.done = 0;
        this.migration.errors = 0;
        this.migration.currentFile = 'Iniciando...';
        this.migration._pollTimer = setInterval(() => this.pollMigration(), 2000);
      } catch (err) {
        toast.error(err?.MESSAGE || 'Error al iniciar la migración', { toastId: 'migration-error' });
      }
    },
    async pollMigration() {
      if (!this.migration.jobId) return;
      try {
        const p = await FileMigrationProxy.progress(this.migration.jobId);
        this.migration.total = p.total ?? 0;
        this.migration.processed = p.processed ?? 0;
        this.migration.percent = p.percent ?? 0;
        this.migration.currentFile = p.currentFile ?? '';
        this.migration.done = p.done ?? 0;
        this.migration.errors = p.errors ?? 0;
        if (p.status === 'done' || p.status === 'error') {
          this.migration.status = p.status;
          clearInterval(this.migration._pollTimer);
          this.migration._pollTimer = null;
          if (p.status === 'done') toast.success('¡Migración completada!', { toastId: 'migration-done' });
          else toast.error('La migración terminó con errores.', { toastId: 'migration-done' });
        }
      } catch { /* ignora errores de red temporales */ }
    },
    async downloadMigrationExcel() {
      if (!this.migration.jobId) return;
      try {
        const blob = await FileMigrationProxy.downloadExcel(this.migration.jobId);
        const url = URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'migracion-s3-hostinger.xlsx');
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        toast.error(err?.MESSAGE || 'Error al descargar el Excel', { toastId: 'migration-excel-error' });
      }
    },
    async exportEntradasJson() {
      this.exportJsonLoading = true;
      try {
        const blob = await FileMigrationProxy.exportEntradasJson();
        const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'entradas.json');
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        toast.error('Error al exportar el JSON.', { toastId: 'export-json-error' });
      } finally {
        this.exportJsonLoading = false;
      }
    },
    async openOrphanScan() {
      this.orphan.show = true;
      this.orphan.status = 'running';
      this.orphan.phase = 'Iniciando escaneo...';
      this.orphan.s3Total = 0; this.orphan.s3Juris = 0; this.orphan.s3Legis = 0;
      this.orphan.dbCount = 0; this.orphan.orphanCount = 0; this.orphan.jobId = null;
      try {
        const { jobId } = await FileMigrationProxy.startOrphanScan();
        this.orphan.jobId = jobId;
        this.orphan._pollTimer = setInterval(() => this.pollOrphanScan(), 1500);
      } catch {
        this.orphan.status = 'error';
        this.orphan.phase = 'Error al iniciar el escaneo';
      }
    },
    closeOrphanScan() {
      if (this.orphan._pollTimer) { clearInterval(this.orphan._pollTimer); this.orphan._pollTimer = null; }
      this.orphan.show = false;
    },
    async pollOrphanScan() {
      if (!this.orphan.jobId) return;
      try {
        const p = await FileMigrationProxy.orphanProgress(this.orphan.jobId);
        this.orphan.phase = p.phase ?? this.orphan.phase;
        this.orphan.s3Juris = p.s3Juris ?? 0;
        this.orphan.s3Legis = p.s3Legis ?? 0;
        this.orphan.s3Total = p.s3Total ?? 0;
        this.orphan.dbCount = p.dbCount ?? 0;
        this.orphan.orphanCount = p.orphanCount ?? 0;
        if (p.status === 'done' || p.status === 'error') {
          this.orphan.status = p.status;
          clearInterval(this.orphan._pollTimer);
          this.orphan._pollTimer = null;
        }
      } catch { /* ignora errores de red temporales */ }
    },
    async downloadOrphanZip() {
      if (!this.orphan.jobId) return;
      try {
        const blob = await FileMigrationProxy.downloadOrphanZip(this.orphan.jobId);
        const url = URL.createObjectURL(new Blob([blob], { type: 'application/zip' }));
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 's3-sin-bd.zip');
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success('ZIP de huérfanos descargado.', { toastId: 'orphan-zip-ok' });
      } catch {
        toast.error('Error al descargar el ZIP.', { toastId: 'orphan-zip-error' });
      }
    },
    async downloadMissingZip() {
      this.migration.zipLoading = true;
      try {
        const blob = await FileMigrationProxy.downloadMissingZip();
        const url = URL.createObjectURL(new Blob([blob], { type: 'application/zip' }));
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'faltantes-s3.zip');
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success('ZIP de archivos faltantes descargado.', { toastId: 'missing-zip-ok' });
      } catch (err) {
        toast.error('Error al generar el ZIP de faltantes.', { toastId: 'missing-zip-error' });
      } finally {
        this.migration.zipLoading = false;
      }
    },
    async getAllFilters() {
      try {
        this.isLoadingFilters = true;
        const [magistradosRes, filtersRes, filtersRes2] = await Promise.all([
          MagistradoProxy.list({ ROWS: 1000, INIT: 0, DESC: null, CESTDO: null }, 2),
          filterProxy.list({ NIVEL: 5, CESTDO: '' }, '1', 2),
          filterProxy.list({ NIVEL: 5, CESTDO: '' }, '2', 2),
        ]);
        const magistList = Array.isArray(magistradosRes) ? magistradosRes : (magistradosRes?.data ?? []);
        this.selects.magistrados = magistList.map(i => ({ value: i.id ?? i.ID, label: ((i.apellidos ?? i.APELLIDOS ?? '')+' '+(i.nombres ?? i.NOMBRES ?? '')).trim().replace(/null/g,'') }));
        if (filtersRes?.length) {
          const cfg = (data, label) => { try { return data.filter(i=>i.LABEL.toUpperCase()===label.toUpperCase()).map(i=>({...i,NIVEL_2:JSON.parse(i.NIVEL_2)}))[0]||{}; } catch { return {}; } };
          const mapN = (n) => n?.map(i=>({value:i.VALUE,label:i.LABEL,children:mapN(i.NIVEL_3||i.NIVEL_4||i.NIVEL_5||[])})) || [];
          this.selects.ambitos = mapN(cfg(filtersRes,'ÁMBITO')?.NIVEL_2);
          this.selects.jurisdiccionales = mapN(cfg(filtersRes,'ÓRGANO JURISDICCIONAL')?.NIVEL_2);
          this.selects.delitos = mapN(cfg(filtersRes,'DELITOS')?.NIVEL_2);
          this.selects.recursos = mapN(cfg(filtersRes,'TIPO DE RECURSO')?.NIVEL_2);
          this.selects.materias = mapN(cfg(filtersRes,'MATERIA')?.NIVEL_2);
          this.selects.jurisdicion = mapN(cfg(filtersRes,'JURISDICCIÓN')?.NIVEL_2);
          this.selects.jurisdicionV = mapN(cfg(filtersRes,'JURISPRUDENCIA VINCULANTE')?.NIVEL_2);
        }
        if (filtersRes2?.length) {
          const cfg2 = (label) => { try { return filtersRes2.filter(i=>i.LABEL.toUpperCase()===label.toUpperCase()).map(i=>({...i,NIVEL_2:JSON.parse(i.NIVEL_2)}))[0]||{}; } catch { return {}; } };
          const mapN = (n) => n?.map(i=>({value:i.VALUE,label:i.LABEL,children:mapN(i.NIVEL_3||i.NIVEL_4||i.NIVEL_5||[])})) || [];
          this.selects.tiponorma = mapN(cfg2('TIPO DE NORMA')?.NIVEL_2);
          this.selects.organismos = mapN(cfg2('ÓRGANO EMISOR')?.NIVEL_2);
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.MESSAGE || 'Error al cargar los datos', { toastId: 'error-filters' });
      } finally {
        this.isLoadingFilters = false;
        this.filtersLoaded = true;
      }
    },
  },
  mounted() {
    this.getEntries(this.grid.currentPage, this.grid.perPage);
    this.getAllFilters();
    this.actions = {
      ...this.actions,
      edit:   { ...this.actions.edit,   action: d => this.edit(d) },
      delete: { ...this.actions.delete, action: d => { this.modalEliminar.show = true; this.modalEliminar.data = d; } },
      download: {
        ...this.actions.download, action: null,
        dropdown: { ...this.actions.download.dropdown, items: {
          'RESOLUCIÓN':   { ...this.actions.download.dropdown.items['RESOLUCIÓN'],   action: async d => {
            this.actions.download.loadingId = d.ID;
            try { await this.downloadFile(d); } finally { this.actions.download.loadingId = null; }
          }},
          'DOC. RESUMEN': { ...this.actions.download.dropdown.items['DOC. RESUMEN'], action: async d => {
            this.actions.download.loadingId = d.ID;
            try { await this.viewEntrie(d,1); } finally { this.actions.download.loadingId = null; }
          }},
          'PDF. RESUMEN': { ...this.actions.download.dropdown.items['PDF. RESUMEN'], action: async d => {
            this.actions.download.loadingId = d.ID;
            try { await this.viewEntrie(d,2); } finally { this.actions.download.loadingId = null; }
          }},
        }}
      }
    };
  },
};
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .2s;}
.fade-enter-from,.fade-leave-to{opacity:0;}
</style>
