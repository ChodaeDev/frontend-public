'use client';

import { useActionState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { FormInput, FormTextarea, SubmitButton } from '@/components/ui/form';
import { BirthdayPicker } from '@/components/ui/BirthdayPicker';
import { errorStyle } from '@/components/ui/form-styles';
import {
  profileSchema,
  formDataToObject,
  getFieldErrors,
  type FieldErrors,
  type ProfileInput,
} from '@/lib/validations/auth';
import { useTranslation } from '@/i18n/client';
import { useAuthStore } from '@/store/authStore';
import { formatPhone, stripNonDigits } from '@/lib/format';

type FormState = {
  error: string | null;
  fieldErrors: FieldErrors<ProfileInput>;
  previousInput: Partial<ProfileInput>;
  success: boolean;
};

const initialState: FormState = {
  error: null,
  fieldErrors: {},
  previousInput: {},
  success: false,
};

async function updateProfileAction(prev: FormState, formData: FormData): Promise<FormState> {
  const rawData = formDataToObject(formData) as Partial<ProfileInput>;

  const result = profileSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: null,
      fieldErrors: getFieldErrors(result.error),
      previousInput: rawData,
      success: false,
    };
  }

  try {
    await fetchApi('/api/public/users/update-profile', {
      method: 'PUT',
      body: JSON.stringify(result.data),
    });

    return { error: null, fieldErrors: {}, previousInput: rawData, success: true };
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

// label + input 좌우 배치 래퍼 (모바일은 세로)
function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className={'flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4'}>
      <label className={'shrink-0 sm:w-32 text-sm font-medium text-main sm:pt-3'}>
        {label}
        {required && <span className={'text-error'}>{' *'}</span>}
      </label>
      <div className={'flex-1 min-w-0'}>
        {children}
      </div>
    </div>
  );
}

export default function MyPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { dictionary } = useTranslation();
  const t = dictionary.mypage as Record<string, unknown>;
  const f = dictionary.userForm as Record<string, string>;
  const v = dictionary.validation as Record<string, Record<string, string>>;
  const errors = (t.errors || {}) as Record<string, string>;
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  // 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!user) {
      router.replace(`/${ locale }/login?returnTo=${ encodeURIComponent(`/${ locale }/mypage`) }`);
    }
  }, [user, router, locale]);

  // 성공 시 로컬 유저 정보 업데이트
  useEffect(() => {
    if (!state.success || !user || !state.previousInput) return;
    setUser({
      ...user,
      userName: state.previousInput.userName || user.userName,
      nickName: state.previousInput.nickName || user.nickName,
      phone: state.previousInput.phone || user.phone,
      church: state.previousInput.church || user.church,
      birthday: state.previousInput.birthday || user.birthday,
      description: state.previousInput.description || user.description,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  const getErrorMessage = (errorKey: string | null) => {
    if (!errorKey) return null;
    return errors[errorKey] || errorKey;
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

  const validatePhone = (value: string) => {
    if (!value) return v.phone?.required || '전화번호를 입력해주세요';
    if (!/^[0-9]+$/.test(value)) return v.phone?.pattern || '숫자만 입력해주세요';
    if (value.length < 9) return v.phone?.min || '전화번호는 9자리 이상이어야 합니다';
    if (value.length > 11) return v.phone?.max || '전화번호는 11자리 이하여야 합니다';
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

      <h1 className={'text-2xl font-bold text-main mb-2'}>{(t.profile as string) || '프로필 수정'}</h1>
      <p className={'text-sm text-sub mb-8'}>
        {(t.description as string) || '개인정보를 확인하고 수정할 수 있습니다.'}
      </p>

      {state.success && (
        <div className={'mb-6 rounded-lg bg-accent1/10 px-4 py-3 text-sm text-accent1'}>
          {(t.success as string) || '프로필이 수정되었습니다.'}
        </div>
      )}

      <form action={formAction} className={'flex flex-col gap-4 w-full'}>
        {/* 아이디 (수정 불가) */}
        <FormRow label={dictionary.signup.userId || '아이디'}>
          <FormInput
            label={''}
            name={'_userId'}
            defaultValue={user.userId}
            disabled
          />
        </FormRow>

        {/* 이름 */}
        <FormRow label={f.userName || '이름'} required>
          <FormInput
            label={''}
            name={'userName'}
            placeholder={f.userNamePlaceholder || '이름을 입력하세요'}
            error={state.fieldErrors.userName}
            defaultValue={state.previousInput.userName || user.userName}
            hint={v.userName?.hint || '2~20자'}
            validate={validateUserName}
          />
        </FormRow>

        {/* 닉네임 */}
        <FormRow label={f.nickName || '닉네임'}>
          <FormInput
            label={''}
            name={'nickName'}
            placeholder={f.nickNamePlaceholder || '닉네임을 입력하세요'}
            error={state.fieldErrors.nickName}
            defaultValue={state.previousInput.nickName || user.nickName}
            hint={v.nickName?.hint || '20자 이하'}
            validate={validateNickName}
          />
        </FormRow>

        {/* 전화번호 */}
        <FormRow label={f.phone || '전화번호'} required>
          <FormInput
            label={''}
            name={'phone'}
            type={'tel'}
            placeholder={'010-1234-5678'}
            error={state.fieldErrors.phone}
            defaultValue={state.previousInput.phone || user.phone}
            hint={v.phone?.hint || '숫자만 10~11자리'}
            validate={validatePhone}
            format={formatPhone}
            parse={stripNonDigits}
          />
        </FormRow>

        {/* 교회명 */}
        <FormRow label={f.church || '교회명'}>
          <FormInput
            label={''}
            name={'church'}
            placeholder={f.churchPlaceholder || '출석 중인 교회명을 입력하세요'}
            error={state.fieldErrors.church}
            defaultValue={state.previousInput.church || user.church}
            hint={v.church?.hint || '50자 이하'}
            validate={validateChurch}
          />
        </FormRow>

        {/* 생년월일 */}
        <FormRow label={f.birthday || '생년월일'}>
          <BirthdayPicker
            label={''}
            defaultValue={state.previousInput.birthday || user.birthday}
          />
        </FormRow>

        {/* 소개 및 비고 */}
        <FormRow label={f.introduce || '소개 및 비고'}>
          <FormTextarea
            label={''}
            name={'description'}
            placeholder={f.introducePlaceholder || '추가 정보를 입력하세요'}
            error={state.fieldErrors.description}
            defaultValue={state.previousInput.description || user.description}
            validate={validateDescription}
            hint={v.description?.hint || '500자 이하'}
            maxLength={500}
          />
        </FormRow>

        {state.error && (
          <div className={errorStyle}>
            {getErrorMessage(state.error)}
          </div>
        )}

        <div className={'flex justify-end'}>
          <SubmitButton
            pendingText={(t.submitting as string) || '저장 중...'}
            className={'w-40 rounded-md bg-accent1 px-4 py-3 text-sm font-semibold text-inverse shadow-md transition duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent1/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'}
          >
            {(t.submit as string) || '저장'}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
