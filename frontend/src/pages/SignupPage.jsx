import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Lock, Mail, User, Phone, Globe, MapPin, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from '../components/common/LanguageSelector';
import Button from '../components/ui/Button';

export function SignupPage() {
  const navigate = useNavigate();
  const locationState = useLocation().state;
  const { signup, isSupabaseConfigured } = useAuth();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(() => locationState?.email || '');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');
  const [district, setDistrict] = useState('Palakkad');
  const [locationName, setLocationName] = useState('Palakkad, Kerala, India');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all required farmer registration fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await signup(email, password, {
        fullName,
        phone,
        country,
        district,
        location: locationName || `${district}, ${country}`,
        latitude: district === 'Palakkad' ? 10.7867 : 39.4699,
        longitude: district === 'Palakkad' ? 76.6548 : -0.3763,
      });

      // Requirement 4A: "After successful registration and verification, allow the user to log in."
      // Navigate to /verify-email with email and OTP in state
      navigate('/verify-email', {
        state: {
          email: email.trim().toLowerCase(),
          otpCode: res.otpCode,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to create farmer account. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-agri-cream flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-agri-forest flex items-center justify-center text-agri-mist shadow-soft">
            <Sprout className="w-5 h-5 text-agri-lightleaf" />
          </div>
          <span className="text-xl font-display font-extrabold text-agri-forest tracking-tight">AgriShift</span>
        </Link>
        <LanguageSelector />
      </header>

      {/* Main Registration Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-agri-sand shadow-card p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-agri-mist text-agri-forest mb-3">
              <Sprout className="w-6 h-6 text-agri-paddy" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
              {t('auth_signup_title')}
            </h1>
            <p className="text-xs sm:text-sm text-agri-forest/70 mt-1">
              {t('auth_signup_sub')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  {t('auth_fullname_label')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radhakrishnan K / Maria R"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  {t('auth_phone_label')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98470 XXXXX"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  {t('auth_email_label')} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  {t('auth_country_label')} *
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India, USA, Spain, Kenya"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                Farm Region / District / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => {
                    setLocationName(e.target.value);
                    setDistrict(e.target.value.split(',')[0] || e.target.value);
                  }}
                  placeholder="e.g. Palakkad, Kerala or Valencia, Spain"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  {t('auth_password_label')} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  {t('auth_confirm_password')} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand text-xs text-agri-forest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-agri-leaf shrink-0" />
              <span>A 6-digit email verification code (OTP) will be dispatched to activate your account.</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center text-sm font-semibold shadow-soft mt-2"
            >
              {t('auth_signup_btn')}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-agri-sand text-center text-xs text-agri-forest/70">
            {t('auth_have_account')}{' '}
            <Link to="/login" className="font-bold text-agri-paddy hover:underline">
              {t('nav_login')}
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

export default SignupPage;
