'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { useTranslation } from '@/i18n/client';

export default function NotFound() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? 'ko';
  const { dictionary } = useTranslation();
  const t = dictionary.notFound;

  return (
    <div className={'flex min-h-[calc(100vh-89px)] flex-col items-center justify-center gap-6 text-center'}>
      <div className={'flex flex-col items-center gap-2'}>
        <span className={'text-[120px] font-black leading-none text-gray7 select-none'}>{'404'}</span>
        <p className={'text-xl font-semibold text-main'}>{t.title || '페이지를 찾을 수 없습니다'}</p>
        <p className={'text-sm text-sub'}>{t.description || '요청하신 페이지가 존재하지 않거나 이동되었습니다.'}</p>
      </div>

      <div className={'flex items-center gap-3'}>
        <button
          onClick={() => router.back()}
          className={'inline-flex items-center gap-2 rounded-lg border border-gray6 px-5 py-2.5 text-sm font-medium text-sub transition-colors hover:bg-gray8'}
        >
          <ArrowLeft className={'size-4'} />
          {t.back || '뒤로가기'}
        </button>
        <Link
          href={`/${ locale }`}
          className={'inline-flex items-center gap-2 rounded-lg bg-accent1 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent1/90'}
        >
          <Home className={'size-4'} />
          {t.home || '홈으로'}
        </Link>
      </div>
    </div>
  );
}
