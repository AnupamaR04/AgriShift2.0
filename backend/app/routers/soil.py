from fastapi import APIRouter, Query
from app.services.soil_service import SoilService

router = APIRouter(prefix="/api/soil", tags=["Soil Intelligence"])

@router.get("")
async def get_soil(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate"),
):
    return await SoilService.get_soil_profile(latitude, longitude)
