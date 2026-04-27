import { useMutation, useQuery } from '@tanstack/react-query';

import { apiFetch } from '../lib/api';

export function useClientRegistration() {
  return useMutation({
    mutationFn: (payload) =>
      apiFetch('/devices/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  });
}

export function useMyDevice() {
  return useQuery({
    queryKey: ['my-device'],
    queryFn: () => apiFetch('/devices/my-device'),
  });
}
