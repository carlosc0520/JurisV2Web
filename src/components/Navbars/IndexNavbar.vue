<template>
  <section :class="['sticky top-0 z-[1000] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
    !isNavbarVisible ? '-translate-y-full' : '']">

    <!-- Banner Premium -->
    <transition name="slide-down">
      <div v-if="toggleShowAlert"
        class="bg-gradient-to-r from-[#c4188a] via-brand-pink to-brand-blue py-2.5 px-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent banner-shimmer pointer-events-none"></div>
        <div class="max-w-[1400px] mx-auto flex items-center justify-center gap-3 relative z-[1]">
          <svg class="flex-shrink-0 banner-star w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-white text-[0.82rem] font-medium hidden sm:inline">Accede a más funcionalidades con el</span>
          <button @click="scrollToSection('mi-seccion-planes')"
            class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-brand-blue border-0 rounded-full text-[0.8rem] font-bold cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            Plan Premium
            <img src="../../assets/img/resources/Corona.png" alt="corona" class="w-4 h-4" />
          </button>
          <button @click="closeBanner"
            class="absolute right-4 bg-white/20 border-0 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer transition-all text-white hover:bg-white/30 hover:rotate-90 duration-200">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Navbar Principal -->
    <nav :class="['relative z-[100] transition-all duration-300',
      isScrolled
        ? 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-white/20 dark:border-white/5'
        : 'bg-white dark:bg-[#1a202c] border-b border-slate-100 dark:border-[#2d3748]']">
      <div class="max-w-[1400px] mx-auto px-8 md:px-6 sm:px-4 flex items-center justify-between gap-6"
        :class="isScrolled ? 'py-3' : 'py-4'">

        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 transition-all duration-200 hover:opacity-80 hover:scale-[1.02]">
          <img :src="logoJuris" alt="Juris Search"
            :class="['w-auto block transition-all duration-300', isScrolled ? 'h-9' : 'h-[42px]']" />
        </router-link>

        <!-- Links Desktop -->
        <ul class="hidden lg:flex list-none m-0 p-0 items-center gap-1">
          <li>
            <router-link to="/"
              :class="['nav-link', route.path === '/' ? 'nav-link--active' : '']">
              Inicio
            </router-link>
          </li>
          <li>
            <a href="#conoce-proposito" @click.prevent="scrollToSection('conoce-proposito')"
              class="nav-link cursor-pointer">
              Conócenos
            </a>
          </li>
          <!-- Blog: al pasar el mouse muestra sus categorías -->
          <li class="nav-blog" @mouseenter="abrirBlog" @mouseleave="cerrarBlog" @focusin="abrirBlog"
            @focusout="alSalirFocoBlog" @keydown.esc="menuBlog = false">
            <button type="button" aria-haspopup="true" :aria-expanded="menuBlog && categoriasBlog.length > 0"
              :class="['nav-link', route.path.startsWith('/blog') ? 'nav-link--active' : '']" @click="clicBlog">
              Blog
              <svg v-if="categoriasBlog.length" :class="['nav-caret', menuBlog ? 'nav-caret--abierto' : '']" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <transition name="menu-blog">
              <div v-if="categoriasBlog.length" v-show="menuBlog" class="menu-blog" role="menu">
                <div :class="['menu-blog-panel', categoriasBlog.length > 8 ? 'menu-blog-panel--doble' : '']">
                  <div class="menu-blog-lista">
                    <router-link v-for="c in categoriasBlog" :key="c.slug" :to="`/blog/categoria/${c.slug}`" role="menuitem"
                      :class="['menu-blog-item', categoriaBlogActiva(c.slug) ? 'menu-blog-item--activo' : '']"
                      @click="menuBlog = false">
                      <span class="menu-blog-icono" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                      </span>
                      <span class="menu-blog-nombre">{{ c.nombre }}</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </transition>
          </li>
          <li>
            <router-link to="/contacto"
              :class="['nav-link', route.path.startsWith('/contacto') ? 'nav-link--active' : '']">
              Contáctanos
            </router-link>
          </li>
        </ul>

        <!-- Botón login Desktop -->
        <div class="hidden lg:flex items-center gap-3 flex-shrink-0">
          <dark-mode-toggle />
          <router-link to="/auth/login" active-class="" exact-active-class="" class="login-btn">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
            </svg>
            Iniciar sesión
          </router-link>
        </div>

        <!-- Hamburguesa Mobile -->
        <button class="flex flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-0 cursor-pointer p-0 z-[101] lg:hidden"
          @click="setNavbarOpen">
          <span :class="['w-[22px] h-[2.5px] rounded-full transition-all duration-300 origin-top-left',
            navbarOpen ? 'bg-brand-blue rotate-45 translate-x-[3px] -translate-y-[3px]' : 'bg-slate-700 dark:bg-slate-300']"></span>
          <span :class="['w-[22px] h-[2.5px] rounded-full transition-all duration-300',
            navbarOpen ? 'opacity-0 scale-x-0' : 'bg-slate-700 dark:bg-slate-300']"></span>
          <span :class="['w-[22px] h-[2.5px] rounded-full transition-all duration-300 origin-bottom-left',
            navbarOpen ? 'bg-brand-blue -rotate-45 translate-x-[3px] translate-y-[3px]' : 'bg-slate-700 dark:bg-slate-300']"></span>
        </button>
      </div>
    </nav>

    <!-- Menú Mobile (backdrop + panel) -->
    <transition name="mobile-menu">
      <div v-if="navbarOpen" class="fixed inset-0 z-[99]" @click.self="navbarOpen = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="absolute right-0 top-0 bottom-0 w-[min(320px,85vw)] bg-white dark:bg-[#0f172a] shadow-[0_0_40px_rgba(0,0,0,0.2)] flex flex-col">
          <!-- Header del panel -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
            <img :src="logoJuris" alt="Juris Search" class="h-8 w-auto" />
            <button @click="navbarOpen = false"
              class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center transition-all hover:bg-brand-pink/10 hover:text-brand-pink">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Links -->
          <ul class="list-none m-0 p-5 flex flex-col gap-1.5 flex-1 overflow-y-auto">
            <li>
              <router-link to="/" @click="navbarOpen = false"
                :class="['flex items-center gap-3 px-4 py-3.5 text-[0.95rem] font-semibold no-underline rounded-xl transition-all',
                  route.path === '/'
                    ? 'bg-gradient-to-br from-brand-pink to-brand-blue text-white shadow-[0_4px_12px_rgba(231,31,179,0.3)]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-brand-blue/[0.07] hover:text-brand-blue hover:translate-x-1']">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Inicio
              </router-link>
            </li>
            <li>
              <a href="#conoce-proposito" @click.prevent="scrollToSection('conoce-proposito'); navbarOpen = false"
                class="flex items-center gap-3 px-4 py-3.5 text-[0.95rem] font-semibold no-underline rounded-xl text-slate-700 dark:text-slate-200 hover:bg-brand-blue/[0.07] hover:text-brand-blue hover:translate-x-1 transition-all cursor-pointer">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
                Conócenos
              </a>
            </li>
            <li>
              <button type="button" :aria-expanded="blogMovilAbierto" @click="clicBlogMovil"
                :class="['w-full flex items-center gap-3 px-4 py-3.5 text-[0.95rem] font-semibold rounded-xl transition-all text-left',
                  route.path.startsWith('/blog')
                    ? 'bg-gradient-to-br from-brand-pink to-brand-blue text-white shadow-[0_4px_12px_rgba(231,31,179,0.3)]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-brand-blue/[0.07] hover:text-brand-blue']">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
                Blog
                <svg class="w-4 h-4 ml-auto transition-transform" :class="{ 'rotate-180': blogMovilAbierto }" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <ul v-if="blogMovilAbierto && categoriasBlog.length" class="list-none m-0 p-0 pl-11 pr-2 pb-1">
                <li v-for="c in categoriasBlog" :key="c.slug">
                  <router-link :to="`/blog/categoria/${c.slug}`" @click="navbarOpen = false"
                    :class="['block px-3 py-2 text-sm font-semibold no-underline rounded-lg transition-colors',
                      categoriaBlogActiva(c.slug) ? 'text-brand-pink' : 'text-slate-600 dark:text-slate-300 hover:text-brand-blue hover:bg-brand-blue/[0.07]']">
                    {{ c.nombre }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li>
              <router-link to="/contacto" @click="navbarOpen = false"
                :class="['flex items-center gap-3 px-4 py-3.5 text-[0.95rem] font-semibold no-underline rounded-xl transition-all',
                  route.path === '/contacto'
                    ? 'bg-gradient-to-br from-brand-pink to-brand-blue text-white shadow-[0_4px_12px_rgba(231,31,179,0.3)]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-brand-blue/[0.07] hover:text-brand-blue hover:translate-x-1']">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Contáctanos
              </router-link>
            </li>
          </ul>

          <!-- CTA Mobile -->
          <div class="p-5 border-t border-slate-100 dark:border-slate-700">
            <router-link to="/auth/login" @click="navbarOpen = false" active-class="" exact-active-class=""
              class="login-btn w-full justify-center py-3.5 text-[0.95rem] rounded-xl">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
              </svg>
              Iniciar sesión
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import logoJuris from "@/assets/img/resources/logo-jurissearch.png";
import { useRoute } from "vue-router";
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import PublicacionesProxy from "@/proxies/PublicacionesProxy";
import { slugDe } from "@/utils/slug";

