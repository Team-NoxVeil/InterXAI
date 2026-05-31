/**
 * OrgLoginForm.tsx
 * Pure UI form — receives all state via props, zero business logic.
 */

import React from "react";
import FormInput from "../../../components/ui/FormInput";
import Button from "../../../components/ui/Button";
import AlertBanner from "../../../components/ui/AlertBanner";
import type { OrgLoginFormState } from "../hooks/useOrgLogin";

export interface OrgLoginFormProps {
  form: OrgLoginFormState;
  isLoading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignupClick?: () => void;
}

const OrgLoginForm: React.FC<OrgLoginFormProps> = ({
  form,
  isLoading,
  error,
  onChange,
  onSubmit,
  onSignupClick,
}) => (
  <form
    id="org-login-form"
    onSubmit={onSubmit}
    noValidate
    className="flex flex-col gap-5"
  >
    {error && <AlertBanner message={error} variant="error" />}

    <FormInput
      id="org-login-username"
      name="username"
      label="Username"
      type="text"
      placeholder="org_username"
      autoComplete="username"
      value={form.username}
      onChange={onChange}
      disabled={isLoading}
      required
    />

    <FormInput
      id="org-login-password"
      name="password"
      label="Password"
      type="password"
      placeholder="••••••••"
      autoComplete="current-password"
      value={form.password}
      onChange={onChange}
      disabled={isLoading}
      revealable
      required
    />

    <div className="flex justify-end -mt-2">
      <a
        href="#forgot"
        className="text-xs text-[#3ddc84]/70 hover:text-[#3ddc84] transition-colors"
      >
        Forgot password?
      </a>
    </div>

    <Button
      id="org-login-submit"
      type="submit"
      variant="primary"
      className="w-full justify-center py-3.5 text-sm mt-1"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <SpinnerIcon /> Signing in…
        </>
      ) : (
        "Sign In"
      )}
    </Button>

    <Divider />

    <p className="text-center text-sm text-white/50">
      Don't have an account?{" "}
      <button
        type="button"
        onClick={onSignupClick}
        className="text-[#3ddc84] hover:underline font-medium"
      >
        Register your organisation
      </button>
    </p>
  </form>
);

// ── Sub-components ────────────────────────────────────────────────────────────

const Divider = () => (
  <div className="flex items-center gap-3">
    <span className="flex-1 h-px bg-white/10" />
    <span className="text-white/30 text-xs">or</span>
    <span className="flex-1 h-px bg-white/10" />
  </div>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin"
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
      strokeOpacity="0.25"
    />
    <path
      d="M14 8a6 6 0 00-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default OrgLoginForm;
