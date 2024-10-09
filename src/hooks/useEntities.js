import useSWR from 'swr';
import { getAllEntities } from '@/services/entityService'; // service for fetching shops or kitchens

const useEntities = (entityType, page = 1, limit = 10) => {
  const fetcher = () => getAllEntities(entityType, { page, limit });
  
  const { data, error, mutate } = useSWR([entityType, page, limit], fetcher);

  return {
    entities: data ? data[entityType] : [],
    totalEntities: data ? (entityType === 'kitchens' ? data.totalKitchens : data.totalShops) : 0,
    totalPages: data ? data.totalPages : 1,
    currentPage: page,
    isLoading: !data && !error,
    error,
    mutate, // Revalidate the data
  };
};

export default useEntities;
