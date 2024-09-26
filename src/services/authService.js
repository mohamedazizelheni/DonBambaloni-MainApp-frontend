import api from '@/utils/api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const register = async ( username, email, password, role, salary ) => {
  const response = await api.post('/auth/register', { username, email, password, role, salary });
  return response.data;
};

export const fetchUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};