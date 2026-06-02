'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogIn, LogOut } from 'lucide-react';
import ThemeSwitch from '@/components/theme/ThemeSwitch';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import Navigation from '@/components/layout/Navigation';
import MobileMenu from '@/components/layout/MobileMenu';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';
import { cn } from '@/lib/cn';
import ConfirmModal from '@/components/ui/ConfirmModal';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { dictionary, locale } = useTranslation();
  const t = dictionary;
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  return (
    <>
      <header className={cn('h-[89px] fixed w-full top-0 left-0 z-50 bg-background/80 backdrop-blur-sm border-b transition-colors duration-300', isScrolled ? 'border-gray9' : 'border-transparent')}>
        <div className={'flex items-center justify-between max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-4'}>
          <Link href={`/${ locale }`} className={'flex items-center gap-2'}>
            <Image src={'/assets/images/logo.png'} alt={t.header.logoAlt || '로고 이미지'} width={56} height={56} />
            <div className={'flex flex-col'}>
              <span className={'text-2xl font-black text-main'}>{t.header.siteName || '신천지 전문상담소'}</span>
              <span className={'text-sub'}>{t.header.siteSubName || '구리이단상담소'}</span>
            </div>
          </Link>
          <div className={'hidden lg:flex'}>
            <Navigation />
          </div>
          <div className={'flex items-center gap-2'}>
            <div className={'hidden lg:flex items-center gap-2'}>
              <LanguageSwitch />
              <ThemeSwitch />
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
                  className={'flex items-center gap-1.5 rounded-lg bg-background-secondary px-3.5 py-2 text-sm font-semibold text-main transition-opacity hover:opacity-90'}
                >
                  <LogIn size={16} />
                  {t.common.login || '로그인'}
                </Link>
              )}
            </div>
            <MobileMenu />
          </div>
        </div>
      </header>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title={t.common.logoutConfirmTitle || '로그아웃'}
        message={t.common.logoutConfirmMessage || '정말 로그아웃 하시겠습니까?'}
        confirmText={t.common.logout || '로그아웃'}
        cancelText={t.common.cancel || '취소'}
      />
    </>
  );
};

export default Header;
