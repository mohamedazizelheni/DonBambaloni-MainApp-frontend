import useSWR from 'swr';
import { getAllShops } from '@/services/shopService';

const fetcher = (url, page, limit) => getAllShops({ page, limit });

const useShops = (page = 1, limit = 10) => {
  const { data, error, mutate } = useSWR(['/shops', page, limit], fetcher);

  return {
    shops: data ? data.shops : [],
    totalShops: data ? data.totalShops : 0,
    totalPages: data ? data.totalPages : 1,
    currentPage: page,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default useShops;
