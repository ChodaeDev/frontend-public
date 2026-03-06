'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { FormInput, FormTextarea } from '@/components/ui/FormInput';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { BirthdayPicker } from '@/components/ui/BirthdayPicker';
import { errorStyle } from '@/components/ui/form-styles';
import {
  signupSchema,
  formDataToObject,
  getFieldErrors,
  type FieldErrors,
  type SignupInput,
} from '@/lib/validations/auth';

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
        error: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.',
        fieldErrors: {},
        previousInput: rawData,
        success: false,
      };
    }
    return {
      error: err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.',
      fieldErrors: {},
      previousInput: rawData,
      success: false,
    };
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(signupAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/login');
    }
  }, [state.success, router]);

  return (
    <div className={'flex min-h-[calc(100vh-89px)] items-center justify-center py-8'}>
      <div className={'w-full max-w-2xl rounded-3xl bg-background-secondary p-10 shadow-2xl'}>
        <h1 className={'mb-2 text-center text-3xl font-bold text-main'}>{'회원가입'}</h1>
        <p className={'mb-8 text-center text-sm text-sub'}>
          {'아래 정보를 입력하여 회원가입을 완료해주세요.'}
        </p>

        <form action={formAction} className={'grid grid-cols-1 gap-2 md:gap-6 md:grid-cols-2'}>
          <FormInput
            label={'아이디'}
            name={'userId'}
            placeholder={'사용할 아이디를 입력하세요'}
            required
            error={state.fieldErrors.userId}
            defaultValue={state.previousInput.userId}
          />

          <FormInput
            label={'비밀번호'}
            name={'password'}
            type={'password'}
            placeholder={'비밀번호를 입력하세요'}
            required
            error={state.fieldErrors.password}
            defaultValue={state.previousInput.password}
          />

          <FormInput
            label={'이름'}
            name={'username'}
            placeholder={'이름을 입력하세요'}
            required
            error={state.fieldErrors.username}
            defaultValue={state.previousInput.username}
          />

          <FormInput
            label={'닉네임'}
            name={'nickname'}
            placeholder={'닉네임을 입력하세요'}
            error={state.fieldErrors.nickname}
            defaultValue={state.previousInput.nickname}
          />

          <FormInput
            label={'전화번호'}
            name={'phone'}
            type={'tel'}
            placeholder={'예: 01012345678'}
            required
            error={state.fieldErrors.phone}
            defaultValue={state.previousInput.phone}
          />

          <FormInput
            label={'교회명'}
            name={'church'}
            placeholder={'출석 중인 교회명을 입력하세요'}
            error={state.fieldErrors.church}
            defaultValue={state.previousInput.church}
          />

          <BirthdayPicker defaultValue={state.previousInput.birthday} />

          <FormTextarea
            label={'소개 및 비고'}
            name={'description'}
            placeholder={'상담 요청 사유 등 추가 정보를 입력하세요'}
            className={'md:col-span-2'}
            error={state.fieldErrors.description}
            defaultValue={state.previousInput.description}
          />

          {state.error && (
            <div className={`${ errorStyle } md:col-span-2`}>
              {state.error}
            </div>
          )}

          <div className={'md:col-span-2'}>
            <SubmitButton pendingText={'회원가입 중...'}>
              {'회원가입 완료'}
            </SubmitButton>
          </div>
        </form>

        <div className={'mt-6 text-center text-sm text-sub'}>
          {'이미 가입하셨나요?'}{' '}
          <Link href={'/login'} className={'cursor-pointer font-semibold text-accent1 hover:underline underline-offset-4'}>
            {'로그인'}
          </Link>
        </div>
      </div>
    </div>
  );
}
