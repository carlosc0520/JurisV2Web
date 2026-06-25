<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">

    <PageHeader title="Permisos" subtitle="Controla el acceso a módulos por plan y por usuario">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </template>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-4 pt-4 flex flex-col gap-4">

      <!-- Tabs -->
      <div class="flex gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          :class="['flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
            activeTab === tab.id
              ? 'bg-blue-50 dark:bg-blue-900/30 text-brand-blue'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800']">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="tab.icon"/>
          {{ tab.label }}
        </button>
      </div>

      <!-- ══════════════════════════════════════════════════════════
           TAB 1 — PERMISOS POR PLAN
           ══════════════════════════════════════════════════════════ -->
      <template v-if="activeTab === 'planes'">
        <SectionCard v-if="planes.length === 0 && !loadingPlanes" class="text-center py-8 text-gray-400 text-sm">
          No hay planes disponibles
        </SectionCard>

        <div v-else class="flex gap-4">

          <!-- Lista de planes -->
          <div class="w-56 flex-shrink-0 flex flex-col gap-2">
            <div v-if="loadingPlanes" class="flex flex-col gap-2">
              <SkeletonBlock v-for="i in 3" :key="i" height="48px" rounded="xl"/>
            </div>
            <button v-for="plan in planes" :key="plan.id ?? plan.ID"
              @click="selectPlan(plan)"
              :class="['w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all',
                (selectedPlan?.id ?? selectedPlan?.ID) === (plan.id ?? plan.ID)
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-brand-blue text-brand-blue'
                  : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-blue hover:text-brand-blue']">
              <div class="truncate">{{ plan.descripcion || plan.DESCRIPCION || plan.nombre || plan.NOMBRE }}</div>
              <div class="text-xs font-normal text-gray-400 mt-0.5">ID: {{ plan.id ?? plan.ID }}</div>
            </button>
          </div>

          <!-- Panel de módulos del plan seleccionado -->
          <div class="flex-1 flex flex-col gap-3">
            <SectionCard v-if="!selectedPlan" class="text-center py-12 text-gray-400 text-sm">
              Selecciona un plan para configurar sus módulos
            </SectionCard>

            <template v-else>
              <!-- Header del plan -->
              <SectionCard class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ selectedPlan.descripcion || selectedPlan.DESCRIPCION || selectedPlan.NOMBRE }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ planModulosSeleccionados.size }} módulo(s) activos
                  </p>
                </div>
                <div class="flex gap-2">
                  <button @click="marcarTodos(true)"
                    class="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 font-semibold transition-colors">
                    Marcar todos
                  </button>
                  <button @click="marcarTodos(false)"
                    class="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 font-semibold transition-colors">
                    Desmarcar todos
                  </button>
                  <button @click="guardarPlanModulos" :disabled="savingPlan"
                    class="text-xs px-4 py-1.5 rounded-lg bg-brand-blue text-white hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
                    <svg v-if="savingPlan" class="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {{ savingPlan ? 'Guardando...' : 'Guardar cambios' }}
                  </button>
                </div>
              </SectionCard>

              <div v-if="loadingPlanModulos" class="flex flex-col gap-2">
                <SkeletonBlock v-for="i in 4" :key="i" height="60px" rounded="xl"/>
              </div>

              <!-- Grupos de módulos -->
              <SectionCard v-else v-for="grupo in gruposModulos" :key="grupo.key" class="flex flex-col gap-0 overflow-hidden !p-0">
                <!-- Header del grupo -->
                <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-widest"
                    :class="grupo.key === 'admin' ? 'text-orange-500' : 'text-brand-blue'">
                    {{ grupo.key === 'admin' ? 'Área Admin' : 'Área Usuario' }}
                  </span>
                  <span class="text-xs text-gray-400">({{ grupo.modulos.filter(m => planModulosSeleccionados.has(m.id)).length }}/{{ grupo.modulos.length }})</span>
                </div>

                <!-- Módulos del grupo -->
                <div class="divide-y divide-gray-50 dark:divide-gray-800">
                  <label v-for="modulo in grupo.modulos" :key="modulo.id"
                    class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <input type="checkbox"
                      :checked="planModulosSeleccionados.has(modulo.id)"
                      @change="togglePlanModulo(modulo.id)"
                      class="w-4 h-4 rounded text-brand-blue border-gray-300 focus:ring-brand-blue"/>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ modulo.nombre }}</p>
                      <p class="text-xs text-gray-400 font-mono">{{ modulo.clave }}</p>
                    </div>
                  </label>
                </div>
              </SectionCard>
            </template>
          </div>
        </div>
      </template>

      <!-- ══════════════════════════════════════════════════════════
           TAB 2 — OVERRIDES POR USUARIO
           ══════════════════════════════════════════════════════════ -->
      <template v-if="activeTab === 'usuarios'">
        <!-- Buscador de usuario -->
        <SectionCard>
          <div class="flex gap-3 items-end flex-wrap">
            <!-- Filtro por vista -->
            <div class="w-48 flex-shrink-0">
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Vista</label>
              <select v-model="filterVista"
                class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue">
                <option value="">Todas las vistas</option>
                <option v-for="v in vistasDisponibles" :key="v.clave" :value="v.clave">{{ v.nombre }}</option>
              </select>
            </div>

            <!-- Buscar nombre/email -->
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Buscar usuario</label>
              <div class="relative">
                <input v-model="userSearch" @input="buscarUsuarios" @keydown.esc="cerrarDropdown"
                  placeholder="Nombre o email..."
                  class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"/>
                <!-- Dropdown resultados -->
                <div v-if="userResults.length > 0"
                  class="absolute z-30 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                  <button v-for="u in userResults" :key="u.ID ?? u.id"
                    @click="selectUser(u)"
                    class="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-b-0">
                    <p class="font-semibold text-gray-800 dark:text-gray-100">{{ u.NOMBRES }} {{ u.APATERNO }}</p>
                    <p class="text-xs text-gray-400">{{ u.EMAIL }} — {{ getPlanName(u.planId ?? u.IDPLN ?? u.IDPLAN) }}</p>
                  </button>
                </div>
              </div>
            </div>

            <button v-if="selectedUser" @click="limpiarUsuario"
              class="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 font-semibold transition-colors">
              Cambiar usuario
            </button>
          </div>

          <!-- Usuario seleccionado -->
          <div v-if="selectedUser" class="mt-3 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div class="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {{ (selectedUser.NOMBRES || '?')[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ selectedUser.NOMBRES }} {{ selectedUser.APATERNO }}</p>
              <p class="text-xs text-gray-400">{{ selectedUser.EMAIL }}</p>
            </div>
            <span class="text-xs font-semibold px-2 py-1 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {{ getPlanName(selectedUser.planId ?? selectedUser.IDPLN ?? selectedUser.IDPLAN) }}
            </span>
          </div>
        </SectionCard>

        <!-- Panel de overrides — árbol ruta → acciones -->
        <template v-if="selectedUser">

          <div v-if="loadingUserOverrides || bulkSaving" class="flex flex-col gap-2">
            <SkeletonBlock v-for="i in 4" :key="i" height="80px" rounded="xl"/>
          </div>

          <template v-else>
            <SectionCard v-for="area in rutasConAcciones" :key="area.key" class="!p-0 overflow-hidden">

              <!-- Header área (usuario / admin) con bulk actions -->
              <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <span class="text-[10px] font-bold uppercase tracking-widest flex-1"
                  :class="area.key === 'admin' ? 'text-orange-500' : 'text-brand-blue'">
                  {{ area.key === 'admin' ? 'Área Admin' : 'Área Usuario' }}
                </span>
                <div class="flex items-center gap-1.5">
                  <button @click="bulkSet('grant', area.key)" :disabled="bulkSaving"
                    class="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-semibold transition-colors disabled:opacity-40 border border-green-200">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    Grant todo
                  </button>
                  <button @click="bulkSet('revoke', area.key)" :disabled="bulkSaving"
                    class="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition-colors disabled:opacity-40 border border-red-200">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    Revocar todo
                  </button>
                  <button @click="bulkSet('reset', area.key)" :disabled="bulkSaving"
                    class="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-100 font-semibold transition-colors disabled:opacity-40 border border-gray-200 dark:border-gray-700">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Reset todo
                  </button>
                </div>
              </div>

              <!-- Rutas del área -->
              <div class="divide-y divide-gray-100 dark:divide-gray-800">
                <div v-for="ruta in area.rutas" :key="ruta.id">

                  <!-- Fila RUTA (nivel raíz) -->
                  <div :class="['flex items-center gap-3 px-4 py-3',
                    getOverride(ruta.id) === 'revoke' ? 'bg-red-50/60 dark:bg-red-900/10' :
                    getOverride(ruta.id) === 'grant'  ? 'bg-green-50/60 dark:bg-green-900/10' : '']">

                    <!-- Icono ruta -->
                    <div :class="['w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                      area.key === 'admin' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-blue-100 dark:bg-blue-900/30']">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        :stroke="area.key === 'admin' ? '#f97316' : '#3b82f6'" stroke-width="2.2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>

                    <!-- Nombre + clave -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ ruta.nombre }}</p>
                      <p class="text-xs text-gray-400 font-mono">{{ ruta.clave }}</p>
                    </div>

                    <!-- Badge estado -->
                    <span v-if="getOverride(ruta.id) === 'grant'"
                      class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Grant</span>
                    <span v-else-if="getOverride(ruta.id) === 'revoke'"
                      class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Revocado</span>
                    <span v-else
                      class="text-[10px] font-semibold text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">Del plan</span>

                    <!-- Controles -->
                    <div class="flex items-center gap-1">
                      <button @click="setOverride(ruta.id, 'grant')" :disabled="savingOverride === ruta.id"
                        :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                          getOverride(ruta.id) === 'grant'
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-green-50 hover:text-green-600']"
                        title="Dar acceso a esta ruta">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      </button>
                      <button @click="setOverride(ruta.id, 'revoke')" :disabled="savingOverride === ruta.id"
                        :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                          getOverride(ruta.id) === 'revoke'
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-50 hover:text-red-600']"
                        title="Bloquear acceso a esta ruta">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                      <button v-if="getOverride(ruta.id)" @click="removeOverride(ruta.id)" :disabled="savingOverride === ruta.id"
                        class="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 transition-all"
                        title="Quitar override">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                      </button>
                    </div>
                  </div>

                  <!-- Filas ACCIONES (sub-permisos) -->
                  <div v-for="accion in ruta.acciones" :key="accion.id"
                    :class="['flex items-center gap-3 pl-12 pr-4 py-2 border-t border-gray-50 dark:border-gray-800/60',
                      getOverride(accion.id) === 'revoke' ? 'bg-red-50/40 dark:bg-red-900/10' :
                      getOverride(accion.id) === 'grant'  ? 'bg-green-50/40 dark:bg-green-900/10' :
                      'bg-gray-50/50 dark:bg-gray-800/20']">

                    <!-- Línea conector visual -->
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="flex-shrink-0 text-gray-300 dark:text-gray-600">
                      <path d="M2 2v8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>

                    <!-- Nombre + clave acción -->
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{{ accion.nombre }}</p>
                      <p class="text-[10px] text-gray-400 font-mono">{{ accion.clave }}</p>
                    </div>

                    <!-- Badge estado -->
                    <span v-if="getOverride(accion.id) === 'grant'"
                      class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Grant</span>
                    <span v-else-if="getOverride(accion.id) === 'revoke'"
                      class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">Revocado</span>
                    <span v-else
                      class="text-[10px] text-gray-300 dark:text-gray-600 px-1.5 py-0.5">Del plan</span>

                    <!-- Controles acción -->
                    <div class="flex items-center gap-1">
                      <button @click="setOverride(accion.id, 'grant')" :disabled="savingOverride === accion.id"
                        :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                          getOverride(accion.id) === 'grant'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-green-50 hover:text-green-600']"
                        title="Grant esta acción">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      </button>
                      <button @click="setOverride(accion.id, 'revoke')" :disabled="savingOverride === accion.id"
                        :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                          getOverride(accion.id) === 'revoke'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-50 hover:text-red-600']"
                        title="Revocar esta acción">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                      <button v-if="getOverride(accion.id)" @click="removeOverride(accion.id)" :disabled="savingOverride === accion.id"
                        class="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 transition-all"
                        title="Quitar override">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </SectionCard>
          </template>
        </template>
      </template>

      <!-- ══════════════════════════════════════════════════════════
           TAB 3 — CATÁLOGO DE MÓDULOS
           ══════════════════════════════════════════════════════════ -->
      <template v-if="activeTab === 'modulos'">

        <!-- Formulario nuevo módulo -->
        <SectionCard>
          <p class="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Nuevo módulo</p>
          <div class="flex gap-3 flex-wrap items-end">
            <div class="flex-1 min-w-[160px]">
              <label class="block text-xs font-semibold text-gray-500 mb-1">Clave (única)</label>
              <input v-model="nuevoModulo.clave" placeholder="ej: busqueda.filtros"
                class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue font-mono"/>
            </div>
            <div class="flex-1 min-w-[160px]">
              <label class="block text-xs font-semibold text-gray-500 mb-1">Nombre visible</label>
              <input v-model="nuevoModulo.nombre" placeholder="ej: Filtros avanzados"
                class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"/>
            </div>
            <div class="w-40">
              <label class="block text-xs font-semibold text-gray-500 mb-1">Grupo</label>
              <select v-model="nuevoModulo.grupo"
                class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue">
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button @click="crearModulo" :disabled="savingModulo || !nuevoModulo.clave || !nuevoModulo.nombre"
              class="px-4 py-2 text-sm rounded-lg bg-brand-blue text-white hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
              <svg v-if="savingModulo" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Agregar
            </button>
          </div>
        </SectionCard>

        <!-- Tabla de módulos -->
        <SectionCard class="!p-0 overflow-hidden">
          <div v-if="loadingTodosModulos" class="p-6 text-center text-gray-400 text-sm">Cargando módulos...</div>
          <template v-else>
            <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span class="w-48">Clave</span>
              <span class="flex-1">Nombre</span>
              <span class="w-24">Grupo</span>
              <span class="w-16">Estado</span>
              <span class="w-24 text-right">Acciones</span>
            </div>
            <div class="divide-y divide-gray-50 dark:divide-gray-800">
              <div v-for="mod in todosModulos" :key="mod.id"
                class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                :class="{ 'opacity-50': mod.estado !== 'A' }">

                <!-- Modo edición -->
                <template v-if="editingModulo === mod.id">
                  <input v-model="editForm.clave"
                    class="w-48 px-2 py-1 text-xs border border-brand-blue rounded-lg bg-white dark:bg-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue/30"/>
                  <input v-model="editForm.nombre"
                    class="flex-1 px-2 py-1 text-xs border border-brand-blue rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"/>
                  <select v-model="editForm.grupo"
                    class="w-24 px-2 py-1 text-xs border border-brand-blue rounded-lg bg-white dark:bg-gray-900 focus:outline-none">
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                  <span class="w-16"/>
                  <div class="w-24 flex justify-end gap-1">
                    <button @click="guardarEdicion(mod.id)" :disabled="savingModulo"
                      class="px-2 py-1 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors disabled:opacity-50">
                      Guardar
                    </button>
                    <button @click="editingModulo = null"
                      class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs font-semibold hover:bg-gray-200 transition-colors">
                      ✕
                    </button>
                  </div>
                </template>

                <!-- Modo lectura -->
                <template v-else>
                  <span class="w-48 text-xs font-mono text-gray-600 dark:text-gray-400 truncate">{{ mod.clave }}</span>
                  <span class="flex-1 text-sm text-gray-800 dark:text-gray-100 truncate">{{ mod.nombre }}</span>
                  <span class="w-24">
                    <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full',
                      mod.grupo === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600']">
                      {{ mod.grupo }}
                    </span>
                  </span>
                  <span class="w-16">
                    <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full',
                      mod.estado === 'A' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400']">
                      {{ mod.estado === 'A' ? 'Activo' : 'Inactivo' }}
                    </span>
                  </span>
                  <div class="w-24 flex justify-end gap-1">
                    <button @click="iniciarEdicion(mod)" title="Editar"
                      class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-blue-50 hover:text-brand-blue flex items-center justify-center transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button v-if="mod.estado === 'A'" @click="desactivarModulo(mod.id)" title="Desactivar"
                      class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    <button v-else @click="reactivarModulo(mod.id)" title="Reactivar"
                      class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-green-50 hover:text-green-500 flex items-center justify-center transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </SectionCard>

      </template>

    </div>
  </section>
