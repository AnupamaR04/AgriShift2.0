from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class FarmBase(BaseModel):
    farm_name: str = "My Kerala Farm"
    farm_size: float = 1.0
    farm_size_unit: str = "acres"
    latitude: float
    longitude: float
    district: str
    panchayat: Optional[str] = None
    soil_type: str
    current_crop: str
    previous_crop: Optional[str] = None
    irrigation_method: str = "rainfed"
    farming_season: str = "mundakan"

class FarmCreate(FarmBase):
    pass

class FarmResponse(FarmBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class SatelliteTelemetry(BaseModel):
    instrument: str
    metric: str
    value: float
    unit: str
    observation_date: date
    spatial_resolution: str
    quality_status: str = "VALID"

class WeatherResponse(BaseModel):
    latitude: float
    longitude: float
    temperature_c: float
    apparent_temp_c: float
    relative_humidity_pct: float
    wind_speed_kmh: float
    precipitation_mm: float
    forecast_7d: List[Dict[str, Any]]
    source: str = "Open-Meteo High-Resolution ECMWF"

class CropRecommendationRequest(BaseModel):
    district: str
    soil_type: str
    current_crop: str
    previous_crop: Optional[str] = None
    farming_season: str = "mundakan"
    farm_size_acres: float = 1.0

class CropRecommendationItem(BaseModel):
    crop_name: str
    suitability_score: str
    category: str
    suitable_season: str
    soil_requirements: str
    water_requirements: str
    agronomic_reasoning: str
    kau_reference: str

class SchemeItem(BaseModel):
    id: str
    title: str
    dept: str
    category: str
    benefits: str
    eligibility: str
    documents: str
    portal: str
    verified_date: str
