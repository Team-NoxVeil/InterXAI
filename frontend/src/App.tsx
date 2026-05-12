import { useState } from 'react';
import LandingPage from './features/LandingPage';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import OrgAuthPage from './features/org/OrgAuthPage';
import type { TokenResponse } from './services/auth.service';
import type { OrgSignupResponse } from './services/organization.service';

type Page = 'landing' | 'login' | 'signup' | 'org-auth' | 'user-dashboard' | 'org-dashboard';

function App() {
  const [page, setPage] = useState<Page>('landing');

  const handleUserLoginSuccess = (data: TokenResponse) => {
    console.log('User logged in:', data.user.username);
    setPage('user-dashboard');
  };

  const handleOrgLoginSuccess = (token: string) => {
    console.log('Org logged in:', token.slice(0, 20) + '…');
    setPage('org-dashboard');
  };

  const handleOrgSignupSuccess = (data: OrgSignupResponse) => {
    console.log('Org signed up:', data.organization.id);
    setPage('org-dashboard');
  };

  switch (page) {
    case 'login':
      return (
        <LoginPage
          onLoginSuccess={handleUserLoginSuccess}
          onSignupClick={() => setPage('signup')}
          onBack={() => setPage('landing')}
        />
      );

    case 'signup':
      return (
        <SignupPage
          onSignupSuccess={() => setPage('user-dashboard')}
          onLoginClick={() => setPage('login')}
          onBack={() => setPage('landing')}
        />
      );

    case 'org-auth':
      return (
        <OrgAuthPage
          onLoginSuccess={handleOrgLoginSuccess}
          onSignupSuccess={handleOrgSignupSuccess}
          onBack={() => setPage('landing')}
        />
      );

    case 'user-dashboard':
      return <Placeholder label="User Dashboard" onBack={() => setPage('landing')} />;

    case 'org-dashboard':
      return <Placeholder label="Organisation Dashboard" onBack={() => setPage('landing')} />;

    default:
      return (
        <LandingPage
          onLoginClick={() => setPage('login')}
          onOrgLoginClick={() => setPage('org-auth')}
        />
      );
  }
}

function Placeholder({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-slate-900">
      <div className="text-5xl">🚀</div>
      <p className="text-xl font-semibold">{label} — coming soon</p>
      <button onClick={onBack}
        className="text-blue-600 hover:underline text-sm mt-2">← Back to home</button>
    </div>
  );
}

export default App;
