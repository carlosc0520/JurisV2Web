import axios from 'axios';

class PermisosProxy {
  // Catálogo completo de módulos (activos)
  async getModulos() {
    const { data } = await axios.get('/admin/permisos/modulos');
    return data;
  }

  // Todos los módulos incluyendo inactivos (para gestión de catálogo)
  async getModulosAll() {
    const { data } = await axios.get('/admin/permisos/modulos/all');
    return data;
  }

  // Crear nuevo módulo
  async createModulo(model) {
    const { data } = await axios.post('/admin/permisos/modulos', model);
    return data;
  }

  // Actualizar módulo
  async updateModulo(id, model) {
    const { data } = await axios.put(`/admin/permisos/modulos/${id}`, model);
    return data;
  }

  // Desactivar módulo (soft delete)
  async deleteModulo(id) {
    const { data } = await axios.delete(`/admin/permisos/modulos/${id}`);
    return data;
  }

  // Módulos asignados a un plan
  async getPlanModulos(idPlan) {
    const { data } = await axios.get(`/admin/permisos/plan/${idPlan}`);
    return data;
  }

  // Guardar módulos de un plan (reemplaza todo)
  async setPlanModulos(idPlan, modulos) {
    const { data } = await axios.post(`/admin/permisos/plan/${idPlan}`, { modulos });
    return data;
  }

  // Overrides de un usuario
  async getUsuarioOverrides(idUsuario) {
    const { data } = await axios.get(`/admin/permisos/usuario/${idUsuario}`);
    return data;
  }

  // Agregar / actualizar override
  async setOverride(idUsuario, idModulo, acceso) {
    const { data } = await axios.post(`/admin/permisos/usuario/${idUsuario}/override`, {
      idModulo,
      acceso,
    });
    return data;
  }

  // Eliminar override puntual
  async removeOverride(idUsuario, idModulo) {
    const { data } = await axios.delete(
      `/admin/permisos/usuario/${idUsuario}/override/${idModulo}`,
    );
    return data;
  }

  // Permisos efectivos de un usuario (preview)
  async getEfectivos(idUsuario, idPlan) {
    const { data } = await axios.get(
      `/admin/permisos/usuario/${idUsuario}/efectivos/${idPlan}`,
    );
    return data;
  }

  // Aplicar grant/revoke/reset masivo a un usuario
  async bulkSet(idUsuario, acceso, moduloIds) {
    const { data } = await axios.post(
      `/admin/permisos/usuario/${idUsuario}/bulk`,
      { acceso, moduloIds },
    );
    return data;
  }

  // Limpiar todos los overrides de un usuario
  async clearOverrides(idUsuario) {
    const { data } = await axios.delete(`/admin/permisos/usuario/${idUsuario}/overrides`);
    return data;
  }
}

export default new PermisosProxy();
