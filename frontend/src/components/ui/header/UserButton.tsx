import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface UserButtonProps {
  showLabel?: boolean;
  className?: string;
  onNavigate?: () => void;
}

function UserButton({ showLabel = false, className = '', onNavigate }: UserButtonProps) {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user != null);

  const handleClick = () => {
    if (isLoggedIn) {
      navigate('/user-info');
    } else {
      navigate('/login');
    }
    onNavigate?.();
  };

  return (
    <button
      type={'button'}
      onClick={handleClick}
      className={`flex items-center gap-3 p-2 transition-colors hover:bg-gray9 focus:outline-none ${className}`}
      aria-label={isLoggedIn ? '사용자 정보' : '로그인'}
    >
      {isLoggedIn ? (
        <>
          <User className={'size-5 text-main'} />
          {showLabel && <span className={'text-main'}>{'내 정보'}</span>}
        </>
      ) : (
        <span className={'text-main font-medium'}>{'로그인'}</span>
      )}
    </button>
  );
}

export default UserButton;
