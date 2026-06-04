<template>
  <footer class="footer-modern">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-main">
        <!-- Logo & Description -->
        <div class="footer-brand">
          <router-link to="/" class="footer-logo-link">
            <img :src="logoJuris" alt="Juris Search" class="footer-logo" />
          </router-link>
          <p class="footer-description">
            Plataforma líder en búsqueda jurídica inteligente para profesionales del derecho en Perú. 
          </p>
          <div class="footer-social">
            <a href="https://www.instagram.com/juris.search/" class="social-icon" target="_blank" rel="noreferrer"
              aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/juris-search/" class="social-icon" target="_blank"
              rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="footer-nav-grid">
          <div class="footer-nav-column">
            <h3 class="footer-nav-title">Navegación</h3>
            <ul class="footer-nav-list">
              <li>
                <router-link to="/" class="footer-nav-link" :class="{ 'active': route.path === '/' }">
                  Inicio
                </router-link>
              </li>
              <li>
                <router-link to="/noticias" class="footer-nav-link" :class="{ 'active': route.path === '/noticias' }">
                  Noticias
                </router-link>
              </li>
              <li>
                <router-link to="/contacto" class="footer-nav-link" :class="{ 'active': route.path === '/contacto' }">
                  Contáctanos
                </router-link>
              </li>
            </ul>
          </div>

          <div class="footer-nav-column">
            <h3 class="footer-nav-title">Soporte</h3>
            <ul class="footer-nav-list">
              <li>
                <router-link to="/questions" class="footer-nav-link" :class="{ 'active': route.path === '/questions' }">
                  Preguntas Frecuentes
                </router-link>
              </li>
              <li>
                <router-link to="/politicas&privacidad" class="footer-nav-link"
                  :class="{ 'active': route.path === '/politicas&privacidad' }">
                  Políticas de Privacidad
                </router-link>
              </li>
              <li>
                <router-link to="/cookies" class="footer-nav-link" :class="{ 'active': route.path === '/cookies' }">
                  Políticas de Cookies
                </router-link>
              </li>
            </ul>
          </div>

          <div class="footer-nav-column">
            <h3 class="footer-nav-title">Contacto</h3>
            <ul class="footer-contact-list">
              <li class="footer-contact-item">
                <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>jsearch@ccfirma.com</span>
              </li>
              <li class="footer-contact-item">
                <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Caro & Asociados Lima
                  Av. Víctor A. Belaúnde 370, San Isidro 15073</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="footer-copyright">
            © {{ date }} <span class="brand-name">Juris Search</span> • Todos los derechos reservados
          </p>
          <p class="footer-tagline">
            Desarrollado con pasión para profesionales del derecho
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import { useRoute } from 'vue-router';
import logoJuris from "@/assets/img/resources/logo-jurissearch.png";

export default {
  setup() {
    const route = useRoute();
    return { route };
  },
  data() {
    return {
      date: new Date().getFullYear(),
      logoJuris,
    };
  },
};
</script>

<style scoped>
/* Footer Modern */
.footer-modern {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 4rem 0 0;
  position: relative;
  overflow: hidden;
}

.footer-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
      transparent 0%,
      #DF2DB2 20%,
      #185CE6 50%,
      #DF2DB2 80%,
      transparent 100%);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Main Footer Content */
.footer-main {
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Brand Section */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.footer-logo-link {
  display: inline-block;
  transition: transform 0.3s ease;
}

.footer-logo-link:hover {
  transform: scale(1.05);
}

.footer-logo {
  height: 50px;
  width: auto;
}

.footer-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
  line-height: 1.6;
  max-width: 350px;
}

/* Social Icons */
.footer-social {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.social-icon svg {
  width: 20px;
  height: 20px;
}

.social-icon:hover {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  border-color: transparent;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(223, 45, 178, 0.3);
}

/* Navigation Grid */
.footer-nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-nav-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-nav-title {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-nav-link {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.footer-nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #DF2DB2 0%, #185CE6 100%);
  transition: width 0.3s ease;
}

.footer-nav-link:hover {
  color: white;
  transform: translateX(5px);
}

.footer-nav-link:hover::after,
.footer-nav-link.active::after {
  width: 100%;
}

.footer-nav-link.active {
  color: white;
  font-weight: 600;
}

/* Contact List */
.footer-contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
}

.footer-contact-icon {
  width: 20px;
  height: 20px;
  color: #DF2DB2;
  flex-shrink: 0;
}

/* Footer Bottom */
.footer-bottom {
  padding: 2rem 0;
}

.footer-bottom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
}

.brand-name {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8125rem;
  font-style: italic;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .footer-nav-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-modern {
    padding: 3rem 0 0;
  }

  .footer-container {
    padding: 0 1.5rem;
  }

  .footer-main {
    gap: 2.5rem;
    padding-bottom: 2rem;
  }

  .footer-nav-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-description {
    max-width: 100%;
  }

  .footer-bottom {
    padding: 1.5rem 0;
  }

  .footer-nav-link:hover {
    transform: translateX(3px);
  }
}

@media (max-width: 480px) {
  .footer-logo {
    height: 40px;
  }

  .footer-social {
    gap: 0.75rem;
  }

  .social-icon {
    width: 36px;
    height: 36px;
  }
}
</style>