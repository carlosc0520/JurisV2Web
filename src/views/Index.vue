<template>
  <div>
    <index-navbar />
    <section class="hero-section-clean opcion-1" :style="{ backgroundImage: `url(${portada})` }">
      <div class="hero-overlay"></div>
      <div class="hero-content-wrapper">
        <div class="hero-text-content">
          <div class="hero-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Plataforma especializada en Derecho Penal</span>
          </div>
          
          <h1 class="hero-title-modern">
            Optimiza tu estrategia jurídica con 
            <span class="hero-gradient-text">jurisprudencia actual</span>
            y <span class="hero-gradient-text">seleccionada</span>
          </h1>
          
          <p class="hero-subtitle-modern">
            Consulta jurisprudencia penal en esta herramienta online especializada
          </p>
          
          <div class="hero-cta-buttons">
            <a href="#mi-seccion-planes" class="hero-btn-primary">
              Explorar planes
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#conoce-proposito" class="hero-btn-secondary">
              Conocer más
            </a>
          </div>
        </div>
      </div>
    </section>

    <div :style="{ backgroundImage: `url(${portada})` }"
      class="relative container-mobile d-flex bg-contain bg-no-repeat lg:bg-cover lg:bg-center">
      <div class="degradado"></div>
      <section class="hero-section-clean opcion-2" :style="{ backgroundImage: `url(${portada})` }">
        <div class="hero-overlay"></div>
        <div class="hero-content-wrapper">
          <div class="hero-text-content">
            <div class="hero-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Plataforma especializada en Derecho Penal</span>
            </div>
            
            <h1 class="hero-title-modern">
              Optimiza tu estrategia jurídica con 
              <span class="hero-gradient-text">jurisprudencia actual</span>
              y <span class="hero-gradient-text">seleccionada</span>
            </h1>
            
            <p class="hero-subtitle-modern">
              Consulta jurisprudencia penal en esta herramienta online especializada
            </p>
            
            <div class="hero-cta-buttons">
              <a href="#mi-seccion-planes" class="hero-btn-primary">
                Explorar planes
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#conoce-proposito" class="hero-btn-secondary">
                Conocer más
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="info-section-modern relative">
      <div class="info-container">
        <div class="info-content-wrapper">
          <!-- Badge decorativo -->
          <div class="info-badge-wrapper">
            <div class="info-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>Plataforma especializada</span>
            </div>
          </div>

          <!-- Título y descripción mejorados -->
          <div class="info-text-block">
            <h2 class="info-title">
              <span class="info-highlight">Juris Search</span> es una herramienta digital diseñada para simplificar la búsqueda selectiva de jurisprudencia
            </h2>
            <p class="info-description">
              Especializada en derecho penal, derecho penal económico y de la empresa, 
              nuestra plataforma te permite acceder a información jurídica relevante de manera rápida y eficiente.
            </p>
          </div>

          <!-- Características destacadas -->
          <div class="info-features-grid">
            <div class="info-feature-item">
              <div class="feature-icon-wrapper feature-icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div class="feature-content">
                <h4>Base actualizada</h4>
                <p>Información jurídica constantemente renovada</p>
              </div>
            </div>

            <div class="info-feature-item">
              <div class="feature-icon-wrapper feature-icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <div class="feature-content">
                <h4>Búsqueda inteligente</h4>
                <p>Encuentra jurisprudencia relevante al instante</p>
              </div>
            </div>

            <div class="info-feature-item">
              <div class="feature-icon-wrapper feature-icon-pink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="feature-content">
                <h4>Organización eficiente</h4>
                <p>Gestiona y categoriza tus consultas fácilmente</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Imagen con efecto parallax mejorado -->
        <div class="info-image-container">
          <div class="image-decoration-circle circle-1"></div>
          <div class="image-decoration-circle circle-2"></div>
          <img :src="screen" alt="Plataforma Juris Search" class="info-screenshot" />
        </div>
      </div>
    </section>

    <section class="proposito-section-modern" id="conoce-proposito">
      <div class="proposito-container">
        <!-- Header -->
        <div class="proposito-header">
          <h2 class="proposito-title">
            Conoce <span class="text-gradient">nuestro propósito</span>
          </h2>
          <p class="proposito-subtitle">
            Impulsamos la excelencia jurídica a través de tecnología e innovación
          </p>
        </div>

        <!-- Tabs Navigation -->
        <div class="proposito-tabs-wrapper">
          <div class="proposito-tabs">
            <button 
              @click="selectedSection = 'quienes-somos'"
              :class="['proposito-tab', { 'proposito-tab-active': selectedSection === 'quienes-somos' }]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <span>¿Quiénes somos?</span>
            </button>
            
            <button 
              @click="selectedSection = 'nuestros-valores'"
              :class="['proposito-tab', { 'proposito-tab-active': selectedSection === 'nuestros-valores' }]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Nuestros valores</span>
            </button>
          </div>
        </div>

        <!-- Content: Quiénes somos -->
        <transition name="fade-slide">
          <div v-if="selectedSection === 'quienes-somos'" class="proposito-content">
            <div class="vision-mision-grid">
              <!-- Visión Card -->
              <div class="vm-card vm-card-vision">
                <div class="vm-card-icon-wrapper">
                  <div class="vm-card-icon vm-icon-vision">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                </div>
                <div class="vm-card-content">
                  <h3 class="vm-card-title">Visión</h3>
                  <p class="vm-card-description">
                    Brindar a nuestros usuarios una plataforma digital intuitiva, completa y actualizada, que facilite
                    la consulta y búsqueda de jurisprudencia nacional y extranjera en derecho penal económico y de la
                    empresa.
                  </p>
                </div>
                <div class="vm-card-decoration vm-decoration-vision"></div>
              </div>

              <!-- Misión Card -->
              <div class="vm-card vm-card-mision">
                <div class="vm-card-icon-wrapper">
                  <div class="vm-card-icon vm-icon-mision">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                </div>
                <div class="vm-card-content">
                  <h3 class="vm-card-title">Misión</h3>
                  <p class="vm-card-description">
                    Ser la herramienta digital líder en consulta y búsqueda de jurisprudencia en derecho penal
                    económico y de la empresa en Perú.
                  </p>
                </div>
                <div class="vm-card-decoration vm-decoration-mision"></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Content: Valores -->
        <transition name="fade-slide">
          <div v-if="selectedSection === 'nuestros-valores'" class="proposito-content">
            <div class="valores-carousel-wrapper">
              <Carousel 
                :breakpoints="carouselConfig.breakpoints" 
                :wrap-around="carouselConfig.wrapAround" 
                :autoplay="false"
                :settings="{ navigationEnabled: true }">
                <Slide v-for="valor in valores" :key="valor.id" class="valores-slide">
                  <div class="valor-card">
                    <div class="valor-icon-wrapper">
                      <img :src="valor?.image" class="valor-icon" alt="" />
                    </div>
                    <div class="valor-content">
                      <h4 class="valor-title">{{ valor?.name }}</h4>
                      <p class="valor-description">{{ valor?.description }}</p>
                    </div>
                  </div>
                </Slide>

                <template #addons>
                  <CarouselNavigation>
                    <template #prev>
                      <button class="carousel-nav-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                      </button>
                    </template>
                    <template #next>
                      <button class="carousel-nav-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    </template>
                  </CarouselNavigation>
                </template>
              </Carousel>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <section class="ofrecemos-section-modern" id="mi-nosotros">
      <div class="ofrecemos-container">
        <!-- Header -->
        <div class="ofrecemos-header">
          <h2 class="ofrecemos-title">
            Lo que te <span class="text-gradient">ofrecemos</span>
          </h2>
          <p class="ofrecemos-subtitle">
            Herramientas y recursos diseñados para potenciar tu práctica jurídica
          </p>
        </div>

        <!-- Carousel moderno -->
        <div class="ofrecemos-carousel-container">
          <Carousel 
            :items-to-show="3"
            :items-to-scroll="1"
            :breakpoints="carouselConfig.breakpoints" 
            :wrap-around="true"
            :autoplay="5000" 
            snap-align="start">
            
            <Slide v-for="slide in slides" :key="slide.id">
              <div class="ofrecemos-card">
                <div class="ofrecemos-image-wrapper">
                  <img :src="slide.image" class="ofrecemos-image" alt="" />
                  <div class="ofrecemos-overlay"></div>
                </div>
                
                <div class="ofrecemos-content">
                  <div class="ofrecemos-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="ofrecemos-text-wrapper">
                    <h3 class="ofrecemos-card-title">{{ slide.text }}</h3>
                    <p class="ofrecemos-card-description">{{ slide.description }}</p>
                  </div>
                </div>
              </div>
            </Slide>

            <template #addons>
              <CarouselNavigation>
                <template #prev>
                  <button class="ofrecemos-nav-btn ofrecemos-nav-prev">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                </template>
                <template #next>
                  <button class="ofrecemos-nav-btn ofrecemos-nav-next">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </template>
              </CarouselNavigation>
            </template>
          </Carousel>
        </div>
      </div>
    </section>

    <section class="planes-section" id="mi-seccion-planes">
      <div class="planes-container">
        <div class="planes-header">
          <h2 class="planes-title">Nuestros <span class="text-gradient">planes</span></h2>
          <p class="planes-subtitle">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div class="planes-grid">
          <div
            class="plan-card"
            :class="{ 'plan-featured': plan?.PRINCIPAL }"
            v-for="plan in planes" :key="plan.id">
            
            <!-- Header Card -->
            <div class="plan-header" :class="{
              'plan-header-featured': plan?.PRINCIPAL,
              'plan-header-normal': !plan?.PRINCIPAL
            }">
              <h3 class="plan-name">
                <img v-if="plan?.PRINCIPAL" :src="corona" class="corona-icon" />
                {{ capitalizeFirst(plan?.DESCRIPCION) }}
              </h3>
            </div>
            
            <!-- Body Card -->
            <div class="plan-body">
              <!-- Precio -->
              <div class="plan-price-section">
                <div class="price-wrapper">
                  <span class="currency">S/</span>
                  <span class="price-amount">{{ plan?.PRECIO || "" }}</span>
                  <span class="price-period">/ {{ plan.PERIODO || "" }}</span>
                </div>
              </div>

              <!-- Botón CTA -->
              <button @click="goToPlan(plan)" class="plan-button"
                :class="{ 'plan-button-featured': plan?.PRINCIPAL }">
                {{ plan?.VALOR != "1" ? "Adquirir Plan" : "Probar gratis" }}
                <svg class="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Lista de características -->
              <ul class="plan-features">
                <li class="feature-item" v-for="restriccion in plan.DETALLE.RESTRICIONES" :key="restriccion">
                  <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="feature-text">{{ restriccion }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ModalCrearUsuario :show="modalCrearUsuario.show" :close="() => modalCrearUsuario.show = false"
        :update="() => { }" />
    </section>

    <section class="preguntas-section" id="mi-nosotros">
      <div class="preguntas-container">
        <div class="animation-b-t preguntas-header">
          <h2 class="preguntas-title">Resolvemos tus <span class="text-gradient">preguntas frecuentes</span></h2>
        </div>

        <div class="preguntas-content">
          <div class="preguntas-grid">
            <div class="preguntas-image-container">
              <img :src="preguntasFrecuentes" alt="Preguntas frecuentes" class="preguntas-image" />
            </div>
            <div class="preguntas-accordion-container">
              <Question :resumeSection="true" />
              <div class="preguntas-cta">
                <router-link to="/questions" class="preguntas-button">
                  Ver más preguntas frecuentes
                  <svg class="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="hidden d-none py-4 pt-5 mt-5 bg-comments" :style="{ backgroundImage: `url(${bgComments})` }"
      id="mi-seccion">
      <div id="pricing" class="py-6 px-6 mb-0 lg:px-20 my-2 md:my-6">
        <div class="text-center mb-6">
          <h2 style="text-align: center!important">Lo que <span class="text-primary">nuestros usuarios dicen</span></h2>
        </div>

        <div class="container mx-auto">
          <Carousel :breakpoints="carouselConfig.breakpoints" :wrap-around="carouselConfig.wrapAround"
            :autoplay="carouselConfig.autoplay" :settings="{ navigationEnabled: true }">
            <Slide v-for="comment in comments" :key="comment.id">
              <div class="flex justify-center p-3">
                <div class="bg-white text-center p-6 rounded-xl shadow" style="max-width: 400px;">
                  <img :src="comment.image" class="w-20 h-20 rounded-full mx-auto mb-4" />
                  <p class="text-gray-600 text-sm mb-4">
                    {{ comment.text }}
                  </p>
                  <h3 class="text-lg font-semibold text-gray-900">{{ comment.name }}</h3>
                  <p class="text-primary font-medium">{{ comment.profession }}</p>
                </div>
              </div>
            </Slide>

            <template #addons>
              <CarouselNavigation>
                <template #prev>
                  <button class="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <img :src="leftArrow" alt="left-arrow" class="w-5 h-5" />
                  </button>
                </template>
                <template #next>
                  <button class="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <img :src="rightArrow" alt="right-arrow" class="w-5 h-5" />
                  </button>
                </template>
              </CarouselNavigation>
            </template>
          </Carousel>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <!-- Decorative Elements -->
        <div class="cta-decoration cta-decoration-1"></div>
        <div class="cta-decoration cta-decoration-2"></div>
        <div class="cta-decoration cta-decoration-3"></div>

        <div class="cta-content">
          <!-- Badge -->
          <div class="cta-badge">
            <svg class="cta-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>Soporte 24/7</span>
          </div>

          <!-- Title -->
          <h2 class="cta-title">
            ¿Necesitas ayuda con tu búsqueda jurídica?
          </h2>

          <!-- Description -->
          <p class="cta-description">
            Nuestro equipo de expertos está listo para atenderte. Responderemos todas tus consultas y te guiaremos en el uso de la plataforma.
          </p>

          <!-- CTA Button -->
          <router-link to="/contacto" class="cta-button">
            <span>Contáctanos ahora</span>
            <svg class="cta-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </router-link>

          <!-- Features -->
          <div class="cta-features">
            <div class="cta-feature">
              <svg class="cta-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Respuesta rápida</span>
            </div>
            <div class="cta-feature">
              <svg class="cta-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Soporte profesional</span>
            </div>
            <div class="cta-feature">
              <svg class="cta-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Guía personalizada</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer-component />
  </div>
</template>
<script>

import login from "@/assets/img/login.jpg";
import profile from "@/assets/img/profile.jpg";
import landing from "@/assets/img/landing.jpg";
import beneficioBg1 from "@/assets/img/resources/beneficios-bg-card-1.png";
import beneficioBg2 from "@/assets/img/resources/beneficios-bg-card-2.png";
import beneficioBg3 from "@/assets/img/resources/beneficios-bg-card-3.png";
import beneficioBg4 from "@/assets/img/resources/beneficios-bg-card-4.png";
import beneficioBg5 from "@/assets/img/resources/beneficios-bg-card-5.png";
import valorImg1 from "@/assets/img/resources/accesibilidad-icon.png";
import valorImg2 from "@/assets/img/resources/transparencia-icon.png";
import valorImg3 from "@/assets/img/resources/innovacion-icon.png";
import valorImg4 from "@/assets/img/resources/compromisoetico-icon.png";
import valorImg5 from "@/assets/img/resources/colaboracion-icon.png";
import leftArrow from "@/assets/img/resources/left-arrow.png";
import rightArrow from "@/assets/img/resources/right-arrow.png";
import corona from "@/assets/img/resources/Corona.png";
import preguntasFrecuentes from "@/assets/img/resources/preguntas-frecuentes.png";
import nextIcon from "@/assets/img/resources/next-icon.png";
import userExample from "@/assets/img/resources/user-example.png";
import bgComments from "@/assets/img/resources/bg-comments.png";
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';
import { Carousel, Slide, Navigation as CarouselNavigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

// * USADOS
import IndexNavbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import patternVue from "@/assets/img/resources/imagen.png";
import misionVue from "@/assets/img/resources/Arrow.png";
import visionVue from "@/assets/img/resources/Show.png";
import portada from "@/assets/img/resources/portada-inicio.jpg";
import screen from "@/assets/img/resources/imagen_portada.png";


// * PROXIES
import LoginProxy from "@/proxies/LoginProxy";
import SettingsProxy from "@/proxies/SettingsProxy.js";
import MantenimientoProxy from "@/proxies/MantenimientoProxy.js";
import ModalCrearUsuario from "./Modales/ModalCrearUsuario.vue";
import Question from "./Question.vue";
import { ref } from "vue";

export default {
  setup() {
    return {
      selectedSection: ref("quienes-somos")
    };
  },
  data() {
    return {
      patternVue,
      login,
      profile,
      landing,
      // VARIABLES USADAS
      noticias: [],
      currentIndex: 0,
      misionVue,
      visionVue,
      portada,
      valorImg1,
      valorImg2,
      valorImg3,
      valorImg4,
      valorImg5,
      screen,
      modelo: {
        NOMBRES: null,
        CORREO: null,
        ASUNTO: null,
        MENSAJE: null,
      },
      isLoading: false,
      modalCrearUsuario: {
        show: false,
        data: null,
      },
      planes: [],
      carouselConfig: {
        wrapAround: true,
        autoplay: 5000,
        breakpoints: {
          320: { itemsToShow: 1 },
          768: { itemsToShow: 2 },
          1024: { itemsToShow: 3 },
        },
      },
      slides: [
        {
          id: 1,
          image: beneficioBg1,
          text: "Base de datos actualizada",
          description: "Amplia colección de resoluciones y sentencias sobre la materia.",
        },
        {
          id: 2,
          image: beneficioBg2,
          text: "Búsqueda avanzada",
          description: "Herramienta tecnológica de búsqueda avanzada que permite filtrar jurisprudencia específica de manera rápida y eficiente.",
        },
        {
          id: 3,
          image: beneficioBg3,
          text: "Análisis crítico",
          description: "Comentarios de expertos acerca de las decisiones judiciales más relevantes, que proporcionan contexto y claridad."
        },
        {
          id: 4,
          image: beneficioBg4,
          text: "Continua actualización",
          description: "Herramienta tecnológica de búsqueda avanzada que permite filtrar jurisprudencia específica de manera rápida y eficiente.",
        },
        {
          id: 5,
          image: beneficioBg5,
          text: "Interfaz amigable",
          description: "Diseño intuitivo y de fácil uso para la búsqueda y consulta de documentos jurídicos."
        },
      ],
      comments: [
        {
          id: 1,
          image: userExample,
          text: "Lorem ipsum dolor sit amet consectetur. Vulputate integer enim nunc fringilla risus id volutpat.",
          name: "Martín",
          profession: "Ingeniero Civil",
        },
      ],
      valores: [
        {
          id: 1,
          image: valorImg1,
          name: "Accesibilidad",
          description: "Promovemos el libre acceso a la información judicial.",
        },
        {
          id: 2,
          image: valorImg2,
          name: "Transparencia",
          description: "Ofrecemos información judicial precisa, clara y confiable.",
        },
        {
          id: 3,
          image: valorImg3,
          name: "Innovación",
          description: "Nuestras herramientas digitales mejoran continuamente para favorecer la experiencia del usuario.",
        },
        {
          id: 4,
          image: valorImg4,
          name: "Compromiso Ético",
          description: "Contribuimos el fortalecimiento del Estado de Derecho y a la construcción de una sociedad mas justa mediante el libre y fácil acceso a la información digital.",
        },
        // {
        //   id: 5,
        //   image: valorImg5,
        //   name: "Compromiso Ético",
        //   description: "Contribuimos el fortalecimiento del Estado de Derecho y a la construcción de una sociedad mas justa mediante el libre y fácil acceso a la información digital.",
        // },
      ],
      planesSuggets: {
        "1": {
          RESTRICIONES: [
            "Acceso a filtros de búsqueda especializada.",
            "Visualiza resoluciones completas.",
            "Descarga 1 resolución por día.",
            "Prueba gratuita de 30 días con opción a upgrade.",
          ],
          descripcion: "Ideal para estudiantes, curiosos o quienes recién descubren el poder del análisis jurisprudencial.",
        },
        "2": {
          RESTRICIONES: [
            "Accede a todos los filtros avanzados.",
            "Visualiza y descarga resoluciones sin límites.",
            "Accede a resúmenes ejecutivos elaborados por expertos.",
            "Marca resoluciones como favoritas.",
            "Crea, organiza y comparte carpetas temáticas.",
            "Accede a boletines quincenales y mensuales con lo más relevante en jurisprudencia penal y de compliance.",
            "Recibe alertas de noticias relevantes y cambios normativos.",
          ],
          descripcion: "Para penalistas, asesores y compliance officers que viven de la estrategia jurídica.",
        },
        "3": {
          RESTRICIONES: [
            "Todo lo del Plan Premium.",
            "Presenta tu correo institucional o constancia de matrícula.",
            "Accede a recursos para prácticas preprofesionales, tesis y exámenes",
            "Invitaciones a webinars y/o eventos.",
          ],
          descripcion: "Para estudiantes de Derecho con hambre de conocimiento.",
        },
        "4": {
          RESTRICIONES: [
            "Todo lo del Plan Premium.",
            "Invitaciones a webinars y/o eventos.",
            "Acceso anticipado a nuevas funciones.",
            "Bonus: Informe Top 20 resoluciones del año, edición digital exclusiva.",
            "Facturación mensual o anual. Puedes cancelar en cualquier momento.",
            "Alertas de noticias.",
          ],
          descripcion: "Para quienes viven del litigio, la estrategia o el cumplimiento normativo.",
        },
      },
      leftArrow,
      rightArrow,
      corona,
      preguntasFrecuentes,
      nextIcon,
      userExample,
      bgComments
    };
  },
  validators: {
    'modelo.NOMBRES': function (value) {
      return Validator.value(value).required("Campo requerido");
    },
    'modelo.CORREO': function (value) {
      return Validator.value(value).required("Campo requerido");
    },
    'modelo.ASUNTO': function (value) {
      return Validator.value(value).required("Campo requerido");
    },
    'modelo.MENSAJE': function (value) {
      return Validator.value(value).required("Campo requerido");
    },
  },
  components: {
    IndexNavbar,
    FooterComponent,
    ModalCrearUsuario,
    Carousel,
    CarouselNavigation,
    Slide,
    Question
  },
  computed: {
    currentNoticia() {
      return this.noticias[this.currentIndex] || { title: '', description: '', image: '' };
    }
  },
  methods: {
    capitalizeFirst(text) {
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    getNoticias() {
      LoginProxy.list({
        INIT: 0,
        ROWS: 4,
        DESC: null,
        CESTDO: 'A'
      })
        .then(async (response) => {
          const processedResponse = await Promise.all(response.map(noticia => {
            const type = noticia.IMAGEN.split('.').pop();
            const imageData = noticia?.IMAGEN2?.data || null;

            if (!imageData) return noticia;

            const base64String = imageData.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            noticia.IMAGEN2 = `data:image/${type};base64,${window.btoa(base64String)}`;
            return noticia;
          }));

          this.noticias = processedResponse;
          this.startRotation();
        })
        .catch((error) => {
          toast.error(error?.message || 'Ocurrió un error al obtener las noticias', { toastId: 'error' });
          this.noticias = []
        });
    },
    getPlanes() {
      MantenimientoProxy.listPlanesAbout({
        ROWS: 1000,
        INIT: 0,
        DESC: null
      }
      ).then((response) => {
        response = response.map((item) => {
          item.PRECIO = item.PRECIO.toFixed(2);
          item.TIEMPO = Number((item.TIEMPO / 30).toFixed(0));
          item["DETALLE"] = this.planesSuggets?.[item.VALOR] || {
            RESTRICIONES: [],
            descripcion: ""
          };
          item["PERIODO"] = item?.TIEMPO + (item?.TIEMPO <= 1 ? ' mes' : ' meses');
          return item;
        });

        const principalIndex = response.findIndex(item => item.PRINCIPAL);
        if (principalIndex !== -1 && principalIndex < response.length - 1) {
          const principalItem = response.splice(principalIndex, 1)[0];
          response.splice(response.length - 1, 0, principalItem);
        }



        this.planes = response;
      })
        .catch((error) => {
          toast.error(error?.message || 'Ocurrió un error al obtener los planes', { toastId: 'error' });
        })
    },
    goToPlan() {
      return 1
      // this.modalCrearUsuario.show = true;
    },
    startRotation() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.noticias.length;
      }, 5000);
    },
    async submit(e) {
      e.preventDefault();

      let validate = await this.$validate();
      if (!validate) return;

      this.isLoading = true;
      await SettingsProxy.create(this.modelo)
        .then((response) => {
          if (response.STATUS) {
            this.modelo = {
              NOMBRES: null,
              CORREO: null,
              ASUNTO: null,
              MENSAJE: null,
            };

            this.validation.reset();
            toast.success('Mensaje enviado correctamente', { toastId: 'success' });
          } else {
            toast.error('Ocurrió un error al enviar el mensaje', { toastId: 'error' });
          }
        })
        .catch(() => toast.error('Ocurrió un error al enviar el mensaje', { toastId: 'error' }))
        .finally(() => this.isLoading = false);
    },
    async getParams() {
      await Promise.all([this.getNoticias(), this.getPlanes()]);
    }
  },

  mounted() {
    // validar si en url viene /#xxxxxxxxxxxx
    const sectionId = window.location.hash;
    if (sectionId) {
      const section = document.querySelector(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }

    this.getParams();

    document.addEventListener('DOMContentLoaded', function () {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      });

      const elementos = document.querySelectorAll('.animation-b-t');
      const elementos2 = document.querySelectorAll('.animation-r-l');
      const elementos3 = document.querySelectorAll('.animation-l-r');

      elementos.forEach(elemento => {
        observer.observe(elemento);
      });

      elementos2.forEach(elemento => {
        observer.observe(elemento);
      });

      elementos3.forEach(elemento => {
        observer.observe(elemento);
      });
    });



  },
};
</script>

