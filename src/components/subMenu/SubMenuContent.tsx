'use client';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import CounselingBoardContent from '@/components/board/CounselingBoardContent';
import SubMenuBoardContent from '@/components/subMenu/SubMenuBoardContent';
import PressContent from '@/components/scj-info/PressContent';

interface SubMenuContentProps {
  locale: Locale;
  mainMenu: string;
  subMenu: string;
  dictionary: Dictionary;
}

export default function SubMenuContent({
  locale,
  mainMenu,
  subMenu,
  dictionary,
}: SubMenuContentProps) {
  const boardDict = dictionary.board as {
    requestCounseling: string;
    number: string;
    title: string;
    author: string;
    date: string;
    views: string;
    notice: string;
    emptyMessage: string;
    itemsPerPage: string;
    searchByTitle: string;
    searchByAuthor: string;
    searchPlaceholder: string;
    search: string;
  };

  const pressDict = dictionary.press as {
    title: string;
    emptyMessage: string;
    pressName: string;
    date: string;
    searchPlaceholder: string;
    itemsPerPage: string;
    loading: string;
  };

  const boardEndpointMap: Record<string, Record<string, string>> = {
    'scj-info': {
      history: '/api/scj-info/history/list',
      details: '/api/scj-info/details/list',
      strategy: '/api/scj-info/strategy/list',
      'illegal-cases': '/api/scj-info/illegal-cases/list',
    },
    doctrine: {
      references: '/api/doctrine/references/list',
      legal: '/api/doctrine/legal/list',
    },
    prevention: {
      'damage-cases': '/api/prevention/damage-cases/list',
      'prevention-materials': '/api/prevention/prevention-materials/list',
    },
  };

  const boardEndpoint = boardEndpointMap[mainMenu]?.[subMenu];
  if (boardEndpoint) {
    return (
      <SubMenuBoardContent
        locale={locale}
        boardDict={boardDict}
        endpoint={boardEndpoint}
        boardPath={`${ mainMenu }/${ subMenu }`}
      />
    );
  }

  switch (mainMenu) {
    case 'board':
      if (subMenu === 'counseling') {
        return (
          <CounselingBoardContent
            locale={locale}
            boardDict={boardDict}
          />
        );
      }
      return null;
    case 'scj-info':
      if (subMenu === 'press') {
        return (
          <PressContent
            locale={locale}
            pressDict={pressDict}
          />
        );
      }
      return (
        <div className={'text-sub'}>
          <p>{'서비스 준비중입니다.'}</p>
        </div>
      );
    default:
      return (
        <div className={'text-sub'}>
          <p>{'서비스 준비중입니다.'}</p>
        </div>
      );
  }
}
