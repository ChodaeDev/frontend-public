'use client';

import { lazy, Suspense, type ComponentType } from 'react';
import SubMenuBoardContent from '@/components/subMenu/SubMenuBoardContent';

const boardEndpointMap: Record<string, { endpoint: string; boardPath: string }> = {
  'scj-info/details': { endpoint: '/api/scj-info/details/list', boardPath: 'scj-info/details' },
  'scj-info/strategy': { endpoint: '/api/scj-info/strategy/list', boardPath: 'scj-info/strategy' },
  'scj-info/illegal-cases': { endpoint: '/api/scj-info/illegal-cases/list', boardPath: 'scj-info/illegal-cases' },
  'doctrine/references': { endpoint: '/api/doctrine/references/list', boardPath: 'doctrine/references' },
  'doctrine/legal': { endpoint: '/api/doctrine/legal/list', boardPath: 'doctrine/legal' },
  'prevention/damage-cases': { endpoint: '/api/prevention/damage-cases/list', boardPath: 'prevention/damage-cases' },
  'prevention/prevention-materials': { endpoint: '/api/prevention/prevention-materials/list', boardPath: 'prevention/prevention-materials' },
};

const contentMap: Record<string, ComponentType> = {
  'board/counseling': lazy(() => import('@/components/board/CounselingBoardContent')),
  'about/introduction': lazy(() => import('@/components/about/IntroductionContent')),
  'about/directions': lazy(() => import('@/components/about/DirectionsContent')),
  'about/minister': lazy(() => import('@/components/about/MinisterContent')),
  'about/centers': lazy(() => import('@/components/about/CentersContent')),
  'scj-info/history': lazy(() => import('@/components/scj-info/HistoryContent')),
  'scj-info/press': lazy(() => import('@/components/scj-info/PressContent')),
  'withdrawal/methods': lazy(() => import('@/components/withdrawal/MethodsContent')),
  'withdrawal/to-members': lazy(() => import('@/components/withdrawal/ToMembersContent')),
};

function PreparingFallback() {
  return (
    <div className={'text-sub'}>
      <p>{'서비스 준비중입니다.'}</p>
    </div>
  );
}

interface SubMenuContentProps {
  mainMenu: string;
  subMenu: string;
}

export default function SubMenuContent({ mainMenu, subMenu }: SubMenuContentProps) {
  const key = `${ mainMenu }/${ subMenu }`;

  const board = boardEndpointMap[key];
  if (board) {
    return (
      <SubMenuBoardContent
        endpoint={board.endpoint}
        boardPath={board.boardPath}
      />
    );
  }

  const Component = contentMap[key];
  if (Component) {
    return (
      <Suspense>
        <Component />
      </Suspense>
    );
  }

  return <PreparingFallback />;
}
