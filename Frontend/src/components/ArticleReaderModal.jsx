import React, { useEffect } from 'react';
import { X, Clock, Tag, Heart, Bookmark, Share2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ArticleReaderModal({ article, onClose, onAskAboutArticle }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2B2330]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-[32px] shadow-2xl border border-[#E9DFFF] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4EEF8] bg-[#FFFAF5]">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${article.badgeColor || 'bg-[#E9DFFF] text-[#554070]'}`}>
              {article.categoryLabel}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#817583] font-medium">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#817583] hover:text-[#403344] hover:bg-[#F3EBF9] transition-colors"
            title="Close article"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6 space-y-6 text-[#403344]">
          {/* Title & Summary */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] leading-tight">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base text-[#6B5E70] leading-relaxed italic bg-[#FAF7FC] p-4 rounded-2xl border border-[#EFE7F6]">
              "{article.summary}"
            </p>
          </div>

          {/* Key Takeaways Card */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="bg-[#FAF5FF] border border-[#E9DFFF] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#756291]">
                <CheckCircle2 className="w-4 h-4 text-[#756291]" />
                <span>Quick Takeaways & TL;DR</span>
              </div>
              <ul className="space-y-2">
                {article.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#403344] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#756291] mt-2 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-6 pt-2">
            {article.sections && article.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-[#403344] font-['Nunito',sans-serif]">
                  {sec.heading}
                </h2>
                <div className="text-xs sm:text-sm text-[#5C5061] leading-relaxed whitespace-pre-line space-y-2 font-normal">
                  {sec.content.trim()}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-4 border-t border-[#F4EEF8] flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-[#817583] flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5" />
                Topics:
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#F3EBF9] text-[#554070] text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Ask About This in Chatbot Card */}
          <div className="bg-[#FFF5F8] border border-[#FAD2E1] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌸</span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#6D2842]">
                  Still have questions about this topic?
                </h4>
                <p className="text-[11px] text-[#8C475D]">
                  Ask our confidential health chatbot for personalized advice.
                </p>
              </div>
            </div>
            {onAskAboutArticle && (
              <button
                onClick={() => {
                  onClose();
                  onAskAboutArticle(`Tell me more about: ${article.title}`);
                }}
                className="px-4 py-2 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white text-xs font-bold transition-all shrink-0 text-center"
              >
                Ask Baikology Care &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#F4EEF8] bg-[#FFFAF5] flex items-center justify-between text-xs text-[#817583]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#817583]">
            <AlertCircle className="w-3.5 h-3.5 text-[#A595A8]" />
            <span>Medically verified educational content. Always consult a healthcare provider.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white border border-[#E9DFFF] text-[#403344] font-semibold text-xs hover:bg-[#F3EBF9] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

