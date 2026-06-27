'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import { Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Locale } from '@/i18n/config';
import type { BoardItem } from '@/types/common/landing';
import type { CounselingPost } from '@/types/board';
import { useTranslation } from '@/i18n/client';
import { counselingKeys, fetchCounselingList } from '@/lib/queries/counseling';

interface BoardPreviewSectionProps {
  dictionary: {
    home: {
      boardPreview: {
        counselingTitle: string;
        damageCasesTitle: string;
        viewAll: string;
      };
    };
  };
  locale: Locale;
}

// TODO: API 호출로 대체
const mockDamageCases: BoardItem[] = [
  { id: 'd001', title: '가족 해체 위기까지 몰린 신천지 피해 사례', author: 'idtest123', date: '2026-03-07' },
  { id: 'd002', title: '대학생 타겟 포교로 인한 학업 중단 사례', author: 'idtest123', date: '2026-03-03' },
  { id: 'd003', title: '직장 내 신천지 포교 피해 경험담', author: 'idtest123', date: '2026-02-28' },
  { id: 'd004', title: '헌금 강요로 경제적 피해를 입은 사례', author: 'idtest123', date: '2026-02-22' },
  { id: 'd005', title: '신천지 탈퇴 후 지속되는 회유와 협박', author: 'idtest123', date: '2026-02-15' },
];

function BoardList({
  title,
  viewAll,
  href,
  items,
  locale,
  isLoading,
}: {
  title: string;
  viewAll: string;
  href: string;
  items: BoardItem[];
  locale: Locale;
  isLoading?: boolean;
}) {
  return (
    <div className={'flex-1 min-w-0'}>
      <div className={'flex items-center justify-between mb-4 px-2'}>
        <h3 className={'text-xl font-bold text-main'}>{title}</h3>
        <Link
          href={`/${ locale }${ href }`}
          className={'text-sm text-sub hover:text-accent1 transition-colors'}
        >
          {viewAll}
        </Link>
      </div>
      <ul className={'divide-y divide-gray9'}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className={'py-3 px-2'}>
              <div className={'h-4 bg-gray8 rounded animate-pulse'} />
            </li>
          ))
        ) : items.length === 0 ? (
          <li className={'py-3 px-2 text-sm text-sub'}>{'게시글이 없습니다.'}</li>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${ locale }${ href }/${ item.id }`}
                className={'flex items-center justify-between gap-4 py-3 hover:bg-gray9 transition-colors px-2'}
              >
                <span className={'text-sm text-main truncate flex-1 flex items-center gap-1'}>
                  {item.visibilityLevel && item.visibilityLevel !== 'public' && (
                    <Lock className={'size-3.5 text-gray3 shrink-0'} />
                  )}
                  {item.title}
                </span>
                <div className={'flex items-center gap-3 shrink-0'}>
                  <span className={'text-xs text-gray3'}>{item.author}</span>
                  <span className={'text-xs text-gray3'}>
                    {dayjs(item.date).format('YYYY.MM.DD')}
                  </span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default function BoardPreviewSection({ locale }: BoardPreviewSectionProps) {
  const { dictionary } = useTranslation();
  const t = dictionary.home.boardPreview as {
    counselingTitle: string;
    damageCasesTitle: string;
    viewAll: string;
  };

  const { data: listData, isLoading } = useQuery({
    queryKey: counselingKeys.list({ page: 1, size: 5, sort: 'createDate', direction: 'desc' }),
    queryFn: () => fetchCounselingList({ page: 1, size: 5, sort: 'createDate', direction: 'desc' }),
  });

  const counselingPosts: BoardItem[] = (listData?.payload ?? [])
    .slice(0, 5)
    .map((post: CounselingPost) => ({
      id: String(post.id),
      title: post.title,
      author: post.userName,
      date: post.createDate,
      visibilityLevel: post.visibilityLevel,
    }));

  return (
    <section className={'w-full mt-10 mb-20'}>
      <div className={'grid grid-cols-1 lg:grid-cols-2 gap-20 sm:gap-10'}>
        <BoardList
          title={t.counselingTitle || '상담 게시판'}
          viewAll={t.viewAll || '전체 보기'}
          href={'/board/counseling'}
          items={counselingPosts}
          locale={locale}
          isLoading={isLoading}
        />
        <BoardList
          title={t.damageCasesTitle || '신천지 피해사례'}
          viewAll={t.viewAll || '전체 보기'}
          href={'/prevention/damage-cases'}
          items={mockDamageCases}
          locale={locale}
        />
      </div>
    </section>
  );
}
