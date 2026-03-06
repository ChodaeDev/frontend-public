'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '@/config/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    if (slug === '') return pathname === '/';
    return pathname.startsWith(`/${ slug }`);
  };

  return (
    <nav className={'flex items-center gap-1'}>
      {navItems.map((item) => (
        <Link
          key={item.slug}
          href={item.slug === '' ? '/' : `/${ item.slug }`}
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
