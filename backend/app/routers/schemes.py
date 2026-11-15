from fastapi import APIRouter
from app.services.kerala_agri_service import KeralaAgriService

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

@router.get("")
async def get_schemes():
    return {
        "status": "success",
        "schemes": KeralaAgriService.get_schemes()
    }
