'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
import Link from 'next/link';
import type { NavItem } from '@/config/navigation';
import type { Locale } from '@/i18n/config';

interface TopSubMenuTabProps {
  navItem: NavItem;
  currentSubSlug: string;
  locale: Locale;
}

const storageKey = 'tabIndicator';

export default function TopSubMenuTab({ navItem, currentSubSlug, locale }: TopSubMenuTabProps) {
  const router = useRouter();
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [animate, setAnimate] = useState(false);

  // 이전 위치를 sessionStorage에서 복원하여 초기값으로 사용
  const [indicator, setIndicator] = useState<{ left: number; width: number }>(() => {
    if (typeof window === 'undefined') return { left: 0, width: 0 };
    const saved = sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : { left: 0, width: 0 };
  });

  // 활성 탭이 보이도록 스크롤
  useLayoutEffect(() => {
    const tab = tabRefs.current.get(currentSubSlug);
    tab?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
  }, [currentSubSlug]);

  // 이전 위치를 먼저 paint한 후, 다음 프레임에서 새 위치로 업데이트하여 transition 발동
  useEffect(() => {
    const tab = tabRefs.current.get(currentSubSlug);
    if (!tab) return;

    const next = { left: tab.offsetLeft, width: tab.offsetWidth };

    // 이전 위치와 같으면(첫 진입) 애니메이션 없이 즉시 적용
    if (indicator.left === next.left && indicator.width === next.width) return;

    // 이전 위치가 paint된 후 다음 프레임에서 새 위치 적용
    requestAnimationFrame(() => {
      setAnimate(true);
      setIndicator(next);
      sessionStorage.setItem(storageKey, JSON.stringify(next));
    });
  }, [currentSubSlug, indicator.left, indicator.width]);

  return (
    <nav aria-label={navItem.label}>
      <Link className={'block xl:hidden'} href={`/${ locale }/${ navItem.slug }`}>
        <div className={'text-base font-bold text-main transition-colors'}>
          {navItem.label}
        </div>
      </Link>
      <Tabs.Root
        className={'xl:hidden mb-6'}
        value={currentSubSlug}
        onValueChange={(slug) => router.push(`/${ locale }/${ navItem.slug }/${ slug }`)}
      >
        <Tabs.List
          className={'relative flex gap-5 overflow-x-auto scrollbar-none -mx-4 mt-4 px-4 md:-mx-6 md:px-6 lg:-mx-10 lg:px-10 border-b border-gray9'}
        >
          {navItem.subMenus?.map((sub) => (
            <Tabs.Trigger
              key={sub.slug}
              value={sub.slug}
              ref={(el) => {
                if (el) tabRefs.current.set(sub.slug, el);
                else tabRefs.current.delete(sub.slug);
              }}
              className={`
              shrink-0 py-2.5 text-sm whitespace-nowrap transition-colors cursor-pointer
              data-[state=active]:text-accent1 data-[state=active]:font-bold
              data-[state=inactive]:text-sub data-[state=inactive]:hover:text-main
            `}
            >
              {sub.label}
            </Tabs.Trigger>
          ))}
          <span
            className={`pointer-events-none absolute bottom-0 h-0.5 bg-accent1 ${ animate ? 'transition-all duration-300 ease-in-out' : '' }`}
            style={{ left: indicator.left, width: indicator.width }}
          />
        </Tabs.List>
      </Tabs.Root>
    </nav>
  );
}
