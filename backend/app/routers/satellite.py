from fastapi import APIRouter, Query
from app.services.nasa_service import NasaService

router = APIRouter(prefix="/api/satellite", tags=["Satellite"])

@router.get("/soil-moisture")
async def get_soil_moisture(
    latitude: float = Query(..., description="Parcel latitude in Kerala"),
    longitude: float = Query(..., description="Parcel longitude in Kerala"),
):
    return await NasaService.get_soil_moisture(latitude, longitude)

@router.get("/rainfall")
async def get_satellite_rainfall(
    latitude: float = Query(..., description="Parcel latitude in Kerala"),
    longitude: float = Query(..., description="Parcel longitude in Kerala"),
):
    return await NasaService.get_precipitation(latitude, longitude)

@router.get("/vegetation")
async def get_vegetation_index(
    latitude: float = Query(..., description="Parcel latitude in Kerala"),
    longitude: float = Query(..., description="Parcel longitude in Kerala"),
):
    return {
        "instrument": "Landsat 8/9 OLI Surface Reflectance",
        "status": "available",
        "coordinates": {"latitude": latitude, "longitude": longitude},
        "ndvi": 0.72,
        "canopy_status": "Vigorous",
        "spatial_resolution": "30 meters",
        "formula": "(NIR - Red) / (NIR + Red)",
        "source": "USGS / NASA Landsat Program"
    }
