import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { RootState } from '@/store';
import { toggleTheme } from '@/store/themeSlice';

interface ThemeToggleButtonProps {
  showLabel?: boolean;
  className?: string;
}

function ThemeToggleButton({ showLabel = false, className = '' }: ThemeToggleButtonProps) {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggleTheme}
      className={`flex items-center gap-3 rounded-full p-2 transition-colors hover:bg-gray9 ${ className }`}
      aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {darkMode ? (
        <Sun className={'size-5 text-main'} />
      ) : (
        <Moon className={'size-5 text-main'} />
      )}
      {showLabel && (
        <span className={'text-main'}>{darkMode ? '라이트 모드' : '다크 모드'}</span>
      )}
    </button>
  );
}

export default ThemeToggleButton;

