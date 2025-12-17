import { useState } from 'react';
import { Menu } from 'lucide-react';
import PcNav from './PcNav';
import MobileNav from './MobileNav';

function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleOpenMobileNav = () => {
    setIsMobileNavOpen(true);
  };

  const handleCloseMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <header className={'bg-background fixed top-0 z-10 w-full border-b border-gray8 shadow-sm'}>
      <div className={'mx-auto flex h-[60px] w-full items-center justify-between px-4 sm:max-w-[1200px]'}>
        {/* 로고 영역 */}
        <a href={'/home'} className={'flex w-4/5 flex-col justify-center sm:w-auto'}>
          <span className={'text-2xl font-extrabold leading-tight text-main'}>{'구리이단상담소'}</span>
          <span className={'text-xs font-semibold text-gray5'}>{'신천지 관련 전문 상담'}</span>
        </a>

        {/* PC Navigation - sm 이상에서만 표시 */}
        <PcNav />

        {/* Mobile Menu 버튼 - sm 미만에서만 표시 */}
        <button
          type={'button'}
          onClick={handleOpenMobileNav}
          className={'rounded-full p-2 transition-colors hover:bg-gray9 sm:hidden'}
          aria-label={'메뉴 열기'}
        >
          <Menu className={'size-6 text-main'} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileNavOpen} onClose={handleCloseMobileNav} />
    </header>
  );
}

export default Header;
