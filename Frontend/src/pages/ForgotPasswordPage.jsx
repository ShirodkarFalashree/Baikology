import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthIllustration from '../components/auth/AuthIllustration';
import FormField from '../components/auth/FormField';
import { forgotPassword } from '../api/auth';
import { ArrowRight, Loader2, Sparkles, Mail, CheckCircle2, Info, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverNotice, setServerNotice] = useState(null);

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerNotice(null);

    const result = await forgotPassword({ email: email.trim() });

    setIsSubmitting(false);

    if (result.isBackendUnavailable) {
      setServerNotice({
        type: 'info',
        title: 'Password Recovery Being Configured',
        message:
          'Your email was validated locally. The password recovery service is currently being prepared on the FastAPI backend, so emails are not dispatched yet. We will notify members as soon as this is active.',
      });
    } else if (!result.success) {
      setServerNotice({
        type: 'error',
        title: 'Unable to send link',
        message: result.message || 'Something went wrong. Please try again.',
      });
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <AuthLayout
      leftEyebrow="WE’VE GOT YOU COVERED 🕊️"
      leftHeadline="Forgot something, lovely?"
      leftSupportingText="It happens. Let's help you get back in with a calm, gentle reset link."
      leftIllustration={<AuthIllustration mode="login" />}
      reassuranceText="Password links expire safely and are private to you."
    >
      <div>
        {/* Card Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0B8] text-[11px] font-bold text-[#7E6913] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[#7E6913]" />
            Account Assistance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight">
            Reset your password 🤍
          </h2>
          <p className="text-xs sm:text-sm text-[#817583] mt-1">
            We'll send a calm link directly to your inbox.
          </p>
        </div>

        {/* Server Notice Banner */}
        {serverNotice && (
          <div
            className={`p-4 rounded-2xl mb-5 text-xs border leading-relaxed animate-in fade-in duration-200 ${
              serverNotice.type === 'info'
                ? 'bg-[#E9DFFF]/40 border-[#CFBFF2] text-[#403344]'
                : 'bg-[#FDF4F6] border-[#F2C4D4] text-[#8C2C4E]'
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

        {isSuccess ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-[#DDF3DE] text-[#2C6336] mx-auto flex items-center justify-center text-2xl shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#403344] font-['Nunito',sans-serif]">
              Check your inbox, lovely
            </h3>
            <p className="text-xs sm:text-sm text-[#817583] leading-relaxed max-w-sm mx-auto">
              If an account is associated with <span className="font-bold text-[#403344]">{email}</span>, we've sent a gentle reset link. Please check your inbox and spam folder.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#756291] hover:underline"
              >
                <span>Return to log in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField
              id="reset-email"
              label="Your account email"
              type="email"
              placeholder="lovely@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
                if (serverNotice) setServerNotice(null);
              }}
              error={error}
              autoComplete="email"
              required
              disabled={isSubmitting}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] hover:shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(233,223,255,0.6)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#756291]" />
                    <span>Sending gentle link...</span>
                  </>
                ) : (
                  <>
                    <span>Send reset link</span>
                    <Mail className="w-4 h-4 text-[#756291]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer Navigation Link */}
        <div className="text-center mt-6 pt-5 border-t border-[#E9DFFF]/70 text-xs sm:text-sm text-[#817583]">
          <span>Remembered your password? </span>
          <Link
            to="/login"
            className="font-bold text-[#403344] hover:text-[#756291] hover:underline underline-offset-4 transition-colors"
          >
            Back to log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
