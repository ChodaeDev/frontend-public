'use client';

import { useTranslation } from '@/i18n/client';

export default function ActivityPage() {
  const { dictionary } = useTranslation();
  const t = dictionary.mypage as Record<string, unknown>;

  return (
    <div>
      <h1 className={'text-2xl font-bold text-main mb-2'}>{(t.activity as string) || '활동 내역'}</h1>
      <p className={'text-sm text-sub'}>{'서비스 준비중입니다.'}</p>
    </div>
  );
}
