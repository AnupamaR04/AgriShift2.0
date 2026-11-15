import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Thermometer, Wind, CloudRain, Sun, AlertTriangle, Compass, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { agroDataService } from '../services/agroDataService';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export function WeatherPage() {
  const { profile } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const parseCoord = (val, fallback) => {
    const num = Number(val);
    return !isNaN(num) && num !== 0 ? num : fallback;
  };
  const lat = parseCoord(profile?.latitude, 10.7867);
  const lng = parseCoord(profile?.longitude, 76.6548);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await agroDataService.fetchLiveWeather(lat, lng);
      setWeatherData(res);
      setLoading(false);
    }
    load();
  }, [lat, lng]);

  const dailyForecast = weatherData?.daily?.time?.map((t, i) => ({
    date: new Date(t).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
    max: weatherData.daily.temperature_2m_max[i],
    min: weatherData.daily.temperature_2m_min[i],
    rain: weatherData.daily.precipitation_sum[i] || 0,
    evapo: weatherData.daily.et0_fao_evapotranspiration ? weatherData.daily.et0_fao_evapotranspiration[i] : 0,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-agri-sand">
        <Badge variant="weather" size="md" className="mb-2">
          Agro-Meteorology &amp; Monsoon Intelligence
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
          Kerala Weather &amp; Climate Intelligence
        </h1>
        <p className="text-sm text-agri-forest/70 mt-1">
          7-day ECMWF / Open-Meteo forecasts calibrated for <strong className="text-agri-forest capitalize">{profile?.district || 'Palakkad'}, Kerala</strong> ({lat.toFixed(4)}° N, {lng.toFixed(4)}° E).
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-agri-forest/70 font-semibold uppercase">
            <span>Air Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-display font-extrabold text-agri-forest">
            {weatherData?.current ? `${weatherData.current.temperature_2m}°C` : '--'}
          </div>
          <div className="text-xs text-agri-forest/60">
            Feels like {weatherData?.current ? `${weatherData.current.apparent_temperature}°C` : '--'}
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-agri-forest/70 font-semibold uppercase">
            <span>Relative Humidity</span>
            <Droplets className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-3xl font-display font-extrabold text-agri-forest">
            {weatherData?.current ? `${weatherData.current.relative_humidity_2m}%` : '--'}
          </div>
          <div className="text-xs text-blue-800 font-medium">
            High vapor pressure deficit
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-agri-forest/70 font-semibold uppercase">
            <span>Wind Speed &amp; Gusts</span>
            <Wind className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-3xl font-display font-extrabold text-agri-forest">
            {weatherData?.current ? `${weatherData.current.wind_speed_10m} km/h` : '--'}
          </div>
          <div className="text-xs text-agri-forest/60">
            Safe for banana propping &amp; rubber tapping
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-agri-forest/70 font-semibold uppercase">
            <span>Precipitation (Now)</span>
            <CloudRain className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-display font-extrabold text-agri-forest">
            {weatherData?.current ? `${weatherData.current.precipitation} mm` : '0.0 mm'}
          </div>
          <div className="text-xs text-agri-paddy font-semibold">
            {weatherData?.current?.precipitation > 0 ? 'Rain actively falling' : 'No rain at present'}
          </div>
        </Card>
      </div>

      {/* 7-Day Rainfall Forecast Bar Chart */}
      <Card className="p-6">
        <CardHeader
          title="7-Day Precipitation &amp; Evapotranspiration Forecast"
          subtitle="Expected rainfall (mm) vs water lost through crop transpiration (ET₀ mm)"
          icon={CloudRain}
        />

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3EDE2" />
              <XAxis dataKey="date" stroke="#183B28" fontSize={11} />
              <YAxis unit=" mm" stroke="#183B28" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#F3EDE2',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="rain" name="Rainfall (mm)" fill="#2A6A48" radius={[4, 4, 0, 0]} />
              <Bar dataKey="evapo" name="Evapotranspiration (mm)" fill="#DDA15E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Dedicated Kerala Monsoon Matrix Section */}
      <Card className="p-6 space-y-6">
        <CardHeader
          title="Kerala Dual Monsoon Agricultural Intelligence"
          subtitle="Specific implications for your district's topography and soil"
          icon={CloudSun}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-agri-forest">
          {/* SW Monsoon */}
          <div className="p-4 rounded-2xl bg-agri-cream border border-agri-sand space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-agri-forest">1. Edavappathi (Southwest Monsoon)</span>
              <Badge variant="forest" size="sm">June – September</Badge>
            </div>
            <p className="text-agri-forest/80 leading-relaxed">
              Accounts for ~70% of Kerala's total annual rainfall. Saturated laterite soils on midland slopes risk massive topsoil erosion and nutrient leaching. Ensure bund fortification in paddy fields and cover crops under rubber trees.
            </p>
            <div className="text-[11px] font-semibold text-agri-paddy">
              Key crops: Virippu Paddy, Ginger raised beds, Turmeric, Pepper spike growth.
            </div>
          </div>

          {/* NE Monsoon */}
          <div className="p-4 rounded-2xl bg-agri-cream border border-agri-sand space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-agri-forest">2. Thulavarsham (Northeast Monsoon)</span>
              <Badge variant="forest" size="sm">October – November</Badge>
            </div>
            <p className="text-agri-forest/80 leading-relaxed">
              Characterized by convective afternoon thunderstorms and lightning. High humidity elevates incidence of fungal diseases like Phytophthora foot rot in black pepper and Koleroga (mahali) in arecanut.
            </p>
            <div className="text-[11px] font-semibold text-agri-paddy">
              Key crops: Mundakan winter paddy transplanting, pulses sowing, banana harvesting.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default WeatherPage;
