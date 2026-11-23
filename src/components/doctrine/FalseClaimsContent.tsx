'use client';

import { Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n/client';
import { getArticleById, loadRefutationTranslation } from '@/content/refutation';
import FalseClaimsList from '@/components/doctrine/FalseClaimsList';
import FalseClaimsDetail from '@/components/doctrine/FalseClaimsDetail';

function FalseClaimsContentInner() {
  const searchParams = useSearchParams();
  const { locale } = useTranslation();
  // 해당 언어 번역을 불러온 뒤 목록·상세를 그린다 (한국어는 바로 통과)
  use(loadRefutationTranslation(locale));
  const articleId = searchParams.get('article');
  const seriesParam = searchParams.get('series');

  if (articleId) {
    const article = getArticleById(articleId, locale);
    if (article) {
      return <FalseClaimsDetail article={article} />;
    }
  }

  const initialSeries = seriesParam !== null ? Number(seriesParam) : undefined;

  return <FalseClaimsList initialSeries={initialSeries} />;
}

export default function FalseClaimsContent() {
  return (
    <Suspense>
      <FalseClaimsContentInner />
    </Suspense>
  );
}
