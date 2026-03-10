import Link from 'next/link';
import dayjs from 'dayjs';
import type { Locale } from '@/i18n/config';

interface BoardItem {
  id: string;
  title: string;
  author: string;
  date: string;
}

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
const mockCounselingPosts: BoardItem[] = [
  { id: 'c001', title: '신천지 가족 상담 요청합니다', author: '익명', date: '2026-03-08' },
  { id: 'c002', title: '신천지 교육 중인 자녀, 어떻게 해야 할까요', author: '익명', date: '2026-03-05' },
  { id: 'c003', title: '배우자가 신천지 의심됩니다', author: '익명', date: '2026-03-01' },
  { id: 'c004', title: '탈퇴 후 교회 복귀 상담 부탁드립니다', author: '익명', date: '2026-02-25' },
  { id: 'c005', title: '신천지 포교 피해 상담 문의', author: '익명', date: '2026-02-20' },
];

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
}: {
  title: string;
  viewAll: string;
  href: string;
  items: BoardItem[];
  locale: Locale;
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
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/${ locale }${ href }/${ item.id }`}
              className={'flex items-center justify-between gap-4 py-3 hover:bg-gray9 transition-colors px-2'}
            >
              <span className={'text-sm text-main truncate flex-1'}>{item.title}</span>
              <div className={'flex items-center gap-3 shrink-0'}>
                <span className={'text-xs text-gray3'}>{item.author}</span>
                <span className={'text-xs text-gray3'}>
                  {dayjs(item.date).format('YYYY.MM.DD')}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BoardPreviewSection({ dictionary, locale }: BoardPreviewSectionProps) {
  const { counselingTitle, damageCasesTitle, viewAll } = dictionary.home.boardPreview;

  return (
    <section className={'w-full mt-10 mb-20'}>
      <div className={'grid grid-cols-1 lg:grid-cols-2 gap-20 sm:gap-10'}>
        <BoardList
          title={counselingTitle}
          viewAll={viewAll}
          href={'/board/counseling'}
          items={mockCounselingPosts}
          locale={locale}
        />
        <BoardList
          title={damageCasesTitle}
          viewAll={viewAll}
          href={'/withdrawal/damageCases'}
          items={mockDamageCases}
          locale={locale}
        />
      </div>
    </section>
  );
}
