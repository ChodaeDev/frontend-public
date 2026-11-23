import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';
import { isValidLocale } from '@/i18n/config';
import MypageLayoutContent from './MypageLayoutContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  const t = dictionary.mypage as { title?: string };
  return { title: t.title || '마이페이지' };
}

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  return <MypageLayoutContent>{children}</MypageLayoutContent>;
}
