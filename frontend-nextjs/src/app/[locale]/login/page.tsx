'use client';

import { Suspense, useActionState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuth, setUser } from '@/store/authSlice';
import { fetchApi } from '@/lib/api';
import { FormInput, SubmitButton } from '@/components/ui/form';
import { errorStyle } from '@/components/ui/form-styles';
import {
  loginSchema,
  formDataToObject,
  getFieldErrors,
  type FieldErrors,
  type LoginInput,
} from '@/lib/validations/auth';
import type { UserInfo } from '@/store/authSlice';
import { useTranslation } from '@/i18n/client';

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
        error: 'invalidResponse',
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
        error: 'serverError',
        fieldErrors: {},
        previousInput: rawData,
        success: false,
        payload: null,
      };
    }
    return {
      error: err instanceof Error ? err.message : 'generic',
      fieldErrors: {},
      previousInput: rawData,
      success: false,
      payload: null,
    };
  }
}

function LoginForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { dictionary } = useTranslation();
  const t = dictionary.login;
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (user) {
      router.replace(returnTo ?? `/${ locale }`);
    }
  }, [user, router, locale, returnTo]);

  useEffect(() => {
    if (!state.success || !state.payload) return;

    const payload = state.payload;
    if (payload.user && payload.token) {
      dispatch(setAuth({ user: payload.user, token: payload.token }));
    } else if (payload.userId) {
      dispatch(setUser(payload));
    }
  }, [state.success, state.payload, dispatch]);

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

      <div className={'w-full max-w-md rounded-3xl bg-background-secondary p-4 sm:p-10 sm:shadow-2xl'}>
        <h1 className={'mb-2 text-center text-3xl font-bold text-main'}>{t.title}</h1>
        <p className={'mb-8 text-center text-sm text-sub'}>
          {t.description}
        </p>

        <form action={formAction} className={'space-y-6'}>
          <FormInput
            label={t.userId}
            name={'userId'}
            placeholder={t.userIdPlaceholder}
            required
            error={state.fieldErrors.userId}
            defaultValue={state.previousInput.userId}
          />

          <FormInput
            label={t.password}
            name={'password'}
            type={'password'}
            placeholder={t.passwordPlaceholder}
            required
            error={state.fieldErrors.password}
            defaultValue={state.previousInput.password}
          />

          {state.error && (
            <div className={errorStyle}>
              {getErrorMessage(state.error)}
            </div>
          )}

          <SubmitButton pendingText={t.submitting}>
            {t.submit}
          </SubmitButton>
        </form>

        <div className={'mt-6 text-center text-sm text-sub'}>
          {t.noAccount}{' '}
          <Link href={`/${ locale }/signup`} className={'cursor-pointer font-semibold text-accent1 hover:underline underline-offset-4'}>
            {t.signupLink}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
