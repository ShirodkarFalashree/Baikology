import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthIllustration from '../components/auth/AuthIllustration';
import FormField from '../components/auth/FormField';
import PasswordField from '../components/auth/PasswordField';
import PasswordStrength from '../components/auth/PasswordStrength';
import { forgotPassword, resetPassword } from '../api/auth';
import { ArrowRight, Loader2, Sparkles, Mail, CheckCircle2, Info, AlertCircle, ExternalLink } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  const initialEmail = searchParams.get('email') || '';

  // Forgot password form state
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [serverNotice, setServerNotice] = useState(null);

  // Reset password form state (when token exists in URL)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isResetComplete, setIsResetComplete] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsSubmitting(true);
    setServerNotice(null);

    const result = await forgotPassword({ email: email.trim() });

    setIsSubmitting(false);

    if (result.isBackendUnavailable) {
      setServerNotice({
        type: 'error',
        title: 'Connection Issue',
        message: result.message,
      });
    } else if (!result.success) {
      setServerNotice({
        type: 'error',
        title: 'Unable to send link',
        message: result.message || 'Something went wrong. Please try again.',
      });
    } else {
      setIsSuccess(true);
      if (result.data?.previewUrl) {
        setPreviewUrl(result.data.previewUrl);
      }
    }
  };

  const validateReset = () => {
    const errs = {};
    if (!newPassword) {
      errs.newPassword = 'Please enter your new password.';
    } else if (newPassword.length < 8) {
      errs.newPassword = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'The passwords do not match.';
    }

    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!validateReset()) return;

    setIsSubmitting(true);
    setServerNotice(null);

    const result = await resetPassword({
      token: resetToken,
      newPassword,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setServerNotice({
        type: 'error',
        title: 'Password reset failed',
        message: result.message || 'The reset link might be invalid or expired. Please request a new one.',
      });
    } else {
      setIsResetComplete(true);
    }
  };

  // If user opened page via email reset link with token
  if (resetToken) {
    return (
      <AuthLayout
        leftEyebrow="A FRESH START 🌸"
        leftHeadline="Set your new password."
        leftSupportingText="Choose something comforting, gentle, and secure. We'll update your account right away."
        leftIllustration={<AuthIllustration mode="register" />}
        reassuranceText="Your passwords are encrypted with industry-standard bcrypt hashing."
      >
        <div>
          <div className="text-center sm:text-left mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DE] text-[11px] font-bold text-[#2C6336] uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#367942]" />
              Secure Reset
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#403344] font-['Nunito',sans-serif] tracking-tight">
              Create a new password 🌸
            </h2>
            <p className="text-xs sm:text-sm text-[#817583] mt-1">
              Choose something comforting and secure for your account.
            </p>
          </div>

          {serverNotice && (
            <div className="p-4 rounded-2xl mb-5 text-xs border bg-[#FDF4F6] border-[#F2C4D4] text-[#8C2C4E]">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#C95B7E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">{serverNotice.title}</p>
                  <p>{serverNotice.message}</p>
                </div>
              </div>
            </div>
          )}

          {isResetComplete ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-[#DDF3DE] text-[#2C6336] mx-auto flex items-center justify-center text-2xl shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#403344] font-['Nunito',sans-serif]">
                Password updated successfully!
              </h3>
              <p className="text-xs sm:text-sm text-[#817583] leading-relaxed max-w-sm mx-auto">
                Your account is now secured with your new password. You can now log in to your gentle space.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] shadow-xs hover:shadow-md transition-all"
                >
                  <span>Log in now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#756291]" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <PasswordField
                  id="newPassword"
                  label="New password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordErrors.newPassword) setPasswordErrors((p) => ({ ...p, newPassword: '' }));
                  }}
                  error={passwordErrors.newPassword}
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                />
                <PasswordStrength password={newPassword} />
              </div>

              <PasswordField
                id="confirmPassword"
                label="Confirm new password"
                placeholder="Type your new password again"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordErrors.confirmPassword) setPasswordErrors((p) => ({ ...p, confirmPassword: '' }));
                }}
                error={passwordErrors.confirmPassword}
                autoComplete="new-password"
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
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save new password</span>
                      <ArrowRight className="w-4 h-4 text-[#756291]" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#817583] hover:text-[#403344] hover:underline"
                >
                  Request a different reset link
                </Link>
              </div>
            </form>
          )}
        </div>
      </AuthLayout>
    );
  }

  // Default: Forgot password request flow
  return (
    <AuthLayout
      leftEyebrow="WE’VE GOT YOU COVERED 🕊️"
      leftHeadline="Forgot something, lovely?"
      leftSupportingText="It happens. Let's help you get back in with a calm, gentle reset link delivered to your email."
      leftIllustration={<AuthIllustration mode="login" />}
      reassuranceText="Password links expire safely in 1 hour and are private to you."
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
            We'll send a gentle link directly to your entered email account.
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
              <Mail className="w-7 h-7 text-[#2C6336]" />
            </div>
            <h3 className="text-xl font-bold text-[#403344] font-['Nunito',sans-serif]">
              Check your inbox, lovely 💌
            </h3>
            <p className="text-xs sm:text-sm text-[#817583] leading-relaxed max-w-sm mx-auto">
              If an account is associated with <span className="font-bold text-[#403344]">{email}</span>, we've dispatched a gentle password reset email. Please check your inbox and spam folder.
            </p>

            {previewUrl && (
              <div className="pt-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#756291] bg-[#E9DFFF]/50 hover:bg-[#E9DFFF] px-4 py-2 rounded-full border border-[#CFBFF2] transition-colors"
                >
                  <span>Preview email in browser</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="pt-3">
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
          <form onSubmit={handleForgotSubmit} noValidate className="space-y-4">
            <FormField
              id="reset-email"
              label="Your account email"
              type="email"
              placeholder="lovely@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (serverNotice) setServerNotice(null);
              }}
              error={emailError}
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
