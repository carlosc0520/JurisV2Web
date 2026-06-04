<template>
    <div>
        <navbar />
        <main>
            <section class="profile-page">
                <!-- Hero Section -->
                <div class="hero-header">
                    <div class="hero-content">
                        <h1 class="hero-title">📬 Contáctanos</h1>
                        <p class="hero-subtitle">
                            No dudes en contactarnos, nuestro equipo especializado responderá tus consultas
                            rápidamente.
                        </p>
                    </div>
                </div>

                <!-- Contact Container -->
                <section class="container-contacto">
                    <div class="contact-grid">
                        <!-- Info Cards Column -->
                        <div class="info-cards-wrapper">
                            <div class="info-card">
                                <div class="icon-wrapper">
                                    <img src="@/assets/img/contacto/question.png" alt="Ayuda" class="icon-img" />
                                </div>
                                <div class="info-content">
                                    <h3 class="info-title">¿Necesitas ayuda?</h3>
                                    <p class="info-text">Completa el formulario</p>
                                </div>
                            </div>

                            <div class="info-card">
                                <div class="icon-wrapper">
                                    <img src="@/assets/img/contacto/warning.png" alt="Preguntas" class="icon-img" />
                                </div>
                                <div class="info-content">
                                    <h3 class="info-title">¿Tienes preguntas?</h3>
                                    <p class="info-text">Te respondemos <span class="highlight">aquí</span></p>
                                </div>
                            </div>

                            <div class="info-card">
                                <div class="icon-wrapper">
                                    <img src="@/assets/img/contacto/phone.png" alt="Email" class="icon-img" />
                                </div>
                                <div class="info-content">
                                    <h3 class="info-title">Escríbenos</h3>
                                    <p class="info-text">jsearch@ccfirma.com</p>
                                </div>
                            </div>
                        </div>

                        <!-- Form Column -->
                        <div class="form-wrapper">
                            <form class="contact-form" @submit="submit">
                                <h2 class="form-title">
                                    Completa los campos para ponernos en contacto contigo a la brevedad
                                </h2>

                                <div class="form-group">
                                    <label class="form-label">Nombre y apellidos</label>
                                    <input type="text" v-model="modelo.NOMBRES"
                                        :class="{ 'error': validation.hasError('modelo.NOMBRES') }"
                                        placeholder="Ingresa tu nombre completo" class="form-input">
                                    <span class="error-message" v-if="validation.hasError('modelo.NOMBRES')">
                                        {{ validation.firstError('modelo.NOMBRES') }}
                                    </span>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Correo electrónico</label>
                                    <input type="email" v-model="modelo.CORREO"
                                        :class="{ 'error': validation.hasError('modelo.CORREO') }"
                                        placeholder="tucorreo@ejemplo.com" class="form-input">
                                    <span class="error-message" v-if="validation.hasError('modelo.CORREO')">
                                        {{ validation.firstError('modelo.CORREO') }}
                                    </span>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Motivo</label>
                                    <input type="text" v-model="modelo.ASUNTO"
                                        :class="{ 'error': validation.hasError('modelo.ASUNTO') }"
                                        placeholder="¿En qué podemos ayudarte?" class="form-input">
                                    <span class="error-message" v-if="validation.hasError('modelo.ASUNTO')">
                                        {{ validation.firstError('modelo.ASUNTO') }}
                                    </span>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Mensaje</label>
                                    <textarea v-model="modelo.MENSAJE"
                                        :class="{ 'error': validation.hasError('modelo.MENSAJE') }"
                                        placeholder="Escribe tu mensaje aquí..." class="form-textarea"></textarea>
                                    <span class="error-message" v-if="validation.hasError('modelo.MENSAJE')">
                                        {{ validation.firstError('modelo.MENSAJE') }}
                                    </span>
                                </div>

                                <button type="button" class="submit-button" @click="submit">
                                    <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
                <!-- CTA Section -->
                <div class="cta-section">
                    <div class="cta-content">
                        <h2 class="cta-title">Descubre el plan que se adapta a ti</h2>
                        <p class="cta-text">Accede a todos los beneficios de JurisSearch</p>
                        <router-link to="/#mi-seccion-planes" class="cta-button">
                            Ver Planes
                            <svg class="button-icon-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </router-link>
                    </div>
                </div>
            </section>
            <LoadingOverlay :active="isLoading" :is-full-page="false" :loader="'bars'" />

        </main>
        <footer-component />
    </div>
