import {
  AuthButton,
  AuthCard,
  AuthShell,
  MailCheckIllustration,
  Stepper,
} from "./components/AuthShell";

export interface VerifyEmailPageProps {
  email?: string;
  onBackToSignup?: () => void;
  onContinue?: () => void;
  onLoginClick?: () => void;
}

const VerifyEmailPage = ({
  email,
  onBackToSignup,
  onContinue,
  onLoginClick,
}: VerifyEmailPageProps) => {
  const displayEmail = email || "your inbox";

  return (
    <AuthShell
      eyebrow="Email verification"
      title="One final check before the interview room."
      subtitle="The verification step mirrors the requested design reference while keeping the current frontend-only auth flow lightweight."
      mode="verify"
      onBack={onBackToSignup}
      highlights={[
        "Confirm account ownership",
        "Keep interview data protected",
        "Continue setup when ready",
      ]}
    >
      <AuthCard
        center
        stepLabel={<Stepper activeStep={2} totalSteps={3} />}
        title="Verify your email"
        description={`We sent a verification link to ${displayEmail}.`}
      >
        <MailCheckIllustration />

        <div className="auth-verification-actions">
          <AuthButton type="button" onClick={onContinue}>
            Continue to profile setup
          </AuthButton>
          <button className="auth-secondary-action" type="button">
            Resend link
          </button>
          <button
            className="auth-text-action"
            type="button"
            onClick={onLoginClick}
          >
            Back to sign in
          </button>
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default VerifyEmailPage;
