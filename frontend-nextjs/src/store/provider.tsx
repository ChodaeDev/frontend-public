'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore, setupStoreListeners } from './index';
import { initAuth } from './authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current) {
      setupStoreListeners(storeRef.current);
      storeRef.current.dispatch(initAuth());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
