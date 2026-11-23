'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import { inputStyle, buttonPrimaryStyle } from '@/components/ui/form-styles';
import { guestPasswordMaxLength, guestPasswordMinLength } from '@/lib/validations/counseling';
import { CounselingApiError } from '@/lib/queries/counseling';
import { cn } from '@/lib/cn';

interface GuestPasswordGateProps {
  onSubmit: (password: string)=> void;
  pending: boolean;
  error: Error | null;
}

/** 비회원 글 진입 시 비밀번호 입력 화면. 진입할 때마다 표시된다 */
export default function GuestPasswordGate({ onSubmit, pending, error }: GuestPasswordGateProps) {
  const { dictionary, locale } = useTranslation();
  const t = dictionary.board;
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const serverMessage = (() => {
    if (!error) return null;
    if (error instanceof CounselingApiError) {
      if (error.code === 'GUEST_PASSWORD_MISMATCH') return t.passwordGateWrong || '비밀번호가 맞지 않습니다.';
      if (error.code === 'GUEST_PASSWORD_LOCKED') return t.passwordGateLocked || '비밀번호를 여러 번 틀렸습니다. 잠시 후 다시 시도해 주세요.';
    }
    return error.message;
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < guestPasswordMinLength) {
      setLocalError(t.postPasswordPlaceholder || '4자 이상 입력하세요');
      return;
    }
    setLocalError(null);
    onSubmit(password);
  };

  const message = localError ?? serverMessage;

  return (
    <div className={'flex justify-center py-16'}>
      <form onSubmit={handleSubmit} className={'flex w-full max-w-sm flex-col items-center gap-5 text-center'}>
        <span className={'flex size-14 items-center justify-center rounded-full bg-background-secondary'}>
          <Lock className={'size-6 text-gray3'} />
        </span>
        <div className={'flex flex-col gap-1.5'}>
          <h2 className={'text-lg font-bold text-main'}>{t.passwordGateTitle || '비밀번호를 입력해 주세요'}</h2>
          <p className={'text-sm leading-relaxed text-sub'}>
            {t.passwordGateDesc || '글을 쓸 때 정한 비밀번호를 입력하면 내용과 답변을 볼 수 있습니다.'}
          </p>
        </div>

        <div className={'w-full'}>
          <input
            type={'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={guestPasswordMaxLength}
            autoComplete={'current-password'}
            autoFocus
            aria-label={t.postPassword || '글 비밀번호'}
            placeholder={t.postPassword || '글 비밀번호'}
            className={cn(inputStyle, 'text-center', message && 'border-error')}
          />
          {message && <p className={'mt-2 text-xs text-error'}>{message}</p>}
        </div>

        <button type={'submit'} disabled={pending} className={cn(buttonPrimaryStyle, 'w-full')}>
          {pending ? (t.loading || '불러오는 중...') : (t.passwordGateSubmit || '확인')}
        </button>

        <Link
          href={`/${ locale }/board/counseling`}
          className={'inline-flex items-center gap-1.5 text-sm text-sub hover:text-main'}
        >
          <ArrowLeft className={'size-4'} />
          {t.backToList || '목록으로'}
        </Link>
      </form>
    </div>
  );
}
