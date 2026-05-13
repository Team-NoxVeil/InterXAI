/**
 * LoginPage.tsx — light-theme redesign matching the InterXAI design system
 */

import React from 'react';
import Logo from '../../components/ui/Logo';
import FormInput from '../../components/ui/FormInput';
import AlertBanner from '../../components/ui/AlertBanner';
import Button from '../../components/ui/Button';
import { useLogin } from './hooks/useLogin';
import type { TokenResponse } from '../../services/auth.service';

export interface LoginPageProps {
  onLoginSuccess?: (data: TokenResponse) => void;
  onSignupClick?: () => void;
  onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSignupClick, onBack }) => {
  const { form, isLoading, error, handleChange, handleSubmit } = useLogin(onLoginSuccess);

  return (
    <div
      id="login-page"
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #e0f2fe 100%)' }}
    >
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between flex-1 bg-blue-600 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        <Logo dark />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            AI-powered interviews.<br />Real career results.
          </h2>
          <p className="text-blue-200 text-lg">
            Join 10,000+ professionals who use InterXAI to land their dream roles.
          </p>
          <div className="mt-8 space-y-3">
            {['Real-time AI feedback', '82% confidence scoring', 'Personalised coaching'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-300 text-xs relative z-10">© {new Date().getFullYear()} InterXAI</p>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto w-full">
        <div className="lg:hidden mb-8"><Logo /></div>

        <div className="w-full max-w-sm">
          {onBack && (
            <button onClick={onBack}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your InterXAI account</p>
          </div>

          {/* Social login */}
          <div className="space-y-2 mb-6">
            <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl
              border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium
              transition-all shadow-sm hover:shadow-md">
              <GoogleIcon /> Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl
              border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium
              transition-all shadow-sm hover:shadow-md">
              <LinkedInIcon /> Continue with LinkedIn
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs">or</span>
            <span className="flex-1 h-px bg-slate-200" />
          </div>

          <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && <AlertBanner message={error} variant="error" />}

            <FormInput
              id="username" name="username" label="Username" type="text"
              placeholder="your_username" autoComplete="username"
              value={form.username} onChange={handleChange} disabled={isLoading} required
            />
            <FormInput
              id="password" name="password" label="Password" type="password"
              placeholder="••••••••" autoComplete="current-password"
              value={form.password} onChange={handleChange} disabled={isLoading}
              revealable required
            />

            <div className="flex justify-end">
              <a href="#forgot" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
            </div>

            <Button id="login-submit" type="submit" variant="primary"
              className="w-full justify-center py-3 text-sm" disabled={isLoading}>
              {isLoading ? <><Spinner /> Signing in…</> : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <button onClick={onSignupClick} className="text-blue-600 hover:underline font-medium">
              Create account
            </button>
          </p>
        </div>
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

export default LoginPage;
