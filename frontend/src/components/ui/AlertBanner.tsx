/**
 * AlertBanner.tsx
 * Reusable error / success inline alert.
 */

import React from "react";

export type AlertVariant = "error" | "success" | "info";

export interface AlertBannerProps {
  message: string;
  variant?: AlertVariant;
}

const styles: Record<AlertVariant, string> = {
  error: "bg-red-500/10 border-red-500/40 text-red-400",
  success: "bg-[#3ddc84]/10 border-[#3ddc84]/40 text-[#3ddc84]",
  info: "bg-blue-500/10 border-blue-500/40 text-blue-400",
};

const icons: Record<AlertVariant, React.ReactNode> = {
  error: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 mt-0.5"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 5v3.5M8 11h.01"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  success: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 mt-0.5"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5 8l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 mt-0.5"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 7v4M8 5h.01"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const AlertBanner: React.FC<AlertBannerProps> = ({
  message,
  variant = "error",
}) => (
  <div
    role="alert"
    className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}
  >
    {icons[variant]}
    <span>{message}</span>
  </div>
);

export default AlertBanner;
