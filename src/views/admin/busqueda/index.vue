<template>
  <div class="min-h-screen page-bg">

    <!-- Hero search -->
    <div class="search-hero">

      <!-- Logo -->
      <div class="flex justify-center pt-5 pb-4 px-4">
        <img @click="onClear()" src="@/assets/img/logos/logo-full.png" alt="Logo"
          class="h-11 max-sm:h-9 cursor-pointer drop-shadow-sm hover:scale-[1.03] transition-transform" />
      </div>

      <!-- Search bar -->
      <div class="max-w-4xl mx-auto px-4 pb-5">

        <!-- Main input -->
        <div class="search-bar-shell">
          <!-- Search icon -->
          <svg class="search-bar-lupe flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>

          <el-autocomplete v-model="filter.GLOBAL" :fetch-suggestions="searchGlobal"
            :trigger-on-focus="false" clearable
            placeholder="Busca por nombre de caso, palabra clave o selecciona filtros…"
            popper-class="sidebar-tree-popper search-global-autocomplete"
            class="flex-1 search-input" @keydown.enter="doSearch" @select="handleGlobalSelect">
            <template #default="{ item }">
              <div v-if="item.isEmpty" class="empty-message"><em>No se encontraron coincidencias</em></div>
              <div v-else class="flex items-center gap-2" v-html="highlightGlobal(item.value)"></div>
            </template>
          </el-autocomplete>

          <!-- Separador vertical -->
          <div class="w-px self-stretch my-2 bg-gray-200 dark:bg-gray-700"></div>

          <!-- Modo búsqueda (dropdown) -->
          <div class="relative">
            <button type="button"
              :class="['search-bar-icon-btn', !isCollapsed2 ? 'search-bar-icon-btn--active' : '']"
              @click="isCollapsed2 = !isCollapsed2"
              title="Modo de búsqueda">
              <img src="@/assets/img/icons/settings-arrow.svg" alt="Modo" class="w-4 h-4" />
            </button>
            <transition name="fade-scale">
              <div v-show="!isCollapsed2" ref="filterMenu2"
                class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-modal border border-gray-100 dark:border-gray-700 p-2 min-w-[270px]" style="z-index:9999">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 pb-1.5">Modo de búsqueda</p>
                <button v-for="op in opcionesFiltro" :key="op.valor" type="button"
                  @click="modoBusqueda = op.valor; isCollapsed2 = true"
                  :class="['w-full flex items-start gap-2.5 px-2 py-2 rounded-lg text-left transition-colors',
                    modoBusqueda === op.valor ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800']">
                  <span :class="['mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors',
                    modoBusqueda === op.valor ? 'border-brand-blue bg-brand-blue' : 'border-gray-300']"></span>
                  <span class="flex flex-col">
                    <span :class="['text-sm font-medium', modoBusqueda === op.valor ? 'text-brand-blue' : 'text-gray-700 dark:text-gray-300']">{{ op.texto }}</span>
                    <span class="text-xs text-gray-400 leading-tight">{{ op.resena }}</span>
                  </span>
                </button>
              </div>
            </transition>
          </div>

          <!-- Filtros avanzados toggle -->
          <button v-if="canFiltros" type="button"
            :class="['search-bar-icon-btn', !isCollapsed ? 'search-bar-icon-btn--active' : '']"
            @click="isCollapsed = !isCollapsed; isCollapsed2 = true"
            :title="isCollapsed ? 'Mostrar filtros' : 'Ocultar filtros'">
            <img src="@/assets/img/icons/filter.svg" alt="Filtros" class="w-4 h-4" />
            <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
          </button>

          <!-- Toggle Buscar con IA -->
          <div v-can="'busqueda.ia'" class="search-bar-ia-toggle-wrap"
            @mouseenter="showAiInfo = true" @mouseleave="showAiInfo = false">
            <button type="button"
              :class="['search-bar-ia-toggle', useAI ? 'search-bar-ia-toggle--on' : '']"
              :disabled="aiQuota && !aiQuota.hasQuota"
              @click="useAI = !useAI">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="ia-toggle-icon">
                <path d="M12 2L13.4 8.26L19.5 9L13.4 9.74L12 16L10.6 9.74L4.5 9L10.6 8.26Z"/>
                <path d="M5 3L5.6 5.4L8 6L5.6 6.6L5 9L4.4 6.6L2 6L4.4 5.4Z"/>
                <path d="M19 14L19.5 16L21.5 16.5L19.5 17L19 19L18.5 17L16.5 16.5L18.5 16Z"/>
              </svg>
              <span class="ia-toggle-label">Buscar con IA</span>
              <span class="ia-toggle-switch"><span class="ia-toggle-knob"></span></span>
            </button>

            <transition name="fade-scale">
              <div v-if="showAiInfo" class="ia-tooltip">
                <p>Este buscador utiliza Inteligencia Artificial para optimizar y priorizar los resultados de búsqueda jurisprudencial según la consulta ingresada.</p>
                <p>La IA no elabora resúmenes ni adopta decisiones: solo ordena resultados.</p>
                <p>Para más información, consulta nuestra
                  <a href="/politica-ia" target="_blank" rel="noopener" class="ia-tooltip-link">Política de Inteligencia Artificial</a>.
                </p>
                <p v-if="aiQuota && !aiQuota.isUnlimited">
                  Usted cuenta con {{ aiQuota.remaining }}/{{ aiQuota.limit }} búsquedas mensuales.
                </p>
              </div>
            </transition>
          </div>

          <!-- Buscar button integrado -->
          <button v-if="canBuscar" type="button" class="search-bar-submit" @click="doSearch"
            :class="{ 'opacity-75': isLoading }">
            <span>Buscar</span>
          </button>

          <!-- Limpiar -->
          <button type="button" class="search-bar-clear" @click="clearGlobalOnly" title="Limpiar búsqueda">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Accesos rápidos + Limpiar -->
        <div class="flex items-center gap-2 mt-2.5 px-1 min-h-[28px]">
          <template v-if="topSearch.length > 0">
            <button class="flex-shrink-0 text-gray-400 hover:text-brand-blue transition-colors" @click="scrollLeft">
              <svg width="12" height="12" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="flex-1 overflow-x-auto flex gap-1.5 no-scrollbar" ref="scrollContainer">
              <div v-for="(valor, index) in topSearch" :key="valor.ID + '-' + index"
                class="top-search-chip-wrapper flex-shrink-0"
                draggable="true"
                @dragstart="onDragStart(index)" @dragover.prevent="onDragOver(index)"
                @drop="onDrop(index)" @dragend="onDragEnd"
                :class="{ 'dragging': draggedIndex === index, 'drag-over': dragOverIndex === index && draggedIndex !== index }">
                <div class="quick-chip" :class="{ 'quick-chip--ai': valor.MODO === 'AI' }" @click="executionsSearch(valor)">
                  <button @click.stop="clearTopSearch(index, valor)" class="quick-chip-x">×</button>
                  <span v-if="valor.MODO === 'AI'" class="chip-ai-badge" title="Búsqueda IA">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M12 2L13.4 8.26L19.5 9L13.4 9.74L12 16L10.6 9.74L4.5 9L10.6 8.26Z"/>
                      <path d="M5 3l.6 2 2 .5-2 .5-.6 2-.6-2-2-.5 2-.5z"/>
                    </svg>
                    IA
                  </span>
                  <span class="max-w-[120px] truncate">{{ cortarDescripcion(valor.DESCP) }}</span>
                </div>
              </div>
            </div>
            <button class="flex-shrink-0 text-gray-400 hover:text-brand-blue transition-colors" @click="scrollRight">
              <svg width="12" height="12" viewBox="0 0 10 16" fill="none"><path d="M2 2L8 8L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </template>
        </div>

      </div>
    </div>

    <!-- Results area -->
    <div class="flex gap-0 max-w-[1400px] mx-auto px-4">

      <!-- Sidebar filtros -->
      <aside :class="['filter-sidebar bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700 flex flex-col transition-all duration-300 overflow-hidden sticky top-[60px] self-start',
        isCollapsed ? 'w-0 min-w-0 opacity-0' : 'w-72 min-w-[288px] opacity-100']">
        <div class="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Filtros</span>
          <button @click="isCollapsed = true" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 text-xl">×</button>
        </div>

        <div class="p-3">
          <!-- Tabs jurisprudencia / legislación -->
          <div class="flex mb-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-1 gap-1">
            <button type="button"
              @click="typeSaarch = 'jurisprudences'; isFilter = 'jurisprudences-generales'; criterioActual = 'year-publication'"
              :class="['flex flex-1 items-center justify-center gap-1.5 py-2 px-3 rounded-lg cursor-pointer text-xs font-semibold transition-all',
                typeSaarch == 'jurisprudences' ? 'bg-white dark:bg-gray-700 shadow-soft text-brand-blue' : 'text-gray-500 hover:text-brand-blue']">
              <img class="w-4 h-4" src="@/assets/img/icons/corona-2.svg" alt="Jurisprudencia" />
              Jurisprudencia
            </button>
            <button type="button"
              @click="typeSaarch = 'legislations'; isFilter = 'legislaciones-generales'; criterioActual = 'year-publication'"
              :class="['flex flex-1 items-center justify-center gap-1.5 py-2 px-3 rounded-lg cursor-pointer text-xs font-semibold transition-all',
                typeSaarch == 'legislations' ? 'bg-white dark:bg-gray-700 shadow-soft text-brand-blue' : 'text-gray-500 hover:text-brand-blue']">
              <img class="w-4 h-4" src="@/assets/img/icons/settings-2.svg" alt="Legislación" />
              Legislación
            </button>
          </div>

          <!-- Filtros -->
          <div class="flex flex-col gap-3">

            <!-- ── JURISPRUDENCIA ───────────────────────── -->
            <template v-if="typeSaarch === 'jurisprudences'">

              <AppTreeSelect label="Ámbito" v-model="filter.AMBITO"
                :data="selects['ÁMBITO']" multiple :filter-node-method="filterTreeNode" />

              <AppTreeSelect v-if="ambitoComplianceSelected" label="Materia" v-model="filter.MATERIA"
                :data="selects['MATERIA']" multiple :filter-node-method="filterTreeNode" />

              <AppTreeSelect label="Pretensión / Delito" v-model="filter.DELITO"
                :data="selects.DELITOS" multiple :filter-node-method="filterTreeNode"
                ref="delitoTreeSelect"
                @check-change="(d,c) => handleCheckChange(d,c,'DELITO','delitoTreeSelect')" />

              <AppTreeSelect label="Tipo de Recurso" v-model="filter.RECURSO"
                :data="selects['TIPO DE RECURSO']" multiple :filter-node-method="filterTreeNode" />

              <AppTreeSelect label="Órgano Jurisdiccional" v-model="filter.OJURISDICCIONAL"
                :data="selects['ÓRGANO JURISDICCIONAL']" multiple :filter-node-method="filterTreeNode"
                ref="organoTreeSelect"
                @check-change="(d,c) => handleCheckChange(d,c,'OJURISDICCIONAL','organoTreeSelect')" />

              <AppTreeSelect label="Magistrado" v-model="filter.MAGISTRATES"
                :data="selects['MAGISTRATES']" multiple :filter-node-method="filterTreeNode" />

              <AppTreeSelect label="Jurisprudencia Vinculante" v-model="filter.JVINCULANTE"
                :data="selects['JURISPRUDENCIA VINCULANTE']" multiple :filter-node-method="filterTreeNode"
                ref="jvinculanteTreeSelect"
                @check-change="(d,c) => handleCheckChange(d,c,'JVINCULANTE','jvinculanteTreeSelect')" />

              <AppTreeSelect label="Jurisdicción" v-model="filter.JURISDICCION"
                :data="selects['JURISDICCIÓN']" multiple :filter-node-method="filterTreeNode" />

              <AppAutocomplete label="Palabras Clave" v-model="filter.KEYWORDS"
                :fetch-suggestions="searchPalabrasClaves" placeholder="Buscar palabras clave..."
                :trigger-on-focus="false" clearable
                @keydown.enter="search" @select="handlePalabraSelect">
                <template #default="{ item }">
                  <div v-if="item.isEmpty" class="text-xs italic text-gray-400 py-1">Sin coincidencias</div>
                  <div v-else v-html="highlightPalabrasClaves(item.value)" class="text-sm"></div>
                </template>
              </AppAutocomplete>

              <!-- Fechas resolución -->
              <div>
                <label class="block text-sm font-medium mb-1.5" style="color:var(--text)">Rango de fecha</label>
                <div class="flex gap-2">
                  <div class="flex-1 min-w-0">
                    <date-picker v-model="filter.FRESOLUTION1" value-type="format"
                      @change="filter.FRESOLUTION1 = $event" :value="filter.FRESOLUTION1"
                      appendTo="self" panelClass="force-open-down" class="w-full" placeholder="Desde" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <date-picker v-model="filter.FRESOLUTION2" value-type="format"
                      @change="filter.FRESOLUTION2 = $event" :value="filter.FRESOLUTION2"
                      appendTo="self" panelClass="force-open-down" class="w-full" placeholder="Hasta" />
                  </div>
                </div>
              </div>

              <!-- Casos Emblemáticos -->
              <div class="flex items-center justify-between py-1">
                <span class="text-sm font-medium" style="color:var(--text)">Casos Emblemáticos</span>
                <button type="button" @click="filter.BLOG = !filter.BLOG"
                  :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                    filter.BLOG ? 'bg-brand-blue' : 'bg-gray-300 dark:bg-gray-600']">
                  <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                    filter.BLOG ? 'translate-x-6' : 'translate-x-1']" />
                </button>
              </div>

            </template>

            <!-- ── LEGISLACIÓN ──────────────────────────── -->
            <template v-if="typeSaarch === 'legislations'">

              <AppTreeSelect label="Tipo de Norma" v-model="filter.TPONRMA"
                :data="selects['TIPO DE NORMA']" multiple :filter-node-method="filterTreeNode" />

              <AppTreeSelect label="Órgano Emisor" v-model="filter.OEMISOR"
                :data="selects['ÓRGANO EMISOR']" multiple :filter-node-method="filterTreeNode" />

              <AppAutocomplete label="Denominación Oficial" v-model="filter.RTITLE"
                :fetch-suggestions="searchDenominacionOficial" placeholder="Buscar denominación..."
                :trigger-on-focus="false" clearable
                @keydown.enter="search" @select="handleDenominacionSelect">
                <template #default="{ item }">
                  <div v-if="item.isEmpty" class="text-xs italic text-gray-400 py-1">Sin coincidencias</div>
                  <div v-else v-html="highlightDenominacion(item.value)" class="text-sm"></div>
                </template>
              </AppAutocomplete>

              <BaseSelect label="Estado" v-model="filter.ESTADO">
                <option :value="null">Seleccione una opción</option>
                <option value="Vigente">Vigente</option>
                <option value="Modificado">Modificado</option>
                <option value="Derogado">Derogado</option>
              </BaseSelect>

              <!-- Fechas publicación -->
              <div>
                <label class="block text-sm font-medium mb-1.5" style="color:var(--text)">Rango de fecha</label>
                <div class="flex gap-2">
                  <div class="flex-1 min-w-0">
                    <date-picker v-model="filter.FRESOLUTION1" value-type="format"
                      @change="filter.FRESOLUTION1 = $event" :value="filter.FRESOLUTION1"
                      appendTo="self" panelClass="force-open-down" class="w-full" placeholder="Desde" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <date-picker v-model="filter.FRESOLUTION2" value-type="format"
                      @change="filter.FRESOLUTION2 = $event" :value="filter.FRESOLUTION2"
                      appendTo="self" panelClass="force-open-down" class="w-full" placeholder="Hasta" />
                  </div>
                </div>
              </div>

            </template>

          </div>
        </div>

        <div class="flex-shrink-0 flex gap-2 p-3 border-t border-gray-100 dark:border-gray-700">
          <SaveButton label="Buscar" native-type="button" :loading="isLoading" loading-label="Buscando..." @click="search()" class="flex-1" />
          <CancelButton label="Limpiar" @click="onClear(1)" class="flex-1" />
        </div>
      </aside>

      <!-- Resultados -->
      <div class="flex-1 min-w-0 py-2 px-3">
        <!-- Sugerencia de corrección ortográfica (IA, 0 resultados) -->
        <transition name="fade">
          <div v-if="isAiResult && aiSuggestion && resultados.length === 0" class="ai-suggestion-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#d97706;flex-shrink:0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span class="text-sm text-gray-600 dark:text-gray-300">
              Sin resultados. ¿Quisiste decir:
              <button class="ai-suggestion-link" @click="applyAiSuggestion(aiSuggestion)">{{ aiSuggestion }}</button>?
            </span>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="resultados.length > 0">
            <!-- Banner IA -->
            <transition name="fade">
              <div v-if="isAiResult" class="ai-search-banner">
                <div class="flex items-center gap-2 flex-wrap">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="flex-shrink-0" style="color:#9333ea">
                    <path d="M12 2L13.4 8.26L19.5 9L13.4 9.74L12 16L10.6 9.74L4.5 9L10.6 8.26Z"/>
                    <path d="M5 3L5.6 5.4L8 6L5.6 6.6L5 9L4.4 6.6L2 6L4.4 5.4Z"/>
                    <path d="M19 14L19.5 16L21.5 16.5L19.5 17L19 19L18.5 17L16.5 16.5L18.5 16Z"/>
                  </svg>
                  <span class="text-xs font-semibold" style="color:#9333ea">Búsqueda IA</span>
                  <template v-if="aiExpandedTerms.length">
                    <span class="text-xs text-gray-300 dark:text-gray-600">·</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">Términos expandidos:</span>
                    <span v-for="term in aiExpandedTerms" :key="term" class="ai-term-chip">{{ term }}</span>
                  </template>
                  <span v-if="aiQuota && !aiQuota.isUnlimited" class="ml-auto text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {{ aiQuota.remaining }}/{{ aiQuota.limit }} búsquedas restantes
                  </span>
                </div>
              </div>
            </transition>

            <!-- Barra única: info + paginación + ordenar -->
            <div class="pag-bar mt-1 mb-2">
              <span class="text-xs font-semibold text-brand-blue whitespace-nowrap">
                {{ (table.currentPage-1)*table.perPage+1 }}–{{ Math.min(table.currentPage*table.perPage, table.totalRows) }} <span class="text-gray-400 font-normal">de</span> {{ table.totalRows }}
              </span>

              <div class="flex items-center gap-0.5">
                <button class="pag-btn" :disabled="table.currentPage === 1" @click="handleSearch(table.currentPage - 1)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <template v-for="p in paginationPages" :key="p">
                  <span v-if="p === '...'" class="pag-ellipsis">…</span>
                  <button v-else :class="['pag-btn', p === table.currentPage ? 'pag-btn--active' : '']"
                    @click="handleSearch(p)">{{ p }}</button>
                </template>
                <button class="pag-btn" :disabled="table.currentPage === totalPages" @click="handleSearch(table.currentPage + 1)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <div class="flex items-center gap-1.5 ml-auto">
                <span class="text-xs text-gray-500">Ordenar:</span>
                <BaseSelect v-model="sortOrder" @change="handleSearch(table.currentPage)">
                  <option value="desc">Recientes</option>
                  <option value="asc">Antiguos</option>
                </BaseSelect>
              </div>
            </div>

            <!-- Result Card -->
            <div v-for="(item, index) in resultados" :key="index"
              class="result-card group"
              :style="{ animationDelay: `${index * 40}ms` }">

              <!-- Copy button -->
              <div v-can="'busqueda.copiar'" class="relative flex-shrink-0 float-right ml-2">
                <button @click.stop="copyToClipboard(item, index)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 group-hover:bg-gray-100 dark:bg-gray-800 dark:group-hover:bg-gray-700 text-gray-400 hover:text-brand-blue transition-all"
                  title="Copiar título">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </button>
                <transition name="fade-scale">
                  <span v-if="showCopyMessage === index"
                    class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10">
                    Copiado ✓
                  </span>
                </transition>
              </div>

              <!-- Title -->
              <h3 :class="['result-title mb-1.5', item.ISOPEN === 1 ? 'result-title--visited' : '']"
                @click="openModalWithData(item, index)">
                <span v-if="item.ISAI" class="ai-result-badge">IA</span>
                <span v-html="highlightText(item.TITULO)"></span>
              </h3>

              <!-- JURISPRUDENCIA grid -->
              <div v-if="item.TYPE === 'jurisprudences'" class="result-grid">
                <div class="result-field">
                  <span class="result-label">Pretensión / Delito:</span>
                  <span class="result-value result-value--link"
                    v-html="item.DELITO?.length ? highlightText(item.DELITO.map(o => o.DESCP).join(', ')) : '-'"></span>
                </div>
                <div class="result-field">
                  <span class="result-label">Tipo de Recurso:</span>
                  <span class="result-value"
                    v-html="item.RECURSO?.length ? highlightText(item.RECURSO.map(o => o.DESCP).join(', ')) : '-'"></span>
                </div>
                <div class="result-field">
                  <span class="result-label">Órgano Jurisdiccional:</span>
                  <span class="result-value"
                    v-html="item.OJURISDICCIONAL?.length ? highlightText(item.OJURISDICCIONAL.map(o => o.DESCP).join(', ')) : '-'"></span>
                </div>
                <div class="result-field" v-if="item.MAGISTRATES?.length">
                  <span class="result-label">Magistrado(s):</span>
                  <span class="result-value"
                    v-html="highlightText(item.MAGISTRATES.map(m => m.LABEL || m.DESCP || '').filter(Boolean).join(', '))"></span>
                </div>
                <div class="result-field">
                  <span class="result-label">Caso Emblemático:</span>
                  <span class="result-value" v-html="highlightText(item.CASO || '-')"></span>
                </div>
                <div class="result-field">
                  <span class="result-label">Caso Vinculante:</span>
                  <span class="result-value">{{ item.INDICADOR ? 'Sí' : 'No' }}</span>
                </div>
                <div class="result-field">
                  <span class="result-label">Palabras Clave:</span>
                  <span class="result-value result-value--link"
                    v-html="highlightText(item.KEYWORDS?.split(',').map(p => p.trim()).join(', ') || '-')"></span>
                </div>
                <div v-if="item.SHORTSUMMARY3" class="result-field result-field--full">
                  <span class="result-label">Síntesis:</span>
                  <span class="result-sintesis">
                    <span v-html="expandedSintesis[index] ? highlightText(item.SHORTSUMMARY3) : highlightText((item.SHORTSUMMARY3 || '').slice(0, 220))"></span>
                    <span v-if="!expandedSintesis[index] && item.SHORTSUMMARY3.length > 220">... </span>
                    <button v-if="item.SHORTSUMMARY3.length > 220" @click="toggleSintesis(index)"
                      class="text-brand-blue text-xs font-semibold hover:underline ml-1">
                      {{ expandedSintesis[index] ? 'Ver menos ▲' : 'Ver más ▼' }}
                    </button>
                  </span>
                </div>
              </div>

              <!-- LEGISLACIÓN grid -->
              <div v-if="item.TYPE === 'legislations'" class="result-grid">
                <div class="result-field">
                  <span class="result-label">Numeración:</span>
                  <span class="result-value">{{ item.NMRCN || '-' }}</span>
                </div>
                <div class="result-field">
                  <span class="result-label">Fecha de publicación:</span>
                  <span class="result-value">{{ formateReverse(item.FRESOLUTION) || '-' }}</span>
                </div>
                <div class="result-field">
                  <span class="result-label">Órgano Emisor:</span>
                  <span class="result-value"
                    v-html="item.OEMISOR?.length ? highlightText(item.OEMISOR.map(o => o.DESCP).join(', ')) : '-'"></span>
                </div>
                <div class="result-field">
                  <span class="result-label">Estado:</span>
                  <span :class="['result-value font-semibold',
                    item.SITUACION === 'Vigente' ? 'text-green-600' :
                    item.SITUACION === 'Derogado' ? 'text-red-500' : 'text-gray-600']">
                    {{ item.SITUACION || '-' }}
                  </span>
                </div>
                <div class="result-field result-field--wide">
                  <span class="result-label">Denominación oficial:</span>
                  <span class="result-value result-value--link" v-html="highlightText(item.RTITLE || '-')"></span>
                </div>
                <div class="result-field result-field--wide">
                  <span class="result-label">Tipo de Norma:</span>
                  <span class="result-value result-value--link"
                    v-html="item.TPONRMA?.length ? highlightText(item.TPONRMA.map(o => o.DESCP).join(', ')) : '-'"></span>
                </div>
                <div v-if="parseJIDSVIN(item).length" class="result-field result-field--full normas-vin">
                  <span class="result-label">Normas Vinculadas:</span>
                  <ul class="normas-vin-list">
                    <li v-for="norma in normasVinPaged(item, index)" :key="norma.ID">
                      <a href="#" @click.prevent="navigateToNorma(norma)">{{ norma.TITLE }}</a>
                    </li>
                  </ul>
                  <div v-if="normasVinTotalPages(item) > 1" class="normas-vin-pagination">
                    <button class="pag-btn" :disabled="(normasVinPage[index] || 1) === 1"
                      @click="setNormasVinPage(index, (normasVinPage[index] || 1) - 1)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <span class="normas-vin-page-label">{{ normasVinPage[index] || 1 }} / {{ normasVinTotalPages(item) }}</span>
                    <button class="pag-btn" :disabled="(normasVinPage[index] || 1) === normasVinTotalPages(item)"
                      @click="setNormasVinPage(index, (normasVinPage[index] || 1) + 1)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <!-- Paginación inferior (solo visible si hay muchos resultados) -->
            <div v-if="totalPages > 3" class="pag-bar mt-3 mb-2">
              <button class="pag-btn" :disabled="table.currentPage === 1" @click="handleSearch(table.currentPage - 1)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <template v-for="p in paginationPages" :key="p">
                <span v-if="p === '...'" class="pag-ellipsis">…</span>
                <button v-else :class="['pag-btn', p === table.currentPage ? 'pag-btn--active' : '']"
                  @click="handleSearch(p)">{{ p }}</button>
              </template>
              <button class="pag-btn" :disabled="table.currentPage === totalPages" @click="handleSearch(table.currentPage + 1)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </transition>

        <!-- Estado vacío inicial -->
        <div v-if="resultados.length === 0 && !isLoading && !hasSearched" class="flex flex-col items-center justify-center py-20 text-center">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="58" stroke="url(#gradient1)" stroke-width="3" fill="none" opacity="0.2" />
            <path d="M50 45C50 39.4772 54.4772 35 60 35C65.5228 35 70 39.4772 70 45" stroke="url(#gradient1)" stroke-width="3" stroke-linecap="round" />
            <circle cx="60" cy="60" r="20" stroke="url(#gradient1)" stroke-width="3" fill="none" />
            <path d="M75 75L85 85" stroke="url(#gradient1)" stroke-width="3" stroke-linecap="round" />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#DF2DB2;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#185CE6;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
          <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-5 mb-2">¡Comienza tu búsqueda!</h3>
          <p class="text-gray-400">Utiliza el buscador y los filtros para encontrar<br>jurisprudencias y legislaciones de tu interés</p>
        </div>

        <!-- Sin resultados -->
        <div v-if="resultados.length === 0 && !isLoading && hasSearched" class="flex flex-col items-center justify-center py-20 text-center">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="38" stroke="url(#gradient2)" stroke-width="2.5" fill="none" opacity="0.3" />
            <circle cx="40" cy="35" r="15" stroke="url(#gradient2)" stroke-width="2.5" fill="none" />
            <path d="M51 46L60 55" stroke="url(#gradient2)" stroke-width="2.5" stroke-linecap="round" />
            <line x1="34" y1="35" x2="46" y2="35" stroke="url(#gradient2)" stroke-width="2.5" stroke-linecap="round" />
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#F59E0B;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#EAB308;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
          <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-4 mb-2">No se encontraron resultados</h3>
          <p class="text-gray-400">Intenta ajustar los filtros o buscar con otros términos</p>
        </div>

        <!-- Ayuda -->
        <div class="fixed right-0 top-1/2 -translate-y-1/2 z-40" v-show="showHelpButton">
          <button class="w-8 h-10 bg-white dark:bg-gray-800 rounded-l-xl shadow-medium border border-r-0 border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-brand-blue transition-colors"
            type="button" @click="toggleCard" :title="showCard ? 'Cerrar' : 'Ver filtros'">
            <!-- cerrado → apunta izquierda (abre) -->
            <svg v-if="!showCard" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <!-- abierto → apunta derecha (cierra) -->
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <transition name="fade-slide-down">
            <div v-if="showCard"
              class="absolute top-1/2 -translate-y-1/2 right-8 bg-white dark:bg-gray-900 rounded-2xl shadow-modal border border-gray-100 dark:border-gray-700 w-64 p-3">
              <div class="grid grid-cols-2 gap-1.5">
                <div v-for="cat in [
                  'ÁMBITO','DELITOS','JURISDICCIÓN','JURISPRUDENCIA VINCULANTE',
                  'MATERIA','ÓRGANO EMISOR','ÓRGANO JURISDICCIONAL','TIPO DE NORMA','TIPO DE RECURSO'
                ]" :key="cat"
                  class="flex items-start gap-1.5 px-2 py-2 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="flex-shrink-0 mt-0.5" style="color:#e91e8c" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span style="font-size:10px;font-weight:600;line-height:1.3;color:#374151">{{ cat }}</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <transition name="fade">
      <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center z-[9999] loading-overlay">
        <div class="loading-card">
          <!-- Logo -->
          <img src="@/assets/img/logos/logo-full.png" alt="Logo" class="loading-logo-img" />
          <!-- Dots -->
          <div class="loading-dots">
            <span class="loading-dot" style="animation-delay:0ms"></span>
            <span class="loading-dot" style="animation-delay:160ms"></span>
            <span class="loading-dot" style="animation-delay:320ms"></span>
          </div>
          <p class="loading-text">Buscando resultados…</p>
        </div>
      </div>
    </transition>

    <ModalMostrarResolucion :openModal="openModal" :toggleModal="() => this.openModal = !this.openModal"
      :pdfUrl="pdfUrl" :data="rowData" :role="role" :currentIndex="currentResultIndex"
      :totalResults="resultados.length" :showNavigation="true" :searchText="filter.GLOBAL"
      :modoBusqueda="modoBusqueda" @navigate="navigateResults" />

    <!-- Scroll to top -->
    <transition name="fade-scale">
      <button v-if="showScrollTop" @click="scrollToTop"
        class="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue text-white shadow-brand flex items-center justify-center hover:shadow-[0_8px_25px_rgba(223,45,178,0.5)] transition-all"
        aria-label="Ir arriba">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </transition>

  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth.store';
