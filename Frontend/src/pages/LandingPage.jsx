import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TrustStrip from '../components/TrustStrip';
import FeaturesSection from '../components/FeaturesSection';
import MoodCheckIn from '../components/MoodCheckIn';
import CycleCalendarPreview from '../components/CycleCalendarPreview';
import EducationSection from '../components/EducationSection';
import PrivacySection from '../components/PrivacySection';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import OnboardingModal from '../components/OnboardingModal';
import GuideModal from '../components/GuideModal';

export default function LandingPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);

  const handleOpenOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const handleExploreClick = () => {
    const el = document.querySelector('#features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] text-[#403344] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#F9DDE5] selection:text-[#403344] relative flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        onOpenOnboarding={handleOpenOnboarding}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onOpenOnboarding={handleOpenOnboarding}
          onExploreClick={handleExploreClick}
        />

        {/* Trust & Comfort Strip */}
        <TrustStrip />

        {/* Feature Section: A Little Care, A Little Clarity */}
        <FeaturesSection />

        {/* Interactive Mood Check-In Demonstration */}
        <MoodCheckIn />

        {/* Cycle Calendar Preview */}
        <CycleCalendarPreview
          onOpenCycleTracking={handleOpenOnboarding}
        />

        {/* Educational Content Section: Big Questions, Gentle Answers */}
        <EducationSection
          onSelectGuide={(guide) => setActiveGuide(guide)}
        />

        {/* Privacy & Trust Section: Your Health is Personal */}
        <PrivacySection />

        {/* Final CTA Section */}
        <FinalCTA
          onOpenOnboarding={handleOpenOnboarding}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenOnboarding={handleOpenOnboarding}
      />

      {/* Interactive Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <GuideModal
        guide={activeGuide}
        onClose={() => setActiveGuide(null)}
      />
    </div>
  );
}
