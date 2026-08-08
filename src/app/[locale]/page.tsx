import { getDictionary } from '@/i18n/getDictionary';
import { isValidLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { BoardPreviewSection, LandingImageSection, MinistrySection, NoticePopup, PressSlideSection, QuickMenuSection, RefutationSection, RightSideNav } from '@/components/landing';
import VisitorTracker from '@/components/visitor/VisitorTracker';
import AccountDeletedModal from '@/components/ui/AccountDeletedModal';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  // TODO: API 호출로 대체
  const stats = { yearlyCount: 150, totalCount: 2750 };

  return (
    <main className={'flex flex-col items-center min-h-screen pb-10'}>
      <VisitorTracker />
      <NoticePopup />
      <AccountDeletedModal />
      <RightSideNav dictionary={dictionary} locale={locale} />
      <LandingImageSection
        dictionary={dictionary}
        locale={locale}
        stats={stats}
      />
      <QuickMenuSection
        dictionary={dictionary}
        locale={locale}
      />
      <MinistrySection dictionary={dictionary} locale={locale} />
      <PressSlideSection dictionary={dictionary} locale={locale} />
      <BoardPreviewSection dictionary={dictionary} locale={locale} />
      <RefutationSection locale={locale} />
    </main>
  );
}