<style scoped>
@media (max-width: 768px) {

  .planes-juris {
    margin-top: 10px !important;
  }

  /* // haacer responsive donde se agrega la iagen al incio */
  .container-mobile {
    background-image: url("~@/assets/img/resources/portada-inicio.jpg");
    background-size: cover;
    background-position: right;
    background-repeat: no-repeat;
    height: 50vh;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .container-text-first {
    margin-top: 15px !important;
    padding: 20px 0px !important;
  }

  .container-text-first .row {
    margin: 0 !important;
    display: block !important;
  }

  .ofrecemos-lo {
    margin-top: 20px 0px 10px 0px !important;
  }
}


/* Cuando el elemento es visible, se aplicará la animación */
.animation-b-t.visible {
  animation: frame3 1s ease-in-out;
}

/* Keyframes que definen los "frames" de la animación */
@keyframes frame3 {
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 0.8;
    transform: translateY(0);
  }
}

/* Celulares en modo vertical */
@media only screen and (max-width: 480px) {

  /* Estilos para dispositivos móviles */
  .container-h-screen {
    margin-bottom: 1rem
  }

  .container-contactanos {
    margin: 0 !important;
  }

  .container-contactanos .contactos-container {
    padding: 0 !important;
  }

  .container-contactanos .contacto {
    padding: 2rem !important;
  }
}

