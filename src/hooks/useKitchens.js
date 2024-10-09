import useSWR from 'swr';
import { getAllKitchens } from '@/services/kitchenService';

const fetcher = (url, page, limit) => getAllKitchens({ page, limit });

const useKitchens = (page = 1, limit = 10) => {
  const { data, error, mutate } = useSWR(['/kitchens', page, limit], fetcher);

  return {
    kitchens: data ? data.kitchens : [],
    totalKitchens: data ? data.totalKitchens : 0,
    totalPages: data ? data.totalPages : 1,
    currentPage: page,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default useKitchens;
