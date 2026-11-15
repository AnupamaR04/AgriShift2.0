import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, User, Phone, MapPin, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KERALA_DISTRICTS } from '../utils/keralaData';
import Button from '../components/ui/Button';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, isSupabaseConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('palakkad');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !phone) {
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
      await signup(email, password, {
        fullName,
        phone,
        district,
      });

      // After successful signup, redirect immediately to profile setup (Section 7)
      navigate('/profile-setup');
    } catch (err) {
      setError(err.message || 'Failed to create farmer account. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-agri-cream flex flex-col justify-between">
      {/* Top Simple Header */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-agri-forest flex items-center justify-center text-agri-mist shadow-soft">
            <Sprout className="w-5 h-5 text-agri-lightleaf" />
          </div>
          <span className="text-xl font-display font-extrabold text-agri-forest tracking-tight">AgriShift</span>
        </Link>
      </header>

      {/* Main Registration Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-agri-sand shadow-card p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-agri-mist text-agri-forest mb-3">
              <Sprout className="w-6 h-6 text-agri-paddy" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
              Create Kerala Farmer Account
            </h1>
            <p className="text-xs sm:text-sm text-agri-forest/70 mt-1">
              Join thousands of agricultural landowners and cultivators across Kerala
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
                  Full Name (കർഷകന്റെ പേര്) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radhakrishnan K"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  Phone Number (ഫോൺ നമ്പർ) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98470 XXXXX"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@kerala.agri"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  Kerala District (ജില്ല) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/40 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-forest uppercase tracking-wider mb-1.5">
                  Confirm Password *
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center text-sm font-semibold shadow-soft mt-4"
            >
              Continue to Farm Parcel Setup
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-agri-sand text-center text-xs text-agri-forest/70">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-agri-paddy hover:underline">
              Sign In to Your Farm
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-agri-forest/60">
        AgriShift Kerala. 100% Genuine agricultural intelligence.
      </footer>
    </div>
  );
}

export default SignupPage;
