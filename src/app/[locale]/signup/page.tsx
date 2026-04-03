'use client';

import { useActionState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { FormInput, FormTextarea, SubmitButton } from '@/components/ui/form';
import { BirthdayPicker } from '@/components/ui/BirthdayPicker';
import { errorStyle } from '@/components/ui/form-styles';
import {
  signupSchema,
  formDataToObject,
  getFieldErrors,
  type FieldErrors,
  type SignupInput,
} from '@/lib/validations/auth';
import { useTranslation } from '@/i18n/client';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/cn';

type FormState = {
  error: string | null;
  fieldErrors: FieldErrors<SignupInput>;
  previousInput: Partial<SignupInput>;
  success: boolean;
};

const initialState: FormState = {
  error: null,
  fieldErrors: {},
  previousInput: {},
  success: false,
};

async function signupAction(prev: FormState, formData: FormData): Promise<FormState> {
  const rawData = formDataToObject(formData) as Partial<SignupInput>;

  // Zod 검증
  const result = signupSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: null,
      fieldErrors: getFieldErrors(result.error),
      previousInput: rawData,
      success: false,
    };
  }

  const body = {
    ...result.data,
    level: 'general',
  };

  try {
    await fetchApi('/api/public/users/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return { error: null, fieldErrors: {}, previousInput: {}, success: true };
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return {
        error: 'serverError',
        fieldErrors: {},
        previousInput: rawData,
        success: false,
      };
    }
    return {
      error: err instanceof Error ? err.message : 'generic',
      fieldErrors: {},
      previousInput: rawData,
      success: false,
    };
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { dictionary } = useTranslation();
  const t = dictionary.signup;
  const user = useAppSelector((state) => state.auth.user);
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  useEffect(() => {
    if (user) {
      router.replace(`/${ locale }`);
    }
  }, [user, router, locale]);

  useEffect(() => {
    if (state.success) {
      router.push(`/${ locale }/login`);
    }
  }, [state.success, router, locale]);

  const getErrorMessage = (errorKey: string | null) => {
    if (!errorKey) return null;
    const errors = t.errors as Record<string, string>;
    return errors[errorKey] || errorKey;
  };

  return (
    <div className={'relative flex min-h-[calc(100vh-89px)] items-center justify-center py-8'}>
      {(isPending || state.success || user) && (
        <div
          className={'absolute inset-0 z-10 flex items-center justify-center bg-background backdrop-blur-sm'}
          aria-live={'polite'}
          aria-busy={'true'}
        >
          <div className={'size-10 animate-spin rounded-full border-4 border-gray8 border-t-accent2'} />
        </div>
      )}

      <div className={'w-full max-w-2xl rounded-3xl bg-background-secondary p-4 sm:p-10 sm:shadow-2xl'}>
        <h1 className={'mb-2 text-center text-3xl font-bold text-main'}>{t.title || '회원가입'}</h1>
        <p className={'mb-8 text-center text-sm text-sub'}>
          {t.description || '아래 정보를 입력하여 회원가입을 완료해주세요.'}
        </p>

        <form action={formAction} className={'grid grid-cols-1 gap-2 md:gap-6 md:grid-cols-2'}>
          <FormInput
            label={t.userId || '아이디'}
            name={'userId'}
            placeholder={t.userIdPlaceholder || '사용할 아이디를 입력하세요'}
            required
            error={state.fieldErrors.userId}
            defaultValue={state.previousInput.userId}
          />

          <FormInput
            label={t.password || '비밀번호'}
            name={'password'}
            type={'password'}
            placeholder={t.passwordPlaceholder || '비밀번호를 입력하세요'}
            required
            error={state.fieldErrors.password}
            defaultValue={state.previousInput.password}
          />

          <FormInput
            label={t.username || '이름'}
            name={'username'}
            placeholder={t.usernamePlaceholder || '이름을 입력하세요'}
            required
            error={state.fieldErrors.username}
            defaultValue={state.previousInput.username}
          />

          <FormInput
            label={t.nickname || '닉네임'}
            name={'nickname'}
            placeholder={t.nicknamePlaceholder || '닉네임을 입력하세요'}
            error={state.fieldErrors.nickname}
            defaultValue={state.previousInput.nickname}
          />

          <FormInput
            label={t.phone || '전화번호'}
            name={'phone'}
            type={'tel'}
            placeholder={t.phonePlaceholder || '예: 01012345678'}
            required
            error={state.fieldErrors.phone}
            defaultValue={state.previousInput.phone}
          />

          <FormInput
            label={t.church || '교회명'}
            name={'church'}
            placeholder={t.churchPlaceholder || '출석 중인 교회명을 입력하세요'}
            error={state.fieldErrors.church}
            defaultValue={state.previousInput.church}
          />

          <BirthdayPicker
            label={t.birthday || '생년월일'}
            defaultValue={state.previousInput.birthday}
          />

          <FormTextarea
            label={t.bio || '소개 및 비고'}
            name={'description'}
            placeholder={t.bioPlaceholder || '상담 요청 사유 등 추가 정보를 입력하세요'}
            className={'md:col-span-2'}
            error={state.fieldErrors.description}
            defaultValue={state.previousInput.description}
          />

          {state.error && (
            <div className={cn(errorStyle, 'md:col-span-2')}>
              {getErrorMessage(state.error)}
            </div>
          )}

          <div className={'md:col-span-2'}>
            <SubmitButton pendingText={t.submitting || '회원가입 중...'}>
              {t.submit || '회원가입 완료'}
            </SubmitButton>
          </div>
        </form>

        <div className={'mt-6 text-center text-sm text-sub'}>
          {t.hasAccount || '이미 가입하셨나요?'}{' '}
          <Link href={`/${ locale }/login`} className={'cursor-pointer font-semibold text-accent1 hover:underline underline-offset-4'}>
            {t.loginLink || '로그인'}
          </Link>
        </div>
      </div>
    </div>
  );
}
