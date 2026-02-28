import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import navigationReducer from './navigationSlice';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    navigation: navigationReducer,
    auth: authReducer,
  },
});

setupListeners(store.dispatch);