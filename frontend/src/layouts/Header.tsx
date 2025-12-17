
import { FaBell, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import VisitorCounter from '../components/VisitorCounter';

function Header() {
  const navigate = useNavigate();

  return (
    <header className={'border-gray-2 bg-background w-full border-b'}>
      <div className={'mx-auto flex h-[60px] w-full max-w-[1200px] items-center justify-between'}>
        <div className={'flex w-[240px] flex-col justify-center'}>
          <span className={'text-2xl font-extrabold leading-tight text-main'}>{'구리이단상담소'}</span>
          <span className={'text-xs font-semibold text-gray5'}>{'신천지 관련 전문 상담'}</span>
        </div>

        <Navigation />

        <div className={'flex w-[240px] items-center space-x-6'}>
          <VisitorCounter />
          <button className={'text-gray-600 hover:text-black focus:outline-none'}>
            <FaBell size={22} />
          </button>
          <button
            className={'text-gray-600 hover:text-black focus:outline-none'}
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