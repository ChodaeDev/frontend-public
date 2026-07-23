import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';
import { isValidLocale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  const t = dictionary.login as { title?: string };
  return { title: t.title || '로그인' };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
