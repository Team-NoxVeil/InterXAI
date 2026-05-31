import { useEffect } from "react";
import type { CSSProperties } from "react";

export interface OrbProps {
  /** Overall scale factor (1 = 100%). */
  scale?: number;
  /** Show the four floating glass cards around the orb. */
  showCards?: boolean;
  /** Show the chrome / glass podium under the orb. */
  showPodium?: boolean;
}

const ORB_STYLE_ID = "interxai-orb-styles";

const ORB_KEYFRAMES = `
  @keyframes orb-float-y { 0%,100% { transform: translateY(-10px); } 50% { transform: translateY(10px); } }
  @keyframes orb-float-card-1 { 0%,100% { transform: translateY(-5px) rotateY(16deg) rotateX(8deg); } 50% { transform: translateY(5px) rotateY(16deg) rotateX(8deg); } }
  @keyframes orb-float-card-2 { 0%,100% { transform: translateY(6px) rotateY(18deg) rotateX(10deg); } 50% { transform: translateY(-6px) rotateY(18deg) rotateX(10deg); } }
  @keyframes orb-float-card-3 { 0%,100% { transform: translateY(-8px) rotateY(-16deg) rotateX(8deg); } 50% { transform: translateY(8px) rotateY(-16deg) rotateX(8deg); } }
  @keyframes orb-float-card-4 { 0%,100% { transform: translateY(8px) rotateY(-18deg) rotateX(10deg); } 50% { transform: translateY(-8px) rotateY(-18deg) rotateX(10deg); } }
  @keyframes orb-spin-cw { from { transform: scaleY(0.8) rotateX(60deg) rotateZ(0deg); } to { transform: scaleY(0.8) rotateX(60deg) rotateZ(360deg); } }
  @keyframes orb-spin-ccw { from { transform: scaleY(0.85) rotateX(50deg) rotateY(15deg) rotateZ(0deg); } to { transform: scaleY(0.85) rotateX(50deg) rotateY(15deg) rotateZ(-360deg); } }
  @keyframes orb-spin-partial { from { transform: scaleY(0.88) rotateX(55deg) rotateY(-10deg) rotateZ(0deg); } to { transform: scaleY(0.88) rotateX(55deg) rotateY(-10deg) rotateZ(280deg); } }
  @keyframes orb-ripple {
    0% { transform: scale(0.6); opacity: 0; filter: blur(2px); }
    15% { opacity: 0.85; filter: blur(0); }
    85% { opacity: 0.35; }
    100% { transform: scale(1.35); opacity: 0; filter: blur(6px); }
  }
  @keyframes orb-wave-bar {
    0%, 100% { height: 10px; }
    50% { height: 36px; }
  }
  .orb-echo-ring {
    position: absolute;
    border: 1.5px solid rgba(147, 197, 253, 0.35);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(96,165,250,0.2), inset 0 0 20px rgba(96,165,250,0.15);
  }
`;

function useOrbStyles() {
  useEffect(() => {
    if (document.getElementById(ORB_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = ORB_STYLE_ID;
    el.textContent = ORB_KEYFRAMES;
    document.head.appendChild(el);
  }, []);
}

const cardBase: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)",
  border: "1px solid rgba(255,255,255,0.55)",
  boxShadow:
    "0 25px 50px -12px rgba(15,23,42,0.08), inset 0 1px 2px rgba(255,255,255,0.5)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRadius: 24,
};

