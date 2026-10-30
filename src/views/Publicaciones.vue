<template>
  <div class="flex flex-col min-h-screen" style="background:var(--bg-card)">
    <navbar />

    <main class="flex-1">

      <!-- Hero -->
      <div class="relative overflow-hidden publicaciones-hero">
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
        <div class="hero-orb hero-orb-3"></div>

        <div class="max-w-[1140px] mx-auto px-4 sm:px-6 pt-6 pb-6 relative z-10">
          <Breadcrumb :items="[{ label: 'Inicio', to: '/' }, { label: 'Publicaciones' }]" />

          <div class="mt-4">
            <span class="etiqueta-blog" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 350 } }">Blog Juris Search</span>
            <h1 class="text-2xl sm:text-[2rem] leading-tight font-extrabold mt-3 mb-1.5" style="color:var(--text)"
              v-motion :initial="{ opacity: 0, y: 16 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 80 } }">
              El derecho, bajo una mirada crítica.
            </h1>
            <p class="text-[0.95rem] max-w-2xl m-0" style="color:var(--text-muted)"
              v-motion :initial="{ opacity: 0, y: 16 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 150 } }">
              Jurisprudencia, actualidad y análisis para profundizar tu criterio jurídico.
            </p>
          </div>

          <!-- Buscador -->
          <div class="mt-5 w-full relative"
            v-motion :initial="{ opacity: 0, y: 14 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 220 } }">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="busqueda" type="text" placeholder="Buscar por tema o palabra clave"
              class="search-input" @keyup.enter="buscar" />
          </div>

          <!-- Categorías -->
          <!-- Máximo 2 filas; si no entran, se desplazan con las flechas -->
          <div class="flex items-center gap-2 mt-3"
            v-motion :initial="{ opacity: 0, y: 14 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 280 } }">
            <button v-show="pillsDesborde" type="button" class="pills-flecha" :disabled="!pillsIzq"
              aria-label="Ver categorías anteriores" @click="moverPills(-1)">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div ref="pillsScroll" @scroll="actualizarFlechas"
              :class="['pills-scroll flex-1 min-w-0', pillsIzq ? 'fade-izq' : '', pillsDer ? 'fade-der' : '']">
              <div ref="pillsInner" class="flex flex-wrap gap-3">
                <button type="button" @click="seleccionarCategoria(null)"
                  v-motion :hovered="{ scale: 1.06 }" :tapped="{ scale: 0.96 }"
                  :class="['pill-btn', !categoriaActiva ? 'pill-btn-active' : '']">Todas</button>
                <button v-for="c in categorias" :key="c.id ?? c.ID" type="button" @click="seleccionarCategoria(c.id ?? c.ID)"
                  v-motion :hovered="{ scale: 1.06 }" :tapped="{ scale: 0.96 }"
                  :class="['pill-btn whitespace-nowrap', categoriaActiva === Number(c.id ?? c.ID) ? 'pill-btn-active' : '']">
                  {{ c.descripcion ?? c.DESCRIPCION }}
                </button>
              </div>
            </div>
            <button v-show="pillsDesborde" type="button" class="pills-flecha" :disabled="!pillsDer"
              aria-label="Ver más categorías" @click="moverPills(1)">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-[1140px] mx-auto px-4 sm:px-6 pb-10">

        <!-- Esqueleto del destacado mientras carga (misma forma: imagen + texto) -->
        <div v-if="loading && !destacada && paginaActual === 1 && !busquedaActiva" class="mt-6 grid md:grid-cols-[5fr_6fr] rounded-2xl overflow-hidden"
          style="border:1px solid var(--border)" aria-hidden="true">
          <div class="sk h-[180px] md:h-[220px] rounded-none" />
          <div class="p-5 sm:p-6 flex flex-col justify-center gap-3">
            <span class="sk h-5 w-24 rounded-full" />
            <span class="sk h-3 w-32" />
            <span class="sk h-7 w-full" />
            <span class="sk h-7 w-2/3" />
            <span class="sk h-4 w-full" />
            <span class="sk h-4 w-4/5" />
            <span class="sk h-4 w-28 mt-1" />
          </div>
        </div>

        <!-- Destacado -->
        <div v-else-if="destacada && paginaActual === 1 && !busquedaActiva" class="mt-6"
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }">
          <router-link :to="`/publicaciones/${destacada.slug}`"
            class="group grid md:grid-cols-[5fr_6fr] gap-0 rounded-2xl overflow-hidden no-underline card-hover">
            <div class="relative h-[180px] md:h-full md:min-h-[220px] overflow-hidden">
              <img v-if="destacada.imagen" :src="imagenUrl(destacada.imagen)" :alt="destacada.titulo"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div v-else class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, rgba(231,31,179,0.15), rgba(24,100,255,0.15));">
                <svg class="w-14 h-14 text-brand-blue/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
              </div>
            </div>
            <div class="destacado-panel p-5 sm:p-6 flex flex-col justify-center gap-2">
              <span class="etiqueta-destacado self-start">Destacado</span>
              <span class="etiqueta-blog self-start">{{ categoriaLabel(destacada.idCategoria) }}</span>
              <h2 class="text-lg sm:text-[1.25rem] leading-tight font-extrabold m-0 mt-0.5" style="color:var(--text)">{{ destacada.titulo }}</h2>
              <p class="text-[0.85rem] leading-relaxed m-0 line-clamp-2" style="color:var(--text-muted)">{{ destacada.resumen }}</p>
              <div class="flex items-center gap-1.5 text-xs" style="color:var(--text-muted)">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ destacada.tiempoLectura || 1 }} min de lectura
              </div>
              <span class="boton-destacado self-start mt-1">
                Leer análisis
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </div>
          </router-link>
        </div>

        <!-- Listado -->
        <div class="relative z-30 flex items-center justify-between gap-3 mt-8 mb-4"
          v-motion :initial="{ opacity: 0, y: 10 }" :visible-once="{ opacity: 1, y: 0, transition: { duration: 350 } }">
          <h2 class="text-lg sm:text-xl font-bold m-0" style="color:var(--text)">Últimas publicaciones</h2>

          <div class="orden-wrap" v-click-outside="() => (ordenAbierto = false)">
            <button type="button" class="orden-btn" :aria-expanded="ordenAbierto" aria-haspopup="listbox"
              @click="ordenAbierto = !ordenAbierto">
              {{ ordenActualLabel }}
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': ordenAbierto }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <transition name="orden-menu">
              <ul v-if="ordenAbierto" class="orden-menu" role="listbox">
                <li v-for="o in ORDENES" :key="o.valor" role="option" :aria-selected="orden === o.valor"
                  :class="['orden-opcion', orden === o.valor ? 'orden-opcion-activa' : '']"
                  @click="cambiarOrden(o.valor)">
                  {{ o.label }}
                  <svg v-if="orden === o.valor" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </li>
              </ul>
            </transition>
          </div>
        </div>

        <!-- Esqueleto de tarjetas mientras carga (mismo alto que las reales) -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true" aria-label="Cargando publicaciones">
          <div v-for="n in 8" :key="n" class="overflow-hidden" style="border:1px solid var(--border); background:var(--bg-card); border-radius:18px">
            <div class="sk h-[150px] rounded-none" />
            <div class="p-4 flex flex-col gap-2">
              <span class="sk h-6 w-36 rounded-full" />
              <span class="sk h-5 w-full" />
              <span class="sk h-5 w-3/4" />
              <span class="sk h-3.5 w-full mt-1" />
              <span class="sk h-3.5 w-5/6" />
              <div class="flex items-center justify-between pt-2">
                <span class="sk h-3.5 w-28" />
                <span class="sk w-10 h-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!publicaciones.length" class="text-center py-16" style="color:var(--text-muted)">
          Todavía no hay publicaciones en esta categoría.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="(p, i) in publicaciones" :key="p.slug"
            v-motion
            :initial="{ opacity: 0, y: 18 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, delay: (i % 6) * 70 } }">
            <PublicacionCard :publicacion="p" :categorias="categorias" />
          </div>
        </div>

        <!-- Paginador -->
        <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-1 mt-8">
          <button class="pag-btn-pub" :disabled="paginaActual === 1" @click="irAPagina(paginaActual - 1)">‹</button>
          <button v-for="p in numerosPagina" :key="p" @click="irAPagina(p)"
            :class="['pag-btn-pub', p === paginaActual ? 'pag-btn-pub-active' : '']">{{ p }}</button>
          <button class="pag-btn-pub" :disabled="paginaActual === totalPaginas" @click="irAPagina(paginaActual + 1)">›</button>
        </div>

        <!-- CTA -->
        <div class="cta-banner rounded-2xl mt-10 px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div class="flex items-center gap-4">
            <div class="cta-banner-icono w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold m-0" style="color:var(--text)">Lleva tu análisis a la fuente.</h3>
              <p class="text-sm m-0 mt-0.5" style="color:var(--text-muted)">Explora jurisprudencia penal seleccionada en Juris Search.</p>
            </div>
          </div>
          <router-link to="/#mi-seccion-planes" class="boton-destacado group no-underline flex-shrink-0">
            Conocer la plataforma
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </router-link>
        </div>

      </div>
    </main>

    <footer-component />
  </div>
