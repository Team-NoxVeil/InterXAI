import React, { useState } from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string | null;
  revealable?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label, id, error, revealable = false, type, className = '', ...props
}) => {
  const [revealed, setRevealed] = useState(false);
  const inputType = revealable ? (revealed ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`
            w-full rounded-xl border px-4 py-3 text-sm text-slate-900
            bg-slate-50 placeholder-slate-400 outline-none transition-all duration-200
            ${error
              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white'
            } ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={revealed ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
};

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M1 9S4 3.5 9 3.5 17 9 17 9s-3 5.5-8 5.5S1 9 1 9z" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 2l14 14M7.4 7.5A2.25 2.25 0 0011.5 11.6M5.2 5.3C3.2 6.5 1 9 1 9s3 5.5 8 5.5c1.5 0 2.9-.4 4.1-1.1M13.5 12.3C15.3 11 17 9 17 9S14 3.5 9 3.5c-.8 0-1.5.1-2.2.3"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export default FormInput;
