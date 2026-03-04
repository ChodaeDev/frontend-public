import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import navigationReducer from './navigationSlice';
import authReducer from './authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      navigation: navigationReducer,
      auth: authReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Optional: setup listeners for RTK Query
export const setupStoreListeners = (store: AppStore) => {
  setupListeners(store.dispatch);
};
