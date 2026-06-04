<template>
    <div class="landing-busqueda mt-1 pt-2">

        <div class="img-landing-busqueda  pb-2 pt-1">
            <img @click="onClear()" src="@/assets/img/logos/logo-full.png" alt="Logo"
                class="cursor-pointer logo-busqueda" />
        </div>

        <div class="search-container mt-2">
            <div class="search-box">
                <el-autocomplete v-model="filter.GLOBAL" :fetch-suggestions="searchGlobal"
                    :trigger-on-focus="false" clearable
                    placeholder="Busca por nombre de caso, palabra clave ó selecciona los filtros"
                    popper-class="sidebar-tree-popper search-global-autocomplete"
                    class="search-input w-100" @keydown.enter="searchGlobalOnly" @select="handleGlobalSelect">
                    <template #default="{ item }">
                        <div v-if="item.isEmpty" class="empty-message">
                            <em>No se encontraron coincidencias</em>
                        </div>
                        <div v-else class="d-flex align-items-center gap-2" v-html="highlightGlobal(item.value)"></div>
                    </template>
                </el-autocomplete>

                <!-- Separador -->
                <div class="separator"></div>

                <!-- Icono de filtro -->
                <!-- <div v-if="['2', '3', '4'].includes(role.IDPLN)"> -->
                <div>
                    <button class="btn-filter" @click="() => {
                        isCollapsed2 = !isCollapsed2;
                    }">
                        <img src="@/assets/img/icons/settings-arrow.svg" alt="Filter" />
                    </button>
                    <div id="filterbar-container2" v-show="!isCollapsed2" ref="filterMenu2" class="px-4 py-2">
                        <div class="form-check" style="display: flex; align-items: center; gap: 3px"
                            v-for="opcion in opcionesFiltro" :key="opcion.valor">
                            <input class="form-check-input" type="radio" style="cursor: pointer" name="modoBusqueda"
                                :id="'radio-' + opcion.valor" :value="opcion.valor" v-model="modoBusqueda" />
                            <label v-tooltip.bottom="{
                                value: opcion.resena,
                                classes: ['tooltip-rojo'],
                                style: {
                                    fontSize: '0.25rem',
                                },
                            }" style="font-size:15px" class="form-check-label" :for="'radio-' + opcion.valor">
                                {{ opcion.texto }}
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <button class="btn-filter" @click="() => {
                        isCollapsed = !isCollapsed;
                        isCollapsed2 = true;
                    }">
                        <img src="@/assets/img/icons/filter.svg" alt="Filter" />
                    </button>
                </div>
            </div>

            <div class="search-actions d-flex justify-content-between align-items-center">
                <!-- Botón de búsqueda -->
                <button class="btn-search" type="button" id="filter-btn" @click="searchGlobalOnly">
                    Buscar
                </button>
                <!-- // boton limpiar -->
                <button class="btn-clear-button" type="button" @click="clearGlobalOnly">
                    Limpiar
                </button>
            </div>
        </div>

        <div class="top-search-container">
            <button class="scroll-arrow scroll-arrow-left" @click="scrollLeft" v-if="topSearch.length > 0">
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                    <path d="M8 2L2 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="top-search-scroll-wrapper" ref="scrollContainer">
                <div class="p-1" v-for="(valor, index) in topSearch" :key="valor.ID + '-' + index">
                    <div 
                        class="top-search-chip-wrapper"
                        draggable="true"
                        @dragstart="onDragStart(index)"
                        @dragover.prevent="onDragOver(index)"
                        @drop="onDrop(index)"
                        @dragend="onDragEnd"
                        :class="{
                            'dragging': draggedIndex === index,
                            'drag-over': dragOverIndex === index && draggedIndex !== index
                        }"
                    >
                        <div class="top-search-chip d-flex" @click="executionsSearch(valor)">
                            <button @click.stop="clearTopSearch(index, valor)" class="btn-clear-item">
                                X
                            </button>
                            <div class="d-flex align-items-center gap-2" v-tooltip.bottom="{
                                value: valor.DESCP,
                                style: {
                                    fontSize: '0.35rem',
                                    color: '#4A5568',
                                },
                            }">
                                <span>{{ cortarDescripcion(valor.DESCP) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="scroll-arrow scroll-arrow-right" @click="scrollRight" v-if="topSearch.length > 0">
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                    <path d="M2 2L8 8L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <div class="results-area">
            <!-- Sidebar de filtros -->
            <aside class="filter-sidebar" v-show="!isCollapsed">
                <div class="sidebar-header">
                    <span class="sidebar-title">Filtros</span>
                    <button class="sidebar-close-btn" @click="isCollapsed = true" title="Cerrar filtros">×</button>
                </div>
                <div class="sidebar-body">
                    <div class="filter">
                        <div class="filter-header">
                            <div class="flex flex-row contenedor-tab-global">
                                <div @click="typeSaarch = 'jurisprudences'; isFilter = 'jurisprudences-generales'; criterioActual = 'year-publication'"
                                    :class="typeSaarch == 'jurisprudences' ? 'active-criterio' : ''"
                                    class="flex gap-1 p-2 flex-row justify-content-center contenedor-tab align-items-center">
                                    <img class="container-nav" src="@/assets/img/icons/corona-2.svg" alt="Close" />
                                    <p class="container-nav">Jurisprudencia</p>
                                </div>
                                <div @click="typeSaarch = 'legislations'; isFilter = 'legislaciones-generales'; criterioActual = 'year-publication'"
                                    :class="typeSaarch == 'legislations' ? 'active-criterio' : ''"
                                    class="flex gap-1 p-2 flex-row justify-content-center contenedor-tab align-items-center">
                                    <img class="container-nav" src="@/assets/img/icons/settings-2.svg" alt="Close" />
                                    <p class="container-nav">Legislación</p>
                                </div>
                            </div>
                        </div>
                        <div class="contenedor-filtros">
                            <div class="row">

                                <!-- Jurisprudencia: Ámbito -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <label class="form-label">Ámbito</label>
                                    <el-tree-select v-model="filter.AMBITO" :data="selects['ÁMBITO']" multiple
                                        :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox
                                        check-strictly check-on-click-node filterable clearable collapse-tags
                                        :max-collapse-tags="1" :filter-node-method="filterTreeNode"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Jurisprudencia: Materia (solo si Compliance seleccionado en Ámbito) -->
                                <div class="px-3 mb-3"
                                    :class="typeSaarch === 'jurisprudences' && ambitoComplianceSelected ? 'col-12' : 'd-none'">
                                    <label for="MATERIA" class="form-label">Materia</label>
                                    <el-tree-select v-model="filter.MATERIA" :data="selects['MATERIA']" multiple
                                        :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox
                                        check-strictly check-on-click-node filterable clearable collapse-tags
                                        :max-collapse-tags="1" :filter-node-method="filterTreeNode"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Jurisprudencia: Fechas lado a lado -->
                                <div class="col-12 px-3 mb-3 d-flex gap-2" v-if="typeSaarch === 'jurisprudences'">
                                    <div class="flex-1" style="flex:1; min-width:0">
                                        <label class="form-label">Fecha Inicio</label>
                                        <date-picker v-model="filter.FRESOLUTION1" value-type="format"
                                            @change="filter.FRESOLUTION1 = $event" :value="filter.FRESOLUTION1"
                                            appendTo="self" panelClass="force-open-down">
                                        </date-picker>
                                    </div>
                                    <div class="flex-1" style="flex:1; min-width:0">
                                        <label class="form-label">Fecha Fin</label>
                                        <date-picker v-model="filter.FRESOLUTION2" value-type="format"
                                            @change="filter.FRESOLUTION2 = $event" :value="filter.FRESOLUTION2"
                                            appendTo="self" panelClass="force-open-down">
                                        </date-picker>
                                    </div>
                                </div>

                                <!-- Jurisprudencia: Delito -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <label for="Delito" class="form-label">Delito</label>
                                    <el-tree-select ref="delitoTreeSelect"
                                        :style="{ width: '100%', maxWidth: '100%', overflow: 'hidden' }"
                                        visible-options="5" v-model="filter.DELITO" :data="selects.DELITOS" multiple
                                        :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox
                                        check-strictly filterable clearable collapse-tags :collapse-tags-tooltip="true"
                                        :max-collapse-tags="1" :filter-node-method="filterTreeNode"
                                        @check-change="(data, checked) => handleCheckChange(data, checked, 'DELITO', 'delitoTreeSelect')"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        popper-class="sidebar-tree-popper" class="custom-tree-select" />
                                </div>

                                <!-- Jurisprudencia: Recurso -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <label for="Recurso" class="form-label">Recurso</label>
                                    <el-tree-select v-model="filter.RECURSO" :data="selects['TIPO DE RECURSO']" multiple
                                        :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox
                                        check-strictly check-on-click-node filterable clearable collapse-tags
                                        :max-collapse-tags="1" :filter-node-method="filterTreeNode"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Jurisprudencia: Órgano Jurisdiccional -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <label for="Organos" class="form-label">Órgano Jurisdiccional</label>
                                    <el-tree-select ref="organoTreeSelect" v-model="filter.OJURISDICCIONAL"
                                        :data="selects['ÓRGANO JURISDICCIONAL']" multiple :render-after-expand="false"
                                        placeholder="Seleccione una opción" show-checkbox check-strictly filterable
                                        clearable collapse-tags :max-collapse-tags="1"
                                        :filter-node-method="filterTreeNode"
                                        @check-change="(data, checked) => handleCheckChange(data, checked, 'OJURISDICCIONAL', 'organoTreeSelect')"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Jurisprudencia: Magistrado -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <label for="Magistrados" class="form-label">Magistrado</label>
                                    <el-tree-select v-model="filter.MAGISTRATES" :data="selects['MAGISTRATES']" multiple
                                        :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox
                                        check-strictly check-on-click-node filterable clearable collapse-tags
                                        :max-collapse-tags="1" :filter-node-method="filterTreeNode"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Jurisprudencia: Jurisprudencia Vinculante -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <label for="JVINCULANTE" class="form-label">Jurisprudencia Vinculante</label>
                                    <el-tree-select ref="jvinculanteTreeSelect" v-model="filter.JVINCULANTE"
                                        :data="selects['JURISPRUDENCIA VINCULANTE']" multiple
                                        :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox
                                        check-strictly filterable clearable collapse-tags :max-collapse-tags="1"
                                        :filter-node-method="filterTreeNode"
                                        @check-change="(data, checked) => handleCheckChange(data, checked, 'JVINCULANTE', 'jvinculanteTreeSelect')"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Jurisprudencia: Casos Emblemáticos -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <div class="switch-container">
                                        <label for="BLOG" class="switch-label">Casos Emblemáticos</label>
                                        <label class="switch">
                                            <input type="checkbox" id="BLOG" v-model="filter.BLOG">
                                            <span class="slider"></span>
                                        </label>
                                        <div class="d-inline-block position-relative">
                                            <img src="@/assets/img/icons/interrogation.svg" alt="Switch"
                                                class="cursor-pointer info-icon" v-b-tooltip.hover
                                                title="Casos que generan alarma social por su alta significancia criminal." />
                                        </div>
                                    </div>
                                </div>

                                <!-- Jurisprudencia: Palabras Clave -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <label for="KEYWORDS" class="form-label">Palabras Clave</label>
                                    <el-autocomplete v-model="filter.KEYWORDS" :fetch-suggestions="searchPalabrasClaves"
                                        :trigger-on-focus="false" clearable placeholder="Buscar palabras clave..."
                                        popper-class="sidebar-tree-popper palabras-autocomplete"
                                        class="w-100 custom-tree-select" @keydown.enter="search"
                                        @select="handlePalabraSelect">
                                        <template #default="{ item }">
                                            <div v-if="item.isEmpty" class="empty-message">
                                                <em>No se encontraron coincidencias</em>
                                            </div>
                                            <div v-else v-html="highlightPalabrasClaves(item.value)"></div>
                                        </template>
                                    </el-autocomplete>
                                </div>

                                <!-- Jurisprudencia: Jurisdicción -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'jurisprudences' ? 'col-12' : 'd-none'">
                                    <label for="JURISDICCION" class="form-label">Jurisdicción</label>
                                    <el-tree-select v-model="filter.JURISDICCION" :data="selects['JURISDICCIÓN']"
                                        multiple :render-after-expand="false" placeholder="Seleccione una opción"
                                        show-checkbox check-strictly check-on-click-node filterable clearable
                                        collapse-tags :max-collapse-tags="1" :filter-node-method="filterTreeNode"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Legislación: Fechas lado a lado -->
                                <div class="col-12 px-3 mb-3 d-flex gap-2" v-if="typeSaarch === 'legislations'">
                                    <div style="flex:1; min-width:0">
                                        <label class="form-label">Fecha Inicio</label>
                                        <date-picker v-model="filter.FRESOLUTION1" value-type="format"
                                            @change="filter.FRESOLUTION1 = $event" :value="filter.FRESOLUTION1"
                                            appendTo="self" panelClass="force-open-down">
                                        </date-picker>
                                    </div>
                                    <div style="flex:1; min-width:0">
                                        <label class="form-label">Fecha Fin</label>
                                        <date-picker v-model="filter.FRESOLUTION2" value-type="format"
                                            @change="filter.FRESOLUTION2 = $event" :value="filter.FRESOLUTION2"
                                            appendTo="self" panelClass="force-open-down">
                                        </date-picker>
                                    </div>
                                </div>

                                <!-- Legislación: Tipo de Norma -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'legislations' ? 'col-12' : 'd-none'">
                                    <label class="form-label">Tipo de Norma</label>
                                    <el-tree-select v-model="filter.TPONRMA" :data="selects['TIPO DE NORMA']" multiple
                                        :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox
                                        check-strictly check-on-click-node filterable clearable collapse-tags
                                        :max-collapse-tags="1" :filter-node-method="filterTreeNode"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Legislación: Órgano Emisor -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'legislations' ? 'col-12' : 'd-none'">
                                    <label class="form-label">Órgano Emisor</label>
                                    <el-tree-select v-model="filter.OEMISOR" :data="selects['ÓRGANO EMISOR']" multiple
                                        :render-after-expand="false" placeholder="Seleccione una opción" show-checkbox
                                        check-strictly check-on-click-node filterable clearable collapse-tags
                                        :max-collapse-tags="1" :filter-node-method="filterTreeNode"
                                        no-data-text="No hay opciones disponibles" popper-append-to-body
                                        class="custom-tree-select" />
                                </div>

                                <!-- Legislación: Denominación Oficial -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'legislations' ? 'col-12' : 'd-none'">
                                    <label class="form-label">Denominación Oficial</label>
                                    <el-autocomplete v-model="filter.RTITLE"
                                        :fetch-suggestions="searchDenominacionOficial" :trigger-on-focus="false"
                                        clearable placeholder="Buscar denominación..."
                                        popper-class="sidebar-tree-popper denominacion-autocomplete"
                                        class="w-100 custom-tree-select" size="large"
                                        style="width: 100%; height: 40px; padding: 0px" @keydown.enter="search" @select="handleDenominacionSelect">
                                        <template #default="{ item }">
                                            <div v-if="item.isEmpty" class="empty-message">
                                                <em>No se encontraron coincidencias</em>
                                            </div>
                                            <div v-else v-html="highlightDenominacion(item.value)"></div>
                                        </template>
                                    </el-autocomplete>
                                </div>

                                <!-- Legislación: Estado -->
                                <div class="px-3 mb-3" :class="typeSaarch === 'legislations' ? 'col-12' : 'd-none'">
                                    <label class="form-label">Estado</label>
                                    <select v-model="filter.ESTADO" class="form-control select-estado">
                                        <option :value="null">Seleccione una opción</option>
                                        <option value="Vigente">Vigente</option>
                                        <option value="Modificado">Modificado</option>
                                        <option value="Derogado">Derogado</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="sidebar-footer-actions">
                    <button class="btn-search flex-grow-1" @click="search">Buscar</button>
                    <button class="btn-clear-button flex-grow-1" @click="onClear(1)">Limpiar</button>
                </div>
            </aside>

            <!-- Columna principal de resultados -->
            <div class="results-column">
                <transition name="fade">
                    <div v-if="resultados.length > 0" class="search-results">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 mb-1">
                            <p class="color-blue font-weight-bold m-0">
                                Se está mostrando {{ table.perPage }} registros, de {{ (table.currentPage - 1) *
                                    table.perPage + 1 }} - {{
                                    table.currentPage * table.perPage }} de {{ table.totalRows }} registros en total.
                            </p>
                            <div class="d-flex align-items-center gap-2">
                                <label class="sort-label mb-0">Ordenar:</label>
                                <select v-model="sortOrder" @change="handleSearch(table.currentPage)"
                                    class="sort-select">
                                    <option value="desc">Recientes</option>
                                    <option value="asc">Antiguos</option>
                                </select>
                            </div>
                        </div>
                        <p class="text-left mt-3 color-blue font-weight-bold" style="display:none">
                            Se está mostrando {{ table.perPage }} registros, de {{ (table.currentPage - 1) *
                                table.perPage + 1 }} - {{
                                table.currentPage * table.perPage }} de {{ table.totalRows }} registros en total.
                        </p>
                        <div class="col-12 p-0">
                            <b-pagination v-model="table.currentPage" :total-rows="table.totalRows"
                                @update:model-value="handleSearch" :per-page="table.perPage" aria-controls="my-table"
                                class="my-0" />
                        </div>
                        <div v-for="(item, index) in resultados" :key="index" class="result-item">
                            <!-- Título con flecha -->
                            <div :class="['result-title', { 'result-title-opened': item.ISOPEN === 1 }]"
                                @click="openModalWithData(item, index)">
                                <span v-html="highlightText(item.TITULO)"></span>
                                <div class="copy-btn-container">
                                    <button @click.stop="copyToClipboard(item, index)" class="copy-btn"
                                        title="Copiar título">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                    <transition name="fade-scale">
                                        <span v-if="showCopyMessage === index" class="copy-message">Texto copiado</span>
                                    </transition>
                                </div>
                            </div>

                            <div v-if="item.TYPE == 'jurisprudences'" class="row">
                                <!-- Pretensión / Delito -->
                                <p class="result-info px-2 py-1 col-12 col-md-4">
                                    <strong>Pretensión / Delito:</strong><br><span
                                        v-html="item.DELITO?.length > 0 ? highlightText(item.DELITO?.map(o => o.DESCP).join(', ')) : '-'"></span>
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-4">
                                    <strong>Tipo de Recurso:</strong> <br>{{item.RECURSO?.length > 0 ?
                                        item.RECURSO?.map(o =>
                                    o.DESCP).join(', ') : '-'}}
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-4">
                                    <strong>Órgano Jurisdiccional:</strong> <br>{{item.OJURISDICCIONAL?.length > 0 ?
                                        item.OJURISDICCIONAL?.map(o => o.DESCP).join(', ') : '-'}}
                                </p>
                                <!-- <p class="result-info px-2 py-1 col-12 col-md-4">
                        <strong>Jurisprudencia Vinculante:</strong> {{item.DELITO.map((delito) => delito.DESCP).join(', ')}}
                    </p> -->
                                <p class="result-info px-2 py-1 col-12 col-md-4">
                                    <strong>Caso Emblemático:</strong> <br><span
                                        v-html="item?.TYPE == 'jurisprudences' ? highlightText(item?.CASO || '-') : highlightText(item?.RTITLE || '-')"></span>
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-4">
                                    <strong>Caso Vinculante:</strong> <br>{{ item.INDICADOR ? 'Sí' : 'No' }}
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-4">
                                    <strong>Palabras Clave:</strong> <br><span
                                        v-html="highlightText(item.KEYWORDS?.split(',').map(p => p.trim()).join(', ') || '-')"></span>
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-12">
                                    <strong>Síntesis:</strong> <br>
                                    <span
                                        v-html="expandedSintesis[index] ? highlightText(item.SHORTSUMMARY3) : highlightText((item.SHORTSUMMARY3 || '').slice(0, 200))"></span><span
                                        v-if="!expandedSintesis[index] && item.SHORTSUMMARY3 && item.SHORTSUMMARY3.length > 200">...</span>
                                    <button v-if="item.SHORTSUMMARY3 && item.SHORTSUMMARY3.length > 200"
                                        @click="toggleSintesis(index)" class="btn-expand-sintesis">{{
                                            expandedSintesis[index] ?
                                        'Ver menos ▲' : 'Ver más ▼' }}</button>
                                </p>

                            </div>

                            <div v-if="item.TYPE == 'legislations'" class="row">
                                <!-- Pretensión / Delito -->
                                <p class="result-info px-2 py-1 col-12 col-md-3">
                                    <strong>Numeración:</strong><br>{{ item.NMRCN }}
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-3">
                                    <strong>Fecha de publicación:</strong> <br>{{ formateReverse(item.FRESOLUTION) }}
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-3">
                                    <strong>Órgano emisor:</strong> <br>{{item.OEMISOR?.length > 0 ? item.OEMISOR?.map(o => o.DESCP).join(', ') : '-'}}
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-3">
                                    <strong>Estado:</strong> <br>
                                    <span>{{ item.SITUACION }}</span>
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-8">
                                    <strong>Denominación oficial:</strong> <br><span
                                        v-html="highlightText(item?.RTITLE || '-')"></span>
                                </p>
                                <p class="result-info px-2 py-1 col-12 col-md-4">
                                    <strong>Tipo de Norma:</strong> <br><span
                                        v-html="item.TPONRMA?.length > 0 ? highlightText(item.TPONRMA?.map(o => o.DESCP).join(', ')) : '-'"></span>
                                </p>
                            </div>
                        </div>
                        <div class="col-12 p-0">
                            <b-pagination v-model="table.currentPage" :total-rows="table.totalRows"
                                @update:model-value="handleSearch" :per-page="table.perPage" aria-controls="my-table"
                                class="my-0" />
                        </div>
                        <p class="text-left mt-3 color-blue font-weight-bold">
                            Se está mostrando {{ table.perPage }} registros, de {{ (table.currentPage - 1) *
                                table.perPage + 1 }} - {{
                                table.currentPage * table.perPage }} de {{ table.totalRows }} registros en total.
                        </p>
                    </div>
                </transition>

                <div v-if="resultados.length === 0 && !isLoading && !hasSearched" class="no-results">
                    <div class="no-results-icon">
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="60" cy="60" r="58" stroke="url(#gradient1)" stroke-width="3" fill="none"
                                opacity="0.2" />
                            <path d="M50 45C50 39.4772 54.4772 35 60 35C65.5228 35 70 39.4772 70 45"
                                stroke="url(#gradient1)" stroke-width="3" stroke-linecap="round" />
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
                    </div>
                    <h3 class="no-results-title">¡Comienza tu búsqueda!</h3>
                    <p class="no-results-description">
                        Utiliza el buscador y los filtros para encontrar<br>
                        jurisprudencias y legislaciones de tu interés
                    </p>
                </div>

                <div v-if="resultados.length === 0 && !isLoading && hasSearched" class="no-results">
                    <div class="no-results-icon">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="40" cy="40" r="38" stroke="url(#gradient2)" stroke-width="2.5" fill="none"
                                opacity="0.3" />
                            <circle cx="40" cy="35" r="15" stroke="url(#gradient2)" stroke-width="2.5" fill="none" />
                            <path d="M51 46L60 55" stroke="url(#gradient2)" stroke-width="2.5" stroke-linecap="round" />
                            <line x1="34" y1="35" x2="46" y2="35" stroke="url(#gradient2)" stroke-width="2.5"
                                stroke-linecap="round" />
                            <defs>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" />
                                    <stop offset="50%" style="stop-color:#F59E0B;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#EAB308;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h3 class="no-results-title">No se encontraron resultados</h3>
                    <p class="no-results-description">
                        Intenta ajustar los filtros o buscar con otros términos
                    </p>
                </div>

                <div class="help-info-container" v-show="showHelpButton">
                    <button class="help-icon-btn" type="button" @click="toggleCard"
                        :title="showCard ? 'Cerrar ayuda' : 'Ver ayuda'">
                        <svg v-if="!showCard" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                    <transition name="fade-slide-down">
                        <div v-if="showCard" class="help-info-card">
                            <div class="p-2 card-body" v-for="(item, index) in items" :key="index">
                                <div class="card-title">
                                    <img src="@/assets/img/icons/questions.svg" alt="Info" class="info-icon" />
                                    <h5>{{ item.title }}</h5>
                                </div>
                                <p class="card-text">{{ item.description }}</p>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <transition name="fade">
            <div v-if="isLoading" class="custom-loader-overlay">
                <div class="custom-loader">
                    <div class="loader-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                    </div>
                    <p class="loader-text">Buscando...</p>
                </div>
            </div>
        </transition>

        <ModalMostrarResolucion :openModal="openModal" :toggleModal="() => this.openModal = !this.openModal"
            :pdfUrl="pdfUrl" :data="rowData" :role="role" :currentIndex="currentResultIndex"
            :totalResults="resultados.length" :showNavigation="true" :searchText="filter.GLOBAL" 
            :modoBusqueda="modoBusqueda" @navigate="navigateResults" />

        <!-- Botón scroll to top -->
        <transition name="fade-scale">
            <button v-if="showScrollTop" @click="scrollToTop" class="scroll-to-top-btn" aria-label="Ir arriba">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </transition>

    </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { BPagination } from 'bootstrap-vue-next';
import { toast } from 'vue3-toastify';

// PROXY
import MagistradoProxy from "../../proxies/Magistrados.Proxy.js";
import filterProxy from "../../proxies/FilterProxy.js";
import AdminEntriesProxy from "../../proxies/AdminEntriesProxy.js";
import ModalMostrarResolucion from './Modales/ModalMostrarResolucion.vue';

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
            table: {
                currentPage: 1,
                perPage: 10,
                totalRows: 0
            },
            default: {
                GLOBAL: null,
                FRESOLUTION1: [],
                DELITO: null,
                NMRCN: null,
                TPONRMA: null,
                OEMISOR: null,
                RECURSO: null,
                OJURISDICCIONAL: null,
                MAGISTRATES: null,
                JVINCULANTE: null,
                FRESOLUTION2: [],
                MATERIA: null,
                JURISDICCION: null,
                TITLE: null,
                CRITERIO: null,
                KEYWORDS: [],
                TEMA: null,
                BLOG: false,
                SUBTEMA: null,
                AMBITO: null,
                ESTADO: null
            },

            filter: {
                GLOBAL: null,
                FRESOLUTION1: [],
                DELITO: [],
                NMRCN: [],
                TPONRMA: [],
                OEMISOR: [],
                RECURSO: [],
                OJURISDICCIONAL: [],
                MAGISTRATES: [],
                JVINCULANTE: [],
                FRESOLUTION2: [],
                MATERIA: [],
                JURISDICCION: [],
                TITLE: null,
                TYPE: "jurisprudences",
                CRITERIO: null,
                KEYWORDS: null,
                TEMA: null,
                BLOG: false,
                SUBTEMA: null,
                CURRENTPAGE: 1,
                PERPAGE: 10,
                INDICADOR: 2,
                AMBITO: [],
                ESTADO: null
            },
            selects: {
                "MAGISTRATES": [],
                "DELITOS": [],
                "ÁMBITO": [],
                "ÓRGANO JURISDICCIONAL": [],
                "RECURSOS": [],
                "MATERIAS": [],
                "NORMA": [],
                "JURISPRUDENCIA VINCULANTE": [],
                "JURISDICCIONES": [],
                "TIPO DE NORMA": [],
                "ÓRGANO EMISOR": [],
            },
            showCard: false,
            expandedSintesis: {},
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
            currentResultIndex: 0
        };
    },
    components: {
        BPagination,
        // BFormTags,
        ModalMostrarResolucion,
    },
    props: {
        role: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        ambitoComplianceSelected() {
            if (!this.filter.AMBITO || !this.filter.AMBITO.length) return false;
            const allItems = this.selects['ÁMBITO'] || [];
            return allItems.some(item =>
                item.label?.toLowerCase() === 'compliance' &&
                this.filter.AMBITO.includes(item.value)
            );
        }
    },
    methods: {
        scrollLeft() {
            const container = this.$refs.scrollContainer;
            if (container) {
                container.scrollBy({ left: -300, behavior: 'smooth' });
            }
        },
        scrollRight() {
            const container = this.$refs.scrollContainer;
            if (container) {
                container.scrollBy({ left: 300, behavior: 'smooth' });
            }
        },
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        handleScroll() {
            const scrollPosition = window.scrollY;
            this.showScrollTop = scrollPosition > 300;
            // Ocultar botón de ayuda cuando el usuario baja más de 200px
            this.showHelpButton = scrollPosition < 200;
            // Cerrar la tarjeta si está abierta y se hace scroll
            if (scrollPosition > 200 && this.showCard) {
                this.showCard = false;
            }
        },
        toggleCard() {
            this.showCard = !this.showCard;
        },
        toggleSintesis(index) {
            this.expandedSintesis = { ...this.expandedSintesis, [index]: !this.expandedSintesis[index] };
        },
        handleCheckChange(data, checked, filterKey, refName) {
            this.$nextTick(() => {
                // Obtener los datos fuente según el filterKey
                let sourceData;
                if (filterKey === 'DELITO') {
                    sourceData = this.selects.DELITOS;
                } else if (filterKey === 'OJURISDICCIONAL') {
                    sourceData = this.selects['ÓRGANO JURISDICCIONAL'];
                } else if (filterKey === 'JVINCULANTE') {
                    sourceData = this.selects['JURISPRUDENCIA VINCULANTE'];
                }

                if (!sourceData) return;

                // Obtener el texto del filtro actual
                const treeSelectRef = this.$refs[refName];
                const filterText = treeSelectRef?.filterText || '';

                // Buscar el nodo en los datos
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

                // Recopilar todos los hijos que pasan el filtro
                const collectFilteredChildren = (node, parentNodeObj = null) => {
                    const values = [];
                    if (node.children && node.children.length > 0) {
                        node.children.forEach(child => {
                            // Crear un objeto node simulado para filterTreeNode
                            const fakeNode = {
                                data: child,
                                parent: parentNodeObj
                            };

                            // Verificar si el hijo pasa el filtro
                            const passesFilter = this.filterTreeNode(filterText, child, fakeNode);

                            if (passesFilter) {
                                values.push(child.value);
                                // Recursivamente agregar descendientes que pasen el filtro
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
                        // Agregar hijos filtrados cuando se selecciona el padre
                        this.filter[filterKey] = [...new Set([...currentValues, ...childrenValues])];
                    } else {
                        // Remover todos los descendientes cuando se deselecciona el padre
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

            // Función recursiva para verificar si algún ancestro coincide
            const hasMatchingAncestor = (currentNode) => {
                if (!currentNode || !currentNode.parent) return false;
                const parentData = currentNode.parent.data;
                if (parentData && parentData.label && parentData.label.toLowerCase().includes(value.toLowerCase())) {
                    return true;
                }
                return hasMatchingAncestor(currentNode.parent);
            };

            // Función recursiva para verificar si algún descendiente coincide
            const hasMatchingDescendant = (nodeData) => {
                if (!nodeData) return false;
                if (nodeData.label && nodeData.label.toLowerCase().includes(value.toLowerCase())) {
                    return true;
                }
                if (nodeData.children && nodeData.children.length > 0) {
                    return nodeData.children.some(child => hasMatchingDescendant(child));
                }
                return false;
            };

            // Si el nodo actual coincide, mostrar
            if (data.label && data.label.toLowerCase().includes(value.toLowerCase())) {
                return true;
            }

            // Si algún ancestro coincide, mostrar este nodo (es hijo de un nodo encontrado)
            if (hasMatchingAncestor(node)) {
                return true;
            }

            // Si algún descendiente coincide, mostrar este nodo (es padre de un nodo encontrado)
            if (hasMatchingDescendant(data)) {
                return true;
            }

            return false;
        },
        formateReverse(date) {
            try {
                if (!date) return null;
                const parts = date.split('-');
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            } catch (error) {
                console.error("Error al formatear la fecha:", error);
                return null;
            }
        },
        async openModalWithData(item, index) {
            // Establecer ISOPEN = 1 inmediatamente para actualizar UI
            const previousState = item.ISOPEN;
            item.ISOPEN = 1;

            // Solo ejecutar API si la entrada nunca fue abierta (era 0)
            if (previousState === 0) {
                // Ejecutar en segundo plano sin await para no bloquear apertura
                AdminEntriesProxy.saveOpenEntrie({ IDENTRIE: item.ID })
                    .catch((error) => {
                        console.error("Error al guardar apertura de entrada:", error);
                    });
            }

            this.rowData = item;
            this.currentResultIndex = index;
            this.openModal = true;
        },
        async navigateResults(direction) {
            if (direction === 'next' && this.currentResultIndex < this.resultados.length - 1) {
                this.currentResultIndex++;
            } else if (direction === 'prev' && this.currentResultIndex > 0) {
                this.currentResultIndex--;
            }
            this.rowData = this.resultados[this.currentResultIndex];

            // Establecer ISOPEN = 1 inmediatamente para actualizar UI
            const previousState = this.rowData.ISOPEN;
            this.rowData.ISOPEN = 1;

            // Solo ejecutar API si la entrada nunca fue abierta (era 0)
            if (previousState === 0) {
                // Ejecutar en segundo plano sin await
                AdminEntriesProxy.saveOpenEntrie({ IDENTRIE: this.rowData.ID })
                    .catch((error) => {
                        console.error("Error al guardar apertura de entrada:", error);
                    });
            }
        },
        searchGlobal(query, callback) {
            if (!query || query.length < 3) {
                callback([{ isEmpty: true }]);
                return;
            }

            AdminEntriesProxy.filtersBusquedaSearch({
                GLOBAL: query,
                INDICADOR: 0
            })
                .then((response) => {
                    const suggestions = response?.map((item) => {
                        return { value: item?.DESCP?.trim() || item }
                    }) || [];
                    if (!suggestions || suggestions.length === 0) {
                        callback([{ isEmpty: true }]);
                        return;
                    }
                    callback(suggestions);
                })
                .catch((error) => {
                    console.error('Error al buscar sugerencias globales:', error);
                    callback([{ isEmpty: true }]);
                });
        },
        highlightGlobal(text) {
            if (!text || !this.filter.GLOBAL) return text;

            const searchText = typeof this.filter.GLOBAL === 'object' ? this.filter.GLOBAL.value : this.filter.GLOBAL;
            if (!searchText || searchText.trim() === '') return text;

            const escapedSearch = searchText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedSearch})`, 'gi');

            return text.replace(regex, '<strong class="highlight-denominacion">$1</strong>');
        },
        searchDenominacionOficial(query, callback) {
            if (!query || query.length < 3) {
                callback([]);
                return;
            }

            this.loadingDenominacion = true;

            AdminEntriesProxy.filtersBusquedaSearch({
                GLOBAL: query,
                INDICADOR: 1
            })
                .then((response) => {
                    const suggestions = response?.map((item) => {
                        return { value: item?.DESCP?.trim() || item }
                    }) || [];
                    if (!suggestions || suggestions.length === 0) {
                        callback([{ value: '', isEmpty: true }]);
                    } else {
                        callback(suggestions);
                    }
                })
                .catch((error) => {
                    console.error('Error al buscar denominación oficial:', error);
                    callback([{ value: '', isEmpty: true }]);
                })
                .finally(() => {
                    this.loadingDenominacion = false;
                });
        },
        highlightDenominacion(text) {
            if (!text || !this.filter.RTITLE) return text;

            const searchText = typeof this.filter.RTITLE === 'object' ? this.filter.RTITLE.value : this.filter.RTITLE;
            if (!searchText || searchText.trim() === '') return text;

            const escapedSearch = searchText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedSearch})`, 'gi');

            return text.replace(regex, '<strong class="highlight-denominacion">$1</strong>');
        },
        searchPalabrasClaves(query, callback) {
            if (!query || query.length < 3) {
                callback([]);
                return;
            }

            this.loadingPalabras = true;

            AdminEntriesProxy.filtersBusquedaSearch({
                GLOBAL: query,
                INDICADOR: 2
            })
                .then((response) => {
                    const suggestions = response?.map((item) => {
                        return { value: item?.DESCP?.trim() || item }
                    }) || [];
                    
                    // Si no hay resultados, mostrar mensaje
                    if (suggestions.length === 0) {
                        callback([{ value: '', isEmpty: true }]);
                    } else {
                        callback(suggestions);
                    }
                })
                .catch((error) => {
                    console.error('Error al buscar palabras clave:', error);
                    callback([]);
                })
                .finally(() => {
                    this.loadingPalabras = false;
                });
        },
        handlePalabraSelect(item) {
            // Evitar seleccionar el mensaje de "No se encontraron coincidencias"
            if (item && item.isEmpty) {
                this.filter.KEYWORDS = null;
            }
        },
        handleDenominacionSelect(item) {
            // Evitar seleccionar el mensaje de "No se encontraron coincidencias"
            if (item && item.isEmpty) {
                this.filter.RTITLE = null;
            }
        },
        handleGlobalSelect(item) {
            // Evitar seleccionar el mensaje de "No se encontraron coincidencias"
            if (item && item.isEmpty) {
                this.filter.GLOBAL = null;
                return;
            }

            // Si se seleccionó un valor válido, ejecutar la búsqueda global
            this.searchGlobalOnly();
        },
        highlightPalabrasClaves(text) {
            if (!text || !this.filter.KEYWORDS) return text;

            const searchText = typeof this.filter.KEYWORDS === 'object' ? this.filter.KEYWORDS.value : this.filter.KEYWORDS;
            if (!searchText || searchText.trim() === '') return text;

            const escapedSearch = searchText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedSearch})`, 'gi');

            return text.replace(regex, '<strong class="highlight-denominacion">$1</strong>');
        },
        // BUSQUEDA
        handleSearch(page) {
            let filtro = {
                INIT: ((page - 1) <= 0 ? 0 : (page - 1)) * this.table.perPage,
                ROWS: this.table.perPage
            };

            this.search(filtro);
        },
        async clearTopSearch(index, objetItem) {
            let copyDelete = { ...objetItem };
            // eliminar de top search
            this.topSearch.splice(copyDelete.index, 1);
            await AdminEntriesProxy.clearTopSearch(copyDelete.ID)
                .then((res) => {
                    if (!res.STATUS) {
                        this.topSearch.push(copyDelete);
                        return
                    }
                })
                .catch(() => {
                    this.topSearch.push(copyDelete);
                });
        },
        async listTopSearch() {
            await AdminEntriesProxy.listTopSearch(this.typeSaarch)
                .then((response) => {
                    this.topSearch = [];
                    if (!response) {
                        return;
                    }
                    this.topSearch = response?.map((item) => {
                        return { 
                            ID: item?.ID, 
                            DESCP: item?.DESCP.trim(), 
                            MODO: item?.MODO,
                            ORDEN: item?.ORDEN
                        }
                    });

                    // campos unicos 
                    this.topSearch = this.topSearch.filter((item, index, self) =>
                        index === self.findIndex((t) => (
                            t.DESCP === item.DESCP && t.MODO === item.MODO
                        ))
                    );
                })
                .catch(() => {
                    this.topSearch = [];
                });
        },
        onDragStart(index) {
            this.draggedIndex = index;
        },
        onDragOver(index) {
            this.dragOverIndex = index;
        },
        async onDrop(targetIndex) {
            if (this.draggedIndex === null || this.draggedIndex === targetIndex) {
                return;
            }

            const draggedItem = this.topSearch[this.draggedIndex];
            const targetItem = this.topSearch[targetIndex];
            
            // Guardar copia del estado original
            const originalTopSearch = [...this.topSearch];

            // Hacer el intercambio visual inmediatamente (optimistic update)
            const newTopSearch = [...this.topSearch];
            [newTopSearch[this.draggedIndex], newTopSearch[targetIndex]] = 
                [newTopSearch[targetIndex], newTopSearch[this.draggedIndex]];
            this.topSearch = newTopSearch;

            try {
                // Enviar al backend
                const response = await AdminEntriesProxy.intercambioOrderSearch(
                    draggedItem.ID, 
                    targetItem.ID
                );

                // Si hay error, revertir al estado original
                if (!response.STATUS) {
                    this.topSearch = originalTopSearch;
                }
            } catch (error) {
                console.error('Error al intercambiar orden:', error);
                // Revertir al estado original
                this.topSearch = originalTopSearch;
            } finally {
                this.draggedIndex = null;
                this.dragOverIndex = null;
            }
        },
        onDragEnd() {
            this.draggedIndex = null;
            this.dragOverIndex = null;
        },
        async search(ffff = {}) {
            this.hasSearched = true;
            this.isCollapsed = false;
            this.isCollapsed2 = true;
            this.showFilters = true;
            let filtro = { ...this.filter, ...ffff };


            filtro.TYPE = this.typeSaarch;
            this.isLoading = true;

            let FRESOLUTIONFILTER = null;
            if (filtro.FRESOLUTION1 && filtro.FRESOLUTION2) {
                FRESOLUTIONFILTER = filtro.FRESOLUTION1 + ',' + filtro.FRESOLUTION2;
            } else if (filtro.FRESOLUTION1) {
                FRESOLUTIONFILTER = filtro.FRESOLUTION1 + ',';
            } else if (filtro.FRESOLUTION2) {
                FRESOLUTIONFILTER = ',' + filtro.FRESOLUTION2;
            }

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
                .then((response) => {
                    if (!response) {
                        this.resultados = [];
                        this.table.totalRows = 0;
                        return;
                    }
                    
                    this.resultados = response?.map((item) => {
                        return {
                            ...item,
                            DELITO: JSON.parse(item.DELITO),
                            TPONRMA: JSON.parse(item.TPONRMA),
                            OEMISOR: JSON.parse(item.OEMISOR),
                            RECURSO: JSON.parse(item.RECURSO),
                            OJURISDICCIONAL: JSON.parse(item.OJURISDICCIONAL),
                            AMBIT: JSON.parse(item.AMBIT),
                            JURISDICCION: JSON.parse(item.JURISDICCION),
                            MAGISTRATES: JSON.parse(item.MAGISTRATES),
                            FRESOLUTION: item.FRESOLUTION ? item.FRESOLUTION.split("T")[0] : null,
                            TEMA: ![null, undefined, ""].includes(item?.TEMA) ? item.TEMA : null,
                            SUBTEMA: ![null, undefined, ""].includes(item?.SUBTEMA) ? item.SUBTEMA : null,
                            SHORTSUMMARY: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? item.SHORTSUMMARY : null,
                            SHORTSUMMARY2: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? this.setPalabras(item.SHORTSUMMARY.replace(/<[^>]*>?/gm, ''), 18) : null,
                            SHORTSUMMARY3: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? this.setPalabras(item.SHORTSUMMARY.replace(/<[^>]*>?/gm, ''), 10000, false) : null,
                        };
                    });

                    this.table.totalRows = response?.[0]?.TOTALROWS || 0;
                })
                .catch(() => {
                    toast.error("Ocurrió un error al buscar", { toastId: "error" });
                })
                .finally(() => {
                    this.isLoading = false;
                    this.listTopSearch();
                });

        },
        async searchGlobalOnly(ffff = {}) {
            this.hasSearched = true;
            this.isCollapsed = false;
            this.isCollapsed2 = true;
            this.showFilters = true;
            let filtro = { ...this.filter, ...ffff };

            this.isLoading = true;

            let FRESOLUTIONFILTER = null;
            if (filtro.FRESOLUTION1 && filtro.FRESOLUTION2) {
                FRESOLUTIONFILTER = filtro.FRESOLUTION1 + ',' + filtro.FRESOLUTION2;
            } else if (filtro.FRESOLUTION1) {
                FRESOLUTIONFILTER = filtro.FRESOLUTION1 + ',';
            } else if (filtro.FRESOLUTION2) {
                FRESOLUTIONFILTER = ',' + filtro.FRESOLUTION2;
            }

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
                TYPE: null, // NO enviar TYPE en búsqueda global
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
                .then((response) => {
                    if (!response) {
                        this.resultados = [];
                        this.table.totalRows = 0;
                        return;
                    }

                    this.resultados = response?.map((item) => {
                        return {
                            ...item,
                            DELITO: JSON.parse(item.DELITO),
                            TPONRMA: JSON.parse(item.TPONRMA),
                            OEMISOR: JSON.parse(item.OEMISOR),
                            RECURSO: JSON.parse(item.RECURSO),
                            OJURISDICCIONAL: JSON.parse(item.OJURISDICCIONAL),
                            AMBIT: JSON.parse(item.AMBIT),
                            JURISDICCION: JSON.parse(item.JURISDICCION),
                            MAGISTRATES: JSON.parse(item.MAGISTRATES),
                            FRESOLUTION: item.FRESOLUTION ? item.FRESOLUTION.split("T")[0] : null,
                            TEMA: ![null, undefined, ""].includes(item?.TEMA) ? item.TEMA : null,
                            SUBTEMA: ![null, undefined, ""].includes(item?.SUBTEMA) ? item.SUBTEMA : null,
                            SHORTSUMMARY: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? item.SHORTSUMMARY : null,
                            SHORTSUMMARY2: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? this.setPalabras(item.SHORTSUMMARY.replace(/<[^>]*>?/gm, ''), 18) : null,
                            SHORTSUMMARY3: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? this.setPalabras(item.SHORTSUMMARY.replace(/<[^>]*>?/gm, ''), 10000, false) : null,
                        };
                    });

                    this.table.totalRows = response?.[0]?.TOTALROWS || 0;
                })
                .catch(() => {
                    toast.error("Ocurrió un error al buscar", { toastId: "error" });
                })
                .finally(() => {
                    this.isLoading = false;
                    this.listTopSearch();
                });

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

            await AdminEntriesProxy.search({
                ID: id,
                ROWS: 10,
                INIT: 0,
            })
                .then((response) => {
                    if (!response) {
                        this.resultados = [];
                        this.table.totalRows = 0;
                        return;
                    }

                    this.resultados = response?.map((item) => {
                        return {
                            ...item,
                            DELITO: JSON.parse(item.DELITO),
                            TPONRMA: JSON.parse(item.TPONRMA),
                            OEMISOR: JSON.parse(item.OEMISOR),
                            RECURSO: JSON.parse(item.RECURSO),
                            OJURISDICCIONAL: JSON.parse(item.OJURISDICCIONAL),
                            AMBIT: JSON.parse(item.AMBIT),
                            JURISDICCION: JSON.parse(item.JURISDICCION),
                            MAGISTRATES: JSON.parse(item.MAGISTRATES),
                            FRESOLUTION: item.FRESOLUTION ? item.FRESOLUTION.split("T")[0] : null,
                            TEMA: ![null, undefined, ""].includes(item?.TEMA) ? item.TEMA : null,
                            SUBTEMA: ![null, undefined, ""].includes(item?.SUBTEMA) ? item.SUBTEMA : null,
                            SHORTSUMMARY: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? item.SHORTSUMMARY : null,
                            SHORTSUMMARY2: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? this.setPalabras(item.SHORTSUMMARY.replace(/<[^>]*>?/gm, ''), 18) : null,
                            SHORTSUMMARY3: ![null, undefined, ""].includes(item?.SHORTSUMMARY) ? this.setPalabras(item.SHORTSUMMARY.replace(/<[^>]*>?/gm, ''), 10000, false) : null,
                        };
                    });

                    this.table.totalRows = response?.[0]?.TOTALROWS || 0;
                })
                .catch(() => {
                    toast.error("Ocurrió un error al buscar", { toastId: "error" });
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        setPalabras(palabra, cantidad = 15, isBandera = true) {
            if (!palabra) return "";
            return palabra.split(" ").slice(0, cantidad).join(" ") + (isBandera ? "..." : "") || "";
        },
        async filtersAll() {
            // this.isLoading = true;
            try {
                const [magistrados, filters] = await Promise.all([
                    MagistradoProxy.list({ ROWS: 1000, INIT: 0, DESC: null }).catch(() => []),
                    filterProxy.list({ NIVEL: 5 }, null).catch(() => []),
                ]);

                this.magistrados(magistrados);
                this.filtrosNiveles(filters);
            } catch (error) {
                toast.error("Ocurrió un error al cargar los filtros", { toastId: "error" });
                this.isLoading = false;

            } finally {
                this.isLoading = false;
            }
        },
        cortarDescripcion(texto) {
            if (texto.length > 30) {
                return texto.slice(0, 30) + '...';
            }
            return texto;
        },
        magistrados(magistrados) {
            this.selects["MAGISTRATES"] = magistrados
                .map(item => ({
                    value: item.ID,
                    label: `${item.APELLIDOS} ${item.NOMBRES}`,
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
        },
        filtrosNiveles(data) {
            data.forEach(item => {
                const NIVEL_2 = JSON.parse(item.NIVEL_2);
                this.selects[item.LABEL.toUpperCase()] = NIVEL_2.map(item => ({
                    value: item.VALUE,
                    label: item.LABEL,
                    children: item.NIVEL_3.map(item2 => ({
                        value: item2.VALUE,
                        label: item2.LABEL,
                        children: item2.NIVEL_4.map(item3 => ({
                            value: item3.VALUE,
                            label: item3.LABEL,
                            children: item3.NIVEL_5.map(item4 => ({
                                value: item4.VALUE,
                                label: item4.LABEL,
                                children: item4.NIVEL_6.map(item5 => ({
                                    value: item5.VALUE,
                                    label: item5.LABEL,
                                })),
                            })),
                        })),
                    })),
                }));
            });

            this.items = data.map(item => ({
                title: item.LABEL,
                description: item.DESCPINF,
            }));
        },
        highlightText(text) {
            if (!text || !this.filter.GLOBAL) return text;

            // Obtener el texto de búsqueda
            const searchText = typeof this.filter.GLOBAL === 'object' ? this.filter.GLOBAL.DESCP : this.filter.GLOBAL;
            if (!searchText || searchText.trim() === '') return text;

            // Lista de palabras comunes que no deben resaltarse (preposiciones, artículos, conectores)
            const stopWords = [
                'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
                'de', 'del', 'al', 'a', 'ante', 'bajo', 'con', 'contra', 'desde', 'en', 'entre', 'hacia', 'hasta',
                'para', 'por', 'según', 'sin', 'sobre', 'tras',
                'y', 'e', 'o', 'u', 'ni', 'que', 'pero', 'sino', 'mas',
                'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas',
                'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
                'se', 'lo', 'le', 'les', 'me', 'te', 'nos', 'os',
                'es', 'son', 'está', 'están', 'fue', 'fueron', 'ha', 'han', 'había', 'habían',
                'como', 'cuando', 'donde', 'cual', 'cuales', 'quien', 'quienes'
            ];

            // Limpiar el texto de búsqueda y dividirlo en palabras
            const searchWords = searchText.trim().split(/\s+/);

            // Dependiendo del modo de búsqueda
            let regex;
            if (this.modoBusqueda === 1 || this.modoBusqueda === 2) {
                // Modo 1: Contenga solamente estas palabras
                // Modo 2: Contenga alguna de estas palabras
                // Filtrar palabras comunes (preposiciones, conectores, artículos)
                const filteredWords = searchWords.filter(word =>
                    !stopWords.includes(word.toLowerCase()) && word.length > 0
                );

                if (filteredWords.length === 0) {
                    return text; // No hay palabras significativas para resaltar
                }

                // Escape caracteres especiales de regex
                const escapedWords = filteredWords.map(word =>
                    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                );

                // Resaltar cada palabra significativa individualmente
                regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
            } else if (this.modoBusqueda === 3) {
                // Modo 3: Contenga la frase completa
                // Resaltar la frase completa incluyendo preposiciones
                const escapedPhrase = searchText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regex = new RegExp(`(${escapedPhrase})`, 'gi');
            }

            // Reemplazar las coincidencias con el texto resaltado
            return text.replace(regex, '<mark class="highlight-text">$1</mark>');
        },
        copyToClipboard(item, index) {
            let textToCopy = '';

            if (item.TYPE === 'jurisprudences') {
                // Para jurisprudencia: solo copiar el título
                textToCopy = item.TITULO || '';
            } else if (item.TYPE === 'legislations') {
                // Para legislación: copiar título y denominación oficial separados por " - "
                const titulo = item.TITULO || '';
                const denominacion = item.RTITLE || '';
                textToCopy = denominacion ? `${titulo} - ${denominacion}` : titulo;
            } else {
                // Por defecto: solo el título
                textToCopy = item.TITULO || '';
            }

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    this.showCopyMessage = index;
                    setTimeout(() => {
                        this.showCopyMessage = null;
                    }, 1500);
                })
                .catch(() => {
                    // Silencioso en caso de error
                });
        },
        onClear(indicador = 0) {
            this.filter.GLOBAL = null;
            this.filter.FRESOLUTION1 = null;
            this.filter.DELITO = [];
            this.filter.NMRCN = null;
            this.filter.TPONRMA = [];
            this.filter.OEMISOR = null;
            this.filter.RECURSO = [];
            this.filter.OJURISDICCIONAL = [];
            this.filter.MAGISTRATES = [];
            this.filter.JVINCULANTE = [];
            this.filter.FRESOLUTION2 = null;
            this.filter.MATERIA = [];
            this.filter.JURISDICCION = [];
            this.filter.TITLE = null;
            this.filter.CRITERIO = null;
            this.filter.KEYWORDS = null;
            this.filter.TEMA = null;
            this.filter.BLOG = false;
            this.filter.SUBTEMA = null;
            this.filter.AMBITO = [];
            this.filter.ESTADO = null;
            this.sortOrder = 'desc';
            //this.isFilter = "generales";

            this.isCollapsed = true;
            this.showFilters = false;
            this.resultados = [];
            this.table.currentPage = 1;
            this.table.perPage = 10;
            this.table.totalRows = 0;

            if (indicador == 1) {
                this.resultados = [];
                this.table.currentPage = 1;
                return;
            }

            this.handleSearch(1);
        },
        executionsSearch(searchQuestions) {
            this.modoBusqueda = (searchQuestions.MODO && !isNaN(parseInt(searchQuestions.MODO))) ?
                parseInt(searchQuestions.MODO) : this.modoBusqueda;
            this.filter.GLOBAL = searchQuestions.DESCP;
            this.searchGlobalOnly()
        },


    },
    watch: {
        "role": {
            immediate: true
        },
        "filter.TYPE": {
            handler() {
                this.filter = {
                    ...this.filter,
                    ...this.default
                }
            },
            immediate: true,
        },
        "isFilter": {
            handler() {
                this.filter = {
                    ...this.filter,
                    ...this.default
                }
            },
            immediate: true,
        },
        "typeSaarch": {
            handler(newValue, oldValue) {
                this.listTopSearch();

                // Si ya se ha realizado una búsqueda y el tipo cambió, ejecutar búsqueda de nuevo
                if (oldValue !== undefined && this.hasSearched) {
                    this.handleSearch(1);
                }
            },
            immediate: true,
        },
    },
    mounted() {
        this.isLoading = true;
        this.listTopSearch();
        this.filtersAll();
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll(); // Check initial position

        const { search, id } = this.$route.query;
        if (id) {
            this.filter.GLOBAL = search || '';
            this.$nextTick(() => {
                this.searchByNormaId(id);
            });
        }
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
};
</script>

<!-- Estilos globales NO SCOPED para el dropdown -->
<style>
/* Estilos modernos para tooltips - GLOBAL */
.p-tooltip {
    background: linear-gradient(135deg, #4A5568 0%, #2D3748 100%) !important;
    color: #ffffff !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
    border-radius: 12px !important;
    padding: 12px 16px !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    font-family: 'Lato', sans-serif !important;
    font-weight: 500 !important;
    max-width: 300px !important;
    word-wrap: break-word !important;
    z-index: 10000 !important;
}

/* Fix texto completo en dropdown de el-tree-select - GLOBAL */
.el-select-dropdown__item {
    height: auto !important;
    min-height: 34px !important;
    white-space: normal !important;
    word-break: break-word !important;
    overflow: hidden !important;
    text-overflow: unset !important;
    line-height: 1.4 !important;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    font-size: 12px !important;
}

.el-select-dropdown__item span {
    white-space: normal !important;
    word-break: break-word !important;
    overflow: hidden !important;
    display: block !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
}

/* Tree node wrap - afecta dropdown en body */
.el-tree-node__content {
    height: auto !important;
    min-height: 26px !important;
    align-items: flex-start !important;
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    box-sizing: border-box !important;
}

.el-tree-node__label {
    white-space: normal !important;
    word-break: break-word !important;
    overflow: hidden !important;
    display: block !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
    flex: 1 !important;
    min-width: 0 !important;
}

.el-tree-node {
    white-space: normal !important;
}

/* Limitar ancho del dropdown de Delito al ancho del sidebar */
.sidebar-tree-popper {
    max-width: 292px !important;
    width: 292px !important;
    min-width: unset !important;
    box-sizing: border-box !important;
}

.sidebar-tree-popper .el-select-dropdown__wrap {
    max-height: 260px !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
}

.sidebar-tree-popper .el-tree-node__content {
    word-break: break-word !important;
    white-space: normal !important;
}

.sidebar-tree-popper .el-select-dropdown__item {
    word-break: break-word !important;
    white-space: normal !important;
    line-height: 1.5 !important;
    height: auto !important;
    min-height: 34px !important;
    padding: 8px 10px !important;
    font-size: 11.5px !important;
}

.sidebar-tree-popper .el-select-dropdown__item div {
    word-break: break-word !important;
    white-space: normal !important;
}

/* Estilos para el-autocomplete en denominación oficial */
.custom-tree-select.el-autocomplete {
    width: 100% !important;
}

/* Asegurar que el input del autocomplete tenga el mismo estilo que otros inputs */
::v-deep(.custom-tree-select.el-autocomplete .el-input__wrapper) {
    background-color: var(--el-fill-color-blank, #ffffff);
    border: 1px solid #E2E8F0 !important;
    border-radius: 0.375rem !important;
    box-shadow: none !important;
    outline: none !important;
    padding: 0 0.75rem !important;
    margin: 0 !important;
    min-height: 50px !important;
    height: 50px !important;
}

/* Regla general para inputs con suffix - excluir autocomplete */
::v-deep(.el-input--suffix:not(.el-autocomplete) .el-input__wrapper) {
    padding: 0px !important;
}

::v-deep(.el-input--suffix:not(.el-autocomplete) .el-input__wrapper .el-input__inner) {
    height: 50px !important;
}

::v-deep(.custom-tree-select.el-autocomplete .el-input__wrapper:hover) {
    border-color: #E2E8F0;
}

::v-deep(.custom-tree-select.el-autocomplete .el-input__wrapper.is-focus) {
    border-color: #E2E8F0;
    box-shadow: none !important;
}

::v-deep(.custom-tree-select.el-autocomplete .el-input__inner) {
    height: 50px !important;
    line-height: 50px !important;
    padding: 0 !important;
}

/* Dropdown del autocomplete */
.sidebar-tree-popper.denominacion-autocomplete {
    width: 292px !important;
    max-width: 292px !important;
    min-width: 292px !important;
    box-sizing: border-box !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
    border: 1px solid #E2E8F0 !important;
    border-radius: 0.375rem !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion {
    width: 100% !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
}

.sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion__list {
    max-height: 280px !important;
    overflow-y: auto !important;
    padding: 0 !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
}

.sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion__wrap {
    max-height: 280px !important;
    width: 100% !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
}

.el-scrollbar__wrap--hidden-default{
    background: var(--el-bg-color-overlay, white);
}

.el-autocomplete-suggestion__wrap.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default{
    background: var(--el-bg-color-overlay, white);
    border: 1px solid #E2E8F0 !important;
    border-radius: 0.375rem !important;
}
/* Items del dropdown */
.sidebar-tree-popper.denominacion-autocomplete li {
    word-break: break-word !important;
    white-space: normal !important;
    line-height: 1.5 !important;
    height: auto !important;
    min-height: 34px !important;
    padding: 8px 10px !important;
    font-size: 11.5px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.sidebar-tree-popper.denominacion-autocomplete li div {
    word-break: break-word !important;
    white-space: normal !important;
    width: 100% !important;
}

/* Scrollbar personalizado para el dropdown */
.sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar {
    width: 6px !important;
}

.sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-track {
    background: #f1f1f1 !important;
    border-radius: 3px !important;
}

.sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-thumb {
    background: #cbd5e0 !important;
    border-radius: 3px !important;
}

.sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-thumb:hover {
    background: #a0aec0 !important;
}

/* Dropdown del autocomplete para Palabras Clave */
.sidebar-tree-popper.palabras-autocomplete {
    width: 292px !important;
    max-width: 292px !important;
    min-width: 292px !important;
    box-sizing: border-box !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
    border: 1px solid #E2E8F0 !important;
    border-radius: 0.375rem !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion {
    width: 100% !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
}

.sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion__list {
    max-height: 280px !important;
    overflow-y: auto !important;
    padding: 0 !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
}

.sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion__wrap {
    max-height: 280px !important;
    width: 100% !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
}

.sidebar-tree-popper.palabras-autocomplete li {
    word-break: break-word !important;
    white-space: normal !important;
    line-height: 1.5 !important;
    height: auto !important;
    min-height: 34px !important;
    padding: 8px 10px !important;
    font-size: 11.5px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.sidebar-tree-popper.palabras-autocomplete li div {
    word-break: break-word !important;
    white-space: normal !important;
    width: 100% !important;
}

.sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar {
    width: 6px !important;
}

.sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-track {
    background: #f1f1f1 !important;
    border-radius: 3px !important;
}

.sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-thumb {
    background: #cbd5e0 !important;
    border-radius: 3px !important;
}

.sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-thumb:hover {
    background: #a0aec0 !important;
}

/* Mensaje cuando no hay coincidencias en palabras clave */
.sidebar-tree-popper.palabras-autocomplete .empty-message {
    color: #9ca3af !important;
    font-size: 11.5px !important;
    padding: 8px 10px !important;
    text-align: center !important;
    pointer-events: none !important;
    user-select: none !important;
    cursor: default !important;
}

.sidebar-tree-popper.palabras-autocomplete .empty-message em {
    font-style: italic !important;
}

.sidebar-tree-popper.palabras-autocomplete li:has(.empty-message) {
    cursor: default !important;
    pointer-events: none !important;
}

.sidebar-tree-popper.palabras-autocomplete li:has(.empty-message):hover {
    background-color: transparent !important;
}

.sidebar-autocomplete-popper {
    max-width: 292px !important;
    width: 292px !important;
    min-width: unset !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}

.sidebar-autocomplete-popper .p-autocomplete-items {
    max-height: 280px !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
}

.sidebar-autocomplete-popper .p-autocomplete-item {
    word-break: break-word !important;
    white-space: normal !important;
    padding: 8px 10px !important;
    font-size: 11.5px !important;
    line-height: 1.5 !important;
    min-height: 36px !important;
    display: flex !important;
    align-items: center !important;
}

.sidebar-autocomplete-popper .autocomplete-item {
    word-break: break-word !important;
    white-space: normal !important;
    font-size: 11.5px !important;
    line-height: 1.5 !important;
    display: block !important;
    width: 100% !important;
}

/* Estilos globales para el autocomplete del sidebar */
.sidebar-autocomplete .p-autocomplete-panel {
    max-width: 292px !important;
    width: 292px !important;
    box-sizing: border-box !important;
}

/* Fijar ANCHO en los tree-selects - puede crecer en alto pero no en ancho */
.sidebar-body .custom-tree-select .el-select__wrapper {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
}

.sidebar-body .custom-tree-select .el-select__selection {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex: 1 !important;
    flex-wrap: wrap !important;
    align-items: flex-start !important;
    padding: 2px 0 !important;
    gap: 3px !important;
}

.sidebar-body .custom-tree-select .el-tag {
    max-width: 130px !important;
    height: 22px !important;
    line-height: 22px !important;
    font-size: 11px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    box-sizing: border-box !important;
}

.sidebar-body .custom-tree-select .el-tag__content {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    max-width: 100px !important;
    display: block !important;
}

.p-tooltip .p-tooltip-text {
    background: transparent !important;
    padding: 0 !important;
}

.p-tooltip .p-tooltip-arrow {
    border-top-color: #4A5568 !important;
}

.p-tooltip.p-tooltip-bottom .p-tooltip-arrow {
    border-bottom-color: #4A5568 !important;
    border-top-color: transparent !important;
}

.p-tooltip.p-tooltip-left .p-tooltip-arrow {
    border-left-color: #4A5568 !important;
    border-top-color: transparent !important;
}

.p-tooltip.p-tooltip-right .p-tooltip-arrow {
    border-right-color: #4A5568 !important;
    border-top-color: transparent !important;
}

/* Tooltip personalizado con clase tooltip-rojo */
.p-tooltip.tooltip-rojo {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 100%) !important;
    box-shadow: 0 8px 24px rgba(223, 45, 178, 0.35), 0 2px 8px rgba(139, 92, 246, 0.25) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.p-tooltip.tooltip-rojo .p-tooltip-arrow {
    border-top-color: #DF2DB2 !important;
}

.p-tooltip.tooltip-rojo.p-tooltip-bottom .p-tooltip-arrow {
    border-bottom-color: #DF2DB2 !important;
    border-top-color: transparent !important;
}

.p-tooltip.tooltip-rojo.p-tooltip-left .p-tooltip-arrow {
    border-left-color: #DF2DB2 !important;
    border-top-color: transparent !important;
}

.p-tooltip.tooltip-rojo.p-tooltip-right .p-tooltip-arrow {
    border-right-color: #DF2DB2 !important;
    border-top-color: transparent !important;
}

/* Estilos globales para dropdowns de Element Plus en móvil (NO SCOPED) */
@media (max-width: 768px) {
    .el-select-dropdown.el-popper {
        max-width: 90vw !important;
        width: 90vw !important;
        left: 5vw !important;
        right: 5vw !important;
        box-sizing: border-box !important;
    }

    .el-select-dropdown__wrap {
        max-width: 100% !important;
        width: 100% !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
    }

    .el-tree {
        max-width: 100% !important;
        width: 100% !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
    }

    .el-tree-node {
        max-width: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
    }

    .el-tree-node__content {
        max-width: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        padding: 8px 6px !important;
        display: flex !important;
        align-items: center !important;
        box-sizing: border-box !important;
    }

    .el-tree-node__label {
        max-width: calc(90vw - 80px) !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        font-size: 13px !important;
    }

    .el-checkbox__label {
        max-width: calc(90vw - 80px) !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        font-size: 13px !important;
    }

    .el-tree-node__expand-icon {
        flex-shrink: 0 !important;
        width: 18px !important;
        margin-right: 4px !important;
    }

    .el-checkbox {
        flex-shrink: 0 !important;
        margin-right: 6px !important;
    }

    .el-tree-node__children .el-tree-node__content {
        padding-left: 20px !important;
    }
}

/* ====== DARK MODE for global popper elements ====== */
.dark .sidebar-tree-popper.search-global-autocomplete {
    background-color: #1e293b !important;
    background: #1e293b !important;
    border-color: #374151 !important;
}

.dark .sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion {
    background-color: #1e293b !important;
    background: #1e293b !important;
}

.dark .sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__list li {
    color: #e2e8f0 !important;
}

.dark .sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__list li:hover {
    background-color: #374151 !important;
}

.dark .sidebar-tree-popper .el-tree {
    background: #1e293b !important;
    color: #e2e8f0 !important;
}

.dark .sidebar-tree-popper .el-tree-node__content:hover {
    background-color: #374151 !important;
}

/* Dark mode for autocomplete scrollbar */
.dark .sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__wrap {
    background-color: #1e293b !important;
    background: #1e293b !important;
}

.dark .sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__list {
    background-color: #1e293b !important;
    background: #1e293b !important;
}

.dark .sidebar-tree-popper.search-global-autocomplete li {
    background-color: #1e293b !important;
}

.dark .sidebar-tree-popper.search-global-autocomplete li div,
.dark .sidebar-tree-popper.search-global-autocomplete li span,
.dark .sidebar-tree-popper.search-global-autocomplete li strong {
    background: transparent !important;
    background-color: transparent !important;
    color: #e2e8f0 !important;
}

/* Dark mode for PrimeVue autocomplete popper */
.dark .p-autocomplete-panel {
    background: #1e293b !important;
    border-color: #374151 !important;
}

.dark .p-autocomplete-panel .p-autocomplete-item {
    color: #e2e8f0 !important;
}

.dark .p-autocomplete-panel .p-autocomplete-item:hover {
    background: #374151 !important;
}

/* Dark mode for el-select dropdown popper */
.dark .el-select-dropdown {
    background-color: #1e293b !important;
    border-color: #374151 !important;
}

.dark .el-select-dropdown__item {
    color: #e2e8f0 !important;
}

.dark .el-select-dropdown__item:hover,
.dark .el-select-dropdown__item.hover {
    background-color: #374151 !important;
}

.dark .el-select-dropdown__item.selected {
    color: #93c5fd !important;
}

/* Dark mode for el-tree inside poppers */
.dark .el-tree {
    background: #1e293b !important;
    color: #e2e8f0 !important;
}

.dark .el-tree-node__content:hover {
    background-color: #374151 !important;
}

.dark .el-checkbox__inner {
    background-color: #0f172a !important;
    border-color: #4b5563 !important;
}

.dark .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #3b82f6 !important;
    border-color: #3b82f6 !important;
}

/* Dark mode for datepicker popup */
.dark .mx-datepicker-popup {
    background: #1e293b !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .mx-calendar {
    background: #1e293b !important;
    color: #e2e8f0 !important;
}

.dark .mx-table th,
.dark .mx-table td {
    color: #cbd5e1 !important;
}

.dark .mx-btn {
    color: #94a3b8 !important;
}

.dark .mx-btn:hover {
    color: #e2e8f0 !important;
}

/* Dark mode for denominacion-autocomplete popper */
.dark .sidebar-tree-popper.denominacion-autocomplete {
    background-color: #1e293b !important;
    border-color: #374151 !important;
}

.dark .sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion,
.dark .sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion__list,
.dark .sidebar-tree-popper.denominacion-autocomplete .el-autocomplete-suggestion__wrap {
    background-color: #1e293b !important;
}

.dark .sidebar-tree-popper.denominacion-autocomplete li {
    color: #e2e8f0 !important;
}

.dark .sidebar-tree-popper.denominacion-autocomplete li:hover {
    background-color: #374151 !important;
}

/* Dark mode for palabras-autocomplete popper */
.dark .sidebar-tree-popper.palabras-autocomplete {
    background-color: #1e293b !important;
    border-color: #374151 !important;
}

.dark .sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion,
.dark .sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion__list,
.dark .sidebar-tree-popper.palabras-autocomplete .el-autocomplete-suggestion__wrap {
    background-color: #1e293b !important;
}

.dark .sidebar-tree-popper.palabras-autocomplete li {
    color: #e2e8f0 !important;
}

.dark .sidebar-tree-popper.palabras-autocomplete li:hover {
    background-color: #374151 !important;
}

/* Dark mode for el-scrollbar wraps */
.dark .el-scrollbar__wrap--hidden-default {
    background: #1e293b !important;
}

.dark .el-autocomplete-suggestion__wrap.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default {
    background: #1e293b !important;
    border-color: #374151 !important;
}

/* Dark mode for custom-tree-select autocomplete input */
.dark .custom-tree-select.el-autocomplete .el-input__wrapper {
    background-color: #0f172a !important;
    border-color: #374151 !important;
}

.dark .custom-tree-select.el-autocomplete .el-input__inner {
    color: #e2e8f0 !important;
}

.dark .custom-tree-select.el-autocomplete .el-input__inner::placeholder {
    color: #64748b !important;
}

/* Dark mode for sidebar-autocomplete-popper (PrimeVue) */
.dark .p-autocomplete-panel.sidebar-autocomplete-popper {
    background: #1e293b !important;
    border-color: #374151 !important;
}

.dark .p-autocomplete-panel.sidebar-autocomplete-popper .p-autocomplete-item {
    color: #e2e8f0 !important;
}

.dark .p-autocomplete-panel.sidebar-autocomplete-popper .p-autocomplete-item:hover {
    background: #374151 !important;
}

/* Dark mode for el-input__wrapper generic */
.dark .el-input__wrapper {
    background-color: #0f172a !important;
    border-color: #374151 !important;
}

.dark .el-input__inner {
    color: #e2e8f0 !important;
    background: transparent !important;
}

.dark .el-input__inner::placeholder {
    color: #64748b !important;
}

/* Dark mode for el-select dropdown items */
.dark .el-select-dropdown {
    background-color: #1e293b !important;
    border-color: #374151 !important;
}

.dark .el-select-dropdown__item {
    color: #e2e8f0 !important;
}

.dark .el-select-dropdown__item:hover,
.dark .el-select-dropdown__item.hover {
    background-color: #374151 !important;
}

.dark .el-select-dropdown__item.selected {
    color: #93c5fd !important;
}

.dark .el-popper {
    background: #1e293b !important;
    border-color: #374151 !important;
}

.dark .el-popper__arrow::before {
    background: #1e293b !important;
    border-color: #374151 !important;
}

/* ====== Dark mode for ALL deep child-component inputs ====== */
/* These MUST be in the unscoped block because ::v-deep in scoped     */
/* generates .dark[data-v-xxx] which never matches (.dark is on html) */

.dark .mx-input,
.dark .mx-input:focus,
.dark .mx-input:hover {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .mx-input::placeholder {
    color: #64748b !important;
}

.dark .mx-icon-calendar,
.dark .mx-icon-clear {
    color: #94a3b8 !important;
}

.dark .el-select__wrapper,
.dark .el-select__wrapper:focus,
.dark .el-select__wrapper:hover,
.dark .el-select__wrapper.is-focused {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .el-select__wrapper:hover {
    border-color: #8B5CF6 !important;
}

.dark .el-select__placeholder {
    color: #64748b !important;
    background: transparent !important;
}

.dark .el-select__selected-item {
    background: transparent !important;
    color: #e2e8f0 !important;
}

.dark .el-select__suffix {
    color: #94a3b8 !important;
}

.dark .el-select__tags-text {
    color: #93c5fd !important;
}

.dark .el-tag {
    border-color: #3b82f6 !important;
    color: #93c5fd !important;
    background: rgba(59, 130, 246, 0.1) !important;
}

.dark .el-tag__close {
    color: #93c5fd !important;
}

.dark .el-autocomplete .el-input__wrapper,
.dark .el-autocomplete .el-input__wrapper:focus,
.dark .el-autocomplete .el-input__wrapper:hover,
.dark .el-autocomplete .el-input__wrapper.is-focused,
.dark .el-autocomplete .el-input__wrapper.is-focus {
    background-color: #0f172a !important;
    border-color: #374151 !important;
}

.dark .custom-tree-select .el-input__wrapper {
    background: #0f172a !important;
    border-color: #374151 !important;
    box-shadow: none !important;
}

.dark .custom-tree-select .el-input__inner {
    color: #e2e8f0 !important;
}

.dark .custom-tree-select .el-input__inner::placeholder {
    color: #64748b !important;
}

.dark .b-form-tags,
.dark .b-form-tags:focus,
.dark .b-form-tags:hover,
.dark .b-form-tags.focus {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .b-form-tags .form-control,
.dark .b-form-tags .form-control:focus,
.dark .b-form-tags input,
.dark .b-form-tags input:focus {
    background: transparent !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .b-form-tags-input {
    color: #e2e8f0 !important;
    background: transparent !important;
}

.dark .b-form-tag {
    border-color: #3b82f6 !important;
    color: #93c5fd !important;
}

.dark .p-autocomplete-input,
.dark .p-autocomplete-input:focus,
.dark .p-autocomplete-input:hover {
    color: #e2e8f0 !important;
    background: transparent !important;
}

.dark .p-autocomplete-input::placeholder {
    color: #64748b !important;
}

.dark .page-item .page-link {
    background: transparent !important;
    border-color: #374151 !important;
    color: #94a3b8 !important;
}

.dark .page-item .page-link:hover {
    background: rgba(139, 92, 246, 0.15) !important;
    border-color: #8B5CF6 !important;
    color: #c4b5fd !important;
}

.dark .page-item.disabled .page-link {
    background: transparent !important;
    border-color: #1e293b !important;
    color: #4b5563 !important;
}
</style>

<style scoped>
@media (max-width: 768px) {

    body,
    html {
        overflow-x: hidden !important;
        max-width: 100vw !important;
    }
}

.z-1050 {
    z-index: 1050;
}

/* CSS global o en <style scoped> */
.force-open-down {
    top: 100% !important;
    bottom: auto !important;
    transform: translateY(0px) !important;
}

/* Anula colocación automática hacia arriba */
.force-open-down[data-p-popper-placement^="top"] {
    top: 100% !important;
}

/* Help Icon Container */
.help-info-container {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 1050;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
}

.help-info-container[style*="display: none"] {
    opacity: 0;
    transform: translateY(-50%) translateX(20px);
}

.help-icon-btn {
    width: 28px;
    height: 50px;
    border-radius: 6px 0 0 6px;
    background: #F3F4F6;
    border: 1px solid #D1D5DB;
    border-right: none;
    color: #6B7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: -2px 0 6px rgba(0, 0, 0, 0.08);
    padding: 4px;
}

.help-icon-btn:hover {
    background: #E5E7EB;
    color: #4B5563;
    box-shadow: -3px 0 8px rgba(0, 0, 0, 0.12);
}

.help-icon-btn:active {
    transform: scale(0.95);
}

.help-icon-btn svg {
    transition: all 0.3s ease;
    width: 16px;
    height: 16px;
}

@media (max-width: 768px) {
    .help-info-container {
        top: 50%;
        right: 0;
    }

    .help-icon-btn {
        width: 24px;
        height: 40px;
    }

    .help-icon-btn svg {
        width: 14px;
        height: 14px;
    }
}

.help-info-card {
    font-family: 'Lato', sans-serif;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-radius: 12px 0 0 12px;
    padding: 14px;
    gap: 10px;
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid #D1D5DB;
    border-right: none;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(12px);
    min-width: 480px;
    max-width: 580px;
}

.help-info-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(243, 244, 246, 0.3) 0%, rgba(249, 250, 251, 0.3) 100%);
    border-radius: 12px 0 0 12px;
    pointer-events: none;
}

@media (max-width: 768px) {
    .help-info-card {
        grid-template-columns: 1fr;
        min-width: 240px;
        max-width: calc(100vw - 50px);
        padding: 10px;
        gap: 8px;
    }

    .help-info-card .card-body {
        padding: 10px;
    }

    .help-info-card .card-body h5 {
        font-size: 11px !important;
    }

    .help-info-card .card-body p {
        font-size: 10px !important;
    }
}

.help-info-card .card-body {
    padding: 12px;
    margin: 0px;
    border-radius: 10px;
    background: var(--el-fill-color-blank, white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    border: 1px solid #E5E7EB;
    position: relative;
    z-index: 1;
}

.help-info-card .card-body:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #D1D5DB;
}

.help-info-card .card-body .card-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px !important;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
}

.help-info-card .card-body .info-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

.help-info-card .card-body h5 {
    color: #374151;
    text-align: left;
    font-size: 12px !important;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
}

.help-info-card .card-body p {
    color: #6B7280;
    font-size: 11px !important;
    text-align: justify;
    line-height: 1.5;
    margin: 0;
}

/* Transición suave del card */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(10px);
}



.form-switch .form-check-input {
    margin-left: 0rem !important;
}

/* Eliminar outline de focus en inputs, selects y date pickers */
input,
input:focus,
input:hover,
input:active,
textarea,
textarea:focus,
textarea:hover,
textarea:active,
select,
select:focus,
select:hover,
select:active,
.form-control,
.form-control:focus,
.form-control:hover,
.form-control:active,
.el-input__inner,
.el-input__inner:focus,
.el-input__inner:hover,
.el-input__inner:active,
.el-select,
.el-select:focus,
.el-select:hover,
.el-select:active,
.el-tree-select,
.el-tree-select:focus,
.el-tree-select:hover,
.el-tree-select:active,
::v-deep(.el-input__inner),
::v-deep(.el-input__inner:focus),
::v-deep(.el-input__inner:hover),
::v-deep(.el-input__inner:active),
::v-deep(.el-select__wrapper),
::v-deep(.el-select__wrapper:focus),
::v-deep(.el-select__wrapper:hover),
::v-deep(.el-select__wrapper:active),
::v-deep(.mx-input),
::v-deep(.mx-input:focus),
::v-deep(.mx-input:hover),
::v-deep(.mx-input:active),
::v-deep(.p-autocomplete-input),
::v-deep(.p-autocomplete-input:focus),
::v-deep(.p-autocomplete-input:hover),
::v-deep(.p-autocomplete-input:active),
::v-deep(.el-autocomplete .el-input__wrapper),
::v-deep(.el-autocomplete .el-input__wrapper:focus),
::v-deep(.el-autocomplete .el-input__wrapper:hover),
::v-deep(.el-autocomplete .el-input__wrapper:active) {
    outline: none !important;
    box-shadow: none !important;
    border-color: #E2E8F0;
}

/* Eliminar outline de Element Plus tree-select en todos los estados */
::v-deep(.el-select__wrapper),
::v-deep(.el-select__wrapper.is-focused),
::v-deep(.el-select__wrapper:hover),
::v-deep(.el-select__wrapper:active),
::v-deep(.el-input.is-focus .el-input__wrapper),
::v-deep(.el-input.is-hovering .el-input__wrapper),
::v-deep(.el-input__wrapper),
::v-deep(.el-input__wrapper:focus),
::v-deep(.el-input__wrapper:hover),
::v-deep(.el-input__wrapper:active),
::v-deep(.el-input__wrapper.is-focus),
::v-deep(.el-input__wrapper.is-hovering),
::v-deep(.el-autocomplete .el-input__wrapper),
::v-deep(.el-autocomplete .el-input__wrapper.is-focused),
::v-deep(.el-autocomplete .el-input__wrapper:hover),
::v-deep(.el-autocomplete .el-input__wrapper:active),
::v-deep(.el-autocomplete .el-input__wrapper.is-focus),
::v-deep(.el-autocomplete .el-input__wrapper.is-hovering) {
    outline: none !important;
    box-shadow: none !important;
    border-color: #E2E8F0;
}

/* Eliminar outline de b-form-tags (palabras clave) */
::v-deep(.b-form-tags),
::v-deep(.b-form-tags:focus),
::v-deep(.b-form-tags:hover),
::v-deep(.b-form-tags:active),
::v-deep(.b-form-tags.focus),
::v-deep(.b-form-tags .form-control),
::v-deep(.b-form-tags .form-control:focus),
::v-deep(.b-form-tags .form-control:hover),
::v-deep(.b-form-tags input),
::v-deep(.b-form-tags input:focus),
::v-deep(.b-form-tags input:hover) {
    outline: none !important;
    box-shadow: none !important;
    border-color: #E2E8F0;
}

.landing-busqueda {
    background-image: url("../../assets/img/backgrounds/bg-busqueda.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    position: relative;
    z-index: 1;
    min-height: 100vh;
    font-family: 'Lato', sans-serif;
}

.logo-busqueda {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    margin-top: 10px;
    z-index: 1;
    transition: transform 0.3s ease;
}

.logo-busqueda:hover {
    transform: scale(1.05);
}

::v-deep(.p-autocomplete-input) {
    border: none !important;
    width: 100%;
    padding: 8px 20px !important;
    font-size: 14px !important;
    font-weight: 500;
    color: #2D3748;
    background: transparent;
}

::v-deep(.p-autocomplete-input::placeholder) {
    color: #A0AEC0;
    font-weight: 400;
}

.highlight-denominacion {
    font-weight: 700;
    color: #1E40AF;
    background-color: #DBEAFE;
    padding: 1px 3px;
    border-radius: 2px;
    display: inline;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}

/* Contenedor principal */
.search-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: 90%;
    max-width: 1200px;
    position: relative;
    overflow: visible !important;
    margin-bottom: 0.5rem;
}

@media (max-width: 991px) {
    .search-container {
        flex-direction: column;
        gap: 16px;
    }
}

/* Contenedor del input */
.search-box {
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--el-fill-color-blank, white);
    border-radius: 50px;
    padding: 3px;
    box-shadow: 0 8px 30px rgba(223, 45, 178, 0.15);
    transition: all 0.3s ease;
    border: 2px solid transparent;
}



/* Estilos del input */
.search-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 8px 16px;
    font-size: 15px;
    width: 100%;
    font-family: 'Lato', sans-serif;
    background: var(--el-fill-color-blank, white);
}

/* Estilos específicos para el-autocomplete en el buscador principal */
::v-deep(.search-input.el-autocomplete) {
    flex: 1;
    width: 100%;
    background: var(--el-fill-color-blank, white);
}

::v-deep(.search-input.el-autocomplete .el-input__wrapper) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    background: var(--el-fill-color-blank, white);
    width: 100% !important;
}

::v-deep(.search-input.el-autocomplete .el-input__inner) {
    border: none !important;
    outline: none !important;
    padding: 8px 16px !important;
    font-size: 15px !important;
    font-family: 'Lato', sans-serif !important;
    background: var(--el-fill-color-blank, white);
    width: 100% !important;
}

::v-deep(.search-input.el-autocomplete .el-input__inner:focus) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: var(--el-fill-color-blank, white);
}

/* Botón para limpiar en el search */
.btn-clear {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    border: none;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    width: 36px;
    height: 36px;
}

.btn-clear:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(223, 45, 178, 0.4);
}

.btn-clear img {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
}

.search-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-shrink: 0;
}

@media (max-width: 991px) {
    .search-actions {
        width: 100%;
        justify-content: space-between;
    }
}

@media (max-width: 600px) {
    .search-actions {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
    }

    .search-actions .btn-search,
    .search-actions .btn-clear-button {
        width: 100%;
        margin: 6px 0;
    }
}

/* Separador */
.separator {
    width: 2px;
    height: 32px;
    background: linear-gradient(180deg, transparent, #DF2DB2, transparent);
    margin: 0 8px;
}

/* Botón de filtro */
.btn-filter {
    background: var(--el-fill-color-blank, white);
    border: 2px solid #E2E8F0;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    width: 40px;
    height: 40px;
}

.btn-filter:hover {
    transform: scale(1.1);
}


.btn-filter img {
    width: 20px;
    height: 20px;
    transition: filter 0.3s ease;
}

/* Botón de búsqueda */
.btn-search {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    color: white;
    border: none;
    padding: 12px 32px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s ease;
    border-radius: 50px;
    box-shadow: 0 4px 20px rgba(223, 45, 178, 0.3);
    font-family: 'Lato', sans-serif;
    letter-spacing: 0.5px;
    white-space: nowrap;
    height: 48px;
}

.btn-search:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(223, 45, 178, 0.4);
}

.btn-search:active {
    transform: translateY(0);
}

.btn-clear-button {
    background: var(--el-fill-color-blank, white);
    color: #EF4444 !important;
    border: 2px solid #EF4444 !important;
    padding: 12px 32px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s ease;
    border-radius: 50px;
    font-family: 'Lato', sans-serif;
    letter-spacing: 0.5px;
    white-space: nowrap;
    height: 48px;
}

.btn-clear-button:hover {
    background: #EF4444 !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
}

.sort-label {
    font-size: 13px;
    font-weight: 600;
    color: #5E5E5C;
    white-space: nowrap;
}

.sort-select {
    appearance: none;
    -webkit-appearance: none;
    background-color: var(--el-fill-color-blank, #fff);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235E5E5C' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    padding: 5px 32px 5px 12px;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    min-width: 130px;
}

.sort-select:focus {
    outline: none;
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}

.select-estado {
    width: 100% !important;
    max-width: 100%;
    display: block;
}

.results-area {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 95%;
    max-width: 1400px;
    margin: 0 auto;
    gap: 0;
    flex: 1;
    height: calc(100vh - 160px);
    overflow: hidden;
}

.filter-sidebar {
    width: 360px;
    min-width: 360px;
    background: var(--el-fill-color-blank, white);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.09);
    display: flex;
    flex-direction: column;
    margin-right: 16px;
    height: 100%;
    overflow: hidden;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 8px;
    border-bottom: 1.5px solid #F0F4F8;
    background: linear-gradient(to right, rgba(223, 45, 178, 0.04), rgba(24, 92, 230, 0.04));
}

.sidebar-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #2D3748;
    font-family: 'Lato', sans-serif;
}

.sidebar-close-btn {
    background: none;
    border: 1.5px solid #E2E8F0;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    color: #718096;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    padding: 0;
}

.sidebar-close-btn:hover {
    background: #FEE2F8;
    border-color: #DF2DB2;
    color: #DF2DB2;
}

.sidebar-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: clip;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
}

.sidebar-body::-webkit-scrollbar {
    width: 4px;
}

.sidebar-body::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-body::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
}

.sidebar-body::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.25);
}

.sidebar-body .filter {
    border-radius: 0 !important;
    box-shadow: none !important;
}

.sidebar-body .filter-header {
    border-right: none !important;
}

.sidebar-body .contenedor-tab-global {
    grid-template-columns: 1fr 1fr;
}

.sidebar-body .contenedor-tab-global .container-nav {
    font-size: 12px !important;
}

.sidebar-body .contenedor-tab-global img.container-nav {
    width: 16px !important;
    height: 16px !important;
}

.sidebar-body .d-flex.flex-row.contenedor-tab {
    flex-wrap: wrap !important;
    gap: 0 !important;
}

.sidebar-body .d-flex.flex-row.contenedor-tab a {
    flex: 0 0 100% !important;
    font-size: 11px !important;
    padding: 6px 10px !important;
    text-align: left !important;
    border-bottom: 1px solid #F0F4F8;
}

.sidebar-body .contenedor-filtros {
    padding: 10px 8px !important;
    gap: 0 !important;
    margin: 0 !important;
}

.sidebar-body .contenedor-filtros .row {
    margin-left: 0 !important;
    margin-right: 0 !important;
}

.sidebar-body .contenedor-filtros .col-12 {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

.sidebar-body .contenedor-filtros .form-label {
    font-size: 12px !important;
    margin-bottom: 4px !important;
}

.sidebar-body .contenedor-filtros .px-3 {
    padding-left: 6px !important;
    padding-right: 6px !important;
    margin-bottom: 10px !important;
}

.sidebar-body .custom-tree-select,
.sidebar-body ::v-deep(.el-select__wrapper) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: unset !important;
    border-radius: 10px !important;
    font-size: 12px !important;
    box-sizing: border-box !important;
    align-items: flex-start !important;
    display: flex !important;
}

::v-deep(.el-input--large .el-input__wrapper) {
    padding: 0 !important;
    /* quita padding */
    margin: 0 !important;
    /* quita margin */
    box-shadow: none;
    /* quita el borde si también lo necesitas */
}

.sidebar-body ::v-deep(.el-select__placeholder),
.sidebar-body ::v-deep(.el-select__tags-text),
.sidebar-body ::v-deep(.el-select__input) {
    font-size: 12px !important;
    line-height: 26px !important;
}

/* Truncar texto del tag seleccionado dentro del input */
.sidebar-body ::v-deep(.el-tag) {
    max-width: 130px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    display: inline-flex !important;
    align-items: center !important;
    font-size: 11px !important;
    height: 22px !important;
    line-height: 22px !important;
    padding: 0 6px !important;
    box-sizing: border-box !important;
}

.sidebar-body ::v-deep(.el-tag__content) {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    max-width: 100px !important;
    display: block !important;
}

.sidebar-body ::v-deep(.el-select__suffix) {
    height: 34px !important;
    align-self: center !important;
}

.sidebar-body ::v-deep(.el-select__selection) {
    align-items: flex-start !important;
    padding: 2px 0 !important;
    min-height: unset !important;
    flex: 1 !important;
    min-width: 0 !important;
    max-width: 100% !important;
    flex-wrap: wrap !important;
    display: flex !important;
    gap: 3px !important;
}

.sidebar-body ::v-deep(.mx-datepicker) {
    width: 100% !important;
}

.sidebar-body ::v-deep(.mx-input) {
    padding: 6px 10px !important;
    height: 34px !important;
    font-size: 12px !important;
    border-radius: 10px !important;
    border-width: 2px !important;
    box-sizing: border-box !important;
}

/* Permitir salto de línea en las opciones del tree-select y achicar texto */
.sidebar-body ::v-deep(.el-select-dropdown__item),
.sidebar-body ::v-deep(.el-tree-node__label) {
    white-space: normal !important;
    word-break: break-word !important;
    font-size: 12px !important;
    line-height: 1.3 !important;
    padding-top: 4px !important;
    padding-bottom: 4px !important;
}

.sidebar-body .switch-container {
    padding: 7px 10px !important;
    gap: 8px !important;
    border-radius: 10px !important;
}

.sidebar-body .switch-label {
    font-size: 11px !important;
}

.sidebar-body .switch {
    width: 38px !important;
    height: 20px !important;
}

.sidebar-body .slider::before {
    height: 14px !important;
    width: 14px !important;
    left: 3px !important;
    top: 3px !important;
}

.sidebar-body input:checked+.slider::before {
    transform: translateX(18px) !important;
}

.sidebar-body .info-icon {
    width: 14px !important;
    height: 14px !important;
}

.sidebar-body ::v-deep(.b-form-tags) {
    padding: 3px 10px !important;
    border-radius: 10px !important;
    font-size: 12px !important;
    min-height: unset !important;
}

.sidebar-body ::v-deep(.b-form-tags .b-form-tags-list) {
    margin: 0 !important;
    padding: 0 !important;
    gap: 2px !important;
}

.sidebar-body ::v-deep(.b-form-tags-input) {
    font-size: 12px !important;
    padding: 3px 6px !important;
    height: 28px !important;
    line-height: 1 !important;
    min-height: unset !important;
}

.sidebar-body ::v-deep(.b-form-tags .form-control) {
    padding: 0 !important;
    min-height: unset !important;
    height: auto !important;
    border: none !important;
    box-shadow: none !important;
}

.sidebar-body ::v-deep(.b-form-tag) {
    font-size: 11px !important;
    padding: 2px 7px !important;
    border-radius: 8px !important;
}

.sidebar-footer-actions {
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    border-top: 1.5px solid #F0F4F8;
    background: #FAFBFC;
}

.sidebar-footer-actions .btn-search,
.sidebar-footer-actions .btn-clear-button {
    flex: 1;
    padding: 6px 10px !important;
    font-size: 0.78rem !important;
    height: 32px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    box-shadow: none !important;
    letter-spacing: 0 !important;
    transform: none !important;
}

.sidebar-footer-actions .btn-search:hover,
.sidebar-footer-actions .btn-clear-button:hover {
    transform: none !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
}

.results-column {
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
}

.results-column::-webkit-scrollbar {
    width: 4px;
}

.results-column::-webkit-scrollbar-track {
    background: transparent;
}

.results-column::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
}

.results-column::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.25);
}

.search-results {
    display: flex;
    flex-direction: column;
    gap: 7px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .results-area {
        flex-direction: column;
        width: 100%;
    }

    .filter-sidebar {
        width: 100%;
        min-width: unset;
        margin-right: 0;
        margin-bottom: 12px;
        position: static;
    }

    .sidebar-body {
        max-height: 300px;
    }
}

.result-item {
    background: var(--el-fill-color-blank, white);
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
    padding: 8px 12px;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Título */
.result-title {
    display: flex;
    font-family: 'Lato', sans-serif;
    justify-content: space-between;
    gap: 6px;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    color: #3B82F6;
    cursor: pointer;
    margin-bottom: 6px;
    transition: all 0.3s ease;
}

.result-title:hover {
    color: #2563EB;
}

/* Título ya abierto/visto */
.result-title-opened {
    color: #9B30FF !important;
}

.copy-btn-container {
    position: relative;
    display: flex;
    align-items: center;
}

.copy-btn {
    background: #9CA3AF;
    border: none;
    border-radius: 6px;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 1;
}

.copy-btn:hover {
    background: #6B7280;
    transform: scale(1.1) !important;
    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.copy-btn:active {
    transform: scale(0.95) !important;
}

.copy-btn svg {
    color: white;
    display: block;
}

.copy-message {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    padding: 4px 8px;
    background: #c7cdda;
    color: white;
    font-size: 11px;
    font-weight: 600;
    border-radius: 6px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
    z-index: 10;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.2s ease;
}

.fade-scale-enter-from {
    opacity: 0;
    transform: translateY(-4px) scale(0.9);
}

.fade-scale-leave-to {
    opacity: 0;
    transform: translateY(4px) scale(0.9);
}

/* Icono de flecha */
.result-title img {
    width: 18px;
    height: 18px;
}

/* Pretensión / Delito */
.result-info {
    font-size: 11.5px;
    font-family: 'Lato', sans-serif;
    margin: 3px 0;
    color: #6B7280;
    line-height: 1.4;
}

.result-info strong {
    color: #4A5568;
    font-weight: 700;
}

/* Síntesis */
.btn-expand-sintesis {
    display: inline-block;
    margin-left: 6px;
    background: none;
    border: none;
    color: #185CE6;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
}

.btn-expand-sintesis:hover {
    color: #DF2DB2;
}

#filterbar {
    max-width: 600px;
}

/* // en mobil */
@media (max-width: 600px) {
    #filterbar {
        width: 100%;
    }
}


.result-summary {
    font-size: 13px;
    color: #555;
    line-height: 1.8;
}

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-menu.filterbar-overlay {
    position: absolute;
    top: 100%;
    /* Justo debajo del botón */
    right: -20px;
    z-index: 1050;
    display: block;
    width: max-content !important;
    margin-top: 10px;
    background: var(--el-fill-color-blank, white);
    border: 1px solid #ddd;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    padding: 10px;
}

.no-results {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90%;
    max-width: 600px;
    margin: 1.5rem auto;
    padding: 60px 40px;
    border-radius: 24px;
    animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.no-results-icon {
    margin-bottom: 24px;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

.no-results-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Lato', sans-serif;
}

.no-results-description {
    font-size: 16px;
    font-weight: 500;
    color: #4A5568;
    text-align: center;
    line-height: 1.6;
    font-family: 'Lato', sans-serif;
    margin-bottom: 32px;
}

.no-results-tips {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
}

.tip-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
    border-radius: 16px;
    border: 2px solid rgba(223, 45, 178, 0.1);
    transition: all 0.3s ease;
}

.tip-item:hover {
    transform: translateY(-4px);
    border-color: #DF2DB2;
    box-shadow: 0 4px 15px rgba(223, 45, 178, 0.15);
}

.tip-icon {
    font-size: 28px;
    filter: grayscale(0.3);
}

.tip-text {
    font-size: 13px;
    font-weight: 600;
    color: #4A5568;
    font-family: 'Lato', sans-serif;
}

@media (max-width: 600px) {
    .no-results {
        padding: 40px 24px;
    }

    .no-results-title {
        font-size: 20px;
    }

    .no-results-description {
        font-size: 14px;
    }

    .no-results-tips {
        gap: 12px;
    }

    .tip-item {
        padding: 12px 16px;
    }
}

/* Loader personalizado */
.custom-loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(8px);
}

.custom-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}

.loader-spinner {
    position: relative;
    width: 80px;
    height: 80px;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid transparent;
    animation: rotate 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
    border-top-color: #DF2DB2;
    animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
    border-top-color: #8B5CF6;
    animation-delay: 0.15s;
    width: 90%;
    height: 90%;
    top: 5%;
    left: 5%;
}

.spinner-ring:nth-child(3) {
    border-top-color: #185CE6;
    animation-delay: 0.3s;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loader-text {
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.6;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Responsivo */
@media (max-width: 600px) {
    .no-results {
        margin-top: 10px;
    }

    #filterbar {
        /* // pocisionarlo al inicio */
        max-width: 350px;
        margin-left: -330px !important;
    }
}

@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif
}


.text-initial {
    margin-top: 3rem;
}


/* //celular */
@media (min-width: 320px) and (max-width: 600px) {
    .text-initial {
        margin-top: 0rem;
    }
}

.buttons-filter {
    display: flex;
    flex-direction: row;
}


@media (max-width: 768px) {
    .buttons-filter {
        display: flex;
        flex-direction: column;
    }

    .buttons-filter button {
        width: auto !important;
        justify-content: center;
    }
}

.card-container li {
    /* // ponerle estilo de li */
    list-style: outside;
}

.sin_resultados {
    padding: 20px;
    border-radius: 0.375rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    color: #718096;
    font-size: 1.5rem;
    border: none;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    background-color: #f5f8ffff;
}


.sin_resultados p {
    margin: 0px;
}

.sin_resultados span {
    font-size: 1rem !important;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
}

@media (max-width: 768px) {
    .sin_resultados {
        width: 90% !important;
        margin: 20px auto 0 auto !important;
    }

    .sin_resultados p {
        font-size: 1.2rem !important;
    }

    .sin_resultados span {
        font-size: 1rem !important;
    }
}

.container {
    margin: 40px auto
}

#header {
    width: 100%;
    height: 60px;
    box-shadow: 5px 5px 15px #e8e8e8
}

.col-lg-4,
.col-md-6 {
    padding-right: 0
}

button.btn.btn-hide {
    height: inherit;
    color: #fff;
    font-size: 0.82rem;
    padding-left: 40px;
    font-weight: bold;
    padding-right: 40px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px
}



select {
    outline: none;
    padding: 6px 12px;
    margin: 0px 4px;
    color: #999;
    font-size: 0.85rem;
    width: 140px
}

#select2 {
    border: 1px solid #777;
    color: #999
}

#pro {
    border: none;
    color: #333;
    font-weight: 700;
    padding-left: 0px;
    width: initial
}

#filterbar {
    width: 30%;
    background-color: var(--el-fill-color-blank, #fff);
    border: 1px solid #ddd;
    border-radius: 15px;
    float: left
}

#filterbar input[type="radio"] {
    display: none;
}

#filterbar-container2 .form-check {
    background: var(--el-fill-color-blank, white);
    padding: 6px 15px;
    border-radius: 8px;
    margin-bottom: 5px;
    border: 1.5px solid #E2E8F0;
    transition: all 0.3s ease;
    cursor: pointer;
}


#filterbar-container2 .form-check-input:checked~.form-check-label {
    font-weight: 700;
}

#filterbar-container2 .form-check-input:checked {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 100%);
    border-color: #DF2DB2;
}

#filterbar-container2 .form-check-label {
    font-family: 'Lato', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #4A5568;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

#filterbar-container2 .form-check-input {
    width: 14px;
    height: 14px;
    margin-right: 6px;
    border: 1.5px solid #E2E8F0;
    cursor: pointer;
}

#filterbar .btn.btn-success {
    background-color: #ddd;
    color: #333;
    border: none;
    width: 115px
}

#filterbar .btn.btn-success:hover {
    background-color: #e7f0ff !important;
    color: #444
}

#filterbar .btn-success:not(:disabled):not(.disabled).active,
#filterbar .btn-success:not(:disabled):not(.disabled):active {
    background-color: #3b82f6 !important;
    color: #fff
}

label {
    cursor: pointer
}

.tick {
    display: block;
    position: relative;
    padding-left: 23px;
    cursor: pointer;
    font-size: 0.9rem;
    margin: 0
}

.tick input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0
}

.check {
    position: absolute;
    top: 1px;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 3px
}

.tick:hover input~.check {
    background-color: #f3f3f3
}

.tick input:checked~.check {
    background-color: #ffffff
}

.check:after {
    content: "";
    position: absolute;
    display: none
}

.tick input:checked~.check:after {
    display: block;
    transform: rotate(45deg) scale(1)
}

.tick .check:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid rgb(0, 0, 0);
    border-width: 0 3px 3px 0;
    transform: rotate(45deg) scale(2)
}

.box {
    padding: 10px
}

.box-label {
    color: #11698e;
    font-size: 0.9rem;
    font-weight: 800
}

#inner-box,
#inner-box2 {
    height: 150px;
    overflow-y: scroll
}

#inner-box2 {
    height: 132px
}

#inner-box::-webkit-scrollbar,
#inner-box2::-webkit-scrollbar {
    width: 6px
}

#inner-box::-webkit-scrollbar-track,
#inner-box2::-webkit-scrollbar-track {
    background-color: #ddd;
    border-radius: 2px
}

#inner-box::-webkit-scrollbar-thumb,
#inner-box2::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 2px
}

#price {
    height: 45px
}

#size input[type="checkbox"] {
    visibility: hidden
}

#size input[type='checkbox']:checked {
    background-color: #16c79a;
    border: none
}

#size .btn.btn-success {
    background-color: #ddd;
    color: #333;
    border: none;
    width: 40px;
    font-size: 0.8rem;
    border-radius: 0
}

#size .btn.btn-success:hover {
    background-color: #aff1e1;
    color: #444
}

#size .btn-success:not(:disabled):not(.disabled).active,
#size .btn-success:not(:disabled):not(.disabled):active {
    background-color: #16c79a;
    color: #fff
}

#size label {
    margin: 10px;
    margin-left: 0px
}



#avail-size input[type="checkbox"] {
    visibility: hidden
}

#avail-size input[type='checkbox']:checked {
    background-color: #16c79a;
    border: none
}

#avail-size .btn.btn-success {
    background-color: #ddd;
    color: #333;
    border: none;
    width: 20px;
    font-size: 0.7rem;
    border-radius: 0;
    padding: 0
}

#avail-size .btn.btn-success:hover {
    background-color: #aff1e1;
    color: #444
}

#avail-size .btn-success:not(:disabled):not(.disabled).active,
#avail-size .btn-success:not(:disabled):not(.disabled):active {
    background-color: #16c79a;
    color: #fff
}

#avail-size label {
    margin: 10px;
    margin-left: 0px
}

#shirt {
    height: 170px
}

.middle {
    position: relative;
    width: 100%;
    margin-top: 25px
}

.slider {
    position: relative;
    z-index: 1;
    height: 30px;
    margin: 0px;
}

.slider>.track {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 5px;
    background-color: #ddd
}

.slider>.range {
    position: absolute;
    z-index: 2;
    left: 25%;
    right: 25%;
    top: 0;
    bottom: 0;
    border-radius: 5px;
    background-color: #36a31b
}

.slider>.thumb {
    position: absolute;
    top: 2px;
    z-index: 3;
    width: 20px;
    height: 20px;
    background-color: #36a31b;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(63, 204, 75, 0.705);
    transition: box-shadow .3s ease-in-out
}

.slider>.thumb::after {
    position: absolute;
    width: 8px;
    height: 8px;
    left: 28%;
    top: 30%;
    border-radius: 50%;
    content: '';
    background-color: #fff
}

.slider>.thumb.left {
    left: 25%;
    transform: translate(-15px, -10px)
}

.slider>.thumb.right {
    right: 25%;
    transform: translate(15px, -10px)
}

.slider>.thumb.hover {
    box-shadow: 0 0 0 10px rgba(125, 230, 134, 0.507)
}

.slider>.thumb.active {
    box-shadow: 0 0 0 10px rgba(63, 204, 75, 0.623)
}

input[type=range] {
    position: absolute;
    pointer-events: none;
    -webkit-appearance: none;
    appearance: none;
    z-index: 2;
    height: 10px;
    width: 100%;
    opacity: 0
}

input[type=range]::-webkit-slider-thumb {
    pointer-events: all;
    width: 30px;
    height: 30px;
    border-radius: 0;
    border: 0 none;
    background-color: red;
    -webkit-appearance: none
}

.del {
    text-decoration: line-through;
    color: red
}

@media(min-width:1199.6px) {
    #filterbar {
        width: 25%
    }
}

@media(max-width:1199.5px) {
    #filterbar {
        width: 28%
    }

    .card {
        height: 350px
    }

    .price {
        font-size: 0.9rem
    }

    .product-name {
        font-size: 0.8rem
    }
}

@media(max-width: 991.5px) {
    .navbar-nav {
        min-width: 290px;
        position: absolute;
        left: -168px;
        bottom: -146px;
        padding: 20px 10px;
        display: block;
        background-image: none;
        z-index: 2;
        background-color: #1d1c1cb2
    }

    #filterbar {
        width: 36%
    }

    #sort {
        background-color: inherit;
        color: #fff;
        margin: 0;
        margin-bottom: 20px;
        width: 100%
    }

    #sort option,
    #pro option {
        color: #000
    }

    #pro,
    #select2,
    .result {
        background-color: inherit;
        color: #fff
    }

    .card {
        height: 345px
    }

    .price {
        font-size: 0.85rem
    }
}

@media(max-width: 767.5px) {
    #filterbar {
        width: 50%
    }

    .form-switch .form-check-input {
        margin-left: 0rem !important;
    }
}

@media(max-width: 525.5px) {
    #filterbar {
        float: none;
        width: 100%;
        margin-bottom: 20px;
        border-radius: 5px
    }

    #content.my-5 {
        margin-top: 20px !important;
        margin-bottom: 20px !important
    }

    .col-lg-4,
    .col-md-6 {
        padding-left: 0
    }
}

@media(max-width: 500.5px) {
    .pagination {
        display: none
    }
}

.card h3 {
    font-size: 1rem;
}


#filterbar-container {
    width: 100%;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

#filterbar-container2 {
    position: absolute;
    top: calc(100% + 8px);
    z-index: 1050;
    right: 10px;
    margin: 0 auto;
    width: 320px;
    background: var(--el-fill-color-blank, white);
    border-radius: 12px;
    border: 1.5px solid #E2E8F0;
    box-shadow: 0 6px 20px rgba(223, 45, 178, 0.12);
    animation: slideDown 0.3s ease;
}

@media (max-width: 600px) {
    #filterbar-container2 {
        width: calc(100vw - 32px);
        right: 0;
        left: auto;
    }

    #filterbar-container2 .form-check-label {
        font-size: 12px !important;
        white-space: nowrap;
    }
}

#filterbar-container .filter {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin: 0px;
    padding: 0px;
    border-radius: 24px;
    overflow: hidden;
}

.contenedor-tab-global {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    justify-content: space-between;
    padding: 0px;
    border-bottom: 2px solid #F7FAFC;
    background: linear-gradient(to right, rgba(223, 45, 178, 0.03), rgba(24, 92, 230, 0.03));
}

.filter-header .ul-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.filter-header .ul-container a {
    display: flex;
    align-items: center;
    text-align: center;
}

.contenedor-tab {
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
    margin: 4px;
}

.contenedor-tab:hover {
    background: rgba(24, 92, 230, 0.05);
}

@media (max-width: 700px) {


    #filterbar-container {
        width: 90%;
        left: 10px;
        top: 10;
        border-radius: 0px;
        padding: 16px 12px !important;
    }

    #filterbar-container2 {
        width: calc(100vw - 32px);
        right: 0;
    }

    #filterbar-container2 label {
        font-size: 12px !important;
        white-space: nowrap;
    }

    #filterbar-container .filter {
        grid-template-columns: 1fr;
        height: auto;
    }


    #filterbar-container .contenedor-tab img {
        width: 20px;
        height: 20px;
    }

    /* Fix para el-select wrapper en móvil */
    ::v-deep .el-select__wrapper {
        max-width: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }

    ::v-deep .el-select__input {
        max-width: 100% !important;
    }

    ::v-deep .el-select__tags {
        max-width: calc(100% - 30px) !important;
        overflow: hidden !important;
    }

    /* DatePicker también */
    ::v-deep .mx-datepicker {
        width: 100% !important;
    }

    ::v-deep .mx-input-wrapper {
        width: 100% !important;
    }
}

#filterbar-container .container-nav,
.contenedor-cabeceras-a a {
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #4A5568;
    cursor: pointer;
    transition: all 0.3s ease;
}

#filterbar-container .container-nav:hover,
.contenedor-cabeceras-a a:hover {
    color: #185CE6;
}

.active-criterio {
    background: rgba(24, 92, 230, 0.05) !important;
    color: #185CE6 !important;
    font-weight: 700 !important;
    border-left: 4px solid #185CE6;
}

.contenedor-filtros {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 16px 0px;
    padding: 20px;
}

.filter-header {
    border-right: 2px solid #F7FAFC;
}

.contenedor-cabeceras-a {
    border-bottom: 2px solid #F7FAFC;
}

.contenedor-filtros .no-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
}

/* Estilos modernos para labels de filtros */
.contenedor-filtros .form-label {
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #4A5568;
    margin-bottom: 10px;
    display: block;
}

@media (max-width: 768px) {
    .contenedor-filtros {
        overflow-x: hidden !important;
        max-width: 100% !important;
        padding: 16px 8px !important;
    }

    .contenedor-filtros .px-3 {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .contenedor-filtros .row {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .contenedor-filtros .col-12,
    .contenedor-filtros .col-md-6 {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}

/* Estilos para el-tree-select */
::v-deep(.el-tree-select) {
    width: 100% !important;
}

::v-deep(.el-select__suffix) {
    flex-shrink: 0;
}

::v-deep(.el-select__tags) {
    max-width: calc(100% - 30px);
    overflow: hidden;
    flex-wrap: wrap;
    word-break: break-word;
}

::v-deep(.el-select__wrapper) {
    background: var(--el-fill-color-blank, white);
    border: 2px solid var(--el-border-color, #E2E8F0);
    border-radius: 16px;
    padding: 10px 16px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    min-height: 42px;
    max-width: 100%;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
}

::v-deep(.el-select__wrapper:hover) {
    border-color: #DF2DB2;
    box-shadow: 0 4px 12px rgba(223, 45, 178, 0.1);
}

::v-deep(.el-select__wrapper.is-focused) {
    border-color: #DF2DB2;
    box-shadow: 0 0 0 3px rgba(223, 45, 178, 0.1);
}

::v-deep(.el-select__placeholder) {
    color: #A0AEC0;
    font-weight: 500;
}

::v-deep(.el-select__tags-text) {
    /* background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); */
    color: #3B82F6;
    border-radius: 12px;
    padding: 4px 10px;
    font-weight: 600;
    font-size: 12px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}

::v-deep(.el-tag) {
    border: 1px solid #3B82F6 !important;
    color: #3B82F6 !important;
    border-radius: 12px !important;
    padding: 4px 12px !important;
    font-weight: 600 !important;
    max-width: 180px;
}

::v-deep(.el-tag .el-select__tags-text) {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
}

::v-deep(.el-select__selection) {
    max-width: 100%;
    overflow: hidden;
}

::v-deep(.el-select__selected-item) {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Control de desbordamiento en pantallas pequeñas */
@media (max-width: 768px) {
    ::v-deep(.el-select__tags) {
        max-width: calc(100% - 50px) !important;
        flex-wrap: wrap !important;
    }

    ::v-deep(.el-select__tags-text) {
        max-width: 70px !important;
        font-size: 11px !important;
    }

    ::v-deep(.el-tag) {
        max-width: 90px !important;
        font-size: 10px !important;
        padding: 3px 8px !important;
    }

    ::v-deep(.el-tag .el-select__tags-text) {
        max-width: 60px !important;
        font-size: 10px !important;
    }

    ::v-deep(.el-select__wrapper) {
        padding: 6px 10px !important;
        width: min(320px, 90vw) !important;
        max-width: 90vw !important;
        box-sizing: border-box !important;
    }

    ::v-deep(.el-select__selection) {
        max-width: calc(100% - 35px) !important;
        overflow: hidden !important;
        word-break: break-all !important;
    }

    ::v-deep(.el-select__selected-item) {
        max-width: 100% !important;
        font-size: 11px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        word-break: break-all !important;
    }

    .custom-tree-select {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
    }

    ::v-deep(.el-select) {
        width: 100% !important;
        max-width: 100% !important;
    }
}

::v-deep(.el-tag__close) {
    color: #3B82F6 !important;
    transition: all 0.3s ease;
}

::v-deep(.el-tag__close:hover) {
    background: #EF4444 !important;
    color: white !important;
}

/* DatePicker modernizado */
::v-deep(.mx-datepicker) {
    width: 100% !important;
}

::v-deep(.mx-input) {
    background: var(--el-fill-color-blank, white);
    border: 2px solid #E2E8F0 !important;
    border-radius: 16px !important;
    padding: 12px 16px !important;
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #2D3748;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}


::v-deep(.mx-input::placeholder) {
    color: #A0AEC0;
}

::v-deep(.mx-icon-calendar),
::v-deep(.mx-icon-clear) {
    color: #DF2DB2 !important;
}

/* Form Tags (Keywords) */
::v-deep(.b-form-tags) {
    background: var(--el-fill-color-blank, white);
    border: 2px solid #E2E8F0;
    border-radius: 16px;
    padding: 8px 12px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

::v-deep(.b-form-tags:focus-within) {
    border-color: #DF2DB2;
    box-shadow: 0 0 0 3px rgba(223, 45, 178, 0.1);
}

::v-deep(.b-form-tag) {
    background: transparent !important;
    border: 1px solid #3B82F6 !important;
    color: #3B82F6 !important;
    border-radius: 12px !important;
    padding: 6px 12px !important;
    font-weight: 600 !important;
    font-family: 'Lato', sans-serif !important;
}

::v-deep(.b-form-tag .b-form-tag-remove) {
    color: #DF2DB2 !important;
    margin-left: 6px;
    transition: all 0.3s ease;
}

::v-deep(.b-form-tag .b-form-tag-remove:hover) {
    color: #EF4444 !important;
}

::v-deep(.b-form-tags-input) {
    border: none !important;
    outline: none !important;
    padding: 6px 8px !important;
    font-family: 'Lato', sans-serif;
}

/* Switch modernizado */
.switch-container {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
    border-radius: 16px;
    border: 2px solid rgba(223, 45, 178, 0.1);
}

.switch-label {
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Lato', sans-serif;
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.switch {
    position: relative;
    display: inline-block;
    border: none;
    border-radius: 50px;
    width: 54px;
    height: 28px;
    flex-shrink: 0;
    overflow: hidden;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #E2E8F0;
    margin: 0;
    border-radius: 50px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.slider::before {
    content: "";
    position: absolute;
    height: 22px;
    width: 22px;
    left: 3px;
    top: 3px;
    background: white;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

input:checked+.slider {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
}

input:checked+.slider::before {
    transform: translateX(26px);
    box-shadow: 0 2px 10px rgba(223, 45, 178, 0.5);
}

.info-icon {
    width: 20px;
    height: 20px;
    opacity: 0.7;
    transition: all 0.3s ease;
}

.info-icon:hover {
    opacity: 1;
    transform: scale(1.1);
}

.top-search-container {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    padding: 0 50px;
    box-sizing: border-box;
    margin: 0.2rem 0 0.5rem 0;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
}

.scroll-arrow {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--el-fill-color-blank, white);
    border: 1.5px solid #E2E8F0;
    color: #DF2DB2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.scroll-arrow:hover {
    background: #185CE6;
    border-color: #185CE6;
    color: white;
    box-shadow: 0 4px 12px rgba(24, 92, 230, 0.3);
    transform: scale(1.05);
}

.scroll-arrow:active {
    transform: scale(0.95);
}

.scroll-arrow-left {
    left: 8px;
}

.scroll-arrow-right {
    right: 8px;
}

.top-search-scroll-wrapper {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 8px;
    padding: 4px 0;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    justify-content: center;
    flex-grow: 1;
}

.top-search-scroll-wrapper::-webkit-scrollbar {
    display: none;
}

.top-search-chip {
    flex-shrink: 0;
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(24, 92, 230, 0.1) 100%);
    color: #DF2DB2;
    padding: 6px 14px;
    border-radius: 50px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    font-family: 'Lato', sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 280px;
}

.top-search-chip-wrapper {
    position: relative;
    display: inline-block;
    cursor: grab;
    transition: all 0.3s ease;
    flex-shrink: 0;
    min-width: fit-content;
}

.top-search-chip-wrapper:active {
    cursor: grabbing;
}

.top-search-chip-wrapper.dragging {
    opacity: 0.5;
    transform: scale(0.95);
}

.top-search-chip-wrapper.drag-over {
    transform: scale(1.05);
    filter: brightness(1.1);
}

.top-search-chip-wrapper.dragging .top-search-chip {
    box-shadow: 0 4px 15px rgba(24, 92, 230, 0.4);
}


.top-search-chip:hover .btn-clear-item {
    border-color: white;
}

@media (max-width: 600px) {
    .top-search-container {
        padding: 0 40px;
    }

    .scroll-arrow {
        width: 28px;
        height: 28px;
    }

    .scroll-arrow-left {
        left: 4px;
    }

    .scroll-arrow-right {
        right: 4px;
    }

    .top-search-scroll-wrapper {
        gap: 6px;
    }

    .top-search-chip {
        font-size: 10px;
        padding: 5px 12px;
        max-width: 240px;
    }

    .top-search-chip-wrapper {
        touch-action: none;
    }
}

.el-tree-node__label {
    overflow: hidden;
    text-overflow: unset;
    white-space: normal;
    word-break: break-word;
    display: block;
    font-size: 12px;
    line-height: 1.4;
}

.el-tree-node__content {
    height: auto !important;
    min-height: 26px;
    align-items: flex-start !important;
    padding-top: 3px;
    padding-bottom: 3px;
}

/* Control del dropdown en móvil - CRÍTICO */
@media (max-width: 768px) {
    ::v-deep(.el-popper) {
        max-width: 90vw !important;
        width: 90vw !important;
        left: 5vw !important;
        right: 5vw !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    ::v-deep(.el-select-dropdown) {
        max-width: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
    }

    ::v-deep(.el-select-dropdown__wrap) {
        max-width: 100% !important;
        width: 100% !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
    }

    ::v-deep(.el-tree-node__label) {
        max-width: calc(90vw - 100px) !important;
        width: auto !important;
        overflow: visible !important;
        text-overflow: unset !important;
        white-space: normal !important;
        word-break: break-word !important;
        display: inline !important;
        font-size: 12px !important;
        line-height: 1.4 !important;
    }

    ::v-deep(.el-tree-node__content) {
        max-width: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        padding-right: 5px !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
    }

    ::v-deep(.el-select-dropdown .el-tree) {
        max-width: 100% !important;
        width: 100% !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
    }

    ::v-deep(.el-tree-node) {
        max-width: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
    }

    ::v-deep(.el-checkbox__label) {
        max-width: calc(90vw - 110px) !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        display: inline-block !important;
        vertical-align: middle !important;
    }

    ::v-deep(.el-tree .el-tree-node__children) {
        overflow: hidden !important;
        max-width: 100% !important;
    }

    ::v-deep(.el-tree-node__expand-icon) {
        flex-shrink: 0 !important;
        width: 20px !important;
        margin-right: 5px !important;
    }

    ::v-deep(.el-checkbox) {
        flex-shrink: 0 !important;
        margin-right: 5px !important;
    }

    ::v-deep(.el-tree-node__children .el-tree-node__content) {
        padding-left: 25px !important;
    }

    /* Forzar todo el contenido a mantenerse dentro */
    * {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
}

/* Estilos modernos para paginación */
::v-deep(.pagination) {
    gap: 4px;
}

::v-deep(.page-item .page-link) {
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #E2E8F0;
    color: #4A5568;
    font-weight: 600;
    font-size: 0.78rem;
    transition: all 0.3s ease;
    margin: 0 2px;
}

::v-deep(.page-item.active .page-link) {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%) !important;
    border-color: transparent !important;
    color: white !important;
    transform: scale(1.15);
    box-shadow: 0 4px 15px rgba(223, 45, 178, 0.3);
}

::v-deep(.page-item .page-link:hover) {
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    border-color: #DF2DB2;
    color: #DF2DB2;
    transform: translateY(-2px);
}

.color-blue {
    color: #3B82F6;
    font-weight: 700;
    font-family: 'Lato', sans-serif;
}

.btn-clear-item {
    background: rgba(239, 68, 68, 0.2) !important;
    color: #EF4444 !important;
    border: 2px solid #EF4444;
    margin-right: 3px;
    padding: 1px 5px;
    cursor: pointer;
    font-size: 9px;
    font-weight: 700;
    transition: all 0.3s ease;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-clear-item:hover {
    background: #EF4444 !important;
    transform: scale(1.15);
    color: white !important;
    box-shadow: 0 2px 10px rgba(239, 68, 68, 0.4);
}

/* Botón scroll to top */
.scroll-to-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(223, 45, 178, 0.35);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    font-family: 'Lato', sans-serif;
}

.scroll-to-top-btn:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 32px rgba(223, 45, 178, 0.45);
}

.scroll-to-top-btn:active {
    transform: translateY(-2px) scale(1.02);
}

.scroll-to-top-btn svg {
    width: 24px;
}

/* Estilos para resaltado de texto en búsquedas */
.highlight-text {
    background-color: #fef3c7;
    color: #92400e;
    font-weight: 700 !important;
    padding: 2px 4px;
    border-radius: 3px;
    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
}

.scroll-to-top-btn svg {
    width: 24px;
    height: 24px;
}

/* Animación fade-scale */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
}

.fade-scale-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
}

@media (max-width: 768px) {
    .scroll-to-top-btn {
        bottom: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
    }

    .scroll-to-top-btn svg {
        width: 20px;
        height: 20px;
    }
}

.sidebar-body ::v-deep(.el-select-dropdown),
.sidebar-body ::v-deep(.el-tree-select__popper) {
    min-width: 260px !important;
    max-width: 400px !important;
    width: auto !important;
}

.sidebar-body ::v-deep(.el-tree-node__content) {
    white-space: normal !important;
    word-break: break-word !important;
    align-items: flex-start !important;
}

/* Estilos globales para AutoComplete del sidebar - aplican sin importar dónde se monte */
.p-autocomplete-panel.sidebar-autocomplete-popper {
    max-width: 292px !important;
    width: 292px !important;
    min-width: unset !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}

.p-autocomplete-panel.sidebar-autocomplete-popper .p-autocomplete-items {
    max-height: 280px !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
}

.p-autocomplete-panel.sidebar-autocomplete-popper .p-autocomplete-item {
    word-break: break-word !important;
    white-space: normal !important;
    padding: 8px 10px !important;
    font-size: 11.5px !important;
    line-height: 1.5 !important;
    min-height: 36px !important;
    display: flex !important;
    align-items: center !important;
}

.p-autocomplete-panel.sidebar-autocomplete-popper .autocomplete-item {
    word-break: break-word !important;
    white-space: normal !important;
    font-size: 11.5px !important;
    line-height: 1.5 !important;
    display: block !important;
    width: 100% !important;
}

/* Estilos para el AutoComplete del buscador principal */
/* Estilos para el autocomplete del buscador global */
.sidebar-tree-popper.search-global-autocomplete {
    max-width: 100% !important;
    width: 100% !important;
    min-width: 400px !important;
    box-sizing: border-box !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
    background: var(--el-bg-color-overlay, #ffffff);
    border: 1px solid #e5e7eb !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion {
    width: 100% !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
    background: var(--el-bg-color-overlay, #ffffff);
}

.sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__list {
    max-height: 300px !important;
    overflow-y: auto !important;
    padding: 0 !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
    background: var(--el-bg-color-overlay, #ffffff);
    width: 100% !important;
}

.sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__wrap {
    max-height: 300px !important;
    width: 100% !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
    background: var(--el-bg-color-overlay, #ffffff);
}

.sidebar-tree-popper.search-global-autocomplete li {
    word-break: break-word !important;
    white-space: normal !important;
    line-height: 1.5 !important;
    height: auto !important;
    min-height: 44px !important;
    padding: 12px 16px !important;
    font-size: 14px !important;
    width: 100% !important;
    box-sizing: border-box !important;
    transition: background 0.15s ease !important;
    background-color: var(--el-bg-color-overlay, #ffffff);
}

.sidebar-tree-popper.search-global-autocomplete li:hover {
    background: #f3f4f6 !important;
    background-color: #f3f4f6 !important;
}

.sidebar-tree-popper.search-global-autocomplete li.highlighted {
    background: #e0e7ff !important;
    background-color: #e0e7ff !important;
    color: #4338ca !important;
}

.sidebar-tree-popper.search-global-autocomplete li div,
.sidebar-tree-popper.search-global-autocomplete li span,
.sidebar-tree-popper.search-global-autocomplete li strong {
    background: transparent !important;
    background-color: transparent !important;
}

.sidebar-tree-popper.search-global-autocomplete li div {
    word-break: break-word !important;
    white-space: normal !important;
    width: 100% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
}

.sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar {
    width: 8px !important;
}

.sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-track {
    background: #f1f1f1 !important;
    border-radius: 4px !important;
}

.sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-thumb {
    background: #cbd5e0 !important;
    border-radius: 4px !important;
}

.sidebar-tree-popper.search-global-autocomplete .el-autocomplete-suggestion__list::-webkit-scrollbar-thumb:hover {
    background: #a0aec0 !important;
}

/* ====== DARK MODE ====== */
.dark .search-box {
    background: #1e293b !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
}

.dark .search-input {
    background: #1e293b !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.search-input.el-autocomplete) {
    background: #1e293b !important;
}

.dark ::v-deep(.search-input.el-autocomplete .el-input__wrapper) {
    background: #1e293b !important;
}

.dark ::v-deep(.search-input.el-autocomplete .el-input__inner) {
    background: #1e293b !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.search-input.el-autocomplete .el-input__inner::placeholder) {
    color: #64748b !important;
}

.dark ::v-deep(.search-input.el-autocomplete .el-input__inner:focus) {
    background: #1e293b !important;
}

.dark .btn-filter {
    background: #374151 !important;
    border-color: #4b5563 !important;
}

.dark .btn-filter:hover {
    background: #4b5563 !important;
}

.dark .btn-filter img {
    filter: brightness(0) invert(1);
}

.dark .btn-clear-button {
    background: #1e293b !important;
    color: #f87171 !important;
    border-color: #f87171 !important;
}

.dark .btn-clear-button:hover {
    background: #EF4444 !important;
    color: white !important;
}

.dark .scroll-arrow {
    background: #1e293b !important;
    border-color: #374151 !important;
    color: #c4b5fd !important;
}

.dark .scroll-arrow:hover {
    background: #185CE6 !important;
    border-color: #185CE6 !important;
    color: white !important;
}

.dark .top-search-chip {
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(24, 92, 230, 0.15) 100%) !important;
    color: #c4b5fd !important;
}

.dark .top-search-chip:hover {
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.25) 0%, rgba(139, 92, 246, 0.25) 50%, rgba(24, 92, 230, 0.25) 100%) !important;
}

.dark .filter-sidebar {
    background: #1e293b !important;
}

.dark .sidebar-header {
    background: linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(24, 92, 230, 0.1)) !important;
}

.dark .sidebar-title {
    color: #e2e8f0 !important;
}

.dark .sidebar-close-btn {
    color: #94a3b8 !important;
}

.dark .sidebar-close-btn:hover {
    color: #f87171 !important;
}

.dark .sidebar-body {
    background: #1e293b !important;
}

.dark .form-label {
    color: #cbd5e1 !important;
}

.dark .contenedor-tab-global {
    background: #0f172a !important;
}

.dark .contenedor-tab {
    color: #94a3b8 !important;
}

.dark .contenedor-tab.active-criterio {
    color: #e2e8f0 !important;
}

.dark .contenedor-tab img {
    filter: brightness(0) invert(0.7) !important;
}

.dark .contenedor-tab.active-criterio img {
    filter: brightness(0) invert(1) !important;
}

.dark #filterbar-container2 {
    background: #1e293b !important;
}

.dark #filterbar-container2 .form-check-label {
    color: #cbd5e1 !important;
}

.dark .result-item {
    background: #0f172a !important;
    border-color: #374151 !important;
}

.dark .result-title {
    color: #93c5fd !important;
}

.dark .result-content,
.dark .result-meta {
    color: #94a3b8 !important;
}

.dark .sort-label {
    color: #94a3b8 !important;
}

.dark .sort-select {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .help-info {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #94a3b8 !important;
}

.dark .highlight-text {
    background-color: rgba(251, 191, 36, 0.2) !important;
    color: #fbbf24 !important;
}

.dark ::v-deep(.custom-tree-select .el-input__wrapper) {
    background: #0f172a !important;
    border-color: #374151 !important;
    box-shadow: none !important;
}

.dark ::v-deep(.custom-tree-select .el-input__inner) {
    color: #e2e8f0 !important;
}

.dark ::v-deep(.custom-tree-select .el-input__inner::placeholder) {
    color: #64748b !important;
}

.dark ::v-deep(.mx-input) {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .switch-label {
    color: #cbd5e1 !important;
    background: none !important;
    -webkit-background-clip: unset !important;
    background-clip: unset !important;
    -webkit-text-fill-color: #cbd5e1 !important;
}

/* --- Additional dark mode overrides --- */

.dark .result-item {
    background: #1e293b !important;
    border-color: #374151 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

.dark .result-item:hover {
    background: #263548 !important;
    border-color: #4b5563 !important;
}

.dark .result-info {
    color: #94a3b8 !important;
}

.dark .result-info strong {
    color: #cbd5e1 !important;
}

.dark .result-content {
    color: #cbd5e1 !important;
}

.dark .result-meta {
    color: #94a3b8 !important;
}

.dark .copy-btn {
    background: #4b5563 !important;
    color: #e2e8f0 !important;
}

.dark .copy-btn:hover {
    background: #6b7280 !important;
}

.dark .btn-expand-sintesis {
    background: #374151 !important;
    color: #93c5fd !important;
    border-color: #4b5563 !important;
}

.dark .btn-expand-sintesis:hover {
    background: #4b5563 !important;
}

.dark #filterbar-container2 {
    background: #1e293b !important;
    border-color: #374151 !important;
}

.dark #filterbar-container2 .form-check {
    background: #0f172a !important;
    border-color: #374151 !important;
}

.dark #filterbar-container2 .form-check-label {
    color: #cbd5e1 !important;
}

.dark #filterbar {
    background-color: #1e293b !important;
    border-color: #374151 !important;
}

.dark .sidebar-footer-actions {
    background: #0f172a !important;
    border-top-color: #374151 !important;
}

.dark .sidebar-header {
    border-bottom-color: #374151 !important;
}

.dark .custom-loader-overlay {
    background: rgba(15, 23, 42, 0.95) !important;
}

.dark .loader-text {
    color: #e2e8f0 !important;
}

.dark .no-results-description {
    color: #94a3b8 !important;
}

.dark .no-results h3,
.dark .no-results-title {
    color: #e2e8f0 !important;
}

.dark .sin_resultados {
    background-color: #1e293b !important;
    color: #94a3b8 !important;
}

.dark .dropdown-menu.filterbar-overlay {
    background: #1e293b !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .help-icon-btn {
    background: #374151 !important;
    border-color: #4b5563 !important;
    color: #94a3b8 !important;
}

.dark .help-icon-btn:hover {
    background: #4b5563 !important;
    color: #e2e8f0 !important;
}

.dark .help-info-card {
    background: rgba(30, 41, 59, 0.98) !important;
    border-color: #374151 !important;
}

.dark .help-info-card::before {
    background: linear-gradient(135deg, rgba(55, 65, 81, 0.3) 0%, rgba(30, 41, 59, 0.3) 100%) !important;
}

.dark .help-info-card .card-body {
    background: #0f172a !important;
    border-color: #374151 !important;
}

.dark .help-info-card .card-body:hover {
    border-color: #4b5563 !important;
}

.dark .help-info-card .card-body .card-title,
.dark .help-info-card .card-body h5 {
    color: #e2e8f0 !important;
}

.dark .help-info-card .card-body p {
    color: #94a3b8 !important;
}

.dark .select-estado {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .check {
    background-color: #0f172a !important;
    border-color: #4b5563 !important;
}

.dark .tick {
    background-color: #0f172a !important;
}

.dark .contenedor-tab-global {
    border-bottom-color: #374151 !important;
}

.dark .contenedor-tab:hover {
    background: rgba(24, 92, 230, 0.15) !important;
}

.dark .active-criterio {
    background: rgba(24, 92, 230, 0.15) !important;
    color: #93c5fd !important;
    border-left-color: #3b82f6 !important;
}

.dark .contenedor-filtros .form-label {
    color: #cbd5e1 !important;
}

.dark .filter-header {
    border-right-color: #374151 !important;
}

.dark .contenedor-cabeceras-a {
    border-bottom-color: #374151 !important;
}

.dark #filterbar-container .container-nav,
.dark .contenedor-cabeceras-a a {
    color: #94a3b8 !important;
}

.dark #filterbar-container .container-nav:hover,
.dark .contenedor-cabeceras-a a:hover {
    color: #93c5fd !important;
}

.dark ::v-deep(.el-select__wrapper) {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.el-select__wrapper:hover) {
    border-color: #8B5CF6 !important;
}

.dark ::v-deep(.el-select__placeholder) {
    color: #64748b !important;
}

.dark ::v-deep(.mx-input) {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.b-form-tags) {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.b-form-tags-input) {
    color: #e2e8f0 !important;
    background: transparent !important;
}

.dark .switch-container {
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%) !important;
    border-color: rgba(223, 45, 178, 0.2) !important;
}

.dark .scroll-arrow {
    background: #1e293b !important;
    border-color: #374151 !important;
}

/* Note: .dark ::v-deep in scoped block doesn't work - pagination dark overrides are in the unscoped block */

.dark .results-area {
    background: transparent !important;
}

.dark .search-results {
    background: transparent !important;
}

.dark .results-column {
    background: transparent !important;
}

.dark .landing-busqueda {
    background: #0f172a !important;
}

.dark .tip-item {
    color: #94a3b8 !important;
}

.dark .color-blue {
    color: #93c5fd !important;
}

.dark #size .btn.btn-success {
    background-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark .slider > .track {
    background-color: #374151 !important;
}

.dark .p-autocomplete-panel.sidebar-autocomplete-popper {
    background: #1e293b !important;
    border-color: #374151 !important;
}

.dark .p-autocomplete-panel.sidebar-autocomplete-popper .p-autocomplete-item {
    color: #e2e8f0 !important;
}

.dark .p-autocomplete-panel.sidebar-autocomplete-popper .p-autocomplete-item:hover {
    background: #374151 !important;
}

/* Dark mode: override border-color on ALL input focus/hover states */
.dark input,
.dark input:focus,
.dark input:hover,
.dark input:active,
.dark textarea,
.dark textarea:focus,
.dark select,
.dark select:focus,
.dark .form-control,
.dark .form-control:focus {
    background-color: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.el-input__wrapper),
.dark ::v-deep(.el-input__wrapper:focus),
.dark ::v-deep(.el-input__wrapper:hover),
.dark ::v-deep(.el-input__wrapper.is-focus),
.dark ::v-deep(.el-input__wrapper.is-hovering),
.dark ::v-deep(.el-input.is-focus .el-input__wrapper),
.dark ::v-deep(.el-input.is-hovering .el-input__wrapper) {
    background-color: #0f172a !important;
    border-color: #374151 !important;
}

.dark ::v-deep(.el-input__inner),
.dark ::v-deep(.el-input__inner:focus),
.dark ::v-deep(.el-input__inner:hover) {
    color: #e2e8f0 !important;
    background: transparent !important;
}

.dark ::v-deep(.el-input__inner::placeholder) {
    color: #64748b !important;
}

.dark ::v-deep(.el-select__wrapper),
.dark ::v-deep(.el-select__wrapper:focus),
.dark ::v-deep(.el-select__wrapper:hover),
.dark ::v-deep(.el-select__wrapper.is-focused) {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.el-select__placeholder) {
    color: #64748b !important;
}

.dark ::v-deep(.el-autocomplete .el-input__wrapper),
.dark ::v-deep(.el-autocomplete .el-input__wrapper:focus),
.dark ::v-deep(.el-autocomplete .el-input__wrapper:hover),
.dark ::v-deep(.el-autocomplete .el-input__wrapper.is-focused),
.dark ::v-deep(.el-autocomplete .el-input__wrapper.is-focus) {
    background-color: #0f172a !important;
    border-color: #374151 !important;
}

.dark ::v-deep(.mx-input),
.dark ::v-deep(.mx-input:focus),
.dark ::v-deep(.mx-input:hover) {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.mx-input::placeholder) {
    color: #64748b !important;
}

.dark ::v-deep(.b-form-tags),
.dark ::v-deep(.b-form-tags:focus),
.dark ::v-deep(.b-form-tags:hover),
.dark ::v-deep(.b-form-tags.focus) {
    background: #0f172a !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.b-form-tags .form-control),
.dark ::v-deep(.b-form-tags .form-control:focus),
.dark ::v-deep(.b-form-tags input),
.dark ::v-deep(.b-form-tags input:focus) {
    background: transparent !important;
    border-color: #374151 !important;
    color: #e2e8f0 !important;
}

.dark ::v-deep(.p-autocomplete-input),
.dark ::v-deep(.p-autocomplete-input:focus),
.dark ::v-deep(.p-autocomplete-input:hover) {
    color: #e2e8f0 !important;
    background: transparent !important;
}

.dark ::v-deep(.p-autocomplete-input::placeholder) {
    color: #64748b !important;
}

.dark .contenedor-filtros {
    background: transparent !important;
}

.dark ::v-deep(.el-select__tags-text) {
    color: #93c5fd !important;
}

.dark ::v-deep(.el-tag) {
    border-color: #3b82f6 !important;
    color: #93c5fd !important;
    background: rgba(59, 130, 246, 0.1) !important;
}

.dark ::v-deep(.el-tag__close) {
    color: #93c5fd !important;
}

.dark ::v-deep(.b-form-tag) {
    border-color: #3b82f6 !important;
    color: #93c5fd !important;
}

.dark .highlight-denominacion {
    color: #93c5fd !important;
    background-color: rgba(59, 130, 246, 0.2) !important;
}

.dark ::v-deep(.el-select__suffix) {
    color: #94a3b8 !important;
}

.dark ::v-deep(.mx-icon-calendar),
.dark ::v-deep(.mx-icon-clear) {
    color: #94a3b8 !important;
}
</style>
