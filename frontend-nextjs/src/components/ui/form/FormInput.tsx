import { inputStyle, labelStyle } from '../form-styles';

type FormInputProps = {
  label: string;
  name: string;
  type?: 'text' | 'password' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  defaultValue?: string;
};

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  className,
  error,
  defaultValue,
}: FormInputProps) {
  const inputClassName = error
    ? inputStyle.replace('border-gray7', 'border-error')
    : inputStyle;

  return (
    <div className={className}>
      <label htmlFor={name} className={labelStyle}>
        {label}
        {required && <span className={'text-error'}>{' *'}</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className={inputClassName}
        aria-invalid={!!error}
        aria-describedby={error ? `${ name }-error` : undefined}
      />
      {error && (
        <p id={`${ name }-error`} className={'mt-1 text-xs text-error'}>
          {error}
        </p>
      )}
    </div>
  );
}
