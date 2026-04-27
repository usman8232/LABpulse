const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('labpulse-access-token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(error.message ?? 'Request failed.');
  }

  return response.json();
}
