'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut } from 'lucide-react';
import ThemeSwitch from '@/components/theme/ThemeSwitch';
import Navigation from '@/components/layout/Navigation';
import MobileMenu from '@/components/layout/MobileMenu';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import Image from 'next/image';

const Header = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <header className={'h-[89px] fixed w-full top-0 left-0 z-50 bg-background/80 backdrop-blur-sm border-b border-gray9'}>
      <div className={'flex items-center justify-between max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-4'}>
        <div className={'flex items-center gap-2'}>
          <Image src={'/assets/images/logo.png'} alt={'로고 이미지'} width={56} height={56} />
          <Link href={'/'} className={'flex flex-col'}>
            <span className={'text-2xl font-black text-main'}>{'신천지 전문상담소'}</span>
            <span className={'text-sub'}>{'구리이단상담소'}</span>
          </Link>
        </div>
        <div className={'hidden lg:flex'}>
          <Navigation />
        </div>
        <div className={'flex items-center gap-2'}>
          <div className={'hidden lg:flex items-center gap-2'}>
            <ThemeSwitch />
            {user ? (
              <button
                onClick={handleLogout}
                className={'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sub transition-colors hover:bg-background-secondary hover:text-main'}
              >
                <LogOut size={16} />
                {'로그아웃'}
              </button>
            ) : (
              <Link
                href={'/login'}
                className={'flex items-center gap-1.5 rounded-lg bg-background-secondary px-3.5 py-2 text-sm font-semibold text-main transition-opacity hover:opacity-90'}
              >
                <LogIn size={16} />
                {'로그인'}
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
