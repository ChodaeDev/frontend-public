'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import { seriesList, getArticlesBySeries } from '@/content/refutation';
import type { Locale } from '@/i18n/config';

interface FalseClaimsListProps {
  initialSeries?: number;
}

export default function FalseClaimsList({ initialSeries }: FalseClaimsListProps) {
  const { locale } = useTranslation();
  const seriesRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [openSeries, setOpenSeries] = useState<Set<number>>(() => {
    if (initialSeries !== undefined && !isNaN(initialSeries)) {
      return new Set([initialSeries]);
    }
    const first = seriesList.find((s) => s.articleIds.length > 0);
    return first ? new Set([first.number]) : new Set();
  });

  useEffect(() => {
    if (initialSeries !== undefined && !isNaN(initialSeries)) {
      const el = seriesRefs.current[initialSeries];
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [initialSeries]);

  const toggle = (num: number) => {
    setOpenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const seriesWithArticles = seriesList.filter((s) => s.articleIds.length > 0).map((s) => s.number);
  const allOpen = seriesWithArticles.length > 0 && seriesWithArticles.every((n) => openSeries.has(n));

  const toggleAll = () => {
    if (allOpen) {
      setOpenSeries(new Set());
    } else {
      setOpenSeries(new Set(seriesWithArticles));
    }
  };

  return (
    <div className={'w-full my-10'}>
      <p className={'text-gray1 text-center mb-10'}>
        {'현재 시리즈 제작 및 검증 중입니다. 한국어(KO)만 지원됩니다.'}
      </p>

      <div className={'flex items-center justify-end gap-2 mb-4'}>
        <span className={'h-[22px] text-sm text-sub'}>
          {'목차'}
        </span>
        <button
          onClick={toggleAll}
          className={`relative w-10 h-[22px] rounded-full transition-colors duration-300 cursor-pointer ${ allOpen ? 'bg-accent1' : 'bg-gray6' }`}
        >
          <span
            className={`absolute top-[3px] left-[3px] size-4 rounded-full bg-white shadow transition-transform duration-300 ${ allOpen ? 'translate-x-[18px]' : '' }`}
          />
        </button>
      </div>

      <div className={'flex flex-col gap-4'}>
        {seriesList.map((series) => {
          const articles = getArticlesBySeries(series.number, locale as Locale);
          const hasArticles = articles.length > 0;
          const isOpen = openSeries.has(series.number);

          return (
            <div
              key={series.number}
              ref={(el) => { seriesRefs.current[series.number] = el; }}
              className={`border rounded-lg ${ isOpen ? 'border-gray3' : 'border-gray7' }`}
            >
              {/* 헤더 (토글) */}
              <button
                onClick={() => hasArticles && toggle(series.number)}
                className={`w-full flex items-center justify-between p-4 rounded-t-lg ${
                  isOpen ? 'bg-gray9 border-b border-gray3' : ''
                } ${
                  hasArticles ? 'cursor-pointer hover:bg-gray9/50' : 'cursor-default'
                } transition-colors`}
              >
                <div className={'flex items-center gap-2'}>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${ isOpen ? 'text-white bg-accent1' : 'text-accent1 bg-accent1/10' }`}>
                    {`${ series.number }부`}
                  </span>
                  <h3 className={`text-base font-bold ${ isOpen ? 'text-accent1' : 'text-main' }`}>{series.title}</h3>
                  {!hasArticles && (
                    <span className={'text-xs text-gray4'}>{'(준비 중)'}</span>
                  )}
                </div>
                {hasArticles && (
                  <ChevronDown
                    className={`size-5 text-gray4 transition-transform duration-300 ${ isOpen ? 'rotate-180' : '' }`}
                  />
                )}
              </button>

              {/* 카드 목록 (아코디언) */}
              {hasArticles && (
                <div
                  className={'grid transition-[grid-template-rows] duration-300 ease-in-out'}
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className={'overflow-hidden'}>
                    {articles.map((article, i) => (
                      <Link
                        key={article.id}
                        href={`/${ locale }/doctrine/false-claims?article=${ article.id }`}
                        className={`group flex items-center justify-between px-4 py-6 hover:bg-gray9/50 transition-colors ${
                          i > 0 ? 'border-t border-gray8' : ''
                        }`}
                      >
                        <div className={'min-w-0'}>
                          <p className={'text-base font-medium text-main group-hover:text-accent1 transition-colors truncate'}>
                            <span className={'text-gray4 group-hover:text-accent1'}>{`${ article.order }. `}</span>
                            {article.title}
                          </p>
                          <p className={'text-[13px] text-gray3 group-hover:text-sub mt-0.5 truncate transition-colors'}>
                            {article.description}
                          </p>
                        </div>
                        <ChevronRight className={'size-4 text-gray5 group-hover:text-accent1 shrink-0 ml-2 transition-colors'} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
