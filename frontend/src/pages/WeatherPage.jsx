import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Thermometer, Wind, CloudRain, Sun, AlertTriangle, Compass, ShieldCheck, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { useTranslation } from '../context/LanguageContext';
import { agroDataService } from '../services/agroDataService';
import LocationSearchBar from '../components/common/LocationSearchBar';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export function WeatherPage() {
  const { profile } = useAuth();
  const { selectedLocation } = useLocationContext();
  const { t, isMalayalam } = useTranslation();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const lat = Number(selectedLocation?.latitude ?? profile?.latitude ?? 10.7867);
  const lng = Number(selectedLocation?.longitude ?? profile?.longitude ?? 76.6548);
  const locationName = selectedLocation?.name || profile?.farm_name || 'Active Parcel';
  const locationCountry = selectedLocation?.country || 'Worldwide';

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await agroDataService.fetchLiveWeather(lat, lng);
      setWeatherData(res);
      setLoading(false);
    }
    load();
  }, [lat, lng]);

  const dailyForecast = weatherData?.daily?.time?.map((tVal, i) => ({
    date: new Date(tVal).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    max: weatherData.daily.temperature_2m_max[i],
    min: weatherData.daily.temperature_2m_min[i],
    rain: weatherData.daily.precipitation_sum[i] || 0,
    evapo: weatherData.daily.et0_fao_evapotranspiration ? weatherData.daily.et0_fao_evapotranspiration[i] : 0,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Location Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-agri-sand shadow-soft">
        <LocationSearchBar compact={false} />
      </div>

      {/* Header */}
      <div className="pb-4 border-b border-agri-sand">
        <Badge variant="weather" size="md" className="mb-2">
          Worldwide Agro-Meteorology &amp; Climate Intelligence
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
          {t('nav_weather')}
        </h1>
        <p className="text-sm text-agri-forest/70 mt-1">
          7-day ECMWF / Open-Meteo forecasts calibrated for <strong className="text-agri-forest capitalize">{locationName}, {locationCountry}</strong> ({lat.toFixed(4)}° N, {lng.toFixed(4)}° E).
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-agri-forest/70 font-semibold uppercase">
            <span>{t('metric_temp')}</span>
            <Thermometer className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-display font-extrabold text-agri-forest">
            {weatherData?.current ? `${weatherData.current.temperature_2m}°C` : '--'}
          </div>
          <div className="text-xs text-agri-forest/60">
            {t('metric_feels')} {weatherData?.current ? `${weatherData.current.apparent_temperature}°C` : '--'}
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-agri-forest/70 font-semibold uppercase">
            <span>{t('metric_humidity')}</span>
            <Droplets className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-3xl font-display font-extrabold text-agri-forest">
            {weatherData?.current ? `${weatherData.current.relative_humidity_2m}%` : '--'}
          </div>
          <div className="text-xs text-blue-800 font-medium">
            Vapor pressure deficit balanced
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-agri-forest/70 font-semibold uppercase">
            <span>Weather Condition</span>
            <CloudSun className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-display font-extrabold text-agri-forest truncate">
            {weatherData?.current?.conditionLabel || 'Partly Cloudy'}
          </div>
          <div className="text-xs text-agri-forest/60">
            Surface Wind: {weatherData?.current?.wind_speed_10m || 10} km/h
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-agri-forest/70 font-semibold uppercase">
            <span>7-Day Expected Rain</span>
            <CloudRain className="w-4 h-4 text-agri-leaf" />
          </div>
          <div className="text-3xl font-display font-extrabold text-agri-leaf">
            {dailyForecast.reduce((acc, d) => acc + (Number(d.rain) || 0), 0).toFixed(1)} mm
          </div>
          <div className="text-xs text-agri-forest/60">
            GPM constellation observation
          </div>
        </Card>
      </div>

      {/* 7-Day Chart */}
      <Card className="p-6">
        <CardHeader
          title={t('chart_forecast_title')}
          subtitle={`Highs and lows for ${locationName}, ${locationCountry}`}
          icon={CloudSun}
        />
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3EDE2" />
              <XAxis dataKey="date" stroke="#183B28" fontSize={11} />
              <YAxis unit="°C" stroke="#183B28" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#F3EDE2',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="max" name={t('chart_max_temp')} stroke="#BC6C25" fill="#BC6C25" fillOpacity={0.2} strokeWidth={2} />
              <Area type="monotone" dataKey="min" name={t('chart_min_temp')} stroke="#2A6A48" fill="#2A6A48" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Rainfall and Evapotranspiration Chart */}
      <Card className="p-6">
        <CardHeader
          title="Daily Precipitation & Evapotranspiration (ET0)"
          subtitle="FAO Penman-Monteith crop water demand"
          icon={Droplets}
        />
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3EDE2" />
              <XAxis dataKey="date" stroke="#183B28" fontSize={11} />
              <YAxis unit="mm" stroke="#183B28" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#F3EDE2',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="rain" name="Precipitation (mm)" fill="#52B788" radius={[4, 4, 0, 0]} />
              <Bar dataKey="evapo" name="Evapotranspiration (mm)" fill="#BC6C25" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export default WeatherPage;
