'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut } from 'lucide-react';
import ThemeSwitch from '@/components/theme/ThemeSwitch';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import Navigation from '@/components/layout/Navigation';
import MobileMenu from '@/components/layout/MobileMenu';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';
import { cn } from '@/lib/cn';

const Header = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { dictionary, locale } = useTranslation();
  const t = dictionary;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${ locale }`);
  };

  return (
    <header className={cn('h-[89px] fixed w-full top-0 left-0 z-50 bg-background/80 backdrop-blur-sm border-b transition-colors duration-300', isScrolled ? 'border-gray9' : 'border-transparent')}>
      <div className={'flex items-center justify-between max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-4'}>
        <Link href={`/${ locale }`} className={'flex items-center gap-2'}>
          <Image src={'/assets/images/logo.png'} alt={t.header.logoAlt} width={56} height={56} />
          <div className={'flex flex-col'}>
            <span className={'text-2xl font-black text-main'}>{t.header.siteName}</span>
            <span className={'text-sub'}>{t.header.siteSubName}</span>
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
                onClick={handleLogout}
                className={'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sub transition-colors hover:bg-background-secondary hover:text-main'}
              >
                <LogOut size={16} />
                {t.common.logout}
              </button>
            ) : (
              <Link
                href={`/${ locale }/login`}
                className={'flex items-center gap-1.5 rounded-lg bg-background-secondary px-3.5 py-2 text-sm font-semibold text-main transition-opacity hover:opacity-90'}
              >
                <LogIn size={16} />
                {t.common.login}
              </Link>
            )}
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
