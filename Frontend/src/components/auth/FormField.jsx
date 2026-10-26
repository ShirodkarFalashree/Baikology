import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  autoComplete,
  required = false,
  disabled = false,
  children,
}) {
  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-bold text-[#403344] tracking-tight"
        >
          {label} {required && <span className="text-[#C95B7E]">*</span>}
        </label>
        {helperText && !error && (
          <span className="text-[11px] text-[#817583]">{helperText}</span>
        )}
      </div>

      <div className="relative">
        {children ? (
          children
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full px-4 py-3 text-sm text-[#403344] bg-[#FFFAF5] rounded-2xl border transition-all duration-200 outline-none placeholder:text-[#817583]/50 ${
              error
                ? 'border-[#E07A9B] bg-[#FDF4F6] focus:border-[#C95B7E] focus:ring-2 focus:ring-[#F9DDE5]'
                : 'border-[#E9DFFF] focus:border-[#756291] focus:ring-2 focus:ring-[#E9DFFF] hover:border-[#D5C2F6]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-[#8C2C4E] font-medium flex items-center gap-1.5 animate-in fade-in duration-150 pt-0.5"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
