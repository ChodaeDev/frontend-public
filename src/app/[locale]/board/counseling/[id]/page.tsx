import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { isValidLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LeftSubMenuNav from '@/components/ui/LeftSubMenuNav';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CounselingDetail from '@/components/board/CounselingDetail';

export default async function CounselingDetailPage({
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
  const boardDict = dictionary.board as { counselingPost: string; backToList: string };

  return (
    <div className={'flex py-8 min-h-screen'}>
      <LeftSubMenuNav
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
              { label: boardDict.counselingPost || '상담글' },
            ]}
          />

          <Link
            href={`/${ locale }/board/counseling`}
            className={'inline-flex items-center gap-1.5 text-sm text-sub hover:text-main transition-colors'}
          >
            <ArrowLeft className={'size-4'} />
            {boardDict.backToList || '목록으로'}
          </Link>
        </div>

        <div className={'flex-1 min-w-0'}>
          <CounselingDetail postId={postId} />
        </div>
      </div>
    </div>
  );
}
