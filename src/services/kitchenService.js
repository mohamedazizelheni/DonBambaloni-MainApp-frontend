import api from '@/utils/api';

export const getAllKitchens = async () => {
  const response = await api.get('/kitchens');
  return response.data;
};

export const createKitchen = async (kitchenData) => {
  const response = await api.post('/kitchens', kitchenData);
  return response.data;
};

export const updateKitchen = async (kitchenId, data) => {
  const response = await api.put(`/kitchens/${kitchenId}`, data);
  return response.data;
};

export const deleteKitchen = async (kitchenId) => {
  const response = await api.delete(`/kitchens/${kitchenId}`);
  return response.data;
};

export const assignUsersToKitchenShift = async (kitchenId, data) => {
  try {
    const response = await api.post(`/kitchens/${kitchenId}/assign-users`,data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to assign users to kitchen shift.');
  }
};