<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sin acceso</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">
        No tienes permiso para acceder a esta sección. Contacta a tu administrador o mejora tu plan.
      </p>
      <div class="flex gap-3 justify-center">
        <router-link to="/usuario/subscripcion"
          class="px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          Ver planes
        </router-link>
        <button @click="$router.back()"
          class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 transition-colors">
          Volver
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'SinAccesoView' };
</script>
