import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from '../components/common/LanguageSelector';
import Button from '../components/ui/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isSupabaseConfigured } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState(() => location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [isAccountNotFound, setIsAccountNotFound] = useState(false);

  const fromLocation = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsAccountNotFound(false);
    setUnverifiedEmail('');

    if (!email || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Navigate to destination on successful login
      navigate(fromLocation, { replace: true });
    } catch (err) {
      const errMsg = err.message || 'Failed to authenticate.';
      setError(errMsg);

      // Check if email not verified
      if (err.code === 'EMAIL_NOT_VERIFIED' || errMsg.toLowerCase().includes('not verified') || errMsg.toLowerCase().includes('not confirmed')) {
        setUnverifiedEmail(email.trim().toLowerCase());
      }

      // Check if account was not found
      if (errMsg.toLowerCase().includes('account not found') || errMsg.toLowerCase().includes('register first')) {
        setIsAccountNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-agri-cream flex flex-col justify-between">
      {/* Top Header with Brand & Language Selector */}
      <header className="p-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-agri-forest flex items-center justify-center text-agri-mist shadow-soft">
            <Sprout className="w-5 h-5 text-agri-lightleaf" />
          </div>
          <span className="text-xl font-display font-extrabold text-agri-forest tracking-tight">AgriShift</span>
        </Link>
        <LanguageSelector />
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-agri-sand shadow-card p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-agri-mist text-agri-forest mb-3">
              <Lock className="w-6 h-6 text-agri-paddy" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
              {t('auth_signin_title')}
            </h1>
            <p className="text-xs sm:text-sm text-agri-forest/70 mt-1">
              {t('auth_signin_sub')}
            </p>
          </div>

          {location.state?.verified && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{t('auth_success_verified')}</span>
            </div>
          )}

          {/* Database indicator */}
          <div className="mb-6 p-2.5 rounded-xl bg-agri-cream border border-agri-sand flex items-center gap-2 text-xs text-agri-forest">
            <ShieldCheck className="w-4 h-4 text-agri-leaf shrink-0" />
            <span>
              {isSupabaseConfigured
                ? 'Secured with Supabase Authentication.'
                : 'Supabase configuration required in environment variables.'}
            </span>
          </div>

          {/* Error Message with actionable guidance */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex flex-col gap-2 text-xs text-red-800">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-semibold">{error}</span>
              </div>
              {isAccountNotFound && (
                <div className="pt-2 border-t border-red-200 flex justify-end">
                  <Link
                    to="/signup"
                    state={{ email }}
                    className="font-bold text-red-700 hover:underline flex items-center gap-1"
                  >
                    Click here to Register New Account ➔
                  </Link>
                </div>
              )}
              {unverifiedEmail && (
                <div className="pt-2 border-t border-red-200 flex justify-end">
                  <Link
                    to={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                    className="font-bold text-red-700 hover:underline flex items-center gap-1"
                  >
                    Verify Email / Resend Confirmation ➔
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                {t('auth_email_label')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-agri-forest uppercase tracking-wider">
                  {t('auth_password_label')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-agri-paddy hover:underline font-semibold"
                >
                  {t('auth_forgot_link')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center text-sm font-semibold shadow-soft mt-2"
            >
              {t('auth_signin_btn')}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-agri-sand text-center text-xs text-agri-forest/70">
            {t('auth_no_account')}{' '}
            <Link to="/signup" className="font-bold text-agri-paddy hover:underline">
              {t('auth_register_now')}
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

export default LoginPage;
