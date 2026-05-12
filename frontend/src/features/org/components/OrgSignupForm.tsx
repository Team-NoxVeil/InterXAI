/**
 * OrgSignupForm.tsx
 * Pure UI form for organisation signup — no business logic.
 */

import React from 'react';
import FormInput from '../../../components/ui/FormInput';
import Button from '../../../components/ui/Button';
import AlertBanner from '../../../components/ui/AlertBanner';
import type { OrgSignupFormState } from '../hooks/useOrgSignup';

export interface OrgSignupFormProps {
  form: OrgSignupFormState;
  isLoading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onLoginClick?: () => void;
}

const OrgSignupForm: React.FC<OrgSignupFormProps> = ({
  form,
  isLoading,
  error,
  onChange,
  onSubmit,
  onLoginClick,
}) => (
  <form id="org-signup-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
    {error && <AlertBanner message={error} variant="error" />}

    <FormInput
      id="org-signup-username"
      name="username"
      label="Organisation Username"
      type="text"
      placeholder="acme_corp"
      autoComplete="username"
      value={form.username}
      onChange={onChange}
      disabled={isLoading}
      required
    />

    <FormInput
      id="org-signup-email"
      name="email"
      label="Work Email"
      type="email"
      placeholder="hr@acme.com"
      autoComplete="email"
      value={form.email}
      onChange={onChange}
      disabled={isLoading}
      required
    />

    <FormInput
      id="org-signup-password"
      name="password"
      label="Password"
      type="password"
      placeholder="Min. 8 characters"
      autoComplete="new-password"
      value={form.password}
      onChange={onChange}
      disabled={isLoading}
      revealable
      required
    />

    <FormInput
      id="org-signup-confirm-password"
      name="confirmPassword"
      label="Confirm Password"
      type="password"
      placeholder="Re-enter password"
      autoComplete="new-password"
      value={form.confirmPassword}
      onChange={onChange}
      disabled={isLoading}
      revealable
      required
    />

    <Button
      id="org-signup-submit"
      type="submit"
      variant="primary"
      className="w-full justify-center py-3.5 text-sm mt-1"
      disabled={isLoading}
    >
      {isLoading ? <><SpinnerIcon /> Creating account…</> : 'Create Organisation Account'}
    </Button>

    <div className="flex items-center gap-3">
      <span className="flex-1 h-px bg-white/10" />
      <span className="text-white/30 text-xs">or</span>
      <span className="flex-1 h-px bg-white/10" />
    </div>

    <p className="text-center text-sm text-white/50">
      Already have an account?{' '}
      <button
        type="button"
        onClick={onLoginClick}
        className="text-[#3ddc84] hover:underline font-medium"
      >
        Sign in
      </button>
    </p>
  </form>
);

const SpinnerIcon = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
    <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default OrgSignupForm;
