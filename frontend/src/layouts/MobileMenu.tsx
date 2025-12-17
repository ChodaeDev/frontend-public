import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Bell, User, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { toggleTheme } from '@/store/themeSlice';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: ()=> void;
}

// 네비게이션 아이템 타입 정의
interface NavItem {
  path: string;
  label: string;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [isClosing, setIsClosing] = useState(false);

  // 네비게이션 아이템 설정
  const navItems: NavItem[] = [
    { path: '/home', label: '홈' },
    { path: '/center', label: '구리이단상담소' },
    { path: '/ministry', label: '목회자' },
    { path: '/counseling-request', label: '상담 신청' },
  ];

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLinkClick = () => {
    handleClose();
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  const overlayClass = isClosing ? 'animate-fade-out' : 'animate-fade-in';
  const panelClass = isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right';

  return (
    <div className={'fixed inset-0 z-50'}>
      {/* 오버레이 배경 */}
      <div
        className={`absolute inset-0 bg-black/50 ${ overlayClass }`}
        onClick={handleClose}
      />

      {/* 메뉴 패널 */}
      <div
        className={`bg-background absolute right-0 top-0 z-[100] flex h-full w-72 flex-col shadow-lg ${ panelClass }`}
      >
        {/* 헤더 */}
        <div className={'flex items-center justify-between border-b border-gray8 p-4'}>
          <span className={'text-lg font-bold text-main'}>{'메뉴'}</span>
          <button
            onClick={handleClose}
            className={'rounded-full p-2 transition-colors hover:bg-gray9'}
            aria-label={'메뉴 닫기'}
          >
            <X className={'size-5 text-main'} />
          </button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className={'flex flex-1 flex-col gap-1 p-4'}>
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={handleLinkClick}
              className={'rounded-lg px-4 py-3 text-main transition-colors hover:bg-gray9'}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* 하단 액션 버튼들 */}
        <div className={'border-t border-gray8 p-4'}>
          <div className={'flex flex-col gap-2'}>
            {/* 다크 모드 토글 */}
            <button
              onClick={handleToggleTheme}
              className={'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray9'}
            >
              {darkMode ? (
                <Sun className={'size-5 text-main'} />
              ) : (
                <Moon className={'size-5 text-main'} />
              )}
              <span className={'text-main'}>{darkMode ? '라이트 모드' : '다크 모드'}</span>
            </button>

            {/* 알림 */}
            <button
              className={'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray9'}
            >
              <Bell className={'size-5 text-main'} />
              <span className={'text-main'}>{'알림'}</span>
            </button>

            {/* 로그인 */}
            <button
              onClick={() => handleNavigate('/login')}
              className={'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray9'}
            >
              <User className={'size-5 text-main'} />
              <span className={'text-main'}>{'로그인'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
