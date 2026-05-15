import React, { useEffect, useState } from 'react';
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

const scores = [82, 86, 91, 88, 94];

const feedbackStates = [
  {
    score: 'Excellent',
    structure: 'Good',
    examples: 'Excellent',
    improvement: 'Fair',
    progress: '72%',
  },
  {
    score: 'Outstanding',
    structure: 'Excellent',
    examples: 'Strong',
    improvement: 'Good',
    progress: '84%',
  },
  {
    score: 'Strong',
    structure: 'Excellent',
    examples: 'Outstanding',
    improvement: 'Great',
    progress: '91%',
  },
];

const skillSets = [
  [
    'Problem Solving',
    'Communication',
    'Leadership',
    'Adaptability',
  ],
  [
    'Critical Thinking',
    'Confidence',
    'Presentation',
    'Teamwork',
  ],
  [
    'AI Knowledge',
    'Creativity',
    'Strategy',
    'Analytics',
  ],
];

const HeroSection: React.FC<HeroSectionProps> = ({
  headline = 'Autonomous',
  headlineAccent = 'AI Interviews.',
  subheadline = 'Smarter Careers.',
  description = 'InterXAI conducts intelligent interviews, evaluates candidate skills, and delivers real-time AI-powered feedback to help users grow faster and perform better.',
  primaryCta = { label: 'Start AI Interview', href: '#start' },
  secondaryCta = { label: 'Watch Demo', href: '#demo' },
  backgroundImage = '/new-bg-image.jpg',
}) => {
  const [scoreIndex, setScoreIndex] = useState(0);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [skillIndex, setSkillIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScoreIndex((prev) => (prev + 1) % scores.length);
      setFeedbackIndex((prev) => (prev + 1) % feedbackStates.length);
      setSkillIndex((prev) => (prev + 1) % skillSets.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentFeedback = feedbackStates[feedbackIndex];

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#020617]"
    >
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 opacity-90"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-[#020617]/55" />

      {/* MAIN BLUE GLOW */}
      <div className="absolute top-[10%] right-[15%] w-[700px] h-[700px] rounded-full bg-blue-500/20 blur-[140px]" />

      {/* CYAN GLOW */}
      <div className="absolute bottom-[0%] right-[5%] w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[120px]" />

      {/* LEFT FADE */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/70 to-transparent" />

      {/* GRID */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.04]
          bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),
          linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
          bg-[size:70px_70px]
        "
      />

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[55%] w-2 h-2 bg-blue-400 rounded-full blur-sm animate-pulse" />
        <div className="absolute top-[60%] left-[75%] w-3 h-3 bg-cyan-300 rounded-full blur-sm animate-pulse" />
        <div className="absolute top-[40%] left-[85%] w-2 h-2 bg-indigo-400 rounded-full blur-sm animate-pulse" />
      </div>

      {/* FLOATING UI CARDS */}
      <div className="absolute inset-0 hidden lg:block z-10">

        {/* AI Interviewer */}
        <div className="absolute top-[16%] right-[34%] w-[320px] rounded-[32px] border border-white/10 bg-[#10182f]/70 backdrop-blur-2xl p-7 shadow-[0_0_50px_rgba(59,130,246,0.25)] animate-[float_6s_ease-in-out_infinite]">

          <div className="flex items-center gap-3 mb-5">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-white font-semibold text-2xl">
              AI Interviewer
            </p>
          </div>

          <p className="text-white/70 text-base mb-8">
            Listening...
          </p>

          <div className="flex items-end gap-2 h-20">
            {[40, 65, 30, 80, 50, 90, 45, 70].map((h, i) => (
              <div
                key={i}
                className="w-2 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300 animate-pulse"
                style={{
                  height: `${h}px`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* FEEDBACK */}
        <div className="absolute top-[18%] right-[6%] w-[420px] rounded-[36px] border border-white/10 bg-[#10182f]/75 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.18)] animate-[float_8s_ease-in-out_infinite]">

          <h4 className="text-white text-4xl font-semibold mb-8">
            Feedback
          </h4>

          <div className="space-y-6">

            <FeedbackItem
              label="Clear Answers"
              value={currentFeedback.score}
            />

            <FeedbackItem
              label="Good Structure"
              value={currentFeedback.structure}
            />

            <FeedbackItem
              label="Relevant Examples"
              value={currentFeedback.examples}
            />

            <FeedbackItem
              label="Keep Improving"
              value={currentFeedback.improvement}
            />
          </div>

          <div className="mt-8">
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-all duration-700"
                style={{
                  width: currentFeedback.progress,
                }}
              />
            </div>
          </div>
        </div>

        {/* CONFIDENCE */}
        <div className="absolute bottom-[18%] right-[42%] w-[300px] rounded-[36px] border border-white/10 bg-[#10182f]/75 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.18)] animate-[float_7s_ease-in-out_infinite]">

          <h4 className="text-white text-2xl font-semibold mb-8">
            Confidence Score
          </h4>

          <div className="flex justify-center">
            <div className="relative w-48 h-48 rounded-full border-[12px] border-blue-500 border-t-cyan-300 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">

              <div className="text-center">
                <p className="text-6xl font-bold text-white">
                  {scores[scoreIndex]}%
                </p>

                <p className="text-cyan-300 mt-2">
                  High Confidence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS */}
        <div className="absolute bottom-[12%] right-[5%] w-[420px] rounded-[36px] border border-white/10 bg-[#10182f]/75 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.18)] animate-[float_9s_ease-in-out_infinite]">

          <h4 className="text-white text-4xl font-semibold mb-7">
            Skills Detected
          </h4>

          <div className="flex flex-wrap gap-3">
            {skillSets[skillIndex].map((skill, i) => (
              <div
                key={i}
                className="
                  px-5
                  py-3
                  rounded-full
                  bg-white/10
                  border
                  border-white/10
                  text-white/85
                  text-sm
                  transition-all
                  duration-500
                "
              >
                {skill}
              </div>
            ))}

            <div className="px-5 py-3 rounded-full bg-blue-500/20 text-cyan-300 text-sm font-medium">
              +12 More
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 px-6 md:px-14 lg:px-24 pt-36 pb-24">

        <div className="max-w-7xl">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full border border-cyan-400/20 bg-[#0F172A]/70 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

            <span className="text-cyan-300 text-xs tracking-wide uppercase font-semibold">
              AI Powered Interview Platform
            </span>
          </div>

          {/* HERO TEXT */}
          <div className="max-w-2xl">

            <h1 className="text-6xl md:text-7xl lg:text-[110px] font-bold leading-[0.95] tracking-tight text-white">

              {headline}{' '}

              <span className="bg-gradient-to-r from-[#60A5FA] to-[#6366F1] bg-clip-text text-transparent">
                {headlineAccent}
              </span>
            </h1>

            <h2 className="mt-4 text-6xl md:text-7xl lg:text-[100px] font-bold leading-[0.95] text-white">
              {subheadline}
            </h2>

            <p className="mt-8 text-xl leading-relaxed text-[#CBD5E1] max-w-xl">
              {description}
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-4">

              <Button
                variant="primary"
                href={primaryCta.onClick ? undefined : primaryCta.href}
                onClick={primaryCta.onClick}
                className="
                  px-8
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#2563EB]
                  to-[#4F46E5]
                  hover:scale-[1.03]
                  transition-all
                  duration-300
                  shadow-[0_0_40px_rgba(59,130,246,0.45)]
                "
              >
                {primaryCta.label}
              </Button>

              <Button
                variant="outline"
                href={secondaryCta.onClick ? undefined : secondaryCta.href}
                onClick={secondaryCta.onClick}
                className="
                  px-8
                  py-4
                  rounded-2xl
                  border-white/20
                  bg-white/5
                  backdrop-blur-md
                  hover:bg-white/10
                "
              >
                <PlayIcon />
                {secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeedbackItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full bg-blue-400" />

      <span className="text-white/85 text-lg">
        {label}
      </span>
    </div>

    <span className="text-cyan-300 font-semibold text-lg">
      {value}
    </span>
  </div>
);

const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="shrink-0"
  >
    <circle
      cx="8"
      cy="8"
      r="7"
      stroke="white"
      strokeWidth="1.5"
    />

    <path
      d="M6.5 5.5L11 8L6.5 10.5V5.5Z"
      fill="white"
    />
  </svg>
);

export default HeroSection;