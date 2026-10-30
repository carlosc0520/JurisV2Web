import axios from 'axios';

class MediaProxy {
    async list(model) {
        const { data } = await axios.get(`/admin/media/list`, { params: model });
        return data;
    }

    async upload(file, onProgress) {
        const formData = new FormData();
        formData.append('archivo', file);
        const { data } = await axios.post(`/admin/media/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
            onUploadProgress: onProgress,
        });
        return data;
    }

    async remove(id) {
        const { data } = await axios.delete(`/admin/media/${id}`);
        return data;
    }
}

export default new MediaProxy();
