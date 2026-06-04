/* global Culqi */
<template>
    <section class="subscription-container">
        <div class="subscription-header">
            <div class="subscription-header-content">
                <div class="header-title-section">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        class="header-icon">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <div>
                        <h1 class="subscription-title">Planes y Suscripción</h1>
                        <p class="subscription-subtitle">Elige el plan perfecto para tus necesidades legales</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="subscription-content">
            <div class="tabs-modern">
                <button class="tab-button" :class="{ 'tab-active': active === 'planes' }"
                    @click="updateActive('planes')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Planes</span>
                </button>
                <button class="tab-button tab-button-disabled" :class="{ 'tab-active': active === 'facturacion' }"
                    :disabled="!planSelected">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span>Pago Seguro</span>
                </button>
                <button class="tab-button" :class="{ 'tab-active': active === 'pagos' }" @click="updateActive('pagos')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                    </svg>
                    <span>Facturación</span>
                </button>
            </div>

            <div class="tab-content">
                <!-- PLANES SECTION -->
                <div v-if="active === 'planes'" class="fade-in">
                    <div class="plans-grid">
                        <div v-for="plan in planes" :key="plan.id" class="plan-card"
                            :class="{ 'plan-card-active': plan?.ACTUAL === 1, 'plan-card-premium': plan?.PRINCIPAL }">
                            <div class="plan-badge" :class="{ 'plan-badge-premium': plan?.PRINCIPAL }">
                                <img v-if="plan?.PRINCIPAL" :src="corona" alt="corona" class="badge-icon" />
                                <span>{{ capitalizeFirst(plan?.DESCRIPCION) }}</span>
                            </div>

                            <div class="plan-body">
                                <div class="plan-price-section">
                                    <div class="plan-price">
                                        <span class="currency">S/</span>
                                        <span class="amount">{{ plan?.PRECIO || "" }}</span>
                                        <span class="period">/ {{ plan.PERIODO || "" }}</span>
                                    </div>
                                </div>

                                <button @click="plan?.ACTUAL === 1 ? null : toUpdatePlan(plan)" class="plan-btn"
                                    :class="{ 'plan-btn-current': plan?.ACTUAL === 1, 'plan-btn-upgrade': !plan?.ACTUAL }"
                                    :disabled="plan?.ACTUAL === 1">
                                    <svg v-if="plan?.ACTUAL === 1" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2">
                                        <path
                                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    {{ plan?.ACTUAL === 1 ? "Tu Plan Actual" : "Cambiar Plan" }}
                                </button>

                                <ul class="plan-features">
                                    <li v-for="restriccion in plan.DETALLE.RESTRICIONES" :key="restriccion"
                                        class="feature-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>{{ restriccion }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PAYMENT SECTION -->
                <div v-if="active === 'facturacion'" class="fade-in">
                    <div class="payment-container">
                        <div class="payment-form-card">
                            <div class="payment-header">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                                </svg>
                                <h2>Resumen de Suscripción</h2>
                            </div>

                            <form @submit.prevent="handleSubmit" class="payment-form">
                                <!-- Plan Summary -->
                                <div class="form-section">
                                    <div class="form-section-header">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <h3>Detalles del Plan</h3>
                                    </div>

                                    <div class="plan-summary">
                                        <div class="summary-row">
                                            <span class="summary-label">Plan seleccionado:</span>
                                            <span class="summary-value">{{ planSelected?.DESCRIPCION }}</span>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-label">Duración:</span>
                                            <span class="summary-value">{{ planSelected?.PERIODO }}</span>
                                        </div>
                                        <div class="summary-row summary-total">
                                            <span class="summary-label">Total a pagar:</span>
                                            <span class="summary-price">S/ {{ planSelected?.PRECIO }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Card Payment Section -->
                                <div class="form-section">
                                    <div class="form-section-header">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </svg>
                                        <h3>Métodos de Pago</h3>
                                    </div>

                                    <div class="payment-methods">
                                        <img src="@/assets/img/pagos/visa.png" alt="visa" class="payment-method-img" />
                                        <img src="@/assets/img/pagos/master.png" alt="mastercard"
                                            class="payment-method-img" />
                                    </div>
                                </div>

                                <!-- Cardholder Information -->
                                <div class="form-section">
                                    <div class="form-section-header">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <h3>Datos del Titular</h3>
                                    </div>

                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label class="form-label">
                                                Nombres <span class="required">*</span>
                                            </label>
                                            <div class="input-wrapper">
                                                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24"
                                                    fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                <input v-model="model.NOMBRES"
                                                    :class="['form-input', { 'input-error': validation.hasError('model.NOMBRES') }]"
                                                    type="text" placeholder="Ingresa tus nombres" maxlength="100" />
                                            </div>
                                            <span class="error-message" v-if="validation.hasError('model.NOMBRES')">
                                                {{ validation.firstError('model.NOMBRES') }}
                                            </span>
                                        </div>

                                        <div class="form-group">
                                            <label class="form-label">
                                                Apellidos <span class="required">*</span>
                                            </label>
                                            <div class="input-wrapper">
                                                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24"
                                                    fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                <input v-model="model.APELLIDOS"
                                                    :class="['form-input', { 'input-error': validation.hasError('model.APELLIDOS') }]"
                                                    type="text" placeholder="Ingresa tus apellidos" maxlength="100" />
                                            </div>
                                            <span class="error-message" v-if="validation.hasError('model.APELLIDOS')">
                                                {{ validation.firstError('model.APELLIDOS') }}
                                            </span>
                                        </div>

                                        <div class="form-group form-group-full">
                                            <label class="form-label">
                                                Correo Electrónico <span class="required">*</span>
                                            </label>
                                            <div class="input-wrapper">
                                                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24"
                                                    fill="none" stroke="currentColor" stroke-width="2">
                                                    <path
                                                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <polyline points="22,6 12,13 2,6" />
                                                </svg>
                                                <input v-model="model.CORREO"
                                                    :class="['form-input', { 'input-error': validation.hasError('model.CORREO') }]"
                                                    type="email" placeholder="correo@ejemplo.com" maxlength="100" />
                                            </div>
                                            <span class="error-message" v-if="validation.hasError('model.CORREO')">
                                                {{ validation.firstError('model.CORREO') }}
                                            </span>
                                        </div>

                                        <div class="form-group">
                                            <label class="form-label">
                                                Teléfono <span class="required">*</span>
                                            </label>
                                            <div class="input-wrapper">
                                                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24"
                                                    fill="none" stroke="currentColor" stroke-width="2">
                                                    <path
                                                        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                                </svg>
                                                <input v-model="model.TELEFONO"
                                                    :class="['form-input', { 'input-error': validation.hasError('model.TELEFONO') }]"
                                                    type="tel" placeholder="987654321" maxlength="15"
                                                    @input="model.TELEFONO = model.TELEFONO.replace(/[^0-9]/g, '')" />
                                            </div>
                                            <span class="error-message" v-if="validation.hasError('model.TELEFONO')">
                                                {{ validation.firstError('model.TELEFONO') }}
                                            </span>
                                        </div>

                                        <div class="form-group">
                                            <label class="form-label">DNI</label>
                                            <div class="input-wrapper">
                                                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24"
                                                    fill="none" stroke="currentColor" stroke-width="2">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                                                </svg>
                                                <input v-model="model.DNI" class="form-input" type="text"
                                                    placeholder="12345678" maxlength="8"
                                                    @input="model.DNI = model.DNI.replace(/[^0-9]/g, '')" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn-pay" :disabled="culqi.loading">
                                        <svg v-if="!culqi.loading" width="18" height="18" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                        <span v-if="culqi.loading" class="spinner"></span>
                                        {{ culqi.loading ? 'Procesando...' : 'Generar Orden de Pago' }}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div class="payment-sidebar">
                            <div class="sidebar-card">
                                <div class="sidebar-header">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <h3>Otros Medios de Pago</h3>
                                </div>

                                <div class="alternative-payments">
                                    <img src="@/assets/img/pagos/yape.png" alt="yape" class="alt-payment-img" />
                                    <img src="@/assets/img/pagos/plin.png" alt="plin" class="alt-payment-img" />
                                    <img src="@/assets/img/pagos/bcp.png" alt="bcp" class="alt-payment-img" />
                                    <img src="@/assets/img/pagos/interbank.png" alt="interbank"
                                        class="alt-payment-img" />
                                </div>

                                <p class="sidebar-text">
                                    Realiza tu pago fácilmente a través de billeteras digitales o mediante transferencia
                                    bancaria.
                                </p>

                                <a href="https://wa.me/51949345646?text=Hola%2C%20estoy%20interesado%20en%20adquirir%20un%20plan%20para%20JurisSearch.%20¿Podrías%20brindarme%20más%20información%2C%20por%20favor%3F"
                                    target="_blank" class="advisor-link">
                                    <img src="@/assets/img/pagos/asesor.png" alt="asesor" class="advisor-icon" />
                                    <span>Hablar con un asesor</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BILLING SECTION -->
                <div v-if="active === 'pagos'" class="fade-in">
                    <div class="billing-section">
                        <div class="billing-filters-card">

                            <div class="filters-content">
                                <div class="form-group">
                                    <div class="input-wrapper">
                                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <date-picker v-model="facturacion.FCRCN" :value="facturacion.FCRCN"
                                            valueType="format" class="form-input date-picker-custom"
                                            placeholder="Selecciona una fecha"
                                            :disabledDate="time => time.getTime() > Date.now()"
                                            @change="(date) => facturacion.FCRCN = date" />
                                    </div>
                                </div>

                                <button class="btn-search" @click="getFacturaciones">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    Buscar
                                </button>
                            </div>
                        </div>

                        <card-table :active="active" title="Historial de Pagos" :search="getFacturaciones"
                            :fields="facturacion.fields" :items="facturacion.grid.items" :grid="facturacion.grid"
                            :actions="facturacion.actions" />
                    </div>
                </div>
            </div>
        </div>
        <LoadingOverlay :active="loading" :is-full-page="false" :loader="'bars'" />
    </section>
</template>

<script>
/* global Culqi */
import { toast } from 'vue3-toastify';
import MantenimientoProxy from "@/proxies/MantenimientoProxy.js";
import { Validator } from 'simple-vue-validator';
import corona from "@/assets/img/resources/Corona.png";
import SubscriptionProxy from '@/proxies/SubscriptionProxy.js';
import CardTable from "@/components/Cards/CardTable.vue";
import moment from 'moment';

export default {
    name: "planes",
    components: {
        CardTable
    },
    data() {
        return {
            culqi: {
                amount: 185,
                email: 'ccarbajalmt0520@gmail.com',
                description: 'SUSCRIPCIÓN JURISSEARCH',
                loading: false,
                message: ''
            },
            facturacion: {
                FCRCN: null,
                actions: {
                    edit: {
                        label: "Editar",
                        icon: "fas fa-edit",
                        class: "btn-edit",
                        action: null,
                    },
                },
                fields: [
                    {
                        key: "RN",
                        label: "",
                    },
                    {
                        key: "DPLAN",
                        label: "Plan",
                    },
                    {
                        key: "TOTAL",
                        label: "Total",
                    },
                    {
                        key: "RTAFTO",
                        label: "Medio de Pago",
                    },
                    {
                        key: "FCHA",
                        label: "Fecha de Pago",
                    },
                    {
                        key: "BAN",
                        label: "Estado",
                    }
                ],
                grid: {
                    items: [],
                    currentPage: 1,
                    perPage: 10,
                    totalRows: 120,
                    isLoading: true,
                    pageOptions: [5, 10, 15, 50],
                },
            },
            active: "planes",
            planes: [],
            errorPayment: null,
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
            stripe: null,
            elements: null,
            card: null,
            cardNumber: null,
            cardExpiry: null,
            cardCvc: null,
            loading: false,
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
                .email('Correo electrónico inválido')
                .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Formato de correo inválido');
        },
        'model.TELEFONO': function (value) {
            return Validator.value(value)
                .required('Campo requerido')
                .regex(/^\d+$/, 'Solo se permiten números')
                .minLength(9, 'Mínimo 9 dígitos')
                .maxLength(15, 'Máximo 15 dígitos');
        }
    },
    methods: {
        async handleSubmit() {
            const validate = await this.$validate();
            if (!validate) return;

            const CULQI_PUBLIC_KEY = 'pk_test_xn4SkqpCLsx62ZOL';
            const amountNumber = Number(this.planSelected?.PRECIO);

            if (isNaN(amountNumber) || amountNumber <= 0) {
                toast.error('Monto del plan no válido', { toastId: 'error' });
                return;
            }

            this.culqi.loading = true;
            const loadingToast = toast.loading('Generando orden de pago...', {
                timeout: false,
                closeOnClick: false,
            });

            try {
                // 🧾 Crear orden desde backend
                const response = await SubscriptionProxy.create({
                    amount: amountNumber,
                    description: this.planSelected.DESCRIPCION,
                    email: this.model.CORREO,
                    nombres: this.model.NOMBRES,
                    apellidos: this.model.APELLIDOS,
                    telefono: this.model.TELEFONO,
                    dni: this.model.DNI
                });

                toast.remove(loadingToast);

                if (!response.success) {
                    toast.error(response?.message || '❌ Error al crear la orden de pago.', { toastId: 'error' });
                    this.culqi.loading = false;
                    return;
                }

                // 💳 Configurar Culqi Checkout
                Culqi.publicKey = CULQI_PUBLIC_KEY;
                Culqi.settings({
                    title: 'JURIS SEARCH',
                    currency: 'PEN',
                    description: this.planSelected.DESCRIPCION,
                    amount: amountNumber * 100, // siempre en céntimos
                    order: response.data.id,
                    logo: 'https://jurissearch.com/img/logo-full.e849dab8.png',
                    paymentMethods: {
                        tarjeta: true,
                        yape: true,
                    },
                    style: {
                        maincolor: '#0052cc',
                        buttontext: '#ffffff',
                        maintext: '#4A4A4A',
                        desctext: '#4A4A4A'
                    },
                    options: {
                        // modal: true,
                        lang: 'es',
                        paymentMethodsOrder: ['yape', 'tarjeta']
                    }
                });

                Culqi.open();
                this.culqi.loading = false;

                // ⚡ Callback de Culqi
                window.culqi = async () => {
                    if (Culqi.token) {
                        const token = Culqi.token.id;

                        try {
                            const chargeRes = await SubscriptionProxy.chargeWithToken({
                                token,
                                order_id: response.data.id,
                                email: this.model.CORREO,
                                amount: amountNumber,
                                id_plan: this.planSelected.ID,
                                tipo: token.substring(0, 4)
                            });


                            Culqi.close(); // cierra siempre el iframe

                            // 🟣 Pago con Yape
                            if (token.startsWith('ype_')) {
                                if (chargeRes?.success) {
                                    this.$swal({
                                        title: chargeRes?.data?.outcome?.user_message || '✅ Pago con Yape exitoso',
                                        text: chargeRes?.data?.outcome?.merchant_message || '✅ Tu pago con Yape ha sido procesado exitosamente.',
                                        icon: 'success',
                                        confirmButtonText: 'Aceptar'
                                    }).then(() => {
                                        this.active = 'planes';
                                    });

                                } else {
                                    this.$swal({
                                        title: 'Error en el pago con Yape',
                                        text: chargeRes?.message || '❌ Ocurrió un error al procesar el pago con Yape.',
                                        icon: 'error',
                                        confirmButtonText: 'Aceptar'
                                    });
                                }
                            }

                            // 💳 Pago con tarjeta
                            else if (token.startsWith('tkn_')) {
                                if (!chargeRes.success) {
                                    this.$swal({
                                        title: chargeRes?.title === 'operacion_denegada'
                                            ? 'Operación denegada'
                                            : 'Pago rechazado',
                                        text: chargeRes?.message || 'El pago fue rechazado. Intenta con otra tarjeta o medio de pago.',
                                        icon: 'error',
                                        confirmButtonText: 'Aceptar'
                                    });
                                    return;
                                }

                                this.$swal({
                                    title: chargeRes?.data?.outcome?.user_message || 'Pago exitoso',
                                    text: chargeRes?.data?.outcome?.merchant_message || '',
                                    icon: 'success',
                                    confirmButtonText: 'Aceptar'
                                }).then(() => {
                                    this.active = 'planes';
                                    console.log('✅ Pago completado:', chargeRes);
                                });
                            }

                        } catch (err) {
                            Culqi.close();
                            console.error('Error al procesar pago:', err);
                            this.$swal({
                                title: 'Error en el pago',
                                text: `${err.merchant_message || ''} ${err.user_message || ''}`.trim() ||
                                    'Ocurrió un error al procesar el pago.',
                                icon: 'error',
                                confirmButtonText: 'Aceptar'
                            });
                        } finally {
                            this.culqi.loading = false;
                        }
                    } else {
                        // 🟡 Usuario cerró el iframe sin pagar
                        Culqi.close();
                        this.$swal({
                            title: 'Pago cancelado',
                            text: 'Has cerrado el formulario sin completar el pago.',
                            icon: 'info',
                            confirmButtonText: 'Aceptar'
                        });
                        this.culqi.loading = false;
                    }
                };
            } catch (error) {
                toast.remove(loadingToast);
                toast.error(error?.message || '⚠️ Ocurrió un error al procesar la suscripción.', {
                    toastId: 'error',
                });
                this.culqi.loading = false;
            }
        },

        async toUpdatePlan(plan) {
            if (!plan.ID) {
                toast.error('Plan no válido', { toastId: 'error' });
                return;
            }
            this.planSelected = plan;
            this.active = 'facturacion';
        },

        updateActive(tab) {
            this.active = tab;
        },
        getPlanes() {
            MantenimientoProxy.listPlanUser({
                ROWS: 1000,
                INIT: 0,
                DESC: null
            })
                .then((response) => {
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

                    this.planes = response.filter(item => item.ID > 1);
                })
                .catch((error) => {
                    toast.error(error?.message || 'Ocurrió un error al obtener los planes', { toastId: 'error' });
                })
        },
        async getFacturaciones() {
            const init = (this.facturacion.grid.currentPage - 1) * this.facturacion.grid.perPage;
            const rows = this.facturacion.grid.perPage;

            this.facturacion.grid.isLoading = true;
            await SubscriptionProxy.payment_list({
                ROWS: rows,
                INIT: init,
                FCRCN: this.facturacion?.FCRCN || null
            })
                .then((response) => {
                    this.facturacion.grid.items = response.map(item => {
                        item.TOTAL = 'S/ ' + Number(item.TOTAL).toFixed(2);
                        item.RTAFTO = item.TIPO === 'YAPE' ? '<i class="pi pi-mobile mr-2" style="font-size:1em;"></i> Yape' :
                            item.TIPO === 'TARJETA' ? '<i class="pi pi-credit-card mr-2" style="font-size:1em;"></i> Tarjeta' :
                                item.TIPO === 'PLIN' ? '<i class="pi pi-mobile mr-2" style="font-size:1em;"></i> Plin' :
                                    item.TIPO === 'TRANSFERENCIA' ? '<i class="pi pi-unlock mr-2" style="font-size:1em;"></i> Transferencia' :
                                        item.TIPO;
                        item.FCHA = item.FCRCN ? moment(item.FCRCN).format('DD/MM/YYYY, h:mm a') : '';
                        item.BAN = '<span class="badge bg-success text-white">Pagado</span>';
                        return item;
                    })
                        || [];
                    this.facturacion.grid.totalRows = response?.[0]?.TOTALROWS || 0;
                })
                .catch((error) => {
                    this.facturacion.grid.items = [];
                    this.facturacion.grid.totalRows = 0;
                    console.error("error", error);
                })
                .finally(() => this.facturacion.grid.isLoading = false);
        },
        capitalizeFirst(text) {
            if (!text) return "";
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        },
    },
    watch: {
        async active(newValue) {
            if (newValue === 'planes') {
                this.planSelected = null;
                this.getPlanes();
            }

            if (newValue === 'facturacion') {
                this.validation.reset();
                // this.model = {
                //     NOMBRES: "Carlos Ruben",
                //     APELLIDOS: "Carbajal Matias",
                //     CORREO: "ccarbajalmt0520@gmail.com",
                //     TELEFONO: "950181301",
                //     DNI: "70812345"
                // };
                this.model = {
                    NOMBRES: null,
                    APELLIDOS: null,
                    CORREO: null,
                    TELEFONO: null,
                    DNI: null
                };
                this.errorPayment = null;
                this.culqi.message = '';
                this.culqi.loading = false;
                this.loading = false;
            }

            if (newValue === 'pagos') {
                this.getFacturaciones(1, this.facturacion.grid.perPage);
                this.facturacion.grid.currentPage = 1;
                this.facturacion.grid.perPage = 10;
                this.facturacion.grid.isLoading = false;
            }
        }
    },
    async mounted() {
        if (typeof window.Culqi === 'undefined') {
            console.warn('SDK de Culqi no disponible. ¿Agregaste el <script> en index.html?')
        }
        this.getPlanes();
    },
}
</script>

<style scoped>
/* Subscription Container */
.subscription-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    padding-bottom: 4rem;
    font-size: 0.9em;
}

