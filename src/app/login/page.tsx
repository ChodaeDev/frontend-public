'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { setAuth, setUser } from '@/store/authSlice';
import { fetchApi } from '@/lib/api';
import { FormInput } from '@/components/ui/FormInput';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { errorStyle, buttonSecondaryStyle } from '@/components/ui/form-styles';
import {
  loginSchema,
  formDataToObject,
  getFieldErrors,
  type FieldErrors,
  type LoginInput,
} from '@/lib/validations/auth';
import type { UserInfo } from '@/store/authSlice';

type LoginPayload = {
  user: UserInfo;
  token: string;
} & UserInfo;

type FormState = {
  error: string | null;
  fieldErrors: FieldErrors<LoginInput>;
  previousInput: Partial<LoginInput>;
  success: boolean;
  payload: LoginPayload | null;
};

const initialState: FormState = {
  error: null,
  fieldErrors: {},
  previousInput: {},
  success: false,
  payload: null,
};

async function loginAction(prev: FormState, formData: FormData): Promise<FormState> {
  const rawData = formDataToObject(formData) as Partial<LoginInput>;

  // Zod 검증
  const result = loginSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: null,
      fieldErrors: getFieldErrors(result.error),
      previousInput: rawData,
      success: false,
      payload: null,
    };
  }

  const { userId, password } = result.data;

  try {
    const { data } = await fetchApi<LoginPayload>('/api/public/users/login', {
      method: 'POST',
      body: JSON.stringify({ userId, password }),
    });

    if (!data) {
      return {
        error: '로그인 응답 형식이 올바르지 않습니다.',
        fieldErrors: {},
        previousInput: rawData,
        success: false,
        payload: null,
      };
    }

    return { error: null, fieldErrors: {}, previousInput: {}, success: true, payload: data };
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return {
        error: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.',
        fieldErrors: {},
        previousInput: rawData,
        success: false,
        payload: null,
      };
    }
    return {
      error: err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.',
      fieldErrors: {},
      previousInput: rawData,
      success: false,
      payload: null,
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (!state.success || !state.payload) return;

    const payload = state.payload;
    if (payload.user && payload.token) {
      dispatch(setAuth({ user: payload.user, token: payload.token }));
    } else if (payload.userId) {
      dispatch(setUser(payload));
    }
    router.push('/');
  }, [state.success, state.payload, dispatch, router]);

  return (
    <div className={'relative flex min-h-[calc(100vh-89px)] items-center justify-center py-8'}>
      {isPending && (
        <div
          className={'absolute inset-0 z-10 flex items-center justify-center bg-background backdrop-blur-sm'}
          aria-live={'polite'}
          aria-busy={'true'}
        >
          <div className={'size-10 animate-spin rounded-full border-4 border-gray8 border-t-accent2'} />
        </div>
      )}

      <div className={'w-full max-w-md rounded-3xl bg-background-secondary p-10 shadow-2xl'}>
        <h1 className={'mb-2 text-center text-3xl font-bold text-main'}>{'로그인'}</h1>
        <p className={'mb-8 text-center text-sm text-sub'}>
          {'회원정보가 없다면 아래 링크에서 회원가입을 진행해주세요.'}
        </p>

        <form action={formAction} className={'space-y-6'}>
          <FormInput
            label={'아이디'}
            name={'userId'}
            placeholder={'아이디를 입력하세요'}
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

          {state.error && (
            <div className={errorStyle}>
              {state.error}
            </div>
          )}

          <SubmitButton pendingText={'로그인 중...'}>
            {'로그인'}
          </SubmitButton>
        </form>

        <div className={'mt-6 text-center text-sm text-sub'}>
          {'아직 회원이 아니신가요?'}{' '}
          <Link href={'/signup'} className={'cursor-pointer font-semibold text-accent1 hover:underline underline-offset-4'}>
            {'회원가입'}
          </Link>
        </div>
      </div>
    </div>
  );
}
