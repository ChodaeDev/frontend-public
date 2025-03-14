import * as React from 'react';

const App = React.lazy(() => import('@/App'));
const MainView = React.lazy(() => import('@/pages/MainView'));
const OlmapView = React.lazy(() => import('@/pages/SecondView'));

export const routes = [
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/',
        Component: MainView,
      },
      {
        path: '/second',
        Component: OlmapView,
      },
    ],
  },
];