/* Tabletas en modo vertical y horizontal */
@media only screen and (min-width: 481px) and (max-width: 768px) {

  /* Estilos para tabletas */
  .container-text {
    width: 100% !important;
  }

  .container-h-screen {
    height: 70vh;
  }

  .w-full-container {
    width: 100% !important;
    text-align: justify;
  }

  .w-full-container .container-imagen {
    justify-content: center;
  }
}

@media only screen and (min-width: 769px) and (max-width: 1024px) {
  .container-text {
    width: 100% !important;
  }
}

@media (max-width: 768px) {
  #img-inicio {
    display: none;
  }

  #container-fluid-img {
    padding: 0 !important;
  }


  .h2-init {
    padding-top: 30px;
  }

  .container-mision-v {
    margin: 0 !important;
    padding: 0 !important;
  }

  .container-valor {
    padding: 0 !important;
  }
}

.img-container img {
  max-height: 40px;
  max-width: 40px;

}

.ul-list-details li {
  list-style-type: none;
}

.card-price:hover {
  border: 1px solid #a5bef5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Planes Section - Nuevo Diseño */
.planes-section {
  padding: 2.8rem 1rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.planes-container {
  max-width: 1400px;
  margin: 0 auto;
}

.planes-header {
  text-align: center;
  margin-bottom: 2rem;
}

.planes-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1F2937;
  margin-bottom: 0.75rem;
}

.text-gradient {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.planes-subtitle {
  font-size: 0.82rem;
  color: #6B7280;
  max-width: 600px;
  margin: 0 auto;
}

.planes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 0 1rem;
}

.plan-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: #6ba3ff;
}

