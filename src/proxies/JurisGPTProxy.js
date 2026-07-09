import axios from 'axios';

class JurisGPTProxy {
    async getSessions() {
        const { data } = await axios.get('/admin/jurisgpt/sessions');
        return data;
    }

    async createSession() {
        const { data } = await axios.post('/admin/jurisgpt/sessions');
        return data;
    }

    async getMessages(sessionId) {
        const { data } = await axios.get(`/admin/jurisgpt/sessions/${sessionId}/msgs`);
        return data;
    }

    async chat(chatId, message) {
        const { data } = await axios.post('/admin/jurisgpt/chat', { chatId, message });
        return data;
    }

    async deleteSession(sessionId) {
        const { data } = await axios.delete(`/admin/jurisgpt/sessions/${sessionId}`);
        return data;
    }

    async getAudit({ page = 1, limit = 20, hasSources } = {}) {
        const params = { page, limit };
        if (hasSources !== undefined && hasSources !== null) params.hasSources = hasSources;
        const { data } = await axios.get('/admin/jurisgpt/audit', { params });
        return data;
    }
}

export default new JurisGPTProxy();
