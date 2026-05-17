import { useEffect, type CSSProperties, type JSX } from "react";

export interface PricingPageProps {
  onBack?: () => void;
  onLoginClick?: () => void;
}

const PricingPage = ({
  onBack,
  onLoginClick,
}: PricingPageProps): JSX.Element => {
  useEffect(() => {
    const s: HTMLStyleElement = document.createElement("style");
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .slide-up { animation: slideUp 0.6s ease-out forwards; }
      .pulse { animation: pulse 2s ease-in-out infinite; }
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

  const priceCardStyle: CSSProperties = {
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 40,
    display: "flex",
    flexDirection: "column",
  };

  const popularCardStyle: CSSProperties = {
    ...priceCardStyle,
    background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(29,78,216,0.1))",
    border: "2px solid #3b82f6",
    transform: "scale(1.05)",
  };

  const planNameStyle: CSSProperties = {
    fontSize: 22,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 8,
  };

  const planPriceStyle: CSSProperties = {
    fontSize: 44,
    fontWeight: 900,
    color: "#1d4ed8",
    marginBottom: 8,
  };

  const planDescriptionStyle: CSSProperties = {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    minHeight: 40,
  };

  const buttonStyle: CSSProperties = {
    background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: 99,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 24,
    boxShadow: "0 6px 22px rgba(59,130,246,0.48)",
  };

  const outlineButtonStyle: CSSProperties = {
    background: "transparent",
    color: "#2563eb",
    border: "1.5px solid #2563eb",
    borderRadius: 99,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 24,
  };

  const featureStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    fontSize: 14,
    color: "#4b5563",
  };

  const checkmarkStyle: CSSProperties = {
    flexShrink: 0,
    width: 20,
    height: 20,
    background: "#10b981",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const disabledCheckStyle: CSSProperties = {
    flexShrink: 0,
    width: 20,
    height: 20,
    background: "#e5e7eb",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for students and entry-level professionals",
      cta: "Start Free Trial",
      features: [
        "10 practice interviews/month",
        "Basic feedback reports",
        "Standard interview templates",
        "Email support",
      ],
      unavailable: [
        "Priority feedback",
        "Custom templates",
        "Career coaching",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Most popular for active job seekers",
      cta: "Get Started",
      features: [
        "Unlimited interviews",
        "Advanced AI feedback",
        "50+ role templates",
        "Real-time confidence scores",
        "Priority email support",
        "Monthly coaching session",
      ],
      unavailable: [
        "Custom templates",
        "Phone support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For companies and large-scale training programs",
      cta: "Contact Sales",
      features: [
        "Unlimited team seats",
        "Custom interview templates",
        "Advanced analytics dashboard",
        "Dedicated account manager",
        "Phone & email support",
        "Custom integrations",
        "SSO authentication",
        "Batch interview reports",
      ],
      unavailable: [],
      popular: false,
    },
  ];

  const faqStyle: CSSProperties = {
    maxWidth: 700,
    margin: "0 auto",
  };

  const faqItemStyle: CSSProperties = {
    marginBottom: 20,
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 20,
  };

  const faqQuestionStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 12,
  };

  const faqAnswerStyle: CSSProperties = {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
  };

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
        <h1 style={headingStyle}>Simple, Transparent Pricing</h1>
        <p style={subheadingStyle}>
          Choose the plan that fits your goals. All plans include core AI
          interview features. Scale up as you grow.
        </p>

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 32,
            marginBottom: 80,
            alignItems: "start",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                ...((plan.popular ? popularCardStyle : priceCardStyle) as any),
                animation: `slideUp 0.6s ease-out forwards`,
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "#fff",
                    padding: "6px 16px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 16,
                    width: "fit-content",
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <h3 style={planNameStyle}>{plan.name}</h3>
              <div style={planPriceStyle}>{plan.price}</div>
              {plan.period && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 16,
                  }}
                >
                  {plan.period}
                </div>
              )}
              <p style={planDescriptionStyle}>{plan.description}</p>
              <button
                onClick={onLoginClick}
                style={{
                  ...(plan.popular ? buttonStyle : outlineButtonStyle),
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {plan.cta}
              </button>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 24 }}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} style={featureStyle}>
                    <div style={checkmarkStyle}>
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 12 10"
                        fill="none"
                      >
                        <path
                          d="M1 5l3 3L11 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.unavailable.map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...featureStyle,
                      opacity: 0.5,
                      color: "#9ca3af",
                    }}
                  >
                    <div style={disabledCheckStyle} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: 120 }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#0f172a",
              textAlign: "center",
              marginBottom: 60,
            }}
          >
            Frequently Asked Questions
          </h2>

          <div style={faqStyle}>
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Absolutely. Start with 3 free practice interviews to explore all features before committing.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.",
              },
              {
                q: "Do you offer educational discounts?",
                a: "Yes! Students get 50% off Pro plan with a valid .edu email. Contact our sales team for details.",
              },
              {
                q: "What's included in the free trial?",
                a: "Your free trial includes 3 full practice interviews, instant feedback, and basic coaching recommendations.",
              },
            ].map((faq, idx) => (
              <div key={idx} style={faqItemStyle}>
                <div style={faqQuestionStyle}>Q: {faq.q}</div>
                <div style={faqAnswerStyle}>A: {faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div
          style={{
            textAlign: "center",
            marginTop: 80,
            padding: 40,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.9)",
          }}
        >
          <h3
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 12,
            }}
          >
            Ready to ace your interviews?
          </h3>
          <p
            style={{
              fontSize: 16,
              color: "#6b7280",
              marginBottom: 24,
            }}
          >
            Start your free trial today. No credit card required.
          </p>
          <button
            onClick={onLoginClick}
            style={{
              ...buttonStyle,
              marginBottom: 0,
            }}
          >
            Get Started Free
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

export default PricingPage;
