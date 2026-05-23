'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import FormSelect from '@/components/ui/FormSelect';
import { fetchApi } from '@/lib/api';
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
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/cn';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { CounselingDetailData } from '@/types/board';

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
  const user = useAppSelector((state) => state.auth.user);

  const [postLoading, setPostLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [counselType, setCounselType] = useState('');
  const [content, setContent] = useState('');
  const [phone, setPhone] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CounselingInput>>({});

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace(`/${ locale }/login?returnTo=${ encodeURIComponent(pathname) }`);
    }
  }, [user, router, locale, pathname]);

  useEffect(() => {
    async function fetchPost() {
      setPostLoading(true);
      try {
        const { data } = await fetchApi<CounselingDetailData>(`/api/board/counseling/detail/${ postId }`);
        if (data) {
          setTitle(data.title);
          setCounselType(data.counselType);
          setContent(data.content);
          setPhone(data.phone);
          setIsPrivate(data.isPrivate === 1);
        }
      } catch {
        router.replace(`/${ locale }/board/counseling`);
      } finally {
        setPostLoading(false);
      }
    }
    fetchPost();
  }, [postId, locale, router]);

  const getErrorMessage = (errorKey: string | null) => {
    if (!errorKey) return null;
    const errors = t.errors as Record<string, string> | undefined;
    return errors?.[errorKey] || errorKey;
  };

  const handleSubmit = async () => {
    const raw = { title, counselType, content, phone };
    const result = counselingSchema.safeParse(raw);
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error));
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    setError(null);
    try {
      await fetchApi(`/api/board/counseling/edit/${ postId }`, {
        method: 'PUT',
        body: JSON.stringify({
          title: result.data.title,
          content: result.data.content,
          userId: user!.userId,
          userName: user!.userName,
          isPrivate,
          phone: result.data.phone,
          counselType: result.data.counselType,
        }),
      });
      router.push(`/${ locale }/board/counseling/${ postId }`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'generic');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || postLoading) {
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
          <label htmlFor={'content'} className={labelStyle}>
            {t.content || '내용'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <textarea
            id={'content'}
            name={'content'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t.contentPlaceholder || '상담 내용을 자세히 작성해주세요'}
            rows={8}
            className={cn(inputStyle, 'resize-none', fieldErrors.content && 'border-error')}
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
            value={user.userName}
            disabled
            className={cn(inputStyle, 'bg-gray7 cursor-not-allowed')}
          />
        </div>

        <div>
          <label htmlFor={'phone'} className={labelStyle}>
            {t.phone || '연락처'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <input
            id={'phone'}
            name={'phone'}
            type={'tel'}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.phonePlaceholder || '연락 가능한 전화번호를 입력하세요'}
            autoComplete={'tel'}
            className={cn(inputStyle, fieldErrors.phone && 'border-error')}
          />
          {fieldErrors.phone && (
            <p className={'mt-1 text-xs text-error'}>{fieldErrors.phone}</p>
          )}
        </div>

        <div className={'flex items-center gap-2'}>
          <input
            id={'isPrivate'}
            type={'checkbox'}
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className={'h-4 w-4 rounded border-gray7 accent-accent1'}
          />
          <label htmlFor={'isPrivate'} className={'text-sm text-main'}>
            {t.isPrivate || '비공개'}
          </label>
        </div>

        {error && (
          <div className={errorStyle}>
            {getErrorMessage(error)}
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
            onClick={() => setShowEditModal(true)}
            disabled={submitting}
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
        confirmText={submitting ? (t.saving || '저장 중...') : (t.save || '저장')}
        cancelText={dictionary.common.cancel || '취소'}
      />
    </>
  );
}
