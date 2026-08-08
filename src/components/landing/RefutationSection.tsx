'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Book, BookOpen, BookOpenText } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import { seriesList } from '@/content/refutation';
import type { Locale } from '@/i18n/config';

interface RefutationSectionProps {
  locale: Locale;
}

const seriesDescriptions: Record<number, string> = {
  0: '신천지 교리를 검증하기 전에 알아야 할 기본 원칙',
  1: '신천지 비유풀이의 자의적 해석과 논리적 문제점',
  2: '하늘과 땅의 창조·재창조 교리의 성경적 검증',
  3: '시대마다 새 목자가 온다는 주장의 성경적 근거 검토',
  4: '배도·멸망·구원 삼단계 공식의 허구성 분석',
  5: '요한계시록 실상 교리의 자의적 해석 검증',
  6: '144,000과 흰 무리에 대한 신천지 해석의 문제',
  7: '이만희의 보혜사·약속의 목자 주장에 대한 검증',
  8: '빗나간 예언과 조용히 바뀐 교리 변경 기록',
  9: '예수, 성령, 구원 등 핵심 교리에 대한 신천지의 왜곡',
  10: '성경시험과 성경 통달 주장의 실체',
  11: '신천지 측 반복 반론에 대한 사실 기반 응답',
};

const icons = [Book, BookOpen, BookOpenText];

function BookIcon({ hovered }: { hovered: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!hovered) {
      setStep(0);
      return;
    }

    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => setStep(2), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [hovered]);

  const Icon = icons[step];

  return <Icon className={'size-4'} />;
}

export default function RefutationSection({ locale }: RefutationSectionProps) {
  const { dictionary } = useTranslation();
  const t = (dictionary.home as unknown as Record<string, Record<string, string>>).refutation ?? {};

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <section className={'w-full my-10'}>
      <div className={'flex items-center justify-between mb-6'}>
        <h2 className={'text-2xl font-bold text-main'}>{t.title || '신천지 교리 검증'}</h2>
        <Link
          href={`/${ locale }/doctrine/false-claims`}
          className={'text-sm text-sub hover:text-accent1 transition-colors'}
        >
          {t.viewAll || '전체 보기'}
        </Link>
      </div>

      <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'}>
        {seriesList.map((series, index) => {
          const hasArticles = series.articleIds.length > 0;

          return (
            <Link
              key={series.number}
              href={`/${ locale }/doctrine/false-claims?series=${ series.number }`}
              className={`group flex flex-col justify-between rounded-lg border border-accent4 p-4 sm:p-5 transition-all duration-300 hover:border-accent1 hover:bg-accent4/20 hover:shadow-md ${
                hasArticles ? '' : 'opacity-50'
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                <div className={'flex items-center gap-2'}>
                  <span className={'text-xs font-bold text-accent1 bg-accent1/10 px-2 py-0.5 rounded shrink-0 group-hover:text-white group-hover:bg-accent1 transition-colors duration-300'}>
                    {`${ series.number }부`}
                  </span>
                  <h3 className={'text-sm sm:text-base font-bold text-main group-hover:text-accent1 transition-colors truncate'}>
                    {series.title}
                  </h3>
                </div>
                <p className={'text-sm text-gray3 mt-1.5 line-clamp-2 leading-relaxed group-hover:text-sub transition-colors duration-300'}>
                  {seriesDescriptions[series.number] ?? ''}
                </p>
              </div>
              <div className={'flex items-center justify-between mt-3'}>
                <span className={'flex items-center gap-1.5 text-sm text-accent1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'}>
                  <BookIcon hovered={hoveredIndex === index} />
                  {'읽기'}
                </span>
                <span className={'text-sm text-gray4 group-hover:text-sub transition-colors duration-300'}>
                  {hasArticles
                    ? `${ series.articleIds.length }${ t.articles || '편' }`
                    : '(준비 중)'
                  }
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
