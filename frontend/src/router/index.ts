import * as React from 'react';

const App = React.lazy(() => import('@/App'));
const MainView = React.lazy(() => import('@/pages/MainView'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const OlmapView = React.lazy(() => import('@/pages/SecondView'));
const CounselingInfo = React.lazy(() => import('@/pages/CounselingInfo'));
const PastorShin = React.lazy(() => import('@/pages/PastorShin'));
const ShincheonjiInfo = React.lazy(() => import('@/pages/ShincheonjiInfo'));
const CounselingRequest = React.lazy(() => import('@/pages/CounselingRequest'));
const DoctrineCertification = React.lazy(() => import('@/pages/DoctrineCertification'));
const PreventionGuide = React.lazy(() => import('@/pages/PreventionGuide'));
const WithdrawalCases = React.lazy(() => import('@/pages/WithdrawalCases'));

export const routes = [
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/',
        Component: () => {
          window.location.href = '/home';
          return null;
        },
      },
      {
        path: '/home',
        Component: HomePage,
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
      {
        path: '/doctrine-certification',
        Component: DoctrineCertification,
      },
      {
        path: '/prevention-guide',
        Component: PreventionGuide,
      },
      {
        path: '/withdrawal-cases',
        Component: WithdrawalCases,
      },
    ],
  },
];