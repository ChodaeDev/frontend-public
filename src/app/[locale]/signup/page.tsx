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
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/cn';
import { formatPhone, stripNonDigits } from '@/lib/format';

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

  const { ...body } = result.data;

  try {
    await fetchApi('/api/public/users/register', {
      method: 'POST',
      body: JSON.stringify({ ...body, level: 'general' }),
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
  const f = dictionary.userForm;
  const v = dictionary.validation as Record<string, Record<string, string>>;
  const user = useAuthStore((state) => state.user);
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  useEffect(() => {
    if (user) {
      router.replace(`/${ locale }`);
    }
  }, [user, router, locale]);

  useEffect(() => {
    if (state.success) {
      alert(t.successMessage || '회원가입이 완료되었습니다.');
      router.push(`/${ locale }/login`);
    }
  }, [state.success, router, locale, t.successMessage]);

  const getErrorMessage = (errorKey: string | null) => {
    if (!errorKey) return null;
    const errors = t.errors as Record<string, string>;
    return errors[errorKey] || errorKey;
  };

  // 실시간 validation 함수들
  const validateUserId = (value: string) => {
    if (!value) return v.userId?.required || '아이디를 입력해주세요';
    if (value.length < 4) return v.userId?.min || '아이디는 4자 이상이어야 합니다';
    if (value.length > 20) return v.userId?.max || '아이디는 20자 이하여야 합니다';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return v.userId?.pattern || '영문, 숫자, 언더스코어만 사용 가능합니다';
    return null;
  };

  const asyncValidateUserId = async (value: string) => {
    try {
      const res = await fetch(`/api/public/users/check-id?userId=${ encodeURIComponent(value) }`);
      if (!res.ok) return '아이디 확인 중 오류가 발생했습니다';
      const data = await res.json();
      if (data.exists) return '이미 사용중인 아이디입니다';
      return null;
    } catch {
      return '아이디 확인 중 오류가 발생했습니다';
    }
  };

  const validatePassword = (value: string) => {
    if (!value) return v.password?.required || '비밀번호를 입력해주세요';
    if (value.length < 8) return v.password?.min || '비밀번호는 8자 이상이어야 합니다';
    if (!/[A-Za-z]/.test(value)) return v.password?.letterRequired || '영문자를 포함해야 합니다';
    if (!/[0-9]/.test(value)) return v.password?.numberRequired || '숫자를 포함해야 합니다';
    return null;
  };

  const validatePasswordConfirm = (value: string) => {
    if (!value) return '비밀번호를 다시 입력해주세요';
    // password 필드 값을 직접 읽어 비교
    const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
    if (passwordInput && value !== passwordInput.value) return '비밀번호가 일치하지 않습니다';
    return null;
  };

  const validateUserName = (value: string) => {
    if (!value) return v.userName?.required || '이름을 입력해주세요';
    if (value.length < 2) return v.userName?.min || '이름은 2자 이상이어야 합니다';
    if (value.length > 20) return v.userName?.max || '이름은 20자 이하여야 합니다';
    if (!/^[a-zA-Z가-힣\s]+$/.test(value)) return v.userName?.pattern || '한글, 영문만 입력 가능합니다';
    return null;
  };

  const validateNickName = (value: string) => {
    if (value.length > 20) return v.nickName?.max || '닉네임은 20자 이하여야 합니다';
    if (value && !/^[a-zA-Z가-힣0-9\s]+$/.test(value)) return v.nickName?.pattern || '한글, 영문, 숫자만 입력 가능합니다';
    return null;
  };

  const validateChurch = (value: string) => {
    if (value.length > 50) return v.church?.max || '교회명은 50자 이하여야 합니다';
    return null;
  };

  const validateDescription = (value: string) => {
    if (value.length > 500) return v.description?.max || '소개는 500자 이하여야 합니다';
    return null;
  };

  const validatePhone = (value: string) => {
    if (!value) return v.phone?.required || '전화번호를 입력해주세요';
    if (!/^[0-9]+$/.test(value)) return v.phone?.pattern || '숫자만 입력해주세요';
    if (value.length < 9) return v.phone?.min || '전화번호는 9자리 이상이어야 합니다';
    if (value.length > 11) return v.phone?.max || '전화번호는 11자리 이하여야 합니다';
    return null;
  };

  return (
    <div className={'relative flex min-h-[calc(100vh-89px)] items-center justify-center py-8'}>
      {(isPending || user) && (
        <div
          className={'absolute inset-0 z-10 flex items-center justify-center bg-background backdrop-blur-sm'}
          aria-live={'polite'}
          aria-busy={'true'}
        >
          <div className={'size-10 animate-spin rounded-full border-4 border-gray8 border-t-accent2'} />
        </div>
      )}

      <div className={'w-full max-w-2xl rounded-3xl bg-background-secondary p-4 sm:p-10 sm:shadow-2xl animate-formSlideUp'}>
        <h1 className={'mb-2 text-center text-3xl font-bold text-main'}>{t.title || '회원가입'}</h1>
        <p className={'mb-8 text-center text-sm text-sub'}>
          {t.description || '아래 정보를 입력하여 회원가입을 완료해주세요.'}
        </p>

        <form action={formAction} className={'grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2'}>
          <FormInput
            label={t.userId || '아이디'}
            name={'userId'}
            placeholder={t.userIdPlaceholder || '사용할 아이디를 입력하세요'}
            required
            error={state.fieldErrors.userId}
            defaultValue={state.previousInput.userId}
            hint={v.userId?.hint || '영문, 숫자, 언더스코어 4~20자'}
            validate={validateUserId}
            asyncValidate={asyncValidateUserId}
            validMessage={'사용 가능한 아이디입니다'}
          />

          <FormInput
            label={f.userName || '이름'}
            name={'userName'}
            placeholder={f.userNamePlaceholder || '이름을 입력하세요'}
            required
            error={state.fieldErrors.userName}
            defaultValue={state.previousInput.userName}
            hint={v.userName?.hint || '2~20자'}
            validate={validateUserName}
          />

          <FormInput
            label={t.password || '비밀번호'}
            name={'password'}
            type={'password'}
            placeholder={t.passwordPlaceholder || '비밀번호를 입력하세요'}
            required
            error={state.fieldErrors.password}
            defaultValue={state.previousInput.password}
            hint={v.password?.hint || '영문, 숫자 포함 8자 이상'}
            validate={validatePassword}
          />

          <FormInput
            label={t.passwordConfirm || '비밀번호 재입력'}
            name={'passwordConfirm'}
            type={'password'}
            placeholder={t.passwordConfirmPlaceholder || '비밀번호를 다시 입력하세요'}
            required
            error={state.fieldErrors.passwordConfirm}
            defaultValue={state.previousInput.passwordConfirm}
            validate={validatePasswordConfirm}
          />

          <FormInput
            label={f.nickName || '닉네임'}
            name={'nickName'}
            placeholder={f.nickNamePlaceholder || '닉네임을 입력하세요'}
            error={state.fieldErrors.nickName}
            defaultValue={state.previousInput.nickName}
            hint={v.nickName?.hint || '20자 이하'}
            validate={validateNickName}
          />

          <FormInput
            label={f.phone || '전화번호'}
            name={'phone'}
            type={'tel'}
            placeholder={'010-1234-5678'}
            required
            error={state.fieldErrors.phone}
            defaultValue={state.previousInput.phone}
            hint={v.phone?.hint || '숫자만 10~11자리'}
            validate={validatePhone}
            format={formatPhone}
            parse={stripNonDigits}
          />

          <FormInput
            label={f.church || '교회명'}
            name={'church'}
            placeholder={f.churchPlaceholder || '출석 중인 교회명을 입력하세요'}
            error={state.fieldErrors.church}
            defaultValue={state.previousInput.church}
            hint={v.church?.hint || '50자 이하'}
            validate={validateChurch}
          />

          <BirthdayPicker
            label={f.birthday || '생년월일'}
            defaultValue={state.previousInput.birthday}
          />

          <FormTextarea
            label={f.introduce || '소개 및 비고'}
            name={'description'}
            placeholder={f.introducePlaceholder || '추가 정보를 입력하세요'}
            className={'md:col-span-2'}
            error={state.fieldErrors.description}
            defaultValue={state.previousInput.description}
            hint={v.description?.hint || '500자 이하'}
            maxLength={500}
            validate={validateDescription}
          />

          {state.error && (
            <div className={cn(errorStyle, 'md:col-span-2')}>
              {getErrorMessage(state.error)}
            </div>
          )}

          <div className={'md:col-span-2'}>
            <SubmitButton pendingText={t.submitting || '회원가입 중...'} className={'w-full rounded-full'}>
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
