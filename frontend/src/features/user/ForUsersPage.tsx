import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/Button";

export interface ForUsersPageProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onBack?: () => void;
}

const benefits = [
  {
    icon: <MicIcon />,
    title: "Voice-Driven Interviews",
    description:
      "Practice with a fully conversational AI interviewer that listens, adapts, and provides real-time feedback on your responses.",
  },
  {
    icon: <BrainIcon />,
    title: "Instant Evaluation",
    description:
      "Get confidence scores, clarity ratings, and structured feedback the moment your interview ends—no waiting.",
  },
  {
    icon: <ChartIcon />,
    title: "Career Coaching",
    description:
      "Receive personalised improvement plans based on your performance, target role, and industry benchmarks.",
  },
  {
    icon: <ShieldIcon />,
    title: "Privacy First",
    description:
      "Your data stays yours. End-to-end encrypted sessions with zero human reviewers. No recordings stored.",
  },
  {
    icon: <TargetIcon />,
    title: "Role-Specific Practice",
    description:
      "Choose from hundreds of role-specific interview templates tailored by industry experts and updated regularly.",
  },
  {
    icon: <ClockIcon />,
    title: "Practice Anytime",
    description:
      "Available 24/7. Schedule sessions when it suits you, with no appointment needed.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Sign up in seconds, link your GitHub, LinkedIn, and LeetCode to give the AI context about your background.",
  },
  {
    step: "02",
    title: "Pick a Role",
    description:
      "Browse available interview templates matching your target position, experience level, and industry.",
  },
  {
    step: "03",
    title: "Start Interviewing",
    description:
      "Begin a voice-driven AI interview. The AI adapts questions based on your responses in real time.",
  },
  {
    step: "04",
    title: "Get Feedback & Improve",
    description:
      "Receive instant scoring, detailed feedback, and a personalised roadmap to close skill gaps.",
  },
];

const ForUsersPage: React.FC<ForUsersPageProps> = ({
  onLoginClick,
  onSignupClick,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-[#050e0a] font-sans antialiased">
      <Navbar
        ctaLabel="Sign In"
        onCtaClick={onLoginClick}
        orgCtaLabel="For Organisations"
        onOrgCtaClick={onBack}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f13]/50 via-transparent to-[#050e0a]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-[#3ddc84] text-xs uppercase tracking-widest font-semibold mb-4 block">
            For Candidates
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Ace Your Next{" "}
            <span className="text-[#3ddc84]">Interview</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            InterXAI gives you the tools to practise, evaluate, and improve —
            all with an autonomous AI interviewer that adapts to you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              onClick={onSignupClick}
              className="text-sm md:text-base px-8 py-3.5"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              onClick={onLoginClick}
              className="text-sm md:text-base px-8 py-3.5"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#3ddc84] text-xs uppercase tracking-widest font-semibold mb-3 block">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-base">
              From realistic practice to actionable feedback — all in one
              platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group relative rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6
                  hover:border-[#3ddc84]/30 hover:bg-white/8 transition-all duration-300 cursor-default"
              >
                <div className="absolute inset-0 rounded-2xl bg-[#3ddc84]/0 group-hover:bg-[#3ddc84]/5 transition-all duration-300" />
                <div className="relative z-10">
                  <div
                    className="w-11 h-11 rounded-xl bg-[#3ddc84]/10 border border-[#3ddc84]/20 flex items-center
                      justify-center mb-5 text-[#3ddc84] group-hover:bg-[#3ddc84]/20 transition-colors"
                  >
                    {b.icon}
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">
                    {b.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#3ddc84] text-xs uppercase tracking-widest font-semibold mb-3 block">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              From signup to success in 4 steps
            </h2>
          </div>
          <div className="space-y-12">
            {howItWorks.map((item, i) => (
              <div
                key={item.step}
                className="flex items-start gap-6 md:gap-10"
              >
                <div className="hidden md:flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-full bg-[#3ddc84]/10 border border-[#3ddc84]/30 flex items-center
                      justify-center text-[#3ddc84] font-bold text-lg shrink-0"
                  >
                    {item.step}
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="md:hidden text-[#3ddc84] font-bold text-sm mb-1">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: "10,000+", label: "Interviews Completed" },
            { value: "82%", label: "Avg. Confidence Score" },
            { value: "4.9★", label: "User Rating" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-bold text-white mb-2">
                {s.value}
              </div>
              <div className="text-white/50 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-16 lg:px-24">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl border border-[#3ddc84]/20 bg-[#3ddc84]/5
            backdrop-blur-sm px-8 py-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="text-white/50 text-base mb-8 max-w-lg mx-auto">
            Join thousands of candidates already using InterXAI to prepare
            smarter.
          </p>
          <Button
            variant="primary"
            onClick={onSignupClick}
            className="text-sm md:text-base px-8 py-3.5"
          >
            Start Free →
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10a6 6 0 0012 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="16" x2="10" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3C7.24 3 5 5.24 5 8c0 1.66.8 3.12 2.04 4.05A3 3 0 0010 17a3 3 0 002.96-4.95A4.996 4.996 0 0015 8c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="10" y1="8" x2="10" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="11" width="3" height="6" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="8.5" y="7" width="3" height="10" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="14" y="3" width="3" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L4 5v5c0 3.87 2.57 7.49 6 8.93C13.43 17.49 16 13.87 16 10V5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5V10l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default ForUsersPage;
