<template>
  <div class="fav-shell">

    <!-- ═══════════════ SIDEBAR ═══════════════ -->
    <aside class="fav-sidebar">
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
          <div class="folder-item" :class="{ active: currentCarpetaId === null && navMode === 'all' }" @click="clearCarpeta">
            <span class="folder-expand-spacer"></span>
            <span class="folder-dot" style="background:#94a3b8"></span>
            <svg class="folder-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            <span class="folder-label">Todas las carpetas</span>
          </div>
          <div v-if="filteredDirTree.length === 0" class="sidebar-empty-hint">{{ dirSearch ? 'Sin resultados' : 'Sin carpetas aún' }}</div>
          <template v-for="dir in filteredDirTree" :key="dir.ID">
            <div class="folder-item" :class="{ active: currentCarpetaId === dir.ID }" @click="selectCarpeta(dir)">
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
              <span v-if="dir.PROP === 0" class="folder-shared-badge" :title="`Compartida por ${dir.PROPIETARIO || 'otro usuario'}`">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </span>
              <button v-if="dir.PROP !== 0" class="folder-more-btn" @click.stop="dirContextMenu(dir, $event)" title="Opciones">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
              </button>
            </div>
            <template v-if="isDirOpen(dir.ID) && dir.children && dir.children.length">
              <div v-for="sub in dir.children" :key="sub.ID" class="folder-item sub" :class="{ active: currentCarpetaId === sub.ID }" @click="selectCarpeta(sub)">
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
    </aside>

    <!-- ═══════════════ MAIN ═══════════════ -->
    <div class="fav-main" :class="{ 'panel-open': !!selectedItem }">

      <div class="fav-topbar">
        <div class="fav-breadcrumb">
          <span v-if="navMode !== 'carpeta'" class="bc-current">{{ currentNavLabel }}</span>
          <button v-else class="dir-filter-chip" @click="clearCarpeta" title="Quitar filtro de carpeta">
            <span class="folder-dot" :style="{ background: currentCarpeta?.COLOR || '#185CE6' }"></span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
            <span>{{ currentCarpeta?.DSCRPCN }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;opacity:.6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="topbar-right">
          <button class="btn btn-secondary btn-sm inline-flex items-center gap-1.5" @click="$emit('volver')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Volver a explorar</span>
          </button>
          <new-button label="Nueva carpeta" @click="createDirectory(currentCarpetaId)"/>
        </div>
      </div>

      <div class="fav-filterbar">
        <div class="filterbar-controls">
          <search-bar
            placeholder="Buscar en mi espacio..."
            @search="q => { filter.termino = q; loadDocuments(); }"
            style="flex:1;min-width:200px;"
          />
          <app-select :model-value="navMode" @update:model-value="v => setNav(v)" style="min-width:150px;flex-shrink:0;">
            <option v-for="n in primaryNav" :key="n.id" :value="n.id">{{ n.label }}</option>
          </app-select>
          <search-button @click="loadDocuments"/>
        </div>
        <span class="result-count">{{ pagination.total }} resultado{{ pagination.total !== 1 ? 's' : '' }}</span>
      </div>

      <div v-if="pagination.loading" class="fav-loading">
        <div class="loading-spinner"></div>
        <span>Cargando artículos...</span>
      </div>

      <div v-else-if="documents.length === 0" class="fav-empty">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
        <p>No hay artículos guardados aquí</p>
        <small>Guarda artículos desde "Explorar publicaciones"</small>
      </div>

      <template v-else>
        <div class="fav-list-view">
          <div class="list-header">
            <span class="lh-title">Artículo</span>
            <span class="lh-autor">Propietario</span>
            <span class="lh-fecha">Guardado</span>
            <span class="lh-acciones">Acciones</span>
          </div>
          <div v-for="doc in documents" :key="doc.ID" class="list-row" :class="{ selected: selectedItem && selectedItem.ID === doc.ID }" @click="selectItem(doc)">
            <div class="doc-type-wrap">
              <div class="doc-type-badge" :class="{ 'has-image': doc.IMAGEN }" style="background:#EFF6FF;" @click.stop="doc.IMAGEN && previewImage(doc)">
                <img v-if="doc.IMAGEN" :src="`${resourcesUrl}${doc.IMAGEN}`" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:6px;"/>
                <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#185CE6" stroke-width="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                <span v-if="doc.IMAGEN" class="thumb-zoom-overlay">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
              </div>
              <span v-if="doc.PROP == 0" class="shared-dot" title="Compartido contigo"></span>
            </div>
            <div class="row-title-col">
              <span class="row-titlealt" v-if="doc.TITLEALT && doc.TITLEALT !== doc.TITULO">{{ doc.TITLEALT }}</span>
              <span class="row-titulo">{{ doc.TITULO || '-' }}</span>
              <span v-if="doc.DCARPETA" class="row-dir-tag">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                {{ doc.DCARPETA }}
              </span>
            </div>
            <div class="row-autor-col" :title="doc.PROP == 0 ? (doc.AUTOR + '') : 'Yo'">
              <avatar-initials :src="doc.RTAFTO" :name="doc.PROP == 1 ? 'Yo' : doc.AUTOR" :size="26"/>
              <span class="autor-name">{{ doc.PROP == 1 ? 'Yo' : (doc.AUTOR || '-') }}</span>
              <svg v-if="doc.PROP == 0" class="shared-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <span class="row-date-col">{{ formatDate(doc.FCRCN) }}</span>
            <div class="row-actions-col" @click.stop>
              <button class="row-action-btn blue" @click.stop="verNoticia(doc)" title="Ver artículo">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="row-action-btn green" @click.stop="openShareModal(doc)" title="Compartir">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <button v-if="doc.PROP == 1 || doc.ISPERM >= 2" class="row-action-btn amber" @click.stop="updateSharedActions(doc)" title="Cambiar carpeta / nombre">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="row-action-btn red" @click.stop="deleteItem(doc)" title="Quitar de mi espacio">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </template>

      <div v-if="!pagination.loading && pagination.total > pagination.perPage" class="fav-pagination">
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
        <div class="panel-accent-strip" style="background:#185CE6;"></div>
        <div class="panel-hdr">
          <div class="panel-type-badge-lg" style="background:#EFF6FF;color:#185CE6;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          </div>
          <div class="panel-hdr-info">
            <p class="panel-titlealt">{{ selectedItem.TITLEALT || 'Sin título alternativo' }}</p>
            <p class="panel-titulo">{{ selectedItem.TITULO }}</p>
          </div>
          <button class="panel-close-btn" @click="selectedItem = null">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="panel-quick-actions">
          <button class="pqa-btn" :class="{ active: selectedItem.STARRED == 1 }" @click="toggleStar(selectedItem)" :title="selectedItem.STARRED == 1 ? 'Quitar destacado' : 'Destacar'">
            <svg width="13" height="13" viewBox="0 0 24 24" :fill="selectedItem.STARRED == 1 ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            <span>{{ selectedItem.STARRED == 1 ? 'Destacado' : 'Destacar' }}</span>
          </button>
          <button class="pqa-btn" @click="verNoticia(selectedItem)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Ver</span>
          </button>
          <button class="pqa-btn" @click="openShareModal(selectedItem)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span>Compartir</span>
          </button>
        </div>

        <div class="panel-content">
          <div class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Propietario
            </span>
            <div class="df-owner-row">
              <avatar-initials :src="selectedItem.RTAFTO" :name="selectedItem.PROP == 1 ? 'Yo' : selectedItem.AUTOR" :size="32"/>
              <div class="df-owner-info">
                <span class="df-owner-name">{{ selectedItem.PROP == 1 ? 'Yo' : (selectedItem.AUTOR || '-') }}</span>
              </div>
              <span v-if="selectedItem.PROP == 0" class="detail-shared-tag">Compartido</span>
            </div>
          </div>

          <div class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
              Carpeta
            </span>
            <div class="df-val">
              <button v-if="selectedItem.PROP == 1 || selectedItem.ISPERM >= 2" class="detail-dir-btn" @click="updateSharedActions(selectedItem)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                {{ selectedItem.DCARPETA || 'Sin carpeta — clic para asignar' }}
              </button>
              <span v-else class="text-sm" style="color:var(--text-muted)">{{ selectedItem.DCARPETA || '—' }}</span>
            </div>
          </div>

          <div class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Guardado
            </span>
            <span class="df-val">{{ formatDate(selectedItem.FCRCN) }}</span>
          </div>

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

          <div v-if="selectedItem.ARCHIVO" class="detail-field">
            <span class="df-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Documento
            </span>
            <div class="df-val">
              <button class="detail-dir-btn" @click="downloadArchivo(selectedItem)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Descargar documento
              </button>
            </div>
          </div>
        </div>
      </aside>
    </transition>

    <!-- ═══════════════ MODALS ═══════════════ -->
    <ModalCompartirNoticia :openModal="openModalCompartir"
      :toggleModal="() => openModalCompartir = !openModalCompartir" :data="rowDataCompartir"/>

    <!-- Vista previa de imagen -->
    <BaseModal v-model="imagePreview.open" title="Vista previa" size="md">
      <img :src="imagePreview.url" alt="" style="width:100%;border-radius:10px;display:block;"/>
    </BaseModal>

    <!-- Menú contexto carpeta -->
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
        <button class="ctx-menu-btn" @click="() => { showCtxDirModal = false; rowDataCompartir = { ...ctxDir, TIPO: 'CARPETA' }; openModalCompartir = true; }">
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

    <!-- Renombrar carpeta -->
    <BaseModal v-model="showRenameModal" title="Renombrar carpeta" size="sm" persistent>
      <BaseInput v-model="renameValue" placeholder="Nombre de la carpeta" @keyup.enter="submitRename"/>
      <template #footer>
        <CancelButton @click="showRenameModal = false" :disabled="loadingDir"/>
        <SaveButton @click="submitRename" :loading="loadingDir"/>
      </template>
    </BaseModal>

    <!-- Confirmar eliminar carpeta -->
    <BaseModal v-model="showDeleteDirModal" title="Eliminar carpeta" size="sm" persistent>
      <p class="text-sm m-0" style="color:var(--text)">
        ¿Eliminar <strong>{{ ctxDir?.DSCRPCN }}</strong>? Se eliminará la carpeta y su contenido.
      </p>
      <template #footer>
        <CancelButton @click="showDeleteDirModal = false" :disabled="loadingDir"/>
        <DeleteButton @click="submitDeleteDir" :loading="loadingDir"/>
      </template>
    </BaseModal>

    <!-- Confirmar quitar de mi espacio -->
    <BaseModal v-model="showDeleteItemModal" title="Quitar de mi espacio" size="sm" persistent>
      <p class="text-sm m-0" style="color:var(--text)">
        ¿Quitar <strong>{{ deleteTargetItem?.TITLEALT || deleteTargetItem?.TITULO }}</strong> de tu espacio?
      </p>
      <template #footer>
        <CancelButton @click="showDeleteItemModal = false" :disabled="loadingDir"/>
        <DeleteButton @click="submitDeleteItem" :loading="loadingDir"/>
      </template>
    </BaseModal>

    <!-- Actualizar (carpeta + título) -->
    <BaseModal v-model="showUpdateModal" title="Actualizar artículo guardado" size="md" persistent>
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-xs font-semibold mb-1" style="color:var(--color-primary)">Carpeta</label>
          <div style="position:relative;">
            <BaseInput
              v-model="updateModalDirSearch"
              placeholder="Buscar carpeta..."
              @focus="showDirDropdown = true"
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

    <!-- Nueva carpeta -->
    <BaseModal v-model="showCreateDirModal" title="Nueva carpeta" size="sm" persistent>
      <BaseInput v-model="newDirName" placeholder="Nombre de la carpeta" @keyup.enter="submitCreateDir"/>
      <template #footer>
        <CancelButton @click="showCreateDirModal = false" :disabled="loadingDir"/>
        <SaveButton @click="submitCreateDir" :loading="loadingDir"/>
      </template>
    </BaseModal>

  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import NoticiaEspacioProxy from '@/proxies/NoticiaEspacioProxy';
import ModalCompartirNoticia from './modals/ModalCompartirNoticia.vue';
import SearchBar from '@/components/Common/SearchBar.vue';

const NAV_LABELS = {
  all: 'Todos los artículos',
  starred: 'Destacados',
  shared: 'Compartidos conmigo',
  carpeta: '',
};

export default {
  name: 'MiEspacioPanel',
  components: { ModalCompartirNoticia, SearchBar },
  emits: ['open-noticia', 'volver'],
  data() {
    return {
      navMode: 'all',
      dirSearch: '',
      primaryNav: [
        { id: 'all', label: 'Todos' },
        { id: 'starred', label: 'Destacados' },
        { id: 'shared', label: 'Compartidos conmigo' },
      ],

      documents: [],
      carpetasRaw: [],

      filter: { termino: '' },
      pagination: { page: 1, perPage: 20, total: 0, loading: false },

      currentCarpetaId: null,
      currentCarpeta: null,

      selectedItem: null,
      tagInput: '',

      imagePreview: { open: false, url: '' },

      openModalCompartir: false,
      rowDataCompartir: {},

      showCtxDirModal: false,
      ctxDir: null,
      showRenameModal: false,
      renameValue: '',
      showDeleteDirModal: false,

      showDeleteItemModal: false,
      deleteTargetItem: null,

      showUpdateModal: false,
      updateModalItem: null,
      updateModalAllDirs: [],
      updateModalSelectedDir: null,
      updateModalDirSearch: '',
      updateModalTitleAlt: '',
      showDirDropdown: false,
      updatingDoc: false,

      showCreateDirModal: false,
      newDirName: '',
      newDirParentId: null,

      openDirs: {},
      loadingDir: false,
    };
  },
  computed: {
    resourcesUrl() {
      return process.env.VUE_APP_RESOURCES_URL || 'https://resources.jurissearch.com';
    },
    currentNavLabel() {
      if (this.navMode === 'carpeta') return this.currentCarpeta?.DSCRPCN || 'Carpeta';
      return NAV_LABELS[this.navMode] || '';
    },
    directoriosTree() {
      const flat = this.carpetasRaw;
      const roots = flat.filter(d => !d.IDPARENT).map(d => ({ ...d, children: [] }));
      roots.forEach(r => { r.children = flat.filter(d => d.IDPARENT == r.ID); });
      return roots;
    },
    filteredDirTree() {
      if (!this.dirSearch) return this.directoriosTree;
      const q = this.dirSearch.toLowerCase();
      return this.directoriosTree
        .map(d => ({ ...d, children: d.children.filter(c => c.DSCRPCN?.toLowerCase().includes(q)) }))
        .filter(d => d.DSCRPCN?.toLowerCase().includes(q) || d.children.length);
    },
    updateModalFilteredDirs() {
      const q = (this.updateModalDirSearch || '').toLowerCase();
      if (!q) return this.updateModalAllDirs;
      return this.updateModalAllDirs.filter(d => d.DSCRPCN?.toLowerCase().includes(q));
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.pagination.total / this.pagination.perPage));
    },
    pageNumbers() {
      const total = this.totalPages, cur = this.pagination.page, pages = [];
      const delta = 2;
      for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) pages.push(i);
      return pages;
    },
  },
  methods: {
    setNav(mode) {
      this.navMode = mode;
      this.currentCarpetaId = null;
      this.currentCarpeta = null;
      this.filter.termino = '';
      this.pagination.page = 1;
      this.selectedItem = null;
      return this.loadDocuments();
    },

    selectCarpeta(dir) {
      if (this.currentCarpetaId === dir.ID) { this.clearCarpeta(); return; }
      this.navMode = 'carpeta';
      this.currentCarpetaId = dir.ID;
      this.currentCarpeta = dir;
      this.pagination.page = 1;
      this.selectedItem = null;
      this.loadDocuments();
    },

    clearCarpeta() {
      this.navMode = 'all';
      this.currentCarpetaId = null;
      this.currentCarpeta = null;
      this.pagination.page = 1;
      this.selectedItem = null;
      this.loadDocuments();
    },

    async loadDocuments() {
      this.pagination.loading = true;
      const init = (this.pagination.page - 1) * this.pagination.perPage;
      try {
        const params = {
          TERMINO: this.filter.termino || '',
          ROWS: this.pagination.perPage,
          INIT: init,
          ROL: this.navMode === 'shared' ? 'compartidos' : 'todos',
        };
        if (this.navMode === 'starred') params.STARRED = 1;
        if (this.navMode === 'carpeta' && this.currentCarpetaId) params.IDCARPETA = this.currentCarpetaId;

        const res = await NoticiaEspacioProxy.list(params);
        this.documents = Array.isArray(res) ? res : [];
        this.pagination.total = this.documents[0]?.TOTALROWS ?? 0;
      } catch {
        toast.error('Error al cargar tu espacio');
        this.documents = [];
      } finally {
        this.pagination.loading = false;
      }
    },

    async loadDirectorios() {
      try {
        const res = await NoticiaEspacioProxy.listFoldersAll();
        this.carpetasRaw = Array.isArray(res) ? res : [];
      } catch { /* silencioso */ }
    },

    selectItem(doc) {
      this.selectedItem = doc;
      this.tagInput = '';
    },

    previewImage(doc) {
      if (!doc.IMAGEN) return;
      this.imagePreview.url = `${this.resourcesUrl}${doc.IMAGEN}`;
      this.imagePreview.open = true;
    },

    async toggleStar(doc) {
      try {
        await NoticiaEspacioProxy.toggleStarred(doc.ID);
        const newVal = doc.STARRED == 1 ? 0 : 1;
        doc.STARRED = newVal;
        if (this.selectedItem && this.selectedItem.ID === doc.ID) this.selectedItem.STARRED = newVal;
        toast.success(newVal ? 'Marcado como destacado' : 'Quitado de destacados');
      } catch {
        toast.error('Error al actualizar destacado');
      }
    },

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
        const res = await NoticiaEspacioProxy.update({ ID: this.selectedItem.ID, ETIQUETAS: JSON.stringify(updated) });
        if (res?.STATUS === false) { toast.error(res.MESSAGE || 'Sin permisos para editar'); return; }
        this.selectedItem.ETIQUETAS = JSON.stringify(updated);
        this.tagInput = '';
      } catch {
        toast.error('Error al guardar etiqueta');
      }
    },

    createDirectory(parentId) {
      this.newDirName = '';
      this.newDirParentId = parentId || null;
      this.showCreateDirModal = true;
    },

    async submitCreateDir() {
      if (!this.newDirName.trim()) { toast.error('Ingresa un nombre'); return; }
      this.loadingDir = true;
      try {
        await NoticiaEspacioProxy.createFolder({ DSCRPCN: this.newDirName.trim(), IDPARENT: this.newDirParentId });
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
        await NoticiaEspacioProxy.updateFolder({ ID: this.ctxDir.ID, DSCRPCN: this.renameValue.trim() });
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
        await NoticiaEspacioProxy.deleteFolders(JSON.stringify([this.ctxDir.ID]));
        toast.success('Carpeta eliminada');
        this.showDeleteDirModal = false;
        if (this.currentCarpetaId === this.ctxDir.ID) this.setNav('all');
        await this.loadDirectorios();
      } catch {
        toast.error('Error al eliminar la carpeta');
      } finally {
        this.loadingDir = false;
      }
    },

    deleteItem(item) {
      this.deleteTargetItem = item;
      this.showDeleteItemModal = true;
    },

    async submitDeleteItem() {
      this.loadingDir = true;
      try {
        await NoticiaEspacioProxy.unsave(this.deleteTargetItem.ID);
        toast.success('Quitado de tu espacio');
        this.documents = this.documents.filter(d => d.ID !== this.deleteTargetItem.ID);
        this.pagination.total = Math.max(0, this.pagination.total - 1);
        if (this.selectedItem?.ID === this.deleteTargetItem.ID) this.selectedItem = null;
        this.showDeleteItemModal = false;
      } catch {
        toast.error('Error al quitar');
      } finally {
        this.loadingDir = false;
      }
    },

    verNoticia(item) {
      this.$emit('open-noticia', item.IDNOTICIA);
    },

    async downloadArchivo(item) {
      this.$emit('open-noticia', item.IDNOTICIA);
    },

    toggleDirOpen(id) {
      this.openDirs = { ...this.openDirs, [id]: !this.openDirs[id] };
    },
    isDirOpen(id) {
      return !!this.openDirs[id];
    },

    openShareModal(item) {
      this.rowDataCompartir = { ...item, TIPO: 'GUARDADA' };
      this.openModalCompartir = true;
    },

    async updateSharedActions(item) {
      const dirsRes = await NoticiaEspacioProxy.listFoldersAll();
      const dirs = Array.isArray(dirsRes) ? dirsRes.filter(d => d.ID) : [];
      const cur = dirs.find(d => d.ID == item.IDCARPETA);
      this.updateModalItem = item;
      this.updateModalAllDirs = dirs;
      this.updateModalSelectedDir = item.IDCARPETA || null;
      this.updateModalDirSearch = cur ? cur.DSCRPCN : '';
      this.updateModalTitleAlt = item.TITLEALT || '';
      this.showDirDropdown = false;
      this.showUpdateModal = true;
    },

    selectUpdateDir(d) {
      this.updateModalSelectedDir = d.ID;
      this.updateModalDirSearch = d.DSCRPCN;
      this.showDirDropdown = false;
    },

    async submitUpdate() {
      const q = (this.updateModalDirSearch || '').trim();
      if (q && !this.updateModalSelectedDir) {
        toast.error('Selecciona una carpeta de la lista, o deja el campo vacío para "Sin carpeta"');
        return;
      }
      this.updatingDoc = true;
      try {
        await NoticiaEspacioProxy.moveItem(this.updateModalItem.ID, this.updateModalSelectedDir || null);
        if ((this.updateModalTitleAlt || '') !== (this.updateModalItem.TITLEALT || '')) {
          await NoticiaEspacioProxy.update({ ID: this.updateModalItem.ID, TITLEALT: this.updateModalTitleAlt });
        }
        toast.success('Actualizado');
        this.showUpdateModal = false;
        await this.loadDocuments();
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

    changePage(p) {
      this.pagination.page = p;
      this.loadDocuments();
    },

    formatDate(d) {
      if (!d) return '-';
      const date = new Date(d);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
    },
  },
  mounted() {
    this.loadDocuments();
    this.loadDirectorios();
  },
};
</script>