</template>

<script>
import { toast } from 'vue3-toastify';
import PermisosProxy from '@/proxies/PermisosProxy';
import MantenimientoProxy from '@/proxies/MantenimientoProxy';
import UserProxy from '@/proxies/UserProxy';
import { useAuthStore } from '@/stores/auth.store';

const GRUPOS_ORDEN = ['usuario', 'admin'];

export default {
  name: 'PermisosView',

  data() {
    return {
      activeTab: 'planes',
      tabs: [
        {
          id: 'planes',
          label: 'Permisos por Plan',
          icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
        },
        {
          id: 'usuarios',
          label: 'Overrides por Usuario',
          icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
        },
        {
          id: 'modulos',
          label: 'Catálogo de Módulos',
          icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
        },
      ],

      // Módulos del sistema
      modulos: [],

      // ── Tab Planes ──────────────────────────────────────────────
      planes: [],
      selectedPlan: null,
      planModulosSeleccionados: new Set(),
      loadingPlanes: false,
      loadingPlanModulos: false,
      savingPlan: false,

      // ── Tab Módulos ─────────────────────────────────────────────
      todosModulos: [],
      loadingTodosModulos: false,
      nuevoModulo: { clave: '', nombre: '', grupo: 'usuario' },
      savingModulo: false,
      editingModulo: null,
      editForm: { clave: '', nombre: '', grupo: 'usuario' },

      // ── Tab Usuarios ────────────────────────────────────────────
      filterVista: '',
      userSearch: '',
      userResults: [],
      selectedUser: null,
      userOverrides: [],      // { idModulo, acceso }
      loadingUserOverrides: false,
      savingOverride: null,   // idModulo del que se está guardando
      bulkSaving: false,
      searchTimeout: null,
    };
  },

  computed: {
    vistasDisponibles() {
      const vistas = new Map();
      this.modulos.forEach(m => {
        const top = m.clave.split('.')[0];
        if (!vistas.has(top)) {
          const topMod = this.modulos.find(mod => mod.clave === top);
          vistas.set(top, topMod ? topMod.nombre : top);
        }
      });
      return Array.from(vistas.entries())
        .map(([clave, nombre]) => ({ clave, nombre }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    },

    gruposModulos() {
      const vista = this.filterVista;
      return GRUPOS_ORDEN
        .map(key => ({
          key,
          modulos: this.modulos.filter(m => {
            if (m.grupo !== key) return false;
            if (!vista) return true;
            return m.clave === vista || m.clave.startsWith(vista + '.');
          }),
        }))
        .filter(g => g.modulos.length > 0);
    },

    rutasConAcciones() {
      const vista = this.filterVista;
      return GRUPOS_ORDEN.map(key => {
        const modulosGrupo = this.modulos.filter(m => {
          if (m.grupo !== key) return false;
          if (!vista) return true;
          return m.clave === vista || m.clave.startsWith(vista + '.');
        });

        // Raíces = sin punto
        const raices = modulosGrupo.filter(m => !m.clave.includes('.'));
        const claveRaices = new Set(raices.map(r => r.clave));

        // Sub-módulos huérfanos (padre no existe como módulo propio)
        const pseudoGrupos = new Map();
        modulosGrupo.filter(m => m.clave.includes('.')).forEach(m => {
          const prefijo = m.clave.split('.')[0];
          if (!claveRaices.has(prefijo)) {
            if (!pseudoGrupos.has(prefijo)) {
              pseudoGrupos.set(prefijo, { id: `pseudo-${prefijo}`, clave: prefijo, nombre: prefijo, grupo: key, acciones: [] });
            }
            pseudoGrupos.get(prefijo).acciones.push(m);
          }
        });

        const rutas = [
          ...raices.map(r => ({
            ...r,
            acciones: modulosGrupo.filter(m => m.clave !== r.clave && m.clave.startsWith(r.clave + '.')),
          })),
          ...Array.from(pseudoGrupos.values()),
        ];

        return { key, rutas };
      }).filter(g => g.rutas.length > 0);
    },
  },

  methods: {
    getPlanName(idPlan) {
      if (!idPlan) return 'Sin plan';
      const p = this.planes.find(p => (p.id ?? p.ID) === Number(idPlan));
      return p ? (p.descripcion || p.DESCRIPCION || `Plan ${idPlan}`) : `Plan ${idPlan}`;
    },

    // Extrae el array de cualquier shape de respuesta:
    // array | { DATA: array } | { DATA: { data: array } } | { data: array }
    xList(res) {
      if (!res) return [];
      if (Array.isArray(res)) return res;
      const inner = res?.DATA ?? res?.data ?? res;
      if (Array.isArray(inner)) return inner;
      return inner?.data ?? inner?.DATA ?? [];
    },

    // ── Carga inicial ──────────────────────────────────────────

    async cargarModulos() {
      const res = await PermisosProxy.getModulos().catch(() => null);
      this.modulos = this.xList(res).map(m => ({
        id: m.id ?? m.ID,
        clave: m.clave ?? m.CLAVE,
        nombre: m.nombre ?? m.NOMBRE,
        grupo: (m.grupo ?? m.GRUPO ?? 'usuario').toLowerCase(),
      }));
    },

    async cargarPlanes() {
      this.loadingPlanes = true;
      const res = await MantenimientoProxy.listPlanes({ INIT: 0, ROWS: 100 }).catch(() => null);
      this.planes = this.xList(res);
      this.loadingPlanes = false;
    },

    // ── Tab Planes ─────────────────────────────────────────────

    async selectPlan(plan) {
      this.selectedPlan = plan;
      this.loadingPlanModulos = true;
      const planId = plan.id ?? plan.ID;
      const res = await PermisosProxy.getPlanModulos(planId).catch(() => null);
      const list = this.xList(res);
      this.planModulosSeleccionados = new Set(
        list.map(pm => pm.idModulo ?? pm.IDMODULO ?? pm.modulo?.id ?? pm.modulo?.ID),
      );
      this.loadingPlanModulos = false;
    },

    togglePlanModulo(idModulo) {
      const next = new Set(this.planModulosSeleccionados);
      next.has(idModulo) ? next.delete(idModulo) : next.add(idModulo);
      this.planModulosSeleccionados = next;
    },

    marcarTodos(valor) {
      this.planModulosSeleccionados = valor
        ? new Set(this.modulos.map(m => m.id))
        : new Set();
    },

    async guardarPlanModulos() {
      this.savingPlan = true;
      const res = await PermisosProxy.setPlanModulos(
        this.selectedPlan.id ?? this.selectedPlan.ID,
        [...this.planModulosSeleccionados],
      ).catch(() => null);
      this.savingPlan = false;
      if (res?.STATUS) {
        toast.success('Permisos del plan guardados');
      } else {
        toast.error('Error al guardar');
      }
    },

    // ── Tab Usuarios ───────────────────────────────────────────

    buscarUsuarios() {
      clearTimeout(this.searchTimeout);
      if (this.userSearch?.length < 2) {
        this.userResults = [];
        return;
      }
      this.searchTimeout = setTimeout(async () => {
        const res = await UserProxy.list({ INIT: 0, ROWS: 10, search: this.userSearch }).catch(() => null);
        this.userResults = this.xList(res).slice(0, 8);
      }, 300);
    },

    cerrarDropdown() {
      this.userResults = [];
    },

    async selectUser(user) {
      this.selectedUser = user;
      this.userSearch = `${user.NOMBRES} ${user.APATERNO}`;
      this.userResults = [];
      await this.cargarUserOverrides();
    },

    limpiarUsuario() {
      this.selectedUser = null;
      this.userSearch = '';
      this.userOverrides = [];
    },

    async cargarUserOverrides() {
      this.loadingUserOverrides = true;
      const userId = this.selectedUser.id ?? this.selectedUser.ID;
      const res = await PermisosProxy.getUsuarioOverrides(userId).catch(() => null);
      this.userOverrides = this.xList(res).map(o => ({
        idModulo: o.idModulo ?? o.IDMODULO ?? o.modulo?.id ?? o.modulo?.ID,
        acceso: o.acceso ?? o.ACCESO,
      }));
      this.loadingUserOverrides = false;
    },

    getOverride(idModulo) {
      const o = this.userOverrides.find(x => x.idModulo === idModulo);
      return o?.acceso ?? null;
    },

    async _refreshIfSelf(userId) {
      const authStore = useAuthStore();
      const myId = authStore.user?.ID ?? authStore.user?.id;
      if (String(userId) === String(myId)) {
        try { await authStore.refreshAccessToken(); } catch { /* best-effort */ }
      }
    },

    async setOverride(idModulo, acceso) {
      // Si ya tiene ese mismo override, lo quita (toggle)
      if (this.getOverride(idModulo) === acceso) {
        return this.removeOverride(idModulo);
      }
      this.savingOverride = idModulo;
      const userId = this.selectedUser.id ?? this.selectedUser.ID;
      const res = await PermisosProxy.setOverride(userId, idModulo, acceso).catch(() => null);
      if (res?.STATUS) {
        const idx = this.userOverrides.findIndex(x => x.idModulo === idModulo);
        if (idx >= 0) {
          this.userOverrides[idx].acceso = acceso;
        } else {
          this.userOverrides.push({ idModulo, acceso });
        }
        await this._refreshIfSelf(userId);
      } else {
        toast.error('Error al guardar override');
      }
      this.savingOverride = null;
    },

    async removeOverride(idModulo) {
      this.savingOverride = idModulo;
      const userId = this.selectedUser.id ?? this.selectedUser.ID;
      const res = await PermisosProxy.removeOverride(userId, idModulo).catch(() => null);
      if (res?.STATUS) {
        this.userOverrides = this.userOverrides.filter(x => x.idModulo !== idModulo);
        await this._refreshIfSelf(userId);
      } else {
        toast.error('Error al eliminar override');
      }
      this.savingOverride = null;
    },

    async bulkSet(acceso, grupo = null) {
      this.bulkSaving = true;
      const userId = this.selectedUser.id ?? this.selectedUser.ID;
      const filtrados = grupo
        ? this.modulos.filter(m => m.grupo === grupo)
        : this.modulos;
      const moduloIds = filtrados.map(m => m.id);
      const area = grupo === 'admin' ? 'Área Admin' : grupo === 'usuario' ? 'Área Usuario' : 'Todos';
      const res = await PermisosProxy.bulkSet(userId, acceso, moduloIds).catch(() => null);
      if (res?.STATUS) {
        const labels = { grant: 'grant aplicado', revoke: 'acceso revocado', reset: 'overrides reseteados' };
        toast.success(`${area}: ${labels[acceso]}`);
        await this.cargarUserOverrides();
        await this._refreshIfSelf(userId);
      } else {
        toast.error('Error en la operación masiva');
      }
      this.bulkSaving = false;
    },

    // ── Métodos Tab Módulos ──────────────────────────────────────
    async cargarTodosModulos() {
      this.loadingTodosModulos = true;
      const res = await PermisosProxy.getModulosAll().catch(() => null);
      this.todosModulos = Array.isArray(res) ? res : (res?.DATA ?? []);
      this.loadingTodosModulos = false;
    },

    async crearModulo() {
      if (!this.nuevoModulo.clave.trim() || !this.nuevoModulo.nombre.trim()) return;
      this.savingModulo = true;
      const res = await PermisosProxy.createModulo({ ...this.nuevoModulo }).catch(() => null);
      if (res?.STATUS) {
        toast.success('Módulo creado');
        this.nuevoModulo = { clave: '', nombre: '', grupo: 'usuario' };
        await this.cargarTodosModulos();
        await this.cargarModulos(); // actualizar catálogo activo
      } else {
        toast.error('Error al crear módulo — la clave puede estar repetida');
      }
      this.savingModulo = false;
    },

    iniciarEdicion(mod) {
      this.editingModulo = mod.id;
      this.editForm = { clave: mod.clave, nombre: mod.nombre, grupo: mod.grupo ?? 'usuario' };
    },

    async guardarEdicion(id) {
      this.savingModulo = true;
      const res = await PermisosProxy.updateModulo(id, { ...this.editForm }).catch(() => null);
      if (res?.STATUS) {
        toast.success('Módulo actualizado');
        this.editingModulo = null;
        await this.cargarTodosModulos();
        await this.cargarModulos();
      } else {
        toast.error('Error al actualizar módulo');
      }
      this.savingModulo = false;
    },

    async desactivarModulo(id) {
      const res = await PermisosProxy.deleteModulo(id).catch(() => null);
      if (res?.STATUS) {
        const m = this.todosModulos.find(x => x.id === id);
        if (m) m.estado = 'I';
        toast.success('Módulo desactivado');
      } else {
        toast.error('Error al desactivar módulo');
      }
    },

    async reactivarModulo(id) {
      const res = await PermisosProxy.updateModulo(id, { estado: 'A' }).catch(() => null);
      if (res?.STATUS) {
        const m = this.todosModulos.find(x => x.id === id);
        if (m) m.estado = 'A';
        toast.success('Módulo reactivado');
      } else {
        toast.error('Error al reactivar módulo');
      }
    },
  },

  watch: {
    activeTab(tab) {
      if (tab === 'modulos' && this.todosModulos.length === 0) {
        this.cargarTodosModulos();
      }
    },
  },

  async mounted() {
    await Promise.all([this.cargarModulos(), this.cargarPlanes()]);
  },
};
</script>

<style scoped>
.text-brand-blue { color: #3b82f6; }
</style>
