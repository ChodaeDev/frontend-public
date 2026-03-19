import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: Locale;
  homeLabel: string;
}

export default function Breadcrumb({ items, locale, homeLabel }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = [
    { label: homeLabel, href: `/${ locale }` },
    ...items,
  ];

  return (
    <nav aria-label={'Breadcrumb'} className={'flex items-center text-sm text-sub'}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <span key={index} className={'flex items-center'}>
            {index > 0 && (
              <ChevronRight className={'size-4 mx-1.5 text-gray4'} />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={'hover:text-accent1 transition-colors'}
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-main font-medium' : ''}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
