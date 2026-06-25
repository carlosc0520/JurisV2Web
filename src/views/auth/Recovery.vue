<template>
  <div class="form-login min-h-[100dvh] flex flex-col justify-center max-sm:justify-start items-center py-5 max-sm:py-2.5 relative z-[1] bg-[#fdf2f8]">
    <div class="flex justify-between items-center mb-4 px-5 w-full">
      <img src="@/assets/img/logos/logo-full.png" @click="$router.push('/')" alt="Logo" class="h-10 cursor-pointer" />
      <div class="text-sm">
        <button @click.prevent="$router.push('/auth/login')"
          class="ml-2 bg-[#E71FB3] text-white py-2 px-4 rounded-full border-none cursor-pointer transition-colors duration-300 font-semibold text-sm hover:bg-pink-700">
          Iniciar sesión
        </button>
      </div>
    </div>

    <div class="bg-white p-8 max-sm:p-5 rounded-xl shadow-lg w-[500px] max-sm:w-[90%]">
      <h3 class="font-bold text-center text-gray-700 text-xl mb-2 font-['Lato']">Crea una nueva contraseña</h3>
      <p class="text-center text-sm text-[#898987] font-['Lato'] mb-4">
        Introduzca su nueva contraseña a continuación para completar el
        proceso. Asegúrese de que es segura
      </p>
      <form class="flex flex-col gap-3 w-full mt-4">
        <div>
          <div class="input-group flex items-center border border-[#d1d5db] rounded-full px-4 py-2.5 transition-all duration-300 bg-white"
            :class="{ error: validation.hasError('modelo.PASSWORD') }">
            <img src="@/assets/img/icons/look.svg" alt="Password Icon" class="w-[18px] h-[18px] mr-2">
            <input placeholder="Contraseña" class="input-field flex-1 border-none outline-none bg-transparent text-sm text-[#2d3748] font-['Lato']"
              id="password" :type="showPassword ? 'text' : 'password'" v-model="modelo.PASSWORD" autocomplete="off">
            <button type="button" class="ml-2 bg-transparent border-none cursor-pointer p-0 flex-shrink-0" @click="togglePassword(1)">
              <img v-if="!showPassword" src="@/assets/img/icons/eye.svg" alt="" class="w-[18px] h-[18px] opacity-60 transition-opacity hover:opacity-100" />
              <img v-else src="@/assets/img/icons/eye-look.svg" alt="" class="w-[18px] h-[18px] opacity-60 transition-opacity hover:opacity-100" />
            </button>
          </div>
          <span v-if="validation.hasError('modelo.PASSWORD')" class="text-red-500 text-sm">
            {{ validation.firstError('modelo.PASSWORD') }}
          </span>
        </div>

        <div>
          <div class="input-group flex items-center border border-[#d1d5db] rounded-full px-4 py-2.5 transition-all duration-300 bg-white"
            :class="{ error: validation.hasError('modelo.PASSWORD_CONFIRM') }">
            <img src="@/assets/img/icons/look.svg" alt="Password Icon" class="w-[18px] h-[18px] mr-2">
            <input placeholder="Confirmar contraseña" class="input-field flex-1 border-none outline-none bg-transparent text-sm text-[#2d3748] font-['Lato']"
              :type="showPassword2 ? 'text' : 'password'" v-model="modelo.PASSWORD_CONFIRM" autocomplete="off">
            <button type="button" class="ml-2 bg-transparent border-none cursor-pointer p-0 flex-shrink-0" @click="togglePassword(2)">
              <img v-if="!showPassword2" src="@/assets/img/icons/eye.svg" alt="" class="w-[18px] h-[18px] opacity-60 transition-opacity hover:opacity-100" />
              <img v-else src="@/assets/img/icons/eye-look.svg" alt="" class="w-[18px] h-[18px] opacity-60 transition-opacity hover:opacity-100" />
            </button>
          </div>
          <span v-if="validation.hasError('modelo.PASSWORD_CONFIRM')" class="text-red-500 text-sm">
            {{ validation.firstError('modelo.PASSWORD_CONFIRM') }}
          </span>
        </div>

        <button type="button" @click.prevent="submit"
          class="w-full bg-blue-600 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-full border-none cursor-pointer transition-colors duration-300 font-['Lato'] mt-3">
          Enviar
        </button>
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
import { Validator } from 'simple-vue-validator';
import newUserProxy from "@/proxies/NewUserProxy";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'vue3-toastify';

export default {
  components: {},
  data() {
    return {
      showPassword: false,
      showPassword2: false,
      isloading: false,
      modelo: { CORREO: null, PASSWORD: null, PASSWORD_CONFIRM: null },
      token: null,
    };
  },
  validators: {
    'modelo.CORREO': function (value) {
      return Validator.value(value).required("Campo requerido").email("Correo inválido");
    },
    'modelo.PASSWORD': function (value) {
      return Validator.value(value).required("Campo requerido").minLength(8, "Mínimo 9 caracteres");
    },
    'modelo.PASSWORD_CONFIRM': function () {
      return Validator.custom(() => {
        if (this.modelo.PASSWORD !== this.modelo.PASSWORD_CONFIRM) return "Las contraseñas no coinciden";
        return "";
      });
    },
  },
  methods: {
    async submit(e) {
      e.preventDefault();
      let validate = await this.$validate();
      if (!validate) return;

      const response = { ...this.modelo, EMAIL: this.modelo.CORREO, TOKEN: this.token };
      const loadingToast = toast.loading("Espere un momento...");
      await newUserProxy.recoveryUser(response)
        .then(response => {
          const toastMessage = response.STATUS ? "Se ha cambiado la contraseña correctamente" : response.MESSAGE;
          if (response.STATUS) {
            toast.success("Se ha cambiado la contraseña correctamente", { autoClose: 2000 });
            setTimeout(() => { this.$router.push("/auth/login"); }, 2000);
          } else {
            toast.error(toastMessage);
          }
        })
        .catch(err => toast.error(err?.MESSAGE || "Error al cambiar la contraseña"))
        .finally(() => { toast.remove(loadingToast); });
    },
    togglePassword(index) {
      if (index === 1) this.showPassword = !this.showPassword;
      else if (index === 2) this.showPassword2 = !this.showPassword2;
    },
  },
  async created() {
    const token = this.$route?.params?.token;
    if (token) {
      const response = await newUserProxy.validar_recovery(token);
      if (response) {
        let decodeToken = await jwtDecode(token);
        this.token = token;
        this.modelo = { ...this.modelo, ...decodeToken, CORREO: decodeToken?.EMAIL };
        return;
      }
    }
    this.$router.push("/auth/login");
  },
};
</script>

<style scoped>
/* Background image */
.form-login {
  background-image: url("../../assets/img/resources/bg-comments.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* Input placeholder */
.input-field::placeholder { color: #a0aec0; font-weight: 400; }

/* Input group focus/error */
.input-group:focus-within {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  transform: translateY(-1px);
}
.input-group.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
