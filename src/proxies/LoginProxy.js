import axios from 'axios';

class LoginProxy {
    async login(model) {
        const resp = await axios.post(`/login/autenticar`, model);
        return resp;
    }

    async logout(token = null) {
        // Usar el token proporcionado o intentar obtenerlo del localStorage
        const accessToken = token || localStorage.getItem('accessToken');
        const resp = await axios.get(`/login/logout?token=${accessToken}`);
        return resp;
    }

    async refresh(refreshToken) {
        const resp = await axios.post(`/login/refresh`, { refreshToken });
        return resp;
    }

    // * NOTICIAS
    async list(model) {
        const { data } = await axios.get(`/login/noticias`, {
            params: model 
        });
        return data;
    }

    async listCategorias(model) {
        const { data } = await axios.get(`/login/list-categorias`, {
            params: model
        });
        return data;
    }
    
    // * PREGUNTAS
    async listpreguntas(model) {
        const { data } = await axios.get(`/login/preguntas`, {
            params: model
        });
        return data;
    }
    
    async siteConfig() {
        const { data } = await axios.get(`/login/site-config`);
        return data;
    }

    async recover(model) {
        const { data } = await axios.post(`/auth/lost-password`, model);
        return data;
    }
}

export default new LoginProxy();