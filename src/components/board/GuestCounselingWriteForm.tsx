'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleCheck, Eye, EyeOff, Lock, TriangleAlert } from 'lucide-react';
import FormSelect from '@/components/ui/FormSelect';
import { FormInput } from '@/components/ui/form';
import {
  inputStyle,
  errorStyle,
  labelStyle,
  cancelButtonStyle,
  buttonPrimaryStyle,
} from '@/components/ui/form-styles';
import {
  guestCounselingSchema,
  guestPasswordMaxLength,
  type GuestCounselingInput,
} from '@/lib/validations/counseling';
import { getFieldErrors, type FieldErrors } from '@/lib/validations/auth';
import { useTranslation } from '@/i18n/client';
import { useAuthStore } from '@/store/authStore';
import { useHydrated } from '@/lib/hooks/useHydrated';
import { cn } from '@/lib/cn';
import { stripNonDigits } from '@/lib/format';
import PhoneInput from '@/components/ui/PhoneInput';
import RichTextEditor from '@/components/ui/RichTextEditor';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { counselingKeys, createGuestCounselingPost } from '@/lib/queries/counseling';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string)=> void;
  placeholder: string;
  error?: string;
  showLabel: string;
  hideLabel: string;
}

function PasswordField({ id, label, value, onChange, placeholder, error, showLabel, hideLabel }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelStyle}>
        {label}
        <span className={'text-error'}>{' *'}</span>
      </label>
      <div className={'relative'}>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={guestPasswordMaxLength}
          autoComplete={'new-password'}
          className={cn(inputStyle, 'pr-11', error && 'border-error')}
        />
        <button
          type={'button'}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? hideLabel : showLabel}
          className={'absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray3 hover:text-main'}
        >
          {visible ? <EyeOff className={'size-4'} /> : <Eye className={'size-4'} />}
        </button>
      </div>
      {error && <p className={'mt-1 text-xs text-error'}>{error}</p>}
    </div>
  );
}

