import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rice-backend-gzgs.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);