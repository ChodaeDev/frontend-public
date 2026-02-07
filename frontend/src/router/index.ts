import * as React from 'react';

const App = React.lazy(() => import('@/App'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const CenterInfo = React.lazy(() => import('@/pages/CenterInfo'));
const Ministry = React.lazy(() => import('@/pages/Ministry'));
const Counsult = React.lazy(() => import('@/pages/Counsult'));
const CounselingRequest = React.lazy(() => import('@/pages/CounselingRequest'));
const ShincheonjiInfo = React.lazy(() => import('@/pages/ShincheonjiInfo'));
const Apologetics = React.lazy(() => import('@/pages/Apologetics'));
const PreventionGuide = React.lazy(() => import('@/pages/PreventionGuide'));
const WithdrawalCases = React.lazy(() => import('@/pages/WithdrawalCases'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const SignUpPage = React.lazy(() => import('@/pages/SignUpPage'));
const UserInfoPage = React.lazy(() => import('@/pages/UserInfoPage'));

export const routes = [
  {
    path: '/',
    Component: App,
    children: [
      { path: '/', Component: () => {window.location.href = '/home';return null;} },
      { path: '/home', Component: HomePage },
      { path: '/center', Component: CenterInfo },
      { path: '/ministry', Component: Ministry },
      { path: '/counsult', Component: Counsult },
      { path: '/counseling-request', Component: CounselingRequest },
      { path: '/shincheonji', Component: ShincheonjiInfo },
      { path: '/apologetics', Component: Apologetics },
      { path: '/prevention', Component: PreventionGuide },
      { path: '/cases', Component: WithdrawalCases },
      { path: '/login', Component: LoginPage },
      { path: '/signup', Component: SignUpPage },
      { path: '/user-info', Component: UserInfoPage },
    ],
  },
];