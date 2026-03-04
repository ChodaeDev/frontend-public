import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserInfo = {
  id: number;
  userId: string;
  username: string;
  nickname?: string;
  phone?: string;
  church?: string;
  birthday?: string;
  descr?: string;
  level?: string;
};

type AuthState = {
  user: UserInfo | null;
  token: string | null;
};

const AUTH_STORAGE_KEY = 'chodae_user';
const TOKEN_STORAGE_KEY = 'chodae_token';

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
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    },
    setAuth: (state, action: PayloadAction<{ user: UserInfo; token: string } | null>) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload.user));
          localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
        }
      } else {
        state.user = null;
        state.token = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    },
    initAuth: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
          const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
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
