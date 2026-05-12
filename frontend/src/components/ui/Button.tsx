import React from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'secondary';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.97] shadow-lg shadow-blue-500/25',
  outline:
    'border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97] bg-white',
  secondary:
    'border border-blue-200 text-blue-700 hover:bg-blue-50 active:scale-[0.97] bg-blue-50/60',
  ghost:
    'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.97]',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  href,
  ...props
}) => {
  const base =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none';

  if (href) {
    return (
      <a href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
