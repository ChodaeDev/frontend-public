import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// nginx를 통해 접근 (포트 80) 또는 개발 환경에서는 직접 백엔드 접근
const API_BASE_URL = window.location.origin.includes('localhost:5173') 
  ? 'http://localhost:8080'  // 개발 환경 (Vite dev server)
  : '';  // 프로덕션 환경 (nginx를 통해 접근)

function SignUpPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    userId: '',
    username: '',
    password: '',
    nickname: '',
    phone: '',
    church: '',
    birthday: '',
    descr: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${ API_BASE_URL }/api/public/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
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
          // 403 등의 에러는 보통 JSON 응답이 있으므로, 여기 도달했다면 예상치 못한 상황
          throw new Error(`서버 오류 (${response.status}): ${response.statusText || '알 수 없는 오류'}`);
        }
      }

      // 응답이 성공이 아니거나 data.success가 false인 경우
      if (!response.ok) {
        // 서버에서 보낸 에러 메시지가 있으면 사용, 없으면 기본 메시지
        throw new Error(data?.message || `서버 오류 (${response.status}): ${response.statusText || '알 수 없는 오류'}`);
      }

      if (!data.success) {
        throw new Error(data.message ?? '회원가입에 실패했습니다.');
      }

      setSuccessMessage('회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      // 네트워크 에러 처리
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요. (http://localhost:8080)');
      } else {
        setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={'flex h-full items-center justify-center bg-gradient-to-tl from-purple-100 via-white to-blue-100'}>
      <div className={'w-full max-w-2xl rounded-3xl bg-white p-10 shadow-2xl'}>
        <h1 className={'mb-2 text-center text-3xl font-bold text-gray-900'}>{'회원가입'}</h1>
        <p className={'mb-8 text-center text-sm text-gray-500'}>
          {'아래 정보를 입력하여 회원가입을 완료해주세요.'}
        </p>

        <form onSubmit={handleSubmit} className={'grid grid-cols-1 gap-6 md:grid-cols-2'}>
          <div className={'md:col-span-1'}>
            <label htmlFor={'userId'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'아이디 *'}
            </label>
            <input
              id={'userId'}
              name={'userId'}
              value={formValues.userId}
              onChange={handleChange}
              required
              placeholder={'사용할 아이디를 입력하세요'}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
          </div>

          <div className={'md:col-span-1'}>
            <label htmlFor={'password'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'비밀번호 *'}
            </label>
            <input
              id={'password'}
              name={'password'}
              type={'password'}
              value={formValues.password}
              onChange={handleChange}
              required
              placeholder={'비밀번호를 입력하세요'}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
          </div>

          <div className={'md:col-span-1'}>
            <label htmlFor={'username'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'이름 *'}
            </label>
            <input
              id={'username'}
              name={'username'}
              value={formValues.username}
              onChange={handleChange}
              required
              placeholder={'이름을 입력하세요'}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
          </div>

          <div className={'md:col-span-1'}>
            <label htmlFor={'nickname'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'닉네임'}
            </label>
            <input
              id={'nickname'}
              name={'nickname'}
              value={formValues.nickname}
              onChange={handleChange}
              placeholder={'닉네임을 입력하세요'}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
          </div>

          <div className={'md:col-span-1'}>
            <label htmlFor={'phone'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'전화번호 *'}
            </label>
            <input
              id={'phone'}
              name={'phone'}
              value={formValues.phone}
              onChange={handleChange}
              required
              placeholder={'예: 010-1234-5678'}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
          </div>

          <div className={'md:col-span-1'}>
            <label htmlFor={'church'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'교회명'}
            </label>
            <input
              id={'church'}
              name={'church'}
              value={formValues.church}
              onChange={handleChange}
              placeholder={'출석 중인 교회명을 입력하세요'}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
          </div>

          <div className={'md:col-span-1'}>
            <label htmlFor={'birthday'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'생년월일'}
            </label>
            <input
              id={'birthday'}
              name={'birthday'}
              type={'date'}
              value={formValues.birthday}
              onChange={handleChange}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
          </div>

          <div className={'md:col-span-2'}>
            <label htmlFor={'descr'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'소개 및 비고'}
            </label>
            <textarea
              id={'descr'}
              name={'descr'}
              value={formValues.descr}
              onChange={handleChange}
              placeholder={'상담 요청 사유 등 추가 정보를 입력하세요'}
              rows={4}
              className={'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
            <p className={'mt-1 text-xs text-gray-400'}>{'선택 사항입니다.'}</p>
          </div>

          {error && (
            <div className={'rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 md:col-span-2'}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className={'rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 md:col-span-2'}>
              {successMessage}
            </div>
          )}

          <div className={'md:col-span-2'}>
            <button
              type={'submit'}
              disabled={loading}
              className={'w-full rounded-full bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed disabled:bg-purple-300'}
            > 
              {loading ? '회원가입 중...' : '회원가입 완료'}
            </button>
          </div>
        </form>

        <div className={'mt-6 text-center text-sm text-gray-500'}>
          {'이미 가입하셨나요?'}{' '}
          <button
            type={'button'}
            onClick={() => navigate('/login')}
            className={'font-semibold text-purple-600 hover:underline'}
          >
            {'로그인'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;

