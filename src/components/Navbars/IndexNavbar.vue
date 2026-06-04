<template>
  <section class="navbar-wrapper" :class="{ 'navbar-hidden': !isNavbarVisible }">
    <!-- Banner Premium -->
    <transition name="slide-down">
      <div v-if="toggleShowAlert" class="premium-banner">
        <div class="premium-banner-content">
          <div class="premium-banner-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Adquiere más funcionalidades con el</span>
            <button @click="scrollToSection('mi-seccion-planes')" class="premium-pill-btn">
              Plan Premium
              <img src="../../assets/img/resources/Corona.png" alt="corona" />
            </button>
          </div>
          <button @click="closeBanner" class="premium-close-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Navbar Principal -->
    <nav class="navbar-modern">
      <div class="navbar-container">
        <!-- Logo -->
        <router-link to="/" class="navbar-logo">
          <img :src="logoJuris" alt="Juris Search" class="logo-image" />
        </router-link>

        <!-- Navigation Links - Desktop -->
        <ul class="navbar-menu">
          <li class="navbar-item">
            <router-link 
              to="/" 
              :class="['navbar-link', { 'navbar-link-active': route.path === '/' }]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Inicio
            </router-link>
          </li>
          <li class="navbar-item">
            <a 
              href="#conoce-proposito" 
              @click.prevent="scrollToSection('conoce-proposito')"
              class="navbar-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Conócenos
            </a>
          </li>
          <li class="navbar-item">
            <router-link 
              to="/publicaciones" 
              :class="['navbar-link', { 'navbar-link-active': route.path === '/publicaciones' }]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
              Publicaciones
            </router-link>
          </li>
          <li class="navbar-item">
            <router-link 
              to="/contacto" 
              :class="['navbar-link', { 'navbar-link-active': route.path === '/contacto' }]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              Contáctanos
            </router-link>
          </li>
        </ul>

        <!-- Auth Button - Desktop -->
        <div class="navbar-actions">
          <!-- <dark-mode-toggle class="mr-3" /> -->
          <router-link to="/auth/login" class="navbar-login-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
            </svg>
            Iniciar sesión
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button class="navbar-mobile-toggle" @click="setNavbarOpen">
          <span :class="['hamburger-line', { 'hamburger-active': navbarOpen }]"></span>
          <span :class="['hamburger-line', { 'hamburger-active': navbarOpen }]"></span>
          <span :class="['hamburger-line', { 'hamburger-active': navbarOpen }]"></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition name="mobile-menu">
        <div v-if="navbarOpen" class="mobile-menu">
          <ul class="mobile-menu-list">
            <li class="mobile-menu-item">
              <router-link 
                to="/" 
                @click="navbarOpen = false"
                :class="['mobile-menu-link', { 'mobile-menu-link-active': route.path === '/' }]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Inicio
              </router-link>
            </li>
            <li class="mobile-menu-item">
              <a 
                href="#conoce-proposito" 
                @click.prevent="scrollToSection('conoce-proposito'); navbarOpen = false"
                class="mobile-menu-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
                Conócenos
              </a>
            </li>
            <li class="mobile-menu-item">
              <router-link 
                to="/publicaciones" 
                @click="navbarOpen = false"
                :class="['mobile-menu-link', { 'mobile-menu-link-active': route.path === '/publicaciones' }]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
                Publicaciones
              </router-link>
            </li>
            <li class="mobile-menu-item">
              <router-link 
                to="/contacto" 
                @click="navbarOpen = false"
                :class="['mobile-menu-link', { 'mobile-menu-link-active': route.path === '/contacto' }]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Contáctanos
              </router-link>
            </li>
          </ul>
          <div class="mobile-menu-footer">
            <!-- <dark-mode-toggle class="mr-3" /> -->
            <router-link to="/auth/login" @click="navbarOpen = false" class="mobile-login-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
              </svg>
              Iniciar sesión
            </router-link>
          </div>
        </div>
      </transition>
    </nav>
  </section>
</template>

<script>
import logoJuris from "@/assets/img/resources/logo-jurissearch.png";
import { useRoute } from "vue-router";
// import DarkModeToggle from "@/components/DarkModeToggle.vue";

export default {
  components: {
    // DarkModeToggle
  },
  setup() {
    const route = useRoute();
    return { route };
  },
  data() {
    return {
      logoJuris,
      navbarOpen: false,
      toggleShowAlert: localStorage.getItem('premiumBannerClosed') !== 'true',
      lastScrollPosition: 0,
      scrollDirection: 'up',
      isNavbarVisible: true
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    setNavbarOpen: function () {
      this.navbarOpen = !this.navbarOpen;
    },
    scrollToSection: (seccion = "conoce-proposito") => {
      const section = document.querySelector("#" + seccion);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    },
    closeBanner() {
      this.toggleShowAlert = false;
      localStorage.setItem('premiumBannerClosed', 'true');
    },
    handleScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Si estamos en el top, siempre mostrar
      if (currentScrollPosition < 10) {
        this.isNavbarVisible = true;
        this.lastScrollPosition = currentScrollPosition;
        return;
      }

      // Detectar dirección del scroll
      if (currentScrollPosition < this.lastScrollPosition) {
        // Scrolling up
        this.isNavbarVisible = true;
      } else if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > 100) {
        // Scrolling down y después de 100px
        this.isNavbarVisible = false;
      }

      this.lastScrollPosition = currentScrollPosition;
    }
  }
};
</script>

