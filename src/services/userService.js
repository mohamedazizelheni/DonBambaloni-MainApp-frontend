import api from '@/utils/api';

export const getAllUsers = async (params) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
  
};

export const updateUserProfile = async (data) => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const updateUserAvailability = async (userId, data) => {
  const response = await api.put(`/users/${userId}/availability`, data);
  return response.data;
};
