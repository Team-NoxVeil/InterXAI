import React from 'react';

const features = [
  {
    icon: <MicIcon />,
    title: 'Voice-Driven Interviews',
    description: 'Fully conversational AI interviewer with real-time voice analysis and natural language understanding.',
    color: 'bg-blue-50 border-blue-100 text-blue-600',
  },
  {
    icon: <BrainIcon />,
    title: 'Instant Evaluation',
    description: 'Confidence scoring, clarity rating, and structured feedback delivered the moment your session ends.',
    color: 'bg-violet-50 border-violet-100 text-violet-600',
  },
  {
    icon: <ChartIcon />,
    title: 'Career Coaching',
    description: 'Personalised improvement plans based on your performance, role target, and industry benchmarks.',
    color: 'bg-emerald-50 border-emerald-100 text-emerald-600',
  },
  {
    icon: <ShieldIcon />,
    title: 'Privacy First',
    description: 'Your data stays yours. End-to-end encrypted sessions with zero human reviewers.',
    color: 'bg-amber-50 border-amber-100 text-amber-600',
  },
];

const FeaturesSection: React.FC = () => (
  <section
    id="how-it-works"
    className="py-24 px-6 md:px-16 bg-white"
  >
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block text-blue-600 text-xs uppercase tracking-widest font-semibold mb-3
          bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
          Features
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Everything you need to ace your next role
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-base">
          InterXAI combines cutting-edge AI with career intelligence.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-xl
              hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${f.color}`}>
              {f.icon}
            </div>
            <h3 className="text-slate-900 font-semibold text-base mb-2">{f.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

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
      <path d="M10 3C7.24 3 5 5.24 5 8c0 1.66.8 3.12 2.04 4.05A3 3 0 0010 17a3 3 0 002.96-4.95A4.996 4.996 0 0015 8c0-2.76-2.24-5-5-5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
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
      <path d="M10 2L4 5v5c0 3.87 2.57 7.49 6 8.93C13.43 17.49 16 13.87 16 10V5L10 2z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default FeaturesSection;
