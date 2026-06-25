/**
 * useLoading — Estado de carga reactivo con helper `withLoading`.
 *
 * Uso simple:
 *   const { loading, withLoading } = useLoading()
 *   const data = await withLoading(() => http.get('/list'))
 *
 * Múltiples estados:
 *   const { loading, withLoading } = useLoading()
 *   const [saving, withSaving] = useLoadingState()
 *
 * Con AppLoader global:
 *   const { globalLoading, setGlobalLoading } = useGlobalLoading()
 */
import { ref, readonly } from 'vue'

// ── Local loading ─────────────────────────────────────────────
export function useLoading(initial = false) {
  const loading = ref(initial)

  /**
   * Envuelve una función async mostrando estado de carga.
   * Siempre pone loading=false en el finally aunque haya error.
   */
  async function withLoading(fn) {
    loading.value = true
    try {
      return await fn()
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    withLoading,
    setLoading: (v) => { loading.value = v },
  }
}

// ── Multiple named states ─────────────────────────────────────
export function useLoadingState() {
  const loading = ref(false)

  async function run(fn) {
    loading.value = true
    try      { return await fn() }
    finally  { loading.value = false }
  }

  return [readonly(loading), run]
}

// ── Global app-level loader (Teleport en AppLoader) ───────────
const _global = ref(false)
const _globalText = ref('Cargando...')

export function useGlobalLoading() {
  function show(text = 'Cargando...') {
    _globalText.value = text
    _global.value     = true
  }
  function hide() {
    _global.value = false
  }
  async function withGlobal(fn, text = 'Cargando...') {
    show(text)
    try      { return await fn() }
    finally  { hide() }
  }

  return {
    globalLoading:     readonly(_global),
    globalLoadingText: readonly(_globalText),
    showGlobal: show,
    hideGlobal: hide,
    withGlobal,
  }
}

export default useLoading
