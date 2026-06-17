'use client';

import { useState, useCallback, useRef } from 'react';
import { Check } from 'lucide-react';
import { inputStyle, labelStyle } from '../form-styles';
import { cn } from '@/lib/cn';

type FormInputProps = {
  label: string;
  name: string;
  type?: 'text' | 'password' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  defaultValue?: string;
  autoComplete?: string;
  hint?: string;
  validMessage?: string;
  validate?: (value: string)=> string | null;
  asyncValidate?: (value: string)=> Promise<string | null>;
  format?: (value: string)=> string;
  parse?: (value: string)=> string;
};

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  disabled,
  className,
  error,
  defaultValue,
  autoComplete,
  hint,
  validMessage,
  validate,
  asyncValidate,
  format,
  parse,
}: FormInputProps) {
  const hasFormat = !!(format && parse);
  const [dirty, setDirty] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [asyncPending, setAsyncPending] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => hasFormat ? format(defaultValue ?? '') : '');
  const [rawValue, setRawValue] = useState(() => hasFormat ? parse(defaultValue ?? '') : '');
  const inputRef = useRef<HTMLInputElement>(null);
  const asyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleValidate = useCallback((value: string) => {
    if (!validate) return;
    setLocalError(validate(value));
  }, [validate]);

  const handleAsyncValidate = useCallback((value: string) => {
    if (!asyncValidate) return;
    const syncError = validate?.(value) ?? null;
    if (syncError || !value) {
      setAsyncPending(false);
      return;
    }

    setAsyncPending(true);
    if (asyncTimerRef.current) clearTimeout(asyncTimerRef.current);
    asyncTimerRef.current = setTimeout(async () => {
      const asyncError = await asyncValidate(value);
      setLocalError(asyncError);
      setAsyncPending(false);
    }, 250);
  }, [validate, asyncValidate]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = hasFormat ? rawValue : e.target.value;
    if (value) setDirty(true);
    handleValidate(value);
    handleAsyncValidate(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasFormat) {
      const input = e.target;
      const cursorPos = input.selectionStart ?? 0;
      const digitsBefore = (input.value.slice(0, cursorPos).match(/\d/g) || []).length;

      const parsed = parse(input.value);
      const formatted = format(input.value);
      setRawValue(parsed);
      setDisplayValue(formatted);

      if (parsed.length > 0) {
        setDirty(true);
        handleValidate(parsed);
        handleAsyncValidate(parsed);
      }

      // 포맷 후 커서 위치 보정
      requestAnimationFrame(() => {
        if (!inputRef.current) return;
        let digits = 0;
        let newCursor = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) digits++;
          if (digits === digitsBefore) {
            newCursor = i + 1;
            break;
          }
        }
        if (digitsBefore === 0) newCursor = 0;
        inputRef.current.setSelectionRange(newCursor, newCursor);
      });
    } else {
      const { value } = e.target;
      if (value.length > 0) {
        setDirty(true);
        handleValidate(value);
        handleAsyncValidate(value);
      }
    }
  };

  const displayError = error || (dirty ? localError : null);
  const hasError = !!displayError;
  const isValid = dirty && (validate || asyncValidate) && !localError && !error && !asyncPending;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={labelStyle}>
          {label}
          {required && <span className={'text-error'}>{' *'}</span>}
        </label>
      )}
      {hasFormat ? (
        <>
          <input
            ref={inputRef}
            id={name}
            type={type}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={displayValue}
            autoComplete={autoComplete}
            className={cn(inputStyle, hasError && 'border-error focus:border-error focus:ring-error/30', disabled && 'bg-gray7 text-sub cursor-not-allowed')}
            aria-invalid={hasError}
            aria-describedby={displayError ? `${ name }-error` : hint ? `${ name }-hint` : undefined}
            onBlur={disabled ? undefined : handleBlur}
            onChange={disabled ? undefined : handleChange}
          />
          <input type={'hidden'} name={name} value={rawValue} />
        </>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cn(inputStyle, hasError && 'border-error focus:border-error focus:ring-error/30', disabled && 'bg-gray7 text-sub cursor-not-allowed')}
          aria-invalid={hasError}
          aria-describedby={displayError ? `${ name }-error` : hint ? `${ name }-hint` : undefined}
          onBlur={disabled ? undefined : handleBlur}
          onChange={disabled ? undefined : handleChange}
        />
      )}
      <div className={'mt-1 min-h-4'}>
        {displayError ? (
          <p id={`${ name }-error`} className={'text-xs text-error'}>
            {displayError}
          </p>
        ) : isValid && validMessage ? (
          <p className={'text-xs text-accent1 flex items-center gap-1'}>
            {validMessage}
            <Check className={'size-3'} />
          </p>
        ) : hint ? (
          <p id={`${ name }-hint`} className={cn('text-xs flex items-center gap-1', isValid ? 'text-accent1' : 'text-gray4')}>
            {hint}
            {isValid && <Check className={'size-3'} />}
          </p>
        ) : null}
      </div>
    </div>
  );
}
