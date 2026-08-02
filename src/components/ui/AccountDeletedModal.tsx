'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n/client';

function AccountDeletedModalInner() {
  const searchParams = useSearchParams();
  const { dictionary } = useTranslation();
  const t = dictionary.mypage;

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (searchParams.get('accountDeleted') === 'true') {
      setIsOpen(true);
      // URL에서 쿼리 제거
      const url = new URL(window.location.href);
      url.searchParams.delete('accountDeleted');
      window.history.replaceState(null, '', url.pathname);
    }
  }, [searchParams]);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return createPortal(
    <div className={'fixed inset-0 z-50 flex items-center justify-center p-4'}>
      <div
        className={cn('absolute inset-0 bg-black/80', isClosing ? 'animate-fadeOut' : 'animate-fadeIn')}
        onClick={close}
      />

      <div
        className={cn(
          'relative w-full max-w-sm rounded-xl bg-background shadow-xl border border-gray8',
          isClosing ? 'animate-fadeOut' : 'animate-slideDown',
        )}
      >
        <div className={'flex items-center justify-between p-5 border-b border-gray8'}>
          <h2 className={'text-lg font-bold text-main'}>
            {t.deleteSuccessTitle || '회원 탈퇴 완료'}
          </h2>
          <button
            onClick={close}
            className={'p-1 rounded-md text-sub hover:text-main hover:bg-background-secondary transition-colors cursor-pointer'}
          >
            <X className={'size-5'} />
          </button>
        </div>

        <div className={'p-5'}>
          <p className={'text-sm text-sub leading-relaxed whitespace-pre-line'}>
            {t.deleteSuccessMessage || '회원 탈퇴가 완료되었습니다.\n그동안 이용해 주셔서 진심으로 감사드립니다.\n\n언제든 다시 찾아주시면 따뜻하게 맞이하겠습니다.'}
          </p>
        </div>

        <div className={'flex justify-end p-4 border-t border-gray8'}>
          <button
            onClick={close}
            className={'px-5 py-2 rounded-lg bg-accent1 text-white text-sm font-medium hover:bg-accent1/90 transition-colors cursor-pointer'}
          >
            {(dictionary.common as Record<string, string>).confirm || '확인'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function AccountDeletedModal() {
  return (
    <Suspense>
      <AccountDeletedModalInner />
    </Suspense>
  );
}
