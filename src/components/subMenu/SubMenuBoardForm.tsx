'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/ui/ConfirmModal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import {
  buttonPrimaryStyle,
  cancelButtonStyle,
  errorStyle,
  inputStyle,
  labelStyle,
} from '@/components/ui/form-styles';
import { useTranslation } from '@/i18n/client';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/cn';
import {
  createSubMenuBoardPost,
  fetchSubMenuBoardDetail,
  subMenuBoardKeys,
  updateSubMenuBoardPost,
  type SubMenuPostInput,
  type SubMenuBoardRoute,
} from '@/lib/queries/subMenuBoard';
import type { Locale } from '@/i18n/config';

interface SubMenuBoardFormProps {
  locale: Locale;
  route: SubMenuBoardRoute;
  mode: 'write' | 'edit';
  postId?: number;
}

export default function SubMenuBoardForm({ locale, route, mode, postId }: SubMenuBoardFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { dictionary } = useTranslation();
  const t = dictionary.board as unknown as Record<string, string>;
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const initialized = useRef(false);

  const boardPath = `${ route.mainMenu }/${ route.subMenu }`;
  const userLevel = user?.level?.toLowerCase();
  const isAdmin = userLevel === 'admin' || userLevel === 'superadmin';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { data: post, isLoading: postLoading, isError: postError } = useQuery({
    queryKey: postId ? subMenuBoardKeys.detail(route, postId) : subMenuBoardKeys.board(route),
    queryFn: () => fetchSubMenuBoardDetail(route, postId!),
    enabled: mode === 'edit' && !!postId && !!user,
    retry: false,
  });

  useEffect(() => {
    if (!user) {
      router.replace(`/${ locale }/login?returnTo=${ encodeURIComponent(pathname) }`);
      return;
    }
    if (!isAdmin) {
      router.replace(`/${ locale }/${ boardPath }`);
    }
  }, [user, isAdmin, router, locale, pathname, boardPath]);

  useEffect(() => {
    if (postError) {
      router.replace(`/${ locale }/${ boardPath }`);
    }
  }, [postError, locale, router, boardPath]);

  useEffect(() => {
    if (mode === 'edit' && post && !initialized.current) {
      initialized.current = true;
      setTitle(post.title);
      setContent(post.content);
    }
  }, [mode, post]);

  const createMutation = useMutation({
    mutationFn: (data: SubMenuPostInput) =>
      createSubMenuBoardPost(route, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subMenuBoardKeys.board(route) });
      router.push(`/${ locale }/${ boardPath }`);
      router.refresh();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubMenuPostInput }) =>
      updateSubMenuBoardPost(route, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subMenuBoardKeys.board(route) });
      if (postId) {
        queryClient.invalidateQueries({ queryKey: subMenuBoardKeys.detail(route, postId) });
        router.push(`/${ locale }/${ boardPath }/${ postId }`);
        router.refresh();
      }
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  const handleSubmit = () => {
    if (!user || !isAdmin) return;
    if (!title.trim()) {
      setFieldError('제목을 입력해주세요');
      return;
    }
    if (!content.trim()) {
      setFieldError('내용을 입력해주세요');
      return;
    }

    setFieldError(null);
    const data = {
      title: title.trim(),
      content,
      userId: user.userId,
      userName: user.userName,
      visibilityLevel: 'public' as const,
    };

    if (mode === 'edit' && postId) {
      updateMutation.mutate({ id: postId, data });
      return;
    }
    createMutation.mutate(data);
  };

  if (!user || !isAdmin || (mode === 'edit' && (postLoading || !initialized.current))) {
    return (
      <div className={'py-20 text-center text-sub'}>
        <span className={'inline-block size-6 border-2 border-gray5 border-t-accent1 rounded-full animate-spin'} />
        <p className={'mt-3 text-sm'}>{t.loading || '불러오는 중...'}</p>
      </div>
    );
  }

  return (
    <>
      <div className={'grid grid-cols-1 gap-6'}>
        <div>
          <label htmlFor={'title'} className={labelStyle}>
            {t.title || '제목'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <input
            id={'title'}
            name={'title'}
            type={'text'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.titlePlaceholder || '제목을 입력하세요'}
            className={cn(inputStyle, fieldError?.includes('제목') && 'border-error')}
          />
        </div>

        <div>
          <label className={labelStyle}>
            {t.content || '내용'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder={t.contentPlaceholder || '내용을 입력하세요'}
            error={fieldError?.includes('내용')}
          />
        </div>

        {fieldError && (
          <div className={errorStyle}>{fieldError}</div>
        )}
        {mutationError && (
          <div className={errorStyle}>
            {mutationError instanceof Error ? mutationError.message : '처리 중 오류가 발생했습니다.'}
          </div>
        )}

        <div className={'flex justify-end gap-3'}>
          <button
            type={'button'}
            onClick={() => setShowCancelModal(true)}
            className={cn(cancelButtonStyle, 'cursor-pointer text-center')}
          >
            {t.cancel || '취소'}
          </button>
          <button
            type={'button'}
            onClick={() => setShowSubmitModal(true)}
            disabled={isPending}
            className={cn(buttonPrimaryStyle, 'cursor-pointer')}
          >
            {mode === 'edit' ? (t.edit || '수정') : (t.write || '글쓰기')}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => router.push(mode === 'edit' && postId ? `/${ locale }/${ boardPath }/${ postId }` : `/${ locale }/${ boardPath }`)}
        title={t.cancelConfirmTitle || '취소 확인'}
        message={t.cancelEditMessage || '작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?'}
        confirmText={dictionary.common.confirm || '확인'}
        cancelText={dictionary.common.cancel || '취소'}
      />

      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => {
          setShowSubmitModal(false);
          handleSubmit();
        }}
        title={mode === 'edit' ? '수정 확인' : '등록 확인'}
        message={mode === 'edit' ? '게시글을 수정하시겠습니까?' : '게시글을 올리겠습니까?'}
        confirmText={isPending ? '저장 중...' : (mode === 'edit' ? '수정' : '등록')}
        cancelText={dictionary.common.cancel || '취소'}
      />
    </>
  );
}
