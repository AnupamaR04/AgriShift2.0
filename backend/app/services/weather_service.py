import httpx
from typing import Dict, Any

class WeatherService:
    @staticmethod
    async def get_farm_weather(latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Retrieves real-time agro-meteorology and 7-day forecast via Open-Meteo
        """
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}&longitude={longitude}"
            f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m"
            f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration"
            f"&hourly=soil_moisture_0_to_1cm,soil_moisture_1_to_3cm"
            f"&timezone=Asia%2FKolkata&forecast_days=7"
        )

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "status": "available",
                        "source": "Open-Meteo High-Resolution Agro-Weather (ECMWF)",
                        "coordinates": {"latitude": latitude, "longitude": longitude},
                        "current": data.get("current"),
                        "daily": data.get("daily"),
                        "hourly": data.get("hourly")
                    }
                else:
                    return {
                        "status": "unavailable",
                        "message": f"Weather service returned HTTP {response.status_code}"
                    }
            except Exception as e:
                return {
                    "status": "unavailable",
                    "error": str(e)
                }
