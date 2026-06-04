<template>
    <section class="news-portal">
        <!-- Header Section -->
        <div class="news-header">
            <div class="news-header-content">
                <div class="header-title-section">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="header-icon">
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                    <div>
                        <h1 class="news-title">Investigación</h1>
                        <p class="news-subtitle">Descubre las últimas actualizaciones, análisis y noticias del mundo jurídico</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="news-content">
            <!-- Search Bar -->
            <div class="search-bar-modern">
                <div class="search-wrapper">
                    <svg class="search-icon-modern" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input type="text" v-model="filter.NOMBRES" @input="debounceSearch"
                        placeholder="¿Qué quieres descubrir hoy?" class="search-input-modern" />
                    <button v-if="filter.NOMBRES" @click="clearSearch" class="clear-btn-modern">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <select v-model="filter.TIPO" @change="applyFilters" class="filter-select-modern">
                    <option :value="null">🏷️ Todas las categorías</option>
                    <option v-for="categoria in categorias" :key="categoria.value" :value="categoria.value">
                        {{ categoria.text }}
                    </option>
                </select>
                <select v-model="sortOrder" @change="applySorting" class="sort-select-modern">
                    <option value="desc">🕒 Más recientes</option>
                    <option value="asc">📅 Más antiguas</option>
                </select>
            </div>

            <!-- Loading State -->
            <div v-if="grid.isLoading" class="loading-state">
                <div class="loading-animation">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
                <p class="loading-message">Cargando las últimas novedades...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="paginatedNoticias.length === 0" class="empty-state-modern">
                <div class="empty-illustration">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                        <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    </svg>
                </div>
                <h3 class="empty-title-modern">No encontramos noticias</h3>
                <p class="empty-text-modern">Prueba con otros términos de búsqueda o revisa más tarde</p>
            </div>

            <!-- News Grid - Dynamic Layout -->
            <div v-else class="news-grid-dynamic">
                <article v-for="(noticia, index) in paginatedNoticias" :key="noticia.ID" 
                    :class="['news-card-dynamic', getCardClass(index, paginatedNoticias.length)]">
                    <div class="card-image-container-dynamic">
                        <img :src="noticia.IMAGEN ? `https://www.jurissearch.com${noticia.IMAGEN}` : 'https://via.placeholder.com/600x400/4A5568/FFFFFF?text=Sin+Imagen'"
                            :alt="noticia.TITULO" class="card-image-dynamic" />
                    </div>
                    <div class="card-content-dynamic">
                        <h3 class="card-title-dynamic">{{ noticia.TITULO }}</h3>
                        
                        <!-- Subtítulo/Descripción (solo para Artículos de Investigación y Compendio) -->
                        <div v-if="shouldShowSubtitle(noticia.TIPO)" class="card-subtitle-dynamic">
                            {{ noticia.SUBTITULO || truncateHTML(noticia.DESCRIPCION, 80) }}
                        </div>

                        <!-- Metadata Section -->
                        <div class="card-metadata-section">
                            <!-- Fecha -->
                            <div class="card-meta-item-dynamic">
                                <svg class="meta-icon-dynamic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="meta-text-dynamic">{{ formatDate(noticia.FCRCN) }}</span>
                            </div>

                            <!-- Órgano Jurisdiccional (solo para Artículos de Investigación) -->
                            <div v-if="shouldShowOrgano(noticia.TIPO) && noticia.DORGANO" class="card-meta-item-dynamic">
                                <svg class="meta-icon-dynamic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                                <span class="meta-text-dynamic">{{ noticia.DORGANO }}</span>
                            </div>

                            <!-- Autores -->
                            <div v-if="shouldShowAutor(noticia.TIPO) && noticia.AUTORES && noticia.AUTORES.length > 0" class="card-meta-item-dynamic">
                                <svg class="meta-icon-dynamic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span class="meta-text-dynamic">{{ noticia.AUTORES.map(a => a.NOMBRE).join(', ') }}</span>
                            </div>
                        </div>

                        <!-- Footer con botón -->
                        <div class="card-footer-dynamic">
                            <a :href="noticia.ARCHIVO ? `https://www.jurissearch.com${noticia.ARCHIVO}` : '#'" target="_blank" class="card-button-dynamic">
                                Ver documento
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        </div>

        <!-- Pagination -->
        <!-- <div v-if="!grid.isLoading && paginatedNoticias.length > 0" class="pagination-container">
            <div class="pagination-info">
                Mostrando {{ startItem }} - {{ endItem }} de {{ grid.totalRows }} noticias
            </div>
            <div class="pagination-controls">
                <button @click="goToPage(1)" :disabled="grid.currentPage === 1" class="pagination-button"
                    :class="{ 'disabled': grid.currentPage === 1 }">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
                <button @click="goToPage(grid.currentPage - 1)" :disabled="grid.currentPage === 1"
                    class="pagination-button" :class="{ 'disabled': grid.currentPage === 1 }">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" class="pagination-number"
                    :class="{ 'active': grid.currentPage === page }">
                    {{ page }}
                </button>

                <button @click="goToPage(grid.currentPage + 1)" :disabled="grid.currentPage === totalPages"
                    class="pagination-button" :class="{ 'disabled': grid.currentPage === totalPages }">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button @click="goToPage(totalPages)" :disabled="grid.currentPage === totalPages"
                    class="pagination-button" :class="{ 'disabled': grid.currentPage === totalPages }">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div> -->
    </section>
