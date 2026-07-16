<template>
  <section class="min-h-screen pt-4 pb-16" style="background:var(--bg-sunken)">

    <!-- Page Header -->
    <PageHeader title="Configuración de Cuenta" subtitle="Gestiona tu información personal y contactos" :spinning="true">
      <template #icon>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m8.66-15.66l-4.24 4.24m-4.24 4.24l-4.24 4.24M23 12h-6m-6 0H1m15.66 8.66l-4.24-4.24m-4.24-4.24l-4.24-4.24"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4">

      <!-- Tabs -->
      <div class="flex gap-2 mb-5 bg-white dark:bg-gray-900 rounded-xl p-1.5 shadow-soft border border-gray-100 dark:border-gray-700">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="active = tab.id"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
            active === tab.id
              ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800']"
        >
          <svg v-if="tab.id === 'informacionPersonal'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          {{ tab.label }}
        </button>
      </div>

      <!-- ── Tab: Información Personal ── -->
      <div v-if="active === 'informacionPersonal'" class="animate-fade-up">
        <form @submit.prevent="save" class="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-5">

          <!-- ─── Columna izquierda: Avatar + Notificaciones ─── -->
          <div class="flex flex-col gap-4">

            <!-- Foto de perfil -->
            <SectionCard>
              <div class="flex flex-col items-center text-center gap-3">
                <!-- Avatar con overlay -->
                <div class="relative" :class="{'cursor-pointer group': !avatarLoading}" @click="!avatarLoading && openFileInput()">
                  <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 hover:border-brand-blue transition-all duration-300 shadow-medium"
                    :class="{'hover:scale-[1.04]': !avatarLoading}">
                    <img :src="modelo.RTAFTO || team2" alt="avatar" referrerpolicy="no-referrer"
                      class="w-full h-full object-cover" @error="e => e.target.src = team2"/>
                  </div>
                  <!-- Overlay: cámara al hover -->
                  <div v-if="!avatarLoading" class="absolute inset-0 rounded-full bg-brand-blue/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <!-- Overlay: spinner mientras sube/elimina -->
                  <div v-if="avatarLoading" class="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <span class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  </div>
                </div>
                <input type="file" ref="avatarInput" accept="image/*" class="hidden" @change="onSelectImage"/>

                <!-- Nombre y correo reactivos -->
                <div>
                  <p class="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight m-0">
                    {{ [modelo.NOMBRES, modelo.APATERNO].filter(Boolean).join(' ') || 'Tu nombre' }}
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5 m-0">{{ modelo.EMAIL || '—' }}</p>
                </div>

                <p class="text-xs text-gray-400 m-0">JPG, PNG o GIF · Máx 5 MB</p>

                <div class="flex gap-2 w-full">
                  <button type="button" class="btn btn-primary btn-sm flex-1"
                    :disabled="avatarLoading" @click="openFileInput">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    Cambiar
                  </button>
                  <delete-button v-if="modelo.RTAFTO" label="Eliminar" size="sm"
                    :disabled="avatarLoading" class="flex-1" @click="removeAvatar"/>
                </div>
              </div>
            </SectionCard>

            <!-- Notificaciones compactas -->
            <SectionCard title="Notificaciones">
              <template #icon>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </template>
              <div class="flex flex-col gap-1.5">
                <label v-for="opt in notifOpts" :key="opt.value" class="cursor-pointer">
                  <input type="radio" name="notificaciones" :value="opt.value" v-model="modelo.NOTIFI" class="sr-only"/>
                  <div :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all',
                    modelo.NOTIFI === opt.value
                      ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600']">
                    <div :class="['w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                      modelo.NOTIFI === opt.value ? 'bg-brand-gradient text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400']">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="opt.icon"/>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-semibold text-gray-700 dark:text-gray-200 m-0 leading-snug">{{ opt.title }}</p>
                      <p class="text-[11px] text-gray-400 m-0 leading-tight truncate">{{ opt.subtitle }}</p>
                    </div>
                  </div>
                </label>
              </div>
            </SectionCard>
          </div>

          <!-- ─── Columna derecha: todos los campos en una sola tarjeta ─── -->
          <SectionCard>

            <!-- Sub-sección: Datos Personales -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-brand-blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <h4 class="text-sm font-bold text-gray-700 dark:text-gray-200 m-0">Datos Personales</h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Nombres <span class="text-red-500">*</span></label>
                <input v-model="modelo.NOMBRES" :class="['input-base', errors.NOMBRES && 'input-error']"
                  type="text" placeholder="Tus nombres" maxlength="100"/>
                <span v-if="errors.NOMBRES" class="text-xs text-red-500">{{ errors.NOMBRES }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Apellido paterno <span class="text-red-500">*</span></label>
                <input v-model="modelo.APATERNO" :class="['input-base', errors.APATERNO && 'input-error']"
                  type="text" placeholder="Apellido paterno" maxlength="50"/>
                <span v-if="errors.APATERNO" class="text-xs text-red-500">{{ errors.APATERNO }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Apellido materno <span class="text-red-500">*</span></label>
                <input v-model="modelo.AMATERNO" :class="['input-base', errors.AMATERNO && 'input-error']"
                  type="text" placeholder="Apellido materno" maxlength="50"/>
                <span v-if="errors.AMATERNO" class="text-xs text-red-500">{{ errors.AMATERNO }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Fecha de nacimiento <span class="text-red-500">*</span></label>
                <date-picker
                  v-model="modelo.FNACIMIENTO"
                  :value="modelo.FNACIMIENTO"
                  :class="['input-base w-full', errors.FNACIMIENTO && 'input-error']"
                  placeholder="YYYY-MM-DD"
                  valueType="format"
                  :disabledDate="t => t.getTime() > Date.now()"
                  @change="d => modelo.FNACIMIENTO = d"
                />
                <span v-if="errors.FNACIMIENTO" class="text-xs text-red-500">{{ errors.FNACIMIENTO }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Profesión</label>
                <input v-model="modelo.PROFESION" class="input-base" type="text"
                  placeholder="Ej: Abogado, Contador…" maxlength="100"/>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Cargo</label>
                <input v-model="modelo.CARGO" class="input-base" type="text"
                  placeholder="Ej: Gerente, Director…" maxlength="100"/>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-100 dark:border-gray-700 mb-4"/>

            <!-- Sub-sección: Contacto y Seguridad -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-brand-blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <h4 class="text-sm font-bold text-gray-700 dark:text-gray-200 m-0">Contacto y Seguridad</h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Correo electrónico <span class="text-red-500">*</span></label>
                <input v-model="modelo.EMAIL" disabled
                  :class="['input-base', errors.EMAIL && 'input-error']"
                  type="email" placeholder="correo@ejemplo.com" maxlength="100"/>
                <span v-if="errors.EMAIL" class="text-xs text-red-500">{{ errors.EMAIL }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Teléfono <span class="text-red-500">*</span></label>
                <input v-model="modelo.TELEFONO"
                  :class="['input-base', errors.TELEFONO && 'input-error']"
                  type="tel" placeholder="987654321" maxlength="15"
                  @input="modelo.TELEFONO = modelo.TELEFONO.replace(/[^0-9]/g,'')"/>
                <span v-if="errors.TELEFONO" class="text-xs text-red-500">{{ errors.TELEFONO }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Dirección</label>
                <input v-model="modelo.DIRECCION" class="input-base" type="text"
                  placeholder="Av. Principal 123, Lima" maxlength="200"/>
              </div>
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400">Contraseña</label>
                <div class="relative">
                  <input v-model="modelo.PASSWORD"
                    :type="visualizar ? 'text' : 'password'"
                    :class="['input-base pr-10', errors.PASSWORD && 'input-error']"
                    placeholder="••••••••" maxlength="50"/>
                  <button type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    @click="visualizar = !visualizar">
                    <i :class="visualizar ? 'fas fa-eye' : 'fas fa-eye-slash'"/>
                  </button>
                </div>
                <span v-if="errors.PASSWORD" class="text-xs text-red-500">{{ errors.PASSWORD }}</span>
                <span v-else class="flex items-center gap-1 text-xs text-gray-400">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Dejar en blanco para mantener la contraseña actual
                </span>
              </div>
            </div>

            <!-- Guardar -->
            <div class="flex justify-end pt-5 mt-4 border-t border-gray-100 dark:border-gray-700">
              <save-button label="Guardar Cambios" :loading="isLoading" size="lg"/>
            </div>
          </SectionCard>

        </form>
      </div>

      <!-- ── Tab: Contactos ── -->
      <div v-if="active === 'contactos'" class="animate-fade-up flex flex-col gap-4">

        <!-- Solicitudes pendientes -->
        <div v-if="contacto.pendientes.length" class="bg-white dark:bg-gray-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 px-5 py-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Solicitudes de contacto pendientes
          </h3>
          <div class="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
            <div
              v-for="item in contacto.pendientes"
              :key="item.ID"
              class="flex items-center gap-3 py-3"
            >
              <img
                v-if="item.RTAFTO"
                :src="item.RTAFTO"
                class="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
              <div v-else class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-semibold flex-shrink-0">
                {{ (item.NOMBRES || '?').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                  {{ item.NOMBRES }} {{ item.APELLIDOS }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ item.EMAIL }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  @click="aceptarSolicitud(item)"
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors"
                  @click="rechazarSolicitud(item)"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Toolbar: buscador + botón nuevo -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 px-5 py-4 flex items-center gap-3">
          <search-bar
            placeholder="Buscar por nombre o correo..."
            class="flex-1"
            @search="buscarContactos"
          />
          <search-button @click="buscarContactos(contacto.search || '')"/>
          <new-button label="Nuevo" @click="showModalAgregar = true"/>
        </div>

        <!-- Tabla de contactos -->
        <data-table
          :items="contacto.datos"
          :fields="contacto.fields"
          :actions="contacto.actions"
          :loading="contacto.grid.isLoading"
          empty-text="No se encontraron contactos"
        />
      </div>
    </div>

    <!-- Modal agregar contacto -->
    <modal-agregar-contacto
      v-model="showModalAgregar"
      :existing-ids="contactosExcluidos"
      @added="searchContacto()"
    />

    <!-- Modal eliminar contacto -->
    <ModalEliminar
      message="¿Está seguro de eliminar este contacto?"
      buttonOk="Sí, eliminar"
      :action="deleteContacto"
      :openDelete="modalEliminarContacto.show"
      :closeHandler="() => modalEliminarContacto.show = false"
    />

    <!-- ── Cropper overlay ── -->
    <Transition name="fade">
      <div v-if="showCropper"
        class="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-modal">
          <advanced-cropper
            :src="cropperImage"
            :stencil-props="{ aspectRatio: 1, movable: true, resizable: true }"
            :stencil-component="CircleStencil"
            class="h-80 w-full"
            ref="cropperRef"
          />
        </div>
        <div class="flex gap-3 mt-4">
          <save-button label="Recortar y guardar" native-type="button" size="lg" @click="applyCrop"/>
          <cancel-button label="Cancelar" size="lg" @click="cancelCrop"/>
        </div>
      </div>
    </Transition>

  </section>
</template>

<script>
import { toast } from 'vue3-toastify';
import UserProxy from "@/proxies/UserProxy";
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import team2 from "@/assets/img/resources/perfil.png";
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import DataTable from "@/components/Tables/DataTable.vue";
import SearchBar from "@/components/Common/SearchBar.vue";
import NewButton from "@/components/Common/NewButton.vue";
import ModalAgregarContacto from "./modals/ModalAgregarContacto.vue";
import ModalEliminar from "../shared/ModalEliminar.vue";

export default {
  components: {
    AdvancedCropper: Cropper,
    DataTable,
    SearchBar,
    NewButton,
    ModalAgregarContacto,
    ModalEliminar,
  },
  data() {
    return {
      team2,
      CircleStencil,
      showCropper: false,
      cropperImage: null,
      croppedFile: null,
      avatarLoading: false,
      isLoading: true,
      visualizar: false,
      showModalAgregar: false,
      modalEliminarContacto: { show: false, data: null },
      active: 'informacionPersonal',
      tabs: [
        { id: 'informacionPersonal', label: 'Información Personal' },
        { id: 'contactos',           label: 'Contactos' },
      ],
      notifOpts: [
        {
          value: '1', title: 'Correo electrónico', subtitle: 'Recibe notificaciones por correo',
          icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
        },
        {
          value: '2', title: 'Plataforma', subtitle: 'Recibe notificaciones en JurisSearch',
          icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
        },
        {
          value: '3', title: 'Ambos medios', subtitle: 'Correo y plataforma',
          icon: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/><circle cx="18" cy="8" r="3"/>',
        },
        {
          value: '4', title: 'Ninguno', subtitle: 'No recibir notificaciones',
          icon: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/><line x1="21" y1="3" x2="3" y2="21"/>',
        },
      ],
      modelo: {
        APATERNO: '', AMATERNO: '', NOMBRES: '', EMAIL: '',
        TELEFONO: '', FNACIMIENTO: '', CDESTDO: '', PASSWORD: '',
        FCRCN: '', PROFESION: '', CARGO: '', DIRECCION: '',
        DATOS: {}, RTAFTO: '', NOTIFI: '4',
      },
      errors: {
        NOMBRES: null, APATERNO: null, AMATERNO: null,
        EMAIL: null, TELEFONO: null, FNACIMIENTO: null, PASSWORD: null,
      },
      contacto: {
        search: null,
        data: null,
        datos: [],
        grid: { items: [], currentPage: 1, perPage: 10, totalRows: 120, isLoading: false, pageOptions: [5,10,15,50] },
        fields: [
          { key: 'RN', label: '#', class: 'w-10 text-gray-400 text-xs font-medium' },
          {
            key: 'RTAFTO', label: 'Contacto', html: true,
            formatter: (v, k, item) => {
              const src = (v && v !== 'null') ? v : team2;
              const dot = item.ESTADO === 'A' ? 'bg-emerald-400' : 'bg-amber-400';
              return `<div class="flex items-center gap-3">
                <div class="relative flex-shrink-0">
                  <img src="${src}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${team2}'"
                    class="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700" alt="avatar"/>
                  <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${dot}"></span>
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-gray-800 dark:text-gray-100 m-0 leading-tight">${item.DESCP || ''}</p>
                  <span class="text-xs text-gray-400">${(item.EMAIL||'').toLowerCase()}</span>
                  <span class="block text-[10px] text-gray-400 italic">${item.ROL === 'RECEPTOR' ? 'Te agregó' : 'Agregado'}</span>
                </div>
              </div>`;
            },
          },
          {
            key: 'CONTACTO_DESDE', label: 'Contacto desde', html: true, class: 'text-sm',
            formatter: (v) => {
              if (!v) return '<span class="text-gray-400 text-xs">—</span>';
              const desde = moment.utc(v).local();
              const rel = desde.fromNow();
              const relCap = rel.charAt(0).toUpperCase() + rel.slice(1);
              const exacto = desde.format('DD/MM/YYYY');
              return `<div class="flex flex-col leading-tight">
                <span class="text-gray-700 dark:text-gray-200 text-xs font-medium">${relCap}</span>
                <span class="text-gray-400 text-[11px]">${exacto}</span>
              </div>`;
            },
          },
          {
            key: 'ESTADO', label: 'Estado', html: true, class: 'text-center',
            formatter: (v) => v === 'A'
              ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Aceptado</span>`
              : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pendiente</span>`,
          },
        ],
        actions: {
          delete: { label: 'Eliminar', action: null },
        },
        pendientes: [],
        loadingPendientes: false,
      },
    };
  },
  props: {
    UPDATERTAFTO: { type: Function, default: () => {} },
    RTAFTO:       { type: String,   default: null      },
  },
  computed: {
    contactosExcluidos() {
      return [
        ...this.contacto.datos.map(d => d.IDRECEPT),
        ...this.contacto.pendientes.map(p => p.IDEMISOR),
      ];
    },
  },
  methods: {
    validate() {
      this.errors = { NOMBRES: null, APATERNO: null, AMATERNO: null, EMAIL: null, TELEFONO: null, FNACIMIENTO: null, PASSWORD: null };
      let ok = true;
      const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const pwdRe   = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
      if (!this.modelo.NOMBRES?.trim())  { this.errors.NOMBRES    = 'Campo requerido'; ok = false; }
      if (!this.modelo.APATERNO?.trim()) { this.errors.APATERNO   = 'Campo requerido'; ok = false; }
      if (!this.modelo.AMATERNO?.trim()) { this.errors.AMATERNO   = 'Campo requerido'; ok = false; }
      if (!this.modelo.FNACIMIENTO)      { this.errors.FNACIMIENTO = 'Campo requerido'; ok = false; }
      if (!this.modelo.EMAIL?.trim() || !emailRe.test(this.modelo.EMAIL)) {
        this.errors.EMAIL = 'El correo electrónico no es válido'; ok = false;
      }
      const tel = this.modelo.TELEFONO?.trim() || '';
      if (!tel || !/^\d+$/.test(tel) || tel.length < 9 || tel.length > 15) {
        this.errors.TELEFONO = 'Teléfono: solo dígitos, entre 9 y 15 caracteres'; ok = false;
      }
      const pwd = this.modelo.PASSWORD || '';
      if (pwd && (pwd.length < 8 || !pwdRe.test(pwd))) {
        this.errors.PASSWORD = 'Mínimo 8 caracteres con letra, número y símbolo'; ok = false;
      }
      return ok;
    },
    openFileInput() {
      this.$refs.avatarInput?.click();
    },
    onSelectImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { this.cropperImage = ev.target.result; this.showCropper = true; this.croppedFile = null; };
      reader.readAsDataURL(file);
    },
    cancelCrop() {
      this.showCropper = false; this.cropperImage = null;
      if (this.$refs.avatarInput) this.$refs.avatarInput.value = null;
    },
    applyCrop() {
      const cropper = this.$refs.cropperRef;
      if (!cropper) return;
      const canvas = cropper.getResult().canvas;
      if (!canvas) { toast.error('No se pudo recortar la imagen.'); return; }

      canvas.toBlob(async (blob) => {
        if (!blob) { toast.error('No se pudo recortar la imagen.'); return; }

        const file = new File([blob], 'avatar.png', { type: 'image/png' });
        const oldRtafto = this.modelo.RTAFTO;

        // Preview optimista: mostrar blob local de inmediato
        this.modelo.RTAFTO = URL.createObjectURL(blob);
        this.croppedFile = null;
        this.showCropper = false;
        this.cropperImage = null;
        if (this.$refs.avatarInput) this.$refs.avatarInput.value = null;

        // Subir avatar de inmediato sin esperar "Guardar Cambios"
        this.avatarLoading = true;
        const t = toast.loading('Subiendo foto...');
        try {
          const r = await UserProxy.updateAvatar(file, oldRtafto);
          if (r.STATUS) {
            if (r.RTAFTO) this.modelo.RTAFTO = r.RTAFTO;
            const u = JSON.parse(localStorage.getItem('user')) || {};
            u.RTAFTO = this.modelo.RTAFTO;
            localStorage.setItem('user', JSON.stringify(u));
            this.UPDATERTAFTO();
            toast.success('Foto de perfil actualizada');
          } else {
            this.modelo.RTAFTO = oldRtafto;
            toast.error(r.MESSAGE || 'Error al subir la foto');
          }
        } catch (err) {
          this.modelo.RTAFTO = oldRtafto;
          toast.error(err?.MESSAGE || 'Error al subir la foto');
        } finally {
          toast.remove(t);
          this.avatarLoading = false;
        }
      }, 'image/png');
    },
    async save(e) {
      e.preventDefault();
      if (!this.validate()) return;
      // El avatar ya se guarda de inmediato en applyCrop/removeAvatar
      // Aquí solo se guardan los datos del perfil (sin archivo)
      const formData = new FormData();
      Object.keys(this.modelo).forEach(k => {
        if (k === 'RTAFTO') return;
        if (k === 'PASSWORD' && !this.modelo[k]) return;
        formData.append(k, this.modelo[k]);
      });
      formData.append('files', '');

      this.isLoading = true;
      const t = toast.loading('Guardando datos...');
      await UserProxy.editarFoce(formData)
        .then(async r => {
          if (r.STATUS) { toast.success('Datos actualizados con éxito'); await this.getUser(); }
          else          { toast.error(r.MESSAGE); }
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al actualizar sus datos'))
        .finally(() => { toast.remove(t); this.isLoading = false; });
    },
    async getUser() {
      this.isLoading = true;
      await UserProxy.getUsuario()
        .then((r) => {
          let datos = {};
          try { datos = r.DATOS ? (JSON.parse(r.DATOS)?.[0] || {}) : {}; } catch (_e) { /* JSON inválido */ }
          this.modelo = {
            APATERNO:    r.APATERNO    || r.apellidoPaterno || '',
            AMATERNO:    r.AMATERNO    || r.apellidoMaterno || '',
            NOMBRES:     r.NOMBRES     || r.nombres         || '',
            EMAIL:       r.EMAIL       || r.email           || '',
            TELEFONO:    r.TELEFONO    || r.telefono        || '',
            FNACIMIENTO: (r.FNACIMIENTO || r.fechaNacimiento || '').toString().substring(0, 10) || '',
            CDESTDO:     r.CDESTDO     || r.estado          || '',
            PASSWORD:    r.PASSWORD    || '',
            FCRCN:       (r.FCRCN || r.fechaCreacion || '').toString().substring(0, 10) || '',
            PROFESION:   r.PROFESION   || r.profesion       || '',
            CARGO:       r.CARGO       || r.cargo           || '',
            DIRECCION:   r.DIRECCION   || r.direccion       || '',
            DATOS:       datos,
            RTAFTO:      r.RTAFTO      || r.fotoRuta        || '',
            NOTIFI:      r.NOTIFI      || r.notificaciones  || '4',
          };
          const u = JSON.parse(localStorage.getItem('user')) || {};
          u.RTAFTO = this.modelo.RTAFTO;
          localStorage.setItem('user', JSON.stringify(u));
          if (this.$refs.avatarInput) this.$refs.avatarInput.value = null;
          this.UPDATERTAFTO();
        })
        .catch(err => toast.error(err?.MESSAGE || err?.message || 'Error al cargar el perfil'))
        .finally(() => this.isLoading = false);
    },
    updateActive(text) { this.active = text; },
    formatDate(fecha, formato) { return moment(fecha).format(formato); },
    async removeAvatar() {
      const oldRtafto = this.modelo.RTAFTO;
      this.modelo.RTAFTO = null;
      this.croppedFile = null;
      if (this.$refs.avatarInput) this.$refs.avatarInput.value = null;

      this.avatarLoading = true;
      const t = toast.loading('Eliminando foto...');
      try {
        const r = await UserProxy.updateAvatar(null, oldRtafto);
        if (r.STATUS) {
          const u = JSON.parse(localStorage.getItem('user')) || {};
          u.RTAFTO = null;
          localStorage.setItem('user', JSON.stringify(u));
          this.UPDATERTAFTO();
          toast.success('Foto de perfil eliminada');
        } else {
          this.modelo.RTAFTO = oldRtafto;
          toast.error(r.MESSAGE || 'Error al eliminar la foto');
        }
      } catch (err) {
        this.modelo.RTAFTO = oldRtafto;
        toast.error(err?.MESSAGE || 'Error al eliminar la foto');
      } finally {
        toast.remove(t);
        this.avatarLoading = false;
      }
    },
    async searchSugges() {
      if (!this.contacto.search || this.contacto.search.length < 6) {
        this.contacto.data = null; return;
      }
      await UserProxy.list({ ROWS: 10000, INIT: 0, DESC: this.contacto.search.trim(), CESTDO: 'A' }, '10')
        .then(data => {
          this.contacto.data = data.map(item => ({
            ...item,
            DESCP: this.fmt(`${item.NOMBRES||''} ${item.APATERNO||''} ${item.AMATERNO||''}`),
          }));
        })
        .catch(err => { this.contacto.data = null; toast.error(err?.MESSAGE || 'Error al buscar contactos'); });
    },
    fmt(t) { return t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '); },
    fmtFecha(f) { try { return moment.utc(f).local().format('DD/MM/YYYY, HH:mm'); } catch { return ''; } },
    buscarContactos(q) {
      this.searchContacto(q);
    },
    searchContacto(q = '') {
      this.contacto.grid.isLoading = true;
      const params = q ? { DSCRPCN: q } : {};
      UserProxy.getContactos(params)
        .then(data => {
          const items = Array.isArray(data) ? data : [];
          this.contacto.datos = items.map((item, i) => ({
            RN: i + 1, ...item,
            DESCP: this.fmt(`${item.NOMBRES||''} ${item.APATERNO||''} ${item.AMATERNO||''}`),
            CONTACTO_DESDE: item.FCRCN || null,
          }));
          this.contacto.grid.totalRows = items.length;
        })
        .catch(err => { this.contacto.datos = []; toast.error(err?.MESSAGE || 'Error al cargar contactos'); })
        .finally(() => this.contacto.grid.isLoading = false);
    },
    async createContact(data) {
      const r = await this.$swal({ title: 'Agregar contacto', text: `¿Agregar a ${data.DESCP} como contacto?`,
        icon: 'warning', showCancelButton: true, confirmButtonColor: '#e71fb3', cancelButtonColor: '#6b7280',
        cancelButtonText: 'Cancelar', confirmButtonText: 'Sí, agregar' });
      if (!r.isConfirmed) return;
      this.isLoading = true;
      await UserProxy.createContacto({ IDRECEPT: data.ID, ESTADO: 'false', CDESTDO: 'A' })
        .then(res => {
          if (res.STATUS) { toast.success('Solicitud de contacto enviada'); this.contacto.search = null; this.contacto.data = null; this.searchContacto(); }
          else            { toast.error(res.MESSAGE); }
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al agregar contacto'))
        .finally(() => this.isLoading = false);
    },
    async deleteContacto() {
      if (!this.modalEliminarContacto.data?.ID) return;
      await UserProxy.deleteContacto(this.modalEliminarContacto.data.ID)
        .then(res => {
          if (res.STATUS) {
            toast.success('Contacto eliminado');
            this.contacto.search = null; this.contacto.data = null; this.searchContacto();
            this.modalEliminarContacto.show = false;
          } else toast.error(res.MESSAGE);
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al eliminar contacto'));
    },
    searchPendientes() {
      this.contacto.loadingPendientes = true;
      UserProxy.getPendingContactos()
        .then(data => { this.contacto.pendientes = Array.isArray(data) ? data : []; })
        .catch(err => { this.contacto.pendientes = []; toast.error(err?.MESSAGE || 'Error al cargar solicitudes pendientes'); })
        .finally(() => this.contacto.loadingPendientes = false);
    },
    async aceptarSolicitud(item) {
      const r = await this.$swal({ title: 'Aceptar solicitud', text: `¿Aceptar a ${item.NOMBRES} ${item.APELLIDOS} como contacto?`,
        icon: 'question', showCancelButton: true, confirmButtonColor: '#e71fb3', cancelButtonColor: '#6b7280',
        cancelButtonText: 'Cancelar', confirmButtonText: 'Sí, aceptar' });
      if (!r.isConfirmed) return;
      this.isLoading = true;
      await UserProxy.acceptContacto(item.ID)
        .then(res => {
          if (res.STATUS) { toast.success('Contacto aceptado'); this.searchPendientes(); this.searchContacto(); }
          else            { toast.error(res.MESSAGE); }
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al aceptar la solicitud'))
        .finally(() => this.isLoading = false);
    },
    async rechazarSolicitud(item) {
      const r = await this.$swal({ title: 'Rechazar solicitud', text: `¿Rechazar la solicitud de ${item.NOMBRES} ${item.APELLIDOS}?`,
        icon: 'warning', showCancelButton: true, confirmButtonColor: '#e71fb3', cancelButtonColor: '#6b7280',
        cancelButtonText: 'Cancelar', confirmButtonText: 'Sí, rechazar' });
      if (!r.isConfirmed) return;
      this.isLoading = true;
      await UserProxy.deleteContacto(item.ID)
        .then(res => {
          if (res.STATUS) { toast.success('Solicitud rechazada'); this.searchPendientes(); }
          else            { toast.error(res.MESSAGE); }
        })
        .catch(err => toast.error(err?.MESSAGE || 'Error al rechazar la solicitud'))
        .finally(() => this.isLoading = false);
    },
  },
  watch: {
    active(v) { if (v === 'contactos') { this.searchContacto(); this.searchPendientes(); } },
  },
  mounted() {
    this.contacto.actions.delete.action = (item) => {
      this.modalEliminarContacto.data = item;
      this.modalEliminarContacto.show = true;
    };
    this.getUser();

    if (this.$route.query.tab === 'contactos') {
      this.active = 'contactos';
      this.searchContacto();
      this.searchPendientes();
    }
  },
};
</script>
