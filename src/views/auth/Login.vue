<template>
  <div class="form-login">
    <div class="flex justify-between items-center mb-4 px-5" style="width: 100%;">
      <img src="@/assets/img/logos/logo-full.png" @click="$router.push('/')" alt="Logo" class="h-10 cursor-pointer" />
      <div class="flex items-center gap-3">
        <!-- <button type="button" @click.stop="toggleDarkMode" class="theme-toggle-btn" title="Cambiar tema">
          <svg v-if="isDarkMode" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button> -->
        <div class="text-sm">
          <span class="text-gray-600 no-tener-cuenta">¿No tienes una cuenta?</span>
          <!-- @click.prevent="$router.push('/auth/register')" -->
          <button 
            class="btn-registrate ml-2">Regístrate</button>
        </div>
      </div>
    </div>

    <div class="bg-white p-8 rounded-xl shadow-modern w-5/6 form-login-with">
      <h3 class="text-lato-700 text-center login-title">Ingresa a tu cuenta</h3>
      <div class="social-buttons mt-4">
        <button class="social-btn" @click="loginWithGoogle">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" class="icon">
          Ingresar con Google
        </button>

        <button class="social-btn" @click="loginWithLinkedin">
          <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn Logo" class="icon">
          Ingresar con LinkedIn
        </button>
      </div>

      <div class="separator">
        <span>o iniciar sesión con</span>
      </div>

      <form class="mt-4">
        <div class="input-group" :class="{ error: validation.hasError('form.EMAIL') }">
          <img src="@/assets/img/icons/email.svg" alt="Email Icon" class="input-icon">
          <input type="email" placeholder="Correo electrónico" autocomplete="email" v-model="form.EMAIL"
            @blur="sanitizeEmail" maxlength="100" class="input-field">
        </div>

        <div class="input-group" :class="{ error: validation.hasError('form.PASSWORD') }">
          <img src="@/assets/img/icons/look.svg" alt="Password Icon" class="input-icon">
          <input placeholder="Contraseña" class="input-field" id="password" :type="showPassword ? 'text' : 'password'"
            v-model="form.PASSWORD" autocomplete="current-password" maxlength="128" @paste.prevent="handlePasswordPaste">
          <button type="button" class="eye-icon" @click="togglePassword">
            <img v-if="!showPassword" src="@/assets/img/icons/eye.svg" alt="Eye Open Icon" class="eye-icon">
            <img v-else src="@/assets/img/icons/eye-look.svg" alt="Eye Close Icon" class="eye-icon">
          </button>
        </div>

        <div class="options">
          <label class="remember-me text-lato-200">
          </label>
          <button type="button" class="forgot-password text-lato-200"
            @click.prevent="modalRecuperarContrasena.show = true">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="button" @click.prevent="signIn" :disabled="isloading" class="submit-btn mt-3 text-lato" :class="{ 'opacity-50 cursor-not-allowed': isloading }">
          {{ isloading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>
      </form>

      <ModalRecuperarContrasena :show="modalRecuperarContrasena.show"
        :close="() => modalRecuperarContrasena.show = false" :update="() => { }" />

      <LoadingOverlay :active="isloading" :is-full-page="false" :loader="'bars'" />
    </div>

    <div class="flex md:flex-row gap-2 flex-col justify-between items-center mt-4 px-5 text-sm" style="width: 100%">
      <span style="color: #727370">© {{ new Date().getFullYear() }} Todos los derechos reservados</span>
      <div class="flex gap-4">
        <a @click.prevent="$router.push('/politicas&privacidad')"
          class="hover:underline text-gray-600 underline cursor-pointer" style="color: #262626">Políticas de
          Privacidad</a>
        <a @click.prevent="$router.push('/cookies')" class="hover:underline text-gray-600 underline cursor-pointer"
          style="color: #262626">Políticas de Cookies</a>
      </div>
    </div>
  </div>
</template>



<script>
import github from "@/assets/img/github.svg";
import google from "@/assets/img/google.svg";
import logoJuris from "@/assets/img/logos/logo-completo.png";
import LoginProxy from "../../proxies/LoginProxy";
import registerBg2 from "@/assets/img/register_bg_2.png";
import ModalRecuperarContrasena from "./Modales/ModalRecuperarContrasena.vue";
import { mapGetters, mapActions } from 'vuex';

// FUNCTIONS
import { toast } from 'vue3-toastify';
import { Validator } from 'simple-vue-validator';
import UserProxy from "../../proxies/UserProxy";

export default {
  components: {
    ModalRecuperarContrasena
  },
  data() {
    return {
      showPassword: false,
      github,
      google,
      logoJuris,
      registerBg2,

      rememberMe: false,
      isloading: false,
      currentNoticia: 0,
      loginAttempts: 0,
      maxLoginAttempts: 5,
      lastAttemptTime: null,

      modalRecuperarContrasena: {
        show: false,
        data: null,
      },
      form: {
        EMAIL: '',
        PASSWORD: '',
        IND: null,
        BANDERA: false
      },
      // urlApi: 'http://localhost:3000'
      urlApi: 'https://api.jurissearch.com'
    };
  },
  computed: {
    ...mapGetters('theme', ['isDarkMode'])
  },
  validators: {
    'form.EMAIL': function (value) {
      return Validator.value(value)
        .required("Campo requerido")
        .email("Email no válido")
        .maxLength(100, "Email demasiado largo")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Formato de email inválido");
    },
    'form.PASSWORD': function (value) {
      return Validator.value(value)
        .required("Campo requerido")
        .minLength(6, "La contraseña debe tener al menos 6 caracteres")
        .maxLength(128, "La contraseña es demasiado larga");
    }
  },
  methods: {
    // Sanitizar email
    sanitizeEmail() {
      if (this.form.EMAIL) {
        this.form.EMAIL = this.form.EMAIL.trim().toLowerCase();
      }
    },

    // Validar caracteres peligrosos
    containsDangerousChars(str) {
      const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+=/i, /<iframe/i, /<object/i, /<embed/i];
      return dangerousPatterns.some(pattern => pattern.test(str));
    },

    // Manejar pegado de contraseña
    handlePasswordPaste(e) {
      // Permitir pegar pero sanitizar
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      if (pastedText) {
        this.form.PASSWORD = pastedText.trim();
      }
    },

    // Validar rate limiting
    checkRateLimit() {
      const now = Date.now();
      
      // Resetear intentos si pasó más de 15 minutos
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
      // Prevenir doble click
      if (this.isloading) return;

      // Validar rate limiting
      if (!this.checkRateLimit()) return;

      // Validar formulario
      let validate = await this.$validate();
      if (!validate) {
        toast.error('Por favor, corrija los errores del formulario');
        return;
      }

      // Sanitizar inputs antes de enviar
      const emailSanitized = this.form.EMAIL?.trim().toLowerCase();
      const passwordSanitized = this.form.PASSWORD?.trim();

      // Validar que no estén vacíos después de sanitizar
      if (!emailSanitized || !passwordSanitized) {
        toast.error('Credenciales inválidas');
        return;
      }

      // Validar caracteres peligrosos
      if (this.containsDangerousChars(emailSanitized) || this.containsDangerousChars(passwordSanitized)) {
        toast.error('Caracteres no permitidos detectados');
        return;
      }

      // Validar longitud mínima
      if (emailSanitized.length < 5 || passwordSanitized.length < 6) {
        toast.error('Credenciales inválidas');
        return;
      }

      this.isloading = true;
      this.lastAttemptTime = Date.now();

      const loginData = {
        ...this.form,
        EMAIL: emailSanitized,
        PASSWORD: passwordSanitized,
        USER: emailSanitized
      };

      LoginProxy.login(loginData)
        .then((response) => {
          if (response?.status == 201 || response?.status == 200) {
            // Validar respuesta del servidor
            if (!response.data || !response.data.TOKEN) {
              throw new Error('Respuesta inválida del servidor');
            }

            let { TOKEN, REFRESH_TOKEN, NOMBRES, EMAIL, RTAFTO } = response.data;

            // Validar que el token tenga formato esperado
            if (!TOKEN || TOKEN.length < 20) {
              throw new Error('Token inválido recibido');
            }

            // Validar refresh token
            if (!REFRESH_TOKEN || REFRESH_TOKEN.length < 20) {
              throw new Error('Refresh token inválido recibido');
            }

            // Sanitizar datos antes de almacenar
            const sanitizedUser = {
              NOMBRES: this.sanitizeForStorage(NOMBRES),
              EMAIL: this.sanitizeForStorage(EMAIL),
              RTAFTO: this.sanitizeForStorage(RTAFTO)
            };

            // Resetear intentos fallidos
            this.loginAttempts = 0;

            // Almacenar tokens y datos de usuario
            localStorage.setItem('accessToken', TOKEN);
            localStorage.setItem('refreshToken', REFRESH_TOKEN);
            localStorage.setItem('user', JSON.stringify(sanitizedUser));
            
            toast.success('Inicio de sesión exitoso');
            this.$router.push('/redirect');
          } else {
            throw new Error('Código de respuesta inesperado');
          }
        })
        .catch((err) => {
          // Incrementar intentos fallidos
          this.loginAttempts++;

          // Extraer datos del error (NestJS envía en response.data.message)
          const errorData = err?.response?.data?.message || err?.response?.data || err;

          if (errorData?.OPTION == 1) {
            this.$swal({
              title: this.sanitizeForDisplay(errorData?.MESSAGE) || 'Confirmación requerida',
              text: '¿Confirme si desea continuar?',
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              cancelButtonText: "No, cancelar",
              confirmButtonText: "Sí, continuar",
              dangerMode: true,
            })
              .then((result) => {
                if (result.isConfirmed) {
                  this.form.BANDERA = true;
                  this.loginAttempts--; // No contar este como intento fallido
                  this.signIn();
                }
              })
              .catch((err) => toast.error(this.sanitizeForDisplay(err?.MESSAGE) || 'Error al iniciar sesión'));

            return;
          }

          // Obtener mensaje de error seguro
          const errorMessage = this.getErrorMessage(errorData);
          toast.error(errorMessage);
        })
        .finally(() => {
          this.isloading = false;
        });
    },

    // Sanitizar datos para almacenamiento
    sanitizeForStorage(value) {
      if (!value) return '';
      return String(value).replace(/<[^>]*>/g, '').trim();
    },

    // Sanitizar datos para mostrar
    sanitizeForDisplay(value) {
      if (!value) return '';
      return String(value).replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]*>/g, '').trim();
    },

    // Obtener mensaje de error seguro
    getErrorMessage(err) {
      if (!err) return 'Error al iniciar sesión';
      
      // Extraer mensaje del error (NestJS puede anidar en message)
      let message = err?.MESSAGE || 
                    err?.response?.data?.message?.MESSAGE || 
                    err?.response?.data?.MESSAGE || 
                    err?.message || 
                    'Error al iniciar sesión';
      
      // Sanitizar mensaje
      message = this.sanitizeForDisplay(message);
      
      // Limitar longitud
      if (message.length > 200) {
        message = message.substring(0, 200) + '...';
      }
      
      return message;
    },
    async loginWithGoogle() {
      // return 1
      window.location.href = `${this.urlApi}/auth/google`;
    },
    async loginWithLinkedin() {
      // return 1
      window.location.href = `${this.urlApi}/auth/linkedin`;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    ...mapActions('theme', ['toggleDarkMode']),
  },
  async mounted() {
    this.$store.dispatch('theme/initializeTheme');
    // Siempre limpiar el flag de logout al cargar la página de login
    localStorage.removeItem('isLoggingOut');
    
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('onsuccess');
    const logout = urlParams.get('logout');
    
    // Detectar si vino por sesión expirada
    if (logout === 'true') {
      // Limpiar tokens y URL (ya se mostró la alerta en el interceptor)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      this.$router.replace('/auth/login');
      return;
    }
    
    // Solo limpiar tokens si viene de autenticación OAuth
    if (success) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    
    if (success) {
      // Limpiar query params inmediatamente para evitar ciclos de recarga
      this.$router.replace('/auth/login');
      
      const message = urlParams.get('message');
      
      if (success === 'true') {
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');

        // Validar que el token exista y tenga formato válido
        if (!accessToken || accessToken.length < 20 || accessToken.length > 2000) {
          this.$swal({
            title: "Error",
            text: "Token inválido",
            icon: "error",
            buttons: false,
          });
          return;
        }

        // Validar formato JWT básico
        const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
        if (!jwtRegex.test(accessToken)) {
          this.$swal({
            title: "Error",
            text: "Token con formato inválido",
            icon: "error",
            buttons: false,
          });
          return;
        }

        // Validar refresh token si existe
        if (refreshToken && !jwtRegex.test(refreshToken)) {
          this.$swal({
            title: "Error",
            text: "Refresh token con formato inválido",
            icon: "error",
            buttons: false,
          });
          return;
        }

        try {
          const response = await UserProxy.validateTokenGoogle(accessToken);
          
          if (response && response.STATUS) {
            const user = urlParams.get('user');
            
            // Validar y parsear datos de usuario
            let userData;
            try {
              userData = JSON.parse(decodeURIComponent(user));
              
              // Sanitizar datos de usuario
              const sanitizedUser = {
                NOMBRES: this.sanitizeForStorage(userData.NOMBRES),
                EMAIL: this.sanitizeForStorage(userData.EMAIL),
                RTAFTO: this.sanitizeForStorage(userData.RTAFTO)
              };

              this.$swal({
                title: "¡Éxito!",
                text: "Has iniciado sesión correctamente.",
                icon: "success",
                buttons: false,
              }).then(() => {
                localStorage.setItem('accessToken', accessToken);
                if (refreshToken) {
                  localStorage.setItem('refreshToken', refreshToken);
                }
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
.form-login {
  background-color: #fdf2f8;
  background-image: url("../../assets/img/resources/bg-comments.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100dvh;
  display: flex;
  padding: 20px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  background-color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-family: Lato, sans-serif;
}

.social-btn:hover {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(24, 92, 230, 0.05) 100%);
  border-color: #E5E7EB;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.social-btn:active {
  transform: translateY(0);
}

.icon {
  width: 20px;
  height: 20px;
}


form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.form-login-with {
  width: 500px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.98);
}

.shadow-modern {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #6B7280;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-login-with {
    width: 90%;
    padding: 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  font-size: 13px;
  color: #718096;
  font-weight: 500;
  font-family: Lato, sans-serif;
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cbd5e0, transparent);
  margin: 0 12px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  padding: 12px 18px;
  margin-bottom: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.input-group:focus-within {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
  transform: translateY(-1px);
}

.input-group.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.input-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #2d3748;
  font-family: Lato, sans-serif;
  font-weight: 500;
}

.input-field::placeholder {
  color: #a0aec0;
  font-weight: 400;
}

/* Estilo del botón de ojo */
.eye-icon {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 8px;
}

.eye-icon img {
  width: 18px;
  height: 18px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.eye-icon:hover img {
  opacity: 1;
}

/* Botón de enviar */
.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 50%, #185CE6 100%);
  color: white;
  font-size: 15px;
  font-weight: 700;
  padding: 14px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  font-family: Lato, sans-serif;
  letter-spacing: 0.3px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin: 0;
}

.remember-me input {
  accent-color: #2563eb;
}

.forgot-password {
  font-size: 13px;
  color: #8B5CF6;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  font-family: Lato, sans-serif;
}

.forgot-password:hover {
  color: #DF2DB2;
  text-decoration: underline;
}


.btn-registrate {
  background: linear-gradient(135deg, #DF2DB2 0%, #E71FB3 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(231, 31, 179, 0.25);
  font-family: Lato, sans-serif;
}

.btn-registrate:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 31, 179, 0.35);
}

.btn-registrate:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .no-tener-cuenta {
    display: none;
  }

  .form-login {
    padding: 10px 10px;
    justify-content: space-around;
  }
  
  .theme-toggle-btn {
    width: 36px;
    height: 36px;
  }
  
  .theme-toggle-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .btn-registrate {
    padding: 8px 16px;
    font-size: 13px;
  }
}

#btnToggleShowPassword {
  border: none;
  right: 0;
  z-index: 5;
  top: .4rem;
}

/* Theme Toggle Button */
.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1864FF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.theme-toggle-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

.theme-toggle-btn:hover {
  background: #f7fafc;
  border-color: #1864FF;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(24, 100, 255, 0.3);
}
</style>

<style>
/* Login dark mode - unscoped with max specificity to override scoped styles */
html.dark .form-login.form-login {
  background: #111827 !important;
  background-image: none !important;
}

html.dark .form-login-with.form-login-with {
  background: #1f2937 !important;
  border: 1px solid #374151 !important;
}

html.dark .shadow-modern.shadow-modern {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 2px 8px rgba(0, 0, 0, 0.5) !important;
}

html.dark .login-title.login-title {
  color: #f3f4f6 !important;
}

html.dark .no-tener-cuenta.no-tener-cuenta {
  color: #d1d5db !important;
}

html.dark .social-btn.social-btn {
  background-color: #111827 !important;
  border-color: #374151 !important;
  color: #e5e7eb !important;
}

html.dark .social-btn.social-btn:hover {
  background: linear-gradient(135deg, rgba(223, 45, 178, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(24, 92, 230, 0.15) 100%) !important;
  border-color: #4a5568 !important;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
}

html.dark .separator.separator {
  color: #9ca3af !important;
}

html.dark .separator.separator::before,
html.dark .separator.separator::after {
  background: linear-gradient(90deg, transparent, #4a5568, transparent) !important;
}

html.dark .input-group.input-group {
  background: #111827 !important;
  border-color: #374151 !important;
}

html.dark .input-group.input-group:focus-within {
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.25) !important;
}

html.dark .input-group.input-group.error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.25) !important;
}

html.dark .input-field.input-field {
  color: #f3f4f6 !important;
  background: transparent !important;
}

html.dark .input-field.input-field::placeholder {
  color: #6b7280 !important;
}

html.dark .input-icon.input-icon {
  filter: brightness(0) invert(1) !important;
  opacity: 0.8 !important;
}

html.dark .eye-icon img {
  filter: brightness(0) invert(1) !important;
  opacity: 0.7 !important;
}

html.dark .eye-icon:hover img {
  opacity: 1 !important;
}

html.dark .submit-btn.submit-btn {
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.6) !important;
}

html.dark .submit-btn.submit-btn:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.7) !important;
}

html.dark .forgot-password.forgot-password {
  color: #a78bfa !important;
}

html.dark .forgot-password.forgot-password:hover {
  color: #ec4899 !important;
}

html.dark .btn-registrate.btn-registrate {
  box-shadow: 0 4px 12px rgba(231, 31, 179, 0.5) !important;
}

html.dark .btn-registrate.btn-registrate:hover {
  box-shadow: 0 6px 20px rgba(231, 31, 179, 0.6) !important;
}

html.dark .theme-toggle-btn.theme-toggle-btn {
  background: #1f2937 !important;
  border: 2px solid #6ba3ff !important;
  color: #93c5fd !important;
  box-shadow: 0 4px 12px rgba(107, 163, 255, 0.3) !important;
}

html.dark .theme-toggle-btn.theme-toggle-btn:hover {
  background: #374151 !important;
  border-color: #93c5fd !important;
  box-shadow: 0 6px 16px rgba(147, 197, 253, 0.5) !important;
}

html.dark .remember-me label {
  color: #d1d5db !important;
}

html.dark .form-login img[alt="Logo"] {
  filter: brightness(1.2) contrast(1.1) !important;
}
</style>
