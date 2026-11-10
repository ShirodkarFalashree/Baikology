
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Battery, Heart, ArrowLeft, CalendarDays } from 'lucide-react';
import {
  getPregnancyWellness,
  savePregnancyWellness,
  logMoodCheckIn,
} from '../api/auth';

const moodOptions = [
  { label: 'Happy', desc: 'Sunny & energized', emoji: '😊', color: '#FFF0B8', textColor: '#826500' },
  { label: 'Calm', desc: 'Peaceful & grounded', emoji: '😌', color: '#DDF3DE', textColor: '#2C6336' },
  { label: 'Meh', desc: 'In-between / okay-ish', emoji: '😐', color: '#F3E8FF', textColor: '#6B21A8' },
  { label: 'Overwhelmed', desc: 'Heavy on my mind', emoji: '🤯', color: '#FFE4E6', textColor: '#9F1239' },
  { label: 'Low', desc: 'Tender & quiet', emoji: '🥺', color: '#E0E7FF', textColor: '#3730A3' },
];
export default function PregnancyWellnessPage() {
  const navigate = useNavigate();

  const [sleepHours, setSleepHours] = useState('8');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
const [moodNote, setMoodNote] = useState('');
const [moodSaving, setMoodSaving] = useState(false);
const [moodMessage, setMoodMessage] = useState('');

  const token = localStorage.getItem('baikology_token');

  const loadHistory = async () => {
    const response = await getPregnancyWellness(token);

    if (response.success) {
      const logs = response.data?.data ?? response.data ?? [];
      setHistory(Array.isArray(logs) ? logs : []);

      const today = new Date().toISOString().split('T')[0];
      const todayLog = logs.find((log) => log.date === today);

      if (todayLog) {
        setSleepHours(String(todayLog.sleepHours));
        setEnergyLevel(todayLog.energyLevel);
      }
    } else {
      setError(response.message || 'Unable to load wellness history.');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    loadHistory();
  }, [token, navigate]);
  const handleSavePregnancyMood = async () => {
  if (!selectedMood) {
    setMoodMessage('Please select your mood first.');
    return;
  }

  const token = localStorage.getItem('baikology_token');

  if (!token) {
    setMoodMessage('Please log in again to save your check-in.');
    return;
  }

  const moodEntry = {
    date: new Date().toISOString().split('T')[0],
    label: selectedMood.label,
    emoji: selectedMood.emoji,
    color: selectedMood.color,
    textColor: selectedMood.textColor,
    note: moodNote,
  };

  try {
    setMoodSaving(true);
    setMoodMessage('');

    await logMoodCheckIn(moodEntry, token);

    setMoodMessage('Your mood check-in has been saved successfully.');
  } catch (error) {
    console.error('Pregnancy mood check-in failed:', error);
    setMoodMessage('Unable to save your mood. Please try again.');
  } finally {
    setMoodSaving(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const sleep = Number(sleepHours);

    if (sleepHours.trim() === '' || !Number.isFinite(sleep) || sleep < 0 || sleep > 24) {
      setError('Please enter sleep hours between 0 and 24.');
      return;
    }

    setSaving(true);

    const response = await savePregnancyWellness(
      {
        sleepHours: sleep,
        energyLevel: Number(energyLevel),
      },
      token
    );

    setSaving(false);

    if (!response.success) {
      setError(response.message || 'Unable to save your check-in.');
      return;
    }

    setMessage('Your wellness check-in has been saved!');
    await loadHistory();
  };

  const today = new Date().toISOString().split('T')[0];

  const energyLabels = {
    1: 'Very low',
    2: 'Low',
    3: 'Moderate',
    4: 'Good',
    5: 'Very good',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8FF] text-[#80629F]">
        Loading your wellness journey...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8FF] px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-7">

        <button
          onClick={() => navigate('/pregnancy-dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-[#80629F]"
        >
          <ArrowLeft size={18} />
          Back to Pregnancy Dashboard
        </button>

        <header>
          <p className="text-sm font-semibold text-[#987BB5]">
            PREGNANCY CARE
          </p>
          <h1 className="text-3xl font-bold text-[#463653] mt-2">
            Your wellness journal
          </h1>
          <p className="text-gray-500 mt-2">
            Take a moment to check in with yourself. Small daily check-ins
            help you understand your wellbeing over time.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#E9DFFF] p-6 sm:p-8 space-y-7"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#EEE9FA] flex items-center justify-center">
                <Moon className="text-[#756291]" />
              </div>
              <div>
                <h2 className="font-bold text-[#463653]">Sleep last night</h2>
                <p className="text-xs text-gray-400">How many hours did you sleep?</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-32 rounded-xl border border-gray-200 p-3 text-lg font-semibold text-[#80629F] outline-none focus:border-[#987BB5]"
              />
              <span className="text-gray-500">hours</span>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#FCE8EF] flex items-center justify-center">
                <Battery className="text-[#C95B7E]" />
              </div>
              <div>
                <h2 className="font-bold text-[#463653]">Your energy today</h2>
                <p className="text-xs text-gray-400">How energetic do you feel?</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEnergyLevel(level)}
                  className={`rounded-xl border py-4 transition-all ${
                    energyLevel === level
                      ? 'bg-[#EEE9FA] border-[#987BB5] text-[#756291]'
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <span className="block text-xl font-bold">{level}</span>
                  <span className="block text-[10px] mt-1">
                    {energyLabels[level]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#987BB5] hover:bg-[#80629F] text-white font-semibold py-3 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save today’s check-in'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            This journal is for personal wellness awareness, not medical diagnosis.
          </p>
        </form>

        <section className="bg-white rounded-3xl border border-[#E9DFFF] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <CalendarDays className="text-[#80629F]" />
            <h2 className="text-xl font-bold text-[#463653]">
              Your wellness history
            </h2>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-gray-400">
              No check-ins yet. Your saved entries will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((log) => (
                <div
                  key={log.date}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FBF8FF] p-4"
                >
                  <div>
                    <p className="font-semibold text-[#463653]">
                      {new Date(`${log.date}T00:00:00Z`).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Sleep: {log.sleepHours} hours
                    </p>
                  </div>

                  <div className="text-sm font-semibold text-[#80629F]">
                    Energy: {log.energyLevel}/5
                  </div>

                </div>

              ))}
            </div>
          )}
            {/* PREGNANCY MOOD CHECK-IN */}
<div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E9DFFF] shadow-sm space-y-6">

  <div>
    <h2 className="text-xl font-semibold text-[#493B5C]">
      How are you feeling today?
    </h2>
    <p className="text-sm text-[#8B8197] mt-2">
      Take a moment to check in with yourself. Every feeling is valid.
    </p>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    {moodOptions.map((mood) => (
      <button
        key={mood.label}
        type="button"
        onClick={() => setSelectedMood(mood)}
        className={`rounded-2xl p-4 border-2 transition-all ${
          selectedMood?.label === mood.label
            ? 'border-[#9B83BD] shadow-md'
            : 'border-[#F0EAF6] hover:border-[#CDBCE0]'
        }`}
        style={{
          backgroundColor: mood.color,
        }}
      >
        <div className="text-3xl mb-2">{mood.emoji}</div>

        <p
          className="font-semibold text-sm"
          style={{ color: mood.textColor }}
        >
          {mood.label}
        </p>

        <p
          className="text-xs mt-1"
          style={{ color: mood.textColor }}
        >
          {mood.desc}
        </p>
      </button>
    ))}
  </div>

  <div>
    <label className="block text-sm font-medium text-[#655575] mb-2">
      Anything on your mind? (Optional)
    </label>

    <textarea
      rows={3}
      value={moodNote}
      onChange={(e) => setMoodNote(e.target.value)}
      placeholder="Write about how you are feeling today..."
      className="w-full rounded-2xl border border-[#E9DFFF] p-4 text-sm text-[#493B5C] focus:outline-none focus:ring-2 focus:ring-[#CDBCE0] resize-none"
    />
  </div>

  {moodMessage && (
    <p className="text-sm text-[#756291]">
      {moodMessage}
    </p>
  )}

  <button
    type="button"
    onClick={handleSavePregnancyMood}
    disabled={moodSaving}
    className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#806A9E] text-white font-medium hover:bg-[#6F588D] disabled:opacity-50 transition-all"
  >
    {moodSaving ? 'Saving...' : 'Save Mood Check-in'}
  </button>

</div>

        </section>


      </div>
    </div>
  );
}
