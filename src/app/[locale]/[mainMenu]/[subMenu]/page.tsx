import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { locales, isValidLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';
import LeftSubMenuNav from '@/components/ui/LeftSubMenuNav';
import TopSubMenuTab from '@/components/ui/TopSubMenuTab';
import Breadcrumb from '@/components/ui/Breadcrumb';
import SubMenuContent from '@/components/subMenu/SubMenuContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; mainMenu: string; subMenu: string }>;
}): Promise<Metadata> {
  const { locale, mainMenu, subMenu } = await params;
  if (!isValidLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  const navItems = getNavItems(locale, dictionary);
  const navItem = navItems.find((item) => item.slug === mainMenu);
  const subItem = navItem?.subMenus?.find((s) => s.slug === subMenu);
  return { title: subItem?.label || navItem?.label || subMenu };
}

export function generateStaticParams() {
  const navItems = getNavItems('ko');
  return locales.flatMap((locale) =>
    navItems
      .filter((item) => item.subMenus)
      .flatMap((item) =>
        item.subMenus!.map((sub) => ({
          locale,
          mainMenu: item.slug,
          subMenu: sub.slug,
        })),
      ),
  );
}

export default async function SubMenuPage({
  params,
}: {
  params: Promise<{ locale: string; mainMenu: string; subMenu: string }>;
}) {
  const { locale, mainMenu, subMenu } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const navItems = getNavItems(locale, dictionary);
  const navItem = navItems.find((item) => item.slug === mainMenu);
  const subItem = navItem?.subMenus?.find((s) => s.slug === subMenu);

  if (!navItem || !subItem) notFound();

  const commonDict = dictionary.common as { home: string };

  return (
    <div className={'flex py-8 min-h-screen'}>
      <LeftSubMenuNav
        navItem={navItem}
        currentSubSlug={subMenu}
        locale={locale}
      />

      <div className={'w-full flex-col gap-10'}>
        <TopSubMenuTab
          navItem={navItem}
          currentSubSlug={subMenu}
          locale={locale}
        />

        <div className={'hidden xl:flex flex-col sm:items-start sm:justify-between xl:flex-row-reverse gap-4 mb-8'}>
          <Breadcrumb
            locale={locale}
            homeLabel={commonDict.home || '홈'}
            items={[
              { label: navItem.label, href: `/${ locale }/${ mainMenu }` },
              { label: subItem.label },
            ]}
          />

          <div>
            <h1 className={'text-2xl font-bold text-gray1 mb-1'}>{subItem.label}</h1>
            {subItem.description && (
              <p className={'text-sm text-gray3'}>{subItem.description}</p>
            )}
          </div>
        </div>

        <div className={'block xl:hidden'}>
          {subItem.description && (
            <p className={'text-sm text-accent1/60 mt-[-20px] mb-6'}>{subItem.description}</p>
          )}
        </div>

        <div className={'flex-1 min-w-0'}>
          <SubMenuContent
            locale={locale}
            mainMenu={mainMenu}
            subMenu={subMenu}
            dictionary={dictionary}
          />
        </div>
      </div>
    </div>
  );
}
