'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { cancelButtonStyle, buttonPrimaryStyle } from './form-styles';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: ()=> void;
  onConfirm: ()=> void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  confirmVariant = 'primary',
}: ConfirmModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return createPortal(
    <div className={'fixed inset-0 z-50 flex items-center justify-center'}>
      {/* Backdrop */}
      <div
        className={cn('absolute inset-0 bg-black/80', isClosing ? 'animate-fadeOut' : 'animate-fadeIn')}
        onClick={close}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-sm rounded-xl bg-background shadow-xl border border-gray8',
          isClosing ? 'animate-fadeOut' : 'animate-slideDown',
        )}
      >
        {/* Header */}
        <div className={'flex items-center justify-between p-4 border-b border-gray8'}>
          <h3 className={'text-lg font-bold text-main'}>{title}</h3>
          <button
            onClick={close}
            className={'p-1 rounded-md text-sub hover:text-main hover:bg-background-secondary transition-colors'}
            aria-label={'Close'}
          >
            <X className={'size-5'} />
          </button>
        </div>

        {/* Body */}
        <p className={'text-sm text-sub p-4 '}>{message}</p>

        {/* Footer */}
        <div className={'flex justify-end gap-3 p-4 pt-0'}>
          <button
            onClick={close}
            className={cancelButtonStyle}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={confirmVariant === 'danger'
              ? 'w-fit min-w-24 rounded-md bg-error px-4 py-3 text-sm font-semibold text-inverse shadow-md transition duration-200 hover:opacity-90 active:scale-98'
              : buttonPrimaryStyle}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
