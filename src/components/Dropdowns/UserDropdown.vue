<template>
  <div class="flex items-center gap-4 relative">
    <!-- Botón de notificaciones -->
    <button class="relative flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-gray-700 border-0 rounded-full cursor-pointer transition-all hover:bg-slate-200 dark:hover:bg-gray-600"
      @click="toggleSidebarNotificaciones">
      <svg class="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
      <span v-if="totalNotificaciones > 0"
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[5px] bg-red-500 text-white text-[10px] font-semibold rounded-[9px] flex items-center justify-center border-2 border-white shadow-sm">
        {{ totalNotificaciones > 99 ? '99+' : totalNotificaciones }}
      </span>
    </button>

    <!-- Overlay -->
    <div v-if="sidebarNotificacionesShow"
      class="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[998] animate-fade-in"
      @click="closeSidebarNotificaciones"></div>

    <!-- Sidebar de notificaciones -->
    <transition name="slide-fade">
      <div v-if="sidebarNotificacionesShow"
        class="fixed top-0 right-0 w-[360px] max-sm:w-full h-screen bg-white dark:bg-gray-800 shadow-[-2px_0_12px_rgba(0,0,0,0.1)] dark:shadow-[-2px_0_16px_rgba(0,0,0,0.4)] z-[999] flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center px-5 py-4 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gray-100">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-slate-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <h3 class="text-[1.125rem] font-bold m-0 text-slate-800 dark:text-gray-100">Notificaciones</h3>
          </div>
          <div class="flex items-center gap-1.5">
            <button class="settings-btn flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-gray-700 border-0 rounded-full cursor-pointer transition-all mr-1.5 hover:bg-slate-200 dark:hover:bg-gray-600"
              @click.stop="toggleSelectionMenu" title="Opciones de selección">
              <svg class="w-[18px] h-[18px] text-slate-400 dark:text-gray-400 hover:text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 014.34 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 016.1 4.34l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.02a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 0119.66 6.1l-.06.06a1.65 1.65 0 00-.33 1.82V8a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </button>
            <button class="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-gray-700 border-0 rounded-full cursor-pointer transition-all hover:bg-slate-200 dark:hover:bg-gray-600"
              @click="closeSidebarNotificaciones">
              <svg class="w-[18px] h-[18px] text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Menú de selección -->
        <div v-if="notificaciones.length > 0 && showSelectionMenu" class="selection-menu px-3 py-3 border-b border-black/5 dark:border-gray-700 bg-white dark:bg-gray-800" @click.stop>
          <label class="selection-checkbox flex items-center gap-2 mb-1.5 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-slate-50 dark:hover:bg-gray-700">
            <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" class="checkbox-custom" />
            <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">Eliminar todas las notificaciones ({{ selectedNotifications.length }})</span>
          </label>
          <label class="selection-checkbox flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-slate-50 dark:hover:bg-gray-700">
            <input type="checkbox" :checked="isAllNonType2Selected" @change="toggleSelectNonType2" class="checkbox-custom" />
            <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
              Eliminar todas, excepto <span class="font-normal text-slate-500 dark:text-gray-400 italic">nuevas publicaciones</span>
            </span>
          </label>
          <div class="mt-2">
            <button v-if="selectedNotifications.length > 0"
              class="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white border-0 rounded-[7px] text-[0.8125rem] font-semibold cursor-pointer transition-all whitespace-nowrap shadow-[0_2px_4px_rgba(239,68,68,0.2)] hover:-translate-y-px hover:shadow-[0_4px_8px_rgba(239,68,68,0.3)] active:translate-y-0"
              @click="deleteSelectedNotifications"
              :title="`Eliminar ${selectedNotifications.length} notificación(es)`">
              <svg class="w-[14px] h-[14px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Eliminar ({{ selectedNotifications.length }})
            </button>
          </div>
        </div>

        <!-- Lista de notificaciones -->
        <div class="notif-scroll flex-1 overflow-y-auto">
          <div v-for="(notificacion, index) in notificaciones" :key="index"
            :class="['flex gap-2.5 pr-11 pl-3.5 py-3 border-0 border-b border-slate-100 dark:border-gray-700 transition-all relative',
              isNotificationSelected(notificacion.IDNT) ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700']">

            <label class="flex items-start pt-1 cursor-pointer">
              <input type="checkbox" :checked="isNotificationSelected(notificacion.IDNT)"
                @change="toggleSelectNotification(notificacion.IDNT)" class="checkbox-custom mt-0" />
            </label>

            <!-- Icono -->
            <div :class="['flex-shrink-0 w-[34px] h-[34px] flex items-center justify-center rounded-full',
              notificacion.TIPO == 1 ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600']">
              <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <template v-if="notificacion.TIPO == 1">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </template>
                <template v-else-if="notificacion.TIPO == 2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="9 12 13 16 13 8"/>
                </template>
                <template v-else>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </template>
              </svg>
            </div>

            <!-- Cuerpo -->
            <div class="flex-1 min-w-0">
              <p class="text-[0.8125rem] text-slate-800 dark:text-gray-200 leading-snug m-0 mb-1 break-words">{{ notificacion.DESCP }}</p>
              <div class="flex justify-between items-center gap-2">
                <span class="flex items-center gap-1 text-[0.6875rem] text-slate-400 dark:text-gray-500">
                  <svg class="w-[11px] h-[11px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ notificacion.FECHA }}
                </span>
                <div v-if="notificacion.TIPO == 1 && notificacion.ESTADO == 0" class="flex gap-1.5">
                  <button class="flex items-center justify-center w-[26px] h-[26px] border-0 rounded-[5px] cursor-pointer transition-all bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95"
                    @click="updateContacto(notificacion)" title="Aceptar">
                    <svg class="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </button>
                  <button class="flex items-center justify-center w-[26px] h-[26px] border-0 rounded-[5px] cursor-pointer transition-all bg-red-500 text-white hover:bg-red-600 active:scale-95"
                    @click="deleteContacto(notificacion)" title="Eliminar">
                    <svg class="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div v-else-if="notificacion.TIPO == 2" class="flex gap-1.5">
                  <button class="flex items-center justify-center w-[26px] h-[26px] border-0 rounded-[5px] cursor-pointer transition-all bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95"
                    @click="goToNotification(notificacion)" title="Ir a detalle">
                    <svg class="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="7 17 17 7"/><polyline points="7 7 17 7 17 17"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Botón eliminar individual -->
            <button class="delete-notif-btn absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-[30px] h-[30px] bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-full cursor-pointer text-slate-400 dark:text-gray-400 transition-all hover:!bg-red-100 hover:!border-red-200 hover:!text-red-500 hover:scale-[1.08] active:-translate-y-1/2"
              @click="deleteNotificacionDirecto(notificacion.IDNT)" title="Eliminar notificación">
              <svg class="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>

          <div v-if="notificaciones.length === 0" class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <svg class="w-14 h-14 text-slate-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <p class="text-base font-semibold text-slate-600 dark:text-gray-300 m-0 mb-1.5">No hay notificaciones</p>
            <span class="text-sm text-slate-400 dark:text-gray-500">Estás al día</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Divisor -->
    <div class="w-px h-8 bg-gradient-to-b from-transparent via-slate-200 dark:via-gray-600 to-transparent"></div>

    <!-- Avatar usuario -->
    <div class="w-10 h-10 rounded-[10px] overflow-hidden border-2 border-slate-200 dark:border-gray-600 transition-all hover:border-brand-blue hover:shadow-[0_2px_8px_rgba(24,92,230,0.15)] hover:scale-[1.03]">
      <img :src="RTAFTO || team2" @error="$event.target.src = team2" referrerpolicy="no-referrer" alt="Avatar" class="w-full h-full object-cover" />
    </div>

    <!-- Toggle dropdown -->
    <button ref="btnDropdownRef"
      class="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-700 border-2 border-slate-200 dark:border-gray-600 rounded-lg cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-gray-600 hover:border-slate-300 dark:hover:border-gray-500"
      @click="toggleDropdown">
      <svg :class="['w-5 h-5 text-slate-500 dark:text-gray-300 transition-transform duration-200', dropdownPopoverShow ? 'rotate-180' : '']"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <!-- Dropdown de usuario -->
    <transition name="dropdown-fade">
      <div v-if="dropdownPopoverShow" ref="popoverDropdownRef"
        class="absolute top-[calc(100%+0.75rem)] right-0 min-w-[260px] bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 z-[1000] border border-slate-200 dark:border-gray-700">
        <div class="flex gap-3 mb-3">
          <div class="w-11 h-11 rounded-[10px] overflow-hidden border-2 border-slate-200 dark:border-gray-600 flex-shrink-0">
            <img :src="RTAFTO || team2" @error="$event.target.src = team2" referrerpolicy="no-referrer" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col justify-center min-w-0">
            <span class="text-sm font-semibold text-slate-800 dark:text-gray-100 mb-0.5 truncate">{{ USUARIO.NOMBRES }}</span>
            <span class="text-xs text-slate-500 dark:text-gray-400 truncate">{{ USUARIO.EMAIL?.toLowerCase() }}</span>
          </div>
        </div>
        <div class="h-px bg-slate-200 dark:bg-gray-700 my-3"></div>
        <button class="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-brand-blue hover:text-white hover:border-brand-blue dark:hover:bg-red-600 dark:hover:border-red-500 dark:hover:text-white hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(24,92,230,0.2)] active:translate-y-0"
          @click="signOut">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import team2 from "@/assets/img/resources/perfil.png";
