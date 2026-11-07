<template>
  <Publicaciones />
</template>

<script>
import Publicaciones from '@/views/Publicaciones.vue';

// /blog muestra siempre el blog nuevo: ya reemplazó al feed de Instagram y no se
// consulta la bandera BLOG_PUBLICACIONES. Lo anterior queda comentado por si hay que volver.
//
// Plantilla anterior:
//   <component :is="vista" v-if="vista" />
//   <div v-else class="min-h-screen" style="background:var(--bg-card)" />
//
// import { defineAsyncComponent, markRaw } from 'vue';
// import PublicacionesProxy from '@/proxies/PublicacionesProxy';
//
// const BLOG = markRaw(defineAsyncComponent(() => import('@/views/Publicaciones.vue')));
// const INSTAGRAM = markRaw(defineAsyncComponent(() => import('@/views/PublicacionesInstagram.vue')));
// const CLAVE_PREVIEW = 'blogPublicacionesPreview';
//
// // Blog nuevo si la bandera BLOG_PUBLICACIONES está activa (JURIS.FEATURE_FLAG) o si se
// // entra con ?preview=true; si no, el feed de Instagram. El preview se recuerda durante la
// // pestaña; ?preview=false lo apaga.
// export default {
//   name: 'PublicacionesEntrada',
//   data() {
//     return { vista: null };
//   },
//   async created() {
//     this.vista = (await this.blogVisible()) ? BLOG : INSTAGRAM;
//   },
//   methods: {
//     previewSolicitado() {
//       const q = this.$route.query.preview;
//       try {
//         if (q === 'true') sessionStorage.setItem(CLAVE_PREVIEW, '1');
//         if (q === 'false') sessionStorage.removeItem(CLAVE_PREVIEW);
//         return q === 'true' || (q !== 'false' && sessionStorage.getItem(CLAVE_PREVIEW) === '1');
//       } catch {
//         return q === 'true';
//       }
//     },
//     async blogVisible() {
//       if (this.previewSolicitado()) return true;
//       try {
//         const r = await PublicacionesProxy.flag('BLOG_PUBLICACIONES');
//         return !!(r?.DATA ?? r)?.ACTIVO;
//       } catch {
//         return false; // si no se puede consultar, se mantiene lo de antes
//       }
//     },
//   },
// };

export default {
  name: 'PublicacionesEntrada',
  components: { Publicaciones },
};
</script>
