<template>
  <BaseModal
    :open="show"
    title="Recuperar contraseña"
    size="sm"
    @close="close"
  >
    <template #body>
      <p class="text-sm text-gray-500 mb-4">
        Introduzca su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña.
      </p>
      <form id="formRecuperarContrasena" @submit.prevent="submit">
        <div class="input-group flex items-center border border-[#d1d5db] rounded-full px-3 py-2.5 mb-1 transition-colors duration-200"
          :class="{ error: errors.EMAIL }">
          <img src="@/assets/img/icons/email.svg" alt="Email Icon" class="w-[18px] h-[18px] mr-2 flex-shrink-0">
          <input type="email" placeholder="Correo electrónico" autocomplete="off" v-model="modelo.EMAIL"
            class="flex-1 border-none outline-none bg-transparent text-sm text-[#2d3748]">
        </div>
        <span v-if="errors.EMAIL" class="text-xs text-red-500 ml-2">{{ errors.EMAIL }}</span>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          @click="close"
          :disabled="loadingSubmit"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="submit"
          :disabled="loadingSubmit"
        >
          <span v-if="loadingSubmit" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Enviar
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { toast } from 'vue3-toastify';
import newUserProxy from "@/proxies/NewUserProxy";

export default {
  props: {
    show: { type: Boolean, default: false },
    close: { type: Function, default: () => {} },
    update: { type: Function, default: () => {} },
  },
  data() {
    return {
      loadingSubmit: false,
      errors: { EMAIL: null },
      modelo: { EMAIL: null },
    };
  },
  methods: {
    validate() {
      this.errors = { EMAIL: null };
      const email = this.modelo.EMAIL?.trim() || '';
      if (!email) {
        this.errors.EMAIL = 'Campo requerido';
        return false;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        this.errors.EMAIL = 'Email no válido';
        return false;
      }
      return true;
    },

    async submit() {
      if (!this.validate()) return;

      this.loadingSubmit = true;
      const loadingToast = toast.loading('Espere un momento...');

      await newUserProxy.recovery(this.modelo)
        .then((response) => {
          const msg = response.STATUS ? 'Revise su correo para la confirmación' : response.MESSAGE;
          if (response.STATUS) {
            toast.success(msg);
            this.reset();
            this.update();
            this.close();
          } else {
            toast.error(msg);
          }
        })
        .catch((error) => toast.error(error?.MESSAGE || 'Error al procesar la solicitud'))
        .finally(() => {
          toast.remove(loadingToast);
          this.loadingSubmit = false;
        });
    },

    reset() {
      this.modelo = { EMAIL: null };
      this.errors = { EMAIL: null };
    },
  },
  watch: {
    show(value) {
      if (!value) this.reset();
    },
  },
};
</script>

<style scoped>
.input-group:focus-within { border-color: #8b5cf6; }
.input-group.error { border-color: #ef4444; }
</style>
