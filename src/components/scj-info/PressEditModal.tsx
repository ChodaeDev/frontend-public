'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { inputStyle, labelStyle, buttonPrimaryStyle, cancelButtonStyle } from '@/components/ui/form-styles';
import { BirthdayPicker } from '@/components/ui/BirthdayPicker';
import type { PressPost } from '@/types/press';

interface PressEditModalProps {
  post: PressPost;
  onSave: (updated: PressPost)=> void;
  onClose: ()=> void;
}

export default function PressEditModal({ post, onSave, onClose }: PressEditModalProps) {
  const [form, setForm] = useState({
    title: post.title,
    pressName: post.pressName,
    thumbnailUrl: post.thumbnailUrl,
    sourceUrl: post.sourceUrl,
    publishedAt: post.publishedAt,
  });
  const [isClosing, setIsClosing] = useState(false);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...post, ...form });
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return createPortal(
    <div className={'fixed inset-0 z-50 flex items-center justify-center'}>
      <div
        className={cn('absolute inset-0 bg-black/80', isClosing ? 'animate-fadeOut' : 'animate-fadeIn')}
        onClick={close}
      />
      <div
        className={cn(
          'relative w-full max-w-lg rounded-xl bg-background shadow-xl border border-gray8',
          isClosing ? 'animate-fadeOut' : 'animate-slideDown',
        )}
      >
        {/* Header */}
        <div className={'flex items-center justify-between p-4 border-b border-gray8'}>
          <h3 className={'text-lg font-bold text-main'}>{'기사 수정'}</h3>
          <button
            onClick={close}
            className={'p-1 rounded-md text-sub hover:text-main hover:bg-background-secondary transition-colors'}
          >
            <X className={'size-5'} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={'p-4 flex flex-col gap-4'}>
          <div>
            <label className={labelStyle}>{'기사 제목'}</label>
            <input
              type={'text'}
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={inputStyle}
              required
            />
          </div>
          <div className={'grid grid-cols-2 gap-4'}>
            <div>
              <label className={labelStyle}>{'언론사'}</label>
              <input
                type={'text'}
                value={form.pressName}
                onChange={(e) => updateField('pressName', e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <BirthdayPicker
              label={'발행일'}
              defaultValue={form.publishedAt}
              onChange={(value) => updateField('publishedAt', value)}
            />
          </div>
          <div>
            <label className={labelStyle}>{'원문 URL'}</label>
            <input
              type={'url'}
              value={form.sourceUrl}
              onChange={(e) => updateField('sourceUrl', e.target.value)}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label className={labelStyle}>{'썸네일 URL'}</label>
            <input
              type={'url'}
              value={form.thumbnailUrl}
              onChange={(e) => updateField('thumbnailUrl', e.target.value)}
              className={inputStyle}
              placeholder={'비워두면 기본 이미지가 표시됩니다'}
            />
          </div>

          {/* Footer */}
          <div className={'flex justify-end gap-3 pt-2'}>
            <button type={'button'} onClick={close} className={cancelButtonStyle}>
              {'취소'}
            </button>
            <button type={'submit'} className={buttonPrimaryStyle}>
              {'저장'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
