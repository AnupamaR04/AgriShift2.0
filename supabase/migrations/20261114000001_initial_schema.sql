-- =============================================================================
-- AGRISHIFT KERALA — SUPABASE POSTGRESQL PRODUCTION-INTENDED SCHEMA
-- Principle: Safe incremental migration (IF NOT EXISTS), Row Level Security (RLS)
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked directly to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    state TEXT DEFAULT 'Kerala',
    district TEXT NOT NULL,
    panchayat TEXT,
    is_profile_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. FARMS TABLE (Geospatial parcel demarcation & soil characteristics)
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT DEFAULT 'My Kerala Farm',
    farm_size NUMERIC(8,2) NOT NULL DEFAULT 1.0,
    farm_size_unit TEXT NOT NULL DEFAULT 'acres' CHECK (farm_size_unit IN ('acres', 'hectares', 'cents')),
    latitude NUMERIC(10,6) NOT NULL,
    longitude NUMERIC(10,6) NOT NULL,
    district TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    soil_drainage TEXT DEFAULT 'well_drained',
    soil_slope TEXT DEFAULT 'gentle_slope',
    current_crop TEXT NOT NULL,
    previous_crop TEXT,
    irrigation_method TEXT NOT NULL DEFAULT 'rainfed',
    farming_season TEXT NOT NULL DEFAULT 'mundakan',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on farms
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view their own farms"
    ON public.farms FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Farmers can insert their own farms"
    ON public.farms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers can update their own farms"
    ON public.farms FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Farmers can delete their own farms"
    ON public.farms FOR DELETE
    USING (auth.uid() = user_id);

-- 3. SATELLITE_OBSERVATIONS TABLE (NASA SMAP, GPM IMERG, Landsat NDVI)
CREATE TABLE IF NOT EXISTS public.satellite_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    instrument TEXT NOT NULL, -- e.g. 'NASA_SMAP', 'NASA_GPM', 'LANDSAT_NDVI'
    metric_name TEXT NOT NULL, -- e.g. 'soil_moisture_volumetric', 'precipitation_7d_mm', 'ndvi'
    metric_value NUMERIC(10,4) NOT NULL,
    metric_unit TEXT NOT NULL,
    observation_date DATE NOT NULL,
    quality_flag TEXT DEFAULT 'VALID',
    spatial_resolution TEXT,
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.satellite_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view satellite observations for their farms"
    ON public.satellite_observations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.farms
            WHERE farms.id = satellite_observations.farm_id
            AND farms.user_id = auth.uid()
        )
    );

-- 4. WEATHER_OBSERVATIONS TABLE (Open-Meteo & ECMWF models)
CREATE TABLE IF NOT EXISTS public.weather_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    temperature_2m NUMERIC(5,2),
    relative_humidity_2m NUMERIC(5,2),
    wind_speed_10m NUMERIC(5,2),
    precipitation_sum NUMERIC(6,2),
    forecast_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.weather_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view weather observations for their farms"
    ON public.weather_observations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.farms
            WHERE farms.id = weather_observations.farm_id
            AND farms.user_id = auth.uid()
        )
    );

-- 5. CROP_ROTATION_STEPS TABLE (Rotational agronomy sequences)
CREATE TABLE IF NOT EXISTS public.crop_rotation_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    season_name TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    crop_category TEXT,
    agronomic_purpose TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crop_rotation_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can manage crop rotation for their farms"
    ON public.crop_rotation_steps FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.farms
            WHERE farms.id = crop_rotation_steps.farm_id
            AND farms.user_id = auth.uid()
        )
    );

-- 6. SAVED_SCHEMES TABLE (Bookmarked Kerala & Central Government benefits)
CREATE TABLE IF NOT EXISTS public.saved_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scheme_id TEXT NOT NULL,
    notes TEXT,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, scheme_id)
);

ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved schemes"
    ON public.saved_schemes FOR ALL
    USING (auth.uid() = user_id);

-- Indexes for high-performance geospatial lookups
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_coordinates ON public.farms(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_satellite_farm_date ON public.satellite_observations(farm_id, observation_date);
CREATE INDEX IF NOT EXISTS idx_weather_farm_date ON public.weather_observations(farm_id, forecast_date);
