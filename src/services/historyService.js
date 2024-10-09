import api from '@/utils/api';

// Fetch salary history with pagination
export const getSalaryHistory = async (page = 1, limit = 10) => {
  const response = await api.get('/history/salary-history', {
    params: { page, limit },
  });
  return response.data;
};

// Fetch availability history with pagination
export const getAvailabilityHistory = async (page = 1, limit = 10) => {
  const response = await api.get('/history/availability-history', {
    params: { page, limit },
  });
  return response.data;
};

// Fetch action history with pagination
export const getActionHistory = async (page = 1, limit = 10) => {
  const response = await api.get('/history/action-history', {
    params: { page, limit },
  });
  return response.data;
};
