import axios from 'axios';

class NewUserProxy {

    async solicitud(model) {
        const { data } = await axios.post(`/login/solicitudUser`, model);
        return data;
    }
    
    async registrar(model) {
        const { data } = await axios.post(`/login/generateUser`, model);
        return data;
    }
    
    async registrarFind(model) {
        const { data } = await axios.post(`/login/generateUserFind`, model);
        return data;
    }

    async sendOtp(email) {
        const { data } = await axios.post(`/login/send-otp`, { EMAIL: email });
        return data;
    }

    async verifyOtp(email, codigo) {
        const { data } = await axios.post(`/login/verify-otp`, { EMAIL: email, CODIGO: codigo });
        return data;
    }
    

    async validar(token) {
        const { data } = await axios.get(`/login/validateToken`, {
            params: { token }
        });
        return data;
    }

    async validar_recovery(token) {
        const { data } = await axios.get(`/login/validateToken-recovery`, {
            params: { token }
        });
        return data;
    }

    
    async recovery(model) {
        const { data } = await axios.post(`/login/recovery`, model);
        return data;
    }

    async recoveryUser(model) {
        const { data } = await axios.post(`/login/recoveryUser`, model);
        return data;
    }
}

export default new NewUserProxy();