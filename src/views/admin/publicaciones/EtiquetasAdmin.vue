<template>
  <SectionCard title="Etiquetas">
    <p class="m-0 mb-3 text-xs" style="color:var(--text-muted)">
      Cada etiqueta pertenece a una categoría y se crea al editar esa categoría. Aquí se renombran o se
      desactivan: una desactivada deja de mostrarse en el blog, pero no se quita de los artículos.
    </p>
    <p v-if="cargando" class="m-0 text-sm" style="color:var(--text-muted)">Cargando etiquetas…</p>
    <p v-else-if="!visibles.length" class="m-0 text-sm" style="color:var(--text-muted)">
      {{ etiquetas.length ? 'Ninguna coincide con la búsqueda.' : 'Todavía no hay etiquetas.' }}
    </p>
    <ul v-else class="etq-lista">
      <li v-for="e in visibles" :key="e.id" :class="['etq-fila', e.estado !== 'A' ? 'etq-inactiva' : '']">
        <span class="font-semibold text-sm" style="color:var(--text)">{{ e.nombre }}</span>
        <span class="etq-categoria">{{ e.categoria || 'Sin categoría' }}</span>
        <span class="text-xs" style="color:var(--text-muted)">{{ e.total }} artículo{{ e.total === 1 ? '' : 's' }}</span>
        <span v-if="e.estado !== 'A'" class="etq-estado">Inactiva</span>
        <span class="flex-1" />
        <button type="button" class="etq-accion" :disabled="ocupado === e.id" @click="renombrar(e)">Renombrar</button>
        <button type="button" class="etq-accion" :disabled="ocupado === e.id" @click="alternar(e)">
          {{ e.estado === 'A' ? 'Desactivar' : 'Activar' }}
        </button>
      </li>
    </ul>
  </SectionCard>
</template>

<script>
import { toast } from 'vue3-toastify';
import PublicacionesProxy from '@/proxies/PublicacionesProxy';
import { slugDe } from '@/utils/slug';

export default {
  name: 'EtiquetasAdmin',
  props: {
    busqueda: { type: String, default: '' },
  },
  data() {
    return { etiquetas: [], cargando: true, ocupado: null };
  },
  computed: {
    visibles() {
      const b = slugDe(this.busqueda);
      return b ? this.etiquetas.filter(e => e.slug.includes(b)) : this.etiquetas;
    },
  },
  methods: {
    async cargar() {
      this.cargando = true;
      try {
        const r = await PublicacionesProxy.listEtiquetas();
        this.etiquetas = r?.DATA ?? r ?? [];
      } catch {
        toast.error('No se pudieron cargar las etiquetas', { toastId: 'error-etiquetas' });
      } finally {
        this.cargando = false;
      }
    },
    async renombrar(e) {
      const { default: Swal } = await import('sweetalert2');
      const { value, isConfirmed } = await Swal.fire({
        title: 'Renombrar etiqueta',
        input: 'text',
        inputValue: e.nombre,
        inputAttributes: { maxlength: 40 },
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        inputValidator: v => (!v || !v.trim() ? 'Escribe un nombre' : undefined),
      });
      if (!isConfirmed || value.trim() === e.nombre) return;
      await this.ejecutar(e, () => PublicacionesProxy.renombrarEtiqueta(e.id, value.trim()));
    },
    async alternar(e) {
      await this.ejecutar(e, () => PublicacionesProxy.toggleEtiqueta(e.id));
    },
    async ejecutar(e, accion) {
      this.ocupado = e.id;
      try {
        const r = await accion();
        const res = r?.DATA ?? r;
        if (!res?.STATUS) throw new Error(res?.MESSAGE);
        toast.success(res.MESSAGE || 'Etiqueta actualizada');
        await this.cargar();
      } catch (err) {
        toast.error(err?.message || 'No se pudo actualizar la etiqueta');
      } finally {
        this.ocupado = null;
      }
    },
  },
  mounted() { this.cargar(); },
};
</script>

<style scoped>
.etq-lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.etq-fila {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 9px 4px;
  border-top: 1px solid var(--border);
}
.etq-fila:first-child { border-top: none; }
.etq-inactiva { opacity: 0.6; }
.etq-categoria {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 999px;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
}
.etq-estado {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 999px;
  color: #64748b;
  background: rgba(100, 116, 139, 0.12);
}
.etq-accion {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 8px;
  color: #1864ff;
  background: rgba(24, 100, 255, 0.07);
}
.etq-accion:hover:not(:disabled) { background: rgba(24, 100, 255, 0.14); }
.etq-accion:disabled { opacity: 0.5; cursor: default; }
.dark .etq-accion { color: #c7d2fe; background: rgba(99, 102, 241, 0.18); }
</style>
