import axios from 'axios';

class HelpersProxy {
    async getHead(tipo) {
        const { data } = await axios.get(`/admin/helpers/getHead?TIPO=${tipo}`);
        return data;
    }

    async getDashboardStats() {
        const { data } = await axios.get('/admin/dashboard/stats');
        return data;
    }
}

export default new HelpersProxy();