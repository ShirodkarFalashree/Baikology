import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Check, Heart, ShieldCheck } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedPace, setSelectedPace] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const goals = [
    {
      id: 'cycle',
      emoji: '🌸',
      title: 'Tracking my cycle rhythm',
      desc: 'Understand period dates, fertile windows, and body energy.',
    },
    {
      id: 'mood',
      emoji: '😌',
      title: 'Noticing mood & emotional shifts',
      desc: 'Gentle check-ins without pressure or scores.',
    },
    {
      id: 'education',
      emoji: '🌿',
      title: 'Understanding PCOS & hormones',
      desc: 'Clear, panic-free educational guides in plain English.',
    },
    {
      id: 'questions',
      emoji: '💬',
      title: 'Safe answers without awkwardness',
      desc: 'Ask private reproductive health questions freely.',
    },
  ];

  const paces = [
    {
      id: 'quick',
      emoji: '⚡',
      title: '10-Second Quick Tap',
      desc: 'Just an emoji to mark how I feel today.',
    },
    {
      id: 'reflective',
      emoji: '📖',
      title: 'Gentle Reflection',
      desc: 'A short sentence or thought when I have time.',
    },
    {
      id: 'occasional',
      emoji: '🌱',
      title: 'Only when I have questions',
      desc: 'A peaceful resource when I need clarity.',
    },
  ];

  const handleReset = () => {
    setStep(1);
    setSelectedGoal('');
    setSelectedPace('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#403344]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-[36px] border border-[#E9DFFF] soft-shadow-lg p-6 sm:p-8 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#FFFAF5] hover:bg-[#F9DDE5] text-[#403344] flex items-center justify-center shadow-xs transition-colors"
          aria-label="Close onboarding modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Goals */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#756291] bg-[#E9DFFF] px-3 py-1 rounded-full">
                Step 1 of 3
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-3 mb-2">
                What brings you to Baikology?
              </h3>
              <p className="text-xs sm:text-sm text-[#817583]">
                Pick the primary area you'd like a little more clarity with right now.
              </p>
            </div>

            <div className="space-y-2.5">
              {goals.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedGoal(item.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                    selectedGoal === item.id
                      ? 'bg-[#E9DFFF]/40 border-[#756291] ring-2 ring-[#E9DFFF]'
                      : 'bg-[#FFFAF5] border-[#E9DFFF]/60 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#403344]">{item.title}</h4>
                    <p className="text-xs text-[#817583] mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                disabled={!selectedGoal}
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-full text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-[#756291]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Pace */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#756291] bg-[#E9DFFF] px-3 py-1 rounded-full">
                Step 2 of 3
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-3 mb-2">
                How would you like to check in?
              </h3>
              <p className="text-xs sm:text-sm text-[#817583]">
                There are no obligations or scores. You set the tempo.
              </p>
            </div>

            <div className="space-y-2.5">
              {paces.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPace(item.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                    selectedPace === item.id
                      ? 'bg-[#DDF3DE]/50 border-[#448350] ring-2 ring-[#DDF3DE]'
                      : 'bg-[#FFFAF5] border-[#E9DFFF]/60 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#403344]">{item.title}</h4>
                    <p className="text-xs text-[#817583] mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-full text-xs font-semibold text-[#817583] hover:text-[#403344]"
              >
                Back
              </button>
              <button
                disabled={!selectedPace}
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-full text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-[#756291]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Gentle Early Access Registration */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-3xl bg-[#DDF3DE] text-[#2C6336] mx-auto flex items-center justify-center text-2xl mb-3 shadow-xs">
                🌸
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#756291] bg-[#E9DFFF] px-3 py-1 rounded-full">
                Step 3 of 3
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-3 mb-2">
                You're ready for your gentle flow
              </h3>
              <p className="text-xs sm:text-sm text-[#817583]">
                Enter your email to receive early access invitation and gentle updates.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(4);
              }}
              className="space-y-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-4 py-3 text-sm rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF] focus:border-[#756291] focus:ring-2 focus:ring-[#E9DFFF] outline-none text-[#403344]"
              />

              <div className="flex items-center gap-2 text-[11px] text-[#817583]">
                <ShieldCheck className="w-4 h-4 text-[#756291] flex-shrink-0" />
                <span>We respect your inbox. No marketing noise, ever.</span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-full text-xs font-semibold text-[#817583] hover:text-[#403344]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-full text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#756291]" />
                  <span>Join Early Circle</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Success confirmation */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#DDF3DE] text-[#2C6336] mx-auto flex items-center justify-center text-3xl shadow-sm">
              ✨
            </div>
            <h3 className="text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
              Welcome, friend!
            </h3>
            <p className="text-sm text-[#817583] max-w-sm mx-auto leading-relaxed">
              We've saved your gentle preferences ({selectedGoal} • {selectedPace}). You'll be among the first to experience Baikology.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-full bg-[#403344] text-white text-xs font-bold hover:bg-[#58445C] transition-colors"
              >
                Back to landing page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
