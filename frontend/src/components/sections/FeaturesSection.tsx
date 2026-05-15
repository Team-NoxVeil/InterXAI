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
    title: 'Voice AI Interviews',
    description:
      'Practice with advanced conversational AI interviews featuring adaptive questioning and live speech analysis.',
  },
  {
    icon: <BrainIcon />,
    title: 'Instant Smart Evaluation',
    description:
      'Receive AI-powered feedback, communication scoring, and detailed improvement insights instantly.',
  },
  {
    icon: <ChartIcon />,
    title: 'Career Growth Analytics',
    description:
      'Track performance trends, strengths, weaknesses, and long-term career progress intelligently.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Secure & Private',
    description:
      'Enterprise-grade encryption ensures your interview sessions and data remain completely secure.',
  },
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title = 'Everything you need to ace your next role',
  subtitle = 'InterXAI combines next-generation artificial intelligence with advanced career intelligence.',
  features = defaultFeatures,
}) => {
  return (
    <section
      id="features"
      className="
        relative
        overflow-hidden
        py-28
        px-6
        md:px-14
        lg:px-24
        bg-[#050816]
      "
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full" />

        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/10 blur-[140px] rounded-full" />

        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.03]
            bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),
            linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
            bg-[size:60px_60px]
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050816]/40 to-[#050816]" />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-2
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-400/10
              text-cyan-300
              text-xs
              uppercase
              tracking-[0.3em]
              font-semibold
              mb-7
            "
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Features
          </div>

          <h2
            className="
              text-4xl
              md:text-5xl
              lg:text-6xl
              font-bold
              leading-tight
              text-white
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-6
              text-white/60
              text-lg
              leading-relaxed
              max-w-2xl
              mx-auto
            "
          >
            {subtitle}
          </p>
        </div>

        {/* Cards */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-7
            max-w-7xl
            mx-auto
          "
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        p-8
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-cyan-400/30
        hover:bg-white/[0.06]
        hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]
      "
    >
      {/* Hover Glow */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-500
          bg-gradient-to-br
          from-cyan-400/10
          via-transparent
          to-blue-500/10
        "
      />

      {/* Top border glow */}
      <div
        className="
          absolute
          top-0
          left-0
          w-full
          h-[1px]
          bg-gradient-to-r
          from-transparent
          via-cyan-400/50
          to-transparent
        "
      />

      <div className="relative z-10">

        {/* Icon */}
        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-gradient-to-br
            from-cyan-400/15
            to-blue-500/15
            border
            border-cyan-400/20
            flex
            items-center
            justify-center
            mb-6
            text-cyan-300
            group-hover:scale-110
            transition-transform
            duration-300
          "
        >
          {feature.icon}
        </div>

        {/* Title */}
        <h3
          className="
            text-white
            text-2xl
            font-semibold
            mb-4
          "
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p
          className="
            text-white/60
            text-[15px]
            leading-relaxed
          "
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
};

/* Icons */

function MicIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 10a6 6 0 0012 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="16" x2="10" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3C7.24 3 5 5.24 5 8c0 1.66.8 3.12 2.04 4.05A3 3 0 0010 17a3 3 0 002.96-4.95A4.996 4.996 0 0015 8c0-2.76-2.24-5-5-5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <line x1="10" y1="8" x2="10" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="11" width="3" height="6" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="8.5" y="7" width="3" height="10" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="14" y="3" width="3" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2L4 5v5c0 3.87 2.57 7.49 6 8.93C13.43 17.49 16 13.87 16 10V5L10 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 10l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default FeaturesSection;