import LoginProxy from "@/proxies/LoginProxy";
import UserProxy from "@/proxies/UserProxy";
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      dropdownPopoverShow: false,
      sidebarNotificacionesShow: false,
      team2,
      totalNotificaciones: 0,
      notificaciones: [],
      selectedNotifications: [],
      USUARIO: { NOMBRES: "", EMAIL: "", RTAFTO: "" },
      domain: `${process.env.VUE_APP_FRONT_URL || 'https://side.jurissearch.com'}/usuario/investigacion?search=`,
      showSelectionMenu: false,
    };
  },
  props: {
    RTAFTO: { type: String, default: "" },
  },
  methods: {
    goToNotification(notificacion) {
      const src = notificacion.URL_ACCION || '';
      const match = src.match(/\/(\d+)\/?$/);
      const paramsId = match ? match[1] : null;

      const isUsuario = this.$route?.path?.startsWith('/usuario');
      const base = isUsuario ? '/usuario/investigacion' : '/admin/investigacion';
      const dest = paramsId ? `${base}?paramsId=${paramsId}` : base;

      this.closeSidebarNotificaciones();
      this.$router.push(dest);
    },
    toggleDropdown(event) {
      event.preventDefault();
      if (this.dropdownPopoverShow) {
        this.dropdownPopoverShow = false;
      } else {
        this.dropdownPopoverShow = true;
        createPopper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, { placement: "bottom-start" });
      }
    },
    toggleSidebarNotificaciones() {
      this.sidebarNotificacionesShow = !this.sidebarNotificacionesShow;
      if (!this.sidebarNotificacionesShow) {
        this.showSelectionMenu = false;
      } else {
        this.getNotifications().then(() => {
          if (this.totalNotificaciones > 0) {
            UserProxy.markAllReadNotif()
              .then(() => {
                this.notificaciones = this.notificaciones.map(n => ({ ...n, ESTADO: 1 }));
                this.totalNotificaciones = 0;
              })
              .catch((err) => console.error("Error al marcar notificaciones como leídas:", err));
          }
        });
      }
    },
    toggleSelectionMenu() {
      this.showSelectionMenu = !this.showSelectionMenu;
      if (this.showSelectionMenu) {
        setTimeout(() => document.addEventListener('click', this.handleDocumentClick), 0);
      } else {
        document.removeEventListener('click', this.handleDocumentClick);
      }
    },
    closeSidebarNotificaciones() {
      this.sidebarNotificacionesShow = false;
      this.selectedNotifications = [];
      if (this.showSelectionMenu) {
        this.showSelectionMenu = false;
        document.removeEventListener('click', this.handleDocumentClick);
      }
    },
    handleDocumentClick(e) {
      const settingsBtn = this.$el.querySelector('.settings-btn');
      const selectionMenu = this.$el.querySelector('.selection-menu');
      if (settingsBtn?.contains(e.target) || selectionMenu?.contains(e.target)) return;
      this.showSelectionMenu = false;
      document.removeEventListener('click', this.handleDocumentClick);
    },
    async signOut() {
      localStorage.setItem('isLoggingOut', 'true');
      const accessToken = localStorage.getItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      if (accessToken) LoginProxy.logout(accessToken).catch(() => {});
      this.$router.push("/auth/login");
    },
    async getNotifications() {
      await UserProxy.getNotificaciones()
        .then((response) => {
          if (response?.length > 0) {
            this.notificaciones = response.map((n, i) => ({ ...n, RN: i + 1 }));
            this.totalNotificaciones = this.notificaciones.filter(n => n.ESTADO === 0).length;
          } else {
            this.notificaciones = [];
            this.totalNotificaciones = 0;
          }
        })
        .catch((err) => { console.error("Error al obtener notificaciones:", err); this.notificaciones = []; });
    },
    async deleteContacto(item) {
      await UserProxy.deleteContacto(item.ID)
        .then((response) => {
          const msg = response.STATUS ? "Notificación eliminada." : response.MESSAGE;
          if (response.STATUS) {
            this.notificaciones = this.notificaciones.filter(n => n.RN !== item.RN);
            this.totalNotificaciones = this.notificaciones.length;
            toast.success(msg);
          } else toast.error(msg);
        })
        .catch(() => toast.error("Error al eliminar la notificación."));
    },
    async updateContacto(item) {
      await UserProxy.updateContacto({ ID: item.ID, ESTADO: true })
        .then((response) => {
          const msg = response.STATUS ? "Contacto agregado correctamente." : response.MESSAGE;
          if (response.STATUS) {
            toast.success(msg);
            this.notificaciones = this.notificaciones.map(n =>
              n.ID === item.ID ? { ...n, ESTADO: 1 } : n
            );
            this.totalNotificaciones = this.notificaciones.filter(n => n.ESTADO === 0).length;
          } else toast.error(msg);
        })
        .catch(() => toast.error("Error al actualizar la notificación."));
    },
    async deleteNotificacionDirecto(id) {
      try {
        const response = await UserProxy.deleteNotificaciones(id.toString());
        if (response.STATUS) { toast.success('Notificación eliminada correctamente'); await this.getNotifications(); }
        else toast.error(response.MESSAGE || 'Error al eliminar');
      } catch (e) { toast.error('Error al eliminar la notificación'); }
    },
    async deleteNotificacion(ids) {
      const idsArray = Array.isArray(ids) ? ids : [ids];
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        html: idsArray.length === 1
          ? 'Se eliminará esta notificación permanentemente.'
          : `Se eliminarán <strong>${idsArray.length}</strong> notificaciones permanentemente.`,
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', reverseButtons: true,
      });
      if (!result.isConfirmed) return;
      try {
        const response = await UserProxy.deleteNotificaciones(idsArray.join(', '));
        if (response.STATUS) {
          toast.success(idsArray.length === 1 ? 'Notificación eliminada' : `${idsArray.length} notificaciones eliminadas`);
          this.selectedNotifications = [];
          await this.getNotifications();
        } else toast.error(response.MESSAGE || 'Error al eliminar');
      } catch (e) { toast.error('Error al eliminar las notificaciones'); }
    },
    toggleSelectNotification(id) {
      const idx = this.selectedNotifications.indexOf(id);
      if (idx > -1) this.selectedNotifications.splice(idx, 1);
      else this.selectedNotifications.push(id);
    },
    isNotificationSelected(id) { return this.selectedNotifications.includes(id); },
    toggleSelectAll() {
      this.selectedNotifications = this.isAllSelected ? [] : this.notificaciones.map(n => n.IDNT);
    },
    toggleSelectNonType2() {
      const ids = this.notificacionesNoTipo2.map(n => n.IDNT);
      this.selectedNotifications = this.isAllNonType2Selected ? [] : [...ids];
    },
    deleteSelectedNotifications() {
      if (!this.selectedNotifications.length) { toast.warning('No hay notificaciones seleccionadas'); return; }
      this.deleteNotificacion(this.selectedNotifications.filter(id => id !== null));
    },
  },
  computed: {
    isAllSelected() {
      return this.notificaciones.length > 0 && this.selectedNotifications.length === this.notificaciones.length;
    },
    notificacionesNoTipo2() { return this.notificaciones.filter(n => n.TIPO != 2); },
    isAllNonType2Selected() {
      if (!this.notificacionesNoTipo2.length) return false;
      return this.notificacionesNoTipo2.map(n => n.IDNT).every(id => this.selectedNotifications.includes(id));
    },
  },
  mounted() {
    this.USUARIO = JSON.parse(localStorage.getItem("user")) || {};
    this.getNotifications();
    this._notifInterval = setInterval(() => {
      if (!this.sidebarNotificacionesShow) this.getNotifications();
    }, 60000);
  },
  beforeUnmount() {
    clearInterval(this._notifInterval);
  },
};
</script>

<style scoped>
/* Scrollbar personalizado — excepción legítima */
.notif-scroll::-webkit-scrollbar { width: 8px; }
.notif-scroll::-webkit-scrollbar-track { background: transparent; }
.notif-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
.notif-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

/* Checkbox custom — requiere ::after */
.checkbox-custom {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 18px; height: 18px;
  cursor: pointer; border-radius: 4px;
  border: 2px solid #d1d5db; background: white;
  transition: all 0.15s ease;
  position: relative; margin: 0; flex-shrink: 0;
}
.checkbox-custom:hover { border-color: #9ca3af; }
.checkbox-custom:checked { border-color: #3b82f6; background: #3b82f6; }
.checkbox-custom:checked::after {
  content: '';
  position: absolute; left: 5px; top: 2px;
  width: 4px; height: 8px;
  border: solid white; border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Vue transitions */
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
@keyframes slideOut {
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}
.slide-fade-enter-active { animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-fade-leave-active { animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
