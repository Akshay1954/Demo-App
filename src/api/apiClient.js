import axios from 'axios';
import authService from '../services/authService';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token + language header for every request
api.interceptors.request.use((config) => {
  const token = authService.getAccessToken();
  const lang = localStorage.getItem('sr_lang') || 'en';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🌍 Include language preference
  config.headers['Accept-Language'] = lang;

  return config;
});

// ==============================
// Handle 401 + token refresh
// ==============================
let isRefreshing = false;
let refreshQueue = [];

function processQueue(err, newToken = null) {
  refreshQueue.forEach(p => (err ? p.reject(err) : p.resolve(newToken)));
  refreshQueue = [];
}

api.interceptors.response.use(
  res => res,
  async err => {
    const originalReq = err.config;

    if (!originalReq || originalReq._retry) return Promise.reject(err);

    if (err.response && err.response.status === 401) {
      originalReq._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const newTokens = await authService.refresh();
          isRefreshing = false;
          processQueue(null, newTokens.accessToken);
        }

        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: token => {
              originalReq.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalReq));
            },
            reject: error => reject(error)
          });
        });
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
