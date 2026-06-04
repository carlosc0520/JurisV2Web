<template>
  <nav class="sidebar-modern">
    <!-- Logo Section -->
    <div class="logo-section">
      <button class="menu-btn" @click="toggleSidebar">
        <img src="@/assets/img/icons/menu.svg" alt="Menu" class="menu-icon" />
      </button>
      <router-link to="/" class="logo-link">
        <img v-tooltip.left="{
          value: 'Haz click para dirigirte a la página de inicio.',
          style: {
            fontSize: '0.75rem',
            color: '#4A5568',
          },
        }" src="@/assets/img/logos/logo-nav.png" alt="Logo" class="logo-img" />
      </router-link>
    </div>

    <!-- Menu Items -->
    <div class="menu-container">
      <ul class="menu-list">
        <li v-for="(item, index) in menuItems" :key="index" class="menu-item">
          <router-link :to="item.route" v-slot="{ href, navigate, isActive }">
            <a :href="href" @click="navigate"
              class="menu-link"
              :class="{ 'menu-link-active': isActive }">

              <div class="icon-wrapper">
                <img :src="item.icon" alt="Icon" class="menu-icon-img" />
              </div>

              <span class="menu-text">{{ item.name }}</span>
            </a>
          </router-link>
          <div v-if="index < menuItems.length - 1" class="menu-divider"></div>
        </li>
      </ul>
    </div>
  </nav>
</template>



<script>
import logo from '@/assets/img/logos/logo.png';

export default {
  data() {
    return {
      logo,
      collapseShow: false,
      menuItems: []
    };
  },
  props: {
    isCollapsed: {
      type: Boolean,
      default: false,
    },
    toggleSidebar: {
      type: Function,
      default: () => { },
    },
    menu: {
      type: Array,
      default: () => [],
    },
    role: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    toggleCollapseShow() {
      this.collapseShow = !this.collapseShow;
    },
  },
  watch: {
    $route() {
      // Cerrar sidebar en móvil cuando cambia la ruta
      if (window.innerWidth < 768 && !this.isCollapsed) {
        this.toggleSidebar();
      }
    },
  },
  mounted() {
    if (this.menu && this.menu.length > 0) {
      this.menuItems = this.menu;
      if (["1"].includes(this.role.IDPLN)) {
        this.menuItems = this.menuItems.filter(item => item.name !== 'Favoritos');
      }
    }
  },
};
</script>





<style scoped>
/* Sidebar Container */
.sidebar-modern {
  position: sticky;
  top: 0;
  left: 0;
  bottom: 0;
  background: white;
  padding: 0.75rem 0.35rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(223, 45, 178, 0.1);
}

/* Logo Section */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 4.25rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 245, 251, 0.9) 100%);
  border-radius: 12px;
  margin-bottom: 1rem;
  padding: 0.35rem;
  box-shadow: 0 4px 15px rgba(223, 45, 178, 0.1);
  transition: all 0.3s ease;
}

.logo-section:hover {
  box-shadow: 0 8px 25px rgba(223, 45, 178, 0.2);
  transform: translateY(-2px);
}

.menu-btn {
  padding: 0.35rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: white;
  border: 2px solid #F3F4F6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.35rem;
}

.menu-btn:hover {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  border-color: transparent;
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 4px 15px rgba(223, 45, 178, 0.3);
}

.menu-btn:hover .menu-icon {
  filter: brightness(0) invert(1);
}

.menu-icon {
  width: 1.1rem;
  height: 1.1rem;
  transition: all 0.3s ease;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-img {
  width: 3.25rem;
  height: 3.25rem;
  object-fit: contain;
  transition: all 0.3s ease;
}

/* Menu Container */
.menu-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  padding: 0;
  list-style: none;
  margin: 0;
}

.menu-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Menu Link */
.menu-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0.35rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #4A5568;
  width: 100%;
  position: relative;
  background: white;
  border-left: 3px solid transparent;
}

