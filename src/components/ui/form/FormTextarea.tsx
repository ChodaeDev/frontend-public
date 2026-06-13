'use client';

import { useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { inputStyle, labelStyle } from '../form-styles';
import { cn } from '@/lib/cn';

type FormTextareaProps = {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  error?: string;
  defaultValue?: string;
  hint?: string;
  maxLength?: number;
  validate?: (value: string)=> string | null;
};

export function FormTextarea({
  label,
  name,
  placeholder,
  rows = 4,
  required,
  className,
  error,
  defaultValue,
  hint,
  maxLength,
  validate,
}: FormTextareaProps) {
  const [dirty, setDirty] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(defaultValue?.length ?? 0);

  const handleValidate = useCallback((value: string) => {
    if (!validate) return;
    setLocalError(validate(value));
  }, [validate]);

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.target.value) setDirty(true);
    handleValidate(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setCharCount(value.length);
    if (value.length > 0) {
      setDirty(true);
      handleValidate(value);
    }
  };

  const displayError = error || (dirty ? localError : null);
  const hasError = !!displayError;
  const isValid = dirty && validate && !localError && !error;
  const hintColor = displayError ? 'text-error' : isValid ? 'text-accent1' : 'text-gray4';

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={labelStyle}>
          {label}
          {required && <span className={'text-error'}>{' *'}</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        className={cn(inputStyle, hasError && 'border-error')}
        aria-invalid={hasError}
        aria-describedby={displayError ? `${ name }-error` : hint ? `${ name }-hint` : undefined}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <div className={'mt-1 min-h-4 flex items-center justify-between'}>
        <div>
          {displayError ? (
            <p id={`${ name }-error`} className={'text-xs text-error'}>
              {displayError}
            </p>
          ) : hint ? (
            <p id={`${ name }-hint`} className={cn('text-xs flex items-center gap-1', isValid ? 'text-accent1' : 'text-gray4')}>
              {hint}
              {isValid && <Check className={'size-3'} />}
            </p>
          ) : null}
        </div>
        {maxLength && (
          <span className={cn('text-xs transition-opacity', dirty ? 'opacity-100' : 'opacity-0', hintColor)}>
            {charCount}{'/'}{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
