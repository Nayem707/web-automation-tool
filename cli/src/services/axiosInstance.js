import axios from 'axios';
import { API_CONFIG } from '../config/constants';

// Add token storage helper (you'll need to implement this based on your auth)
const getToken = () => {
  // Example: return localStorage.getItem('token');
  return localStorage.getItem('access_token') || null;
};

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can transform response here if needed
    return response;
  },
  (error) => {
    const { response } = error;

    // Handle specific error statuses
    if (response?.status === 401) {
      // Handle unauthorized - redirect to login or refresh token
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }

    // You can add more error handling here
    if (response?.status === 403) {
      // Handle forbidden
    }

    if (response?.status === 404) {
      // Handle not found
    }

    // Always reject with error for thunk to catch
    return Promise.reject(error);
  }
);

export default axiosInstance;
