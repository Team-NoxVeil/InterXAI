import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import EmailVerificationPage from "./features/auth/EmailVerificationPage";
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
  | "email-verification"
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
  const [hydrating, setHydrating] = useState<boolean>(() => {
    // Show the loader while we either consume an OIDC return token or restore a
    // previously stored session on reload. The /admin path restores its own
    // org_token synchronously in initialPage(), so it needs no async hydration.
    if (parseOidcHash()?.token) return true;
    return Boolean(localStorage.getItem("token")) && !isAdminPath();
  });

  // On mount, establish the session in one of three ways:
  //   1. Google OIDC return — the backend redirects to `/#oidc_token=<jwt>`
  //      (or `/#oidc_error=<reason>`); consume the token from the URL hash.
  //   2. Reload with a stored token — restore the session so a refresh doesn't
  //      bounce the user back to the landing page / login.
  //   3. Nothing stored — render the initial public page.
  useEffect(() => {
    // Route a freshly-resolved user to the correct page based on their role.
    const routeForUser = (user: UserResponse, token: string) => {
      if (user.is_organization) {
        localStorage.setItem("org_token", token);
        setOrgToken(token);
        setOrgName(user.username);
        setPage("org-dashboard");
      } else {
        const hasProfile = Boolean(user.profile?.bio || user.profile?.github);
        setAuth({ token, user, isNewUser: false });
        setPage(hasProfile ? "dashboard" : "profile-setup");
      }
    };

    const oidcToken = parseOidcHash()?.token;
    if (oidcToken) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
      localStorage.setItem("token", oidcToken);
      fetchCurrentUser(oidcToken)
        .then((user) => routeForUser(user, oidcToken))
        .catch(() => {
          localStorage.removeItem("token");
          setPage("login");
        })
        .finally(() => setHydrating(false));
      return;
    }

    // The /admin path resolves its own org_token synchronously in initialPage().
    const storedToken = localStorage.getItem("token");
    if (storedToken && !isAdminPath()) {
      fetchCurrentUser(storedToken)
        .then((user) => routeForUser(user, storedToken))
        .catch(() => {
          // Expired or invalid token: drop it and fall back to the landing page.
          localStorage.removeItem("token");
          localStorage.removeItem("org_token");
          setOrgToken(null);
          setPage("landing");
        })
        .finally(() => setHydrating(false));
      return;
    }

    setHydrating(false);
  }, []);

  const handleUserLoginSuccess = (data: TokenResponse) => {
    if (data.user.is_organization) {
      localStorage.setItem("org_token", data.token);
      setOrgToken(data.token);
      setOrgName(data.user.username);
      setPage("org-dashboard");
      return;
    }
    const hasProfile = Boolean(
      data.user.profile?.bio || data.user.profile?.github,
    );
    setAuth({ token: data.token, user: data.user, isNewUser: false });
    setPage(hasProfile ? "dashboard" : "profile-setup");
  };

  const handleSignupSuccess = (data: TokenResponse) => {
    setAuth({ token: data.token, user: data.user, isNewUser: true });
    setPage("email-verification");
  };

  const handleProfileComplete = (updatedUser: UserResponse) => {
    setAuth((prev) => (prev ? { ...prev, user: updatedUser } : null));
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("org_token");
    setOrgToken(null);
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
    // OIDC org logins also leave a "token"; clear it so a reload doesn't
    // silently restore the session via rehydration.
    localStorage.removeItem("token");
    setOrgToken(null);
    setOrgName(undefined);
    setAuth(null);
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

    case "email-verification":
      if (!auth) return null;
      return (
        <EmailVerificationPage
          email={auth.user.email}
          onVerifySuccess={() => setPage("profile-setup")}
          onBack={() => setPage("signup")}
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
