'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import { createPortal } from 'react-dom';
import { ArrowLeft, Pencil, Trash2, Lock, Send, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useTranslation } from '@/i18n/client';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/cn';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { CounselingDetailData, Comment } from '@/types/board';

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

  // 게시글 삭제 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 댓글 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // 댓글 수정 상태
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // 댓글 삭제 상태
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [commentDeleting, setCommentDeleting] = useState(false);

  const isAdmin = user?.userId === 'admin';
  const isOwner = user && post && (isAdmin || user.userId === post.userId);

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

  // error 또는 post 없을 때 이전 페이지로 이동
  useEffect(() => {
    if(!user || user.userId !== 'admin') return;
    if (!loading && (error || !post)) {
      alert(error || t.postNotFound || '게시글을 찾을 수 없습니다.');
      router.replace(`/${ locale }/board/counseling`);
    }
  }, [loading, error, post, router, t.postNotFound, locale, user]);

  // 비공개 글 접근 권한 확인
  useEffect(() => {
    if (!post) return;
    if (post.isPrivate === 1 && (!user || (user.userId !== 'admin' && user.userId !== post.userId))) {
      setNoAccess(true);
    } else {
      setNoAccess(false);
    }
  }, [post, user]);

  // 게시글 삭제
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetchApi(`/api/board/counseling/delete/${ postId }`, { method: 'DELETE' });
      router.push(`/${ locale }/board/counseling`);
    } catch {
      setDeleting(false);
      setShowDeleteModal(false);
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

  // 댓글 수정 모달 열기
  const handleOpenEditModal = (comment: Comment) => {
    setEditingComment(comment);
    setEditCommentText(comment.content);
  };

  // 댓글 수정 제출
  const handleCommentEditSubmit = async () => {
    if (!editingComment || !editCommentText.trim()) return;
    setEditSubmitting(true);
    try {
      await fetchApi(`/api/board/counseling/detail/${ postId }/comments/${ editingComment.id }`, {
        method: 'PUT',
        body: JSON.stringify({
          userId: user!.userId,
          userName: user!.userName,
          content: editCommentText.trim(),
        }),
      });
      setEditingComment(null);
      setEditCommentText('');
      fetchComments();
    } catch {
      // 에러 처리
    } finally {
      setEditSubmitting(false);
    }
  };

  // 댓글 삭제 확인
  const handleCommentDeleteConfirm = async () => {
    if (deletingCommentId === null) return;
    setCommentDeleting(true);
    try {
      await fetchApi(`/api/board/counseling/detail/${ postId }/comments/${ deletingCommentId }`, {
        method: 'DELETE',
      });
      setDeletingCommentId(null);
      fetchComments();
    } catch {
      // 에러 처리
    } finally {
      setCommentDeleting(false);
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

  // error/!post는 useEffect에서 alert + router.back() 처리
  if (!post) {
    return null;
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
      <div className={'border-t border-gray5'}>
        <div className={'border-b border-gray7 mt-8 px-2 pb-2'}>
          <div className={'flex items-start justify-between gap-4'}>
            <h2 className={'text-xl font-bold text-main flex items-center gap-2'}>
              {post.isPrivate === 1 && <Lock className={'size-4 text-gray3 shrink-0'} />}
              {post.title}
            </h2>
          </div>
          <div className={'flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-sm gap-1'}>
            <div>
              <span className={'text-gray1'}>{t.counselType || '상담 유형'}{': '}</span>
              <span className={'text-main font-medium'}>{counselTypeMap[post.counselType] || post.counselType}</span>
            </div>
            <div className={'flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray1'}>
              <span>{t.createdDate || '작성'}{': '}{dayjs(post.createDate).format('YYYY.MM.DD HH:mm')}</span>
              {post.modifiedDate && post.modifiedDate !== post.createDate && (
                <span>{t.modifiedDate || '수정'}{': '}{dayjs(post.modifiedDate).format('YYYY.MM.DD HH:mm')}</span>
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
              <span className={'inline-flex items-center gap-1.5'}>
                <span className={'text-main font-medium'}>{post.phone}</span>
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className={'w-full flex items-center gap-2 py-3'}>
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
        <div className={'p-4 min-h-[calc(100vh-600px)]'}>
          <div className={'text-main whitespace-pre-wrap leading-relaxed'}>{post.content}</div>
        </div>
      </div>

      {/* 댓글 영역 */}
      <div className={'pt-8 border-t border-gray7'}>
        <h3 className={'text-lg font-bold text-gray3 mb-4'}>
          {t.comments || '댓글'} <span className={'text-accent1'}>{'['}{comments.length}{']'}</span>
        </h3>

        {/* 댓글 목록 */}
        {commentsLoading ? (
          <div className={'py-8 text-center text-sub'}>
            <span className={'inline-block size-5 border-2 border-gray9 border-t-accent1 rounded-full animate-spin'} />
          </div>
        ) : comments.length === 0 ? (
          <p className={'py-8 text-center text-sm text-sub'}>{t.commentEmpty || '댓글이 없습니다.'}</p>
        ) : (
          <ul className={'divide-y divide-gray9 border-t border-gray9'}>
            {comments.map((comment) => {
              const canEdit = user?.userId === comment.userId;
              const canDelete = isAdmin || user?.userId === comment.userId;
              return (
                <li key={comment.id} className={'px-4 py-4'}>
                  <div className={'flex items-start justify-between gap-2'}>
                    <div className={'flex-1 min-w-0'}>
                      <div className={'flex items-center gap-2 mb-1.5'}>
                        <span className={'text-sm font-medium text-main'}>{comment.userName}</span>
                        <span className={'text-xs text-gray5'}>{dayjs(comment.createDate).format('YYYY-MM-DD HH:mm')}</span>
                      </div>
                      <p className={'text-sm text-main whitespace-pre-wrap'}>{comment.content}</p>
                    </div>
                    {(canEdit || canDelete) && (
                      <div className={'flex items-center gap-1 shrink-0'}>
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEditModal(comment)}
                            className={'p-1.5 text-sub hover:text-main hover:bg-gray8 rounded-md transition-colors cursor-pointer'}
                            aria-label={t.commentEditTitle || '댓글 수정'}
                          >
                            <Pencil className={'size-3.5'} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeletingCommentId(comment.id)}
                            className={'p-1.5 text-sub hover:text-error hover:bg-error/5 rounded-md transition-colors cursor-pointer'}
                            aria-label={t.commentDeleteTitle || '댓글 삭제'}
                          >
                            <Trash2 className={'size-3.5'} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* 댓글 작성 */}
        {user ? (
          <div className={'mt-4 border border-gray8 rounded-lg overflow-hidden'}>
            <div className={'flex items-center gap-2 px-4 py-2 bg-gray9/50 border-b border-gray7'}>
              <span className={'text-sm font-medium text-main'}>{user.userName}</span>
            </div>
            <div className={'flex'}>
              <textarea
                id={'commentText'}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t.commentPlaceholder || '댓글을 입력하세요'}
                rows={3}
                aria-label={t.commentPlaceholder || '댓글을 입력하세요'}
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

      {/* 게시글 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t.deleteConfirmTitle || '삭제 확인'}
        message={t.deleteConfirmMessage || '정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.'}
        confirmText={deleting ? (t.loading || '불러오는 중...') : (t.delete || '삭제')}
        cancelText={t.cancel || '취소'}
      />

      {/* 댓글 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deletingCommentId !== null}
        onClose={() => setDeletingCommentId(null)}
        onConfirm={handleCommentDeleteConfirm}
        title={t.commentDeleteTitle || '댓글 삭제'}
        message={t.commentDeleteMessage || '댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.'}
        confirmText={commentDeleting ? (t.commentDeleting || '삭제 중...') : (t.delete || '삭제')}
        cancelText={t.cancel || '취소'}
      />

      {/* 댓글 수정 모달 */}
      {editingComment && createPortal(
        <div className={'fixed inset-0 z-50 flex items-center justify-center'}>
          <div
            className={'absolute inset-0 bg-black/50 animate-fadeIn'}
            onClick={() => setEditingComment(null)}
          />
          <div className={'relative w-full max-w-md rounded-xl bg-background shadow-xl animate-slideDown'}>
            <div className={'flex items-center justify-between p-4 border-b border-gray8'}>
              <h3 className={'text-lg font-bold text-main'}>{t.commentEditTitle || '댓글 수정'}</h3>
              <button
                onClick={() => setEditingComment(null)}
                className={'p-1 rounded-md text-sub hover:text-main hover:bg-gray8 transition-colors'}
              >
                <X className={'size-5'} />
              </button>
            </div>
            <div className={'p-4'}>
              <textarea
                id={'editCommentText'}
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
                rows={4}
                aria-label={t.commentEditTitle || '댓글 수정'}
                className={'w-full px-3 py-2.5 text-sm bg-background text-main border border-gray7 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-accent1'}
              />
            </div>
            <div className={'flex gap-3 p-4 pt-0'}>
              <button
                onClick={() => setEditingComment(null)}
                className={'w-full rounded-full border border-gray1 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray1 hover:text-inverse cursor-pointer'}
              >
                {t.cancel || '취소'}
              </button>
              <button
                onClick={handleCommentEditSubmit}
                disabled={editSubmitting || !editCommentText.trim()}
                className={'w-full rounded-full bg-accent1 px-4 py-2.5 text-sm font-semibold text-inverse transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'}
              >
                {editSubmitting ? (t.commentEditSaving || '저장 중...') : (t.commentEditSave || '저장')}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
