import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, MailCheck, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from '../components/common/LanguageSelector';
import Button from '../components/ui/Button';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();
  const { t } = useTranslation();

  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get('email') || location.state?.email || '';
  const initialOtp = location.state?.otpCode || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(
    initialOtp ? `Verification code dispatched: ${initialOtp}` : ''
  );
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Please provide your registered email.');
      return;
    }

    if (!otp || otp.length < 6) {
      setError(t('auth_error_otp_invalid'));
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(email, otp);
      setSuccessMsg(t('auth_success_verified'));
      setTimeout(() => {
        navigate('/login', { state: { email, verified: true } });
      }, 1500);
    } catch (err) {
      setError(err.message || t('auth_error_otp_invalid'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setError('');
    try {
      setResending(true);
      const res = await resendOtp(email);
      setCountdown(60);
      setSuccessMsg(res.message || 'A new 6-digit code has been dispatched.');
      if (res.otpCode) {
        setOtp(res.otpCode);
      }
    } catch (err) {
      setError(err.message || 'Could not resend verification code.');
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
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-700 mb-3">
              <MailCheck className="w-7 h-7 text-agri-leaf" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
              {t('auth_verify_title')}
            </h1>
            <p className="text-xs sm:text-sm text-agri-forest/70 mt-1">
              {t('auth_verify_sub')}
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

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                {t('auth_email_label')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@domain.com"
                className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                {t('auth_otp_label')}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit code"
                className="w-full text-center tracking-[0.5em] font-mono font-bold text-xl px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-agri-forest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center text-sm font-semibold shadow-soft mt-2"
            >
              {t('auth_verify_btn')}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Resend Code Section */}
          <div className="mt-6 pt-4 border-t border-agri-sand flex items-center justify-between text-xs text-agri-forest/70">
            <span>Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              className="font-bold text-agri-paddy hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
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
