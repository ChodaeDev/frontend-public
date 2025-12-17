import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { RootState } from '@/store';
import { toggleTheme } from '@/store/themeSlice';

// 네비게이션 아이템 타입 정의
interface NavItem {
  path: string;
  label: string;
};

function Navigation() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // 네비게이션 아이템 설정
  const navItems: NavItem[] = [
    { path: '/home', label: '홈' },
    { path: '/center', label: '구리이단상담소' },
    { path: '/ministry', label: '목회자' },
    { path: '/counseling-request', label: '상담 신청' },
    // { path: '/shincheonji', label: '신천지 정보' },
    // { path: '/apologetics', label: '교리반증' },
    // { path: '/prevention', label: '피해예방' },
    // { path: '/cases', label: '탈퇴사례' },
  ];

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className={'flex items-center gap-6'}>
      {navItems.map(({ path, label }) => {
        return (
          <Link
            key={path}
            to={path}
            className={''}
          >
            {label}
          </Link>
        );
      })}
      <button
        onClick={handleToggleTheme}
        className={'ml-4 rounded-full p-2 transition-colors hover:bg-gray9'}
        aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {darkMode ? (
          <Sun className={'size-5 text-main'} />
        ) : (
          <Moon className={'size-5 text-main'} />
        )}
      </button>
    </nav>
  );
}

export default Navigation;
