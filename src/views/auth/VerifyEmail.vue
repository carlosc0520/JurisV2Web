<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe]">
    <div class="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
      <div v-if="estado === 'cargando'" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 border-4 border-[#185CE6] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-600 font-medium">Verificando tu correo...</p>
      </div>

      <div v-else-if="estado === 'error'" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-800">Enlace inválido</h3>
        <p class="text-gray-500 text-sm">El enlace de verificación ha expirado o no es válido. Intenta registrarte nuevamente.</p>
        <button
          @click="$router.push('/auth/register')"
          class="mt-2 px-6 py-2 bg-[#185CE6] text-white rounded-full font-semibold text-sm hover:opacity-90 transition"
        >
          Volver al registro
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VerifyEmail',
  data() {
    return { estado: 'cargando' };
  },
  async mounted() {
    const token = this.$route.params.token;
    if (!token) {
      this.estado = 'error';
      return;
    }
    try {
      // El backend hace redirect al login, axios lo sigue y devuelve HTML — ignoramos el body.
      // Si llega aquí sin error, el backend procesó correctamente y redirigió al login.
      await axios.get(`/login/verify-email/${token}`);
      // Si axios siguió el redirect y llegó al frontend login (HTML), la cuenta ya fue activada.
      this.$router.replace('/auth/login?verified=true');
    } catch {
      this.estado = 'error';
    }
  },
};
</script>