</template>

<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import Breadcrumb from "@/components/Publicaciones/Breadcrumb.vue";
import PublicacionCard from "@/components/Publicaciones/PublicacionCard.vue";
import PublicacionesProxy from "@/proxies/PublicacionesProxy";
import { urlDeMedia } from "@/utils/mediaUrl";

const PER_PAGE = 12;

export default {
  name: "Publicaciones",
  components: { Navbar, FooterComponent, Breadcrumb, PublicacionCard },
  data() {
    return {
      loading: true,
      categorias: [],
      destacada: null,
      publicaciones: [],
      busqueda: '',
      busquedaActiva: false,
      categoriaActiva: null,
      paginaActual: 1,
      totalRegistros: 0,
      debounceTimer: null,
      orden: 'recientes',
      ordenAbierto: false,
      pillsDesborde: false,
      pillsIzq: false,
      pillsDer: false,
      ORDENES: [
        { valor: 'recientes', label: 'Más recientes' },
        { valor: 'antiguas', label: 'Más antiguas' },
        { valor: 'lectura-corta', label: 'Lectura más corta' },
        { valor: 'lectura-larga', label: 'Lectura más larga' },
      ],
    };
  },
  directives: {
    // Cierra el menú de orden al hacer clic fuera de él
    clickOutside: {
      mounted(el, binding) {
        el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value(e); };
        document.addEventListener('click', el._clickOutside);
      },
      unmounted(el) { document.removeEventListener('click', el._clickOutside); },
    },
  },
  computed: {
    ordenActualLabel() { return this.ORDENES.find(o => o.valor === this.orden)?.label ?? 'Más recientes'; },
    totalPaginas() { return Math.max(1, Math.ceil(this.totalRegistros / PER_PAGE)); },
    numerosPagina() {
      const total = this.totalPaginas, curr = this.paginaActual;
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
      let start = Math.max(1, curr - 2), end = Math.min(total, curr + 2);
      if (curr - 2 < 1) end = Math.min(total, end + (2 - curr + 1));
      if (curr + 2 > total) start = Math.max(1, start - (curr + 2 - total));
      const pages = []; for (let i = start; i <= end; i++) pages.push(i); return pages;
    },
  },
  methods: {
    imagenUrl(path) { return urlDeMedia(path); },
    categoriaLabel(idCategoria) {
      const cat = this.categorias.find(c => Number(c.id ?? c.ID) === Number(idCategoria));
      return cat ? (cat.descripcion ?? cat.DESCRIPCION) : 'Juris Search';
    },
    async cargarCategorias() {
      const r = await PublicacionesProxy.categoriasPublicas();
      this.categorias = r?.DATA ?? r ?? [];
    },
    async cargarDestacada() {
      const r = await PublicacionesProxy.destacada();
      this.destacada = r?.DATA ?? r ?? null;
    },
    async cargarPublicaciones() {
      this.loading = true;
      try {
        const r = await PublicacionesProxy.listPublicas({
          ROWS: PER_PAGE,
          INIT: (this.paginaActual - 1) * PER_PAGE,
          DESC: this.busqueda || undefined,
          idCategoria: this.categoriaActiva || undefined,
          orden: this.orden,
          // El destacado ya se muestra arriba: no se repite en la lista (salvo al buscar, que lo oculta arriba)
          excluir: !this.busquedaActiva && this.destacada ? this.destacada.id : undefined,
        });
        const payload = r?.DATA ?? r;
        this.publicaciones = payload?.data ?? [];
        this.totalRegistros = payload?.total ?? 0;
      } catch {
        this.publicaciones = [];
      } finally {
        this.loading = false;
      }
    },
    // Ensancha la fila de categorías lo justo para que entren en 2 filas;
    // lo que no cabe en pantalla se recorre con las flechas.
    ajustarPills() {
      const scroll = this.$refs.pillsScroll, inner = this.$refs.pillsInner;
      if (!scroll || !inner) return;
      const filas = () => new Set([...inner.children].map(el => el.offsetTop)).size;
      inner.style.width = '';
      if (filas() > 2) {
        const gap = 12;
        const total = [...inner.children].reduce((acc, el) => acc + el.offsetWidth + gap, 0);
        let ancho = Math.max(scroll.clientWidth, Math.ceil(total / 2));
        inner.style.width = `${ancho}px`;
        while (filas() > 2 && ancho < total + gap) { ancho += 40; inner.style.width = `${ancho}px`; }
      }
      this.actualizarFlechas();
    },
    actualizarFlechas() {
      const el = this.$refs.pillsScroll;
      if (!el) return;
      this.pillsDesborde = el.scrollWidth > el.clientWidth + 2;
      this.pillsIzq = el.scrollLeft > 2;
      this.pillsDer = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    },
    moverPills(dir) {
      const el = this.$refs.pillsScroll;
      el?.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
    },
    seleccionarCategoria(id) {
      this.categoriaActiva = id ? Number(id) : null;
      this.paginaActual = 1;
      this.cargarPublicaciones();
    },
    cambiarOrden(valor) {
      this.ordenAbierto = false;
      if (this.orden === valor) return;
      this.orden = valor;
      this.paginaActual = 1;
      this.cargarPublicaciones();
    },
    buscar() {
      this.busquedaActiva = !!this.busqueda;
      this.paginaActual = 1;
      this.cargarPublicaciones();
    },
    irAPagina(p) {
      if (p < 1 || p > this.totalPaginas) return;
      this.paginaActual = p;
      this.cargarPublicaciones();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  watch: {
    busqueda() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.buscar(), 400);
    },
  },
  async mounted() {
    // Las categorías van primero (es una lista corta y rápida) para que las
    // tarjetas nunca pinten antes de tener el nombre de categoría listo.
    await this.cargarCategorias();
    this.$nextTick(this.ajustarPills);
    window.addEventListener('resize', this.ajustarPills);
    // El destacado va primero: la lista necesita saber cuál excluir
    await this.cargarDestacada().catch(() => { this.destacada = null; });
    await this.cargarPublicaciones();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.ajustarPills);
  },
};
</script>

