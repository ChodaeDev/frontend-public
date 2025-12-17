import { Link } from 'react-router-dom';

// 네비게이션 아이템 타입 정의
interface NavItem {
  path: string;
  label: string;
};

function Navigation() {
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
    </nav>
  );
}

export default Navigation;
