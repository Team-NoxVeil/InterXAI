import React from "react";
import Orb from "../../components/Orb";
import { useSignup } from "./hooks/useSignup";
import { startGoogleOAuth } from "../../services/auth.service";
import type { TokenResponse } from "../../services/auth.service";

export interface SignupPageProps {
  onSignupSuccess?: (data: TokenResponse) => void;
  onLoginClick?: () => void;
  onBack?: () => void;
}

const BENEFITS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "AI-led interviews",
    desc: "Practice with realistic, adaptive sessions on demand.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 3v18h18M7 14l4-4 4 4 5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Actionable feedback",
    desc: "Get scored on clarity, structure, and confidence after each round.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2l2.4 7.6L22 10l-7.6 2.4L12 20l-2.4-7.6L2 10l7.6-2.4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Track your growth",
    desc: "Watch your confidence score climb across sessions.",
  },
];

const SignupPage: React.FC<SignupPageProps> = ({
  onSignupSuccess,
  onLoginClick,
  onBack,
}) => {
  const { form, isLoading, error, handleChange, handleSubmit } =
    useSignup(onSignupSuccess);

  return (
    <div
      id="signup-page"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(155deg, #bdd9f2 0%, #cfe8fb 12%, #dff0ff 28%, #ecf7ff 45%, #f4faff 62%, #e8f4fd 78%, #d2e9f8 100%)",
        fontFamily:
          "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <BgBlobs />
      <TopNav onBack={onBack} />

      <section
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 52px 40px",
          alignItems: "center",
          minHeight: "calc(100vh - 90px)",
          gap: 48,
        }}
      >
        {/* LEFT: marketing copy + benefits + tiny orb */}
        <div style={{ position: "relative" }}>
          <Pill text="AI-Powered Interview Platform" />
          <h1
            style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#0f172a",
              marginTop: 18,
              marginBottom: 16,
              letterSpacing: "-1.6px",
            }}
          >
            Land your
            <br />
            <span style={{ color: "#2563eb" }}>dream role.</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#64748b",
              lineHeight: 1.6,
              marginBottom: 32,
              maxWidth: 460,
              fontWeight: 500,
            }}
          >
            Sign up to run AI-led interviews, get instant feedback, and grow
            your confidence — all in one place.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginBottom: 36,
              maxWidth: 460,
            }}
          >
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.85)",
                  borderRadius: 16,
                  boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    borderRadius: 10,
                    background: "linear-gradient(145deg,#dbeafe,#bfdbfe)",
                    color: "#1d4ed8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(147,197,253,0.5)",
                  }}
                >
                  {b.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "#0f172a",
                      marginBottom: 2,
                    }}
                  >
                    {b.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <SocialProof
            avatars={["#3b82f6", "#60a5fa", "#93c5fd"]}
            text="Trusted by 10,000+ candidates already preparing"
          />
        </div>

        {/* RIGHT: signup card + orb on top */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Orb floats behind/above the card as a hero decoration */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 380,
              height: 380,
              pointerEvents: "none",
              zIndex: 1,
              opacity: 0.95,
            }}
          >
            <Orb scale={0.55} showCards={false} showPodium={false} />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 5,
              width: "100%",
              maxWidth: 440,
              background: "rgba(255,255,255,0.78)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.95)",
              borderRadius: 28,
              padding: 32,
              boxShadow:
                "0 35px 60px -15px rgba(15,23,42,0.18), inset 0 1px 2px rgba(255,255,255,0.7)",
            }}
          >
            <StepIndicator current={1} total={3} />
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.6px",
                marginBottom: 6,
              }}
            >
              Create your account
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "#64748b",
                marginBottom: 22,
                fontWeight: 500,
              }}
            >
              Free 14-day trial · No credit card required
            </p>

            <SocialAuthRow disabled={isLoading} />

            <Divider label="or sign up with email" />

            <form onSubmit={handleSubmit} noValidate>
              {error && <ErrorAlert message={error} />}

              <LightInput
                id="signup-fullname"
                name="fullName"
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                disabled={isLoading}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                required
              />
              <LightInput
                id="signup-email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                required
              />
              <LightInput
                id="signup-password"
                name="password"
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 11V7a5 5 0 0110 0v4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                required
              />

              <PrimaryButton disabled={isLoading} fullWidth>
                {isLoading ? (
                  <>
                    <Spinner /> Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowIcon />
                  </>
                )}
              </PrimaryButton>
            </form>

            <p
              style={{
                textAlign: "center",
                fontSize: 11.5,
                color: "#94a3b8",
                marginTop: 14,
                lineHeight: 1.5,
              }}
            >
              By signing up, you agree to our{" "}
              <a
                href="#terms"
                style={{ color: "#2563eb", textDecoration: "none" }}
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#privacy"
                style={{ color: "#2563eb", textDecoration: "none" }}
              >
                Privacy Policy
              </a>
              .
            </p>

            <div
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: "1px solid rgba(226,232,240,0.7)",
                textAlign: "center",
                fontSize: 14,
                color: "#64748b",
              }}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                style={{
                  color: "#2563eb",
                  background: "transparent",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const BgBlobs = () => (
  <>
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 800,
        height: 800,
        background: "rgba(219,234,254,0.5)",
        borderRadius: "50%",
        filter: "blur(120px)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "-20%",
        width: 600,
        height: 600,
        background: "rgba(207,232,251,0.5)",
        borderRadius: "50%",
        filter: "blur(100px)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  </>
);

const TopNav: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <nav
    style={{
      position: "relative",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 52px",
      maxWidth: 1300,
      margin: "0 auto",
    }}
  >
    <button
      onClick={onBack}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: "linear-gradient(145deg,#4f9cf9,#1649c9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid rgba(255,255,255,0.35)",
        }}
      >
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>X</span>
      </div>
      <span
        style={{
          fontWeight: 800,
          fontSize: 17,
          color: "#0f172a",
          letterSpacing: "-0.4px",
        }}
      >
        InterXAI
      </span>
    </button>
    {onBack && (
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 99,
          padding: "8px 16px",
          color: "#475569",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M9 3L5 7l4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to home
      </button>
    )}
  </nav>
);

