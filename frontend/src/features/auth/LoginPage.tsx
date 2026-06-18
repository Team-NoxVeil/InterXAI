import { startGoogleOAuth } from "../../services/auth.service";
import type { TokenResponse } from "../../services/auth.service";
import { useLogin } from "./hooks/useLogin";
import {
  ArrowIcon,
  AuthButton,
  AuthCard,
  AuthDivider,
  AuthInput,
  AuthShell,
  AuthSocials,
  FormAlert,
  LockIcon,
  SpinnerIcon,
  UserIcon,
} from "./components/AuthShell";

export interface LoginPageProps {
  onLoginSuccess?: (data: TokenResponse) => void;
  onSignupClick?: () => void;
  onBack?: () => void;
}

const LoginPage = ({
  onLoginSuccess,
  onSignupClick,
  onBack,
}: LoginPageProps) => {
  const { form, isLoading, error, handleChange, handleSubmit } =
    useLogin(onLoginSuccess);

  return (
    <AuthShell
      eyebrow="Student portal"
      title="Welcome back to your interview lab."
      subtitle="Resume your AI practice sessions, review feedback, and keep sharpening your answers with a calmer sign-in flow."
      mode="login"
      onBack={onBack}
      highlights={[
        "Adaptive interview practice",
        "Progress saved securely",
        "Fast return to your dashboard",
      ]}
    >
      <AuthCard
        stepLabel="Secure sign in"
        title="Sign in to InterXAI"
        description="Use your account to continue preparing with AI-led interviews."
      >
        <AuthSocials disabled={isLoading} onGoogleClick={startGoogleOAuth} />
        <AuthDivider label="or sign in with username" />

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <FormAlert message={error} />}

          <AuthInput
            id="username"
            name="username"
            label="Username"
            placeholder="your_username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            disabled={isLoading}
            icon={<UserIcon />}
            required
          />

          <AuthInput
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            disabled={isLoading}
            icon={<LockIcon />}
            required
          />

          <div className="auth-form-row">
            <label className="auth-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot-password">Forgot password?</a>
          </div>

          <AuthButton disabled={isLoading}>
            {isLoading ? (
              <>
                <SpinnerIcon /> Signing in
              </>
            ) : (
              <>
                Sign In <ArrowIcon />
              </>
            )}
          </AuthButton>
        </form>

        <p className="auth-switch-copy">
          New to InterXAI?{" "}
          <button type="button" onClick={onSignupClick}>
            Create an account
          </button>
        </p>
      </AuthCard>
    </AuthShell>
  );
};

export default LoginPage;
