<template>
  <div>
    <navbar />
    <main>
      <section class="profile-page flex flex-col justify-center items-center relative z-[1]">
        <div class="mt-10"></div>
        <div class="w-full">
          <p class="mb-3 text-duo font-['Lato'] text-[40px] text-center">
            Newsletters
          </p>
          <div class="font-['Lato'] text-center" style="background-color: #262626;">
            <ul class="py-3 w-full flex flex-row gap-4 justify-center items-center text-white text-sm font-semibold p-2">
              <li class="cursor-pointer" :key="0" @click="active = 'Todos'"
                :class="active === 'Todos' ? 'text-duo-claro' : ''">TODOS</li>
              <li class="cursor-pointer" @click="active = cat.DESCP"
                :class="active === cat.DESCP ? 'text-duo-claro' : ''" v-for="cat in categorias" :key="cat.ID">
                {{ cat.DESCP }}
              </li>
            </ul>
          </div>
        </div>

        <div class="w-4/5 mx-auto mt-8 mb-16 flex justify-center items-center gap-2.5 input-search">
          <img :src="searchIcon" alt="search" class="icon-search" />
          <input type="text" class="form-control" :placeholder="`Buscar por título de la noticia`"
            v-model="filter.TITULO" id="name" @keyup.enter="listNoticias" />
        </div>

        <section class="w-4/5 mx-auto mt-0 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="noticia in noticias" :key="noticia.ID" class="bg-white rounded-lg shadow-md">
            <a :href="noticia.ENLACE" target="_blank" rel="noopener noreferrer">
              <img :src="noticia.IMAGEN" alt="" class="w-full h-40 object-cover rounded-lg mb-4" />
            </a>
            <div class="px-3 pt-3 pb-4">
              <p class="flex items-center gap-2 mb-2 text-sm text-[#262626]">
                Categoría: {{ noticia.CATEGORIAS }}
              </p>
              <h3 class="text-base font-semibold text-[#1864FF] text-justify mb-2">{{ noticia.TITULO }}</h3>
              <p class="mb-4 text-[15px] font-light text-[#454644]">{{ noticia.FCRCN }}</p>
              <button
                class="bg-duo text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-duo-claro transition duration-300 ease-in-out"
                @click="rounterIrA(noticia)">
                Leer más
              </button>
            </div>
          </div>
        </section>

        <div class="flex justify-start mb-3 gap-2 flex-col md:flex-row">
          <b-pagination v-model="grid.currentPage" :total-rows="grid.totalRows"
            @update:model-value="listNoticias" :per-page="grid.perPage" aria-controls="my-table" class="my-0" />
        </div>
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
import { BPagination } from 'bootstrap-vue-next';
import LoginProxy from "@/proxies/LoginProxy";
import searchIcon from "@/assets/img/icons/search.svg";

export default {
  data() {
    return {
      grid: { currentPage: 1, totalRows: 0, perPage: 10 },
      searchIcon,
      noticias: [],
      categorias: [],
      isLoading: false,
      active: "Todos",
      filter: { TITULO: null },
    };
  },
  components: { Navbar, FooterComponent, BPagination },
  methods: {
    async listCategorias() {
      this.isLoading = true;
      await LoginProxy.listCategorias({ CESTDO: '', ROWS: 1000, INIT: 0 })
        .then((response) => {
          if (response) this.categorias = response;
          else toast.error("Ocurrió un error al cargar las categorías", { toastId: "error" });
        })
        .catch(() => toast.error("Ocurrió un error al cargar las categorías", { toastId: "error" }))
        .finally(() => (this.isLoading = false));
    },
    async listNoticias() {
      this.isLoading = true;
      await LoginProxy.list({
        CESTDO: '',
        ROWS: this.grid.perPage,
        INIT: (this.grid.currentPage - 1) * this.grid.perPage,
        DESC: this.filter.TITULO,
        IDCATEGORIA: this.active === 'Todos' ? null : this.categorias.find(cat => cat.DESCP === this.active)?.ID,
      })
        .then((response) => {
          if (response) {
            this.noticias = response.map((item) => ({
              ...item,
              FCRCN: new Date(item.FCRCN).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }),
              IMAGEN: item.IMAGEN ? `${process.env.VUE_APP_SITE_URL || 'https://jurissearch.com'}${item.IMAGEN}` : null,
            }));
            this.grid.totalRows = response[0]?.TOTALROWS || 0;
          } else {
            toast.error("Ocurrió un error al cargar las noticias", { toastId: "error" });
          }
        })
        .catch(() => toast.error("Ocurrió un error al cargar las noticias", { toastId: "error" }))
        .finally(() => (this.isLoading = false));
    },
    rounterIrA(noticia) {
      let title = noticia.TITULO.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-").substring(0, 50);
      this.$router.push({ name: "noticiaNewsletter", params: { title, id: noticia.ID } });
    },
  },
  mounted() {
    this.listCategorias();
    this.listNoticias();
  },
  watch: {
    "active"() { this.listNoticias(); },
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
</style>
