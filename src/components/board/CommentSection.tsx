'use client';

import { useCallback, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Pencil, Trash2, CornerDownRight, EllipsisVertical } from 'lucide-react';
import { Dropdown, DropdownTrigger, DropdownList, DropdownItem } from '@/components/ui/Dropdown';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/cn';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { Comment } from '@/types/board';
import {
  counselingKeys,
  fetchCounselingComments,
  createComment,
  updateComment,
  deleteComment,
} from '@/lib/queries/counseling';

interface CommentApi {
  queryKey: readonly unknown[];
  fetchComments: ()=> Promise<Comment[]>;
  createComment: (data: { userId: string; userName: string; content: string; parentCommentId?: number | null })=> Promise<void>;
  updateComment: (commentId: number, data: { userId: string; userName: string; content: string })=> Promise<void>;
  deleteComment: (commentId: number)=> Promise<void>;
}

interface CommentSectionProps {
  postId: number;
  t: Record<string, string>;
  api?: CommentApi;
  canWrite?: boolean;
  readOnlyMessage?: string;
}

interface CommentInputProps {
  userName: string;
  value: string;
  onChange: (value: string)=> void;
  onSubmit: ()=> void;
  onCancel?: ()=> void;
  cancelText?: string;
  submitText: string;
  submittingText: string;
  isSubmitting: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

function CommentInput({
  userName,
  value,
  onChange,
  onSubmit,
  onCancel,
  cancelText,
  submitText,
  submittingText,
  isSubmitting,
  placeholder,
  autoFocus,
}: CommentInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${ el.scrollHeight }px`;
  }, []);

  const refCallback = useCallback((el: HTMLTextAreaElement | null) => {
    (textareaRef).current = el;
    if (el) {
      autoResize(el);
      if (autoFocus) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }, [autoResize, autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    autoResize(e.target);
  };

  return (
    <div className={'flex flex-col gap-1.5 outline-1 outline-gray8 rounded-lg p-2'}>
      <span className={'text-sm font-semibold text-main'}>{userName}</span>
      <textarea
        id={'comment-input-textarea'}
        ref={refCallback}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={1}
        className={'w-full text-sm bg-background text-main resize-none focus:outline-none placeholder:text-gray7 overflow-hidden'}
      />
      <div className={'flex items-center justify-end gap-1'}>
        {onCancel && (
          <button
            type={'button'}
            onClick={onCancel}
            className={'px-4 py-2 text-sm text-gray3 hover:text-main transition-colors cursor-pointer'}
          >
            {cancelText}
          </button>
        )}
        <button
          type={'button'}
          onClick={onSubmit}
          disabled={isSubmitting || !value.trim()}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
            'bg-accent1 text-white hover:bg-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isSubmitting ? submittingText : submitText}
        </button>
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  isAdmin: boolean;
  canManage: boolean;
  userId?: string;
  isEditing: boolean;
  editText: string;
  editSubmitting: boolean;
  onEditChange: (value: string)=> void;
  onStartEdit: ()=> void;
  onCancelEdit: ()=> void;
  onSubmitEdit: ()=> void;
  onDelete: ()=> void;
  onReply?: ()=> void;
  t: Record<string, string>;
}

function CommentItem({
  comment,
  isReply,
  isAdmin,
  canManage,
  userId,
  isEditing,
  editText,
  editSubmitting,
  onEditChange,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  onReply,
  t,
}: CommentItemProps) {
  const canEdit = canManage && userId === comment.userId;
  const canDelete = canManage && (isAdmin || userId === comment.userId);

  if (isEditing) {
    return (
      <CommentInput
        userName={comment.userName}
        value={editText}
        onChange={onEditChange}
        onSubmit={onSubmitEdit}
        onCancel={onCancelEdit}
        cancelText={t.cancel || '취소'}
        submitText={t.commentEditSave || '저장'}
        submittingText={t.commentEditSaving || '저장 중...'}
        isSubmitting={editSubmitting}
        autoFocus
      />
    );
  }

  return (
    <div className={'flex-col gap-2'}>
      <div className={'min-h-7 flex items-center justify-between'}>
        <span className={'text-sm font-semibold text-main inline-flex items-center gap-1'}>
          {isReply && <CornerDownRight className={'size-3.5 text-gray3'} />}
          {comment.userName}
        </span>
        {(canEdit || canDelete) && (
          <Dropdown>
            <DropdownTrigger>
              <button className={'p-1 text-gray3 hover:text-main hover:bg-gray8 rounded-md transition-colors cursor-pointer'}>
                <EllipsisVertical className={'size-4'} />
              </button>
            </DropdownTrigger>
            <DropdownList align={'end'}>
              {canEdit && (
                <DropdownItem onClick={onStartEdit}>
                  <div className={'inline-flex items-center gap-2 px-3 py-2 text-main'}>
                    <Pencil className={'size-3.5'} />
                    <span>{t.edit || '수정'}</span>
                  </div>
                </DropdownItem>
              )}
              {canDelete && (
                <DropdownItem onClick={onDelete}>
                  <div className={'inline-flex items-center gap-2 px-3 py-2 text-error'}>
                    <Trash2 className={'size-3.5'} />
                    <span>{t.delete || '삭제'}</span>
                  </div>
                </DropdownItem>
              )}
            </DropdownList>
          </Dropdown>
        )}
      </div>
      <p className={'text-sm text-main whitespace-pre-wrap mb-1.5'}>{comment.content}</p>
      <div className={'flex items-center gap-3'}>
        <span className={'text-[13px] text-gray3'}>{dayjs(comment.createDate).format('YYYY-MM-DD HH:mm')}</span>
        {userId && !isReply && onReply && (
          <button
            onClick={onReply}
            className={'inline-flex items-center gap-1 text-gray3 hover:text-main rounded-md transition-colors cursor-pointer'}
          >
            <CornerDownRight className={'size-3.5'} />
            <span className={'text-[13px]'}>{t.replyWrite || '답글쓰기'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function CommentSection({
  postId,
  t,
  api,
  canWrite,
  readOnlyMessage,
}: CommentSectionProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const userLevel = user?.level?.toLowerCase();
  const isAdmin = userLevel === 'admin' || userLevel === 'superadmin';
  const allowWrite = canWrite ?? !!user;
  const commentQueryKey = api?.queryKey ?? counselingKeys.comments(postId);

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: commentQueryKey,
    queryFn: () => api?.fetchComments() ?? fetchCounselingComments(postId),
  });

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  const rootComments = comments.filter((c) => !c.parentCommentId);
  const repliesByParentId = comments.reduce<Record<number, Comment[]>>((acc, c) => {
    if (c.parentCommentId) {
      acc[c.parentCommentId] = [...(acc[c.parentCommentId] ?? []), c];
    }
    return acc;
  }, {});

  const { mutate: submitComment, isPending: commentSubmitting } = useMutation({
    mutationFn: ({ content, parentCommentId }: { content: string; parentCommentId?: number | null }) =>
      api
        ? api.createComment({ userId: user!.userId, userName: user!.userName, content, parentCommentId })
        : createComment({
          postId,
          data: { userId: user!.userId, userName: user!.userName, content, parentCommentId },
        }),
    onSuccess: () => {
      setCommentText('');
      setReplyingTo(null);
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: commentQueryKey });
    },
  });

  const { mutate: submitCommentEdit, isPending: editSubmitting } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      api
        ? api.updateComment(commentId, { userId: user!.userId, userName: user!.userName, content })
        : updateComment({
          postId,
          commentId,
          data: { userId: user!.userId, userName: user!.userName, content },
        }),
    onSuccess: () => {
      setEditingComment(null);
      setEditCommentText('');
      queryClient.invalidateQueries({ queryKey: commentQueryKey });
    },
  });

  const { mutate: submitCommentDelete, isPending: commentDeleting } = useMutation({
    mutationFn: (commentId: number) => api ? api.deleteComment(commentId) : deleteComment({ postId, commentId }),
    onSuccess: () => {
      setDeletingCommentId(null);
      queryClient.invalidateQueries({ queryKey: commentQueryKey });
    },
  });

  return (
    <div className={'pt-4 sm:pt-8 border-t border-gray7'}>
      <h3 className={'text-lg font-bold text-gray3 mb-4'}>
        {t.comments || '댓글'} <span className={'text-accent1'}>{'['}{comments.length}{']'}</span>
      </h3>

      {commentsLoading ? (
        <div className={'py-8 text-center text-sub'}>
          <span className={'inline-block size-5 border-2 border-gray9 border-t-accent1 rounded-full animate-spin'} />
        </div>
      ) : comments.length === 0 ? (
        <p className={'py-8 text-center text-sm text-sub'}>{t.commentEmpty || '댓글이 없습니다.'}</p>
      ) : (
        <ul className={'divide-y divide-gray9 border-t border-gray9'}>
          {rootComments.map((comment) => {
            const replies = repliesByParentId[comment.id] ?? [];
            return (
              <li key={comment.id} className={'px-2 sm:px-4 py-4'}>
                <CommentItem
                  comment={comment}
                  isAdmin={isAdmin}
                  canManage={allowWrite}
                  userId={user?.userId}
                  isEditing={editingComment?.id === comment.id}
                  editText={editCommentText}
                  editSubmitting={editSubmitting}
                  onEditChange={setEditCommentText}
                  onStartEdit={() => {
                    setEditingComment(comment);
                    setEditCommentText(comment.content);
                  }}
                  onCancelEdit={() => {
                    setEditingComment(null);
                    setEditCommentText('');
                  }}
                  onSubmitEdit={() => {
                    if (!editCommentText.trim()) return;
                    submitCommentEdit({ commentId: comment.id, content: editCommentText.trim() });
                  }}
                  onDelete={() => setDeletingCommentId(comment.id)}
                  onReply={allowWrite ? () => {
                    setReplyingTo(comment);
                    setReplyText('');
                  } : undefined}
                  t={t}
                />
                {replyingTo?.id === comment.id && user && allowWrite && (
                  <div className={'mt-3 pl-2'}>
                    <CommentInput
                      userName={user.userName}
                      value={replyText}
                      onChange={setReplyText}
                      onSubmit={() => {
                        if (!replyText.trim()) return;
                        submitComment({ content: replyText.trim(), parentCommentId: comment.id });
                      }}
                      onCancel={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      cancelText={t.cancel || '취소'}
                      submitText={t.commentSubmit || '등록'}
                      submittingText={t.commentSubmitting || '등록 중...'}
                      isSubmitting={commentSubmitting}
                      placeholder={t.replyPlaceholder || '답글을 입력하세요'}
                      autoFocus
                    />
                  </div>
                )}
                {replies.length > 0 && (
                  <ul className={'mt-3'}>
                    {replies.map((reply) => (
                      <li key={reply.id} className={cn('border-t border-gray9', editingComment?.id === reply.id ? 'pl-2 py-1' : 'pl-4 py-2')}>
                        <CommentItem
                          comment={reply}
                          isReply
                          isAdmin={isAdmin}
                          canManage={allowWrite}
                          userId={user?.userId}
                          isEditing={editingComment?.id === reply.id}
                          editText={editCommentText}
                          editSubmitting={editSubmitting}
                          onEditChange={setEditCommentText}
                          onStartEdit={() => {
                            setEditingComment(reply);
                            setEditCommentText(reply.content);
                          }}
                          onCancelEdit={() => {
                            setEditingComment(null);
                            setEditCommentText('');
                          }}
                          onSubmitEdit={() => {
                            if (!editCommentText.trim()) return;
                            submitCommentEdit({ commentId: reply.id, content: editCommentText.trim() });
                          }}
                          onDelete={() => setDeletingCommentId(reply.id)}
                          t={t}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* 댓글 작성 */}
      {user && allowWrite ? (
        <div className={'mt-4'}>
          <CommentInput
            userName={user.userName}
            value={commentText}
            onChange={setCommentText}
            onSubmit={() => {
              if (!commentText.trim()) return;
              submitComment({ content: commentText.trim() });
            }}
            submitText={t.commentSubmit || '등록'}
            submittingText={t.commentSubmitting || '등록 중...'}
            isSubmitting={commentSubmitting}
            placeholder={t.commentPlaceholder || '댓글을 입력하세요'}
          />
        </div>
      ) : (
        <p className={'mt-4 py-4 text-center text-sm text-sub border border-gray7 rounded-lg bg-gray9/30'}>
          {readOnlyMessage || t.loginToComment || '댓글을 작성하려면 로그인하세요.'}
        </p>
      )}

      <ConfirmModal
        isOpen={deletingCommentId !== null}
        onClose={() => setDeletingCommentId(null)}
        onConfirm={() => {
          if (deletingCommentId !== null) submitCommentDelete(deletingCommentId);
        }}
        title={t.commentDeleteTitle || '댓글 삭제'}
        message={t.commentDeleteMessage || '댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.'}
        confirmText={commentDeleting ? (t.commentDeleting || '삭제 중...') : (t.delete || '삭제')}
        cancelText={t.cancel || '취소'}
      />
    </div>
  );
}
