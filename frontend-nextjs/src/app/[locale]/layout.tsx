import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Noto_Sans_KR } from 'next/font/google';
import '@/styles/globals.css';
import { ReduxProvider } from '@/store/provider';
import ThemeLayout from '@/layouts/ThemeProvider';
import Header from '@/components/layout/Header';
import { locales, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { TranslationProvider } from '@/i18n/client';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return { title: 'Not Found' };
  }

  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 유효하지 않은 locale이면 404
  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${ notoSansKr.variable } font-sans antialiased`}>
        <ReduxProvider>
          <ThemeLayout>
            <TranslationProvider dictionary={dictionary} locale={locale}>
              <div className={'relative h-full'}>
                <Header />
                <main className={'mt-[89px] max-w-7xl min-h-[calc(100vh-89px)] mx-auto px-4 md:px-6 lg:px-10'}>
                  {children}
                </main>
              </div>
            </TranslationProvider>
          </ThemeLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
