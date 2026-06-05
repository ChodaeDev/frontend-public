'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string)=> void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: boolean;
}

export default function FormSelect({
  id,
  name,
  value,
  defaultValue,
  onChange,
  options,
  placeholder = '선택하세요',
  disabled,
  required,
  className,
  error,
}: FormSelectProps) {
  return (
    <Select.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      disabled={disabled}
      required={required}
      name={name}
    >
      <Select.Trigger
        id={id}
        className={cn(
          'flex gap-1 w-full items-center justify-between rounded-lg border bg-background pl-3 pr-2 py-3 text-sm shadow-sm',
          'focus:border-accent2 focus:outline-none focus:ring-2 focus:ring-accent2/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-placeholder:text-gray4',
          error ? 'border-error' : 'border-gray7',
          className,
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon asChild>
          <ChevronDown className={'size-4 text-gray3 shrink-0'} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position={'popper'}
          sideOffset={6}
          className={cn(
            'z-50 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-gray7 bg-background shadow-lg',
            'animate-slideDown',
          )}
        >
          <Select.Viewport className={'p-1'}>
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm text-main outline-none',
                  'hover:bg-background-secondary focus:bg-background-secondary',
                  'data-[state=checked]:text-accent1 data-[state=checked]:font-medium',
                  'data-disabled:pointer-events-none data-disabled:opacity-40',
                )}
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
