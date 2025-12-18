import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

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
    desc: '',
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

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? '회원가입에 실패했습니다.');
      }

      setSuccessMessage('회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
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
            <label htmlFor={'desc'} className={'mb-1 block text-sm font-medium text-gray-700'}>
              {'소개 및 비고'}
            </label>
            <textarea
              id={'desc'}
              name={'desc'}
              value={formValues.desc}
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

