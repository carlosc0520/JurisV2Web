import axios from 'axios';

class NoticiaEspacioProxy {

    // * GUARDADOS

    async list(params) {
        const { data } = await axios.get('/admin/noticias-espacio/list', { params });
        return data;
    }

    async save(IDNOTICIA) {
        const { data } = await axios.get('/admin/noticias-espacio/save?IDNOTICIA=' + IDNOTICIA, { params: {} });
        return data;
    }

    async unsave(ID) {
        const { data } = await axios.post('/admin/noticias-espacio/unsave', { ID });
        return data;
    }

    async update(model) {
        const { data } = await axios.post('/admin/noticias-espacio/update', model);
        return data;
    }

    async toggleStarred(ID) {
        const { data } = await axios.post('/admin/noticias-espacio/toggle-starred', { ID });
        return data;
    }

    // * CARPETAS

    async createFolder(model) {
        const { data } = await axios.post('/admin/noticias-espacio/folders/add', model);
        return data;
    }

    async updateFolder(model) {
        const { data } = await axios.post('/admin/noticias-espacio/folders/edit', model);
        return data;
    }

    async deleteFolders(CARPETAS) {
        const { data } = await axios.post('/admin/noticias-espacio/folders/delete', { CARPETAS });
        return data;
    }

    async listFolders(DSCRPCN) {
        const { data } = await axios.get('/admin/noticias-espacio/folders/list', { params: { DSCRPCN } });
        return data;
    }

    async listFoldersAll() {
        const { data } = await axios.get('/admin/noticias-espacio/folders/list-all');
        return data;
    }

    async moveItem(IDGUARDADA, IDCARPETA) {
        const { data } = await axios.post('/admin/noticias-espacio/folders/move-item', { IDGUARDADA, IDCARPETA });
        return data;
    }

    async removeItem(IDCARPETA, IDGUARDADA) {
        const { data } = await axios.post('/admin/noticias-espacio/folders/remove-item', { IDCARPETA, IDGUARDADA });
        return data;
    }

    // * COMPARTIR

    async share(model) {
        const { data } = await axios.post('/admin/noticias-espacio/share', model);
        return data;
    }

    async getShareContacts(ID, TIPO) {
        const { data } = await axios.get('/admin/noticias-espacio/share/contacts', { params: { ID, TIPO } });
        return data;
    }

    async updatePermisos(model) {
        const { data } = await axios.post('/admin/noticias-espacio/share/update-permisos', model);
        return data;
    }

    async compartidosConmigo() {
        const { data } = await axios.get('/admin/noticias-espacio/share/compartidos-conmigo');
        return data;
    }
}

export default new NoticiaEspacioProxy();
