import { getDictionary } from '@/i18n/getDictionary';
import { isValidLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';

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

  return (
    <main className={'flex min-h-screen bg-accent2 flex-col items-center justify-center'}>
      <h1 className={'text-4xl font-bold text-main'}>{dictionary.home.title}</h1>
      <p className={'mt-4 text-lg text-sub'}>{dictionary.home.subtitle}</p>
    </main>
  );
}
