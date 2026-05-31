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

/** Hidden admin entry: visiting /admin or /admin/* routes straight to org-auth. */
function isAdminPath(): boolean {
  return window.location.pathname.replace(/\/+$/, "").startsWith("/admin");
}

function initialPage(): Page {
  if (parseOidcHash()?.error) return "login";
  if (isAdminPath()) {
    const storedOrgToken = localStorage.getItem("org_token");
    return storedOrgToken ? "org-dashboard" : "org-auth";
  }
  return "landing";
}

function App() {
  const [page, setPage] = useState<Page>(initialPage);
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [activeInterviewId, setActiveInterviewId] = useState<number | null>(
    null,
  );
  const [orgToken, setOrgToken] = useState<string | null>(() =>
    localStorage.getItem("org_token"),
  );
  const [orgName, setOrgName] = useState<string | undefined>(undefined);
  const [hydrating, setHydrating] = useState<boolean>(() =>
    Boolean(parseOidcHash()?.token),
  );

  // Handle the Google OIDC return: the backend redirects to `/#oidc_token=<jwt>`
  // (or `/#oidc_error=<reason>`). Pick the token up, hydrate the user, route.
  useEffect(() => {
    const oidc = parseOidcHash();
    if (!oidc) return;

    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );

    const token = oidc.token;
    if (!token) return;

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
    localStorage.setItem("org_token", token);
    setOrgToken(token);
    setPage("org-dashboard");
  };

  const handleOrgSignupSuccess = (data: OrgSignupResponse) => {
    localStorage.setItem("org_token", data.access_token);
    setOrgToken(data.access_token);
    setOrgName(data.organization?.id?.toString());
    setPage("org-dashboard");
  };

  const handleOrgLogout = () => {
    localStorage.removeItem("org_token");
    setOrgToken(null);
    setOrgName(undefined);
    // Keep the user on /admin so they can sign back in without retyping the URL.
    setPage("org-auth");
  };

  const handleAttemptInterview = (interviewId: number) => {
    setActiveInterviewId(interviewId);
    setPage("interview");
  };

  const handleExitInterview = () => {
    setActiveInterviewId(null);
    setPage("dashboard");
  };

  const handleBackFromOrgAuth = () => {
    // /admin URL: there's no public landing for admins, so a back press just
    // clears the admin path and sends them home.
    if (isAdminPath()) {
      window.history.replaceState(null, "", "/");
    }
    setPage("landing");
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
          onBack={handleBackFromOrgAuth}
        />
      );

    case "org-dashboard": {
      const token = orgToken ?? localStorage.getItem("org_token") ?? "";
      if (!token) {
        // No token: render the auth page directly instead of mutating
        // page state during render (would violate React purity rules).
        return (
          <OrgAuthPage
            onLoginSuccess={handleOrgLoginSuccess}
            onSignupSuccess={handleOrgSignupSuccess}
            onBack={handleBackFromOrgAuth}
          />
        );
      }
      return (
        <OrgDashboardPage
          token={token}
          orgName={orgName}
          onLogout={handleOrgLogout}
        />
      );
    }

    default:
      return <LandingPage onLoginClick={() => setPage("login")} />;
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

export default App;
