<template>
  <div class="user-menu">
    <button class="notification-btn" @click="toggleSidebarNotificaciones">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
      <span v-if="totalNotificaciones > 0" class="notification-badge">
        {{ totalNotificaciones > 99 ? '99+' : totalNotificaciones }}
      </span>
    </button>

    <div class="overlay-backdrop" v-if="sidebarNotificacionesShow" @click="closeSidebarNotificaciones"></div>

    <!-- Notifications Sidebar -->
    <transition name="slide-fade">
      <div v-if="sidebarNotificacionesShow" class="notifications-sidebar">
        <div class="sidebar-header">
          <div class="header-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <h3>Notificaciones</h3>
          </div>
          <div class="header-actions">
            <button class="settings-btn" @click="toggleSelectionMenu" :title="'Opciones de selección'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 014.34 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 016.1 4.34l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c.11.5.45.92 1 1.51h.02c.61.43 1.29.36 1.82-.33l.06-.06A2 2 0 0119.66 6.1l-.06.06a1.65 1.65 0 00-.33 1.82V8c.58.34 1.02.89 1.02 1.6V11c0 .71-.44 1.26-1.02 1.6v.9c0 .71-.44 1.26-1.02 1.6z"/>
              </svg>
            </button>
            <button class="close-btn" @click="closeSidebarNotificaciones">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Selection menu (hidden by default, toggled by settings button) -->
        <div v-if="notificaciones.length > 0 && showSelectionMenu" class="selection-menu">
          <div class="selection-options">
            <label class="select-all-checkbox">
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
              <span>Eliminar todas las notificaciones ({{ selectedNotifications.length }})</span>
            </label>

            <label class="select-all-checkbox">
              <input 
                type="checkbox" 
                :checked="isAllNonType2Selected"
                @change="toggleSelectNonType2"
              />
              <span>Eliminar todas las notificaciones, excepto las vinculadas con <span class="placeholder-text">investigación y eventos</span></span>
            </label>
          </div>
          <div style="margin-top:8px;">
            <button 
              v-if="selectedNotifications.length > 0" 
              class="delete-selected-btn"
              @click="deleteSelectedNotifications"
              :title="`Eliminar ${selectedNotifications.length} notificación(es)`"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Eliminar ({{ selectedNotifications.length }})
            </button>
          </div>
        </div>

        <div class="notifications-content">
          <div v-for="(notificacion, index) in notificaciones" :key="index" class="notification-card" :class="{ 'selected': isNotificationSelected(notificacion.IDNT) }">
            <template v-if="notificacion.TIPO == 1">
              <label class="notification-checkbox">
                <input 
                  type="checkbox" 
                  :checked="isNotificationSelected(notificacion.IDNT)"
                  @change="toggleSelectNotification(notificacion.IDNT)"
                />
              </label>
              <div class="notification-icon type-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <div class="notification-body">
                <p class="notification-message">{{ notificacion.DESCP }}</p>
                <div class="notification-footer">
                  <span class="notification-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ notificacion.FECHA }}
                  </span>
                  <div v-if="notificacion.ESTADO == 0" class="notification-actions">
                    <button class="action-btn accept-btn" @click="updateContacto(notificacion)" title="Aceptar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <button class="action-btn decline-btn" @click="deleteContacto(notificacion)" title="Eliminar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button class="delete-notification-btn" @click="deleteNotificacionDirecto(notificacion.IDNT)"
              title="Eliminar notificación">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </template>

            <template v-else-if="notificacion.TIPO == 2">
              <!-- Notificación tipo 2: checbox, ir a (flecha) y eliminar individual -->
              <label class="notification-checkbox">
                <input 
                  type="checkbox" 
                  :checked="isNotificationSelected(notificacion.IDNT)"
                  @change="toggleSelectNotification(notificacion.IDNT)"
                />
              </label>
              <div class="notification-icon type-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="9 12 13 16 13 8"/>
                </svg>
              </div>
              <div class="notification-body">
                <p class="notification-message">{{ notificacion.DESCP }}</p>
                <div class="notification-footer">
                  <span class="notification-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ notificacion.FECHA }}
                  </span>
                  <div class="notification-actions">
                    <button class="action-btn accept-btn" @click="goToNotification(notificacion)" title="Ir a detalle">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="7 17 17 7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button class="delete-notification-btn" @click="deleteNotificacionDirecto(notificacion.IDNT)"
              title="Eliminar notificación">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </template>

            <template v-else>
              <!-- Aquí puedes agregar contenido para otros tipos futuros -->
              <label class="notification-checkbox">
                <input 
                  type="checkbox" 
                  :checked="isNotificationSelected(notificacion.IDNT)"
                  @change="toggleSelectNotification(notificacion.IDNT)"
                />
              </label>
              <div class="notification-icon type-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <div class="notification-body">
                <p class="notification-message">{{ notificacion.DESCP }}</p>
                <div class="notification-footer">
                  <span class="notification-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ notificacion.FECHA }}
                  </span>
                </div>
              </div>
              <button class="delete-notification-btn" @click="deleteNotificacionDirecto(notificacion.IDNT)"
              title="Eliminar notificación">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </template>
          </div>

          <div v-if="notificaciones.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <p>No hay notificaciones</p>
            <span>Estás al día</span>
          </div>
        </div>
      </div>
    </transition>

    <div class="divider"></div>

    <div class="user-avatar">
      <img :src="RTAFTO || team2" @error="$event.target.src = team2" alt="Avatar" />
    </div>

    <button ref="btnDropdownRef" class="dropdown-toggle" @click="toggleDropdown">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
           :class="{ 'rotate-180': dropdownPopoverShow }">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <transition name="dropdown-fade">
      <div v-if="dropdownPopoverShow" ref="popoverDropdownRef" class="user-dropdown">
        <div class="dropdown-user-info">
          <div class="user-avatar-large">
            <img :src="RTAFTO || team2" @error="$event.target.src = team2" alt="Avatar" />
          </div>
          <div class="user-details">
            <span class="user-name">{{ USUARIO.NOMBRES }}</span>
            <span class="user-email">{{ USUARIO.EMAIL?.toLowerCase() }}</span>
          </div>
        </div>
        
        <div class="dropdown-divider"></div>
        
        <button class="logout-btn" @click="signOut">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
