import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import Footer from '../components/layout/Footer';

export interface LandingPageProps {
  onLoginClick?: () => void;
  onOrgLoginClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onOrgLoginClick,
}) => {
  return (
    <main
      id="landing-page"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050816]
        text-white
        font-sans
        antialiased
      "
    >
      {/* Global Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Main Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_30%)]" />

        {/* Top Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-400/10 blur-[160px]" />

        {/* Bottom Glow */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[160px]" />

        {/* Middle Glow */}
        <div className="absolute top-[35%] left-[40%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[140px]" />

        {/* Grid */}
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

        {/* Noise Texture */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            mix-blend-soft-light
            bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)]
            bg-[size:22px_22px]
          "
        />

        {/* Gradient Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050816]/20 to-[#050816]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[18%] left-[22%] w-2 h-2 rounded-full bg-blue-400 blur-sm animate-pulse" />

        <div className="absolute top-[32%] right-[20%] w-3 h-3 rounded-full bg-cyan-300 blur-sm animate-pulse" />

        <div className="absolute bottom-[25%] left-[30%] w-2 h-2 rounded-full bg-indigo-400 blur-sm animate-pulse" />

        <div className="absolute top-[55%] right-[35%] w-2 h-2 rounded-full bg-blue-500 blur-sm animate-pulse" />

        <div className="absolute bottom-[18%] right-[18%] w-3 h-3 rounded-full bg-cyan-400 blur-sm animate-pulse" />
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar
          ctaLabel="Sign In"
          onCtaClick={onLoginClick}
          orgCtaLabel="For Organisations"
          onOrgCtaClick={onOrgLoginClick}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10">
        <HeroSection
          headline="Autonomous"
          headlineAccent="AI Interviews."
          subheadline="Smarter Careers."
          description="InterXAI conducts intelligent interviews, evaluates candidate skills, and delivers real-time AI-powered feedback to help users grow faster and perform better."
          primaryCta={{
            label: 'Start AI Interview',
            onClick: onLoginClick,
          }}
          secondaryCta={{
            label: 'Watch Demo',
            href: '#demo',
          }}
          backgroundImage="/new-bg-image.jpg"
        />
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="
          relative
          z-10
          border-t
          border-white/5
          bg-gradient-to-b
          from-transparent
          via-[#050816]/50
          to-[#050816]
          backdrop-blur-sm
        "
      >
        {/* Section Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[120px]" />

          <div className="absolute bottom-[0%] right-[5%] w-[350px] h-[350px] rounded-full bg-cyan-400/10 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <FeaturesSection />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="
          relative
          z-10
          border-t
          border-white/5
          bg-[#050816]/90
          backdrop-blur-2xl
        "
      >
        <Footer />
      </footer>
    </main>
  );
};

export default LandingPage;