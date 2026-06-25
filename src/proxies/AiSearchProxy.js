import axios from "axios";

class AiSearchProxy {
  async getQuota() {
    const { data } = await axios.get("/admin/ai-search/quota");
    return data;
  }

  async search(body) {
    const { data } = await axios.post("/admin/ai-search", body);
    return data;
  }

  async getStats() {
    const { data } = await axios.get("/admin/ai-search/stats");
    return data;
  }

  async getMissing(page = 1, limit = 20) {
    const { data } = await axios.get(`/admin/ai-search/missing?page=${page}&limit=${limit}`);
    return data;
  }

  async reindex() {
    const { data } = await axios.post("/admin/ai-search/reindex");
    return data;
  }

  async indexEntry(id) {
    const { data } = await axios.post(`/admin/ai-search/index-entry/${id}`);
    return data;
  }

  async reloadLimits() {
    const { data } = await axios.post("/admin/ai-search/reload-limits");
    return data;
  }

  async extractFromPdf(file, type, catalogs) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    fd.append('catalogs', JSON.stringify(catalogs));
    const { data } = await axios.post('/admin/ai-search/extract-from-pdf', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async getMonthlyStats() {
    const { data } = await axios.get("/admin/ai-search/monthly-stats");
    return data;
  }

  async getUserMonthly(userId) {
    const { data } = await axios.get(`/admin/ai-search/user-monthly/${userId}`);
    return data;
  }
}

export default new AiSearchProxy();
