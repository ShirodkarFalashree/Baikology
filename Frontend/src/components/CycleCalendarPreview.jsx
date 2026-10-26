import React, { useState } from 'react';
import { Calendar as CalendarIcon, Sparkles, ChevronLeft, ChevronRight, Info, Heart, ArrowRight } from 'lucide-react';

// Sample 28-day illustrative cycle phases
const CYCLE_PHASES = {
  menstrual: {
    name: 'Menstrual Phase',
    days: [1, 2, 3, 4, 5],
    color: 'bg-[#F9DDE5]',
    dotColor: '#E07A9B',
    textColor: 'text-[#8C2C4E]',
    badgeBg: 'bg-[#F9DDE5]',
    desc: 'Hormone levels are at their lowest baseline. It is natural to feel quiet, introspective, and in need of restorative rest.',
    tip: 'Gentle warmth, cozy hydration, and listening to your energy.',
  },
  follicular: {
    name: 'Follicular Phase',
    days: [6, 7, 8, 9, 10, 11, 12],
    color: 'bg-[#DDECFB]',
    dotColor: '#4A8BD4',
    textColor: 'text-[#245D9E]',
    badgeBg: 'bg-[#DDECFB]',
    desc: 'Estrogen gradually rises. Many people feel a returning sense of clarity, curiosity, and fresh physical energy.',
    tip: 'Great time for gentle brainstorming, creative projects, and light movement.',
  },
  ovulatory: {
    name: 'Ovulatory Window',
    days: [13, 14, 15, 16],
    color: 'bg-[#FFF0B8]',
    dotColor: '#D4B02A',
    textColor: 'text-[#7A640F]',
    badgeBg: 'bg-[#FFF0B8]',
    desc: 'Estrogen peaks and luteinizing hormone triggers ovulation. Energy, sociability, and verbal fluency often peak around now.',
    tip: 'Lean into connections, meaningful conversations, and feeling expressive.',
  },
  luteal: {
    name: 'Luteal Phase',
    days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    color: 'bg-[#E9DFFF]',
    dotColor: '#8C72B8',
    textColor: 'text-[#563E7D]',
    badgeBg: 'bg-[#E9DFFF]',
    desc: 'Progesterone rises to support the uterine lining, then tapers off. Focus naturally shifts toward wrapping up projects and creating comfort.',
    tip: 'Prioritize nourishing meals, set soft boundaries, and give yourself grace.',
  },
};

