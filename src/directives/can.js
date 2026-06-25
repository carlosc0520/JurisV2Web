import { useAuthStore } from '@/stores/auth.store'

export const vCan = {
  mounted(el, binding) {
    const auth  = useAuthStore()
    const clave = binding.value

    if (!clave) return

    if (!auth.puedeAcceder(clave)) {
      // Elimina el elemento del DOM — no solo lo oculta
      el.parentNode?.removeChild(el)
    }
  },
}