.plan-featured {
  border: 2px solid #6ba3ff;
  box-shadow: 0 8px 30px rgba(107, 163, 255, 0.2);
  transform: scale(1.05);
}

.plan-featured:hover {
  transform: scale(1.08) translateY(-8px);
  box-shadow: 0 15px 50px rgba(107, 163, 255, 0.3);
}

.plan-header {
  padding: 1.4rem 1.2rem 1.1rem;
  text-align: center;
}

.plan-header-featured {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
}

.plan-header-normal {
  background: linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%);
}

.plan-name {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.corona-icon {
  width: 24px;
  height: 24px;
}

.plan-header-featured .plan-name {
  color: white;
}

.plan-header-normal .plan-name {
  color: #1F2937;
}

.plan-body {
  padding: 1.4rem 1.2rem;
}

.plan-price-section {
  text-align: center;
  margin-bottom: 1.4rem;
}

.price-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
}

.currency {
  font-size: 1rem;
  font-weight: 600;
  color: #6B7280;
  margin-top: 0.4rem;
}

.price-amount {
  font-size: 1.9rem;
  font-weight: 800;
  color: #1F2937;
  line-height: 1;
}

.price-period {
  font-size: 0.8rem;
  color: #9CA3AF;
  align-self: flex-end;
  margin-bottom: 0.4rem;
}

.plan-button {
  width: 100%;
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  border: 2px solid #6ba3ff;
  background: white;
  color: #6ba3ff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 1.4rem;
}

.plan-button:hover {
  background: #6ba3ff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107, 163, 255, 0.3);
}

.plan-button-featured {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  color: white;
  border: none;
}

