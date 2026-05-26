import React from "react";
import Orb from "../../components/Orb";
import { useProfileSetup } from "./hooks/useProfileSetup";
import type { UserResponse } from "../../services/user.service";

export interface ProfileSetupPageProps {
  userId: number;
  token: string;
  username: string;
  onComplete: (user: UserResponse) => void;
}

const ProfileSetupPage: React.FC<ProfileSetupPageProps> = ({
  userId,
  token,
  username,
  onComplete,
}) => {
  const { form, isLoading, error, handleChange, handleSubmit, handleSkip } =
    useProfileSetup(userId, token, onComplete);

  return (
    <div
      id="profile-setup-page"
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
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
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
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
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
        </div>
      </nav>

      <section
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 52px 40px",
          alignItems: "center",
          minHeight: "calc(100vh - 90px)",
          gap: 48,
        }}
      >
        {/* LEFT: orb + welcome */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Pill text="Almost there" />
          <h1
            style={{
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#0f172a",
              marginTop: 18,
              marginBottom: 14,
              letterSpacing: "-1.4px",
            }}
          >
            Welcome,
            <br />
            <span style={{ color: "#2563eb" }}>{username}.</span>{" "}
            <span style={{ fontSize: 44 }}>👋</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#64748b",
              lineHeight: 1.6,
              marginBottom: 28,
              maxWidth: 460,
              fontWeight: 500,
            }}
          >
            One last step — round out your profile so organisations can find
            you. Everything here is optional and editable later.
          </p>

          <div
            style={{
              position: "relative",
              width: 380,
              height: 380,
              marginLeft: -40,
              marginTop: -10,
            }}
          >
            <Orb scale={0.6} showCards={false} showPodium={false} />
          </div>
        </div>

        {/* RIGHT: form card */}
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
              position: "relative",
              zIndex: 5,
              width: "100%",
              maxWidth: 480,
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
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.5px",
                marginBottom: 4,
              }}
            >
              Set up your profile
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "#64748b",
                marginBottom: 22,
                fontWeight: 500,
              }}
            >
              All fields are optional · You can change these anytime
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {error && <ErrorAlert message={error} />}

              <FormField
                id="setup-bio"
                name="bio"
                label="Short Bio"
                placeholder="Tell recruiters about yourself — your focus, what you're learning…"
                value={form.bio}
                onChange={handleChange}
                disabled={isLoading}
                textarea
                icon={<PersonIcon />}
              />

              <FormField
                id="setup-github"
                name="github"
                label="GitHub"
                placeholder="https://github.com/yourhandle"
                type="url"
                value={form.github}
                onChange={handleChange}
                disabled={isLoading}
                icon={<GithubIcon />}
              />

              <FormField
                id="setup-linkedin"
                name="linkedin"
                label="LinkedIn"
                placeholder="https://linkedin.com/in/yourhandle"
                type="url"
                value={form.linkedin}
                onChange={handleChange}
                disabled={isLoading}
                icon={<LinkedInIcon />}
              />

              <FormField
                id="setup-leetcode"
                name="leetcode"
                label="LeetCode"
                placeholder="https://leetcode.com/yourhandle"
                type="url"
                value={form.leetcode}
                onChange={handleChange}
                disabled={isLoading}
                icon={<CodeIcon />}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
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
                    boxShadow: "0 8px 24px rgba(59,130,246,0.45)",
                    opacity: isLoading ? 0.7 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner /> Saving…
                    </>
                  ) : (
                    <>
                      Save & Continue
                      <ArrowIcon />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  id="profile-setup-skip"
                  onClick={handleSkip}
                  disabled={isLoading}
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(203,213,225,0.7)",
                    borderRadius: 99,
                    padding: "13px 22px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#475569",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  Skip
                </button>
              </div>
            </form>
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

interface FormFieldProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label: string;
  id: string;
  icon?: React.ReactNode;
  textarea?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  icon,
  textarea,
  type = "text",
  ...props
}) => (
  <div style={{ marginBottom: 14 }}>
    <label
      htmlFor={id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12.5,
        fontWeight: 600,
        color: "#475569",
        marginBottom: 6,
      }}
    >
      <span style={{ color: "#2563eb", display: "flex" }}>{icon}</span>
      {label}
      <span
        style={{
          marginLeft: "auto",
          fontSize: 11,
          color: "#94a3b8",
          fontWeight: 500,
        }}
      >
        optional
      </span>
    </label>
    <div style={{ position: "relative" }}>
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(203,213,225,0.7)",
            borderRadius: 12,
            padding: "11px 14px",
            fontSize: 14,
            color: "#0f172a",
            outline: "none",
            transition: "all 0.2s",
            boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
            resize: "vertical",
            fontFamily: "inherit",
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
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          type={type}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(203,213,225,0.7)",
            borderRadius: 12,
            padding: "11px 14px",
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
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
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

const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M2 12.5c0-2.76 2.24-5 5-5s5 2.24 5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M7 1a6 6 0 00-1.9 11.69c.3.06.41-.13.41-.29V11.1c-1.67.36-2.02-.8-2.02-.8A1.59 1.59 0 002.8 9.4c-.53-.36.04-.35.04-.35a1.26 1.26 0 01.92.62 1.28 1.28 0 001.75.5 1.28 1.28 0 01.38-.8C4.37 9.18 2.86 8.63 2.86 6.16a2.3 2.3 0 01.6-1.6 2.12 2.12 0 01.06-1.58s.5-.16 1.63.6a5.57 5.57 0 013 0c1.13-.76 1.62-.6 1.62-.6a2.12 2.12 0 01.07 1.58 2.3 2.3 0 01.6 1.6c0 2.48-1.51 3.02-2.95 3.18a1.43 1.43 0 01.41 1.12v1.66c0 .16.1.35.41.29A6 6 0 007 1z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <rect x="1" y="4.5" width="2.5" height="8" rx="0.5" />
    <circle cx="2.25" cy="2.25" r="1.25" />
    <path d="M5 4.5h2.4v1.1h.03A2.63 2.63 0 019.8 4.3C12.04 4.3 12.5 5.77 12.5 7.7v4.8H10V8.1c0-.9-.02-2.05-1.25-2.05-1.25 0-1.44.98-1.44 1.98v4.5H5V4.5z" />
  </svg>
);

const CodeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M4.5 4L1.5 7l3 3M9.5 4l3 3-3 3M8.5 2l-3 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ProfileSetupPage;
