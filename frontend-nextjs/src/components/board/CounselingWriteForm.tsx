'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FormSelect from '@/components/ui/FormSelect';
import { FormInput, FormTextarea } from '@/components/ui/form';
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
import ConfirmModal from '@/components/ui/ConfirmModal';
import { counselingKeys, createCounselingPost } from '@/lib/queries/counseling';

export default function CounselingWriteForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const pathname = usePathname();
  const { dictionary } = useTranslation();
  const t = dictionary.board;
  const user = useAuthStore((state) => state.user);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CounselingInput>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previousInput, setPreviousInput] = useState<Partial<CounselingInput>>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace(`/${ locale }/login?returnTo=${ encodeURIComponent(pathname) }`);
    }
  }, [user, router, locale, pathname]);

  const { mutate: submitPost, isPending } = useMutation({
    mutationFn: createCounselingPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counselingKeys.all });
      router.push(`/${ locale }/board/counseling`);
    },
    onError: (err) => {
      setSubmitError(err instanceof Error ? err.message : 'generic');
    },
  });

  const getErrorMessage = (errorKey: string | null) => {
    if (!errorKey) return null;
    const errors = t.errors as Record<string, string> | undefined;
    return errors?.[errorKey] || errorKey;
  };

  const handleFormSubmit = () => {
    if (!formRef.current || !user) return;

    const formData = new FormData(formRef.current);
    const rawData: Partial<CounselingInput> = {
      title: formData.get('title') as string,
      counselType: formData.get('counselType') as string,
      content: formData.get('content') as string,
      phone: formData.get('phone') as string,
    };

    const result = counselingSchema.safeParse(rawData);
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error));
      setPreviousInput(rawData);
      return;
    }

    setFieldErrors({});
    setSubmitError(null);
    const isPrivate = formData.get('isPrivate') === 'on' ? 1 : 0;

    submitPost({
      ...result.data,
      userId: user.userId,
      userName: user.userName,
      isPrivate,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <form ref={formRef} className={'grid grid-cols-1 gap-6'}>
        <input type={'hidden'} name={'userId'} value={user.userId} />
        <input type={'hidden'} name={'userName'} value={user.userName} />

        <FormInput
          label={t.title || '제목'}
          name={'title'}
          placeholder={t.titlePlaceholder || '상담 제목을 입력하세요'}
          required
          error={fieldErrors.title}
          defaultValue={previousInput.title}
        />

        <div>
          <label htmlFor={'counselType'} className={labelStyle}>
            {t.counselType || '상담 유형'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <FormSelect
            key={previousInput.counselType}
            id={'counselType'}
            name={'counselType'}
            required
            defaultValue={previousInput.counselType ?? ''}
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
            <p className={'mt-1 text-xs text-error'}>
              {fieldErrors.counselType}
            </p>
          )}
        </div>

        <FormTextarea
          label={t.content || '내용'}
          name={'content'}
          placeholder={t.contentPlaceholder || '상담 내용을 자세히 작성해주세요'}
          rows={8}
          required
          error={fieldErrors.content}
          defaultValue={previousInput.content}
        />

        <div>
          <label htmlFor={'applicantName'} className={labelStyle}>
            {t.applicantName || '신청자'}
          </label>
          <input
            id={'applicantName'}
            value={user.userName}
            disabled
            className={cn(inputStyle, 'bg-gray7 cursor-not-allowed')}
          />
        </div>

        <FormInput
          label={t.phone || '연락처'}
          name={'phone'}
          type={'tel'}
          placeholder={t.phonePlaceholder || '연락 가능한 전화번호를 입력하세요'}
          required
          error={fieldErrors.phone}
          defaultValue={previousInput.phone ?? user.phone}
          autoComplete={'tel'}
        />

        <div className={'flex items-center gap-2'}>
          <input
            id={'isPrivate'}
            name={'isPrivate'}
            type={'checkbox'}
            className={'h-4 w-4 rounded border-gray7 accent-accent1'}
          />
          <label htmlFor={'isPrivate'} className={'text-sm text-main'}>
            {t.isPrivate || '비공개'}
          </label>
        </div>

        {submitError && (
          <div className={errorStyle}>
            {getErrorMessage(submitError)}
          </div>
        )}

        <div className={'flex gap-3'}>
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
            {isPending ? (t.loading || '처리 중...') : (t.submit || '신청하기')}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => router.push(`/${ locale }/board/counseling`)}
        title={t.cancelConfirmTitle || '취소 확인'}
        message={t.cancelConfirmMessage || '작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?'}
        confirmText={dictionary.common.confirm || '확인'}
        cancelText={dictionary.common.cancel || '취소'}
      />

      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => {
          setShowSubmitModal(false);
          handleFormSubmit();
        }}
        title={t.submitConfirmTitle || '신청 확인'}
        message={t.submitConfirmMessage || '상담을 신청하시겠습니까?'}
        confirmText={t.submit || '신청하기'}
        cancelText={dictionary.common.cancel || '취소'}
      />
    </>
  );
}
