import { DefaultError, useMutation } from '@tanstack/react-query';
import { postSsid, TPostSsidReqDto } from '@/lib/api/receiver/client';
import type { UseMutationOptions } from '@tanstack/react-query/src/types';

export const usePostSsidMutation = (
  options?: UseMutationOptions<string, DefaultError, TPostSsidReqDto>
) => {
  return useMutation({
    mutationFn: postSsid,
    retry: false,
    ...options,
  });
};
