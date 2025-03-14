
import Navigation from './Navigation';

function Header() {
  return (
    <div className={'grid grid-cols-[60px,1fr] items-center bg-main'}>
      <div className={'text-white'}>{'초대교회'}</div>
      <Navigation />
    </div>
  );
}

export default Header;