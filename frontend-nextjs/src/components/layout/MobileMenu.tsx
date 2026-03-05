'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';
import ThemeSwitch from '@/components/theme/ThemeSwitch';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  const open = useCallback(() => {
    setIsOpen(true);
    document.body.classList.add('overflow-hidden');
  }, []);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      document.body.classList.remove('overflow-hidden');
    }, 250);
  }, []);

  // pathname 변경 시 메뉴 닫기
  useEffect(() => {
    if (isOpen) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const isActive = (slug: string) => {
    if (slug === '') return pathname === '/';
    return pathname.startsWith(`/${ slug }`);
  };

  return (
    <>
      <button
        onClick={open}
        className={'lg:hidden p-2 rounded-md text-sub hover:text-main hover:bg-background-secondary transition-colors'}
        aria-label={'메뉴 열기'}
      >
        <Menu size={24} />
      </button>

      {isOpen && createPortal(
        <div className={'fixed inset-0 z-50 lg:hidden'}>
          <div
            className={`absolute inset-0 bg-black/50 ${ isClosing ? 'animate-fadeOut' : 'animate-fadeIn' }`}
            onClick={close}
          />

          <div
            className={`absolute top-0 right-0 h-full w-3/4 max-w-sm bg-background border-l border-gray9 flex flex-col ${ isClosing ? 'animate-slideOutRight' : 'animate-slideInRight' }`}
          >
            <div className={'flex items-center justify-between px-4 py-4 border-b border-gray9 min-h-[89px]'}>
              <span className={'text-lg font-bold text-main'}>{'메뉴'}</span>
              <button
                onClick={close}
                className={'p-2 rounded-md text-sub hover:text-main hover:bg-background-secondary transition-colors'}
                aria-label={'메뉴 닫기'}
              >
                <X size={24} />
              </button>
            </div>

            <nav className={'flex-1 overflow-y-auto py-4'}>
              {NAV_ITEMS.map((item) => (
                <div key={item.slug} className={'mb-2'}>
                  <Link
                    href={item.slug === '' ? '/' : `/${ item.slug }`}
                    className={`block px-6 py-2.5 text-base font-bold transition-colors ${
                      isActive(item.slug)
                        ? 'text-accent1'
                        : 'text-main'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.subMenus && (
                    <div className={'ml-4'}>
                      {item.subMenus.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/${ item.slug }/${ sub.slug }`}
                          className={`block px-6 py-2 text-sm transition-colors ${
                            pathname === `/${ item.slug }/${ sub.slug }`
                              ? 'text-accent1 font-semibold'
                              : 'text-sub hover:text-main'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className={'px-6 py-4 border-t border-gray9 flex items-center gap-2'}>
              <ThemeSwitch />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default MobileMenu;
