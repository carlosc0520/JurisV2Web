<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Planes y Suscripción" subtitle="Elige el plan perfecto para tus necesidades legales">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <button @click="updateActive('planes')"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
            active==='planes' ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue' : 'text-gray-500 hover:text-brand-blue hover:bg-gray-50 dark:hover:bg-gray-800']">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Planes
        </button>
        <button :disabled="!planSelected"
          @click="planSelected ? (active = 'facturacion') : null"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
            active==='facturacion' ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue' : 'text-gray-500 hover:text-brand-blue hover:bg-gray-50 dark:hover:bg-gray-800',
            !planSelected ? 'opacity-50 cursor-not-allowed' : '']">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Pago Seguro
        </button>
        <button @click="updateActive('pagos')"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
            active==='pagos' ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue' : 'text-gray-500 hover:text-brand-blue hover:bg-gray-50 dark:hover:bg-gray-800']">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
          </svg>
          Facturación
        </button>
      </div>

      <!-- PLANES -->
      <div v-if="active === 'planes'" class="animate-fade-up">

        <!-- Banner plan activo -->
        <div v-if="suscripcion"
          class="mb-6 flex flex-wrap items-center gap-4 justify-between bg-white dark:bg-gray-900 rounded-2xl border-2 border-brand-blue p-5 shadow-soft">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
              <svg class="text-brand-blue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-400 dark:text-gray-500">Suscripción activa</p>
              <p class="font-bold text-gray-900 dark:text-gray-100">{{ capitalizeFirst(suscripcion.planNombre) }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex flex-col">
              <span class="text-xs text-gray-400">Inicio</span>
              <span class="font-semibold text-gray-700 dark:text-gray-300">{{ formatDate(suscripcion.fInicio) }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-gray-400">Vencimiento</span>
              <span class="font-semibold text-gray-700 dark:text-gray-300">{{ formatDate(suscripcion.fFin) }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-xs text-gray-400">Días restantes</span>
              <span :class="['font-extrabold text-2xl leading-tight',
                suscripcion.diasRestantes > 30 ? 'text-emerald-500' :
                suscripcion.diasRestantes > 10 ? 'text-amber-500' : 'text-red-500']">
                {{ suscripcion.diasRestantes }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="plan in planes" :key="plan.ID"
            :class="['bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-soft border-2 transition-all',
              plan?.ACTUAL === 1 ? 'border-brand-blue shadow-[0_0_0_2px_rgba(24,92,230,0.15)]' :
              plan?.PRINCIPAL ? 'border-brand-pink shadow-brand' : 'border-gray-100 dark:border-gray-800']">

            <div :class="['flex items-center gap-2 px-5 py-3 border-b font-semibold text-sm',
              plan?.PRINCIPAL
                ? 'bg-gradient-to-r from-brand-pink to-brand-blue text-white border-0'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300']">
              <img v-if="plan?.PRINCIPAL" :src="corona" alt="corona" class="w-5 h-5 object-contain" />
              <span>{{ capitalizeFirst(plan?.DESCRIPCION) }}</span>
            </div>

            <div class="p-6">
              <div class="mb-4">
                <div class="flex items-end gap-1">
                  <span class="text-xl font-bold text-gray-500 mb-1">S/</span>
                  <span class="text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-none">{{ plan?.PRECIO || "" }}</span>
                  <span class="text-sm text-gray-400 mb-1">/ {{ plan.PERIODO || "" }}</span>
                </div>
              </div>

              <!-- Fechas si es el plan actual -->
              <div v-if="plan?.ACTUAL === 1 && plan.FFIN"
                class="mb-4 flex flex-wrap gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 text-xs">
                <span class="text-blue-600 dark:text-blue-400">
                  Vence: <strong>{{ formatDate(plan.FFIN) }}</strong>
                </span>
              </div>

              <button @click="plan?.ACTUAL === 1 ? null : toUpdatePlan(plan)"
                :disabled="plan?.ACTUAL === 1"
                :class="['btn w-full mb-5 gap-2', plan?.ACTUAL === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-primary']">
                <svg v-if="plan?.ACTUAL === 1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ plan?.ACTUAL === 1 ? "Tu Plan Actual" : "Cambiar Plan" }}
              </button>

              <ul class="flex flex-col gap-3 list-none p-0">
                <li v-for="restriccion in plan.DETALLE.RESTRICIONES" :key="restriccion"
                  class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg class="flex-shrink-0 mt-0.5 text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>{{ restriccion }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- PAGO SEGURO -->
      <div v-if="active === 'facturacion'" class="animate-fade-up">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          <!-- Columna principal -->
          <div class="card p-5">

            <!-- Cabecera con volver -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                  <svg class="text-brand-blue" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <h2 class="text-base font-bold text-gray-900 dark:text-gray-100">Pago Seguro</h2>
              </div>
              <button @click="active = 'planes'; planSelected = null"
                class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-blue transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Volver
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">

              <!-- Resumen del plan destacado -->
              <div class="rounded-xl overflow-hidden border border-brand-blue/20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div class="px-4 py-2 bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center gap-2">
                  <svg class="text-brand-blue" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-xs font-semibold text-brand-blue uppercase tracking-wide">Plan seleccionado</span>
                </div>
                <div class="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="font-bold text-gray-900 dark:text-gray-100">{{ planSelected?.DESCRIPCION }}</p>
                    <p class="text-sm text-gray-500 mt-0.5">Duración: {{ planSelected?.PERIODO }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-400">Total a pagar</p>
                    <p class="text-2xl font-extrabold text-brand-blue">S/ {{ planSelected?.PRECIO }}</p>
                  </div>
                </div>
                <div class="px-4 py-2 border-t border-brand-blue/10 flex items-center gap-3">
                  <span class="text-xs text-gray-400">Acepta:</span>
                  <img src="@/assets/img/pagos/visa.png" alt="visa" class="h-6 object-contain" />
                  <img src="@/assets/img/pagos/master.png" alt="mastercard" class="h-6 object-contain" />
                  <img src="@/assets/img/pagos/yape.png" alt="yape" class="h-6 object-contain" />
                </div>
              </div>

              <!-- Datos del titular -->
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <svg class="text-brand-blue" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Datos del Titular</h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <BaseInput
                    v-model="model.NOMBRES"
                    label="Nombres"
                    placeholder="Ingresa tus nombres"
                    :required="true"
                    :error="validation.hasError('model.NOMBRES') ? validation.firstError('model.NOMBRES') : ''"
                    maxlength="100"
                  />

                  <BaseInput
                    v-model="model.APELLIDOS"
                    label="Apellidos"
                    placeholder="Ingresa tus apellidos"
                    :required="true"
                    :error="validation.hasError('model.APELLIDOS') ? validation.firstError('model.APELLIDOS') : ''"
                    maxlength="100"
                  />

                  <div class="sm:col-span-2">
                    <BaseInput
                      v-model="model.CORREO"
                      type="email"
                      label="Correo Electrónico"
                      placeholder="correo@ejemplo.com"
                      :required="true"
                      :error="validation.hasError('model.CORREO') ? validation.firstError('model.CORREO') : ''"
                      maxlength="100"
                      autocomplete="email"
                    />
                  </div>

                  <BaseInput
                    v-model="model.TELEFONO"
                    type="tel"
                    label="Teléfono"
                    placeholder="987654321"
                    :required="true"
                    :error="validation.hasError('model.TELEFONO') ? validation.firstError('model.TELEFONO') : ''"
                    maxlength="15"
                    @input="model.TELEFONO = model.TELEFONO?.replace(/[^0-9]/g, '')"
                  />

                  <BaseInput
                    v-model="model.DNI"
                    label="DNI"
                    placeholder="12345678"
                    :required="true"
                    :error="validation.hasError('model.DNI') ? validation.firstError('model.DNI') : ''"
                    maxlength="8"
                    @input="model.DNI = model.DNI?.replace(/[^0-9]/g, '')"
                  />
                </div>
              </div>

              <!-- Términos y condiciones -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700">
                <input id="terms" v-model="acceptedTerms" type="checkbox"
                  class="mt-0.5 w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue cursor-pointer shrink-0" />
                <label for="terms" class="text-sm text-gray-500 dark:text-gray-400 cursor-pointer leading-relaxed">
                  He leído y acepto los
                  <a href="#" class="text-brand-blue hover:underline font-medium">Términos y Condiciones</a>
                  y la
                  <a href="#" class="text-brand-blue hover:underline font-medium">Política de Privacidad</a>
                  de JurisSearch.
                </label>
              </div>

              <!-- Botón submit -->
              <BaseButton type="submit" variant="primary" :loading="culqi.loading" :disabled="!acceptedTerms" :block="true" size="lg">
                <template #icon-left>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </template>
                {{ culqi.loading ? 'Procesando...' : 'Generar Orden de Pago' }}
              </BaseButton>

            </form>
          </div>

          <!-- Sidebar otros medios -->
          <div class="sticky top-5 self-start flex flex-col gap-4">

            <!-- Resumen lateral -->
            <div class="card p-5">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Otros Medios de Pago</p>
              <div class="grid grid-cols-2 gap-2 mb-4">
                <img src="@/assets/img/pagos/yape.png" alt="yape" class="w-full h-14 object-contain bg-gray-50 dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700"/>
                <img src="@/assets/img/pagos/plin.png" alt="plin" class="w-full h-14 object-contain bg-gray-50 dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700"/>
                <img src="@/assets/img/pagos/bcp.png" alt="bcp" class="w-full h-14 object-contain bg-gray-50 dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700"/>
                <img src="@/assets/img/pagos/interbank.png" alt="interbank" class="w-full h-14 object-contain bg-gray-50 dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700"/>
              </div>
              <p class="text-xs text-gray-400 leading-relaxed">Pago vía billetera digital o transferencia bancaria coordinando con un asesor.</p>
            </div>

            <!-- Asesor — deshabilitado a pedido, dejar para mas adelante:
            <a href="https://wa.me/51949345646?text=Hola%2C%20estoy%20interesado%20en%20adquirir%20un%20plan%20para%20JurisSearch.%20%C2%BFPodr%C3%ADas%20brindarme%20m%C3%A1s%20informaci%C3%B3n%2C%20por%20favor%3F"
              target="_blank"
              class="card p-4 flex items-center gap-3 hover:border-green-200 dark:hover:border-green-700 hover:shadow-md transition-all">
              <img src="@/assets/img/pagos/asesor.png" alt="asesor" class="w-11 h-11 rounded-full object-cover shrink-0"/>
              <div>
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">Hablar con un asesor</p>
                <p class="text-xs text-green-600 dark:text-green-400">Disponible por WhatsApp</p>
              </div>
              <svg class="ml-auto text-gray-300 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
            -->

          </div>

        </div>
      </div>

      <!-- FACTURACIÓN (historial) -->
      <div v-if="active === 'pagos'" class="animate-fade-up">

        <!-- Plan activo en facturación -->
        <div v-if="suscripcion" class="mb-4 flex flex-wrap items-center gap-4 justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-soft">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
              <svg class="text-brand-blue" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-400">Plan actual</p>
              <p class="font-semibold text-gray-800 dark:text-gray-200">{{ capitalizeFirst(suscripcion.planNombre) }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-4 text-sm">
            <div class="flex flex-col">
              <span class="text-xs text-gray-400">Inicio</span>
              <span class="font-medium text-gray-700 dark:text-gray-300">{{ formatDate(suscripcion.fInicio) }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-gray-400">Vencimiento</span>
              <span class="font-medium text-gray-700 dark:text-gray-300">{{ formatDate(suscripcion.fFin) }}</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-xs text-gray-400">Días restantes</span>
              <span :class="['font-bold text-lg leading-none',
                suscripcion.diasRestantes > 30 ? 'text-emerald-500' :
                suscripcion.diasRestantes > 10 ? 'text-amber-500' : 'text-red-500']">
                {{ suscripcion.diasRestantes }}
              </span>
            </div>
          </div>
        </div>

        <SectionCard class="mb-4">
          <div class="flex gap-4 items-end flex-wrap">
            <div class="flex flex-col gap-1.5 flex-1 min-w-[180px]">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Filtrar por fecha</label>
              <div class="relative flex items-center">
                <date-picker v-model="facturacion.FCRCN" :value="facturacion.FCRCN"
                  valueType="format" class="input-base pl-10 w-full"
                  placeholder="Selecciona una fecha"
                  :disabledDate="time => time.getTime() > Date.now()"
                  @change="(date) => facturacion.FCRCN = date"/>
              </div>
            </div>
            <BaseButton variant="primary" @click="getFacturaciones">
              <template #icon-left>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </template>
              Buscar
            </BaseButton>
            <BaseButton v-if="facturacion.FCRCN" variant="ghost" @click="facturacion.FCRCN = null; getFacturaciones()">
              <template #icon-left>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </template>
              Limpiar
            </BaseButton>
          </div>
        </SectionCard>

        <data-table :active="active" :search="getFacturaciones"
          :fields="facturacion.fields" :items="facturacion.grid.items"
          :grid="facturacion.grid" :actions="facturacion.actions"/>

      </div>

    </div>
  </section>
</template>

<script>
/* global Culqi */
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth.store';
import MantenimientoProxy from "@/proxies/MantenimientoProxy.js";
import { Validator } from 'simple-vue-validator';
import corona from "@/assets/img/resources/Corona.png";
import SubscriptionProxy from '@/proxies/SubscriptionProxy.js';
import DataTable from "@/components/Tables/DataTable.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import pdfMake from 'pdfmake/build/pdfmake';
import timesNewRoman from "@/assets/times.js";
import timesNewRomanBold from "@/assets/timesBold.js";
import timesNewRomanItalics from "@/assets/timesItalics.js";
import recursos from "@/views/admin/recursos.js";

pdfMake.vfs = {
    'TimesNewRoman.ttf': timesNewRoman,
    'Roboto-Medium.ttf': timesNewRomanBold,
    'Roboto-Regular.ttf': timesNewRoman,
    'Roboto-Italics.ttf': timesNewRomanItalics,
};
pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italics.ttf',
        bolditalics: 'Roboto-Medium.ttf',
    },
};
import moment from 'moment';

export default {
    name: "planes",
    components: { DataTable, BaseInput, BaseButton, SectionCard, PageHeader },
    data() {
        return {
            culqi: {
                loading: false,
            },
            acceptedTerms: false,
            suscripcion: null,
            facturacion: {
                FCRCN: null,
                actions: {
                    download: { label: 'Descargar factura', action: null },
                },
                fields: [
                    { key: "planDisplay",   label: "Plan" },
                    { key: "totalDisplay",  label: "Total" },
                    { key: "medioDisplay",  label: "Medio de Pago" },
                    { key: "fechaDisplay",  label: "Fecha de Pago" },
                    { key: "estadoDisplay", label: "Estado" },
                ],
                grid: {
                    items: [],
                    currentPage: 1,
                    perPage: 10,
                    totalRows: 0,
                    isLoading: false,
                    pageOptions: [5, 10, 20, 50],
                },
            },
            active: "planes",
            planes: [],
            model: {
                NOMBRES: null,
                APELLIDOS: null,
                CORREO: null,
                TELEFONO: null,
                DNI: null,
            },
            planSelected: null,
            corona,
            planesSuggets: {
                "1": {
                    RESTRICIONES: [
                        "Acceso a filtros de búsqueda especializada.",
                        "Visualiza resoluciones completas.",
                        "Descarga 1 resolución por día.",
                        "Prueba gratuita de 30 días con opción a upgrade.",
                    ],
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
                },
                "3": {
                    RESTRICIONES: [
                        "Todo lo del Plan Premium.",
                        "Presenta tu correo institucional o constancia de matrícula.",
                        "Accede a recursos para prácticas preprofesionales, tesis y exámenes",
                        "Invitaciones a webinars y/o eventos.",
                    ],
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
                },
            },
        };
    },
    validators: {
        'model.NOMBRES': function (value) {
            return Validator.value(value)
                .required('Campo requerido')
                .maxLength(100, 'Máximo 100 caracteres')
                .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras');
        },
        'model.APELLIDOS': function (value) {
            return Validator.value(value)
                .required('Campo requerido')
                .maxLength(100, 'Máximo 100 caracteres')
                .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras');
        },
        'model.CORREO': function (value) {
            return Validator.value(value)
                .required('Campo requerido')
                .email('Correo electrónico inválido');
        },
        'model.TELEFONO': function (value) {
            return Validator.value(value)
                .required('Campo requerido')
                .regex(/^\d{9}$/, 'Debe tener exactamente 9 dígitos numéricos');
        },
        'model.DNI': function (value) {
            return Validator.value(value)
                .required('Campo requerido')
                .regex(/^\d{8}$/, 'Debe tener exactamente 8 dígitos numéricos');
        },
    },
    methods: {
        formatDate(val) {
            if (!val) return '-';
            const datePart = String(val).substring(0, 10);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return '-';
            const d = new Date(datePart + 'T12:00:00');
            if (isNaN(d)) return '-';
            return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
        },

        capitalizeFirst(text) {
            if (!text) return '';
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        },

        async handleSubmit() {
            const valid = await this.$validate();
            if (!valid) return;

            if (!this.acceptedTerms) {
                toast.warning('Debes aceptar los términos y condiciones', { toastId: 'terms' });
                return;
            }

            const CULQI_PUBLIC_KEY = 'pk_test_xn4SkqpCLsx62ZOL';
            const amountNumber = Number(this.planSelected?.PRECIO);

            if (isNaN(amountNumber) || amountNumber <= 0) {
                toast.error('Monto del plan no válido', { toastId: 'amount' });
                return;
            }

            this.culqi.loading = true;
            const loadingToast = toast.loading('Generando orden de pago...', { timeout: false, closeOnClick: false });

            try {
                const r = await SubscriptionProxy.create({
                    amount: amountNumber,
                    description: this.planSelected.DESCRIPCION,
                    email: this.model.CORREO,
                    nombres: this.model.NOMBRES,
                    apellidos: this.model.APELLIDOS,
                    telefono: this.model.TELEFONO,
                    dni: this.model.DNI,
                    id_plan: this.planSelected.ID,
                });

                toast.remove(loadingToast);

                const orderResult = r?.DATA ?? r;

                if (!orderResult?.success) {
                    toast.error(orderResult?.message || 'Error al crear la orden de pago.', { toastId: 'order-err' });
                    this.culqi.loading = false;
                    return;
                }

                Culqi.publicKey = CULQI_PUBLIC_KEY;
                Culqi.settings({
                    title: 'JURIS SEARCH',
                    currency: 'PEN',
                    description: this.planSelected.DESCRIPCION,
                    amount: amountNumber * 100,
                    order: orderResult.data?.id,
                    logo: `${process.env.VUE_APP_SITE_URL || 'https://jurissearch.com'}/img/logo-full.e849dab8.png`,
                    paymentMethods: { tarjeta: true, yape: true },
                    style: { maincolor: '#0052cc', buttontext: '#ffffff', maintext: '#4A4A4A', desctext: '#4A4A4A' },
                    options: { lang: 'es', paymentMethodsOrder: ['yape', 'tarjeta'] },
                });

                Culqi.open();
                this.culqi.loading = false;

                window.culqi = async () => {
                    if (Culqi.token) {
                        const token = Culqi.token.id;
                        try {
                            const cr = await SubscriptionProxy.chargeWithToken({
                                token,
                                order_id: orderResult.data?.id,
                                email: this.model.CORREO,
                                amount: amountNumber,
                                id_plan: this.planSelected.ID,
                                tipo: token,
                                nombres: this.model.NOMBRES,
                                apellidos: this.model.APELLIDOS,
                                dni: this.model.DNI,
                            });

                            Culqi.close();
                            const chargeResult = cr?.DATA ?? cr;

                            if (token.startsWith('ype_')) {
                                if (chargeResult?.success) {
                                    this.$swal({
                                        title: chargeResult?.data?.outcome?.user_message || 'Pago con Yape exitoso',
                                        text: chargeResult?.data?.outcome?.merchant_message || 'Tu pago con Yape ha sido procesado.',
                                        icon: 'success',
                                        confirmButtonText: 'Aceptar',
                                    }).then(async () => {
                                        await useAuthStore().refreshAccessToken().catch(() => {});
                                        this.active = 'planes';
                                        this.getSuscripcion();
                                    });
                                } else {
                                    this.$swal({
                                        title: 'Error en el pago con Yape',
                                        text: chargeResult?.message || 'Ocurrió un error al procesar el pago.',
                                        icon: 'error',
                                        confirmButtonText: 'Aceptar',
                                    });
                                }
                            } else if (token.startsWith('tkn_')) {
                                if (!chargeResult?.success) {
                                    this.$swal({
                                        title: chargeResult?.title === 'operacion_denegada' ? 'Operación denegada' : 'Pago rechazado',
                                        text: chargeResult?.message || 'El pago fue rechazado. Intenta con otra tarjeta.',
                                        icon: 'error',
                                        confirmButtonText: 'Aceptar',
                                    });
                                    return;
                                }
                                this.$swal({
                                    title: chargeResult?.data?.outcome?.user_message || 'Pago exitoso',
                                    text: chargeResult?.data?.outcome?.merchant_message || '',
                                    icon: 'success',
                                    confirmButtonText: 'Aceptar',
                                }).then(async () => {
                                    await useAuthStore().refreshAccessToken().catch(() => {});
                                    this.active = 'planes';
                                    this.getSuscripcion();
                                });
                            }
                        } catch (err) {
                            Culqi.close();
                            this.$swal({
                                title: 'Error en el pago',
                                text: `${err?.merchant_message || ''} ${err?.user_message || ''}`.trim() || 'Ocurrió un error al procesar el pago.',
                                icon: 'error',
                                confirmButtonText: 'Aceptar',
                            });
                        } finally {
                            this.culqi.loading = false;
                        }
                    } else {
                        Culqi.close();
                        this.$swal({
                            title: 'Pago cancelado',
                            text: 'Has cerrado el formulario sin completar el pago.',
                            icon: 'info',
                            confirmButtonText: 'Aceptar',
                        });
                        this.culqi.loading = false;
                    }
                };
            } catch (error) {
                toast.remove(loadingToast);
                toast.error(error?.message || 'Ocurrió un error al procesar la suscripción.', { toastId: 'sub-err' });
                this.culqi.loading = false;
            }
        },

        toUpdatePlan(plan) {
            if (!plan?.ID) {
                toast.error('Plan no válido', { toastId: 'plan-err' });
                return;
            }
            this.planSelected = plan;
            this.active = 'facturacion';
        },

        updateActive(tab) {
            this.active = tab;
        },

        async getSuscripcion() {
            try {
                const r = await SubscriptionProxy.getSubscription();
                this.suscripcion = r?.DATA ?? null;
            } catch {
                this.suscripcion = null;
            }
        },

        async getPlanes() {
            try {
                const r = await MantenimientoProxy.listPlanUser({ ROWS: 1000, INIT: 0, DESC: null });
                const raw = Array.isArray(r) ? r : (Array.isArray(r?.DATA) ? r.DATA : []);
                const items = raw.map((item) => {
                    item.PRECIO = Number(item.PRECIO).toFixed(2);
                    item.TIEMPO = Number((item.TIEMPO / 30).toFixed(0));
                    item.DETALLE = this.planesSuggets?.[item.VALOR] || { RESTRICIONES: [] };
                    item.PERIODO = item.TIEMPO + (item.TIEMPO <= 1 ? ' mes' : ' meses');
                    return item;
                });

                const principalIndex = items.findIndex(i => i.PRINCIPAL);
                if (principalIndex !== -1 && principalIndex < items.length - 1) {
                    const principalItem = items.splice(principalIndex, 1)[0];
                    items.splice(items.length - 1, 0, principalItem);
                }

                this.planes = items;
            } catch (error) {
                toast.error(error?.message || 'Error al obtener los planes', { toastId: 'planes-err' });
            }
        },

        async getFacturaciones() {
            this.facturacion.grid.isLoading = true;
            try {
                const r = await SubscriptionProxy.payment_list({
                    page: this.facturacion.grid.currentPage,
                    limit: this.facturacion.grid.perPage,
                    FCRCN: this.facturacion.FCRCN || undefined,
                });

                const payload = r?.data ?? {};
                const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
                const total = payload?.data?.totalRows ?? 0;

                this.facturacion.grid.items = rows.map(item => ({
                    ...item,
                    planDisplay:   item.dPlan || '-',
                    totalDisplay:  'S/ ' + Number(item.monto || 0).toFixed(2),
                    medioDisplay:  this.formatMedio(item.tipo),
                    fechaDisplay:  item.fcrcn ? moment(item.fcrcn).format('DD/MM/YYYY, h:mm a') : '-',
                    estadoDisplay: 'Pagado',
                }));
                this.facturacion.grid.totalRows = total;
            } catch (error) {
                this.facturacion.grid.items = [];
                this.facturacion.grid.totalRows = 0;
                console.error('Error al obtener facturaciones:', error);
            } finally {
                this.facturacion.grid.isLoading = false;
            }
        },

        formatMedio(tipo) {
            const map = {
                YAPE: 'Yape',
                TARJETA: 'Tarjeta',
                PLIN: 'Plin',
                TRANSFERENCIA: 'Transferencia',
            };
            return map[tipo] || tipo || '-';
        },

        generateInvoice(item) {
            const loadId = toast.loading('Generando factura...', { timeout: false, closeOnClick: false });
            try {
                const fecha = item.fcrcn ? moment(item.fcrcn).format('DD/MM/YYYY, h:mm a') : '-';
                const nro = String(item.id || '').padStart(6, '0');
                const monto = `S/ ${Number(item.monto || 0).toFixed(2)}`;

                const docDefinition = {
                    pageSize: 'A4',
                    pageMargins: [40, 40, 40, 72],
                    footer: () => ({
                        margin: [40, 8, 40, 0],
                        stack: [
                            {
                                canvas: [
                                    { type: 'rect', x: 0, y: 0, w: 257, h: 3, color: '#e71fb3' },
                                    { type: 'rect', x: 259, y: 0, w: 256, h: 3, color: '#1864ff' },
                                ],
                            },
                            {
                                text: 'JurisSearch — Plataforma de Jurisprudencia Legal  ·  www.jurissearch.com',
                                alignment: 'center',
                                fontSize: 8,
                                color: '#9ca3af',
                                margin: [0, 5, 0, 0],
                            },
                        ],
                    }),
                    content: [
                        // Barra de gradiente superior
                        {
                            canvas: [
                                { type: 'rect', x: 0, y: 0, w: 257, h: 6, color: '#e71fb3' },
                                { type: 'rect', x: 259, y: 0, w: 256, h: 6, color: '#1864ff' },
                            ],
                            margin: [0, 0, 0, 18],
                        },
                        // Logo + datos de factura
                        {
                            columns: [
                                {
                                    stack: [
                                        { image: recursos.nuevoLogoJuris, width: 80, margin: [0, 0, 0, 4] },
                                        { text: 'Plataforma de Jurisprudencia Legal', style: 'brandSub' },
                                        { text: 'www.jurissearch.com', style: 'brandSub' },
                                    ],
                                    width: '*',
                                },
                                {
                                    stack: [
                                        { text: 'COMPROBANTE DE PAGO', style: 'invoiceTitle', alignment: 'right' },
                                        {
                                            canvas: [{ type: 'rect', x: 0, y: 0, w: 190, h: 2, color: '#e71fb3' }],
                                            margin: [0, 5, 0, 7],
                                        },
                                        { text: `N°  ${nro}`, style: 'invoiceNro', alignment: 'right' },
                                        { text: `Fecha:  ${fecha}`, style: 'meta', alignment: 'right' },
                                        { text: '● PAGADO', style: 'paidBadge', alignment: 'right', margin: [0, 9, 0, 0] },
                                    ],
                                    width: 200,
                                },
                            ],
                            margin: [0, 0, 0, 16],
                        },
                        // Separador gradiente
                        {
                            canvas: [
                                { type: 'rect', x: 0, y: 0, w: 257, h: 1.5, color: '#e71fb3' },
                                { type: 'rect', x: 259, y: 0, w: 256, h: 1.5, color: '#1864ff' },
                            ],
                            margin: [0, 0, 0, 22],
                        },
                        // Datos del cliente
                        {
                            columns: [
                                { canvas: [{ type: 'rect', x: 0, y: 2, w: 3, h: 13, color: '#e71fb3', r: 1 }], width: 12 },
                                { text: 'DATOS DEL CLIENTE', style: 'sectionHeader', width: '*' },
                            ],
                            margin: [0, 0, 0, 8],
                        },
                        {
                            table: {
                                widths: [115, '*'],
                                body: [
                                    [
                                        { text: 'Nombre completo', style: 'label' },
                                        { text: `${item.nombres || ''} ${item.apellidos || ''}`.trim() || '-', style: 'value' },
                                    ],
                                    [
                                        { text: 'Correo electrónico', style: 'label' },
                                        { text: item.correo || '-', style: 'value' },
                                    ],
                                    [
                                        { text: 'DNI / Documento', style: 'label' },
                                        { text: item.dni || '-', style: 'value' },
                                    ],
                                ],
                            },
                            layout: {
                                hLineColor: () => '#f3f4f6',
                                vLineColor: () => 'transparent',
                                hLineWidth: () => 0.5,
                                vLineWidth: () => 0,
                            },
                            margin: [0, 0, 0, 22],
                        },
                        // Detalle del servicio
                        {
                            columns: [
                                { canvas: [{ type: 'rect', x: 0, y: 2, w: 3, h: 13, color: '#1864ff', r: 1 }], width: 12 },
                                { text: 'DETALLE DEL SERVICIO', style: 'sectionHeader', width: '*' },
                            ],
                            margin: [0, 0, 0, 8],
                        },
                        {
                            table: {
                                headerRows: 1,
                                widths: ['*', 75, 90, 80],
                                body: [
                                    [
                                        { text: 'Descripción', style: 'tableHeader' },
                                        { text: 'Duración', style: 'tableHeader', alignment: 'center' },
                                        { text: 'Medio de pago', style: 'tableHeader', alignment: 'center' },
                                        { text: 'Importe', style: 'tableHeader', alignment: 'right' },
                                    ],
                                    [
                                        { text: item.dPlan || '-', style: 'tableCell' },
                                        { text: `${item.meses || 1} mes(es)`, style: 'tableCell', alignment: 'center' },
                                        { text: this.formatMedio(item.tipo), style: 'tableCell', alignment: 'center' },
                                        { text: monto, style: 'tableCell', alignment: 'right' },
                                    ],
                                ],
                            },
                            layout: {
                                fillColor: (i) => i === 0 ? '#1864ff' : (i % 2 !== 0 ? '#f5f8ff' : null),
                                hLineColor: (i, node) => (i === 0 || i === node.table.body.length) ? '#1864ff' : '#e5e7eb',
                                vLineColor: () => '#e5e7eb',
                                hLineWidth: () => 0.5,
                                vLineWidth: () => 0.5,
                            },
                            margin: [0, 0, 0, 18],
                        },
                        // Total
                        {
                            columns: [
                                { text: '', width: '*' },
                                {
                                    table: {
                                        widths: [130, 90],
                                        body: [
                                            [
                                                { text: 'Subtotal:', style: 'totalRowLabel' },
                                                { text: monto, style: 'totalRowValue', alignment: 'right' },
                                            ],
                                            [
                                                { text: 'IGV (18%):', style: 'totalRowLabel' },
                                                { text: 'Incluido', style: 'totalRowValue', alignment: 'right' },
                                            ],
                                            [
                                                { text: 'TOTAL PAGADO', style: 'totalFinalLabel', fillColor: '#1864ff', color: '#ffffff' },
                                                { text: monto, style: 'totalFinalValue', fillColor: '#1864ff', color: '#ffffff', alignment: 'right' },
                                            ],
                                        ],
                                    },
                                    layout: {
                                        hLineColor: () => '#e5e7eb',
                                        vLineColor: () => 'transparent',
                                        hLineWidth: () => 0.5,
                                        vLineWidth: () => 0,
                                    },
                                },
                            ],
                            margin: [0, 0, 0, 28],
                        },
                        // Confirmación
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 0, 0, 14] },
                        {
                            columns: [
                                {
                                    canvas: [{ type: 'ellipse', x: 8, y: 8, r1: 8, r2: 8, color: '#059669' }],
                                    width: 24,
                                    margin: [0, -2, 0, 0],
                                },
                                {
                                    stack: [
                                        { text: 'Pago procesado y confirmado', style: 'paidText' },
                                        { text: 'Este documento es un comprobante digital de tu suscripción a JurisSearch.', style: 'footerNote', margin: [0, 3, 0, 0] },
                                    ],
                                },
                            ],
                        },
                    ],
                    styles: {
                        brandSub:        { fontSize: 8,  color: '#6b7280' },
                        invoiceTitle:    { fontSize: 14, bold: true, color: '#111827' },
                        invoiceNro:      { fontSize: 12, bold: true, color: '#374151' },
                        meta:            { fontSize: 9,  color: '#6b7280' },
                        paidBadge:       { fontSize: 9,  bold: true, color: '#059669' },
                        sectionHeader:   { fontSize: 10, bold: true, color: '#111827' },
                        label:           { fontSize: 9,  color: '#6b7280', margin: [4, 5, 4, 5] },
                        value:           { fontSize: 10, bold: true, color: '#111827', margin: [4, 5, 4, 5] },
                        tableHeader:     { fontSize: 10, bold: true, color: '#ffffff', margin: [4, 8, 4, 8] },
                        tableCell:       { fontSize: 10, color: '#374151', margin: [4, 8, 4, 8] },
                        totalRowLabel:   { fontSize: 9,  color: '#6b7280', margin: [4, 4, 4, 4] },
                        totalRowValue:   { fontSize: 9,  color: '#374151', margin: [4, 4, 4, 4] },
                        totalFinalLabel: { fontSize: 10, bold: true, margin: [6, 5, 6, 5] },
                        totalFinalValue: { fontSize: 10, bold: true, margin: [6, 5, 6, 5] },
                        paidText:        { fontSize: 10, bold: true, color: '#059669' },
                        footerNote:      { fontSize: 8,  color: '#9ca3af', italics: true },
                    },
                };

                pdfMake.createPdf(docDefinition).download(`factura-jurissearch-${nro}.pdf`, () => {
                    toast.remove(loadId);
                });
            } catch (err) {
                toast.remove(loadId);
                toast.error('Error al generar la factura');
                console.error('generateInvoice error:', err);
            }
        },
    },
    watch: {
        async active(val) {
            if (val === 'planes') {
                this.planSelected = null;
                await this.getPlanes();
            }

            if (val === 'facturacion') {
                this.validation.reset();
                const u = JSON.parse(localStorage.getItem('user') || '{}');
                this.model = {
                    NOMBRES: u.NOMBRES || null,
                    APELLIDOS: null,
                    CORREO: u.EMAIL || null,
                    TELEFONO: null,
                    DNI: null,
                };
                this.acceptedTerms = false;
                this.culqi.loading = false;
            }

            if (val === 'pagos') {
                this.facturacion.grid.currentPage = 1;
                await this.getFacturaciones();
            }
        },
    },
    async mounted() {
        if (typeof window.Culqi === 'undefined') {
            console.warn('SDK de Culqi no disponible. ¿Agregaste el <script> en index.html?');
        }
        this.facturacion.actions.download.action = this.generateInvoice;
        await Promise.all([this.getPlanes(), this.getSuscripcion()]);

        // Auto-seleccionar plan si viene desde el landing (?plan=ID)
        const planId = this.$route.query.plan;
        if (planId) {
            const plan = this.planes.find(p => String(p.ID) === String(planId));
            if (plan && plan.ACTUAL !== 1) {
                this.planSelected = plan;
                this.active = 'facturacion';
            }
        }
    },
};
</script>
