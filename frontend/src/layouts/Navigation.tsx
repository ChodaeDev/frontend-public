import { Link, useMatch } from 'react-router-dom';

// 네비게이션 아이템 타입 정의
interface NavItem {
  path: string;
  label: string;
};

function Navigation() {
  // 네비게이션 아이템 설정
  const navItems: NavItem[] = [
    { path: '/counseling-info', label: '상담소 안내' },
    { path: '/pastor-shin', label: '신현욱 목사' },
    { path: '/shincheonji-info', label: '신천지 정보' },
    { path: '/counseling-request', label: '상담 및 세미나 요청' },
  ];

  // 각 경로에 대한 매치 상태 확인
  const matchCounselingInfo = useMatch('/counseling-info');
  const matchPastorShin = useMatch('/pastor-shin');
  const matchShincheonjiInfo = useMatch('/shincheonji-info');
  const matchCounselingRequest = useMatch('/counseling-request');

  return (
    <nav className="flex items-center space-x-8">
      {navItems.map(({ path, label }) => {
        let isActive = false;
        if (path === '/counseling-info') isActive = !!matchCounselingInfo;
        if (path === '/pastor-shin') isActive = !!matchPastorShin;
        if (path === '/shincheonji-info') isActive = !!matchShincheonjiInfo;
        if (path === '/counseling-request') isActive = !!matchCounselingRequest;
        
        return (
          <Link
            key={path}
            to={path}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default Navigation;
