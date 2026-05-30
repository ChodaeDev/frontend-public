'use client';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import CounselingBoardContent from '@/components/board/CounselingBoardContent';
import FreeBoardContent from '@/components/board/FreeBoardContent';

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
      if (sub === 'counseling') {
        return (
          <CounselingBoardContent
            locale={locale}
            boardDict={boardDict}
          />
        );
      }
      if (sub === 'free') {
        return (
          <FreeBoardContent
            locale={locale}
            boardDict={boardDict}
          />
        );
      }
      return null;
    default:
      return (
        <div className={'text-sub'}>
          <p>{'서비스 준비중입니다.'}</p>
        </div>
      );
  }
}