export default function GuestCounselingWriteForm() {
  const router = useRouter();
  const { dictionary, locale } = useTranslation();
  const t = dictionary.board;
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const [fieldErrors, setFieldErrors] = useState<FieldErrors<GuestCounselingInput>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previousInput, setPreviousInput] = useState<Partial<GuestCounselingInput>>({});
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordNoticeAgree, setPasswordNoticeAgree] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<number | null>(null);

  // 로그인한 사용자는 회원 폼으로
  useEffect(() => {
    if (user && createdPostId === null) {
      router.replace(`/${ locale }/board/counseling/write/member`);
    }
  }, [user, router, locale, createdPostId]);

  const { mutate: submitPost, isPending } = useMutation({
    mutationFn: createGuestCounselingPost,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: counselingKeys.all });
      setCreatedPostId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const rawData = {
      title: formData.get('title') as string,
      counselType: formData.get('counselType') as string,
      content,
      guestName: formData.get('guestName') as string,
      phone: stripNonDigits(phone),
      password,
      passwordConfirm,
      passwordNoticeAgree,
      agreePrivacy,
    };

    const result = guestCounselingSchema.safeParse(rawData);
    if (!result.success) {
      const errors = getFieldErrors(result.error);
      // 다른 칸 에러가 있으면 zod의 refine(비밀번호 일치)이 실행되지 않으므로 직접 채운다
      if (!errors.passwordConfirm && passwordConfirm && password !== passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 서로 다릅니다';
      }
      setFieldErrors(errors);
      setPreviousInput(rawData as Partial<GuestCounselingInput>);
      return;
    }

    setFieldErrors({});
    setSubmitError(null);

    const { title, counselType, guestName, phone: phoneDigits } = result.data;
    submitPost({
      title,
      counselType,
      content: result.data.content,
      guestName,
      phone: phoneDigits,
      password: result.data.password,
      agreePrivacy: true,
    });
  };

  // 등록 완료: 비밀번호를 다시 한번 각인시킨다
  if (createdPostId !== null) {
    return (
      <div className={'flex flex-col items-center gap-6 rounded-xl border border-gray8 px-6 py-12 text-center'}>
        <CircleCheck className={'size-12 text-accent1'} strokeWidth={1.5} />
        <div className={'flex flex-col gap-2'}>
          <h2 className={'text-xl font-bold text-main'}>{t.guestCompleteTitle || '상담 신청이 접수되었습니다'}</h2>
          <p className={'text-sm leading-relaxed text-sub'}>
            {t.guestCompleteBody || '글 번호와 비밀번호를 꼭 메모해 두세요. 답변을 확인하러 올 때마다 비밀번호를 입력해야 합니다.'}
          </p>
        </div>
        <div className={'flex items-center gap-3 rounded-lg bg-background-secondary px-5 py-3'}>
          <span className={'text-sm text-sub'}>{t.guestCompletePostNo || '글 번호'}</span>
          <span className={'text-lg font-bold text-main'}>{createdPostId}</span>
        </div>
        <div className={'flex flex-wrap justify-center gap-3'}>
          <Link href={`/${ locale }/board/counseling`} className={cn(cancelButtonStyle, 'text-center')}>
            {t.backToList || '목록으로'}
          </Link>
          <Link href={`/${ locale }/board/counseling/${ createdPostId }`} className={cn(buttonPrimaryStyle, 'text-center')}>
            {t.viewMyPost || '내 글 보기'}
          </Link>
        </div>
      </div>
    );
  }

  if (!hydrated || user) return null;

  return (
    <>
      <form ref={formRef} className={'grid grid-cols-1 gap-6'} onSubmit={(e) => e.preventDefault()}>
        <p className={'flex items-center gap-2 rounded-lg bg-background-secondary px-4 py-3 text-sm text-sub'}>
          <Lock className={'size-4 shrink-0 text-gray3'} />
          {t.allPostsPrivateNotice || '상담글은 모두 비공개로 올라갑니다. 관리자와 작성자만 볼 수 있습니다.'}
        </p>

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
            <p className={'mt-1 text-xs text-error'}>{fieldErrors.counselType}</p>
          )}
        </div>

        <div>
          <label className={labelStyle}>
            {t.content || '내용'}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <RichTextEditor
            content={previousInput.content ?? ''}
            onChange={setContent}
            placeholder={t.contentPlaceholder || '상담 내용을 자세히 작성해주세요'}
            error={!!fieldErrors.content}
          />
          {fieldErrors.content && (
            <p className={'mt-1 text-xs text-error'}>{fieldErrors.content}</p>
          )}
        </div>

        <div className={'grid grid-cols-1 gap-6 md:grid-cols-2'}>
          <FormInput
            label={t.guestName || '이름'}
            name={'guestName'}
            placeholder={t.guestNamePlaceholder || '이름을 입력하세요'}
            required
            autoComplete={'name'}
            error={fieldErrors.guestName}
            defaultValue={previousInput.guestName}
          />

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
        </div>

        {/* 비밀번호 + 분실 경고 */}
        <section className={'flex flex-col gap-4 rounded-xl border border-warning/50 bg-warning/5 p-5'}>
          <div className={'flex items-start gap-2.5'}>
            <TriangleAlert className={'mt-0.5 size-5 shrink-0 text-warning'} />
            <div className={'flex flex-col gap-1'}>
              <p className={'font-semibold text-main'}>{t.passwordWarningTitle || '비밀번호를 꼭 기억해 주세요'}</p>
              <p className={'text-sm leading-relaxed text-sub'}>
                {t.passwordWarningBody || '비회원 글은 이 비밀번호로만 열 수 있습니다. 잊어버리면 글 내용도 상담 답변도 다시 볼 수 없고, 비밀번호를 찾아 드릴 방법도 없습니다.'}
              </p>
            </div>
          </div>

          <div className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>
            <PasswordField
              id={'password'}
              label={t.postPassword || '글 비밀번호'}
              value={password}
              onChange={setPassword}
              placeholder={t.postPasswordPlaceholder || '4자 이상 입력하세요'}
              error={fieldErrors.password}
              showLabel={t.showPassword || '비밀번호 보기'}
              hideLabel={t.hidePassword || '비밀번호 숨기기'}
            />
            <PasswordField
              id={'passwordConfirm'}
              label={t.postPasswordConfirm || '비밀번호 확인'}
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder={t.postPasswordConfirmPlaceholder || '한 번 더 입력하세요'}
              error={fieldErrors.passwordConfirm}
              showLabel={t.showPassword || '비밀번호 보기'}
              hideLabel={t.hidePassword || '비밀번호 숨기기'}
            />
          </div>

          <div>
            <label className={'flex cursor-pointer items-start gap-2 text-sm text-main'}>
              <input
                type={'checkbox'}
                checked={passwordNoticeAgree}
                onChange={(e) => setPasswordNoticeAgree(e.target.checked)}
                className={'mt-0.5 h-4 w-4 shrink-0 rounded border-gray7 accent-accent1'}
              />
              {t.passwordWarningAgree || '비밀번호를 잊으면 글을 다시 열 수 없다는 점을 확인했습니다.'}
            </label>
            {fieldErrors.passwordNoticeAgree && (
              <p className={'mt-1 text-xs text-error'}>{fieldErrors.passwordNoticeAgree}</p>
            )}
          </div>
        </section>

        {/* 개인정보 수집·이용 동의 */}
        <section className={'flex flex-col gap-3 rounded-xl border border-gray8 p-5'}>
          <p className={'font-semibold text-main'}>{t.privacyTitle || '개인정보 수집·이용 동의'}</p>
          <ul className={'flex flex-col gap-1 text-sm text-sub'}>
            <li>{t.privacyItems || '수집 항목: 이름, 연락처'}</li>
            <li>{t.privacyPurpose || '이용 목적: 상담 진행과 상담 관련 연락'}</li>
            <li>{t.privacyRetention || '보관 기간: 글을 삭제할 때까지'}</li>
          </ul>
          <p className={'text-xs text-gray3'}>{t.privacyRefuseNote || '동의하지 않으면 비회원 상담을 신청할 수 없습니다.'}</p>
          <div>
            <label className={'flex cursor-pointer items-start gap-2 text-sm text-main'}>
              <input
                type={'checkbox'}
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className={'mt-0.5 h-4 w-4 shrink-0 rounded border-gray7 accent-accent1'}
              />
              {t.privacyAgree || '개인정보 수집·이용에 동의합니다. (필수)'}
            </label>
            {fieldErrors.agreePrivacy && (
              <p className={'mt-1 text-xs text-error'}>{fieldErrors.agreePrivacy}</p>
            )}
          </div>
        </section>

        {submitError && (
          <div className={errorStyle}>
            {getErrorMessage(submitError)}
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
        message={t.guestSubmitConfirmMessage || '비밀번호를 기억하고 계신가요? 이대로 상담을 신청합니다.'}
        confirmText={t.submit || '신청하기'}
        cancelText={dictionary.common.cancel || '취소'}
      />
    </>
  );
}
