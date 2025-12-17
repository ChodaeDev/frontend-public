import { Link } from 'react-router-dom';
import { navItems } from '@/constants/navigation';
import ThemeToggleButton from '@/components/ui/header/ThemeToggleButton';
import NotificationButton from '@/components/ui/header/NotificationButton';
import UserButton from '@/components/ui/header/UserButton';

function PcNav() {
  return (
    <div className={'hidden items-center gap-6 sm:flex'}>
      {/* 네비게이션 링크들 */}
      <nav className={'flex items-center gap-6'}>
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={'text-main transition-colors hover:text-gray3'}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* 액션 버튼들: ThemeToggle → Bell → User */}
      <div className={'flex items-center gap-2'}>
        <ThemeToggleButton />
        <NotificationButton />
        <UserButton />
      </div>
    </div>
  );
}

export default PcNav;

