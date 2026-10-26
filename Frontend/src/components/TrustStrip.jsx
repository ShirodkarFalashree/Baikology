import React from 'react';
import { Flower2, Heart, HelpCircle, Sparkles } from 'lucide-react';

export default function TrustStrip() {
  const trustItems = [
    {
      icon: Flower2,
      iconBg: 'bg-[#F9DDE5]',
      iconColor: 'text-[#C95B7E]',
      text: "Your body isn't a mystery you have to solve alone.",
    },
    {
      icon: Heart,
      iconBg: 'bg-[#E9DFFF]',
      iconColor: 'text-[#756291]',
      text: 'Your feelings deserve space, too.',
    },
    {
      icon: HelpCircle,
      iconBg: 'bg-[#DDF3DE]',
      iconColor: 'text-[#448350]',
      text: 'Questions are always welcome here.',
    },
  ];

  return (
    <section className="py-6 sm:py-8 bg-white/60 border-y border-[#F9DDE5]/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-3xl bg-[#FFFAF5] border border-[#E9DFFF]/60 shadow-[0_4px_15px_rgba(64,51,68,0.03)] hover:scale-[1.01] transition-transform"
              >
                <div
                  className={`w-10 h-10 rounded-2xl ${item.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <p className="text-sm font-semibold text-[#403344] leading-snug">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
