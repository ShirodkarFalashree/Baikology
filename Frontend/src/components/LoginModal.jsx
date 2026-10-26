import React, { useState } from 'react';
import { X, Lock, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSent(true);
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#403344]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-[36px] border border-[#E9DFFF] soft-shadow-lg p-6 sm:p-8 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={handleReset}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#FFFAF5] hover:bg-[#F9DDE5] text-[#403344] flex items-center justify-center shadow-xs transition-colors"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-3xl bg-[#DDF3DE] text-[#2C6336] mx-auto flex items-center justify-center text-2xl shadow-xs">
              💌
            </div>
            <h3 className="text-2xl font-bold text-[#403344] font-['Nunito',sans-serif]">
              Magic link sent!
            </h3>
            <p className="text-xs sm:text-sm text-[#817583] leading-relaxed max-w-xs mx-auto">
              We sent a gentle, passwordless sign-in link to <span className="font-bold text-[#403344]">{email}</span>. Click it to enter your private space.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-[#403344] text-white text-xs font-bold hover:bg-[#58445C] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E9DFFF] text-[#756291] mx-auto flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                Welcome back
              </h3>
              <p className="text-xs sm:text-sm text-[#817583] mt-1">
                A password-free, private login for your peace of mind.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold text-[#403344] mb-1.5">
                  Your email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF] focus:border-[#756291] focus:ring-2 focus:ring-[#E9DFFF] outline-none text-[#403344]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Send sign-in link</span>
                <ArrowRight className="w-4 h-4 text-[#756291]" />
              </button>
            </form>

            <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]/70 text-center">
              <p className="text-[11px] text-[#817583]">
                Demo mode: Entering your email will demonstrate the gentle sign-in flow. No passwords required.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
