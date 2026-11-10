
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Baby, ArrowRight, Sparkles, LogOut } from 'lucide-react';
import { getCurrentUser, getPregnancyProfile } from '../api/auth';
export default function JourneySelectionPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem('baikology_token');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const response = await getCurrentUser(token);

      if (!response.success) {
        localStorage.removeItem('baikology_token');
        localStorage.removeItem('baikology_user');
        navigate('/login', { replace: true });
        return;
      }

      const latestUser =
        response.data?.data?.user ||
        response.data?.data ||
        response.data?.user ||
        response.data;

      if (!latestUser) {
        navigate('/login', { replace: true });
        return;
      }

      setUser(latestUser);
      localStorage.setItem('baikology_user', JSON.stringify(latestUser));
      setLoading(false);
    };

    loadUser();
  }, [token, navigate]);

  const handlePeriodCare = () => {
    navigate(
      user?.isOnboardingCompleted ? '/dashboard' : '/onboarding'
    );
  };

  const handlePregnancyCare = async () => {
  const response = await getPregnancyProfile(token);

  if (!response.success) {
    alert(response.message || 'Unable to check your pregnancy profile.');
    return;
  }

  const profile = response.data?.data ?? response.data;

  if (profile?.isCompleted) {
    navigate('/pregnancy-dashboard');
  } else {
    navigate('/pregnancy-onboarding');
  }
};

  const handleLogout = () => {
    localStorage.removeItem('baikology_token');
    localStorage.removeItem('baikology_user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9FB] text-[#817583]">
        Loading your health journeys...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9FB] px-5 py-10 sm:px-10">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-extrabold text-[#403344]">
            Baikology<span className="text-[#C95B7E]">.</span>
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[#817583] hover:text-[#8C2C4E]"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9DDE5] text-[#8C2C4E] text-xs font-bold mb-4">
            <Sparkles size={15} />
            YOUR PERSONAL HEALTH JOURNEY
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#403344] mb-3">
            What would you like to focus on?
          </h2>

          <p className="text-[#817583] max-w-xl mx-auto">
            Choose the care journey that best matches your current needs.
            You can explore either journey whenever you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">

          {/* Period Care */}
          <button
            onClick={handlePeriodCare}
            className="text-left bg-white rounded-[30px] p-8 border border-[#F2D5E0] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FCE8EF] flex items-center justify-center mb-6">
              <Heart size={32} className="text-[#C95B7E]" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#403344] mb-3">
              Period Care
            </h3>

            <p className="text-sm text-[#817583] leading-relaxed mb-6">
              Understand your menstrual cycle, track your periods,
              explore mood insights and learn about menstrual wellness.
            </p>

            <div className="flex items-center gap-2 text-sm font-bold text-[#C95B7E]">
              Explore Period Care
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Pregnancy Care */}
          <button
            onClick={handlePregnancyCare}
            className="text-left bg-white rounded-[30px] p-8 border border-[#DCD4F0] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#EEE9FA] flex items-center justify-center mb-6">
              <Baby size={34} className="text-[#756291]" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#403344] mb-3">
              Pregnancy Care
            </h3>

            <p className="text-sm text-[#817583] leading-relaxed mb-6">
              Follow your pregnancy journey, discover weekly baby
              development and explore maternal wellness guidance.
            </p>

            <div className="flex items-center gap-2 text-sm font-bold text-[#756291]">
              Explore Pregnancy Care
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

        <p className="text-center text-xs text-[#A397A5] mt-10">
          Your health journey is personal. Choose what feels right for you.
        </p>

      </div>
    </div>
  );
}
