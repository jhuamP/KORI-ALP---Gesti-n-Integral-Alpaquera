import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store de autenticación — persiste el token en localStorage
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'kori-alp-auth',
    }
  )
);
