import React from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#3ddc84] text-black font-semibold hover:bg-[#2fcb75] active:scale-[0.97] shadow-[0_0_24px_rgba(61,220,132,0.35)]',
  outline:
    'border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm active:scale-[0.97]',
  ghost:
    'text-white hover:bg-white/5 active:scale-[0.97]',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  href,
  ...props
}) => {
  const base =
    'inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none';

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
