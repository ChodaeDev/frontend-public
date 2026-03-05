'use client';

import Link from 'next/link';
import ThemeSwitch from '@/components/theme/ThemeSwitch';
import Navigation from '@/components/layout/Navigation';
import MobileMenu from '@/components/layout/MobileMenu';

const Header = () => {
  return (
    <header className={'sticky w-full top-0 left-0 z-50 bg-background/80 backdrop-blur-sm border-b border-gray9'}>
      <div className={'flex items-center justify-between max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-4'}>
        <div className={'flex items-center gap-6'}>
          <Link href={'/'} className={'flex flex-col'}>
            <span className={'text-2xl font-black text-main'}>{'신천지 전문상담소'}</span>
            <span className={'text-sub'}>{'구리이단상담소'}</span>
          </Link>
          <div className={'hidden lg:flex'}>
            <Navigation />
          </div>
        </div>
        <div className={'flex items-center gap-2'}>
          <div className={'hidden lg:flex'}>
            <ThemeSwitch />
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