.plan-button-featured:hover {
  background: linear-gradient(135deg, #c528a0 0%, #1450c9 100%);
  box-shadow: 0 8px 25px rgba(223, 45, 178, 0.4);
}

.button-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.plan-button:hover .button-arrow {
  transform: translateX(4px);
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #F3F4F6;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  width: 20px;
  height: 20px;
  color: #6ba3ff;
  flex-shrink: 0;
  margin-top: 2px;
}

.feature-text {
  font-size: 0.78rem;
  color: #4B5563;
  line-height: 1.55;
}

/* Responsive */
@media (max-width: 768px) {
  .planes-section {
    padding: 3.5rem 0.5rem;
  }

  .planes-title {
    font-size: 2rem;
  }

  .planes-subtitle {
    font-size: 1rem;
  }

  .planes-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }

  .plan-featured {
    transform: scale(1);
  }

  .plan-featured:hover {
    transform: translateY(-8px);
  }

  .price-amount {
    font-size: 2.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .planes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}


.imagen-logo-main {
  margin-top: 10rem;
  padding: 0 !important;
  margin-right: 5rem;
  margin-left: 5rem;
  border-radius: 10px;
  width: 40%;
  height: auto;
  box-shadow: -1px 1px 5px 4px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: -1px 1px 5px 4px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: -1px 1px 5px 4px rgba(0, 0, 0, 0.3);
  opacity: 0.8;
  animation: frame 1s ease-in-out;
}


.animation-r-l {
  animation: frame2 1s ease-in-out;
}

@keyframes frame {
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 0.8;
    transform: translateX(0);
  }
}

@keyframes frame2 {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }

  to {
    opacity: 0.8;
    transform: translateX(0);
  }
}

:deep(.carousel__viewport) {
  gap: 20px;
}

.slide-content {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-right: 20px;
}

.slide-image {
  width: 100%;
  display: block;
}

.text-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  padding: 10px;
  transition: all 0.5s ease;
}

.slide-text {
  margin: 0;
  color: white;
  transition: transform 0.5s ease;
}

.slide-description {
  color: white;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.5s ease, max-height 0.5s ease;
}

.slide-content:hover .text-container {
  bottom: 20px;
}

.slide-content .slide-text {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.slide-content:hover .slide-text {
  transform: translateY(-80px);
}

.slide-content:hover .slide-description {
  opacity: 1;
  max-height: 100px;
}

/* Botones de navegación */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10;
}

.prev-button {
  left: -30px;
  /* Ajusta la posición izquierda */
}

.next-button {
  right: -30px;
  /* Ajusta la posición derecha */
}

.bg-comments {
  background-size: cover;
  background-position: center top;
}


/* Hero Section - Modern Design */
.hero-section-clean {
  position: relative;
  padding: 4rem 2rem;
  min-height: 56vh;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  width: 100%;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.5) 0%, rgba(24, 92, 230, 0.5) 100%);
  z-index: 1;
}

.hero-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 10;
}

.hero-text-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #185CE6;
  margin-bottom: 1.4rem;
  animation: fadeInUp 0.6s ease-out;
  backdrop-filter: blur(10px);
}

.hero-badge svg {
  color: #DF2DB2;
}

.hero-title-modern {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 1rem;
  animation: fadeInUp 0.6s ease-out 0.1s backwards;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-gradient-text {
  color: #ffffff;
  display: inline;
  font-weight: 900;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.hero-subtitle-modern {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.7;
  margin-bottom: 1.8rem;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-cta-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s ease-out 0.3s backwards;
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.35rem;
  background: white;
  color: #185CE6;
  border: none;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  background: #f8f9fa;
  color: #185CE6;
  text-decoration: none;
}

.hero-btn-primary svg {
  width: 15px;
  height: 15px;
  transition: transform 0.3s ease;
}

.hero-btn-primary:hover svg {
  transform: translateX(4px);
}

.hero-btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.35rem;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-btn-secondary:hover {
  background: white;
  color: #185CE6;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  text-decoration: none;
}

/* Dark mode styles for hero buttons */
.dark .hero-btn-primary {
  background: white;
  color: #185CE6;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.dark .hero-btn-primary:hover {
  background: #f3f4f6;
  color: #185CE6;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}

.dark .hero-btn-secondary {
  background: transparent;
  color: #f3f4f6;
  border: 2px solid #f3f4f6;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
}

.dark .hero-btn-secondary:hover {
  background: #f3f4f6;
  color: #111827;
  border-color: #f3f4f6;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
}

/* Dark mode for text gradient */
.dark .text-gradient {
  background: linear-gradient(135deg, #ec4899 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.opcion-1 {
  display: none;
}

.opcion-2 {
  display: block;
}

.container-mobile {
  display: block;
}

@media (max-width: 768px) {
  .hero-section-clean {
    padding: 3rem 1.5rem;
    min-height: 50vh;
  }

  .hero-title-modern {
    font-size: 1.6rem;
  }

  .hero-subtitle-modern {
    font-size: 0.82rem;
  }

  .hero-cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-btn-primary,
  .hero-btn-secondary {
    justify-content: center;
    width: 100%;
  }

  .hero-badge {
    font-size: 0.72rem;
    padding: 0.45rem 0.9rem;
  }

  .opcion-1 {
    display: block;
  }

  .opcion-2 {
    display: none;
  }

  .container-mobile {
    display: none!important;
  }

  .container-mobile .degradado {
    display: none;
  }

  .container-text-first {
    position: absolute;
  }

  .card-price {
    margin: 0 !important;
    padding: 0 !important;
  }

  .slide-content {
    margin-right: 0 !important;
  }

  .link-questions {
    display: flex;
    justify-content: center;
  }

  .link-questions a {
    margin-right: 0 !important;
    margin-left: 0 !important;
    margin-top: 20px !important;
  }
}

/* Sección de Preguntas Frecuentes */
.preguntas-section {
  padding: 2.8rem 1rem;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.preguntas-container {
  max-width: 1400px;
  margin: 0 auto;
}

.preguntas-header {
  text-align: center;
  margin-bottom: 2rem;
}

.preguntas-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1F2937;
  margin: 0;
}

.preguntas-content {
  padding: 0 1rem;
}

.preguntas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  align-items: center;
}

.preguntas-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preguntas-image {
  width: 100%;
  max-width: 380px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.preguntas-image:hover {
  transform: scale(1.02);
}

.preguntas-accordion-container {
  background: white;
  border-radius: 16px;
  padding: 1.4rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.preguntas-cta {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.preguntas-button {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(223, 45, 178, 0.3);
}

.preguntas-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(223, 45, 178, 0.4);
  color: white;
  text-decoration: none;
}

.preguntas-button .button-arrow {
  width: 15px;
  height: 15px;
  transition: transform 0.3s ease;
}

.preguntas-button:hover .button-arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .preguntas-section {
    padding: 3rem 1rem;
  }

  .preguntas-header {
    margin-bottom: 2rem;
  }

  .preguntas-title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .preguntas-content {
    padding: 0;
  }

  .preguntas-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .preguntas-accordion-container {
    padding: 1.75rem 1.25rem;
  }

  .preguntas-image {
    max-width: 100%;
  }

  .preguntas-button {
    padding: 1rem 1.75rem;
    font-size: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .preguntas-grid {
    gap: 2rem;
  }
}

/* Info Section - Nueva sección moderna */
.info-section-modern {
  padding: 2.8rem 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

.info-section-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(223, 45, 178, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(24, 92, 230, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.info-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.info-content-wrapper {
  max-width: 1000px;
  margin: 0 auto 2.5rem;
  text-align: center;
}

.info-badge-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.4rem;
  animation: fadeInUp 0.6s ease-out;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(24, 92, 230, 0.1) 100%);
  border: 2px solid rgba(24, 92, 230, 0.2);
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #185CE6;
  backdrop-filter: blur(10px);
}

.info-badge svg {
  color: #DF2DB2;
}

.info-text-block {
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out 0.1s backwards;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.4;
  color: #1F2937;
  margin-bottom: 1rem;
}

.info-highlight {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
}

.info-description {
  font-size: 0.82rem;
  color: #6B7280;
  line-height: 1.7;
  max-width: 800px;
  margin: 0 auto;
}

.info-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

.info-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1.1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: left;
}

.info-feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon-wrapper {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.info-feature-item:hover .feature-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.feature-icon-blue {
  background: linear-gradient(135deg, rgba(24, 92, 230, 0.1) 0%, rgba(24, 92, 230, 0.2) 100%);
  color: #185CE6;
}

.feature-icon-purple {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.2) 100%);
  color: #8b5cf6;
}

.feature-icon-pink {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(223, 45, 178, 0.2) 100%);
  color: #DF2DB2;
}

.feature-content h4 {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.35rem;
}

.feature-content p {
  font-size: 0.78rem;
  color: #6B7280;
  line-height: 1.55;
  margin: 0;
}

.info-image-container {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
  animation: fadeInUp 0.8s ease-out 0.3s backwards;
}

.info-screenshot {
  width: 100%;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
  transition: transform 0.5s ease;
}

.info-screenshot:hover {
  transform: translateY(-10px);
}

.image-decoration-circle {
  position: absolute;
  border-radius: 50%;
  z-index: 1;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(223, 45, 178, 0.2) 0%, transparent 70%);
  top: -50px;
  left: -100px;
}

.circle-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(24, 92, 230, 0.2) 0%, transparent 70%);
  bottom: -50px;
  right: -80px;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@media (max-width: 768px) {
  .info-section-modern {
    padding: 3rem 1rem;
  }

  .info-title {
    font-size: 1.75rem;
  }

  .info-description {
    font-size: 1rem;
  }

  .info-features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .info-feature-item {
    padding: 1.25rem;
  }

  .info-image-container {
    padding: 0 1rem;
  }

  .circle-1,
  .circle-2 {
    display: none;
  }

  .info-badge {
    font-size: 0.85rem;
    padding: 0.6rem 1.2rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .info-title {
    font-size: 2rem;
  }

  .info-features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Propósito Section - Modernizada */
.proposito-section-modern {
  padding: 2.5rem 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  position: relative;
  overflow: hidden;
}

.proposito-container {
  max-width: 1400px;
  margin: 0 auto;
}

.proposito-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.proposito-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1F2937;
  margin-bottom: 1rem;
}

.proposito-subtitle {
  font-size: 1rem;
  color: #6B7280;
  max-width: 600px;
  margin: 0 auto;
}

.proposito-tabs-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.proposito-tabs {
  display: inline-flex;
  background: white;
  border-radius: 60px;
  padding: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  gap: 0.5rem;
}

.proposito-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.proposito-tab svg {
  transition: transform 0.3s ease;
}

.proposito-tab:hover {
  color: #185CE6;
  background: rgba(24, 92, 230, 0.05);
}

.proposito-tab-active {
  background: rgba(24, 92, 230, 0.05);
  color: #185CE6;
}

.proposito-tab-active:hover {
  background: rgba(24, 92, 230, 0.08);
  color: #185CE6;
}

.proposito-tab-active svg {
  transform: scale(1.1);
}

.proposito-content {
  padding: 0 1rem;
}

/* Vision y Misión Cards */
.vision-mision-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.vm-card {
  background: white;
  border-radius: 24px;
  padding: 2rem 1.8rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.5rem;
}

.vm-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.vm-card-vision:hover {
  border-color: #185CE6;
}

.vm-card-mision:hover {
  border-color: #DF2DB2;
}

.vm-card-icon-wrapper {
  flex-shrink: 0;
}

.vm-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.vm-icon-vision {
  background: linear-gradient(135deg, rgba(24, 92, 230, 0.1) 0%, rgba(24, 92, 230, 0.2) 100%);
  color: #185CE6;
}

.vm-icon-mision {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(223, 45, 178, 0.2) 100%);
  color: #DF2DB2;
}

.vm-card:hover .vm-card-icon {
  transform: scale(1.1) rotate(5deg);
}

.vm-card-content {
  position: relative;
  z-index: 2;
  flex: 1;
  text-align: left;
}

.vm-card-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1F2937;
  margin-bottom: 0.8rem;
  margin-top: 0;
}

