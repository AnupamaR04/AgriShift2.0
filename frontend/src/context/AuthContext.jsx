import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Visitor starts strictly unauthenticated (null)
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from Supabase Auth on application load
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.warn('Supabase getSession notice:', sessionError.message);
          }

          if (session?.user && mounted) {
            // Only confirmed users should access profile & session
            if (session.user.confirmed_at || session.user.email_confirmed_at) {
              setUser(session.user);
              await loadSupabaseProfile(session.user.id, session.user);
            } else {
              setUser(null);
              setProfile(null);
            }
          }

          // Listen for real-time auth state events (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED)
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (!mounted) return;
              if (session?.user && (session.user.confirmed_at || session.user.email_confirmed_at)) {
                setUser(session.user);
                await loadSupabaseProfile(session.user.id, session.user);
              } else {
                setUser(null);
                setProfile(null);
              }
            }
          );

          return () => {
            subscription?.unsubscribe?.();
          };
        } else {
          // Supabase credentials not configured in environment
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.warn('Error during authentication initialization:', err);
        setUser(null);
        setProfile(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Loads farmer profile from Supabase 'profiles' table
   * Safely creates the initial profile if this is a newly confirmed user without duplicates
   */
  const loadSupabaseProfile = async (userId, authUser) => {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Supabase profile query issue:', error.message);
      }

      if (data) {
        setProfile({
          ...data,
          id: userId,
          email: authUser?.email || data.email,
          full_name: data.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Farmer',
          phone: data.phone || authUser?.user_metadata?.phone || '',
          district: data.district || authUser?.user_metadata?.district || 'Palakkad',
          state: data.state || 'Kerala',
          country: data.country || authUser?.user_metadata?.country || 'India',
          location: data.location || authUser?.user_metadata?.location || 'Palakkad, Kerala, India',
          farm_name: data.farm_name || 'My Agricultural Parcel',
          farm_size: data.farm_size != null ? Number(data.farm_size) : 2.5,
          farm_size_unit: data.farm_size_unit || 'acres',
          latitude: data.latitude != null ? Number(data.latitude) : 10.7867,
          longitude: data.longitude != null ? Number(data.longitude) : 76.6548,
          soil_type: data.soil_type || 'laterite',
          current_crop: data.current_crop || 'Paddy Rice',
          farming_season: data.farming_season || 'mundakan',
          is_profile_complete: Boolean(data.is_profile_complete ?? (data.full_name && data.district)),
        });
      } else {
        // Safe profile creation from auth metadata
        const metadata = authUser?.user_metadata || {};
        const newProfile = {
          id: userId,
          email: authUser?.email || '',
          full_name: metadata.full_name || authUser?.email?.split('@')[0] || 'Farmer',
          phone: metadata.phone || '',
          district: metadata.district || 'Palakkad',
          state: 'Kerala',
          country: metadata.country || 'India',
          location: metadata.location || 'Palakkad, Kerala, India',
          is_profile_complete: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          await supabase.from('profiles').upsert(newProfile, { onConflict: 'id' });
        } catch (insertErr) {
          console.warn('Non-fatal profile upsert notice:', insertErr.message);
        }

        setProfile(newProfile);
      }
    } catch (err) {
      console.warn('Unexpected error in loadSupabaseProfile:', err);
    }
  };

  /**
   * Supabase Signup:
   * Creates real account in Supabase Auth and triggers genuine verification email.
   * NO mock code, NO fake client OTPs.
   */
  const signup = async (email, password, details = {}) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error(
        'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables to enable real account registration and email delivery.'
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: details.fullName,
          phone: details.phone || '',
          district: details.district || 'Palakkad',
          country: details.country || 'India',
          location: details.location || `${details.district || 'Palakkad'}, ${details.country || 'India'}`,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Check if user already exists
    if (data?.user?.identities && data.user.identities.length === 0) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    return {
      success: true,
      email: cleanEmail,
      user: data.user,
      session: data.session,
      needsEmailConfirmation: !data.session,
    };
  };

  /**
   * Supabase Login:
   * Strictly verifies email and password against Supabase Auth.
   * Checks if email is confirmed.
   */
  const login = async (email, password) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error(
        'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const msg = error.message || '';
      // Supabase returns 'Email not confirmed' when user has not clicked verification link / confirmed OTP
      if (msg.toLowerCase().includes('email not confirmed') || msg.toLowerCase().includes('not confirmed')) {
        const unverifiedErr = new Error(
          'Your email is not verified yet. Please check your inbox and verify your account.'
        );
        unverifiedErr.code = 'EMAIL_NOT_VERIFIED';
        unverifiedErr.email = cleanEmail;
        throw unverifiedErr;
      }

      if (msg.toLowerCase().includes('invalid login credentials')) {
        throw new Error('Account not found or password incorrect. Please register first if you do not have an account.');
      }

      throw error;
    }

    if (!data.user) {
      throw new Error('Authentication failed. Please verify your credentials.');
    }

    setUser(data.user);
    await loadSupabaseProfile(data.user.id, data.user);
    return data;
  };

  /**
   * Verifies an email OTP code directly against Supabase Auth backend
   * (Applicable when Supabase email template sends a 6-digit confirmation code)
   */
  const verifyEmailOtp = async (email, token) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured. Real verification requires Supabase environment variables.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = String(token).trim();

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'signup',
    });

    if (error) {
      throw error;
    }

    if (data?.user) {
      setUser(data.user);
      await loadSupabaseProfile(data.user.id, data.user);
    }

    return { success: true, user: data.user, session: data.session };
  };

  /**
   * Resends the Supabase confirmation email
   */
  const resendConfirmationEmail = async (email) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      throw error;
    }

    return { success: true, message: 'Verification email resent! Please check your inbox and spam folder.' };
  };

  /**
   * Requests a password reset link via Supabase Auth
   */
  const requestPasswordReset = async (email) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const redirectTo = `${window.location.origin}/auth/callback?type=recovery`;

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Password reset link sent! Please check your email inbox.',
    };
  };

  /**
   * Updates password after recovery confirmation
   */
  const updateUserPassword = async (newPassword) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true, user: data.user };
  };

  /**
   * Sign out: Strictly clears session and resets all user/profile states to null
   */
  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out notice:', err.message);
      }
    }
    setUser(null);
    setProfile(null);
  };

  /**
   * Updates farmer profile attributes in public.profiles table
   */
  const updateProfile = async (profileData) => {
    const updated = {
      ...profile,
      ...profileData,
      is_profile_complete: true,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase && user) {
      try {
        await supabase.from('profiles').upsert({ id: user.id, ...updated });
      } catch (err) {
        console.warn('Supabase profile upsert issue:', err.message);
      }
    }

    setProfile(updated);
    return updated;
  };

  const isProfileComplete = Boolean(
    profile && profile.full_name && (profile.district || profile.location)
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        verifyEmailOtp,
        resendConfirmationEmail,
        requestPasswordReset,
        updateUserPassword,
        logout,
        updateProfile,
        isProfileComplete,
        isSupabaseConfigured: isSupabaseConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
