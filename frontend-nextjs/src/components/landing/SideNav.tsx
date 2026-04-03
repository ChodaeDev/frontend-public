'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, DoorOpen, MessageSquareText, ShieldAlert, Heart, Plus } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';

interface SideNavDictionary {
  counseling: string;
  exitMethods: string;
  testimonies: string;
  falseClaims: string;
  donation: string;
}

interface SideNavProps {
  dictionary: {
    home: {
      quickNav: SideNavDictionary;
    };
  };
  locale: Locale;
}

const navItems = [
  { key: 'counseling' as const, icon: Phone, href: null },
  { key: 'exitMethods' as const, icon: DoorOpen, href: '/withdrawal/methods' },
  { key: 'testimonies' as const, icon: MessageSquareText, href: '/withdrawal/testimonies' },
  { key: 'falseClaims' as const, icon: ShieldAlert, href: '/doctrine/falseClaims' },
  { key: 'donation' as const, icon: Heart, href: null },
];

function NavButton({
  icon: Icon,
  label,
  href,
  locale,
}: {
  icon: typeof Phone;
  label: string;
  href: string | null;
  locale: Locale;
}) {
  const inner = (
    <>
      <Icon className={'size-6 text-sub'} />
      <span className={'text-xs text-sub leading-tight'}>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={`/${ locale }${ href }`} className={'flex flex-col items-center gap-1 w-18 py-2 rounded-xl hover:bg-gray8 transition-colors'}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={'flex flex-col items-center gap-1 w-18 py-2 rounded-xl hover:bg-gray8 transition-colors'}>
      {inner}
    </button>
  );
}

const quickNavFallback: SideNavDictionary = {
  counseling: '상담전화',
  exitMethods: '탈퇴방법',
  testimonies: '탈퇴후기',
  falseClaims: '거짓반증',
  donation: '후원문의',
};

export default function SideNav({ dictionary, locale }: SideNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = dictionary.home.quickNav;

  return (
    <>
      {/* sm 이상: 항상 표시 */}
      <div className={'absolute top-0 right-3 2xl:right-auto 2xl:left-[calc(50%+42.25rem)] h-full pointer-events-none'}>
        <div className={'h-32'} />
        <nav
          className={
            `hidden sm:flex sticky top-32 z-40 flex-col items-center gap-1
            bg-background/70 backdrop-blur-xs rounded-2xl p-1.5 shadow-lg border border-gray9 pointer-events-auto`
          }
        >
          {navItems.map((item) => (
            <NavButton
              key={item.key}
              icon={item.icon}
              label={t[item.key] || quickNavFallback[item.key]}
              href={item.href}
              locale={locale}
            />
          ))}
        </nav>
      </div>

      {/* sm 이하: FAB 토글 */}
      <div className={'sm:hidden fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3'}>
        {/* 확장 메뉴 */}
        <nav
          className={
            cn('flex flex-col items-center gap-1 bg-background/70 backdrop-blur-xs rounded-2xl p-2 shadow-lg',
              'transition-all duration-300 origin-bottom border border-gray9',
              isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none')
          }
        >
          {navItems.map((item) => (
            <NavButton
              key={item.key}
              icon={item.icon}
              label={t[item.key] || quickNavFallback[item.key]}
              href={item.href}
              locale={locale}
            />
          ))}
        </nav>

        {/* FAB 버튼 */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={
            cn('flex items-center justify-center size-14 rounded-full shadow-lg',
              'bg-accent1 text-white transition-transform duration-300',
              isOpen ? 'rotate-45' : '')
          }
          aria-label={`${ isOpen ? 'Close menu' : 'Open menu' }`}
        >
          <Plus className={'size-6'} />
        </button>
      </div>
    </>
  );
}