.vm-card-vision .vm-card-title {
  color: #185CE6;
}

.vm-card-mision .vm-card-title {
  color: #DF2DB2;
}

.vm-card-description {
  font-size: 0.95rem;
  color: #4B5563;
  line-height: 1.8;
  margin: 0;
}

.vm-card-decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  opacity: 0.08;
  z-index: 1;
  transition: all 0.5s ease;
}

.vm-decoration-vision {
  background: radial-gradient(circle, #185CE6 0%, transparent 70%);
  bottom: -50px;
  right: -50px;
}

.vm-decoration-mision {
  background: radial-gradient(circle, #DF2DB2 0%, transparent 70%);
  bottom: -50px;
  right: -50px;
}

.vm-card:hover .vm-card-decoration {
  transform: scale(1.3);
  opacity: 0.12;
}

/* Valores Carousel */
.valores-carousel-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.valores-slide {
  padding: 1rem;
}

.valor-card {
  background: white;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  text-align: left;
  border: 2px solid transparent;
  gap: 1.2rem;
}

.valor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
  border-color: rgba(24, 92, 230, 0.3);
}

.valor-icon-wrapper {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(24, 92, 230, 0.1) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.valor-card:hover .valor-icon-wrapper {
  transform: scale(1.1) rotate(-5deg);
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.15) 0%, rgba(24, 92, 230, 0.15) 100%);
}

.valor-icon {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.valor-content {
  flex: 1;
}

.valor-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.6rem;
  margin-top: 0;
}

.valor-description {
  font-size: 0.9rem;
  color: #6B7280;
  line-height: 1.6;
  margin: 0;
}

.carousel-nav-btn {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.carousel-nav-btn:hover {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  border-color: transparent;
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(223, 45, 178, 0.3);
}

.carousel-nav-btn svg {
  color: #6B7280;
  transition: all 0.3s ease;
}

.carousel-nav-btn:hover svg {
  color: white;
}

/* Transiciones */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .proposito-section-modern {
    padding: 2rem 1rem;
  }

  .proposito-title {
    font-size: 2rem;
  }

  .proposito-subtitle {
    font-size: 1rem;
  }

  .proposito-tabs {
    flex-direction: column;
    width: 100%;
    max-width: 350px;
    padding: 0.75rem;
  }

  .proposito-tab {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
  }

  .vision-mision-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  .vm-card {
    padding: 1.5rem 1.2rem;
    flex-direction: row;
    gap: 1rem;
  }

  .vm-card-icon {
    width: 50px;
    height: 50px;
  }

  .vm-card-title {
    font-size: 1.15rem;
  }

  .vm-card-description {
    font-size: 0.9rem;
  }

  .valor-card {
    padding: 1.5rem 1.2rem;
    flex-direction: row;
    gap: 1rem;
  }

  .valor-icon-wrapper {
    width: 55px;
    height: 55px;
  }

  .valor-icon {
    width: 35px;
    height: 35px;
  }

  .valor-title {
    font-size: 1rem;
  }

  .valor-description {
    font-size: 0.85rem;
  }

  .carousel-nav-btn {
    width: 40px;
    height: 40px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .proposito-title {
    font-size: 2.25rem;
  }

  .vision-mision-grid {
    gap: 2rem;
  }
}

/* Ofrecemos Section - Modernizada */
.ofrecemos-section-modern {
  padding: 4rem 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

.ofrecemos-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.ofrecemos-header {
  text-align: center;
  margin-bottom: 1rem;
}

.ofrecemos-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1F2937;
  margin-bottom: 1rem;
}

.ofrecemos-subtitle {
  font-size: 1rem;
  color: #6B7280;
  max-width: 600px;
  margin: 0 auto;
}

.ofrecemos-carousel-container {
  position: relative;
  margin: 0 auto;
  max-width: 100%;
}

.ofrecemos-slide {
  padding: 0 0.75rem;
  height: auto;
}

.ofrecemos-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: auto;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
  margin: 0 0.75rem;
}

