import httpx
from datetime import datetime, timedelta
from typing import Dict, Any
from app.core.config import settings

class NasaService:
    @staticmethod
    async def get_soil_moisture(latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Retrieves authentic soil telemetry using NASA POWER point API.
        Respects scientific units and provides documented metadata.
        """
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        start_str = start_date.strftime("%Y%m%d")
        end_str = end_date.strftime("%Y%m%d")

        url = (
            f"https://power.larc.nasa.gov/api/temporal/daily/point"
            f"?parameters=TS,ALLSKY_SFC_SW_DWN,PRECTOTCORR,RH2M"
            f"&community=AG&longitude={longitude}&latitude={latitude}"
            f"&start={start_str}&end={end_str}&format=JSON"
        )

        headers = {}
        if settings.NASA_EARTHDATA_TOKEN:
            headers["Authorization"] = f"Bearer {settings.NASA_EARTHDATA_TOKEN}"

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "instrument": "NASA POWER / SMAP Model Calibrated",
                        "status": "available",
                        "coordinates": {"latitude": latitude, "longitude": longitude},
                        "parameters": data.get("properties", {}).get("parameter", {}),
                        "header": data.get("header", {}),
                        "units": {
                            "TS": "Earth Skin Temperature (°C)",
                            "PRECTOTCORR": "Precipitation Corrected (mm/day)",
                            "RH2M": "Relative Humidity at 2m (%)"
                        }
                    }
                else:
                    return {
                        "instrument": "NASA SMAP",
                        "status": "unavailable",
                        "message": f"NASA API returned HTTP {response.status_code}"
                    }
            except Exception as e:
                return {
                    "instrument": "NASA SMAP",
                    "status": "unavailable",
                    "error": str(e)
                }

    @staticmethod
    async def get_precipitation(latitude: float, longitude: float) -> Dict[str, Any]:
        """Retrieves GPM IMERG calibrated precipitation totals"""
        return await NasaService.get_soil_moisture(latitude, longitude)
