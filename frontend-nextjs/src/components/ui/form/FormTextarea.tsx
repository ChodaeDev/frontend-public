import { inputStyle, labelStyle } from '../form-styles';

type FormTextareaProps = {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  hint?: string;
  error?: string;
  defaultValue?: string;
};

export function FormTextarea({
  label,
  name,
  placeholder,
  rows = 4,
  required,
  className,
  hint,
  error,
  defaultValue,
}: FormTextareaProps) {
  const textareaClassName = error
    ? inputStyle.replace('border-gray7', 'border-error')
    : inputStyle;

  return (
    <div className={className}>
      <label htmlFor={name} className={labelStyle}>
        {label}
        {required && <span className={'text-error'}>{' *'}</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        className={textareaClassName}
        aria-invalid={!!error}
        aria-describedby={error ? `${ name }-error` : undefined}
      />
      {error && (
        <p id={`${ name }-error`} className={'mt-1 text-xs text-error'}>
          {error}
        </p>
      )}
      {!error && hint && <p className={'mt-1 text-xs text-sub'}>{hint}</p>}
    </div>
  );
}
