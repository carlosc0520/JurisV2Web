<template>
  <div class="flex flex-col min-h-screen" style="background:var(--bg-card)">
    <navbar />

    <!-- Vista previa de un borrador: misma página, solo un aviso flotante que no altera el diseño -->
    <div v-if="publicacion?.esPrevia" class="previa-aviso" role="status">
      <span class="previa-punto" />
      Vista previa · no publicada<span v-if="expiraTexto" class="hidden sm:inline"> · expira {{ expiraTexto }}</span>
    </div>

    <main class="flex-1">
      <!-- Esqueleto con la misma forma del artículo: la página no cambia de alto al cargar -->
      <div v-if="loading" class="max-w-[1240px] mx-auto px-4 sm:px-6 py-6" aria-busy="true" aria-label="Cargando publicación"
        v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { duration: 250 } }">
        <div class="flex gap-2">
          <span class="sk h-3 w-12" /><span class="sk h-3 w-24" /><span class="sk h-3 w-32" />
        </div>
        <div class="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 mt-4">
          <div class="min-w-0">
            <div class="rounded-2xl p-6 sm:p-7" style="border:1px solid var(--border)">
              <span class="sk h-6 w-36 rounded-full" />
              <span class="sk h-9 w-full mt-4" />
              <span class="sk h-9 w-2/3 mt-2" />
              <span class="sk h-5 w-3/4 mt-4" />
              <div class="flex justify-between mt-6"><span class="sk h-4 w-56" /><span class="sk h-8 w-44 rounded-full" /></div>
            </div>
            <div class="sk mt-4 rounded-2xl w-full h-[240px] sm:h-[340px]" />
            <div class="flex flex-col gap-3 mt-8">
              <span v-for="n in 8" :key="n" class="sk h-4" :style="{ width: n % 4 === 0 ? '65%' : '100%' }" />
            </div>
          </div>
          <aside class="hidden lg:flex flex-col gap-5">
            <div class="sk rounded-2xl h-56" />
            <div class="sk rounded-2xl h-52" />
          </aside>
        </div>
      </div>

      <div v-else-if="!publicacion" class="max-w-xl mx-auto text-center py-24 px-4">
        <h1 class="text-xl font-bold mb-2" style="color:var(--text)">{{ $route.params.token ? 'Esta vista previa ya no está disponible' : 'No encontramos esta publicación' }}</h1>
        <p class="text-sm mb-5" style="color:var(--text-muted)">{{ $route.params.token ? 'Los enlaces de vista previa expiran a las 24 horas. Genera uno nuevo desde el editor.' : 'Puede que haya sido retirada o el enlace esté mal escrito.' }}</p>
        <router-link to="/publicaciones" class="text-sm font-semibold text-brand-blue">Ver todas las publicaciones →</router-link>
      </div>

      <div v-else class="max-w-[1240px] mx-auto px-4 sm:px-6 py-6">

        <Breadcrumb :items="[
          { label: 'Inicio', to: '/' },
          { label: 'Publicaciones', to: '/publicaciones' },
          { label: categoriaLabel },
        ]" />

        <div class="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 mt-4">
          <!-- Columna principal -->
          <div class="min-w-0">
            <div class="detalle-cabecera rounded-2xl p-6 sm:p-7"
              v-motion :initial="{ opacity: 0, y: 14 }" :enter="{ opacity: 1, y: 0, transition: { duration: 420 } }">
              <span class="detalle-categoria">{{ categoriaLabel }}</span>
              <h1 class="text-2xl sm:text-[2.1rem] leading-tight font-extrabold mt-3 mb-2" style="color:var(--text)">{{ publicacion.titulo }}</h1>
              <p v-if="publicacion.subtitulo" class="text-base sm:text-lg m-0" style="color:var(--text-muted)">{{ publicacion.subtitulo }}</p>

              <div class="flex flex-wrap items-center justify-between gap-3 mt-5">
                <span class="text-sm" style="color:var(--text-muted)">
                  {{ publicacion.autor || 'Equipo editorial Juris Search' }} · {{ publicacion.tiempoLectura || 1 }} min de lectura
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-sm mr-1" style="color:var(--text-muted)">Compartir:</span>
                  <a :href="shareLinkedIn" target="_blank" rel="noreferrer" class="share-btn" aria-label="Compartir en LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg></a>
                  <a :href="shareX" target="_blank" rel="noreferrer" class="share-btn" aria-label="Compartir en X"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                  <a :href="shareFacebook" target="_blank" rel="noreferrer" class="share-btn" aria-label="Compartir en Facebook"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg></a>
                  <button type="button" class="share-btn" aria-label="Copiar enlace" @click="copiarEnlace"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.17 1.17"/><path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.17-1.17"/></svg></button>
                </div>
              </div>
            </div>

            <div v-if="publicacion.imagen" class="mt-4 rounded-2xl overflow-hidden"
              v-motion :initial="{ opacity: 0, scale: 0.98 }" :enter="{ opacity: 1, scale: 1, transition: { duration: 450, delay: 120 } }">
              <img :src="imagenUrl" :alt="publicacion.titulo" class="w-full h-[240px] sm:h-[340px] object-cover" />
            </div>

            <div class="mt-8" v-motion :initial="{ opacity: 0, y: 16 }" :enter="{ opacity: 1, y: 0, transition: { duration: 450, delay: 200 } }">
              <BlockRenderer :documento="publicacion.documento" />
            </div>
          </div>

          <!-- Lateral -->
          <aside class="flex flex-col gap-5 lg:sticky lg:top-24 self-start"
            v-motion :initial="{ opacity: 0, x: 14 }" :enter="{ opacity: 1, x: 0, transition: { duration: 420, delay: 150 } }">
            <div v-if="toc.length" class="toc-card rounded-2xl p-5">
              <h3 class="text-[0.95rem] font-bold mb-3 flex items-center gap-2.5" style="color:var(--text)">
                <svg class="w-4 h-4" style="color:#6d3fe0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                En este artículo
              </h3>
              <ul class="toc-lista list-none p-0 m-0 flex flex-col">
                <li v-for="item in toc" :key="item.id">
                  <a :href="`#${item.id}`" @click.prevent="irASeccion(item.id)"
                    :class="['toc-item block text-[0.85rem] py-1.5 pl-3.5 pr-2 no-underline', seccionActiva === item.id ? 'toc-activo' : '']">
                    {{ item.texto }}
                  </a>
                </li>
              </ul>
            </div>

            <div class="cta-lateral rounded-2xl p-5 flex flex-col gap-3">
              <div class="cta-icono w-11 h-11 rounded-xl flex items-center justify-center"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
              <h4 class="text-base font-bold m-0" style="color:var(--text)">Profundiza tu búsqueda</h4>
              <p class="text-sm m-0" style="color:var(--text-muted)">Encuentra jurisprudencia penal seleccionada en Juris Search.</p>
              <router-link to="/#mi-seccion-planes" class="cta-boton group self-start no-underline mt-1">
                Explorar la plataforma
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </router-link>
            </div>
          </aside>
        </div>

        <!-- Sigue explorando -->
        <div v-if="publicacion.relacionadas?.length" class="mt-12 pt-8" style="border-top:1px solid var(--border)">
          <div class="flex items-center justify-between gap-3 mb-4">
            <h2 class="text-xl font-bold m-0" style="color:var(--text)">Sigue explorando</h2>
            <router-link to="/publicaciones" class="ver-todas group no-underline">
              Ver todas las publicaciones
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </router-link>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PublicacionCard v-for="r in publicacion.relacionadas" :key="r.slug" :publicacion="r" :categorias="categorias" compacta />
          </div>
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
import BlockRenderer from "@/components/Publicaciones/BlockRenderer.vue";
import PublicacionCard from "@/components/Publicaciones/PublicacionCard.vue";
import PublicacionesProxy from "@/proxies/PublicacionesProxy";
import { headingsOf } from "@/components/Publicaciones/tiptap/renderPublicHtml";
import { urlDeMedia } from "@/utils/mediaUrl";
import { toast } from 'vue3-toastify';

