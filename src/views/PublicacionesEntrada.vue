<template>
  <component :is="vista" v-if="vista" />
  <div v-else class="min-h-screen" style="background:var(--bg-card)" />
</template>

<script>
import { defineAsyncComponent, markRaw } from 'vue';
import PublicacionesProxy from '@/proxies/PublicacionesProxy';

const BLOG = markRaw(defineAsyncComponent(() => import('@/views/Publicaciones.vue')));
const INSTAGRAM = markRaw(defineAsyncComponent(() => import('@/views/PublicacionesInstagram.vue')));
const CLAVE_PREVIEW = 'blogPublicacionesPreview';

// /publicaciones: muestra el blog nuevo si la bandera BLOG_PUBLICACIONES está
// activa (JURIS.FEATURE_FLAG) o si se entra con ?preview=true; si no, el feed
// de Instagram de antes. El preview se recuerda durante la pestaña (para que al
// volver desde un artículo no regrese a Instagram); ?preview=false lo apaga.
export default {
  name: 'PublicacionesEntrada',
  data() {
    return { vista: null };
  },
  async created() {
    this.vista = (await this.blogVisible()) ? BLOG : INSTAGRAM;
  },
  methods: {
    previewSolicitado() {
      const q = this.$route.query.preview;
      try {
        if (q === 'true') sessionStorage.setItem(CLAVE_PREVIEW, '1');
        if (q === 'false') sessionStorage.removeItem(CLAVE_PREVIEW);
        return q === 'true' || (q !== 'false' && sessionStorage.getItem(CLAVE_PREVIEW) === '1');
      } catch {
        return q === 'true';
      }
    },
    async blogVisible() {
      if (this.previewSolicitado()) return true;
      try {
        const r = await PublicacionesProxy.flag('BLOG_PUBLICACIONES');
        return !!(r?.DATA ?? r)?.ACTIVO;
      } catch {
        return false; // si no se puede consultar, se mantiene lo de antes
      }
    },
  },
};
</script>
