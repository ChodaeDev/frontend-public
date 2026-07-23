'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CommentSection from '@/components/board/CommentSection';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useTranslation } from '@/i18n/client';
import { useAuthStore } from '@/store/authStore';
import {
  deleteSubMenuBoardComment,
  deleteSubMenuBoardPost,
  fetchSubMenuBoardComments,
  fetchSubMenuBoardDetail,
  subMenuBoardKeys,
  createSubMenuBoardComment,
  updateSubMenuBoardComment,
  type SubMenuBoardRoute,
} from '@/lib/queries/subMenuBoard';
import type { Locale } from '@/i18n/config';

interface SubMenuBoardDetailProps {
  locale: Locale;
  route: SubMenuBoardRoute;
  postId: number;
}

export default function SubMenuBoardDetail({ locale, route, postId }: SubMenuBoardDetailProps) {
  const router = useRouter();
  const { dictionary } = useTranslation();
  const t = dictionary.board as unknown as Record<string, string>;
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const userLevel = user?.level?.toLowerCase();
  const isAdmin = userLevel === 'admin' || userLevel === 'superadmin';
  const boardPath = `${ route.mainMenu }/${ route.subMenu }`;

  const { data: post, isLoading, isError } = useQuery({
    queryKey: subMenuBoardKeys.detail(route, postId),
    queryFn: () => fetchSubMenuBoardDetail(route, postId),
    retry: false,
  });

  const { mutate: handleDelete, isPending: deleting } = useMutation({
    mutationFn: () => deleteSubMenuBoardPost(route, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subMenuBoardKeys.board(route) });
      router.push(`/${ locale }/${ boardPath }`);
    },
    onSettled: () => setShowDeleteModal(false),
  });

  if (isLoading) {
    return (
      <div className={'py-20 text-center text-sub'}>
        <span className={'inline-block size-6 border-2 border-gray5 border-t-accent1 rounded-full animate-spin'} />
        <p className={'mt-3 text-sm'}>{t.loading || '불러오는 중...'}</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className={'py-20 text-center'}>
        <p className={'text-sub mb-4'}>{t.postNotFound || '게시글을 찾을 수 없습니다.'}</p>
        <Link
          href={`/${ locale }/${ boardPath }`}
          className={'inline-flex items-center gap-1.5 text-accent1 hover:underline text-sm'}
        >
          <ArrowLeft className={'size-4'} />
          {t.backToList || '목록으로'}
        </Link>
      </div>
    );
  }

  return (
    <article>
      <header className={'border-b border-gray7 mt-8 pb-2'}>
        <div className={'flex items-start justify-between gap-4'}>
          <h1 className={'text-xl font-bold text-main'}>{post.title}</h1>
        </div>
        <div className={'flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 text-sm gap-1'}>
          <span>{t.author || '작성자'}{': '}<span className={'text-main font-medium'}>{post.userName}</span></span>
          <div className={'flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray1'}>
            <span>{t.createdDate || '작성'}{': '}<time dateTime={post.createDate}>{dayjs(post.createDate).format('YYYY.MM.DD HH:mm')}</time></span>
            {post.modifiedDate && post.modifiedDate !== post.createDate && (
              <span>{t.modifiedDate || '수정'}{': '}<time dateTime={post.modifiedDate}>{dayjs(post.modifiedDate).format('YYYY.MM.DD HH:mm')}</time></span>
            )}
          </div>
        </div>
      </header>

      {isAdmin && (
        <div className={'w-full flex items-center gap-2 my-3'}>
          <Link
            href={`/${ locale }/${ boardPath }/${ postId }/edit`}
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

      <div className={'my-2 min-h-[calc(100vh-600px)]'}>
        <div
          className={'tiptap text-main leading-relaxed prose prose-sm max-w-none'}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <CommentSection
        postId={postId}
        t={t}
        canWrite={isAdmin}
        readOnlyMessage={'댓글 작성은 관리자만 가능합니다.'}
        api={{
          queryKey: subMenuBoardKeys.comments(route, postId),
          fetchComments: () => fetchSubMenuBoardComments(route, postId),
          createComment: (data) => createSubMenuBoardComment({ route, postId, data }),
          updateComment: (commentId, data) => updateSubMenuBoardComment({ route, postId, commentId, data }),
          deleteComment: (commentId) => deleteSubMenuBoardComment({ route, postId, commentId }),
        }}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t.deleteConfirmTitle || '삭제 확인'}
        message={t.deleteConfirmMessage || '정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.'}
        confirmText={deleting ? (t.loading || '불러오는 중...') : (t.delete || '삭제')}
        cancelText={t.cancel || '취소'}
      />
    </article>
  );
}
