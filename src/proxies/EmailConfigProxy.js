import axios from 'axios';

class EmailConfigProxy {
  async list(estado = '') {
    const { data } = await axios.get('/admin/email-config/list', { params: estado ? { estado } : {} });
    return data;
  }

  async save(model) {
    const { data } = await axios.post('/admin/email-config/save', model);
    return data;
  }

  async remove(ID) {
    const { data } = await axios.post('/admin/email-config/delete', { ID });
    return data;
  }
}

export default new EmailConfigProxy();
