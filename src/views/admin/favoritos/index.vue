<template>
  <div class="fav-shell">

    <!-- ═══════════════ SIDEBAR ═══════════════ -->
    <aside class="fav-sidebar">
      <!-- Carpetas -->
      <div class="sidebar-section">
        <div class="sidebar-section-hdr">
          <span>CARPETAS</span>
          <button class="sidebar-add-btn" @click="createDirectory(null)" title="Nueva carpeta">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div class="px-2 pb-1">
          <SearchBar placeholder="Buscar carpeta..." :debounce="200" @search="val => dirSearch = val" />
        </div>
        <div class="folder-tree">
          <!-- Item "Todas" siempre visible -->
          <div class="folder-item" :class="{ active: currentDirectorioId === null && navMode === 'all' }" @click="clearDirectorio">
            <span class="folder-expand-spacer"></span>
            <span class="folder-dot" style="background:#94a3b8"></span>
            <svg class="folder-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            <span class="folder-label">Todas las carpetas</span>
          </div>
          <div v-if="filteredDirTree.length === 0" class="sidebar-empty-hint">{{ dirSearch ? 'Sin resultados' : 'Sin carpetas aún' }}</div>
          <template v-for="dir in filteredDirTree" :key="dir.ID">
            <div class="folder-item" :class="{ active: currentDirectorioId === dir.ID }" @click="selectDirectorio(dir)">
              <button v-if="dir.children && dir.children.length" class="folder-expand-btn" @click.stop="toggleDirOpen(dir.ID)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline :points="isDirOpen(dir.ID) ? '18 15 12 9 6 15' : '9 18 15 12 9 6'"/>
                </svg>
              </button>
              <span v-else class="folder-expand-spacer"></span>
              <span class="folder-dot" :style="{ background: dir.COLOR || '#185CE6' }"></span>
              <svg class="folder-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              </svg>
              <span class="folder-label">{{ dir.DSCRPCN }}</span>
              <button class="folder-more-btn" @click.stop="dirContextMenu(dir, $event)" title="Opciones">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
              </button>
            </div>
            <!-- Subcarpetas -->
            <template v-if="isDirOpen(dir.ID) && dir.children && dir.children.length">
              <div v-for="sub in dir.children" :key="sub.ID" class="folder-item sub" :class="{ active: currentDirectorioId === sub.ID }" @click="selectDirectorio(sub)">
                <span class="folder-expand-spacer"></span>
                <span class="folder-dot" :style="{ background: sub.COLOR || '#185CE6' }"></span>
                <svg class="folder-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                </svg>
                <span class="folder-label">{{ sub.DSCRPCN }}</span>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- Casos (pendiente implementar) -->
      <div v-if="false" class="sidebar-section">
        <div class="sidebar-section-hdr">
          <span>CASOS</span>
          <button class="sidebar-add-btn" @click="createCaso" title="Nuevo caso">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div v-if="casos.length === 0" class="sidebar-empty-hint">Sin casos</div>
        <div v-for="caso in casos" :key="caso.ID" class="sidebar-caso-item" :class="{ active: currentCasoId === caso.ID }" @click="selectCaso(caso)">
          <span class="caso-dot" :style="{ background: caso.COLOR || '#6B7280' }"></span>
          <span class="caso-label">{{ caso.TITULO }}</span>
        </div>
      </div>

      <!-- Footer sidebar -->
      <div class="sidebar-footer">
        <!-- Papelera (pendiente implementar) -->
        <button v-if="false" class="sidebar-nav-item text-red-400" @click="setNav('trash')">
          <span class="nav-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></span>
          <span>Papelera</span>
        </button>
      </div>
    </aside>

    <!-- ═══════════════ MAIN ═══════════════ -->
    <div class="fav-main" :class="{ 'panel-open': !!selectedItem }">

      <!-- Topbar -->
      <div class="fav-topbar">
        <!-- Breadcrumb -->
        <div class="fav-breadcrumb">
          <span v-if="navMode !== 'directorio'" class="bc-current">{{ currentNavLabel }}</span>
          <button v-else class="dir-filter-chip" @click="clearDirectorio" title="Quitar filtro de carpeta">
            <span class="folder-dot" :style="{ background: currentDirectorio?.COLOR || '#185CE6' }"></span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
            <span>{{ currentDirectorio?.DSCRPCN }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;opacity:.6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Right controls -->
        <div class="topbar-right">
          <!-- View switcher -->
          <div class="view-switcher">
            <button v-for="v in viewModes" :key="v.id" :title="v.label" class="view-btn" :class="{ active: viewMode === v.id }" @click="viewMode = v.id">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="v.icon"></svg>
            </button>
          </div>
          <!-- New dir -->
          <new-button label="Nueva carpeta" @click="createDirectory(currentDirectorioId)"/>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="fav-filterbar">
        <div class="filterbar-controls">
          <search-bar
            placeholder="Buscar en favoritos..."
            @search="q => { filter.termino = q; loadDocuments(); }"
            style="flex:1;min-width:200px;"
          />
          <app-select :model-value="navMode" @update:model-value="v => { setNav(v); }" style="min-width:130px;flex-shrink:0;">
            <option v-for="n in primaryNav" :key="n.id" :value="n.id">{{ n.label }}</option>
          </app-select>
          <search-button @click="loadDocuments"/>
        </div>
        <span class="result-count">{{ pagination.total }} resultado{{ pagination.total !== 1 ? 's' : '' }}</span>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="pagination.loading" class="fav-loading">
        <div class="loading-spinner"></div>
        <span>Cargando documentos...</span>
      </div>

      <!-- ── EMPTY ── -->
      <div v-else-if="!pagination.loading && documents.length === 0" class="fav-empty">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <p>No hay documentos en esta sección</p>
        <small>Agrega entradas a favoritos desde la búsqueda</small>
      </div>

      <template v-else>

        <!-- ════════════ VISTA LISTA ════════════ -->
        <div v-if="viewMode === 'lista'" class="fav-list-view">
          <div class="list-header">
            <span class="lh-title">Documento</span>
            <span class="lh-autor">Propietario</span>
            <span class="lh-fecha">Modificado</span>
            <span class="lh-acciones">Acciones</span>
          </div>
          <div v-for="doc in documents" :key="doc.ID" class="list-row" :class="{ selected: selectedItem && selectedItem.ID === doc.ID }" @click="selectItem(doc)">
            <!-- Doc icon -->
            <div class="doc-type-wrap">
              <div class="doc-type-badge" :style="{ background: docTypeColor(doc.TYPE) + '20', color: docTypeColor(doc.TYPE) }">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="docTypeIcon(doc.TYPE)"></svg>
              </div>
              <span v-if="doc.PROP == 0" class="shared-dot" title="Compartido contigo"></span>
            </div>
            <!-- Title col -->
            <div class="row-title-col">
              <span class="row-titlealt" v-if="doc.TITLEALT && doc.TITLEALT !== doc.TITULO">{{ doc.TITLEALT }}</span>
              <span class="row-titulo">{{ doc.TITULO || '-' }}</span>
              <span v-if="doc.DDIRECTORIO" class="row-dir-tag">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                {{ doc.DDIRECTORIO }}
              </span>
            </div>
            <!-- Autor col -->
            <div class="row-autor-col"
              :title="doc.PROP == 0 ? (doc.AUTOR + (doc.AUTOR_EMAIL ? '\n' + doc.AUTOR_EMAIL : '')) : 'Yo'">
              <img :src="doc.RTAFTO || defaultAvatar" :alt="doc.AUTOR" class="autor-avatar" referrerpolicy="no-referrer"/>
              <span class="autor-name">{{ doc.PROP == 1 ? 'Yo' : (doc.AUTOR || '-') }}</span>
              <svg v-if="doc.PROP == 0" class="shared-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" title="">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <!-- Date col -->
            <span class="row-date-col">{{ formatDate(doc.FEDCN) }}</span>
            <!-- Actions col -->
            <div class="row-actions-col" @click.stop>
              <button class="row-action-btn blue" :class="{ 'btn-loading': loadingViewId === doc.ID }" @click.stop="openViewModal(doc)" title="Ver documento" :disabled="loadingViewId !== null">
                <span v-if="loadingViewId === doc.ID" class="btn-mini-spinner"></span>
                <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="row-action-btn green" @click.stop="openShareModal(doc)" title="Compartir">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <button v-if="doc.PROP == 1 || doc.ISPERM >= 2" class="row-action-btn amber" @click.stop="updateSharedActions(doc)" title="Cambiar carpeta / nombre">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="row-action-btn red" @click.stop="deleteFavoriteItem(doc)" title="Eliminar de favoritos">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ════════════ VISTA GRID ════════════ -->
        <div v-else-if="viewMode === 'grid'" class="fav-grid-view">
          <div v-for="doc in documents" :key="doc.ID" class="grid-card" :class="{ selected: selectedItem && selectedItem.ID === doc.ID }" @click="selectItem(doc)">
            <!-- Parte azul: TITULO -->
            <div class="card-top">
              <button class="card-star-btn" :class="{ starred: doc.STARRED == 1 }" @click.stop="toggleStar(doc)" :title="doc.STARRED == 1 ? 'Quitar destacado' : 'Destacar'">
                <svg width="13" height="13" viewBox="0 0 24 24" :fill="doc.STARRED == 1 ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              </button>
              <p class="card-titulo">{{ doc.TITULO || '-' }}</p>
            </div>
            <!-- Parte blanca: título alternativo + carpeta + meta -->
            <div class="card-bottom">
              <div class="card-bottom-info">
                <p v-if="doc.TITLEALT" class="card-titlealt">{{ doc.TITLEALT }}</p>
                <div v-if="doc.DDIRECTORIO" class="card-dir-row">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                  <span>{{ doc.DDIRECTORIO }}</span>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-autor">
                  <img :src="doc.RTAFTO || defaultAvatar" class="card-avatar" referrerpolicy="no-referrer"/>
                  <span>{{ doc.PROP == 1 ? 'Yo' : (doc.AUTOR || '-') }}</span>
                </div>
                <span class="card-date">{{ formatDate(doc.FEDCN) }}</span>
              </div>
            </div>
            <!-- Hover actions overlay -->
            <div class="card-actions-overlay">
              <button class="card-action-btn" :class="{ 'btn-loading': loadingViewId === doc.ID }" @click.stop="openViewModal(doc)" title="Ver" :disabled="loadingViewId !== null">
                <span v-if="loadingViewId === doc.ID" class="btn-mini-spinner"></span>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="card-action-btn" @click.stop="openShareModal(doc)" title="Compartir">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <button class="card-action-btn danger" @click.stop="deleteFavoriteItem(doc)" title="Eliminar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ════════════ VISTA KANBAN ════════════ -->
        <div v-else-if="viewMode === 'kanban'" class="fav-kanban-view">
          <div v-for="col in kanbanCols" :key="col.id" class="kanban-col">
            <div class="kanban-col-hdr" :style="{ borderTopColor: col.color }">
              <div class="kanban-col-title">
                <span class="kanban-dot" :style="{ background: col.color }"></span>
                {{ col.label }}
              </div>
              <span class="kanban-count">{{ kanbanDocs(col.id).length }}</span>
            </div>
            <div class="kanban-cards">
              <div v-if="kanbanDocs(col.id).length === 0" class="kanban-empty">
                <span>Sin documentos</span>
              </div>
              <div v-for="doc in kanbanDocs(col.id)" :key="doc.ID" class="kanban-card" @click="selectItem(doc)">
                <div class="kc-top">
                  <button class="kc-star" :class="{ starred: doc.STARRED == 1 }" @click.stop="toggleStar(doc)" :title="doc.STARRED == 1 ? 'Quitar destacado' : 'Destacar'">
                    <svg width="11" height="11" viewBox="0 0 24 24" :fill="doc.STARRED == 1 ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                  </button>
                  <button class="kc-view" @click.stop="openViewModal(doc)" title="Ver" :disabled="loadingViewId !== null">
                    <span v-if="loadingViewId === doc.ID" class="btn-mini-spinner"></span>
                    <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
                <p class="kc-titulo">{{ truncate(doc.TITLEALT || doc.TITULO, 50) }}</p>
                <div class="kc-footer">
                  <img :src="doc.RTAFTO || defaultAvatar" class="kc-avatar" referrerpolicy="no-referrer"/>
                  <span class="kc-date">{{ formatDate(doc.FEDCN) }}</span>
                </div>
                <!-- Move col buttons -->
                <div class="kc-move" @click.stop>
                  <button v-if="col.id !== 'REVISAR'" class="kc-move-btn" @click.stop="moveKanban(doc, prevKanbanCol(col.id))" title="Mover atrás">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button v-if="col.id !== 'ARCHIVADO'" class="kc-move-btn" @click.stop="moveKanban(doc, nextKanbanCol(col.id))" title="Mover adelante">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </template>

      <!-- Pagination (hidden in kanban) -->
      <div v-if="viewMode !== 'kanban' && !pagination.loading && pagination.total > pagination.perPage" class="fav-pagination">
        <button class="pg-btn" :disabled="pagination.page <= 1" @click="changePage(pagination.page - 1)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button v-for="p in pageNumbers" :key="p" class="pg-btn" :class="{ active: p === pagination.page, dots: p === '...' }" @click="p !== '...' && changePage(p)">
          {{ p }}
        </button>
        <button class="pg-btn" :disabled="pagination.page >= totalPages" @click="changePage(pagination.page + 1)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <span class="pg-info">{{ pagination.perPage * (pagination.page - 1) + 1 }}–{{ Math.min(pagination.perPage * pagination.page, pagination.total) }} de {{ pagination.total }}</span>
      </div>
    </div>

    <!-- ═══════════════ DETAIL PANEL ═══════════════ -->
    <transition name="slide-panel">
      <aside v-if="selectedItem" class="fav-detail-panel">
        <!-- Accent strip (color del tipo de doc) -->
        <div class="panel-accent-strip" :style="{ background: docTypeColor(selectedItem.TYPE) }"></div>

        <!-- Panel header -->
        <div class="panel-hdr">
          <div class="panel-type-badge-lg" :style="{ background: docTypeColor(selectedItem.TYPE) + '18', color: docTypeColor(selectedItem.TYPE) }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="docTypeIcon(selectedItem.TYPE)"></svg>
          </div>
          <div class="panel-hdr-info">
            <p class="panel-titlealt">{{ selectedItem.TITLEALT || 'Sin título alternativo' }}</p>
            <p class="panel-titulo">{{ selectedItem.TITULO }}</p>
          </div>
          <button class="panel-close-btn" @click="selectedItem = null">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Quick actions -->
        <div class="panel-quick-actions">
          <button class="pqa-btn" :class="{ active: selectedItem.STARRED == 1 }" @click="toggleStar(selectedItem)" :title="selectedItem.STARRED == 1 ? 'Quitar destacado' : 'Destacar'">
            <svg width="13" height="13" viewBox="0 0 24 24" :fill="selectedItem.STARRED == 1 ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            <span>{{ selectedItem.STARRED == 1 ? 'Destacado' : 'Destacar' }}</span>
          </button>
          <!-- <button class="pqa-btn" @click="openViewModal(selectedItem)" :disabled="loadingViewId !== null">
            <span v-if="loadingViewId === selectedItem?.ID" class="btn-mini-spinner" style="border-color:rgba(0,0,0,0.15);border-top-color:#374151;"></span>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Ver</span>
          </button>
          <button class="pqa-btn" @click="openShareModal(selectedItem)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span>Compartir</span>
          </button> -->
          <button class="pqa-btn" @click="openShareUsersModal(selectedItem)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            <span>Accesos</span>
          </button>
          <!-- <button class="pqa-btn danger" @click="deleteFavoriteItem(selectedItem)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span>Eliminar</span>
          </button> -->
        </div>

        <!-- Tabs -->
        <div class="panel-tabs">
          <button v-for="t in panelTabs" :key="t.id" class="panel-tab" :class="{ active: panelTab === t.id }" @click="switchPanelTab(t.id)">{{ t.label }}</button>
        </div>

        <!-- Tab: Detalles -->
        <div v-if="panelTab === 'details'" class="panel-content">

          <!-- Propietario -->
          <div class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Propietario
            </span>
            <div class="df-owner-row">
              <img :src="selectedItem.RTAFTO || defaultAvatar" class="detail-avatar" referrerpolicy="no-referrer"/>
              <div class="df-owner-info">
                <span class="df-owner-name">{{ selectedItem.PROP == 1 ? 'Yo' : (selectedItem.AUTOR || '-') }}</span>
                <span v-if="selectedItem.PROP == 0 && selectedItem.AUTOR_EMAIL" class="df-owner-email">{{ selectedItem.AUTOR_EMAIL }}</span>
              </div>
              <span v-if="selectedItem.PROP == 0" class="detail-shared-tag">Compartido</span>
            </div>
          </div>

          <!-- Carpeta -->
          <div class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
              Carpeta
            </span>
            <div class="df-val">
              <button v-if="selectedItem.PROP == 1 || selectedItem.ISPERM >= 2" class="detail-dir-btn" @click="updateSharedActions(selectedItem)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                {{ selectedItem.DDIRECTORIO || 'Sin carpeta — clic para asignar' }}
              </button>
              <span v-else class="text-sm" style="color:var(--text-muted)">{{ selectedItem.DDIRECTORIO || '—' }}</span>
            </div>
          </div>

          <!-- Fecha -->
          <div class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Fecha de modificación
            </span>
            <span class="df-val">{{ formatDate(selectedItem.FEDCN) }}</span>
          </div>

          <!-- Kanban (oculto) -->
          <div v-if="false" class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="4" height="18" rx="1"/><rect x="10" y="3" width="4" height="11" rx="1"/><rect x="17" y="3" width="4" height="15" rx="1"/></svg>
              Estado Kanban
            </span>
            <div class="kanban-select-row">
              <button v-for="col in kanbanCols" :key="col.id"
                class="kanban-col-pill"
                :class="{ active: (selectedItem.KANBAN_COL || 'REVISAR') === col.id, loading: kanbanLoading && (selectedItem.KANBAN_COL || 'REVISAR') === col.id }"
                :style="{ '--col-color': col.color }"
                :disabled="kanbanLoading || (selectedItem.PROP == 0 && selectedItem.ISPERM < 2)"
                @click="moveKanban(selectedItem, col.id)">
                <span v-if="kanbanLoading && (selectedItem.KANBAN_COL || 'REVISAR') !== col.id && selectedItem._kanbanTarget === col.id" class="pill-spinner"></span>
                <span class="pill-dot" :style="{ background: col.color }"></span>
                {{ col.shortLabel }}
              </button>
            </div>
            <span v-if="selectedItem.PROP == 0 && selectedItem.ISPERM < 2" class="df-hint">Solo el propietario puede cambiar este estado</span>
          </div>

          <!-- Etiquetas -->
          <div class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              Etiquetas
            </span>
            <div class="df-val tags-row">
              <template v-if="parsedTags(selectedItem.ETIQUETAS).length">
                <span v-for="(tag, i) in parsedTags(selectedItem.ETIQUETAS)" :key="i" class="tag-chip">{{ tag }}</span>
              </template>
              <input v-model="tagInput" class="tag-input" placeholder="+ Añadir etiqueta" @keyup.enter="addTag"/>
            </div>
          </div>

          <!-- Descargas -->
          <div v-if="selectedItem.ENTRIEFILE || selectedItem.ENTRIEFILERESUMEN" class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Descargas
            </span>
            <div class="df-val" style="display:flex; flex-direction:column; gap:6px;">
              <button v-if="selectedItem.ENTRIEFILE" class="detail-dir-btn" @click="downloadFavFile(selectedItem.ENTRIEFILE, selectedItem.TITULO, 'Documento')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Descargar documento
              </button>
              <button v-if="selectedItem.ENTRIEFILERESUMEN" class="detail-dir-btn" @click="downloadFavFile(selectedItem.ENTRIEFILERESUMEN, selectedItem.TITULO, 'Resumen Ejecutivo')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Descargar resumen ejecutivo
              </button>
            </div>
          </div>
        </div>

        <!-- Tab: Notas -->
        <div v-else-if="panelTab === 'notas'" class="panel-content">
          <textarea v-model="panelNotes" class="notes-textarea" placeholder="Escribe tus notas sobre este documento..."></textarea>
          <SaveButton @click="saveNotes" :loading="savingNotes" style="align-self:flex-end;"/>
        </div>

        <!-- Tab: Comentarios -->
        <div v-else-if="panelTab === 'comentarios'" class="panel-content">
          <div v-if="loadingComentarios" class="comments-loading">Cargando...</div>
          <div v-else-if="comentarios.length === 0" class="comments-empty">Sin comentarios aún</div>
          <div v-else class="comments-list">
            <div v-for="c in comentarios" :key="c.ID"
              :class="['chat-row', c.ISMINE == 1 ? 'chat-mine' : 'chat-other']">
              <img v-if="c.ISMINE != 1" :src="c.RTAFTO || defaultAvatar" class="comment-avatar" referrerpolicy="no-referrer"/>
              <div class="chat-bubble-wrap">
                <div v-if="c.ISMINE != 1" class="chat-name">{{ c.AUTOR || 'Usuario' }}</div>
                <div class="chat-bubble">
                  <p class="comment-text">{{ c.COMENTARIO }}</p>
                  <div class="chat-time">{{ formatDateTime(c.FCRCN) }}</div>
                </div>
                <button v-if="c.ISMINE == 1" class="chat-del-btn" @click="deleteComentario(c.ID)" title="Eliminar">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <img v-if="c.ISMINE == 1" :src="c.RTAFTO || defaultAvatar" class="comment-avatar" referrerpolicy="no-referrer"/>
            </div>
          </div>
          <div class="comment-input-row">
            <input v-model="newComment" class="comment-input" placeholder="Escribe un comentario..." @keyup.enter="submitComment"/>
            <button class="comment-send-btn" @click="submitComment" :disabled="!newComment.trim()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </aside>
    </transition>

    <!-- ═══════════════ MODALS ═══════════════ -->
    <ModalMostrarResolucion :openModal="openModal" :toggleModal="() => openModal = !openModal"
      :pdfUrl="pdfUrl" :data="rowData" :isFav="false" :role="role"/>
    <ModalCompartirEntrada :openModal="openModalCompartir"
      :toggleModal="() => openModalCompartir = !openModalCompartir" :data="rowDataCompartir"/>
    <ModalUsuariosCompartidos :openModal="openModalUsuariosCompartidos"
      :toggleModal="() => openModalUsuariosCompartidos = !openModalUsuariosCompartidos" :data="rowDataUsuariosCompartidos"/>
    <ModalDirectorioCompartido :openModal="openModalDirectorioCompartido"
      :toggleModal="() => openModalDirectorioCompartido = !openModalDirectorioCompartido" :data="rowDataDirectorioCompartido"/>

    <!-- ── Menú contexto carpeta ─────────────────────────── -->
    <BaseModal v-model="showCtxDirModal" :title="ctxDir ? ctxDir.DSCRPCN : 'Opciones'" size="sm">
      <div class="flex flex-col gap-2">
        <button class="ctx-menu-btn" @click="startRename">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Renombrar
        </button>
        <button class="ctx-menu-btn" @click="() => { showCtxDirModal = false; createDirectory(ctxDir.ID); }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva subcarpeta
        </button>
        <button class="ctx-menu-btn" @click="() => { showCtxDirModal = false; rowDataDirectorioCompartido = ctxDir; openModalDirectorioCompartido = true; }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Compartir carpeta
        </button>
        <button class="ctx-menu-btn ctx-menu-btn--danger" @click="confirmDeleteDir">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          Eliminar
        </button>
      </div>
      <template #footer>
        <CancelButton @click="showCtxDirModal = false"/>
      </template>
    </BaseModal>

    <!-- ── Renombrar carpeta ──────────────────────────────── -->
    <BaseModal v-model="showRenameModal" title="Renombrar carpeta" size="sm" persistent>
      <BaseInput v-model="renameValue" placeholder="Nombre de la carpeta" @keyup.enter="submitRename"/>
      <template #footer>
        <CancelButton @click="showRenameModal = false" :disabled="loadingDir"/>
        <SaveButton @click="submitRename" :loading="loadingDir"/>
      </template>
    </BaseModal>

    <!-- ── Confirmar eliminar carpeta ────────────────────── -->
    <BaseModal v-model="showDeleteDirModal" title="Eliminar carpeta" size="sm" persistent>
      <p class="text-sm m-0" style="color:var(--text)">
        ¿Eliminar <strong>{{ ctxDir?.DSCRPCN }}</strong>? Se eliminará la carpeta y su contenido.
      </p>
      <template #footer>
        <CancelButton @click="showDeleteDirModal = false" :disabled="loadingDir"/>
        <DeleteButton @click="submitDeleteDir" :loading="loadingDir"/>
      </template>
    </BaseModal>

    <!-- ── Confirmar eliminar favorito ───────────────────── -->
    <BaseModal v-model="showDeleteFavModal" title="Eliminar de favoritos" size="sm" persistent>
      <p class="text-sm m-0" style="color:var(--text)">
        ¿Eliminar <strong>{{ deleteTargetItem?.TITLEALT || deleteTargetItem?.TITULO }}</strong> de favoritos?
      </p>
      <template #footer>
        <CancelButton @click="showDeleteFavModal = false" :disabled="loadingDir"/>
        <DeleteButton @click="submitDeleteFav" :loading="loadingDir"/>
      </template>
    </BaseModal>

    <!-- ── Actualizar documento (carpeta + título) ────────── -->
    <BaseModal v-model="showUpdateModal" title="Actualizar documento" size="md" persistent>
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-xs font-semibold mb-1" style="color:var(--color-primary)">Carpeta</label>
          <div style="position:relative;">
            <BaseInput
              v-model="updateModalDirSearch"
              placeholder="Buscar carpeta..."
              @focus="showDirDropdown = true"
              @input="filterUpdateDirs"
              @blur="() => setTimeout(() => showDirDropdown = false, 150)"
            />
            <div v-if="showDirDropdown && updateModalFilteredDirs.length"
              class="absolute left-0 right-0 z-50 bg-white border rounded-xl shadow-lg"
              style="top:100%;margin-top:4px;max-height:200px;overflow-y:auto;border-color:var(--border)">
              <div v-for="d in updateModalFilteredDirs" :key="d.ID"
                class="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-blue-50"
                :class="{ 'bg-blue-50 text-blue-700 font-semibold': updateModalSelectedDir == d.ID }"
                @mousedown.prevent="selectUpdateDir(d)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                {{ d.DSCRPCN }}
              </div>
            </div>
          </div>
          <button v-if="updateModalSelectedDir" class="text-xs mt-1" style="color:#9CA3AF;background:none;border:none;cursor:pointer;padding:0;"
            @click="() => { updateModalSelectedDir = null; updateModalDirSearch = ''; }">
            × Sin carpeta
          </button>
        </div>
        <div>
          <label class="block text-xs font-semibold mb-1" style="color:var(--color-primary)">Título alternativo</label>
          <BaseInput v-model="updateModalTitleAlt" placeholder="Título alternativo (opcional)"/>
        </div>
      </div>
      <template #footer>
        <CancelButton @click="showUpdateModal = false"/>
        <SaveButton @click="submitUpdate" :loading="updatingDoc"/>
      </template>
    </BaseModal>

    <!-- ── Nueva carpeta ────────────────────────────────────── -->
    <BaseModal v-model="showCreateDirModal" title="Nueva carpeta" size="sm" persistent>
      <BaseInput v-model="newDirName" placeholder="Nombre de la carpeta" @keyup.enter="submitCreateDir"/>
      <template #footer>
        <CancelButton @click="showCreateDirModal = false" :disabled="loadingDir"/>
        <SaveButton @click="submitCreateDir" :loading="loadingDir"/>
      </template>
    </BaseModal>

    <!-- ── Nuevo caso (oculto en UI, funcional) ───────────── -->
    <BaseModal v-model="showCreateCasoModal" title="Nuevo caso" size="sm" persistent>
      <BaseInput v-model="newCasoTitulo" placeholder="Nombre del caso / expediente" @keyup.enter="submitCreateCaso"/>
      <template #footer>
        <CancelButton @click="showCreateCasoModal = false"/>
        <SaveButton @click="submitCreateCaso"/>
      </template>
    </BaseModal>

  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import UserProxy from '@/proxies/UserProxy';
import AdminEntriesProxy from '@/proxies/AdminEntriesProxy';
import ModalMostrarResolucion from '../shared/modals/ModalMostrarResolucion.vue';
import ModalCompartirEntrada from '../shared/modals/ModalCompartirEntrada.vue';
import ModalUsuariosCompartidos from '../shared/modals/ModalUsuariosCompartidos.vue';
import ModalDirectorioCompartido from '../shared/modals/ModalDirectorioCompartido.vue';
import SearchBar from '@/components/Common/SearchBar.vue';

const NAV_LABELS = {
  all:     'Todos los documentos',
  starred: 'Destacados',
  shared:  'Compartidos conmigo',
  reading: 'Lista de lectura',
  trash:   'Papelera',
  directorio: '',
  caso: '',
};

export default {
  components: { ModalMostrarResolucion, ModalCompartirEntrada, ModalUsuariosCompartidos, ModalDirectorioCompartido, SearchBar },
  props: {
    role: { type: Array, default: () => [] },
  },
  data() {
    return {
      defaultAvatar: 'https://placehold.co/40x40/e2e8f0/94a3b8?text=U',
      navMode: 'all',
      viewMode: 'lista',

      primaryNav: [
        { id: 'all',     label: 'Todos',       icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' },
        { id: 'starred', label: 'Destacados',   icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
        { id: 'shared',  label: 'Compartidos',  icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>' },
        // { id: 'reading', label: 'Lista de lectura', icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>' }, // pendiente implementar
      ],
      viewModes: [
        { id: 'lista',  label: 'Lista',  icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
        // { id: 'grid',   label: 'Cuadrícula', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' },
      ],
      dirSearch: '',
      panelTabs: [
        { id: 'details',     label: 'Detalles' },
        // { id: 'notas',       label: 'Notas' },       // oculto a pedido
        // { id: 'comentarios', label: 'Comentarios' }, // oculto a pedido
      ],
      kanbanCols: [
        { id: 'REVISAR',     label: 'Por Revisar',    shortLabel: 'Revisar',   color: '#6B7280' },
        { id: 'EN_REVISION', label: 'En Revisión',    shortLabel: 'Revisando', color: '#D97706' },
        { id: 'USADO',       label: 'Usado en Caso',  shortLabel: 'Usado',     color: '#2563EB' },
        { id: 'ARCHIVADO',   label: 'Archivado',      shortLabel: 'Archivado', color: '#7C3AED' },
      ],

      // Data
      documents: [],
      directoriosRaw: [],
      casos: [],

      // Filters + pagination
      filter: {
        termino: '',
        type: '',
        shared: 'T',
      },
      pagination: {
        page: 1,
        perPage: 20,
        total: 0,
        loading: false,
      },

      // Context
      currentDirectorioId: null,
      currentDirectorio: null,
      currentCasoId: null,
      currentCasoLabel: '',

      // Detail panel
      selectedItem: null,
      panelTab: 'details',
      panelNotes: '',
      savingNotes: false,
      kanbanLoading: false,
      tagInput: '',
      comentarios: [],
      loadingComentarios: false,
      newComment: '',

      // Modals — existentes
      openModal: false,
      loadingViewId: null,
      pdfUrl: '',
      rowData: {},
      openModalCompartir: false,
      rowDataCompartir: {},
      openModalUsuariosCompartidos: false,
      rowDataUsuariosCompartidos: {},
      openModalDirectorioCompartido: false,
      rowDataDirectorioCompartido: {},

      // Modals — contexto carpeta
      showCtxDirModal: false,
      ctxDir: null,
      showRenameModal: false,
      renameValue: '',
      showDeleteDirModal: false,

      // Modal — eliminar favorito
      showDeleteFavModal: false,
      deleteTargetItem: null,

      // Modal — actualizar documento
      showUpdateModal: false,
      updateModalItem: null,
      updateModalAllDirs: [],
      updateModalFilteredDirs: [],
      updateModalSelectedDir: null,
      updateModalDirSearch: '',
      updateModalTitleAlt: '',
      showDirDropdown: false,
      updatingDoc: false,

      // Modal — nuevo caso
      showCreateCasoModal: false,
      newCasoTitulo: '',

      // Modal — nueva carpeta
      showCreateDirModal: false,
      newDirName: '',
      newDirParentId: null,

      // Estado expansión de carpetas (reactivo)
      openDirs: {},
      loadingDir: false,
    };
  },

  computed: {
    currentNavLabel() {
      if (this.navMode === 'directorio') return this.currentDirectorio?.DSCRPCN || 'Carpeta';
      if (this.navMode === 'caso') return this.currentCasoLabel;
      return NAV_LABELS[this.navMode] || '';
    },
    directoriosTree() {
      const flat = this.directoriosRaw;
      const roots = flat.filter(d => !d.IDPARENT).map(d => ({ ...d, children: [] }));
      roots.forEach(r => {
        r.children = flat.filter(d => d.IDPARENT == r.ID);
      });
      return roots;
    },
    filteredDirTree() {
      const q = (this.dirSearch || '').toLowerCase().trim();
      if (!q) return this.directoriosTree;
      return this.directoriosTree.filter(d => {
        const matchParent = d.DSCRPCN?.toLowerCase().includes(q);
        const matchChild  = d.children?.some(c => c.DSCRPCN?.toLowerCase().includes(q));
        return matchParent || matchChild;
      }).map(d => {
        const hasChildMatch = d.children?.some(c => c.DSCRPCN?.toLowerCase().includes(q));
        if (hasChildMatch && !this.openDirs[d.ID]) {
          this.openDirs = { ...this.openDirs, [d.ID]: true };
        }
        return {
          ...d,
          children: d.children?.filter(c =>
            !q || d.DSCRPCN?.toLowerCase().includes(q) || c.DSCRPCN?.toLowerCase().includes(q)
          ),
        };
      });
    },
    totalPages() {
      return Math.ceil(this.pagination.total / this.pagination.perPage);
    },
    pageNumbers() {
      const total = this.totalPages;
      const cur = this.pagination.page;
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
      const pages = [1];
      if (cur > 3) pages.push('...');
      for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
      if (cur < total - 2) pages.push('...');
      pages.push(total);
      return pages;
    },
  },

  methods: {
    // ── Navigation ──────────────────────────────────────────────
    setNav(mode) {
      this.navMode = mode;
      this.currentDirectorioId = null;
      this.currentDirectorio = null;
      this.currentCasoId = null;
      this.currentCasoLabel = '';
      this.filter.termino = '';
      this.filter.shared = mode === 'shared' ? 'C' : 'T';
      this.pagination.page = 1;
      this.selectedItem = null;
      this.loadDocuments();
    },

    selectDirectorio(dir) {
      if (this.currentDirectorioId === dir.ID) { this.clearDirectorio(); return; }
      this.navMode = 'directorio';
      this.currentDirectorioId = dir.ID;
      this.currentDirectorio = dir;
      this.currentCasoId = null;
      this.pagination.page = 1;
      this.selectedItem = null;
      this.loadDocuments();
    },

    clearDirectorio() {
      this.navMode = 'all';
      this.currentDirectorioId = null;
      this.currentDirectorio = null;
      this.currentCasoId = null;
      this.pagination.page = 1;
      this.selectedItem = null;
      this.loadDocuments();
    },

    selectCaso(caso) {
      this.navMode = 'caso';
      this.currentCasoId = caso.ID;
      this.currentCasoLabel = caso.TITULO;
      this.currentDirectorioId = null;
      this.currentDirectorio = null;
      this.pagination.page = 1;
      this.selectedItem = null;
      this.loadDocuments();
    },

    // ── Documents loading ─────────────────────────────────────
    async loadDocuments() {
      this.pagination.loading = true;
      const init = (this.pagination.page - 1) * this.pagination.perPage;
      try {
        if (this.navMode === 'reading') {
          const res = await UserProxy.getLectura();
          this.documents = Array.isArray(res) ? res : [];
          this.pagination.total = this.documents.length;
          return;
        }

        const params = {
          GLOBAL: this.filter.termino || '',
          TYPE: this.filter.type || '',
          ROWS: this.pagination.perPage,
          INIT: init,
          SHARED: this.navMode === 'shared' ? 'C' : this.navMode === 'all' ? (this.filter.shared || 'T') : 'T',
        };

        if (this.navMode === 'starred') params.STARRED = 1;
        if (this.navMode === 'directorio' && this.currentDirectorioId) params.IDDIRECTORIO = this.currentDirectorioId;

        const res = await AdminEntriesProxy.searchFavorites(params);
        this.documents = Array.isArray(res) ? res : [];
        this.pagination.total = this.documents[0]?.TOTALROWS ?? 0;
      } catch (e) {
        toast.error('Error al cargar documentos');
        this.documents = [];
      } finally {
        this.pagination.loading = false;
      }
    },

    async loadDirectorios() {
      try {
        const res = await UserProxy.listDirectoryAll();
        this.directoriosRaw = Array.isArray(res) ? res : [];
      } catch { /* silencioso */ }
    },

    async loadCasos() {
      try {
        const res = await UserProxy.getCasos('');
        this.casos = Array.isArray(res) ? res : [];
      } catch { /* silencioso */ }
    },

    // ── Item selection ─────────────────────────────────────────
    selectItem(doc) {
      this.selectedItem = doc;
      this.panelTab = 'details';
      this.panelNotes = doc.NOTAS || '';
      this.tagInput = '';
      this.comentarios = [];
    },

    switchPanelTab(tab) {
      this.panelTab = tab;
      if (tab === 'comentarios' && this.selectedItem) this.loadComentarios();
    },

    // ── Star ───────────────────────────────────────────────────
    async toggleStar(doc) {
      try {
        await UserProxy.toggleStarred(doc.ID);
        const newVal = doc.STARRED == 1 ? 0 : 1;
        doc.STARRED = newVal;
        if (this.selectedItem && this.selectedItem.ID === doc.ID) this.selectedItem.STARRED = newVal;
        toast.success(newVal ? 'Marcado como destacado' : 'Quitado de destacados');
      } catch {
        toast.error('Error al actualizar destacado');
      }
    },

    // ── Kanban ─────────────────────────────────────────────────
    kanbanDocs(colId) {
      return this.documents.filter(d => (d.KANBAN_COL || 'REVISAR') === colId);
    },

    prevKanbanCol(colId) {
      const idx = this.kanbanCols.findIndex(c => c.id === colId);
      return idx > 0 ? this.kanbanCols[idx - 1].id : colId;
    },

    nextKanbanCol(colId) {
      const idx = this.kanbanCols.findIndex(c => c.id === colId);
      return idx < this.kanbanCols.length - 1 ? this.kanbanCols[idx + 1].id : colId;
    },

    async moveKanban(doc, col) {
      if ((doc.KANBAN_COL || 'REVISAR') === col) return;
      this.kanbanLoading = true;
      if (this.selectedItem?.ID === doc.ID) this.selectedItem._kanbanTarget = col;
      try {
        const res = await UserProxy.moveKanban(doc.ID, col);
        if (res?.STATUS === false) {
          toast.error(res.MESSAGE || 'Sin permisos para cambiar el estado');
          return;
        }
        doc.KANBAN_COL = col;
        if (this.selectedItem && this.selectedItem.ID === doc.ID) {
          this.selectedItem.KANBAN_COL = col;
          this.selectedItem._kanbanTarget = null;
        }
        toast.success('Movido a ' + (this.kanbanCols.find(c => c.id === col)?.label || col));
      } catch {
        toast.error('Error al mover en kanban');
      } finally {
        this.kanbanLoading = false;
      }
    },

    // ── Descargas ──────────────────────────────────────────────
    async downloadFavFile(path, titulo, sufijo) {
      await AdminEntriesProxy.downloadFile({ PATH: path || '' })
        .then(r => {
          const u = URL.createObjectURL(new Blob([r]));
          const a = document.createElement('a');
          a.href = u;
          const ext = (path || '').split('.').pop();
          a.setAttribute('download', `${titulo || 'documento'} - ${sufijo}.${ext}`);
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
          URL.revokeObjectURL(u);
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-download' }));
    },

    // ── Notes ──────────────────────────────────────────────────
    async saveNotes() {
      if (!this.selectedItem) return;
      this.savingNotes = true;
      try {
        await UserProxy.updateFavorite({ ID: this.selectedItem.ID, NOTAS: this.panelNotes });
        this.selectedItem.NOTAS = this.panelNotes;
        const idx = this.documents.findIndex(d => d.ID === this.selectedItem.ID);
        if (idx !== -1) this.documents[idx].NOTAS = this.panelNotes;
        toast.success('Notas guardadas');
      } catch {
        toast.error('Error al guardar notas');
      } finally {
        this.savingNotes = false;
      }
    },

    // ── Tags ───────────────────────────────────────────────────
    parsedTags(etiquetasStr) {
      if (!etiquetasStr) return [];
      try { return JSON.parse(etiquetasStr); } catch { return etiquetasStr.split(',').map(s => s.trim()).filter(Boolean); }
    },

    async addTag() {
      const tag = this.tagInput.replace(',', '').trim();
      if (!tag || !this.selectedItem) return;
      const current = this.parsedTags(this.selectedItem.ETIQUETAS);
      if (current.includes(tag)) { this.tagInput = ''; return; }
      const updated = [...current, tag];
      try {
        await UserProxy.updateFavorite({ ID: this.selectedItem.ID, ETIQUETAS: JSON.stringify(updated) });
        this.selectedItem.ETIQUETAS = JSON.stringify(updated);
        this.tagInput = '';
      } catch {
        toast.error('Error al guardar etiqueta');
      }
    },

    // ── Comments ───────────────────────────────────────────────
    async loadComentarios() {
      if (!this.selectedItem) return;
      this.loadingComentarios = true;
      try {
        const res = await UserProxy.getComentariosFav(this.selectedItem.ID);
        this.comentarios = Array.isArray(res) ? res : [];
      } catch {
        this.comentarios = [];
      } finally {
        this.loadingComentarios = false;
      }
    },

    async submitComment() {
      const text = this.newComment.trim();
      if (!text || !this.selectedItem) return;
      try {
        await UserProxy.addComentarioFav({ IDFAV: this.selectedItem.ID, COMENTARIO: text });
        this.newComment = '';
        await this.loadComentarios();
        toast.success('Comentario añadido');
      } catch {
        toast.error('Error al enviar comentario');
      }
    },

    async deleteComentario(id) {
      try {
        await UserProxy.deleteComentarioFav(id);
        this.comentarios = this.comentarios.filter(c => c.ID !== id);
      } catch {
        toast.error('Error al eliminar comentario');
      }
    },

    // ── Directories CRUD ───────────────────────────────────────
    createDirectory(parentId) {
      this.newDirName = '';
      this.newDirParentId = parentId || null;
      this.showCreateDirModal = true;
    },

    async submitCreateDir() {
      if (!this.newDirName.trim()) { toast.error('Ingresa un nombre'); return; }
      this.loadingDir = true;
      try {
        await UserProxy.createDirectory({ DSCRPCN: this.newDirName.trim(), IDPARENT: this.newDirParentId, CDESTDO: 'A' });
        toast.success('Carpeta creada');
        this.showCreateDirModal = false;
        await this.loadDirectorios();
      } catch {
        toast.error('Error al crear carpeta');
      } finally {
        this.loadingDir = false;
      }
    },

    dirContextMenu(dir, e) {
      e.preventDefault();
      this.ctxDir = dir;
      this.showCtxDirModal = true;
    },

    startRename() {
      this.showCtxDirModal = false;
      this.renameValue = this.ctxDir.DSCRPCN;
      this.showRenameModal = true;
    },

    async submitRename() {
      if (!this.renameValue.trim()) return;
      this.loadingDir = true;
      try {
        await UserProxy.updateDirectory({ ID: this.ctxDir.ID, DSCRPCN: this.renameValue.trim() });
        toast.success('Carpeta renombrada');
        this.showRenameModal = false;
        await this.loadDirectorios();
      } catch {
        toast.error('Error al renombrar');
      } finally {
        this.loadingDir = false;
      }
    },

    confirmDeleteDir() {
      this.showCtxDirModal = false;
      this.showDeleteDirModal = true;
    },

    async submitDeleteDir() {
      this.loadingDir = true;
      try {
        await UserProxy.deleteDirectory(JSON.stringify([this.ctxDir.ID]));
        toast.success('Carpeta eliminada');
        this.showDeleteDirModal = false;
        if (this.currentDirectorioId === this.ctxDir.ID) this.setNav('all');
        await this.loadDirectorios();
      } catch {
        toast.error('Error al eliminar la carpeta');
      } finally {
        this.loadingDir = false;
      }
    },

    // ── Casos ──────────────────────────────────────────────────
    createCaso() {
      this.newCasoTitulo = '';
      this.showCreateCasoModal = true;
    },

    async submitCreateCaso() {
      if (!this.newCasoTitulo.trim()) { toast.error('Ingresa un nombre'); return; }
      try {
        await UserProxy.addCaso({ TITULO: this.newCasoTitulo.trim() });
        toast.success('Caso creado');
        this.showCreateCasoModal = false;
        await this.loadCasos();
      } catch {
        toast.error('Error al crear caso');
      }
    },

    // ── Delete favorite ────────────────────────────────────────
    deleteFavoriteItem(item) {
      this.deleteTargetItem = item;
      this.showDeleteFavModal = true;
    },

    async submitDeleteFav() {
      this.loadingDir = true;
      try {
        await UserProxy.deleteFavorite(this.deleteTargetItem.ID);
        toast.success('Eliminado de favoritos');
        this.documents = this.documents.filter(d => d.ID !== this.deleteTargetItem.ID);
        this.pagination.total = Math.max(0, this.pagination.total - 1);
        if (this.selectedItem?.ID === this.deleteTargetItem.ID) this.selectedItem = null;
        this.showDeleteFavModal = false;
      } catch {
        toast.error('Error al eliminar');
      } finally {
        this.loadingDir = false;
      }
    },

    // ── Modals ─────────────────────────────────────────────────
    openViewModal(item) {
      this.loadingViewId = item.ID;
      const parseJson = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; }
        catch { return []; }
      };

      console.log(item)
      this.rowData = {
        ...item,
        DELITO:          parseJson(item.DELITO),
        OJURISDICCIONAL: parseJson(item.OJURISDICCIONAL),
        RECURSO:         parseJson(item.RECURSO),
        TPONRMA:         parseJson(item.TPONRMA),
        OEMISOR:         parseJson(item.OEMISOR),
      };
      this.openModal = true;
    },

    toggleDirOpen(id) {
      this.openDirs = { ...this.openDirs, [id]: !this.openDirs[id] };
    },
    isDirOpen(id) {
      return !!this.openDirs[id];
    },

    openShareModal(item) {
      this.rowDataCompartir = item;
      this.openModalCompartir = true;
    },

    openShareUsersModal(item) {
      this.rowDataUsuariosCompartidos = item;
      this.openModalUsuariosCompartidos = true;
    },

    async updateSharedActions(item) {
      const dirsRes = await UserProxy.listDirectoryAll();
      const dirs = Array.isArray(dirsRes) ? dirsRes.filter(d => d.ID) : [];
      const cur = dirs.find(d => d.ID == item.IDDIRECTORIO);
      this.updateModalItem = item;
      this.updateModalAllDirs = dirs;
      this.updateModalFilteredDirs = dirs;
      this.updateModalSelectedDir = item.IDDIRECTORIO || null;
      this.updateModalDirSearch = cur ? cur.DSCRPCN : '';
      this.updateModalTitleAlt = item.TITLEALT || '';
      this.showDirDropdown = false;
      this.showUpdateModal = true;
    },

    filterUpdateDirs() {
      const q = (this.updateModalDirSearch || '').toLowerCase();
      this.updateModalFilteredDirs = this.updateModalAllDirs.filter(d =>
        d.DSCRPCN?.toLowerCase().includes(q)
      );
      this.showDirDropdown = true;
    },

    selectUpdateDir(d) {
      this.updateModalSelectedDir = d.ID;
      this.updateModalDirSearch = d.DSCRPCN;
      this.showDirDropdown = false;
    },

    async submitUpdate() {
      this.updatingDoc = true;
      try {
        await UserProxy.saveAddDirectory({
          IDDIRECTORIO: this.updateModalSelectedDir || 0,
          IDENTRIE: this.updateModalItem.IDENTRIE,
          TITLEALT: this.updateModalTitleAlt,
          IDFAV: this.updateModalItem.ID,
        });
        toast.success('Actualizado');
        this.showUpdateModal = false;
        await this.loadDocuments();
        // Refrescar el panel de detalle si está abierto
        if (this.selectedItem) {
          const updated = this.documents.find(d => d.ID === this.selectedItem.ID);
          if (updated) this.selectedItem = updated;
        }
      } catch {
        toast.error('Error al actualizar');
      } finally {
        this.updatingDoc = false;
      }
    },

    // ── Pagination ─────────────────────────────────────────────
    changePage(p) {
      this.pagination.page = p;
      this.loadDocuments();
    },

    // ── Helpers ────────────────────────────────────────────────
    formatDate(d) {
      if (!d) return '-';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
    },
    formatDateTime(d) {
      if (!d) return '-';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      const date = `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
      const time = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
      return `${date} ${time}`;
    },

    truncate(str, len) {
      if (!str) return '';
      return str.length > len ? str.slice(0, len) + '…' : str;
    },

    docTypeIcon(type) {
      const t = (type || '').toLowerCase();
      if (t.includes('juris'))  return '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>';
      if (t.includes('resol'))  return '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>';
      if (t.includes('decret')) return '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>';
      return '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>';
    },

    docTypeColor(type) {
      const t = (type || '').toLowerCase();
      if (t.includes('juris'))  return '#2563EB';
      if (t.includes('resol'))  return '#7C3AED';
      if (t.includes('decret')) return '#059669';
      return '#6B7280';
    },
  },

  watch: {
    openModal(val) {
      if (!val) this.loadingViewId = null;
    },
  },

  mounted() {
    this.loadDocuments();
    this.loadDirectorios();
    this.loadCasos();
  },
};
</script>

<style scoped>
/* ── Layout shell ──────────────────────────────────────── */
.fav-shell {
  display: flex;
  min-height: 100vh;
  background: #F8FAFC;
  position: relative;
}

/* ── Sidebar ───────────────────────────────────────────── */
.fav-sidebar {
  width: 240px;
  min-width: 240px;
  background: white;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 16px 14px 12px;
  border-bottom: 1px solid #F1F5F9;
}

.sidebar-brand-icon {
  width: 30px; height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #185CE6, #4F7BF7);
  color: white;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.sidebar-brand-title {
  font-weight: 700;
  font-size: 14px;
  color: #111827;
  flex: 1;
}

.sidebar-doc-count {
  font-size: 11px;
  background: #EFF6FF;
  color: #185CE6;
  padding: 2px 7px;
  border-radius: 20px;
  font-weight: 600;
}

.sidebar-nav { padding: 8px 8px 0; display: flex; flex-direction: column; gap: 2px; }

.sidebar-nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 7px 10px;
  border-radius: 8px;
  border: none;
  background: none;
  color: #6B7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background .15s, color .15s;
  width: 100%;
}

.sidebar-nav-item:hover { background: #F9FAFB; color: #374151; }
.sidebar-nav-item.active { background: #EFF6FF; color: #185CE6; font-weight: 600; }
.nav-icon { width: 16px; height: 16px; display: flex; flex-shrink: 0; }
.nav-icon svg { width: 14px; height: 14px; }

.sidebar-section { padding: 10px 8px 0; }

.sidebar-section-hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 6px 6px;
}

.sidebar-section-hdr span {
  font-size: 10px;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: .08em;
}

.sidebar-add-btn {
  width: 20px; height: 20px; border-radius: 4px; border: none;
  background: none; color: #9CA3AF; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s;
}
.sidebar-add-btn:hover { background: #F3F4F6; color: #374151; }


.folder-tree { display: flex; flex-direction: column; gap: 1px; }

.folder-item {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 6px 5px 8px;
  border-radius: 7px;
  cursor: pointer;
  color: #374151;
  font-size: 12.5px;
  transition: background .15s;
  position: relative;
}
.folder-item:hover { background: #F9FAFB; }
.folder-item.active { background: #EFF6FF; color: #185CE6; }
.folder-item.sub { padding-left: 22px; }

.folder-expand-btn {
  width: 14px; height: 14px; border: none; background: none;
  color: #9CA3AF; cursor: pointer; padding: 0; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.folder-expand-spacer { width: 14px; flex-shrink: 0; }

.folder-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}

.folder-icon-svg { color: #9CA3AF; flex-shrink: 0; }
.folder-item.active .folder-icon-svg { color: #185CE6; }

.folder-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.folder-more-btn {
  width: 18px; height: 18px; border: none; background: none;
  color: #9CA3AF; cursor: pointer; padding: 0;
  display: none; align-items: center; justify-content: center; border-radius: 4px;
}
.folder-item:hover .folder-more-btn { display: flex; }
.folder-more-btn:hover { background: #E5E7EB; color: #374151; }

.sidebar-empty-hint {
  font-size: 12px; color: #9CA3AF; padding: 6px 8px; font-style: italic;
}

.sidebar-caso-item {
  display: flex; align-items: center; gap: 7px;
  padding: 5px 8px;
  border-radius: 7px;
  cursor: pointer;
  color: #374151;
  font-size: 12.5px;
  transition: background .15s;
}
.sidebar-caso-item:hover { background: #F9FAFB; }
.sidebar-caso-item.active { background: #EFF6FF; color: #185CE6; }
.caso-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.caso-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.sidebar-footer { margin-top: auto; padding: 8px; border-top: 1px solid #F1F5F9; }

/* ── Context menu modal buttons ──────────────────────── */
.ctx-menu-btn {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 10px 14px;
  border: 1px solid #E5E7EB; border-radius: 10px;
  background: white; cursor: pointer;
  font-size: 13.5px; color: #374151; text-align: left;
  transition: all .12s;
}
.ctx-menu-btn:hover { background: #F9FAFB; border-color: #D1D5DB; }
.ctx-menu-btn--danger { border-color: #FEE2E2; background: #FFF5F5; color: #DC2626; }
.ctx-menu-btn--danger:hover { background: #FEE2E2; border-color: #FECACA; }

/* ── Main ─────────────────────────────────────────────── */
.fav-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all .3s;
  min-width: 0;
}

.fav-main.panel-open { margin-right: 380px; }

.fav-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  flex-shrink: 0;
}

.fav-breadcrumb { display: flex; align-items: center; gap: 6px; }

.bc-current {
  display: flex; align-items: center; gap: 5px;
  font-size: 13px; color: #374151; font-weight: 600;
}

.dir-filter-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px 3px 6px;
  background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 20px; cursor: pointer;
  font-size: 13px; font-weight: 600; color: #1d4ed8;
  transition: background .15s, border-color .15s;
}
.dir-filter-chip:hover { background: #dbeafe; border-color: #93c5fd; }
.dir-filter-chip .folder-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.topbar-right { display: flex; align-items: center; gap: 10px; }

.view-switcher {
  display: flex; align-items: center;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 2px;
  gap: 1px;
}

.view-btn {
  width: 30px; height: 28px; border: none; background: none;
  border-radius: 6px; color: #6B7280; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
.view-btn:hover { background: white; color: #374151; }
.view-btn.active { background: white; color: #185CE6; box-shadow: 0 1px 3px rgba(0,0,0,.1); }


/* ── Filter bar ───────────────────────────────────────── */
.fav-filterbar {
  display: flex; flex-direction: column; gap: 6px;
  padding: 10px 20px;
  background: #FAFAFA;
  border-bottom: 1px solid #F1F5F9;
  flex-shrink: 0;
}

.filterbar-controls {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}

.result-count { font-size: 12px; color: #9CA3AF; }

/* ── Loading / Empty ──────────────────────────────────── */
.fav-loading, .fav-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; padding: 60px 20px; color: #9CA3AF; text-align: center;
}
.fav-loading { flex-direction: row; gap: 10px; }
.loading-spinner {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2.5px solid #E5E7EB; border-top-color: #185CE6;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.fav-empty p { font-size: 15px; font-weight: 600; color: #6B7280; margin: 0; }
.fav-empty small { font-size: 13px; }

/* ── List view ────────────────────────────────────────── */
.fav-list-view { flex: 1; overflow-y: auto; padding: 0 20px 16px; }

.list-header {
  display: grid;
  grid-template-columns: 36px 1fr 190px 110px 90px;
  gap: 0;
  padding: 10px 12px;
  font-size: 10.5px; font-weight: 700; color: #9CA3AF;
  letter-spacing: .07em; text-transform: uppercase;
  background: #F8FAFC;
  border-bottom: 2px solid #E8ECF0;
  position: sticky; top: 0; z-index: 1;
}
.lh-title { grid-column: 2; }
.lh-autor { grid-column: 3; }
.lh-fecha { grid-column: 4; }
.lh-acciones { grid-column: 5; text-align: right; }

.list-row {
  display: grid;
  grid-template-columns: 36px 1fr 190px 110px 90px;
  gap: 0;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  transition: background .12s;
  border-bottom: 1px solid #E8ECF0;
  min-height: 56px;
}
.list-row:last-child { border-bottom: none; }
.list-row:hover { background: #F5F7FA; }
.list-row.selected { background: #EBF3FF; border-left: 3px solid #185CE6; padding-left: 9px; }


.doc-type-wrap { position: relative; flex-shrink: 0; }
.doc-type-badge {
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
}
.shared-dot {
  position: absolute; bottom: -2px; right: -2px;
  width: 9px; height: 9px; border-radius: 50%;
  background: #F59E0B; border: 1.5px solid white;
}

.row-title-col { display: flex; flex-direction: column; gap: 1px; min-width: 0; padding: 0 8px; }
.row-titlealt { font-size: 11px; color: #9CA3AF; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-titulo { font-size: 13px; font-weight: 600; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-dir-tag {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 10.5px; color: #9CA3AF;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  max-width: 100%;
}

.row-autor-col { display: flex; align-items: center; gap: 6px; min-width: 0; padding: 0 4px; }
.autor-avatar { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.autor-name { font-size: 12px; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.shared-icon {
  flex-shrink: 0; color: #185CE6; opacity: 0.75;
}

.row-date-col { font-size: 12px; color: #9CA3AF; }

.row-actions-col {
  display: grid;
  grid-template-columns: 26px 26px;
  grid-template-rows: 26px 26px;
  gap: 2px;
  justify-content: end;
}

.row-action-btn {
  width: 26px; height: 26px; border: none; border-radius: 5px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .12s; background: #F3F4F6; color: #9CA3AF;
}
.row-action-btn:hover { transform: scale(1.1); }
.row-action-btn.blue:hover { background: #EFF6FF; color: #185CE6; }
.row-action-btn.green:hover { background: #ECFDF5; color: #059669; }
.row-action-btn.amber:hover { background: #FFFBEB; color: #D97706; }
.row-action-btn.red:hover { background: #FEF2F2; color: #DC2626; }

/* ── Grid view ────────────────────────────────────────── */
.fav-grid-view {
  flex: 1; overflow-y: auto; padding: 16px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  align-content: start;
}

.grid-card {
  background: white; border-radius: 16px;
  border: 1.5px solid #E8ECF0;
  overflow: hidden; cursor: pointer;
  transition: all .18s; position: relative;
  display: flex; flex-direction: column;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.grid-card:hover {
  border-color: #185CE6;
  box-shadow: 0 6px 20px rgba(24,92,230,.12);
  transform: translateY(-3px);
}
.grid-card.selected {
  border-color: #185CE6;
  box-shadow: 0 4px 16px rgba(24,92,230,.15);
}

/* Parte azul — TITULO */
.card-top {
  background: linear-gradient(135deg, #1a6aff 0%, #0047cc 100%);
  padding: 14px 14px 16px;
  position: relative;
  flex-shrink: 0;
}
.card-star-btn {
  position: absolute; top: 10px; right: 10px;
  border: none; background: none; cursor: pointer;
  color: rgba(255,255,255,.5); padding: 2px;
  transition: color .15s;
}
.card-star-btn:hover, .card-star-btn.starred { color: #F59E0B; }
.card-titulo {
  font-size: 13px; font-weight: 700; color: #fff; margin: 0;
  line-height: 1.45; padding-right: 20px;
  display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
}

/* Parte blanca — info + meta */
.card-bottom { display: flex; flex-direction: column; flex: 1; }
.card-bottom-info { padding: 12px 14px 8px; flex: 1; }
.card-titlealt {
  font-size: 11.5px; font-weight: 600; color: #374151;
  margin: 0 0 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.card-dir-row {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: #9CA3AF;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;
}
.card-footer {
  padding: 8px 14px 10px;
  border-top: 1px solid #F1F5F9;
  display: flex; align-items: center; justify-content: space-between; gap: 6px;
}
.card-autor { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6B7280; min-width: 0; }
.card-avatar { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.card-date { font-size: 11px; color: #9CA3AF; white-space: nowrap; flex-shrink: 0; }

.card-actions-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(255,255,255,.97);
  backdrop-filter: blur(6px);
  border-top: 1px solid #E8ECF0;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px;
  transform: translateY(100%);
  transition: transform .18s cubic-bezier(.4,0,.2,1);
}
.grid-card:hover .card-actions-overlay { transform: translateY(0); }

.card-action-btn {
  width: 32px; height: 32px; border: 1px solid #E5E7EB;
  background: white; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #6B7280; transition: all .12s;
}
.card-action-btn:hover { border-color: #185CE6; color: #185CE6; background: #EFF6FF; }
.card-action-btn.danger:hover { border-color: #DC2626; color: #DC2626; background: #FEF2F2; }

/* ── Kanban view ──────────────────────────────────────── */
.fav-kanban-view {
  display: flex; gap: 14px;
  flex: 1; overflow-x: auto; overflow-y: hidden;
  padding: 16px 20px;
  align-items: flex-start;
}

.kanban-col {
  min-width: 240px; width: 240px;
  background: #F8FAFC;
  border-radius: 12px;
  display: flex; flex-direction: column;
  max-height: calc(100vh - 200px);
  flex-shrink: 0;
}

.kanban-col-hdr {
  padding: 12px 14px;
  border-top: 3px solid;
  border-radius: 12px 12px 0 0;
  display: flex; align-items: center; justify-content: space-between;
  background: white;
}
.kanban-col-title { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: #374151; }
.kanban-dot { width: 8px; height: 8px; border-radius: 50%; }
.kanban-count {
  font-size: 11px; font-weight: 600; color: #6B7280;
  background: #F3F4F6; padding: 1px 7px; border-radius: 20px;
}

.kanban-cards {
  flex: 1; overflow-y: auto; padding: 8px;
  display: flex; flex-direction: column; gap: 8px;
}

.kanban-empty {
  padding: 20px 10px; text-align: center; font-size: 12px; color: #D1D5DB;
}

.kanban-card {
  background: white; border-radius: 10px;
  border: 1.5px solid #F1F5F9;
  padding: 10px 12px;
  cursor: pointer;
  transition: all .12s;
}
.kanban-card:hover { border-color: #C7D7FE; box-shadow: 0 2px 8px rgba(24,92,230,.08); }

.kc-top { display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-bottom: 6px; }

.kc-star, .kc-view {
  width: 22px; height: 22px; border: none; background: none;
  cursor: pointer; color: #D1D5DB; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  transition: color .12s;
}
.kc-star:hover, .kc-star.starred { color: #F59E0B; }
.kc-view:hover { color: #185CE6; }

.kc-titulo { font-size: 12.5px; font-weight: 600; color: #111827; margin: 0 0 8px; line-height: 1.4; }

.kc-footer { display: flex; align-items: center; justify-content: space-between; }
.kc-avatar { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; }
.kc-date { font-size: 11px; color: #9CA3AF; }

.kc-move {
  display: flex; gap: 4px; justify-content: flex-end;
  margin-top: 8px; padding-top: 8px; border-top: 1px solid #F1F5F9;
}
.kc-move-btn {
  width: 22px; height: 22px; border: 1px solid #E5E7EB; border-radius: 5px;
  background: #F9FAFB; cursor: pointer; color: #9CA3AF;
  display: flex; align-items: center; justify-content: center;
  transition: all .12s;
}
.kc-move-btn:hover { border-color: #185CE6; color: #185CE6; background: #EFF6FF; }

/* ── Pagination ───────────────────────────────────────── */
.fav-pagination {
  display: flex; align-items: center; gap: 4px; justify-content: center;
  padding: 14px 20px;
  border-top: 1px solid #F1F5F9;
  background: white;
  flex-shrink: 0;
}

.pg-btn {
  min-width: 32px; height: 32px; padding: 0 6px;
  border: 1.5px solid #E5E7EB; border-radius: 7px;
  background: white; font-size: 13px; color: #374151; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .12s;
}
.pg-btn:hover:not(:disabled):not(.dots) { border-color: #185CE6; color: #185CE6; }
.pg-btn.active { background: #185CE6; border-color: #185CE6; color: white; font-weight: 700; }
.pg-btn:disabled { opacity: .4; cursor: not-allowed; }
.pg-btn.dots { border: none; cursor: default; }
.pg-info { font-size: 12px; color: #9CA3AF; margin-left: 8px; }

/* ── Detail Panel ─────────────────────────────────────── */
.fav-detail-panel {
  position: fixed; right: 0; top: 0; bottom: 0; width: 380px;
  background: white;
  border-left: 1px solid #E5E7EB;
  box-shadow: -6px 0 32px rgba(0,0,0,.10);
  display: flex; flex-direction: column;
  z-index: 50;
  overflow: hidden;
}
.panel-accent-strip { height: 3px; flex-shrink: 0; }

.panel-hdr {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 14px 16px 12px;
  border-bottom: 1px solid #F1F5F9;
  flex-shrink: 0;
}
.panel-type-badge-lg {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.panel-hdr-info { flex: 1; min-width: 0; }
.panel-titlealt { font-size: 10.5px; color: #9CA3AF; margin: 0 0 2px; }
.panel-titulo { font-size: 13px; font-weight: 700; color: #111827; margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.panel-close-btn {
  width: 26px; height: 26px; border: none; background: #F3F4F6;
  border-radius: 6px; cursor: pointer; color: #9CA3AF; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all .12s; margin-top: 2px;
}
.panel-close-btn:hover { background: #E5E7EB; color: #374151; }

.panel-quick-actions {
  display: flex; align-items: center; gap: 4px;
  padding: 9px 14px; border-bottom: 1px solid #F1F5F9;
  flex-shrink: 0; flex-wrap: wrap;
}
.pqa-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 9px; border: 1.5px solid #E5E7EB;
  border-radius: 8px; background: white; font-size: 11.5px; color: #374151;
  cursor: pointer; transition: all .12s;
}
.pqa-btn:hover { background: #F0F4FF; border-color: #185CE6; color: #185CE6; }
.pqa-btn.active { border-color: #F59E0B; color: #F59E0B; background: #FFFBEB; }
.pqa-btn.danger:hover { border-color: #DC2626; color: #DC2626; background: #FEF2F2; }

.panel-tabs {
  display: flex; align-items: center;
  border-bottom: 1px solid #F1F5F9; flex-shrink: 0;
}
.panel-tab {
  flex: 1; padding: 9px 8px; border: none; background: none;
  font-size: 12.5px; font-weight: 500; color: #9CA3AF; cursor: pointer;
  border-bottom: 2px solid transparent; transition: all .15s;
}
.panel-tab:hover { color: #374151; }
.panel-tab.active { color: #185CE6; border-bottom-color: #185CE6; font-weight: 700; }

.panel-content { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 14px; }

.detail-field { display: flex; flex-direction: column; gap: 6px; }
.df-label {
  display: flex; align-items: center; gap: 4px;
  font-size: 10.5px; font-weight: 700; color: #9CA3AF;
  text-transform: uppercase; letter-spacing: .07em;
}
.df-val { font-size: 13px; color: #374151; }
.df-hint { font-size: 11px; color: #9CA3AF; font-style: italic; }

/* Propietario row */
.df-owner-row { display: flex; align-items: center; gap: 10px; }
.detail-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 2px solid #F3F4F6; }
.df-owner-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.df-owner-name { font-size: 13px; font-weight: 600; color: #111827; }
.df-owner-email { font-size: 11px; color: #6B7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.detail-shared-tag {
  font-size: 10px; padding: 2px 7px; border-radius: 20px;
  background: #EFF6FF; color: #185CE6; font-weight: 600; flex-shrink: 0;
}

.detail-dir-btn {
  display: inline-flex; align-items: center; gap: 5px;
  border: 1.5px dashed #D1D5DB; border-radius: 8px;
  padding: 6px 10px; background: #F9FAFB; font-size: 12px; color: #6B7280;
  cursor: pointer; transition: all .12s; width: 100%;
}
.detail-dir-btn:hover { border-color: #185CE6; color: #185CE6; background: #F0F4FF; }

/* Kanban pills */
.kanban-select-row { display: flex; gap: 5px; flex-wrap: wrap; }
.kanban-col-pill {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 11px; border: 1.5px solid #E5E7EB;
  border-radius: 20px; font-size: 11.5px; font-weight: 600;
  color: #6B7280; background: white; cursor: pointer; transition: all .15s;
}
.kanban-col-pill:hover:not(:disabled) { border-color: var(--col-color); color: var(--col-color); background: color-mix(in srgb, var(--col-color) 8%, white); }
.kanban-col-pill.active { border-color: var(--col-color); color: white; background: var(--col-color); }
.kanban-col-pill:disabled { opacity: 0.45; cursor: not-allowed; }
.pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.kanban-col-pill.active .pill-dot { background: rgba(255,255,255,0.7) !important; }
.pill-spinner {
  width: 10px; height: 10px; border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white; border-radius: 50%;
  animation: spin .6s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.tags-row { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
.tag-chip {
  padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500;
  background: #EFF6FF; color: #185CE6;
}
.tag-input {
  border: 1.5px dashed #E5E7EB; border-radius: 20px;
  padding: 3px 10px; font-size: 11px; color: #374151;
  outline: none; min-width: 100px; background: none;
  transition: border-color .12s;
}
.tag-input:focus,
.tag-input:focus-visible { border-color: #4B5563; outline: none; box-shadow: 0 0 0 3px rgba(75,85,99,0.12); }

/* Notes tab */
.notes-textarea {
  flex: 1; min-height: 200px; resize: none;
  border: 1.5px solid #E5E7EB; border-radius: 10px;
  padding: 12px; font-size: 13px; color: #374151;
  font-family: inherit; outline: none; line-height: 1.6;
  transition: border-color .15s;
}
.notes-textarea:focus,
.notes-textarea:focus-visible { border-color: #4B5563; outline: none; box-shadow: 0 0 0 3px rgba(75,85,99,0.12); }

/* Comments tab */
.comments-loading, .comments-empty {
  text-align: center; padding: 20px; font-size: 13px; color: #9CA3AF;
}
.comments-list { display: flex; flex-direction: column; gap: 12px; padding-bottom: 4px; }

/* ── Chat rows ── */
.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.chat-mine  { flex-direction: row-reverse; }
.chat-other { flex-direction: row; }

.comment-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }

.chat-bubble-wrap {
  display: flex;
  flex-direction: column;
  max-width: 78%;
  gap: 2px;
  position: relative;
}
.chat-mine .chat-bubble-wrap { align-items: flex-end; }
.chat-other .chat-bubble-wrap { align-items: flex-start; }

.chat-name { font-size: 10.5px; font-weight: 600; color: #6B7280; padding: 0 4px; }

.chat-bubble {
  padding: 8px 11px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.45;
  position: relative;
  word-break: break-word;
}
.chat-other .chat-bubble {
  background: #F1F5F9;
  color: #1E293B;
  border-bottom-left-radius: 4px;
}
.chat-mine .chat-bubble {
  background: #185CE6;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.comment-text { margin: 0; }

.chat-time {
  font-size: 10px;
  margin-top: 3px;
  opacity: 0.65;
  text-align: right;
}

.chat-del-btn {
  width: 18px; height: 18px; border: none; background: none;
  cursor: pointer; color: rgba(255,255,255,0.55);
  border-radius: 4px; align-self: flex-end; margin-bottom: 2px;
  display: flex; align-items: center; justify-content: center;
  transition: all .12s; flex-shrink: 0;
}
.chat-del-btn:hover { color: #fff; background: rgba(255,255,255,0.15); }

.comment-input-row {
  display: flex; gap: 8px; align-items: center;
  margin-top: auto; padding-top: 10px;
  border-top: 1px solid #F1F5F9;
}
.comment-input {
  flex: 1; border: 1.5px solid #E5E7EB; border-radius: 20px;
  padding: 7px 14px; font-size: 13px; outline: none;
  transition: border-color .15s;
}
.comment-input:focus,
.comment-input:focus-visible { border-color: #4B5563; outline: none; box-shadow: 0 0 0 3px rgba(75,85,99,0.12); }
.comment-send-btn {
  width: 34px; height: 34px; border: none; background: #185CE6;
  border-radius: 50%; cursor: pointer; color: white;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background .15s;
}
.comment-send-btn:hover { background: #1652cc; }
.comment-send-btn:disabled { opacity: .5; cursor: not-allowed; }

/* ── Transition ───────────────────────────────────────── */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform .25s cubic-bezier(.4,0,.2,1);
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}

/* Spinner micro para botón Ver mientras modal carga */
.btn-mini-spinner {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  animation: mini-spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes mini-spin { to { transform: rotate(360deg); } }

@keyframes mini-spin-end { to { transform: rotate(360deg); } }
</style>

<style>
/* ══════════════ FAVORITOS — DARK MODE ══════════════ */
.dark .fav-shell { background: #0f172a !important; }

.dark .fav-sidebar { background: #1e293b !important; border-right-color: #334155 !important; }
.dark .sidebar-brand { border-bottom-color: #334155 !important; }
.dark .sidebar-brand-title { color: #f1f5f9 !important; }
.dark .sidebar-section-hdr span { color: #64748b !important; }
.dark .sidebar-add-btn { color: #64748b !important; }
.dark .sidebar-add-btn:hover { background: #334155 !important; color: #e2e8f0 !important; }
.dark .sidebar-footer { border-top-color: #334155 !important; }
.dark .sidebar-empty-hint { color: #64748b !important; }

.dark .folder-item { color: #cbd5e1 !important; }
.dark .folder-item:hover { background: #334155 !important; }
.dark .folder-item.active { background: #1e3a5f !important; color: #60a5fa !important; }
.dark .folder-icon-svg { color: #64748b !important; }
.dark .folder-item.active .folder-icon-svg { color: #60a5fa !important; }
.dark .folder-expand-btn { color: #64748b !important; }
.dark .folder-more-btn { color: #64748b !important; }
.dark .folder-more-btn:hover { background: #475569 !important; color: #e2e8f0 !important; }

.dark .fav-topbar { background: #1e293b !important; border-bottom-color: #334155 !important; }
.dark .bc-current { color: #e2e8f0 !important; }
.dark .dir-filter-chip { background: #1e3a5f !important; border-color: #3b82f6 !important; color: #93c5fd !important; }
.dark .dir-filter-chip:hover { background: #1d4ed8 !important; border-color: #60a5fa !important; }

.dark .view-switcher { background: #334155 !important; border-color: #475569 !important; }
.dark .view-btn { color: #94a3b8 !important; }
.dark .view-btn:hover { background: #475569 !important; color: #e2e8f0 !important; }
.dark .view-btn.active { background: #475569 !important; color: #60a5fa !important; }

.dark .fav-filterbar { background: #172033 !important; border-bottom-color: #334155 !important; }
.dark .result-count { color: #64748b !important; }

.dark .list-header { background: #172033 !important; border-bottom-color: #334155 !important; color: #64748b !important; }
.dark .list-row { border-bottom-color: #334155 !important; }
.dark .list-row:hover { background: #1e293b !important; }
.dark .list-row.selected { background: #1e3a5f !important; border-left-color: #3b82f6 !important; }
.dark .row-titulo { color: #f1f5f9 !important; }
.dark .row-titlealt { color: #64748b !important; }
.dark .row-dir-tag { color: #64748b !important; }
.dark .autor-name { color: #cbd5e1 !important; }
.dark .row-date-col { color: #64748b !important; }
.dark .shared-dot { border-color: #1e293b !important; }

.dark .row-action-btn { background: #334155 !important; color: #94a3b8 !important; }
.dark .row-action-btn.blue:hover { background: #1e3a5f !important; color: #60a5fa !important; }
.dark .row-action-btn.red:hover { background: #3f1212 !important; color: #f87171 !important; }
.dark .row-action-btn.amber:hover { background: #451a03 !important; color: #fbbf24 !important; }
.dark .row-action-btn.green:hover { background: #064e3b !important; color: #34d399 !important; }

.dark .loading-spinner { border-color: #334155 !important; border-top-color: #3b82f6 !important; }
.dark .fav-empty p { color: #94a3b8 !important; }

.dark .fav-pagination { background: #1e293b !important; border-top-color: #334155 !important; }
.dark .pg-btn { background: #1e293b !important; border-color: #475569 !important; color: #cbd5e1 !important; }
.dark .pg-btn:hover:not(:disabled):not(.dots) { border-color: #60a5fa !important; color: #60a5fa !important; }
.dark .pg-btn.active { background: #185CE6 !important; border-color: #185CE6 !important; color: white !important; }

.dark .grid-card { background: #1e293b !important; border-color: #334155 !important; }
.dark .grid-card:hover { border-color: #3b82f6 !important; }
.dark .card-titlealt { color: #94a3b8 !important; }
.dark .card-footer { border-top-color: #334155 !important; }
.dark .card-autor { color: #94a3b8 !important; }
.dark .card-actions-overlay { background: rgba(30,41,59,0.97) !important; border-top-color: #334155 !important; }
.dark .card-action-btn { background: #1e293b !important; border-color: #475569 !important; color: #94a3b8 !important; }

.dark .fav-detail-panel { background: #1e293b !important; border-left-color: #334155 !important; }
.dark .panel-hdr { border-bottom-color: #334155 !important; }
.dark .panel-titulo { color: #f1f5f9 !important; }
.dark .panel-titlealt { color: #64748b !important; }
.dark .panel-close-btn { background: #334155 !important; color: #94a3b8 !important; }
.dark .panel-close-btn:hover { background: #475569 !important; color: #e2e8f0 !important; }
.dark .panel-quick-actions { border-bottom-color: #334155 !important; }
.dark .pqa-btn { background: #1e293b !important; border-color: #475569 !important; color: #cbd5e1 !important; }
.dark .panel-tabs { border-bottom-color: #334155 !important; }
.dark .panel-tab { color: #64748b !important; }
.dark .panel-tab:hover { color: #e2e8f0 !important; }
.dark .panel-tab.active { color: #60a5fa !important; border-bottom-color: #60a5fa !important; }
.dark .df-val { color: #cbd5e1 !important; }
.dark .df-owner-name { color: #f1f5f9 !important; }
.dark .notes-textarea { background: #0f172a !important; border-color: #475569 !important; color: #e2e8f0 !important; }
.dark .comment-input { background: #0f172a !important; border-color: #475569 !important; color: #e2e8f0 !important; }
.dark .comment-input-row { border-top-color: #334155 !important; }
.dark .chat-other .chat-bubble { background: #334155 !important; color: #e2e8f0 !important; }
.dark .kanban-col { background: #172033 !important; }
.dark .kanban-col-hdr { background: #1e293b !important; }
.dark .kanban-col-title { color: #e2e8f0 !important; }
.dark .kanban-card { background: #1e293b !important; border-color: #334155 !important; }
.dark .kc-titulo { color: #f1f5f9 !important; }
</style>
