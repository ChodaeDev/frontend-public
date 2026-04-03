'use client';

import Link from 'next/link';
import type { NavItem } from '@/config/navigation';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';

interface SubSideNavProps {
  navItem: NavItem;
  currentSubSlug: string;
  locale: Locale;
}

export default function SubSideNav({ navItem, currentSubSlug, locale }: SubSideNavProps) {
  return (
    <nav className={'hidden xl:block w-56 shrink-0 pr-4 mr-4 border-r border-gray9'}>
      <div className={'sticky top-28'}>
        {/* 섹션 제목 */}
        <h2 className={'text-base font-bold text-main mb-4 pb-3 border-b-2 border-accent1'}>
          {navItem.label}
        </h2>

        {/* 하위 메뉴 목록 */}
        <ul className={'space-y-1'}>
          {navItem.subMenus?.map((sub) => {
            const isActive = sub.slug === currentSubSlug;
            return (
              <li key={sub.slug}>
                <Link
                  href={`/${ locale }/${ navItem.slug }/${ sub.slug }`}
                  className={cn('block py-2.5 px-3 rounded-lg transition-all duration-300', isActive ? 'font-bold text-accent1 bg-accent1/5' : 'text-sub hover:text-main hover:bg-gray9')}
                >
                  {sub.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
