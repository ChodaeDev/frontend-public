'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import MarkdownContent from '@/components/ui/MarkdownContent';
import { getAdjacentArticles } from '@/content/refutation';
import type { Article } from '@/content/refutation/types';

export default function FalseClaimsDetail({ article }: { article: Article }) {
  const { locale } = useTranslation();
  const { prev, next } = getAdjacentArticles(article.id, locale);

  return (
    <article className={'max-w-2xl my-10'}>
      {/* 헤더 */}
      <div className={'mb-8'}>
        <span className={'text-xs font-bold text-accent1 bg-accent1/10 px-2 py-0.5 rounded'}>
          {`${ article.seriesNumber }부 · ${ article.seriesTitle }`}
        </span>
        <h1 className={'text-2xl font-bold text-main mt-3'}>
          {article.title}
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

      {/* 이전 글 / 다음 글 */}
      {(prev || next) && (
        <div className={'grid grid-cols-2 gap-4 mt-12'}>
          {prev ? (
            <Link
              href={`/${ locale }/doctrine/false-claims?article=${ prev.id }`}
              className={'group flex items-center gap-2 p-4 rounded-lg border border-gray7 hover:border-accent1 transition-colors min-w-0'}
            >
              <ChevronLeft className={'hidden sm:block size-5 text-gray5 group-hover:text-accent1 shrink-0 transition-colors'} />
              <div className={'min-w-0'}>
                <p className={'text-xs text-gray4'}>{'이전 글'}</p>
                <p className={'text-sm font-medium text-main group-hover:text-accent1 truncate transition-colors'}>
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/${ locale }/doctrine/false-claims?article=${ next.id }`}
              className={'group flex items-center justify-end gap-2 p-4 rounded-lg border border-gray7 hover:border-accent1 transition-colors text-right min-w-0'}
            >
              <div className={'min-w-0'}>
                <p className={'text-xs text-gray4'}>{'다음 글'}</p>
                <p className={'text-sm font-medium text-main group-hover:text-accent1 truncate transition-colors'}>
                  {next.title}
                </p>
              </div>
              <ChevronRight className={'hidden sm:block size-5 text-gray5 group-hover:text-accent1 shrink-0 transition-colors'} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* 출처 */}
      {article.sources.length > 0 && (
        <div className={'mt-10 pt-6 border-t border-gray7'}>
          <h4 className={'text-xs font-bold text-gray3 mb-2'}>{'자료 출처'}</h4>
          <ul className={'flex flex-col gap-1'}>
            {article.sources.map((source, i) => (
              <li key={i} className={'text-xs text-gray4'}>
                {source.name}
                {source.date && ` (${ source.date })`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 발행일 · 수정일 */}
      <p className={'text-xs text-gray5 mt-6 text-right'}>
        {`${ article.createdDate } 발행`}
        {article.modifiedDate && ` · ${ article.modifiedDate } 수정`}
      </p>
    </article>
  );
}
