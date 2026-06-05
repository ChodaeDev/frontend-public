'use client';

import { useRef } from 'react';
import { formatPhone, stripNonDigits } from '@/lib/format';

interface PhoneInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (formatted: string)=> void;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

export default function PhoneInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  className,
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const newRaw = input.value;

    // 커서 앞에 있는 숫자 개수를 센다
    const digitsBefore = stripNonDigits(newRaw.slice(0, cursorPos)).length;

    const formatted = formatPhone(newRaw);
    onChange(formatted);

    // 포맷된 문자열에서 같은 숫자 개수만큼 지난 위치를 찾는다
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
  };

  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      type={'tel'}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={className}
    />
  );
}
