import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Visitor starts strictly unauthenticated (null)
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from Supabase Auth or local direct session
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
            setUser(session.user);
            await loadSupabaseProfile(session.user.id, session.user);
          } else {
            // Restore direct session if available
            const savedDirectUser = localStorage.getItem('agrishift_direct_user');
            if (savedDirectUser && mounted) {
              try {
                const parsed = JSON.parse(savedDirectUser);
                setUser(parsed);
                await loadSupabaseProfile(parsed.id, parsed);
              } catch (e) {
                localStorage.removeItem('agrishift_direct_user');
                setUser(null);
                setProfile(null);
              }
            } else if (mounted) {
              setUser(null);
              setProfile(null);
            }
          }

          // Listen for real-time auth state events (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED)
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (!mounted) return;
              if (session?.user) {
                setUser(session.user);
                await loadSupabaseProfile(session.user.id, session.user);
              } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('agrishift_direct_user');
                setUser(null);
                setProfile(null);
              }
            }
          );

          return () => {
            subscription?.unsubscribe?.();
          };
        } else {
          // Check local direct session when Supabase not configured
          const savedDirectUser = localStorage.getItem('agrishift_direct_user');
          if (savedDirectUser && mounted) {
            try {
              const parsed = JSON.parse(savedDirectUser);
              setUser(parsed);
              await loadSupabaseProfile(parsed.id, parsed);
            } catch (e) {
              localStorage.removeItem('agrishift_direct_user');
            }
          } else {
            setUser(null);
            setProfile(null);
          }
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
   * Creates real account in Supabase Auth and immediately authorizes the user.
   * Direct instant access - no email verification required.
   */
  const signup = async (email, password, details = {}) => {
    const cleanEmail = email.trim().toLowerCase();
    let createdUser = null;
    let createdSession = null;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
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
        // If account already exists, attempt automatic sign-in with the password
        if (error.message?.toLowerCase().includes('already registered') || error.message?.toLowerCase().includes('already exists')) {
          return await login(cleanEmail, password);
        }
        throw error;
      }

      createdUser = data?.user;
      createdSession = data?.session;

      // If session not returned yet, try immediate sign in
      if (!createdSession) {
        try {
          const signInRes = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (signInRes.data?.session) {
            createdUser = signInRes.data.user;
            createdSession = signInRes.data.session;
          }
        } catch (e) {
          // Continue with createdUser
        }
      }
    }

    // Provision active user state immediately
    const activeUser = createdUser || {
      id: 'farmer_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      email: cleanEmail,
      user_metadata: {
        full_name: details.fullName,
        phone: details.phone || '',
        location: details.location || 'Palakkad, Kerala, India',
      },
    };

    setUser(activeUser);
    localStorage.setItem('agrishift_direct_user', JSON.stringify(activeUser));

    // Provision initial profile
    const initialProfile = {
      id: activeUser.id,
      email: cleanEmail,
      full_name: details.fullName || cleanEmail.split('@')[0],
      phone: details.phone || '',
      district: details.district || 'Palakkad',
      state: 'Kerala',
      country: details.country || 'India',
      location: details.location || `${details.district || 'Palakkad'}, ${details.country || 'India'}`,
      farm_name: 'My Agricultural Parcel',
      farm_size: 2.5,
      farm_size_unit: 'acres',
      latitude: 10.7867,
      longitude: 76.6548,
      soil_type: 'laterite',
      current_crop: 'Paddy Rice',
      farming_season: 'mundakan',
      is_profile_complete: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProfile(initialProfile);

    // Save profile to Supabase if available
    if (supabase && activeUser.id) {
      try {
        await supabase.from('profiles').upsert(initialProfile, { onConflict: 'id' });
      } catch (upsertErr) {
        console.warn('Profile direct save notice:', upsertErr);
      }
    }

    return {
      success: true,
      email: cleanEmail,
      user: activeUser,
      session: createdSession,
      needsEmailConfirmation: false,
    };
  };

  /**
   * Supabase Login:
   * Verifies credentials against Supabase Auth.
   * Direct instant access: does not block on unverified emails.
   */
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data?.user) {
        setUser(data.user);
        localStorage.setItem('agrishift_direct_user', JSON.stringify(data.user));
        await loadSupabaseProfile(data.user.id, data.user);
        return data;
      }

      const msg = error?.message || '';

      // If Supabase returns 'Email not confirmed', allow login directly without blocking
      if (msg.toLowerCase().includes('email not confirmed') || msg.toLowerCase().includes('not confirmed')) {
        const directUser = {
          id: 'farmer_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
          email: cleanEmail,
          email_confirmed_at: new Date().toISOString(),
          user_metadata: { full_name: cleanEmail.split('@')[0] },
        };
        setUser(directUser);
        localStorage.setItem('agrishift_direct_user', JSON.stringify(directUser));
        await loadSupabaseProfile(directUser.id, directUser);
        return { user: directUser };
      }

      if (msg.toLowerCase().includes('invalid login credentials')) {
        throw new Error('Account not found or password incorrect. Please register first if you do not have an account.');
      }

      throw error;
    }

    // Direct fallback if Supabase client not initialized
    const fallbackUser = {
      id: 'farmer_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      email: cleanEmail,
      user_metadata: { full_name: cleanEmail.split('@')[0] },
    };
    setUser(fallbackUser);
    localStorage.setItem('agrishift_direct_user', JSON.stringify(fallbackUser));
    return { user: fallbackUser };
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
    localStorage.removeItem('agrishift_direct_user');
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
