import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, MapPin, Layers, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  KERALA_DISTRICTS,
  KERALA_SOIL_TYPES,
  KERALA_FARMING_SEASONS,
  IRRIGATION_METHODS,
} from '../utils/keralaData';
import FarmLocationMap from '../components/map/FarmLocationMap';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State initialized with any existing data
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [district, setDistrict] = useState(profile?.district || 'palakkad');
  const [panchayat, setPanchayat] = useState(profile?.panchayat || '');
  const [farmName, setFarmName] = useState(profile?.farm_name || 'My Kerala Farm');
  const [farmSize, setFarmSize] = useState(profile?.farm_size || 1.5);
  const [farmSizeUnit, setFarmSizeUnit] = useState(profile?.farm_size_unit || 'acres');
  const [latitude, setLatitude] = useState(profile?.latitude || 10.7867);
  const [longitude, setLongitude] = useState(profile?.longitude || 76.6548);
  const [soilType, setSoilType] = useState(profile?.soil_type || 'laterite');
  const [soilDrainage, setSoilDrainage] = useState(profile?.soil_drainage || 'well_drained');
  const [soilSlope, setSoilSlope] = useState(profile?.soil_slope || 'gentle_slope');
  const [currentCrop, setCurrentCrop] = useState(profile?.current_crop || 'Paddy');
  const [previousCrop, setPreviousCrop] = useState(profile?.previous_crop || 'Sesame');
  const [irrigation, setIrrigation] = useState(profile?.irrigation_method || 'rainfed');
  const [season, setSeason] = useState(profile?.farming_season || 'mundakan');

  const handleLocationChange = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({
        full_name: fullName,
        phone,
        state: 'Kerala',
        district,
        panchayat,
        farm_name: farmName,
        farm_size: parseFloat(farmSize) || 1,
        farm_size_unit: farmSizeUnit,
        latitude,
        longitude,
        soil_type: soilType,
        soil_drainage: soilDrainage,
        soil_slope: soilSlope,
        current_crop: currentCrop,
        previous_crop: previousCrop,
        irrigation_method: irrigation,
        farming_season: season,
      });

      // Automatically redirect to the Dashboard per Section 7 & 8
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-agri-cream flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-agri-sand bg-white/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-agri-forest flex items-center justify-center text-agri-mist">
              <Sprout className="w-5 h-5 text-agri-lightleaf" />
            </div>
            <div>
              <span className="text-xl font-display font-extrabold text-agri-forest">AgriShift</span>
              <span className="block text-[10px] font-semibold text-agri-leaf tracking-wider uppercase font-sans">
                Guided Kerala Farm Onboarding
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-agri-sand text-agri-forest font-medium">
              Step {step} of 3
            </span>
          </div>
        </div>
      </header>

      {/* Main Multi-Step Form */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-10">
        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              step === 1
                ? 'bg-white border-agri-leaf shadow-sm'
                : 'bg-agri-sand/50 border-transparent text-agri-forest/60'
            }`}
          >
            <div className="text-[11px] font-bold text-agri-leaf uppercase">Step 1</div>
            <div className="text-sm font-bold text-agri-forest">Farmer &amp; Region</div>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              step === 2
                ? 'bg-white border-agri-leaf shadow-sm'
                : 'bg-agri-sand/50 border-transparent text-agri-forest/60'
            }`}
          >
            <div className="text-[11px] font-bold text-agri-leaf uppercase">Step 2</div>
            <div className="text-sm font-bold text-agri-forest">Farm Parcel GPS Map</div>
          </button>

          <button
            type="button"
            onClick={() => setStep(3)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              step === 3
                ? 'bg-white border-agri-leaf shadow-sm'
                : 'bg-agri-sand/50 border-transparent text-agri-forest/60'
            }`}
          >
            <div className="text-[11px] font-bold text-agri-leaf uppercase">Step 3</div>
            <div className="text-sm font-bold text-agri-forest">Soil &amp; Cropping Cycle</div>
          </button>
        </div>

        <Card className="p-6 sm:p-10 shadow-card">
          {/* STEP 1: Farmer & Region Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-extrabold text-agri-forest">
                  Farmer Identity &amp; Location
                </h2>
                <p className="text-sm text-agri-forest/70 mt-1">
                  Tell us who you are and where your agricultural land is situated in Kerala.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-2">
                    Farmer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radhakrishnan K"
                    className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-2">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98470 XXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-2">
                    Kerala District (റവന്യൂ ജില്ല) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-2">
                    Grama Panchayat / Village (പഞ്ചായത്ത് / വില്ലേജ്) *
                  </label>
                  <input
                    type="text"
                    required
                    value={panchayat}
                    onChange={(e) => setPanchayat(e.target.value)}
                    placeholder="e.g. Alathur Grama Panchayat / Kuzhalmannam"
                    className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-2">
                    Farm Property Name
                  </label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Melethil Thottam / Kuttanad Polder #4"
                    className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-2">
                      Farm Area *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-2">
                      Unit *
                    </label>
                    <select
                      value={farmSizeUnit}
                      onChange={(e) => setFarmSizeUnit(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                    >
                      <option value="acres">Acres (ഏക്കർ)</option>
                      <option value="hectares">Hectares (ഹെക്ടർ)</option>
                      <option value="cents">Cents (സെൻ്റ്)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                  Next: Pin Farm on Kerala Map
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Interactive Leaflet Map for GPS Pinpointing */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-extrabold text-agri-forest">
                  Pinpoint Your Farm Parcel
                </h2>
                <p className="text-sm text-agri-forest/70 mt-1">
                  Drag the marker to your actual cultivable land. AgriShift queries genuine NASA satellites (SMAP, GPM, Landsat) using these exact coordinates.
                </p>
              </div>

              <FarmLocationMap
                initialLat={latitude}
                initialLng={longitude}
                selectedDistrict={district}
                farmSize={parseFloat(farmSize) || 1}
                sizeUnit={farmSizeUnit}
                onLocationChange={handleLocationChange}
              />

              <div className="p-4 rounded-xl bg-agri-cream border border-agri-sand flex items-center justify-between text-xs text-agri-forest">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-agri-leaf" />
                  <span>
                    Selected Coordinates: <strong className="font-mono">{latitude.toFixed(6)}° N, {longitude.toFixed(6)}° E</strong>
                  </span>
                </div>
                <span className="text-[11px] text-agri-forest/60">High accuracy OpenStreetMap</span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={() => setStep(3)}>
                  Next: Soil &amp; Farming Practices
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Soil, Crops, Irrigation & Season */}
          {step === 3 && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-extrabold text-agri-forest">
                  Soil Characteristics &amp; Crop Cycle
                </h2>
                <p className="text-sm text-agri-forest/70 mt-1">
                  Soil parameters allow our recommendation engine to adapt KAU fertilizer and irrigation schedules to your land.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-2">
                    Primary Soil Type (മണ്ണിന്റെ തരം) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {KERALA_SOIL_TYPES.map((soil) => (
                      <label
                        key={soil.id}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          soilType === soil.id
                            ? 'bg-agri-mist/40 border-agri-paddy ring-2 ring-agri-paddy/20'
                            : 'bg-white border-agri-sand hover:border-agri-sage'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-sm text-agri-forest">{soil.name}</span>
                          <input
                            type="radio"
                            name="soilType"
                            checked={soilType === soil.id}
                            onChange={() => setSoilType(soil.id)}
                            className="mt-1 text-agri-forest focus:ring-agri-leaf"
                          />
                        </div>
                        <p className="text-xs text-agri-forest/70 mt-2 leading-relaxed">
                          {soil.description}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-1.5">
                      Current Crop (നിലവിലെ വിള) *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentCrop}
                      onChange={(e) => setCurrentCrop(e.target.value)}
                      placeholder="e.g. Paddy (Uma variety) / Coconut"
                      className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-1.5">
                      Previous Crop (മുൻപ് കൃഷി ചെയ്തത്)
                    </label>
                    <input
                      type="text"
                      value={previousCrop}
                      onChange={(e) => setPreviousCrop(e.target.value)}
                      placeholder="e.g. Cowpea / Black gram / Fallow"
                      className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-1.5">
                      Farming Season (സീസൺ) *
                    </label>
                    <select
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                    >
                      {KERALA_FARMING_SEASONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-1.5">
                      Irrigation Method (നന രീതി) *
                    </label>
                    <select
                      value={irrigation}
                      onChange={(e) => setIrrigation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                    >
                      {IRRIGATION_METHODS.map((im) => (
                        <option key={im.id} value={im.id}>
                          {im.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-agri-forest uppercase tracking-wider mb-1.5">
                      Terrain Slope (ഭൂപ്രകൃതി)
                    </label>
                    <select
                      value={soilSlope}
                      onChange={(e) => setSoilSlope(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                    >
                      <option value="flat">Flat Wetland / Polder (നിലം / കായൽനിലം)</option>
                      <option value="gentle_slope">Gentle Slope / Terraced (ചെരിഞ്ഞ പ്രദേശം)</option>
                      <option value="steep_hill">Steep Highland Slope (ഹൈറേഞ്ച് കുത്തനെയുള്ള ചരിവ്)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-agri-sand flex items-center justify-between">
                <Button variant="secondary" size="md" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  loading={loading}
                  className="font-bold shadow-soft"
                >
                  Save Profile &amp; Launch Dashboard
                  <CheckCircle2 className="w-5 h-5 ml-1.5" />
                </Button>
              </div>
            </form>
          )}
        </Card>
      </main>

      <footer className="p-6 text-center text-xs text-agri-forest/60">
        AgriShift Kerala. Designed for accurate agricultural decision support.
      </footer>
    </div>
  );
}

export default ProfileSetupPage;
