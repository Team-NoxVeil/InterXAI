import { useEffect, type CSSProperties, type JSX } from "react";

export interface HowItWorksPageProps {
  onBack?: () => void;
  onLoginClick?: () => void;
}

const HowItWorksPage = ({
  onBack,
  onLoginClick,
}: HowItWorksPageProps): JSX.Element => {
  useEffect(() => {
    const s: HTMLStyleElement = document.createElement("style");
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .slide-up { animation: slideUp 0.6s ease-out forwards; }
      .fade-in { animation: fadeIn 0.8s ease-out forwards; }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const containerStyle: CSSProperties = {
    minHeight: "100vh",
    background:
      "linear-gradient(155deg, #bdd9f2 0%, #cfe8fb 12%, #dff0ff 28%, #ecf7ff 45%, #f4faff 62%, #e8f4fd 78%, #d2e9f8 100%)",
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: "hidden",
  };

  const navbarStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 52px",
    maxWidth: 1300,
    margin: "0 auto",
  };

  const logoStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 9,
    cursor: "pointer",
  };

  const logoBoxStyle: CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "linear-gradient(145deg,#4f9cf9,#1649c9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid rgba(255,255,255,0.35)",
  };

  const sectionStyle: CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "80px 52px",
  };

  const headingStyle: CSSProperties = {
    fontSize: 48,
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: 24,
    letterSpacing: "-1.5px",
  };

  const subheadingStyle: CSSProperties = {
    fontSize: 18,
    color: "#6b7280",
    lineHeight: 1.6,
    maxWidth: 600,
    marginBottom: 60,
  };

  const stepContainerStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 32,
    marginBottom: 80,
  };

  const stepCardStyle: CSSProperties = {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 8px 32px rgba(96,165,250,0.1)",
  };

  const stepNumberStyle: CSSProperties = {
    fontSize: 48,
    fontWeight: 900,
    color: "#2563eb",
    marginBottom: 16,
  };

  const stepTitleStyle: CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 12,
  };

  const stepDescriptionStyle: CSSProperties = {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
  };

  const featureListStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 24,
    marginTop: 40,
  };

  const featureItemStyle: CSSProperties = {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
  };

  const featureCheckStyle: CSSProperties = {
    flexShrink: 0,
    width: 24,
    height: 24,
    background: "#10b981",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  };

  const ctas: CSSProperties = {
    display: "flex",
    gap: 16,
    marginTop: 40,
  };

  const primaryButtonStyle: CSSProperties = {
    background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: 99,
    padding: "13px 28px",
    fontSize: 14.5,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 22px rgba(59,130,246,0.48)",
  };

  const backButtonStyle: CSSProperties = {
    background: "transparent",
    color: "#2563eb",
    border: "1px solid #2563eb",
    borderRadius: 99,
    padding: "13px 28px",
    fontSize: 14.5,
    fontWeight: 700,
    cursor: "pointer",
  };

  const steps = [
    {
      number: "1",
      title: "Start Interview",
      description:
        "Choose your interview type, role, and seniority level. Select from 100+ role-specific templates or customize your own.",
    },
    {
      number: "2",
      title: "Speak Naturally",
      description:
        "Answer interview questions in a natural conversation. Our AI listens, adapts follow-ups, and evaluates your responses in real-time.",
    },
    {
      number: "3",
      title: "Get Instant Feedback",
      description:
        "Receive detailed scores on clarity, structure, confidence, and technical accuracy. See exactly what went well.",
    },
    {
      number: "4",
      title: "Learn & Improve",
      description:
        "Get personalised coaching insights, sample answers, and targeted improvement recommendations for your next practice.",
    },
  ];

  const keyFeatures = [
    "Real-time AI evaluation",
    "Confidence score breakdown",
    "Voice clarity analysis",
    "Technical skill assessment",
    "Personalized coaching plan",
    "Unlimited retakes",
  ];

  return (
    <div style={containerStyle}>
      {/* Navbar */}
      <nav style={navbarStyle}>
        <div
          style={logoStyle}
          onClick={onBack}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") onBack?.();
          }}
        >
          <div style={logoBoxStyle}>
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

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: "#4b5563",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            ← Back
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
              boxShadow: "0 4px 16px rgba(59,130,246,0.5)",
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={sectionStyle}>
        <h1 style={headingStyle}>How It Works</h1>
        <p style={subheadingStyle}>
          Master interviews with AI-powered practice sessions. Get real-time
          feedback and personalized coaching to land your dream job.
        </p>

        {/* Steps */}
        <div style={stepContainerStyle}>
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                ...stepCardStyle,
                animation: `slideUp 0.6s ease-out forwards`,
              }}
            >
              <div style={stepNumberStyle}>{step.number}</div>
              <h3 style={stepTitleStyle}>{step.title}</h3>
              <p style={stepDescriptionStyle}>{step.description}</p>
            </div>
          ))}
        </div>

        {/* Key Features */}
        <div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 32,
            }}
          >
            What You Get
          </h2>
          <div style={featureListStyle}>
            {keyFeatures.map((feature, idx) => (
              <div key={idx} style={featureItemStyle}>
                <div style={featureCheckStyle}>
                  <svg
                    width="14"
                    height="12"
                    viewBox="0 0 14 12"
                    fill="none"
                  >
                    <path
                      d="M1 6l4 4 8-10"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 15, color: "#0f172a", fontWeight: 500 }}>
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={ctas}>
          <button style={primaryButtonStyle} onClick={onLoginClick}>
            Start Your First Interview
          </button>
          <button style={backButtonStyle} onClick={onBack}>
            Back to Home
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "32px 52px",
          borderTop: "1px solid rgba(0,0,0,0.05)",
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        <p>© 2026 InterXAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HowItWorksPage;
