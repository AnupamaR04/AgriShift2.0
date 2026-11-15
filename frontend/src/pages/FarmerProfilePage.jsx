import React, { useState } from 'react';
import { User, MapPin, Save, ShieldCheck, CheckCircle2, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KERALA_DISTRICTS, KERALA_SOIL_TYPES, KERALA_FARMING_SEASONS, IRRIGATION_METHODS } from '../utils/keralaData';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export function FarmerProfilePage() {
  const { profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [district, setDistrict] = useState(profile?.district || 'palakkad');
  const [panchayat, setPanchayat] = useState(profile?.panchayat || '');
  const [farmName, setFarmName] = useState(profile?.farm_name || 'My Kerala Farm');
  const [farmSize, setFarmSize] = useState(profile?.farm_size || 1.5);
  const [farmSizeUnit, setFarmSizeUnit] = useState(profile?.farm_size_unit || 'acres');
  const [soilType, setSoilType] = useState(profile?.soil_type || 'laterite');
  const [currentCrop, setCurrentCrop] = useState(profile?.current_crop || 'Paddy');
  const [season, setSeason] = useState(profile?.farming_season || 'mundakan');
  const [irrigation, setIrrigation] = useState(profile?.irrigation_method || 'rainfed');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        full_name: fullName,
        phone,
        district,
        panchayat,
        farm_name: farmName,
        farm_size: parseFloat(farmSize) || 1,
        farm_size_unit: farmSizeUnit,
        soil_type: soilType,
        current_crop: currentCrop,
        farming_season: season,
        irrigation_method: irrigation,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-agri-sand">
        <div>
          <Badge variant="forest" size="md" className="mb-2">
            Account &amp; Farm Parameters
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
            Farmer Profile &amp; Land Registry
          </h1>
          <p className="text-sm text-agri-forest/70 mt-1">
            Update your farmer identity and landholding parameters across Kerala.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile Updated
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <CardHeader
            title="Personal &amp; Contact Details"
            subtitle="Verified farmer identity"
            icon={User}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-agri-forest uppercase mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
              />
            </div>

            <div>
              <label className="block font-bold text-agri-forest uppercase mb-1.5">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
              />
            </div>

            <div>
              <label className="block font-bold text-agri-forest uppercase mb-1.5">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
              >
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-agri-forest uppercase mb-1.5">
                Grama Panchayat / Village *
              </label>
              <input
                type="text"
                required
                value={panchayat}
                onChange={(e) => setPanchayat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 space-y-6">
          <CardHeader
            title="Landholding &amp; Agronomic Parameters"
            subtitle="Parameters informing satellite calibrations and crop recommendations"
            icon={Sprout}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-agri-forest uppercase mb-1.5">
                Farm Property Name
              </label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-agri-forest uppercase mb-1.5">
                  Farm Area *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
                />
              </div>
              <div>
                <label className="block font-bold text-agri-forest uppercase mb-1.5">
                  Unit *
                </label>
                <select
                  value={farmSizeUnit}
                  onChange={(e) => setFarmSizeUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="cents">Cents</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-agri-forest uppercase mb-1.5">
                Soil Classification *
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
              >
                {KERALA_SOIL_TYPES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-agri-forest uppercase mb-1.5">
                Current Cultivated Crop *
              </label>
              <input
                type="text"
                required
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-agri-sand bg-agri-cream/30 text-sm text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="lg" loading={saving} className="shadow-soft">
              <Save className="w-4 h-4 mr-1.5" />
              Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

export default FarmerProfilePage;
