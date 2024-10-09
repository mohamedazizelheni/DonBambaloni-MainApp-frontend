import api from '@/utils/api'; 

export const getAllEntities = async (entityType, params) => {
  const response = await api.get(`/${entityType}`, { params });
  return response.data;
};

export const addEntity = async (entityType, newEntity) => {
  const response = await api.post(`/${entityType}`, newEntity);
  return response.data;
};
export const updateEntity = async (entityType, entityId, updatedData) => {
    const response = await api.put(`/${entityType}/${entityId}`, updatedData);
    return response.data;
  };
  
export const getEntityDetails = async (entityType, entityId) => {
    const endpoint = entityType === 'shops'
      ? `/shops/${entityId}`
      : `/kitchens/${entityId}`;
    const response = await api.get(endpoint);
    return response.data;
  };