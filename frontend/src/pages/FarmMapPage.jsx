import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Save, ShieldCheck, CheckCircle2, Globe, Crosshair } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { useTranslation } from '../context/LanguageContext';
import FarmLocationMap from '../components/map/FarmLocationMap';
import LocationSearchBar from '../components/common/LocationSearchBar';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export function FarmMapPage() {
  const { profile, updateProfile } = useAuth();
  const { selectedLocation, setLocation, detectGpsLocation, isDetectingGps } = useLocationContext();
  const { t } = useTranslation();

  const [lat, setLat] = useState(() => Number(selectedLocation?.latitude ?? profile?.latitude ?? 10.7867));
  const [lng, setLng] = useState(() => Number(selectedLocation?.longitude ?? profile?.longitude ?? 76.6548));
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync when selectedLocation changes
  useEffect(() => {
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      setLat(Number(selectedLocation.latitude));
      setLng(Number(selectedLocation.longitude));
    }
  }, [selectedLocation]);

  const handleLocationChange = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
    setSavedSuccess(false);
    // Also sync to LocationContext
    setLocation({
      name: `${newLat.toFixed(4)}°, ${newLng.toFixed(4)}°`,
      country: selectedLocation?.country || 'Worldwide',
      latitude: newLat,
      longitude: newLng,
    });
  };

  const handleSaveCoordinates = async () => {
    try {
      setSaving(true);
      await updateProfile({
        latitude: lat,
        longitude: lng,
        location: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-agri-sand">
        <div>
          <Badge variant="forest" size="md" className="mb-2">
            Worldwide Geospatial Parcel Intelligence
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
            {t('nav_farm')}
          </h1>
          <p className="text-sm text-agri-forest/70 mt-1">
            Exact worldwide GPS coordinates used for all NASA Earth Observation queries, Open-Meteo weather, and ISRIC soil analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            loading={isDetectingGps}
            onClick={detectGpsLocation}
            className="text-agri-forest border-agri-sand hover:bg-agri-sand/60"
          >
            <Crosshair className="w-4 h-4 mr-1.5 text-agri-leaf" />
            {t('loc_detect_gps')}
          </Button>

          {savedSuccess && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t('common_saved')}
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
            {t('common_save')}
          </Button>
        </div>
      </div>

      {/* Worldwide Location Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-agri-sand shadow-soft">
        <LocationSearchBar compact={false} />
      </div>

      {/* Map Container */}
      <Card className="p-6">
        <FarmLocationMap
          initialLat={lat}
          initialLng={lng}
          farmSize={profile?.farm_size || 2.5}
          sizeUnit={profile?.farm_size_unit || 'acres'}
          onLocationChange={handleLocationChange}
        />

        <div className="mt-6 pt-6 border-t border-agri-sand grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-agri-forest">
          <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
            <span className="text-agri-forest/60 block">Current Latitude</span>
            <span className="text-sm font-bold font-mono text-agri-forest">{lat.toFixed(6)}°</span>
          </div>

          <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
            <span className="text-agri-forest/60 block">Current Longitude</span>
            <span className="text-sm font-bold font-mono text-agri-forest">{lng.toFixed(6)}°</span>
          </div>

          <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
            <span className="text-agri-forest/60 block">Active Agricultural Region</span>
            <span className="text-sm font-bold capitalize text-agri-paddy truncate block">
              {selectedLocation?.name || 'Worldwide'} ({selectedLocation?.country || 'Global'})
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FarmMapPage;
