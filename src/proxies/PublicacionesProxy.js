import axios from 'axios';

class PublicacionesProxy {
    // * ADMIN — artículos
    async list(model) {
        const { data } = await axios.get(`/admin/publicaciones/list`, { params: model });
        return data;
    }

    async findOne(id) {
        const { data } = await axios.get(`/admin/publicaciones/${id}`);
        return data;
    }

    async save(formData) {
        const { data } = await axios.post(`/admin/publicaciones/save`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
        });
        return data;
    }

    // * ADMIN — bloqueo de edición
    async bloqueos() {
        const { data } = await axios.get(`/admin/publicaciones/bloqueos`);
        return data;
    }

    async adquirirBloqueo(id, model) {
        const { data } = await axios.post(`/admin/publicaciones/${id}/bloqueo`, model);
        return data;
    }

    async latidoBloqueo(id, model) {
        const { data } = await axios.post(`/admin/publicaciones/${id}/bloqueo/latido`, model);
        return data;
    }

    async liberarBloqueo(id, model) {
        const { data } = await axios.post(`/admin/publicaciones/${id}/bloqueo/liberar`, model);
        return data;
    }

    async destacar(id, destacado) {
        const { data } = await axios.post(`/admin/publicaciones/${id}/destacar`, { DESTACADO: destacado });
        return data;
    }

    async duplicar(id) {
        const { data } = await axios.post(`/admin/publicaciones/${id}/duplicar`);
        return data;
    }

    async historial(id) {
        const { data } = await axios.get(`/admin/publicaciones/${id}/historial`);
        return data;
    }

    // * ADMIN — enlace temporal de vista previa
    async guardarPrevia(formData) {
        const { data } = await axios.post(`/admin/publicaciones/previa`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
        });
        return data;
    }

    async toggle(id) {
        const { data } = await axios.post(`/admin/publicaciones/toggle/${id}`);
        return data;
    }

    // * ADMIN — categorías
    async listCategorias(model) {
        const { data } = await axios.get(`/admin/publicaciones/categorias/list`, { params: model });
        return data;
    }

    async saveCategoria(model) {
        const { data } = await axios.post(`/admin/publicaciones/categorias/save`, model);
        return data;
    }

    async toggleCategoria(id) {
        const { data } = await axios.post(`/admin/publicaciones/categorias/toggle/${id}`);
        return data;
    }

    // * PÚBLICO
    async listPublicas(model) {
        const { data } = await axios.get(`/publicaciones`, { params: model });
        return data;
    }

    async categoriasPublicas() {
        const { data } = await axios.get(`/publicaciones/categorias`);
        return data;
    }

    async destacada() {
        const { data } = await axios.get(`/publicaciones/destacada`);
        return data;
    }

    // Bandera pública de JURIS.FEATURE_FLAG (p. ej. BLOG_PUBLICACIONES)
    async flag(clave) {
        const { data } = await axios.get(`/flags/${clave}`);
        return data;
    }

    async previa(token) {
        const { data } = await axios.get(`/publicaciones/previa/${token}`);
        return data;
    }

    async porSlug(slug) {
        const { data } = await axios.get(`/publicaciones/${slug}`);
        return data;
    }
}

export default new PublicacionesProxy();
