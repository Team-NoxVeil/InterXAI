/**
 * OrgAuthPage.tsx
 * Single-page component that houses both org Login and Signup tabs.
 * All logic is in the respective hooks; this is layout + composition only.
 */

import React, { useState } from 'react';
import Logo from '../../components/ui/Logo';
import OrgLoginForm from './components/OrgLoginForm';
import OrgSignupForm from './components/OrgSignupForm';
import { useOrgLogin } from './hooks/useOrgLogin';
import { useOrgSignup } from './hooks/useOrgSignup';
import type { OrgSignupResponse } from '../../services/organization.service';

type Tab = 'login' | 'signup';

export interface OrgAuthPageProps {
  /** Called after successful login — receives the JWT */
  onLoginSuccess?: (token: string) => void;
  /** Called after successful signup — receives full response */
  onSignupSuccess?: (data: OrgSignupResponse) => void;
  /** Navigate back to the landing / user login page */
  onBack?: () => void;
}

const OrgAuthPage: React.FC<OrgAuthPageProps> = ({
  onLoginSuccess,
  onSignupSuccess,
  onBack,
}) => {
  const [tab, setTab] = useState<Tab>('login');

  const loginHook = useOrgLogin(onLoginSuccess);
  const signupHook = useOrgSignup(onSignupSuccess);

  return (
    <div
      id="org-auth-page"
      className="relative min-h-screen flex items-center justify-center px-4 bg-[#050e0a] overflow-hidden"
    >
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-52 -right-52 w-[700px] h-[700px] rounded-full bg-[#3ddc84]/5 blur-[140px]" />
        <div className="absolute -bottom-52 -left-52 w-[700px] h-[700px] rounded-full bg-[#3ddc84]/4 blur-[140px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        {onBack && (
          <button
            id="org-auth-back"
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl shadow-2xl px-8 py-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <Logo />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Organisation Portal</h1>
              <p className="text-white/50 text-sm mt-1">
                {tab === 'login'
                  ? 'Sign in to manage your hiring pipeline'
                  : 'Register your company on InterXAI'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl bg-white/5 border border-white/8 p-1 mb-7"
            role="tablist"
            aria-label="Auth mode"
          >
            {(['login', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                id={`org-tab-${t}`}
                onClick={() => setTab(t)}
                className={`
                  flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${tab === t
                    ? 'bg-[#3ddc84] text-black shadow-sm'
                    : 'text-white/50 hover:text-white/80'}
                `}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          {tab === 'login' ? (
            <OrgLoginForm
              form={loginHook.form}
              isLoading={loginHook.isLoading}
              error={loginHook.error}
              onChange={loginHook.handleChange}
              onSubmit={loginHook.handleSubmit}
              onSignupClick={() => setTab('signup')}
            />
          ) : (
            <OrgSignupForm
              form={signupHook.form}
              isLoading={signupHook.isLoading}
              error={signupHook.error}
              onChange={signupHook.handleChange}
              onSubmit={signupHook.handleSubmit}
              onLoginClick={() => setTab('login')}
            />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-6 px-4">
          By continuing you agree to our{' '}
          <a href="#terms" className="underline hover:text-white/40 transition-colors">Terms</a>
          {' '}and{' '}
          <a href="#privacy" className="underline hover:text-white/40 transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default OrgAuthPage;
