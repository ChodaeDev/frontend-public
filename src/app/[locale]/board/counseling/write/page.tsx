import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { locales, isValidLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';
import LeftSubMenuNav from '@/components/ui/LeftSubMenuNav';
import TopSubMenuTab from '@/components/ui/TopSubMenuTab';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CounselingWriteForm from '@/components/board/CounselingWriteForm';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CounselingWritePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const navItems = getNavItems(locale, dictionary);
  const boardNav = navItems.find((item) => item.slug === 'board');
  const counselingSub = boardNav?.subMenus?.find((s) => s.slug === 'counseling');

  if (!boardNav || !counselingSub) notFound();

  const commonDict = dictionary.common as { home: string };
  const boardDict = dictionary.board as { counselingForm: string };

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
              { label: boardDict.counselingForm || '상담 신청' },
            ]}
          />

          <div>
            <h1 className={'text-2xl font-bold text-gray1'}>{boardDict.counselingForm || '상담 신청'}</h1>
            <p className={'text-sm text-gray3 mt-1'}>{counselingSub.description}</p>
          </div>
        </div>

        <div className={'flex-1 min-w-0'}>
          <CounselingWriteForm />
        </div>
      </div>
    </div>
  );
}
