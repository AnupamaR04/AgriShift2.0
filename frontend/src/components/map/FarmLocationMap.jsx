import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Compass, Crosshair } from 'lucide-react';
import { KERALA_DISTRICTS } from '../../utils/keralaData';

// Fix Leaflet's default icon missing in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom modern SVG marker icon for Kerala Farm Location
const farmIcon = L.divIcon({
  className: 'custom-farm-marker',
  html: `
    <div style="
      background-color: #183B28;
      border: 3px solid #52B788;
      border-radius: 50% 50% 50% 0;
      width: 36px;
      height: 36px;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
    ">
      <div style="
        width: 12px;
        height: 12px;
        background-color: #FAF7F2;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -34],
});

// Resizer to ensure Leaflet renders full map canvas smoothly
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Map Click & Drag Controller
function LocationMarker({ position, setPosition, onLocationChange }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      if (onLocationChange) {
        onLocationChange(newPos[0], newPos[1]);
      }
      map.panTo(newPos, { animate: true });
    },
  });

  return position === null ? null : (
    <Marker
      position={position}
      icon={farmIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const latlng = marker.getLatLng();
          const newPos = [latlng.lat, latlng.lng];
          setPosition(newPos);
          if (onLocationChange) {
            onLocationChange(latlng.lat, latlng.lng);
          }
        },
      }}
    >
      <Popup className="agri-popup">
        <div className="p-1 font-sans text-xs">
          <div className="font-bold text-agri-forest flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-agri-leaf" />
            Selected Farm Parcel
          </div>
          <div className="text-gray-600 mt-1 font-mono">
            Lat: {Number(position[0]).toFixed(6)}° N<br />
            Lng: {Number(position[1]).toFixed(6)}° E
          </div>
          <div className="text-[10px] text-agri-leaf mt-1 font-medium">
            Drag marker or click map to reposition
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// Controller component to smoothly fly map when district changes
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export function FarmLocationMap({
  initialLat = 10.7867,
  initialLng = 76.6548,
  selectedDistrict = '',
  farmSize = 1,
  sizeUnit = 'acres',
  onLocationChange,
  className = '',
  readOnly = false,
}) {
  const safeLat = Number(initialLat) || 10.7867;
  const safeLng = Number(initialLng) || 76.6548;

  const [position, setPosition] = useState([safeLat, safeLng]);
  const [mapCenter, setMapCenter] = useState([safeLat, safeLng]);
  const [mapZoom, setMapZoom] = useState(13);
  const [isLocating, setIsLocating] = useState(false);

  const parcelRadiusMeters = Math.max(
    30,
    Math.min(250, Math.sqrt((Number(farmSize) || 1) * (sizeUnit === 'acres' ? 4046.86 : 10000) / Math.PI))
  );

  useEffect(() => {
    const lat = Number(initialLat);
    const lng = Number(initialLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
      setMapCenter([lat, lng]);
    }
  }, [initialLat, initialLng]);

  useEffect(() => {
    if (selectedDistrict) {
      const districtData = KERALA_DISTRICTS.find(
        (d) => d.id === selectedDistrict || d.name.toLowerCase().includes(selectedDistrict.toLowerCase())
      );
      if (districtData) {
        setMapCenter(districtData.center);
        setPosition(districtData.center);
        setMapZoom(12);
        if (onLocationChange) {
          onLocationChange(districtData.center[0], districtData.center[1]);
        }
      }
    }
  }, [selectedDistrict]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const inKerala = lat >= 8.0 && lat <= 13.0 && lng >= 74.5 && lng <= 77.8;
        if (!inKerala) {
          alert(`Your GPS location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°) is outside Kerala. AgriShift coordinates calibrated for Kerala.`);
        }
        const newPos = [lat, lng];
        setPosition(newPos);
        setMapCenter(newPos);
        setMapZoom(15);
        if (onLocationChange) {
          onLocationChange(lat, lng);
        }
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-xl border border-agri-sand">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-agri-mist flex items-center justify-center text-agri-forest">
            <Compass className="w-4 h-4 text-agri-paddy" />
          </div>
          <div>
            <div className="text-xs font-bold text-agri-forest">Kerala Farm Parcel Selector</div>
            <div className="text-[11px] font-mono text-agri-forest/70">
              {Number(position[0]).toFixed(6)}° N, {Number(position[1]).toFixed(6)}° E
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && (
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isLocating}
              className="px-3 py-1.5 rounded-lg bg-agri-sand hover:bg-agri-mist/70 text-agri-forest text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Detecting...' : 'Use My GPS'}
            </button>
          )}

          <select
            value={selectedDistrict}
            onChange={(e) => {
              const dist = KERALA_DISTRICTS.find((d) => d.id === e.target.value);
              if (dist) {
                setMapCenter(dist.center);
                setPosition(dist.center);
                setMapZoom(13);
                if (onLocationChange) {
                  onLocationChange(dist.center[0], dist.center[1]);
                }
              }
            }}
            className="text-xs font-medium border border-agri-sand rounded-lg px-2.5 py-1.5 bg-agri-cream text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
          >
            <option value="">Jump to Kerala District...</option>
            {KERALA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border-2 border-agri-sand shadow-soft">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', minHeight: '380px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapResizer />
          <MapController center={mapCenter} zoom={mapZoom} />

          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationChange={onLocationChange}
          />

          {position && (
            <Circle
              center={position}
              radius={parcelRadiusMeters}
              pathOptions={{
                color: '#2A6A48',
                fillColor: '#52B788',
                fillOpacity: 0.25,
                weight: 2,
                dashArray: '4, 4',
              }}
            />
          )}
        </MapContainer>

        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-agri-sand shadow-sm text-[11px] text-agri-forest flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Click on map or drag pin to your exact farm location</span>
        </div>
      </div>
    </div>
  );
}

export default FarmLocationMap;
