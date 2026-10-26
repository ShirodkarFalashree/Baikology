import React, { useState } from 'react';
import { Smile, Sparkles, HeartHandshake, Check, RefreshCw, Feather } from 'lucide-react';

const MOODS = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy',
    sublabel: 'Sunny & energized',
    color: 'bg-[#FFF0B8]',
    border: 'border-[#F0DA81]',
    textColor: 'text-[#6D5A12]',
    ringColor: 'ring-[#E5C158]',
    response: 'We love a little sunshine. Want to save this moment?',
    reflectionPrompt: 'What brought a little spark of joy into your day?',
  },
  {
    id: 'calm',
    emoji: '😌',
    label: 'Calm',
    sublabel: 'Peaceful & grounded',
    color: 'bg-[#DDF3DE]',
    border: 'border-[#B2DFB6]',
    textColor: 'text-[#2C6336]',
    ringColor: 'ring-[#86C98D]',
    response: 'A little breathing room can feel good.',
    reflectionPrompt: 'Take a soft exhale. What is keeping you grounded right now?',
  },
  {
    id: 'meh',
    emoji: '😐',
    label: 'Meh',
    sublabel: 'In-between / okay-ish',
    color: 'bg-[#E9DFFF]',
    border: 'border-[#CFBFF2]',
    textColor: 'text-[#584478]',
    ringColor: 'ring-[#B299E5]',
    response: "That's okay, too. You don't need to name everything.",
    reflectionPrompt: 'Neutral days are just as valid. No need to force any feeling.',
  },
  {
    id: 'overwhelmed',
    emoji: '🥺',
    label: 'Overwhelmed',
    sublabel: 'Heavy on my mind',
    color: 'bg-[#FFDCCB]',
    border: 'border-[#F7BA9E]',
    textColor: 'text-[#874A28]',
    ringColor: 'ring-[#F49F7B]',
    response: "One thing at a time. You don't have to figure it all out right now.",
    reflectionPrompt: 'Can you take one small thing off your shoulders today?',
  },
  {
    id: 'low',
    emoji: '😔',
    label: 'Low',
    sublabel: 'Tender & quiet',
    color: 'bg-[#F9DDE5]',
    border: 'border-[#F0B8C8]',
    textColor: 'text-[#8C3450]',
    ringColor: 'ring-[#E68FA7]',
    response: "You don't have to pretend you're okay here.",
    reflectionPrompt: 'Gentleness first. Wrap yourself in cozy warmth today.',
  },
];

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState(MOODS[1]); // Default to 'Calm'
  const [journalNote, setJournalNote] = useState('');
  const [hasFinishedToday, setHasFinishedToday] = useState(false);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    setHasFinishedToday(false);
    setNoteSavedFeedback(false);
  };

  const handleFinishToday = () => {
    setHasFinishedToday(true);
  };

  const handleReset = () => {
    setHasFinishedToday(false);
    setJournalNote('');
    setNoteSavedFeedback(false);
  };

  return (
    <section id="mood" className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-[#E9DFFF]/20 to-transparent">
      {/* Decorative Pastel Clouds */}
      <div className="absolute top-1/2 left-4 w-60 h-60 bg-[#F9DDE5]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-6 w-72 h-72 bg-[#DDF3DE]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E9DFFF] text-xs font-bold text-[#403344] uppercase tracking-wider mb-4 shadow-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-[#756291]" />
            Live Interactive Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight mb-3">
            Okay, but how are YOU feeling today?
          </h2>
          <p className="text-base text-[#817583]">
            No scores to maintain, no streaks to break. Just a safe 10-second pause to notice where you are.
          </p>
        </div>

        {/* Interactive Mood Card Container */}
        <div className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#E9DFFF]/80 soft-shadow-lg relative">
          {hasFinishedToday ? (
            /* Finished Today Confirmation Card */
            <div className="text-center py-10 px-4 sm:px-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-[#DDF3DE] text-[#2C6336] mx-auto flex items-center justify-center text-3xl mb-5 shadow-sm">
                🤍
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#403344] font-['Nunito',sans-serif] mb-3">
                That's enough for today.
              </h3>
              <p className="text-base text-[#817583] max-w-md mx-auto mb-6">
                You took a moment to listen to yourself, and that matters. No expectations, no homework. Just take care of you.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFAF5] border border-[#E9DFFF] text-xs text-[#403344] font-semibold mb-6">
                <span>Selected feeling:</span>
                <span className="text-base">{selectedMood.emoji}</span>
                <span className="font-bold">{selectedMood.label}</span>
              </div>
              <div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#817583] hover:text-[#403344] px-4 py-2 rounded-full border border-gray-200 hover:bg-[#FFFAF5] transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try another check-in
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Mood Buttons Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-8">
                {MOODS.map((mood) => {
                  const isSelected = selectedMood.id === mood.id;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleSelectMood(mood)}
                      aria-pressed={isSelected}
                      className={`relative flex flex-col items-center text-center p-4 sm:p-5 rounded-3xl transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `${mood.color} ${mood.border} border-2 shadow-md ring-4 ${mood.ringColor}/30 scale-[1.04]`
                          : 'bg-[#FFFAF5] border border-[#E9DFFF]/70 hover:bg-white hover:scale-[1.02]'
                      }`}
                    >
                      {/* Active tiny indicator */}
                      {isSelected && (
                        <span className="absolute -top-2 right-3 w-5 h-5 rounded-full bg-[#403344] text-white flex items-center justify-center text-[10px] shadow-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                      <span className="text-3xl sm:text-4xl mb-2 filter drop-shadow-xs transform transition-transform hover:scale-110">
                        {mood.emoji}
                      </span>
                      <span className="text-sm font-bold text-[#403344]">
                        {mood.label}
                      </span>
                      <span className="text-[10px] text-[#817583] mt-0.5 line-clamp-1">
                        {mood.sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Gentle Non-Judgmental Response Box */}
              <div
                className={`p-5 sm:p-6 rounded-3xl ${selectedMood.color} border ${selectedMood.border} transition-all duration-300 mb-6`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="text-2xl mt-0.5 select-none">{selectedMood.emoji}</div>
                  <div className="space-y-1">
                    <h4 className={`text-base sm:text-lg font-bold ${selectedMood.textColor} font-['Nunito',sans-serif]`}>
                      {selectedMood.response}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#403344]/80 leading-relaxed">
                      {selectedMood.reflectionPrompt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional Private Journal Note */}
              <div className="bg-[#FFFAF5] rounded-3xl p-4 sm:p-5 border border-[#E9DFFF]/80 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="journal-note" className="text-xs font-bold text-[#403344] flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-[#756291]" />
                    Optional private thought (Browser session only)
                  </label>
                  <span className="text-[10px] text-[#817583]">Never saved to server</span>
                </div>
                <textarea
                  id="journal-note"
                  rows={2}
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="A word, a sigh, or whatever's on your mind today..."
                  className="w-full text-xs sm:text-sm text-[#403344] bg-white rounded-2xl p-3 border border-[#E9DFFF] focus:border-[#756291] focus:ring-2 focus:ring-[#E9DFFF] outline-none transition-all placeholder:text-[#817583]/60 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-[#817583] flex items-center gap-1.5 order-2 sm:order-1">
                  <span className="w-2 h-2 rounded-full bg-[#86C98D]" />
                  <span>Real frontend state preview • No data leaves this device</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2 justify-end">
                  <button
                    onClick={handleFinishToday}
                    className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold text-[#403344] bg-[#E9DFFF] hover:bg-[#DBCBFC] active:scale-95 transition-all shadow-xs"
                  >
                    That's enough for today 🤍
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Medical disclaimer sub-note */}
        <p className="text-[11px] text-[#817583] text-center mt-4 max-w-lg mx-auto">
          Notice: This sample mood check-in is an illustrative self-reflection tool. It is not stored in a database and is not intended as a clinical or mental health diagnosis.
        </p>
      </div>
    </section>
  );
}