export default function CycleCalendarPreview({ onOpenCycleTracking }) {
  const [selectedDay, setSelectedDay] = useState(14); // Default to Ovulation day 14

  // Determine which phase a cycle day belongs to
  const getPhaseForDay = (day) => {
    if (CYCLE_PHASES.menstrual.days.includes(day)) return CYCLE_PHASES.menstrual;
    if (CYCLE_PHASES.follicular.days.includes(day)) return CYCLE_PHASES.follicular;
    if (CYCLE_PHASES.ovulatory.days.includes(day)) return CYCLE_PHASES.ovulatory;
    return CYCLE_PHASES.luteal;
  };

  const currentPhase = getPhaseForDay(selectedDay);

  // Generate calendar days for a 30-day preview month (e.g. June)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <section id="cycle" className="py-20 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F9DDE5]/80 text-xs font-bold text-[#403344] uppercase tracking-wider mb-3">
            <CalendarIcon className="w-3.5 h-3.5 text-[#C95B7E]" />
            Illustrative Calendar
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight mb-4">
            A calendar designed around rhythms, not rules
          </h2>
          <p className="text-base sm:text-lg text-[#817583] leading-relaxed">
            Your body isn't a factory clock. Our gentle view helps you understand the natural shifts in your energy, mood, and cycle without shame or rigid expectations.
          </p>
        </div>

        {/* Main Calendar Card & Phase Detail Panel */}
        <div className="bg-white rounded-[36px] border border-[#E9DFFF] soft-shadow-lg p-6 sm:p-10">
          {/* Top Banner Notice */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#FFFAF5] border border-[#F9DDE5] mb-8">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-[#FFF0B8] text-[11px] font-bold text-[#6D5A12] uppercase tracking-wide">
                Sample preview
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#403344]">
                “Your cycle is personal. Every body has its own rhythm.”
              </span>
            </div>
            <div className="text-xs text-[#817583] italic">
              Click any day below to preview phase insights
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Interactive Calendar Grid */}
            <div className="lg:col-span-7 bg-[#FFFAF5] rounded-3xl p-5 sm:p-7 border border-[#E9DFFF]/70">
              {/* Month Header */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E9DFFF]">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#403344] font-['Nunito',sans-serif]">
                    Sample Month
                  </span>
                  <span className="text-xs text-[#817583] px-2.5 py-0.5 rounded-full bg-white border border-[#E9DFFF]">
                    28-day cycle pattern
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#817583]">
                  <span>June 2026</span>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#817583] mb-3">
                {weekDays.map((d, i) => (
                  <span key={i} className="py-1">
                    {d}
                  </span>
                ))}
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                {daysInMonth.map((day) => {
                  const isCycleDay = day <= 28;
                  const phase = isCycleDay ? getPhaseForDay(day) : null;
                  const isSelected = selectedDay === day;

                  return (
                    <button
                      key={day}
                      onClick={() => isCycleDay && setSelectedDay(day)}
                      disabled={!isCycleDay}
                      className={`relative flex flex-col items-center justify-center h-11 sm:h-12 rounded-2xl transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#403344] text-white shadow-md scale-105 z-10'
                          : isCycleDay
                          ? `${phase.color} text-[#403344] hover:scale-105 hover:shadow-xs`
                          : 'bg-transparent text-gray-300 cursor-default'
                      }`}
                    >
                      <span className={`text-xs font-semibold ${isSelected ? 'text-white' : ''}`}>
                        {day}
                      </span>
                      {isCycleDay && (
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-0.5"
                          style={{
                            backgroundColor: isSelected ? '#FFFFFF' : phase.dotColor,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Phase Color Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-6 mt-6 border-t border-[#E9DFFF]/70 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#F9DDE5] border border-[#F2C8D4]" />
                  <span className="text-[#817583] font-medium">Menstrual (1–5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#DDECFB] border border-[#BED7F7]" />
                  <span className="text-[#817583] font-medium">Follicular (6–12)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FFF0B8] border border-[#F4DC78]" />
                  <span className="text-[#817583] font-medium">Ovulatory (13–16)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#E9DFFF] border border-[#D5C2F6]" />
                  <span className="text-[#817583] font-medium">Luteal (17–28)</span>
                </div>
              </div>
            </div>

            {/* Right: Phase Context Card */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full ${currentPhase.badgeBg} ${currentPhase.textColor} border border-white/60 shadow-xs`}
                  >
                    Day {selectedDay} of Cycle
                  </span>
                  <span className="text-xs font-semibold text-[#817583] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#F6A5B8]" />
                    Phase Insight
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                  {currentPhase.name}
                </h3>

                <p className="text-sm text-[#403344]/85 leading-relaxed bg-[#FFFAF5] p-4 rounded-2xl border border-[#E9DFFF]">
                  {currentPhase.desc}
                </p>

                <div className="bg-[#FFFAF5] p-4 rounded-2xl border border-[#E9DFFF] space-y-1.5">
                  <span className="text-xs font-bold text-[#403344] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#756291]" />
                    Gentle self-care suggestion
                  </span>
                  <p className="text-xs text-[#817583] leading-relaxed">
                    {currentPhase.tip}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenCycleTracking}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] hover:shadow-md hover:scale-[1.01] transition-all"
                >
                  <span>Explore cycle tracking</span>
                  <ArrowRight className="w-4 h-4 text-[#756291]" />
                </button>
                <p className="text-[11px] text-[#817583] text-center mt-2">
                  Sample educational dates only. Predictions are personal estimates and do not determine ovulation or pregnancy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