.ofrecemos-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(24, 92, 230, 0.3);
}

.ofrecemos-image-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.ofrecemos-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.ofrecemos-card:hover .ofrecemos-image {
  transform: scale(1.1);
}

.ofrecemos-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  transition: opacity 0.3s ease;
}

.ofrecemos-card:hover .ofrecemos-overlay {
  opacity: 0.8;
}

.ofrecemos-content {
  padding: 1.3rem 1.2rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
}

.ofrecemos-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.1) 0%, rgba(24, 92, 230, 0.1) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #185CE6;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.ofrecemos-icon svg {
  width: 22px;
  height: 22px;
}

.ofrecemos-card:hover .ofrecemos-icon {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  color: white;
  transform: scale(1.1) rotate(-5deg);
}

.ofrecemos-text-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ofrecemos-card-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1F2937;
  margin: 0;
  line-height: 1.3;
}

.ofrecemos-card-description {
  font-size: 0.88rem;
  color: #6B7280;
  line-height: 1.5;
  margin: 0;
}

.ofrecemos-nav-btn {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  outline: none;
}

.ofrecemos-nav-btn:hover {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  border-color: transparent;
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(223, 45, 178, 0.3);
}

.ofrecemos-nav-btn svg {
  color: #6B7280;
  transition: all 0.3s ease;
}

.ofrecemos-nav-btn:hover svg {
  color: white;
}

/* Estilos del carousel */
:deep(.ofrecemos-carousel-container .carousel) {
  position: relative;
}

:deep(.ofrecemos-carousel-container .carousel__viewport) {
  overflow: hidden;
  padding: 1.5rem 0;
}

:deep(.ofrecemos-carousel-container .carousel__track) {
  display: flex;
  align-items: stretch;
}

:deep(.ofrecemos-carousel-container .carousel__slide) {
  flex: 0 0 auto;
  width: calc(33.333% - 1.5rem);
  margin: 0;
  padding: 0;
}

/* Pagination dots */
:deep(.ofrecemos-carousel-container .carousel__pagination) {
  margin-top: 2.5rem;
  gap: 0.75rem;
  display: flex;
  justify-content: center;
}

:deep(.ofrecemos-carousel-container .carousel__pagination-button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #E5E7EB;
  transition: all 0.3s ease;
  padding: 0;
  border: none;
  margin: 0 0.25rem;
}

:deep(.ofrecemos-carousel-container .carousel__pagination-button:hover) {
  background: #9CA3AF;
  transform: scale(1.2);
}

:deep(.ofrecemos-carousel-container .carousel__pagination-button--active) {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  width: 32px;
  border-radius: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .ofrecemos-section-modern {
    padding: 3rem 0;
  }

  .ofrecemos-container {
    padding: 0 1rem;
  }

  .ofrecemos-title {
    font-size: 2rem;
  }

  .ofrecemos-subtitle {
    font-size: 1rem;
  }

  :deep(.ofrecemos-carousel-container .carousel__slide) {
    width: 100%;
  }

  .ofrecemos-card {
    margin: 0 0.5rem;
    min-height: auto;
  }

  .ofrecemos-image-wrapper {
    height: 140px;
  }

  .ofrecemos-content {
    padding: 1.2rem 1rem;
    flex-direction: row;
    gap: 1rem;
  }

  .ofrecemos-icon {
    width: 42px;
    height: 42px;
  }

  .ofrecemos-icon svg {
    width: 20px;
    height: 20px;
  }

  .ofrecemos-card-title {
    font-size: 1rem;
  }

  .ofrecemos-card-description {
    font-size: 0.85rem;
  }

  .ofrecemos-nav-btn {
    width: 44px;
    height: 44px;
  }

  .ofrecemos-nav-btn img {
    width: 16px;
    height: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .ofrecemos-container {
    padding: 0 1.5rem;
  }

  .ofrecemos-title {
    font-size: 2.25rem;
  }

  .ofrecemos-image-wrapper {
    height: 150px;
  }

  :deep(.ofrecemos-carousel-container .carousel__slide) {
    width: calc(50% - 1rem);
  }

  .ofrecemos-card {
    margin: 0 0.5rem;
  }
}

/* CTA Section */
.cta-section {
  padding: 4rem 1rem;
  background: transparent;
}

.cta-container {
  max-width: 1280px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  position: relative;
  overflow: hidden;
}

.cta-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: white;
}

.cta-decoration-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.cta-decoration-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -80px;
  animation: float 15s ease-in-out infinite reverse;
}

.cta-decoration-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 10%;
  animation: float 18s ease-in-out infinite;
  opacity: 0.05;
}

.cta-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.3rem;
}

/* CTA Badge */
.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  animation: fadeInUp 0.8s ease-out;
}

.cta-badge-icon {
  width: 16px;
  height: 16px;
}

/* CTA Title */
.cta-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: white;
  margin: 0;
  line-height: 1.2;
  max-width: 700px;
  animation: fadeInUp 0.8s ease-out 0.1s backwards;
}

/* CTA Description */
.cta-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
  max-width: 650px;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

/* CTA Button */
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.8rem;
  background: white;
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s ease-out 0.3s backwards;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: #f8f9fa;
}

.cta-button-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.cta-button:hover .cta-button-icon {
  transform: translateX(5px);
}

/* CTA Features */
.cta-features {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.4s backwards;
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.85rem;
  font-weight: 500;
}