</template>

<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';
import team2 from "@/assets/img/logos/logo-completo.png";

// * PROXIES
import SettingsProxy from "@/proxies/SettingsProxy.js";

export default {
    data() {
        return {
            team2,
            noticias: [],
            currentIndex: 0,
            modelo: {
                NOMBRES: null,
                CORREO: null,
                ASUNTO: null,
                MENSAJE: null,
            },
            isLoading: false,
        };
    },
    validators: {
        'modelo.NOMBRES': function (value) {
            return Validator.value(value).required("Campo requerido");
        },
        'modelo.CORREO': function (value) {
            return Validator.value(value).required("Campo requerido")
                .email("El correo electrónico no es válido");
        },
        'modelo.ASUNTO': function (value) {
            return Validator.value(value).required("Campo requerido");
        },
        'modelo.MENSAJE': function (value) {
            return Validator.value(value).required("Campo requerido");
        },
    },
    components: {
        Navbar,
        FooterComponent,
    },
    methods: {
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

        }
    }
};
</script>


<style scoped>
.profile-page {
    background-image: url("../assets/img/backgrounds/bg-contacto.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 3rem;
}

/* Hero Header */
.hero-header {
    padding: 2.8rem 2rem 2rem;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #1F2937;
    margin-bottom: 0.75rem;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.hero-subtitle {
    font-size: 0.88rem;
    color: #374151;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
}

/* Contact Container */
.container-contacto {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    padding: 1.8rem;
    border-radius: 20px;
}

.contact-grid {
    display: grid;
    gap: 2rem;
    align-items: start;
}

@media (min-width: 992px) {
    .contact-grid {
        grid-template-columns: 1fr 1.8fr;
    }
}

/* Info Cards */
.info-cards-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.info-card {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
    border-radius: 12px;
    border: 2px solid #f3f4f6;
    transition: all 0.3s ease;
}

.info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(107, 163, 255, 0.15);
    border-color: #6ba3ff;
}

.icon-wrapper {
    padding: 0.65rem;
    background: linear-gradient(135deg, #EDF6FF 0%, #dbeafe 100%);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(107, 163, 255, 0.2);
}

.icon-img {
    height: 1.8rem;
    width: 1.8rem;
}

.info-content {
    flex: 1;
}

.info-title {
    margin: 0 0 0.35rem 0;
    font-size: 0.88rem;
    font-weight: 700;
    color: #1864FF;
}

.info-text {
    margin: 0;
    font-size: 0.82rem;
    color: #4B5563;
    line-height: 1.5;
}

.highlight {
    color: #6ba3ff;
    font-weight: 600;
}

/* Form Wrapper */
.form-wrapper {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%);
    backdrop-filter: blur(15px);
    padding: 1.8rem;
    border-radius: 18px;
    border: 2px solid rgba(107, 163, 255, 0.15);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
    animation: fadeInRight 0.8s ease-out 0.6s backwards;
    position: relative;
    overflow: hidden;
}

.form-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(107, 163, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    animation: glow 4s ease-in-out infinite;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    position: relative;
}

.form-title {
    font-size: 1.35rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1864FF 0%, #6ba3ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.4;
    margin: 0 0 1rem 0;
    animation: fadeInRight 0.8s ease-out 0.7s backwards;
    position: relative;
    display: inline-block;
}

.form-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #1864FF, #6ba3ff);
    border-radius: 2px;
    animation: fadeInRight 0.8s ease-out 0.9s backwards;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
    animation: fadeInUp 0.6s ease-out backwards;
}

.form-group:nth-child(2) { animation-delay: 0.9s; }
.form-group:nth-child(3) { animation-delay: 1s; }
.form-group:nth-child(4) { animation-delay: 1.1s; }
.form-group:nth-child(5) { animation-delay: 1.2s; }

.form-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.35rem;
    transition: all 0.3s ease;
}

.form-group:focus-within .form-label {
    color: #1864FF;
    transform: translateY(-2px);
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 0.7rem 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    font-size: 0.85rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.9) !important;
    color: #1F2937 !important;
    outline: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.form-input:hover,
