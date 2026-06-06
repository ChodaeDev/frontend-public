// SubMenu 진입점 페이지 주석처리(미들웨어에서 첫 번째 subMenu로 redirect하므로 이 페이지는 도달하지 않음)
// (SubMenu Card 진입점 페이지 사용 시 주석 제거)
// import Link from 'next/link';
import { notFound } from 'next/navigation';
// import { ChevronRight } from 'lucide-react';
// import { getDictionary } from '@/i18n/getDictionary';
import { locales, isValidLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';

export function generateStaticParams() {
  const navItems = getNavItems('ko');
  return locales.flatMap((locale) =>
    navItems
      .filter((item) => item.slug !== '' && item.subMenus)
      .map((item) => ({ locale, mainMenu: item.slug })),
  );
}

// 미들웨어에서 첫 번째 subMenu로 redirect하므로 이 페이지는 도달하지 않음
// 만약 도달하면 notFound 처리
export default async function MainMenuPage({
  params,
}: {
  params: Promise<{ locale: string; mainMenu: string }>;
}) {
  const { locale, mainMenu } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const navItems = getNavItems(locale);
  const navItem = navItems.find((item) => item.slug === mainMenu);

  if (!navItem?.subMenus) notFound();

  // 미들웨어 redirect를 통과한 경우 (발생하지 않아야 함)
  notFound();

  // TODO: 카드형 진입점 UI — 필요 시 복원
  // const dictionary = await getDictionary(locale);
  // const navItems = getNavItems(locale, dictionary);
  // return (
  //   <div className={'py-8'}>
  //     <h1 className={'font-bold text-sub mb-6'}>{navItem.label}</h1>
  //     <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'}>
  //       {navItem.subMenus.map((sub) => (
  //         <Link
  //           key={sub.slug}
  //           href={`/${ locale }/${ mainMenu }/${ sub.slug }`}
  //           className={'group flex flex-col'}
  //         >
  //           <div className={'flex items-center justify-between text-main group-hover:text-accent1 transition-colors pb-2 border-b-2 border-gray6'}>
  //             <h2 className={'w-full text-2xl font-bold'}>
  //               {sub.label}
  //             </h2>
  //             <ChevronRight className={'size-6'} />
  //           </div>
  //           {sub.description && (
  //             <p className={'mt-2 text-sm text-gray2 whitespace-pre-line'}>
  //               {sub.description}
  //             </p>
  //           )}
  //         </Link>
  //       ))}
  //     </div>
  //   </div>
  // );
}
