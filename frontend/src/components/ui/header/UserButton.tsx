import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserButtonProps {
  showLabel?: boolean;
  className?: string;
  onNavigate?: ()=> void;
}

function UserButton({ showLabel = false, className = '', onNavigate }: UserButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
    onNavigate?.();
  };

  return (
    <button
      type={'button'}
      onClick={handleClick}
      className={`flex items-center gap-3 p-2 transition-colors hover:bg-gray9 focus:outline-none ${ className }`}
      aria-label={'로그인'}
    >
      <User className={'size-5 text-main'} />
      {showLabel && (
        <span className={'text-main'}>{'로그인'}</span>
      )}
    </button>
  );
}

export default UserButton;

