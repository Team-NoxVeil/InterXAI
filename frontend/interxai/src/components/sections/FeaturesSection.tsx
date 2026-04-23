import React from 'react';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    icon: <MicIcon />,
    title: 'Voice-Driven Interviews',
    description:
      'Fully conversational AI interviewer with real-time voice analysis and natural language understanding.',
  },
  {
    icon: <BrainIcon />,
    title: 'Instant Evaluation',
    description:
      'Confidence scoring, clarity rating, and structured feedback delivered the moment your session ends.',
  },
  {
    icon: <ChartIcon />,
    title: 'Career Coaching',
    description:
      'Personalised improvement plans based on your performance, role target, and industry benchmarks.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Privacy First',
    description:
      'Your data stays yours. End-to-end encrypted sessions with zero human reviewers.',
  },
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title = 'Everything you need to ace your next role',
  subtitle = 'InterXAI combines cutting-edge AI with career intelligence.',
  features = defaultFeatures,
}) => (
  <section
    id="how-it-works"
    className="bg-[#050e0a] py-24 px-6 md:px-16 lg:px-24"
    aria-label="Features section"
  >
    {/* Header */}
    <div className="text-center mb-16">
      <span className="text-[#3ddc84] text-xs uppercase tracking-widest font-semibold mb-3 block">
        Features
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      <p className="text-white/50 max-w-xl mx-auto text-base">{subtitle}</p>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {features.map((feature, i) => (
        <FeatureCard key={i} feature={feature} />
      ))}
    </div>
  </section>
);

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => (
  <div
    className="group relative rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6
      hover:border-[#3ddc84]/30 hover:bg-white/8 transition-all duration-300 cursor-default"
  >
    {/* Glow on hover */}
    <div className="absolute inset-0 rounded-2xl bg-[#3ddc84]/0 group-hover:bg-[#3ddc84]/5 transition-all duration-300" />

    <div className="relative z-10">
      <div
        className="w-11 h-11 rounded-xl bg-[#3ddc84]/10 border border-[#3ddc84]/20 flex items-center
          justify-center mb-5 text-[#3ddc84] group-hover:bg-[#3ddc84]/20 transition-colors"
      >
        {feature.icon}
      </div>
      <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
    </div>
  </div>
);

/* Icon components */
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
      <path
        d="M10 3C7.24 3 5 5.24 5 8c0 1.66.8 3.12 2.04 4.05A3 3 0 0010 17a3 3 0 002.96-4.95A4.996 4.996 0 0015 8c0-2.76-2.24-5-5-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
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
      <path
        d="M10 2L4 5v5c0 3.87 2.57 7.49 6 8.93C13.43 17.49 16 13.87 16 10V5L10 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default FeaturesSection;
