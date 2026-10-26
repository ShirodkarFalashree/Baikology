import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

export default function PasswordStrength({ password = '' }) {
  if (!password) return null;

  const lengthValid = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (lengthValid) score += 1;
  if (hasLetter && hasNumber) score += 1;
  if (hasSpecial || password.length >= 12) score += 1;

  const levels = [
    { label: 'A gentle start', barColor: 'bg-[#F9DDE5]', textColor: 'text-[#C95B7E]', width: '33%' },
    { label: 'Getting cozier', barColor: 'bg-[#FFF0B8]', textColor: 'text-[#876F14]', width: '66%' },
    { label: 'Lovely & secure', barColor: 'bg-[#DDF3DE]', textColor: 'text-[#2C6336]', width: '100%' },
  ];

  const currentLevel = levels[Math.max(0, Math.min(score - 1, 2))] || levels[0];

  return (
    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-[#817583] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#756291]" />
          Password strength:
        </span>
        <span className={`font-bold ${currentLevel.textColor}`}>
          {currentLevel.label}
        </span>
      </div>

      {/* Progress track */}
      <div className="h-2 w-full bg-[#E9DFFF]/40 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${currentLevel.barColor}`}
          style={{ width: currentLevel.width }}
        />
      </div>

      {/* Gentle requirement checklist */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-[#817583]">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
              lengthValid
                ? 'bg-[#DDF3DE] text-[#2C6336]'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {lengthValid ? <Check className="w-2.5 h-2.5" /> : '•'}
          </span>
          <span>At least 8 characters</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
              hasLetter && hasNumber
                ? 'bg-[#DDF3DE] text-[#2C6336]'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {hasLetter && hasNumber ? <Check className="w-2.5 h-2.5" /> : '•'}
          </span>
          <span>Letters & numbers</span>
        </div>
      </div>
    </div>
  );
}
