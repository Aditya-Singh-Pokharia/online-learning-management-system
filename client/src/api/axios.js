import axios from 'axios';

// Single axios instance used across the whole app.
// - baseURL points at the Express API (proxied to :5000 in dev, see vite.config.js)
// - request interceptor attaches the JWT from localStorage to every call
// - response interceptor logs the user out if the token is rejected (401)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
    }
    return Promise.reject(error);
  }
);

export default api;
