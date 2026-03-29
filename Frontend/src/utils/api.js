import axios from 'axios';

const api = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:5000/api`,
});

console.warn(`🌐 AttendX API Base URL: ${window.location.protocol}//${window.location.hostname}:5000/api`);

// Add a request interceptor to include the JWT token in every request
api.interceptors.request.use((config) => {
  console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
