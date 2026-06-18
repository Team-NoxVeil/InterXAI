import { useState } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import "./auth-pages.css";

type AuthMode = "login" | "signup" | "verify";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  mode: AuthMode;
  highlights: string[];
  children: ReactNode;
  onBack?: () => void;
}

export const AuthShell = ({
  eyebrow,
  title,
  subtitle,
  mode,
  highlights,
  children,
  onBack,
}: AuthShellProps) => (
  <main className={`auth-screen auth-screen--${mode}`}>
    <div className="auth-ambient auth-ambient--one" />
    <div className="auth-ambient auth-ambient--two" />
    <div className="auth-grid-glow" />

    <nav className="auth-nav" aria-label="Authentication navigation">
      <button className="auth-brand" type="button" onClick={onBack}>
        <span className="auth-brand-mark">X</span>
        <span>InterXAI</span>
      </button>
      {onBack && (
        <button className="auth-back-btn" type="button" onClick={onBack}>
          <ChevronLeftIcon />
          Back to home
        </button>
      )}
    </nav>

    <section className="auth-layout">
      <div className="auth-story-panel">
        <div className="auth-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <div className="auth-highlight-list">
          {highlights.map((highlight) => (
            <span key={highlight}>
              <CheckIcon />
              {highlight}
            </span>
          ))}
        </div>

        <div className="auth-preview-card" aria-hidden="true">
          <div className="auth-preview-orb">
            <div />
          </div>
          <div className="auth-preview-lines">
            <span />
            <span />
            <span />
          </div>
          <div className="auth-preview-score">
            <strong>92%</strong>
            <small>confidence readiness</small>
          </div>
        </div>
      </div>

      <div className="auth-card-stage">{children}</div>
    </section>
  </main>
);

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  center?: boolean;
  stepLabel?: ReactNode;
}

export const AuthCard = ({
  title,
  description,
  children,
  center = false,
  stepLabel,
}: AuthCardProps) => (
  <section className={`auth-card ${center ? "auth-card--center" : ""}`}>
    {stepLabel && <div className="auth-card-step">{stepLabel}</div>}
    <h2>{title}</h2>
    <p className="auth-card-description">{description}</p>
    {children}
  </section>
);

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon?: ReactNode;
}

export const AuthInput = ({
  label,
  id,
  icon,
  type = "text",
  ...props
}: AuthInputProps) => {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        {icon && <span className="auth-input-icon">{icon}</span>}
        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          className={icon ? "auth-input auth-input--with-icon" : "auth-input"}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-reveal-btn"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide password" : "Show password"}
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
};

export const AuthButton = ({
  children,
  type = "submit",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className="auth-primary-btn" type={type} {...props}>
    {children}
  </button>
);

export const AuthDivider = ({ label }: { label: string }) => (
  <div className="auth-divider">
    <span />
    <strong>{label}</strong>
    <span />
  </div>
);

export const AuthSocials = ({
  disabled,
  onGoogleClick,
}: {
  disabled?: boolean;
  onGoogleClick: () => void;
}) => (
  <div className="auth-social-row">
    <button type="button" disabled={disabled} onClick={onGoogleClick}>
      <GoogleIcon />
      Continue with Google
    </button>
    <button type="button" disabled={disabled}>
      <LinkedInIcon />
      Continue with LinkedIn
    </button>
  </div>
);

export const Stepper = ({
  activeStep,
  totalSteps,
}: {
  activeStep: number;
  totalSteps: number;
}) => (
  <div
    className="auth-stepper"
    aria-label={`Step ${activeStep} of ${totalSteps}`}
  >
    {Array.from({ length: totalSteps }).map((_, index) => {
      const step = index + 1;
      return (
        <span
          key={step}
          className={
            step <= activeStep ? "auth-step auth-step--active" : "auth-step"
          }
        >
          {step}
        </span>
      );
    })}
  </div>
);

export const FormAlert = ({ message }: { message: string }) => (
  <div className="auth-alert" role="alert">
    <WarningIcon />
    <span>{message}</span>
  </div>
);

export const MailCheckIllustration = () => (
  <div className="auth-mail-illustration" aria-hidden="true">
    <div className="auth-mail-flap" />
    <div className="auth-mail-body" />
    <span className="auth-mail-check">
      <CheckIcon />
    </span>
  </div>
);

export const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SpinnerIcon = () => (
  <svg
    className="auth-spinner"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.25"
    />
    <path
      d="M14 8a6 6 0 0 0-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="m4 7 8 6 8-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="4"
      y="11"
      width="16"
      height="9"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 11V8a4 4 0 1 1 8 0v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M10 3 5 8l5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path
      d="m3 8 3 3 7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 6v4M9 13h.01M16 15 9 2 2 15h14z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M1.5 9s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M2 2l14 14M7.4 7.6A2.2 2.2 0 0 0 10.4 10.6M5.1 5.4C2.9 6.7 1.5 9 1.5 9s2.8 5 7.5 5c1.4 0 2.6-.4 3.7-1M14.2 11.3C15.6 10.1 16.5 9 16.5 9S13.7 4 9 4c-.6 0-1.2.1-1.8.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
    <path
      d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.5h4.8a4.1 4.1 0 0 1-1.8 2.7v2.3h2.9c1.7-1.6 2.7-3.9 2.7-6.7z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.4 0 4.5-.8 5.9-2.1L12 13.6c-.8.5-1.8.8-3 .8-2.3 0-4.3-1.6-5-3.7H1v2.3A9 9 0 0 0 9 18z"
      fill="#34A853"
    />
    <path
      d="M4 10.7A5.4 5.4 0 0 1 4 7.3V5H1A9 9 0 0 0 1 13l3-2.3z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.6c1.3 0 2.5.5 3.4 1.3L15 2.3A9 9 0 0 0 1 5l3 2.3c.7-2.1 2.7-3.7 5-3.7z"
      fill="#EA4335"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="#0A66C2">
    <path d="M15.8 0H2.2A2.2 2.2 0 0 0 0 2.2v13.6A2.2 2.2 0 0 0 2.2 18h13.6a2.2 2.2 0 0 0 2.2-2.2V2.2A2.2 2.2 0 0 0 15.8 0zM5.6 15H3V6.8h2.6V15zM4.3 5.6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM15 15h-2.6v-4.5c0-1-.1-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V15H6.8V6.8h2.5v1.1c.4-.7 1.2-1.3 2.5-1.3 2.7 0 3.2 1.7 3.2 4V15z" />
  </svg>
);
