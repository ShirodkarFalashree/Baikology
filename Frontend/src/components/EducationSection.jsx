import React from 'react';
import { BookOpen, Clock, ArrowRight, Sparkles, Feather } from 'lucide-react';

export const GUIDES = [
  {
    id: 'cycle-science',
    title: 'What actually happens during your menstrual cycle?',
    category: 'Cycle Science',
    readTime: '4 min read',
    bgColor: 'bg-[#F9DDE5]/60',
    borderColor: 'border-[#F2C4D4]',
    tagBg: 'bg-[#F9DDE5]',
    tagColor: 'text-[#8C2C4E]',
    icon: '🌸',
    summary:
      "Hormones aren't unpredictable chaos — they follow a rhythmic, repeating biological conversation between your brain and ovaries. Here's what's happening behind the scenes in plain English.",
    fullContent: {
      intro:
        "From biology class diagrams that felt cold and detached, you might have learned that cycles are all about reproduction. But your cycle is actually a whole-body vital sign reflecting energy, sleep, metabolic health, and emotional resilience.",
      keyTakeaways: [
        'The menstrual phase gives you a biological invitation to pause and recharge as progesterone and estrogen reset.',
        'The follicular phase triggers follicle stimulating hormone (FSH) to prepare an egg, bringing rising energy.',
        'Ovulation is the main event of the cycle — not just the bleeding itself. It triggers progesterone production.',
        'The luteal phase nurtures comfort, focus on nesting, and signals your body to prepare for a fresh cycle.',
      ],
      comfortNote:
        'Every body varies. Standard textbook 28-day cycles are averages, not strict deadlines. Anything between 21 to 35 days can be healthy and normal.',
    },
  },
  {
    id: 'pcos-basics',
    title: 'PCOS: understanding the basics without the panic',
    category: 'Hormonal Health',
    readTime: '5 min read',
    bgColor: 'bg-[#DDF3DE]/60',
    borderColor: 'border-[#BDDFBF]',
    tagBg: 'bg-[#DDF3DE]',
    tagColor: 'text-[#2C6336]',
    icon: '🌿',
    summary:
      'A calm, evidence-informed look at polycystic ovary syndrome — what it means, common signs, and how to advocate for your body without fear, confusion, or self-blame.',
    fullContent: {
      intro:
        "Hearing 'PCOS' can feel overwhelming, especially with the sea of alarming internet searches. But PCOS is primarily an endocrine and metabolic pattern, not an insurmountable barrier to living vibrantly.",
      keyTakeaways: [
        'PCOS involves higher levels of androgens (like testosterone) and often insulin resistance.',
        "The word 'cysts' is slightly misleading — they are usually small, immature follicles that paused before releasing an egg.",
        'Common signs include irregular periods, unexpected hair changes, adult acne, or energy dips.',
        'Support focuses on gentle nutrition, stress reduction, restful sleep, and working with a supportive medical provider.',
      ],
      comfortNote:
        'You did not cause this. PCOS is rooted in complex genetics and environmental factors. Compassion is the first medicine.',
    },
  },
  {
    id: 'mood-shifts',
    title: 'Why can your mood feel different throughout the month?',
    category: 'Mind & Body',
    readTime: '3 min read',
    bgColor: 'bg-[#E9DFFF]/60',
    borderColor: 'border-[#CFBFF2]',
    tagBg: 'bg-[#E9DFFF]',
    tagColor: 'text-[#584478]',
    icon: '✨',
    summary:
      'Estrogen and progesterone influence more than bleeding — they interact directly with serotonin, dopamine, and GABA. Here is the neurochemistry behind your monthly emotional shifts.',
    fullContent: {
      intro:
        "Have you ever noticed that one week you feel ready to conquer the world, and two weeks later a tiny inconvenience brings you to tears? You aren't 'overemotional' — your brain is responding to real neurochemical shifts.",
      keyTakeaways: [
        'Estrogen boosts serotonin and dopamine receptors, naturally supporting confidence and social bandwidth.',
        'Progesterone converts to allopregnanolone, which stimulates calming GABA receptors — often making you crave slow, quiet moments.',
        'When progesterone plummets in the late luteal phase, GABA receptors briefly reset, which can manifest as irritability or sensitivity.',
        'Tracking moods alongside your cycle helps you anticipate emotional weather rather than feeling blindsided by it.',
      ],
      comfortNote:
        'Your feelings are real and chemical. Giving yourself permission to rest instead of forcing productivity can change everything.',
    },
  },
];

export default function EducationSection({ onSelectGuide }) {
  return (
    <section id="learn" className="py-20 sm:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#DDF3DE] text-xs font-bold text-[#2C6336] uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Gentle Education
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight mb-4">
            Big questions. Gentle answers.
          </h2>
          <p className="text-base sm:text-lg text-[#817583] leading-relaxed">
            Science-informed explanations without clinical jargon, fear-mongering, or judgment. Understanding your body should bring peace, not panic.
          </p>
        </div>

        {/* 3 Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {GUIDES.map((guide) => (
            <div
              key={guide.id}
              className={`rounded-[32px] ${guide.bgColor} border ${guide.borderColor} p-6 sm:p-7 flex flex-col justify-between soft-shadow hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group`}
            >
              <div>
                {/* Category & Read Time */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${guide.tagBg} ${guide.tagColor} border border-white/60 shadow-xs`}
                  >
                    {guide.category}
                  </span>
                  <span className="text-xs text-[#817583] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {guide.readTime}
                  </span>
                </div>

                {/* Soft Icon / Mascot Symbol */}
                <div className="w-12 h-12 rounded-2xl bg-white/90 border border-white flex items-center justify-center text-2xl shadow-xs mb-4 group-hover:scale-105 transition-transform">
                  {guide.icon}
                </div>

                {/* Guide Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#403344] font-['Nunito',sans-serif] leading-snug mb-3">
                  {guide.title}
                </h3>

                {/* Short Introductory Summary */}
                <p className="text-sm text-[#403344]/80 leading-relaxed mb-6 font-normal">
                  {guide.summary}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#403344]/10">
                <button
                  onClick={() => onSelectGuide(guide)}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-full bg-white text-[#403344] font-bold text-xs hover:bg-[#FFFAF5] shadow-xs group-hover:shadow transition-all"
                >
                  <span>Read the gentle guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#756291] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Educational Disclaimer Banner */}
        <div className="mt-12 p-4 rounded-3xl bg-white border border-[#E9DFFF] text-center max-w-2xl mx-auto soft-shadow">
          <p className="text-xs text-[#817583] leading-relaxed">
            <span className="font-bold text-[#403344]">Editorial Notice:</span> All educational summaries are illustrative and created for health literacy. Content is being prepared in consultation with medical advisors and is not a substitute for clinical diagnosis or individualized care.
          </p>
        </div>
      </div>
    </section>
  );
}
