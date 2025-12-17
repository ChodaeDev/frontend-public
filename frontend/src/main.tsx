import { Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './router';
import { store } from './store';
import './index.css';
import './assets/font/font.css';
import Spinner from './components/Spinner';

// 초기 테마 설정
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // 시스템 설정 기반 초기화
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
};

initializeTheme();

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Suspense fallback={<div className={'flex size-full items-center justify-center'}><Spinner /></div>}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </Suspense>,
  // </React.StrictMode>,
);
