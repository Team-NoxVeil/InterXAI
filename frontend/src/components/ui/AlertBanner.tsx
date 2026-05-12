import React from 'react';

export type AlertVariant = 'error' | 'success' | 'info';

export interface AlertBannerProps {
  message: string;
  variant?: AlertVariant;
}

const styles: Record<AlertVariant, string> = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

const AlertBanner: React.FC<AlertBannerProps> = ({ message, variant = 'error' }) => (
  <div
    role="alert"
    className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
    <span>{message}</span>
  </div>
);

export default AlertBanner;