const Pill: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(147,197,253,0.55)",
      borderRadius: 99,
      padding: "6px 14px",
      boxShadow: "0 2px 10px rgba(59,130,246,0.08)",
    }}
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="#3b82f6">
      <path d="M6 0l1.3 3.7 3.7.3-2.7 2.6.8 3.6L6 8.3l-3.1 1.9.8-3.6L1 4.1l3.7-.4z" />
    </svg>
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "#1d4ed8",
        letterSpacing: "0.02em",
      }}
    >
      {text}
    </span>
  </div>
);

const StepIndicator: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 14,
    }}
  >
    {Array.from({ length: total }).map((_, i) => {
      const active = i + 1 <= current;
      return (
        <React.Fragment key={i}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: active
                ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                : "rgba(226,232,240,0.8)",
              color: active ? "#fff" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              boxShadow: active ? "0 4px 10px rgba(59,130,246,0.3)" : "none",
            }}
          >
            {i + 1}
          </div>
          {i < total - 1 && (
            <div
              style={{
                height: 2,
                width: 26,
                background:
                  i + 1 < current
                    ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
                    : "rgba(226,232,240,0.8)",
                borderRadius: 1,
              }}
            />
          )}
        </React.Fragment>
      );
    })}
    <span
      style={{
        marginLeft: 8,
        fontSize: 11.5,
        fontWeight: 600,
        color: "#64748b",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      Step {current} of {total}
    </span>
  </div>
);

const SocialAuthRow: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
    <SocialBtn disabled={disabled} label="Google" onClick={startGoogleOAuth}>
      <GoogleIcon />
    </SocialBtn>
    <SocialBtn disabled={disabled} label="LinkedIn">
      <LinkedInIcon />
    </SocialBtn>
  </div>
);

const SocialBtn: React.FC<{
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ disabled, label, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "10px 12px",
      background: "rgba(255,255,255,0.85)",
      border: "1px solid rgba(203,213,225,0.7)",
      borderRadius: 12,
      color: "#334155",
      fontSize: 13,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.2s",
      boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
    }}
  >
    {children}
    {label}
  </button>
);

const Divider: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 18,
    }}
  >
    <span style={{ flex: 1, height: 1, background: "rgba(226,232,240,0.9)" }} />
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#94a3b8",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
    <span style={{ flex: 1, height: 1, background: "rgba(226,232,240,0.9)" }} />
  </div>
);

