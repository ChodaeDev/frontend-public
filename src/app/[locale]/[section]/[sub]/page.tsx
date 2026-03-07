import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { locales, isValidLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';

export function generateStaticParams() {
  const navItems = getNavItems('ko');
  return locales.flatMap((locale) =>
    navItems
      .filter((item) => item.subMenus)
      .flatMap((item) =>
        item.subMenus!.map((sub) => ({
          locale,
          section: item.slug,
          sub: sub.slug,
        })),
      ),
  );
}

export default async function SubPage({
  params,
}: {
  params: Promise<{ locale: string; section: string; sub: string }>;
}) {
  const { locale, section, sub } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const navItems = getNavItems(locale, dictionary);
  const navItem = navItems.find((item) => item.slug === section);
  const subItem = navItem?.subMenus?.find((s) => s.slug === sub);

  if (!navItem || !subItem) notFound();

  return (
    <div className={'py-8'}>
      <p className={'text-sm text-sub mb-2'}>
        {navItem.label}
      </p>
      <h1 className={'text-2xl font-bold text-main'}>
        {subItem.label}
      </h1>
    </div>
  );
}
