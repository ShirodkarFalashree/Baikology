import React from 'react';
import { X, Clock, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

export default function GuideModal({ guide, onClose }) {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#403344]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[36px] border border-[#E9DFFF] soft-shadow-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
      >
        {/* Header */}
        <div className={`p-6 sm:p-8 ${guide.bgColor} border-b border-[#E9DFFF] relative`}>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#403344] flex items-center justify-center shadow-xs transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${guide.tagBg} ${guide.tagColor} border border-white`}
            >
              {guide.category}
            </span>
            <span className="text-xs text-[#817583] flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {guide.readTime}
            </span>
          </div>

          <h2
            id="guide-title"
            className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] pr-8"
          >
            {guide.title}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#403344] text-sm sm:text-base leading-relaxed">
          <p className="font-medium text-base sm:text-lg text-[#403344] bg-[#FFFAF5] p-5 rounded-3xl border border-[#E9DFFF]/70">
            {guide.fullContent.intro}
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#817583] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#756291]" />
              Gentle Takeaways
            </h4>
            <div className="space-y-2.5">
              {guide.fullContent.keyTakeaways.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#FFFAF5] p-3.5 rounded-2xl border border-[#E9DFFF]/50">
                  <CheckCircle2 className="w-4 h-4 text-[#529E5E] flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#403344]/90 font-normal">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#F9DDE5]/60 to-[#E9DFFF]/60 border border-[#F2C4D4] flex items-start gap-3.5">
            <Heart className="w-5 h-5 text-[#C95B7E] flex-shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-[#C95B7E] mb-1">
                A comforting reminder
              </span>
              <p className="text-xs sm:text-sm text-[#403344] leading-relaxed">
                {guide.fullContent.comfortNote}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#817583] italic border-t border-gray-100 pt-4">
            Notice: Sample educational preview. Baikology provides general educational information and is not a substitute for clinical medical evaluation.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[#FFFAF5] border-t border-[#E9DFFF] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#403344] text-white text-xs font-bold hover:bg-[#59475E] transition-colors"
          >
            Finished reading
          </button>
        </div>
      </div>
    </div>
  );
}
