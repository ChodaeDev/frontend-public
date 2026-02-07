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
};

const AUTH_STORAGE_KEY = 'chodae_user';

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

const initialState: AuthState = {
  user: getInitialUser(),
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
    logout: (state) => {
      state.user = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
