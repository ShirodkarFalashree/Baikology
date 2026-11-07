import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import {
  Home,
  Calendar,
  Smile,
  LineChart,
  BookOpen,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  ArrowRight,
  Shield,
  Heart,
  Droplet,
  ChevronRight,
  ChevronLeft,
  Search,
  Bell,
  Check,
  Edit3,
  RefreshCw,
  Loader2,
  CalendarDays,
  Info,
  Sparkle,
} from 'lucide-react';
import { getCurrentUser, logMoodCheckIn } from '../api/auth';
import {
  analyzeCycle,
  generateMonthCalendar,
  formatDate,
  formatShortDate,
} from '../utils/cycleEngine';
import DearDiaryChatbot from '../components/DearDiaryChatbot';

export default function DashboardPage({ initialTab = 'home' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab: paramTab } = useParams();

  // Helper to determine active tab from route / URL
  const getTabFromRoute = useCallback(() => {
    const path = location.pathname.toLowerCase();
    if (paramTab) {
      if (paramTab === 'cycle' || paramTab === 'my-cycle') return 'cycle';
      if (paramTab === 'mood' || paramTab === 'mood-check-in') return 'mood';
      if (paramTab === 'learn' || paramTab === 'articles') return 'learn';
      if (paramTab === 'settings' || paramTab === 'profile') return 'settings';
      return 'home';
    }
    if (path.startsWith('/cycle') || path.startsWith('/my-cycle')) return 'cycle';
    if (path.startsWith('/mood')) return 'mood';
    if (path.startsWith('/learn') || path.startsWith('/insights')) return 'learn';
    if (path.startsWith('/profile') || path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/dashboard') || path.startsWith('/home')) return 'home';
    return initialTab;
  }, [location.pathname, paramTab, initialTab]);

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(getTabFromRoute);

  // Sync tab with URL changes
  useEffect(() => {
    const currentRouteTab = getTabFromRoute();
    setActiveTab(currentRouteTab);
  }, [getTabFromRoute]);

  const handleTabChange = (targetTab) => {
    setActiveTab(targetTab);
    if (targetTab === 'home') {
      navigate('/dashboard');
    } else if (targetTab === 'cycle') {
      navigate('/cycle');
    } else if (targetTab === 'mood') {
      navigate('/mood');
    } else if (targetTab === 'learn') {
      navigate('/learn');
    } else if (targetTab === 'settings') {
      navigate('/profile');
    }
  };

  // Mood logs state (synced with MongoDB & daily check-in)
  const [moodLogs, setMoodLogs] = useState([]);
  const [moodNote, setMoodNote] = useState('');
  const [moodToast, setMoodToast] = useState(null);
  const [quickLogCell, setQuickLogCell] = useState(null);

  // Calendar month state
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [selectedCalendarCell, setSelectedCalendarCell] = useState(null);

  // Interactive dashboard state
  const [todayMood, setTodayMood] = useState({
    label: 'Calm',
    desc: 'Peaceful & grounded',
    emoji: '😌',
    color: '#DDF3DE',
    textColor: '#2C6336',
  });
  const [previousMood, setPreviousMood] = useState(null);
  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [forYouCategory, setForYouCategory] = useState('insights'); // insights | learn | selfcare

  // Fetch verified user from database
  useEffect(() => {
    async function loadDashboardUser() {
      const token = localStorage.getItem('baikology_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await getCurrentUser(token);
        if (response.success && response.data?.user) {
          const userData = response.data.user;
          setUser(userData);
          localStorage.setItem('baikology_user', JSON.stringify(userData));

          const userMoods = userData.moodLogs || [];
          setMoodLogs(userMoods);

          // Check if today's mood was already checked in
          const todayStr = new Date().toISOString().split('T')[0];
          const foundToday = userMoods.find((m) => m.date === todayStr);
          if (foundToday) {
            setTodayMood(foundToday);
            setMoodNote(foundToday.note || '');
          }

          // Check DB: if user has NOT completed the questionnaire, redirect to questionnaire!
          const hasCompleted = Boolean(userData.isOnboardingCompleted);

          if (!hasCompleted) {
            navigate('/onboarding');
            return;
          }
        } else {
          // Token invalid
          localStorage.removeItem('baikology_token');
          localStorage.removeItem('baikology_user');
          navigate('/login');
          return;
        }
      } catch (err) {
        console.error('Failed to load user info:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardUser();
  }, [navigate]);

  const q = user?.questionnaire || {};

  // Comprehensive Cycle Analysis from User Questionnaire Profile (Hooks called unconditionally at top level)
  const cycleAnalysis = useMemo(() => {
    return analyzeCycle(q);
  }, [q]);

  const monthCalendarCells = useMemo(() => {
    return generateMonthCalendar(
      calendarViewDate.getFullYear(),
      calendarViewDate.getMonth(),
      cycleAnalysis,
      moodLogs
    );
  }, [calendarViewDate, cycleAnalysis, moodLogs]);

  const formattedMonthName = calendarViewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCalendarViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedCalendarCell(null);
  };

  const handleNextMonth = () => {
    setCalendarViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedCalendarCell(null);
  };

  const handleSaveMood = async (moodObj, noteText = '', targetDate = null) => {
    const dateKey = targetDate || new Date().toISOString().split('T')[0];
    const token = localStorage.getItem('baikology_token');

    const moodEntry = {
      date: dateKey,
      label: moodObj.label,
      emoji: moodObj.emoji,
      color: moodObj.color,
      textColor: moodObj.textColor,
      note: noteText,
    };

    if (!targetDate || targetDate === new Date().toISOString().split('T')[0]) {
      if (todayMood && todayMood.label !== moodObj.label) {
        setPreviousMood(todayMood);
      }
      setTodayMood(moodEntry);
      setMoodNote(noteText);
    }

    setMoodLogs((prev) => {
      const filtered = prev.filter((m) => m.date !== dateKey);
      return [...filtered, moodEntry];
    });

    setIsMoodPickerOpen(false);
    setQuickLogCell(null);

    setMoodToast({
      message: `Checked in as ${moodObj.emoji} ${moodObj.label}! Stored in database & marked on calendar 🌸`,
    });
    setTimeout(() => setMoodToast(null), 3500);

    if (token) {
      try {
        const res = await logMoodCheckIn(moodEntry, token);
        if (res && res.data?.moodLogs) {
          setMoodLogs(res.data.moodLogs);
        }
      } catch (err) {
        console.error('Failed to sync mood check-in to server:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('baikology_token');
    localStorage.removeItem('baikology_user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-full bg-[#E9DFFF] flex items-center justify-center animate-spin mb-4">
          <Sparkles className="w-7 h-7 text-[#756291]" />
        </div>
        <p className="text-[#403344] font-medium font-['Nunito',sans-serif] text-base">
          Opening your private dashboard...
        </p>
      </div>
    );
  }

  const userName = user?.name || user?.questionnaire?.preferredName || 'lovely';
  const preferredName = userName;
  const startedMenstruating = q.startedMenstruating || 'Yes';
  const ageFirstPeriod = q.ageFirstPeriod || 'Not specified';
  const lastPeriodDate = q.lastPeriodDate || '';
  const periodDuration = q.periodDuration || '5–6 days';
  const cycleRegularity = q.cycleRegularity || 'Regular (comes around the same time)';
  const flowIntensity = q.flowIntensity || 'Moderate';
  const heaviestDays = q.heaviestDays || 'Day 2';
  const periodSymptoms = Array.isArray(q.periodSymptoms) ? q.periodSymptoms : [];
  const crampIntensity = q.crampIntensity || 'Mild';
  const emotionalChanges = Array.isArray(q.emotionalChanges) ? q.emotionalChanges : [];
  const sleepPattern = q.sleepPattern || '7–8 hours';
  const physicalActivity = q.physicalActivity || 'Moderately active';
  const diagnosedConditions = Array.isArray(q.diagnosedConditions) ? q.diagnosedConditions : [];
  const hormonalMedication = q.hormonalMedication || 'No';
  const goalsBaikologyHelp = Array.isArray(q.goalsBaikologyHelp) ? q.goalsBaikologyHelp : [];
  const remindersPreference = Array.isArray(q.remindersPreference) ? q.remindersPreference : [];

  const calculatedCycleDay = cycleAnalysis.cycleDay;
  const phaseName = cycleAnalysis.phaseName;
  const phaseDesc = cycleAnalysis.phaseHeadline;
  const estimatedDaysToPeriod = cycleAnalysis.daysUntilNextPeriod;

  const moodOptions = [
    { label: 'Happy', desc: 'Sunny & energized', emoji: '😊', color: '#FFF0B8', textColor: '#826500' },
    { label: 'Calm', desc: 'Peaceful & grounded', emoji: '😌', color: '#DDF3DE', textColor: '#2C6336' },
    { label: 'Meh', desc: 'In-between / okay-ish', emoji: '😐', color: '#F3E8FF', textColor: '#6B21A8' },
    { label: 'Overwhelmed', desc: 'Heavy on my mind', emoji: '🤯', color: '#FFE4E6', textColor: '#9F1239' },
    { label: 'Low', desc: 'Tender & quiet', emoji: '🥺', color: '#E0E7FF', textColor: '#3730A3' },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F4] text-[#403344] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col md:flex-row selection:bg-[#F9DDE5]">
      {/* Toast Notification for DB & Calendar Sync */}
      {moodToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#403344] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
          <span>🌸</span>
          <span>{moodToast.message}</span>
        </div>
      )}

      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E9DFFF]/70 flex flex-col shrink-0 p-5 justify-between">
        <div className="space-y-6">
          {/* Baikology Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F9DDE5] via-[#E9DFFF] to-[#FFF0B8] flex items-center justify-center shadow-xs">
              <span className="text-lg">🌸</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#403344] font-['Nunito',sans-serif] block">
                Baikology
              </span>
              <span className="text-[10px] text-[#817583] font-medium block -mt-1">
                Your private health space
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => handleTabChange('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-[#E9DFFF] text-[#403344] shadow-xs'
                  : 'text-[#817583] hover:bg-[#FFFAF5] hover:text-[#403344]'
              }`}
            >
              <Home className="w-4 h-4 text-[#756291]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleTabChange('cycle')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'cycle'
                  ? 'bg-[#E9DFFF] text-[#403344] shadow-xs'
                  : 'text-[#817583] hover:bg-[#FFFAF5] hover:text-[#403344]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#756291]" />
              <span>My Cycle</span>
            </button>

            <button
              onClick={() => handleTabChange('mood')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'mood'
                  ? 'bg-[#E9DFFF] text-[#403344] shadow-xs'
                  : 'text-[#817583] hover:bg-[#FFFAF5] hover:text-[#403344]'
              }`}
            >
              <Smile className="w-4 h-4 text-[#756291]" />
              <span>Mood Check-in</span>
            </button>

            <button
              onClick={() => handleTabChange('learn')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'learn'
                  ? 'bg-[#E9DFFF] text-[#403344] shadow-xs'
                  : 'text-[#817583] hover:bg-[#FFFAF5] hover:text-[#403344]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#756291]" />
              <span>Learn & Articles</span>
            </button>

            <button
              onClick={() => handleTabChange('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#E9DFFF] text-[#403344] shadow-xs'
                  : 'text-[#817583] hover:bg-[#FFFAF5] hover:text-[#403344]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#756291]" />
              <span>Profile & Questionnaire</span>
            </button>
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="pt-6 border-t border-[#E9DFFF]/70 space-y-3">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-[#FFFAF5] border border-[#F9DDE5]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#E9DFFF] text-[#756291] font-bold flex items-center justify-center shrink-0 text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#403344] truncate">
                  {userName}
                </p>
                <p className="text-[11px] text-[#817583] truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-xl hover:bg-[#F9DDE5] text-[#817583] hover:text-[#403344] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-8 space-y-8">
        {/* Top greeting bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DE] text-[11px] font-bold text-[#2C6336] uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-[#367942]" />
              Baikology Space · Cycle Profile Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
              Good morning, {userName}! 🌸
            </h1>
            <p className="text-xs sm:text-sm text-[#817583]">
              Here's a gentle overview of where you are in your cycle and wellness journey.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMoodPickerOpen(true)}
              className="px-4 py-2.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log mood</span>
            </button>
          </div>
        </div>

        {/* ================= TAB: HOME (Dashboard Screen 07) ================= */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Dynamic Cycle Day & Biological Phase Banner */}
            <div className="bg-gradient-to-br from-[#FFF8EE] via-[#FDF5F7] to-[#F5EFFF] rounded-[32px] p-6 sm:p-8 border border-[#E9DFFF] shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10 max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-[#E9DFFF] text-xs font-bold text-[#756291]">
                  <span>Cycle Day {cycleAnalysis.cycleDay}</span>
                  <span>•</span>
                  <span className="text-[#403344]">{cycleAnalysis.phaseName}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                  {cycleAnalysis.phaseHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-[#817583] leading-relaxed">
                  {cycleAnalysis.phaseDescription}
                </p>
              </div>

              <div className="relative z-10 pt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleTabChange('cycle')}
                  className="px-5 py-2.5 rounded-full bg-[#403344] hover:bg-[#2b222e] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View cycle calendar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-[#756291] font-semibold bg-white/80 px-3 py-1.5 rounded-full border border-[#E9DFFF]">
                  Next period: {cycleAnalysis.nextPeriodDateFormatted} (~{cycleAnalysis.daysUntilNextPeriod} days)
                </span>
                <span className="text-[11px] text-[#2C6336] font-semibold bg-[#DDF3DE]/80 px-3 py-1.5 rounded-full border border-[#DDF3DE]">
                  Cycle rhythm: {cycleAnalysis.cycleLength} days
                </span>
              </div>

              {/* Decorative serene illustration badge */}
              <div className="absolute right-4 bottom-2 text-7xl select-none opacity-85 hidden sm:block pointer-events-none">
                🧘‍♀️
              </div>
            </div>

            {/* ================= MOOD BOARD & AI CHATBOT (DEAR DIARY) SIDE-BY-SIDE ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left: The Mood Board (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white rounded-[32px] p-6 border border-[#E9DFFF] shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#817583] uppercase tracking-wider">
                        Today's Mood Board
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DDF3DE] text-[#2C6336] border border-[#DDF3DE]">
                        Live
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMoodPickerOpen(true)}
                      className="text-xs font-bold text-[#756291] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      Change
                    </button>
                  </div>

                  {/* Active Mood Tile */}
                  <div
                    className="p-4 sm:p-5 rounded-2xl flex items-center gap-4 border transition-all shadow-2xs"
                    style={{ backgroundColor: todayMood.color, borderColor: todayMood.textColor + '33' }}
                  >
                    <span className="text-4xl select-none">{todayMood.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-lg" style={{ color: todayMood.textColor }}>
                          {todayMood.label}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/70" style={{ color: todayMood.textColor }}>
                          Current
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 opacity-90" style={{ color: todayMood.textColor }}>
                        {todayMood.desc}
                      </p>
                    </div>
                  </div>

                  {/* Mood Shift Banner (Notices when user changes mood e.g. Happy -> Sad or Sad -> Happy) */}
                  {previousMood && previousMood.label !== todayMood.label && (
                    <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#FFF8EE] to-[#FDF5F7] border border-[#F9DDE5] text-xs space-y-1 animate-in fade-in">
                      <div className="text-[10px] font-bold uppercase text-[#756291] flex items-center gap-1">
                        <span>✨ Mood shift recorded today:</span>
                      </div>
                      <div className="font-semibold text-[#403344] flex items-center gap-2">
                        <span>{previousMood.emoji} {previousMood.label}</span>
                        <span className="text-[#817583]">&rarr;</span>
                        <span className="font-bold text-[#756291]">{todayMood.emoji} {todayMood.label}</span>
                      </div>
                      <p className="text-[11px] text-[#817583]">
                        Your AI Dear Diary companion beside you noticed this change 💜
                      </p>
                    </div>
                  )}

                  {/* 1-Tap Quick Mood Selector */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[11px] font-bold text-[#817583] uppercase tracking-wider block">
                      Quick Check-in (Tap to update)
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {moodOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleSaveMood(opt)}
                          title={`${opt.label}: ${opt.desc}`}
                          className={`p-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border cursor-pointer ${
                            todayMood?.label === opt.label
                              ? 'ring-2 ring-[#756291] shadow-xs scale-105 font-bold'
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: opt.color,
                            borderColor: opt.textColor + '40',
                            color: opt.textColor,
                          }}
                        >
                          <span className="text-xl">{opt.emoji}</span>
                          <span className="text-[10px] truncate max-w-full">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F9DDE5]/40 text-xs text-[#817583] flex items-center justify-between">
                  <span>Synced with AI Diary & Calendar</span>
                  <span className="text-[11px] bg-[#DDF3DE] text-[#2C6336] font-semibold px-2.5 py-0.5 rounded-md border border-[#DDF3DE]">
                    🔒 Saved to database
                  </span>
                </div>
              </div>

              {/* Right: AI Dear Diary Chatbot (lg:col-span-7) */}
              <div className="lg:col-span-7">
                <DearDiaryChatbot
                  userName={userName}
                  todayMood={todayMood}
                  previousMood={previousMood}
                  cycleAnalysis={cycleAnalysis}
                  onOpenMoodPicker={() => setIsMoodPickerOpen(true)}
                />
              </div>
            </div>

            {/* 4 Quick Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E9DFFF] shadow-xs">
                <div className="text-[11px] font-bold text-[#817583] uppercase tracking-wider">
                  Next period
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-1">
                  ~{cycleAnalysis.daysUntilNextPeriod} days
                </div>
                <div className="text-[11px] text-[#756291] font-medium mt-0.5 truncate">
                  {cycleAnalysis.nextPeriodDateFormatted}
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E9DFFF] shadow-xs">
                <div className="text-[11px] font-bold text-[#817583] uppercase tracking-wider">
                  Cycle rhythm
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-1">
                  {cycleAnalysis.cycleLength} days
                </div>
                <div className="text-[11px] text-[#756291] font-medium mt-0.5">
                  Bleed: ~{cycleAnalysis.bleedDuration} days
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E9DFFF] shadow-xs">
                <div className="text-[11px] font-bold text-[#817583] uppercase tracking-wider">
                  Symptoms noted
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-1">
                  {periodSymptoms.length > 0 ? `${periodSymptoms.length} noted` : 'Gentle'}
                </div>
                <div className="text-[11px] text-[#756291] font-medium mt-0.5">
                  Cramps: {crampIntensity}
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E9DFFF] shadow-xs">
                <div className="text-[11px] font-bold text-[#817583] uppercase tracking-wider">
                  Flow pattern
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif] mt-1">
                  {flowIntensity}
                </div>
                <div className="text-[11px] text-[#2C6336] font-medium mt-0.5">
                  Peak on {heaviestDays}
                </div>
              </div>
            </div>

            {/* ================= DASHBOARD MAIN CALENDAR: MOOD TRACKING & CYCLE MILESTONES ================= */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E9DFFF] shadow-xs space-y-6">
              {/* Header with Month Navigation and Log Mood Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9DFFF] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                      Dashboard Calendar 🌸
                    </h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E9DFFF] text-[#756291]">
                      Mood & Cycle
                    </span>
                  </div>
                  <p className="text-xs text-[#817583] mt-0.5">
                    Track everyday moods and important period dates together in your calendar. Saved to your database profile.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Month Navigation */}
                  <div className="flex items-center gap-1.5 bg-[#FFFAF5] px-3 py-1.5 rounded-full border border-[#E9DFFF]">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 rounded-full hover:bg-[#E9DFFF] text-[#403344] transition-colors"
                      title="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-[#403344] min-w-[105px] text-center">
                      {formattedMonthName}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 rounded-full hover:bg-[#E9DFFF] text-[#403344] transition-colors"
                      title="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setCalendarViewDate(new Date());
                      setSelectedCalendarCell(null);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#E9DFFF] hover:bg-[#d8c7fd] text-[#756291] text-xs font-bold transition-colors"
                  >
                    Today
                  </button>

                  <button
                    onClick={() => {
                      setQuickLogCell({
                        dateKey: new Date().toISOString().split('T')[0],
                        dayNum: new Date().getDate(),
                      });
                      setIsMoodPickerOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Check in mood</span>
                  </button>
                </div>
              </div>

              {/* 1-Tap Quick Mood Check-in Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF8EE] via-[#FDF5F7] to-[#F5EFFF] border border-[#E9DFFF] flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#E9DFFF] flex items-center justify-center text-xl shadow-xs shrink-0">
                    {todayMood?.emoji || '😌'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#403344] flex items-center gap-1.5">
                      <span>Quick Mood Check-in</span>
                      <span className="text-[10px] text-[#756291] bg-white px-2 py-0.5 rounded-md border border-[#E9DFFF]">
                        Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#817583]">
                      Tap an emotion below to log it into your database and calendar:
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {moodOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleSaveMood(opt)}
                      title={`${opt.label}: ${opt.desc}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        todayMood?.label === opt.label
                          ? 'ring-2 ring-[#756291] shadow-xs scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: opt.color,
                        borderColor: opt.textColor + '40',
                        color: opt.textColor,
                      }}
                    >
                      <span>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 7-Column Calendar Grid with Mood & Cycle Highlights */}
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-xs font-bold text-[#817583] py-1 uppercase tracking-wider text-[11px]">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {monthCalendarCells.map((cell, idx) => {
                    if (cell.isPadding) {
                      return <div key={`pad-dash-${idx}`} className="h-16 sm:h-20 rounded-2xl opacity-0" />;
                    }

                    let cellBg = 'bg-[#FFFAF5] hover:bg-white text-[#403344] border border-[#E9DFFF]/70';
                    let phaseTag = '';
                    let phaseTagColor = '';

                    if (cell.phaseType === 'menstrual') {
                      cellBg = 'bg-[#F9DDE5]/90 hover:bg-[#F9DDE5] text-[#9F1239] border-[#F9DDE5] font-bold';
                      phaseTag = 'Period Bleed';
                      phaseTagColor = 'bg-[#F9DDE5] text-[#9F1239] border border-[#9F1239]/20';
                    } else if (cell.phaseType === 'follicular') {
                      cellBg = 'bg-[#DDF3DE]/80 hover:bg-[#DDF3DE] text-[#2C6336] border-[#DDF3DE] font-medium';
                      phaseTag = 'Follicular';
                      phaseTagColor = 'bg-[#DDF3DE] text-[#2C6336] border border-[#2C6336]/20';
                    } else if (cell.phaseType === 'ovulation-peak') {
                      cellBg = 'bg-[#FFF0B8] hover:bg-[#ffe88a] text-[#826500] border-[#756291] font-extrabold shadow-xs';
                      phaseTag = 'Ovulation Peak';
                      phaseTagColor = 'bg-[#FFF0B8] text-[#826500] border border-[#826500]/30';
                    } else if (cell.phaseType === 'ovulation-window') {
                      cellBg = 'bg-[#FFF8D6]/80 hover:bg-[#FFF0B8] text-[#826500] border-[#FFF0B8]';
                      phaseTag = 'Fertile Window';
                      phaseTagColor = 'bg-[#FFF8D6] text-[#826500] border border-[#826500]/20';
                    } else if (cell.phaseType === 'luteal') {
                      cellBg = 'bg-[#F3E8FF]/80 hover:bg-[#F3E8FF] text-[#6B21A8] border-[#F3E8FF]';
                      phaseTag = 'Luteal Phase';
                      phaseTagColor = 'bg-[#F3E8FF] text-[#6B21A8] border border-[#6B21A8]/20';
                    }

                    return (
                      <div
                        key={`dash-cell-${cell.dayNum}`}
                        onClick={() => {
                          setQuickLogCell(cell);
                          setIsMoodPickerOpen(true);
                        }}
                        className={`h-16 sm:h-20 rounded-2xl p-1.5 flex flex-col justify-between transition-all cursor-pointer group hover:shadow-md ${cellBg} ${
                          cell.isToday ? 'ring-2 ring-[#756291] shadow-xs' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs sm:text-sm ${cell.isToday ? 'font-extrabold underline' : 'font-semibold'}`}>
                            {cell.dayNum}
                          </span>
                          {cell.isToday && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#756291]" title="Today" />
                          )}
                        </div>

                        {/* Middle: Mood Check-in Display */}
                        <div className="flex items-center justify-center my-auto">
                          {cell.mood ? (
                            <div
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/95 shadow-xs border border-[#E9DFFF]"
                              title={`Checked in: ${cell.mood.label}${cell.mood.note ? ' - ' + cell.mood.note : ''}`}
                            >
                              <span className="text-sm sm:text-base leading-none">{cell.mood.emoji}</span>
                              <span className="text-[9px] font-bold hidden sm:inline text-[#403344] truncate max-w-[48px]">
                                {cell.mood.label}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#817583]/40 group-hover:text-[#756291] group-hover:scale-110 transition-all font-semibold opacity-0 group-hover:opacity-100">
                              + Mood
                            </span>
                          )}
                        </div>

                        {/* Bottom: Period Phase Label */}
                        <div className="w-full text-center">
                          {phaseTag ? (
                            <span className={`text-[8px] sm:text-[9px] font-bold px-1 py-0.2 rounded-sm block truncate ${phaseTagColor}`}>
                              {phaseTag}
                            </span>
                          ) : (
                            <span className="text-[9px] text-transparent select-none">-</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E9DFFF] text-xs text-[#817583]">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#F9DDE5] border border-[#9F1239]/30" />
                    <span>Period bleed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FFF0B8] border border-[#826500]/30" />
                    <span>Ovulation / Fertile</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#F3E8FF] border border-[#6B21A8]/30" />
                    <span>Luteal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#DDF3DE] border border-[#2C6336]/30" />
                    <span>Follicular</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border-2 border-[#756291]" />
                    <span>Today</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[#756291] font-semibold text-[11px] bg-[#FFFAF5] px-3 py-1 rounded-full border border-[#E9DFFF]">
                  <span>💡 Tap any date to track or update your mood in DB</span>
                </div>
              </div>
            </div>

            {/* "For You Today" Curated Section */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E9DFFF] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                    For you today 🌸
                  </h3>
                  <p className="text-xs text-[#817583]">
                    Personalized insights based on your selected interests.
                  </p>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-1.5 bg-[#FFFAF5] p-1 rounded-full border border-[#E9DFFF]">
                  {['insights', 'learn', 'selfcare'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setForYouCategory(cat)}
                      className={`px-3.5 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                        forYouCategory === cat
                          ? 'bg-white text-[#403344] shadow-xs'
                          : 'text-[#817583] hover:text-[#403344]'
                      }`}
                    >
                      {cat === 'selfcare' ? 'Self-care' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Content based on forYouCategory */}
              {forYouCategory === 'insights' && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF8EE] to-[#FDF5F7] border border-[#F9DDE5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F9DDE5] flex items-center justify-center text-2xl shrink-0">
                      🫀
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E9DFFF] text-[#756291]">
                          Cycle Science
                        </span>
                        <span className="text-xs text-[#817583]">4 min read</span>
                      </div>
                      <h4 className="font-extrabold text-base text-[#403344]">
                        Ovulatory Window: what's happening in your body?
                      </h4>
                      <p className="text-xs text-[#817583] mt-0.5 max-w-xl">
                        Hormones aren't unpredictable chaos — they follow a rhythmic biological conversation between brain and ovaries. Here is what's behind the scenes.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTabChange('learn')}
                    className="px-4 py-2 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white text-xs font-bold whitespace-nowrap shrink-0 transition-colors"
                  >
                    Read now &rarr;
                  </button>
                </div>
              )}

              {forYouCategory === 'learn' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#DDF3DE] text-[#2C6336]">
                      Hormonal Health
                    </span>
                    <h5 className="font-bold text-sm text-[#403344] mt-2">
                      PCOS: understanding the basics without panic
                    </h5>
                    <p className="text-xs text-[#817583] mt-1">
                      Clear facts on symptoms, insulin sensitivity, and gentle ways to advocate for your body.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF0B8] text-[#826500]">
                      Mood & Body
                    </span>
                    <h5 className="font-bold text-sm text-[#403344] mt-2">
                      Why can mood feel different throughout the month?
                    </h5>
                    <p className="text-xs text-[#817583] mt-1">
                      How progesterone and estrogen influence serotonin receptors without being a personal failing.
                    </p>
                  </div>
                </div>
              )}

              {forYouCategory === 'selfcare' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cycleAnalysis.symptomsAdvice.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF] space-y-1">
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="text-xs font-bold text-[#403344]">{item.title}</div>
                      <div className="text-[11px] text-[#817583] leading-relaxed">{item.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Questionnaire Summary Banner */}
            <div className="bg-[#FFFAF5] rounded-2xl p-4 sm:p-5 border border-[#E9DFFF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#756291] bg-[#E9DFFF] px-2.5 py-0.5 rounded-full">
                  Your Cycle Profile
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#403344]">
                  Cycle rhythm: {cycleRegularity} • Flow: {flowIntensity} • {goalsBaikologyHelp.length > 0 ? `${goalsBaikologyHelp.length} goals selected` : 'Cycle awareness active'}
                </p>
              </div>
              <button
                onClick={() => handleTabChange('settings')}
                className="text-xs font-bold text-[#756291] hover:underline flex items-center gap-1.5 shrink-0 bg-white border border-[#E9DFFF] px-3.5 py-1.5 rounded-full"
              >
                <span>View questionnaire details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB: MY CYCLE (Screen 08) ================= */}
        {activeTab === 'cycle' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Main Calendar Card */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E9DFFF] shadow-xs space-y-6">
              {/* Header with Month Navigation and Log Period */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9DFFF] pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                    My Cycle Calendar 🌸
                  </h3>
                  <p className="text-xs text-[#817583]">
                    Visual tracking mapped to your body's biological rhythms.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Month Navigation */}
                  <div className="flex items-center gap-1.5 bg-[#FFFAF5] px-3 py-1.5 rounded-full border border-[#E9DFFF]">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 rounded-full hover:bg-[#E9DFFF] text-[#403344] transition-colors"
                      title="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-[#403344] min-w-[110px] text-center">
                      {formattedMonthName}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 rounded-full hover:bg-[#E9DFFF] text-[#403344] transition-colors"
                      title="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setCalendarViewDate(new Date());
                      setSelectedCalendarCell(null);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#E9DFFF] hover:bg-[#d8c7fd] text-[#756291] text-xs font-bold transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Calendar on Left, Phase Detail on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Interactive Calendar Grid (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-xs font-bold text-[#817583] py-1 uppercase tracking-wider text-[11px]">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Monthly Cells */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
                    {monthCalendarCells.map((cell, idx) => {
                      if (cell.isPadding) {
                        return <div key={`pad-${idx}`} className="h-12 sm:h-14 rounded-2xl" />;
                      }

                      const isSelected = selectedCalendarCell?.dayNum === cell.dayNum &&
                        selectedCalendarCell?.date?.getMonth() === cell.date?.getMonth();

                      let cellBg = 'bg-[#FFFAF5] hover:bg-white text-[#403344] border border-transparent';
                      let label = '';
                      let labelColor = '';

                      if (cell.phaseType === 'menstrual') {
                        cellBg = 'bg-[#F9DDE5]/80 hover:bg-[#F9DDE5] text-[#9F1239] border-[#F9DDE5] font-bold';
                        label = 'Period';
                        labelColor = 'text-[#9F1239]';
                      } else if (cell.phaseType === 'follicular') {
                        cellBg = 'bg-[#DDF3DE]/70 hover:bg-[#DDF3DE] text-[#2C6336] border-[#DDF3DE] font-medium';
                        label = 'Follicular';
                        labelColor = 'text-[#2C6336]';
                      } else if (cell.phaseType === 'ovulation-peak') {
                        cellBg = 'bg-[#FFF0B8] hover:bg-[#ffe88a] text-[#826500] border-[#756291] font-extrabold shadow-xs';
                        label = 'Ovulation';
                        labelColor = 'text-[#826500] font-bold';
                      } else if (cell.phaseType === 'ovulation-window') {
                        cellBg = 'bg-[#FFF8D6]/80 hover:bg-[#FFF0B8] text-[#826500] border-[#FFF0B8]';
                        label = 'Fertile';
                        labelColor = 'text-[#826500]';
                      } else if (cell.phaseType === 'luteal') {
                        cellBg = 'bg-[#F3E8FF]/70 hover:bg-[#F3E8FF] text-[#6B21A8] border-[#F3E8FF]';
                        label = 'Luteal';
                        labelColor = 'text-[#6B21A8]';
                      }

                      return (
                        <div
                          key={`day-${cell.dayNum}`}
                          onClick={() => setSelectedCalendarCell(cell)}
                          className={`h-12 sm:h-16 rounded-2xl p-1 sm:p-1.5 flex flex-col items-center justify-between transition-all cursor-pointer select-none ${cellBg} ${
                            cell.isToday ? 'ring-2 ring-[#756291] shadow-xs' : ''
                          } ${isSelected ? 'ring-2 ring-[#403344] scale-[1.03]' : ''}`}
                        >
                          <div className="flex items-center justify-between w-full px-1">
                            <span className={`text-xs sm:text-sm ${cell.isToday ? 'font-extrabold underline' : 'font-semibold'}`}>
                              {cell.dayNum}
                            </span>
                            {cell.isToday && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#756291]" title="Today" />
                            )}
                          </div>

                          {label && (
                            <span className={`text-[9px] sm:text-[10px] leading-tight truncate px-1 rounded-sm ${labelColor}`}>
                              {label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#E9DFFF] text-xs text-[#817583]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#F9DDE5]" />
                      <span>Period</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#DDF3DE]" />
                      <span>Follicular</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FFF0B8]" />
                      <span>Ovulation window</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#F3E8FF]" />
                      <span>Luteal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full border-2 border-[#756291]" />
                      <span>Today</span>
                    </div>
                  </div>
                </div>

                {/* Right: Dynamic Day Details / Milestone Inspection Card */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#FFFAF5] via-[#FFF9F6] to-[#F8F4FD] rounded-[28px] p-5 sm:p-6 border border-[#E9DFFF] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#756291] bg-white px-3 py-1 rounded-full border border-[#E9DFFF]">
                      {selectedCalendarCell
                        ? `Selected: Day ${selectedCalendarCell.cycleDay || '—'}`
                        : `Current: Day ${cycleAnalysis.cycleDay}`}
                    </span>
                    <span className="text-xs text-[#817583] font-medium">
                      {selectedCalendarCell
                        ? selectedCalendarCell.date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'Today'}
                    </span>
                  </div>

                  {/* Phase Title & Details */}
                  <div className="space-y-1.5">
                    <h4 className="text-xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                      {selectedCalendarCell?.phaseType === 'menstrual'
                        ? 'Menstrual Phase'
                        : selectedCalendarCell?.phaseType === 'follicular'
                        ? 'Follicular Phase'
                        : selectedCalendarCell?.phaseType?.includes('ovulation')
                        ? 'Ovulatory Window'
                        : selectedCalendarCell?.phaseType === 'luteal'
                        ? 'Luteal Phase'
                        : cycleAnalysis.phaseName}
                    </h4>
                    <p className="text-xs text-[#817583] leading-relaxed">
                      {selectedCalendarCell?.phaseType === 'menstrual'
                        ? 'Baseline estrogen and progesterone. The body gently sheds its lining, directing vitality toward rest and restoration.'
                        : selectedCalendarCell?.phaseType === 'follicular'
                        ? 'Estrogen steadily rises as ovarian follicles mature. Mental clarity, mood stability, and motivation are naturally elevated.'
                        : selectedCalendarCell?.phaseType?.includes('ovulation')
                        ? 'Estrogen peaks with a surge of LH triggering ovulation. High social confidence, verbal fluency, and connection feel fluid.'
                        : selectedCalendarCell?.phaseType === 'luteal'
                        ? 'Progesterone warms the body and calms the nervous system. A slightly higher metabolic rate makes nourishing meals and gentle evenings optimal.'
                        : cycleAnalysis.phaseDescription}
                    </p>
                  </div>

                  {/* You Might Feel Chips */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E9DFFF]/70">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#403344]">
                      You might feel
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cycleAnalysis.phase === 'menstrual' ? (
                        <>
                          <span className="px-2.5 py-1 rounded-full bg-[#F9DDE5] text-[#9F1239] text-xs font-medium">Quiet energy</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#F9DDE5] text-[#9F1239] text-xs font-medium">Reflective</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#F9DDE5] text-[#9F1239] text-xs font-medium">Restful</span>
                        </>
                      ) : cycleAnalysis.phase === 'follicular' ? (
                        <>
                          <span className="px-2.5 py-1 rounded-full bg-[#DDF3DE] text-[#2C6336] text-xs font-medium">Clear thinking</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#DDF3DE] text-[#2C6336] text-xs font-medium">Rising stamina</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#DDF3DE] text-[#2C6336] text-xs font-medium">Optimistic</span>
                        </>
                      ) : cycleAnalysis.phase === 'ovulatory' ? (
                        <>
                          <span className="px-2.5 py-1 rounded-full bg-[#FFF0B8] text-[#826500] text-xs font-medium">Sociable</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#FFF0B8] text-[#826500] text-xs font-medium">Peak energy</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#FFF0B8] text-[#826500] text-xs font-medium">Verbal flow</span>
                        </>
                      ) : (
                        <>
                          <span className="px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#6B21A8] text-xs font-medium">Nourishing</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#6B21A8] text-xs font-medium">Intuitive</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#6B21A8] text-xs font-medium">Grounded</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Self Care Suggestions */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E9DFFF]/70">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#403344]">
                      Gentle self-care
                    </div>
                    <ul className="text-xs text-[#817583] space-y-1 leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#756291]">✦</span>
                        <span>Lean into activities that nourish your natural tempo today.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#756291]">✦</span>
                        <span>Stay hydrated with warm or electrolyte-rich water.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#756291]">✦</span>
                        <span>Be kind to your body — every phase has a purpose.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Cycle Predictions Box */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E9DFFF] text-xs space-y-2">
                    <div className="font-bold text-[#403344] flex items-center justify-between">
                      <span>Predicted Next Period:</span>
                      <span className="text-[#9F1239]">{cycleAnalysis.nextPeriodDateFormatted}</span>
                    </div>
                    <div className="font-bold text-[#403344] flex items-center justify-between">
                      <span>Estimated Ovulation:</span>
                      <span className="text-[#826500]">{cycleAnalysis.ovulationDateFormatted}</span>
                    </div>
                    <div className="text-[#817583] text-[11px] pt-1 border-t border-[#E9DFFF]/50 flex justify-between">
                      <span>Fertile Window:</span>
                      <span>{cycleAnalysis.fertileWindowStartFormatted} – {cycleAnalysis.fertileWindowEndFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: MOOD CHECK-IN (Screen 09) ================= */}
        {activeTab === 'mood' && (
          <div className="max-w-xl mx-auto bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#756291] bg-[#E9DFFF] px-3 py-1 rounded-full">
                Gentle Mood Check-in
              </span>
              <h3 className="text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                How are you feeling today?
              </h3>
              <p className="text-xs text-[#817583]">
                Saved securely to your database profile and tracked directly on your calendar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moodOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setTodayMood(opt)}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    todayMood.label === opt.label
                      ? 'border-[#756291] ring-2 ring-[#756291]/30 font-bold scale-[1.01]'
                      : 'border-[#E9DFFF] hover:bg-[#FFFAF5]'
                  }`}
                  style={{ backgroundColor: todayMood.label === opt.label ? opt.color : '#FFFFFF' }}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <div>
                    <div className="text-sm font-bold text-[#403344]">{opt.label}</div>
                    <div className="text-xs text-[#817583]">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#403344] uppercase tracking-wider">
                Optional Private Thought (Saved to your database profile)
              </label>
              <textarea
                rows={3}
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="A word, a sigh, or whatever is on your mind today..."
                className="w-full px-4 py-3 rounded-2xl border border-[#E9DFFF] bg-[#FFFAF5] text-sm focus:outline-none focus:ring-2 focus:ring-[#756291]"
              />
            </div>

            <button
              onClick={() => {
                handleSaveMood(todayMood, moodNote);
                handleTabChange('home');
              }}
              className="w-full py-3.5 rounded-full bg-[#756291] hover:bg-[#5e4b78] text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Save to database & mark on calendar</span>
              <span>💜</span>
            </button>
          </div>
        )}

        {/* ================= TAB: LEARN (Screen 10) ================= */}
        {activeTab === 'learn' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                Big questions. Gentle answers. 📚
              </h3>
              <p className="text-xs sm:text-sm text-[#817583]">
                Science-informed explanations without fear-mongering or judgment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-[28px] border border-[#E9DFFF] space-y-3 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#756291] bg-[#E9DFFF] px-2.5 py-0.5 rounded-full">
                  Cycle Science
                </span>
                <h4 className="font-extrabold text-base text-[#403344]">
                  What actually happens during your menstrual cycle?
                </h4>
                <p className="text-xs text-[#817583] leading-relaxed">
                  The 4 biological phases (Menstrual, Follicular, Ovulation, Luteal) explained in reassuring plain English.
                </p>
                <div className="text-xs font-bold text-[#756291] pt-2">4 min read &rarr;</div>
              </div>

              <div className="bg-white p-5 rounded-[28px] border border-[#E9DFFF] space-y-3 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C6336] bg-[#DDF3DE] px-2.5 py-0.5 rounded-full">
                  Hormonal Health
                </span>
                <h4 className="font-extrabold text-base text-[#403344]">
                  PCOS: understanding the basics without panic
                </h4>
                <p className="text-xs text-[#817583] leading-relaxed">
                  Common signs, what it actually means biologically, and how to gently advocate for yourself with doctors.
                </p>
                <div className="text-xs font-bold text-[#756291] pt-2">5 min read &rarr;</div>
              </div>

              <div className="bg-white p-5 rounded-[28px] border border-[#E9DFFF] space-y-3 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#826500] bg-[#FFF0B8] px-2.5 py-0.5 rounded-full">
                  Mind & Body
                </span>
                <h4 className="font-extrabold text-base text-[#403344]">
                  Why can your mood feel different throughout the month?
                </h4>
                <p className="text-xs text-[#817583] leading-relaxed">
                  Understanding neurotransmitters and estrogen dips so you stop feeling that something is "wrong" with you.
                </p>
                <div className="text-xs font-bold text-[#756291] pt-2">3 min read &rarr;</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: SETTINGS & QUESTIONNAIRE DETAILS (Screen 13) ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-[32px] p-6 sm:p-10 border border-[#E9DFFF] shadow-xs space-y-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E9DFFF] pb-4">
              <div>
                <h3 className="text-2xl font-extrabold text-[#403344] font-['Nunito',sans-serif]">
                  Profile & Preferences
                </h3>
                <p className="text-xs text-[#817583]">
                  All questionnaire answers stored securely in your MongoDB profile.
                </p>
              </div>
              <button
                onClick={() => navigate('/onboarding')}
                className="px-4 py-2 rounded-full bg-[#E9DFFF] hover:bg-[#d8c7fd] text-[#756291] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake questionnaire
              </button>
            </div>

            {/* User Account Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#756291]">
                Account Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]">
                  <span className="text-xs text-[#817583] block">Preferred Name</span>
                  <span className="font-bold text-[#403344]">{preferredName}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]">
                  <span className="text-xs text-[#817583] block">Email Address</span>
                  <span className="font-bold text-[#403344]">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Questionnaire Stored Data */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#756291]">
                Stored Cycle Questionnaire
              </h4>

              <div className="space-y-3 text-xs">
                {/* 1. Period Details */}
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]/70 space-y-1">
                  <span className="font-bold text-[#403344] block">1. Understanding your period</span>
                  <div className="text-[#817583] space-y-0.5">
                    <div>Menstruating: <span className="font-semibold text-[#403344]">{startedMenstruating}</span></div>
                    {ageFirstPeriod && <div>First period age: <span className="font-semibold text-[#403344]">{ageFirstPeriod}</span></div>}
                    {lastPeriodDate && <div>Last period date: <span className="font-semibold text-[#403344]">{lastPeriodDate}</span></div>}
                    <div>Duration: <span className="font-semibold text-[#403344]">{periodDuration}</span></div>
                    <div>Cycle description: <span className="font-semibold text-[#403344]">{cycleRegularity}</span></div>
                  </div>
                </div>

                {/* 2. Flow Details */}
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]/70 space-y-1">
                  <span className="font-bold text-[#403344] block">2. Menstrual flow</span>
                  <div className="text-[#817583] space-y-0.5">
                    <div>Typical flow: <span className="font-semibold text-[#403344]">{flowIntensity}</span></div>
                    <div>Heaviest on: <span className="font-semibold text-[#403344]">{heaviestDays}</span></div>
                    {q.spottingBetween && <div>Spotting between periods: <span className="font-semibold text-[#403344]">{q.spottingBetween}</span></div>}
                    {q.bloodClots && <div>Blood clots: <span className="font-semibold text-[#403344]">{q.bloodClots}</span></div>}
                  </div>
                </div>

                {/* 3. Period Symptoms */}
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]/70 space-y-1.5">
                  <span className="font-bold text-[#403344] block">3. Symptoms & Cramps</span>
                  <div className="text-[#817583]">
                    <div>Cramp intensity: <span className="font-semibold text-[#403344]">{crampIntensity}</span></div>
                    {q.crampTiming && <div>Cramp timing: <span className="font-semibold text-[#403344]">{q.crampTiming}</span></div>}
                    {q.dailyDisruption && <div>Daily life interference: <span className="font-semibold text-[#403344]">{q.dailyDisruption}</span></div>}
                  </div>
                  {periodSymptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {periodSymptoms.map((sym) => (
                        <span key={sym} className="px-2 py-0.5 rounded-md bg-[#F9DDE5] text-[#403344]">
                          {sym}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Mood & Emotions */}
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]/70 space-y-1.5">
                  <span className="font-bold text-[#403344] block">4. Mood & Emotional changes</span>
                  <div className="text-[#817583]">
                    <div>Mood shifts around period: <span className="font-semibold text-[#403344]">{q.moodChangesAroundPeriod || 'Not specified'}</span></div>
                    {q.moodChangeTiming && <div>Shift timing: <span className="font-semibold text-[#403344]">{q.moodChangeTiming}</span></div>}
                  </div>
                  {emotionalChanges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {emotionalChanges.map((item) => (
                        <span key={item} className="px-2 py-0.5 rounded-md bg-[#E9DFFF] text-[#403344]">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Lifestyle */}
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]/70 space-y-1">
                  <span className="font-bold text-[#403344] block">5. Lifestyle and cycle patterns</span>
                  <div className="text-[#817583] space-y-0.5">
                    <div>Sleep: <span className="font-semibold text-[#403344]">{sleepPattern}</span></div>
                    <div>Activity: <span className="font-semibold text-[#403344]">{physicalActivity}</span></div>
                    {q.appetiteChanges && <div>Appetite: <span className="font-semibold text-[#403344]">{q.appetiteChanges}</span></div>}
                    {q.skinChanges && <div>Skin: <span className="font-semibold text-[#403344]">{q.skinChanges}</span></div>}
                  </div>
                </div>

                {/* 6. Health Background */}
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]/70 space-y-1">
                  <span className="font-bold text-[#403344] block">6. Health Background</span>
                  <div className="text-[#817583] space-y-0.5">
                    <div>Hormonal contraception/meds: <span className="font-semibold text-[#403344]">{hormonalMedication}</span></div>
                    <div>Recent 6-month cycle shifts: <span className="font-semibold text-[#403344]">{q.cycleChangedRecently || 'Not sure'}</span></div>
                  </div>
                  {diagnosedConditions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {diagnosedConditions.map((cond) => (
                        <span key={cond} className="px-2 py-0.5 rounded-md bg-[#FFF0B8] text-[#826500] font-medium">
                          {cond}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. Body Needs & Reminders */}
                <div className="p-3.5 rounded-2xl bg-[#FFFAF5] border border-[#E9DFFF]/70 space-y-1.5">
                  <span className="font-bold text-[#403344] block">7. What your body needs</span>
                  {goalsBaikologyHelp.length > 0 && (
                    <div className="space-y-0.5">
                      <div className="text-[#817583]">Focus goals:</div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {goalsBaikologyHelp.map((g) => (
                          <span key={g} className="px-2 py-0.5 rounded-md bg-[#DDF3DE] text-[#2C6336]">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {remindersPreference.length > 0 && (
                    <div className="text-[#817583] pt-1">
                      Reminders: <span className="font-semibold text-[#403344]">{remindersPreference.join(', ')}</span>
                    </div>
                  )}
                  {q.anythingElse && (
                    <div className="text-[#817583] pt-1 italic">
                      "{q.anythingElse}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9DFFF] flex justify-between items-center">
              <span className="text-xs text-[#817583]">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-[#D32F2F]/30 text-[#D32F2F] hover:bg-[#FFF0F0] text-xs font-bold transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Instant Mood Picker Modal */}
      {isMoodPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#403344]/40 backdrop-blur-xs">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full border border-[#E9DFFF] shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-[#403344] font-['Nunito',sans-serif]">
                {quickLogCell?.dateKey
                  ? `How are you feeling on ${quickLogCell.dateKey}?`
                  : 'How are you feeling right now?'}
              </h4>
              <p className="text-xs text-[#817583]">
                Tap an emotion to save to your database and display on your calendar.
              </p>
            </div>

            <div className="space-y-2">
              {moodOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    handleSaveMood(opt, '', quickLogCell?.dateKey || null);
                  }}
                  className="w-full p-3 rounded-2xl border border-[#E9DFFF] hover:border-[#756291] text-left flex items-center gap-3 transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: opt.color + '40' }}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <span className="font-bold text-sm block" style={{ color: opt.textColor }}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-[#817583]">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setIsMoodPickerOpen(false);
                setQuickLogCell(null);
              }}
              className="w-full py-2.5 rounded-full text-xs font-semibold text-[#817583] hover:bg-[#FFFAF5] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

