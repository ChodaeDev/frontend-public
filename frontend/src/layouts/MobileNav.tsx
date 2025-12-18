import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { navItems } from '@/constants/navigation';
import ThemeToggleButton from '@/components/ui/header/ThemeToggleButton';
import NotificationButton from '@/components/ui/header/NotificationButton';
import UserButton from '@/components/ui/header/UserButton';

interface MobileNavProps {
  isOpen: boolean;
  onClose: ()=> void;
}

function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

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
        className={`absolute right-0 top-0 flex h-full w-72 flex-col bg-background shadow-lg ${ panelClass }`}
      >
        {/* 헤더 */}
        <div className={'flex h-[60px] items-center justify-between border-b border-gray8 bg-background-secondary p-4'}>
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
              onClick={handleClose}
              className={'rounded-lg px-4 py-3 text-main transition-colors hover:bg-gray9'}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* 하단 액션 버튼들 */}
        <div className={'border-t border-gray8 p-4'}>
          <div className={'flex flex-col gap-2'}>
            <ThemeToggleButton showLabel className={'rounded-lg px-4 py-3'} />
            <NotificationButton showLabel className={'rounded-lg px-4 py-3'} />
            <UserButton showLabel className={'rounded-lg px-4 py-3'} onNavigate={handleClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;

