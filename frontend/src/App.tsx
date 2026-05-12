import { useState } from 'react';
import LandingPage from './features/LandingPage';
import LoginPage from './features/auth/LoginPage';
import OrgAuthPage from './features/org/OrgAuthPage';
import type { TokenResponse } from './services/auth.service';
import type { OrgSignupResponse } from './services/organization.service';

type Page = 'landing' | 'user-login' | 'org-auth' | 'user-dashboard' | 'org-dashboard';

function App() {
  const [page, setPage] = useState<Page>('landing');

  // ── User auth handlers ────────────────────────────────────────────────────
  const handleUserLoginSuccess = (data: TokenResponse) => {
    console.log('User logged in:', data.user.username);
    setPage('user-dashboard');
  };

  // ── Org auth handlers ─────────────────────────────────────────────────────
  const handleOrgLoginSuccess = (token: string) => {
    console.log('Org logged in, token:', token.slice(0, 20) + '…');
    setPage('org-dashboard');
  };

  const handleOrgSignupSuccess = (data: OrgSignupResponse) => {
    console.log('Org signed up:', data.organization.id);
    setPage('org-dashboard');
  };

  // ── Routing ───────────────────────────────────────────────────────────────
  switch (page) {
    case 'user-login':
      return (
        <LoginPage
          onLoginSuccess={handleUserLoginSuccess}
          onSignupClick={() => setPage('landing')}
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
      return <Placeholder label="User Dashboard" />;

    case 'org-dashboard':
      return <Placeholder label="Organisation Dashboard" />;

    default:
      return (
        <LandingPage
          onLoginClick={() => setPage('user-login')}
          onOrgLoginClick={() => setPage('org-auth')}
        />
      );
  }
}

// Temporary placeholder for not-yet-built pages
function Placeholder({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#050e0a] flex flex-col items-center justify-center gap-4 text-white">
      <span className="text-4xl">✅</span>
      <p className="text-xl font-semibold">{label} — coming soon</p>
    </div>
  );
}

export default App;
