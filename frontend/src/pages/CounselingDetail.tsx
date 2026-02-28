import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const API_BASE_URL = '';

type Post = {
  id: number;
  title: string;
  content: string;
  authorName: string;
  regDt: string;
};

type Comment = {
  id: number;
  content: string;
  authorName: string;
};

const CounselingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/public/counseling/detail/${id}`),
        fetch(`${API_BASE_URL}/api/public/counseling/detail/${id}/comments`),
      ]);
      const postData = await postRes.json();
      const commentsData = await commentsRes.json();
      if (postData.success && postData.data) setPost(postData.data);
      if (commentsData.success && commentsData.data) setComments(commentsData.data);
    } catch {
      setError('글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleSubmitComment = async () => {
    if (!id || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/counseling/detail/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: user?.userId ?? '',
          authorName: user?.username ?? '익명',
          content: comment.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComment('');
        fetchDetail();
      } else {
        setError(data.message ?? '댓글 등록에 실패했습니다.');
      }
    } catch {
      setError('댓글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dt: string) => {
    if (!dt) return '';
    const d = new Date(dt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={'flex min-h-[calc(100vh-64px)] items-center justify-center'}>
        <p className={'text-gray-500'}>{'로딩 중...'}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={'min-h-[calc(100vh-64px)] w-full bg-gray-50 py-12'}>
        <div className={'mx-auto max-w-2xl px-4'}>
          <p className={'text-gray-500'}>{error ?? '글이 없거나 잘못된 경로입니다.'}</p>
          <button
            type={'button'}
            onClick={() => navigate('/counseling/list')}
            className={'mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700'}
          >
            {'목록'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={'min-h-[calc(100vh-64px)] w-full bg-gray-50 py-12'}>
      <div className={'mx-auto max-w-2xl px-4'}>
        <div className={'rounded-xl border border-gray-200 bg-white p-8'}>
          <div className={'mb-6 flex items-center justify-between border-b border-gray-200 pb-4'}>
            <h2 className={'text-xl font-bold'}>{post.title}</h2>
            <button
              type={'button'}
              onClick={() => navigate('/counseling/list')}
              className={'rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700'}
            >
              {'목록'}
            </button>
          </div>
          <div className={'mb-4 flex gap-4 text-sm text-gray-500'}>
            <span>{'작성자 '}<strong className={'text-gray-700'}>{post.authorName}</strong></span>
            <span>{'작성일자 '}<strong className={'text-gray-700'}>{formatDate(post.regDt)}</strong></span>
          </div>
          <div className={'mb-6 whitespace-pre-wrap text-gray-700'}>{post.content || ''}</div>

          {error && (
            <div className={'mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600'}>{error}</div>
          )}

          {comments.length > 0 && (
            <div className={'mb-6 border-t border-gray-200 pt-6'}>
              <h4 className={'mb-3 text-sm font-semibold text-gray-700'}>{`댓글 ${comments.length}개`}</h4>
              <ul className={'space-y-3'}>
                {comments.map((c) => (
                  <li key={c.id} className={'rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700'}>
                    {c.content}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={'border-t border-gray-200 pt-6'}>
            <label htmlFor={'comment'} className={'mb-2 block text-sm font-medium text-gray-700'}>
              {'댓글'}
            </label>
            <textarea
              id={'comment'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={'댓글을 입력하세요'}
              rows={4}
              className={'mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'}
            />
            <button
              type={'button'}
              onClick={() => setComment('')}
              className={'rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200'}
            >
              {'취소'}
            </button>
            <button
              type={'button'}
              onClick={handleSubmitComment}
              disabled={!comment.trim() || submitting}
              className={'ml-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300'}
            >
              {submitting ? '등록 중...' : '댓글 등록'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingDetail;
