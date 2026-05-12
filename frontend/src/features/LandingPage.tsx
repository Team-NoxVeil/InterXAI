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
 * LandingPage
 * Top-level page component that composes all landing page sections.
 */
const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onOrgLoginClick }) => {
  return (
    <div id="landing-page" className="min-h-screen bg-[#050e0a] font-sans antialiased">
      {/* Navigation */}
      <Navbar
        ctaLabel="Sign In"
        onCtaClick={onLoginClick}
        orgCtaLabel="For Organisations"
        onOrgCtaClick={onOrgLoginClick}
      />

      {/* Hero */}
      <HeroSection
        headline="Autonomous"
        headlineAccent="AI Interviews."
        subheadline="Smarter Careers."
        description="InterXAI runs interviews, evaluates candidates, and coaches careers—fully autonomous."
        primaryCta={{ label: 'Start AI Interview', onClick: onLoginClick }}
        secondaryCta={{ label: 'Watch Demo', href: '#demo' }}
        backgroundImage="/landingpagebackground.png"
      />

      {/* Features / How It Works */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

