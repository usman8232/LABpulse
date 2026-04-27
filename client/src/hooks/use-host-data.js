import { useMutation, useQuery } from '@tanstack/react-query';

import { apiFetch } from '../lib/api';

export function useRegistrations() {
  return useQuery({
    queryKey: ['registrations'],
    queryFn: () => apiFetch('/devices/registrations'),
  });
}

export function useRegistrationDecision() {
  return useMutation({
    mutationFn: ({ id, approved }) =>
      apiFetch(`/devices/registrations/${id}/decision`, {
        method: 'PATCH',
        body: JSON.stringify({ approved }),
      }),
  });
}

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => apiFetch('/devices'),
  });
}

export function useDevice(id) {
  return useQuery({
    queryKey: ['device', id],
    enabled: Boolean(id),
    queryFn: () => apiFetch(`/devices/${id}`),
  });
}

export function useDeviceHistory(id) {
  return useQuery({
    queryKey: ['device-history', id],
    enabled: Boolean(id),
    queryFn: () => apiFetch(`/monitoring/devices/${id}/history`),
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => apiFetch('/monitoring/alerts'),
  });
}

export function useAlertAction(action) {
  return useMutation({
    mutationFn: (id) =>
      apiFetch(`/monitoring/alerts/${id}/${action}`, {
        method: 'PATCH',
      }),
  });
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch('/reports'),
  });
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: (payload) =>
      apiFetch('/reports/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  });
}
