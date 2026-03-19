import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/getDictionary';
import { locales, isValidLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';
import SubSideNav from '@/components/ui/SubSideNav';
import Breadcrumb from '@/components/ui/Breadcrumb';
import SectionContent from '@/components/section/SectionContent';

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

  const commonDict = dictionary.common as { home: string };

  return (
    <div className={'flex py-8 min-h-screen'}>
      <SubSideNav
        navItem={navItem}
        currentSubSlug={sub}
        locale={locale}
      />

      <div className={'w-full flex-col gap-10'}>
        <div className={'flex flex-col sm:flex-row-reverse sm:items-start sm:justify-between gap-4 mb-8'}>
          <Breadcrumb
            locale={locale}
            homeLabel={commonDict.home}
            items={[
              { label: navItem.label, href: `/${ locale }/${ section }` },
              { label: subItem.label },
            ]}
          />

          <div>
            <h1 className={'text-2xl font-bold text-main'}>{subItem.label}</h1>
            {subItem.description && (
              <p className={'text-sm text-gray1 mt-1'}>{subItem.description}</p>
            )}
          </div>
        </div>

        <div className={'flex-1 min-w-0'}>
          <SectionContent
            locale={locale}
            section={section}
            sub={sub}
            dictionary={dictionary}
          />
        </div>
      </div>
    </div>
  );
}