import MagistradoProxy from "@/proxies/Magistrados.Proxy.js";
import filterProxy from "@/proxies/FilterProxy.js";
import AdminEntriesProxy from "@/proxies/AdminEntriesProxy.js";
import AiSearchProxy from "@/proxies/AiSearchProxy.js";
import ModalMostrarResolucion from '../shared/modals/ModalMostrarResolucion.vue';
import AppTreeSelect from '@/components/Common/AppTreeSelect.vue';
import AppAutocomplete from '@/components/Common/AppAutocomplete.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import SaveButton from '@/components/Common/SaveButton.vue';
import CancelButton from '@/components/Common/CancelButton.vue';

export default {
    data() {
        return {
            opcionesFiltro: [
                { valor: 1, texto: 'Contenga solamente estas palabras', resena: 'Busca resoluciones que incluyan exclusivamente las palabras ingresadas.' },
                { valor: 2, texto: 'Contenga alguna de estas palabras', resena: 'Busca resoluciones que incluyan al menos una de las palabras ingresadas.' },
                { valor: 3, texto: 'Contenga la frase completa', resena: 'Busca resoluciones que incluyan exactamente la frase ingresada, manteniendo el mismo orden y las mismas palabras.' }
            ],
            modoBusqueda: 3,
            topSearch: [],
            draggedIndex: null,
            dragOverIndex: null,
            typeSaarch: "jurisprudences",
            isFilter: "jurisprudences-generales",
            criterioActual: "year-publication",
            isLoading: false,
            isCollapsed: true,
            isCollapsed2: true,
            showFilters: false,
            hasSearched: false,
            sortOrder: 'desc',
            resultados: [],
            table: { currentPage: 1, perPage: 10, totalRows: 0 },
            default: {
                GLOBAL: null, FRESOLUTION1: [], DELITO: null, NMRCN: null, TPONRMA: null, OEMISOR: null,
                RECURSO: null, OJURISDICCIONAL: null, MAGISTRATES: null, JVINCULANTE: null, FRESOLUTION2: [],
                MATERIA: null, JURISDICCION: null, TITLE: null, CRITERIO: null, KEYWORDS: [], TEMA: null,
                BLOG: false, SUBTEMA: null, AMBITO: null, ESTADO: null
            },
            filter: {
                GLOBAL: null, FRESOLUTION1: [], DELITO: [], NMRCN: [], TPONRMA: [], OEMISOR: [], RECURSO: [],
                OJURISDICCIONAL: [], MAGISTRATES: [], JVINCULANTE: [], FRESOLUTION2: [], MATERIA: [],
                JURISDICCION: [], TITLE: null, TYPE: "jurisprudences", CRITERIO: null, KEYWORDS: null,
                TEMA: null, BLOG: false, SUBTEMA: null, CURRENTPAGE: 1, PERPAGE: 10, INDICADOR: 2,
                AMBITO: [], ESTADO: null
            },
            selects: {
                "MAGISTRATES": [], "DELITOS": [], "ÁMBITO": [], "ÓRGANO JURISDICCIONAL": [],
                "TIPO DE RECURSO": [], "MATERIA": [], "JURISDICCIÓN": [],
                "JURISPRUDENCIA VINCULANTE": [], "TIPO DE NORMA": [], "ÓRGANO EMISOR": [],
            },
            showCard: false,
            expandedSintesis: {},
            normasVinPage: {},
            showHelpButton: true,
            items: [],
            Search,
            pdfUrl: '',
            openModal: false,
            loadingDenominacion: false,
            loadingPalabras: false,
            rowData: {},
            showScrollTop: false,
            showCopyMessage: null,
            currentResultIndex: 0,
            aiQuota: null,
            aiExpandedTerms: [],
            isAiResult: false,
            aiQuery: '',
            aiSuggestion: null,
            useAI: false,
            showAiInfo: false,
        };
    },
    components: { ModalMostrarResolucion, AppTreeSelect, AppAutocomplete, BaseSelect, SaveButton, CancelButton },
    props: { role: { type: Object, default: () => { } } },
    computed: {
        canBuscar() { return useAuthStore().puedeAcceder('busqueda'); },
        canFiltros() { return useAuthStore().puedeAcceder('busqueda.filtros'); },
        ambitoComplianceSelected() {
            if (!this.filter.AMBITO || !this.filter.AMBITO.length) return false;
            const allItems = this.selects['ÁMBITO'] || [];
            return allItems.some(item =>
                item.label?.toLowerCase() === 'compliance' && this.filter.AMBITO.includes(item.value)
            );
        },
        totalPages() {
            return Math.max(1, Math.ceil(this.table.totalRows / this.table.perPage));
        },
        activeFiltersCount() {
            const f = this.filter;
            const arrays = [f.DELITO, f.RECURSO, f.OJURISDICCIONAL, f.MAGISTRATES, f.JVINCULANTE,
                f.MATERIA, f.JURISDICCION, f.AMBITO, f.TPONRMA, f.OEMISOR];
            const scalars = [f.FRESOLUTION1, f.FRESOLUTION2, f.KEYWORDS, f.RTITLE, f.ESTADO];
            const arrCount = arrays.filter(a => Array.isArray(a) && a.length > 0).length;
            const sclCount = scalars.filter(v => v && v !== '' && (!Array.isArray(v) || v.length > 0)).length;
            return arrCount + sclCount + (f.BLOG ? 1 : 0);
        },
        paginationPages() {
            const total = this.totalPages;
            const current = this.table.currentPage;
            if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
            const pages = [1];
            if (current > 3) pages.push('...');
            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
            if (current < total - 2) pages.push('...');
            pages.push(total);
            return pages;
        },
    },
    methods: {
        scrollLeft() {
            const container = this.$refs.scrollContainer;
            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
        },
        scrollRight() {
            const container = this.$refs.scrollContainer;
            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
        },
        scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); },
        handleScroll() {
            const scrollPosition = window.scrollY;
            this.showScrollTop = scrollPosition > 300;
            this.showHelpButton = scrollPosition < 200;
            if (scrollPosition > 200 && this.showCard) this.showCard = false;
        },
        toggleCard() { this.showCard = !this.showCard; },
        toggleSintesis(index) {
            this.expandedSintesis = { ...this.expandedSintesis, [index]: !this.expandedSintesis[index] };
        },
        parseJIDSVIN(item) {
            if (!item.JIDSVIN) return [];
            try {
                const parsed = JSON.parse(item.JIDSVIN);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        },
        normasVinPaged(item, index) {
            const perPage = 5;
            const page = this.normasVinPage[index] || 1;
            const start = (page - 1) * perPage;
            return this.parseJIDSVIN(item).slice(start, start + perPage);
        },
        normasVinTotalPages(item) {
            return Math.max(1, Math.ceil(this.parseJIDSVIN(item).length / 5));
        },
        setNormasVinPage(index, page) {
            this.normasVinPage = { ...this.normasVinPage, [index]: page };
        },
        navigateToNorma(norma) {
            const basePath = this.$route.path.includes('/admin/') ? '/admin/busqueda' : '/usuario/busqueda';
            const route = this.$router.resolve({ path: basePath, query: { id: norma.ID, search: norma.TITLE } });
            window.open(route.href, '_blank');
        },
        handleCheckChange(data, checked, filterKey, refName) {
            this.$nextTick(() => {
                let sourceData;
                if (filterKey === 'DELITO') sourceData = this.selects.DELITOS;
                else if (filterKey === 'OJURISDICCIONAL') sourceData = this.selects['ÓRGANO JURISDICCIONAL'];
                else if (filterKey === 'JVINCULANTE') sourceData = this.selects['JURISPRUDENCIA VINCULANTE'];
                if (!sourceData) return;
                const treeSelectRef = this.$refs[refName];
                const filterText = treeSelectRef?.filterText || '';
                const findNode = (nodes, value) => {
                    for (let node of nodes) {
                        if (node.value === value) return node;
                        if (node.children && node.children.length > 0) {
                            const found = findNode(node.children, value);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                const parentNode = findNode(sourceData, data.value);
                if (!parentNode || !parentNode.children || parentNode.children.length === 0) return;
                const collectFilteredChildren = (node, parentNodeObj = null) => {
                    const values = [];
                    if (node.children && node.children.length > 0) {
                        node.children.forEach(child => {
                            const fakeNode = { data: child, parent: parentNodeObj };
                            const passesFilter = this.filterTreeNode(filterText, child, fakeNode);
                            if (passesFilter) {
                                values.push(child.value);
                                values.push(...collectFilteredChildren(child, fakeNode));
                            }
                        });
                    }
                    return values;
                };
                const childrenValues = collectFilteredChildren(parentNode);
                if (childrenValues.length > 0) {
                    const currentValues = [...this.filter[filterKey]];
                    if (checked) {
                        this.filter[filterKey] = [...new Set([...currentValues, ...childrenValues])];
                    } else {
                        const allDescendants = [];
                        const getAllDescendants = (node) => {
                            if (node.children && node.children.length > 0) {
                                node.children.forEach(child => {
                                    allDescendants.push(child.value);
                                    getAllDescendants(child);
                                });
                            }
                        };
                        getAllDescendants(parentNode);
                        this.filter[filterKey] = currentValues.filter(v => !allDescendants.includes(v));
                    }
                }
            });
        },
        filterTreeNode(value, data, node) {
            if (!value) return true;
            const hasMatchingAncestor = (currentNode) => {
                if (!currentNode || !currentNode.parent) return false;
                const parentData = currentNode.parent.data;
                if (parentData && parentData.label && parentData.label.toLowerCase().includes(value.toLowerCase())) return true;
                return hasMatchingAncestor(currentNode.parent);
            };
            const hasMatchingDescendant = (nodeData) => {
                if (!nodeData) return false;
                if (nodeData.label && nodeData.label.toLowerCase().includes(value.toLowerCase())) return true;
                if (nodeData.children && nodeData.children.length > 0) return nodeData.children.some(child => hasMatchingDescendant(child));
                return false;
            };
            if (data.label && data.label.toLowerCase().includes(value.toLowerCase())) return true;
            if (hasMatchingAncestor(node)) return true;
            if (hasMatchingDescendant(data)) return true;
            return false;
        },
        formateReverse(date) {
            try {
                if (!date) return null;
                const parts = date.split('-');
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            } catch (error) { return null; }
        },
        async openModalWithData(item, index) {
            const previousState = item.ISOPEN;
            item.ISOPEN = 1;
            if (previousState === 0) {
                AdminEntriesProxy.saveOpenEntrie({ IDENTRIE: item.ID }).catch(() => {});
            }
            this.rowData = item;
            this.currentResultIndex = index;
            this.openModal = true;
        },
        async navigateResults(direction) {
            if (direction === 'next' && this.currentResultIndex < this.resultados.length - 1) this.currentResultIndex++;
            else if (direction === 'prev' && this.currentResultIndex > 0) this.currentResultIndex--;
            this.rowData = this.resultados[this.currentResultIndex];
            const previousState = this.rowData.ISOPEN;
            this.rowData.ISOPEN = 1;
            if (previousState === 0) {
                AdminEntriesProxy.saveOpenEntrie({ IDENTRIE: this.rowData.ID }).catch(() => {});
            }
        },
        searchGlobal(query, callback) {
            if (!query || query.length < 3) { callback([]); return; }
            AdminEntriesProxy.filtersBusquedaSearch({ GLOBAL: query, INDICADOR: 0 })
                .then((response) => {
                    const items = Array.isArray(response) ? response : (response?.DATA ?? []);
                    const suggestions = items.map((item) => ({ value: item?.DESCP?.trim() })).filter(s => s.value);
                    callback(suggestions);
                })
                .catch(() => callback([]));
        },
        // Convierte una palabra/frase (con o sin tildes) en un patrón regex que
        // matchea sin importar tildes de ningún lado: "martin" encuentra "Martín"
        // y viceversa. Ya incluye el escape de caracteres especiales de regex.
        accentInsensitivePattern(str) {
            const ACCENTS = { a: 'aàáâä', e: 'eèéêë', i: 'iìíîï', o: 'oòóôö', u: 'uùúûü', n: 'nñ', c: 'cç' };
            const stripped = str.normalize('NFD').replace(/[̀-ͯ]/g, '');
            return stripped.split('').map(ch => {
                // "N°" (grado, U+00B0) y "Nº" (ordinal, U+00BA) se usan
                // indistintamente para "número" pero son caracteres distintos:
                // se tratan como equivalentes para que el resaltado funcione
                // sin importar cuál haya escrito el usuario o cuál esté guardado.
                if (ch === '°' || ch === 'º') return '[°º]';
                const lower = ch.toLowerCase();
                if (ACCENTS[lower]) {
                    const variants = ACCENTS[lower];
                    return `[${variants}${variants.toUpperCase()}]`;
                }
                return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }).join('');
        },
        highlightGlobal(text) {
            if (!text || !this.filter.GLOBAL) return text;
            const searchText = typeof this.filter.GLOBAL === 'object' ? this.filter.GLOBAL.value : this.filter.GLOBAL;
            if (!searchText || searchText.trim() === '') return text;
            const pattern = this.accentInsensitivePattern(searchText.trim());
            return text.replace(new RegExp(`(${pattern})`, 'gi'), '<strong class="highlight-denominacion">$1</strong>');
        },
        searchDenominacionOficial(query, callback) {
            if (!query || query.length < 3) { callback([]); return; }
            this.loadingDenominacion = true;
            AdminEntriesProxy.filtersBusquedaSearch({ GLOBAL: query, INDICADOR: 1 })
                .then((response) => {
                    const items = Array.isArray(response) ? response : (response?.DATA ?? []);
                    const suggestions = items.map((item) => ({ value: item?.DESCP?.trim() })).filter(s => s.value);
                    callback(suggestions);
                })
                .catch(() => callback([]))
                .finally(() => { this.loadingDenominacion = false; });
        },
        highlightDenominacion(text) {
            if (!text || !this.filter.RTITLE) return text;
            const searchText = typeof this.filter.RTITLE === 'object' ? this.filter.RTITLE.value : this.filter.RTITLE;
            if (!searchText || searchText.trim() === '') return text;
            const pattern = this.accentInsensitivePattern(searchText.trim());
            return text.replace(new RegExp(`(${pattern})`, 'gi'), '<strong class="highlight-denominacion">$1</strong>');
        },
        searchPalabrasClaves(query, callback) {
            if (!query || query.length < 3) { callback([]); return; }
            this.loadingPalabras = true;
            AdminEntriesProxy.filtersBusquedaSearch({ GLOBAL: query, INDICADOR: 2 })
                .then((response) => {
                    const items = Array.isArray(response) ? response : (response?.DATA ?? []);
                    const suggestions = items.map((item) => ({ value: item?.DESCP?.trim() })).filter(s => s.value);
                    callback(suggestions);
                })
                .catch(() => callback([]))
                .finally(() => { this.loadingPalabras = false; });
        },
        handlePalabraSelect(item) { if (item && item.isEmpty) this.filter.KEYWORDS = null; },
        handleDenominacionSelect(item) { if (item && item.isEmpty) this.filter.RTITLE = null; },
        handleGlobalSelect(item) {
            if (item && item.isEmpty) { this.filter.GLOBAL = null; return; }
            if (!useAuthStore().puedeAcceder('busqueda')) {
                toast.warn('No tienes acceso a la búsqueda en tu plan actual');
                return;
            }
            this.searchGlobalOnly();
        },
        highlightPalabrasClaves(text) {
            if (!text || !this.filter.KEYWORDS) return text;
            const searchText = typeof this.filter.KEYWORDS === 'object' ? this.filter.KEYWORDS.value : this.filter.KEYWORDS;
            if (!searchText || searchText.trim() === '') return text;
            const pattern = this.accentInsensitivePattern(searchText.trim());
            return text.replace(new RegExp(`(${pattern})`, 'gi'), '<strong class="highlight-denominacion">$1</strong>');
        },
        handleSearch(page) {
            let filtro = { INIT: ((page - 1) <= 0 ? 0 : (page - 1)) * this.table.perPage, ROWS: this.table.perPage };
            this.search(filtro);
        },
        async clearTopSearch(index, objetItem) {
            this.topSearch.splice(index, 1);
            await AdminEntriesProxy.clearTopSearch(objetItem.ID)
                .catch(() => { this.topSearch.splice(index, 0, objetItem); });
        },
        async listTopSearch() {
            await AdminEntriesProxy.listTopSearch(this.typeSaarch)
                .then((response) => {
                    const items = Array.isArray(response) ? response : (response?.DATA ?? []);
                    this.topSearch = items
                        .map((item) => ({ ID: item?.id, DESCP: item?.termino?.trim(), MODO: item?.modo, ORDEN: item?.orden }))
                        .filter(item => item.DESCP);
                })
                .catch(() => { this.topSearch = []; });
        },
        onDragStart(index) { this.draggedIndex = index; },
        onDragOver(index) { this.dragOverIndex = index; },
        async onDrop(targetIndex) {
            if (this.draggedIndex === null || this.draggedIndex === targetIndex) return;
            const draggedItem = this.topSearch[this.draggedIndex];
            const targetItem = this.topSearch[targetIndex];
            const originalTopSearch = [...this.topSearch];
            const newTopSearch = [...this.topSearch];
            [newTopSearch[this.draggedIndex], newTopSearch[targetIndex]] = [newTopSearch[targetIndex], newTopSearch[this.draggedIndex]];
            this.topSearch = newTopSearch;
            try {
                const response = await AdminEntriesProxy.intercambioOrderSearch(draggedItem.ID, targetItem.ID);
                const ok = response?.DATA?.STATUS ?? response?.STATUS;
                if (!ok) this.topSearch = originalTopSearch;
            } catch (error) {
                this.topSearch = originalTopSearch;
            } finally {
                this.draggedIndex = null;
                this.dragOverIndex = null;
            }
        },
        onDragEnd() { this.draggedIndex = null; this.dragOverIndex = null; },
        async search(ffff = {}) {
            this.isAiResult = false;
            this.hasSearched = true;
            this.isCollapsed = false;
            this.isCollapsed2 = true;
            this.showFilters = true;
            let filtro = { ...this.filter, ...ffff };
            filtro.TYPE = this.typeSaarch;
            this.isLoading = true;
            let FRESOLUTIONFILTER = null;
            if (filtro.FRESOLUTION1 && filtro.FRESOLUTION2) FRESOLUTIONFILTER = filtro.FRESOLUTION1 + ',' + filtro.FRESOLUTION2;
            else if (filtro.FRESOLUTION1) FRESOLUTIONFILTER = filtro.FRESOLUTION1 + ',';
            else if (filtro.FRESOLUTION2) FRESOLUTIONFILTER = ',' + filtro.FRESOLUTION2;
            await AdminEntriesProxy.search({
                ...filtro,
                GLOBAL: filtro.GLOBAL?.DESCP || filtro.GLOBAL,
                FRESOLUTION: FRESOLUTIONFILTER,
                DELITO: filtro.DELITO ? filtro.DELITO.join(",") : null,
                RECURSO: filtro.RECURSO ? filtro.RECURSO.join(",") : null,
                OJURISDICCIONAL: filtro.OJURISDICCIONAL ? filtro.OJURISDICCIONAL.join(",") : null,
                MAGISTRATES: filtro.MAGISTRATES ? filtro.MAGISTRATES.join(",") : null,
                JVINCULANTE: filtro.JVINCULANTE ? filtro.JVINCULANTE.join(",") : null,
                MATERIA: filtro.MATERIA ? filtro.MATERIA.join(",") : null,
                JURISDICCION: filtro.JURISDICCION ? filtro.JURISDICCION.join(",") : null,
                ROWS: filtro?.ROWS || 10,
                INIT: filtro?.INIT || 0,
                NMRCN: filtro.NMRCN,
                TYPE: this.typeSaarch,
                AMBIT: filtro.AMBITO && filtro.AMBITO.length ? filtro.AMBITO.join(",") : null,
                ESTADO: filtro.ESTADO || null,
                TPONRMA: filtro.TPONRMA ? filtro.TPONRMA.join(",") : null,
                OEMISOR: filtro.OEMISOR ? filtro.OEMISOR.join(",") : null,
                KEYWORDS: filtro.KEYWORDS || null,
                TEMA: filtro.TEMA,
                SUBTEMA: filtro.SUBTEMA,
                BLOG: filtro.BLOG ? 'emblematic' : null,
                MODO: this.modoBusqueda,
                ORDER: this.sortOrder
            })
                .then(async (response) => {
                    const rows = Array.isArray(response) ? response : (response?.DATA ?? []);
                    this.resultados = rows.map((item) => this.mapResultItem(item));
                    this.table.totalRows = rows[0]?.TOTALROWS || 0;
                    const term = filtro.GLOBAL?.DESCP || filtro.GLOBAL;
                    if (term && String(term).trim().length >= 3) {
                        await AdminEntriesProxy.saveSearch({ GLOBAL: String(term).trim(), TYPE: this.typeSaarch, MODO: this.modoBusqueda }).catch(() => {});
                    }
                    await this.listTopSearch();
                })
                .catch(() => { toast.error("Ocurrió un error al buscar", { toastId: "error" }); })
                .finally(() => { this.isLoading = false; });
        },
        async searchGlobalOnly(ffff = {}) {
            this.isAiResult = false;
            this.hasSearched = true;
            this.isCollapsed = false;
            this.isCollapsed2 = true;
            this.showFilters = true;
            let filtro = { ...this.filter, ...ffff };
            this.isLoading = true;
            let FRESOLUTIONFILTER = null;
            if (filtro.FRESOLUTION1 && filtro.FRESOLUTION2) FRESOLUTIONFILTER = filtro.FRESOLUTION1 + ',' + filtro.FRESOLUTION2;
            else if (filtro.FRESOLUTION1) FRESOLUTIONFILTER = filtro.FRESOLUTION1 + ',';
            else if (filtro.FRESOLUTION2) FRESOLUTIONFILTER = ',' + filtro.FRESOLUTION2;
            await AdminEntriesProxy.search({
                ...filtro,
                GLOBAL: filtro.GLOBAL?.DESCP || filtro.GLOBAL,
                FRESOLUTION: FRESOLUTIONFILTER,
                DELITO: filtro.DELITO ? filtro.DELITO.join(",") : null,
                RECURSO: filtro.RECURSO ? filtro.RECURSO.join(",") : null,
                OJURISDICCIONAL: filtro.OJURISDICCIONAL ? filtro.OJURISDICCIONAL.join(",") : null,
                MAGISTRATES: filtro.MAGISTRATES ? filtro.MAGISTRATES.join(",") : null,
                JVINCULANTE: filtro.JVINCULANTE ? filtro.JVINCULANTE.join(",") : null,
                MATERIA: filtro.MATERIA ? filtro.MATERIA.join(",") : null,
                JURISDICCION: filtro.JURISDICCION ? filtro.JURISDICCION.join(",") : null,
                ROWS: filtro?.ROWS || 10,
                INIT: filtro?.INIT || 0,
                NMRCN: filtro.NMRCN,
                TYPE: null,
                AMBIT: filtro.AMBITO && filtro.AMBITO.length ? filtro.AMBITO.join(",") : null,
                ESTADO: filtro.ESTADO || null,
                TPONRMA: filtro.TPONRMA ? filtro.TPONRMA.join(",") : null,
                OEMISOR: filtro.OEMISOR ? filtro.OEMISOR.join(",") : null,
                KEYWORDS: filtro.KEYWORDS || null,
                TEMA: filtro.TEMA,
                SUBTEMA: filtro.SUBTEMA,
                BLOG: filtro.BLOG ? 'emblematic' : null,
                MODO: this.modoBusqueda,
                ORDER: this.sortOrder
            })
                .then(async (response) => {
                    const rows = Array.isArray(response) ? response : (response?.DATA ?? []);
                    this.resultados = rows.map((item) => this.mapResultItem(item));
                    this.table.totalRows = rows[0]?.TOTALROWS || 0;
                    const term = filtro.GLOBAL?.DESCP || filtro.GLOBAL;
                    if (term && String(term).trim().length >= 3) {
                        await AdminEntriesProxy.saveSearch({ GLOBAL: String(term).trim(), TYPE: this.typeSaarch, MODO: this.modoBusqueda }).catch(() => {});
                    }
                    await this.listTopSearch();
                })
                .catch(() => { toast.error("Ocurrió un error al buscar", { toastId: "error" }); })
                .finally(() => { this.isLoading = false; });
        },
        clearGlobalOnly() {
            this.filter.GLOBAL = null;
            this.resultados = [];
            this.table.currentPage = 1;
            this.table.perPage = 10;
            this.table.totalRows = 0;
            this.hasSearched = false;
        },
        async searchByNormaId(id) {
            this.hasSearched = true;
            this.isCollapsed = false;
            this.isCollapsed2 = true;
            this.showFilters = true;
            this.isLoading = true;
            await AdminEntriesProxy.search({ ID: id, ROWS: 10, INIT: 0 })
                .then((response) => {
                    if (!response) { this.resultados = []; this.table.totalRows = 0; return; }
                    this.resultados = response?.map((item) => this.mapResultItem(item));
                    this.table.totalRows = response?.[0]?.TOTALROWS || 0;
                })
                .catch(() => { toast.error("Ocurrió un error al buscar", { toastId: "error" }); })
                .finally(() => { this.isLoading = false; });
        },
        safeJson(val) {
            if (!val) return [];
            try { return JSON.parse(val) || []; } catch { return []; }
        },
        mapResultItem(item) {
            const ss = item?.SHORTSUMMARY && item.SHORTSUMMARY !== '' ? item.SHORTSUMMARY : null;
            return {
                ...item,
                DELITO: this.safeJson(item.DELITO),
                TPONRMA: this.safeJson(item.TPONRMA),
                OEMISOR: this.safeJson(item.OEMISOR),
                RECURSO: this.safeJson(item.RECURSO),
                OJURISDICCIONAL: this.safeJson(item.OJURISDICCIONAL),
                AMBIT: this.safeJson(item.AMBIT),
                JURISDICCION: this.safeJson(item.JURISDICCION),
                MAGISTRATES: this.safeJson(item.MAGISTRATES),
                FRESOLUTION: item.FRESOLUTION ? item.FRESOLUTION.split('T')[0] : null,
                TEMA: item?.TEMA || null,
                SUBTEMA: item?.SUBTEMA || null,
                SHORTSUMMARY: ss,
                SHORTSUMMARY2: ss ? this.setPalabras(ss.replace(/<[^>]*>?/gm, ''), 18) : null,
                SHORTSUMMARY3: ss ? this.setPalabras(ss.replace(/<[^>]*>?/gm, ''), 10000, false) : null,
            };
        },
        setPalabras(palabra, cantidad = 15, isBandera = true) {
            if (!palabra) return "";
            return palabra.split(" ").slice(0, cantidad).join(" ") + (isBandera ? "..." : "") || "";
        },
        async filtersAll() {
            this.isLoading = true;
            try {
                const [magistradosRes, filtersRes, filtersRes2] = await Promise.all([
                    MagistradoProxy.list({ ROWS: 1000, INIT: 0, DESC: null, CESTDO: null }, 2).catch(() => ({ data: [] })),
                    filterProxy.list({ NIVEL: 5, CESTDO: '' }, '1', 2).catch(() => []),
                    filterProxy.list({ NIVEL: 5, CESTDO: '' }, '2', 2).catch(() => []),
                ]);
                const magistList = Array.isArray(magistradosRes) ? magistradosRes : (magistradosRes?.data ?? []);
                this.selects['MAGISTRATES'] = magistList
                    .map(i => ({ value: i.id ?? i.ID, label: ((i.apellidos ?? i.APELLIDOS ?? '') + ' ' + (i.nombres ?? i.NOMBRES ?? '')).trim().replace(/null/g, '') }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                const mapN = (n) => n?.map(i => ({
                    value: i.VALUE, label: i.LABEL,
                    children: mapN(i.NIVEL_3 || i.NIVEL_4 || i.NIVEL_5 || [])
                })) || [];
                const cfg = (data, label) => {
                    try {
                        return data.filter(i => i.LABEL.toUpperCase() === label.toUpperCase())
                            .map(i => ({ ...i, NIVEL_2: JSON.parse(i.NIVEL_2) }))[0] || {};
                    } catch { return {}; }
                };
                if (filtersRes?.length) {
                    this.selects['ÁMBITO'] = mapN(cfg(filtersRes, 'ÁMBITO')?.NIVEL_2);
                    this.selects['ÓRGANO JURISDICCIONAL'] = mapN(cfg(filtersRes, 'ÓRGANO JURISDICCIONAL')?.NIVEL_2);
                    this.selects['DELITOS'] = mapN(cfg(filtersRes, 'DELITOS')?.NIVEL_2);
                    this.selects['TIPO DE RECURSO'] = mapN(cfg(filtersRes, 'TIPO DE RECURSO')?.NIVEL_2);
                    this.selects['MATERIA'] = mapN(cfg(filtersRes, 'MATERIA')?.NIVEL_2);
                    this.selects['JURISDICCIÓN'] = mapN(cfg(filtersRes, 'JURISDICCIÓN')?.NIVEL_2);
                    this.selects['JURISPRUDENCIA VINCULANTE'] = mapN(cfg(filtersRes, 'JURISPRUDENCIA VINCULANTE')?.NIVEL_2);
                }
                if (filtersRes2?.length) {
                    this.selects['TIPO DE NORMA'] = mapN(cfg(filtersRes2, 'TIPO DE NORMA')?.NIVEL_2);
                    this.selects['ÓRGANO EMISOR'] = mapN(cfg(filtersRes2, 'ÓRGANO EMISOR')?.NIVEL_2);
                }
                this.items = [...(filtersRes || []), ...(filtersRes2 || [])].map(item => ({ title: item.LABEL, description: item.DESCPINF }));
            } catch (error) {
                toast.error('Ocurrió un error al cargar los filtros', { toastId: 'error' });
            } finally {
                this.isLoading = false;
            }
        },
        cortarDescripcion(texto) {
            if (texto.length > 30) return texto.slice(0, 30) + '...';
            return texto;
        },
        highlightText(text) {
            if (!text) return text;
            const stopWords = ['el','la','los','las','un','una','unos','unas','de','del','al','a','ante','bajo','con','contra','desde','en','entre','hacia','hasta','para','por','según','sin','sobre','tras','y','e','o','u','ni','que','pero','sino','mas','este','esta','estos','estas','ese','esa','esos','esas','aquel','aquella','aquellos','aquellas','su','sus','mi','mis','tu','tus','nuestro','nuestra','nuestros','nuestras','se','lo','le','les','me','te','nos','os','es','son','está','están','fue','fueron','ha','han','había','habían','como','cuando','donde','cual','cuales','quien','quienes'];
            let regex;
            // Resultados IA: siempre resaltar palabra por palabra con el query IA
            if (this.isAiResult && this.aiQuery) {
                const words = this.aiQuery.trim().split(/\s+/).filter(w => !stopWords.includes(w.toLowerCase()) && w.length > 2);
                if (!words.length) return text;
                const patterns = words.map(w => this.accentInsensitivePattern(w));
                regex = new RegExp(`(${patterns.join('|')})`, 'gi');
                return text.replace(regex, '<mark class="highlight-text">$1</mark>');
            }
            // Búsqueda normal
            if (!this.filter.GLOBAL) return text;
            const searchText = typeof this.filter.GLOBAL === 'object' ? this.filter.GLOBAL.DESCP : this.filter.GLOBAL;
            if (!searchText || searchText.trim() === '') return text;
            const searchWords = searchText.trim().split(/\s+/);
            if (this.modoBusqueda === 1 || this.modoBusqueda === 2) {
                const filteredWords = searchWords.filter(word => !stopWords.includes(word.toLowerCase()) && word.length > 0);
                if (filteredWords.length === 0) return text;
                const patterns = filteredWords.map(word => this.accentInsensitivePattern(word));
                regex = new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi');
            } else if (this.modoBusqueda === 3) {
                const phrasePattern = this.accentInsensitivePattern(searchText.trim());
                regex = new RegExp(`(${phrasePattern})`, 'gi');
            }
            return text.replace(regex, '<mark class="highlight-text">$1</mark>');
        },
        copyToClipboard(item, index) {
            if (!useAuthStore().puedeAcceder('busqueda.copiar')) {
                toast.warn('No tienes acceso a copiar en tu plan actual');
                return;
            }
            let textToCopy = '';
            if (item.TYPE === 'jurisprudences') textToCopy = item.TITULO || '';
            else if (item.TYPE === 'legislations') {
                const titulo = item.TITULO || '';
                const denominacion = item.RTITLE || '';
                textToCopy = denominacion ? `${titulo} - ${denominacion}` : titulo;
            } else textToCopy = item.TITULO || '';
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    this.showCopyMessage = index;
                    setTimeout(() => { this.showCopyMessage = null; }, 1500);
                })
                .catch(() => {});
        },
        onClear(indicador = 0) {
            this.filter.GLOBAL = null; this.filter.FRESOLUTION1 = null; this.filter.DELITO = [];
            this.filter.NMRCN = null; this.filter.TPONRMA = []; this.filter.OEMISOR = null;
            this.filter.RECURSO = []; this.filter.OJURISDICCIONAL = []; this.filter.MAGISTRATES = [];
            this.filter.JVINCULANTE = []; this.filter.FRESOLUTION2 = null; this.filter.MATERIA = [];
            this.filter.JURISDICCION = []; this.filter.TITLE = null; this.filter.CRITERIO = null;
            this.filter.KEYWORDS = null; this.filter.TEMA = null; this.filter.BLOG = false;
            this.filter.SUBTEMA = null; this.filter.AMBITO = []; this.filter.ESTADO = null;
            this.sortOrder = 'desc';
            this.isCollapsed = true; this.showFilters = false; this.resultados = [];
            this.table.currentPage = 1; this.table.perPage = 10; this.table.totalRows = 0;
            if (indicador == 1) { this.resultados = []; this.table.currentPage = 1; return; }
            this.handleSearch(1);
        },
        executionsSearch(searchQuestions) {
            this.filter.GLOBAL = searchQuestions.DESCP;
            if (searchQuestions.MODO === 'AI') {
                this.searchAI(searchQuestions.ID);
            } else {
                if (!useAuthStore().puedeAcceder('busqueda')) {
                    toast.warn('No tienes acceso a la búsqueda en tu plan actual');
                    return;
                }
                this.modoBusqueda = (searchQuestions.MODO && !isNaN(parseInt(searchQuestions.MODO))) ?
                    parseInt(searchQuestions.MODO) : this.modoBusqueda;
                this.searchGlobalOnly();
            }
        },
        doSearch() {
            if (!useAuthStore().puedeAcceder('busqueda')) {
                toast.warn('No tienes acceso a la búsqueda en tu plan actual');
                return;
            }
            if (this.useAI) {
                this.searchAI();
                return;
            }
            this.searchGlobalOnly();
        },
        async loadQuota() {
            console.log('[AI-FRONT] loadQuota() iniciado');
            try {
                this.aiQuota = await AiSearchProxy.getQuota();
                console.log('[AI-FRONT] aiQuota recibido:', this.aiQuota);
            } catch (err) {
                console.error('[AI-FRONT] Error en loadQuota:', err);
            }
        },
        applyAiSuggestion(suggestion) {
            this.filter.GLOBAL = suggestion;
            this.useAI = true;
            this.searchAI();
        },
        async searchAI(busquedaId = null) {
            if (!useAuthStore().puedeAcceder('busqueda.ia')) {
                toast.warn('No tienes acceso a la búsqueda con IA en tu plan actual');
                return;
            }
            const rawQuery = this.filter.GLOBAL?.DESCP || this.filter.GLOBAL;
            if (!rawQuery || String(rawQuery).trim().length < 2) {
                toast.warning('Escribe una consulta para buscar con IA', { toastId: 'ai-warn' });
                return;
            }
            this.aiQuery = String(rawQuery).trim();
            this.isLoading = true;
            this.isAiResult = false;
            this.aiSuggestion = null;
            this.aiExpandedTerms = [];
            this.hasSearched = true;
            this.isCollapsed2 = true;
            try {
                const response = await AiSearchProxy.search({
                    query: String(rawQuery).trim(),
                    ...(busquedaId ? { busquedaId } : {}),
                    filters: {
                        type: this.typeSaarch,
                        ...(this.filter.AMBITO?.length ? { ambit: this.filter.AMBITO[0] } : {}),
                    },
                });
                if (response.hasQuota === false) {
                    toast.warning(response.message || 'Cuota mensual agotada', { toastId: 'ai-quota' });
                    if (response.quota) this.aiQuota = response.quota;
                    return;
                }
                this.resultados = (response.results || []).map(item => this.mapAiResultItem(item));
                this.table.totalRows = response.total || 0;
                this.table.currentPage = 1;
                this.aiExpandedTerms = response.expandedTerms || [];
                this.aiQuota = response.quota || this.aiQuota;
                this.isAiResult = true;
                this.aiSuggestion = response.total === 0 ? (response.suggestion || null) : null;
                if (response.total > 0) this.listTopSearch();
            } catch (err) {
                console.error('[AI-FRONT] Error en searchAI:', err);
                toast.error('Error al realizar la búsqueda con IA', { toastId: 'ai-error' });
            } finally {
                this.isLoading = false;
            }
        },
        mapAiResultItem(entity) {
            // el backend ahora devuelve SQL raw con campos UPPERCASE y filtroJson resueltos
            const ss = entity.SHORTSUMMARY && entity.SHORTSUMMARY !== '' ? entity.SHORTSUMMARY : null;
            const toArr = (val) => {
                if (!val) return [];
                if (Array.isArray(val)) return val.map(v => typeof v === 'object' ? v : { DESCP: String(v) });
                try { const p = JSON.parse(val); return Array.isArray(p) ? p : [{ DESCP: String(val) }]; } catch (_) { /* no es JSON */ }
                return val.split(',').map(v => ({ DESCP: v.trim() })).filter(v => v.DESCP);
            };
            return {
                ID: entity.ID,
                TITULO: entity.TITULO,
                RTITLE: entity.RTITLE,
                TYPE: entity.TYPE,
                AMBIT: toArr(entity.AMBIT),
                MATERIA: toArr(entity.MATERIA),
                DELITO: toArr(entity.DELITO),
                RECURSO: toArr(entity.RECURSO),
                OJURISDICCIONAL: toArr(entity.OJURISDICCIONAL),
                JURISDICCION: toArr(entity.JURISDICCION),
                OEMISOR: toArr(entity.OEMISOR),
                TPONRMA: toArr(entity.TPONRMA),
                MAGISTRATES: (() => {
                    if (!entity.MAGISTRATES) return [];
                    try {
                        const parsed = JSON.parse(entity.MAGISTRATES);
                        if (Array.isArray(parsed)) return parsed;
                    } catch (_) { /* no es JSON */ }
                    // String pipe-separado: "APELLIDOS, Nombres | APELLIDOS2, Nombres2"
                    return entity.MAGISTRATES.split('|').map(s => ({ LABEL: s.trim() })).filter(o => o.LABEL);
                })(),
                KEYWORDS: entity.KEYWORDS || null,
                CASO: entity.CASO,
                FRESOLUTION: entity.FRESOLUTION ? String(entity.FRESOLUTION).split('T')[0] : null,
                ISOPEN: 0,
                IDFAV: entity.IDFAV || 0,
                SHORTSUMMARY: ss,
                SHORTSUMMARY2: ss ? this.setPalabras(ss.replace(/<[^>]*>?/gm, ''), 18) : null,
                SHORTSUMMARY3: ss ? this.setPalabras(ss.replace(/<[^>]*>?/gm, ''), 10000, false) : null,
                INDICADOR: entity.ISBINDING ? 1 : 0,
                TEMA: entity.TEMA || null,
                SUBTEMA: entity.SUBTEMA || null,
                FLGDOC: entity.FLGDOC,
                FLGSTORAGE: entity.FLGSTORAGE || null,
                TOTALROWS: 0,
                ISAI: true,
            };
        },
    },
    watch: {
        "role": { immediate: true },
        "filter.TYPE": { handler() { this.filter = { ...this.filter, ...this.default } }, immediate: true },
        "isFilter": { handler() { this.filter = { ...this.filter, ...this.default } }, immediate: true },
        "typeSaarch": {
            handler(newValue, oldValue) {
                this.listTopSearch();
                if (oldValue !== undefined && this.hasSearched) this.handleSearch(1);
            },
            immediate: true,
        },
    },
    mounted() {
        this.isLoading = true;
        this.listTopSearch();
        this.filtersAll();
        this.loadQuota();
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
        const { search, id } = this.$route.query;
        if (id) {
            this.filter.GLOBAL = search || '';
            this.$nextTick(() => { this.searchByNormaId(id); });
        }
    },
    beforeUnmount() { window.removeEventListener('scroll', this.handleScroll); }
};
</script>

<style scoped>
/* ── Oculta la barra de scroll visual de los accesos rápidos, sin quitar
   la posibilidad de desplazar (mouse wheel, drag, o flechas) ────────── */
.no-scrollbar {
  scrollbar-width: none;    /* Firefox */
  -ms-overflow-style: none; /* IE/Edge legacy */
}
.no-scrollbar::-webkit-scrollbar {
  display: none;            /* Chrome/Safari/Edge Chromium */
}

/* ── Page background ─────────────────────────────────── */
.page-bg {
  background: linear-gradient(145deg, #f0f4ff 0%, #f7f0ff 45%, #fff0fb 100%);
  min-height: 100vh;
}
.dark .page-bg {
  background: linear-gradient(145deg, #0d1525 0%, #130d22 45%, #1a0d18 100%);
}

/* ── Hero search ──────────────────────────────────────── */
.search-hero {
  background: transparent;
}

/* Shell: la caja completa del input */
.search-bar-shell {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
  background: rgba(255,255,255,.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(139,92,246,.2);
  border-radius: 14px;
  padding: 4px 4px 4px 14px;
  gap: 4px;
  box-shadow: 0 4px 24px rgba(139,92,246,.12), 0 1px 4px rgba(0,0,0,.06);
  transition: border-color .2s, box-shadow .2s;
}
.search-bar-shell:focus-within {
  border-color: #ececec;
}
.dark .search-bar-shell {
  background: #1a2035; border-color: #2d3748;
  box-shadow: 0 2px 12px rgba(0,0,0,.3);
}
.dark .search-bar-shell:focus-within { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }

/* Lupa */
.search-bar-lupe { width: 18px; height: 18px; color: #9CA3AF; flex-shrink: 0; }

/* Botones icono dentro del shell */
.search-bar-icon-btn {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  color: #6B7280; transition: background .15s, color .15s;
}
.search-bar-icon-btn:hover { background: #F3F4F6; color: #185CE6; }
.search-bar-icon-btn--active { background: #EFF6FF; color: #185CE6; }
.dark .search-bar-icon-btn:hover { background: #2d3748; }
.dark .search-bar-icon-btn--active { background: #1e3a5f; color: #6B9EFF; }

/* Badge contador filtros activos */
.filter-badge {
  position: absolute; top: 2px; right: 2px;
  min-width: 14px; height: 14px; padding: 0 3px;
  background: #DF2DB2; color: #fff;
  font-size: 9px; font-weight: 700; line-height: 14px;
  border-radius: 999px; text-align: center;
}

/* Botón Buscar integrado */
.search-bar-submit {
  display: inline-flex; align-items: center; gap: 6px;
  height: 38px; padding: 0 20px;
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  background-size: 200% 200%;
  color: #fff; font-size: .875rem; font-weight: 700;
  border-radius: 10px; white-space: nowrap; flex-shrink: 0;
  transition: background-position .3s, box-shadow .2s, transform .1s;
  box-shadow: 0 2px 8px rgba(24,92,230,.3);
}
.search-bar-submit:hover {
  background-position: 100% 100%;
  box-shadow: 0 4px 16px rgba(24,92,230,.4);
  transform: translateY(-1px);
}
.search-bar-submit:active { transform: translateY(0); }

/* Botón Limpiar integrado */
.search-bar-clear {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; flex-shrink: 0;
  border-radius: 8px; color: #9ca3af;
  transition: color .2s, background .2s;
}
.search-bar-clear:hover { color: #DF2DB2; background: rgba(223,45,178,.08); }

/* Quick access chips */
.quick-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.75); backdrop-filter: blur(6px);
  border: 1px solid rgba(223,45,178,.25);
  border-radius: 999px; padding: 2px 10px 2px 4px;
  font-size: .75rem; color: #6B7280; cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}
.quick-chip:hover { border-color: #185CE6; color: #185CE6; background: rgba(255,255,255,.9); }

/* Chip variante IA */
.quick-chip--ai {
  border-color: rgba(124,58,237,.3);
}
.quick-chip--ai:hover { border-color: #7c3aed; color: #7c3aed; }
.chip-ai-badge {
  display: inline-flex; align-items: center; gap: 2px;
  background: linear-gradient(135deg, #9333ea, #7c3aed);
  color: #fff; border-radius: 999px;
  padding: 1px 5px 1px 4px; font-size: .6rem; font-weight: 700;
  line-height: 1.4; flex-shrink: 0;
}
.quick-chip-x {
  width: 16px; height: 16px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: rgba(223,45,178,.12); color: #DF2DB2;
  font-size: .75rem; line-height: 1; flex-shrink: 0;
  transition: background .15s;
}
.quick-chip-x:hover { background: #FEE2E2; color: #EF4444; }

/* Drag-and-drop states */
.top-search-chip-wrapper { transition: transform .2s; }
.top-search-chip-wrapper.dragging { opacity: .5; transform: scale(.95); }
.top-search-chip-wrapper.drag-over > div { border-color: #185CE6 !important; background: #EFF6FF; }


/* Element Plus tree-select width */
:deep(.custom-tree-select) { width: 100% !important; }
:deep(.custom-tree-select .el-select__wrapper) { min-height: 40px; border: 1.5px solid #E5E7EB; border-radius: 8px; font-size: .875rem; }
:deep(.custom-tree-select .el-select__wrapper:hover) { border-color: #185CE6; }

/* El-autocomplete — sin borde ni fondo interno */
:deep(.search-input),
:deep(.search-input .el-autocomplete),
:deep(.search-input .el-input),
:deep(.search-input .el-input__wrapper) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  border-radius: 0 !important;
}
:deep(.search-input .el-input__wrapper) { padding: 0 8px; min-height: 40px; }
:deep(.search-input .el-input__wrapper:hover),
:deep(.search-input .el-input__wrapper:focus),
:deep(.search-input .el-input__wrapper.is-focus) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}
:deep(.search-input .el-input__inner) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

/* Highlight marks */
:deep(.highlight-text) { background: #fef08a; color: #1f2937; border-radius: 3px; padding: 0 3px; font-weight: 600; }
:deep(.highlight-denominacion) { color: #185CE6; font-weight: 700; }

/* ── Result Cards ─────────────────────────────────────── */
.result-card {
  background: rgba(255,255,255,.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(139,92,246,.15);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 8px;
  transition: box-shadow .2s, border-color .2s, transform .15s;
  animation: card-in .25s ease both;
}
.result-card:hover {
  box-shadow: 0 6px 24px rgba(156,163,175,.18);
  border-color: rgba(156,163,175,.6);
  transform: translateY(-1px);
}
.dark .result-card { background: #1a2035; border-color: #2d3748; }
.dark .result-card:hover { border-color: #4a5568; box-shadow: 0 4px 18px rgba(0,0,0,.3); }

@keyframes card-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.result-title {
  font-size: .875rem;
  font-weight: 700;
  color: #185CE6!important;
  line-height: 1.35;
  cursor: pointer;
  transition: color .15s;
}
.result-title:hover { color: #0e45b5; }
.dark .result-title { color: #f0f4ff; }
.dark .result-title:hover { color: #6B9EFF; }
.result-title--visited { color: #7C3AED !important; }
.result-title--visited:hover { color: #6D28D9 !important; }



/* ── Result grid (label+value) ────────────────────────── */
.result-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid #F3F4F6;
  margin-top: 6px;
}
.dark .result-grid { border-color: #2d3748; }

.result-field {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 5px 8px;
  border-right: 1px solid #F3F4F6;
  border-bottom: 1px solid #F3F4F6;
}
.dark .result-field { border-color: #2d3748; }
.result-field:nth-child(3n) { border-right: none; }

.result-field--full  { grid-column: 1 / -1; border-right: none; }
.result-field--wide  { grid-column: span 2; }

.result-label {
  font-size: .625rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: .01em;
}
.dark .result-label { color: #D1D5DB; }

.result-value {
  font-size: .6875rem;
  color: #1f2937;
  line-height: 1.4;
}
.dark .result-value { color: #9CA3AF; }

.result-value--link { color: #1f2937; }
.dark .result-value--link { color: #9CA3AF; }

.result-sintesis {
  font-size: .75rem;
  color: #6B7280;
  line-height: 1.6;
  font-style: italic;
}
.dark .result-sintesis { color: #9CA3AF; }

.normas-vin-list {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.normas-vin-list li { font-size: .6875rem; }
.normas-vin-list a { color: #185CE6; text-decoration: none; }
.normas-vin-list a:hover { text-decoration: underline; }
.normas-vin-pagination {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}
.normas-vin-page-label { font-size: .625rem; color: #6B7280; }
.dark .normas-vin-page-label { color: #9CA3AF; }

@media (max-width: 640px) {
  .result-grid { grid-template-columns: 1fr; }
  .result-field { border-right: none; }
  .result-field--wide { grid-column: 1; }
}

/* ── Paginación ───────────────────────────────────────── */
.pag-bar { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; }
.pag-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 26px; height: 26px; padding: 0 5px;
  border-radius: 6px; border: 1px solid #E5E7EB;
  font-size: .75rem; font-weight: 500; color: #374151;
  background: rgba(255,255,255,.7); cursor: pointer;
  transition: background .15s, border-color .15s, color .15s;
}
.pag-btn:hover:not(:disabled) { background: #EFF6FF; border-color: #BFDBFE; color: #185CE6; }
.pag-btn:disabled { opacity: .35; cursor: not-allowed; }
.pag-btn--active { background: #185CE6; border-color: #185CE6; color: #fff; font-weight: 700; }
.pag-btn--active:hover { background: #1249c2; border-color: #1249c2; color: #fff; }
.pag-ellipsis { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 26px; font-size: .75rem; color: #9CA3AF; }
.dark .pag-btn { background: rgba(30,42,59,.7); border-color: #374151; color: #D1D5DB; }
.dark .pag-btn:hover:not(:disabled) { background: #1e3a5f; border-color: #2563EB; color: #6B9EFF; }
.dark .pag-btn--active { background: #185CE6; border-color: #185CE6; color: #fff; }

/* ── Loading overlay ──────────────────────────────────── */
.loading-overlay {
  background: rgba(15, 20, 40, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.loading-card {
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  background: rgba(255,255,255,.95);
  border-radius: 24px;
  padding: 36px 44px;
  box-shadow: 0 24px 60px rgba(0,0,0,.18), 0 4px 16px rgba(139,92,246,.15);
}
.dark .loading-card { background: rgba(20,27,45,.95); }

.loading-logo-img {
  width: 100px; height: 50px; object-fit: contain;
}

.loading-dots { display: flex; gap: 6px; }
.loading-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  animation: dot-bounce 0.9s ease-in-out infinite;
}
@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(.6); opacity: .4; }
  40%            { transform: scale(1);  opacity: 1;  }
}
.loading-text {
  font-size: .875rem; font-weight: 600;
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: .01em;
}

/* ── Transiciones Vue ─────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-scale-enter-active, .fade-scale-leave-active { transition: all .2s; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(.8); }
.fade-slide-down-enter-active, .fade-slide-down-leave-active { transition: all .25s; }
.fade-slide-down-enter-from, .fade-slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

/* ── AI Search Toggle ─────────────────────────────────── */
.search-bar-ia-toggle-wrap { position: relative; flex-shrink: 0; }
.search-bar-ia-toggle {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0 6px 0 10px; height: 34px; border-radius: 999px;
  border: 1.5px solid #d8b4fe; background: #fff;
  color: #7c3aed; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all .2s; white-space: nowrap;
}
.search-bar-ia-toggle:hover:not(:disabled) { border-color: #a855f7; }
.search-bar-ia-toggle:disabled { opacity: .45; cursor: not-allowed; }
.ia-toggle-icon { color: #a855f7; flex-shrink: 0; }
.ia-toggle-label { font-size: 12px; font-weight: 600; }
.ia-toggle-switch {
  position: relative; width: 32px; height: 18px; border-radius: 999px;
  background: #e5e7eb; transition: background .2s; flex-shrink: 0;
}
.ia-toggle-knob {
  position: absolute; top: 2px; left: 2px; width: 14px; height: 14px;
  border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.25);
  transition: transform .2s;
}
.search-bar-ia-toggle--on .ia-toggle-switch { background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); }
.search-bar-ia-toggle--on .ia-toggle-knob { transform: translateX(14px); }
.dark .search-bar-ia-toggle { background: #1f2937; border-color: #7c3aed; color: #c084fc; }
.dark .ia-toggle-switch { background: #374151; }

.ia-tooltip {
  position: absolute; top: calc(100% + 8px); right: 0; z-index: 20;
  width: 280px; padding: 12px 14px; border-radius: 12px;
  background: #fff; border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
}
.ia-tooltip p {
  margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #4b5563;
}
.ia-tooltip p:last-child { margin-bottom: 0; }
.ia-tooltip-link { color: #7c3aed; font-weight: 600; text-decoration: underline; cursor: pointer; }
.dark .ia-tooltip { background: #1f2937; border-color: #374151; }
.dark .ia-tooltip p { color: #d1d5db; }
.dark .ia-tooltip-link { color: #c084fc; }

/* ── AI Results Banner ───────────────────────────────── */
.ai-search-banner {
  margin-bottom: 8px; padding: 8px 12px;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border: 1px solid #e9d5ff; border-radius: 10px;
}
.dark .ai-search-banner {
  background: linear-gradient(135deg, #2e1065 0%, #3b0764 100%);
  border-color: #6b21a8;
}
.ai-suggestion-bar {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 12px; padding: 10px 14px;
  background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
}
.dark .ai-suggestion-bar {
  background: #1c1507; border-color: #92400e;
}
.ai-suggestion-link {
  color: #7c3aed; font-weight: 600; text-decoration: underline;
  cursor: pointer; background: none; border: none; padding: 0;
  font-size: inherit;
}
.ai-suggestion-link:hover { color: #5b21b6; }
.ai-term-chip {
  display: inline-block; background: #ede9fe; color: #7c3aed;
  border-radius: 6px; padding: 1px 7px; font-size: 11px; font-weight: 500;
}
.dark .ai-term-chip { background: #4c1d95; color: #ddd6fe; }

/* ── AI Result Badge ─────────────────────────────────── */
.ai-result-badge {
  display: inline-flex; align-items: center;
  margin-right: 5px; padding: 1px 5px;
  background: linear-gradient(135deg, #9333ea, #7c3aed);
  color: #fff; border-radius: 4px; font-size: 9px;
  font-weight: 700; letter-spacing: .05em; vertical-align: middle; line-height: 1.6;
}
</style>

<style>
/* Dropdown del buscador global */
.search-global-autocomplete {
  max-width: min(860px, 92vw) !important;
  box-sizing: border-box !important;
}
.search-global-autocomplete .el-autocomplete-suggestion__list li {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
