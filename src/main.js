import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";

// styles

import "@fortawesome/fontawesome-free/css/all.min.css";
// import '@fortawesome/fontawesome-free/js/all.js';
import "@/assets/styles/tailwind.css";
import "@/providers/AxiosProvider";
import "@/assets/styles/index.css"; // Importar Tailwind CSS

// mouting point for the whole app

import App from "@/App.vue";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import 'vue3-carousel/dist/carousel.css'


import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import SimpleVueValidation from "simple-vue-validator";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import BootstrapVueNext from "bootstrap-vue-next";
import "bootstrap/dist/js/bootstrap.bundle.js";

import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import "vue-datepicker-next/locale/es";

// import Treeselect from 'vue3-treeselect'
// import 'vue3-treeselect/dist/vue3-treeselect.css'

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Tooltip from 'primevue/tooltip';
import 'primeicons/primeicons.css';

import routes from "./router/RouterIndex";
import store from "./store/index";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import VueTelInput from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(VueTelInput);
app.use(VueSweetalert2);
app.directive('tooltip', Tooltip)

app.use(Vue3Toastify, {
  autoClose: 3000, // Duración en milisegundos
  position: "top-right", // Posición de las notificaciones
});
app.use(ElementPlus);

app.component("LoadingOverlay", VueLoading);
app.use(router);
app.use(store);
app.use(BootstrapVueNext);
app.use(SimpleVueValidation);
app.component("date-picker", DatePicker);
// app.component('treeselect', Treeselect);
app.mount("#app");

// createApp(App).use(router).mount("#app");
