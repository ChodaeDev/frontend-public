'use client';

import ThemeSwitch from '@/components/theme/ThemeSwitch';

const Header = () => {
  return (
    <header className={'sticky w-full top-0 z-50 flex items-center justify-between px-10 py-4 bg-background/80 backdrop-blur-sm border-b border-background-secondary'}>
      <div className={'flex flex-col'}>
        <span className={'text-2xl font-black text-main'}>{'신천지 전문상담소'}</span>
        <span className={'text-sub'}>{'구리이단상담소'}</span>
      </div>
      <div className={'flex items-center gap-2'}>
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