/* Header */
.subscription-header {
    background: white;
    border-bottom: 1px solid #E5E7EB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 0.75rem 0;
    margin-bottom: 0.75rem;
}

.subscription-header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}

.header-title-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
}

.header-title-section>div {
    flex: 1;
    min-width: 0;
    max-width: 100%;
}

.header-icon {
    flex-shrink: 0;
    color: #185CE6;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

.subscription-title {
    font-size: 1.35rem;
    font-weight: 800;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    max-width: 100%;
    width: 100%;
}

.subscription-subtitle {
    color: #6B7280;
    font-size: 0.8rem;
    margin: 0.15rem 0 0 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
    max-width: 100%;
    width: 100%;
}

/* Content */
.subscription-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Modern Tabs */
.tabs-modern {
    display: flex;
    gap: 1rem;
    background: white;
    padding: 0.5rem;
    border-radius: 16px 16px 0px 0px;
}

.tab-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-button svg {
    transition: transform 0.3s ease;
}

.tab-button:hover {
    background: rgba(24, 92, 230, 0.05);
    color: #185CE6;
}

.tab-button:hover svg {
    transform: translateY(-2px);
}

.tab-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.tab-button.active,
.tab-button.tab-active {
    background: rgba(24, 92, 230, 0.05);
    color: #185CE6 !important;
}

.tab-button.active:hover,
.tab-button.tab-active:hover {
    background: rgba(24, 92, 230, 0.08);
    color: #185CE6;
}

/* Tab Content */
.tab-content {
    background-color: white!important;
    padding: 10px;
    border-radius: 0px 0px 16px 16px;
    animation: fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.4s ease-in;
}

/* Plans Grid */
.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.plan-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.plan-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(24, 92, 230, 0.3);
}

