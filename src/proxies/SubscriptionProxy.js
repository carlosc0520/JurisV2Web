import axios from 'axios';

class SubscriptionProxy {
    async create(formData) {
        const { data } = await axios.post(`/admin/culqi/create-order`, formData);
        return data;
    }

    async chargeWithToken(formData) {
        const { data } = await axios.post(`/admin/culqi/charge-with-token`, formData);
        return data;
    }

    async getSubscription() {
        const { data } = await axios.get(`/admin/user/subscription`);
        return data;
    }

    async payment_list(model) {
        const { data } = await axios.get(`/admin/user/payment-list`, {
            params: model
        });
        return data;
    }
}

export default new SubscriptionProxy();
