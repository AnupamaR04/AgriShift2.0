-- =============================================================================
-- AGRISHIFT 2.0 — SUPABASE PRODUCTION SECURITY & AUTH HARDENING MIGRATION
-- Principle: Safe incremental migration (non-destructive), strict RLS, no duplicates
-- =============================================================================

-- 1. EXTEND PROFILES TABLE WITH SAFE NON-DESTRUCTIVE COLUMNS
-- Ensures all farmer parameters can be stored directly and securely on the profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS farm_name TEXT DEFAULT 'My Agricultural Parcel';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS farm_size NUMERIC(8,2) DEFAULT 2.5;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS farm_size_unit TEXT DEFAULT 'acres';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,6) DEFAULT 10.7867;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longitude NUMERIC(10,6) DEFAULT 76.6548;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS soil_type TEXT DEFAULT 'laterite';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS soil_drainage TEXT DEFAULT 'well_drained';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS soil_slope TEXT DEFAULT 'gentle_slope';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_crop TEXT DEFAULT 'Paddy Rice';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS previous_crop TEXT DEFAULT 'Cowpea';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS irrigation_method TEXT DEFAULT 'rainfed';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS farming_season TEXT DEFAULT 'mundakan';

-- 2. ENABLE ROW LEVEL SECURITY (RLS) ACROSS ALL USER TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_rotation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;

-- 3. DROP INSECURE OR DUPLICATE POLICIES SAFELY IF PRESENT
DO $$
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

    -- Farms policies
    DROP POLICY IF EXISTS "Farmers can view their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Farmers can insert their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Farmers can update their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Farmers can delete their own farms" ON public.farms;
    
    -- Satellite observations policies
    DROP POLICY IF EXISTS "Farmers can view satellite observations for their farms" ON public.satellite_observations;
    DROP POLICY IF EXISTS "Farmers can insert satellite observations for their farms" ON public.satellite_observations;

    -- Weather observations policies
    DROP POLICY IF EXISTS "Farmers can view weather observations for their farms" ON public.weather_observations;
    DROP POLICY IF EXISTS "Farmers can insert weather observations for their farms" ON public.weather_observations;

    -- Saved schemes policies
    DROP POLICY IF EXISTS "Users can manage their saved schemes" ON public.saved_schemes;
END $$;

-- 4. CREATE STRICT LEAST-PRIVILEGE RLS POLICIES

-- A. PROFILES (Strictly Private to the Authenticated Owner)
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- B. FARMS (Strictly Private to Farm Owner)
CREATE POLICY "Farmers can view their own farms"
    ON public.farms FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Farmers can insert their own farms"
    ON public.farms FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers can update their own farms"
    ON public.farms FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers can delete their own farms"
    ON public.farms FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- C. SATELLITE OBSERVATIONS (Scattered Only to Farm Owner)
CREATE POLICY "Farmers can view satellite observations for their farms"
    ON public.satellite_observations FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.farms
            WHERE farms.id = satellite_observations.farm_id
            AND farms.user_id = auth.uid()
        )
    );

CREATE POLICY "Farmers can insert satellite observations for their farms"
    ON public.satellite_observations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.farms
            WHERE farms.id = satellite_observations.farm_id
            AND farms.user_id = auth.uid()
        )
    );

-- D. WEATHER OBSERVATIONS (Scattered Only to Farm Owner)
CREATE POLICY "Farmers can view weather observations for their farms"
    ON public.weather_observations FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.farms
            WHERE farms.id = weather_observations.farm_id
            AND farms.user_id = auth.uid()
        )
    );

CREATE POLICY "Farmers can insert weather observations for their farms"
    ON public.weather_observations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.farms
            WHERE farms.id = weather_observations.farm_id
            AND farms.user_id = auth.uid()
        )
    );

-- E. SAVED SCHEMES (Strictly Private Bookmarks)
CREATE POLICY "Users can manage their saved schemes"
    ON public.saved_schemes FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. AUTOMATIC SECURE USER PROFILE INITIALIZATION TRIGGER
-- Prevents race conditions, duplicate profiles, and missing profile crashes upon Supabase Email Confirmation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        phone,
        district,
        state,
        country,
        location,
        is_profile_complete,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'district', 'Palakkad'),
        COALESCE(NEW.raw_user_meta_data->>'state', 'Kerala'),
        COALESCE(NEW.raw_user_meta_data->>'country', 'India'),
        COALESCE(NEW.raw_user_meta_data->>'location', 'Palakkad, Kerala, India'),
        false,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. SECURITY AUDIT VERIFICATION VIEW
-- Allows admins to verify RLS status on public tables
CREATE OR REPLACE VIEW public.vw_security_audit AS
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public';