.form-textarea:hover {
    border-color: #9CA3AF;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.form-input:focus,
.form-textarea:focus {
    border-color: #6ba3ff;
    background: white !important;
    box-shadow: 0 8px 24px rgba(107, 163, 255, 0.15), 0 0 0 4px rgba(107, 163, 255, 0.1);
    transform: translateY(-2px);
}

.form-input.error,
.form-textarea.error {
    border-color: #EF4444;
    animation: shake 0.4s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}

.form-textarea {
    min-height: 140px;
    resize: vertical;
    font-family: inherit;
    line-height: 1.6;
}

.error-message {
    color: #EF4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-weight: 500;
    animation: fadeInUp 0.3s ease;
}

.submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    background: linear-gradient(135deg, #1864FF 0%, #6ba3ff 100%);
    background-size: 200% auto;
    color: white;
    padding: 0.85rem 1.5rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 700;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 12px 30px rgba(24, 100, 255, 0.3);
    width: 100%;
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.6s ease-out 1.3s backwards;
}

.submit-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
}

.submit-button:hover::before {
    left: 100%;
}

.submit-button:hover {
    background-position: right center;
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 40px rgba(24, 100, 255, 0.4);
}

.submit-button:active {
    transform: translateY(-2px) scale(0.98);
    box-shadow: 0 8px 20px rgba(24, 100, 255, 0.3);
}

.button-icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.3s ease;
}

.submit-button:hover .button-icon {
    transform: rotate(5deg) scale(1.1);
}

/* CTA Section */
.cta-section {
    background: linear-gradient(135deg, #1F2937 0%, #374151 50%, #1F2937 100%);
    background-size: 200% auto;
    padding: 2.8rem 2rem;
    margin: 2rem 2rem 0;
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.8s ease-out 1.5s backwards;
}

.cta-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(107, 163, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at bottom left, rgba(79, 143, 247, 0.1) 0%, transparent 50%);
    animation: glow 6s ease-in-out infinite;
}

.cta-section::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%);
    animation: shimmer 4s infinite;
}

.cta-content {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 1;
}

