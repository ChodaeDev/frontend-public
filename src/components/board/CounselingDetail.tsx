'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ArrowLeft, Pencil, Trash2, Lock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/i18n/client';
import { useAuthStore } from '@/store/authStore';
import { formatPhone } from '@/lib/format';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CommentSection from '@/components/board/CommentSection';
import {
  counselingKeys,
  fetchCounselingDetail,
  deleteCounselingPost,
} from '@/lib/queries/counseling';

interface CounselingDetailProps {
  postId: number;
}

export default function CounselingDetail({ postId }: CounselingDetailProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { dictionary } = useTranslation();
  const t = dictionary.board;
  const user = useAuthStore((state) => state.user);

  const queryClient = useQueryClient();

  const { data: post, isLoading: loading, error: postError } = useQuery({
    queryKey: counselingKeys.detail(postId),
    queryFn: () => fetchCounselingDetail(postId),
    retry: false,
  });

  const [noAccess, setNoAccess] = useState(false);
  const error = postError ? (postError as Error).message || t.postNotFound || '게시글을 찾을 수 없습니다.' : null;

  // 게시글 삭제 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const userLevel = user?.level?.toLowerCase();
  const isAdmin = userLevel === 'admin' || userLevel === 'superadmin';
  const isOwner = !!post?.isOwner || isAdmin;
  const isNotice = !!post?.isNotice;

  const counselTypeMap: Record<string, string> = {
    self: t.counselTypeSelf || '본인 상담',
    family: t.counselTypeFamily || '가족 상담',
    friend: t.counselTypeFriend || '지인 상담',
    etc: t.counselTypeEtc || '기타 상담',
  };

  // 비로그인 시 로그인 페이지로 리다이렉트 (공지글은 제외)
  useEffect(() => {
    if (!loading && !user && !isNotice) {
      alert(t.loginRequired || '로그인이 필요합니다');
      router.replace(`/${ locale }/login?returnTo=${ encodeURIComponent(`/${ locale }/board/counseling/${ postId }`) }`);
    }
  }, [loading, user, isNotice, router, locale, postId, t.loginRequired]);

  // error 또는 post 없을 때 목록으로 이동
  useEffect(() => {
    if ((!user && !isNotice) || loading) return;
    if (error || !post) {
      alert(error || t.postNotFound || '게시글을 찾을 수 없습니다.');
      router.replace(`/${ locale }/board/counseling`);
    }
  }, [loading, error, post, router, t.postNotFound, locale, user, isNotice]);

  // 비공개 글 접근 권한 확인 (공지글은 제외)
  useEffect(() => {
    if (!post) return;
    if (post.isNotice) return;
    if (post.visibilityLevel !== 'public' && !post.isOwner && !isAdmin) {
      setNoAccess(true);
    } else {
      setNoAccess(false);
    }
  }, [post, isAdmin, isNotice]);

  // 게시글 삭제
  const { mutate: handleDelete, isPending: deleting } = useMutation({
    mutationFn: () => deleteCounselingPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counselingKeys.all });
      router.push(`/${ locale }/board/counseling`);
    },
    onError: () => {
      setShowDeleteModal(false);
    },
  });

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
      <div className={'border-b border-gray7 mt-8 px-2 pb-2'}>
        <div className={'flex items-start justify-between gap-4'}>
          <h2 className={'text-xl font-bold text-main flex items-center gap-2'}>
            {!isNotice && post.visibilityLevel !== 'public' && <Lock className={'size-4 text-gray3 shrink-0'} />}
            {post.title}
          </h2>
        </div>
        <div className={'flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 text-sm gap-1'}>
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
      <div className={'border-b border-gray7 px-2 py-3 bg-gray9'}>
        <div className={'flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm'}>
          <span>{t.author || '작성자'}{': '}<span className={'text-main font-medium'}>{post.userName}</span></span>
          <div className={'flex items-center gap-2'}>
            <span className={'text-sub'}>{t.phone || '연락처'}{': '}</span>
            <span className={'inline-flex items-center gap-1.5'}>
              <span className={'text-main font-medium'}>{formatPhone(post.phone)}</span>
            </span>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className={'w-full flex items-center gap-2 mx-2 my-3'}>
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
      <div className={'m-2 min-h-[calc(100vh-600px)]'}>
        <div
          className={'tiptap text-main leading-relaxed prose prose-sm max-w-none'}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* 댓글 영역 */}
      <CommentSection postId={postId} t={t as unknown as Record<string, string>} />

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
    </div>
  );
}