// La barra se monta en cada página pública: las categorías del blog se piden una sola vez.
let categoriasBlogCache = null;

export default {
  components: { DarkModeToggle },
  setup() {
    const route = useRoute();
    return { route };
  },
  data() {
    return {
      logoJuris,
      navbarOpen: false,
      toggleShowAlert: localStorage.getItem('premiumBannerClosed') !== 'true',
      lastScrollPosition: 0,
      isNavbarVisible: true,
      isScrolled: false,
      menuBlog: false,
      blogMovilAbierto: false,
      categoriasBlog: [],
      cierreBlog: null,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.cargarCategoriasBlog();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    clearTimeout(this.cierreBlog);
  },
  watch: {
    'route.fullPath'() { this.menuBlog = false; },
  },
  methods: {
    setNavbarOpen() { this.navbarOpen = !this.navbarOpen; },
    async cargarCategoriasBlog() {
      try {
        if (!categoriasBlogCache) {
          categoriasBlogCache = PublicacionesProxy.categoriasPublicas().then(r =>
            (r?.DATA ?? r ?? [])
              .map(c => ({ nombre: c.descripcion ?? c.DESCRIPCION, slug: slugDe(c.descripcion ?? c.DESCRIPCION) }))
              .filter(c => c.slug));
        }
        this.categoriasBlog = await categoriasBlogCache;
      } catch {
        categoriasBlogCache = null; // se reintenta en la próxima página
        this.categoriasBlog = [];
      }
    },
    abrirBlog() { clearTimeout(this.cierreBlog); this.menuBlog = true; },
    // Sin categorías no hay menú que desplegar: "Blog" lleva directo a la página del blog
    clicBlog() {
      if (this.categoriasBlog.length) this.abrirBlog();
      else this.$router.push('/blog');
    },
    clicBlogMovil() {
      if (this.categoriasBlog.length) this.blogMovilAbierto = !this.blogMovilAbierto;
      else { this.navbarOpen = false; this.$router.push('/blog'); }
    },
    // Pequeña espera al salir: cruzar del enlace al panel no lo cierra
    cerrarBlog() {
      clearTimeout(this.cierreBlog);
      this.cierreBlog = setTimeout(() => { this.menuBlog = false; }, 150);
    },
    alSalirFocoBlog(e) { if (!e.currentTarget.contains(e.relatedTarget)) this.cerrarBlog(); },
    categoriaBlogActiva(slug) { return this.route.path === `/blog/categoria/${slug}`; },
    scrollToSection(seccion = "conoce-proposito") {
      const section = document.querySelector("#" + seccion);
      // La sección solo existe en Inicio: desde otra página se navega a "/#seccion"
      // (el scrollBehavior del router hace el desplazamiento cuando ya existe).
      if (section) section.scrollIntoView({ behavior: "smooth" });
      else this.$router.push({ path: "/", hash: "#" + seccion });
      this.navbarOpen = false;
    },
    closeBanner() {
      this.toggleShowAlert = false;
      localStorage.setItem('premiumBannerClosed', 'true');
    },
    handleScroll() {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      this.isScrolled = current > 30;
      if (current < 10) { this.isNavbarVisible = true; this.lastScrollPosition = current; return; }
      if (current < this.lastScrollPosition) this.isNavbarVisible = true;
      else if (current > this.lastScrollPosition && current > 100) this.isNavbarVisible = false;
      this.lastScrollPosition = current;
    },
  },
};
</script>

<style>
.dark .nav-link:not(.nav-link--active) { color: #f1f5f9 !important; }
</style>

<style scoped>
/* ── Desktop nav links ─────────────────────────────────── */
.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  transition: color 0.18s ease;
  white-space: nowrap;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1.1rem;
  right: 1.1rem;
  height: 2.5px;
  border-radius: 99px;
  background: linear-gradient(90deg, #e71fb3, #1864ff);
  opacity: 0;
  transform: scaleX(0.4);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.nav-link:hover {
  color: #e71fb3;
}
.nav-link:hover::after {
  opacity: 0.4;
  transform: scaleX(1);
}
.nav-link--active {
  color: #e71fb3 !important;
}
.nav-link--active::after {
  opacity: 1 !important;
  transform: scaleX(1) !important;
}

/* ── Botón login ────────────────────────────────────────── */
.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.4rem;
  background: linear-gradient(135deg, #e71fb3, #1864ff);
  color: #ffffff !important;  /* !important: evita que estilos globales de <a> lo pisen */
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none !important;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(231,31,179,0.35);
  white-space: nowrap;
}
.login-btn:hover {
  color: #ffffff !important;
  box-shadow: 0 6px 22px rgba(231,31,179,0.50);
  transform: translateY(-1px);
  opacity: 0.92;
}
.login-btn svg {
  color: #ffffff;
  stroke: #ffffff;
}

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
.banner-shimmer { animation: shimmer 4s ease-in-out infinite; }

@keyframes banner-pulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50%       { transform: scale(1.15) rotate(10deg); }
}
.banner-star { animation: banner-pulse 2.5s ease-in-out infinite; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-100%); opacity: 0; }

.mobile-menu-enter-active, .mobile-menu-leave-active { transition: opacity 0.25s ease; }
.mobile-menu-enter-active > div:last-child, .mobile-menu-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; }
.mobile-menu-enter-from > div:last-child, .mobile-menu-leave-to > div:last-child {
  transform: translateX(100%);
}