<style scoped>
/* Esqueleto de carga: bloque gris con un brillo que lo recorre */
.sk {
  display: block;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--border) 0%, var(--bg-card) 50%, var(--border) 100%);
  background-size: 200% 100%;
  animation: sk-brillo 1.4s ease-in-out infinite;
  opacity: 0.7;
}
.sk.rounded-none { border-radius: 0; }
.sk.rounded-full { border-radius: 9999px; }
@keyframes sk-brillo {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .sk { animation: none; }
}
.publicaciones-hero {
  background: var(--bg-card);
}
.hero-orb {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
  filter: blur(2px);
}
.hero-orb-1 {
  width: 260px; height: 260px; top: -120px; right: 8%;
  background: radial-gradient(circle, rgba(0,0,0,0.035), transparent 70%);
  animation: ctaFloat 20s ease-in-out infinite;
}
.hero-orb-2 {
  width: 220px; height: 220px; top: -60px; left: 4%;
  background: radial-gradient(circle, rgba(0,0,0,0.03), transparent 70%);
  animation: ctaFloat 16s ease-in-out infinite reverse;
}
.hero-orb-3 {
  width: 140px; height: 140px; top: 40px; left: 45%;
  background: radial-gradient(circle, rgba(0,0,0,0.025), transparent 70%);
  animation: ctaFloat 24s ease-in-out 3s infinite;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 2.75rem;
  padding: 0 1rem 0 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: var(--brand-blue, #1864ff); box-shadow: 0 0 0 3px rgba(24,100,255,0.12); }

/* Banner inferior */
.cta-banner { background: #f4f0fd; border: 1px solid #ebe4fb; }
.dark .cta-banner { background: rgba(124, 92, 255, 0.1); border-color: rgba(124, 92, 255, 0.22); }
.cta-banner-icono { background: #fde4f4; color: #e71fb3; }
.dark .cta-banner-icono { background: rgba(231, 31, 179, 0.16); color: #ff8bd6; }

/* Selector de orden del listado */
.orden-wrap { position: relative; }
.orden-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: 9999px;
  background: var(--bg-card); color: var(--text);
  border: 1px solid var(--border);
  font-size: 13px; font-weight: 500;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.orden-btn:hover { border-color: rgba(124, 92, 255, 0.4); }
.orden-menu {
  position: absolute; right: 0; top: calc(100% + 6px); z-index: 20;
  min-width: 190px; margin: 0; padding: 6px; list-style: none;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}
.orden-opcion {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 8px 12px; border-radius: 10px; cursor: pointer;
  font-size: 13px; color: var(--text);
}
.orden-opcion:hover { background: #f3f0fc; }
.dark .orden-opcion:hover { background: rgba(124, 92, 255, 0.14); }
.orden-opcion-activa { color: #6d3fe0; font-weight: 600; }
.dark .orden-opcion-activa { color: #c4b2ff; }
.orden-menu-enter-active, .orden-menu-leave-active { transition: opacity 0.15s, transform 0.15s; }
.orden-menu-enter-from, .orden-menu-leave-to { opacity: 0; transform: translateY(-4px); }

/* Etiqueta del encabezado ("Blog Juris Search") */
.etiqueta-blog {
  display: inline-flex; align-items: center;
  padding: 6px 16px; border-radius: 9999px;
  background: #ede6fd; color: #6d3fe0;
  font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
}
.dark .etiqueta-blog { background: rgba(124, 92, 255, 0.18); color: #c4b2ff; }

/* Tarjeta destacada */
.destacado-panel { background: linear-gradient(180deg, #f8f5ff 0%, #f1ecfd 100%); }
.dark .destacado-panel { background: linear-gradient(180deg, rgba(124, 92, 255, 0.12) 0%, rgba(124, 92, 255, 0.06) 100%); }
.etiqueta-destacado {
  display: inline-flex; align-items: center;
  padding: 5px 14px; border-radius: 9999px;
  background: #fff0f8; color: #e71fb3; border: 1px solid #f9c4e6;
  font-size: 11.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
}
.dark .etiqueta-destacado { background: rgba(231, 31, 179, 0.12); border-color: rgba(231, 31, 179, 0.35); color: #ff8bd6; }
.boton-destacado {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 10px 22px; border-radius: 9999px;
  background: linear-gradient(135deg, #e71fb3, #1864ff);
  color: #ffffff; font-size: 14px; font-weight: 600;
  box-shadow: 0 8px 20px rgba(110, 60, 230, 0.28);
  transition: box-shadow 0.2s, transform 0.2s;
}
.group:hover .boton-destacado { box-shadow: 0 10px 24px rgba(110, 60, 230, 0.38); transform: translateY(-1px); }

/* Fila de categorías desplazable (sin barra visible) */
.pills-scroll {
  overflow-x: auto; overflow-y: hidden;
  /* aire para el zoom y la sombra de las píldoras (el overflow las recortaría);
     el margen negativo compensa ese aire para no mover el resto del layout */
  padding: 8px 8px 24px;
  margin: -2px -4px -16px;
  scrollbar-width: none;
}
.pills-scroll::-webkit-scrollbar { display: none; }
.pills-scroll.fade-der { -webkit-mask-image: linear-gradient(90deg, #000 92%, transparent); mask-image: linear-gradient(90deg, #000 92%, transparent); }
.pills-scroll.fade-izq { -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%); mask-image: linear-gradient(90deg, transparent, #000 8%); }
.pills-scroll.fade-izq.fade-der { -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.pills-flecha {
  flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 9999px;
  background: var(--bg-card); color: #1864ff; border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  transition: background 0.2s, color 0.2s, opacity 0.2s;
}
.pills-flecha:hover:not(:disabled) { background: #1864ff; color: #fff; border-color: #1864ff; }
.pills-flecha:disabled { opacity: 0.35; cursor: default; }

/* Filtros por categoría: fondo lavanda suave, sin borde; el activo con degradado */
.pill-btn {
  @apply px-4 py-2 rounded-full text-[13px] font-medium transition-all;
  background: #f3f0fc;
  color: #3b3b52;
  border: none;
}
.pill-btn:hover { background: #e9e3fa; color: #1f1f33; }
.pill-btn-active {
  background: linear-gradient(135deg, #e71fb3, #1864ff);
  color: #fff !important;
  box-shadow: 0 6px 16px rgba(110, 60, 230, 0.28);
}
.pill-btn-active:hover { background: linear-gradient(135deg, #e71fb3, #1864ff); }
.dark .pill-btn { background: rgba(124, 92, 255, 0.14); color: #d6d3e6; }
.dark .pill-btn:hover { background: rgba(124, 92, 255, 0.24); color: #ffffff; }
.dark .pill-btn-active { color: #fff !important; }

.pag-btn-pub {
  @apply w-9 h-9 rounded-lg border text-sm font-medium transition-all;
  border-color: var(--border);
  color: var(--text-muted);
  background: var(--bg-card);
}
.pag-btn-pub:hover:not(:disabled) { border-color: var(--brand-blue, #1864ff); color: var(--brand-blue, #1864ff); }
.pag-btn-pub:disabled { opacity: 0.4; cursor: not-allowed; }
.pag-btn-pub-active {
  background: linear-gradient(135deg, #e71fb3, #1864ff);
  color: #fff !important;
  border-color: transparent;
}
</style>
