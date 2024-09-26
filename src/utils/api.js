import axios from 'axios';
import { logout } from '@/services/authService'; 

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // Include HTTP-Only cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request new access token using refresh token
        const { data } = await api.post('/auth/refresh-token', {}, { withCredentials: true });

        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

        return api(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        // Check if the refresh token is missing or invalid
        if (refreshError.response?.data?.message === "No refresh token found") {
          console.error('No refresh token available, logging out.');
          logout(); 
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
