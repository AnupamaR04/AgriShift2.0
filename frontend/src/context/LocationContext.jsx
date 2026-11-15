import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LocationContext = createContext(null);

export const DEFAULT_WORLD_LOCATIONS = [
  {
    id: 'palakkad-in',
    name: 'Palakkad, Kerala, India',
    city: 'Palakkad',
    state: 'Kerala',
    country: 'India',
    countryCode: 'IN',
    latitude: 10.7867,
    longitude: 76.6548,
    timezone: 'Asia/Kolkata',
    regionType: 'Tropical Paddy Belt (Palakkad Gap)',
  },
  {
    id: 'fresno-us',
    name: 'Fresno, California, United States',
    city: 'Fresno',
    state: 'California',
    country: 'United States',
    countryCode: 'US',
    latitude: 36.7468,
    longitude: -119.7726,
    timezone: 'America/Los_Angeles',
    regionType: 'San Joaquin Valley (Mediterranean Semi-Arid)',
  },
  {
    id: 'valencia-es',
    name: 'Valencia, Spain',
    city: 'Valencia',
    state: 'Valencian Community',
    country: 'Spain',
    countryCode: 'ES',
    latitude: 39.4699,
    longitude: -0.3763,
    timezone: 'Europe/Madrid',
    regionType: 'Mediterranean Coastal Citrus Belt',
  },
  {
    id: 'nairobi-ke',
    name: 'Nairobi, Kenya',
    city: 'Nairobi',
    state: 'Nairobi County',
    country: 'Kenya',
    countryCode: 'KE',
    latitude: -1.2921,
    longitude: 36.8219,
    timezone: 'Africa/Nairobi',
    regionType: 'East African Highland Volcanic Loam',
  },
  {
    id: 'punjab-in',
    name: 'Ludhiana, Punjab, India',
    city: 'Ludhiana',
    state: 'Punjab',
    country: 'India',
    countryCode: 'IN',
    latitude: 30.9010,
    longitude: 75.8573,
    timezone: 'Asia/Kolkata',
    regionType: 'Indo-Gangetic Alluvial Wheat Belt',
  },
  {
    id: 'sao-paulo-br',
    name: 'Ribeirão Preto, São Paulo, Brazil',
    city: 'Ribeirão Preto',
    state: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    latitude: -21.1767,
    longitude: -47.8108,
    timezone: 'America/Sao_Paulo',
    regionType: 'Terra Roxa Sugarcane & Coffee Belt',
  },
];

export const LocationProvider = ({ children }) => {
  // Load saved location or fallback to initial default
  const [selectedLocation, setSelectedLocationState] = useState(() => {
    try {
      const stored = localStorage.getItem('agrishift_selected_location');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored location:', e);
    }
    return DEFAULT_WORLD_LOCATIONS[0];
  });

  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const setLocation = useCallback((loc) => {
    if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
      return;
    }
    const cleanLocation = {
      name: loc.name || `${loc.city || 'Location'}, ${loc.country || ''}`,
      city: loc.city || loc.name?.split(',')?.[0] || 'Selected Farm Area',
      state: loc.state || loc.admin1 || '',
      country: loc.country || 'Global',
      countryCode: loc.countryCode || loc.country_code || '',
      latitude: parseFloat(Number(loc.latitude).toFixed(4)),
      longitude: parseFloat(Number(loc.longitude).toFixed(4)),
      elevation: loc.elevation != null ? Math.round(Number(loc.elevation)) : null,
      timezone: loc.timezone || 'auto',
      isDetectedGps: Boolean(loc.isDetectedGps),
    };

    setSelectedLocationState(cleanLocation);
    try {
      localStorage.setItem('agrishift_selected_location', JSON.stringify(cleanLocation));
    } catch (e) {
      console.warn('Error saving location preference:', e);
    }
  }, []);

  /**
   * Search any city, town, village, or region worldwide via Open-Meteo Geocoding
   */
  const searchWorldwideLocations = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=10&language=en&format=json`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
      const data = await res.json();

      if (data && Array.isArray(data.results)) {
        const mapped = data.results.map((item) => {
          const parts = [item.name, item.admin1, item.country].filter(Boolean);
          return {
            id: `geo-${item.id}`,
            name: parts.join(', '),
            city: item.name,
            state: item.admin1 || '',
            country: item.country || '',
            countryCode: item.country_code || '',
            latitude: item.latitude,
            longitude: item.longitude,
            elevation: item.elevation,
            timezone: item.timezone || 'auto',
          };
        });
        setSearchResults(mapped);
        return mapped;
      } else {
        setSearchResults([]);
        return [];
      }
    } catch (err) {
      console.warn('Worldwide geocoding search failed:', err.message);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Detect user's current physical location via HTML5 Geolocation API
   */
  const detectBrowserGps = () => {
    return new Promise((resolve, reject) => {
      setGpsError(null);
      if (!navigator.geolocation) {
        const msg = 'Geolocation is not supported by your browser.';
        setGpsError(msg);
        reject(new Error(msg));
        return;
      }

      setDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            // Reverse geocode to get city and country name
            let placeName = `GPS Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`;
            let city = 'Current GPS Position';
            let country = '';
            let countryCode = '';

            try {
              const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
              const res = await fetch(revUrl);
              if (res.ok) {
                const data = await res.json();
                city = data.locality || data.city || city;
                country = data.countryName || '';
                countryCode = data.countryCode || '';
                placeName = [city, data.principalSubdivision, country].filter(Boolean).join(', ');
              }
            } catch (revErr) {
              console.warn('Reverse geocode note:', revErr);
            }

            const gpsLocation = {
              name: placeName,
              city,
              country,
              countryCode,
              latitude: lat,
              longitude: lng,
              timezone: 'auto',
              isDetectedGps: true,
            };

            setLocation(gpsLocation);
            setDetectingGps(false);
            resolve(gpsLocation);
          } catch (err) {
            setDetectingGps(false);
            setGpsError('Could not resolve location name. Using exact GPS coordinates.');
            const fallbackLoc = {
              name: `GPS (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
              city: 'Detected GPS Parcel',
              latitude: lat,
              longitude: lng,
              isDetectedGps: true,
            };
            setLocation(fallbackLoc);
            resolve(fallbackLoc);
          }
        },
        (error) => {
          setDetectingGps(false);
          let errText = 'GPS access unavailable.';
          if (error.code === error.PERMISSION_DENIED) {
            errText = 'GPS permission was denied. You can search any location worldwide manually below.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errText = 'GPS position unavailable. Please search manually.';
          } else if (error.code === error.TIMEOUT) {
            errText = 'GPS request timed out. Please try again or search manually.';
          }
          setGpsError(errText);
          reject(new Error(errText));
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setLocation,
        detectBrowserGps,
        detectingGps,
        gpsError,
        searchWorldwideLocations,
        searchResults,
        isSearching,
        presetLocations: DEFAULT_WORLD_LOCATIONS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