/* ── Menú de categorías del blog ───────────────────────── */
.nav-blog { position: relative; }
.nav-caret { width: 14px; height: 14px; margin-left: 4px; transition: transform 0.2s ease; }
.nav-caret--abierto { transform: rotate(180deg); }
.menu-blog {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 12px; /* puente: el mouse cruza al panel sin cerrarlo */
  z-index: 60;
}
.menu-blog-panel {
  position: relative;
  width: 280px;
  padding: 6px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  box-shadow: 0 18px 40px -12px rgba(15, 23, 42, 0.2), 0 2px 6px rgba(15, 23, 42, 0.05);
}
.menu-blog-panel--doble { width: 520px; }
/* Pestaña que apunta a "Blog" */
.menu-blog-panel::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  width: 10px;
  height: 10px;
  transform: translateX(-50%) rotate(45deg);
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
}
.menu-blog-lista { display: grid; grid-template-columns: 1fr; }
.menu-blog-panel--doble .menu-blog-lista { grid-template-columns: 1fr 1fr; }
.menu-blog-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--text);
}
.menu-blog-icono {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #e71fb3;
  background: rgba(231, 31, 179, 0.08);
}
.menu-blog-icono svg { width: 14px; height: 14px; }
.menu-blog-nombre { flex: 1; min-width: 0; }
/* La categoría que se está viendo */
.menu-blog-item--activo { color: #e71fb3; }
.menu-blog-enter-active, .menu-blog-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.menu-blog-enter-from, .menu-blog-leave-to { opacity: 0; transform: translate(-50%, 6px); }
</style>
