import { getDictionary } from '@/i18n/getDictionary';
import { isValidLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { BoardPreviewSection, LandingImageSection, MinistrySection, NewsSection, QuickMenuSection, SideNav, TestimonySection } from '@/components/landing';

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
    <main className={'flex flex-col items-center min-h-screen'}>
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
      <NewsSection dictionary={dictionary} locale={locale} />
      <TestimonySection dictionary={dictionary} locale={locale} />
      <BoardPreviewSection dictionary={dictionary} locale={locale} />
      <SideNav dictionary={dictionary} locale={locale} />
    </main>
  );
}