import LoginProxy from "../../proxies/LoginProxy";
import UserProxy from "../../proxies/UserProxy";
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      dropdownPopoverShow: false,
      dropdownPopoverShowNotificaciones: false,
      sidebarNotificacionesShow: false,
      team2,
      totalNotificaciones: 0,
      notificaciones: [],
      selectedNotifications: [],
      USUARIO: {
        NOMBRES: "",
        EMAIL: "",
        RTAFTO: "",
      },
      domain: "https://side.jurissearch.com" + "/usuario/investigacion?search=",
      showSelectionMenu: false,
    };
  },
  props: {
    RTAFTO: {
      type: String,
      default: "",
    },
  },
  methods: {
    goToNotification(notificacion) {
      // ir a this.domain + notificacion.DESCP
      // a notificacion.DESCP quitale Se agregó la noticia titulo noticia eeeee, quedando todo menpos Se agregó la noticia
      const noticiaTitle = notificacion.DESCP.replace('Se agregó la noticia', '').trim();
      const url = this.domain + encodeURIComponent(noticiaTitle);
      window.open(url, '_blank');
    },
    toggleDropdown: function (event) {
      event.preventDefault();
      if (this.dropdownPopoverShow) {
        this.dropdownPopoverShow = false;
      } else {
        this.dropdownPopoverShow = true;
        createPopper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, {
          placement: "bottom-start",
        });
      }
    },
    toggleSidebarNotificaciones() {
      // ACTUALIZAR NOTIFICACIONES A 0 
      if (this.totalNotificaciones > 0) {
        UserProxy.updateView()
          .then(() => {
            this.totalNotificaciones = 0;
          })
          .catch((error) => {
            console.error("Error al actualizar la vista de notificaciones:", error);
          });
      }
      this.sidebarNotificacionesShow = !this.sidebarNotificacionesShow;
      // close selection menu when opening/closing sidebar
      if (!this.sidebarNotificacionesShow) this.showSelectionMenu = false;
    },

    toggleSelectionMenu() {
      this.showSelectionMenu = !this.showSelectionMenu;
      if (this.showSelectionMenu) {
        // add click-away listener to close menu when clicking outside
        document.addEventListener('click', this.handleDocumentClick);
      } else {
        document.removeEventListener('click', this.handleDocumentClick);
      }
    },
    closeSidebarNotificaciones() {
      this.sidebarNotificacionesShow = false;
      this.selectedNotifications = [];
      // ensure selection menu is closed when sidebar closes
      if (this.showSelectionMenu) {
        this.showSelectionMenu = false;
        document.removeEventListener('click', this.handleDocumentClick);
      }
    },

    handleDocumentClick(e) {
      // if click is outside the settings button and selection menu, close it
      const settingsBtn = this.$el.querySelector('.settings-btn');
      const selectionMenu = this.$el.querySelector('.selection-menu');
      if (settingsBtn && settingsBtn.contains(e.target)) return;
      if (selectionMenu && selectionMenu.contains(e.target)) return;
      this.showSelectionMenu = false;
      document.removeEventListener('click', this.handleDocumentClick);
    },
    async signOut() {
      // Marcar que el logout es intencional ANTES de cualquier otra acción
      localStorage.setItem('isLoggingOut', 'true');
      
      // ✅ Obtener el token ANTES de eliminarlo
      const accessToken = localStorage.getItem("accessToken");
      // Limpiar tokens inmediatamente para evitar requests durante logout
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Llamar al backend con el token guardado
      if (accessToken) {
        LoginProxy.logout(accessToken).catch(() => {
          // Ignorar errores del logout en backend
        });
      }
      
      // Navegar inmediatamente sin setTimeout para evitar refresh visible
      this.$router.push("/auth/login");
    },
    async getNotifications() {
      await UserProxy.getNotificaciones()
        .then((response) => {
          if (response && response?.length > 0) {
            this.notificaciones = response.map((notificacion, index) => {
              return {
                ...notificacion,
                RN: index + 1,
              };
            });
            this.totalNotificaciones = this.notificaciones.filter((notificacion) => notificacion.CESTDO =='A').length;
          } else {
            this.notificaciones = [];
          }
        })
        .catch((error) => {
          console.error("Error al obtener las notificaciones:", error);
          this.notificaciones = [];
        });
    },
    async deleteContacto(item) {
      await UserProxy.deleteContacto(item.ID)
        .then((response) => {
          const toastMessage = response.STATUS ? "Notificación eliminada." : response.MESSAGE;
          if (response.STATUS) {
            this.notificaciones = this.notificaciones.filter((notificacion) => notificacion.RN !== item.RN);
            this.totalNotificaciones = this.notificaciones.length;
            toast.success(toastMessage);
          } else {
            toast.error(toastMessage);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar la notificación:", error);
          toast.error("Error al eliminar la notificación.");
        });
    },
    async updateContacto(item) {
      await UserProxy.updateContacto({
        ID: item.ID,
        ESTADO: true,
      })
        .then((response) => {
          const toastMessage = response.STATUS ? "Contacto agregado correctamente." : response.MESSAGE;
          if (response.STATUS) {
            toast.success(toastMessage);
            this.notificaciones = this.notificaciones.map((notificacion) => {
              if (notificacion.ID === item.ID) {
                return {
                  ...notificacion,
                  ESTADO: 1,
                };
              }
              return notificacion;
            });

            this.totalNotificaciones = this.notificaciones.filter((notificacion) => notificacion.ESTADO === 0).length;
          } else {
            toast.error(toastMessage);
          }
        })
        .catch((error) => {
          console.error("Error al actualizar la notificación:", error);
          toast.error("Error al actualizar la notificación.");
        });
    },
    async deleteNotificacionDirecto(id) {
      try {
        const response = await UserProxy.deleteNotificaciones(id.toString());
        
        if (response.STATUS) {
          toast.success('Notificación eliminada correctamente');
          await this.getNotifications();
        } else {
          toast.error(response.MESSAGE || 'Error al eliminar la notificación');
        }
      } catch (error) {
        console.error('Error al eliminar la notificación:', error);
        toast.error('Error al eliminar la notificación');
      }
    },
    async deleteNotificacion(ids) {
      const idsArray = Array.isArray(ids) ? ids : [ids];
      // Confirmación antes de eliminar
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        html: idsArray.length === 1 
          ? 'Se eliminará esta notificación permanentemente.'
          : `Se eliminarán <strong>${idsArray.length}</strong> notificaciones permanentemente.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        const idsString = idsArray.join(', ');
        const response = await UserProxy.deleteNotificaciones(idsString);
        
        if (response.STATUS) {
          // Mensaje de éxito
          const message = idsArray.length === 1 
            ? 'Notificación eliminada correctamente' 
            : `${idsArray.length} notificaciones eliminadas correctamente`;
          toast.success(message);
          
          // Limpiar selección
          this.selectedNotifications = [];
          
          // Recargar notificaciones
          await this.getNotifications();
        } else {
          toast.error(response.MESSAGE || 'Error al eliminar las notificaciones');
        }
      } catch (error) {
        console.error('Error al eliminar las notificaciones:', error);
        toast.error('Error al eliminar las notificaciones');
      }
    },
    toggleSelectNotification(notificationId) {
      const index = this.selectedNotifications.indexOf(notificationId);
      if (index > -1) {
        this.selectedNotifications.splice(index, 1);
      } else {
        this.selectedNotifications.push(notificationId);
      }
    },
    isNotificationSelected(notificationId) {
      return this.selectedNotifications.includes(notificationId);
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        // Si ya están todas seleccionadas, deseleccionar todo
        this.selectedNotifications = [];
      } else {
        // Limpiar primero y seleccionar todas
        this.selectedNotifications = this.notificaciones.map(n => n.IDNT);
      }
    },
    toggleSelectNonType2() {
      const nonType2Ids = this.notificaciones
        .filter(n => n.TIPO != 2)
        .map(n => n.IDNT);
      
      if (this.isAllNonType2Selected) {
        // Si ya están seleccionadas, deseleccionar todo
        this.selectedNotifications = [];
      } else {
        // Limpiar primero y seleccionar solo las que no son tipo 2
        this.selectedNotifications = [...nonType2Ids];
      }
    },
    deleteSelectedNotifications() {
      if (this.selectedNotifications.length === 0) {
        toast.warning('No hay notificaciones seleccionadas');
        return;
      }

      this.deleteNotificacion(this.selectedNotifications.filter(id => id !== null));
    }
  },
  computed: {
    isAllSelected() {
      return this.notificaciones.length > 0 && 
             this.selectedNotifications.length === this.notificaciones.length;
    },
    notificacionesNoTipo2() {
      return this.notificaciones.filter(n => n.TIPO != 2);
    },
    isAllNonType2Selected() {
      if (this.notificacionesNoTipo2.length === 0) return false;
      
      const nonType2Ids = this.notificacionesNoTipo2.map(n => n.IDNT);
      return nonType2Ids.every(id => this.selectedNotifications.includes(id));
    }
  },
  mounted() {
    this.USUARIO = JSON.parse(localStorage.getItem("user")) || {};
    this.getNotifications();
  },
};
</script>

<style scoped>
/* ===== USER MENU MODERN ===== */
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

/* Selection menu styles */
.settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  margin-right: 6px;
}
.settings-btn svg {
  color: #9ca3af; /* gris más suave */
  width: 18px;
  height: 18px;
}
.settings-btn:hover {
  background: #e5e7eb;
}
.settings-btn:hover svg {
  color: #374151;
}
.header-actions { display: flex; align-items: center; gap: 6px; }
.selection-menu {
  padding: 12px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  background: #fff;
}
.selection-menu .select-all-checkbox { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }

/* Notification Button */
.notification-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-btn svg {
  color: #6b7280;
  width: 20px;
  height: 20px;
}

.notification-btn:hover {
  background: #e5e7eb;
}

.notification-btn:hover svg {
  color: #374151;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Overlay */
.overlay-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

/* Notifications Sidebar */
.notifications-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-title svg {
  color: #6b7280;
  width: 20px;
  height: 20px;
}

.header-title h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
}

.close-btn svg {
  color: #6b7280;
  width: 18px;
  height: 18px;
}

/* Selection Toolbar */
.selection-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0.875rem;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  border-bottom: 1px solid #e5e7eb;
  gap: 0.75rem;
  min-height: 48px;
}

.selection-options {
  display: flex;
  gap: 0.875rem;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
}

.select-all-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.select-all-checkbox:hover {
  background: #f3f4f6;
}

.select-all-checkbox input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid #d1d5db;
  background: white;
  transition: all 0.15s ease;
  position: relative;
  margin: 0;
  flex-shrink: 0;
}

.select-all-checkbox input[type="checkbox"]:hover {
  border-color: #9ca3af;
}

.select-all-checkbox input[type="checkbox"]:checked {
  border-color: #3b82f6;
  background: #3b82f6;
}

.select-all-checkbox input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.select-all-checkbox span {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: -0.01em;
}

.select-all-checkbox .placeholder-text {
  font-weight: 400;
  color: #6b7280;
  font-style: italic;
}

.delete-selected-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
  white-space: nowrap;
  flex-shrink: 0;
}

.delete-selected-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.delete-selected-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.2);
}

.delete-selected-btn svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

/* Notifications Content */
.notifications-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.notifications-content::-webkit-scrollbar {
  width: 8px;
}

.notifications-content::-webkit-scrollbar-track {
  background: transparent;
}

.notifications-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.notifications-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.notification-card {
  display: flex;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  padding-right: 2.75rem;
  background: white;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  border-radius: 0;
  margin-bottom: 0;
  transition: all 0.2s ease;
  position: relative;
}

.notification-card:hover {
  background: #f9fafb;
}

.notification-card.selected {
  background: #eff6ff;
}

.notification-checkbox {
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
  cursor: pointer;
}

.notification-checkbox input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
  border-radius: 4px;
  border: 2px solid #d1d5db;
  background: white;
  transition: all 0.15s ease;
  position: relative;
  flex-shrink: 0;
}

.notification-checkbox input[type="checkbox"]:hover {
  border-color: #9ca3af;
}

.notification-checkbox input[type="checkbox"]:checked {
  border-color: #3b82f6;
  background: #3b82f6;
}

.notification-checkbox input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.notification-icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.notification-icon.type-request {
  background: #dcfce7;
  color: #16a34a;
}

.notification-icon.type-info {
  background: #dbeafe;
  color: #2563eb;
}

.notification-icon svg {
  width: 17px;
  height: 17px;
}

.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-message {
  font-size: 0.8125rem;
  color: #1f2937;
  line-height: 1.4;
  margin: 0 0 0.25rem 0;
  word-break: break-word;
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.notification-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: #9ca3af;
}

.notification-time svg {
  flex-shrink: 0;
  width: 11px;
  height: 11px;
}

.notification-actions {
  display: flex;
  gap: 0.375rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.accept-btn {
  background: #10b981;
  color: white;
}

.accept-btn:hover {
  background: #059669;
}

.decline-btn {
  background: #ef4444;
  color: white;
}

.decline-btn:hover {
  background: #dc2626;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn svg {
  width: 13px;
  height: 13px;
}

/* Delete Notification Button */
.delete-notification-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.notification-card:hover .delete-notification-btn {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #6b7280;
}

.delete-notification-btn:hover {
  background: #fee2e2 !important;
  border-color: #fecaca !important;
  color: #ef4444 !important;
  transform: translateY(-50%) scale(1.08);
}

.delete-notification-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.delete-notification-btn svg {
  width: 14px;
  height: 14px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-state svg {
  color: #d1d5db;
  margin-bottom: 1rem;
  width: 56px;
  height: 56px;
}

.empty-state p {
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 0.375rem 0;
}

.empty-state span {
  font-size: 0.875rem;
  color: #9ca3af;
}

/* Divider */
.divider {
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, transparent, #e5e7eb, transparent);
}

/* User Avatar */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  border-color: #185CE6;
  box-shadow: 0 2px 8px rgba(24, 92, 230, 0.15);
  transform: scale(1.03);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dropdown Toggle */
.dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-toggle svg {
  color: #6b7280;
  transition: all 0.2s ease;
}

.dropdown-toggle:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.dropdown-toggle:hover svg {
  color: #374151;
}

.dropdown-toggle svg.rotate-180 {
  transform: rotate(180deg);
}

/* User Dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  min-width: 260px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 1000;
  border: 1px solid #e5e7eb;
}

.dropdown-user-info {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.user-avatar-large {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.125rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.75rem 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #185CE6;
  color: white;
  border-color: #185CE6;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 92, 230, 0.2);
}

.logout-btn:active {
  transform: translateY(0);
}

/* Animations */
.slide-fade-enter-active {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-sidebar {
    width: 100%;
  }
  
  .user-dropdown {
    right: -1rem;
  }
}
</style>