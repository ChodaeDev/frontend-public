'use client';

import { useActionState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { FormInput, SubmitButton } from '@/components/ui/form';
import { errorStyle } from '@/components/ui/form-styles';
import {
  passwordChangeSchema,
  formDataToObject,
  getFieldErrors,
  type FieldErrors,
  type PasswordChangeInput,
} from '@/lib/validations/auth';
import { useTranslation } from '@/i18n/client';
import { useAuthStore } from '@/store/authStore';

type FormState = {
  error: string | null;
  fieldErrors: FieldErrors<PasswordChangeInput>;
  previousInput: Partial<PasswordChangeInput>;
  success: boolean;
};

const initialState: FormState = {
  error: null,
  fieldErrors: {},
  previousInput: {},
  success: false,
};

async function changePasswordAction(prev: FormState, formData: FormData): Promise<FormState> {
  const rawData = formDataToObject(formData) as Partial<PasswordChangeInput>;

  const result = passwordChangeSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: null,
      fieldErrors: getFieldErrors(result.error),
      previousInput: rawData,
      success: false,
    };
  }

  try {
    await fetchApi('/api/public/users/password', {
      method: 'PUT',
      body: JSON.stringify(result.data),
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

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className={'flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4'}>
      <label className={'shrink-0 sm:w-40 text-sm font-medium text-main sm:pt-3'}>
        {label}
        {required && <span className={'text-error'}>{' *'}</span>}
      </label>
      <div className={'flex-1 min-w-0'}>
        {children}
      </div>
    </div>
  );
}

export default function PasswordPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { dictionary } = useTranslation();
  const t = (dictionary.mypage as Record<string, unknown>).passwordChange as Record<string, unknown>;
  const errors = (t?.errors || {}) as Record<string, string>;
  const v = dictionary.validation as Record<string, Record<string, string>>;
  const user = useAuthStore((state) => state.user);
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);

  // 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!user) {
      router.replace(`/${ locale }/login?returnTo=${ encodeURIComponent(`/${ locale }/mypage/password`) }`);
    }
  }, [user, router, locale]);

  const getErrorMessage = (errorKey: string | null) => {
    if (!errorKey) return null;
    return errors[errorKey] || errorKey;
  };

  // TODO: 백엔드 API 추가 후 onBlur 시 현재 비밀번호 검증
  // POST /api/public/users/verify-password
  // Request:  { "currentPassword": "string" }
  // Response: { "success": true/false, "message": "string" }
  // 인증: Authorization: Bearer <token> 필요
  const validateCurrentPassword = (value: string) => {
    if (!value) return '현재 비밀번호를 입력해주세요';
    return null;
  };

  const validateNewPassword = (value: string) => {
    if (!value) return v.password?.required || '새 비밀번호를 입력해주세요';
    if (value.length < 8) return v.password?.min || '비밀번호는 8자 이상이어야 합니다';
    if (!/[A-Za-z]/.test(value)) return v.password?.letterRequired || '영문자를 포함해야 합니다';
    if (!/[0-9]/.test(value)) return v.password?.numberRequired || '숫자를 포함해야 합니다';
    return null;
  };

  const validateNewPasswordConfirm = (value: string) => {
    if (!value) return '새 비밀번호를 다시 입력해주세요';
    const newPasswordInput = document.querySelector<HTMLInputElement>('input[name="newPassword"]');
    if (newPasswordInput && value !== newPasswordInput.value) return '새 비밀번호가 일치하지 않습니다';
    return null;
  };

  if (!user) return null;

  return (
    <div className={'relative'}>
      {isPending && (
        <div
          className={'absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm'}
          aria-live={'polite'}
          aria-busy={'true'}
        >
          <div className={'size-10 animate-spin rounded-full border-4 border-gray8 border-t-accent2'} />
        </div>
      )}

      <h1 className={'text-2xl font-bold text-main mb-2'}>{(t?.title as string) || '비밀번호 변경'}</h1>
      <p className={'text-sm text-sub mb-8'}>
        {(t?.description as string) || '현재 비밀번호를 확인한 후 새 비밀번호로 변경할 수 있습니다.'}
      </p>

      {state.success && (
        <div className={'mb-6 rounded-lg bg-accent1/10 px-4 py-3 text-sm text-accent1'}>
          {(t?.success as string) || '비밀번호가 변경되었습니다.'}
        </div>
      )}

      <form action={formAction} className={'flex flex-col gap-6 w-full'}>
        <FormRow label={(t?.currentPassword as string) || '현재 비밀번호'} required>
          <FormInput
            label={''}
            name={'currentPassword'}
            type={'password'}
            placeholder={(t?.currentPasswordPlaceholder as string) || '현재 비밀번호를 입력하세요'}
            error={state.fieldErrors.currentPassword}
            validate={validateCurrentPassword}
          />
        </FormRow>

        <FormRow label={(t?.newPassword as string) || '새 비밀번호'} required>
          <FormInput
            label={''}
            name={'newPassword'}
            type={'password'}
            placeholder={(t?.newPasswordPlaceholder as string) || '새 비밀번호를 입력하세요'}
            error={state.fieldErrors.newPassword}
            hint={v.password?.hint || '영문, 숫자 포함 8자 이상'}
            validate={validateNewPassword}
          />
        </FormRow>

        <FormRow label={(t?.newPasswordConfirm as string) || '새 비밀번호 확인'} required>
          <FormInput
            label={''}
            name={'newPasswordConfirm'}
            type={'password'}
            placeholder={(t?.newPasswordConfirmPlaceholder as string) || '새 비밀번호를 다시 입력하세요'}
            error={state.fieldErrors.newPasswordConfirm}
            validate={validateNewPasswordConfirm}
          />
        </FormRow>

        {state.error && (
          <div className={errorStyle}>
            {getErrorMessage(state.error)}
          </div>
        )}

        <div className={'flex justify-end'}>
          <SubmitButton
            pendingText={(t?.submitting as string) || '변경 중...'}
            className={'w-40 rounded-md bg-accent1 px-4 py-3 text-sm font-semibold text-inverse shadow-md transition duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent1/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'}
          >
            {(t?.submit as string) || '변경'}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
