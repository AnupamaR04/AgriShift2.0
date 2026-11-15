import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Crosshair,
  Compass,
  Check,
  Globe,
  AlertCircle,
  X,
  ChevronDown,
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { useTranslation } from '../../context/LanguageContext';

export function LocationSearchBar({ compact = false, className = '' }) {
  const {
    selectedLocation,
    setLocation,
    detectBrowserGps,
    detectingGps,
    gpsError,
    searchWorldwideLocations,
    searchResults,
    isSearching,
    presetLocations,
  } = useLocationContext();

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const containerRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    searchWorldwideLocations(val);
  };

  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setIsOpen(false);
    setQuery('');
    setStatusMsg('');
  };

  const handleDetectGps = async () => {
    setStatusMsg('');
    try {
      await detectBrowserGps();
      setStatusMsg(t('loc_gps_success'));
      setTimeout(() => setStatusMsg(''), 4000);
      setIsOpen(false);
    } catch (e) {
      // Error handled by context
    }
  };

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-agri-cream border border-agri-sand hover:border-agri-leaf text-agri-forest text-xs font-semibold transition-all max-w-xs truncate"
          title="Change worldwide location"
        >
          <MapPin className="w-3.5 h-3.5 text-agri-leaf shrink-0" />
          <span className="truncate">{selectedLocation?.name || 'Select Location'}</span>
          <ChevronDown className="w-3 h-3 text-agri-forest/60 shrink-0 ml-1" />
        </button>

        {isOpen && (
          <div className="absolute right-0 sm:left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-agri-sand shadow-card p-4 z-50 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-agri-sand mb-3">
              <span className="text-xs font-bold text-agri-forest flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-agri-leaf" />
                Worldwide Location Search
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-agri-forest/50 hover:text-agri-forest hover:bg-agri-sand/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS Button */}
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={detectingGps}
              className="w-full mb-3 px-3 py-2.5 rounded-xl bg-agri-mist hover:bg-agri-sand text-agri-forest text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-agri-sand"
            >
              <Crosshair className={`w-4 h-4 text-agri-paddy ${detectingGps ? 'animate-spin' : ''}`} />
              <span>{detectingGps ? t('loc_detecting') : t('loc_detect_gps')}</span>
            </button>

            {gpsError && (
              <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{gpsError}</span>
              </div>
            )}

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-agri-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder={t('loc_search_placeholder')}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-agri-sand bg-agri-cream/30 text-xs text-agri-forest focus:outline-none focus:ring-2 focus:ring-agri-leaf"
                autoFocus
              />
            </div>

            {/* Live Search Results */}
            {isSearching && (
              <div className="text-center py-3 text-xs text-agri-forest/60">
                {t('loc_searching')}
              </div>
            )}

            {query.length >= 2 && searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-1 mb-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-agri-forest/50 px-2">
                  Matching Worldwide Locations
                </div>
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectLocation(res)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-agri-cream text-agri-forest flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-bold">{res.name}</div>
                      <div className="text-[10px] text-agri-forest/60 font-mono">
                        {res.latitude.toFixed(3)}°, {res.longitude.toFixed(3)}°
                      </div>
                    </div>
                    {selectedLocation?.latitude === res.latitude && (
                      <Check className="w-4 h-4 text-agri-paddy shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Preset Agricultural Regions */}
            <div className="pt-2 border-t border-agri-sand">
              <div className="text-[10px] font-bold uppercase tracking-wider text-agri-forest/50 px-1 mb-1.5">
                Popular Agricultural Regions
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {presetLocations.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectLocation(p)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] truncate border transition-colors ${
                      selectedLocation?.name === p.name
                        ? 'bg-agri-forest text-white border-agri-forest font-bold'
                        : 'bg-agri-cream/60 hover:bg-agri-sand/80 text-agri-forest border-agri-sand/60'
                    }`}
                  >
                    <span className="font-semibold block truncate">{p.city}</span>
                    <span className="text-[9px] opacity-70 block truncate">{p.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expanded layout for Dashboard or Map pages
  return (
    <div className={`bg-white rounded-2xl border border-agri-sand shadow-soft p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-agri-sand">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-agri-paddy text-white flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-agri-forest uppercase tracking-wider">
              {t('loc_active')}
            </div>
            <div className="text-sm font-extrabold text-agri-forest">
              {selectedLocation?.name || 'Worldwide'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDetectGps}
          disabled={detectingGps}
          className="px-3.5 py-2 rounded-xl bg-agri-mist hover:bg-agri-sand text-agri-forest text-xs font-bold flex items-center gap-2 border border-agri-sand transition-all self-start sm:self-auto"
        >
          <Crosshair className={`w-3.5 h-3.5 text-agri-leaf ${detectingGps ? 'animate-spin' : ''}`} />
          <span>{detectingGps ? t('loc_detecting') : t('loc_detect_gps')}</span>
        </button>
      </div>

      {gpsError && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>{gpsError}</span>
        </div>
      )}

      {statusMsg && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Worldwide Search Input */}
      <div className="mt-3 relative">
        <Search className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder={t('loc_search_placeholder')}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-agri-sand bg-agri-cream/30 text-xs sm:text-sm text-agri-forest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-leaf focus:bg-white"
        />
      </div>

      {/* Search results dropdown */}
      {isSearching && (
        <div className="mt-2 text-center text-xs text-agri-forest/60 py-2">
          {t('loc_searching')}
        </div>
      )}

      {query.length >= 2 && searchResults.length > 0 && (
        <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-agri-sand bg-white p-2 divide-y divide-agri-sand/40 shadow-card">
          {searchResults.map((res) => (
            <button
              key={res.id}
              onClick={() => handleSelectLocation(res)}
              className="w-full text-left p-2.5 hover:bg-agri-cream rounded-lg text-xs text-agri-forest flex items-center justify-between"
            >
              <div>
                <span className="font-bold">{res.name}</span>
                <span className="block text-[11px] text-agri-forest/60 font-mono mt-0.5">
                  Lat: {res.latitude.toFixed(4)}°, Lon: {res.longitude.toFixed(4)}° • Elev:{' '}
                  {res.elevation ? `${res.elevation}m` : 'N/A'}
                </span>
              </div>
              <Check className="w-4 h-4 text-agri-leaf opacity-60" />
            </button>
          ))}
        </div>
      )}

      {/* Preset Region Pills */}
      <div className="mt-3 pt-3 border-t border-agri-sand flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] text-agri-forest/60 font-medium">Quick Select:</span>
        {presetLocations.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectLocation(p)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              selectedLocation?.name === p.name
                ? 'bg-agri-forest text-white'
                : 'bg-agri-cream hover:bg-agri-sand text-agri-forest border border-agri-sand/60'
            }`}
          >
            {p.city}, {p.countryCode || p.country}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LocationSearchBar;
