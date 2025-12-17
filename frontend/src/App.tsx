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
      <div className={'relative grid h-screen grid-rows-[60px,1fr]'}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
