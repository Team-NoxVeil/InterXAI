/**
 * ProfileSetupPage.tsx
 * Post-signup / post-login step — lets the user fill in optional profile links.
 * All fields are optional; the user can skip.
 */

import React from "react";
import Logo from "../../components/ui/Logo";
import AlertBanner from "../../components/ui/AlertBanner";
import Button from "../../components/ui/Button";
import { useProfileSetup } from "./hooks/useProfileSetup";
import type { UserResponse } from "../../services/user.service";

export interface ProfileSetupPageProps {
  userId: number;
  token: string;
  username: string;
  onComplete: (user: UserResponse) => void;
}

interface FieldDef {
  id: string;
  name: keyof ReturnType<typeof useProfileSetup>["form"];
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}

const fields: FieldDef[] = [
  {
    id: "setup-bio",
    name: "bio",
    label: "Short Bio",
    placeholder: "Tell recruiters a bit about yourself…",
    icon: <PersonIcon />,
    type: "text",
  },
  {
    id: "setup-github",
    name: "github",
    label: "GitHub URL",
    placeholder: "https://github.com/yourhandle",
    icon: <GithubIcon />,
  },
  {
    id: "setup-linkedin",
    name: "linkedin",
    label: "LinkedIn URL",
    placeholder: "https://linkedin.com/in/yourhandle",
    icon: <LinkedInIcon />,
  },
  {
    id: "setup-leetcode",
    name: "leetcode",
    label: "LeetCode URL",
    placeholder: "https://leetcode.com/yourhandle",
    icon: <CodeIcon />,
  },
];

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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{
        background:
          "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #e0f2fe 100%)",
      }}
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="mb-5" />
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-5">
            <StepDot done />
            <StepLine />
            <StepDot active />
            <StepLine />
            <StepDot />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Welcome, {username}! 👋
          </h1>
          <p className="text-slate-500 text-sm text-center max-w-sm">
            Complete your profile so organisations can find you. All fields are
            optional — you can update them anytime.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-slate-100 p-8">
          <form
            id="profile-setup-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {error && <AlertBanner message={error} variant="error" />}

            {fields.map((f) => (
              <div key={f.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={f.id}
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <span className="text-blue-500">{f.icon}</span>
                  {f.label}
                  <span className="text-slate-400 text-xs font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id={f.id}
                  name={f.name}
                  type={f.type ?? "url"}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm
                    text-slate-900 placeholder-slate-400 outline-none transition-all duration-200
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <Button
                id="profile-setup-submit"
                type="submit"
                variant="primary"
                className="flex-1 justify-center py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner /> Saving…
                  </>
                ) : (
                  "Save & Continue"
                )}
              </Button>
              <button
                type="button"
                id="profile-setup-skip"
                onClick={handleSkip}
                disabled={isLoading}
                className="px-5 py-3 rounded-xl text-sm text-slate-500 hover:text-slate-700
                  border border-slate-200 bg-white hover:bg-slate-50 transition-all"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StepDot = ({ done = false, active = false }) => (
  <div
    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
      ${done ? "bg-blue-600 text-white" : active ? "ring-2 ring-blue-600 bg-white text-blue-600" : "bg-slate-200 text-slate-400"}`}
  >
    {done ? "✓" : active ? "2" : "3"}
  </div>
);

const StepLine = () => <div className="h-px w-10 bg-slate-200" />;

const Spinner = () => (
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

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2 12.5c0-2.76 2.24-5 5-5s5 2.24 5 5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1a6 6 0 00-1.9 11.69c.3.06.41-.13.41-.29V11.1c-1.67.36-2.02-.8-2.02-.8A1.59 1.59 0 002.8 9.4c-.53-.36.04-.35.04-.35a1.26 1.26 0 01.92.62 1.28 1.28 0 001.75.5 1.28 1.28 0 01.38-.8C4.37 9.18 2.86 8.63 2.86 6.16a2.3 2.3 0 01.6-1.6 2.12 2.12 0 01.06-1.58s.5-.16 1.63.6a5.57 5.57 0 013 0c1.13-.76 1.62-.6 1.62-.6a2.12 2.12 0 01.07 1.58 2.3 2.3 0 01.6 1.6c0 2.48-1.51 3.02-2.95 3.18a1.43 1.43 0 01.41 1.12v1.66c0 .16.1.35.41.29A6 6 0 007 1z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="1" y="4.5" width="2.5" height="8" rx="0.5" />
      <circle cx="2.25" cy="2.25" r="1.25" />
      <path d="M5 4.5h2.4v1.1h.03A2.63 2.63 0 019.8 4.3C12.04 4.3 12.5 5.77 12.5 7.7v4.8H10V8.1c0-.9-.02-2.05-1.25-2.05-1.25 0-1.44.98-1.44 1.98v4.5H5V4.5z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M4.5 4L1.5 7l3 3M9.5 4l3 3-3 3M8.5 2l-3 10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ProfileSetupPage;
