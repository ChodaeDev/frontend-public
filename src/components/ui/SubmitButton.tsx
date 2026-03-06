'use client';

import { useFormStatus } from 'react-dom';
import { buttonPrimaryStyle } from './form-styles';

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
};

export function SubmitButton({
  children,
  pendingText = '처리 중...',
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type={'submit'}
      disabled={pending}
      className={`${ className ?? buttonPrimaryStyle } cursor-pointer`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
