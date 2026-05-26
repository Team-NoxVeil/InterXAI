import type { JSX } from "react";
import Orb from "./Orb";

export interface LandingPageProps {
  onLoginClick?: () => void;
  onOrgLoginClick?: () => void;
}

interface Stat {
  e: string;
  v: string;
  l: string;
}

const NAV_LINKS: string[] = [
  "Solutions",
  "How It Works",
  "For Users",
  "Pricing",
  "Resources",
];

const STATS: Stat[] = [
  { e: "👥", v: "10,000+", l: "Interviews Run" },
  { e: "📈", v: "82%", l: "Avg. Confidence Score" },
  { e: "⭐", v: "4.9/5", l: "User Rating" },
];

export default function LandingPage({
  onLoginClick,
  onOrgLoginClick,
}: LandingPageProps): JSX.Element {
  return (
    <div
      id="landing-page"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(155deg, #bdd9f2 0%, #cfe8fb 12%, #dff0ff 28%, #ecf7ff 45%, #f4faff 62%, #e8f4fd 78%, #d2e9f8 100%)",
        fontFamily:
          "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 800,
          height: 800,
          background: "rgba(219,234,254,0.5)",
          borderRadius: "50%",
          filter: "blur(120px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-20%",
          width: 600,
          height: 600,
          background: "rgba(207,232,251,0.5)",
          borderRadius: "50%",
          filter: "blur(100px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <nav
        style={{
          position: "relative",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 52px",
          maxWidth: 1300,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(145deg,#4f9cf9,#1649c9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid rgba(255,255,255,0.35)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "-0.5px",
              }}
            >
              X
            </span>
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 17,
              color: "#0f172a",
              letterSpacing: "-0.4px",
            }}
          >
            InterXAI
          </span>
        </div>

        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {NAV_LINKS.map((link: string) => (
            <a
              key={link}
              href="#"
              style={{
                color: "#4b5563",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {link}
              {(link === "Solutions" || link === "Resources") && (
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                  <path
                    d="M1 1.5l4 4 4-4"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <button
            onClick={onOrgLoginClick}
            style={{
              background: "transparent",
              border: "none",
              color: "#4b5563",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            For Organisations
          </button>
          <button
            onClick={onLoginClick}
            style={{
              background: "transparent",
              border: "none",
              color: "#4b5563",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            onClick={onLoginClick}
            style={{
              background: "linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 99,
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 16px rgba(59,130,246,0.5)",
            }}
          >
            Get Started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      <section
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 1300,
          margin: "0 auto",
          padding: "24px 52px 0",
          alignItems: "center",
          minHeight: 600,
        }}
      >
        <div style={{ paddingRight: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(147,197,253,0.55)",
              borderRadius: 99,
              padding: "6px 14px",
              marginBottom: 26,
              boxShadow: "0 2px 10px rgba(59,130,246,0.08)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="#3b82f6">
              <path d="M6 0l1.3 3.7 3.7.3-2.7 2.6.8 3.6L6 8.3l-3.1 1.9.8-3.6L1 4.1l3.7-.4z" />
            </svg>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#1d4ed8",
                letterSpacing: "0.05px",
              }}
            >
              AI-Powered Interview Platform
            </span>
          </div>

          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#0f172a",
              marginBottom: 18,
              letterSpacing: "-1.8px",
            }}
          >
            Ace <span style={{ color: "#2563eb" }}>Interviews.</span>
            <br />
            Advance Your
            <br />
            Career.
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "#64748b",
              lineHeight: 1.6,
              marginBottom: 36,
              maxWidth: 460,
              fontWeight: 500,
            }}
          >
            InterXAI conducts intelligent interviews, evaluates skills, and
            delivers actionable feedback to help you get hired faster and grow
            your career.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              marginBottom: 44,
            }}
          >
            <button
              onClick={onLoginClick}
              style={{
                background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                color: "#fff",
                border: "none",
                borderRadius: 99,
                padding: "13px 28px",
                fontSize: 14.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 6px 22px rgba(59,130,246,0.48)",
              }}
            >
              Start AI Interview
              <span
                style={{
                  width: 26,
                  height: 26,
                  background: "rgba(255,255,255,0.22)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 6h10M7 2l4 4-4 4"
                    stroke="white"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#334155",
                fontSize: 14.5,
                fontWeight: 500,
              }}
            >
              Watch Demo
              <span
                style={{
                  width: 34,
                  height: 34,
                  border: "1.5px solid #b8d4eb",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.5)",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M3.5 2.5l5 3-5 3z" fill="#64748b" />
                </svg>
              </span>
            </button>
          </div>

          <div style={{ display: "flex", gap: 36 }}>
            {STATS.map((stat: Stat) => (
              <div
                key={stat.l}
                style={{ display: "flex", alignItems: "center", gap: 9 }}
              >
                <span style={{ fontSize: 19 }}>{stat.e}</span>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#0f172a",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {stat.v}
                  </div>
                  <div
                    style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}
                  >
                    {stat.l}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 650,
          }}
        >
          <Orb scale={0.85} />
        </div>
      </section>
    </div>
  );
}