.plan-card-active {
    border-color: #185CE6;
    transform: scale(1.02);
    box-shadow: 0 8px 30px rgba(24, 92, 230, 0.3);
}

.plan-card-premium {
    border-color: #DF2DB2;
}

.plan-badge {
    background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
    padding: 0.75rem;
    text-align: center;
    font-weight: 700;
    font-size: 0.95rem;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.plan-badge-premium {
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    color: white;
}

.badge-icon {
    width: 20px;
    height: 20px;
    animation: rotate 10s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.plan-body {
    padding: 1.5rem;
}

.plan-price-section {
    text-align: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #F3F4F6;
}

.plan-price {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 0.25rem;
}

.currency {
    font-size: 1.2rem;
    font-weight: 600;
    color: #6B7280;
    margin-top: 0.5rem;
}

.amount {
    font-size: 2.75rem;
    font-weight: 800;
    color: #1F2937;
    line-height: 1;
}

.period {
    font-size: 0.9rem;
    font-weight: 400;
    color: #9CA3AF;
    margin-top: 1.5rem;
}

.plan-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
}

.plan-btn-upgrade {
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(223, 45, 178, 0.3);
}

.plan-btn-upgrade:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(223, 45, 178, 0.4);
}

.plan-btn-current {
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: white;
    cursor: not-allowed;
    opacity: 0.9;
}

