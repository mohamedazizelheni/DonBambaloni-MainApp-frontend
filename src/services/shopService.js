import api from '@/utils/api';

export const getAllShops = async () => {
  const response = await api.get('/shops');
  return response.data;
};

export const createShop = async (shopData) => {
  const response = await api.post('/shops', shopData);
  return response.data;
};

export const updateShop = async (shopId, data) => {
  const response = await api.put(`/shops/${shopId}`, data);
  return response.data;
};

export const deleteShop = async (shopId) => {
  const response = await api.delete(`/shops/${shopId}`);
  return response.data;
};