.cta-feature-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* CTA Responsive */
@media (max-width: 768px) {
  .cta-section {
    padding: 3rem 1rem;
  }

  .cta-container {
    padding: 2.5rem 1.8rem;
    border-radius: 20px;
  }

  .cta-title {
    font-size: 1.5rem;
  }

  .cta-description {
    font-size: 0.85rem;
  }

  .cta-button {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  .cta-features {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .cta-decoration-1,
  .cta-decoration-2,
  .cta-decoration-3 {
    display: none;
  }
}

@media (max-width: 480px) {
  .cta-container {
    padding: 2.5rem 1.5rem;
  }

  .cta-title {
    font-size: 1.75rem;
  }

  .cta-description {
    font-size: 0.9375rem;
  }
}

/* ===========================
   DARK MODE STYLES - MEJORADOS
   =========================== */

/* Planes Section Dark Mode */
.dark .planes-section {
  background: #111827;
}

.dark .planes-title {
  color: #f3f4f6;
}

.dark .planes-subtitle {
  color: #d1d5db;
}

.dark .plan-card {
  background: #1f2937;
  border-color: #374151;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.dark .plan-card:hover {
  box-shadow: 0 12px 40px rgba(107, 163, 255, 0.3);
  border-color: #6ba3ff;
}

.dark .plan-featured {
  border-color: #6ba3ff;
  box-shadow: 0 8px 30px rgba(107, 163, 255, 0.5);
}

.dark .plan-header-normal {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
}

.dark .plan-header-normal .plan-name {
  color: #f3f4f6;
}

.dark .plan-body {
  background: #1f2937;
}

.dark .currency,
.dark .price-amount {
  color: #f3f4f6;
}

.dark .price-period {
  color: #d1d5db;
}

.dark .plan-button {
  background: #1f2937;
  color: #6ba3ff;
  border-color: #6ba3ff;
}

.dark .plan-button:hover {
  background: #6ba3ff;
  color: white;
}

.dark .feature-item {
  border-bottom-color: #374151;
}

.dark .feature-text {
  color: #e5e7eb;
}

/* Info Section Dark Mode */
.dark .info-section-modern {
  background: #111827;
}

.dark .info-section-modern::before {
  background: radial-gradient(circle at 30% 50%, rgba(223, 45, 178, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(24, 92, 230, 0.1) 0%, transparent 50%);
}

.dark .info-badge {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.3) 0%, rgba(24, 92, 230, 0.3) 100%);
  border-color: rgba(107, 163, 255, 0.5);
  color: #bfdbfe;
}

.dark .info-title {
  color: #f3f4f6;
}

.dark .info-description {
  color: #d1d5db;
}

.dark .info-feature-item {
  background: #1f2937;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}

.dark .info-feature-item:hover {
  box-shadow: 0 8px 25px rgba(107, 163, 255, 0.3);
  border-color: #6ba3ff;
}

.dark .feature-content h4 {
  color: #f3f4f6;
}

.dark .feature-content p {
  color: #d1d5db;
}

.dark .info-screenshot {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7),
              0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Propósito Section Dark Mode */
.dark .proposito-section-modern {
  background: #111827;
}

.dark .proposito-title {
  color: #f3f4f6;
}

.dark .proposito-subtitle {
  color: #d1d5db;
}

.dark .proposito-tabs {
  background: #1f2937;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}

.dark .proposito-tab {
  color: #9ca3af;
}

.dark .proposito-tab:hover {
  color: #bfdbfe;
  background: rgba(107, 163, 255, 0.15);
}

.dark .proposito-tab-active {
  background: rgba(107, 163, 255, 0.25);
  color: #bfdbfe;
}

.dark .proposito-tab-active:hover {
  background: rgba(107, 163, 255, 0.3);
}

.dark .vm-card {
  background: #1f2937;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}

.dark .vm-card:hover {
  box-shadow: 0 12px 40px rgba(107, 163, 255, 0.3);
  border-color: #6ba3ff;
}

.dark .vm-card-vision:hover {
  border-color: #93c5fd;
}

.dark .vm-card-mision:hover {
  border-color: #f472b6;
}

.dark .vm-icon-vision {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.4) 100%);
  color: #93c5fd;
}

.dark .vm-icon-mision {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.4) 100%);
  color: #f472b6;
}

.dark .vm-card-title {
  color: #f3f4f6;
}

.dark .vm-card-vision .vm-card-title {
  color: #93c5fd;
}

.dark .vm-card-mision .vm-card-title {
  color: #f472b6;
}

.dark .vm-card-description {
  color: #e5e7eb;
}

.dark .valor-card {
  background: #1f2937;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}

.dark .valor-card:hover {
  box-shadow: 0 12px 35px rgba(107, 163, 255, 0.3);
  border-color: #6ba3ff;
}

.dark .valor-icon-wrapper {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.3) 0%, rgba(24, 92, 230, 0.3) 100%);
}

.dark .valor-card:hover .valor-icon-wrapper {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.4) 0%, rgba(24, 92, 230, 0.4) 100%);
}

.dark .valor-title {
  color: #f3f4f6;
}

.dark .valor-description {
  color: #d1d5db;
}

.dark .carousel-nav-btn {
  background: #1f2937;
  border: 1px solid #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.dark .carousel-nav-btn svg {
  color: #d1d5db;
}

.dark .carousel-nav-btn:hover {
  border-color: #6ba3ff;
}

/* Preguntas Section Dark Mode */
.dark .preguntas-section {
  background: #111827;
}

.dark .preguntas-title {
  color: #f3f4f6;
}

.dark .preguntas-accordion-container {
  background: #111827;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 2px solid #374151;
  padding: 1.5rem;
}

/* Primera pregunta sin borde superior */
.dark .preguntas-accordion-container .content-title-question:first-child {
  border-top: none !important;
  padding-top: 0 !important;
}

/* Última pregunta con border inferior más definido */
.dark .preguntas-accordion-container .content-title-question:last-of-type {
  margin-bottom: 1rem;
}

/* Sobrescribir clases de Tailwind para el componente Question */
.dark .preguntas-accordion-container .container {
  background: transparent !important;
  padding: 0 !important;
}

.dark .preguntas-accordion-container .flex {
  background: transparent !important;
}

.dark .preguntas-image {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
  border: 1px solid #374151;
  border-radius: 20px;
}

.dark .preguntas-button {
  background: white !important;
  color: #0d47a1 !important;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.dark .preguntas-button:hover {
  background: #f8f9fa !important;
  color: #0d47a1 !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  transform: translateY(-3px);
}

.dark .preguntas-button .button-arrow {
  color: #0d47a1 !important;
  stroke: #0d47a1 !important;
}

.dark .preguntas-button svg {
  stroke: #0d47a1 !important;
}

/* CTA dentro de preguntas */
.dark .preguntas-accordion-container .preguntas-cta {
  border-top: 2px solid #374151;
  padding-top: 2rem;
  margin-top: 2rem;
}

/* Ofrecemos Section Dark Mode */
.dark .ofrecemos-section-modern {
  background: #111827;
}

.dark .ofrecemos-title {
  color: #f3f4f6;
}

.dark .ofrecemos-subtitle {
  color: #d1d5db;
}

.dark .ofrecemos-card {
  background: #1f2937;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}

.dark .ofrecemos-card:hover {
  box-shadow: 0 12px 30px rgba(107, 163, 255, 0.3);
  border-color: #6ba3ff;
}

.dark .ofrecemos-icon {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.3) 0%, rgba(24, 92, 230, 0.3) 100%);
  color: #93c5fd;
}

.dark .ofrecemos-card-title {
  color: #f3f4f6;
}

.dark .ofrecemos-card-description {
  color: #d1d5db;
}

.dark .ofrecemos-nav-btn {
  background: #1f2937;
  border: 1px solid #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.dark .ofrecemos-nav-btn svg {
  color: #d1d5db;
}

.dark .ofrecemos-nav-btn:hover {
  border-color: #6ba3ff;
}

/* CTA Section Dark Mode - Gradiente más oscuro y vibrante */
.dark .cta-section {
  background: #111827;
}

.dark .cta-container {
  background: linear-gradient(135deg, #3730a3 0%, #4c1d95 100%);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.dark .cta-button {
  background: #ffffff;
  color: #3730a3;
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.3);
  font-weight: 700;
}

.dark .cta-button:hover {
  background: #fafafa;
  color: #3730a3;
  box-shadow: 0 20px 50px rgba(255, 255, 255, 0.4);
  transform: translateY(-4px);
}

.dark .cta-button span,
.dark .cta-button svg {
  color: #3730a3;
  stroke: #3730a3;
}

.dark .cta-badge {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.dark .cta-description {
  color: rgba(243, 244, 246, 0.95);
}

.dark .cta-feature {
  color: rgba(243, 244, 246, 0.9);
}

/* Carousel pagination dark mode */
.dark :deep(.ofrecemos-carousel-container .carousel__pagination-button) {
  background: #374151;
}

.dark :deep(.ofrecemos-carousel-container .carousel__pagination-button:hover) {
  background: #6b7280;
}

/* Background comments dark mode */
.dark .bg-comments {
  background-color: #1f2937 !important;
}

/* Hero overlay más visible en dark mode */
.dark .hero-overlay {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.4) 100%);
}

.dark .hero-gradient-text {
  text-shadow: 0 0 30px rgba(147, 197, 253, 0.8);
}
</style>