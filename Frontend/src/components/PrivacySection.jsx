import React from 'react';
import { Lock, ShieldCheck, EyeOff, SlidersHorizontal, Heart, CheckCircle2 } from 'lucide-react';

export default function PrivacySection() {
  const commitments = [
    {
      icon: EyeOff,
      title: 'Only ask for what is needed',
      description:
        'We believe in gentle minimalism. We will never ask for intrusive tracking details, invasive questions, or data that does not directly serve your personal clarity.',
      badge: 'Intentional data',
      badgeBg: 'bg-[#F9DDE5]',
      badgeColor: 'text-[#A23F62]',
    },
    {
      icon: Lock,
      title: 'Keep personal health information private',
      description:
        'Your health experiences belong to you. We are building Baikology with strict privacy-first architecture principles: no data brokerage, no selling to advertisers, ever.',
      badge: 'Zero ad sales',
      badgeBg: 'bg-[#E9DFFF]',
      badgeColor: 'text-[#644D87]',
    },
    {
      icon: SlidersHorizontal,
      title: 'Give users control over their information',
      description:
        'Transparency and autonomy come first. You should always be able to view, export, adjust, or completely erase your notes and check-ins at any moment without obstacles.',
      badge: 'Full autonomy',
      badgeBg: 'bg-[#DDF3DE]',
      badgeColor: 'text-[#367942]',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 relative bg-[#FFFAF5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9DFFF]/70 text-xs font-bold text-[#403344] uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-[#756291]" />
            Trust & Ethics
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight mb-4">
            Your health is personal. We treat it that way.
          </h2>
          <p className="text-base sm:text-lg text-[#817583] leading-relaxed">
            Your experiences belong to you. Baikology is being designed with privacy, transparency, and control at its heart.
          </p>
        </div>

        {/* 3 Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E9DFFF]/80 soft-shadow hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF] flex items-center justify-center text-[#756291] shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${item.badgeBg} ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#403344] font-['Nunito',sans-serif] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#817583] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E9DFFF]/50 flex items-center gap-2 text-xs font-semibold text-[#403344]">
                  <CheckCircle2 className="w-4 h-4 text-[#86C98D]" />
                  <span>Foundational product principle</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtle lock illustration & commitment badge */}
        <div className="bg-gradient-to-r from-[#F9DDE5]/40 via-[#E9DFFF]/40 to-[#DDF3DE]/40 rounded-3xl p-6 sm:p-8 border border-white soft-shadow max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#E9DFFF] flex items-center justify-center flex-shrink-0 soft-shadow">
            <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#756291]" fill="none">
              <rect x="8" y="16" width="24" height="20" rx="5" fill="#FFF8E0" stroke="#756291" strokeWidth="2.5" />
              <path d="M13 16 V11 C13 7 27 7 27 11 V16" stroke="#756291" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M20 23 C18.5 21 16 22 16 24 C16 26 20 28.5 20 28.5 C20 28.5 24 26 24 24 C24 22 21.5 21 20 23 Z" fill="#EFA3B8" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#403344] font-['Nunito',sans-serif]">
              Our Honest Product Guarantee
            </h4>
            <p className="text-xs sm:text-sm text-[#817583] leading-relaxed">
              We present these as sincere product principles and design commitments. We do not claim third-party certifications or unreleased backend architectures prematurely — our trust is built on quiet transparency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
