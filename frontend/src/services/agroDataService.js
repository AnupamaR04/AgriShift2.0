// Real-world Agro-meteorology and NASA Satellite Data Service
// Strictly queries genuine public scientific endpoints without invented/mock numbers

export const agroDataService = {
  /**
   * Fetches genuine real-time and 7-day forecast agro-weather for farmer's exact coordinates via Open-Meteo
   */
  fetchLiveWeather: async (latitude, longitude) => {
    try {
      // Using verified Open-Meteo variables: soil_moisture_0_to_7cm & soil_moisture_7_to_28cm
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,soil_temperature_0cm,soil_moisture_0_to_7cm,soil_moisture_7_to_28cm&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration&timezone=Asia%2FKolkata&forecast_days=7`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather service returned HTTP ${response.status}`);
      }
      const data = await response.json();
      return {
        source: 'Open-Meteo High-Resolution Agro-Meteorology (ECMWF & GFS)',
        status: 'available',
        current: data.current || null,
        current_units: data.current_units || {},
        daily: data.daily || {},
        hourly: data.hourly || {},
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('Weather fetch error:', err.message);
      return {
        source: 'Open-Meteo',
        status: 'unavailable',
        error: err.message,
      };
    }
  },

  /**
   * Fetches genuine NASA POWER Agro-Climatology point observation data for solar radiation, surface temperature & precipitation
   */
  fetchNasaPowerData: async (latitude, longitude) => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);

      const formatDate = (d) => d.toISOString().slice(0, 10).replace(/-/g, '');
      const startDate = formatDate(start);
      const endDate = formatDate(end);

      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,TS,PRECTOTCORR,RH2M&community=AG&longitude=${longitude}&latitude=${latitude}&start=${startDate}&end=${endDate}&format=JSON`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NASA POWER returned HTTP ${response.status}`);
      }
      const data = await response.json();

      return {
        source: 'NASA POWER Project (LaRC) Agroclimatology Methodology',
        status: 'available',
        header: data.header || {},
        parameters: data.parameters || {},
        properties: data.properties || {},
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('NASA POWER fetch error:', err.message);
      return {
        source: 'NASA POWER (LaRC)',
        status: 'unavailable',
        error: err.message,
      };
    }
  },
};
