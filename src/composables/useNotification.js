/**
 * useNotification — Wrapper de vue3-toastify con presets de diseño.
 *
 * Uso:
 *   const { notify } = useNotification()
 *   notify.success('Guardado correctamente')
 *   notify.error('Ocurrió un error')
 *   notify.confirm({ title: '¿Eliminar?', onConfirm: () => deleteItem() })
 */
import { toast } from 'vue3-toastify'

const BASE_OPTIONS = {
  position: 'top-right',
  autoClose: 3500,
  pauseOnHover: true,
  closeOnClick: true,
  theme: 'auto',
}

export function useNotification() {
  const notify = {
    success(message, options = {}) {
      return toast.success(message, { ...BASE_OPTIONS, autoClose: 3000, ...options })
    },

    error(message, options = {}) {
      return toast.error(message, { ...BASE_OPTIONS, autoClose: 5000, ...options })
    },

    info(message, options = {}) {
      return toast.info(message, { ...BASE_OPTIONS, ...options })
    },

    warning(message, options = {}) {
      return toast.warning(message, { ...BASE_OPTIONS, autoClose: 4000, ...options })
    },

    // Notificación con promesa (loading → success/error)
    async promise(fn, messages = {}) {
      const id = toast.loading(messages.loading ?? 'Procesando...', {
        position: BASE_OPTIONS.position,
      })
      try {
        const result = await fn()
        toast.update(id, {
          render: messages.success ?? 'Completado',
          type:   'success',
          isLoading: false,
          autoClose: 3000,
        })
        return result
      } catch (err) {
        const msg = err?.MESSAGE || err?.message || messages.error || 'Error inesperado'
        toast.update(id, {
          render:    msg,
          type:      'error',
          isLoading: false,
          autoClose: 5000,
        })
        throw err
      }
    },

    // SweetAlert2 para confirmaciones destructivas
    async confirm({
      title = '¿Estás seguro?',
      text = 'Esta acción no se puede deshacer.',
      confirmText = 'Sí, confirmar',
      cancelText  = 'Cancelar',
      icon        = 'warning',
      onConfirm,
      onCancel,
    } = {}) {
      const { default: Swal } = await import('sweetalert2')
      const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton:  true,
        confirmButtonText: confirmText,
        cancelButtonText:  cancelText,
        confirmButtonColor:'#e71fb3',
        cancelButtonColor: '#6b7280',
        reverseButtons:    true,
        focusCancel:       true,
      })

      if (result.isConfirmed) {
        await onConfirm?.()
        return true
      } else {
        await onCancel?.()
        return false
      }
    },

    dismiss: toast.dismiss,
    remove:  toast.remove,
  }

  return { notify, toast }
}

export default useNotification
