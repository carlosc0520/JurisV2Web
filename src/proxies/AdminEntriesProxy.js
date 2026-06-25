import axios from "axios";

class AdminEntriesProxy {
  async create(formData) {
    const { data } = await axios.post(`/admin/entries/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return data;
  }

  // * CONSULTA OBTENDRA UN ZIP DE RESPUESTA
  async getDocumentZip(formData) {
    const { data } = await axios.get(`/admin/entries/list-search-data?RTITLE=${formData.RTITLE}&TYPE=${formData.TYPE}&BLOG=${formData.BLOG}`, {
      responseType: 'blob',
      headers: {
        Accept: "application/json",
      },
    });

    return data;
  }

  async getDocumentZipAll(formData) {
    const { data } = await axios.post(`/admin/entries/list-search-data-allZip`, formData, {
      responseType: 'blob',
      headers: {
        Accept: "application/json",
      },
    });

    return data;
  }

  async edit(formData) {
    const { data } = await axios.post(`/admin/entries/edit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return data;
  }

  async list(model, TYPE = null) {
    const { data } = await axios.get(`/admin/entries/list?TYPE=${TYPE}`, {
      params: model,
    });
    return data;
  }

  async listSearchDataFull(model) {
    const { data } = await axios.get(`/admin/entries/list-search-data-full?RTITLE=${model.RTITLE}&TYPE=${model.TYPE}&BLOG=${model.BLOG}`, {
      responseType: 'blob',
      headers: {
        Accept: "application/json",
      },
    });
    return data;
  }

  async listSearchNames(model) {
    const { data } = await axios.get(`/admin/entries/list-search-names`, {
      params: model,
    });
    return data;
  }

  async listdata(model, type = null) {
    const { data } = await axios.get(`/admin/entries/list-data?TYPE=${type}`, {
      params: model,
    });
    return data;
  }

  async delete(ID) {
    const { data } = await axios.post("/admin/entries/delete", { ID });
    return data;
  }

  async get(model) {
    const { data } = await axios.get(`/admin/entries/get?ID=${model.ID}`);
    return data;
  }

  async getPrint(model) {
    const { data } = await axios.get(`/admin/entries/getPrint?ID=${model.ID}`);
    return data;
  }

  // * BUSQUEDA
  async search(model) {
    const { data } = await axios.get(`/admin/entries/busqueda`, {
      params: model,
    });
    return data;
  }

  async searchSugges(model) {
    const { data } = await axios.get(`/admin/entries/busqueda-sugges`, {
      params: model,
    });
    return data;
  }

  async searchFavorites(model) {
    const { data } = await axios.get(`/admin/entries/busqueda-favorites`, {
      params: model,
    });
    return data;
  }

  async searchFavoritesEntrie(model) {
    const { data } = await axios.get(
      `/admin/entries/busqueda-favorites-entrie`,
      {
        params: model,
      }
    );
    return data;
  }

  async saveTitleEntrie(model) {
    const { data } = await axios.post(
      `/admin/entries/save-title-entrie`,
      model
    );
    return data;
  }

  async filtersBusquedaSearch(model) {
    const { data } = await axios.get(`/admin/entries/filters-busqueda-search`, {
      params: model,
    });
    return data;
  }

  async saveOpenEntrie(model) {
    const { data } = await axios.post(
      `/admin/entries/save-open-entrie`,
      model
    );
    return data;
  }

  // * FILES
  async downloadFile(model) {
    const { data } = await axios.post(`/admin/entries/download-file`, model, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });
    return data;
  }

  async createSingle(formData) {
    const { data } = await axios.post(`/admin/entries/add-single`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return data;
  }

  async editSingle(formData) {
    const { data } = await axios.post(`/admin/entries/edit-single`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return data;
  }

  // ********************** DELETE
  async getDocument(model) {
    const response = await axios.get(`/admin/entries/doc`, {
      params: model,
      responseType: "blob", // O 'arraybuffer' si prefieres trabajar con buffers
    });

    // Retorna la data directamente
    return response.data;
  }

  async saveSearch(model) {
    const { data } = await axios.post(`/admin/entries/save-search`, model);
    return data;
  }

  async listTopSearch(TYPE = null) {
    const { data } = await axios.get(`/admin/entries/listTopSearch?TYPE=${TYPE}`);
    return data;
  }

  async clearTopSearch(id) {
    const { data } = await axios.post(`/admin/entries/clearTopSearch`, { ID: id });
    return data;
  }

  async intercambioOrderSearch(IdOrden, IdOrden2) {
    const { data } = await axios.post(`/admin/entries/intercambio-order-search`, { IdOrden, IdOrden2 });
    return data;
  }
}

export default new AdminEntriesProxy();
