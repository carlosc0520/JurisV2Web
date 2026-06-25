<template>
  <div class="form-login min-h-[100dvh] flex flex-col justify-center max-sm:justify-around items-center py-5 max-sm:py-2.5 relative z-[1] dark:bg-gray-900">
    <div class="flex justify-between items-center mb-4 px-5 w-full">
      <img src="@/assets/img/logos/logo-full.png" @click="$router.push('/')" alt="Logo" class="h-10 cursor-pointer" />
      <div class="flex items-center gap-3">
        <div v-if="siteConfig.ALLOW_REGISTER" class="text-sm">
          <span class="text-gray-600 dark:text-gray-300 max-sm:hidden">¿No tienes una cuenta?</span>
          <button @click="$router.push('/auth/register')" class="ml-2 bg-gradient-to-br from-[#DF2DB2] to-[#E71FB3] text-white py-2.5 max-sm:py-2 px-5 max-sm:px-4 rounded-full border-none cursor-pointer transition-all duration-300 font-semibold text-sm max-sm:text-[13px] shadow-[0_4px_12px_rgba(231,31,179,0.25)] font-['Lato'] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(231,31,179,0.35)] dark:shadow-[0_4px_12px_rgba(231,31,179,0.5)]">
            Regístrate
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 p-8 max-sm:p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)] w-[500px] max-sm:w-[90%] backdrop-blur-[10px]">
      <h3 class="text-[28px] max-sm:text-2xl font-bold text-center text-gray-500 dark:text-gray-100 mb-6 font-['Lato']">Ingresa a tu cuenta</h3>

      <div v-if="siteConfig.ALLOW_OAUTH_LOGIN" class="flex flex-col gap-3">
        <button class="flex items-center justify-center gap-2.5 w-full px-4 py-3 border-2 border-slate-200 dark:border-gray-700 rounded-full text-sm font-semibold text-[#4a5568] dark:text-gray-200 bg-white dark:bg-gray-900 font-['Lato'] transition-all duration-300 cursor-pointer hover:border-gray-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)] dark:hover:border-gray-600 dark:hover:shadow-[0_4px_12px_rgba(139,92,246,0.4)]"
          @click="loginWithGoogle">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" class="w-5 h-5">
          Ingresar con Google
        </button>
        <button class="flex items-center justify-center gap-2.5 w-full px-4 py-3 border-2 border-slate-200 dark:border-gray-700 rounded-full text-sm font-semibold text-[#4a5568] dark:text-gray-200 bg-white dark:bg-gray-900 font-['Lato'] transition-all duration-300 cursor-pointer hover:border-gray-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)] dark:hover:border-gray-600 dark:hover:shadow-[0_4px_12px_rgba(139,92,246,0.4)]"
          @click="loginWithLinkedin">
          <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn Logo" class="w-5 h-5">
          Ingresar con LinkedIn
        </button>
      </div>

      <div v-if="siteConfig.ALLOW_OAUTH_LOGIN" class="separator-line flex items-center my-5 text-[13px] text-[#718096] dark:text-gray-400 font-medium font-['Lato']">
        <span>o iniciar sesión con</span>
      </div>

      <form class="flex flex-col gap-3 w-full">
        <div class="input-group flex items-center border-2 border-slate-200 dark:border-gray-700 rounded-full px-[18px] py-3 transition-all duration-300 bg-white dark:bg-gray-900 mb-0"
          :class="{ error: errors.EMAIL }">
          <img src="@/assets/img/icons/email.svg" alt="Email Icon" class="w-[18px] h-[18px] mr-2 dark:brightness-0 dark:invert dark:opacity-80">
          <input type="email" placeholder="Correo electrónico" autocomplete="email" v-model="form.EMAIL"
            @blur="sanitizeEmail" maxlength="100"
            class="input-field flex-1 border-none outline-none bg-transparent text-[15px] text-[#2d3748] dark:text-gray-100 font-['Lato'] font-medium">
        </div>

        <div class="input-group flex items-center border-2 border-slate-200 dark:border-gray-700 rounded-full px-[18px] py-3 transition-all duration-300 bg-white dark:bg-gray-900 mb-0"
          :class="{ error: errors.PASSWORD }">
          <img src="@/assets/img/icons/look.svg" alt="Password Icon" class="w-[18px] h-[18px] mr-2 dark:brightness-0 dark:invert dark:opacity-80">
          <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña" id="password" v-model="form.PASSWORD"
            autocomplete="current-password" maxlength="128" @paste.prevent="handlePasswordPaste"
            class="input-field flex-1 border-none outline-none bg-transparent text-[15px] text-[#2d3748] dark:text-gray-100 font-['Lato'] font-medium">
          <button type="button" class="ml-2 bg-transparent border-none cursor-pointer p-0 flex-shrink-0" @click="togglePassword">
            <img v-if="!showPassword" src="@/assets/img/icons/eye.svg" alt="" class="w-[18px] h-[18px] opacity-60 transition-opacity hover:opacity-100 dark:brightness-0 dark:invert dark:opacity-70" />
            <img v-else src="@/assets/img/icons/eye-look.svg" alt="" class="w-[18px] h-[18px] opacity-60 transition-opacity hover:opacity-100 dark:brightness-0 dark:invert dark:opacity-70" />
          </button>
        </div>

        <div class="flex justify-between items-center my-2 text-sm">
          <label class="font-['Lato'] font-light"></label>
          <button type="button"
            class="text-[13px] text-purple-500 dark:text-purple-400 transition-colors duration-200 font-medium bg-transparent border-none cursor-pointer font-['Lato'] hover:text-[#DF2DB2] dark:hover:text-pink-400 hover:underline"
            @click.prevent="modalRecuperarContrasena.show = true">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="button" @click.prevent="signIn" :disabled="isloading"
          class="submit-btn w-full bg-gradient-to-br from-[#DF2DB2] via-purple-500 to-[#185CE6] text-white text-[15px] font-bold py-[14px] rounded-full border-none cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(139,92,246,0.3)] dark:shadow-[0_4px_12px_rgba(139,92,246,0.6)] font-['Lato'] tracking-[0.3px] mt-3"
          :class="{ 'opacity-50 cursor-not-allowed': isloading }">
          {{ isloading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>
      </form>

      <!-- Banner: email pendiente de verificación -->
      <div v-if="emailNoVerificado" class="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-3">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        <div>
          <p class="font-semibold">Correo pendiente de verificación</p>
          <p class="text-amber-700 mt-0.5">Revisa la bandeja de <strong>{{ emailNoVerificado }}</strong> y haz clic en el enlace de activación.</p>
        </div>
      </div>

      <ModalRecuperarContrasena :show="modalRecuperarContrasena.show"
        :close="() => modalRecuperarContrasena.show = false" :update="() => { }" />
    </div>

    <div class="flex md:flex-row gap-2 flex-col justify-between items-center mt-4 px-5 text-sm w-full">
      <span style="color: #727370">© {{ new Date().getFullYear() }} Todos los derechos reservados</span>
      <div class="flex gap-4">
        <a @click.prevent="$router.push('/politicas&privacidad')" class="hover:underline text-[#262626] underline cursor-pointer">Políticas de Privacidad</a>
        <a @click.prevent="$router.push('/cookies')" class="hover:underline text-[#262626] underline cursor-pointer">Políticas de Cookies</a>
      </div>
    </div>
  </div>
</template>

<script>
import LoginProxy from "@/proxies/LoginProxy";
import ModalRecuperarContrasena from "./Modales/ModalRecuperarContrasena.vue";
import { toast } from 'vue3-toastify';
import UserProxy from "@/proxies/UserProxy";

export default {
  components: {
    ModalRecuperarContrasena
  },
  data() {
    return {
      showPassword: false,
      rememberMe: false,
      isloading: false,
      loginAttempts: 0,
      maxLoginAttempts: 5,
      lastAttemptTime: null,
      errors: { EMAIL: null, PASSWORD: null },
      emailNoVerificado: null,   // email del usuario cuando CODE=EMAIL_NOT_VERIFIED
      modalRecuperarContrasena: {
        show: false,
        data: null,
      },
      form: {
        EMAIL: '',
        PASSWORD: '',
      },
      urlApi: process.env.VUE_APP_API_URL || 'https://api.jurissearch.com',
      siteConfig: {
        ALLOW_REGISTER: true,
        ALLOW_OAUTH_LOGIN: true,
      },
    };
  },
  methods: {
    sanitizeEmail() {
      if (this.form.EMAIL) {
        this.form.EMAIL = this.form.EMAIL.trim().toLowerCase();
      }
    },
    containsDangerousChars(str) {
      const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+=/i, /<iframe/i, /<object/i, /<embed/i];
      return dangerousPatterns.some(pattern => pattern.test(str));
    },
    handlePasswordPaste(e) {
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      if (pastedText) {
        this.form.PASSWORD = pastedText.trim();
      }
    },
    checkRateLimit() {
      const now = Date.now();
      if (this.lastAttemptTime && (now - this.lastAttemptTime) > 900000) {
        this.loginAttempts = 0;
      }
      if (this.loginAttempts >= this.maxLoginAttempts) {
        const waitTime = Math.ceil((900000 - (now - this.lastAttemptTime)) / 60000);
        toast.error(`Demasiados intentos fallidos. Intente nuevamente en ${waitTime} minutos.`);
        return false;
      }
      return true;
    },
    async signIn() {
      if (this.isloading) return;
      if (!this.checkRateLimit()) return;

      this.errors = { EMAIL: null, PASSWORD: null };
      const emailVal = this.form.EMAIL?.trim().toLowerCase() || '';
      const pwdVal   = this.form.PASSWORD || '';
      if (!emailVal || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailVal)) {
        this.errors.EMAIL = 'Email no válido';
      }
      if (!pwdVal || pwdVal.length < 6 || pwdVal.length > 128) {
        this.errors.PASSWORD = 'La contraseña debe tener entre 6 y 128 caracteres';
      }
      if (this.errors.EMAIL || this.errors.PASSWORD) {
        toast.error('Por favor, corrija los errores del formulario');
        return;
      }

      const emailSanitized = this.form.EMAIL?.trim().toLowerCase();
      const passwordSanitized = this.form.PASSWORD?.trim();

      if (!emailSanitized || !passwordSanitized) {
        toast.error('Credenciales inválidas');
        return;
      }
      if (this.containsDangerousChars(emailSanitized) || this.containsDangerousChars(passwordSanitized)) {
        toast.error('Caracteres no permitidos detectados');
        return;
      }
      if (emailSanitized.length < 5 || passwordSanitized.length < 6) {
        toast.error('Credenciales inválidas');
        return;
      }

      this.isloading = true;
      this.lastAttemptTime = Date.now();

      const loginData = {
        EMAIL: emailSanitized,
        PASSWORD: passwordSanitized,
      };

      LoginProxy.login(loginData)
        .then((response) => {
          if (response?.status == 201 || response?.status == 200) {
            // Soporta respuesta directa { TOKEN } y nueva { STATUS, DATA: { accessToken } }
            const payload = response.data?.DATA ?? response.data;

            const accessToken  = payload?.accessToken  || payload?.TOKEN;
            const refreshToken = payload?.refreshToken || payload?.REFRESH_TOKEN;

            if (!accessToken  || accessToken.length  < 20) throw new Error('Respuesta inválida del servidor');
            if (!refreshToken || refreshToken.length < 20) throw new Error('Refresh token inválido recibido');

            // Extraer info del usuario desde el JWT (sin librería externa)
            let NOMBRES = '', EMAIL = '', RTAFTO = '', jwtRole = null;
            try {
              const jwtPayload = JSON.parse(atob(accessToken.split('.')[1]));
              NOMBRES = jwtPayload.NAME || jwtPayload.NOMBRES || '';
              EMAIL   = jwtPayload.EMAIL || '';
              RTAFTO  = jwtPayload.RTAFTO || '';
              jwtRole = jwtPayload.role ?? jwtPayload.IDR ?? null;
            } catch (_) { /* JWT mal formado — se ignora */ }

            const sanitizedUser = {
              NOMBRES: this.sanitizeForStorage(NOMBRES),
              EMAIL:   this.sanitizeForStorage(EMAIL),
              RTAFTO:  this.sanitizeForStorage(RTAFTO),
            };

            this.loginAttempts = 0;
            this.errors = { EMAIL: null, PASSWORD: null };
            this.emailNoVerificado = null;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(sanitizedUser));
            toast.success('Inicio de sesión exitoso');
            // Si viene con redirect desde landing (ej: ?redirect=/usuario/subscripcion&plan=9)
            const redirectTo = this.$route.query.redirect;
            const planId     = this.$route.query.plan;
            if (redirectTo && jwtRole === 2) {
              this.$router.push(planId ? `${redirectTo}?plan=${planId}` : redirectTo);
            } else {
              this.$router.push('/redirect');
            }
          } else {
            throw new Error('Código de respuesta inesperado');
          }
        })
        .catch((err) => {
          this.loginAttempts++;
          const errorData = err?.response?.data?.message || err?.response?.data || err;
          const code = errorData?.CODE || err?.CODE;
          if (code === 'EMAIL_NOT_VERIFIED') {
            this.emailNoVerificado = this.form.EMAIL;
            toast.warning('Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.', { autoClose: 6000 });
          } else {
            toast.error(this.getErrorMessage(errorData));
          }
        })
        .finally(() => { this.isloading = false; });
    },
    sanitizeForStorage(value) {
      if (!value) return '';
      return String(value).replace(/<[^>]*>/g, '').trim();
    },
    sanitizeForDisplay(value) {
      if (!value) return '';
      return String(value).replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]*>/g, '').trim();
    },
    getErrorMessage(err) {
      if (!err) return 'Error al iniciar sesión';
      let message = err?.MESSAGE ||
                    err?.response?.data?.message?.MESSAGE ||
                    err?.response?.data?.MESSAGE ||
                    err?.message ||
                    'Error al iniciar sesión';
      message = this.sanitizeForDisplay(message);
      if (message.length > 200) message = message.substring(0, 200) + '...';
      return message;
    },
    async loginWithGoogle() {
      window.location.href = `${this.urlApi}/auth/google`;
    },
    async loginWithLinkedin() {
      window.location.href = `${this.urlApi}/auth/linkedin`;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
  async mounted() {
    LoginProxy.siteConfig().then(cfg => { if (cfg) this.siteConfig = { ...this.siteConfig, ...cfg }; }).catch(() => {});
    localStorage.removeItem('isLoggingOut');

    const urlParams = new URLSearchParams(window.location.search);

    // Verificación de correo completada — backend redirige aquí con ?verified=true/false
    const verified = urlParams.get('verified');
    if (verified === 'true') {
      toast.success('¡Correo verificado! Ya puedes iniciar sesión.', { autoClose: 5000 });
      const planId = urlParams.get('plan');
      // Si venía con plan, mantenerlo en la URL para que el redirect post-login lo use
      if (planId) {
        this.$router.replace({ path: '/auth/login', query: { redirect: '/usuario/subscripcion', plan: planId } });
      } else {
        this.$router.replace('/auth/login');
      }
      return;
    }
    if (verified === 'false') {
      toast.error('El enlace de verificación es inválido o ha expirado. Por favor regístrate nuevamente.', { autoClose: 7000 });
      this.$router.replace('/auth/login');
      return;
    }
    const success = urlParams.get('onsuccess');
    const logout = urlParams.get('logout');

    if (logout === 'true') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      this.$router.replace('/auth/login');
      return;
    }

    if (success) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }

    if (success) {
      this.$router.replace('/auth/login');
      const message = urlParams.get('message');

      if (success === 'true') {
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');

        if (!accessToken || accessToken.length < 20 || accessToken.length > 2000) {
          this.$swal({ title: "Error", text: "Token inválido", icon: "error", buttons: false });
          return;
        }

        const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
        if (!jwtRegex.test(accessToken)) {
          this.$swal({ title: "Error", text: "Token con formato inválido", icon: "error", buttons: false });
          return;
        }
        if (refreshToken && !jwtRegex.test(refreshToken)) {
          this.$swal({ title: "Error", text: "Refresh token con formato inválido", icon: "error", buttons: false });
          return;
        }

        try {
          const response = await UserProxy.validateTokenGoogle(accessToken);

          if (response && response.STATUS) {
            const user = urlParams.get('user');
            try {
              const userData = JSON.parse(decodeURIComponent(user));
              const sanitizedUser = {
                NOMBRES: this.sanitizeForStorage(userData.NOMBRES),
                EMAIL: this.sanitizeForStorage(userData.EMAIL),
                RTAFTO: this.sanitizeForStorage(userData.RTAFTO)
              };
              this.$swal({ title: "¡Éxito!", text: "Has iniciado sesión correctamente.", icon: "success", buttons: false })
                .then(() => {
                  localStorage.setItem('accessToken', accessToken);
                  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
                  localStorage.setItem('user', JSON.stringify(sanitizedUser));
                  this.$router.push('/redirect');
                });
            } catch (parseError) {
              throw new Error('Datos de usuario inválidos');
            }
          } else {
            throw new Error(response?.MESSAGE || 'Token inválido o expirado');
          }
        } catch (error) {
          this.$swal({
            title: "Error",
            text: this.sanitizeForDisplay(error?.MESSAGE || error?.message || "Token inválido o expirado"),
            icon: "error",
            buttons: false,
          });
        }
      } else {
        this.$swal({
          title: "Error",
          text: this.sanitizeForDisplay(message) || "Error en la autenticación",
          icon: "error",
          buttons: false,
        });
      }
    }
  },
};
</script>

