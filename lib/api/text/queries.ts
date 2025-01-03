import { getDescription, getFaq, TScreen } from '@/lib/api/text/client';
import { useQuery } from '@tanstack/react-query';

export const TEXT_QUERY_KEY = {
  faq: (screen: TScreen) => ['faq', screen],
  description: ['description'],
};

export const useGetFaqQuery = (screen: TScreen) => {
  return useQuery({
    queryKey: TEXT_QUERY_KEY.faq(screen),
    queryFn: () => getFaq(screen),
  });
};

export const useGetDescriptionQuery = () => {
  return useQuery({
    queryKey: TEXT_QUERY_KEY.description,
    queryFn: () => getDescription(),
  });
};
