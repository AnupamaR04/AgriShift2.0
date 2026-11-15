import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Mail, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, CheckCircle2, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from '../components/common/LanguageSelector';
import Button from '../components/ui/Button';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmailOtp, resendConfirmationEmail, isSupabaseConfigured } = useAuth();
  const { t } = useTranslation();

  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get('email') || location.state?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Code confirmation handler (for Supabase OTP code templates)
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }

    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit verification code received in your email.');
      return;
    }

    try {
      setLoading(true);
      await verifyEmailOtp(email, otp);
      setSuccessMsg(t('auth_success_verified'));
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Resend confirmation email
  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setError('');
    try {
      setResending(true);
      const res = await resendConfirmationEmail(email);
      setCountdown(60);
      setSuccessMsg(res.message || 'A new verification email has been sent. Please check your inbox.');
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('rate limit')) {
        setError(
          'Email rate limit reached (Supabase free tier sends max 3-4 emails/hour). You can click "Auto Confirm User" in Supabase Dashboard -> Authentication -> Users to activate your account instantly.'
        );
      } else {
        setError(err.message || 'Could not resend verification email.');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-agri-cream flex flex-col justify-between">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-agri-forest flex items-center justify-center text-agri-mist shadow-soft">
            <Sprout className="w-5 h-5 text-agri-lightleaf" />
          </div>
          <span className="text-xl font-display font-extrabold text-agri-forest tracking-tight">AgriShift</span>
        </Link>
        <LanguageSelector />
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-agri-sand shadow-card p-8 sm:p-10">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-700 mb-3">
              <Inbox className="w-8 h-8 text-agri-leaf animate-bounce" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
              {t('auth_verify_title')}
            </h1>
            <p className="text-xs sm:text-sm text-agri-forest/70 mt-1.5 leading-relaxed">
              Please check your email to verify your account.
            </p>
          </div>

          {/* Clean Guidance Notice */}
          <div className="mb-6 p-4 rounded-2xl bg-agri-mist/40 border border-agri-sand text-xs text-agri-forest space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-agri-forest">
              <Mail className="w-4 h-4 text-agri-leaf shrink-0" />
              <span>Verification email sent to:</span>
            </div>
            <div className="font-mono font-bold text-agri-paddy bg-white px-2.5 py-1.5 rounded-lg border border-agri-sand break-all">
              {email || 'your registered email'}
            </div>
            <p className="text-agri-forest/70 text-[11px] leading-relaxed pt-1">
              Click the confirmation link inside the email to immediately activate your account, or enter the 6-digit code below if your email included one.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Optional Code Confirmation Form */}
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                {t('auth_otp_label')}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full text-center tracking-[0.5em] font-mono font-bold text-xl px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-agri-forest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!otp || otp.length < 6}
              className="w-full justify-center text-sm font-semibold shadow-soft mt-2"
            >
              {t('auth_verify_btn')}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Rate-Limited Resend Confirmation Email */}
          <div className="mt-6 pt-4 border-t border-agri-sand flex items-center justify-between text-xs text-agri-forest/70">
            <span>Didn't receive the email?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              className="font-bold text-agri-paddy hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-agri-forest/70">
            <Link to="/login" className="font-bold text-agri-paddy hover:underline">
              {t('auth_back_login')}
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-agri-forest/60">
        AgriShift 2.0 • Worldwide Agricultural Intelligence Platform
      </footer>
    </div>
  );
}

export default VerifyEmailPage;
