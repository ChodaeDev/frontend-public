import { useState } from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
// import VisitorCounter from '../components/VisitorCounter';

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={'border-gray-2 bg-background w-full border-b'}>
      <div className={'mx-auto flex h-[60px] w-full items-center justify-between px-4 sm:max-w-[1200px]'}>
        <div className={'flex w-4/5 flex-col justify-center sm:w-1/5'}>
          <span className={'text-2xl font-extrabold leading-tight text-main'}>{'구리이단상담소'}</span>
          <span className={'text-xs font-semibold text-gray5'}>{'신천지 관련 전문 상담'}</span>
        </div>

        {/* Desktop Navigation - sm 이상에서만 표시 */}
        <div className={'hidden sm:block'}>
          <Navigation />
        </div>

        {/* Desktop 버튼들 - sm 이상에서만 표시 */}
        <div className={'hidden w-1/5 items-center justify-end space-x-6 sm:flex'}>
          {/* <VisitorCounter /> */}
          <button
            type={'button'}
            className={'text-main focus:outline-none'}
          >
            <Bell size={22} />
          </button>
          <button
            type={'button'}
            onClick={() => navigate('/login')}
            className={'text-main focus:outline-none'}
          >
            <User size={22} />
          </button>
        </div>

        {/* Mobile Menu 버튼 - sm 미만에서만 표시 */}
        <button
          type={'button'}
          onClick={handleOpenMobileMenu}
          className={'rounded-full p-2 transition-colors hover:bg-gray9 sm:hidden'}
          aria-label={'메뉴 열기'}
        >
          <Menu className={'size-6 text-main'} />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} />
    </header>
  );
}

export default Header;