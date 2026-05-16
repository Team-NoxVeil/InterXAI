/**
 * LoginForm.tsx
 * Pure UI form component — receives all state and handlers via props.
 * Zero business logic; just renders inputs and delegates events upward.
 */

import React from "react";
import FormInput from "../../../components/ui/FormInput";
import Button from "../../../components/ui/Button";
import AlertBanner from "../../../components/ui/AlertBanner";
import type { LoginFormState } from "../hooks/useLogin";

export interface LoginFormProps {
  form: LoginFormState;
  isLoading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignupClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  form,
  isLoading,
  error,
  onChange,
  onSubmit,
  onSignupClick,
}) => (
  <form
    id="login-form"
    onSubmit={onSubmit}
    noValidate
    className="flex flex-col gap-5"
  >
    {/* Error banner */}
    {error && <AlertBanner message={error} variant="error" />}

    {/* Username */}
    <FormInput
      id="username"
      name="username"
      label="Username"
      type="text"
      placeholder="your_username"
      autoComplete="username"
      value={form.username}
      onChange={onChange}
      disabled={isLoading}
      required
    />

    {/* Password */}
    <FormInput
      id="password"
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

    {/* Forgot password link */}
    <div className="flex justify-end -mt-2">
      <a
        href="#forgot"
        className="text-xs text-[#3ddc84]/70 hover:text-[#3ddc84] transition-colors"
      >
        Forgot password?
      </a>
    </div>

    {/* Submit */}
    <Button
      id="login-submit"
      type="submit"
      variant="primary"
      className="w-full justify-center py-3.5 text-sm mt-1"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <SpinnerIcon />
          Signing in…
        </>
      ) : (
        "Sign In"
      )}
    </Button>

    {/* Divider */}
    <div className="flex items-center gap-3">
      <span className="flex-1 h-px bg-white/10" />
      <span className="text-white/30 text-xs">or</span>
      <span className="flex-1 h-px bg-white/10" />
    </div>

    {/* Sign up link */}
    <p className="text-center text-sm text-white/50">
      Don't have an account?{" "}
      <button
        type="button"
        onClick={onSignupClick}
        className="text-[#3ddc84] hover:underline font-medium"
      >
        Sign up free
      </button>
    </p>
  </form>
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

export default LoginForm;
