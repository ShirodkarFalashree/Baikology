import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Calendar, Smile } from 'lucide-react';
import MascotIllustration from './MascotIllustration';

export default function HeroSection({ onOpenOnboarding, onExploreClick }) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* Decorative Pastel Background Blobs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-10 left-10 w-72 h-72 rounded-full bg-[#F9DDE5]/45 blur-3xl" />
        <div className="absolute top-16 right-10 w-80 h-80 rounded-full bg-[#E9DFFF]/40 blur-3xl" />
        <div className="absolute top-40 left-1/3 w-64 h-64 rounded-full bg-[#FFF0B8]/35 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#F9DDE5] text-xs font-bold tracking-wider text-[#403344] uppercase shadow-sm mb-6 hover:scale-105 transition-transform cursor-default">
              <span>YOUR BODY. YOUR WAY.</span>
              <span className="text-sm">🌷</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#403344] leading-[1.18] tracking-tight font-['Nunito',sans-serif] mb-6">
              Getting to know your body should feel{' '}
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="relative z-10 px-3.5 py-1 rounded-2xl bg-[#E9DFFF] text-[#403344] shadow-sm">
                  a little easier.
                </span>
                {/* Subtle organic flower sparkle dot */}
                <span className="absolute -top-3 -right-3 text-lg animate-bounce select-none">✨</span>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#817583] leading-relaxed max-w-xl mb-8 font-normal">
              From period tracking to mood check-ins and answers to the questions you’ve always had — find a little more clarity, one day at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6">
              <button
                onClick={onOpenOnboarding}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_8px_25px_rgba(233,223,255,0.7)]"
              >
                <span>Let’s get to know you</span>
                <ArrowRight className="w-4 h-4 text-[#756291]" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-full text-base font-bold text-[#403344] bg-white border border-[#E9DFFF] hover:bg-[#FFFAF5] hover:border-[#817583]/30 shadow-sm transition-all duration-200"
              >
                Explore Baikology
              </button>
            </div>

            {/* Small Reassurance */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#817583]">
              <ShieldCheck className="w-4 h-4 text-[#756291]" />
              <span>Private by design. No shame. No judgment.</span>
            </div>
          </div>

          {/* Right Column: Hero Visual with Layered Floating Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-4 lg:mt-0">
            {/* Central Mascot Illustration */}
            <div className="w-full max-w-md relative">
              <MascotIllustration />

              {/* Floating Card 1: Mood Check-in Card (Top Right) */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-[#E9DFFF] soft-shadow transform rotate-3 hover:rotate-0 transition-transform duration-300 w-48 sm:w-56 animate-float z-20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#817583] flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-[#F6A5B8]" />
                    Today's feeling
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#A8E6CF] animate-ping" />
                </div>
                <div className="flex items-center justify-between bg-[#FFFAF5] px-2.5 py-1.5 rounded-2xl border border-[#F9DDE5]/60 mb-2">
                  <span className="text-base">😌</span>
                  <span className="text-xs font-semibold text-[#403344]">Calm & settled</span>
                  <span className="text-[10px] text-[#817583]">3:45 PM</span>
                </div>
                <div className="flex justify-between px-1">
                  {['😊', '😌', '😐', '🥺', '😔'].map((emoji, idx) => (
                    <span
                      key={idx}
                      className={`text-sm p-1 rounded-full cursor-default ${
                        idx === 1 ? 'bg-[#E9DFFF] ring-2 ring-[#756291]/20 scale-110' : 'opacity-70'
                      }`}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating Card 2: Cycle Calendar Snapshot (Bottom Left) */}
              <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-[#F9DDE5] soft-shadow transform -rotate-3 hover:rotate-0 transition-transform duration-300 w-52 sm:w-60 animate-float-alt z-20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#756291]" />
                    <span className="text-xs font-bold text-[#403344]">Day 14 • Ovulation</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0B8] font-bold text-[#6D5A12]">
                    Sample
                  </span>
                </div>
                {/* Visual cycle dots */}
                <div className="flex items-center justify-between gap-1 mb-2 bg-[#FFFAF5] p-2 rounded-2xl border border-[#E9DFFF]/40">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-[#817583]">M</span>
                    <span className="w-3 h-3 rounded-full bg-[#F9DDE5]" title="Period" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-[#817583]">T</span>
                    <span className="w-3 h-3 rounded-full bg-[#DDECFB]" title="Follicular" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-[#403344]">W</span>
                    <span className="w-4 h-4 rounded-full bg-[#FFF0B8] border-2 border-[#E5C158] flex items-center justify-center text-[8px]" title="Peak">
                      ★
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-[#817583]">T</span>
                    <span className="w-3 h-3 rounded-full bg-[#E9DFFF]" title="Luteal" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-[#817583]">F</span>
                    <span className="w-3 h-3 rounded-full bg-[#E9DFFF]" />
                  </div>
                </div>
                <p className="text-[11px] text-[#817583] leading-tight flex items-center gap-1">
                  <Heart className="w-3 h-3 text-[#F9A8BD] flex-shrink-0" />
                  Gentle energy peak today.
                </p>
              </div>

              {/* Floating Card 3: Educational pill badge (Bottom Right) */}
              <div className="hidden sm:flex absolute bottom-8 -right-8 bg-gradient-to-r from-[#DDF3DE] to-[#FFF0B8] px-3.5 py-2 rounded-2xl border border-white/80 soft-shadow items-center gap-2 transform rotate-2 hover:rotate-0 transition-transform z-10">
                <span className="text-sm">🌱</span>
                <span className="text-xs font-bold text-[#403344]">Your body, explained gently.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
