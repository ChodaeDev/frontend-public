import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// nginx를 통해 접근 (포트 80) 또는 개발 환경에서는 직접 백엔드 접근
// 포트 5173은 Vite dev 서버 (개발 환경)
const isDev = window.location.port === '5173' || window.location.origin.includes('localhost:5173');
// 개발 환경: Vite proxy를 통해 /api 요청이 백엔드로 전달됨 (빈 문자열 = 상대 경로)
// 프로덕션 환경: nginx를 통해 접근 (빈 문자열 = 상대 경로)
const API_BASE_URL = '';

function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${ API_BASE_URL }/api/public/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          password,
        }),
      });

      // 응답 본문이 비어있는지 확인 후 JSON 파싱
      const text = await response.text();
      let data;
      
      if (text && text.trim()) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new Error('서버 응답을 파싱할 수 없습니다.');
        }
      } else {
        // 응답이 비어있지만 상태 코드가 200-299 범위면 성공으로 간주
        if (response.ok) {
          throw new Error('서버에서 응답이 없습니다. 서버가 정상적으로 실행 중인지 확인해주세요.');
        } else {
          throw new Error(`서버 오류 (${response.status}): ${response.statusText}`);
        }
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? '로그인에 실패했습니다.');
      }

      setSuccessMessage(`${ data.data.username }님 환영합니다!`);
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (err) {
      // 네트워크 에러 처리
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요. (http://localhost:8080)');
      } else {
        setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={'flex h-full items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-purple-100'}>
      <div className={'w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl'}>
        <h1 className={'mb-2 text-center text-3xl font-bold text-gray-900'}>{'로그인'}</h1>
        <p className={'mb-8 text-center text-sm text-gray-500'}>
          {'회원정보가 없다면 아래 링크에서 회원가입을 진행해주세요.'}
        </p>

        <form onSubmit={handleSubmit} className={'space-y-6'}>
          <div>
            <label htmlFor={'userId'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'아이디'}
            </label>
            <input
              id={'userId'}
              name={'userId'}
              type={'text'}
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder={'아이디를 입력하세요'}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
              required
            />
          </div>

          <div>
            <label htmlFor={'password'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'비밀번호'}
            </label>
            <input
              id={'password'}
              name={'password'}
              type={'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={'비밀번호를 입력하세요'}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
              required
            />
          </div>

          {error && (
            <div className={'rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600'}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className={'rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600'}>
              {successMessage}
            </div>
          )}

          <button
            type={'submit'}
            disabled={loading}
            className={'w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-black shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-black'}
          >
            {'로그인'}
          </button>
        </form>

        <div className={'mt-6 text-center text-sm text-gray-500'}>
          {'아직 회원가입을 하지 않으셨나요?'}{' '}
          <button
            type={'button'}
            onClick={() => navigate('/signup')}
            className={'font-semibold text-blue-600 hover:underline'}
          >
            {'회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

