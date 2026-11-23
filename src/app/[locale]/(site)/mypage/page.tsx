import { redirect } from 'next/navigation';

export default async function MypagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${ locale }/mypage/profile`);
}
