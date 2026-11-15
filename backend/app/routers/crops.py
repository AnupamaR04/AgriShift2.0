from fastapi import APIRouter
from app.models.schemas import CropRecommendationRequest
from app.services.kerala_agri_service import KeralaAgriService

router = APIRouter(prefix="/api/crops", tags=["Crops"])

@router.post("/recommend")
async def recommend_crops(req: CropRecommendationRequest):
    recs = KeralaAgriService.get_crop_recommendations(
        district=req.district,
        soil_type=req.soil_type,
        current_crop=req.current_crop,
        season=req.farming_season
    )
    return {
        "status": "success",
        "district": req.district,
        "recommendations": recs
    }

@router.get("/calendar")
async def get_crop_calendar():
    return {
        "status": "success",
        "source": "Kerala Agricultural University (KAU) Package of Practices",
        "seasons": ["Virippu", "Mundakan", "Puncha", "Perennial"]
    }
