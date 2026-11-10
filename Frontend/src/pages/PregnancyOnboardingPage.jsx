
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  savePregnancyProfile,
  getPregnancyProfile,
} from '../api/auth';

export default function PregnancyOnboardingPage({ editMode = false }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('baikology_token');

  const [form, setForm] = useState({
    lastMenstrualPeriod: '',
    knownDueDate: '',
    isFirstPregnancy: '',
    notes: '',
  });

  const [loading, setLoading] = useState(editMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const formatDateInput = (value) => {
    if (!value) return '';

    return String(value).split('T')[0];
  };

  // Load existing profile when opening edit mode
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!editMode) return;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await getPregnancyProfile(token);

        if (!response.success) {
          setError(response.message || 'Unable to load your pregnancy profile.');
          return;
        }

        const profile = response.data?.data ?? response.data;

        if (!profile?.isCompleted) {
          navigate('/pregnancy-onboarding');
          return;
        }

        setForm({
          lastMenstrualPeriod: formatDateInput(profile.lastMenstrualPeriod),
          knownDueDate:
            profile.dueDateSource === 'user_provided' ||
            !profile.lastMenstrualPeriod
              ? formatDateInput(profile.dueDate)
              : '',
          isFirstPregnancy: profile.isFirstPregnancy || '',
          notes: profile.notes || '',
        });
      } catch (err) {
        console.error('Load pregnancy profile error:', err);
        setError('Unable to load your pregnancy details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [editMode, navigate, token]);

  const updateField = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDueDate = (lmp) => {
    const date = new Date(`${lmp}T12:00:00`);
    date.setDate(date.getDate() + 280);

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      navigate('/login');
      return;
    }

    if (!form.lastMenstrualPeriod && !form.knownDueDate) {
      setError('Please enter your last menstrual period date or known due date.');
      return;
    }

    if (form.lastMenstrualPeriod && form.lastMenstrualPeriod > todayString) {
      setError('Last menstrual period cannot be in the future.');
      return;
    }

    if (form.knownDueDate && form.knownDueDate < todayString) {
      setError('Please enter a valid future due date.');
      return;
    }

    const dueDate = form.lastMenstrualPeriod
      ? calculateDueDate(form.lastMenstrualPeriod)
      : form.knownDueDate;

    const payload = {
      lastMenstrualPeriod: form.lastMenstrualPeriod || null,
      dueDate,
      dueDateSource: form.lastMenstrualPeriod
        ? 'lmp_calculation'
        : 'user_provided',
      isFirstPregnancy: form.isFirstPregnancy,
      notes: form.notes.trim(),
    };

    try {
      setSaving(true);

      const response = await savePregnancyProfile(payload, token);

      if (!response.success) {
        setError(response.message || 'Unable to save your pregnancy profile.');
        return;
      }

      const storedUser = JSON.parse(
        localStorage.getItem('baikology_user') || '{}'
      );

      localStorage.setItem(
        'baikology_user',
        JSON.stringify({
          ...storedUser,
          pregnancyProfile: {
            ...(storedUser.pregnancyProfile || {}),
            ...payload,
            isCompleted: true,
          },
        })
      );

      navigate('/pregnancy-dashboard');
    } catch (err) {
      console.error('Save pregnancy profile error:', err);
      setError('Something went wrong while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8FF] text-[#80629F]">
        Loading your pregnancy details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8FF] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-[#E9DFFF] p-6 sm:p-10">

        <p className="text-sm font-semibold text-[#987BB5] mb-2">
          BAIKOLOGY · PREGNANCY CARE
        </p>

        <h1 className="text-3xl font-bold text-[#463653] mb-3">
          {editMode ? 'Edit Pregnancy Details' : 'Your pregnancy journey'}
        </h1>

        <p className="text-gray-500 mb-8">
          {editMode
            ? 'Update your pregnancy information whenever your details change.'
            : 'Share a few details so we can organize helpful, week-by-week pregnancy information for you.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First day of your last menstrual period (LMP)
            </label>

            <input
              type="date"
              name="lastMenstrualPeriod"
              value={form.lastMenstrualPeriod}
              onChange={updateField}
              max={todayString}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#987BB5]"
            />
          </div>

          <div className="text-center text-sm text-gray-400">OR</div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Have you already been given an estimated due date?
            </label>

            <input
              type="date"
              name="knownDueDate"
              value={form.knownDueDate}
              onChange={updateField}
              min={todayString}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#987BB5]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Is this your first pregnancy?
            </label>

            <div className="flex flex-wrap gap-4">
              {['Yes', 'No', 'Prefer not to say'].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <input
                    type="radio"
                    name="isFirstPregnancy"
                    value={option}
                    checked={form.isFirstPregnancy === option}
                    onChange={updateField}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Anything else you'd like us to know? (Optional)
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={updateField}
              rows="3"
              maxLength="1000"
              placeholder="Share anything you'd like to keep in your pregnancy profile..."
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#987BB5]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#987BB5] hover:bg-[#80629F] text-white font-semibold py-3 disabled:opacity-60"
          >
            {saving
              ? 'Saving...'
              : editMode
                ? 'Update Pregnancy Profile'
                : 'Save and continue'}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={() => navigate('/pregnancy-dashboard')}
              className="w-full rounded-xl border border-[#E9DFFF] text-[#80629F] font-semibold py-3"
            >
              Cancel
            </button>
          )}

        </form>

        <p className="text-xs text-gray-400 mt-5 text-center">
          Due dates and pregnancy weeks are estimates, not medical assessments.
          Confirm pregnancy dating with your healthcare professional.
        </p>

      </div>
    </div>
  );
}
