import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { isValidLocale } from '@/i18n/config';
import GateHeader from '@/components/gate/GateHeader';
import GateSplit, { type GateDict } from '@/components/gate/GateSplit';
import VisitorTracker from '@/components/visitor/VisitorTracker';

/** 첫 진입 갈림길: 왼쪽은 바로 상담 신청, 오른쪽은 홈페이지(/home) */
export default async function GatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const t = dictionary.gate as GateDict;

  return (
    <div className={'relative'}>
      <VisitorTracker />
      <GateHeader />
      <main>
        <h1 className={'sr-only'}>{dictionary.metadata.title}</h1>
        <GateSplit locale={locale} t={t} />
      </main>
    </div>
  );
}
