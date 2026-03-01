import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getAuthHeaders } from '@/utils/api';

const CounselingRequestForm = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true, state: { from: '/counseling/form' } });
    }
  }, [token, navigate]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    authorName: '',
    phone: '',
    counselType: '',
    title: '',
    content: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formValues.authorName.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!formValues.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!token) {
      setError('로그인이 필요합니다.');
      navigate('/login', { replace: true });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/counseling/form', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          title: formValues.title.trim(),
          content: formValues.content,
          authorId: user?.userId ?? '',
          authorName: formValues.authorName,
          phone: formValues.phone,
          counselType: formValues.counselType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/counseling/list');
      } else {
        setError(data.message ?? '상담 신청에 실패했습니다.');
      }
    } catch {
      setError('상담 신청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={'min-h-[calc(100vh-64px)] w-full bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-xl px-4'}>
        <div className={'rounded-xl bg-white p-8 shadow-lg'}>
          <div className={'mb-6 flex items-center justify-between'}>
            <h2 className={'text-2xl font-bold'}>{'상담 신청'}</h2>
            <button
              type={'button'}
              onClick={() => navigate('/counseling/list')}
              className={'rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700'}
            >
              {'목록'}
            </button>
          </div>
          <form onSubmit={handleSubmit} className={'space-y-4'}>
            {error && (
              <div className={'rounded-md bg-red-50 px-3 py-2 text-sm text-red-600'}>{error}</div>
            )}
            <div>
              <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                {'제목 *'}
              </label>
              <input
                type={'text'}
                name={'title'}
                value={formValues.title}
                onChange={handleChange}
                className={'w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                placeholder={'제목을 입력하세요'}
                required
              />
            </div>

            <div>
              <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                {'내용'}
              </label>
              <textarea
                name={'content'}
                value={formValues.content}
                onChange={handleChange}
                rows={4}
                className={'w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                placeholder={'상담 내용을 간단히 작성해 주세요'}
              />
            </div>

            <div>
              <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                {'이름 *'}
              </label>
              <input
                type={'text'}
                name={'authorName'}
                value={formValues.authorName}
                onChange={handleChange}
                className={'w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                placeholder={'이름을 입력하세요'}
                required
              />
            </div>

            <div>
              <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                {'연락처 *'}
              </label>
              <input
                type={'tel'}
                name={'phone'}
                value={formValues.phone}
                onChange={handleChange}
                className={'w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                placeholder={'연락처를 입력하세요'}
                required
              />
            </div>

            <div>
              <label className={'mb-2 block text-sm font-medium text-gray-700'}>
                {'상담 유형'}
              </label>
              <select
                name={'counselType'}
                value={formValues.counselType}
                onChange={handleChange}
                className={'w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'}
              >
                <option value={''}>{'상담 유형을 선택하세요'}</option>
                <option value={'신천지 피해 가족 상담'}>{'신천지 피해 가족 상담'}</option>
                <option value={'탈퇴 지원 상담'}>{'탈퇴 지원 상담'}</option>
                <option value={'기타 이단 상담'}>{'기타 이단 상담'}</option>
              </select>
            </div>

            <button
              type={'submit'}
              disabled={loading}
              className={'w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300'}
            >
              {loading ? '등록 중...' : '상담 신청하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounselingRequestForm;