export default {
  name: "PublicacionDetalle",
  components: { Navbar, FooterComponent, Breadcrumb, BlockRenderer, PublicacionCard },
  data() {
    return {
      loading: true,
      publicacion: null,
      categorias: [],
      seccionActiva: null,
      observer: null,
    };
  },
  computed: {
    imagenUrl() { return urlDeMedia(this.publicacion?.imagen); },
    categoriaLabel() {
      const cat = this.categorias.find(c => Number(c.id ?? c.ID) === Number(this.publicacion?.idCategoria));
      return cat ? (cat.descripcion ?? cat.DESCRIPCION) : 'Juris Search';
    },
    toc() {
      return this.publicacion?.documento ? headingsOf(this.publicacion.documento) : [];
    },
    expiraTexto() {
      const f = this.publicacion?.expira ? new Date(this.publicacion.expira) : null;
      if (!f || isNaN(f)) return '';
      return f.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    },
    shareUrl() { return typeof window !== 'undefined' ? window.location.href : ''; },
    shareLinkedIn() { return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareUrl)}`; },
    shareX() { return `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.shareUrl)}&text=${encodeURIComponent(this.publicacion?.titulo || '')}`; },
    shareFacebook() { return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl)}`; },
  },
  methods: {
    async cargar() {
      this.loading = true;
      try {
        const [rCat, rPub] = await Promise.all([
          PublicacionesProxy.categoriasPublicas(),
          this.$route.params.token
            ? PublicacionesProxy.previa(this.$route.params.token)
            : PublicacionesProxy.porSlug(this.$route.params.slug),
        ]);
        this.categorias = rCat?.DATA ?? rCat ?? [];
        this.publicacion = rPub?.DATA ?? rPub ?? null;
        this.marcarNoIndexar(!!this.$route.params.token);
      } catch {
        this.publicacion = null;
      } finally {
        this.loading = false;
        this.$nextTick(() => this.setupObserver());
      }
    },
    // Las vistas previas no deben aparecer en buscadores
    marcarNoIndexar(activo) {
      let meta = document.querySelector('meta[name="robots"][data-previa]');
      if (activo && !meta) {
        meta = document.createElement('meta');
        meta.name = 'robots'; meta.content = 'noindex, nofollow'; meta.setAttribute('data-previa', '');
        document.head.appendChild(meta);
      } else if (!activo && meta) meta.remove();
    },
    irASeccion(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
    copiarEnlace() {
      try {
        navigator.clipboard.writeText(this.shareUrl);
        toast.success('Enlace copiado al portapapeles');
      } catch {
        toast.error('No se pudo copiar el enlace');
      }
    },
    setupObserver() {
      if (this.observer) this.observer.disconnect();
      if (!this.toc.length) return;
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) this.seccionActiva = entry.target.id;
        });
      }, { rootMargin: '-100px 0px -70% 0px' });
      this.toc.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) this.observer.observe(el);
      });
    },
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    this.marcarNoIndexar(false);
  },
  async mounted() {
    await this.cargar();
  },
  watch: {
    '$route.params.slug'() { this.cargar(); },
    '$route.params.token'() { this.cargar(); },
  },
};
</script>

