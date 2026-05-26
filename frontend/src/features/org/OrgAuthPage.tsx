import React, { useState } from "react";
import Orb from "../../components/Orb";
import { useOrgLogin } from "./hooks/useOrgLogin";
import { useOrgSignup } from "./hooks/useOrgSignup";
import type { OrgSignupResponse } from "../../services/organization.service";

type Tab = "login" | "signup";

export interface OrgAuthPageProps {
  onLoginSuccess?: (token: string) => void;
  onSignupSuccess?: (data: OrgSignupResponse) => void;
  onBack?: () => void;
}

const ORG_BENEFITS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12l3-3 4 4 8-8M21 4v8h-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Screen 10x faster",
    desc: "Run async AI interviews at scale — no scheduler, no recruiter time.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 7L9 18l-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Standardised scoring",
    desc: "Identical evaluation rubric for every candidate, every role.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "SOC 2 ready",
    desc: "Enterprise-grade security and audit logs out of the box.",
  },
];

const OrgAuthPage: React.FC<OrgAuthPageProps> = ({
  onLoginSuccess,
  onSignupSuccess,
  onBack,
}) => {
  const [tab, setTab] = useState<Tab>("signup");
  const loginHook = useOrgLogin(onLoginSuccess);
  const signupHook = useOrgSignup(onSignupSuccess);

  return (
    <div
      id="org-auth-page"
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
        {/* LEFT: hiring-focused marketing */}
        <div style={{ position: "relative" }}>
          <Pill text="Organisation Portal" />
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
            Hire the best.
            <br />
            <span style={{ color: "#2563eb" }}>Skip the noise.</span>
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
            Set up your organisation in minutes. Let AI run first-round
            interviews so your team only meets the candidates worth meeting.
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
            {ORG_BENEFITS.map((b) => (
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

          <TrustedRow />
        </div>

        {/* RIGHT: auth card + decorative orb */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
              maxWidth: 460,
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
            <div
              role="tablist"
              aria-label="Auth mode"
              style={{
                display: "flex",
                padding: 4,
                background: "rgba(241,245,249,0.7)",
                borderRadius: 99,
                border: "1px solid rgba(226,232,240,0.7)",
                marginBottom: 22,
              }}
            >
              {(["signup", "login"] as Tab[]).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  id={`org-tab-${t}`}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    background:
                      tab === t
                        ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                        : "transparent",
                    color: tab === t ? "#fff" : "#64748b",
                    boxShadow:
                      tab === t ? "0 6px 16px rgba(59,130,246,0.35)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {t === "signup" ? "Create Organisation" : "Sign In"}
                </button>
              ))}
            </div>

            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.5px",
                marginBottom: 4,
              }}
            >
              {tab === "signup" ? "Register your company" : "Welcome back"}
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "#64748b",
                marginBottom: 22,
                fontWeight: 500,
              }}
            >
              {tab === "signup"
                ? "Free for the first 5 candidates · No credit card"
                : "Sign in to manage your hiring pipeline"}
            </p>

            {tab === "signup" ? (
              <OrgSignupInline
                hook={signupHook}
                onLoginClick={() => setTab("login")}
              />
            ) : (
              <OrgLoginInline
                hook={loginHook}
                onSignupClick={() => setTab("signup")}
              />
            )}
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 11.5,
              color: "#94a3b8",
              marginTop: 16,
              maxWidth: 380,
              lineHeight: 1.5,
            }}
          >
            By continuing you agree to our{" "}
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
        </div>
      </section>
    </div>
  );
};

interface OrgSignupInlineProps {
  hook: ReturnType<typeof useOrgSignup>;
  onLoginClick: () => void;
}