export default function Orb({
  scale = 1,
  showCards = true,
  showPodium = true,
}: OrbProps) {
  useOrbStyles();

  return (
    <div
      style={{
        position: "relative",
        width: 600 * scale,
        height: 650 * scale,
        transformStyle: "preserve-3d",
        perspective: "2000px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showPodium && (
        <div
          style={{
            position: "absolute",
            top: 460 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: 480 * scale,
            height: 160 * scale,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 80 * scale,
              left: "50%",
              transform: "translateX(-50%)",
              width: 520 * scale,
              height: 100 * scale,
              background: "#a8c7fa",
              borderRadius: "50%",
              filter: "blur(30px)",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20 * scale,
              left: "50%",
              transform: "translateX(-50%)",
              width: 450 * scale,
              height: 120 * scale,
              background: "linear-gradient(180deg,#ffffff,#cbd5e1)",
              borderRadius: "50%",
              boxShadow: "0 20px 40px rgba(15,23,42,0.15)",
              borderBottom: "8px solid #cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "repeating-conic-gradient(from 0deg, #ffffff 0deg, #ffffff 12deg, #e2e8f0 12deg, #e2e8f0 13deg, #94a3b8 13deg, #94a3b8 25deg)",
                opacity: 0.4,
                mixBlendMode: "multiply",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 5 * scale,
                width: 410 * scale,
                height: 105 * scale,
                background: "rgba(2,132,199,0.2)",
                borderRadius: "50%",
                border: "4px solid #0ea5e9",
                boxShadow:
                  "0 0 35px rgba(14,165,233,0.85), inset 0 0 20px rgba(14,165,233,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 6 * scale,
                  width: 390 * scale,
                  height: 85 * scale,
                  background: "linear-gradient(180deg,#f8fafc,#cbd5e1)",
                  borderRadius: "50%",
                  boxShadow:
                    "inset 0 5px 15px rgba(255,255,255,1), inset 0 -5px 15px rgba(0,0,0,0.1)",
                  border: "1px solid #cbd5e1",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background:
                      "repeating-conic-gradient(from 0deg, transparent 0deg, transparent 10deg, rgba(0,0,0,0.04) 10deg, rgba(0,0,0,0.04) 11deg)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 8 * scale,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 330 * scale,
                    height: 65 * scale,
                    background: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.6)",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.05), inset 0 2px 4px rgba(255,255,255,0.8)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 18 * scale,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 260 * scale,
                    height: 48 * scale,
                    borderRadius: "50%",
                    border: "2px solid rgba(147,197,253,0.4)",
                    boxShadow: "0 0 15px rgba(147,197,253,0.4)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 80 * scale,
          left: "50%",
          marginLeft: -230 * scale,
          width: 460 * scale,
          height: 460 * scale,
          borderRadius: "50%",
          border: "5px solid rgba(255,255,255,0.5)",
          boxShadow:
            "inset 0 0 20px rgba(255,255,255,0.4), 0 0 25px rgba(59,130,246,0.2)",
          background: "rgba(255,255,255,0.05)",
          animation: "orb-spin-cw 40s linear infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 90 * scale,
          left: "50%",
          marginLeft: -205 * scale,
          width: 410 * scale,
          height: 410 * scale,
          borderRadius: "50%",
          border: "4px solid rgba(255,255,255,0.45)",
          boxShadow:
            "inset 0 0 15px rgba(255,255,255,0.3), 0 0 20px rgba(59,130,246,0.15)",
          background: "rgba(255,255,255,0.05)",
          animation: "orb-spin-ccw 30s linear infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 105 * scale,
          left: "50%",
          marginLeft: -175 * scale,
          width: 350 * scale,
          height: 350 * scale,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.4)",
          boxShadow: "inset 0 0 10px rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.05)",
          animation: "orb-spin-partial 25s linear infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 100 * scale,
          left: "50%",
          marginLeft: -200 * scale,
          width: 400 * scale,
          height: 400 * scale,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 240 * scale,
            height: 240 * scale,
            borderRadius: "50%",
            background: "rgba(96,165,250,0.25)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="orb-echo-ring"
          style={{
            width: 320 * scale,
            height: 320 * scale,
            animation: "orb-ripple 6s linear infinite",
          }}
        />
        <div
          className="orb-echo-ring"
          style={{
            width: 400 * scale,
            height: 400 * scale,
            animation: "orb-ripple 6s linear infinite 2s",
          }}
        />
        <div
          className="orb-echo-ring"
          style={{
            width: 480 * scale,
            height: 480 * scale,
            animation: "orb-ripple 6s linear infinite 4s",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 170 * scale,
          left: "50%",
          marginLeft: -130 * scale,
          width: 260 * scale,
          height: 260 * scale,
          borderRadius: "50%",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 45px 70px -15px rgba(15,23,42,0.3)",
          overflow: "hidden",
          animation: "orb-float-y 4s ease-in-out infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 20%, #ffffff 0%, #f1f5f9 15%, #cbd5e1 35%, #475569 70%, #0f172a 100%)",
            border: "1px solid rgba(255,255,255,0.4)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: 36,
            background: "#020617",
            borderTop: "2px solid rgba(255,255,255,0.2)",
            borderBottom: "2px solid rgba(255,255,255,0.2)",
            boxShadow:
              "inset 0 4px 8px rgba(0,0,0,0.85), inset 0 -4px 8px rgba(0,0,0,0.85)",
            zIndex: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "2%",
            left: "6%",
            width: 130,
            height: 90,
            background: "#ffffff",
            borderRadius: "50%",
            filter: "blur(15px)",
            opacity: 0.9,
            transform: "rotate(-28deg)",
            zIndex: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "2%",
            right: "6%",
            width: 110,
            height: 45,
            background: "#dbeafe",
            borderRadius: "50%",
            filter: "blur(12px)",
            opacity: 0.45,
            transform: "rotate(28deg)",
            zIndex: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 204 * scale,
            height: 204 * scale,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 25%, #f8fafc 0%, #cbd5e1 40%, #475569 100%)",
            border: "3.5px solid #cbd5e1",
            boxShadow:
              "inset 0 4px 6px rgba(255,255,255,0.7), 0 8px 16px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 162 * scale,
              height: 162 * scale,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #ffffff 0%, #94a3b8 50%, #1e293b 100%)",
              border: "2.5px solid #94a3b8",
              boxShadow:
                "inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 11,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 124 * scale,
                height: 124 * scale,
                background: "#020617",
                borderRadius: "50%",
                border: "3px solid #64748b",
                boxShadow:
                  "inset 0 0 30px #000, 0 0 20px rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                zIndex: 12,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "150%",
                  height: "150%",
                  background:
                    "radial-gradient(circle at center, #2563eb 0%, transparent 65%)",
                  opacity: 0.7,
                  mixBlendMode: "screen",
                }}
              />
              <div
                style={{
                  width: 74,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 3,
                  zIndex: 20,
                }}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      width: 3,
                      borderRadius: 999,
                      background: "#67e8f9",
                      boxShadow: "0 0 8px #67e8f9",
                      animation: `orb-wave-bar ${0.7 + (i % 3) * 0.15}s ease-in-out infinite`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCards && (
        <>
          <div
            style={{
              ...cardBase,
              position: "absolute",
              top: 10 * scale,
              left: -60 * scale,
              width: 240,
              padding: 20,
              zIndex: 20,
              transformStyle: "preserve-3d",
              animation: "orb-float-card-1 5.2s ease-in-out infinite",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(239,246,255,0.4)",
                  border: "1px solid rgba(191,219,254,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.06)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div
                  style={{ fontSize: 14, fontWeight: 800, color: "#1e293b" }}
                >
                  AI Interviewer
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 2,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#3b82f6",
                      boxShadow: "0 0 6px #3b82f6",
                    }}
                  />
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}
                  >
                    Listening...
                  </span>
                </div>
              </div>
            </div>
            <svg
              width="100%"
              height="32"
              viewBox="0 0 200 40"
              fill="none"
              style={{ stroke: "rgba(59,130,246,0.4)" }}
            >
              <path
                d="M0,20 Q25,10 50,20 T100,20 T150,20 T200,20"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            style={{
              ...cardBase,
              position: "absolute",
              top: 340 * scale,
              left: -90 * scale,
              width: 185,
              padding: 20,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transformStyle: "preserve-3d",
              animation: "orb-float-card-2 5.8s ease-in-out infinite",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#64748b",
                marginBottom: 12,
                alignSelf: "flex-start",
              }}
            >
              Confidence Score
            </span>
            <div
              style={{
                position: "relative",
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <svg
                width="100%"
                height="100%"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(226,232,240,0.4)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#0ea5e9"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="263"
                  strokeDashoffset="47"
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#1e293b",
                  letterSpacing: "-0.5px",
                }}
              >
                82
                <span
                  style={{ fontSize: 14, color: "#3b82f6", fontWeight: 700 }}
                >
                  %
                </span>
              </div>
            </div>
            <svg
              width="100%"
              height="32"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
            >
              <path
                d="M0,22 C15,20 30,12 45,18 C60,24 75,6 100,2"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            style={{
              ...cardBase,
              position: "absolute",
              top: -10 * scale,
              right: -60 * scale,
              width: 265,
              padding: 24,
              zIndex: 20,
              transformStyle: "preserve-3d",
              animation: "orb-float-card-3 5.5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <span style={{ fontWeight: 800, fontSize: 15, color: "#1e293b" }}>
                Feedback
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6">
                <path d="M12 0l2.4 7.6L22 10l-7.6 2.4L12 20l-2.4-7.6L2 10l7.6-2.4z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Clear Answers",
                "Good Structure",
                "Relevant Examples",
                "Keep Improving",
              ].map((t) => (
                <div
                  key={t}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#3b82f6",
                      boxShadow: "0 0 6px #3b82f6",
                    }}
                  />
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                width: "100%",
                height: 8,
                background: "rgba(241,245,249,0.5)",
                borderRadius: 999,
                marginTop: 22,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "85%",
                  height: "100%",
                  background: "#0ea5e9",
                  borderRadius: 999,
                }}
              />
            </div>
          </div>

          <div
            style={{
              ...cardBase,
              position: "absolute",
              top: 350 * scale,
              right: -70 * scale,
              width: 285,
              padding: 24,
              zIndex: 20,
              transformStyle: "preserve-3d",
              animation: "orb-float-card-4 6.2s ease-in-out infinite",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#1e293b",
                marginBottom: 14,
                display: "block",
              }}
            >
              Skills Detected
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                "Problem Solving",
                "Communication",
                "Leadership",
                "Adaptability",
              ].map((s) => (
                <span
                  key={s}
                  style={{
                    padding: "6px 14px",
                    background: "rgba(248,250,252,0.2)",
                    border: "1px solid rgba(203,213,225,0.3)",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  {s}
                </span>
              ))}
              <span
                style={{
                  padding: "6px 14px",
                  background: "rgba(219,234,254,0.6)",
                  border: "1px solid rgba(191,219,254,0.5)",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#1e40af",
                }}
              >
                +12
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