<style scoped>
/* ── Fondo mesh gradient neutro (legal-tech) ───────────────────────── */
.form-login {
  background-color: #f0f4ff;
  background-image:
    radial-gradient(ellipse 85% 65% at 0%   0%,  rgba( 24, 92,230, .13) 0%, transparent 55%),
    radial-gradient(ellipse 65% 80% at 100%  5%,  rgba( 99,102,241, .11) 0%, transparent 55%),
    radial-gradient(ellipse 55% 55% at 50% 110%,  rgba( 14,165,233, .10) 0%, transparent 55%),
    radial-gradient(ellipse 45% 40% at 80%  75%,  rgba( 79, 70,229, .08) 0%, transparent 50%),
    radial-gradient(ellipse 40% 50% at 10%  85%,  rgba( 99,102,241, .08) 0%, transparent 50%);
  position: relative;
  isolation: isolate;
}

.form-login::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(circle 560px at 5%  15%, rgba( 24, 92,230, .16) 0%, transparent 70%),
    radial-gradient(circle 440px at 95%  8%, rgba( 99,102,241, .14) 0%, transparent 70%),
    radial-gradient(circle 400px at 50% 98%, rgba( 14,165,233, .12) 0%, transparent 70%);
  animation: orb-drift 20s ease-in-out infinite alternate;
}

