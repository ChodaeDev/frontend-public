import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserInfo = {
  id: number;
  userId: string;
  userName: string;
  nickName?: string;
  phone?: string;
  church?: string;
  birthday?: string;
  description?: string;
  level?: string;
};

type AuthState = {
  user: UserInfo | null;
  token: string | null;
};

const authStorageKey = 'chodae_user';
const tokenStorageKey = 'chodae_token';

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem(authStorageKey, JSON.stringify(action.payload));
        } else {
          localStorage.removeItem(authStorageKey);
        }
      }
    },
    setAuth: (state, action: PayloadAction<{ user: UserInfo; token: string } | null>) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem(authStorageKey, JSON.stringify(action.payload.user));
          localStorage.setItem(tokenStorageKey, action.payload.token);
        }
      } else {
        state.user = null;
        state.token = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem(authStorageKey);
          localStorage.removeItem(tokenStorageKey);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(authStorageKey);
        localStorage.removeItem(tokenStorageKey);
      }
    },
    initAuth: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem(authStorageKey);
          const storedToken = localStorage.getItem(tokenStorageKey);
          if (storedUser) {
            state.user = JSON.parse(storedUser) as UserInfo;
          }
          if (storedToken) {
            state.token = storedToken;
          }
        } catch {
          // ignore parse errors
        }
      }
    },
  },
});

export const { setUser, setAuth, logout, initAuth } = authSlice.actions;
export default authSlice.reducer;
