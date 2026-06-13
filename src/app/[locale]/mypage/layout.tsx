'use client';

import { useParams, usePathname } from 'next/navigation';
import SubSideNav from '@/components/ui/SubSideNav';
import { useTranslation } from '@/i18n/client';
import type { Locale } from '@/i18n/config';
import type { NavItem } from '@/config/navigation';

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as Locale;
  const { dictionary } = useTranslation();
  const t = dictionary.mypage as Record<string, unknown>;

  // 현재 활성 서브메뉴 slug 추출
  const segments = pathname.split('/');
  const currentSubSlug = segments[3] || 'profile';

  const navItem: NavItem = {
    label: (t.title as string) || '마이페이지',
    slug: 'mypage',
    subMenus: [
      { label: (t.profile as string) || '프로필 수정', slug: 'profile' },
      { label: (t.password as string) || '비밀번호 변경', slug: 'password' },
      { label: (t.activity as string) || '활동 내역', slug: 'activity' },
    ],
  };

  return (
    <div className={'flex py-8 min-h-screen'}>
      <SubSideNav
        navItem={navItem}
        currentSubSlug={currentSubSlug}
        locale={locale}
      />
      <div className={'w-full flex-col gap-10'}>
        {children}
      </div>
    </div>
  );
}
