import React from 'react';
import { Heart, Sparkles, Smile, BookOpen, Calendar } from 'lucide-react';

export default function AuthIllustration({ mode = 'login' }) {
  if (mode === 'register') {
    return (
      <div className="relative w-full max-w-md mx-auto flex items-center justify-center select-none">
        {/* Soft pastel background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#DDF3DE]/60 via-[#E9DFFF]/50 to-[#FFF0B8]/40 rounded-full blur-3xl transform scale-90 -z-10" />

        <svg
          viewBox="0 0 420 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-sm"
          role="img"
          aria-label="Illustration for Baikology registration"
        >
          <defs>
            <linearGradient id="regGrad" x1="120" y1="120" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF2F6" />
              <stop offset="0.6" stopColor="#F9DDE5" />
              <stop offset="1" stopColor="#E9DFFF" />
            </linearGradient>

            <linearGradient id="stemGrad" x1="210" y1="200" x2="210" y2="340" gradientUnits="userSpaceOnUse">
              <stop stopColor="#BCE3C1" />
              <stop offset="1" stopColor="#7EBA85" />
            </linearGradient>
          </defs>

          {/* Dotted orbital aura */}
          <path
            d="M80 180 C80 90 340 90 340 180 C340 270 80 270 80 180"
            stroke="#E9DFFF"
            strokeWidth="2"
            strokeDasharray="5 7"
            fill="none"
          />

          {/* Floating Stars & Clouds */}
          <g className="animate-pulse" style={{ animationDuration: '4s' }}>
            <path d="M100 70 Q100 80 110 80 Q100 80 100 90 Q100 80 90 80 Q100 80 100 70Z" fill="#F8C779" />
            <path d="M330 90 Q330 98 338 98 Q330 98 330 106 Q330 98 322 98 Q330 98 330 90Z" fill="#F8C779" />
            <circle cx="210" cy="50" r="3" fill="#D38BA5" />
            <circle cx="360" cy="210" r="3.5" fill="#88D494" />
            <circle cx="65" cy="220" r="4" fill="#E6B8C8" />
          </g>

          {/* Soft Ground Mounds */}
          <ellipse cx="210" cy="340" rx="130" ry="22" fill="#EFE8E1" opacity="0.7" />
          <ellipse cx="210" cy="336" rx="95" ry="14" fill="#DFD2C6" opacity="0.6" />

          {/* Sprouting Flower Mascot */}
          <g id="flower-mascot">
            {/* Gentle Stem */}
            <path d="M210 260 Q205 295 210 330" stroke="url(#stemGrad)" strokeWidth="6" strokeLinecap="round" />
            <path d="M210 295 Q180 285 170 300 Q190 310 210 300" fill="#9DD7A4" />
            <path d="M210 285 Q240 275 250 290 Q230 300 210 290" fill="#BCE3C1" />

            {/* Petals around the happy blossom face */}
            <circle cx="210" cy="140" r="26" fill="#F9DDE5" />
            <circle cx="258" cy="162" r="26" fill="#E9DFFF" />
            <circle cx="258" cy="218" r="26" fill="#FFF0B8" />
            <circle cx="210" cy="240" r="26" fill="#DDF3DE" />
            <circle cx="162" cy="218" r="26" fill="#DDECFB" />
            <circle cx="162" cy="162" r="26" fill="#FFDCCB" />

            {/* Central Blossom Head */}
            <circle cx="210" cy="190" r="42" fill="url(#regGrad)" stroke="#FFFFFF" strokeWidth="3" />

            {/* Cute Happy Face */}
            <circle cx="196" cy="186" r="3" fill="#403344" />
            <circle cx="224" cy="186" r="3" fill="#403344" />
            {/* Blushing cheeks */}
            <ellipse cx="188" cy="195" rx="5.5" ry="3.5" fill="#EFA3B8" opacity="0.8" />
            <ellipse cx="232" cy="195" rx="5.5" ry="3.5" fill="#EFA3B8" opacity="0.8" />
            {/* Open happy smile */}
            <path d="M202 196 Q210 205 218 196" stroke="#403344" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        </svg>

        {/* Floating Mini Feature Cards */}
        {/* Card 1: Cycle */}
        <div className="absolute top-4 -left-2 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-[#F9DDE5] soft-shadow transform -rotate-6 hover:rotate-0 transition-transform animate-float">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#403344]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E07A9B]" />
            <span>Cycle</span>
            <span className="text-[10px] text-[#817583] font-normal">• Rhythm</span>
          </div>
        </div>

        {/* Card 2: Mood */}
        <div className="absolute top-8 -right-4 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-[#E9DFFF] soft-shadow transform rotate-6 hover:rotate-0 transition-transform animate-float-alt">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#403344]">
            <span>😌</span>
            <span>Mood</span>
            <span className="text-[10px] text-[#817583] font-normal">• Safe space</span>
          </div>
        </div>

        {/* Card 3: Learn */}
        <div className="absolute bottom-6 -right-2 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-[#DDF3DE] soft-shadow transform -rotate-3 hover:rotate-0 transition-transform">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#403344]">
            <BookOpen className="w-3.5 h-3.5 text-[#367942]" />
            <span>Learn</span>
            <span className="text-[10px] text-[#367942] font-semibold">Gentle guides</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Login Mode
  return (
    <div className="relative w-full max-w-md mx-auto flex items-center justify-center select-none">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F9DDE5]/60 via-[#E9DFFF]/50 to-[#FFF0B8]/40 rounded-full blur-3xl transform scale-90 -z-10" />

      <svg
        viewBox="0 0 420 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
        role="img"
        aria-label="Illustration for Baikology login"
      >
        <defs>
          <linearGradient id="lumiGrad" x1="140" y1="160" x2="280" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF7FA" />
            <stop offset="0.5" stopColor="#F8D4E0" />
            <stop offset="1" stopColor="#E9DFFF" />
          </linearGradient>

          <linearGradient id="potGrad" x1="170" y1="280" x2="250" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F6EEE3" />
            <stop offset="1" stopColor="#E6D3C2" />
          </linearGradient>
        </defs>

        {/* Orbit Dotted Arc */}
        <path
          d="M90 180 C90 110 330 110 330 180"
          stroke="#D8CFE5"
          strokeWidth="2"
          strokeDasharray="4 6"
          fill="none"
        />

        {/* Floating Stars and Sparkles */}
        <g className="animate-pulse" style={{ animationDuration: '4s' }}>
          <path d="M120 70 Q120 80 130 80 Q120 80 120 90 Q120 80 110 80 Q120 80 120 70Z" fill="#F8C779" />
          <path d="M320 80 Q320 88 328 88 Q320 88 320 96 Q320 88 312 88 Q320 88 320 80Z" fill="#F8C779" />
          <circle cx="80" cy="110" r="3" fill="#F2A7B8" />
          <circle cx="340" cy="130" r="3.5" fill="#B6E5BD" />
          <circle cx="210" cy="40" r="2.5" fill="#A896D8" />
        </g>

        {/* Cozy Garden Foliage Behind Mascot */}
        <g opacity="0.85">
          {/* Left flowers & leaves */}
          <path d="M130 310 C110 270 95 230 115 200 C125 225 135 250 140 280 Z" fill="#D6C4EB" />
          <circle cx="115" cy="195" r="7" fill="#F9DDE5" />
          <circle cx="115" cy="195" r="3" fill="#D38BA5" />

          {/* Right flowers & leaves */}
          <path d="M290 310 C310 270 325 230 305 200 C295 225 285 250 280 280 Z" fill="#DDF3DE" />
          <circle cx="305" cy="195" r="7" fill="#FFF0B8" />
          <circle cx="305" cy="195" r="3" fill="#D4B02A" />
        </g>

        {/* Cozy Planter / Garden Ground */}
        <ellipse cx="210" cy="336" rx="120" ry="20" fill="#E8DCD1" opacity="0.6" />
        <ellipse cx="210" cy="332" rx="90" ry="13" fill="#DFC9B9" opacity="0.5" />

        {/* Mascot: Lumi nestled happily */}
        <g id="lumi-resting">
          {/* Body */}
          <path
            d="M165 280 C150 230 170 180 210 180 C250 180 270 230 255 280 C250 310 235 326 210 326 C185 326 170 310 165 280 Z"
            fill="url(#lumiGrad)"
            stroke="#FFFFFF"
            strokeWidth="3"
          />

          {/* Cute leafy sprout on head */}
          <path d="M210 180 Q210 165 202 158 Q215 160 210 180 Z" fill="#88D494" />
          <path d="M210 176 Q214 164 222 160 Q214 166 210 176 Z" fill="#A4E3AE" />

          {/* Peaceful closed smiling eyes */}
          <path d="M190 234 Q196 239 202 234" stroke="#403344" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M218 234 Q224 239 230 234" stroke="#403344" strokeWidth="2.4" strokeLinecap="round" fill="none" />

          {/* Rosy blush */}
          <ellipse cx="184" cy="242" rx="6.5" ry="4" fill="#EFA3B8" opacity="0.8" />
          <ellipse cx="236" cy="242" rx="6.5" ry="4" fill="#EFA3B8" opacity="0.8" />

          {/* Warm smile */}
          <path d="M206 244 Q210 248 214 244" stroke="#403344" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Cozy paws holding a gentle warm tea mug */}
          <ellipse cx="184" cy="272" rx="10" ry="8" fill="#F8CBD9" transform="rotate(-10 184 272)" />
          <ellipse cx="236" cy="272" rx="10" ry="8" fill="#F8CBD9" transform="rotate(10 236 272)" />
          {/* Mug */}
          <rect x="202" y="260" width="16" height="18" rx="4" fill="#FFF8E0" stroke="#756291" strokeWidth="1.5" />
          <path d="M218 264 C222 264 223 272 218 274" stroke="#756291" strokeWidth="1.5" fill="none" />
          {/* Tiny steam */}
          <path d="M207 254 Q209 250 207 246" stroke="#C9B8DB" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M213 255 Q215 251 213 247" stroke="#C9B8DB" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      </svg>

      {/* Floating Card: "You can show up as you are" */}
      <div className="absolute -top-4 -right-2 sm:-right-6 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-[#E9DFFF] soft-shadow transform rotate-3 hover:rotate-0 transition-transform animate-float z-10 max-w-[190px]">
        <div className="flex items-center gap-1.5 mb-1">
          <Heart className="w-3.5 h-3.5 text-[#C95B7E]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#756291]">
            Safe Space
          </span>
        </div>
        <p className="text-xs font-semibold text-[#403344] leading-snug">
          “You can show up as you are.”
        </p>
      </div>

      {/* Floating Mood Check-in Card (Bottom Left) */}
      <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-[#F9DDE5] soft-shadow transform -rotate-3 hover:rotate-0 transition-transform animate-float-alt z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg">😌</span>
          <div>
            <span className="block text-[11px] font-bold text-[#403344]">Feeling settled</span>
            <span className="text-[9px] text-[#817583]">Welcome back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
