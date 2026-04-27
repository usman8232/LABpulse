import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('labpulse-access-token'),
  setSession: ({ user, accessToken }) => {
    localStorage.setItem('labpulse-access-token', accessToken);
    set({ user, accessToken });
  },
  clearSession: () => {
    localStorage.removeItem('labpulse-access-token');
    set({ user: null, accessToken: null });
  },
}));
