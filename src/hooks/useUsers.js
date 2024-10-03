import useSWR from 'swr';
import api from '@/utils/api';

const fetchUsers = async (url) => {
  const { data } = await api.get(url);
  return data;
};

const useUsers = (page, limit, searchTerm, filters) => {
  // Only allow fetch if page and limit are valid
  const isValidRequest = page > 0 && limit > 0;

  // Generate queries conditionally
  const { role, availability, minSalary = 0, maxSalary = Number.MAX_SAFE_INTEGER } = filters;
  const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
  const roleQuery = role ? `&role=${encodeURIComponent(role)}` : '';
  const availabilityQuery = availability ? `&availability=${encodeURIComponent(availability)}` : '';
  const salaryQuery = `&minSalary=${minSalary}&maxSalary=${maxSalary}`;

  // SWR Key: Only generate the key if it's a valid request
  const key = isValidRequest ? `/users?page=${page}&limit=${limit}${searchQuery}${roleQuery}${availabilityQuery}${salaryQuery}` : null;

  // Fetch with conditional revalidation and cache management
  const { data, error, mutate } = useSWR(key, fetchUsers, {
    revalidateOnFocus: false,          // No refetch on window focus
    revalidateOnReconnect: false,      // No refetch on network reconnect
    shouldRetryOnError: true,          // Retry on failure
    errorRetryCount: 3,                // Retry 3 times
    errorRetryInterval: 5000,          // 5 seconds retry interval
    keepPreviousData: true,            // Use previous data until new data arrives
  });

  return {
    users: data?.users || [],
    totalUsers: data?.totalUsers || 0,
    totalPages: data?.totalPages || 1,
    currentPage: data?.currentPage || 1,
    isLoading: !error && !data,        // Show loading if there's no error and data is missing
    isError: error,                    // Handle error state
    mutate,                            // Revalidate manually when needed
  };
};

export default useUsers;
