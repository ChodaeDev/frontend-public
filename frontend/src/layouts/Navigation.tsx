import { Link, useMatch } from 'react-router-dom';

// 네비게이션 아이템 타입 정의
interface NavItem {
  path: string;
  label: string;
};

function Navigation() {
  // 네비게이션 아이템 설정
  const navItems: NavItem[] = [
    { path: '/home', label: '홈' },
    { path: '/counseling-info', label: '상담소 안내' },
    { path: '/pastor-shin', label: '신현욱 목사' },
    { path: '/shincheonji-info', label: '신천지 정보' },
    { path: '/counseling-request', label: '상담 요청' },
    { path: '/doctrine-certification', label: '교리반증' },
    { path: '/prevention-guide', label: '피해예방' },
    { path: '/withdrawal-cases', label: '탈퇴사례' },
    { path: '/login', label: '로그인' },
    { path: '/signup', label: '회원가입' },
  ];

  // 각 경로에 대한 매치 상태 확인
  const matchHome = useMatch('/home');
  const matchCounselingInfo = useMatch('/counseling-info');
  const matchPastorShin = useMatch('/pastor-shin');
  const matchShincheonjiInfo = useMatch('/shincheonji-info');
  const matchCounselingRequest = useMatch('/counseling-request');
  const matchDoctrineCertification = useMatch('/doctrine-certification');
  const matchPreventionGuide = useMatch('/prevention-guide');
  const matchWithdrawalCases = useMatch('/withdrawal-cases');
  const matchLogin = useMatch('/login');
  const matchSignup = useMatch('/signup');

  return (
    <nav className="flex items-center overflow-x-auto scrollbar-hide">
      <div className="flex items-center space-x-6 min-w-max">
        {navItems.map(({ path, label }) => {
          let isActive = false;
          if (path === '/home') isActive = !!matchHome;
          if (path === '/counseling-info') isActive = !!matchCounselingInfo;
          if (path === '/pastor-shin') isActive = !!matchPastorShin;
          if (path === '/shincheonji-info') isActive = !!matchShincheonjiInfo;
          if (path === '/counseling-request') isActive = !!matchCounselingRequest;
          if (path === '/doctrine-certification') isActive = !!matchDoctrineCertification;
          if (path === '/prevention-guide') isActive = !!matchPreventionGuide;
          if (path === '/withdrawal-cases') isActive = !!matchWithdrawalCases;
          if (path === '/login') isActive = !!matchLogin;
          if (path === '/signup') isActive = !!matchSignup;
          
          return (
            <Link
              key={path}
              to={path}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;
