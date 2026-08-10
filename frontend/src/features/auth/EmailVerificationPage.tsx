import React, { useState, useRef, useEffect } from "react";
import Orb from "../../components/Orb";

export interface EmailVerificationPageProps {
  email?: string;
  onVerifySuccess?: () => void;
  onBack?: () => void;
}

const SECURITY_HIGHLIGHTS = [
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
    title: "Secure your credentials",
    desc: "Verification prevents unauthorised access to your account details.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Receive session results",
    desc: "AI feedback and interview summaries will be sent to your verified email.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Recruiter notifications",
    desc: "Get instant alerts when organisations view your profile or request interviews.",
  },
];

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  email = "your email address",
  onVerifySuccess,
  onBack,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(59);
  
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Count down resend timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    // Keep only the last character entered
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // Focus previous input and delete its value
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
        setError(null);
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
        setError(null);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) {
      setError("Please paste a valid 6-digit numeric code.");
      return;
    }

    const digits = pastedData.split("");
    setCode(digits);
    setError(null);
    inputRefs.current[5]?.focus();
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(59);
    setError(null);
    setCode(Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = code.join("");
    
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call to backend auth verification endpoint
    setTimeout(() => {
      if (otp === "123456") {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          if (onVerifySuccess) onVerifySuccess();
        }, 1200);
      } else {
        setIsLoading(false);
        setError("Invalid verification code. Please enter 123456 to pass the simulation.");
      }
    }, 1500);
  };

  return (
    <div
      id="email-verification-page"
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
        {/* LEFT: secure account benefits */}
        <div style={{ position: "relative" }}>
          <Pill text="Verification Required" />
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
            Verify your
            <br />
            <span style={{ color: "#2563eb" }}>identity.</span>
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
            We take your profile and data security seriously. Verifying your email ensures a safe experience for both you and hiring organizations.
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
            {SECURITY_HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
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
                  {h.icon}
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
                    {h.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    {h.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: verification card + orb */}
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
            <StepIndicator current={2} total={3} />
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.6px",
                marginBottom: 6,
              }}
            >
              Verify your email
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "#64748b",
                marginBottom: 24,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              We've sent a 6-digit code to <strong style={{ color: "#0f172a" }}>{email}</strong>. Please enter it below.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {error && <ErrorAlert message={error} />}

              {/* Helper badge for developer simulation */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(37,99,235,0.06)",
                  border: "1px solid rgba(37,99,235,0.15)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#1d4ed8",
                  marginBottom: 20,
                }}
              >
                <span>💡</span>
                <span>Verification code is <strong style={{ textDecoration: "underline" }}>123456</strong> (Simulation)</span>
              </div>

              {/* Numeric OTP Input Slots */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[idx] = el as HTMLInputElement)}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    disabled={isLoading || success}
                    style={{
                      width: "100%",
                      height: 52,
                      background: success ? "rgba(240,253,244,0.9)" : "rgba(255,255,255,0.95)",
                      border: success
                        ? "1.5px solid rgba(74,222,128,0.7)"
                        : "1.5px solid rgba(203,213,225,0.7)",
                      borderRadius: 14,
                      textAlign: "center",
                      fontSize: 22,
                      fontWeight: 800,
                      color: success ? "#15803d" : "#0f172a",
                      outline: "none",
                      transition: "all 0.2s",
                      boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
                    }}
                    onFocus={(e) => {
                      if (!success) {
                        e.currentTarget.style.borderColor = "rgba(59,130,246,0.7)";
                        e.currentTarget.style.boxShadow =
                          "inset 0 1px 2px rgba(15,23,42,0.04), 0 0 0 3px rgba(59,130,246,0.15)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!success) {
                        e.currentTarget.style.borderColor = "rgba(203,213,225,0.7)";
                        e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(15,23,42,0.04)";
                      }
                    }}
                  />
                ))}
              </div>

              <PrimaryButton disabled={isLoading || success} fullWidth>
                {isLoading ? (
                  <>
                    <Spinner /> Verifying…
                  </>
                ) : success ? (
                  <>
                    ✓ Verified Successfully
                  </>
                ) : (
                  <>
                    Verify Code
                    <ArrowIcon />
                  </>
                )}
              </PrimaryButton>
            </form>

            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: "1px solid rgba(226,232,240,0.7)",
                textAlign: "center",
                fontSize: 13.5,
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isLoading || success}
                style={{
                  color: countdown > 0 ? "#94a3b8" : "#2563eb",
                  background: "transparent",
                  border: "none",
                  fontWeight: 700,
                  cursor: countdown > 0 ? "not-allowed" : "pointer",
                  padding: 0,
                }}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
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
        Back
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
      marginBottom: 18,
    }}
  >
    {Array.from({ length: total }).map((_, i) => {
      const step = i + 1;
      const done = step < current;
      const active = step === current;
      return (
        <React.Fragment key={i}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: done
                ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                : active
                  ? "#fff"
                  : "rgba(226,232,240,0.8)",
              color: done ? "#fff" : active ? "#2563eb" : "#94a3b8",
              border: active ? "2px solid #2563eb" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              boxShadow:
                done || active ? "0 4px 10px rgba(59,130,246,0.25)" : "none",
            }}
          >
            {done ? "✓" : step}
          </div>
          {i < total - 1 && (
            <div
              style={{
                height: 2,
                width: 26,
                background: done
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

export default EmailVerificationPage;
