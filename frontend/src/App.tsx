import { Outlet } from 'react-router-dom';
import Header from '@/layouts/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect } from 'react';
import { setTheme } from './store/themeSlice';

function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    dispatch(setTheme(darkMode));
  }, [darkMode, dispatch]);

  return (
    <div id={'app'} >
      <div className={'relative h-screen'}>
        <Header />
        <div className={'mt-20 h-[calc(100vh-60px)]'}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
