'use client';

import { useActionState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { useTranslation } from '@/i18n/client';
import { useAppSelector } from '@/store/hooks';

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
        <h1 className={'mb-2 text-center text-3xl font-bold text-main'}>{t.title}</h1>
        <p className={'mb-8 text-center text-sm text-sub'}>
          {t.description}
        </p>

        <form action={formAction} className={'grid grid-cols-1 gap-2 md:gap-6 md:grid-cols-2'}>
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

          <FormInput
            label={t.username}
            name={'username'}
            placeholder={t.usernamePlaceholder}
            required
            error={state.fieldErrors.username}
            defaultValue={state.previousInput.username}
          />

          <FormInput
            label={t.nickname}
            name={'nickname'}
            placeholder={t.nicknamePlaceholder}
            error={state.fieldErrors.nickname}
            defaultValue={state.previousInput.nickname}
          />

          <FormInput
            label={t.phone}
            name={'phone'}
            type={'tel'}
            placeholder={t.phonePlaceholder}
            required
            error={state.fieldErrors.phone}
            defaultValue={state.previousInput.phone}
          />

          <FormInput
            label={t.church}
            name={'church'}
            placeholder={t.churchPlaceholder}
            error={state.fieldErrors.church}
            defaultValue={state.previousInput.church}
          />

          <BirthdayPicker
            label={t.birthday}
            defaultValue={state.previousInput.birthday}
          />

          <FormTextarea
            label={t.bio}
            name={'description'}
            placeholder={t.bioPlaceholder}
            className={'md:col-span-2'}
            error={state.fieldErrors.description}
            defaultValue={state.previousInput.description}
          />

          {state.error && (
            <div className={`${ errorStyle } md:col-span-2`}>
              {getErrorMessage(state.error)}
            </div>
          )}

          <div className={'md:col-span-2'}>
            <SubmitButton pendingText={t.submitting}>
              {t.submit}
            </SubmitButton>
          </div>
        </form>

        <div className={'mt-6 text-center text-sm text-sub'}>
          {t.hasAccount}{' '}
          <Link href={`/${ locale }/login`} className={'cursor-pointer font-semibold text-accent1 hover:underline underline-offset-4'}>
            {t.loginLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