</template>

<script>
import { toast } from 'vue3-toastify';
import MantenimientoProxy from '../../proxies/MantenimientoProxy';

export default {
    name: 'Investigacion',
    data() {
        return {
            dominio: 'https://www.jurissearch.com/',
            dataNoticia: [],
            categorias: [],
            filter: {
                NOMBRES: null,
                TIPO: null,
            },
            sortOrder: 'desc',
            grid: {
                items: [],
                currentPage: 1,
                perPage: 10,
                totalRows: 0,
                isLoading: true,
                pageOptions: [10, 15, 50],
            },
            searchTimeout: null,
        };
    },
    computed: {
        sortedNoticias() {
            if (!this.dataNoticia || this.dataNoticia.length === 0) return [];

            const duplicatedData = [];
            this.dataNoticia.forEach((item, index) => {
                duplicatedData.push({
                    ...item,
                    INDEX: index,
                    ID: item.ID,
                });
            });

            return duplicatedData.sort((a, b) => {
                const dateA = new Date(a.FCRCN);
                const dateB = new Date(b.FCRCN);
                return this.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
        },
        paginatedNoticias() {
            const start = (this.grid.currentPage - 1) * this.grid.perPage;
            const end = start + this.grid.perPage;
            return this.sortedNoticias.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.sortedNoticias.length / this.grid.perPage);
        },
        visiblePages() {
            const current = this.grid.currentPage;
            const total = this.totalPages;
            const delta = 2;
            const range = [];
            const rangeWithDots = [];

            for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
                range.push(i);
            }

            if (current - delta > 2) {
                rangeWithDots.push(1, '...');
            } else {
                rangeWithDots.push(1);
            }

            rangeWithDots.push(...range);

            if (current + delta < total - 1) {
                rangeWithDots.push('...', total);
            } else if (total > 1) {
                rangeWithDots.push(total);
            }

            return rangeWithDots.filter(p => p !== 1 || total > 0);
        },
        startItem() {
            return (this.grid.currentPage - 1) * this.grid.perPage + 1;
        },
        endItem() {
            return Math.min(this.grid.currentPage * this.grid.perPage, this.sortedNoticias.length);
        }
    },
    methods: {
        async searchNoticias() {
            this.grid.isLoading = true;

            await MantenimientoProxy.list({
                ROWS: 1000,
                INIT: 0,
                DESC: this.filter?.NOMBRES || null,
                TIPO: this.filter?.TIPO || null,
                CESTDO: 'A',
                ORDER: this.sortOrder === 'desc' ? 0 : 1,
            }, 'noticias')
                .then((response) => {
                    this.dataNoticia = response || [];
                    this.dataNoticia = this.dataNoticia.map(item => ({
                        ...item,
                        AUTORES: item.AUTORES ? JSON.parse(item.AUTORES) : [],
                    }));
                    this.grid.totalRows = this.dataNoticia.length;
                })
                .catch((error) => {
                    this.dataNoticia = [];
                    toast.error(error?.MESSAGE || 'Error al cargar las noticias', { toastId: 'error-noticias' });
                })
                .finally(() => {
                    this.grid.isLoading = false;
                });
        },
        debounceSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.grid.currentPage = 1;
                this.searchNoticias();
            }, 500);
        },
        clearSearch() {
            this.filter.NOMBRES = null;
            this.searchNoticias();
        },
        applyFilters() {
            this.grid.currentPage = 1;
            this.searchNoticias();
        },
        applySorting() {
        },
        async loadCategorias() {
            try {
                const categorias = await MantenimientoProxy.listCategorias({ CESTDO: 'A', ROWS: 1000, INIT: 0 });
                this.categorias = categorias?.map(item => ({ value: item.ID, text: item.DESCP })) || [];
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        },
        goToPage(page) {
            if (page === '...' || page < 1 || page > this.totalPages) return;
            this.grid.currentPage = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        truncateHTML(html, maxLength) {
            if (!html) return '';
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            const text = tmp.textContent || tmp.innerText || '';
            if (text.length <= maxLength) return text;
            return text.substr(0, maxLength) + '...';
        },
        getCategoryName(tipoId) {
            const categoria = this.categorias.find(c => c.value === tipoId);
            return categoria ? categoria.text : 'Sin categoría';
        },
        getCardClass(index, totalCards) {
            // Si hay 3 o menos, todos iguales
            if (totalCards <= 3) {
                return 'card-regular';
            }
            
            // Todas las tarjetas tienen el mismo tamaño
            return 'card-regular';
        },
        shouldShowSubtitle(tipoId) {
            // Mostrar subtítulo/descripción solo en Artículos de Investigación y Compendio
            const categoria = this.categorias.find(c => c.value === tipoId);
            const nombreCategoria = categoria ? categoria.text.toUpperCase() : '';
            return nombreCategoria.includes('ARTÍCULO') || 
                   nombreCategoria.includes('ARTICULO') || 
                   nombreCategoria.includes('COMPENDIO') ||
                   nombreCategoria.includes('INVESTIGACIÓN') ||
                   nombreCategoria.includes('INVESTIGACION');
        },
        shouldShowOrgano(tipoId) {
            // Mostrar órgano jurisdiccional solo en Artículos de Investigación
            const categoria = this.categorias.find(c => c.value === tipoId);
            const nombreCategoria = categoria ? categoria.text.toUpperCase() : '';
            return nombreCategoria.includes('ARTÍCULO') || 
                   nombreCategoria.includes('ARTICULO') ||
                   nombreCategoria.includes('INVESTIGACIÓN') ||
                   nombreCategoria.includes('INVESTIGACION');
        },
        shouldShowAutor(tipoId) {
            console.log(tipoId)
            // Mostrar autores si el array existe y tiene elementos
            return true;
        }
    },
    mounted() {
        // Si hay un parámetro 'search' en la URL, ponerlo en el buscador
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            this.filter.NOMBRES = searchParam;
        }
        this.loadCategorias();
        this.searchNoticias();
    },
};
</script>

