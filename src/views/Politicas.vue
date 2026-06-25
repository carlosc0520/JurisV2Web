<template>
  <div class="flex flex-col min-h-screen bg-[#f1f5f9] dark:bg-gray-950">
    <navbar />

    <main class="flex-1">

      <!-- Hero -->
      <page-hero
        badge="Ley N° 29733 · Datos Personales"
        title="Políticas de"
        title-highlight="Privacidad"
        subtitle="Conoce cómo protegemos tus datos y garantizamos tu privacidad en cada interacción con nuestra plataforma."
        variant="indigo"
      >
        <template #icon>
          <svg class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 1 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </template>
      </page-hero>

      <!-- Content -->
      <div class="max-w-[1400px] mx-auto px-4 py-10 max-sm:py-8">
        <div class="grid grid-cols-[260px_1fr] max-lg:grid-cols-1 gap-8 items-start">

          <!-- Sidebar -->
          <aside class="relative">
            <div class="sticky top-[100px] max-lg:relative max-lg:top-0 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-700">
              <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">Navegación Rápida</h3>
              <nav class="flex flex-col max-lg:grid max-lg:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] max-sm:!grid-cols-1 gap-1.5">
                <a
                  v-for="item in navItems"
                  :key="item.href"
                  :href="item.href"
                  class="flex items-center justify-between px-3 py-2.5 rounded-xl text-[0.82rem] font-medium
                         text-gray-600 dark:text-gray-300 no-underline
                         hover:bg-indigo-50 hover:text-indigo-700
                         dark:hover:bg-indigo-900/20 dark:hover:text-indigo-300
                         transition-all duration-200"
                >
                  <span>{{ item.label }}</span>
                  <svg class="w-3.5 h-3.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                  </svg>
                </a>
              </nav>
            </div>
          </aside>

          <!-- Artículo -->
          <article class="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden border border-gray-100 dark:border-gray-700">
            <div class="p-8 max-sm:p-6 max-[480px]:p-4">

              <!-- Intro card -->
              <div class="bg-indigo-50/60 dark:bg-gray-900 p-5 rounded-xl border border-indigo-100 dark:border-gray-700 mb-8">
                <h2 class="text-[1.1rem] font-bold text-indigo-700 dark:text-indigo-300 mb-2.5">Información General</h2>
                <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-3">
                  De acuerdo con la <strong>Ley N° 29733</strong>, ley de protección de datos personales y su reglamento, te informamos sobre la Política de Privacidad empleada para la recolección y tratamiento de tus datos personales por parte de <span class="text-indigo-600 dark:text-indigo-300 font-semibold">JURIS SEARCH PENAL &amp; COMPLIANCE</span> (en adelante "Juris Search"), con domicilio legal ubicado en la Avenida Víctor Andrés Belaunde Nro. 370, San Isidro.
                </p>
                <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75]">
                  Al acceder a nuestro sitio web o suscribirse a nuestros servicios online acepta haber leído y prestado su consentimiento de forma informada, libre, previa, expresa e inequívoca. Asimismo, la política de privacidad de Juris Search puede actualizarse en cualquier momento en cuyo caso se le informará y se publicará la versión actualizada en el presente sitio web.
                </p>
              </div>

              <h3 id="starting" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Principios</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">Juris Search recolecta y procesa sus datos personales respetando los principios:</p>
              <ul class="flex flex-col gap-2.5 list-none m-0 p-0 mb-8">
                <li v-for="item in principios" :key="item.title"
                    class="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 px-5 flex items-start gap-3 transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 hover:shadow-sm">
                  <svg class="w-4 h-4 text-emerald-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <div class="flex-1 text-gray-600 dark:text-gray-300 leading-[1.7] text-[0.85rem]">
                    <span class="font-bold text-indigo-600 dark:text-indigo-300">{{ item.title }}:</span>
                    {{ item.desc }}
                  </div>
                </li>
              </ul>

              <h3 id="rights" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Derechos</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">
                Puede ejercer sus derechos de acceso, rectificación, oposición, cancelación (derechos "ARCO") sobre sus datos personales. Para su ejercicio, puede enviarnos un correo a <span class="text-indigo-600 dark:text-indigo-300 font-semibold">jsearch@ccfirma.com</span>.
              </p>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">
                Revisaremos su solicitud y le responderemos dentro del plazo legal (8 días hábiles ante el derecho de información, 20 días hábiles ante el derecho de acceso y 10 días hábiles para otros derechos, contándose desde el día siguiente de la presentación de su solicitud). En el correo debe incluir su nombre y apellidos completos, copia de DNI o firma digital para acreditar que es el titular de los datos personales. Asimismo, debe especificar su petición y el correo o domicilio donde desea que se le envié las comunicaciones.
              </p>

              <h3 id="info" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Datos Personales Recolectados y Tratados</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">
                Puede ejercer sus derechos de acceso, rectificación, oposición, cancelación (derechos "ARCO") sobre sus datos personales. Para su ejercicio, puede enviarnos un correo a <span class="text-indigo-600 dark:text-indigo-300 font-semibold">jsearch@ccfirma.com</span>.
              </p>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">
                Juris Search recolecta y trata sus datos personales a través de la información suministrada en nuestro sitio web. Dichos datos pueden incluir su nombre y apellidos, correo electrónico, dirección de domicilio, teléfono, negocio u ocupación, fecha de nacimiento, dirección IP, identificador único de dispositivo (UDID), sus opiniones en encuestas y las estadísticas que genera por el uso de nuestro buscador de jurisprudencia.
              </p>

              <h3 id="incharge" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Encargado de Tratamiento</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">Juris Search no terceriza el tratamiento de sus datos personales, siendo la propia empresa la encargada del tratamiento.</p>

              <h3 id="time" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Tiempo de almacenamiento</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">Juris Search almacena sus datos personales hasta el cumplimiento de los fines de su recolección y/o tratamiento, hasta que se cumplan los plazos exigidos por ley o en el momento en que, como titular de los datos personales, solicite su eliminación.</p>

              <h3 id="purpose" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Finalidad</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">Juris Search recolecta y trata sus datos personales para el cumplimiento de los siguientes fines:</p>
              <ul class="flex flex-col gap-2.5 list-none m-0 p-0 mb-8">
                <li v-for="item in finalidades" :key="item.title"
                    class="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 px-5 flex items-start gap-3 transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 hover:shadow-sm">
                  <svg class="w-4 h-4 text-emerald-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <div class="flex-1 text-gray-600 dark:text-gray-300 leading-[1.7] text-[0.85rem]">
                    <span class="font-bold text-indigo-600 dark:text-indigo-300">{{ item.title }}:</span>
                    {{ item.desc }}
                  </div>
                </li>
              </ul>

              <h3 id="storage" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Almacenamiento</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">Juris Search almacena la información de sus usuarios en nuestros propios servidores ubicados en Lima, Perú.</p>

              <h3 id="transfer" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Transferencia a terceras partes y flujo transfronterizo</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">Juris Search se encuentra comprometido con su privacidad. Solo comparte información en caso sea solicitado por (i) las autoridades competentes en cumplimiento de sus funciones y (ii) bajo requerimiento judicial. Asimismo, precisamos que su información personal no es objeto de transferencia a nivel internacional (flujo transfronterizo).</p>

              <h3 id="security" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Seguridad</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">Juris Search cuenta con medidas de seguridad para garantizar la protección de sus datos personales y que estos no sean alterados, perdidos, accedidos o procesados de forma no autorizada.</p>

              <h3 id="cookies" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Cookies</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">Una cookie es un archivo que se envía su ordenador, celular o tablet al navegador web para almacenar información sobre tu navegación. Nuestro sitio web usa cookies para recolectar información sobre su interacción en el sitio web a fin de mejorar su y analizar las visitas a la web. Para más información, revise</p>

              <h3 id="age" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Menores de Edad</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75] mb-4">El sitio web de Juris Search no está diseñado ni dirigido a menores de 18 años. En caso se recolecten los datos de menores de edad sin autorización, se adoptarán las medidas adecuadas para eliminar dichos datos tan pronto como sea posible.</p>

              <h3 id="link" class="text-[1.1rem] font-bold text-indigo-600 dark:text-gray-100 mb-4 pt-5 border-t border-gray-100 dark:border-gray-700 [scroll-margin-top:100px]">Enlaces a otros sitios web</h3>
              <p class="text-gray-600 dark:text-gray-300 text-[0.85rem] leading-[1.75]">Este sitio web puede contener enlaces a otros sitios web. Cuando usted hace click en dichos enlaces y abandona nuestra web no nos hacemos responsables de las condiciones de privacidad ni de la protección de sus datos en otros sitios.</p>

            </div>
          </article>
        </div>
      </div>

      <!-- CTA -->
      <div class="max-w-[1400px] mx-auto px-4 pb-12 max-sm:pb-8">
        <div class="cta-gradient-bg rounded-2xl px-8 py-12 max-sm:px-6 max-sm:py-9 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div class="cta-orb-1 hidden sm:block"/>
          <div class="cta-orb-2 hidden sm:block"/>
          <div class="cta-orb-3 hidden sm:block"/>
          <div class="relative z-10 max-w-[600px] mx-auto">
            <h2 class="text-2xl max-sm:text-xl font-extrabold text-white mb-2">¿Tienes alguna consulta?</h2>
            <p class="text-sm text-white/70 mb-6 leading-relaxed">Contáctanos y resolveremos tus dudas sobre privacidad y datos personales.</p>
            <router-link to="/contacto"
              class="group inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold
                     px-8 py-3 rounded-xl text-sm no-underline shadow-lg
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              Contáctanos
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>

    </main>
    <footer-component />
  </div>
