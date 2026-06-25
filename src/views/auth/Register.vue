<template>
  <div class="form-login min-h-[100dvh] flex flex-col justify-center max-sm:justify-around items-center py-5 max-sm:py-2.5 relative z-[1]">
    <div class="flex justify-between items-center mb-4 px-5 w-full">
      <img src="@/assets/img/logos/logo-full.png" @click="$router.push('/')" alt="Logo" class="h-10 cursor-pointer" />
      <button @click.prevent="$router.push('/auth/login')"
        class="ml-2 bg-gradient-to-br from-[#DF2DB2] to-[#E71FB3] text-white py-2.5 max-sm:py-2 px-5 max-sm:px-4 rounded-full border-none cursor-pointer transition-all duration-300 font-semibold text-sm max-sm:text-[13px] shadow-[0_4px_12px_rgba(231,31,179,0.25)] font-['Lato'] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(231,31,179,0.35)]">
        Iniciar sesión
      </button>
    </div>

    <!-- Paso 1: Email -->
    <div v-if="paseForm == 1"
      class="bg-white/98 backdrop-blur-[10px] p-8 max-sm:p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] w-[500px] max-sm:w-[90%]">
      <h3 class="text-[28px] max-sm:text-[22px] font-bold text-center text-gray-500 mb-6 font-['Lato']">Registrar cuenta</h3>

      <div v-if="siteConfig.ALLOW_OAUTH_REGISTER" class="flex flex-col gap-3">
        <button class="flex items-center justify-center gap-2.5 w-full px-4 py-3 border-2 border-slate-200 rounded-full text-sm font-semibold text-[#4a5568] bg-white font-['Lato'] transition-all duration-300 cursor-pointer hover:border-gray-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)]"
          @click="loginWithGoogle">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" class="w-5 h-5">
          Registrarse con Google
        </button>
        <button class="flex items-center justify-center gap-2.5 w-full px-4 py-3 border-2 border-slate-200 rounded-full text-sm font-semibold text-[#4a5568] bg-white font-['Lato'] transition-all duration-300 cursor-pointer hover:border-gray-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)]"
          @click="loginWithLinkedin">
          <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn Logo" class="w-5 h-5">
          Registrarse con LinkedIn
        </button>
      </div>

      <div v-if="siteConfig.ALLOW_OAUTH_REGISTER" class="separator flex items-center my-5 text-[13px] text-[#718096] font-medium font-['Lato']">
        <span>o registrar cuenta con</span>
      </div>

      <form class="flex flex-col gap-3 w-full" @submit.prevent="signIn">
        <div>
          <div class="input-group flex items-center border-2 border-slate-200 rounded-full px-[18px] py-3 transition-all duration-300 bg-white">
            <img src="@/assets/img/icons/email.svg" alt="Email Icon" class="w-[18px] h-[18px] mr-2">
            <input type="email" placeholder="Correo electrónico" autocomplete="off" v-model="form.EMAIL"
              class="input-field flex-1 border-none outline-none bg-transparent text-[15px] text-[#2d3748] font-['Lato'] font-medium">
          </div>
        </div>

        <SaveButton
          label="Enviar código"
          loading-label="Enviando..."
          :loading="isloading"
          native-type="submit"
          :block="true"
          size="lg"
          class="mt-3"
        />
      </form>
    </div>

    <!-- Paso 2: Verificar OTP -->
    <div v-if="paseForm == 2"
      class="bg-white/98 backdrop-blur-[10px] p-8 max-sm:p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] w-[500px] max-sm:w-[90%]">
      <h3 class="text-[22px] max-sm:text-lg font-bold text-center text-gray-700 mb-2 font-['Lato']">Verifica tu correo</h3>
      <p class="text-center text-sm text-gray-500 mb-6 font-['Lato']">
        Ingresa el código de 6 dígitos enviado a<br/>
        <span class="font-semibold text-gray-700">{{ form.EMAIL }}</span>
      </p>

      <div class="flex justify-center gap-2 mb-6">
        <input
          v-for="(_, i) in otpDigits"
          :key="i"
          :ref="el => { if (el) otpRefs[i] = el }"
          v-model="otpDigits[i]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="otp-box w-11 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-xl outline-none bg-white text-gray-800 transition-all duration-200 focus:border-gray-500 focus:shadow-[0_0_0_3px_rgba(107,114,128,0.15)]"
          @input="onOtpInput(i, $event)"
          @keydown="onOtpKeydown(i, $event)"
          @paste="onOtpPaste($event)"
        />
      </div>

      <SaveButton
        label="Verificar código"
        loading-label="Verificando..."
        :loading="isloading"
        native-type="button"
        :block="true"
        size="lg"
        @click="signIn"
      />

      <div class="text-center mt-4 text-sm text-gray-500 font-['Lato']">
        <span v-if="countdown > 0">Reenviar código en <span class="font-semibold text-gray-700">{{ countdown }}s</span></span>
        <button v-else @click="resendOtp"
          class="text-[#185CE6] font-semibold hover:underline bg-transparent border-none cursor-pointer">
          Reenviar código
        </button>
      </div>
      <div class="text-center mt-3">
        <button @click="paseForm = 1" class="text-sm text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
          ← Cambiar correo
        </button>
      </div>
    </div>

    <!-- Paso 3: Contraseña -->
    <div v-if="paseForm == 3"
      class="bg-white/98 backdrop-blur-[10px] p-8 max-sm:p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] w-[500px] max-sm:w-[90%]">
      <h3 class="text-[22px] max-sm:text-lg font-bold text-center text-gray-700 mb-2 font-['Lato']">Crea tu contraseña</h3>
      <p class="text-center text-sm text-gray-500 mb-6 font-['Lato']">
        Elige una contraseña segura para tu cuenta
      </p>

      <form class="flex flex-col gap-4" @submit.prevent="signIn">
        <div>
          <div class="input-group flex items-center border-2 border-slate-200 rounded-full px-[18px] py-3 transition-all duration-300 bg-white">
            <img src="@/assets/img/icons/look.svg" alt="" class="w-[18px] h-[18px] mr-2">
            <input placeholder="Contraseña"
              class="input-field flex-1 border-none outline-none bg-transparent text-[15px] text-[#2d3748] font-['Lato'] font-medium"
              :type="showPassword ? 'text' : 'password'" v-model="form.PASSWORD" autocomplete="new-password">
            <button type="button" class="ml-2 bg-transparent border-none cursor-pointer p-0" @click="togglePassword(1)">
              <img v-if="!showPassword" src="@/assets/img/icons/eye.svg" alt="" class="w-[18px] h-[18px] opacity-60 hover:opacity-100" />
              <img v-else src="@/assets/img/icons/eye-look.svg" alt="" class="w-[18px] h-[18px] opacity-60 hover:opacity-100" />
            </button>
          </div>

          <!-- Barra de fortaleza -->
          <div v-if="form.PASSWORD" class="mt-2 px-1">
            <div class="flex gap-1 mb-1.5">
              <div v-for="n in 4" :key="n"
                class="h-1 flex-1 rounded-full transition-all duration-300"
                :class="passwordStrength.score >= n ? passwordStrength.color : 'bg-gray-200'" />
            </div>
            <div class="flex justify-between items-start">
              <span class="text-xs font-medium" :class="passwordStrength.textColor">{{ passwordStrength.label }}</span>
              <div class="flex flex-col items-end gap-0.5">
                <span v-for="rule in passwordRules" :key="rule.label"
                  class="text-[11px] flex items-center gap-1"
                  :class="rule.met ? 'text-green-500' : 'text-gray-400'">
                  <span>{{ rule.met ? '✓' : '○' }}</span> {{ rule.label }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="input-group flex items-center border-2 border-slate-200 rounded-full px-[18px] py-3 transition-all duration-300 bg-white">
          <img src="@/assets/img/icons/look.svg" alt="" class="w-[18px] h-[18px] mr-2">
          <input placeholder="Confirmar contraseña"
            class="input-field flex-1 border-none outline-none bg-transparent text-[15px] text-[#2d3748] font-['Lato'] font-medium"
            :type="showPassword2 ? 'text' : 'password'" v-model="form.PASSWORDREO" autocomplete="new-password">
          <button type="button" class="ml-2 bg-transparent border-none cursor-pointer p-0" @click="togglePassword(2)">
            <img v-if="!showPassword2" src="@/assets/img/icons/eye.svg" alt="" class="w-[18px] h-[18px] opacity-60 hover:opacity-100" />
            <img v-else src="@/assets/img/icons/eye-look.svg" alt="" class="w-[18px] h-[18px] opacity-60 hover:opacity-100" />
          </button>
        </div>

        <div class="flex justify-between items-center mt-1">
          <CancelButton @click="paseForm = 2" />
          <SaveButton label="Continuar" loading-label="Verificando..." :loading="isloading" native-type="submit" />
        </div>
      </form>
    </div>

    <!-- Paso 4: Datos personales -->
    <div v-if="paseForm == 4"
      class="bg-white/98 backdrop-blur-[10px] p-8 max-sm:p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] w-[500px] max-sm:w-[90%]">
      <h3 class="text-[22px] max-sm:text-lg font-bold text-center text-gray-500 mb-4 font-['Lato']">Completa tus datos personales</h3>
      <form class="mt-4 flex flex-col gap-3" @submit.prevent="signIn">
        <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
          <BaseInput
            v-model="modelo.NOMBRES"
            label="Nombres"
            placeholder="Tus nombres"
            required
            :error="validation.hasError('modelo.NOMBRES') ? validation.firstError('modelo.NOMBRES') : ''"
          />
          <BaseInput
            v-model="modelo.APELLIDOP"
            label="Apellido Paterno"
            placeholder="Apellido paterno"
            required
            :error="validation.hasError('modelo.APELLIDOP') ? validation.firstError('modelo.APELLIDOP') : ''"
          />
          <BaseInput
            v-model="modelo.APELLIDOM"
            label="Apellido Materno"
            placeholder="Apellido materno"
            required
            :error="validation.hasError('modelo.APELLIDOM') ? validation.firstError('modelo.APELLIDOM') : ''"
          />

          <div class="w-full">
            <label class="block text-sm font-medium mb-1.5 text-content">Fecha de Nacimiento</label>
            <date-picker v-model="modelo.FNACIMIENTO" :value="modelo.FNACIMIENTO" valueType="format"
              :disabledDate="time => time.getTime() > Date.now()"
              class="input-base mx-datepicker"
              @change="(date) => modelo.FNACIMIENTO = date" />
          </div>

          <div class="w-full">
            <label class="block text-sm font-medium mb-1.5 text-content">Nro. Celular <span class="text-brand-pink">*</span></label>
            <vue-tel-input v-model="modelo.TELEFONO" id="TELEFONO" inputmode="numeric" pattern="[0-9]*"
              @input="(e) => modelo.TELEFONO = e"
              class="tel-input"
              :inputOptions="{ placeholder: 'Número de celular' }" />
          </div>

          <BaseInput v-model="modelo.PROFESION" label="Profesión" placeholder="Tu profesión" />
          <BaseInput v-model="modelo.CARGO" label="Cargo" placeholder="Tu cargo" />
          <BaseInput v-model="modelo.DIRECCION" label="Dirección" placeholder="Tu dirección" />
        </div>

        <div class="flex justify-between items-center mt-2">
          <CancelButton @click="paseForm = 3" />
          <SaveButton label="Registrarme" loading-label="Guardando..." :loading="isloading" native-type="submit" />
        </div>
      </form>
    </div>

    <LoadingOverlay :active="isloading" :is-full-page="false" :loader="'bars'" />

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
import newUserProxy from "@/proxies/NewUserProxy";
import LoginProxy  from "@/proxies/LoginProxy";
import { toast } from 'vue3-toastify';
import { Validator } from 'simple-vue-validator';
import BaseInput    from '@/components/ui/BaseInput.vue';
import CancelButton from '@/components/Common/CancelButton.vue';
import SaveButton   from '@/components/Common/SaveButton.vue';

export default {
  components: { BaseInput, CancelButton, SaveButton },
  data() {
    return {
      paseForm: 1,
      showPassword: false,
      showPassword2: false,
      isloading: false,
      form: { EMAIL: '', PASSWORD: '', PASSWORDREO: '' },
      otpDigits: ['', '', '', '', '', ''],
      otpRefs: [],
      countdown: 0,
      countdownTimer: null,
      modelo: {
        NOMBRES: null, APELLIDOP: null, APELLIDOM: null, CORREO: null,
        TELEFONO: null, FNACIMIENTO: null, PROFESION: null, CARGO: null, DIRECCION: null,
      },
      siteConfig: { ALLOW_OAUTH_REGISTER: true },
    };
  },
  mounted() {
    LoginProxy.siteConfig().then(cfg => { if (cfg) this.siteConfig = { ...this.siteConfig, ...cfg }; }).catch(() => {});
  },
  validators: {
    'modelo.NOMBRES':  (value) => Validator.value(value).required('Campo requerido'),
    'modelo.APELLIDOP': (value) => Validator.value(value).required('Campo requerido'),
    'modelo.APELLIDOM': (value) => Validator.value(value).required('Campo requerido'),
  },
  computed: {
    passwordRules() {
      const p = this.form.PASSWORD || '';
      return [
        { label: 'Mínimo 8 caracteres',       met: p.length >= 8 },
        { label: 'Una letra mayúscula',        met: /[A-Z]/.test(p) },
        { label: 'Un número',                  met: /[0-9]/.test(p) },
        { label: 'Un carácter especial',       met: /[^A-Za-z0-9]/.test(p) },
      ];
    },
    passwordStrength() {
      const score = this.passwordRules.filter(r => r.met).length;
      const map = [
        null,
        { score: 1, label: 'Débil',    color: 'bg-red-400',    textColor: 'text-red-500' },
        { score: 2, label: 'Regular',  color: 'bg-orange-400', textColor: 'text-orange-500' },
        { score: 3, label: 'Buena',    color: 'bg-yellow-400', textColor: 'text-yellow-600' },
        { score: 4, label: 'Segura',   color: 'bg-green-400',  textColor: 'text-green-500' },
      ];
      return map[score] || { score: 0, label: '', color: '', textColor: '' };
    },
  },
  methods: {
    async signIn() {
      if (this.isloading) return;

      // Paso 1 → enviar OTP
      if (this.paseForm == 1) {
        if (!this.form.EMAIL)
          return toast.error('El correo es requerido.');
        if (!this.form.EMAIL.match(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
          return toast.error('El correo no es válido.');

        this.isloading = true;
        const loading = toast.loading('Enviando código...');
        await newUserProxy.sendOtp(this.form.EMAIL)
          .then(() => {
            this.otpDigits = ['', '', '', '', '', ''];
            this.paseForm = 2;
            this.startCountdown();
            this.$nextTick(() => { this.otpRefs[0]?.focus(); });
          })
          .catch(err => toast.error(this.getApiError(err, 'Error al enviar el código')))
          .finally(() => { this.isloading = false; toast.remove(loading); });
        return;
      }

      // Paso 2 → verificar OTP
      if (this.paseForm == 2) {
        const codigo = this.otpDigits.join('');
        if (codigo.length < 6)
          return toast.error('Ingresa los 6 dígitos del código.');

        this.isloading = true;
        const loading = toast.loading('Verificando...');
        await newUserProxy.verifyOtp(this.form.EMAIL, codigo)
          .then(() => { this.paseForm = 3; })
          .catch(err => toast.error(this.getApiError(err, 'Código incorrecto o expirado')))
          .finally(() => { this.isloading = false; toast.remove(loading); });
        return;
      }

      // Paso 3 → validar contraseña
      if (this.paseForm == 3) {
        if (!this.form.PASSWORD) return toast.error('La contraseña es requerida.');
        const unmet = this.passwordRules.filter(r => !r.met);
        if (unmet.length > 0) return toast.error(`La contraseña no cumple: ${unmet[0].label.toLowerCase()}.`);
        if (this.form.PASSWORD !== this.form.PASSWORDREO)
          return toast.error('Las contraseñas no coinciden.');
        this.paseForm = 4;
        return;
      }

      // Paso 4 → registrar y auto-login
      if (this.paseForm == 4) {
        const valid = await this.$validate();
        if (!valid) return;
        if (!this.modelo.TELEFONO) return toast.error('El teléfono es requerido.');

        const planId = this.$route.query.plan || '';
        const payload = {
          EMAIL:       this.form.EMAIL,
          PASSWORD:    this.form.PASSWORD,
          NOMBRES:     this.modelo.NOMBRES,
          APATERNO:    this.modelo.APELLIDOP,
          AMATERNO:    this.modelo.APELLIDOM,
          TELEFONO:    this.modelo.TELEFONO,
          FNACIMIENTO: this.modelo.FNACIMIENTO,
          PROFESION:   this.modelo.PROFESION,
          CARGO:       this.modelo.CARGO,
          DIRECCION:   this.modelo.DIRECCION,
          RTAFTO:      null,
          DATOS:       planId,
        };

        this.isloading = true;
        const loading = toast.loading('Creando tu cuenta...');
        await newUserProxy.registrarFind(payload)
          .then(res => {
            if (res?.STATUS) {
              if (res.TOKEN && res.TOKEN.length > 20) {
                localStorage.setItem('accessToken', res.TOKEN);
                if (res.REFRESH_TOKEN) localStorage.setItem('refreshToken', res.REFRESH_TOKEN);
                toast.success('¡Cuenta creada exitosamente!');
                this.$router.push('/redirect');
              } else {
                toast.success('¡Cuenta creada! Inicia sesión para continuar.');
                this.$router.push('/auth/login');
              }
            } else {
              toast.error(res?.MESSAGE || 'Error al crear la cuenta.');
            }
          })
          .catch(err => toast.error(this.getApiError(err, 'Error al crear la cuenta')))
          .finally(() => { this.isloading = false; toast.remove(loading); });
      }
    },

    async resendOtp() {
      if (this.countdown > 0 || this.isloading) return;
      this.isloading = true;
      const loading = toast.loading('Reenviando código...');
      await newUserProxy.sendOtp(this.form.EMAIL)
        .then(() => {
          this.otpDigits = ['', '', '', '', '', ''];
          this.startCountdown();
          toast.success('Código reenviado');
          this.$nextTick(() => { this.otpRefs[0]?.focus(); });
        })
        .catch(err => toast.error(this.getApiError(err, 'Error al reenviar el código')))
        .finally(() => { this.isloading = false; toast.remove(loading); });
    },

    startCountdown() {
      this.countdown = 60;
      clearInterval(this.countdownTimer);
      this.countdownTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) clearInterval(this.countdownTimer);
      }, 1000);
    },

    onOtpInput(index, event) {
      const val = event.target.value.replace(/\D/g, '').slice(-1);
      this.otpDigits[index] = val;
      if (val && index < 5) {
        this.$nextTick(() => { this.otpRefs[index + 1]?.focus(); });
      }
    },

    onOtpKeydown(index, event) {
      if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
        this.$nextTick(() => { this.otpRefs[index - 1]?.focus(); });
      }
    },

    onOtpPaste(event) {
      event.preventDefault();
      const text = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
      text.split('').forEach((char, i) => { this.otpDigits[i] = char; });
      const next = Math.min(text.length, 5);
      this.$nextTick(() => { this.otpRefs[next]?.focus(); });
    },

    getApiError(err, fallback = 'Ocurrió un error inesperado') {
      // El interceptor de axios hace Promise.reject(error.response.data),
      // así que err ya es el body: { MESSAGE, STATUS } o { message, error }
      return err?.MESSAGE || err?.message || fallback;
    },

    async loginWithGoogle() { return 1; },
    async loginWithLinkedin() { return 1; },

    togglePassword(indicador = 1) {
      if (indicador == 1) this.showPassword = !this.showPassword;
      else this.showPassword2 = !this.showPassword2;
    },
  },

  beforeUnmount() {
    clearInterval(this.countdownTimer);
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

/* Separador con líneas */
.separator {
  display: flex;
  align-items: center;
  gap: 12px;
}
.separator::before,
.separator::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cbd5e0, transparent);
}

/* Input group focus */
.input-group:focus-within {
  border-color: #6b7280;
  box-shadow: 0 0 0 4px rgba(107,114,128,0.1);
}

/* vue-tel-input */
:deep(.tel-input.vue-tel-input) {
  height: 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border, #e5e7eb);
  background-color: var(--bg-raised, #f9fafb);
  box-shadow: none;
  font-size: 0.875rem;
}
:deep(.tel-input.vue-tel-input:focus-within) {
  outline: none;
  border-color: #9ca3af;
  box-shadow: 0 0 0 2px rgba(156,163,175,.25);
}
:deep(.tel-input .vti__dropdown) {
  border-right: 1px solid #e5e7eb;
  border-radius: 0.75rem 0 0 0.75rem;
  padding: 0 8px;
  background: transparent;
}
:deep(.tel-input .vti__input) {
  height: 100%;
  border: none;
  background: transparent;
  font-size: 0.875rem;
}
</style>
