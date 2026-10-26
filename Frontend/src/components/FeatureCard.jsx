import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function FeatureCard({
  title,
  tag,
  description,
  note,
  bgColor,
  borderColor,
  badgeBg,
  badgeColor,
  illustration,
  actionText = 'Explore',
  onAction,
}) {
  return (
    <div
      className={`group relative rounded-[32px] ${bgColor} border ${borderColor} p-6 sm:p-8 flex flex-col justify-between soft-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden`}
    >
      {/* Decorative background subtle glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-white/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header & Tag */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full ${badgeBg} ${badgeColor} border border-white/60 shadow-sm`}
          >
            {tag}
          </span>
          <button
            onClick={onAction}
            aria-label={`${actionText} ${title}`}
            className="w-9 h-9 rounded-full bg-white/80 border border-white flex items-center justify-center text-[#403344] group-hover:bg-[#403344] group-hover:text-white transition-colors shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-[26px] font-bold text-[#403344] font-['Nunito',sans-serif] tracking-tight mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#403344]/80 leading-relaxed mb-6 font-normal">
          {description}
        </p>
      </div>

      {/* Visual Feature Illustration / Preview Card */}
      <div className="my-2 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/70 shadow-sm">
        {illustration}
      </div>

      {/* Bottom Reassurance / Note & Action Link */}
      <div className="pt-4 mt-2 border-t border-[#403344]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        {note && (
          <span className="text-[#817583] italic flex items-center gap-1 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#817583]" />
            {note}
          </span>
        )}
        <button
          onClick={onAction}
          className="font-bold text-[#403344] hover:underline underline-offset-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
        >
          {actionText} →
        </button>
      </div>
    </div>
  );
}
