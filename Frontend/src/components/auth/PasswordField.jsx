import React, { useState } from 'react';
import FormField from './FormField';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  error,
  helperText,
  autoComplete = 'current-password',
  required = false,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FormField
      id={id}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
    >
      <div className="relative flex items-center">
        <input
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full pl-4 pr-11 py-3 text-sm text-[#403344] bg-[#FFFAF5] rounded-2xl border transition-all duration-200 outline-none placeholder:text-[#817583]/50 ${
            error
              ? 'border-[#E07A9B] bg-[#FDF4F6] focus:border-[#C95B7E] focus:ring-2 focus:ring-[#F9DDE5]'
              : 'border-[#E9DFFF] focus:border-[#756291] focus:ring-2 focus:ring-[#E9DFFF] hover:border-[#D5C2F6]'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={disabled}
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3 p-1.5 rounded-xl text-[#817583] hover:text-[#403344] hover:bg-[#E9DFFF]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#756291]"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </FormField>
  );
}
