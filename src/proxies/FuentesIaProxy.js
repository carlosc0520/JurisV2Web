import axios from "axios";

// Admin → Fuentes de la IA: normas (artículos del CP y NCPP) y glosario de siglas
class FuentesIaProxy {
  async resumen() {
    const { data } = await axios.get("/admin/fuentes-ia/resumen");
    return data;
  }

  // Vuelve a cargar normas y glosario en la IA
  async recargar() {
    const { data } = await axios.post("/admin/fuentes-ia/recargar");
    return data;
  }

  // model: { codigo: 'CP' | 'NCPP', q, estado, INIT, ROWS }
  async listarArticulos(model) {
    const { data } = await axios.get("/admin/fuentes-ia/articulos", { params: model });
    return data;
  }

  async obtenerArticulo(id) {
    const { data } = await axios.get(`/admin/fuentes-ia/articulos/${id}`);
    return data;
  }

  async guardarArticulo(model) {
    const { data } = await axios.post("/admin/fuentes-ia/articulos/save", model);
    return data;
  }

  async toggleArticulo(id) {
    const { data } = await axios.post(`/admin/fuentes-ia/articulos/${id}/toggle`);
    return data;
  }

  async listarSiglas() {
    const { data } = await axios.get("/admin/fuentes-ia/siglas");
    return data;
  }

  async historialSigla(id) {
    const { data } = await axios.get(`/admin/fuentes-ia/siglas/${id}/historial`);
    return data;
  }

  async guardarSigla(model) {
    const { data } = await axios.post("/admin/fuentes-ia/siglas/save", model);
    return data;
  }

  async toggleSigla(id) {
    const { data } = await axios.post(`/admin/fuentes-ia/siglas/${id}/toggle`);
    return data;
  }
}

export default new FuentesIaProxy();
