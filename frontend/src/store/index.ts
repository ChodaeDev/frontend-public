import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import navigationReducer from './navigationSlice';

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
  },
});

setupListeners(store.dispatch);