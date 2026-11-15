from fastapi import APIRouter, Query
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("")
async def get_weather(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate"),
):
    return await WeatherService.get_farm_weather(latitude, longitude)
