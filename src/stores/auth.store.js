import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

// ── Storage keys ────────────────────────────────────────────
const KEY_ACCESS  = 'accessToken'
const KEY_REFRESH = 'refreshToken'
const KEY_LEGACY  = 'user-token'   // compatibilidad con código existente

const readToken = () =>
  localStorage.getItem(KEY_ACCESS) || localStorage.getItem(KEY_LEGACY) || null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken:  readToken(),
    refreshToken: localStorage.getItem(KEY_REFRESH) || null,
    status: 'idle',   // idle | loading | success | error
  }),

  getters: {
    isAuthenticated: (s) => !!s.accessToken,

    user: (s) => {
      try { return s.accessToken ? jwtDecode(s.accessToken) : null }
      catch { return null }
    },

    isAdmin: (s) => {
      try {
        const u = s.accessToken ? jwtDecode(s.accessToken) : null
        return u != null && (u.IDR === 0 || u.IDR === 1 || u.role === 0 || u.role === 1 || u.ROLE === 'ADMIN' || u.ROLE === 'SUPERADMIN')
      } catch { return false }
    },

    isUser: (s) => {
      try {
        const u = s.accessToken ? jwtDecode(s.accessToken) : null
        return u != null && (u.IDR === 2 || u.role === 2 || u.ROLE === 'USUARIO')
      } catch { return false }
    },

    isLoading: (s) => s.status === 'loading',

    // Permisos efectivos del JWT (array de claves: ['busqueda','busqueda.ia',...])
    modulos: (s) => {
      try {
        const u = s.accessToken ? jwtDecode(s.accessToken) : null
        return u?.PERM ?? []
      } catch { return [] }
    },

    // Rol numérico (0/1 = admin, 2 = usuario)
    rol: (s) => {
      try {
        const u = s.accessToken ? jwtDecode(s.accessToken) : null
        return u?.role ?? null
      } catch { return null }
    },
  },

  actions: {
    // Verifica acceso a botón/feature — incluye sub-permisos (busqueda.ia satisface 'busqueda')
    puedeAcceder(clave) {
      try {
        const u = this.accessToken ? jwtDecode(this.accessToken) : null
        if (!u) return false
        const perms = u.PERM ?? []
        if (perms.includes(clave)) return true
        return perms.some(p => p.startsWith(clave + '.'))
      } catch { return false }
    },

    // Verifica acceso a RUTA — match exacto: si el padre fue revocado, no entra
    puedeAccederRuta(clave) {
      try {
        const u = this.accessToken ? jwtDecode(this.accessToken) : null
        if (!u) return false
        return (u.PERM ?? []).includes(clave)
      } catch { return false }
    },

    // ── Token management ─────────────────────────────────────
    setTokens(access, refresh) {
      this.accessToken  = access
      this.refreshToken = refresh ?? this.refreshToken
      localStorage.setItem(KEY_ACCESS, access)
      localStorage.setItem(KEY_LEGACY, access)   // keep legacy key in sync
      if (refresh) localStorage.setItem(KEY_REFRESH, refresh)
    },

    clearTokens() {
      this.accessToken  = null
      this.refreshToken = null
      ;[KEY_ACCESS, KEY_REFRESH, KEY_LEGACY, 'user', 'isLoggingOut'].forEach(k =>
        localStorage.removeItem(k)
      )
    },

    // ── Auth actions ─────────────────────────────────────────
    async login(credentials) {
      this.status = 'loading'
      try {
        const { default: LoginProxy } = await import('@/proxies/LoginProxy.js')
        const res = await LoginProxy.login(credentials)

        if (res?.status === 201 && res.data) {
          const { TOKEN, accessToken, refreshToken } = res.data
          const access  = accessToken  || TOKEN
          const refresh = refreshToken || TOKEN
          this.setTokens(access, refresh)
          this.status = 'success'
          return res.data
        }
        this.status = 'error'
        throw new Error(res?.data?.MESSAGE || 'Credenciales incorrectas')
      } catch (err) {
        this.status = 'error'
        throw err
      }
    },

    async logout() {
      localStorage.setItem('isLoggingOut', 'true')
      if (this.accessToken) {
        try {
          const { default: LoginProxy } = await import('@/proxies/LoginProxy.js')
          await LoginProxy.logout(this.accessToken)
        } catch { /* ignore logout errors */ }
      }
      this.clearTokens()
    },

    // Called by http.js interceptor to refresh tokens
    async refreshAccessToken() {
      if (!this.refreshToken) throw new Error('No refresh token available')
      const axios = (await import('axios')).default
      const apiUrl = process.env.VUE_APP_API_URL || 'https://api.jurissearch.com'
      const res = await axios.post(`${apiUrl}/login/refresh`, {
        refreshToken: this.refreshToken,
      })
      if (!res.data?.accessToken) throw new Error('Invalid refresh response')
      this.setTokens(res.data.accessToken, res.data.refreshToken)
      return res.data.accessToken
    },
  },
})