</template>

<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import PageHero from "@/components/Shared/PageHero.vue";

export default {
  components: { Navbar, FooterComponent, PageHero },
  data() {
    return {
      navItems: [
        { href: '#starting', label: 'Principios' },
        { href: '#rights',   label: 'Derechos' },
        { href: '#info',     label: 'Datos Personales Recolectados' },
        { href: '#incharge', label: 'Encargado de Tratamiento' },
        { href: '#time',     label: 'Tiempo de almacenamiento' },
        { href: '#purpose',  label: 'Finalidad' },
        { href: '#storage',  label: 'Almacenamiento' },
        { href: '#transfer', label: 'Transferencia a terceras partes' },
        { href: '#security', label: 'Seguridad' },
        { href: '#cookies',  label: 'Cookies' },
        { href: '#age',      label: 'Menores de Edad' },
        { href: '#link',     label: 'Enlaces a otros sitios web' },
      ],
      principios: [
        { title: 'Consentimiento',    desc: 'Previamente a la recolección y tratamiento de los datos, siempre solicitamos el consentimiento del titular de los datos personales.' },
        { title: 'Finalidad',         desc: 'La recopilación y tratamiento de los datos personales siguen una finalidad explícita, determinada y lícita.' },
        { title: 'Proporcionalidad',  desc: 'La recolección y tratamiento de los datos personales es razonable y no excesiva.' },
        { title: 'Calidad',           desc: 'Los datos personales deben de ser, en la medida de lo posible, exactos, veraces y actualizados.' },
        { title: 'Seguridad',         desc: 'Se garantizará la seguridad de los datos personales, evitando el acceso no autorizado.' },
        { title: 'Legalidad',         desc: 'Rechazamos la obtención fraudulenta o ilícita de los datos personales.' },
      ],
      finalidades: [
        { title: 'Comercial',            desc: 'A fin de interactuar y perfilar a potenciales clientes o administrar la relación con clientes establecidos.' },
        { title: 'Marketing',            desc: 'A fin de realizar investigaciones de mercado, hábitos de consumo, análisis estadístico y satisfacción de clientes mediante encuestas.' },
        { title: 'Eficiencia del sitio', desc: 'A fin de hacer su uso más intuitivo y responsivo. Analizar el uso que los usuarios dan a nuestro sitio web.' },
      ],
    };
  },
};
</script>