.cta-title {
    font-size: 1.7rem;
    font-weight: 800;
    color: white;
    margin-bottom: 0.75rem;
    animation: fadeInUp 0.8s ease-out 1.6s backwards;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cta-text {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 1.4rem;
    line-height: 1.6;
    animation: fadeInUp 0.8s ease-out 1.7s backwards;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: white;
    color: #1864FF;
    padding: 1.25rem 2.5rem;
    border-radius: 14px;
    font-size: 1.125rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.8s ease-out 1.8s backwards;
}

.cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(107, 163, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.cta-button:hover::before {
    left: 100%;
}

.cta-button:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    color: #1864FF;
}

.cta-button:active {
    transform: translateY(-2px) scale(1.02);
}

.button-icon-arrow {
    width: 22px;
    height: 22px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button:hover .button-icon-arrow {
    transform: translateX(6px);
    animation: pulse 1s ease-in-out infinite;
}

/* Responsive Design */
@media (max-width: 991px) {
    .contact-grid {
        grid-template-columns: 1fr;
    }

    .info-cards-wrapper {
        order: 2;
    }

    .form-wrapper {
        order: 1;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.25rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .container-contacto {
        width: 95%;
        padding: 1.75rem;
    }

    .form-wrapper {
        padding: 1.75rem;
    }

    .form-title {
        font-size: 1.5rem;
    }

    .info-card {
        padding: 1.25rem;
    }

    .icon-wrapper {
        padding: 0.875rem;
    }

    .icon-img {
        height: 2rem;
        width: 2rem;
    }

    .info-title {
        font-size: 1rem;
    }

    .info-text {
        font-size: 0.875rem;
    }

    .cta-section {
        padding: 3rem 1.5rem;
        margin: 2rem 1rem 0;
    }

    .cta-title {
        font-size: 1.75rem;
    }

    .cta-text {
        font-size: 1rem;
    }

    .submit-button {
        font-size: 1rem;
        padding: 1rem 1.75rem;
    }
}

@media (max-width: 480px) {
    .hero-header {
        padding: 2.5rem 1rem 2rem;
    }

    .hero-title {
        font-size: 1.75rem;
    }

    .container-contacto {
        width: 95%;
        padding: 1.25rem;
    }

    .form-wrapper {
        padding: 1.25rem;
    }

    .form-title {
        font-size: 1.25rem;
    }

    .contact-grid {
        gap: 2rem;
    }

    .submit-button {
        padding: 0.875rem 1.5rem;
        font-size: 0.95rem;
    }

    .cta-section {
        padding: 2.5rem 1.25rem;
    }

    .cta-title {
        font-size: 1.5rem;
    }

    .cta-button {
        padding: 1rem 1.75rem;
        font-size: 1rem;
    }
    
    /* Reduce animations on mobile for performance */
    .form-wrapper::before,
    .container-contacto::before,
    .cta-section::after {
        display: none;
    }
}

/* ============================================
   DARK MODE STYLES
   ============================================ */

/* Main Background */
.dark .profile-page {
    background: #111827;
    background-image: none;
}

.dark main {
    background: #111827;
}

/* Hero Header */
.dark .hero-header {
    background: transparent;
}

.dark .hero-title {
    color: #f3f4f6;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
}

.dark .hero-subtitle {
    color: #d1d5db;
}

/* Contact Container */
.dark .container-contacto {
    background: #1f2937;
    border: 1px solid #374151;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* Info Cards */
.dark .info-card {
    background: #111827;
    border: 1px solid #374151;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .info-card:hover {
    background: #1f2937;
    border-color: #4a5568;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
}

.dark .icon-wrapper {
    background: #1f2937;
    border: 1px solid #374151;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.dark .info-title {
    color: #6ba3ff;
}

.dark .info-text {
    color: #d1d5db;
}

.dark .highlight {
    color: #93c5fd;
}

/* Form Wrapper */
.dark .form-wrapper {
    background: #1f2937;
    border: 1px solid #4a5568;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.dark .form-wrapper::before {
    background: radial-gradient(circle, rgba(107, 163, 255, 0.05) 0%, transparent 70%);
}

.dark .form-title {
    background: linear-gradient(135deg, #6ba3ff 0%, #93c5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.dark .form-title::after {
    background: linear-gradient(90deg, #6ba3ff, #93c5fd);
}

.dark .form-label {
    color: #d1d5db;
}

.dark .form-group:focus-within .form-label {
    color: #93c5fd;
}

/* Form Inputs */
.dark .form-input,
.dark .form-textarea {
    background: #111827 !important;
    color: #f3f4f6 !important;
    border-color: #4a5568;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .form-input:hover,
.dark .form-textarea:hover {
    border-color: #6b7280;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.dark .form-input:focus,
.dark .form-textarea:focus {
    background: #1f2937 !important;
    border-color: #93c5fd;
    box-shadow: 0 8px 24px rgba(147, 197, 253, 0.2), 0 0 0 4px rgba(147, 197, 253, 0.1);
}

.dark .form-input::placeholder,
.dark .form-textarea::placeholder {
    color: #9ca3af;
}

/* Submit Button */
.dark .submit-button {
    background: linear-gradient(135deg, #1864FF 0%, #6ba3ff 100%);
    box-shadow: 0 12px 30px rgba(24, 100, 255, 0.4);
}

.dark .submit-button:hover {
    box-shadow: 0 20px 40px rgba(24, 100, 255, 0.5);
}

.dark .submit-button:active {
    box-shadow: 0 8px 20px rgba(24, 100, 255, 0.4);
}

/* CTA Section */
.dark .cta-section {
    background: #111827;
    border: 1px solid #374151;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
}

.dark .cta-section::before {
    background: radial-gradient(circle at top right, rgba(107, 163, 255, 0.08) 0%, transparent 50%),
                radial-gradient(circle at bottom left, rgba(79, 143, 247, 0.05) 0%, transparent 50%);
}

.dark .cta-title {
    color: #f3f4f6;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.dark .cta-text {
    color: #d1d5db;
}

/* CTA Button - White background with blue text for contrast */
.dark .cta-button {
    background: white;
    color: #1864FF;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.dark .cta-button::before {
    background: linear-gradient(90deg, transparent, rgba(24, 100, 255, 0.1), transparent);
}

.dark .cta-button:hover {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    color: #1864FF;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
}
</style>