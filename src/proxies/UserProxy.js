import axios from 'axios';

class UserProxy {

    async validate() {
        const { data } = await axios.get('/admin/user/validate-token');
        return data;
    }

    async validateTokenGoogle(token) {
        const { data } = await axios.get('/admin/user/validate-token', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    }


    async idRolByPath() {
        const { data } = await axios.get('/admin/user/get-role');
        return data;
    }

    async getReporte(model) {
        const { data } = await axios.get('/admin/user/reporte-estadisticos', {
            params: model
        });
        return data;
    }

    async addFavorite(IDENTRIE) {
        const { data } = await axios.get('/admin/user/add-favorite?IDENTRIE=' + IDENTRIE, {
            params: {}
        });

        return data;
    }

    async deleteFavorite(IDFAV) {
        const { data } = await axios.post('/admin/user/delete-favorite', { IDFAV });
        return data;
    }

    async paymentSubscription(model) {
        const { data } = await axios.post('/admin/user/payment-subscription', model);
        return data;
    }

    // * DIRECTORIOS
    async createDirectory(model) {
        const { data } = await axios.post('/admin/user/add-directory', model);
        return data;
    }

    async updateDirectory(model) {
        const { data } = await axios.post('/admin/user/edit-directory', model);
        return data;
    }

    async deleteDirectory(DIRECTORIOS) {
        const { data } = await axios.post('/admin/user/delete-directory', { DIRECTORIOS });
        return data;
    }

    async sharedDirectory(model) {
        const { data } = await axios.post('/admin/user/shared-directory', model);
        return data;
    }

    async listDirectory(model) {
        const { data } = await axios.get('/admin/user/list-directory', {
            params: model
        });
        return data;
    }

    async listDirectoryAll() {
        const { data } = await axios.get('/admin/user/list-directory-all');
        return data;
    }

    async saveAddDirectory(model) {
        const { data } = await axios.post('/admin/entries/save-add-directory', model);
        return data;
    }

    async create(model) {
        const { data } = await axios.post('/admin/user/add', model);
        return data;
    }

    async editar(model) {
        const { data } = await axios.post('/admin/user/edit', model);
        return data;
    }

    async editarFoce(formData) {
        const { data } = await axios.post('/admin/user/edit-force', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            },
        });
        return data;
    }

    async updateAvatar(file, currentRtafto) {
        const formData = new FormData();
        if (file) formData.append('files', file);
        if (currentRtafto) formData.append('RTAFTO', currentRtafto);
        const { data } = await axios.post('/admin/user/update-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
        });
        return data;
    }

    async list(model, IDROLE) {
        const params = { ...model };
        if (IDROLE !== undefined && IDROLE !== '') params.IDROLE = IDROLE;
        const { data } = await axios.get('/admin/user/list', { params });
        return data;
    }

    async getUsuario() {
        const { data } = await axios.get('/admin/user/get');
        return data;
    }


    async delete(ID) {
        const { data } = await axios.post('/admin/user/delete', { ID });
        return data;
    }

    async renewPlan(ID) {
        const { data } = await axios.post('/admin/user/renew-plan', { ID });
        return data;
    }

    async recover(model) {
        const { data } = await axios.post('/auth/lost-password', model);
        return data;
    }

    async deleteFavoriteDirectorio(IDDIRECTORIO, IDENTRIE) {
        const { data } = await axios.post('/admin/user/delete-favorite-directory', {
            IDDIRECTORIO,
            IDENTRIE
        });
        return data;
    }

    // * CONTACTO
    async getContactos(params) {
        const { data } = await axios.get('/admin/user/get-contacts', {
            params,
        });
        return data;
    }

    async createContacto(model) {
        const { data } = await axios.post('/admin/user/add-contact', model);
        return data;
    }

    async updateContacto(model) {
        const { data } = await axios.post('/admin/user/edit-contact', model);
        return data;
    }

    async deleteContacto(ID) {
        const { data } = await axios.post('/admin/user/delete-contact', { ID });
        return data;
    }
   
    async deleteNotificaciones(IDS) {
        const { data } = await axios.post('/admin/user/delete-notificaciones', { IDS });
        return data;
    }

    // NOTIFICACIONES
    async getNotificaciones(params) {
        const { data } = await axios.get('/admin/user/get-notifications', {
            params,
        });
        return data;
    }

    // * COMPARTIR
    async setCompartirEntrada(model) {
        const { data } = await axios.post('/admin/user/compartir-entradas', model);
        return data;
    }

    async getContactosSelecteds(model) {
        const { data } = await axios.get('/admin/user/get-contacts-selecteds', {
            params: model,
        });
        return data;
    }

    async updatePermisosFav(model) {
        const { data } = await axios.post('/admin/user/update-permisos-fav', model);
        return data;
    }

    async getDirUsers(params) {
        const { data } = await axios.get('/admin/user/get-dir-users', { params });
        return data;
    }

    async updatePermisosDir(model) {
        const { data } = await axios.post('/admin/user/update-permisos-dir', model);
        return data;
    }

    async updateView() {
        const { data } = await axios.get('/admin/user/update-view');
        return data;
    }

    // ── FAVORITOS (acciones nuevas) ──────────────────────────────
    async toggleStarred(IDFAV) {
        const { data } = await axios.post('/admin/user/toggle-starred', { IDFAV });
        return data;
    }

    async updateFavorite(model) {
        const { data } = await axios.post('/admin/user/update-favorite', model);
        return data;
    }

    async moveKanban(IDFAV, COL) {
        const { data } = await axios.post('/admin/user/move-kanban', { IDFAV, COL });
        return data;
    }

    // ── CASOS ────────────────────────────────────────────────────
    async getCasos(TERMINO) {
        const { data } = await axios.get('/admin/user/casos', { params: { TERMINO } });
        return data;
    }

    async addCaso(model) {
        const { data } = await axios.post('/admin/user/add-caso', model);
        return data;
    }

    async deleteCasoUser(ID) {
        const { data } = await axios.post('/admin/user/delete-caso', { ID });
        return data;
    }

    async addFavToCaso(model) {
        const { data } = await axios.post('/admin/user/add-fav-caso', model);
        return data;
    }

    // ── COMENTARIOS ──────────────────────────────────────────────
    async getComentariosFav(IDFAV) {
        const { data } = await axios.get('/admin/user/comentarios-fav', { params: { IDFAV } });
        return data;
    }

    async addComentarioFav(model) {
        const { data } = await axios.post('/admin/user/add-comentario-fav', model);
        return data;
    }

    async deleteComentarioFav(ID) {
        const { data } = await axios.post('/admin/user/delete-comentario-fav', { ID });
        return data;
    }

    // ── LISTA DE LECTURA ─────────────────────────────────────────
    async getLectura() {
        const { data } = await axios.get('/admin/user/lista-lectura');
        return data;
    }

    async addLectura(IDENTRIE) {
        const { data } = await axios.post('/admin/user/add-lista-lectura', { IDENTRIE });
        return data;
    }

    async removeLectura(ID) {
        const { data } = await axios.post('/admin/user/remove-lista-lectura', { ID });
        return data;
    }

    // ── WORKSPACES ───────────────────────────────────────────────
    async getWorkspaces() {
        const { data } = await axios.get('/admin/user/workspaces');
        return data;
    }

    // ── COMPARTIDOS ──────────────────────────────────────────────
    async compartidosConmigo() {
        const { data } = await axios.get('/admin/user/compartidos-conmigo');
        return data;
    }

    async responderCompartirUser(model) {
        const { data } = await axios.post('/admin/user/responder-compartir', model);
        return data;
    }

    // ── NOTIFICACIONES (nuevas) ──────────────────────────────────
    async countUnread() {
        const { data } = await axios.get('/admin/user/count-unread');
        return data;
    }

    async markReadNotif(IDS) {
        const { data } = await axios.post('/admin/user/mark-read', { IDS });
        return data;
    }

    async markAllReadNotif() {
        const { data } = await axios.post('/admin/user/mark-all-read');
        return data;
    }
}

export default new UserProxy();