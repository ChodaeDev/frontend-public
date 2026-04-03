'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { FormInput, FormTextarea } from '@/components/ui/form';
import {
  inputStyle,
  errorStyle,
  selectStyle,
  labelStyle,
  cancelButtonStyle,
  buttonPrimaryStyle,
} from '@/components/ui/form-styles';
import {
  counselingSchema,
  type CounselingInput,
} from '@/lib/validations/counseling';
import {
  formDataToObject,
  getFieldErrors,
  type FieldErrors,
} from '@/lib/validations/auth';
import { useTranslation } from '@/i18n/client';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/cn';
import ConfirmModal from '@/components/ui/ConfirmModal';

type FormState = {
  error: string | null;
  fieldErrors: FieldErrors<CounselingInput>;
  previousInput: Partial<CounselingInput>;
  success: boolean;
};

const initialState: FormState = {
  error: null,
  fieldErrors: {},
  previousInput: {},
  success: false,
};

async function counselingAction(prev: FormState, formData: FormData): Promise<FormState> {
  const rawData = formDataToObject(formData) as Partial<CounselingInput>;

  const result = counselingSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: null,
      fieldErrors: getFieldErrors(result.error),
      previousInput: rawData,
      success: false,
    };
  }

  const isPrivate = formData.get('isPrivate') === 'on';
  const userId = formData.get('userId') as string;
  const userName = formData.get('userName') as string;

  const body = {
    ...result.data,
    userId,
    userName,
    isPrivate,
  };

  try {
    await fetchApi('/api/board/counseling/form', {
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

export default function CounselingWriteForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const pathname = usePathname();
  const { dictionary } = useTranslation();
  const t = dictionary.board;
  const user = useAppSelector((state) => state.auth.user);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, action] = useActionState(counselingAction, initialState);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace(`/${ locale }/login?returnTo=${ encodeURIComponent(pathname) }`);
    }
  }, [user, router, locale, pathname]);

  useEffect(() => {
    if (state.success) {
      router.push(`/${ locale }/board/counseling`);
    }
  }, [state.success, router, locale]);

  const getErrorMessage = (errorKey: string | null) => {
    if (!errorKey) return null;
    const errors = t.errors as Record<string, string> | undefined;
    return errors?.[errorKey] || errorKey;
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <form ref={formRef} action={action} className={'grid grid-cols-1 gap-6'}>
        <input type={'hidden'} name={'userId'} value={user.userId} />
        <input type={'hidden'} name={'userName'} value={user.username} />

        <FormInput
          label={t.title}
          name={'title'}
          placeholder={t.titlePlaceholder}
          required
          error={state.fieldErrors.title}
          defaultValue={state.previousInput.title}
        />

        <div>
          <label htmlFor={'counselType'} className={labelStyle}>
            {t.counselType}
            <span className={'text-error'}>{' *'}</span>
          </label>
          <select
            key={state.previousInput.counselType}
            id={'counselType'}
            name={'counselType'}
            required
            defaultValue={state.previousInput.counselType ?? ''}
            className={cn(selectStyle, state.fieldErrors.counselType && 'border-error')}
          >
            <option value={''}>{t.counselTypePlaceholder}</option>
            <option value={'self'}>{t.counselTypeSelf}</option>
            <option value={'family'}>{t.counselTypeFamily}</option>
            <option value={'friend'}>{t.counselTypeFriend}</option>
            <option value={'etc'}>{t.counselTypeEtc}</option>
          </select>
          {state.fieldErrors.counselType && (
            <p className={'mt-1 text-xs text-error'}>
              {state.fieldErrors.counselType}
            </p>
          )}
        </div>

        <FormTextarea
          label={t.content}
          name={'content'}
          placeholder={t.contentPlaceholder}
          rows={8}
          required
          error={state.fieldErrors.content}
          defaultValue={state.previousInput.content}
        />

        <div>
          <label htmlFor={'applicantName'} className={labelStyle}>
            {t.applicantName}
          </label>
          <input
            id={'applicantName'}
            value={user.username}
            disabled
            className={cn(inputStyle, 'bg-gray7 cursor-not-allowed')}
          />
        </div>

        <FormInput
          label={t.phone}
          name={'phone'}
          type={'tel'}
          placeholder={t.phonePlaceholder}
          required
          error={state.fieldErrors.phone}
          defaultValue={state.previousInput.phone ?? user.phone}
        />

        <div className={'flex items-center gap-2'}>
          <input
            id={'isPrivate'}
            name={'isPrivate'}
            type={'checkbox'}
            className={'h-4 w-4 rounded border-gray7 accent-accent1'}
          />
          <label htmlFor={'isPrivate'} className={'text-sm text-main'}>
            {t.isPrivate}
          </label>
        </div>

        {state.error && (
          <div className={errorStyle}>
            {getErrorMessage(state.error)}
          </div>
        )}

        <div className={'flex gap-3'}>
          <button
            type={'button'}
            onClick={() => setShowCancelModal(true)}
            className={cn(cancelButtonStyle, 'cursor-pointer text-center')}
          >
            {t.cancel}
          </button>
          <button
            type={'button'}
            onClick={() => setShowSubmitModal(true)}
            className={cn(buttonPrimaryStyle, 'cursor-pointer')}
          >
            {t.submit}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => router.push(`/${ locale }/board/counseling`)}
        title={t.cancelConfirmTitle}
        message={t.cancelConfirmMessage}
        confirmText={dictionary.common.confirm}
        cancelText={dictionary.common.cancel}
      />

      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => {
          setShowSubmitModal(false);
          formRef.current?.requestSubmit();
        }}
        title={t.submitConfirmTitle}
        message={t.submitConfirmMessage}
        confirmText={t.submit}
        cancelText={dictionary.common.cancel}
      />
    </>
  );
}
