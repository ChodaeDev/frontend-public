'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserInfo } from '@/types/user';

type AuthState = {
  user: UserInfo | null;
  token: string | null;
  setUser: (user: UserInfo | null)=> void;
  setAuth: (payload: { user: UserInfo; token: string } | null)=> void;
  logout: ()=> void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setAuth: (payload) =>
        payload
          ? set({ user: payload.user, token: payload.token })
          : set({ user: null, token: null }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'chodae-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
