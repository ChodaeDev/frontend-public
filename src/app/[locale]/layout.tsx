import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Noto_Sans_KR, Gowun_Batang } from 'next/font/google';
import '@/styles/globals.css';
import ThemeLayout from '@/layouts/ThemeProvider';
import { QueryProvider } from '@/store/QueryProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { locales, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { TranslationProvider } from '@/i18n/client';
import ScrollToTop from '@/components/layout/ScrollToTop';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

const gowunBatang = Gowun_Batang({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-gowun-batang',
  display: 'swap',
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

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

  const siteName = dictionary.metadata.title || '구리이단상담소';
  const description = dictionary.metadata.description || '신천지 관련 전문 상담';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.antiscj.or.kr';
  const ogImage = `${ siteUrl }/assets/images/thumbnail.png`;

  return {
    title: {
      template: `%s | ${ siteName }`,
      default: siteName,
    },
    description,
    openGraph: {
      title: siteName,
      description,
      url: `${ siteUrl }/${ locale }`,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1920,
          height: 1080,
          alt: siteName,
        },
      ],
      locale: locale === 'ko' ? 'ko_KR' : locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: [ogImage],
    },
    verification: {
      google: 'h-WGXHzaD9aAVH_2Ph7c1qCKobDF6xlhUj3FAzoX05g',
    },
    icons: {
      icon: [
        { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
        { url: '/favicon/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
        { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
        { url: '/favicon/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
      ],
    },
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.antiscj.or.kr';
  const siteName = dictionary.metadata.title || '구리이단상담소';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${ siteUrl }/#organization`,
        name: siteName,
        url: siteUrl,
        logo: `${ siteUrl }/favicon/favicon-256x256.png`,
        description: dictionary.metadata.description || '신천지 관련 전문 상담',
      },
      {
        '@type': 'WebSite',
        '@id': `${ siteUrl }/#website`,
        url: siteUrl,
        name: siteName,
        publisher: { '@id': `${ siteUrl }/#organization` },
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${ siteUrl }/#navigation`,
        name: 'Main Navigation',
        hasPart: [
          {
            '@type': 'SiteNavigationElement',
            name: '상담소 소개 및 인사말',
            url: `${ siteUrl }/${ locale }/about/introduction`,
          },
          {
            '@type': 'SiteNavigationElement',
            name: '상담게시판',
            url: `${ siteUrl }/${ locale }/board/counseling`,
          },
          {
            '@type': 'SiteNavigationElement',
            name: '신천지 정보',
            url: `${ siteUrl }/${ locale }/scj-info/details`,
          },
          {
            '@type': 'SiteNavigationElement',
            name: '거짓 반증',
            url: `${ siteUrl }/${ locale }/doctrine/false-claims`,
          },
          {
            '@type': 'SiteNavigationElement',
            name: '지혜로운 탈퇴방법',
            url: `${ siteUrl }/${ locale }/withdrawal/methods`,
          },
        ],
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type={'application/ld+json'}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${ notoSansKr.variable } ${ gowunBatang.variable } font-sans antialiased`}>
        <QueryProvider>
          <ThemeLayout>
            <TranslationProvider dictionary={dictionary} locale={locale}>
              <ScrollToTop />
              <div className={'relative h-full'}>
                <Header />
                <main className={'mt-[89px] max-w-7xl min-h-[calc(100vh-89px)] mx-auto px-4 md:px-6 lg:px-10'}>
                  {children}
                </main>
                <Footer />
              </div>
            </TranslationProvider>
          </ThemeLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
