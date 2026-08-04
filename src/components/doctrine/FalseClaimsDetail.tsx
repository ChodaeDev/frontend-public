'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import MarkdownContent from '@/components/ui/MarkdownContent';
import { getArticlesBySeries, getAdjacentArticles } from '@/content/refutation';
import type { Article } from '@/content/refutation/types';

export default function FalseClaimsDetail({ article }: { article: Article }) {
  const { locale } = useTranslation();
  const seriesArticles = getArticlesBySeries(article.seriesNumber, locale);
  const { prev, next } = getAdjacentArticles(article.id, locale);

  return (
    <article className={'max-w-2xl my-10'}>
      {/* 헤더 */}
      <div className={'mt-20 mb-12'}>
        <div className={'flex items-center gap-1 pb-2'}>
          <span className={'text-xs font-bold text-accent1 bg-accent1/10 px-2 py-0.5 rounded'}>
            {`${ article.seriesNumber }부 · ${ article.seriesTitle }`}
          </span>
          <p className={'text-[13px] text-gray1'}>
            {` · ${ article.createdDate } 발행`}
            {article.modifiedDate && ` · ${ article.modifiedDate } 수정`}
          </p>
        </div>
        <h1 className={'text-2xl font-bold text-main mt-3'}>
          {`${ article.order }. ${ article.title }`}
        </h1>
        <p className={'text-sm text-gray3 mt-2'}>
          {article.description}
        </p>
      </div>

      {/* 본문 */}
      <MarkdownContent content={article.content} className={'text-main'} />

      {/* 스스로 확인해 볼 질문 */}
      {article.selfCheckQuestions.length > 0 && (
        <div className={'mt-12 p-6 bg-accent4 rounded-xl'}>
          <h3 className={'text-base font-bold text-main mb-4'}>
            {'스스로 확인해 볼 질문'}
          </h3>
          <ol className={'flex flex-col gap-3'}>
            {article.selfCheckQuestions.map((q, i) => (
              <li key={i} className={'flex items-start gap-2 text-sm text-sub leading-relaxed'}>
                <span className={'text-accent1 font-bold shrink-0'}>{`${ i + 1 }.`}</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 출처 */}
      {article.sources.length > 0 && (
        <div className={'my-10 pb-6 border-b border-gray7'}>
          <h4 className={'text-[13px] font-bold text-gray3 mb-2'}>{'자료 출처'}</h4>
          <ul className={'flex flex-col gap-1'}>
            {article.sources.map((source, i) => (
              <li key={i} className={'text-[13px] text-gray4'}>
                {source.name}
                {source.date && ` (${ source.date })`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 목록으로 */}
      <Link
        href={`/${ locale }/doctrine/false-claims`}
        className={'flex items-center gap-1 text-sm text-gray3 hover:text-accent1 transition-colors mt-10 mb-3'}
      >
        <ArrowLeft className={'size-4'} />
        <span className={'h-5.5'}>{'목록'}</span>
      </Link>

      {/* 시리즈 목록 */}
      <div className={'border border-gray5 rounded-lg'}>
        <div className={'p-4 border-b border-gray5 bg-gray9 rounded-t-lg'}>
          <div className={'flex items-center gap-2'}>
            <span className={'text-xs font-bold text-white bg-accent1 px-2 py-0.5 rounded'}>
              {`${ article.seriesNumber }부`}
            </span>
            <h4 className={'text-sm font-bold text-accent1'}>{article.seriesTitle}</h4>
          </div>
        </div>

        {seriesArticles.length > 1 && (
          <div className={'flex flex-col'}>
            {seriesArticles.map((a, i) => {
              const isCurrent = a.id === article.id;
              return (
                <div
                  key={a.id}
                  className={i > 0 ? 'border-t border-gray8' : ''}
                >
                  {isCurrent ? (
                    <div className={'flex items-center gap-2 px-4 py-3 bg-accent1/5'}>
                      <span className={'text-accent1 font-bold text-sm shrink-0'}>{`${ a.order }.`}</span>
                      <span className={'text-sm font-bold text-accent1 truncate'}>{a.title}</span>
                    </div>
                  ) : (
                    <Link
                      href={`/${ locale }/doctrine/false-claims?article=${ a.id }`}
                      className={'group flex items-center gap-2 px-4 py-3 hover:bg-gray9/50 transition-colors'}
                    >
                      <span className={'text-gray4 text-sm shrink-0'}>{`${ a.order }.`}</span>
                      <span className={'text-sm text-main group-hover:text-accent1 truncate transition-colors'}>{a.title}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 이전글 / 다음글 */}
      {(prev || next) && (
        <div className={'flex items-center justify-between mt-3'}>
          {prev ? (
            <Link
              href={`/${ locale }/doctrine/false-claims?article=${ prev.id }`}
              className={'group flex items-center gap-1 text-sm text-gray3 hover:text-accent1 transition-colors'}
            >
              <ChevronLeft className={'h-5.5 size-4'} />
              <span className={'h-5.5'}>{'이전글'}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/${ locale }/doctrine/false-claims?article=${ next.id }`}
              className={'group flex items-center gap-1 text-sm text-gray3 hover:text-accent1 transition-colors'}
            >
              <span className={'h-5.5'}>{'다음글'}</span>
              <ChevronRight className={'size-4'} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </article>
  );
}
