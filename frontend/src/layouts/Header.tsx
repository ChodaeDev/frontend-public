
import { FaBell, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import VisitorCounter from '../components/VisitorCounter';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* 로고/타이틀 */}
        <div className="mr-8 min-w-[220px] flex flex-col justify-center">
          <span className="text-2xl font-extrabold leading-tight text-black">{'신천지 문제'}</span>
          <span className="text-xs font-semibold text-gray-500">{'구리이단상담소'}</span>
        </div>
        {/* 네비게이션 */}
        <nav className="flex-1">
          <Navigation />
        </nav>
        {/* 우측 아이콘 */}
        <div className="ml-8 flex items-center space-x-6">
          <VisitorCounter />
          <button className="text-gray-600 hover:text-black focus:outline-none">
            <FaBell size={22} />
          </button>
          <button
            className="text-gray-600 hover:text-black focus:outline-none"
            onClick={() => navigate('/login')}
          >
            <FaUser size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;