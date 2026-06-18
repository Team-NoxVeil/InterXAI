import { startGoogleOAuth } from "../../services/auth.service";
import type { TokenResponse } from "../../services/auth.service";
import { useSignup } from "./hooks/useSignup";
import {
  ArrowIcon,
  AuthButton,
  AuthCard,
  AuthDivider,
  AuthInput,
  AuthShell,
  AuthSocials,
  EmailIcon,
  FormAlert,
  LockIcon,
  SpinnerIcon,
  Stepper,
  UserIcon,
} from "./components/AuthShell";

export interface SignupPageProps {
  onSignupSuccess?: (data: TokenResponse) => void;
  onLoginClick?: () => void;
  onBack?: () => void;
}

const SignupPage = ({
  onSignupSuccess,
  onLoginClick,
  onBack,
}: SignupPageProps) => {
  const { form, isLoading, error, handleChange, handleSubmit } =
    useSignup(onSignupSuccess);

  return (
    <AuthShell
      eyebrow="Create candidate profile"
      title="Start practising with an AI interviewer."
      subtitle="Set up your learner account and unlock realistic interview simulations with feedback loops built for momentum."
      mode="signup"
      onBack={onBack}
      highlights={[
        "AI-led interview practice",
        "Instant performance feedback",
        "Personal progress tracking",
      ]}
    >
      <AuthCard
        stepLabel={<Stepper activeStep={1} totalSteps={3} />}
        title="Create your account"
        description="Join InterXAI and get your first mock interview ready in minutes."
      >
        <AuthSocials disabled={isLoading} onGoogleClick={startGoogleOAuth} />
        <AuthDivider label="or sign up with email" />

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <FormAlert message={error} />}

          <AuthInput
            id="signup-fullname"
            name="fullName"
            label="Full name"
            placeholder="Jane Doe"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            disabled={isLoading}
            icon={<UserIcon />}
            required
          />

          <AuthInput
            id="signup-email"
            name="email"
            label="Email address"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            disabled={isLoading}
            icon={<EmailIcon />}
            required
          />

          <AuthInput
            id="signup-password"
            name="password"
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            disabled={isLoading}
            icon={<LockIcon />}
            required
          />

          <AuthButton disabled={isLoading}>
            {isLoading ? (
              <>
                <SpinnerIcon /> Creating account
              </>
            ) : (
              <>
                Create Account <ArrowIcon />
              </>
            )}
          </AuthButton>
        </form>

        <p className="auth-legal-copy">
          By signing up, you agree to InterXAI's terms and privacy policy.
        </p>

        <p className="auth-switch-copy">
          Already have an account?{" "}
          <button type="button" onClick={onLoginClick}>
            Sign in
          </button>
        </p>
      </AuthCard>
    </AuthShell>
  );
};

export default SignupPage;
