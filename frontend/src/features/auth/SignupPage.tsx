/**
 * SignupPage.tsx
 * User registration — light blue/white theme matching the design screenshots.
 * On success, passes the full TokenResponse up to the parent router.
 */

import React from 'react';
import Logo from '../../components/ui/Logo';
import FormInput from '../../components/ui/FormInput';
import AlertBanner from '../../components/ui/AlertBanner';
import Button from '../../components/ui/Button';
import { useSignup } from './hooks/useSignup';
import type { TokenResponse } from '../../services/auth.service';

export interface SignupPageProps {
  onSignupSuccess?: (data: TokenResponse) => void;
  onLoginClick?: () => void;
  onBack?: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onLoginClick, onBack }) => {
  const { form, isLoading, error, handleChange, handleSubmit } = useSignup(onSignupSuccess);

  return (
    <div
      id="signup-page"
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #e0f2fe 100%)' }}
    >
      {/* Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="mb-6" />
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
            <div className="h-px w-10 bg-slate-200" />
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">2</div>
            <div className="h-px w-10 bg-slate-200" />
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">3</div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm">Start your journey with AI-powered interviews</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-slate-100 p-8">
          {/* Social login */}
          <div className="space-y-2.5 mb-6">
            <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl
              border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all">
              <GoogleIcon /> Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl
              border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all">
              <LinkedInIcon /> Continue with LinkedIn
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs">or</span>
            <span className="flex-1 h-px bg-slate-200" />
          </div>

          <form id="signup-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && <AlertBanner message={error} variant="error" />}

            <FormInput
              id="signup-fullname" name="fullName" label="Full Name" type="text"
              placeholder="John Doe" autoComplete="name"
              value={form.fullName} onChange={handleChange} disabled={isLoading} required
            />
            <FormInput
              id="signup-email" name="email" label="Email Address" type="email"
              placeholder="john.doe@email.com" autoComplete="email"
              value={form.email} onChange={handleChange} disabled={isLoading} required
            />
            <FormInput
              id="signup-password" name="password" label="Password" type="password"
              placeholder="Min. 8 characters" autoComplete="new-password"
              value={form.password} onChange={handleChange} disabled={isLoading}
              revealable required
            />

            <Button
              id="signup-submit" type="submit" variant="primary"
              className="w-full justify-center py-3 text-sm mt-2"
              disabled={isLoading}
            >
              {isLoading ? <><Spinner /> Creating account…</> : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            By creating an account, you agree to our{' '}
            <a href="#terms" className="text-blue-600 hover:underline">Terms</a> and{' '}
            <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-slate-500 mt-5 pt-5 border-t border-slate-100">
            Already have an account?{' '}
            <button onClick={onLoginClick} className="text-blue-600 hover:underline font-medium">
              Sign In
            </button>
          </p>
        </div>

        {onBack && (
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm mx-auto mt-5 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to home
          </button>
        )}
      </div>
    </div>
  );
};

const Spinner = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
    <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="#0A66C2">
    <path d="M15.75 0H2.25A2.25 2.25 0 000 2.25v13.5A2.25 2.25 0 002.25 18h13.5A2.25 2.25 0 0018 15.75V2.25A2.25 2.25 0 0015.75 0zM5.625 15H3V6.75h2.625V15zm-1.312-9.45a1.519 1.519 0 110-3.037 1.519 1.519 0 010 3.037zM15 15h-2.625V10.5c0-.99-.018-2.263-1.378-2.263-1.381 0-1.593 1.078-1.593 2.19V15H6.779V6.75h2.52v1.163h.036c.35-.664 1.207-1.363 2.484-1.363 2.656 0 3.147 1.748 3.147 4.022V15H15z" />
  </svg>
);

export default SignupPage;
