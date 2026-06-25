<template>
  <div class="grid lg:grid-cols-[8fr_4fr] grid-cols-1 gap-4 items-start mt-5">
    <!-- Formulario -->
    <div class="relative flex flex-col min-w-0 break-words mb-6 shadow-lg rounded-lg bg-slate-50 dark:bg-gray-800 border-0">
      <div class="rounded-t bg-white dark:bg-gray-900 mb-0 px-6 py-6">
        <div class="flex justify-between items-center">
          <h6 class="text-slate-700 dark:text-slate-200 text-xl font-bold">Mi Perfil</h6>
          <button class="btn btn-primary btn-sm" type="button" @click="save" :disabled="isLoading">
            Guardar
          </button>
        </div>
      </div>
      <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
        <div class="grid grid-cols-2 gap-x-4">
          <h6 class="col-span-2 text-slate-400 text-sm mt-3 mb-6 font-bold">Información Personal</h6>

          <div class="col-span-2 mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Nombres completos <span class="text-red-500">*</span></label>
            <input v-model="modelo.NOMBRES" type="text" class="input-base" :class="{ 'border-red-400': validation.hasError('modelo.NOMBRES') }" />
            <span v-if="validation.hasError('modelo.NOMBRES')" class="text-xs text-red-500 mt-1 block">{{ validation.firstError('modelo.NOMBRES') }}</span>
          </div>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Apellido paterno <span class="text-red-500">*</span></label>
            <input v-model="modelo.APATERNO" type="text" class="input-base" :class="{ 'border-red-400': validation.hasError('modelo.APATERNO') }" />
            <span v-if="validation.hasError('modelo.APATERNO')" class="text-xs text-red-500 mt-1 block">{{ validation.firstError('modelo.APATERNO') }}</span>
          </div>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Apellido materno <span class="text-red-500">*</span></label>
            <input v-model="modelo.AMATERNO" type="text" class="input-base" :class="{ 'border-red-400': validation.hasError('modelo.AMATERNO') }" />
            <span v-if="validation.hasError('modelo.AMATERNO')" class="text-xs text-red-500 mt-1 block">{{ validation.firstError('modelo.AMATERNO') }}</span>
          </div>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Correo electrónico <span class="text-red-500">*</span></label>
            <input v-model="modelo.EMAIL" type="email" class="input-base" :class="{ 'border-red-400': validation.hasError('modelo.EMAIL') }" />
            <span v-if="validation.hasError('modelo.EMAIL')" class="text-xs text-red-500 mt-1 block">{{ validation.firstError('modelo.EMAIL') }}</span>
          </div>

          <hr class="col-span-2 mt-3 mb-4 border-slate-200 dark:border-gray-700" />
          <h6 class="col-span-2 text-slate-400 text-sm mb-6 font-bold">Información de Contacto</h6>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Teléfono <span class="text-red-500">*</span></label>
            <input v-model="modelo.TELEFONO" type="text" class="input-base" :class="{ 'border-red-400': validation.hasError('modelo.TELEFONO') }" />
            <span v-if="validation.hasError('modelo.TELEFONO')" class="text-xs text-red-500 mt-1 block">{{ validation.firstError('modelo.TELEFONO') }}</span>
          </div>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Fecha Nacimiento <span class="text-red-500">*</span></label>
            <date-picker v-model="modelo.FNACIMIENTO" :value="modelo.FNACIMIENTO" valueType="format"
              :disabledDate="time => time.getTime() > Date.now()"
              @change="(date) => modelo.FNACIMIENTO = date" />
            <span v-if="validation.hasError('modelo.FNACIMIENTO')" class="text-xs text-red-500 mt-1 block">{{ validation.firstError('modelo.FNACIMIENTO') }}</span>
          </div>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Dirección</label>
            <input v-model="modelo.DIRECCION" type="text" class="input-base" />
          </div>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Profesión</label>
            <input v-model="modelo.PROFESION" type="text" class="input-base" />
          </div>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Cargo</label>
            <input v-model="modelo.CARGO" type="text" class="input-base" />
          </div>

          <div class="mb-3">
            <label class="block text-slate-600 text-xs font-bold mb-1">Contraseña</label>
            <input v-model="modelo.PASSWORD" type="password" class="input-base" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tarjeta de perfil -->
    <div class="relative flex flex-col min-w-0 break-words bg-white dark:bg-gray-900 mb-6 shadow-xl rounded-lg">
      <div class="px-6">
        <div class="flex justify-center pt-6">
          <div class="relative w-[100px] h-[100px] inline-block">
            <input type="file" id="avatar-input" @change="changeAvatar" ref="avatarInput" class="hidden" />
            <img :src="modelo.RTA" alt="imagen_usuario"
              class="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              @click="openFileInput"
              :onerror="team2" />
          </div>
        </div>
        <div class="text-center mt-4">
          <h3 class="text-xl font-semibold leading-normal mb-2 text-slate-700 dark:text-slate-200">
            {{ modelo.NOMBRES }} {{ modelo.APATERNO }} {{ modelo.AMATERNO }}
          </h3>
          <div class="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold uppercase">
            <i class="fas fa-map-marker-alt mr-2 text-lg"></i>
            {{ modelo.DIRECCION }}
          </div>
          <div class="mb-2 text-slate-600 dark:text-slate-400 mt-4">
            <span class="text-slate-400">Usuario </span>
            <span class="font-bold" :class="modelo.CDESTDO == 'A' ? 'text-emerald-500' : 'text-red-500'">
              {{ modelo.CDESTDO == 'A' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
        <div class="mt-10 py-10 border-t border-slate-200 dark:border-gray-700 text-left">
          <div class="flex flex-col gap-1.5 px-4">
            <p class="text-sm text-slate-600 dark:text-slate-400">Activo desde: <span class="font-semibold">{{ formatDate(modelo.FCRCN, "DD/MM/YYYY") }}</span></p>
            <p class="text-sm text-slate-600 dark:text-slate-400">Plan: <span class="font-semibold">{{ modelo.DATOS?.DESCRIPCION }}</span></p>
            <p class="text-sm text-slate-600 dark:text-slate-400">Fecha de inicio: <span class="font-semibold">{{ formatDate(modelo.DATOS?.FINICIO, "DD/MM/YYYY") }}</span></p>
            <p class="text-sm text-slate-600 dark:text-slate-400">Fecha de fin: <span class="font-semibold">{{ formatDate(modelo.DATOS?.FFIN, "DD/MM/YYYY") }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Validator } from 'simple-vue-validator';
import UserProxy from "@/proxies/UserProxy";
import { toast } from 'vue3-toastify';
import moment from 'moment';
import team2 from "@/assets/img/resources/perfil.png";

export default {
  props: {
    data: { type: Object, default: () => {} },
    getUser: { type: Function, default: () => {} },
    setLoading: { type: Function, default: () => {} },
    isLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      team2,
      modelo: {
        APATERNO: null, AMATERNO: null, NOMBRES: null, EMAIL: null,
        TELEFONO: null, FNACIMIENTO: null, CDESTDO: null, FCRCN: null,
        PASSWORD: null, PROFESION: null, CARGO: null, DIRECCION: null,
        DATOS: null, RTAFTO: null, RTA: null,
      },
    };
  },
  validators: {
    'modelo.NOMBRES': (value) => Validator.value(value).required('Campo requerido'),
    'modelo.APATERNO': (value) => Validator.value(value).required('Campo requerido'),
    'modelo.AMATERNO': (value) => Validator.value(value).required('Campo requerido'),
    'modelo.EMAIL': (value) => Validator.value(value).required('Campo requerido'),
    'modelo.TELEFONO': (value) => Validator.value(value).required('Campo requerido'),
    'modelo.FNACIMIENTO': (value) => Validator.value(value).required('Campo requerido'),
  },
  methods: {
    async save(e) {
      e.preventDefault();
      const validate = await this.$validate();
      if (!validate) return;
      this.setLoading(true);
      const formData = new FormData();
      Object.keys(this.modelo).forEach(key => {
        if (key !== 'RTA') formData.append(key, this.modelo[key]);
      });
      formData.append('files', this.$refs.avatarInput.files[0]);
      const loadingToast = toast.loading("Espere un momento...");
      await UserProxy.editarFoce(formData)
        .then(async response => {
          const msg = response.STATUS ? "Datos actualizados con éxito" : response.MESSAGE;
          if (response.STATUS) {
            toast.success(msg);
            this.reset();
            await this.getUser();
          } else {
            toast.error(msg);
          }
        })
        .catch(err => toast.error(err?.MESSAGE || "Error al actualizar sus datos"))
        .finally(() => {
          toast.remove(loadingToast);
          this.setLoading(false);
        });
    },
    reset() {
      this.modelo = {
        APATERNO: null, AMATERNO: null, NOMBRES: null, EMAIL: null,
        TELEFONO: null, FNACIMIENTO: null, CDESTDO: null, FCRCN: null,
        PASSWORD: null, PROFESION: null, CARGO: null, DIRECCION: null, DATOS: null,
      };
    },
    formatDate(fecha, formato) { return moment(fecha).format(formato); },
    openFileInput() { this.$refs.avatarInput.click(); },
    changeAvatar(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { this.modelo.RTA = e.target.result; };
        reader.readAsDataURL(file);
      }
    },
  },
  mounted() {
    this.modelo = { ...this.data, RTA: this.data.RTAFTO || this.team2, RTAFTO: this.data.RTAFTO };
    for (const key in this.modelo) {
      if ([null, 'null'].includes(this.modelo[key])) this.modelo[key] = '';
    }
  },
};
</script>
