'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/i18n/client';
import { getNavItems } from '@/config/navigation';

const Navigation = () => {
  const pathname = usePathname();
  const { locale, dictionary } = useTranslation();
  const navItems = getNavItems(locale, dictionary);

  const isActive = (slug: string) => {
    const basePath = `/${ locale }`;
    if (slug === '') return pathname === basePath || pathname === `${ basePath }/`;
    return pathname.startsWith(`${ basePath }/${ slug }`);
  };

  return (
    <nav className={'flex items-center gap-1'}>
      {navItems.map((item) => (
        <Link
          key={item.slug}
          href={item.slug === '' ? `/${ locale }` : `/${ locale }/${ item.slug }`}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
            isActive(item.slug)
              ? 'text-main font-black bg-gray9'
              : 'text-sub hover:text-main hover:bg-background-secondary'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
