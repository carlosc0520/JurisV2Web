import axios from 'axios';

class FileMigrationProxy {
  async exportEntradasJson() {
    const { data } = await axios.get('/admin/file-migration/export-entradas-json', {
      responseType: 'blob',
    });
    return data;
  }

  async preview() {
    const { data } = await axios.get('/admin/file-migration/preview');
    return data?.DATA ?? data;
  }

  async start() {
    const { data } = await axios.post('/admin/file-migration/start');
    return data?.DATA ?? data;
  }

  async progress(jobId) {
    const { data } = await axios.get(`/admin/file-migration/progress/${jobId}`);
    return data?.DATA ?? data;
  }

  async downloadExcel(jobId) {
    const { data } = await axios.get(`/admin/file-migration/excel/${jobId}`, {
      responseType: 'blob',
    });
    return data;
  }

  async startOrphanScan() {
    const { data } = await axios.post('/admin/file-migration/start-orphan-scan');
    return data?.DATA ?? data;
  }

  async orphanProgress(jobId) {
    const { data } = await axios.get(`/admin/file-migration/orphan-progress/${jobId}`);
    return data?.DATA ?? data;
  }

  async downloadOrphanZip(jobId) {
    const { data } = await axios.get(`/admin/file-migration/download-orphan-zip/${jobId}`, {
      responseType: 'blob',
      timeout: 0,
    });
    return data;
  }

  async downloadMissingZip(onProgress) {
    const { data } = await axios.get('/admin/file-migration/download-missing-zip', {
      responseType: 'blob',
      timeout: 0,
      onDownloadProgress: onProgress ?? null,
    });
    return data;
  }

  async downloadS3Zip(prefix = '') {
    const { data } = await axios.get('/admin/file-migration/download-s3-zip', {
      params: prefix ? { prefix } : {},
      responseType: 'blob',
      timeout: 0, // sin timeout — puede tardar mucho
      onDownloadProgress: (evt) => {
        if (this._onZipProgress) this._onZipProgress(evt);
      },
    });
    return data;
  }

  onZipProgress(fn) {
    this._onZipProgress = fn;
    return this;
  }
}

export default new FileMigrationProxy();