<style scoped>
/* ===== NEWS PORTAL UI ===== */
.news-portal {
    min-height: 100vh;
    background: linear-gradient(180deg, #fff5f8 0%, #f0f4ff 50%, #ffffff 100%);
    padding-bottom: 2rem;
    font-size: 0.9em;
}

/* Header Section - Similar to Settings.vue */
.news-header {
    background: white;
    border-bottom: 1px solid #E5E7EB;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 0.75rem 0;
    margin-bottom: 0.75rem;
}

.news-header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.header-title-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}

.header-title-section > div {
    flex: 1;
    min-width: 0;
    max-width: 100%;
}

.header-icon {
    flex-shrink: 0;
    color: #185CE6;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

.news-title {
    font-size: 1.35rem;
    font-weight: 800;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    max-width: 100%;
    width: 100%;
}

.news-subtitle {
    color: #6B7280;
    font-size: 0.8rem;
    margin: 0.15rem 0 0 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
    max-width: 100%;
    width: 100%;
}

/* Main Content */
.news-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Search Bar Modern */
.search-bar-modern {
    background: white;
    border-radius: 14px;
    padding: 0.85rem 1.25rem;
    margin-bottom: 1.25rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
}

.search-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    min-width: 300px;
}

.search-icon-modern {
    position: absolute;
    left: 1.25rem;
    color: #DF2DB2;
    pointer-events: none;
    z-index: 1;
}

