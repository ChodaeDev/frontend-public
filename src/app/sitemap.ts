import type { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n/config';
import { getNavItems } from '@/config/navigation';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.antiscj.or.kr';

// 사이트링크 노출을 원하는 중요 페이지 (priority 높게)
const priorityPages = [
  { mainMenu: 'about', subMenu: 'introduction' },
  { mainMenu: 'board', subMenu: 'counseling' },
  { mainMenu: 'scj-info', subMenu: 'details' },
  { mainMenu: 'doctrine', subMenu: 'false-claims' },
  { mainMenu: 'withdrawal', subMenu: 'methods' },
];

function isPriorityPage(mainMenu: string, subMenu: string): boolean {
  return priorityPages.some((p) => p.mainMenu === mainMenu && p.subMenu === subMenu);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const navItems = getNavItems(defaultLocale);
  const entries: MetadataRoute.Sitemap = [];

  // 홈페이지
  entries.push({
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${ siteUrl }/${ locale }`]),
      ),
    },
  });

  // 메인 메뉴 페이지
  for (const nav of navItems) {
    if (!nav.slug) continue;

    entries.push({
      url: `${ siteUrl }/${ defaultLocale }/${ nav.slug }`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, `${ siteUrl }/${ locale }/${ nav.slug }`]),
        ),
      },
    });

    // 서브 메뉴 페이지
    if (nav.subMenus) {
      for (const sub of nav.subMenus) {
        const priority = isPriorityPage(nav.slug, sub.slug) ? 0.9 : 0.6;

        entries.push({
          url: `${ siteUrl }/${ defaultLocale }/${ nav.slug }/${ sub.slug }`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority,
          alternates: {
            languages: Object.fromEntries(
              locales.map((locale) => [locale, `${ siteUrl }/${ locale }/${ nav.slug }/${ sub.slug }`]),
            ),
          },
        });
      }
    }
  }

  return entries;
}
