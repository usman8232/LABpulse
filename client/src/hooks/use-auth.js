import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/auth-store';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload) =>
      apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => setSession({ user: data.user, accessToken: data.accessToken }),
  });
}

export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);

  const query = useQuery({
    queryKey: ['me', accessToken],
    enabled: Boolean(accessToken),
    initialData: user ? { user } : undefined,
    queryFn: () => apiFetch('/auth/me'),
  });

  useEffect(() => {
    if (accessToken && query.data?.user) {
      setSession({ user: query.data.user, accessToken });
    }
  }, [accessToken, query.data, setSession]);

  return query;
}
