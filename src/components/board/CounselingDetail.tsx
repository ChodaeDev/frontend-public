'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ArrowLeft, Pencil, Trash2, Lock, Send } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useTranslation } from '@/i18n/client';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/cn';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface CounselingDetailData {
  id: number;
  title: string;
  content: string;
  userId: string;
  userName: string;
  phone: string;
  counselType: string;
  commentCount: number;
  isPrivate: number;
  createDate: string;
  modifiedDate: string;
}

interface Comment {
  id: number;
  userId: string;
  userName: string;
  content: string;
  isPrivate: number;
  confirm: string;
  createDate: string;
}

interface CounselingDetailProps {
  postId: number;
}

export default function CounselingDetail({ postId }: CounselingDetailProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { dictionary } = useTranslation();
  const t = dictionary.board;
  const user = useAppSelector((state) => state.auth.user);

  const [post, setPost] = useState<CounselingDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noAccess, setNoAccess] = useState(false);

  // 연락처 수정 상태
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [phoneSaving, setPhoneSaving] = useState(false);

  // 삭제 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 댓글 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const isOwner = user && post && (user.userId === post.userId);

  const counselTypeMap: Record<string, string> = {
    self: t.counselTypeSelf || '본인 상담',
    family: t.counselTypeFamily || '가족 상담',
    friend: t.counselTypeFriend || '지인 상담',
    etc: t.counselTypeEtc || '기타 상담',
  };

  // 게시글 상세 조회
  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchApi<CounselingDetailData>(`/api/board/counseling/detail/${ postId }`);
      if (data) setPost(data);
    } catch {
      setError(t.postNotFound || '게시글을 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId, t.postNotFound]);

  // 댓글 목록 조회
  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const { data } = await fetchApi<Comment[]>(`/api/board/counseling/detail/${ postId }/comments`);
      setComments(data || []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  // 비공개 글 접근 권한 확인
  useEffect(() => {
    if (!post) return;
    if (post.isPrivate === 1 && (!user || user.userId !== post.userId)) {
      setNoAccess(true);
    } else {
      setNoAccess(false);
    }
  }, [post, user]);

  // 게시글 삭제
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetchApi(`/api/board/counseling/detail/${ postId }`, { method: 'DELETE' });
      router.push(`/${ locale }/board/counseling`);
    } catch {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 연락처 저장
  const handlePhoneSave = async () => {
    if (!post) return;
    setPhoneSaving(true);
    try {
      await fetchApi(`/api/board/counseling/detail/${ postId }`, {
        method: 'PUT',
        body: JSON.stringify({ ...post, phone: editPhone }),
      });
      setPost({ ...post, phone: editPhone });
      setIsEditingPhone(false);
    } catch {
      // 수정 상태 유지
    } finally {
      setPhoneSaving(false);
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async () => {
    if (!user || !commentText.trim()) return;
    setCommentSubmitting(true);
    try {
      await fetchApi(`/api/board/counseling/detail/${ postId }/comments`, {
        method: 'POST',
        body: JSON.stringify({
          userId: user.userId,
          userName: user.userName,
          content: commentText.trim(),
        }),
      });
      setCommentText('');
      fetchComments();
    } catch {
      // 에러 처리
    } finally {
      setCommentSubmitting(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={'py-20 text-center text-sub'}>
        <span className={'inline-block size-6 border-2 border-gray5 border-t-accent1 rounded-full animate-spin'} />
        <p className={'mt-3 text-sm'}>{t.loading || '불러오는 중...'}</p>
      </div>
    );
  }

  // 에러 상태
  if (error || !post) {
    return (
      <div className={'py-20 text-center'}>
        <p className={'text-sub mb-4'}>{error || t.postNotFound || '게시글을 찾을 수 없습니다.'}</p>
        <Link
          href={`/${ locale }/board/counseling`}
          className={'inline-flex items-center gap-1.5 text-accent1 hover:underline text-sm'}
        >
          <ArrowLeft className={'size-4'} />
          {t.backToList || '목록으로'}
        </Link>
      </div>
    );
  }

  // 비공개 글 접근 불가
  if (noAccess) {
    return (
      <div className={'py-20 text-center'}>
        <Lock className={'size-10 text-gray3 mx-auto mb-4'} />
        <p className={'text-sub mb-4'}>{t.privateNoAccess || '비공개 글입니다. 작성자만 확인할 수 있습니다.'}</p>
        <Link
          href={`/${ locale }/board/counseling`}
          className={'inline-flex items-center gap-1.5 text-accent1 hover:underline text-sm'}
        >
          <ArrowLeft className={'size-4'} />
          {t.backToList || '목록으로'}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 게시글 헤더 */}
      <div className={'border-t-2 border-gray3'}>
        <div className={'border-b border-gray7 px-4 py-5'}>
          <div className={'flex items-start justify-between gap-4'}>
            <h2 className={'text-xl font-bold text-main flex items-center gap-2'}>
              {post.isPrivate === 1 && <Lock className={'size-4 text-gray3 shrink-0'} />}
              {post.title}
            </h2>
          </div>
          <div className={'flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mt-3 text-sm text-sub'}>
            <div>
              <span className={'text-sub'}>{t.counselType || '상담 유형'}{': '}</span>
              <span className={'text-main font-medium'}>{counselTypeMap[post.counselType] || post.counselType}</span>
            </div>
            <div className={'flex items-center gap-2'}>
              <span>{t.createdDate || '작성일'}{': '}{dayjs(post.createDate).format('YYYY.MM.DD HH:mm')}</span>
              {post.modifiedDate && post.modifiedDate !== post.createDate && (
                <span>{t.modifiedDate || '수정일'}{': '}{dayjs(post.modifiedDate).format('YYYY.MM.DD HH:mm')}</span>
              )}
            </div>
          </div>
        </div>

        {/* 게시글 메타 정보 */}
        <div className={'border-b border-gray7 px-4 py-3 bg-gray9/50'}>
          <div className={'flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm'}>
            <span>{t.author || '작성자'}{': '}<span className={'text-main font-medium'}>{post.userName}</span></span>
            <div className={'flex items-center gap-2'}>
              <span className={'text-sub'}>{t.phone || '연락처'}{': '}</span>
              {isEditingPhone ? (
                <span className={'inline-flex items-center gap-1.5'}>
                  <input
                    type={'tel'}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className={'px-2 py-1 border border-gray6 rounded text-sm bg-background text-main w-36 focus:outline-none focus:ring-1 focus:ring-accent1'}
                  />
                  <button
                    onClick={handlePhoneSave}
                    disabled={phoneSaving}
                    className={'px-2.5 py-1 text-xs bg-accent1 text-white rounded hover:bg-accent1/90 transition-colors disabled:opacity-50'}
                  >
                    {phoneSaving ? (t.saving || '저장 중...') : (t.save || '저장')}
                  </button>
                  <button
                    onClick={() => setIsEditingPhone(false)}
                    className={'px-2.5 py-1 text-xs border border-gray5 rounded hover:bg-gray8 transition-colors'}
                  >
                    {t.cancel || '취소'}
                  </button>
                </span>
              ) : (
                <span className={'inline-flex items-center gap-1.5'}>
                  <span className={'text-main font-medium'}>{post.phone}</span>
                  {isOwner && (
                    <button
                      onClick={() => { setEditPhone(post.phone); setIsEditingPhone(true); }}
                      className={'text-accent1 hover:underline text-xs'}
                    >
                      {t.edit || '수정'}
                    </button>
                  )}
                </span>
              )}
            </div>
            {post.isPrivate === 1 && (
              <span className={'inline-flex items-center gap-1 text-gray3'}>
                <Lock className={'size-3.5'} />
                {t.isPrivate || '비공개'}
              </span>
            )}
          </div>
        </div>

        {isOwner && (
          <div className={'w-full flex items-center justify-end gap-2 py-3'}>
            <Link
              href={`/${ locale }/board/counseling/${ postId }/edit`}
              className={'inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-gray5 rounded-lg hover:bg-gray8 transition-colors'}
            >
              <Pencil className={'size-3.5'} />
              {t.edit || '수정'}
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className={'inline-flex items-center gap-1.5 px-4 py-2 text-sm text-error border border-error/30 rounded-lg hover:bg-error/5 transition-colors cursor-pointer'}
            >
              <Trash2 className={'size-3.5'} />
              {t.delete || '삭제'}
            </button>
          </div>
        )}

        {/* 게시글 본문 */}
        <div className={'p-4 min-h-[calc(100vh-600px)] border-b border-gray7'}>
          <div className={'text-main whitespace-pre-wrap leading-relaxed'}>{post.content}</div>
        </div>

        {/* 액션 버튼 */}
        <div className={'flex items-center justify-between px-4 py-4 border-b border-gray7'}>
          <Link
            href={`/${ locale }/board/counseling`}
            className={'inline-flex items-center gap-1.5 text-sm text-sub hover:text-main transition-colors'}
          >
            <ArrowLeft className={'size-4'} />
            {t.backToList || '목록으로'}
          </Link>
        </div>
      </div>

      {/* 댓글 영역 */}
      <div className={'mt-8'}>
        <h3 className={'text-lg font-bold text-main mb-4'}>
          {t.comments || '댓글'} <span className={'text-accent1'}>{'['}{comments.length}{']'}</span>
        </h3>

        {/* 댓글 목록 */}
        {commentsLoading ? (
          <div className={'py-8 text-center text-sub'}>
            <span className={'inline-block size-5 border-2 border-gray5 border-t-accent1 rounded-full animate-spin'} />
          </div>
        ) : comments.length === 0 ? (
          <p className={'py-8 text-center text-sm text-sub'}>{t.commentEmpty || '댓글이 없습니다.'}</p>
        ) : (
          <ul className={'divide-y divide-gray7 border-t border-gray7'}>
            {comments.map((comment) => (
              <li key={comment.id} className={'px-4 py-4'}>
                <div className={'flex items-center gap-2 mb-1.5'}>
                  <span className={'text-sm font-medium text-main'}>{comment.userName}</span>
                  <span className={'text-xs text-sub'}>{dayjs(comment.createDate).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <p className={'text-sm text-main whitespace-pre-wrap'}>{comment.content}</p>
              </li>
            ))}
          </ul>
        )}

        {/* 댓글 작성 */}
        {user ? (
          <div className={'mt-4 border border-gray7 rounded-lg overflow-hidden'}>
            <div className={'flex items-center gap-2 px-4 py-2 bg-gray9/50 border-b border-gray7'}>
              <span className={'text-sm font-medium text-main'}>{user.userName}</span>
            </div>
            <div className={'flex'}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t.commentPlaceholder || '댓글을 입력하세요'}
                rows={3}
                className={'flex-1 px-4 py-3 text-sm bg-background text-main resize-none focus:outline-none placeholder:text-gray4'}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={commentSubmitting || !commentText.trim()}
                className={cn(
                  'self-end m-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
                  'bg-accent1 text-white hover:bg-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed',
                  'inline-flex items-center gap-1.5',
                )}
              >
                <Send className={'size-3.5'} />
                {commentSubmitting ? (t.commentSubmitting || '등록 중...') : (t.commentSubmit || '등록')}
              </button>
            </div>
          </div>
        ) : (
          <p className={'mt-4 py-4 text-center text-sm text-sub border border-gray7 rounded-lg bg-gray9/30'}>
            {t.loginToComment || '댓글을 작성하려면 로그인하세요.'}
          </p>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t.deleteConfirmTitle || '삭제 확인'}
        message={t.deleteConfirmMessage || '정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.'}
        confirmText={deleting ? (t.loading || '불러오는 중...') : (t.delete || '삭제')}
        cancelText={t.cancel || '취소'}
      />
    </div>
  );
}
