import React, { useState } from 'react';
import { Compass, MapPin, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FarmLocationMap from '../components/map/FarmLocationMap';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export function FarmMapPage() {
  const { profile, updateProfile } = useAuth();
  const parseCoord = (val, fallback) => {
    const num = Number(val);
    return !isNaN(num) && num !== 0 ? num : fallback;
  };
  const [lat, setLat] = useState(() => parseCoord(profile?.latitude, 10.7867));
  const [lng, setLng] = useState(() => parseCoord(profile?.longitude, 76.6548));
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLocationChange = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
    setSavedSuccess(false);
  };

  const handleSaveCoordinates = async () => {
    try {
      setSaving(true);
      await updateProfile({
        latitude: lat,
        longitude: lng,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      alert('Failed to save coordinates: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-agri-sand">
        <div>
          <Badge variant="forest" size="md" className="mb-2">
            Geospatial Parcel Intelligence
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
            My Farm &amp; Parcel Boundaries
          </h1>
          <p className="text-sm text-agri-forest/70 mt-1">
            Exact GPS coordinates used for all NASA Earth Observation queries and Kerala weather tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Coordinates Saved
            </span>
          )}
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={handleSaveCoordinates}
            className="shadow-soft"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Parcel Coordinates
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <Card className="p-6">
        <FarmLocationMap
          initialLat={lat}
          initialLng={lng}
          selectedDistrict={profile?.district || 'palakkad'}
          farmSize={profile?.farm_size || 1}
          sizeUnit={profile?.farm_size_unit || 'acres'}
          onLocationChange={handleLocationChange}
        />

        <div className="mt-6 pt-6 border-t border-agri-sand grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-agri-forest">
          <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
            <span className="text-agri-forest/60 block">Current Latitude</span>
            <span className="text-sm font-bold font-mono text-agri-forest">{lat.toFixed(6)}° N</span>
          </div>

          <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
            <span className="text-agri-forest/60 block">Current Longitude</span>
            <span className="text-sm font-bold font-mono text-agri-forest">{lng.toFixed(6)}° E</span>
          </div>

          <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
            <span className="text-agri-forest/60 block">Kerala Revenue District</span>
            <span className="text-sm font-bold capitalize text-agri-forest">{profile?.district || 'Palakkad'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FarmMapPage;
