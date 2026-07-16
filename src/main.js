import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

// ── Styles ────────────────────────────────────────────────────
// Librerías de terceros primero — Tailwind al final para que sus utilidades tengan prioridad
import 'element-plus/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'vue3-toastify/dist/index.css'
import 'vue3-carousel/dist/carousel.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vue-datepicker-next/index.css'
import 'vue-datepicker-next/locale/es'
import 'vue3-tel-input/dist/vue3-tel-input.css'
import '@/assets/styles/index.css'

// ── Legacy Axios (proxies existentes lo usan vía AxiosProvider) ─
import '@/providers/AxiosProvider'

// ── App ───────────────────────────────────────────────────────
import App from '@/App.vue'

// ── Router ────────────────────────────────────────────────────
import routes from './router/RouterIndex'

// ── Third-party plugins ───────────────────────────────────────
import Vue3Toastify from 'vue3-toastify'
import ElementPlus  from 'element-plus'
import VueSweetalert2 from 'vue-sweetalert2'
import VueTelInput  from 'vue3-tel-input'
import DatePicker   from 'vue-datepicker-next'
import SimpleVueValidation from 'simple-vue-validator'

// ── UI Components ─────────────────────────────────────────────
import AppLoader      from '@/components/ui/AppLoader.vue'
import BaseButton     from '@/components/ui/BaseButton.vue'
import BaseInput      from '@/components/ui/BaseInput.vue'
import BaseRichInput  from '@/components/ui/BaseRichInput.vue'
import BaseModal      from '@/components/ui/BaseModal.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
import BaseSelect     from '@/components/ui/BaseSelect.vue'
import TagInput       from '@/components/ui/TagInput.vue'
import LazyImage      from '@/components/ui/LazyImage.vue'
import SkeletonBlock  from '@/components/ui/SkeletonBlock.vue'
import PageHeader     from '@/components/ui/PageHeader.vue'
import SectionCard    from '@/components/ui/SectionCard.vue'

// ── Common Action Buttons ─────────────────────────────────────
import NewButton      from '@/components/Common/NewButton.vue'
import SearchBar      from '@/components/Common/SearchBar.vue'
import SearchButton   from '@/components/Common/SearchButton.vue'
import AppSelect      from '@/components/Common/AppSelect.vue'
import EditButton     from '@/components/Common/EditButton.vue'
import DeleteButton   from '@/components/Common/DeleteButton.vue'
import SaveButton     from '@/components/Common/SaveButton.vue'
import ExportButton   from '@/components/Common/ExportButton.vue'
import CancelButton   from '@/components/Common/CancelButton.vue'
import AppTreeSelect    from '@/components/Common/AppTreeSelect.vue'
import AppAutocomplete from '@/components/Common/AppAutocomplete.vue'
import AvatarInitials  from '@/components/Common/AvatarInitials.vue'

// ── Legacy Vuex store (páginas existentes que aún usan $store) ─
import store from './store/index'

// ── Pinia stores ──────────────────────────────────────────────
import { useThemeStore } from '@/stores/theme.store'

// ── Directives ────────────────────────────────────────────────
import { vCan } from '@/directives/can'

// ─────────────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()
const app   = createApp(App)

// Pinia primero (stores disponibles para plugins que los usen)
app.use(pinia)
app.use(router)
app.use(store)

// Third-party
app.use(Vue3Toastify, {
  autoClose: 3500,
  position:  'top-right',
  theme:     'auto',
})
app.use(ElementPlus)
app.use(VueSweetalert2)
app.use(VueTelInput)
app.use(SimpleVueValidation)

// Componentes globales
app.component('date-picker',   DatePicker)
app.component('PageHeader',    PageHeader)
app.component('SectionCard',   SectionCard)
app.component('AppLoader',      AppLoader)
app.component('BaseButton',     BaseButton)
app.component('BaseInput',      BaseInput)
app.component('BaseRichInput',  BaseRichInput)
app.component('BaseModal',      BaseModal)
app.component('BaseDatePicker', BaseDatePicker)
app.component('BaseSelect',     BaseSelect)
app.component('TagInput',       TagInput)
app.component('LazyImage',      LazyImage)
app.component('SkeletonBlock',  SkeletonBlock)
// Action buttons (globales — no requieren import en cada vista)
app.component('NewButton',    NewButton)
app.component('SearchBar',    SearchBar)
app.component('SearchButton', SearchButton)
app.component('AppSelect',    AppSelect)
app.component('EditButton',   EditButton)
app.component('DeleteButton', DeleteButton)
app.component('SaveButton',   SaveButton)
app.component('ExportButton', ExportButton)
app.component('CancelButton', CancelButton)
app.component('AppTreeSelect',    AppTreeSelect)
app.component('AppAutocomplete', AppAutocomplete)
app.component('AvatarInitials',  AvatarInitials)

// Directives globales
app.directive('can', vCan)

app.mount('#app')

// Inicializar tema (sincroniza clase dark con sistema operativo o preferencia guardada)
useThemeStore().init()
