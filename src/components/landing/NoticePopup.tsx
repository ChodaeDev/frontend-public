'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import { X, Megaphone, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n/client';

const storageKey = 'chodae_notice_hidden';

function shouldShow(): boolean {
  if (typeof window === 'undefined') return false;

  const value = localStorage.getItem(storageKey);
  if (!value) return true;

  if (value === 'forever') return false;

  const savedDate = Number(value);
  if (Number.isNaN(savedDate)) return true;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return today > savedDate;
}

export default function NoticePopup() {
  const { dictionary } = useTranslation();
  const t = dictionary.home?.notice;
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (shouldShow()) {
      setIsOpen(true);
    }
  }, []);

  const closePopup = useCallback((mode: 'today' | 'forever' | 'none') => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);

      if (mode === 'forever') {
        localStorage.setItem(storageKey, 'forever');
      } else if (mode === 'today') {
        const now = new Date();
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        localStorage.setItem(storageKey, String(todayEnd));
      }
    }, 200);
  }, []);

  if (!isOpen || !t) return null;

  const title = t.title || '안내드립니다';
  const body = t.body || '현재 사이트는 개발 진행 중이며, 우선 상담 게시판을 중심으로 먼저 오픈하게 되었습니다.';
  const hideTodayText = t.hideToday || '오늘은 그만 보기';
  const hideForeverText = t.hideForever || '다시 보지 않기';
  const counselingText = t.counseling || '상담게시판 바로가기';

  return createPortal(
    <div className={'fixed inset-0 z-50 flex items-center justify-center px-4'}>
      {/* Backdrop */}
      <div
        className={cn('absolute inset-0 bg-black/60', isClosing ? 'animate-fadeOut' : 'animate-fadeIn')}
        onClick={() => closePopup('none')}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-md rounded-2xl bg-background shadow-2xl border border-gray8 overflow-hidden',
          isClosing ? 'animate-fadeOut' : 'animate-slideDown',
        )}
      >
        {/* Header */}
        <div className={'flex items-center gap-2.5 px-5 pt-5 pb-3'}>
          <div className={'flex items-center justify-center size-9 rounded-full bg-accent1/10'}>
            <Megaphone className={'size-4.5 text-accent1'} />
          </div>
          <h3 className={'text-lg font-bold text-main flex-1'}>{title}</h3>
          <button
            onClick={() => closePopup('none')}
            className={'p-1.5 rounded-lg text-sub hover:text-main hover:bg-background-secondary transition-colors'}
            aria-label={'Close'}
          >
            <X className={'size-5'} />
          </button>
        </div>

        {/* Body */}
        <div className={'px-5 py-4'}>
          <p className={'text-sm text-sub leading-relaxed whitespace-pre-line'}>{body}</p>
          <p className={'text-sm text-gray1 text-end leading-relaxed whitespace-pre-line'}>{'- 2026.07.24'}</p>
        </div>

        {/* 상담게시판 바로가기 */}
        <div className={'px-5 pb-4'}>
          <button
            onClick={() => {
              closePopup('none');
              router.push(`/${ locale }/board/counseling`);
            }}
            className={'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent1 text-white text-sm font-medium hover:bg-accent1/90 transition-colors cursor-pointer'}
          >
            {counselingText}
            <ArrowRight className={'size-4'} />
          </button>
        </div>

        {/* Footer */}
        <div className={'flex items-center justify-center gap-4 px-5 pb-5'}>
          <label
            className={'flex items-center gap-2 cursor-pointer group'}
            onClick={() => closePopup('today')}
          >
            <input
              type={'checkbox'}
              readOnly
              className={'size-4 rounded border-gray6 text-accent1 accent-accent1'}
            />
            <span className={'text-xs text-sub group-hover:text-main transition-colors'}>{hideTodayText}</span>
          </label>
          <label
            className={'flex items-center gap-2 cursor-pointer group'}
            onClick={() => closePopup('forever')}
          >
            <input
              type={'checkbox'}
              readOnly
              className={'size-4 rounded border-gray6 text-accent1 accent-accent1'}
            />
            <span className={'text-xs text-sub group-hover:text-main transition-colors'}>{hideForeverText}</span>
          </label>
        </div>
      </div>
    </div>,
    document.body,
  );
}
