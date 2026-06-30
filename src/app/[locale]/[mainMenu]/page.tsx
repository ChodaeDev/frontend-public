import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getDictionary } from '@/i18n/getDictionary';
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

export default async function MainMenuPage({
  params,
}: {
  params: Promise<{ locale: string; mainMenu: string }>;
}) {
  const { locale, mainMenu } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const navItems = getNavItems(locale, dictionary);
  const navItem = navItems.find((item) => item.slug === mainMenu);

  if (!navItem?.subMenus) notFound();

  return (
    <div className={'py-8'}>
      <h1 className={'font-bold text-sub mb-6'}>{navItem.label}</h1>
      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12'}>
        {navItem.subMenus.map((sub) => (
          <Link
            key={sub.slug}
            href={`/${ locale }/${ mainMenu }/${ sub.slug }`}
            className={'group flex flex-col rounded-lg hover:translate-y-[-2px] transition-all duration-300'}
          >
            <div className={`flex items-center justify-between text-main pb-2 border-b border-gray5 group-hover:border-accent1
              group-hover:text-accent1 transition-colors duration-300`}
            >
              <h2 className={'w-full text-2xl font-bold'}>
                {sub.label}
              </h2>
              <ChevronRight className={'size-6 text-gray7 group-hover:text-accent1'} />
            </div>
            {sub.description && (
              <p className={'mt-2 text-sm text-gray2 whitespace-pre-line group-hover:text-sub transition-colors duration-300'}>
                {sub.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
