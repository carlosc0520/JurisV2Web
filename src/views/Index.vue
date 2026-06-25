<template>
  <div>
    <index-navbar />

    <!-- HERO SECTION (responsive unificado) -->
    <section
      class="relative pt-16 pb-24 px-8 max-sm:pt-12 max-sm:pb-20 max-sm:px-6 min-h-[56vh] max-sm:min-h-[50vh] flex items-center bg-cover bg-center overflow-hidden w-full"
      :style="{ backgroundImage: `url(${portada})` }">
      <div class="absolute inset-0 z-[1] bg-gradient-to-br from-[#DF2DB2]/50 to-[#185CE6]/50 dark:from-purple-500/40 dark:to-blue-500/40"></div>
      <div class="max-w-[1200px] mx-auto w-full relative z-10">
        <div class="max-w-[800px] mx-auto text-center">
          <div class="inline-flex items-center gap-1.5 px-[1.1rem] py-2 bg-white/95 border-2 border-white/30 rounded-full text-[0.78rem] max-sm:text-[0.72rem] font-semibold text-[#185CE6] mb-[1.4rem] backdrop-blur-[10px] anim-fade-up">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[#DF2DB2]">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Plataforma especializada en Derecho Penal</span>
          </div>
          <h1 class="text-[2rem] max-sm:text-[1.6rem] font-extrabold leading-[1.2] text-white mb-4 [text-shadow:0_2px_10px_rgba(0,0,0,0.3)] anim-fade-up-1">
            Optimiza tu estrategia jurídica con
            <span class="font-black [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">jurisprudencia actual</span>
            y <span class="font-black [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">seleccionada</span>
          </h1>
          <p class="text-[0.85rem] max-sm:text-[0.82rem] text-white/95 leading-[1.7] mb-[1.8rem] [text-shadow:0_2px_8px_rgba(0,0,0,0.3)] anim-fade-up-2">
            Consulta jurisprudencia penal en esta herramienta online especializada
          </p>
          <div class="flex max-sm:flex-col gap-3 justify-center flex-wrap anim-fade-up-3">
            <a href="#mi-seccion-planes"
              class="inline-flex items-center justify-center gap-2 px-[1.35rem] py-[0.65rem] bg-white text-[#185CE6] rounded-full text-[0.78rem] font-bold no-underline transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:bg-[#f8f9fa] hover:text-[#185CE6]">
              Explorar planes
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="transition-transform group-hover:translate-x-1">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#conoce-proposito"
              class="inline-flex items-center justify-center px-[1.35rem] py-[0.65rem] bg-transparent text-white border-2 border-white rounded-full text-[0.78rem] font-bold no-underline transition-all duration-300 hover:bg-white hover:text-[#185CE6] hover:-translate-y-[3px]">
              Conocer más
            </a>
          </div>
        </div>
      </div>

      <!-- Ola suave inferior -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-[5] pointer-events-none">
        <svg viewBox="0 0 1440 50" preserveAspectRatio="none"
          class="w-full h-[35px] md:h-[42px] lg:h-[50px] fill-white dark:fill-gray-900">
          <path d="M0,25 C360,50 720,0 1080,30 C1260,42 1380,22 1440,28 L1440,50 L0,50 Z"/>
        </svg>
      </div>
    </section>

    <!-- INFO SECTION -->
    <section class="py-[2.8rem] max-sm:py-12 px-8 max-sm:px-4 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      <div class="max-w-[1400px] mx-auto relative z-[1]">
        <div class="max-w-[1000px] mx-auto mb-10 text-center">
          <div class="flex justify-center mb-[1.4rem] anim-fade-up">
            <div class="inline-flex items-center gap-1.5 px-[1.1rem] py-2 bg-gradient-to-br from-[#DF2DB2]/10 to-[#185CE6]/10 dark:from-[#DF2DB2]/30 dark:to-[#185CE6]/30 border-2 border-[#185CE6]/20 dark:border-[#6ba3ff]/50 rounded-full text-[0.78rem] max-sm:text-[0.85rem] font-semibold text-[#185CE6] dark:text-[#bfdbfe] backdrop-blur-[10px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[#DF2DB2]">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>Plataforma especializada</span>
            </div>
          </div>
          <div class="mb-8 anim-fade-up-1">
            <h2 class="text-[1.5rem] max-sm:text-[1.75rem] font-extrabold leading-[1.4] text-gray-900 dark:text-gray-100 mb-4">
              <span class="bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] bg-clip-text text-transparent font-black">Juris Search</span>
              es una herramienta digital diseñada para simplificar la búsqueda selectiva de jurisprudencia
            </h2>
            <p class="text-[0.82rem] max-sm:text-base text-gray-500 dark:text-gray-300 leading-[1.7] max-w-[800px] mx-auto">
              Especializada en derecho penal, derecho penal económico y de la empresa,
              nuestra plataforma te permite acceder a información jurídica relevante de manera rápida y eficiente.
            </p>
          </div>
          <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] max-sm:grid-cols-1 gap-6 mt-8 anim-fade-up-2">
            <div class="flex items-start gap-3 p-[1.1rem] max-sm:p-5 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-none transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] dark:hover:border-[#6ba3ff] text-left">
              <div class="flex-shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-[10px] bg-gradient-to-br from-[#185CE6]/10 to-[#185CE6]/20 dark:from-blue-500/30 dark:to-blue-500/40 text-[#185CE6] dark:text-blue-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div>
                <h4 class="text-[0.88rem] font-bold text-gray-900 dark:text-gray-100 mb-1">Base actualizada</h4>
                <p class="text-[0.78rem] text-gray-500 dark:text-gray-300 leading-[1.55] m-0">Información jurídica constantemente renovada</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-[1.1rem] max-sm:p-5 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-none transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] dark:hover:border-[#6ba3ff] text-left">
              <div class="flex-shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-[10px] bg-gradient-to-br from-purple-500/10 to-purple-500/20 dark:from-purple-500/30 dark:to-purple-500/40 text-purple-500 dark:text-purple-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <div>
                <h4 class="text-[0.88rem] font-bold text-gray-900 dark:text-gray-100 mb-1">Búsqueda inteligente</h4>
                <p class="text-[0.78rem] text-gray-500 dark:text-gray-300 leading-[1.55] m-0">Encuentra jurisprudencia relevante al instante</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-[1.1rem] max-sm:p-5 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-none transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] dark:hover:border-[#6ba3ff] text-left">
              <div class="flex-shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-[10px] bg-gradient-to-br from-[#DF2DB2]/10 to-[#DF2DB2]/20 dark:from-pink-500/30 dark:to-pink-500/40 text-[#DF2DB2] dark:text-pink-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h4 class="text-[0.88rem] font-bold text-gray-900 dark:text-gray-100 mb-1">Organización eficiente</h4>
                <p class="text-[0.78rem] text-gray-500 dark:text-gray-300 leading-[1.55] m-0">Gestiona y categoriza tus consultas fácilmente</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Screenshot -->
        <div class="relative max-w-[1100px] mx-auto px-8 max-sm:px-4 anim-fade-up-3">
          <div class="absolute w-[300px] h-[300px] rounded-full z-[1] opacity-60 top-[-50px] left-[-100px] anim-float hidden sm:block"
            style="background: radial-gradient(circle, rgba(223,45,178,0.2) 0%, transparent 70%)"></div>
          <div class="absolute w-[250px] h-[250px] rounded-full z-[1] opacity-60 bottom-[-50px] right-[-80px] anim-float-delayed hidden sm:block"
            style="background: radial-gradient(circle, rgba(24,92,230,0.2) 0%, transparent 70%)"></div>
          <img :src="screen" alt="Plataforma Juris Search"
            class="w-full h-auto rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)] relative z-[2] transition-transform duration-500 hover:-translate-y-[10px]" />
        </div>
      </div>
    </section>

    <!-- PROPÓSITO SECTION -->
    <section class="py-10 max-sm:py-8 px-8 max-sm:px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900 relative overflow-hidden" id="conoce-proposito">
      <div class="max-w-[1400px] mx-auto">
        <div class="text-center mb-6 reveal">
          <h2 class="text-[2rem] font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            Conoce <span class="bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] bg-clip-text text-transparent">nuestro propósito</span>
          </h2>
          <p class="text-base text-gray-500 dark:text-gray-300 max-w-[600px] mx-auto">
            Impulsamos la excelencia jurídica a través de tecnología e innovación
          </p>
        </div>

        <!-- Tabs -->
        <div class="flex justify-center mb-6">
          <div class="inline-flex max-sm:flex-col max-sm:w-full max-sm:max-w-[350px] bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-[60px] max-sm:rounded-2xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none gap-2">
            <button
              @click="selectedSection = 'quienes-somos'"
              :class="['flex items-center gap-3 max-sm:justify-center px-8 max-sm:px-6 py-4 max-sm:py-[0.875rem] rounded-full text-base font-bold cursor-pointer transition-all duration-300 outline-none border-none',
                selectedSection === 'quienes-somos'
                  ? 'bg-[#185CE6]/5 dark:bg-[#6ba3ff]/25 text-[#185CE6] dark:text-[#bfdbfe]'
                  : 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-[#185CE6] hover:bg-[#185CE6]/5']">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                :class="selectedSection === 'quienes-somos' ? 'scale-110' : ''">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <span>¿Quiénes somos?</span>
            </button>
            <button
              @click="selectedSection = 'nuestros-valores'"
              :class="['flex items-center gap-3 max-sm:justify-center px-8 max-sm:px-6 py-4 max-sm:py-[0.875rem] rounded-full text-base font-bold cursor-pointer transition-all duration-300 outline-none border-none',
                selectedSection === 'nuestros-valores'
                  ? 'bg-[#185CE6]/5 dark:bg-[#6ba3ff]/25 text-[#185CE6] dark:text-[#bfdbfe]'
                  : 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-[#185CE6] hover:bg-[#185CE6]/5']">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                :class="selectedSection === 'nuestros-valores' ? 'scale-110' : ''">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Nuestros valores</span>
            </button>
          </div>
        </div>

        <!-- Quiénes somos -->
        <transition name="fade-slide">
          <div v-if="selectedSection === 'quienes-somos'" class="px-4">
            <div class="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] max-sm:grid-cols-1 gap-6 max-w-[1200px] mx-auto">
              <!-- Visión -->
              <div class="group bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl p-8 max-sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none relative overflow-hidden transition-all duration-[400ms] border-2 border-transparent flex flex-row items-start gap-6 max-sm:gap-4 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-[#185CE6] dark:hover:border-[#93c5fd] reveal reveal-left delay-1">
                <div class="flex-shrink-0">
                  <div class="w-[60px] h-[60px] max-sm:w-[50px] max-sm:h-[50px] rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#185CE6]/10 to-[#185CE6]/20 dark:from-blue-500/30 dark:to-blue-500/40 text-[#185CE6] dark:text-blue-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                </div>
                <div class="relative z-[2] flex-1 text-left">
                  <h3 class="text-[1.35rem] font-extrabold text-[#185CE6] dark:text-blue-300 mb-3 mt-0">Visión</h3>
                  <p class="text-[0.95rem] text-gray-600 dark:text-gray-300 leading-[1.8] m-0">
                    Brindar a nuestros usuarios una plataforma digital intuitiva, completa y actualizada, que facilite
                    la consulta y búsqueda de jurisprudencia nacional y extranjera en derecho penal económico y de la empresa.
                  </p>
                </div>
                <div class="absolute w-[200px] h-[200px] rounded-full opacity-[0.08] z-[1] bottom-[-50px] right-[-50px] transition-all duration-500 group-hover:scale-[1.3] group-hover:opacity-[0.12]"
                  style="background: radial-gradient(circle, #185CE6 0%, transparent 70%)"></div>
              </div>

              <!-- Misión -->
              <div class="group bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl p-8 max-sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none relative overflow-hidden transition-all duration-[400ms] border-2 border-transparent flex flex-row items-start gap-6 max-sm:gap-4 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-[#DF2DB2] dark:hover:border-[#f472b6] reveal reveal-right delay-2">
                <div class="flex-shrink-0">
                  <div class="w-[60px] h-[60px] max-sm:w-[50px] max-sm:h-[50px] rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#DF2DB2]/10 to-[#DF2DB2]/20 dark:from-pink-500/30 dark:to-pink-500/40 text-[#DF2DB2] dark:text-pink-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                </div>
                <div class="relative z-[2] flex-1 text-left">
                  <h3 class="text-[1.35rem] font-extrabold text-[#DF2DB2] dark:text-pink-400 mb-3 mt-0">Misión</h3>
                  <p class="text-[0.95rem] text-gray-600 dark:text-gray-300 leading-[1.8] m-0">
                    Ser la herramienta digital líder en consulta y búsqueda de jurisprudencia en derecho penal
                    económico y de la empresa en Perú.
                  </p>
                </div>
                <div class="absolute w-[200px] h-[200px] rounded-full opacity-[0.08] z-[1] bottom-[-50px] right-[-50px] transition-all duration-500 group-hover:scale-[1.3] group-hover:opacity-[0.12]"
                  style="background: radial-gradient(circle, #DF2DB2 0%, transparent 70%)"></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Valores -->
        <transition name="fade-slide">
          <div v-if="selectedSection === 'nuestros-valores'" class="px-4">
            <div class="max-w-[1200px] mx-auto">
              <Carousel
                :breakpoints="carouselConfig.breakpoints"
                :wrap-around="carouselConfig.wrapAround"
                :autoplay="false"
                :settings="{ navigationEnabled: true }">
                <Slide v-for="valor in valores" :key="valor.id" class="p-4 max-sm:p-3">
                  <div class="group bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-[20px] p-8 px-6 max-sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none transition-all duration-300 h-full flex flex-row items-start text-left border-2 border-transparent gap-5 max-sm:gap-4 hover:-translate-y-2 hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)] hover:border-[#185CE6]/30 dark:hover:border-[#6ba3ff]">
                    <div class="w-[70px] h-[70px] max-sm:w-[55px] max-sm:h-[55px] bg-gradient-to-br from-[#DF2DB2]/10 to-[#185CE6]/10 dark:from-[#DF2DB2]/30 dark:to-[#185CE6]/30 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-[5deg]">
                      <img :src="valor?.image" class="w-[42px] h-[42px] max-sm:w-[35px] max-sm:h-[35px] object-contain" alt="" />
                    </div>
                    <div class="flex-1">
                      <h4 class="text-[1.1rem] font-bold text-gray-900 dark:text-gray-100 mb-2.5 mt-0">{{ valor?.name }}</h4>
                      <p class="text-[0.9rem] text-gray-500 dark:text-gray-300 leading-[1.6] m-0">{{ valor?.description }}</p>
                    </div>
                  </div>
                </Slide>
                <template #addons>
                  <CarouselNavigation>
                    <template #prev>
                      <button class="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full w-12 h-12 max-sm:w-10 max-sm:h-10 flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden hover:border-transparent hover:scale-110 hover:shadow-[0_8px_20px_rgba(223,45,178,0.3)]">
                        <span class="absolute inset-0 bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="relative z-10 text-gray-500 dark:text-gray-300 group-hover:text-white transition-colors">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                      </button>
                    </template>
                    <template #next>
                      <button class="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full w-12 h-12 max-sm:w-10 max-sm:h-10 flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden hover:border-transparent hover:scale-110 hover:shadow-[0_8px_20px_rgba(223,45,178,0.3)]">
                        <span class="absolute inset-0 bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="relative z-10 text-gray-500 dark:text-gray-300 group-hover:text-white transition-colors">
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

    <!-- OFRECEMOS SECTION -->
    <section class="py-16 max-sm:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 relative overflow-hidden" id="mi-nosotros">
      <div class="max-w-[1400px] mx-auto px-8 max-sm:px-4">
        <div class="text-center mb-4 reveal">
          <h2 class="text-[2rem] font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            Lo que te <span class="bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] bg-clip-text text-transparent">ofrecemos</span>
          </h2>
          <p class="text-base text-gray-500 dark:text-gray-300 max-w-[600px] mx-auto">
            Herramientas y recursos diseñados para potenciar tu práctica jurídica
          </p>
        </div>

        <div class="relative mx-auto max-w-full ofrecemos-carousel">
          <Carousel
            :items-to-show="3"
            :items-to-scroll="1"
            :breakpoints="carouselConfig.breakpoints"
            :wrap-around="true"
            :autoplay="5000"
            snap-align="start">
            <Slide v-for="slide in slides" :key="slide.id">
              <div class="group bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none transition-all duration-[400ms] flex flex-col border-2 border-transparent mx-3 max-sm:mx-2 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:border-[#185CE6]/30 dark:hover:border-[#6ba3ff]">
                <div class="relative w-full h-[160px] max-sm:h-[140px] overflow-hidden">
                  <img :src="slide.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                  <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 transition-opacity duration-300 group-hover:opacity-80"></div>
                </div>
                <div class="p-[1.3rem_1.2rem] max-sm:p-[1.2rem_1rem] flex flex-row items-start gap-4">
                  <div class="w-12 h-12 max-sm:w-[42px] max-sm:h-[42px] bg-gradient-to-br from-[#DF2DB2]/10 to-[#185CE6]/10 dark:from-[#DF2DB2]/30 dark:to-[#185CE6]/30 rounded-xl flex items-center justify-center text-[#185CE6] dark:text-blue-300 flex-shrink-0 transition-all duration-300 group-hover:from-[#DF2DB2] group-hover:to-[#185CE6] group-hover:text-white group-hover:scale-110 group-hover:-rotate-[5deg]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="max-sm:w-5 max-sm:h-5">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="flex-1 flex flex-col gap-1.5">
                    <h3 class="text-[1.05rem] max-sm:text-base font-extrabold text-gray-900 dark:text-gray-100 m-0 leading-[1.3]">{{ slide.text }}</h3>
                    <p class="text-[0.88rem] max-sm:text-[0.85rem] text-gray-500 dark:text-gray-300 leading-[1.5] m-0">{{ slide.description }}</p>
                  </div>
                </div>
              </div>
            </Slide>
            <template #addons>
              <CarouselNavigation>
                <template #prev>
                  <button class="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full w-12 h-12 max-sm:w-11 max-sm:h-11 flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden outline-none hover:border-transparent hover:scale-110 hover:shadow-[0_8px_20px_rgba(223,45,178,0.3)]">
                    <span class="absolute inset-0 bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="relative z-10 text-gray-500 dark:text-gray-300 group-hover:text-white transition-colors">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                </template>
                <template #next>
                  <button class="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full w-12 h-12 max-sm:w-11 max-sm:h-11 flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden outline-none hover:border-transparent hover:scale-110 hover:shadow-[0_8px_20px_rgba(223,45,178,0.3)]">
                    <span class="absolute inset-0 bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="relative z-10 text-gray-500 dark:text-gray-300 group-hover:text-white transition-colors">
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

    <!-- PLANES SECTION -->
    <section class="py-[2.8rem] max-sm:py-14 px-4 max-sm:px-2 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900" id="mi-seccion-planes">
      <div class="max-w-[1400px] mx-auto">
        <div class="text-center mb-8 reveal">
          <h2 class="text-[1.6rem] max-sm:text-[2rem] font-extrabold text-gray-900 dark:text-gray-100 mb-3">
            Nuestros <span class="bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] bg-clip-text text-transparent">planes</span>
          </h2>
          <p class="text-[0.82rem] max-sm:text-base text-gray-500 dark:text-gray-300 max-w-[600px] mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] max-sm:grid-cols-1 gap-6 px-4 max-sm:px-2 reveal delay-1">
          <div
            v-for="plan in planes" :key="plan.id"
            :class="['bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none transition-all duration-[400ms] relative border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-[#6ba3ff] dark:hover:shadow-[0_12px_40px_rgba(107,163,255,0.3)]',
              plan?.PRINCIPAL ? 'border-[#6ba3ff] shadow-[0_8px_30px_rgba(107,163,255,0.2)] scale-[1.05] max-sm:scale-100 dark:shadow-[0_8px_30px_rgba(107,163,255,0.5)]' : '']">
            <div :class="['px-[1.2rem] py-[1.4rem] text-center',
              plan?.PRINCIPAL ? 'bg-gradient-to-br from-[#DF2DB2] to-[#185CE6]' : 'bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600']">
              <h3 :class="['text-[1.05rem] font-bold m-0 flex items-center justify-center gap-1.5',
                plan?.PRINCIPAL ? 'text-white' : 'text-gray-900 dark:text-gray-100']">
                <img v-if="plan?.PRINCIPAL" :src="corona" class="w-6 h-6" />
                {{ capitalizeFirst(plan?.DESCRIPCION) }}
              </h3>
            </div>
            <div class="p-[1.4rem_1.2rem]">
              <div class="text-center mb-[1.4rem]">
                <div class="flex items-start justify-center gap-1">
                  <span class="text-base font-semibold text-gray-500 dark:text-gray-300 mt-1.5">S/</span>
                  <span class="text-[1.9rem] font-extrabold text-gray-900 dark:text-gray-100 leading-none">{{ plan?.PRECIO || "" }}</span>
                  <span class="text-[0.8rem] text-gray-400 dark:text-gray-300 self-end mb-1.5">/ {{ plan.PERIODO || "" }}</span>
                </div>
              </div>
              <button @click="siteConfig.ALLOW_PLAN_PURCHASE && goToPlan(plan)"
                :class="['w-full px-[1.2rem] py-[0.7rem] rounded-[10px] text-[0.82rem] font-bold transition-all duration-300 flex items-center justify-center gap-1.5 mb-[1.4rem] border-2',
                  !siteConfig.ALLOW_PLAN_PURCHASE
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-transparent cursor-not-allowed opacity-60'
                    : plan?.PRINCIPAL
                      ? 'bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] text-white border-transparent cursor-pointer hover:shadow-[0_8px_25px_rgba(223,45,178,0.4)] hover:-translate-y-0.5'
                      : 'bg-white dark:bg-gray-800 text-[#6ba3ff] border-[#6ba3ff] cursor-pointer hover:bg-[#6ba3ff] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(107,163,255,0.3)]']">
                {{ !siteConfig.ALLOW_PLAN_PURCHASE ? 'No disponible' : plan?.VALOR != "1" ? "Adquirir Plan" : "Probar gratis" }}
                <svg v-if="siteConfig.ALLOW_PLAN_PURCHASE" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <ul class="list-none p-0 m-0">
                <li class="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  v-for="restriccion in plan.DETALLE.RESTRICIONES" :key="restriccion">
                  <svg class="w-5 h-5 text-[#6ba3ff] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-[0.78rem] text-gray-600 dark:text-gray-300 leading-[1.55]">{{ restriccion }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ModalCrearUsuario :show="modalCrearUsuario.show" :close="() => modalCrearUsuario.show = false" :update="() => { }" />
    </section>

    <!-- PREGUNTAS SECTION -->
    <section class="py-[2.8rem] max-sm:py-12 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div class="max-w-[1400px] mx-auto">
        <div class="animation-b-t text-center mb-8">
          <h2 class="text-[1.6rem] max-sm:text-[1.75rem] font-extrabold text-gray-900 dark:text-gray-100 m-0">
            Resolvemos tus <span class="bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] bg-clip-text text-transparent">preguntas frecuentes</span>
          </h2>
        </div>
        <div class="px-4 max-sm:px-0">
          <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-sm:grid-cols-1 gap-12 max-sm:gap-10 items-center">
            <div class="flex justify-center items-center">
              <img :src="preguntasFrecuentes" alt="Preguntas frecuentes"
                class="w-full max-w-[380px] max-sm:max-w-full h-auto rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)] dark:border dark:border-gray-700 transition-transform duration-300 hover:scale-[1.02]" />
            </div>
            <div class="bg-white dark:bg-gray-900 dark:border-2 dark:border-gray-700 rounded-2xl p-[1.4rem] max-sm:p-[1.75rem_1.25rem] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <Question :resumeSection="true" />
              <div class="flex justify-center mt-8">
                <router-link to="/questions"
                  class="inline-flex items-center gap-2 px-6 max-sm:px-7 py-[0.7rem] max-sm:py-4 bg-gradient-to-br from-[#DF2DB2] to-[#185CE6] text-white border-none rounded-full text-[0.82rem] max-sm:text-base font-bold no-underline transition-all duration-300 shadow-[0_4px_15px_rgba(223,45,178,0.3)] hover:-translate-y-[3px] hover:shadow-[0_8px_25px_rgba(223,45,178,0.4)] hover:text-white">
                  Ver más preguntas frecuentes
                  <svg class="w-[15px] h-[15px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="py-16 max-sm:py-12 px-4 dark:bg-gray-900">
      <div class="cta-gradient-bg max-w-[1280px] mx-auto rounded-3xl max-sm:rounded-[20px] p-12 max-sm:p-[2.5rem_1.8rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] reveal reveal-scale">
        <div class="cta-orb-1 hidden sm:block"/>
        <div class="cta-orb-2 hidden sm:block"/>
        <div class="cta-orb-3 hidden sm:block"/>

        <div class="relative z-10 flex flex-col items-center text-center gap-5">
          <div class="inline-flex items-center gap-1.5 px-4 py-[0.4rem] bg-white/15 backdrop-blur-[10px] border border-white/20 rounded-full text-white text-[0.75rem] font-semibold anim-fade-up">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>Soporte 24/7</span>
          </div>
          <h2 class="text-[1.75rem] max-sm:text-[1.5rem] font-black text-white m-0 leading-[1.2] max-w-[700px] anim-fade-up-1">
            ¿Necesitas ayuda con tu búsqueda jurídica?
          </h2>
          <p class="text-[0.9rem] max-sm:text-[0.85rem] text-white/90 m-0 leading-[1.6] max-w-[650px] anim-fade-up-2">
            Nuestro equipo de expertos está listo para atenderte. Responderemos todas tus consultas y te guiaremos en el uso de la plataforma.
          </p>
          <router-link to="/contacto"
            class="inline-flex items-center gap-2.5 px-[1.8rem] py-3 max-sm:py-4 max-sm:text-base bg-white text-[#667eea] dark:text-[#3730a3] text-[0.9rem] font-bold rounded-xl no-underline transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-[#f8f9fa] hover:text-[#667eea] anim-fade-up-3">
            <span>Contáctanos ahora</span>
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </router-link>
          <div class="flex gap-6 max-sm:flex-col max-sm:gap-4 mt-2 flex-wrap justify-center anim-fade-up-3">
            <div v-for="feat in ['Respuesta rápida', 'Soporte profesional', 'Guía personalizada']" :key="feat"
              class="flex items-center gap-1.5 text-white/95 text-[0.85rem] font-medium">
              <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{{ feat }}</span>
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

import IndexNavbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import patternVue from "@/assets/img/resources/imagen.png";
import misionVue from "@/assets/img/resources/Arrow.png";
import visionVue from "@/assets/img/resources/Show.png";
import portada from "@/assets/img/resources/portada-inicio.jpg";
import screen from "@/assets/img/resources/imagen_portada.png";

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
      siteConfig: { ALLOW_PLAN_PURCHASE: true },
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
          const items = Array.isArray(response) ? response : (response?.DATA ?? response?.data ?? []);
          const processedResponse = await Promise.all(items.map(noticia => {
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
      }).then((response) => {
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
    goToPlan(plan) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const b64 = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(b64));
          const IDR = payload.role ?? payload.IDR;
          if (IDR === 2) {
            this.$router.push(`/usuario/subscripcion?plan=${plan.ID}`);
            return;
          }
          if (IDR === 0 || IDR === 1) {
            // Admin no compra desde el landing
            this.$router.push('/admin/subscripcion');
            return;
          }
        } catch { /* token inválido, caer a login */ }
      }
      // No logueado: ir a registro (si es free va a login directo para simplificar)
      this.$router.push(`/auth/register?plan=${plan.ID}`);
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
            this.modelo = { NOMBRES: null, CORREO: null, ASUNTO: null, MENSAJE: null };
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
    LoginProxy.siteConfig().then(cfg => { if (cfg) this.siteConfig = { ...this.siteConfig, ...cfg }; }).catch(() => {});
    const sectionId = window.location.hash;
    if (sectionId) {
      const section = document.querySelector(sectionId);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
    this.getParams();

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    this.$nextTick(() => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .animation-b-t')
        .forEach(el => revealObserver.observe(el));
    });
  },
};
</script>

