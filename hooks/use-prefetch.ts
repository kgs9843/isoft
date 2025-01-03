import { useEffect } from 'react';
import { TEXT_QUERY_KEY } from '@/lib/api/text/queries';
import { getDescription, getFaq } from '@/lib/api/text/client';
import { useQueryClient } from '@tanstack/react-query';

const usePrefetch = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: TEXT_QUERY_KEY.description,
      queryFn: () => getDescription(),
    });
    queryClient.prefetchQuery({
      queryKey: TEXT_QUERY_KEY.faq('S01'),
      queryFn: () => getFaq('S01'),
    });
    queryClient.prefetchQuery({
      queryKey: TEXT_QUERY_KEY.faq('S02'),
      queryFn: () => getFaq('S02'),
    });
    queryClient.prefetchQuery({
      queryKey: TEXT_QUERY_KEY.faq('R01'),
      queryFn: () => getFaq('R01'),
    });

    queryClient.prefetchQuery({
      queryKey: TEXT_QUERY_KEY.faq('R02'),
      queryFn: () => getFaq('R02'),
    });

    queryClient.prefetchQuery({
      queryKey: TEXT_QUERY_KEY.faq('R03'),
      queryFn: () => getFaq('R03'),
    });

    queryClient.prefetchQuery({
      queryKey: TEXT_QUERY_KEY.faq('R04'),
      queryFn: () => getFaq('R04'),
    });
  }, []);
};

export { usePrefetch };
