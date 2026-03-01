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

const getInitialUser = (): UserInfo | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserInfo;
    }
  } catch {
    // ignore parse errors
  }
  return null;
};

const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
    setAuth: (state, action: PayloadAction<{ user: UserInfo; token: string } | null>) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
      } else {
        state.user = null;
        state.token = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
  },
});

export const { setUser, setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