.plan-features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    color: #4B5563;
    font-size: 0.875rem;
    line-height: 1.4;
}

.feature-item svg {
    flex-shrink: 0;
    color: #10B981;
    margin-top: 0.15rem;
}

/* Payment Container */
.payment-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

.payment-form-card {
    border-radius: 20px;
    padding: 1.25rem;
}

.payment-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #F3F4F6;
}

.payment-header svg {
    color: #185CE6;
}

.payment-header h2 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
}

.payment-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

/* Form Section */
.form-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-bottom: 0.65rem;
    border-bottom: 2px solid #F3F4F6;
}

.form-section-header svg {
    color: #185CE6;
}

.form-section-header h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
}

/* Plan Summary */
.plan-summary {
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.05) 0%, rgba(24, 92, 230, 0.05) 100%);
    border-radius: 14px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.summary-label {
    font-size: 0.85rem;
    color: #6B7280;
    font-weight: 500;
}

.summary-value {
    font-size: 0.85rem;
    color: #1F2937;
    font-weight: 600;
}

.summary-total {
    padding-top: 0.75rem;
    border-top: 2px solid rgba(24, 92, 230, 0.2);
    margin-top: 0.25rem;
}

.summary-price {
    font-size: 1.25rem;
    font-weight: 800;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Payment Methods */
.payment-methods {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.payment-method-img {
    width: 60px;
    height: 34px;
    object-fit: contain;
    border: 2px solid #E5E7EB;
    border-radius: 8px;
    padding: 0.4rem;
    background: white;
    transition: all 0.3s ease;
}

.payment-method-img:hover {
    border-color: #185CE6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 92, 230, 0.2);
}

/* Form Grid */
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group-full {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 0.825rem;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.required {
    color: #DC2626;
    font-weight: 700;
}

/* Input Wrapper */
.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 0.875rem;
    color: #9CA3AF;
    pointer-events: none;
    z-index: 1;
    width: 16px;
    height: 16px;
}

.form-input {
    width: 100%;
    padding: 0.7rem 0.875rem 0.7rem 2.75rem;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    font-size: 0.875rem;
    color: #1F2937;
    background: white;
    transition: all 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: #185CE6;
    box-shadow: 0 0 0 3px rgba(24, 92, 230, 0.1);
}

.form-input::placeholder {
    color: #9CA3AF;
}

.input-error {
    border-color: #DC2626 !important;
}

.input-error:focus {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

.error-message {
    font-size: 0.85rem;
    color: #DC2626;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

/* Date Picker */
.date-picker-custom {
    padding-left: 3rem !important;
}

/* Form Actions */
.form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
}

.btn-pay {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(223, 45, 178, 0.3);
    min-width: 200px;
}

.btn-pay:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(223, 45, 178, 0.4);
}

.btn-pay:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Payment Sidebar */
.payment-sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.sidebar-card {
    border-radius: 20px;
    padding: 1.25rem;
    position: sticky;
    top: 2rem;
}

.sidebar-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #F3F4F6;
}

.sidebar-header svg {
    color: #185CE6;
}

.sidebar-header h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
}

