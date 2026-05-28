import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import OrgAuthPage from "./features/org/OrgAuthPage";
import OrgDashboardPage from "./features/org/OrgDashboardPage";
import ProfileSetupPage from "./features/user/ProfileSetupPage";
import DashboardPage from "./features/user/DashboardPage";
import InterviewSessionPage from "./features/interview/InterviewSessionPage";
import { fetchCurrentUser } from "./services/auth.service";
import type { TokenResponse } from "./services/auth.service";
import type { OrgSignupResponse } from "./services/organization.service";
import type { UserResponse } from "./services/user.service";

interface AuthState {
  token: string;
  user: UserResponse;
  isNewUser: boolean;
}

type Page =
  | "landing"
  | "login"
  | "signup"
  | "org-auth"
  | "profile-setup"
  | "dashboard"
  | "org-dashboard"
  | "interview";

/** Read a Google OIDC return (`#oidc_token=…` / `#oidc_error=…`) from the URL. */
function parseOidcHash(): {
  token: string | null;
  error: string | null;
} | null {
  const hash = window.location.hash;
  if (!hash.includes("oidc_token") && !hash.includes("oidc_error")) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return { token: params.get("oidc_token"), error: params.get("oidc_error") };
}

function App() {
  // Initial page/loader are derived from the URL so an OIDC return never flashes
  // the landing page: a token shows the loader, an error drops straight to login.
  const [page, setPage] = useState<Page>(() =>
    parseOidcHash()?.error ? "login" : "landing",
  );
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [activeInterviewId, setActiveInterviewId] = useState<number | null>(
    null,
  );
  const [hydrating, setHydrating] = useState<boolean>(() =>
    Boolean(parseOidcHash()?.token),
  );

  // Handle the Google OIDC return: the backend redirects to `/#oidc_token=<jwt>`
  // (or `/#oidc_error=<reason>`). Pick the token up, hydrate the user, route.
  useEffect(() => {
    const oidc = parseOidcHash();
    if (!oidc) return;

    // Strip the token/error from the URL so it isn't kept in history or re-read.
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );

    const token = oidc.token;
    if (!token) return; // error case already reflected in the initial page state

    localStorage.setItem("token", token);
    fetchCurrentUser(token)
      .then((user) => {
        const hasProfile = Boolean(user.profile?.bio || user.profile?.github);
        setAuth({ token, user, isNewUser: false });
        setPage(hasProfile ? "dashboard" : "profile-setup");
      })
      .catch(() => {
        localStorage.removeItem("token");
        setPage("login");
      })
      .finally(() => setHydrating(false));
  }, []);

  const handleUserLoginSuccess = (data: TokenResponse) => {
    const hasProfile = Boolean(
      data.user.profile?.bio || data.user.profile?.github,
    );
    setAuth({ token: data.token, user: data.user, isNewUser: false });
    setPage(hasProfile ? "dashboard" : "profile-setup");
  };

  const handleSignupSuccess = (data: TokenResponse) => {
    setAuth({ token: data.token, user: data.user, isNewUser: true });
    setPage("profile-setup");
  };

  const handleProfileComplete = (updatedUser: UserResponse) => {
    setAuth((prev) => (prev ? { ...prev, user: updatedUser } : null));
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(null);
    setActiveInterviewId(null);
    setPage("landing");
  };

  const handleOrgLoginSuccess = (token: string) => {
    setOrgToken(token);
    setPage("org-dashboard");
  };

  const handleOrgSignupSuccess = (data: OrgSignupResponse) => {
    const token = data.organization
      ? (localStorage.getItem("org_token") ?? "")
      : "";
    setOrgToken(token);
    setOrgName(data.organization?.id?.toString());
    setPage("org-dashboard");
  };

  const handleOrgLogout = () => {
    localStorage.removeItem("org_token");
    setOrgToken(null);
    setOrgName(undefined);
    setPage("landing");
  };

  const handleAttemptInterview = (interviewId: number) => {
    setActiveInterviewId(interviewId);
    setPage("interview");
  };

  const handleExitInterview = () => {
    setActiveInterviewId(null);
    setPage("dashboard");
  };

  if (hydrating) {
    return <OidcLoader />;
  }

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
          onAttemptInterview={handleAttemptInterview}
        />
      );

    case "interview":
      if (!auth || activeInterviewId == null) return null;
      return (
        <InterviewSessionPage
          interviewId={activeInterviewId}
          token={auth.token}
          onExit={handleExitInterview}
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
        <OrgDashboardPage
          token={orgToken ?? localStorage.getItem("org_token") ?? ""}
          orgName={orgName}
          onLogout={handleOrgLogout}
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

function OidcLoader() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-slate-900">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      <p className="text-sm font-medium text-slate-500">Signing you in…</p>
    </div>
  );
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

