<template>
    <div>
        <navbar />
        <main>

            <!-- Instagram Embed Section -->
            <section class="instagram-embed-section">
                <div class="embed-container">
                    <div class="embed-wrapper">
                        <iframe 
                            src="https://www.instagram.com/juris.search/embed" 
                            class="frame-instagram" 
                            frameborder="0"
                            scrolling="yes" 
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                    </div>
                </div>
            </section>
        </main>
        <footer-component />
    </div>
</template>

<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";

export default {
    name: "Publicaciones",
    components: {
        Navbar,
        FooterComponent,
    },
};
</script>

<style scoped>
/* Hero Instagram Section */
.hero-instagram {
    background: linear-gradient(135deg, #f084d4 0%, #8a3ab9 50%, #bc2a8d 75%, #e95950 100%);
    padding: 3.5rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-instagram::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 1;
    animation: slide 20s linear infinite;
}

@keyframes slide {
    0% { transform: translate(0, 0); }
    100% { transform: translate(60px, 60px); }
}

.hero-content {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.instagram-icon {
    width: 70px;
    height: 70px;
    color: white;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.hero-title {
    font-size: 3rem;
    font-weight: 800;
    color: white;
    margin-bottom: 1rem;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.hero-subtitle strong {
    font-weight: 700;
    color: white;
}

.instagram-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: white;
    color: #bc2a8d;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.instagram-button:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.95);
}

/* Instagram Embed Section */
.instagram-embed-section {
    background-image: url("../assets/img/backgrounds/bg-contacto.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    padding: 3rem 2rem;
    min-height: 600px;
}

.embed-container {
    max-width: 1200px;
    margin: 0 auto;
}

.embed-wrapper {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.frame-instagram {
    width: 100%;
    height: 800px;
    border: none;
    border-radius: 16px;
    display: block;
}

/* CTA Section */
.cta-section-instagram {
    background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
    padding: 4rem 2rem;
    position: relative;
    overflow: hidden;
}

.cta-section-instagram::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(240, 132, 212, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
}

@keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.cta-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 1;
}

.cta-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, #f084d4 0%, #3B82F6 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 25px rgba(240, 132, 212, 0.3);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.cta-icon svg {
    width: 45px;
    height: 45px;
    color: white;
}

.cta-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.cta-subtitle {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    margin-bottom: 2.5rem;
    max-width: 650px;
    margin-left: auto;
    margin-right: auto;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, #f084d4 0%, #3B82F6 100%);
    color: white;
    padding: 1.2rem 3rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 30px rgba(240, 132, 212, 0.4);
    position: relative;
    overflow: hidden;
}

.cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
}

.cta-button:hover::before {
    left: 100%;
}

.cta-button:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 40px rgba(240, 132, 212, 0.6);
}

.cta-button span {
    position: relative;
    z-index: 1;
}

/* Responsive */
@media (max-width: 768px) {
    .hero-instagram {
        padding: 2.5rem 1.5rem;
    }

    .icon-wrapper {
        width: 90px;
        height: 90px;
    }

    .instagram-icon {
        width: 50px;
        height: 50px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .instagram-button {
        padding: 0.875rem 2rem;
        font-size: 0.95rem;
    }

    .instagram-embed-section {
        padding: 2rem 1rem;
    }

    .embed-wrapper {
        border-radius: 16px;
        padding: 1rem;
    }

    .frame-instagram {
        height: 600px;
        border-radius: 12px;
    }

    .cta-section-instagram {
        padding: 3rem 1.5rem;
    }

    .cta-icon {
        width: 70px;
        height: 70px;
    }

    .cta-icon svg {
        width: 38px;
        height: 38px;
    }

    .cta-title {
        font-size: 1.75rem;
    }

    .cta-subtitle {
        font-size: 1rem;
    }

    .cta-button {
        padding: 1rem 2rem;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 1.75rem;
    }

    .frame-instagram {
        height: 500px;
    }

    .cta-title {
        font-size: 1.5rem;
    }
}

/* Dark Mode Styles */
.dark .instagram-embed-section {
    background: #111827;
}

.dark .embed-wrapper {
    background: rgba(31, 41, 55, 0.95);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
}

.dark main {
    background: #111827;
}
</style>
