import * as React from 'react';

const App = React.lazy(() => import('@/App'));
const MainView = React.lazy(() => import('@/pages/MainView'));
const OlmapView = React.lazy(() => import('@/pages/SecondView'));
const CounselingInfo = React.lazy(() => import('@/pages/CounselingInfo'));
const PastorShin = React.lazy(() => import('@/pages/PastorShin'));
const ShincheonjiInfo = React.lazy(() => import('@/pages/ShincheonjiInfo'));
const CounselingRequest = React.lazy(() => import('@/pages/CounselingRequest'));

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
      {
        path: '/counseling-info',
        Component: CounselingInfo,
      },
      {
        path: '/pastor-shin',
        Component: PastorShin,
      },
      {
        path: '/shincheonji-info',
        Component: ShincheonjiInfo,
      },
      {
        path: '/counseling-request',
        Component: CounselingRequest,
      },
    ],
  },
];