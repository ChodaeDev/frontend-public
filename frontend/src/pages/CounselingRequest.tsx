import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getAuthHeaders } from '@/utils/api';

type Post = {
  id: number;
  title: string;
  authorId: string;
  regDt: string;
  commentCount: number;
};

const CounselingRequest = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.userId);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate('/login', { replace: true, state: { from: '/counseling/list' } });
      return;
    }
    const fetchList = async () => {
      try {
        const res = await fetch('/api/counseling/list', {
          headers: getAuthHeaders(token),
        });
        const data = await res.json();
        if (res.status === 401 || res.status === 403) {
          navigate('/login', { replace: true });
          return;
        }
        if (data.success && data.data) {
          setPosts(data.data);
        } else {
          setError(data.message ?? '목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError('목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [token, navigate]);

  const formatDate = (dt: string) => {
    if (!dt) return '';
    const d = new Date(dt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={'min-h-[calc(100vh-64px)] w-full bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-5xl px-4'}>
        <div className={'mb-8 flex flex-col items-center'}>
          <h2 className={'mb-2 text-3xl font-extrabold'}>{'상담 요청'}</h2>
          <div className={'mb-4 h-1 w-28 bg-black'} />
        </div>

        <div className={'mx-auto max-w-4xl'}>
          <h3 className={'mb-4 text-xl font-bold'}>{'상담 신청 글 확인'}</h3>
          {loading ? (
            <div className={'py-12 text-center text-gray-500'}>{'로딩 중...'}</div>
          ) : error ? (
            <div className={'py-12 text-center text-red-500'}>{error}</div>
          ) : (
            <div className={'overflow-hidden border border-gray-200 bg-white'}>
              <div className={'grid grid-cols-[4rem_1fr_8rem_6.5rem] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-700'}>
                <span>{'번호'}</span>
                <span>{'제목'}</span>
                <span>{'아이디'}</span>
                <span>{'작성 일자'}</span>
              </div>
              {posts.length === 0 ? (
                <div className={'py-8 text-center text-gray-500'}>{'등록된 상담 신청 글이 없습니다.'}</div>
              ) : (
                <ul className={'divide-y divide-gray-200'}>
                  {posts.map((post) => {
                    const isAuthor = post.authorId === currentUserId;
                    return (
                      <li
                        key={post.id}
                        className={'grid grid-cols-[4rem_1fr_8rem_6.5rem] gap-4 px-4 py-3 text-center text-sm'}
                      >
                        <span className={'text-gray-600'}>{post.id}</span>
                        {isAuthor ? (
                          <button
                            type={'button'}
                            onClick={() => navigate(`/counseling/detail/${post.id}`)}
                            className={'flex min-w-0 items-center justify-center gap-1 font-medium text-gray-900 hover:underline focus:outline-none'}
                          >
                            <span className={'min-w-0 truncate'}>{post.title}</span>
                            {(post.commentCount ?? 0) > 0 && (
                              <span className={'shrink-0 text-blue-600'}>[{post.commentCount}]</span>
                            )}
                          </button>
                        ) : (
                          <span className={'flex min-w-0 items-center justify-center gap-1 font-medium text-gray-500'}>
                            <span className={'min-w-0 truncate'}>{post.title}</span>
                            {(post.commentCount ?? 0) > 0 && (
                              <span className={'shrink-0 text-blue-600'}>[{post.commentCount}]</span>
                            )}
                          </span>
                        )}
                        <span className={'text-gray-600'}>{post.authorId || '-'}</span>
                        <span className={'text-gray-600'}>{formatDate(post.regDt)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          <button
            type={'button'}
            onClick={() => navigate('/counseling/form')}
            className={'mt-6 w-full rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'}
          >
            {'상담 신청하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounselingRequest;
