'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogIn, User } from 'lucide-react';
import ThemeSwitch from '@/components/theme/ThemeSwitch';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/i18n/client';
import { useHydrated } from '@/lib/hooks/useHydrated';

/** 갈림길 전용 헤더: 타이틀, 다국어, 테마, 로그인만 둔다 */
export default function GateHeader() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const storedUser = useAuthStore((state) => state.user);
  // 서버 렌더와 맞추기 위해 하이드레이션 전에는 비로그인으로 그린다
  const user = hydrated ? storedUser : null;
  const { dictionary, locale } = useTranslation();
  const t = dictionary;

  const userGreeting = user
    ? (t.common.userGreeting || '{name}님').replace('{name}', user.userName)
    : '';

  return (
    <header className={'absolute top-0 left-0 z-20 w-full'}>
      <div className={'flex items-center justify-between max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-4'}>
        <Link href={`/${ locale }`} className={'flex min-w-0 items-center gap-2'}>
          <Image src={'/assets/images/logo.png'} alt={t.header.logoAlt || '로고 이미지'} width={48} height={48} className={'size-10 sm:size-12'} />
          <div className={'flex min-w-0 flex-col'}>
            <span className={'truncate text-lg font-black text-main sm:text-xl'}>{t.header.siteName || '신천지 전문상담소'}</span>
            <span className={'truncate text-xs text-sub sm:text-sm'}>{t.header.siteSubName || '구리이단상담소'}</span>
          </div>
        </Link>

        <div className={'flex shrink-0 items-center gap-1 sm:gap-2'}>
          <LanguageSwitch />
          <ThemeSwitch />
          {user ? (
            <Link
              href={`/${ locale }/mypage`}
              className={'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sub transition-colors hover:bg-background-secondary hover:text-main'}
            >
              <User size={16} />
              <span className={'hidden sm:inline'}>{userGreeting}</span>
            </Link>
          ) : (
            <Link
              href={`/${ locale }/login?returnTo=${ encodeURIComponent(pathname) }`}
              className={'flex items-center gap-1.5 rounded-lg bg-background-secondary px-2.5 py-2 text-sm font-semibold text-main transition-opacity hover:opacity-90 sm:px-3.5'}
            >
              <LogIn size={16} />
              <span>{t.common.login || '로그인'}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
