'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import ThemeSwitch from '@/components/theme/ThemeSwitch';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { useTranslation } from '@/i18n/client';
import { getNavItems } from '@/config/navigation';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { locale, dictionary } = useTranslation();
  const navItems = getNavItems(locale, dictionary);
  const t = dictionary;

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

  const handleLogout = useCallback(() => {
    dispatch(logout());
    close();
    router.push(`/${ locale }`);
  }, [dispatch, close, router, locale]);

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
    const basePath = `/${ locale }`;
    if (slug === '') return pathname === basePath || pathname === `${ basePath }/`;
    return pathname.startsWith(`${ basePath }/${ slug }`);
  };

  return (
    <>
      <button
        onClick={open}
        className={'lg:hidden p-2 rounded-md text-sub hover:text-main hover:bg-background-secondary transition-colors'}
        aria-label={t.header.openMenu}
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
              <span className={'text-lg font-bold text-main'}>{t.common.menu}</span>
              <button
                onClick={close}
                className={'p-2 rounded-md text-sub hover:text-main hover:bg-background-secondary transition-colors'}
                aria-label={t.header.closeMenu}
              >
                <X size={24} />
              </button>
            </div>

            <nav className={'flex-1 overflow-y-auto py-4'}>
              {navItems.map((item) => (
                <div key={item.slug} className={'mb-2'}>
                  <Link
                    href={item.slug === '' ? `/${ locale }` : `/${ locale }/${ item.slug }`}
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
                          href={`/${ locale }/${ item.slug }/${ sub.slug }`}
                          className={`block px-6 py-2 text-sm transition-colors ${
                            pathname === `/${ locale }/${ item.slug }/${ sub.slug }`
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

            <div className={'px-6 py-4 border-t border-gray9 flex items-center justify-between'}>
              {user ? (
                <button
                  onClick={handleLogout}
                  className={'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sub transition-colors hover:bg-background-secondary hover:text-main'}
                >
                  <LogOut size={16} />
                  {t.common.logout}
                </button>
              ) : (
                <Link
                  href={`/${ locale }/login`}
                  className={'flex items-center gap-1.5 rounded-lg bg-accent1 px-3.5 py-2 text-sm font-semibold text-inverse transition-opacity hover:opacity-90'}
                >
                  <LogIn size={16} />
                  {t.common.login}
                </Link>
              )}
              <div className={'flex items-center gap-2'}>
                <LanguageSwitch />
                <ThemeSwitch />
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default MobileMenu;
