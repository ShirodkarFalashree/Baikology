import React from 'react';
import { Heart, Sparkles, Shield, ArrowUp } from 'lucide-react';

export default function Footer({ onOpenOnboarding, onOpenLogin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#F9DDE5]/80 pt-16 pb-12 text-[#403344]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#E9DFFF]/70">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F9DDE5] via-[#E9DFFF] to-[#FFF0B8] flex items-center justify-center shadow-xs">
                <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#403344]" fill="none">
                  <circle cx="16" cy="10" r="5" fill="#F9DDE5" />
                  <circle cx="22" cy="16" r="5" fill="#E9DFFF" />
                  <circle cx="16" cy="22" r="5" fill="#FFF0B8" />
                  <circle cx="10" cy="16" r="5" fill="#DDF3DE" />
                  <circle cx="16" cy="16" r="3" fill="#403344" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#403344] font-['Nunito',sans-serif]">
                Baikology
              </span>
            </div>

            <p className="text-sm font-medium text-[#756291]">
              “The Science of being 'her'.”
            </p>

            <p className="text-xs sm:text-sm text-[#817583] leading-relaxed max-w-sm">
              A comforting digital companion — a safe space where women can understand their bodies, track their cycles, and find clarity without embarrassment or judgment.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={onOpenOnboarding}
                className="px-4 py-2 rounded-full bg-[#FFFAF5] hover:bg-[#F9DDE5] border border-[#E9DFFF] text-xs font-bold text-[#403344] transition-colors"
              >
                Join early access
              </button>
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#817583] hover:text-[#403344] transition-colors"
              >
                Member login
              </button>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#403344]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#817583]">
              <li>
                <a href="#cycle" className="hover:text-[#403344] transition-colors">
                  Cycle Rhythm
                </a>
              </li>
              <li>
                <a href="#mood" className="hover:text-[#403344] transition-colors">
                  Mood Check-in
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#403344] transition-colors">
                  Gentle Assistant
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#403344] transition-colors">
                  Journal Reflections
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Health Education */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#403344]">
              Health Education
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#817583]">
              <li>
                <a href="#learn" className="hover:text-[#403344] transition-colors">
                  Cycle Science
                </a>
              </li>
              <li>
                <a href="#learn" className="hover:text-[#403344] transition-colors">
                  PCOS Awareness
                </a>
              </li>
              <li>
                <a href="#learn" className="hover:text-[#403344] transition-colors">
                  Hormones & Mind
                </a>
              </li>
              <li>
                <a href="#learn" className="hover:text-[#403344] transition-colors">
                  Body Basics
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & About */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#403344]">
              About & Trust
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#817583]">
              <li>
                <a href="#about" className="hover:text-[#403344] transition-colors">
                  Privacy Principles
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#403344] transition-colors">
                  Our Philosophy
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#403344] transition-colors">
                  Medical Advisory
                </a>
              </li>
              <li>
                <a href="mailto:hello@baikology.com" className="hover:text-[#403344] transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="my-8 p-4 sm:p-5 rounded-2xl bg-[#FFFAF5] border border-[#F9DDE5] text-center">
          <p className="text-xs text-[#817583] leading-relaxed max-w-3xl mx-auto">
            <span className="font-bold text-[#403344]">Medical Disclaimer:</span> Baikology provides general educational information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
          </p>
        </div>

        {/* Bottom bar with copyright and back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#817583]">
          <p>© 2026 Baikology. All rights reserved. Built with gentle care.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#403344] hover:text-[#756291] transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
