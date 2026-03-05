import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import '@/styles/globals.css';
import { ReduxProvider } from '@/store/provider';
import ThemeLayout from '@/layouts/ThemeProvider';
import Header from '@/components/layout/Header';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '구리이단상담소',
  description: '신천지 관련 전문 상담',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={'ko'} suppressHydrationWarning>
      <body className={`${ notoSansKr.variable } font-sans antialiased`}>
        <ReduxProvider>
          <ThemeLayout>
            <Header />
            <main className={'max-w-7xl h-[calc(100vh-89px)] mx-auto px-4 md:px-6 lg:px-10'}>
              {children}
            </main>
          </ThemeLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