.search-input-modern {
    width: 100%;
    padding: 0.5rem 3rem 0.5rem 2.75rem;
    border-radius: 10px;
    border: 2px solid #E5E7EB;
    background: white;
    font-size: 0.875rem;
    color: #1F2937;
    transition: all 0.3s ease;
}

.search-input-modern:focus {
    outline: none;
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

.search-input-modern::placeholder {
    color: #9CA3AF;
}

.clear-btn-modern {
    position: absolute;
    right: 1rem;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    color: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(223, 45, 178, 0.3);
}

.clear-btn-modern:hover {
    box-shadow: 0 4px 15px rgba(223, 45, 178, 0.4);
}

.filter-select-modern,
.sort-select-modern {
    padding: 0.5rem 1rem;
    border-radius: 10px;
    border: 2px solid #E5E7EB;
    background: white;
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 180px;
}

.filter-select-modern:hover,
.sort-select-modern:hover {
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

.filter-select-modern:focus,
.sort-select-modern:focus {
    outline: none;
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

/* Loading State */
.loading-state {
    background: white;
    border-radius: 20px;
    padding: 5rem 2rem;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
}

.loading-animation {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
}

.loading-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    animation: pulse 1.5s ease-in-out infinite;
}

.loading-dot:nth-child(2) {
    animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
}

.loading-message {
    color: #6B7280;
    font-size: 1.25rem;
    font-weight: 600;
}

/* Empty State */
.empty-state-modern {
    background: linear-gradient(135deg, white 0%, #fef5fb 100%);
    border-radius: 20px;
    padding: 5rem 2rem;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
}

.empty-illustration {
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.empty-illustration svg {
    color: #DF2DB2;
    opacity: 0.3;
}

.empty-title-modern {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.75rem;
}

.empty-text-modern {
    font-size: 1.125rem;
    color: #9CA3AF;
}

/* News Grid - Dynamic Layout */
.news-grid-dynamic {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    margin-bottom: 2rem;
}

/* Card Styles */
.news-card-dynamic {
    background: white;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.news-card-dynamic:hover {
    box-shadow: 0 12px 35px rgba(223, 45, 178, 0.2);
}

/* Todas las tarjetas tienen el mismo tamaño */
.news-card-dynamic.card-regular,
.news-card-dynamic.card-large {
    grid-column: span 1;
}

/* Image Container */
.card-image-container-dynamic {
    position: relative;
    overflow: hidden;
    height: 220px;
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
}

.card-image-dynamic {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Category Badge */
.card-category-badge-dynamic {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    color: white;
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    z-index: 2;
}

/* Card Content */
.card-content-dynamic {
    padding: 1.25rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.card-title-dynamic {
    font-size: 1.05rem;
    font-weight: 800;
    color: #1a202c;
    line-height: 1.4;
    margin-bottom: 0.75rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: all 0.3s ease;
}

.card-subtitle-dynamic {
    color: #4a5568;
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Metadata Section */
.card-metadata-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex: 1;
}

.card-meta-item-dynamic {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6B7280;
    font-size: 0.8rem;
}

.meta-icon-dynamic {
    width: 1rem;
    height: 1rem;
    color: #DF2DB2;
    flex-shrink: 0;
}

.meta-text-dynamic {
    font-weight: 600;
}

/* Card Footer */
.card-footer-dynamic {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #F3F4F6;
    margin-top: auto;
}

.card-button-dynamic {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    color: white;
    padding: 0.65rem 1.5rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(223, 45, 178, 0.25);
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.card-button-dynamic:hover {
    box-shadow: 0 4px 15px rgba(223, 45, 178, 0.35);
    background: linear-gradient(135deg, #c91c9e 0%, #1547c7 100%);
}

.card-button-dynamic svg {
    width: 16px;
    height: 16px;
}

/* Pagination */
.pagination-container {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    background: white;
    padding: 1rem;
    border-radius: 14px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #F3F4F6;
}

.pagination-info {
    font-weight: 700;
    font-size: 0.82rem;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.pagination-controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.pagination-button,
.pagination-number {
    min-width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 2px solid #E5E7EB;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 700;
    color: #6B7280;
    font-size: 1rem;
    padding: 0 1rem;
}

.pagination-button:hover:not(.disabled),
.pagination-number:hover {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    border-color: transparent;
    color: white;
    box-shadow: 0 8px 20px rgba(223, 45, 178, 0.4);
}

.pagination-number.active {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 8px 25px rgba(223, 45, 178, 0.5);
}

.pagination-button.disabled {
    opacity: 0.2;
    cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .news-content {
        padding: 0 1.5rem;
    }

    .news-header-content {
        padding: 0 1.5rem;
    }

    .news-grid-dynamic {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .news-header {
        padding: 1.25rem 0;
    }

    .news-header-content {
        padding: 0 1rem;
    }

    .header-title-section {
        gap: 0.875rem;
        flex-wrap: wrap;
        width: 100%;
    }

    .header-title-section > div {
        flex: 1;
        min-width: 0;
        max-width: 100%;
    }

    .header-icon {
        width: 28px;
        height: 28px;
    }

    .news-title {
        font-size: 1.35rem;
        line-height: 1.3;
        word-break: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
        width: 100%;
    }

    .news-subtitle {
        font-size: 0.8rem;
        line-height: 1.4;
        overflow-wrap: break-word;
        max-width: 100%;
        width: 100%;
    }

    .news-content {
        padding: 0 1rem;
    }

    .search-bar-modern {
        padding: 1.25rem;
        border-radius: 16px;
        gap: 0.875rem;
    }

    .search-wrapper {
        min-width: 100%;
    }

    .search-input-modern {
        padding: 0.875rem 3rem 0.875rem 3rem;
        font-size: 0.9rem;
    }

    .search-icon-modern {
        left: 1rem;
        width: 18px;
        height: 18px;
    }

    .clear-btn-modern {
        right: 1rem;
        width: 28px;
        height: 28px;
    }

    .clear-btn-modern svg {
        width: 16px;
        height: 16px;
    }

    .filter-select-modern,
    .sort-select-modern {
        width: 100%;
        padding: 0.875rem 1.25rem;
        font-size: 0.9rem;
    }

    .loading-state,
    .empty-state-modern {
        padding: 4rem 1.5rem;
        border-radius: 16px;
    }

    .loading-message,
    .empty-title-modern {
        font-size: 1.1rem;
    }

    .empty-text-modern {
        font-size: 1rem;
    }

    .news-grid-dynamic {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .news-card-dynamic.card-large,
    .news-card-dynamic.card-regular {
        grid-column: span 1;
    }

    .card-image-container-dynamic {
        height: 250px;
    }

    .card-content-dynamic {
        padding: 1.5rem;
    }

    .card-title-dynamic {
        font-size: 1.15rem;
    }

    .pagination-container {
        margin-top: 2.5rem;
        padding: 1.5rem;
        border-radius: 16px;
        flex-direction: column;
        text-align: center;
        gap: 1.25rem;
    }

    .pagination-info {
        font-size: 0.95rem;
    }

    .pagination-button,
    .pagination-number {
        min-width: 44px;
        height: 44px;
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    .news-header {
        padding: 1rem 0;
    }

    .news-header-content {
        padding: 0 0.875rem;
    }

    .header-title-section {
        gap: 0.625rem;
        align-items: flex-start;
        width: 100%;
    }

    .header-title-section > div {
        flex: 1;
        min-width: 0;
        max-width: calc(100% - 30px);
    }

    .header-icon {
        width: 24px;
        height: 24px;
        margin-top: 0.125rem;
    }

    .news-title {
        font-size: 1.05rem;
        line-height: 1.3;
        overflow-wrap: break-word;
        word-wrap: break-word;
        max-width: 100%;
        width: 100%;
    }

    .news-subtitle {
        font-size: 0.72rem;
        overflow-wrap: break-word;
        word-wrap: break-word;
        max-width: 100%;
        width: 100%;
        line-height: 1.3;
    }

    .news-content {
        padding: 0 0.875rem;
    }

    .search-bar-modern {
        padding: 1rem;
        border-radius: 14px;
    }

    .search-input-modern {
        padding: 0.75rem 2.75rem 0.75rem 2.75rem;
        font-size: 0.85rem;
    }

    .search-icon-modern {
        left: 0.875rem;
        width: 16px;
        height: 16px;
    }

    .clear-btn-modern {
        right: 0.875rem;
        width: 26px;
        height: 26px;
    }

    .clear-btn-modern svg {
        width: 14px;
        height: 14px;
    }

    .filter-select-modern,
    .sort-select-modern {
        padding: 0.75rem 1rem;
        font-size: 0.85rem;
    }

    .loading-state,
    .empty-state-modern {
        padding: 3rem 1rem;
        border-radius: 14px;
    }

    .loading-dot {
        width: 12px;
        height: 12px;
    }

    .loading-message {
        font-size: 1rem;
    }

    .empty-illustration svg {
        width: 100px;
        height: 100px;
    }

    .empty-title-modern {
        font-size: 1rem;
    }

    .empty-text-modern {
        font-size: 0.9rem;
    }

    .card-image-container-dynamic {
        height: 220px;
    }

    .card-category-badge-dynamic {
        font-size: 0.65rem;
        padding: 0.35rem 0.75rem;
        top: 0.75rem;
        left: 0.75rem;
    }

    .card-content-dynamic {
        padding: 1.25rem;
    }

    .card-title-dynamic {
        font-size: 1.05rem;
    }

    .card-subtitle-dynamic {
        font-size: 0.85rem;
        line-height: 1.6;
    }

    .card-meta-item-dynamic {
        font-size: 0.75rem;
    }

    .meta-icon-dynamic {
        width: 0.875rem;
        height: 0.875rem;
    }

    .card-authors-section {
        gap: 0.325rem;
        margin-top: 0.325rem;
    }

    .card-author-item {
        padding: 0.3rem 0.425rem;
        gap: 0.425rem;
    }

    .author-avatar {
        width: 26px;
        height: 26px;
    }

    .author-name {
        font-size: 0.7rem;
    }

    .card-button-dynamic {
        padding: 0.55rem 1.25rem;
        font-size: 0.8rem;
    }

    .card-button-dynamic svg {
        width: 14px;
        height: 14px;
    }

    .pagination-container {
        margin-top: 2rem;
        padding: 1.25rem;
        border-radius: 14px;
    }

    .pagination-info {
        font-size: 0.85rem;
    }

    .pagination-button,
    .pagination-number {
        min-width: 40px;
        height: 40px;
        font-size: 0.85rem;
        gap: 0.5rem;
    }

    .pagination-button svg {
        width: 18px;
        height: 18px;
    }
}
</style>
