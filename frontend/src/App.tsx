import { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import OrgAuthPage from "./features/org/OrgAuthPage";
import ProfileSetupPage from "./features/user/ProfileSetupPage";
import DashboardPage from "./features/user/DashboardPage";
import type { TokenResponse } from "./services/auth.service";
import type { OrgSignupResponse } from "./services/organization.service";
import type { UserResponse } from "./services/user.service";

// ── App-level auth state ──────────────────────────────────────────────────────
interface AuthState {
  token: string;
  user: UserResponse;
  isNewUser: boolean; // true → show profile setup before dashboard
}

type Page =
  | "landing"
  | "login"
  | "signup"
  | "org-auth"
  | "profile-setup"
  | "dashboard"
  | "org-dashboard";

// ── Root component ────────────────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState<Page>("landing");
  const [auth, setAuth] = useState<AuthState | null>(null);

  // User login — profile already exists → skip setup
  const handleUserLoginSuccess = (data: TokenResponse) => {
    const hasProfile = Boolean(
      data.user.profile?.bio || data.user.profile?.github,
    );
    setAuth({ token: data.token, user: data.user, isNewUser: false });
    setPage(hasProfile ? "dashboard" : "profile-setup");
  };

  // User signup → always show profile setup
  const handleSignupSuccess = (data: TokenResponse) => {
    setAuth({ token: data.token, user: data.user, isNewUser: true });
    setPage("profile-setup");
  };

  // Profile setup complete (or skipped)
  const handleProfileComplete = (updatedUser: UserResponse) => {
    setAuth((prev) => (prev ? { ...prev, user: updatedUser } : null));
    setPage("dashboard");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(null);
    setPage("landing");
  };

  // Org auth
  const handleOrgLoginSuccess = (token: string) => {
    console.log("Org token:", token.slice(0, 20) + "…");
    setPage("org-dashboard");
  };

  const handleOrgSignupSuccess = (data: OrgSignupResponse) => {
    console.log("Org signed up:", data.organization.id);
    setPage("org-dashboard");
  };

  // ── Routing ────────────────────────────────────────────────────────────────
  switch (page) {
    case "login":
      return (
        <LoginPage
          onLoginSuccess={handleUserLoginSuccess}
          onSignupClick={() => setPage("signup")}
          onBack={() => setPage("landing")}
        />
      );

    case "signup":
      return (
        <SignupPage
          onSignupSuccess={handleSignupSuccess}
          onLoginClick={() => setPage("login")}
          onBack={() => setPage("landing")}
        />
      );

    case "profile-setup":
      if (!auth) return null;
      return (
        <ProfileSetupPage
          userId={auth.user.id}
          token={auth.token}
          username={auth.user.username}
          onComplete={handleProfileComplete}
        />
      );

    case "dashboard":
      if (!auth) return null;
      return (
        <DashboardPage
          user={auth.user}
          token={auth.token}
          onLogout={handleLogout}
        />
      );

    case "org-auth":
      return (
        <OrgAuthPage
          onLoginSuccess={handleOrgLoginSuccess}
          onSignupSuccess={handleOrgSignupSuccess}
          onBack={() => setPage("landing")}
        />
      );

    case "org-dashboard":
      return (
        <Placeholder
          label="Organisation Dashboard"
          onBack={() => setPage("landing")}
        />
      );

    default:
      return (
        <LandingPage
          onLoginClick={() => setPage("login")}
          onOrgLoginClick={() => setPage("org-auth")}
        />
      );
  }
}

function Placeholder({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-slate-900">
      <div className="text-5xl">🚀</div>
      <p className="text-xl font-semibold">{label} — coming soon</p>
      <button
        onClick={onBack}
        className="text-blue-600 hover:underline text-sm mt-2"
      >
        ← Back to home
      </button>
    </div>
  );
}

export default App;
