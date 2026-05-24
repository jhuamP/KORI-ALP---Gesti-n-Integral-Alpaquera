import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = '/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,

      setAuth: (token, user) => set({ token, user, error: null }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password });
          set({ token: response.data.token, user: response.data.user, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Error al iniciar sesión', isLoading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/register`, userData);
          set({ token: response.data.token, user: response.data.user, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Error al registrar', isLoading: false });
          return false;
        }
      },

      loginWithGoogle: async (googleToken, rol) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/google`, { googleToken, rol });
          set({ token: response.data.token, user: response.data.user, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Error al iniciar sesión con Google', isLoading: false });
          return false;
        }
      },

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'kori-alp-auth',
    }
  )
);
