import React from 'react';
import FeatureCard from './FeatureCard';
import { Calendar, Heart, BookOpen, MessageCircleQuestion, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FeaturesSection({ onSelectFeature }) {
  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#E9DFFF]/70 text-xs font-bold text-[#403344] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#756291]" />
            Thoughtful Tools
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight mb-4">
            A little care, a little clarity
          </h2>
          <p className="text-base sm:text-lg text-[#817583] leading-relaxed">
            Every feature is designed to reduce overwhelm, respect your autonomy, and bring gentle reassurance to every phase of your journey.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Your Cycle, Your Way */}
          <FeatureCard
            tag="Cycle Tracking"
            title="Your Cycle, Your Way"
            description="Track period dates and cycle patterns at your own pace. View a gentle calendar with cycle-day indicators designed around your body's natural rhythms."
            note="Predictions are estimates, not guarantees."
            bgColor="bg-[#F9DDE5]"
            borderColor="border-[#F2C8D4]"
            badgeBg="bg-white/90"
            badgeColor="text-[#A23F62]"
            actionText="Explore cycle rhythm"
            onAction={() => {
              const el = document.querySelector('#cycle');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            illustration={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#403344]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#A23F62]" />
                    Cycle Rhythm Preview
                  </span>
                  <span className="text-[10px] text-[#817583]">Cycle Day 12</span>
                </div>
                {/* Visual cycle timeline bar */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded-xl bg-[#F9DDE5]/80 border border-[#F2C8D4]">
                    <span className="block font-bold text-[#A23F62]">Menstrual</span>
                    <span className="text-[9px] text-[#817583]">Days 1–5</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#DDECFB]/80 border border-[#BED7F7] ring-1 ring-[#5E8AC4]">
                    <span className="block font-bold text-[#2A5C97]">Follicular</span>
                    <span className="text-[9px] text-[#2A5C97]">Days 6–12</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#FFF0B8]/80 border border-[#F4DC78]">
                    <span className="block font-bold text-[#7E6913]">Ovulation</span>
                    <span className="text-[9px] text-[#817583]">Days 13–16</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#E9DFFF]/80 border border-[#D5C2F6]">
                    <span className="block font-bold text-[#644D87]">Luteal</span>
                    <span className="text-[9px] text-[#817583]">Days 17–28</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 2: How Are You, Really? */}
          <FeatureCard
            tag="Mood Check-in"
            title="How Are You, Really?"
            description="Daily optional mood check-ins. Express feelings using friendly faces or simple words, with the option to jot down a private, quiet journal note."
            note="No scores to chase. No streaks to worry about."
            bgColor="bg-[#E9DFFF]"
            borderColor="border-[#D6C2F7]"
            badgeBg="bg-white/90"
            badgeColor="text-[#644D87]"
            actionText="Try a mood check-in"
            onAction={() => {
              const el = document.querySelector('#mood');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            illustration={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#403344]">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#756291]" />
                    Emotional Palette
                  </span>
                  <span className="text-[10px] text-[#756291] font-semibold">10-sec pause</span>
                </div>
                <div className="flex items-center justify-between gap-1.5 py-1">
                  {[
                    { emoji: '😊', label: 'Happy' },
                    { emoji: '😌', label: 'Calm', active: true },
                    { emoji: '😐', label: 'Meh' },
                    { emoji: '🥺', label: 'Overwhelmed' },
                    { emoji: '😔', label: 'Low' },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center p-1.5 rounded-2xl transition-all ${
                        m.active ? 'bg-[#E9DFFF] shadow-xs scale-105 ring-1 ring-[#756291]' : 'opacity-80'
                      }`}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      <span className="text-[9px] font-medium text-[#403344] mt-0.5">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          {/* Card 3: Let's Talk Body */}
          <FeatureCard
            tag="Education & Science"
            title="Let's Talk Body"
            description="Explore reproductive health education without stigma. Understand periods, PCOS awareness, hormonal shifts, and body basics in simple, empowering language."
            note="Reviewed educational content in plain English."
            bgColor="bg-[#DDF3DE]"
            borderColor="border-[#BBE3BD]"
            badgeBg="bg-white/90"
            badgeColor="text-[#367942]"
            actionText="Read our gentle guides"
            onAction={() => {
              const el = document.querySelector('#learn');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            illustration={
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#403344]">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#367942]" />
                    Gentle Learning Topics
                  </span>
                  <span className="text-[10px] text-[#367942] font-semibold">Self-paced</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-white text-[#403344] border border-[#BBE3BD] font-medium flex items-center gap-1">
                    🌸 Cycle Science
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-white text-[#403344] border border-[#BBE3BD] font-medium flex items-center gap-1">
                    🌿 PCOS Awareness
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-white text-[#403344] border border-[#BBE3BD] font-medium flex items-center gap-1">
                    ✨ Hormone Rhythms
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-white text-[#403344] border border-[#BBE3BD] font-medium flex items-center gap-1">
                    🤍 Cervical Health
                  </span>
                </div>
              </div>
            }
          />

          {/* Card 4: Answers Without Awkwardness */}
          <FeatureCard
            tag="Compassionate Assistant"
            title="Answers Without Awkwardness"
            description="Introducing our future health-information assistant. Designed to help you navigate common questions and find reliable resources in a warm, judgment-free space."
            note="Provides general information, not diagnosis."
            bgColor="bg-[#FFF0B8]"
            borderColor="border-[#EBD47C]"
            badgeBg="bg-white/90"
            badgeColor="text-[#7E6913]"
            actionText="See how it works"
            onAction={() => {
              const el = document.querySelector('#mood');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            illustration={
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#403344]">
                  <span className="flex items-center gap-1.5">
                    <MessageCircleQuestion className="w-3.5 h-3.5 text-[#7E6913]" />
                    Example Gentle Dialogue
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#EBD47C]/50 text-[#544405] font-bold">
                    Safe Q&A
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-2xl border border-[#EBD47C]/40 text-xs text-[#403344] space-y-1.5">
                  <p className="font-semibold text-[11px] text-[#7E6913]">
                    “Why do I feel so exhausted 3 days before my period?”
                  </p>
                  <p className="text-[11px] text-[#817583] leading-relaxed">
                    “Progesterone drops naturally right before menstruation. That fatigue is real biology, not laziness. Rest is productive.”
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
