import useSWR from 'swr';
import api from '@/utils/api';

const fetchUsers = async (url) => {
  const { data } = await api.get(url);
  return data;
};

const useUsers = (page, limit, searchTerm, filters) => {
  const { role, availability, minSalary, maxSalary } = filters;
  const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
  const roleQuery = role ? `&role=${encodeURIComponent(role)}` : '';
  const availabilityQuery = availability ? `&availability=${encodeURIComponent(availability)}` : '';
  const salaryQuery = `&minSalary=${minSalary || 0}&maxSalary=${maxSalary || Number.MAX_SAFE_INTEGER}`;

  const { data, error, mutate } = useSWR(`/users?page=${page}&limit=${limit}${searchQuery}${roleQuery}${availabilityQuery}${salaryQuery}`, fetchUsers);

  return {
    users: data ? data.users : [],
    totalUsers: data ? data.totalUsers : 0,
    totalPages: data ? data.totalPages : 1,
    currentPage: data ? data.currentPage : 1,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default useUsers;
