import React from 'react';
import Button from '../ui/Button';

export interface CtaConfig {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeroSectionProps {
  headline?: string;
  headlineAccent?: string;
  subheadline?: string;
  description?: string;
  primaryCta?: CtaConfig;
  secondaryCta?: CtaConfig;
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  headline = 'Autonomous',
  headlineAccent = 'AI Interviews.',
  subheadline = 'Smarter Careers.',
  description = 'InterXAI runs interviews, evaluates candidates, and coaches careers—fully autonomous.',
  primaryCta = { label: 'Start AI Interview', href: '#start' },
  secondaryCta = { label: 'Watch Demo', href: '#demo' },
  backgroundImage = '/landingpagebackground.png',
}) => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
      aria-label="Hero section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="img"
        aria-label="AI interview background"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(61,220,132,0.22),transparent_32%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0d1f13]/80 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full px-6 pb-16 pt-28 md:px-16 lg:px-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div
              id="hero-badge"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3ddc84]/40 bg-[#3ddc84]/10 px-3 py-1.5 text-xs font-medium tracking-wide text-[#3ddc84] backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3ddc84]" />
              </span>
              AI-Powered Interviews · Live Coaching
            </div>

            <h1 className="mb-3 text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
              {headline} <span className="text-[#3ddc84]">{headlineAccent}</span>
            </h1>
            <h2 className="mb-6 text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
              {subheadline}
            </h2>

            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              {description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                href={primaryCta.onClick ? undefined : primaryCta.href}
                onClick={primaryCta.onClick}
                id="hero-primary-cta"
                className="px-7 py-3.5 text-sm md:text-base"
              >
                {primaryCta.label}
              </Button>
              <Button
                variant="outline"
                href={secondaryCta.onClick ? undefined : secondaryCta.href}
                onClick={secondaryCta.onClick}
                id="hero-secondary-cta"
                className="px-7 py-3.5 text-sm md:text-base"
              >
                <PlayIcon />
                {secondaryCta.label}
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { value: '10,000+', label: 'Interviews Run' },
                { value: '82%', label: 'Avg. Confidence Score' },
                { value: '4.9★', label: 'User Rating' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="mt-0.5 text-xs text-white/50">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-[#3ddc84]/10 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#3ddc84]">Live session</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">Product Manager Interview</h3>
                </div>
                <span className="rounded-full bg-[#3ddc84]/15 px-3 py-1 text-xs font-semibold text-[#3ddc84]">
                  Active
                </span>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/40">AI interviewer</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Tell me about a time you used customer insight to change product direction.
                  </p>
                </div>
                <div className="ml-10 rounded-2xl border border-[#3ddc84]/20 bg-[#3ddc84]/10 p-4">
                  <p className="text-xs text-[#3ddc84]">Candidate response</p>
                  <div className="mt-3 flex items-center gap-1">
                    {[40, 58, 74, 54, 86, 64, 48, 70, 52].map((height, index) => (
                      <span
                        key={index}
                        className="w-1.5 rounded-full bg-[#3ddc84]"
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ['Clarity', '91%'],
                  ['Structure', '84%'],
                  ['Confidence', '88%'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-xs text-white/45">{label}</p>
                    <p className="mt-1 text-xl font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/30 animate-bounce">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
};

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
    <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" />
    <path d="M6.5 5.5L11 8L6.5 10.5V5.5Z" fill="white" />
  </svg>
);

export default HeroSection;