.alternative-payments {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.alt-payment-img {
    width: 100%;
    height: 48px;
    object-fit: contain;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    padding: 0.5rem;
    background: white;
    transition: all 0.3s ease;
    cursor: pointer;
}

.alt-payment-img:hover {
    border-color: #185CE6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 92, 230, 0.2);
}

.sidebar-text {
    color: #6B7280;
    font-size: 0.825rem;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.advisor-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.08) 0%, rgba(24, 92, 230, 0.08) 100%);
    border-radius: 12px;
    color: #185CE6;
    font-weight: 600;
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.3s ease;
}

.advisor-link:hover {
    background: linear-gradient(135deg, rgba(223, 45, 178, 0.15) 0%, rgba(24, 92, 230, 0.15) 100%);
    transform: translateX(4px);
}

.advisor-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
}

/* Billing Section */
.billing-section {
    display: flex;
    flex-direction: column;
}

.billing-filters-card {
    background: white;
    padding: 1.5rem 2rem;
}

.filters-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.filters-header svg {
    color: #185CE6;
}

.filters-header h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
}

.filters-content {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
}

.btn-search {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}


/* Responsive Design */
@media (max-width: 1200px) {
    .payment-container {
        grid-template-columns: 1fr;
    }

    .sidebar-card {
        position: relative;
        top: 0;
    }
}

