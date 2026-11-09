import axios from "axios";

// Verificación manual del informe de la búsqueda con IA (Admin → Informe IA)
class AiInformeProxy {
  async listar() {
    const { data } = await axios.get("/admin/ai-informe/revision");
    return data;
  }

  // model: { ESTADO: 'O' | 'F' | '' (quitar), NOTA }
  async guardar(caso, model) {
    const { data } = await axios.post(`/admin/ai-informe/revision/${encodeURIComponent(caso)}`, model);
    return data;
  }
}

export default new AiInformeProxy();