const OrgSignupInline: React.FC<OrgSignupInlineProps> = ({
  hook,
  onLoginClick,
}) => (
  <form id="org-signup-form" onSubmit={hook.handleSubmit} noValidate>
    {hook.error && <ErrorAlert message={hook.error} />}

    <LightInput
      id="org-signup-username"
      name="username"
      label="Organisation Username"
      type="text"
      placeholder="acme_corp"
      autoComplete="username"
      value={hook.form.username}
      onChange={hook.handleChange}
      disabled={hook.isLoading}
      icon={<BuildingIcon />}
      required
    />
    <LightInput
      id="org-signup-email"
      name="email"
      label="Work Email"
      type="email"
      placeholder="hr@acme.com"
      autoComplete="email"
      value={hook.form.email}
      onChange={hook.handleChange}
      disabled={hook.isLoading}
      icon={<MailIcon />}
      required
    />
    <LightInput
      id="org-signup-password"
      name="password"
      label="Password"
      type="password"
      placeholder="Min. 8 characters"
      autoComplete="new-password"
      value={hook.form.password}
      onChange={hook.handleChange}
      disabled={hook.isLoading}
      icon={<LockIcon />}
      required
    />
    <LightInput
      id="org-signup-confirm-password"
      name="confirmPassword"
      label="Confirm Password"
      type="password"
      placeholder="Re-enter password"
      autoComplete="new-password"
      value={hook.form.confirmPassword}
      onChange={hook.handleChange}
      disabled={hook.isLoading}
      icon={<LockIcon />}
      required
    />

    <PrimaryButton disabled={hook.isLoading} fullWidth>
      {hook.isLoading ? (
        <>
          <Spinner /> Creating account…
        </>
      ) : (
        <>
          Create Organisation Account
          <ArrowIcon />
        </>
      )}
    </PrimaryButton>

    <p
      style={{
        textAlign: "center",
        fontSize: 14,
        color: "#64748b",
        marginTop: 18,
        paddingTop: 18,
        borderTop: "1px solid rgba(226,232,240,0.7)",
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
        Sign in
      </button>
    </p>
  </form>
);

interface OrgLoginInlineProps {
  hook: ReturnType<typeof useOrgLogin>;
  onSignupClick: () => void;
}

const OrgLoginInline: React.FC<OrgLoginInlineProps> = ({
  hook,
  onSignupClick,
}) => (
  <form id="org-login-form" onSubmit={hook.handleSubmit} noValidate>
    {hook.error && <ErrorAlert message={hook.error} />}

    <LightInput
      id="org-login-username"
      name="username"
      label="Username"
      type="text"
      placeholder="org_username"
      autoComplete="username"
      value={hook.form.username}
      onChange={hook.handleChange}
      disabled={hook.isLoading}
      icon={<BuildingIcon />}
      required
    />
    <LightInput
      id="org-login-password"
      name="password"
      label="Password"
      type="password"
      placeholder="••••••••"
      autoComplete="current-password"
      value={hook.form.password}
      onChange={hook.handleChange}
      disabled={hook.isLoading}
      icon={<LockIcon />}
      required
    />

    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 8,
        marginTop: -6,
      }}
    >
      <a
        href="#forgot"
        style={{
          fontSize: 12,
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Forgot password?
      </a>
    </div>

    <PrimaryButton disabled={hook.isLoading} fullWidth>
      {hook.isLoading ? (
        <>
          <Spinner /> Signing in…
        </>
      ) : (
        <>
          Sign In
          <ArrowIcon />
        </>
      )}
    </PrimaryButton>

    <p
      style={{
        textAlign: "center",
        fontSize: 14,
        color: "#64748b",
        marginTop: 18,
        paddingTop: 18,
        borderTop: "1px solid rgba(226,232,240,0.7)",
      }}
    >
      Don't have an account?{" "}
      <button
        type="button"
        onClick={onSignupClick}
        style={{
          color: "#2563eb",
          background: "transparent",
          border: "none",
          fontWeight: 700,
          cursor: "pointer",
          padding: 0,
        }}
      >
        Register your organisation
      </button>
    </p>
  </form>
);

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

const TrustedRow = () => (
  <div>
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#94a3b8",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      Trusted by hiring teams at
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: 0.6,
        flexWrap: "wrap",
        color: "#475569",
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>
        Google
      </span>
      <span style={{ fontSize: 16, fontWeight: 700 }}>Microsoft</span>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-1px" }}>
        amazon
      </span>
      <span style={{ fontSize: 16, fontWeight: 700 }}>Meta</span>
      <span style={{ fontSize: 16, fontWeight: 700 }}>Stripe</span>
    </div>
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

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h.01M9 13h.01M9 17h.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = () => (
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
);

export default OrgAuthPage;
