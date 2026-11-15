import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function handleAuthCallback() {
      if (!isSupabaseConfigured() || !supabase) {
        setStatus('error');
        setErrorMessage('Supabase is not configured on this deployment.');
        return;
      }

      try {
        // 1. Check for URL error parameters
        const searchParams = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(location.hash.replace('#', ''));
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

        if (errorDescription) {
          throw new Error(errorDescription);
        }

        // 2. Handle PKCE code exchange if ?code= is present
        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        // 3. Retrieve confirmed session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          // 4. Ensure farmer profile row exists in public.profiles table without duplicate collision
          try {
            const metadata = session.user.user_metadata || {};
            await supabase.from('profiles').upsert(
              {
                id: session.user.id,
                email: session.user.email,
                full_name: metadata.full_name || session.user.email?.split('@')[0] || 'Farmer',
                phone: metadata.phone || '',
                district: metadata.district || 'Palakkad',
                state: 'Kerala',
                country: metadata.country || 'India',
                location: metadata.location || 'Palakkad, Kerala, India',
                is_profile_complete: false,
              },
              { onConflict: 'id' }
            );
          } catch (profileErr) {
            console.warn('Profile initialization note:', profileErr.message);
          }

          if (mounted) {
            setStatus('success');
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1200);
          }
        } else {
          // If no session found yet, wait briefly for Supabase event listener or prompt user
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession?.user && mounted) {
              setStatus('success');
              navigate('/dashboard', { replace: true });
            } else if (mounted) {
              setStatus('error');
              setErrorMessage('Verification link is invalid or has expired. Please sign in or request a new link.');
            }
          }, 2000);
        }
      } catch (err) {
        if (mounted) {
          setStatus('error');
          setErrorMessage(err.message || 'Failed to verify account.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      mounted = false;
    };
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-agri-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-agri-sand shadow-card p-8 sm:p-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-agri-forest flex items-center justify-center text-agri-mist shadow-soft">
            <Sprout className="w-8 h-8 text-agri-lightleaf" />
          </div>
        </div>

        {status === 'verifying' && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <RefreshCw className="w-8 h-8 text-agri-leaf animate-spin" />
            </div>
            <h2 className="text-xl font-display font-extrabold text-agri-forest">
              Verifying Your Account...
            </h2>
            <p className="text-xs text-agri-forest/70">
              Please wait while we confirm your email and prepare your agricultural parcel.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-xl font-display font-extrabold text-agri-forest">
              Email Verified Successfully!
            </h2>
            <p className="text-xs text-agri-forest/70">
              Welcome to AgriShift. Redirecting to your farm dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-xl font-display font-extrabold text-agri-forest">
              Verification Issue
            </h2>
            <p className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
              {errorMessage}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-agri-forest text-white text-xs font-bold hover:bg-agri-dark shadow-soft"
              >
                Go to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCallbackPage;
