import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Heart } from 'lucide-react';

export default function AuthLayout({
  children,
  leftEyebrow,
  leftHeadline,
  leftSupportingText,
  leftIllustration,
  leftTagline,
  reassuranceText = 'Your personal health journey deserves privacy.',
}) {
  return (
    <div className="min-h-screen bg-[#FFFAF5] text-[#403344] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#F9DDE5] selection:text-[#403344] relative flex flex-col justify-between overflow-x-hidden">
      {/* Decorative Pastel Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-10 left-10 w-80 h-80 rounded-full bg-[#F9DDE5]/40 blur-3xl" />
        <div className="absolute top-16 right-10 w-96 h-96 rounded-full bg-[#E9DFFF]/40 blur-3xl" />
        <div className="absolute top-48 left-1/3 w-64 h-64 rounded-full bg-[#FFF0B8]/30 blur-3xl" />
      </div>

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#817583] rounded-full"
          aria-label="Return to Baikology homepage"
        >
          {/* Logo Flower Emblem */}
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F9DDE5] via-[#E9DFFF] to-[#FFF0B8] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
            <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#403344]" fill="none">
              <circle cx="16" cy="10" r="5" fill="#F9DDE5" />
              <circle cx="22" cy="16" r="5" fill="#E9DFFF" />
              <circle cx="16" cy="22" r="5" fill="#FFF0B8" />
              <circle cx="10" cy="16" r="5" fill="#DDF3DE" />
              <circle cx="16" cy="16" r="3" fill="#403344" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#403344] font-['Nunito',sans-serif]">
              Baikology
            </span>
            <span className="text-[10px] tracking-wider text-[#817583] font-medium hidden sm:inline -mt-0.5">
              The Science of being 'her'
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#817583] hover:text-[#403344] px-3.5 py-1.5 rounded-full hover:bg-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Main Two-Part Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Reassuring Copy and Illustration */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {leftEyebrow && (
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/90 border border-[#F9DDE5] text-xs font-bold tracking-wider text-[#403344] uppercase shadow-xs">
                <span>{leftEyebrow}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#403344] leading-[1.2] font-['Nunito',sans-serif] tracking-tight">
              {leftHeadline}
            </h1>

            <p className="text-base sm:text-lg text-[#817583] leading-relaxed max-w-md font-normal">
              {leftSupportingText}
            </p>

            {/* Illustration */}
            <div className="w-full pt-2">
              {leftIllustration}
            </div>

            {leftTagline && (
              <p className="text-xs font-semibold text-[#756291] italic pt-1">
                “{leftTagline}”
              </p>
            )}
          </div>

          {/* Right Column: Authentication Card Form */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-9 border border-[#E9DFFF]/80 soft-shadow-lg relative">
              {children}

              {/* Small Reassurance under card content */}
              <div className="mt-6 pt-5 border-t border-[#E9DFFF]/60 flex items-center justify-center gap-2 text-xs font-medium text-[#817583] text-center">
                <ShieldCheck className="w-4 h-4 text-[#756291] flex-shrink-0" />
                <span>{reassuranceText}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reassuring Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-[#817583] border-t border-[#F9DDE5]/40 mt-8">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>Baikology is an educational companion.</span>
          <span>•</span>
          <span>Private by design. No shame. No judgment.</span>
        </p>
      </footer>
    </div>
  );
}
