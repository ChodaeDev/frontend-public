'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n/client';
import { getArticleById } from '@/content/refutation';
import FalseClaimsList from '@/components/doctrine/FalseClaimsList';
import FalseClaimsDetail from '@/components/doctrine/FalseClaimsDetail';

function FalseClaimsContentInner() {
  const searchParams = useSearchParams();
  const { locale } = useTranslation();
  const articleId = searchParams.get('article');

  if (articleId) {
    const article = getArticleById(articleId, locale);
    if (article) {
      return <FalseClaimsDetail article={article} />;
    }
  }

  return <FalseClaimsList />;
}

export default function FalseClaimsContent() {
  return (
    <Suspense>
      <FalseClaimsContentInner />
    </Suspense>
  );
}
