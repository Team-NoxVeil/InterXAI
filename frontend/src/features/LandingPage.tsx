import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import Footer from '../components/layout/Footer';

export interface LandingPageProps {
  /** Navigate to user login */
  onLoginClick?: () => void;
  /** Navigate to organisation auth page */
  onOrgLoginClick?: () => void;
}

const workflowSteps = [
  {
    eyebrow: '01',
    title: 'Create your role profile',
    description:
      'Choose a target role, seniority level, and focus areas so every interview feels tailored from the first question.',
  },
  {
    eyebrow: '02',
    title: 'Practice with adaptive AI',
    description:
      'Answer voice-led prompts while InterXAI adjusts follow-ups based on clarity, confidence, and technical depth.',
  },
  {
    eyebrow: '03',
    title: 'Review precise feedback',
    description:
      'Turn every session into an action plan with strengths, weak spots, suggested rewrites, and next drills.',
  },
];

const audienceCards = [
  {
    title: 'For candidates',
    copy: 'Build interview confidence with realistic practice sessions, instant scoring, and focused coaching before the real call.',
    cta: 'Start practicing',
  },
  {
    title: 'For organisations',
    copy: 'Screen consistently with structured AI-led interviews, evidence-based evaluations, and privacy-first workflows.',
    cta: 'Explore hiring tools',
  },
];

/**
 * LandingPage
 * Top-level page component that composes all landing page sections.
 */
const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onOrgLoginClick }) => {
  return (
    <div id="landing-page" className="min-h-screen bg-[#050e0a] font-sans antialiased text-white">
      <Navbar
        ctaLabel="Sign In"
        onCtaClick={onLoginClick}
        orgCtaLabel="For Organisations"
        onOrgCtaClick={onOrgLoginClick}
      />

      <HeroSection
        headline="Autonomous"
        headlineAccent="AI Interviews."
        subheadline="Smarter Careers."
        description="InterXAI runs realistic interview simulations, evaluates every response, and turns feedback into a practical coaching plan."
        primaryCta={{ label: 'Start AI Interview', onClick: onLoginClick }}
        secondaryCta={{ label: 'See How It Works', href: '#how-it-works' }}
        backgroundImage="/landingpagebackground.png"
      />

      <FeaturesSection />

      <section
        id="solutions"
        className="relative overflow-hidden bg-[#07140d] px-6 py-24 md:px-16 lg:px-24"
        aria-label="InterXAI workflow"
      >
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3ddc84]/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em] text-[#3ddc84]">
              Guided workflow
            </span>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              From first practice run to confident final answer.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/55 md:text-lg">
              A modern landing experience that clearly explains how InterXAI helps users prepare,
              improve, and measure interview readiness.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <article
                key={step.eyebrow}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#3ddc84]/40 hover:bg-[#3ddc84]/[0.06]"
              >
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3ddc84]/25 bg-[#3ddc84]/10 text-sm font-bold text-[#3ddc84]">
                  {step.eyebrow}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-6 text-white/55">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="for-users" className="bg-[#050e0a] px-6 py-24 md:px-16 lg:px-24" aria-label="Audience paths">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {audienceCards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-8 backdrop-blur transition duration-300 hover:border-[#3ddc84]/35"
            >
              <span className="mb-5 inline-flex rounded-full bg-[#3ddc84]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3ddc84]">
                {index === 0 ? 'Practice' : 'Hire'}
              </span>
              <h2 className="text-2xl font-bold text-white md:text-3xl">{card.title}</h2>
              <p className="mt-4 min-h-24 text-sm leading-6 text-white/55 md:text-base">{card.copy}</p>
              <button
                type="button"
                onClick={index === 0 ? onLoginClick : onOrgLoginClick}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#07140d] transition hover:bg-[#3ddc84]"
              >
                {card.cta}
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-[#07140d] px-6 py-20 text-center md:px-16 lg:px-24" aria-label="Final call to action">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#3ddc84]/20 bg-[#3ddc84]/10 px-8 py-12 shadow-[0_0_60px_rgba(61,220,132,0.12)]">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3ddc84]">Ready when you are</span>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">Practice smarter before the interview starts.</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/60">
            Launch a focused AI interview session and leave with clear feedback you can act on today.
          </p>
          <button
            type="button"
            onClick={onLoginClick}
            className="mt-8 rounded-xl bg-[#3ddc84] px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_30px_rgba(61,220,132,0.35)] transition hover:bg-[#2fcb75]"
          >
            Start AI Interview
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