.form-login::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(circle 320px at 78% 58%, rgba( 79, 70,229, .09) 0%, transparent 70%),
    radial-gradient(circle 280px at 18% 70%, rgba( 14,165,233, .09) 0%, transparent 70%);
  animation: orb-drift 28s ease-in-out infinite alternate-reverse;
}

@keyframes orb-drift {
  0%   { transform: translate(  0px,   0px) scale(1);    }
  33%  { transform: translate( 20px, -14px) scale(1.04); }
  66%  { transform: translate(-12px,  18px) scale(.97);  }
  100% { transform: translate( 16px,  10px) scale(1.02); }
}

/* Dark mode */
.dark .form-login {
  background-color: #080c1a;
  background-image:
    radial-gradient(ellipse 80% 60% at 0%   0%, rgba( 24, 92,230, .10) 0%, transparent 55%),
    radial-gradient(ellipse 60% 75% at 100%  5%, rgba( 99,102,241, .08) 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 105%, rgba( 14,165,233, .07) 0%, transparent 55%);
}
.dark .form-login::before {
  background:
    radial-gradient(circle 560px at 5%  15%, rgba( 24, 92,230, .12) 0%, transparent 70%),
    radial-gradient(circle 440px at 95%  8%, rgba( 99,102,241, .10) 0%, transparent 70%),
    radial-gradient(circle 400px at 50% 98%, rgba( 14,165,233, .08) 0%, transparent 70%);
}
.dark .form-login::after {
  background:
    radial-gradient(circle 320px at 78% 58%, rgba( 79, 70,229, .07) 0%, transparent 70%),
    radial-gradient(circle 280px at 18% 70%, rgba( 14,165,233, .07) 0%, transparent 70%);
}

/* Separador con pseudo-elementos */
.separator-line::before,
.separator-line::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cbd5e0, transparent);
  margin: 0 12px;
}
.dark .separator-line::before,
.dark .separator-line::after {
  background: linear-gradient(90deg, transparent, #4a5568, transparent);
}

/* Input placeholder */
.input-field::placeholder { color: #a0aec0; font-weight: 400; }
.dark .input-field::placeholder { color: #6b7280; }

/* Input group focus/error states (requieren :focus-within y .error) */
.input-group:focus-within {
  border-color: #6b7280;
  box-shadow: 0 0 0 4px rgba(107, 114, 128, 0.1);
  transform: translateY(-1px);
}
.input-group.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}
.dark .input-group:focus-within {
  border-color: #9ca3af;
  box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.2);
}
.dark .input-group.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.25);
}

/* Submit button hover (no hay equivalente Tailwind para :not(:disabled)) */
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
}
.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}
.dark .submit-btn:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.7);
}
</style>
