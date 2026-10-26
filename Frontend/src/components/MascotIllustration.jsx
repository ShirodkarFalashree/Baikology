import React from 'react';

export default function MascotIllustration({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F9DDE5]/60 via-[#E9DFFF]/50 to-[#FFF0B8]/40 rounded-full blur-3xl transform scale-90 -z-10 pointer-events-none" />

      <svg
        viewBox="0 0 460 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[420px] h-auto drop-shadow-md"
        role="img"
        aria-label="Illustration of Lumi, the comforting Baikology mascot under a cozy shelter with floating pastel mood orbs"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bookRoof" x1="50" y1="60" x2="410" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B8BB6" />
            <stop offset="0.5" stopColor="#756291" />
            <stop offset="1" stopColor="#5E4C7A" />
          </linearGradient>

          <linearGradient id="bookPage" x1="120" y1="120" x2="340" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" />
            <stop offset="1" stopColor="#F6EEE3" />
          </linearGradient>

          <linearGradient id="bodyGrad" x1="150" y1="180" x2="310" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDEAEF" />
            <stop offset="0.5" stopColor="#F5D0DC" />
            <stop offset="1" stopColor="#E6B8C8" />
          </linearGradient>

          <linearGradient id="calmOrb" x1="180" y1="30" x2="250" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E2F7E4" />
            <stop offset="1" stopColor="#B6E5BD" />
          </linearGradient>

          <linearGradient id="warmOrb" x1="60" y1="140" x2="120" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE4D6" />
            <stop offset="1" stopColor="#FFBF9E" />
          </linearGradient>

          <linearGradient id="safeOrb" x1="330" y1="140" x2="400" y2="210" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F2EAFF" />
            <stop offset="1" stopColor="#D5C4F5" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#403344" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Floating Stars and Sparkles */}
        <g className="animate-pulse" style={{ animationDuration: '4s' }}>
          {/* Four-point stars */}
          <path d="M125 50 Q125 62 137 62 Q125 62 125 74 Q125 62 113 62 Q125 62 125 50Z" fill="#F8C779" opacity="0.85" />
          <path d="M360 70 Q360 80 370 80 Q360 80 360 90 Q360 80 350 80 Q360 80 360 70Z" fill="#F8C779" opacity="0.8" />
          <path d="M290 40 Q290 46 296 46 Q290 46 290 52 Q290 46 284 46 Q290 46 290 40Z" fill="#A896D8" opacity="0.75" />
          <circle cx="80" cy="95" r="3" fill="#F2A7B8" />
          <circle cx="395" cy="115" r="3.5" fill="#B6E5BD" />
          <circle cx="150" cy="25" r="2.5" fill="#FFCBA5" />
        </g>

        {/* Orbit dotted arcs */}
        <path
          d="M100 170 C130 90 320 80 370 180"
          stroke="#D8CFE5"
          strokeWidth="2"
          strokeDasharray="4 6"
          fill="none"
          opacity="0.7"
        />

        {/* Floating Orb 1: Calm (Green) at Top */}
        <g transform="translate(190, 42)">
          <circle cx="28" cy="28" r="28" fill="url(#calmOrb)" filter="url(#softShadow)" />
          {/* Face */}
          <circle cx="20" cy="27" r="2.5" fill="#403344" />
          <circle cx="36" cy="27" r="2.5" fill="#403344" />
          {/* Sweet smile */}
          <path d="M23 34 Q28 38 33 34" stroke="#403344" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Blush */}
          <circle cx="16" cy="30" r="3" fill="#88D494" opacity="0.6" />
          <circle cx="40" cy="30" r="3" fill="#88D494" opacity="0.6" />
        </g>

        {/* Floating Orb 2: Warm/Sensitive (Peach) on Left */}
        <g transform="translate(70, 150)">
          <circle cx="26" cy="26" r="26" fill="url(#warmOrb)" filter="url(#softShadow)" />
          {/* Gentle concerned / feeling face */}
          <circle cx="20" cy="25" r="2.3" fill="#403344" />
          <circle cx="32" cy="25" r="2.3" fill="#403344" />
          <path d="M22 32 Q26 29 30 32" stroke="#403344" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="15" cy="28" r="3.2" fill="#FA9E7A" opacity="0.5" />
          <circle cx="37" cy="28" r="3.2" fill="#FA9E7A" opacity="0.5" />
        </g>

        {/* Floating Orb 3: Privacy / Safe Space (Lavender with padlock) on Right */}
        <g transform="translate(340, 155)">
          <circle cx="26" cy="26" r="26" fill="url(#safeOrb)" filter="url(#softShadow)" />
          {/* Padlock icon with heart */}
          <rect x="18" y="24" width="16" height="14" rx="3.5" fill="#FFF8E0" stroke="#756291" strokeWidth="1.8" />
          <path d="M21 24 V19 C21 15.5 31 15.5 31 19 V24" stroke="#756291" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Tiny heart in padlock */}
          <path d="M26 30 C25 28 23 29 23 30.5 C23 32 26 33.5 26 33.5 C26 33.5 29 32 29 30.5 C29 29 27 28 26 30 Z" fill="#D38BA5" />
        </g>

        {/* Botanical Leaves Behind The Mascot */}
        <g opacity="0.85">
          {/* Left foliage */}
          <path d="M120 330 C100 290 85 240 105 210 C115 235 125 265 130 300 Z" fill="#D6C4EB" />
          <path d="M100 270 C80 260 70 240 75 220 C85 235 95 245 105 255 Z" fill="#C4B0DF" />
          <circle cx="75" cy="218" r="4.5" fill="#E8BCCF" />
          <circle cx="108" cy="208" r="4" fill="#C4E7CA" />

          {/* Right foliage */}
          <path d="M340 330 C360 290 375 240 355 210 C345 235 335 265 330 300 Z" fill="#F4CFDB" />
          <path d="M360 270 C380 260 390 240 385 220 C375 235 365 245 355 255 Z" fill="#ECAFC2" />
          <circle cx="385" cy="218" r="4.5" fill="#E7D28E" />
          <circle cx="352" cy="208" r="4" fill="#BCE0C3" />
        </g>

        {/* Book Canopy / Roof (Symbol of gentle learning & safe shelter) */}
        <g filter="url(#softShadow)">
          {/* Book Spine Center Crest */}
          <path
            d="M230 148 L140 220 L155 228 L230 162 L305 228 L320 220 Z"
            fill="#52416B"
          />
          {/* Left Book Page Slope */}
          <polygon points="230,154 135,224 142,234 230,166" fill="#FDFBF7" />
          <polygon points="230,150 130,222 135,226 230,158" fill="url(#bookRoof)" />

          {/* Right Book Page Slope */}
          <polygon points="230,154 325,224 318,234 230,166" fill="#FAF5ED" />
          <polygon points="230,150 330,222 325,226 230,158" fill="url(#bookRoof)" />

          {/* Golden Bookmark Ribbon Hanging Gently */}
          <path d="M230 160 Q228 200 225 240 L233 248 L241 240 Q232 200 230 160 Z" fill="#F6D365" />
        </g>

        {/* Soft Cozy Ground / Pebble Base */}
        <ellipse cx="230" cy="360" rx="140" ry="24" fill="#E8DCD1" opacity="0.6" />
        <ellipse cx="230" cy="358" rx="110" ry="16" fill="#D7C5B8" opacity="0.5" />
        {/* Soft river pebbles around base */}
        <ellipse cx="150" cy="362" rx="16" ry="9" fill="#DFC9B9" />
        <ellipse cx="310" cy="362" rx="18" ry="10" fill="#DFC9B9" />
        <ellipse cx="132" cy="366" rx="10" ry="6" fill="#CEB5A3" />

        {/* The Mascot: "Lumi" — The Comforting Pebble Bloom */}
        <g id="lumi-mascot">
          {/* Main Body */}
          <path
            d="M175 295 C160 250 180 200 230 200 C280 200 300 250 285 295 C280 325 260 348 230 348 C200 348 180 325 175 295 Z"
            fill="url(#bodyGrad)"
            filter="url(#softShadow)"
          />

          {/* Cute Little Sprout on Head */}
          <path d="M230 200 Q230 185 222 178 Q235 180 230 200 Z" fill="#88D494" />
          <path d="M230 196 Q234 184 242 180 Q234 186 230 196 Z" fill="#A4E3AE" />

          {/* Closed Peaceful Eyes (Gentle arc) */}
          <path d="M206 254 Q214 260 222 254" stroke="#403344" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M238 254 Q246 260 254 254" stroke="#403344" strokeWidth="2.6" strokeLinecap="round" fill="none" />

          {/* Rosy Cheeks */}
          <ellipse cx="198" cy="265" rx="8" ry="5" fill="#EFA3B8" opacity="0.8" />
          <ellipse cx="262" cy="265" rx="8" ry="5" fill="#EFA3B8" opacity="0.8" />

          {/* Gentle Smile */}
          <path d="M224 268 Q230 274 236 268" stroke="#403344" strokeWidth="2.4" strokeLinecap="round" fill="none" />

          {/* Soft Hugging Hands resting on cozy body */}
          <ellipse cx="188" cy="296" rx="14" ry="11" fill="#F8CBD9" transform="rotate(-15 188 296)" />
          <ellipse cx="272" cy="296" rx="14" ry="11" fill="#F8CBD9" transform="rotate(15 272 296)" />

          {/* Small Heart Lock Charm held gently */}
          <g transform="translate(220, 290)">
            <rect x="4" y="10" width="14" height="12" rx="3" fill="#FFF3CD" stroke="#A89686" strokeWidth="1.2" />
            <path d="M7 10 V7 C7 4.5 15 4.5 15 7 V10" stroke="#A89686" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M11 15 C10.5 14 9.5 14.5 9.5 15.5 C9.5 16.5 11 17.5 11 17.5 C11 17.5 12.5 16.5 12.5 15.5 C12.5 14.5 11.5 14 11 15 Z" fill="#D38BA5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
