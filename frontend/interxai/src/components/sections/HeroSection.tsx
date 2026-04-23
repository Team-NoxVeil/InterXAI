import React from 'react';
import Button from '../ui/Button';

export interface HeroSectionProps {
  headline?: string;
  headlineAccent?: string;
  subheadline?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
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
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="img"
        aria-label="AI interview background"
      />

      {/* Dark gradient overlay — heavier on left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/10" />

      {/* Subtle green glow bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0d1f13]/70 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pt-28 pb-16">
        <div className="max-w-xl">
          {/* Badge */}
          {/* <div
            id="hero-badge"
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#3ddc84]/40
              bg-[#3ddc84]/10 backdrop-blur-sm text-[#3ddc84] text-xs font-medium tracking-wide"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ddc84] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3ddc84]" />
            </span>
            AI-Powered Interviews · Live Now
          </div> */}

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2">
            {headline}{' '}
            <span className="text-[#3ddc84]">{headlineAccent}</span>
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {subheadline}
          </h2>

          {/* Description */}
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-md">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              href={primaryCta.href}
              id="hero-primary-cta"
              className="text-sm md:text-base px-7 py-3.5"
            >
              {primaryCta.label}
            </Button>
            <Button
              variant="outline"
              href={secondaryCta.href}
              id="hero-secondary-cta"
              className="text-sm md:text-base px-7 py-3.5"
            >
              <PlayIcon />
              {secondaryCta.label}
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { value: '10,000+', label: 'Interviews Run' },
              { value: '82%', label: 'Avg. Confidence Score' },
              { value: '4.9★', label: 'User Rating' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-white/50 text-xs mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
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
