import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds
});

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/conversion/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}

export async function checkStatus(jobId) {
  const response = await api.get(`/conversion/status/${jobId}`);
  return response.data;
}

export async function downloadFile(jobId) {
  window.location.href = `/api/conversion/download/${jobId}`;
}