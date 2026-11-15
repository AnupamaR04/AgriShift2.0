import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, KeyRound, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from '../components/common/LanguageSelector';
import Button from '../components/ui/Button';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset, isSupabaseConfigured } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await requestPasswordReset(email);
      setSuccessMsg(res.message || 'Password reset link sent! Please check your email inbox.');
    } catch (err) {
      setError(err.message || 'Failed to dispatch password reset link.');
    } finally {
      setLoading(false);
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
            <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-700 mb-3">
              <KeyRound className="w-7 h-7 text-amber-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
              {t('auth_forgot_title')}
            </h1>
            <p className="text-xs sm:text-sm text-agri-forest/70 mt-1">
              Enter your registered email address to receive a secure password recovery link.
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

          <form onSubmit={handleRequestReset} className="space-y-4">
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center text-sm font-semibold shadow-soft mt-2"
            >
              {t('auth_forgot_btn')}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-agri-sand text-center text-xs text-agri-forest/70">
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

export default ForgotPasswordPage;