<style scoped>
/* ── Layout shell ──────────────────────────────────────── */
.fav-shell { display: flex; min-height: 100vh; background: #F8FAFC; position: relative; }

/* ── Sidebar ───────────────────────────────────────────── */
.fav-sidebar {
  width: 240px; min-width: 240px; background: white;
  border-right: 1px solid #E5E7EB; display: flex; flex-direction: column;
  position: sticky; top: 0; max-height: 100vh; overflow-y: auto; overflow-x: hidden;
}
.sidebar-section { padding: 10px 8px 0; }
.sidebar-section-hdr { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px 6px; }
.sidebar-section-hdr span { font-size: 10px; font-weight: 700; color: #9CA3AF; letter-spacing: .08em; }
.sidebar-add-btn {
  width: 20px; height: 20px; border-radius: 4px; border: none; background: none;
  color: #9CA3AF; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s;
}
.sidebar-add-btn:hover { background: #F3F4F6; color: #374151; }

.folder-tree { display: flex; flex-direction: column; gap: 1px; }
.folder-item {
  display: flex; align-items: center; gap: 5px; padding: 5px 6px 5px 8px; border-radius: 7px;
  cursor: pointer; color: #374151; font-size: 12.5px; transition: background .15s; position: relative;
}
.folder-item:hover { background: #F9FAFB; }
.folder-item.active { background: #EFF6FF; color: #185CE6; }
.folder-item.sub { padding-left: 22px; }
.folder-expand-btn {
  width: 14px; height: 14px; border: none; background: none; color: #9CA3AF; cursor: pointer;
  padding: 0; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
}
.folder-expand-spacer { width: 14px; flex-shrink: 0; }
.folder-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.folder-icon-svg { color: #9CA3AF; flex-shrink: 0; }
.folder-item.active .folder-icon-svg { color: #185CE6; }
.folder-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.folder-shared-badge {
  width: 16px; height: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  color: #9333ea; cursor: help;
}
.folder-more-btn {
  width: 18px; height: 18px; border: none; background: none; color: #9CA3AF; cursor: pointer;
  padding: 0; display: none; align-items: center; justify-content: center; border-radius: 4px;
}
.folder-item:hover .folder-more-btn { display: flex; }
.folder-more-btn:hover { background: #E5E7EB; color: #374151; }
.sidebar-empty-hint { font-size: 12px; color: #9CA3AF; padding: 6px 8px; font-style: italic; }

/* ── Context menu modal buttons ──────────────────────── */
.ctx-menu-btn {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px;
  border: 1px solid #E5E7EB; border-radius: 10px; background: white; cursor: pointer;
  font-size: 13.5px; color: #374151; text-align: left; transition: all .12s;
}
.ctx-menu-btn:hover { background: #F9FAFB; border-color: #D1D5DB; }
.ctx-menu-btn--danger { border-color: #FEE2E2; background: #FFF5F5; color: #DC2626; }
.ctx-menu-btn--danger:hover { background: #FEE2E2; border-color: #FECACA; }

/* ── Main ─────────────────────────────────────────────── */
.fav-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; transition: all .3s; min-width: 0; }
.fav-main.panel-open { margin-right: 380px; }
.fav-topbar {
  display: flex; align-items: center; justify-content: space-between; padding: 14px 20px;
  background: white; border-bottom: 1px solid #E5E7EB; flex-shrink: 0;
}
.fav-breadcrumb { display: flex; align-items: center; gap: 6px; }
.bc-current { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #374151; font-weight: 600; }
.dir-filter-chip {
  display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px 3px 6px;
  background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; cursor: pointer;
  font-size: 13px; font-weight: 600; color: #1d4ed8; transition: background .15s, border-color .15s;
}
.dir-filter-chip:hover { background: #dbeafe; border-color: #93c5fd; }
.dir-filter-chip .folder-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.topbar-right { display: flex; align-items: center; gap: 10px; }

/* ── Filter bar ───────────────────────────────────────── */
.fav-filterbar {
  display: flex; flex-direction: column; gap: 6px; padding: 10px 20px;
  background: #FAFAFA; border-bottom: 1px solid #F1F5F9; flex-shrink: 0;
}
.filterbar-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.result-count { font-size: 12px; color: #9CA3AF; }

/* ── Loading / Empty ──────────────────────────────────── */
.fav-loading, .fav-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; padding: 60px 20px; color: #9CA3AF; text-align: center;
}
.fav-loading { flex-direction: row; gap: 10px; }
.loading-spinner {
  width: 20px; height: 20px; border-radius: 50%; border: 2.5px solid #E5E7EB;
  border-top-color: #185CE6; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.fav-empty p { font-size: 15px; font-weight: 600; color: #6B7280; margin: 0; }
.fav-empty small { font-size: 13px; }

/* ── List view ────────────────────────────────────────── */
.fav-list-view { flex: 1; overflow-y: auto; padding: 0 20px 16px; }
.list-header {
  display: grid; grid-template-columns: 36px 1fr 190px 110px 90px; gap: 0; padding: 10px 12px;
  font-size: 10.5px; font-weight: 700; color: #9CA3AF; letter-spacing: .07em; text-transform: uppercase;
  background: #F8FAFC; border-bottom: 2px solid #E8ECF0; position: sticky; top: 0; z-index: 1;
}
.lh-title { grid-column: 2; }
.lh-autor { grid-column: 3; }
.lh-fecha { grid-column: 4; }
.lh-acciones { grid-column: 5; text-align: right; }
.list-row {
  display: grid; grid-template-columns: 36px 1fr 190px 110px 90px; gap: 0; align-items: center;
  padding: 10px 12px; cursor: pointer; transition: background .12s; border-bottom: 1px solid #E8ECF0; min-height: 56px;
}
.list-row:last-child { border-bottom: none; }
.list-row:hover { background: #F5F7FA; }
.list-row.selected { background: #EBF3FF; border-left: 3px solid #185CE6; padding-left: 9px; }
.doc-type-wrap { position: relative; flex-shrink: 0; }
.doc-type-badge { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.doc-type-badge.has-image { cursor: zoom-in; }
.thumb-zoom-overlay {
  position: absolute; inset: 0; border-radius: 6px; background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .15s;
}
.list-row:hover .thumb-zoom-overlay { opacity: 1; }
.shared-dot { position: absolute; bottom: -2px; right: -2px; width: 9px; height: 9px; border-radius: 50%; background: #F59E0B; border: 1.5px solid white; }
.row-title-col { display: flex; flex-direction: column; gap: 1px; min-width: 0; padding: 0 8px; }
.row-titlealt { font-size: 11px; color: #9CA3AF; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-titulo { font-size: 13px; font-weight: 600; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-dir-tag { display: inline-flex; align-items: center; gap: 3px; font-size: 10.5px; color: #9CA3AF; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.row-autor-col { display: flex; align-items: center; gap: 6px; min-width: 0; padding: 0 4px; }
.autor-name { font-size: 12px; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.shared-icon { flex-shrink: 0; color: #185CE6; opacity: 0.75; }
.row-date-col { font-size: 12px; color: #9CA3AF; }
.row-actions-col { display: grid; grid-template-columns: 26px 26px; grid-template-rows: 26px 26px; gap: 2px; justify-content: end; }
.row-action-btn {
  width: 26px; height: 26px; border: none; border-radius: 5px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .12s; background: #F3F4F6; color: #9CA3AF;
}
.row-action-btn:hover { transform: scale(1.1); }
.row-action-btn.blue:hover { background: #EFF6FF; color: #185CE6; }
.row-action-btn.green:hover { background: #ECFDF5; color: #059669; }
.row-action-btn.amber:hover { background: #FFFBEB; color: #D97706; }
.row-action-btn.red:hover { background: #FEF2F2; color: #DC2626; }

/* ── Pagination ───────────────────────────────────────── */
.fav-pagination { display: flex; align-items: center; gap: 4px; justify-content: center; padding: 14px 20px; border-top: 1px solid #F1F5F9; background: white; flex-shrink: 0; }
.pg-btn {
  min-width: 32px; height: 32px; padding: 0 6px; border: 1.5px solid #E5E7EB; border-radius: 7px;
  background: white; font-size: 13px; color: #374151; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .12s;
}
.pg-btn:hover:not(:disabled):not(.dots) { border-color: #185CE6; color: #185CE6; }
.pg-btn.active { background: #185CE6; border-color: #185CE6; color: white; font-weight: 700; }
.pg-btn:disabled { opacity: .4; cursor: not-allowed; }
.pg-btn.dots { border: none; cursor: default; }
.pg-info { font-size: 12px; color: #9CA3AF; margin-left: 8px; }

/* ── Detail Panel ─────────────────────────────────────── */
.fav-detail-panel {
  position: fixed; right: 0; top: 0; bottom: 0; width: 380px; background: white;
  border-left: 1px solid #E5E7EB; box-shadow: -6px 0 32px rgba(0,0,0,.10);
  display: flex; flex-direction: column; z-index: 50; overflow: hidden;
}
.panel-accent-strip { height: 3px; flex-shrink: 0; }
.panel-hdr { display: flex; align-items: flex-start; gap: 10px; padding: 14px 16px 12px; border-bottom: 1px solid #F1F5F9; flex-shrink: 0; }
.panel-type-badge-lg { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.panel-hdr-info { flex: 1; min-width: 0; }
.panel-titlealt { font-size: 10.5px; color: #9CA3AF; margin: 0 0 2px; }
.panel-titulo { font-size: 13px; font-weight: 700; color: #111827; margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.panel-close-btn {
  width: 26px; height: 26px; border: none; background: #F3F4F6; border-radius: 6px; cursor: pointer;
  color: #9CA3AF; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all .12s; margin-top: 2px;
}
.panel-close-btn:hover { background: #E5E7EB; color: #374151; }
.panel-quick-actions { display: flex; align-items: center; gap: 4px; padding: 9px 14px; border-bottom: 1px solid #F1F5F9; flex-shrink: 0; flex-wrap: wrap; }
.pqa-btn {
  display: flex; align-items: center; gap: 4px; padding: 5px 9px; border: 1.5px solid #E5E7EB; border-radius: 8px;
  background: white; font-size: 11.5px; color: #374151; cursor: pointer; transition: all .12s;
}
.pqa-btn:hover { background: #F0F4FF; border-color: #185CE6; color: #185CE6; }
.pqa-btn.active { border-color: #F59E0B; color: #F59E0B; background: #FFFBEB; }
.panel-content { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 14px; }
.detail-field { display: flex; flex-direction: column; gap: 6px; }
.df-label { display: flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: .07em; }
.df-val { font-size: 13px; color: #374151; }
.df-owner-row { display: flex; align-items: center; gap: 10px; }
.df-owner-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.df-owner-name { font-size: 13px; font-weight: 600; color: #111827; }
.detail-shared-tag { font-size: 10px; padding: 2px 7px; border-radius: 20px; background: #EFF6FF; color: #185CE6; font-weight: 600; flex-shrink: 0; }
.detail-dir-btn {
  display: inline-flex; align-items: center; gap: 5px; border: 1.5px dashed #D1D5DB; border-radius: 8px;
  padding: 6px 10px; background: #F9FAFB; font-size: 12px; color: #6B7280; cursor: pointer; transition: all .12s; width: 100%;
}
.detail-dir-btn:hover { border-color: #185CE6; color: #185CE6; background: #F0F4FF; }
.tags-row { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
.tag-chip { padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; background: #EFF6FF; color: #185CE6; }
.tag-input {
  border: 1.5px dashed #E5E7EB; border-radius: 20px; padding: 3px 10px; font-size: 11px; color: #374151;
  outline: none; min-width: 100px; background: none; transition: border-color .12s;
}
.tag-input:focus, .tag-input:focus-visible { border-color: #4B5563; outline: none; box-shadow: 0 0 0 3px rgba(75,85,99,0.12); }

/* ── Transition ───────────────────────────────────────── */
.slide-panel-enter-active, .slide-panel-leave-active { transition: transform .25s cubic-bezier(.4,0,.2,1); }
.slide-panel-enter-from, .slide-panel-leave-to { transform: translateX(100%); }
</style>

<style>
.dark .fav-shell { background: #0f172a !important; }
.dark .fav-sidebar { background: #1e293b !important; border-right-color: #334155 !important; }
.dark .sidebar-section-hdr span { color: #64748b !important; }
.dark .sidebar-add-btn { color: #64748b !important; }
.dark .sidebar-add-btn:hover { background: #334155 !important; color: #e2e8f0 !important; }
.dark .sidebar-empty-hint { color: #64748b !important; }
.dark .folder-item { color: #cbd5e1 !important; }
.dark .folder-item:hover { background: #334155 !important; }
.dark .folder-item.active { background: #1e3a5f !important; color: #60a5fa !important; }
.dark .folder-icon-svg { color: #64748b !important; }
.dark .folder-item.active .folder-icon-svg { color: #60a5fa !important; }
.dark .folder-more-btn { color: #64748b !important; }
.dark .folder-more-btn:hover { background: #475569 !important; color: #e2e8f0 !important; }
.dark .fav-topbar { background: #1e293b !important; border-bottom-color: #334155 !important; }
.dark .bc-current { color: #e2e8f0 !important; }
.dark .dir-filter-chip { background: #1e3a5f !important; border-color: #3b82f6 !important; color: #93c5fd !important; }
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
.dark .pg-btn.active { background: #185CE6 !important; border-color: #185CE6 !important; color: white !important; }
.dark .fav-detail-panel { background: #1e293b !important; border-left-color: #334155 !important; }
.dark .panel-hdr { border-bottom-color: #334155 !important; }
.dark .panel-titulo { color: #f1f5f9 !important; }
.dark .panel-titlealt { color: #64748b !important; }
.dark .panel-close-btn { background: #334155 !important; color: #94a3b8 !important; }
.dark .panel-quick-actions { border-bottom-color: #334155 !important; }
.dark .pqa-btn { background: #1e293b !important; border-color: #475569 !important; color: #cbd5e1 !important; }
.dark .df-val { color: #cbd5e1 !important; }
.dark .df-owner-name { color: #f1f5f9 !important; }
</style>