@media (max-width: 1024px) {
    .subscription-header-content {
        padding: 0 1.5rem;
    }

    .subscription-content {
        padding: 0 1.5rem;
    }

    .plans-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .subscription-header {
        padding: 0.6rem 0;
    }

    .subscription-header-content {
        padding: 0 1rem;
    }

    .header-title-section {
        gap: 0.875rem;
        flex-wrap: wrap;
    }

    .header-icon {
        width: 28px;
        height: 28px;
    }

    .subscription-title {
        font-size: 1.35rem;
        line-height: 1.3;
        word-break: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
        width: 100%;
    }

    .subscription-subtitle {
        font-size: 0.8rem;
        line-height: 1.4;
        overflow-wrap: break-word;
        max-width: 100%;
        width: 100%;
    }

    .subscription-content {
        padding: 0 1rem;
    }

    .tabs-modern {
        gap: 0.5rem;
        padding: 0.375rem;
    }

    .tab-button {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 0.5rem;
        font-size: 0.875rem;
    }

    .tab-button svg {
        width: 18px;
        height: 18px;
    }

    .plans-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .plan-card {
        max-width: 100%;
    }

    .plan-body {
        padding: 1.5rem;
    }

    .amount {
        font-size: 2.35rem;
    }

    .plan-btn {
        padding: 0.7rem;
        font-size: 0.875rem;
    }

    .payment-form-card,
    .sidebar-card,
    .billing-filters-card {
        padding: 1.5rem 2rem;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }

    .form-input {
        padding: 0.875rem 1rem 0.875rem 2.75rem;
        font-size: 0.9rem;
    }

    .input-icon {
        left: 0.875rem;
        width: 16px;
        height: 16px;
    }

    .form-label {
        font-size: 0.85rem;
    }

    .form-actions {
        flex-direction: column;
        gap: 0.75rem;
    }

    .btn-pay,
    .btn-cancel {
        width: 100%;
        padding: 0.875rem 1.5rem;
        font-size: 0.95rem;
    }

    .filters-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .btn-search {
        width: 100%;
        padding: 0.875rem 1.5rem;
        font-size: 0.95rem;
    }

    .alternative-payments {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .payment-option {
        padding: 1rem;
    }
}

@media (max-width: 480px) {
    .subscription-title {
        font-size: 1.05rem;
        line-height: 1.3;
        overflow-wrap: break-word;
        word-wrap: break-word;
        max-width: 100%;
        width: 100%;
    }

    .subscription-subtitle {
        font-size: 0.72rem;
        overflow-wrap: break-word;
        word-wrap: break-word;
        max-width: 100%;
        width: 100%;
        line-height: 1.3;
    }

    .header-title-section {
        gap: 0.75rem;
    }

    .header-icon {
        width: 24px;
        height: 24px;
    }

    .tab-button {
        padding: 0.625rem 0.375rem;
        font-size: 0.8rem;
    }

    .tab-button span {
        font-size: 0.8rem;
    }

    .plan-body {
        padding: 1.25rem;
    }

    .amount {
        font-size: 1.95rem;
    }

    .currency {
        font-size: 1rem;
    }

    .period {
        font-size: 0.75rem;
    }

    .plan-btn {
        padding: 0.65rem;
        font-size: 0.85rem;
    }

    .feature-item {
        font-size: 0.8rem;
    }

    .payment-form-card,
    .sidebar-card,
    .billing-filters-card {
        padding: 1.5rem 2rem;
    }

    .form-input {
        padding: 0.75rem 0.875rem 0.75rem 2.5rem;
        font-size: 0.875rem;
    }

    .btn-pay,
    .btn-cancel,
    .btn-search {
        padding: 0.75rem 1.25rem;
        font-size: 0.875rem;
    }

    .payment-option {
        padding: 0.875rem;
    }
}

.swal2-container {
    z-index: 99999 !important;
}
</style>