<style scoped>
/* Navbar Wrapper */
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-hidden {
  transform: translateY(-100%);
}

/* Premium Banner */
.premium-banner {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  padding: 0.875rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.premium-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.premium-banner-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.premium-banner-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
}

.premium-banner-text svg {
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.premium-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: white;
  color: #185CE6;
  border: none;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.premium-pill-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: #f8f9fa;
}

.premium-pill-btn img {
  width: 18px;
  height: 18px;
}

.premium-close-btn {
  position: absolute;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.premium-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Navbar Modern */
.navbar-modern {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  position: relative;
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.dark .navbar-modern {
  background: #1a202c;
  border-bottom: 1px solid #2d3748;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.navbar-logo {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.navbar-logo:hover {
  transform: scale(1.05);
}

.logo-image {
  height: 45px;
  width: auto;
  display: block;
}

.navbar-menu {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.navbar-item {
  position: relative;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: #4B5563;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.dark .navbar-link {
  color: #cbd5e0;
}

.dark .navbar-link:hover {
  color: #6b9aff;
  background: rgba(107, 154, 255, 0.1);
}

.dark .navbar-link-active {
  color: #6b9aff;
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.15) 0%, rgba(107, 154, 255, 0.15) 100%);
}

.navbar-link svg {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.navbar-link:hover {
  color: #185CE6;
  background: rgba(24, 92, 230, 0.05);
}

.navbar-link:hover svg {
  opacity: 1;
  transform: translateY(-2px);
}

.navbar-link-active {
  color: #185CE6;
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.08) 0%, rgba(24, 92, 230, 0.08) 100%);
}

.navbar-link-active svg {
  opacity: 1;
}

.navbar-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1.25rem;
  right: 1.25rem;
  height: 3px;
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  border-radius: 3px 3px 0 0;
}

.navbar-actions {
  display: none;
  flex-shrink: 0;
}

.navbar-login-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  color: white!important;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(223, 45, 178, 0.3);
}

.navbar-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(223, 45, 178, 0.4);
  background: linear-gradient(135deg, #c528a0 0%, #1450c9 100%);
}

.navbar-login-btn svg {
  transition: transform 0.3s ease;
}

.navbar-login-btn:hover svg {
  transform: translateX(3px);
}

/* Mobile Toggle Button */
.navbar-mobile-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
 

.dark .hamburger-line {
  background: #e2e8f0;
} height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 101;
}

.hamburger-line {
  width: 24px;
  height: 3px;
  background: #1F2937;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger-line:nth-child(1) {
  transform-origin: top left;
}

.hamburger-line:nth-child(3) {
  transform-origin: bottom left;
}

.navbar-mobile-toggle:hover .hamburger-line {
  background: #185CE6;
}

.hamburger-active:nth-child(1) {
  transform: rotate(45deg) translate(3px, -3px);
}

.hamburger-active:nth-child(2) {
  opacity: 0;
}

.hamburger-active:nth-child(3) {
  transform: rotate(-45deg) translate(3px, 3px);
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
 

.dark .mobile-menu {
  background: #1a202c;
} background: white;
  z-index: 99;
  padding: 5rem 2rem 2rem;
  overflow-y: auto;
}

.mobile-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu-item {
  width: 100%;
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
 

.dark .mobile-menu-link {
  color: #cbd5e0;
  background: #2d3748;
}

.dark .mobile-menu-link:hover {
  background: rgba(107, 154, 255, 0.1);
  border-color: rgba(107, 154, 255, 0.3);
  color: #6b9aff;
}

.dark .mobile-menu-link-active {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.15) 0%, rgba(107, 154, 255, 0.15) 100%);
  border-color: #6b9aff;
  color: #6b9aff;
} color: #4B5563;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.3s ease;
 

.dark .mobile-menu-footer {
  border-top: 2px solid #2d3748;
} background: white;
  border: 2px solid transparent;
}

.mobile-menu-link:hover {
  background: rgba(24, 92, 230, 0.05);
  border-color: rgba(24, 92, 230, 0.2);
  color: #185CE6;
  transform: translateX(8px);
}

.mobile-menu-link-active {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(24, 92, 230, 0.1) 100%);
  border-color: #185CE6;
  color: #185CE6;
}

.mobile-menu-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #E5E7EB;
}

.mobile-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  color: white!important;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(223, 45, 178, 0.3);
}

.mobile-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(223, 45, 178, 0.4);
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Desktop Breakpoint */
@media (min-width: 1024px) {
  .navbar-menu {
    display: flex;
  }

  .navbar-actions {
    display: block;
  }

  .navbar-mobile-toggle {
    display: none;
  }
}

/* Tablet Responsive */
@media (max-width: 1023px) and (min-width: 768px) {
  .navbar-container {
    padding: 1rem 1.5rem;
  }

  .logo-image {
    height: 40px;
  }
}

/* Mobile Responsive */
@media (max-width: 767px) {
  .premium-banner {
    padding: 0.75rem 1rem;
  }

  .premium-banner-text {
    font-size: 0.85rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .premium-banner-text span {
    display: none;
  }

  .premium-pill-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .premium-close-btn {
    position: relative;
    right: 0;
    margin-left: 0.75rem;
  }

  .navbar-container {
    padding: 0.875rem 1rem;
  }

  .logo-image {
    height: 36px;
  }

  .mobile-menu {
    padding: 4.5rem 1.5rem 1.5rem;
  }

  .mobile-menu-link {
    padding: 1rem 1.25rem;
    font-size: 1rem;
  }

  .mobile-login-btn {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>