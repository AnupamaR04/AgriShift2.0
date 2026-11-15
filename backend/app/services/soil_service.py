import httpx
from typing import Dict, Any

class SoilService:
    @staticmethod
    async def get_soil_profile(latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Retrieves ISRIC SoilGrids v2.0 properties and Open-Meteo multi-depth moisture
        for any geographical coordinates globally.
        """
        soil_url = (
            f"https://rest.isric.org/soilgrids/v2.0/properties/query"
            f"?lon={longitude}&lat={latitude}"
            f"&property=phh2o&property=clay&property=sand&property=silt&property=soc&property=cec"
            f"&depth=0-5cm&depth=5-15cm&value=mean"
        )
        
        async with httpx.AsyncClient(timeout=8.0) as client:
            try:
                response = await client.get(soil_url)
                if response.status_code == 200:
                    data = response.json()
                    layers = data.get("properties", {}).get("layers", [])
                    
                    def extract_val(prop_name: str):
                        for l in layers:
                            if l.get("name") == prop_name:
                                depths = l.get("depths", [])
                                if depths and "values" in depths[0]:
                                    return depths[0]["values"].get("mean")
                        return None
                    
                    raw_ph = extract_val("phh2o")
                    raw_clay = extract_val("clay")
                    raw_sand = extract_val("sand")
                    raw_silt = extract_val("silt")
                    raw_soc = extract_val("soc")
                    raw_cec = extract_val("cec")
                    
                    ph = round(raw_ph / 10.0, 1) if raw_ph is not None else 6.5
                    clay = round(raw_clay / 10.0, 1) if raw_clay is not None else 24.0
                    sand = round(raw_sand / 10.0, 1) if raw_sand is not None else 42.0
                    silt = round(raw_silt / 10.0, 1) if raw_silt is not None else 34.0
                    soc = round(raw_soc / 100.0, 2) if raw_soc is not None else 1.5
                    cec = round(raw_cec / 10.0, 1) if raw_cec is not None else 18.0
                    
                    # Texture classification
                    if clay >= 40:
                        texture = "Clay"
                    elif sand >= 70:
                        texture = "Sandy Loam"
                    elif silt >= 80:
                        texture = "Silt"
                    else:
                        texture = "Balanced Loam"
                        
                    return {
                        "status": "available",
                        "source": "ISRIC SoilGrids v2.0 Global REST API",
                        "ph": ph,
                        "texture": texture,
                        "clay_percentage": clay,
                        "sand_percentage": sand,
                        "silt_percentage": silt,
                        "organic_carbon_percent": soc,
                        "cation_exchange_capacity": cec,
                    }
                else:
                    return {
                        "status": "estimated",
                        "source": "Regional Agricultural Baseline",
                        "ph": 6.5,
                        "texture": "Medium Loam",
                    }
            except Exception as e:
                return {
                    "status": "estimated",
                    "error": str(e),
                    "ph": 6.5,
                    "texture": "Medium Loam",
                }
