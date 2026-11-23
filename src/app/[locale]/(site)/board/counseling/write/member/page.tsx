import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { locales, isValidLocale } from '@/i18n/config';
import CounselingPageShell from '@/components/board/CounselingPageShell';
import CounselingWriteForm from '@/components/board/CounselingWriteForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  return { title: dictionary.board.memberCounselingForm || '회원 상담 신청' };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CounselingMemberWritePage({
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
      title={t.memberCounselingForm || '회원 상담 신청'}
      crumbs={[
        { label: t.counselingForm || '상담 신청', href: `/${ locale }/board/counseling/write` },
        { label: t.memberWriteTitle || '회원으로 신청' },
      ]}
    >
      <CounselingWriteForm />
    </CounselingPageShell>
  );
}
