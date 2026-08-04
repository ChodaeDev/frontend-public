'use client';

import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import { seriesList, getArticlesBySeries } from '@/content/refutation';
import type { Locale } from '@/i18n/config';

export default function FalseClaimsList() {
  const { locale } = useTranslation();

  return (
    <div className={'w-full my-10'}>
      <p className={'text-gray1 text-center mb-10'}>
        {'현재 시리즈 제작 및 검증 중입니다. 한국어(KO)만 지원됩니다.'}
      </p>
      <div className={'flex flex-col gap-8'}>
        {seriesList.map((series) => {
          const articles = getArticlesBySeries(series.number, locale as Locale);
          const hasArticles = articles.length > 0;

          return (
            <div key={series.number}>
              <div className={'flex items-center gap-2 mb-3'}>
                <span className={'text-xs font-bold text-accent1 bg-accent1/10 px-2 py-0.5 rounded'}>
                  {`${ series.number }부`}
                </span>
                <h3 className={'text-base font-bold text-main'}>{series.title}</h3>
              </div>

              {hasArticles ? (
                <div className={'flex flex-col gap-2'}>
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/${ locale }/doctrine/false-claims?article=${ article.id }`}
                      className={'group flex items-center justify-between p-4 rounded-lg border border-gray7 hover:border-accent1 transition-colors'}
                    >
                      <div className={'flex items-start gap-3 min-w-0'}>
                        <BookOpen className={'size-4 text-gray4 group-hover:text-accent1 mt-0.5 shrink-0 transition-colors'} />
                        <div className={'min-w-0'}>
                          <p className={'text-sm font-medium text-main group-hover:text-accent1 transition-colors truncate'}>
                            {article.title}
                          </p>
                          <p className={'text-xs text-gray3 mt-0.5 truncate'}>
                            {article.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={'size-4 text-gray5 group-hover:text-accent1 shrink-0 transition-colors'} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className={'text-sm text-gray4 pl-2'}>{'준비 중입니다.'}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
