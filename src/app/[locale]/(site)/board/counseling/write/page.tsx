import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { locales, isValidLocale } from '@/i18n/config';
import CounselingPageShell from '@/components/board/CounselingPageShell';
import CounselingWriteChoice from '@/components/board/CounselingWriteChoice';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  return { title: dictionary.board.counselingForm || '상담 신청' };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** 상담 신청 진입점: 로그인 상태면 회원 폼으로 바로 보내고, 아니면 비회원/회원 선택 */
export default async function CounselingWritePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const t = dictionary.board;

  return (
    <CounselingPageShell
      locale={locale}
      title={t.counselingForm || '상담 신청'}
      crumbs={[{ label: t.counselingForm || '상담 신청' }]}
    >
      <CounselingWriteChoice />
    </CounselingPageShell>
  );
}
