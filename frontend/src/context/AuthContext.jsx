import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, localAuthService } from '../services/supabaseClient';
import { DEFAULT_KERALA_FARMER } from '../utils/keralaData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: DEFAULT_KERALA_FARMER.id,
    email: DEFAULT_KERALA_FARMER.email,
  });
  const [profile, setProfile] = useState(DEFAULT_KERALA_FARMER);
  const [loading, setLoading] = useState(true);

  // Initialize session
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
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (!mounted) return;
              if (session?.user) {
                setUser(session.user);
                await loadSupabaseProfile(session.user.id, session.user);
              } else {
                // Return to baseline farmer profile so dashboard remains interactive
                setUser({ id: DEFAULT_KERALA_FARMER.id, email: DEFAULT_KERALA_FARMER.email });
                setProfile(DEFAULT_KERALA_FARMER);
              }
            }
          );

          return () => {
            subscription?.unsubscribe?.();
          };
        } else {
          // Local storage session fallback
          const localSession = localAuthService.getSession();
          if (localSession?.user && localSession?.profile && mounted) {
            setUser(localSession.user);
            setProfile(localSession.profile);
          }
        }
      } catch (err) {
        console.warn('Error during authentication initialization:', err);
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
        console.warn('Supabase profile query issue (using safe fallback):', error.message);
      }

      if (data) {
        // Sanitize and ensure null database columns do not break the UI
        const cleanProfile = {
          ...DEFAULT_KERALA_FARMER,
          ...data,
          id: userId,
          email: authUser?.email || data.email || DEFAULT_KERALA_FARMER.email,
          full_name: data.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Kerala Farmer',
          phone: data.phone || authUser?.user_metadata?.phone || '98470 XXXXX',
          district: data.district || 'palakkad',
          state: data.state || 'Kerala',
          panchayat: data.panchayat || 'Alathur Grama Panchayat',
          farm_name: data.farm_name || 'My Kerala Farm',
          farm_size: data.farm_size != null && !isNaN(Number(data.farm_size)) ? Number(data.farm_size) : 2.5,
          farm_size_unit: data.farm_size_unit || 'acres',
          latitude: data.latitude != null && !isNaN(Number(data.latitude)) && Number(data.latitude) !== 0 ? Number(data.latitude) : 10.7867,
          longitude: data.longitude != null && !isNaN(Number(data.longitude)) && Number(data.longitude) !== 0 ? Number(data.longitude) : 76.6548,
          soil_type: data.soil_type || 'laterite',
          soil_drainage: data.soil_drainage || 'well_drained',
          soil_slope: data.soil_slope || 'gentle_slope',
          current_crop: data.current_crop || 'Paddy (Uma variety)',
          previous_crop: data.previous_crop || 'Cowpea (പയർ)',
          irrigation_method: data.irrigation_method || 'rainfed',
          farming_season: data.farming_season || 'mundakan',
          is_profile_complete: Boolean(data.is_profile_complete ?? (data.full_name && data.district)),
        };
        setProfile(cleanProfile);
      } else {
        // Fallback for new user with no row in profiles table yet
        const fallbackProfile = {
          ...DEFAULT_KERALA_FARMER,
          id: userId,
          email: authUser?.email || '',
          full_name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Kerala Farmer',
          phone: authUser?.user_metadata?.phone || '',
          district: authUser?.user_metadata?.district || 'palakkad',
          is_profile_complete: false,
        };
        setProfile(fallbackProfile);
      }
    } catch (err) {
      console.warn('Unexpected error in loadSupabaseProfile:', err);
      setProfile({
        ...DEFAULT_KERALA_FARMER,
        id: userId,
        email: authUser?.email || DEFAULT_KERALA_FARMER.email,
        is_profile_complete: false,
      });
    }
  };

  const login = async (email, password) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      await loadSupabaseProfile(data.user.id, data.user);
      return data;
    } else {
      const customUser = {
        id: 'farmer-' + Math.random().toString(36).substring(2, 9),
        email,
        created_at: new Date().toISOString(),
      };
      const customProfile = {
        ...DEFAULT_KERALA_FARMER,
        id: customUser.id,
        email,
        full_name: email.split('@')[0],
      };
      localAuthService.saveSession({ user: customUser, profile: customProfile });
      setUser(customUser);
      setProfile(customProfile);
      return { user: customUser, profile: customProfile };
    }
  };

  const signup = async (email, password, { fullName, phone, district }) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone, district },
        },
      });
      if (error) throw error;
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            phone: phone || '',
            district: district || 'palakkad',
            state: 'Kerala',
            latitude: 10.7867,
            longitude: 76.6548,
            is_profile_complete: false,
          });
        } catch (dbErr) {
          console.warn('Profile row auto-creation non-fatal note:', dbErr);
        }
      }
      return data;
    } else {
      const customUser = {
        id: 'farmer-' + Math.random().toString(36).substring(2, 9),
        email,
        created_at: new Date().toISOString(),
      };
      const customProfile = {
        ...DEFAULT_KERALA_FARMER,
        id: customUser.id,
        email,
        full_name: fullName || 'Kerala Farmer',
        phone: phone || '98470 XXXXX',
        district: district || 'palakkad',
      };
      localAuthService.saveSession({ user: customUser, profile: customProfile });
      setUser(customUser);
      setProfile(customProfile);
      return { user: customUser, profile: customProfile };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
    localAuthService.clearSession();
    setUser({ id: DEFAULT_KERALA_FARMER.id, email: DEFAULT_KERALA_FARMER.email });
    setProfile(DEFAULT_KERALA_FARMER);
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
    localAuthService.saveSession({ user, profile: updated });
    return updated;
  };

  const isProfileComplete = Boolean(
    profile && profile.full_name && profile.district && profile.latitude && profile.longitude
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
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
