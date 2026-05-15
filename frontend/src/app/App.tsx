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

/**
 * App
 * Premium AI SaaS landing page with modern dark theme.
 */
const App: React.FC<LandingPageProps> = ({
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
        bg-[#0B1020]
        text-[#F9FAFB]
        font-sans
        antialiased
      "
    >
      {/* Global Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Top Cyan Glow */}
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[140px]" />

        {/* Bottom Blue Glow */}
        <div className="absolute bottom-[-20%] left-[-10%] h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[140px]" />

        {/* Grid Pattern */}
        <div
          className="
            absolute inset-0 opacity-[0.03]
            bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),
            linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
            bg-[size:70px_70px]
          "
        />

        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1020]/30 to-[#0B1020]" />
      </div>

      {/* Navigation */}
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
          backgroundImage="/landingpagebackground.png"
        />
      </section>

      {/* Features Section */}
      <section
        className="
          relative
          z-10
          border-t
          border-white/5
          bg-gradient-to-b
          from-transparent
          to-[#111827]/40
          backdrop-blur-sm
        "
      >
        <FeaturesSection />
      </section>

      {/* Footer */}
      <footer
        className="
          relative
          z-10
          border-t
          border-white/5
          bg-[#0B1020]/80
          backdrop-blur-md
        "
      >
        <Footer />
      </footer>
    </main>
  );
};

export default App;
