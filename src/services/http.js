/**
 * http.js — Instancia centralizada de Axios con:
 *   - baseURL desde env o fallback a producción
 *   - Inyección automática del Bearer token
 *   - Refresh automático con cola de requests
 *   - Normalización de errores
 *   - Timeout de 30s
 *
 * USO: import http from '@/services/http'
 *      const data = await http.get('/admin/user/list')
 */
import axios from 'axios'

const BASE_URL = process.env.VUE_APP_API_URL || 'https://api.jurissearch.com'

const KEY_ACCESS  = 'accessToken'
const KEY_REFRESH = 'refreshToken'

// ── Instancia ────────────────────────────────────────────────
export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { Accept: 'application/json' },
})

// ── Estado de refresh ────────────────────────────────────────
let isRefreshing = false
let queue = []

const processQueue = (err, token = null) => {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token)))
  queue = []
}

// ── Request interceptor ──────────────────────────────────────
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(KEY_ACCESS)
  const isPublic =
    config.url?.includes('/auth/') ||
    config.url?.includes('/login/autenticar') ||
    config.url?.includes('/login/refresh')

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Añadir request ID para debugging
  config.headers['X-Request-ID'] = crypto.randomUUID?.() ?? Date.now().toString(36)

  return config
})

// ── Response interceptor ─────────────────────────────────────
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status   = error.response?.status

    const isAuthUrl   = original.url?.includes('/login/') || original.url?.includes('/auth/')
    const isAuthRoute = window.location.pathname.includes('/auth/')

    // No intentar refresh si: no es 401, ya se reintentó, o es ruta de auth
    if (status !== 401 || original._retry || isAuthUrl || isAuthRoute) {
      return Promise.reject(normalizeError(error))
    }

    // Encolar si ya hay un refresh en curso
    if (isRefreshing) {
      return new Promise((resolve, reject) => queue.push({ resolve, reject }))
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return http(original)
        })
        .catch((e) => Promise.reject(normalizeError(e)))
    }

    original._retry = true
    isRefreshing     = true

    const refreshToken = localStorage.getItem(KEY_REFRESH)
    if (!refreshToken) {
      isRefreshing = false
      clearSession()
      return Promise.reject(normalizeError(error))
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/login/refresh`, { refreshToken })
      if (!data?.accessToken) throw new Error('Refresh inválido')

      localStorage.setItem(KEY_ACCESS, data.accessToken)
      if (data.refreshToken) localStorage.setItem(KEY_REFRESH, data.refreshToken)
      // mantener legacy key en sync
      localStorage.setItem('user-token', data.accessToken)

      // Sincronizar el Pinia store para que puedeAcceder() lea el PERM actualizado
      try {
        const { useAuthStore } = await import('@/stores/auth.store')
        useAuthStore().setTokens(data.accessToken, data.refreshToken ?? refreshToken)
      } catch { /* si falla, al menos localStorage está actualizado */ }

      processQueue(null, data.accessToken)
      original.headers.Authorization = `Bearer ${data.accessToken}`
      return http(original)
    } catch (refreshErr) {
      processQueue(refreshErr, null)
      const intentional = localStorage.getItem('isLoggingOut') === 'true'
      if (!intentional) showSessionExpiredAlert()
      clearSession()
      return Promise.reject(normalizeError(refreshErr))
    } finally {
      isRefreshing = false
    }
  },
)

// ── Helpers ──────────────────────────────────────────────────
function normalizeError(err) {
  if (err?.response?.data) return err.response.data
  if (err?.message)        return { MESSAGE: err.message, STATUS: false }
  return { MESSAGE: 'Error desconocido', STATUS: false }
}

function clearSession() {
  ['accessToken', 'refreshToken', 'user-token', 'user', 'isLoggingOut'].forEach(
    (k) => localStorage.removeItem(k),
  )
  if (!window.location.pathname.includes('/auth/')) {
    window.location.href = '/auth/login'
  }
}

async function showSessionExpiredAlert() {
  try {
    const { default: Swal } = await import('sweetalert2')
    Swal.fire({
      title: 'Sesión Expirada',
      text:  'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      icon:  'warning',
      confirmButtonColor: '#e71fb3',
      confirmButtonText:  'Aceptar',
      allowOutsideClick:  false,
      allowEscapeKey:     false,
    }).then(() => { window.location.href = '/auth/login' })
  } catch (e) { /* sweetalert not available */ }
}

export default http
