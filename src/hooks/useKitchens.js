import useSWR from 'swr';
import { getAllKitchens } from '@/services/kitchenService';

const fetcher = () => getAllKitchens();

const useKitchens = () => {
  const { data, error, mutate } = useSWR('/kitchens', fetcher);

  return {
    kitchens: data ? data.kitchens : [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default useKitchens;