const SocialProof: React.FC<{ avatars: string[]; text: string }> = ({
  avatars,
  text,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    <div style={{ display: "flex" }}>
      {avatars.map((c, i) => (
        <div
          key={i}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${c}, ${c}cc)`,
            border: "2px solid #fff",
            marginLeft: i === 0 ? 0 : -10,
            boxShadow: "0 2px 6px rgba(15,23,42,0.1)",
          }}
        />
      ))}
    </div>
    <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
      {text}
    </span>
  </div>
);

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <div
    role="alert"
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "10px 14px",
      borderRadius: 12,
      background: "rgba(254,226,226,0.7)",
      border: "1px solid rgba(248,113,113,0.5)",
      color: "#b91c1c",
      fontSize: 13,
      fontWeight: 500,
      marginBottom: 14,
    }}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 5v3.5M8 11h.01"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
    <span>{message}</span>
  </div>
);

interface LightInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon?: React.ReactNode;
}

const LightInput: React.FC<LightInputProps> = ({
  label,
  id,
  type = "text",
  icon,
  ...props
}) => {
  const [revealed, setRevealed] = React.useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (revealed ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: 14 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 12.5,
          fontWeight: 600,
          color: "#475569",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <div
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              display: "flex",
              pointerEvents: "none",
            }}
          >
            {icon}
          </div>
        )}
        <input
          id={id}
          type={inputType}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(203,213,225,0.7)",
            borderRadius: 12,
            padding: "11px 14px",
            paddingLeft: icon ? 38 : 14,
            paddingRight: isPassword ? 40 : 14,
            fontSize: 14,
            color: "#0f172a",
            outline: "none",
            transition: "all 0.2s",
            boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(59,130,246,0.7)";
            e.currentTarget.style.boxShadow =
              "inset 0 1px 2px rgba(15,23,42,0.04), 0 0 0 3px rgba(59,130,246,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(203,213,225,0.7)";
            e.currentTarget.style.boxShadow =
              "inset 0 1px 2px rgba(15,23,42,0.04)";
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            tabIndex={-1}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: 0,
              display: "flex",
            }}
            aria-label={revealed ? "Hide password" : "Show password"}
          >
            {revealed ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 2l14 14M7.4 7.5A2.25 2.25 0 0011.5 11.6M5.2 5.3C3.2 6.5 1 9 1 9s3 5.5 8 5.5c1.5 0 2.9-.4 4.1-1.1M13.5 12.3C15.3 11 17 9 17 9S14 3.5 9 3.5c-.8 0-1.5.1-2.2.3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M1 9S4 3.5 9 3.5 17 9 17 9s-3 5.5-8 5.5S1 9 1 9z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle
                  cx="9"
                  cy="9"
                  r="2.25"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const PrimaryButton: React.FC<{
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}> = ({ disabled, fullWidth, children }) => (
  <button
    type="submit"
    disabled={disabled}
    style={{
      width: fullWidth ? "100%" : undefined,
      marginTop: 8,
      background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
      color: "#fff",
      border: "none",
      borderRadius: 99,
      padding: "13px 28px",
      fontSize: 14.5,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      boxShadow: "0 8px 24px rgba(59,130,246,0.45)",
      opacity: disabled ? 0.7 : 1,
      transition: "all 0.2s",
    }}
  >
    {children}
  </button>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Spinner = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{ animation: "spin 1s linear infinite" }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="#0A66C2">
    <path d="M15.75 0H2.25A2.25 2.25 0 000 2.25v13.5A2.25 2.25 0 002.25 18h13.5A2.25 2.25 0 0018 15.75V2.25A2.25 2.25 0 0015.75 0zM5.625 15H3V6.75h2.625V15zm-1.312-9.45a1.519 1.519 0 110-3.037 1.519 1.519 0 010 3.037zM15 15h-2.625V10.5c0-.99-.018-2.263-1.378-2.263-1.381 0-1.593 1.078-1.593 2.19V15H6.779V6.75h2.52v1.163h.036c.35-.664 1.207-1.363 2.484-1.363 2.656 0 3.147 1.748 3.147 4.022V15H15z" />
  </svg>
);

export default SignupPage;
