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

const stats = [
  { icon: <UsersIcon />, value: '10,000+', label: 'Interviews Run' },
  { icon: <ChartIcon />, value: '82%', label: 'Avg. Confidence Score' },
  { icon: <StarIcon />, value: '4.9/5', label: 'User Rating' },
];

const companies = ['Google', 'Microsoft', 'Amazon', 'Airbnb', 'Meta', 'Spotify'];

const HeroSection: React.FC<HeroSectionProps> = ({
  headline = 'Ace',
  headlineAccent = 'Interviews.',
  subheadline = 'Advance Your Career.',
  description = 'InterXAI conducts intelligent interviews, evaluates skills, and delivers actionable feedback to help you get hired faster and grow your career.',
  primaryCta = { label: 'Start AI Interview', href: '#start' },
  secondaryCta = { label: 'Watch Demo', href: '#demo' },
  backgroundImage = '/landingpagebackground.png',
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Semi-transparent overlay to ensure text readability if needed, though the image seems bright enough. 
          Adding a subtle gradient from left to ensure text is legible against any background variations. */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

      <div className="relative z-10 flex flex-col items-start px-6 md:px-12 lg:px-16 pt-32 pb-20 max-w-7xl mx-auto w-full">
        {/* Text content - Left aligned on desktop, center on mobile if needed, but left is safer for this design */}
        <div className="w-full max-w-[600px] mt-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full
            bg-white/90 backdrop-blur-md border border-blue-100 text-blue-600 text-xs font-semibold shadow-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M7 1.5L8.5 5h3.5l-2.8 2 1.1 3.5L7 8.5l-3.3 2L4.8 7 2 5h3.5L7 1.5z" fill="currentColor" />
            </svg>
            AI-Powered Interview Platform
          </div>

          {/* Headline */}
          <h1 className="text-[3.5rem] lg:text-[4.5rem] font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6">
            {headline}{' '}
            <span className="text-blue-600">{headlineAccent}</span>
            <br />
            {subheadline}
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-[480px]">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Button
              variant="primary"
              href={primaryCta.onClick ? undefined : primaryCta.href}
              onClick={primaryCta.onClick}
              id="hero-primary-cta"
              className="px-8 py-4 text-[15px] rounded-full flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
            >
              {primaryCta.label}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <button
              onClick={secondaryCta.onClick}
              id="hero-secondary-cta"
              className="flex items-center gap-3 px-8 py-4 text-[15px] font-semibold text-slate-700
                rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-all duration-200
                shadow-sm border border-white/50"
            >
              Watch Demo
              <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center bg-white text-slate-500">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor">
                  <path d="M1.5 1.5L6.5 5L1.5 8.5V1.5Z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-blue-500 border border-blue-100/50">
                  {s.icon}
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-lg leading-tight">{s.value}</p>
                  <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trusted by companies - Pushed to the bottom */}
      <div className="relative z-10 mt-auto bg-white/60 backdrop-blur-md py-6 px-6 md:px-16 mx-4 mb-4 rounded-3xl border border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
            Trusted by<br/>Top Companies
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-12 gap-y-6 flex-1">
            {companies.map((c) => (
              <span key={c} className="text-slate-700 font-bold text-xl tracking-tight opacity-70 hover:opacity-100 transition-opacity cursor-default">
                {c === 'Google' && 'Google'}
                {c === 'Microsoft' && <span className="flex items-center gap-1.5"><svg width="16" height="16" viewBox="0 0 16 16"><rect width="7" height="7" fill="#f25022"/><rect x="9" width="7" height="7" fill="#7fba00"/><rect y="9" width="7" height="7" fill="#00a4ef"/><rect x="9" y="9" width="7" height="7" fill="#ffb900"/></svg> Microsoft</span>}
                {c === 'Amazon' && 'amazon'}
                {c === 'Airbnb' && <span className="flex items-center gap-1"><svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M9 16.5C8.8 16.5 8.6 16.4 8.4 16.2L1.5 8.9C-0.5 6.8-0.5 3.3 1.5 1.2C2.5 0.2 3.8 -0.3 5.2 -0.3C6.6 -0.3 7.9 0.2 8.9 1.2L9 1.3L9.1 1.2C10.1 0.2 11.4 -0.3 12.8 -0.3C14.2 -0.3 15.5 0.2 16.5 1.2C18.5 3.3 18.5 6.8 16.5 8.9L9.6 16.2C9.4 16.4 9.2 16.5 9 16.5Z"/></svg> airbnb</span>}
                {c === 'Meta' && '∞ Meta'}
                {c === 'Spotify' && <span className="flex items-center gap-1"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM20.16 9.6C15.96 7.08 9.24 6.84 5.4 7.92c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.2 11.76-.96 16.68 2.04.54.36.72 1.08.36 1.62-.36.6-.96.72-1.62.12z"/></svg> Spotify</span>}
                {!['Google', 'Microsoft', 'Amazon', 'Airbnb', 'Meta', 'Spotify'].includes(c) && c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Icon sub-components ───────────────────────────────────────────────────────
function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14 17v-1.5A3.5 3.5 0 0010.5 12h-5A3.5 3.5 0 002 15.5V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 17v-1.5a3.5 3.5 0 00-2.5-3.36M13.5 3.64a3.5 3.5 0 010 5.72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 14l4-5 3 3 4-6 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l2.2 6.5H18l-5 3.6 1.9 6L10 14.5 5.1 18l1.9-6L2 8.5h5.8L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export default HeroSection;