<style scoped>
/* ── Vue tab transitions ──────────────────────────────── */
.fade-slide-enter-active,
.fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-slide-enter-from   { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to     { opacity: 0; transform: translateY(-20px); }

/* ── Hero entrance (loads immediately — above fold) ────── */
.anim-fade-up   { animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
.anim-fade-up-1 { animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.12s backwards; }
.anim-fade-up-2 { animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.22s backwards; }
.anim-fade-up-3 { animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.32s backwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(36px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Scroll Reveal (IntersectionObserver adds .visible) ── */
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }

.reveal-left {
  opacity: 0; transform: translateX(-55px);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-left.visible { opacity: 1; transform: translateX(0); }

.reveal-right {
  opacity: 0; transform: translateX(55px);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-right.visible { opacity: 1; transform: translateX(0); }

.reveal-scale {
  opacity: 0; transform: scale(0.88) translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-scale.visible { opacity: 1; transform: scale(1) translateY(0); }

/* Stagger delays */
.delay-1 { transition-delay: 0.08s; }
.delay-2 { transition-delay: 0.16s; }
.delay-3 { transition-delay: 0.24s; }
.delay-4 { transition-delay: 0.32s; }
.delay-5 { transition-delay: 0.40s; }

/* Legacy animation-b-t (now powered by observer) */
.animation-b-t.visible { animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }

/* ── Float / ambient decorations ─────────────────────── */
.anim-float         { animation: float 7s ease-in-out infinite; }
.anim-float-delayed { animation: float 7s ease-in-out 3.5s infinite; }
.cta-deco-1 { animation: floatSlow 22s ease-in-out infinite; }
.cta-deco-2 { animation: floatSlow 17s ease-in-out infinite reverse; }
.cta-deco-3 { animation: floatSlow 19s ease-in-out 4s infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-18px) scale(1.04); }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-25px) rotate(6deg); }
  66%       { transform: translateY(10px) rotate(-4deg); }
}

/* vue3-carousel deep overrides */
:deep(.carousel__viewport) { gap: 20px; }

:deep(.ofrecemos-carousel .carousel__viewport) {
  overflow: hidden;
  padding: 1.5rem 0;
}
:deep(.ofrecemos-carousel .carousel__track) {
  display: flex;
  align-items: stretch;
}
:deep(.ofrecemos-carousel .carousel__slide) {
  flex: 0 0 auto;
  width: calc(33.333% - 1.5rem);
  margin: 0;
  padding: 0;
}
:deep(.ofrecemos-carousel .carousel__pagination) {
  margin-top: 2.5rem;
  gap: 0.75rem;
  display: flex;
  justify-content: center;
}
:deep(.ofrecemos-carousel .carousel__pagination-button) {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #E5E7EB;
  transition: all 0.3s ease;
  padding: 0; border: none;
  margin: 0 0.25rem;
}
:deep(.ofrecemos-carousel .carousel__pagination-button:hover) {
  background: #9CA3AF;
  transform: scale(1.2);
}
:deep(.ofrecemos-carousel .carousel__pagination-button--active) {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  width: 32px;
  border-radius: 6px;
}
.dark :deep(.ofrecemos-carousel .carousel__pagination-button) { background: #374151; }
.dark :deep(.ofrecemos-carousel .carousel__pagination-button:hover) { background: #6b7280; }

@media (max-width: 768px) {
  :deep(.ofrecemos-carousel .carousel__slide) { width: 100%; }
}
@media (min-width: 769px) and (max-width: 1024px) {
  :deep(.ofrecemos-carousel .carousel__slide) { width: calc(50% - 1rem); }
}
</style>
