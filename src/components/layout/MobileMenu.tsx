'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import ThemeSwitch from '@/components/theme/ThemeSwitch';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/i18n/client';
import { getNavItems } from '@/config/navigation';
import { cn } from '@/lib/cn';
import ConfirmModal from '@/components/ui/ConfirmModal';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { locale, dictionary } = useTranslation();
  const navItems = getNavItems(locale, dictionary);
  const t = dictionary;

  const open = useCallback(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${ scrollY }px`;
    document.body.style.width = '100%';
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsClosing(true);
    const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, []);

  const handleLogout = useCallback(() => {
    setShowLogoutModal(false);
    logout();
    close();
    router.refresh();
  }, [logout, close, router]);

  // pathname 변경 시 메뉴 닫기
  useEffect(() => {
    if (isOpen) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
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
        aria-label={t.header.openMenu || '메뉴 열기'}
      >
        <Menu size={24} />
      </button>

      {isOpen && createPortal(
        <div className={'fixed inset-0 z-50 lg:hidden'}>
          <div
            className={cn('absolute inset-0 bg-black/50', isClosing ? 'animate-fadeOut' : 'animate-fadeIn')}
            onClick={close}
          />

          <div
            className={cn('absolute top-0 right-0 h-full w-3/4 max-w-sm bg-background border-l border-gray9 flex flex-col', isClosing ? 'animate-slideOutRight' : 'animate-slideInRight')}
          >
            <div className={'flex items-center justify-between px-4 py-4 border-b border-gray9 min-h-[89px]'}>
              <span className={'text-lg font-bold text-main'}>{t.common.menu || '메뉴'}</span>
              <button
                onClick={close}
                className={'p-2 rounded-md text-sub hover:text-main hover:bg-background-secondary transition-colors'}
                aria-label={t.header.closeMenu || '메뉴 닫기'}
              >
                <X size={24} />
              </button>
            </div>

            <nav className={'flex-1 overflow-y-auto py-4'}>
              {navItems.map((item) => (
                <div key={item.slug} className={'mb-2'}>
                  <Link
                    href={item.slug === '' ? `/${ locale }` : `/${ locale }/${ item.slug }`}
                    className={cn('block px-6 py-2.5 text-base font-bold transition-colors', isActive(item.slug) ? 'text-accent1' : 'text-main')}
                  >
                    {item.label}
                  </Link>
                  {item.subMenus && (
                    <div className={'ml-4'}>
                      {item.subMenus.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/${ locale }/${ item.slug }/${ sub.slug }`}
                          className={cn('block px-6 py-2 text-sm transition-colors', pathname === `/${ locale }/${ item.slug }/${ sub.slug }` ? 'text-accent1 font-semibold' : 'text-sub hover:text-main')}
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
                  onClick={() => setShowLogoutModal(true)}
                  className={'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sub transition-colors hover:bg-background-secondary hover:text-main'}
                >
                  <LogOut size={16} />
                  {t.common.logout || '로그아웃'}
                </button>
              ) : (
                <Link
                  href={`/${ locale }/login?returnTo=${ encodeURIComponent(pathname) }`}
                  className={'flex items-center gap-1.5 rounded-lg bg-accent1 px-3.5 py-2 text-sm font-semibold text-inverse transition-opacity hover:opacity-90'}
                >
                  <LogIn size={16} />
                  {t.common.login || '로그인'}
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

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={t.common.logoutConfirmTitle || '로그아웃'}
        message={t.common.logoutConfirmMessage || '정말 로그아웃 하시겠습니까?'}
        confirmText={t.common.logout || '로그아웃'}
        cancelText={t.common.cancel || '취소'}
      />
    </>
  );
};

export default MobileMenu;
