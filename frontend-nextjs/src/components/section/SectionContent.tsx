'use client';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import BoardContent from '@/components/board/BoardContent';

interface SectionContentProps {
  locale: Locale;
  section: string;
  sub: string;
  dictionary: Dictionary;
}

export default function SectionContent({
  locale,
  section,
  sub,
  dictionary,
}: SectionContentProps) {
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

  switch (section) {
    case 'board':
      return (
        <BoardContent
          isCounselingBoard={sub === 'counseling'}
          locale={locale}
          section={section}
          sub={sub}
          boardDict={boardDict}
        />
      );
    default:
      return (
        <div className={'text-sub'}>
          <p>{'서비스 준비중입니다.'}</p>
        </div>
      );
  }
}
