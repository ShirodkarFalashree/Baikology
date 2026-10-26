import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Heart } from 'lucide-react';

export default function FinalCTA({ onOpenOnboarding }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[40px] bg-gradient-to-br from-[#E9DFFF] via-[#F9DDE5] to-[#FFDCCB] p-8 sm:p-14 lg:p-18 border border-white soft-shadow-colored overflow-hidden text-center">
          {/* Decorative floating flowers and sparkles */}
          <div className="absolute top-6 left-8 text-2xl animate-bounce select-none pointer-events-none opacity-80" style={{ animationDuration: '3s' }}>
            🌸
          </div>
          <div className="absolute bottom-8 right-10 text-2xl animate-pulse select-none pointer-events-none opacity-80">
            ✨
          </div>
          <div className="absolute top-12 right-16 text-xl select-none pointer-events-none opacity-70">
            🌷
          </div>
          <div className="absolute bottom-10 left-12 text-xl select-none pointer-events-none opacity-70">
            🌱
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            {/* Small pill badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xs text-xs font-bold text-[#403344] uppercase tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#756291]" />
              Gentle Beginnings
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight leading-[1.2] mb-5">
              There's no perfect way to feel.{' '}
              <span className="block sm:inline underline decoration-[#F6A5B8] decoration-wavy underline-offset-8">
                There's just your way.
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#403344]/80 leading-relaxed max-w-lg mx-auto mb-8 font-normal">
              Start with one little check-in. The rest can come gently.
            </p>

            {/* Interactive Early Access Waitlist / Action */}
            {isSubmitted ? (
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-white soft-shadow max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-[#DDF3DE] text-[#2C6336] mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#403344] font-['Nunito',sans-serif]">
                  Welcome to our gentle circle 🤍
                </h4>
                <p className="text-xs text-[#817583] mt-1.5">
                  We'll whisper in your inbox when our early preview releases. No spam, ever.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-[#756291] hover:underline"
                >
                  Enter another email
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={onOpenOnboarding}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-[#403344] bg-white hover:bg-[#FFFAF5] shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Meet Baikology</span>
                    <ArrowRight className="w-4 h-4 text-[#756291]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for gentle early access..."
                    className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-full bg-white/90 border border-white focus:outline-none focus:ring-2 focus:ring-[#756291] text-[#403344] placeholder:text-[#817583]/70"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-full bg-[#403344] hover:bg-[#58445C] text-white text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
                  >
                    Join Waitlist
                  </button>
                </form>

                {/* Secondary text */}
                <p className="text-xs text-[#403344]/75 font-medium flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#A23F62]" />
                  No pressure. Just a place to begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
