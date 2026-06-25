<template>
  <div>
    <navbar />
    <main>
      <section class="profile-page flex flex-col justify-center items-center relative z-[1]">
        <div class="mt-10"></div>
        <section class="w-4/5 mx-auto mt-8 mb-16 flex flex-col items-center gap-2.5">
          <div class="mb-3 w-full">
            <div class="flex flex-row items-center gap-1.5 font-['Lato'] text-[15px] max-sm:grid max-sm:grid-cols-[4fr_1fr]">
              <p class="text-[#262626] m-0">Newsletters</p>
              <span class="text-[#1864FF]">></span>
              <p class="text-[#262626] m-0">{{ noticia.CATEGORIAS }}</p>
              <span class="text-[#1864FF]">></span>
              <p class="font-semibold text-[#1864FF] m-0">{{ noticia.TITULO }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-2 w-full">
            <div v-for="(autor, index) in noticia?.AUTORES" :key="index"
              class="flex gap-4 pb-1.5 border-b border-[#ccc] items-start">
              <div v-if="autor?.IMAGEN" class="flex-shrink-0">
                <img :src="autor?.IMAGEN" onerror="this.onerror=null;this.src='https://placehold.co/80x80'"
                  alt="Foto del autor" class="w-20 h-20 rounded-full object-cover" />
              </div>
              <div class="flex flex-col justify-between h-full">
                <div class="text-sm font-bold text-[#333] mb-2">{{ autor?.AUTOR }}</div>
                <div class="text-xs text-[#666] mb-2">Publicado el: {{ noticia?.FCRCN }}</div>
                <div class="text-xs flex items-center gap-2">
                  <span>Redes:</span>
                  <div class="flex gap-1.5">
                    <a v-for="(red, i) in autor.REDES" :key="i" :href="red.red" target="_blank" rel="noopener noreferrer">
                      <img :src="red.icon" alt="icono red social" class="w-[15px] h-[15px] rounded-full transition-opacity duration-300 hover:opacity-70" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-[1fr_2fr] gap-5 mt-5 max-sm:flex max-sm:flex-col">
              <a class="flex justify-center items-center" :href="noticia?.ENLACE || ''" target="_blank" rel="noopener noreferrer">
                <img :src="noticia?.IMAGEN" alt="" class="rounded-lg w-1/2 h-1/2" />
              </a>
              <p class="font-['Lato'] text-base text-[#454644] text-justify mt-5 contenido-html" v-html="noticia?.DESCRIPCION || ''"></p>
            </div>
          </div>
        </section>
      </section>

      <section class="bg-dark">
        <div class="container-custom mx-auto p-5">
          <div class="flex flex-column gap-2 p-3">
            <h2 class="text-center text-white">
              Crea una cuenta y accede a material académico exclusivo
            </h2>
            <router-link to="/contacto"
              class="m-auto bg-duo rounded-full text-white text-xs px-4 py-3 outline-none focus:outline-none lg:mr-1 ml-3 ease-linear transition-all duration-150">
              Ver Planes
            </router-link>
          </div>
        </div>
      </section>
      <LoadingOverlay :active="isLoading" :is-full-page="false" :loader="'bars'" />
    </main>
    <footer-component />
  </div>
</template>

<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { toast } from 'vue3-toastify';
import LoginProxy from "@/proxies/LoginProxy";

export default {
  data() {
    return {
      urls: {
        instagram: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg",
        facebook: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
        linkedin: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
        whatsapp: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg",
      },
      noticia: [],
      isLoading: false,
    };
  },
  components: { Navbar, FooterComponent },
  methods: {
    async listNoticia(id) {
      this.isLoading = true;
      await LoginProxy.list({ ID: id, CESTDO: '', ROWS: 1, INIT: 0, DESC: '', IDCATEGORIA: null })
        .then((response) => {
          if (response.length > 0) {
            let noticiaFind = response[0];
            this.noticia = {
              ...noticiaFind,
              FCRCN: new Date(noticiaFind.FCRCN).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }),
              AUTORES: JSON.parse(noticiaFind.AUTORES),
              IMAGEN: noticiaFind.IMAGEN ? `${process.env.VUE_APP_SITE_URL || 'https://jurissearch.com'}${noticiaFind.IMAGEN}` : null,
            };

            this.noticia.AUTORES = this.noticia.AUTORES.map((autor) => {
              let autorFind = {
                ...autor,
                AUTORESREDES: autor.REDES.split(","),
                REDES: autor.REDES.split(",").map((red) => {
                  let iconUrl;
                  if (red.includes("instagram")) iconUrl = this.urls.instagram;
                  else if (red.includes("facebook")) iconUrl = this.urls.facebook;
                  else if (red.includes("linkedin")) iconUrl = this.urls.linkedin;
                  else if (red.includes("whatsapp")) iconUrl = this.urls.whatsapp;
                  return { red, icon: iconUrl };
                }),
                IMAGEN: autor.RUTA ? `${process.env.VUE_APP_SITE_URL || 'https://jurissearch.com'}${autor.RUTA}` : null,
              };
              autorFind.REDES = autorFind.REDES.filter((red) => red.red !== "");
              return autorFind;
            });
          } else {
            this.$router.push("/noticias");
            toast.error("Ocurrió un error al cargar las noticias", { toastId: "error" });
          }
        })
        .catch(() => toast.error("Ocurrió un error al cargar las noticias", { toastId: "error" }))
        .finally(() => (this.isLoading = false));
    },
  },
  mounted() {
    const id = this.$route.params.id;
    if (isNaN(id)) this.$router.push("/noticias");
    else this.listNoticia(id);
  },
};
</script>

<style scoped>
.profile-page {
  background-image: url("../assets/img/backgrounds/bg-contacto.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* Estilos para contenido HTML dinámico (v-html) */
.contenido-html :deep(ul li) {
  margin-bottom: 10px;
  list-style: disc !important;
  text-align: justify !important;
}
</style>