.menu-link:hover {
  background: #F9FAFB;
}

/* Active State */
.menu-link-active {
  background: #F9FAFB;
  color: #DF2DB2;
}

.menu-link-active .icon-wrapper {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  box-shadow: 0 4px 15px rgba(223, 45, 178, 0.3);
}

.menu-link-active .menu-icon-img {
  filter: brightness(0) invert(1);
  opacity: 1;
}

.menu-link-active .menu-text {
  color: #DF2DB2;
  font-weight: 800;
}

/* Icon Wrapper */
.icon-wrapper {
  width: 1.9rem;
  height: 1.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
  transition: all 0.4s ease;
  margin-bottom: 0.35rem;
}

.menu-icon-img {
  width: 1.1rem;
  height: 1.1rem;
  opacity: 0.7;
  transition: all 0.4s ease;
}

/* Menu Text */
.menu-text {
  font-size: 0.62rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.4s ease;
  letter-spacing: 0.3px;
}

/* Menu Divider */
.menu-divider {
  width: 70%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(223, 45, 178, 0.2) 50%, transparent 100%);
  margin: 0.3rem auto;
  border-radius: 2px;
}

/* Scrollbar */
.menu-container::-webkit-scrollbar {
  width: 4px;
}

.menu-container::-webkit-scrollbar-track {
  background: #F9FAFB;
  border-radius: 10px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  border-radius: 10px;
}

.menu-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #c528a0 0%, #1450c9 100%);
}

/* Responsive */
@media (min-width: 768px) {
  .sidebar-modern {
    width: 5rem;
  }
}

@media (max-width: 767px) {
  .sidebar-modern {
    width: 5rem;
  }

  .logo-section {
    width: 4.5rem;
    padding: 0.375rem;
  }

  .logo-img {
    width: 3.5rem;
    height: 3.5rem;
  }

  .menu-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .icon-wrapper {
    width: 2rem;
    height: 2rem;
  }

  .menu-icon-img {
    width: 1.25rem;
    height: 1.25rem;
  }

  .menu-text {
    font-size: 0.65rem;
  }
}
</style>

<!-- Dark Mode (unscoped to allow html.dark ancestor selector) -->
<style>
html.dark .sidebar-modern {
  background: #111827 !important;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.3) !important;
  border-right: 1px solid rgba(99, 102, 241, 0.15) !important;
}

html.dark .sidebar-modern .logo-section {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.9) 100%) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
}

html.dark .sidebar-modern .logo-section:hover {
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.2) !important;
}

html.dark .sidebar-modern .menu-btn {
  background: #1f2937 !important;
  border-color: #374151 !important;
}

html.dark .sidebar-modern .menu-icon {
  filter: brightness(0) invert(0.7);
}

html.dark .sidebar-modern .menu-link {
  background: #111827 !important;
  color: #9ca3af !important;
}

html.dark .sidebar-modern .menu-link:hover {
  background: #1f2937 !important;
}

html.dark .sidebar-modern .menu-link-active {
  background: #1f2937 !important;
  color: #a78bfa !important;
}

html.dark .sidebar-modern .menu-link-active .menu-text {
  color: #a78bfa !important;
}

html.dark .sidebar-modern .menu-text {
  color: #9ca3af !important;
}

html.dark .sidebar-modern .icon-wrapper {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%) !important;
}

html.dark .sidebar-modern .menu-icon-img {
  filter: brightness(0) invert(0.6);
}

html.dark .sidebar-modern .menu-link-active .icon-wrapper {
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%) !important;
}

html.dark .sidebar-modern .menu-link-active .menu-icon-img {
  filter: brightness(0) invert(1) !important;
  opacity: 1 !important;
}

html.dark .sidebar-modern .menu-divider {
  background: linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.25) 50%, transparent 100%) !important;
}

html.dark .sidebar-modern .menu-container::-webkit-scrollbar-track {
  background: #1f2937 !important;
}
</style>