<template>
  <router-link :to="`/publicaciones/${publicacion.slug}`"
    class="pub-card group flex flex-col h-full overflow-hidden no-underline">
    <div :class="['relative w-full overflow-hidden', compacta ? 'h-[100px]' : 'h-[150px]']">
      <img v-if="imagenUrl" :src="imagenUrl" :alt="publicacion.titulo" loading="lazy"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div v-else class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, rgba(231,31,179,0.12), rgba(24,100,255,0.12));">
        <svg class="w-9 h-9 text-brand-blue/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
      </div>
    </div>
    <!-- Variante compacta ("Sigue explorando"): categoría, título y flecha -->
    <div v-if="compacta" class="p-3.5 flex flex-col gap-2 flex-1">
      <span class="pub-categoria self-start">{{ categoriaLabel }}</span>
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-[0.95rem] font-bold leading-snug m-0 line-clamp-2" style="color:var(--text)">{{ publicacion.titulo }}</h3>
        <span class="pub-flecha flex-shrink-0" aria-hidden="true">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </div>
    <div v-else class="p-4 flex flex-col gap-2 flex-1">
      <span class="pub-categoria self-start">{{ categoriaLabel }}</span>
      <h3 class="text-[1rem] font-bold leading-snug m-0 line-clamp-2" style="color:var(--text)">{{ publicacion.titulo }}</h3>
      <p class="text-[0.85rem] leading-relaxed m-0 line-clamp-2" style="color:var(--text-muted)">{{ publicacion.resumen }}</p>
      <div class="flex items-center justify-between mt-auto pt-1">
        <span class="flex items-center gap-1.5 text-[0.8rem]" style="color:var(--text-muted)">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ publicacion.tiempoLectura || 1 }} min de lectura
        </span>
        <span class="pub-flecha" aria-hidden="true">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </div>
  </router-link>
</template>

<script>
import { urlDeMedia } from '@/utils/mediaUrl';

export default {
  name: 'PublicacionCard',
  props: {
    publicacion: { type: Object, required: true },
    categorias:  { type: Array,  default: () => [] },
    compacta:    { type: Boolean, default: false },
  },
  computed: {
    imagenUrl() {
      return urlDeMedia(this.publicacion.imagen);
    },
    categoriaLabel() {
      const cat = this.categorias.find(c => Number(c.id ?? c.ID) === Number(this.publicacion.idCategoria));
      return cat ? (cat.descripcion ?? cat.DESCRIPCION) : 'Juris Search';
    },
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pub-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}
.pub-card:hover {
  box-shadow: 0 12px 28px rgba(110, 60, 230, 0.12);
  border-color: rgba(124, 92, 255, 0.3);
  transform: translateY(-3px);
}
/* Categoría: píldora lavanda debajo de la imagen */
.pub-categoria {
  display: inline-flex; align-items: center;
  padding: 4px 11px; border-radius: 9999px;
  background: #ede6fd; color: #6d3fe0;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
}
.dark .pub-categoria { background: rgba(124, 92, 255, 0.18); color: #c4b2ff; }
/* Botón circular con flecha */
.pub-flecha {
  display: inline-flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 9999px;
  background: var(--bg-card); color: #1864ff;
  border: 1px solid var(--border);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.pub-card:hover .pub-flecha { background: #1864ff; color: #ffffff; border-color: #1864ff; }
</style>
