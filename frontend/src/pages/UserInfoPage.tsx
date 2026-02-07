import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User } from 'lucide-react';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';

function UserInfoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  if (!user) {
    return (
      <div className={'flex min-h-full flex-col items-center justify-center gap-4 p-8'}>
        <p className={'text-gray3'}>{'로그인이 필요합니다.'}</p>
        <button
          type={'button'}
          onClick={() => navigate('/login')}
          className={'rounded-full bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700'}
        >
          {'로그인'}
        </button>
      </div>
    );
  }

  return (
    <div className={'mx-auto max-w-2xl p-6'}>
      <h1 className={'mb-8 text-2xl font-bold text-sub'}>{'사용자 정보'}</h1>

      <div className={'rounded-2xl bg-white p-8 shadow-lg'}>
        <div className={'mb-6 flex items-center gap-4'}>
          <div className={'flex size-16 items-center justify-center rounded-full bg-gray9'}>
            <User className={'size-8 text-main'} />
          </div>
          <div>
            <h2 className={'text-xl font-bold text-sub'}>{user.username}</h2>
            <p className={'text-sm text-gray5'}>{user.userId}</p>
          </div>
        </div>

        <div className={'space-y-4'}>
          <div className={'flex justify-between border-b border-gray8 py-3'}>
            <span className={'font-medium text-gray5'}>{'아이디'}</span>
            <span className={'text-sub'}>{user.userId}</span>
          </div>
          <div className={'flex justify-between border-b border-gray8 py-3'}>
            <span className={'font-medium text-gray5'}>{'이름'}</span>
            <span className={'text-sub'}>{user.username}</span>
          </div>
          {user.nickname && (
            <div className={'flex justify-between border-b border-gray8 py-3'}>
              <span className={'font-medium text-gray5'}>{'닉네임'}</span>
              <span className={'text-sub'}>{user.nickname}</span>
            </div>
          )}
          {user.phone && (
            <div className={'flex justify-between border-b border-gray8 py-3'}>
              <span className={'font-medium text-gray5'}>{'연락처'}</span>
              <span className={'text-sub'}>{user.phone}</span>
            </div>
          )}
          {user.church && (
            <div className={'flex justify-between border-b border-gray8 py-3'}>
              <span className={'font-medium text-gray5'}>{'교회'}</span>
              <span className={'text-sub'}>{user.church}</span>
            </div>
          )}
        </div>

        <div className={'mt-8 flex gap-4'}>
          <button
            type={'button'}
            onClick={handleLogout}
            className={'rounded-full border border-gray5 px-6 py-2 font-semibold text-gray5 transition-colors hover:bg-gray9 hover:text-sub'}
          >
            {'로그아웃'}
          </button>
          <button
            type={'button'}
            onClick={() => navigate('/home')}
            className={'rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700'}
          >
            {'홈으로'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInfoPage;
