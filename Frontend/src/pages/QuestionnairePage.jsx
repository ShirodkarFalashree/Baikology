import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Heart,
  Calendar,
  Smile,
  BookOpen,
  Lock,
  Loader2,
  Info,
  CheckCircle2,
  HelpCircle,
  Clock,
  Droplet,
  Activity,
  Moon,
  Sparkle,
} from 'lucide-react';
import { getCurrentUser, saveQuestionnaire } from '../api/auth';

export default function QuestionnairePage() {
  const navigate = useNavigate();

  // Authentication & DB check state
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Step state:
  // 0 = Welcome screen
  // 1 = Section 1: Understanding your period (Q1 - Q5)
  // 2 = Section 2: Your menstrual flow (Q6 - Q9)
  // 3 = Section 3: Period symptoms (Q10 - Q13)
  // 4 = Section 4: Mood and emotional changes (Q14 - Q16)
  // 5 = Section 5: Lifestyle and cycle patterns (Q17 - Q20)
  // 6 = Section 6: Your health background (Q21 - Q23)
  // 7 = Section 7: What does your body need? (Q24 - Q26)
  // 8 = Celebration / Completion screen
  const [currentStep, setCurrentStep] = useState(0);

  // Questionnaire answers state
  const [formData, setFormData] = useState({
    // Section 1
    startedMenstruating: '',
    ageFirstPeriod: '',
    lastPeriodDate: '',
    periodDuration: '',
    cycleRegularity: '',

    // Section 2
    flowIntensity: '',
    heaviestDays: '',
    spottingBetween: '',
    bloodClots: '',

    // Section 3
    periodSymptoms: [],
    crampIntensity: '',
    crampTiming: '',
    dailyDisruption: '',

    // Section 4
    moodChangesAroundPeriod: '',
    emotionalChanges: [],
    moodChangeTiming: '',

    // Section 5
    sleepPattern: '',
    physicalActivity: '',
    appetiteChanges: '',
    skinChanges: '',

    // Section 6
    diagnosedConditions: [],
    hormonalMedication: '',
    cycleChangedRecently: '',

    // Section 7
    goalsBaikologyHelp: [],
    remindersPreference: [],
    anythingElse: '',
  });

  // Verify user authentication and load existing questionnaire from DB if available
  useEffect(() => {
    async function verifyUserFromDB() {
      const token = localStorage.getItem('baikology_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const result = await getCurrentUser(token);
        if (result.success && result.data?.user) {
          const user = result.data.user;
          setCurrentUser(user);

          if (user.questionnaire) {
            setFormData((prev) => ({
              ...prev,
              ...user.questionnaire,
            }));
          }
        } else {
          localStorage.removeItem('baikology_token');
          localStorage.removeItem('baikology_user');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user from DB:', err);
      } finally {
        setIsLoadingUser(false);
      }
    }

    verifyUserFromDB();
  }, [navigate]);

  // Multi-select handler
  const toggleArrayItem = (fieldName, item) => {
    setFormData((prev) => {
      const currentList = prev[fieldName] || [];
      const exists = currentList.includes(item);
      const updated = exists
        ? currentList.filter((x) => x !== item)
        : [...currentList, item];
      return { ...prev, [fieldName]: updated };
    });
  };

  // Single select handler
  const setSingleValue = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 7) {
      handleSubmitQuestionnaire();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save questionnaire to MongoDB backend
  const handleSubmitQuestionnaire = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    const token = localStorage.getItem('baikology_token');
    const result = await saveQuestionnaire(formData, token);

    setIsSubmitting(false);

    if (result.success && result.data?.user) {
      localStorage.setItem('baikology_user', JSON.stringify(result.data.user));
      setCurrentUser(result.data.user);
      setCurrentStep(8); // Celebration screen
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitError(
        result.message || 'We could not save your responses right now. Please check your connection and try again.'
      );
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-full bg-[#E9DFFF] flex items-center justify-center animate-spin mb-4">
          <Sparkles className="w-7 h-7 text-[#756291]" />
        </div>
        <p className="text-[#403344] font-medium font-['Nunito',sans-serif] text-base">
          Preparing your gentle space...
        </p>
      </div>
    );
  }

  // Option lists
  const section1Options = {
    startedMenstruating: ['Yes', 'No', 'Prefer not to say'],
    ageFirstPeriod: ['Below 10', '10–12', '13–15', '16–18', 'Above 18', "Don't remember / Prefer not to say"],
    periodDuration: ['1–2 days', '3–4 days', '5–6 days', '7+ days', 'It varies / Not sure'],
    cycleRegularity: [
      'Regular (comes around the same time)',
      'Slightly irregular',
      'Very irregular',
      'Changes frequently',
      'Not sure',
    ],
  };

  const section2Options = {
    flowIntensity: ['Very light', 'Light', 'Moderate', 'Heavy', 'Varies every cycle'],
    heaviestDays: ['Day 1', 'Day 2', 'Day 3', 'Multiple days', 'It varies'],
    spottingBetween: ['Never', 'Occasionally', 'Frequently', 'Not sure'],
    bloodClots: ['Never', 'Occasionally', 'Frequently', 'Not sure'],
  };

  const section3Options = {
    periodSymptoms: [
      'Cramps',
      'Lower back pain',
      'Headaches',
      'Bloating',
      'Breast tenderness',
      'Nausea',
      'Acne or breakouts',
      'Fatigue',
      'Diarrhea or constipation',
      'Food cravings',
      'No noticeable symptoms',
      'Other',
    ],
    crampIntensity: [
      'No pain',
      'Mild',
      'Moderate',
      'Severe',
      'Very severe / Disruptive to daily activities',
    ],
    crampTiming: [
      'Before my period',
      'First day',
      'First 2–3 days',
      'Throughout my period',
      'After my period',
    ],
    dailyDisruption: ['Never', 'Sometimes', 'Often', 'Almost every cycle'],
  };

  const section4Options = {
    moodChangesAroundPeriod: ['Yes, frequently', 'Sometimes', 'Rarely', 'Never', 'Not sure'],
    emotionalChanges: [
      'Irritability',
      'Anxiety',
      'Sadness',
      'Mood swings',
      'Increased sensitivity',
      'Low motivation',
      'Feeling overwhelmed',
      'No noticeable changes',
    ],
    moodChangeTiming: [
      'Before my period',
      'During my period',
      'After my period',
      'Throughout my cycle',
      'Not sure',
    ],
  };

  const section5Options = {
    sleepPattern: ['Less than 5 hours', '5–6 hours', '7–8 hours', 'More than 8 hours', 'It varies'],
    physicalActivity: ['Mostly sedentary', 'Light activity', 'Moderately active', 'Very active'],
    appetiteChanges: [
      'Increased appetite',
      'Reduced appetite',
      'Specific food cravings',
      'No noticeable changes',
    ],
    skinChanges: [
      'Acne before periods',
      'Acne during periods',
      'Oily skin',
      'Dry skin',
      'No noticeable changes',
      'Not sure',
    ],
  };

  const section6Options = {
    diagnosedConditions: [
      'PCOS',
      'Endometriosis',
      'Thyroid disorder',
      'Fibroids',
      'Adenomyosis',
      'Other',
      'None',
      'Prefer not to say',
    ],
    hormonalMedication: ['Yes', 'No', 'Prefer not to say'],
    cycleChangedRecently: ['Yes', 'No', 'Not sure'],
  };

  const section7Options = {
    goalsBaikologyHelp: [
      'My cycle phases',
      'Period predictions',
      'My symptoms and patterns',
      'Mood changes',
      'Possible hormonal health concerns',
      'Lifestyle and cycle connections',
    ],
    remindersPreference: [
      'Upcoming period',
      'Daily symptom check-in',
      'Period starting reminder',
      'Medication reminders',
      'No reminders',
    ],
  };

  const sectionTitles = [
    '',
    '1. Understanding your period',
    '2. Your menstrual flow',
    '3. Period symptoms',
    '4. Mood and emotional changes',
    '5. Lifestyle and cycle patterns',
    '6. Your health background',
    '7. What does your body need?',
  ];

  return (
    <div className="min-h-screen bg-[#FFFAF5] text-[#403344] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-[#F9DDE5]">
      {/* Top Header Bar */}
      <header className="w-full bg-[#FFFAF5]/90 backdrop-blur-md border-b border-[#F9DDE5]/60 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F9DDE5] via-[#E9DFFF] to-[#FFF0B8] flex items-center justify-center shadow-xs">
            <span className="text-base">🌷</span>
          </div>
          <div>
            <span className="font-bold text-lg text-[#403344] font-['Nunito',sans-serif]">
              Baikology
            </span>
            <span className="hidden sm:inline-block text-[11px] text-[#817583] ml-2 font-medium">
              Understand Your Cycle
            </span>
          </div>
        </div>

        {/* Existing user shortcut to dashboard */}
        {currentUser?.isOnboardingCompleted && currentStep !== 8 && (
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-[#756291] hover:text-[#403344] bg-[#E9DFFF]/40 hover:bg-[#E9DFFF] px-3.5 py-1.5 rounded-full transition-colors"
          >
            Go to Dashboard &rarr;
          </button>
        )}
      </header>

      {/* Progress Bar (Visible for Sections 1 through 7) */}
      {currentStep >= 1 && currentStep <= 7 && (
        <div className="max-w-2xl w-full mx-auto px-4 pt-6 pb-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#756291] mb-2 uppercase tracking-wider">
            <span>{sectionTitles[currentStep]}</span>
            <span>Section {currentStep} of 7</span>
          </div>
          <div className="w-full h-2.5 bg-[#E9DFFF]/50 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#756291] rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Questionnaire Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        {/* ================= STEP 0: WELCOME SCREEN ================= */}
        {currentStep === 0 && (
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-[0_4px_24px_rgba(64,51,68,0.06)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Mascot / Flower Icon */}
            <div className="relative mx-auto w-28 h-28 rounded-full bg-gradient-to-b from-[#FFF0B8]/60 via-[#F9DDE5]/70 to-[#E9DFFF] flex items-center justify-center p-3 shadow-inner">
              <span className="text-5xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
                🌷
              </span>
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9DFFF] text-xs font-bold text-[#756291] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Cycle Assessment
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                Understand Your Cycle
              </h1>
              <p className="text-sm sm:text-base text-[#817583] leading-relaxed">
                A gentle questionnaire to understand your body. There are no right or wrong answers. Every question is optional unless marked otherwise.
              </p>
            </div>

            <div className="bg-[#FFFAF5] rounded-2xl p-4 text-xs text-[#817583] border border-[#F9DDE5] flex items-center gap-3 text-left">
              <Shield className="w-5 h-5 text-[#756291] shrink-0" />
              <span>
                <strong>Your comfort and privacy come first:</strong> You can answer only what feels right for you, or change your answers anytime in your profile settings.
              </span>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-base shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Begin questionnaire</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ================= SECTION 1: UNDERSTANDING YOUR PERIOD ================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-[0_4px_24px_rgba(64,51,68,0.06)] space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E9DFFF] text-[11px] font-bold text-[#756291] uppercase tracking-wider">
                Section 1 of 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-2">
                1. Understanding your period
              </h2>
              <p className="text-xs sm:text-sm text-[#817583] mt-1">
                Let's start with the basics of your menstrual rhythm.
              </p>
            </div>

            {/* Q1 */}
            <div className="space-y-2.5">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                1. Have you started menstruating?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {section1Options.startedMenstruating.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('startedMenstruating', opt)}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.startedMenstruating === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                2. At what age did you get your first period?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {section1Options.ageFirstPeriod.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('ageFirstPeriod', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.ageFirstPeriod === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                3. When did your last period start?
              </p>
              <div className="relative max-w-sm">
                <input
                  type="date"
                  value={formData.lastPeriodDate}
                  onChange={(e) => setSingleValue('lastPeriodDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E9DFFF] bg-[#FFFAF5] text-[#403344] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#756291] focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-[#817583]">
                Leave blank if you're not sure or don't track exact dates.
              </p>
            </div>

            {/* Q4 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                4. How many days does your period usually last?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {section1Options.periodDuration.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('periodDuration', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.periodDuration === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q5 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                5. How would you describe your menstrual cycle?
              </p>
              <div className="space-y-2">
                {section1Options.cycleRegularity.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('cycleRegularity', opt)}
                    className={`w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.cycleRegularity === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9DFFF]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#817583] hover:text-[#403344] hover:bg-[#FFFAF5] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: YOUR MENSTRUAL FLOW ================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-[0_4px_24px_rgba(64,51,68,0.06)] space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E9DFFF] text-[11px] font-bold text-[#756291] uppercase tracking-wider">
                Section 2 of 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-2">
                2. Your menstrual flow
              </h2>
              <p className="text-xs sm:text-sm text-[#817583] mt-1">
                Every flow pattern is unique and can fluctuate across cycles.
              </p>
            </div>

            {/* Q6 */}
            <div className="space-y-2.5">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                6. How would you describe your flow?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {section2Options.flowIntensity.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('flowIntensity', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.flowIntensity === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q7 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                7. On which days is your flow usually heaviest?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {section2Options.heaviestDays.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('heaviestDays', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.heaviestDays === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q8 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                8. Do you experience spotting between periods?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {section2Options.spottingBetween.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('spottingBetween', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.spottingBetween === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q9 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                9. Do you notice blood clots during your period?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {section2Options.bloodClots.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('bloodClots', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.bloodClots === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9DFFF]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#817583] hover:text-[#403344] hover:bg-[#FFFAF5] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 3: PERIOD SYMPTOMS ================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-[0_4px_24px_rgba(64,51,68,0.06)] space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E9DFFF] text-[11px] font-bold text-[#756291] uppercase tracking-wider">
                Section 3 of 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-2">
                3. Period symptoms
              </h2>
              <p className="text-xs sm:text-sm text-[#817583] mt-1">
                Your body's signals help us understand what provides comfort when symptoms flare.
              </p>
            </div>

            {/* Q10 */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm sm:text-base text-[#403344]">
                  10. What symptoms do you usually experience before or during your period?
                </p>
              </div>
              <p className="text-xs text-[#817583]">Select all that apply.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {section3Options.periodSymptoms.map((sym) => {
                  const isChecked = formData.periodSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleArrayItem('periodSymptoms', sym)}
                      className={`px-3 py-2.5 rounded-2xl text-xs sm:text-sm text-left border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#F9DDE5] border-[#756291] text-[#403344] font-semibold shadow-xs'
                          : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:bg-white'
                      }`}
                    >
                      <span>{sym}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ml-1.5 ${
                          isChecked
                            ? 'bg-[#756291] border-[#756291] text-white'
                            : 'border-[#817583]/40 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q11 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                11. How intense are your period cramps usually?
              </p>
              <div className="space-y-2">
                {section3Options.crampIntensity.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('crampIntensity', opt)}
                    className={`w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.crampIntensity === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q12 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                12. When do you usually experience cramps?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {section3Options.crampTiming.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('crampTiming', opt)}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.crampTiming === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q13 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                13. Do your symptoms interfere with your daily activities?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {section3Options.dailyDisruption.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('dailyDisruption', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.dailyDisruption === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9DFFF]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#817583] hover:text-[#403344] hover:bg-[#FFFAF5] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: MOOD AND EMOTIONAL CHANGES ================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-[0_4px_24px_rgba(64,51,68,0.06)] space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E9DFFF] text-[11px] font-bold text-[#756291] uppercase tracking-wider">
                Section 4 of 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-2">
                4. Mood and emotional changes
              </h2>
              <p className="text-xs sm:text-sm text-[#817583] mt-1">
                Hormonal shifts directly interact with neurotransmitters. There is no shame in emotional fluctuations.
              </p>
            </div>

            {/* Q14 */}
            <div className="space-y-2.5">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                14. Do you notice mood changes around your period?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {section4Options.moodChangesAroundPeriod.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('moodChangesAroundPeriod', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.moodChangesAroundPeriod === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q15 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                15. What emotional changes do you experience?
              </p>
              <p className="text-xs text-[#817583]">Select all that apply.</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {section4Options.emotionalChanges.map((item) => {
                  const isChecked = formData.emotionalChanges.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayItem('emotionalChanges', item)}
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm text-left border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#F9DDE5] border-[#756291] text-[#403344] font-semibold shadow-xs'
                          : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:bg-white'
                      }`}
                    >
                      <span>{item}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ml-1.5 ${
                          isChecked
                            ? 'bg-[#756291] border-[#756291] text-white'
                            : 'border-[#817583]/40 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q16 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                16. When do you notice these mood changes?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {section4Options.moodChangeTiming.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('moodChangeTiming', opt)}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.moodChangeTiming === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9DFFF]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#817583] hover:text-[#403344] hover:bg-[#FFFAF5] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 5: LIFESTYLE AND CYCLE PATTERNS ================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-[0_4px_24px_rgba(64,51,68,0.06)] space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E9DFFF] text-[11px] font-bold text-[#756291] uppercase tracking-wider">
                Section 5 of 7
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-2">
                5. Lifestyle and cycle patterns
              </h2>
              <p className="text-xs sm:text-sm text-[#817583] mt-1">
                Sleep, exercise, appetite, and skin all connect dynamically to cycle rhythm.
              </p>
            </div>

            {/* Q17 */}
            <div className="space-y-2.5">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                17. How would you describe your sleep?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {section5Options.sleepPattern.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('sleepPattern', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.sleepPattern === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q18 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                18. How physically active are you?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {section5Options.physicalActivity.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('physicalActivity', opt)}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.physicalActivity === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q19 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                19. Do you notice changes in your appetite during your cycle?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {section5Options.appetiteChanges.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('appetiteChanges', opt)}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.appetiteChanges === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q20 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                20. Do you notice changes in your skin throughout your cycle?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {section5Options.skinChanges.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('skinChanges', opt)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.skinChanges === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9DFFF]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#817583] hover:text-[#403344] hover:bg-[#FFFAF5] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 6: YOUR HEALTH BACKGROUND ================= */}
        {currentStep === 6 && (
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-[0_4px_24px_rgba(64,51,68,0.06)] space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E9DFFF] text-[11px] font-bold text-[#756291] uppercase tracking-wider">
                Section 6 of 7 · Health Background
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-2">
                6. Your health background
              </h2>
              <p className="text-xs sm:text-sm text-[#817583] mt-1">
                These questions are optional and include clear explanations for why they're being asked.
              </p>
            </div>

            {/* Q21 */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <p className="font-semibold text-sm sm:text-base text-[#403344]">
                  21. Have you ever been diagnosed with any of these conditions?
                </p>
                <div className="p-3 rounded-2xl bg-[#FFFAF5] border border-[#F9DDE5] text-[11px] text-[#756291] flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-[#756291] mt-0.5" />
                  <span>
                    <strong>Why we ask:</strong> Conditions like PCOS, thyroid disorders, or endometriosis directly alter cycle lengths and hormonal baselines. Knowing this prevents our algorithm from treating natural variance as an anomaly.
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#817583]">Select all that apply.</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {section6Options.diagnosedConditions.map((cond) => {
                  const isChecked = formData.diagnosedConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleArrayItem('diagnosedConditions', cond)}
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm text-left border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#F9DDE5] border-[#756291] text-[#403344] font-semibold shadow-xs'
                          : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:bg-white'
                      }`}
                    >
                      <span>{cond}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ml-1.5 ${
                          isChecked
                            ? 'bg-[#756291] border-[#756291] text-white'
                            : 'border-[#817583]/40 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q22 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <div className="space-y-1">
                <p className="font-semibold text-sm sm:text-base text-[#403344]">
                  22. Are you currently using hormonal contraception or medication that affects your cycle?
                </p>
                <div className="p-3 rounded-2xl bg-[#FFFAF5] border border-[#F9DDE5] text-[11px] text-[#756291] flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-[#756291] mt-0.5" />
                  <span>
                    <strong>Why we ask:</strong> Hormonal pills, rings, implants, or injections often suppress natural ovulation or create withdrawal bleeds rather than true menstrual periods.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {section6Options.hormonalMedication.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('hormonalMedication', opt)}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.hormonalMedication === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q23 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <div className="space-y-1">
                <p className="font-semibold text-sm sm:text-base text-[#403344]">
                  23. Has your cycle changed significantly in the last 6 months?
                </p>
                <div className="p-3 rounded-2xl bg-[#FFFAF5] border border-[#F9DDE5] text-[11px] text-[#756291] flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-[#756291] mt-0.5" />
                  <span>
                    <strong>Why we ask:</strong> Sudden shifts can indicate life adjustments (stress, travel, sleep changes) or emerging hormonal transitions.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {section6Options.cycleChangedRecently.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSingleValue('cycleChangedRecently', opt)}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border text-left transition-all ${
                      formData.cycleChangedRecently === opt
                        ? 'bg-[#E9DFFF] border-[#756291] text-[#403344] font-bold shadow-xs'
                        : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:border-[#756291] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9DFFF]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#817583] hover:text-[#403344] hover:bg-[#FFFAF5] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION 7: WHAT DOES YOUR BODY NEED? ================= */}
        {currentStep === 7 && (
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-[0_4px_24px_rgba(64,51,68,0.06)] space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E9DFFF] text-[11px] font-bold text-[#756291] uppercase tracking-wider">
                Section 7 of 7 · Personal Care
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-2">
                7. What does your body need?
              </h2>
              <p className="text-xs sm:text-sm text-[#817583] mt-1">
                Tell us how you would like Baikology to support and gently remind you.
              </p>
            </div>

            {submitError && (
              <div className="p-3.5 bg-[#FFF0F0] text-[#D32F2F] text-xs font-semibold rounded-2xl border border-[#FFCDD2] flex items-center gap-2">
                <span>⚠️ {submitError}</span>
              </div>
            )}

            {/* Q24 */}
            <div className="space-y-2.5">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                24. What would you like Baikology to help you understand?
              </p>
              <p className="text-xs text-[#817583]">Select all that apply.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section7Options.goalsBaikologyHelp.map((goal) => {
                  const isChecked = formData.goalsBaikologyHelp.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleArrayItem('goalsBaikologyHelp', goal)}
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm text-left border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#F9DDE5] border-[#756291] text-[#403344] font-semibold shadow-xs'
                          : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:bg-white'
                      }`}
                    >
                      <span>{goal}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ml-1.5 ${
                          isChecked
                            ? 'bg-[#756291] border-[#756291] text-white'
                            : 'border-[#817583]/40 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q25 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                25. Would you like gentle reminders?
              </p>
              <p className="text-xs text-[#817583]">Select all that apply.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section7Options.remindersPreference.map((rem) => {
                  const isChecked = formData.remindersPreference.includes(rem);
                  return (
                    <button
                      key={rem}
                      type="button"
                      onClick={() => toggleArrayItem('remindersPreference', rem)}
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm text-left border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#F9DDE5] border-[#756291] text-[#403344] font-semibold shadow-xs'
                          : 'bg-[#FFFAF5] border-[#E9DFFF]/70 text-[#817583] hover:bg-white'
                      }`}
                    >
                      <span>{rem}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ml-1.5 ${
                          isChecked
                            ? 'bg-[#756291] border-[#756291] text-white'
                            : 'border-[#817583]/40 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q26 */}
            <div className="space-y-2.5 pt-4 border-t border-[#F9DDE5]/40">
              <p className="font-semibold text-sm sm:text-base text-[#403344]">
                26. Is there anything else about your cycle you'd like us to know?
              </p>
              <p className="text-[11px] text-[#817583]">Optional open-ended response.</p>
              <textarea
                rows={3}
                value={formData.anythingElse}
                onChange={(e) => setSingleValue('anythingElse', e.target.value)}
                placeholder="Share any other details, past experiences, or questions you have..."
                className="w-full px-4 py-3 rounded-2xl border border-[#E9DFFF] bg-[#FFFAF5] text-[#403344] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#756291] focus:bg-white transition-all"
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9DFFF]">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#817583] hover:text-[#403344] hover:bg-[#FFFAF5] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-sm shadow-md hover:shadow-lg inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving your space...</span>
                  </>
                ) : (
                  <>
                    <span>Complete questionnaire</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 8: CELEBRATION / COMPLETION SCREEN ================= */}
        {currentStep === 8 && (
          <div className="bg-white rounded-[36px] p-6 sm:p-12 border border-[#E9DFFF] shadow-[0_4px_30px_rgba(64,51,68,0.08)] text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative mx-auto w-32 h-32 rounded-full bg-gradient-to-tr from-[#FFF0B8] via-[#F9DDE5] to-[#E9DFFF] flex items-center justify-center p-3 shadow-md">
              <span className="text-6xl animate-pulse">🌷</span>
              <div className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-xs text-xl">
                ✨
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DE] text-xs font-bold text-[#2C6336] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#367942]" />
                Cycle profile saved
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                You're all set! 💛<br />Welcome to Baikology.
              </h1>
              <p className="text-sm sm:text-base text-[#817583]">
                Thank you for sharing with us. Your private dashboard is now customized around your cycle and body needs.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-left">
              <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#F9DDE5]">
                <div className="text-lg mb-1">🌿</div>
                <div className="text-xs font-bold text-[#403344]">Your journey</div>
                <div className="text-[11px] text-[#817583]">At your natural tempo</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]">
                <div className="text-lg mb-1">🔒</div>
                <div className="text-xs font-bold text-[#403344]">Your privacy</div>
                <div className="text-[11px] text-[#817583]">Secure & never sold</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#FFF0B8]">
                <div className="text-lg mb-1">💬</div>
                <div className="text-xs font-bold text-[#403344]">Your questions</div>
                <div className="text-[11px] text-[#817583]">Clear & science-grounded</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#DDF3DE]">
                <div className="text-lg mb-1">✨</div>
                <div className="text-xs font-bold text-[#403344]">Your pace</div>
                <div className="text-[11px] text-[#817583]">Zero streak pressure</div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto min-w-[260px] px-8 py-4 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Enter Baikology</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
