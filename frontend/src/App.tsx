import { Outlet } from 'react-router-dom';
import Header from '@/layouts/Header';

function App() {
  return (
    <div id={'app'} >
      <div className={'relative grid h-screen grid-rows-[50px,1fr]'}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
