import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { locales, isValidLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';
import SubSideNav from '@/components/ui/SubSideNav';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CounselingEditForm from '@/components/board/CounselingEditForm';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CounselingEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const postId = Number(id);

  if (!isValidLocale(locale) || isNaN(postId)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const navItems = getNavItems(locale, dictionary);
  const boardNav = navItems.find((item) => item.slug === 'board');
  const counselingSub = boardNav?.subMenus?.find((s) => s.slug === 'counseling');

  if (!boardNav || !counselingSub) notFound();

  const commonDict = dictionary.common as { home: string };
  const boardDict = dictionary.board as { counselingEditForm: string; counselingPost: string };

  return (
    <div className={'flex py-8 min-h-screen'}>
      <SubSideNav
        navItem={boardNav}
        currentSubSlug={'counseling'}
        locale={locale}
      />

      <div className={'w-full flex-col gap-10'}>
        <div className={'flex flex-col sm:flex-row-reverse sm:items-start sm:justify-between gap-4 mb-8'}>
          <Breadcrumb
            locale={locale}
            homeLabel={commonDict.home || '홈'}
            items={[
              { label: boardNav.label, href: `/${ locale }/board` },
              { label: counselingSub.label, href: `/${ locale }/board/counseling` },
              { label: boardDict.counselingPost || '상담글', href: `/${ locale }/board/counseling/${ postId }` },
              { label: boardDict.counselingEditForm || '상담 수정' },
            ]}
          />

          <div>
            <h1 className={'text-2xl font-bold text-main'}>{boardDict.counselingEditForm || '상담 수정'}</h1>
            <p className={'text-sm text-gray1 mt-1'}>{counselingSub.description}</p>
          </div>
        </div>

        <div className={'flex-1 min-w-0'}>
          <CounselingEditForm postId={postId} />
        </div>
      </div>
    </div>
  );
}
