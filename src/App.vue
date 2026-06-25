<template>
  <div id="app" :class="{ 'dark': isDarkMode }">
    <router-view />
    <chat-widget v-if="!urlBusqueda" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ChatWidget from '@/components/Shared/ChatWidget.vue';

export default {
  components: { ChatWidget },
  data() {
    return {
      urlBusqueda: false,
    };
  },
  computed: {
    ...mapGetters('theme', ['isDarkMode'])
  },
  created() {
    if (this.$route) {
      this.urlBusqueda = this.$route.path.includes('/admin') || this.$route.path.includes('/usuario');
    }
  },
  mounted() {
    this.$store.dispatch('theme/initializeTheme');
  },
  watch: {
    $route(to) {
      this.urlBusqueda = to.path.includes('/admin') || to.path.includes('/usuario');
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-tree-select__popper .el-select-dropdown__item {
  white-space: normal !important;
}

.custom-tree-select {
  max-width: 100% !important;
}


.floating-arriba {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #E71FB3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  z-index: 1;
  transition: background-color 0.3s;
}

.floating-arriba:hover {
  background-color: rgb(229, 122, 233);
}


.floating-delitos {
  position: fixed;
  bottom: 2px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
}



:root {
  --azul-primary: #1764ffff;
  --azul-title: #1864FF;
  --lila-primary: #e81eb2ff;
  --azul-primary-b: #d4e1fc;
  --lila-primary-b: rgba(245, 200, 233, 0.8);
  --gray-primary: #fcfcfcff;
}

a {
  text-decoration: none !important;
}

nav a {
  color: #636363 !important;
}
.dark nav a {
  color: #d1d5db !important;
}

.bg-blueGray-700 {
  background-color: #2b3945 !important;
}

.bg-blueGray-100 {
  background-color: #f9fafb !important;
}

.bg-blueGray-200 {
  background-color: #edf2f7 !important;
}

.bg-blueGray-300 {
  background-color: #e2e8f0 !important;
}

.bg-blueGray-400 {
  background-color: #cbd5e0 !important;
}

.bg-blueGray-500 {
  background-color: #a0aec0 !important;
}

.bg-blueGray-600 {
  background-color: #718096 !important;
}

.bg-blueGray-800 {
  background-color: #1a202c !important;
}

.text-blueGray-100 {
  color: #f9fafb !important;

}

.text-blueGray-200 {
  color: #edf2f7 !important;
}

.text-blueGray-300 {
  color: #e2e8f0 !important;
}

.text-blueGray-400 {
  color: #cbd5e0 !important;
}

.text-blueGray-500 {
  color: #a0aec0 !important;
}

.text-blueGray-600 {
  color: #718096 !important;
}

.text-blueGray-700 {
  color: #2b3945 !important;
}

.bg-app-primary {
  background-color: var(--azul-primary);
}

.bg-app-secondary {
  background-color: var(--lila-primary);
}

.bg-app-tercery {
  background-color: var(--gray-primary);
}

.bg-app-primary:hover {
  background-color: #5aa3e6;
}

.bg-app-secondary:hover {
  background-color: #d195d3;
}

.hover:hover {
  cursor: pointer;
}

.bg-app-primary-b {
  background-color: rgb(212, 225, 252);
}

.bg-app-secondary-b {
  background-color: rgba(245, 200, 233, 0.8);
}

.text-app-primary {
  color: var(--azul-primary);
}

.text-app-secondary {
  color: var(--lila-primary);
}

.text-app-primary-b {
  color: rgb(212, 225, 252);
}

.text-app-secondary-b {
  color: rgba(245, 200, 233, 0.8);
}

.text-primary-p {
  color: rgba(100, 116, 139, 1)
}


.el-select__wrapper {
  width: 100% !important;
  height: 3rem !important;
}

.el-select__input {
  padding: 0.5rem !important;
  width: auto !important;
  color: #a9a9a9 !important;
}

.el-select__selected-item .el-select__input {
  padding: 0.5rem !important;
  width: auto !important;
  color: #a9a9a9 !important;
}

.el-tree-select__popper {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
}

.h-350-px {
  height: 350px !important;
}

.tree-select-container {
  width: 300px !important;
}

.custom-tree-select {
  width: 100% !important;
}

.el-tree-select__tags {
  flex-wrap: wrap;
  max-height: 50px;
  overflow-y: auto;
}

.el-input {
  min-height: 38px;
}


.b-form-tags-input {
  padding: 10px !important;
  height: 2.8rem !important;
}

form label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

input[type="text"],
input[type="password"],
input[type="email"],
input[type="number"],
textarea {
  border: 0.6px solid #e4e4e4;
  margin: 0;
  padding: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #4b5563;
  background-color: #fff !important;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  box-shadow: 0 0 0 1px rgba(209, 213, 219, 0.3);
  outline: none;
  transition: all 0.15s ease;
  width: 100%;
}

textarea {
  margin: 0 !important;
}

input.border-red,
.error textarea {
  border: 1px solid #f87171;
}

div.error select {
  border: 1px solid #f87171;
}

.error {
  border: 1px solid #f87171 !important;
}

.mx-datepicker {
  width: 100% !important;
  padding: 0px !important;
}

.mx-input-wrapper input {
  padding: 1.4rem !important;
}

button.disabled {
  background-color: #f7f7f7 !important;
  color: #a0aec0 !important;
  cursor: not-allowed !important;
}

button.disabled:hover {
  cursor: no-drop !important;
}

select {
  padding: .75rem !important;
  margin: 0 !important;
}


.btn-create {
  background-color: #10b981 !important;
  color: white !important;
}


.btn-share {
  background-color: #f59e0b !important;
  color: white !important;
}

.btn-delete {
  background-color: #f87171 !important;
  color: white !important;
  border: none !important;
}

.btn-edit {
  background-color: #f59e0b !important;
  color: white !important;
  border: none !important;
}

.btn-save {
  background-color: #34d399 !important;
  color: white !important;
  border: none !important;
}

.btn-export {
  background-color: #e11d48 !important;
  color: white !important;
}

.btn-search {
  background-color: #3b82f6 !important;
  color: white !important;
  border: none !important;
}

.btn-regresar {
  background-color: #000000 !important;
  color: var(--gray-primary) !important;
  border: none !important;
}

.btn-view {
  background-color: #707070 !important;
  color: rgb(255, 255, 255) !important;
  border: none !important;
}

.bton {
  padding: 0.5rem 1rem !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  outline: none !important;
  border: none !important;
}

.dropdown-menu li {
  font-size: 0.875rem !important;
  padding: 0.3rem 1rem !important;
  font-weight: 400 !important;
}

.dropdown-menu li:hover {
  background-color: #ecf6ff !important;
}


.mx-calendar-content table td,
.mx-calendar-content table th {
  padding: 0.5rem !important;
  text-align: center !important;
}

.mx-calendar-content table td.active,
.mx-calendar-content table td.active {
  color: var(--azul-primary) !important;
  background-color: #f7f7f7 !important;
}


input[type=file]::file-selector-button {
  margin-right: 20px;
  border: none;
  background: #084cdf;
  padding: 10px 20px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background .2s ease-in-out;
}

input[type=file]::file-selector-button:hover {
  background: #0d45a5;
}

input[type=file] {
  background-color: var(--gray-primary) !important;
  border-radius: 0.375rem;
  border: 1px solid #e4e4e4;
}



.mx-calendar-panel-date {
  padding: 0 !important;
}


span.message {
  color: #f87171;
  font-size: 0.75rem;
}

form div.error input {
  border: 1px solid #f87171;
}

@media (max-width: 768px) {
  .sm-text-center {
    text-align: center;
  }
}


.vld-overlay .vld-icon svg {
  fill: var(--azul-primary);
  width: 70px;
  height: 70px;
}


.nav-tabs .nav-link.active {
  background-color: rgb(255, 255, 255) !important;
  color: rgb(96, 96, 96);
}


.form-switch input {
  color: var(--azul-primary) !important;
}

.form-check-input:checked {
  background-color: var(--azul-primary) !important;
  border-color: var(--azul-primary) !important;
}


input:disabled {
  background-color: #f8f8f8 !important;
  color: #a0aec0;
  cursor: not-allowed;
}

form {
  padding: .5rem;
}

.pagination {
  display: flex !important;
}

.p-autocomplete-overlay {
  background-color: #fff !important;
}

.p-autocomplete-option {
  color: #000 !important;
}

.p-autocomplete-option:hover,
.p-autocomplete-option.p-focus {
  background-color: #f7f7f7ce !important;
}

.mayus {
  text-transform: uppercase;
}



.text-lato-700 {
  font-family: Lato;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0px;
}


.text-lato-600 {
  font-family: Lato;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 0px;
}


.text-lato-500 {
  font-family: Lato;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: 0px;
}

.text-lato-400 {
  font-family: Lato;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0px;
}

.text-lato-300 {
  font-family: Lato;
  font-weight: 300;
  line-height: 100%;
  letter-spacing: 0px;
}


.text-lato-200 {
  font-family: Lato;
  font-weight: 200;
  line-height: 100%;
  letter-spacing: 0px;
}


.text-lato-100 {
  font-family: Lato;
  font-weight: 100;
  line-height: 100%;
  letter-spacing: 0px;
}

.input-group input {
  border: none !important;
  ;
  padding: 0rem !important;
  ;
  margin: 0rem !important;
  ;
  border-radius: 0rem !important;
  box-shadow: none !important;
  background-color: tranparent !important;
  color: rgb(44, 44, 44) !important;
}

.icon-btn-menu img {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease-in-out;
}


/* // * PALETA */
/* B9DBFF */
.bg-palette-1 {
  background-color: #B9DBFF !important;
}


.bg-landing {
  background-image: url("./assets/img/backgrounds/bg-contacto.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  position: relative;
  z-index: 1;
  min-height: 100vh;
  height: inherit;
  /* <-- asegura que ocupa al menos el alto de la pantalla */
}

.container-table {
  width: -webkit-fill-available !important;
}

.container-table:nth-of-type(1) h3 {
  font-size: 1.3rem;
  font-family: Lato;
  margin: 0 !important;
  font-weight: 700;
  color: var(--azul-title);
}

.input-search {
  position: relative;
}

.input-search .icon-search {
  position: absolute;
  top: 45%;
  left: 25px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
  opacity: 0.6;
}

.input-search input {
  padding-left: 2.5rem;
  /* deja espacio para el ícono */
}

.table thead {
  background: rgba(139, 92, 246, 0.04) !important;
  color: white !important;
  font-weight: 600 !important;
}

.page-link.disabled,
.disabled>.page-link {
  pointer-events: none !important;
  cursor: not-allowed !important;
  background-color: white !important;
}


.btn-actions-view {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}

.contenedor-tab {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.contenedor-tab a {
  cursor: pointer;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #555;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-weight: 500;
}

.contenedor-tab a.disabled {
  color: #ccc;
  pointer-events: none;
  cursor: not-allowed;
  border-bottom: 2px solid transparent;
}

.contenedor-tab a:hover {
  color: #007bff;
  border-bottom: 2px solid #cce5ff;
}

.contenedor-tab a.active-tab {
  color: #007bff;
  font-weight: 600;
  border-bottom: 2px solid #007bff;
}

.dropzone {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}

.dropzone:hover {
  background-color: #f9f9f9;
}

.preview {
  margin-top: 1rem;
  max-width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-height: 200px;
  object-fit: contain;
}


@media (max-width: 768px) {
  .contenedor-tab {
    flex-direction: column;
    gap: 0.2rem;
  }

  .class-actions {
    --bs-gutter-x: 0rem !important
  }

  .btn-actions-view {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-actions-view button {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

.btn-transparent {
  background-color: transparent !important;
  color: var(--azul-primary) !important;
  border: 1px solid var(--azul-primary) !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  outline: none !important;
}

.mx-input {
  padding: 0.5rem !important;
  border-radius: 0.375rem !important;
  border: 1px solid #e4e4e4 !important;
  background-color: #fff !important;
  color: #4b5563 !important;
  box-shadow: 0 0 0 1px rgba(209, 213, 219, 0.3) !important;
}

.swal2-modal {
  padding: 10px !important;
}

.crear-directorio-swal .swal2-html-container {
  overflow-x: hidden !important;
}

.crear-directorio-swal .swal2-html-container input {
  background: #ffffff !important;
}

.display-buttons {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: 1rem;
}

.flex-checkbox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 0.5rem;
}

.flex-checkbox label {
  padding: 0rem !important;
  margin: 0rem !important;
}

@media (min-width: 768px) {
  .gutters {
    --bs-gutter-x: 1.5rem !important;
    --bs-gutter-y: 1rem !important;
  }
}

@media (max-width: 768px) {
  .flex-checkbox {
    flex-direction: row;
    gap: 0.5rem;
    justify-content: start;
    align-items: center;
  }

  .display-buttons {
    flex-direction: column;
  }

  .display-buttons button {
    width: 100%;
  }

  .display-buttons .dropdown {
    width: 100%;
  }
}

.navbarDesign {
  display: flex;
  transition: all 0.3s ease;
}

/* Sidebar visible */
.navbarDesign .sidebar {
  transition: all 0.3s ease;
  overflow: hidden;
  background-color: #1e293b;
  /* Ejemplo */
}



/* Contenido principal */
.navbarDesign .main-content {
  flex: 1;
  background-color: #f1f5f9;
  /* Ejemplo */
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  height: 100%;
}

.w-content-0 {
  display: none;
}

.w-content-10 {
  display: contents;
  width: 12%;
}

.w-content-90 {
  display: contents;
  width: 88%;
}

.w-content-100 {
  display: contents;
  width: 100%;
}
</style>