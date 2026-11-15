from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import health, satellite, weather, crops, schemes

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AgriShift Backend — Kerala Agricultural Intelligence API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(satellite.router)
app.include_router(weather.router)
app.include_router(crops.router)
app.include_router(schemes.router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to AgriShift API — Growing Smarter. Farming Stronger in Kerala.",
        "documentation": "/docs",
        "health": "/health",
        "region": "Kerala, India"
    }
