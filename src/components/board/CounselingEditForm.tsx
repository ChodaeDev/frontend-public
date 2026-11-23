'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FormSelect from '@/components/ui/FormSelect';
import {
  inputStyle,
  errorStyle,
  labelStyle,
  cancelButtonStyle,
  buttonPrimaryStyle,
} from '@/components/ui/form-styles';
import {
  counselingSchema,
  type CounselingInput,
} from '@/lib/validations/counseling';
import {
  getFieldErrors,
  type FieldErrors,
} from '@/lib/validations/auth';
import { useTranslation } from '@/i18n/client';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/cn';
import { formatPhone, stripNonDigits } from '@/lib/format';
import PhoneInput from '@/components/ui/PhoneInput';
import RichTextEditor from '@/components/ui/RichTextEditor';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { counselingKeys, updateCounselingPost } from '@/lib/queries/counseling';
import { useCounselingPostAccess } from '@/lib/hooks/useCounselingPostAccess';
import GuestPasswordGate from '@/components/board/GuestPasswordGate';

interface CounselingEditFormProps {
  postId: number;
}

export default function CounselingEditForm({ postId }: CounselingEditFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const pathname = usePathname();
  const { dictionary } = useTranslation();
  const t = dictionary.board;
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [counselType, setCounselType] = useState('');
  const [content, setContent] = useState('');
  const [phone, setPhone] = useState('');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CounselingInput>>({});

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // 비회원 글이면 수정 화면에 들어올 때도 비밀번호를 다시 받는다
  const {
    post,
    loading: postLoading,
    error: postError,
    needsPassword,
    isGuestLocked,
    accessToken,
    unlock,
    unlocking,
    unlockError,
  } = useCounselingPostAccess(postId);
  const isGuestPost = post?.authorType === 'guest' || isGuestLocked;

  const initialized = useRef(false);

  useEffect(() => {
    if (postLoading || needsPassword || isGuestPost) return;
    if (!user) {
      router.replace(`/${ locale }/login?returnTo=${ encodeURIComponent(pathname) }`);
    }
  }, [user, router, locale, pathname, postLoading, needsPassword, isGuestPost]);

  useEffect(() => {
    if (postError && !needsPassword && (user || isGuestPost)) {
      router.replace(`/${ locale }/board/counseling`);
    }
  }, [postError, needsPassword, user, isGuestPost, locale, router]);

  useEffect(() => {
    if (post && !initialized.current) {
      initialized.current = true;
      setTitle(post.title);
      setCounselType(post.counselType);
      setContent(post.content);
      setPhone(formatPhone(post.phone));
    }
  }, [post]);

  const getErrorMessage = (errorKey: string | null) => {
    if (!errorKey) return null;
    const errors = t.errors as Record<string, string> | undefined;
    return errors?.[errorKey] || errorKey;
  };

  const { mutate: submitEdit, isPending, error: mutationError } = useMutation({
    mutationFn: updateCounselingPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counselingKeys.all });
      router.push(`/${ locale }/board/counseling/${ postId }`);
    },
  });

  const handleSubmit = () => {
    const raw = { title, counselType, content, phone: stripNonDigits(phone) };
    const result = counselingSchema.safeParse(raw);
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error));
      return;
    }
    setFieldErrors({});

    // 비회원 글은 작성자 정보를 글에서 가져오고 열람 토큰으로 인증한다
    const author = isGuestPost || !user
      ? { userId: post!.userId, userName: post!.userName }
      : { userId: user.userId, userName: user.userName };

    submitEdit({
      id: postId,
      accessToken,
      data: {
        title: result.data.title,
        content: result.data.content,
        ...author,
        // 상담글은 모두 비공개(잠금)
        visibilityLevel: 'partial',
        phone: result.data.phone,
        counselType: result.data.counselType,
      },
    });
  };

  if (needsPassword) {
    return <GuestPasswordGate onSubmit={unlock} pending={unlocking} error={unlockError} />;
  }

  if ((!user && !isGuestPost) || postLoading || !initialized.current) {
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
            placeholder={t.titlePlaceholder || '상담 제목을 입력하세요'}
            className={cn(inputStyle, fieldErrors.title && 'border-error')}
          />
          {fieldErrors.title && (
            <p className={'mt-1 text-xs text-error'}>{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor={'counselType'} className={labelStyle}>
            {t.counselType || '상담 유형'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <FormSelect
            id={'counselType'}
            value={counselType}
            onChange={setCounselType}
            placeholder={t.counselTypePlaceholder || '상담 유형을 선택하세요'}
            error={!!fieldErrors.counselType}
            options={[
              { value: 'self', label: t.counselTypeSelf || '본인 상담' },
              { value: 'family', label: t.counselTypeFamily || '가족 상담' },
              { value: 'friend', label: t.counselTypeFriend || '지인 상담' },
              { value: 'etc', label: t.counselTypeEtc || '기타 상담' },
            ]}
          />
          {fieldErrors.counselType && (
            <p className={'mt-1 text-xs text-error'}>{fieldErrors.counselType}</p>
          )}
        </div>

        <div>
          <label className={labelStyle}>
            {t.content || '내용'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder={t.contentPlaceholder || '상담 내용을 자세히 작성해주세요'}
            error={!!fieldErrors.content}
          />
          {fieldErrors.content && (
            <p className={'mt-1 text-xs text-error'}>{fieldErrors.content}</p>
          )}
        </div>

        <div>
          <label htmlFor={'applicantName'} className={labelStyle}>
            {t.applicantName || '신청자'}
          </label>
          <input
            id={'applicantName'}
            value={post?.userName ?? user?.userName ?? ''}
            disabled
            className={cn(inputStyle, 'bg-gray7 cursor-not-allowed')}
          />
        </div>

        <div>
          <label htmlFor={'phone'} className={labelStyle}>
            {t.phone || '연락처'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <PhoneInput
            id={'phone'}
            name={'phone'}
            value={phone}
            onChange={setPhone}
            placeholder={t.phonePlaceholder || '연락 가능한 전화번호를 입력하세요'}
            autoComplete={'tel'}
            className={cn(inputStyle, fieldErrors.phone && 'border-error')}
          />
          {fieldErrors.phone && (
            <p className={'mt-1 text-xs text-error'}>{fieldErrors.phone}</p>
          )}
        </div>

        {mutationError && (
          <div className={errorStyle}>
            {getErrorMessage(mutationError instanceof Error ? mutationError.message : 'generic')}
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
            onClick={() => setShowEditModal(true)}
            disabled={isPending}
            className={cn(buttonPrimaryStyle, 'cursor-pointer')}
          >
            {t.edit || '수정'}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => router.push(`/${ locale }/board/counseling/${ postId }`)}
        title={t.cancelConfirmTitle || '취소 확인'}
        message={t.cancelEditMessage || '수정 중인 내용이 사라집니다. 정말 취소하시겠습니까?'}
        confirmText={dictionary.common.confirm || '확인'}
        cancelText={dictionary.common.cancel || '취소'}
      />

      <ConfirmModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onConfirm={() => {
          setShowEditModal(false);
          handleSubmit();
        }}
        title={t.editConfirmTitle || '수정 확인'}
        message={t.editConfirmMessage || '상담 내용을 수정하시겠습니까?'}
        confirmText={isPending ? (t.saving || '저장 중...') : (t.save || '저장')}
        cancelText={dictionary.common.cancel || '취소'}
      />
    </>
  );
}