<style scoped>
.previa-aviso {
  position: fixed; left: 16px; bottom: 16px; z-index: 50;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 9999px;
  background: #1f1b2e; color: #fff; font-size: 12.5px; font-weight: 600;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.28);
}
.previa-punto { width: 8px; height: 8px; border-radius: 9999px; background: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3); }
.share-btn {
  @apply w-8 h-8 rounded-full flex items-center justify-center transition-all;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: #1e3a8a;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
}
.dark .share-btn { color: #c7d2fe; }
/* Cabecera del artículo */
.detalle-cabecera { background: linear-gradient(180deg, #f8f5ff 0%, #f2edfd 100%); border: 1px solid #ece5fb; }
.dark .detalle-cabecera { background: rgba(124, 92, 255, 0.1); border-color: rgba(124, 92, 255, 0.22); }
.detalle-categoria {
  display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px;
  background: #ede6fd; color: #6d3fe0;
  font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
}
.dark .detalle-categoria { background: rgba(124, 92, 255, 0.2); color: #c4b2ff; }

/* Índice */
.toc-card { background: var(--bg-card); border: 1px solid var(--border); box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05); }
.toc-lista { border-left: 2px solid var(--border); }
.toc-item { color: var(--text-muted); margin-left: -2px; border-left: 2px solid transparent; transition: color 0.2s, border-color 0.2s; }
.toc-item:hover { color: #6d3fe0; }
.toc-activo { color: #6d3fe0; border-left-color: #e71fb3; font-weight: 600; }
.dark .toc-item:hover, .dark .toc-activo { color: #c4b2ff; }

/* Tarjeta lateral */
.cta-lateral { background: linear-gradient(180deg, #f8f5ff 0%, #f2edfd 100%); border: 1px solid #ece5fb; }
.dark .cta-lateral { background: rgba(124, 92, 255, 0.1); border-color: rgba(124, 92, 255, 0.22); }
.cta-icono { background: #fde4f4; color: #e71fb3; }
.dark .cta-icono { background: rgba(231, 31, 179, 0.16); color: #ff8bd6; }
.cta-boton {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 10px 20px; border-radius: 9999px;
  background: linear-gradient(135deg, #e71fb3, #1864ff); color: #ffffff;
  font-size: 13.5px; font-weight: 600;
  box-shadow: 0 8px 20px rgba(110, 60, 230, 0.25);
}

/* "Ver todas las publicaciones" */
.ver-todas {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 16px; border-radius: 9999px;
  border: 1px solid #1864ff; color: #1864ff; font-size: 13px; font-weight: 600;
  transition: background 0.2s;
}
.ver-todas:hover { background: rgba(24, 100, 255, 0.06); }

/* Esqueleto de carga: bloque gris con un brillo que lo recorre */
.sk {
  display: block;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--border) 0%, var(--bg-card) 50%, var(--border) 100%);
  background-size: 200% 100%;
  animation: sk-brillo 1.4s ease-in-out infinite;
  opacity: 0.7;
}
.sk.rounded-full { border-radius: 9999px; }
@keyframes sk-brillo {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .sk { animation: none; }
}
.share-btn:hover { color: #1864ff; background: rgba(24, 100, 255, 0.06); border-color: rgba(24, 100, 255, 0.35); }
</style>
