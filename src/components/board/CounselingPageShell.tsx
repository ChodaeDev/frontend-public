import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';
import LeftSubMenuNav from '@/components/ui/LeftSubMenuNav';
import TopSubMenuTab from '@/components/ui/TopSubMenuTab';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface CounselingPageShellProps {
  locale: Locale;
  title: string;
  /** 상담게시판 다음에 붙는 breadcrumb 항목 */
  crumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}

/** 상담게시판 하위 페이지(작성 선택, 회원/비회원 작성) 공통 레이아웃 */
export default async function CounselingPageShell({ locale, title, crumbs = [], children }: CounselingPageShellProps) {
  const dictionary = await getDictionary(locale);
  const navItems = getNavItems(locale, dictionary);
  const boardNav = navItems.find((item) => item.slug === 'board');
  const counselingSub = boardNav?.subMenus?.find((s) => s.slug === 'counseling');

  if (!boardNav || !counselingSub) notFound();

  const commonDict = dictionary.common as { home: string };

  return (
    <div className={'flex py-8 min-h-screen'}>
      <LeftSubMenuNav
        navItem={boardNav}
        currentSubSlug={'counseling'}
        locale={locale}
      />

      <div className={'w-full flex-col gap-10'}>
        <TopSubMenuTab
          navItem={boardNav}
          currentSubSlug={'counseling'}
          locale={locale}
        />

        <div className={'flex flex-col sm:items-start sm:justify-between xl:flex-row-reverse gap-4 mb-8'}>
          <Breadcrumb
            locale={locale}
            homeLabel={commonDict.home || '홈'}
            items={[
              { label: boardNav.label, href: `/${ locale }/board` },
              { label: counselingSub.label, href: `/${ locale }/board/counseling` },
              ...crumbs,
            ]}
          />

          <div>
            <h1 className={'text-2xl font-bold text-gray1'}>{title}</h1>
            <p className={'text-sm text-gray3 mt-1'}>{counselingSub.description}</p>
          </div>
        </div>

        <div className={'flex-1 min-w-0'}>
          {children}
        </div>
      </div>
    </div>
  );
}
