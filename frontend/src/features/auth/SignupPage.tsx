import React from "react";
import Orb from "../../components/Orb";
import { useSignup } from "./hooks/useSignup";
import type { TokenResponse } from "../../services/auth.service";

export interface SignupPageProps {
  onSignupSuccess?: (data: TokenResponse) => void;
  onLoginClick?: () => void;
  onBack?: () => void;
}

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
            <span
              style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}
            >
              X
            </span>
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
              background: "transparent",
              border: "none",
              color: "#4b5563",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
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

      <section
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 1300,
          margin: "0 auto",
          padding: "20px 52px",
          alignItems: "center",
          minHeight: "calc(100vh - 90px)",
          gap: 32,
        }}
      >
        {/* LEFT: signup form */}
        <div style={{ maxWidth: 460, justifySelf: "center", width: "100%" }}>
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
              marginBottom: 22,
              boxShadow: "0 2px 10px rgba(59,130,246,0.08)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="#3b82f6">
              <path d="M6 0l1.3 3.7 3.7.3-2.7 2.6.8 3.6L6 8.3l-3.1 1.9.8-3.6L1 4.1l3.7-.4z" />
            </svg>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8" }}
            >
              Create Your Account
            </span>
          </div>

          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#0f172a",
              marginBottom: 12,
              letterSpacing: "-1.4px",
            }}
          >
            Start your <span style={{ color: "#2563eb" }}>journey.</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#64748b",
              lineHeight: 1.6,
              marginBottom: 28,
              fontWeight: 500,
            }}
          >
            Sign up and let AI run your interviews, evaluate your skills, and
            help you grow.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.9)",
              borderRadius: 24,
              padding: 28,
              boxShadow:
                "0 25px 50px -12px rgba(15,23,42,0.1), inset 0 1px 2px rgba(255,255,255,0.6)",
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              {error && (
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
                    marginBottom: 18,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M8 5v3.5M8 11h.01"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <LightInput
                id="signup-fullname"
                name="fullName"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <LightInput
                id="signup-email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="john.doe@email.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
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
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  marginTop: 8,
                  background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 99,
                  padding: "13px 28px",
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: "0 6px 22px rgba(59,130,246,0.48)",
                  opacity: isLoading ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {isLoading ? (
                  <>
                    <Spinner /> Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M1 6h10M7 2l4 4-4 4"
                        stroke="white"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#94a3b8",
                marginTop: 14,
              }}
            >
              By creating an account, you agree to our{" "}
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
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: orb */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 600,
          }}
        >
          <Orb scale={0.75} showCards />
        </div>
      </section>
    </div>
  );
};

interface LightInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const LightInput: React.FC<LightInputProps> = ({
  label,
  id,
  type = "text",
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
        <input
          id={id}
          type={inputType}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(203,213,225,0.7)",
            borderRadius: 12,
            padding: "11px 14px",
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

export default SignupPage;
