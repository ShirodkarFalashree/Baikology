import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthIllustration from '../components/auth/AuthIllustration';
import FormField from '../components/auth/FormField';
import PasswordField from '../components/auth/PasswordField';
import PasswordStrength from '../components/auth/PasswordStrength';
import { registerUser } from '../api/auth';
import { ArrowRight, Loader2, Sparkles, AlertCircle, Info, Heart } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverNotice, setServerNotice] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please tell us what to call you (first or preferred name).';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Please create a password.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters for your security.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'The passwords do not match yet.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Please check the box to agree to our Terms and Privacy commitments.';
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

    const result = await registerUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
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
        title: 'Unable to create account',
        message: result.message || 'Something went wrong. Please try again.',
      });
    } else {
      const user = result.data?.user;
      setServerNotice({
        type: 'success',
        title: `Welcome to Baikology, ${formData.name}! 🌸`,
        message: result.data?.message || 'Your account has been created successfully. Taking you to your welcome questionnaire...',
      });
      if (result.data?.token) {
        localStorage.setItem('baikology_token', result.data.token);
        localStorage.setItem('baikology_user', JSON.stringify(user || { name: formData.name, email: formData.email, isOnboardingCompleted: false }));
      }

      // New customer must complete questionnaire
      // Let the user choose their health journey
setTimeout(() => {
  navigate('/journey');
}, 700);
    }
  };

  return (
    <AuthLayout
      leftEyebrow="A LITTLE SPACE, JUST FOR YOU ✨"
      leftHeadline="Let's start with you."
      leftSupportingText="No pressure to have it all figured out. We'll take things one little step at a time."
      leftIllustration={<AuthIllustration mode="register" />}
      leftTagline="The Science of being 'her'."
      reassuranceText="Your health is personal. We treat it that way."
    >
      <div>
        {/* Card Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DE] text-[11px] font-bold text-[#2C6336] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[#367942]" />
            New Account
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight">
            Create your Baikology account 🌸
          </h2>
          <p className="text-xs sm:text-sm text-[#817583] mt-1">
            A little clarity starts here.
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
            id="name"
            label="First or preferred name"
            placeholder="What should we call you?"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="given-name"
            required
            disabled={isSubmitting}
          />

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

          <div className="space-y-1.5">
            <PasswordField
              id="password"
              label="Create password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              required
              disabled={isSubmitting}
            />
            <PasswordStrength password={formData.password} />
          </div>

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            placeholder="Type your password once more"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
            disabled={isSubmitting}
          />

          {/* Terms & Privacy Agreement Checkbox */}
          <div className="pt-1">
            <div className="flex items-start gap-2.5 text-xs text-[#817583]">
              <input
                id="agreeTerms"
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-1 w-4 h-4 rounded-md border-[#E9DFFF] text-[#756291] focus:ring-[#E9DFFF] focus:ring-offset-0 cursor-pointer accent-[#756291] flex-shrink-0"
              />
              <label htmlFor="agreeTerms" className="leading-snug cursor-pointer select-none">
                I agree to Baikology's{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Baikology Terms & Privacy: We commit to zero data-brokerage, strict privacy, and full autonomy over your personal health notes.');
                  }}
                  className="font-bold text-[#403344] hover:underline inline"
                >
                  Privacy Commitments
                </button>{' '}
                and understand that content is educational.
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs text-[#8C2C4E] font-medium flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.agreeTerms}</span>
              </p>
            )}
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
                  <span>Creating your space...</span>
                </>
              ) : (
                <>
                  <span>Create my account</span>
                  <ArrowRight className="w-4 h-4 text-[#756291]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Navigation Link */}
        <div className="text-center mt-6 pt-5 border-t border-[#E9DFFF]/70 text-xs sm:text-sm text-[#817583]">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-bold text-[#403344] hover:text-[#756291] hover:underline underline-offset-4 transition-colors"
          >
            Log in here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
