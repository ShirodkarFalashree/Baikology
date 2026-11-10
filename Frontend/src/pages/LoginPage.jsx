import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthIllustration from '../components/auth/AuthIllustration';
import FormField from '../components/auth/FormField';
import PasswordField from '../components/auth/PasswordField';
import { loginUser } from '../api/auth';
import { ArrowRight, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverNotice, setServerNotice] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverNotice) {
      setServerNotice(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerNotice(null);

    const result = await loginUser({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });

    setIsSubmitting(false);

    if (result.isBackendUnavailable) {
      setServerNotice({
        type: 'error',
        title: 'Backend Connection Issue',
        message: result.message,
      });
    } else if (!result.success) {
      setServerNotice({
        type: 'error',
        title: 'Unable to sign in',
        message: result.message || 'Please check your credentials and try again.',
      });
    } else {
      // Successful login from backend
      const user = result.data?.user;
      setServerNotice({
        type: 'success',
        title: `Welcome back, ${user?.name || 'lovely'}! 💗`,
        message: 'You are now signed into your private, gentle space.',
      });
      if (result.data?.token) {
        localStorage.setItem('baikology_token', result.data.token);
        localStorage.setItem('baikology_user', JSON.stringify(user));
      }

      // Check DB questionnaire status: if user has not completed questionnaire, go to questionnaire first
      // Let the user choose their health journey
setTimeout(() => {
  navigate('/journey');
}, 700);
    }
  };

  return (
    <AuthLayout
      leftEyebrow="YOUR LITTLE CORNER OF CARE 🌷"
      leftHeadline="Hey, lovely. You're home."
      leftSupportingText="Your cycle, your feelings, your questions — let's pick up right where you left off."
      leftIllustration={<AuthIllustration mode="login" />}
      reassuranceText="Your personal health journey deserves privacy."
    >
      <div>
        {/* Card Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9DDE5]/70 text-[11px] font-bold text-[#8C2C4E] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[#C95B7E]" />
            Member Sign In
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight">
            Welcome back 💗
          </h2>
          <p className="text-xs sm:text-sm text-[#817583] mt-1">
            Let's make a little space for you.
          </p>
        </div>

        {/* Server Notice Banner */}
        {serverNotice && (
          <div
            className={`p-4 rounded-2xl mb-5 text-xs border leading-relaxed animate-in fade-in duration-200 ${
              serverNotice.type === 'info'
                ? 'bg-[#E9DFFF]/40 border-[#CFBFF2] text-[#403344]'
                : serverNotice.type === 'error'
                ? 'bg-[#FDF4F6] border-[#F2C4D4] text-[#8C2C4E]'
                : 'bg-[#DDF3DE]/50 border-[#BDDFBF] text-[#2C6336]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {serverNotice.type === 'info' ? (
                <Info className="w-4 h-4 text-[#756291] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#C95B7E] flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold mb-0.5">{serverNotice.title}</p>
                <p>{serverNotice.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField
            id="email"
            label="Email address"
            type="email"
            placeholder="lovely@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />

          <PasswordField
            id="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
            required
            disabled={isSubmitting}
          />

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#817583] hover:text-[#403344]">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-4 h-4 rounded-md border-[#E9DFFF] text-[#756291] focus:ring-[#E9DFFF] focus:ring-offset-0 cursor-pointer accent-[#756291]"
              />
              <span className="font-medium">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-bold text-[#756291] hover:text-[#403344] hover:underline underline-offset-2 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] hover:shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(233,223,255,0.6)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#756291]" />
                  <span>Checking your space...</span>
                </>
              ) : (
                <>
                  <span>Log in</span>
                  <ArrowRight className="w-4 h-4 text-[#756291]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Navigation Link */}
        <div className="text-center mt-6 pt-5 border-t border-[#E9DFFF]/70 text-xs sm:text-sm text-[#817583]">
          <span>New to Baikology? </span>
          <Link
            to="/register"
            className="font-bold text-[#403344] hover:text-[#756291] hover:underline underline-offset-4 transition-colors"
          >
            Create your little space 🌸
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
