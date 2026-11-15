import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Requirement 4: Unauthenticated visitors must NOT have a default user/profile
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.warn('Supabase getSession error:', sessionError);
          }

          if (session?.user && mounted) {
            setUser(session.user);
            await loadSupabaseProfile(session.user.id, session.user);
          } else {
            // Check local registered session
            const localSession = authService.getCurrentSession();
            if (localSession?.user && mounted) {
              setUser(localSession.user);
              setProfile(localSession.profile);
            }
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (!mounted) return;
              if (session?.user) {
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
          // Local verified storage session
          const localSession = authService.getCurrentSession();
          if (localSession?.user && localSession?.profile && mounted) {
            setUser(localSession.user);
            setProfile(localSession.profile);
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

  const loadSupabaseProfile = async (userId, authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Supabase profile query issue:', error.message);
      }

      if (data) {
        const cleanProfile = {
          ...data,
          id: userId,
          email: authUser?.email || data.email,
          full_name: data.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Farmer',
          phone: data.phone || authUser?.user_metadata?.phone || '',
          district: data.district || 'Palakkad',
          state: data.state || 'Kerala',
          country: data.country || 'India',
          location: data.location || `${data.district || 'Palakkad'}, ${data.state || 'Kerala'}`,
          farm_name: data.farm_name || 'My Agricultural Parcel',
          farm_size: data.farm_size != null && !isNaN(Number(data.farm_size)) ? Number(data.farm_size) : 2.5,
          farm_size_unit: data.farm_size_unit || 'acres',
          latitude: data.latitude != null && !isNaN(Number(data.latitude)) && Number(data.latitude) !== 0 ? Number(data.latitude) : 10.7867,
          longitude: data.longitude != null && !isNaN(Number(data.longitude)) && Number(data.longitude) !== 0 ? Number(data.longitude) : 76.6548,
          soil_type: data.soil_type || 'laterite',
          soil_drainage: data.soil_drainage || 'well_drained',
          soil_slope: data.soil_slope || 'gentle_slope',
          current_crop: data.current_crop || 'Paddy Rice',
          previous_crop: data.previous_crop || 'Cowpea',
          irrigation_method: data.irrigation_method || 'rainfed',
          farming_season: data.farming_season || 'mundakan',
          is_profile_complete: Boolean(data.is_profile_complete ?? (data.full_name && data.district)),
        };
        setProfile(cleanProfile);
      } else {
        const fallbackProfile = {
          id: userId,
          email: authUser?.email || '',
          full_name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Farmer',
          phone: authUser?.user_metadata?.phone || '',
          district: authUser?.user_metadata?.district || 'Palakkad',
          state: 'Kerala',
          country: 'India',
          location: 'Palakkad, Kerala, India',
          farm_name: 'My Agricultural Parcel',
          farm_size: 2.5,
          farm_size_unit: 'acres',
          latitude: 10.7867,
          longitude: 76.6548,
          is_profile_complete: false,
        };
        setProfile(fallbackProfile);
      }
    } catch (err) {
      console.warn('Unexpected error in loadSupabaseProfile:', err);
    }
  };

  /**
   * Login: Strictly validates credentials.
   * If email is unregistered, rejects with: "Account not found. Please register first."
   */
  const login = async (email, password) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message?.includes('Invalid login credentials') || error.message?.includes('Email not confirmed')) {
          // Check local registered directory to provide exact messaging
          const localUser = authService.findUserByEmail(email);
          if (!localUser) {
            throw new Error('Account not found. Please register first.');
          }
        }
        throw error;
      }
      setUser(data.user);
      await loadSupabaseProfile(data.user.id, data.user);
      return data;
    } else {
      // Local authentication service
      const sessionData = await authService.loginUser(email, password);
      setUser(sessionData.user);
      setProfile(sessionData.profile);
      return sessionData;
    }
  };

  /**
   * Registration: Creates account, generates 6-digit OTP code, and requires verification.
   */
  const signup = async (email, password, details = {}) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: details.fullName,
            phone: details.phone,
            district: details.district,
            location: details.location,
            country: details.country,
          },
        },
      });
      if (error) throw error;
      return { success: true, email, supabaseData: data };
    } else {
      // Register with OTP dispatch
      return await authService.registerUser({
        email,
        password,
        fullName: details.fullName,
        phone: details.phone,
        location: details.location,
        country: details.country,
        district: details.district,
        latitude: details.latitude,
        longitude: details.longitude,
      });
    }
  };

  /**
   * Verify email via 6-digit OTP code
   */
  const verifyOtp = async (email, otpCode) => {
    const result = authService.verifyEmailOtp(email, otpCode);
    return result;
  };

  /**
   * Resend OTP code
   */
  const resendOtp = async (email) => {
    return authService.resendVerificationOtp(email);
  };

  /**
   * Request password reset code
   */
  const requestPasswordReset = async (email) => {
    return authService.requestPasswordReset(email);
  };

  /**
   * Reset password with OTP code
   */
  const resetPassword = async (email, otpCode, newPassword) => {
    return authService.resetPasswordWithOtp(email, otpCode, newPassword);
  };

  /**
   * Logout: Clears all user and profile state to null and clears stored tokens
   */
  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out notice:', err);
      }
    }
    authService.clearSession();
    setUser(null);
    setProfile(null);
  };

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
        console.warn('Supabase upsert failed:', err);
      }
    }

    setProfile(updated);
    // Update active session in storage
    const current = authService.getCurrentSession();
    if (current) {
      current.profile = updated;
      localStorage.setItem('agrishift_farmer_session', JSON.stringify(current));
    }
    return updated;
  };

  const isProfileComplete = Boolean(
    profile && profile.full_name && (profile.district || profile.location) && profile.latitude && profile.longitude
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        verifyOtp,
        resendOtp,
        requestPasswordReset,
        resetPassword,
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
