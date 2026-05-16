import { useEffect, type CSSProperties } from "react";
import type { JSX } from "react";

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

const FEEDBACK_ITEMS: string[] = [
  "Clear Answers",
  "Good Structure",
  "Relevant Examples",
  "Keep Improving",
];
const FEEDBACK_COLORS: string[] = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

const SKILL_ITEMS: string[] = [
  "Problem Solving",
  "Communication",
  "Leadership",
  "Adaptability",
];

const WAVE_DELAYS_CARD: number[] = [
  0.0, 0.14, 0.06, 0.2, 0.09, 0.17, 0.04, 0.13, 0.08,
];
const WAVE_DELAYS_EYE: number[] = [
  0.0, 0.13, 0.05, 0.19, 0.08, 0.22, 0.1, 0.16, 0.04,
];

export default function InterXAI(): JSX.Element {
  useEffect(() => {
    const s: HTMLStyleElement = document.createElement("style");
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }

      @keyframes floatY {
        0%,100% { transform: translateY(0px); }
        50%      { transform: translateY(-11px); }
      }
      @keyframes wave {
        0%   { transform: scaleY(0.2); }
        100% { transform: scaleY(1); }
      }
      @keyframes pulseGlow {
        0%,100% { opacity: 0.5; }
        50%      { opacity: 1; }
      }
      .float { animation: floatY 4.2s ease-in-out infinite; }
      .pglow { animation: pulseGlow 2s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
    return () => {
      document.head.removeChild(s);
    };
  }, []);

  const cardBase: CSSProperties = {
    position: "absolute",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.92)",
    borderRadius: 16,
    padding: "12px 16px",
    boxShadow: "0 8px 32px rgba(96,165,250,0.14), 0 2px 8px rgba(0,0,0,0.04)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(155deg, #bdd9f2 0%, #cfe8fb 12%, #dff0ff 28%, #ecf7ff 45%, #f4faff 62%, #e8f4fd 78%, #d2e9f8 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ─── NAVBAR ─── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 52px",
          maxWidth: 1300,
          margin: "0 auto",
        }}
      >
        {/* Logo */}
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

        {/* Nav links */}
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

        {/* CTA */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <a
            href="#"
            style={{
              color: "#4b5563",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Sign In
          </a>
          <button
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

      {/* ─── HERO ─── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 1300,
          margin: "0 auto",
          padding: "24px 52px 0",
          alignItems: "center",
          minHeight: 520,
        }}
      >
        {/* ── LEFT COPY ── */}
        <div style={{ paddingRight: 32 }}>
          {/* Badge */}
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

          {/* Headline */}
          <h1
            style={{
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.08,
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

          {/* Subtext */}
          <p
            style={{
              fontSize: 14.5,
              color: "#6b7280",
              lineHeight: 1.75,
              marginBottom: 36,
              maxWidth: 430,
            }}
          >
            InterXAI conducts intelligent interviews, evaluates skills,
            <br />
            and delivers actionable feedback to help you get hired faster
            <br />
            and grow your career.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              marginBottom: 44,
            }}
          >
            <button
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

          {/* Stats */}
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

        {/* ── RIGHT – SPHERE SCENE ── */}
        <div
          style={{
            position: "relative",
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* AIInterviewer card – top left */}
          <div
            className="float"
            style={{
              ...cardBase,
              top: 18,
              left: 16,
              minWidth: 158,
              animationDelay: "0s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 7,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "linear-gradient(145deg,#eff6ff,#dbeafe)",
                  border: "1px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="4" r="2.2" fill="#3b82f6" />
                  <path d="M1 11c0-2.76 2.24-5 5-5s5 2.24 5 5" fill="#3b82f6" />
                </svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1e40af" }}>
                AIInterviewer
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                className="pglow"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 5px #22c55e",
                }}
              />
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                Listening...
              </span>
            </div>
          </div>

          {/* Feedback card – top right */}
          <div
            className="float"
            style={{
              ...cardBase,
              top: 8,
              right: 4,
              minWidth: 148,
              animationDelay: "0.55s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 9,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 800, color: "#1e293b" }}>
                Feedback
              </span>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="#fbbf24">
                <path d="M6 1l1.1 2.9 3 .3-2.2 2 .7 3L6 7.8l-2.6 1.4.7-3L1.9 4.2l3-.3z" />
              </svg>
            </div>
            {FEEDBACK_ITEMS.map((item: string, i: number) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 5,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: FEEDBACK_COLORS[i],
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, color: "#64748b" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Confidence Score card – bottom left */}
          <div
            className="float"
            style={{ ...cardBase, bottom: 68, left: 8, animationDelay: "1.1s" }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1e293b",
                display: "block",
                marginBottom: 9,
              }}
            >
              Confidence Score
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Donut gauge */}
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="#dbeafe"
                  strokeWidth="7"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="url(#cGrad)"
                  strokeWidth="7"
                  strokeDasharray={`${0.82 * 175.9} 175.9`}
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)"
                />
                <text
                  x="36"
                  y="41"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill="#1d4ed8"
                >
                  82%
                </text>
                <defs>
                  <linearGradient
                    id="cGrad"
                    x1="0"
                    y1="0"
                    x2="72"
                    y2="72"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#60a5fa" />
                    <stop offset="1" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Waveform bars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                  height: 32,
                }}
              >
                {WAVE_DELAYS_CARD.map((d: number, i: number) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      width: 3.5,
                      borderRadius: 99,
                      background: "linear-gradient(to top,#93c5fd,#2563eb)",
                      height: "100%",
                      animation: "wave .85s ease-in-out infinite alternate",
                      animationDelay: `${d}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Skills Detected card – bottom right */}
          <div
            className="float"
            style={{
              ...cardBase,
              bottom: 58,
              right: 4,
              minWidth: 138,
              animationDelay: "1.5s",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#1e293b",
                display: "block",
                marginBottom: 9,
              }}
            >
              Skills Detected
            </span>
            {SKILL_ITEMS.map((skill: string) => (
              <div
                key={skill}
                style={{ fontSize: 11, color: "#4b5563", marginBottom: 5 }}
              >
                {skill}
              </div>
            ))}
            <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700 }}>
              +12
            </div>
          </div>

          {/* ─── SPHERE ─── */}
          <div
            className="float"
            style={{
              position: "relative",
              width: 252,
              height: 252,
              animationDelay: "0.28s",
              zIndex: 5,
            }}
          >
            {/* Ambient glow */}
            <div
              style={{
                position: "absolute",
                inset: -70,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(147,197,253,0.38) 0%, rgba(59,130,246,0.10) 55%, transparent 72%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Platform concentric rings */}
            <svg
              style={{
                position: "absolute",
                bottom: -52,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 0,
                pointerEvents: "none",
              }}
              width="360"
              height="90"
              viewBox="0 0 360 90"
            >
              <defs>
                <radialGradient id="pDisc" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="180" cy="46" rx="168" ry="34" fill="url(#pDisc)" />
              <ellipse
                cx="180"
                cy="46"
                rx="168"
                ry="34"
                fill="none"
                stroke="#7bc0f7"
                strokeWidth="1"
                opacity="0.55"
              />
              <ellipse
                cx="180"
                cy="46"
                rx="128"
                ry="25"
                fill="none"
                stroke="#a8d8f8"
                strokeWidth="1"
                opacity="0.65"
              />
              <ellipse
                cx="180"
                cy="46"
                rx="90"
                ry="17"
                fill="none"
                stroke="#c3e6fc"
                strokeWidth="1"
                opacity="0.75"
              />
              <ellipse
                cx="180"
                cy="46"
                rx="52"
                ry="10"
                fill="none"
                stroke="#ddf0ff"
                strokeWidth="1"
                opacity="0.85"
              />
              <ellipse
                cx="180"
                cy="46"
                rx="24"
                ry="5"
                fill="#5eaef0"
                opacity="0.7"
                className="pglow"
              />
            </svg>

            {/* Sphere shell */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                zIndex: 2,
                background:
                  "radial-gradient(ellipse at 36% 26%, #ffffff 0%, #d4eaf9 8%, #a8d0f5 20%, #6aacee 36%, #3a7fe0 52%, #1a4dbf 68%, #0e2d8a 84%, #071a55 100%)",
                boxShadow: [
                  "0 0 0 1px rgba(147,197,253,0.5)",
                  "0 6px 40px rgba(29,78,216,0.45)",
                  "0 20px 70px rgba(59,130,246,0.28)",
                  "inset 0 -14px 44px rgba(7,26,85,0.65)",
                  "inset 0 14px 28px rgba(255,255,255,0.3)",
                ].join(","),
              }}
            >
              {/* Specular highlight */}
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "14%",
                  width: "38%",
                  height: "24%",
                  borderRadius: "60% 40% 50% 50%",
                  background:
                    "radial-gradient(ellipse, rgba(255,255,255,0.62) 0%, transparent 80%)",
                  filter: "blur(5px)",
                  transform: "rotate(-15deg)",
                }}
              />
              {/* Bottom reflection */}
              <div
                style={{
                  position: "absolute",
                  bottom: "15%",
                  right: "18%",
                  width: "26%",
                  height: "14%",
                  borderRadius: "50%",
                  background: "rgba(147,197,253,0.18)",
                  filter: "blur(7px)",
                }}
              />

              {/* Dark iris / eye */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 40% 36%, #1e3a8a 0%, #0f1f5c 40%, #060e2e 100%)",
                    boxShadow:
                      "0 0 0 2px rgba(96,165,250,0.22), 0 0 28px rgba(30,58,138,0.9), 0 0 55px rgba(59,130,246,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Inner iris ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 7,
                      borderRadius: "50%",
                      border: "1px solid rgba(96,165,250,0.18)",
                    }}
                  />
                  {/* Eye waveform */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      height: 26,
                      zIndex: 4,
                    }}
                  >
                    {WAVE_DELAYS_EYE.map((d: number, i: number) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          width: 3.5,
                          borderRadius: 99,
                          background: "linear-gradient(to top,#60a5fa,#bfdbfe)",
                          height: "100%",
                          animation: "wave .75s ease-in-out infinite alternate",
                          animationDelay: `${d}s`,
                          boxShadow: "0 0 5px rgba(96,165,250,0.9)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Outer orbit rings */}
            <div
              style={{
                position: "absolute",
                inset: -16,
                borderRadius: "50%",
                border: "1px solid rgba(147,197,253,0.22)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -32,
                borderRadius: "50%",
                border: "1px solid rgba(147,197,253,0.11)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
