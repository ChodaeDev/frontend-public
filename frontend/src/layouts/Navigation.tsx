import { LucideIcon } from 'lucide-react';
import { SquareUserRound, Map } from 'lucide-react';
import { Link, useMatch } from 'react-router-dom';

// 네비게이션 아이템 타입 정의
interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
};

function Navigation() {
  // 네비게이션 아이템 설정
  const navItems: NavItem[] = [
    { path: '/', icon: SquareUserRound, label: 'Main' },
    { path: '/second', icon: Map, label: 'Second' },
  ];

  const matchHome = useMatch('/');
  const matchOlmap = useMatch('/second');
  const matches = [matchHome, matchOlmap];

  return (
    <div className={'flex items-center justify-center gap-2'}>
      {navItems.map(({ path, icon: Icon, label }, index) => (
        <Link
          key={path}
          to={path}
          className={'border border-white w-20 flex items-center justify-center rounded-md h-10'
            + (matches[index] ? ' bg-blue text-light' : '')
          }
        >
          <Icon className={'text-light'} width={'20'} height={'20'} />
          <div className={'m-[2px] text-[12px] font-bold text-light'}>{label}</div>
        </Link>
      ))}
    </div>
  );
}

export default Navigation;
