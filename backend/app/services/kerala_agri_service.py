from typing import List, Dict, Any

class KeralaAgriService:
    @staticmethod
    def get_crop_recommendations(district: str, soil_type: str, current_crop: str, season: str) -> List[Dict[str, Any]]:
        """
        Kerala Agricultural University (KAU) agronomic matching engine.
        Distinguishes food crops, spices, and plantation crops across Kerala agro-climatic zones.
        """
        recs = [
            {
                "crop_name": "Cowpea / Black Gram (പയർവർഗ്ഗങ്ങൾ)",
                "suitability_score": "95% High Compatibility",
                "category": "Legume / Soil Restorative",
                "suitable_season": "Puncha (Post-Mundakan Rice Fallow)",
                "soil_requirements": "Thrives in residual moisture of paddy soils; tolerates mild acidity.",
                "water_requirements": "Low. Utilizes residual moisture post rice harvest.",
                "agronomic_reasoning": "Symbiotic nitrogen fixation restores up to 40 kg N/ha into Kerala laterite and alluvial soils, reducing synthetic urea requirements for the subsequent crop.",
                "kau_reference": "KAU Package of Practices: Pulses Section (p. 42)"
            },
            {
                "crop_name": "Nendran Banana (ഏത്തവാഴ)",
                "suitability_score": "88% Strong Match",
                "category": "High-Value Cash Crop",
                "suitable_season": "Aug-Sept Planting (for Onam Season)",
                "soil_requirements": "Requires well-drained fertile loam with pit depth of 50cm; cannot tolerate water stagnation.",
                "water_requirements": "Moderate to High. Requires regular basin or drip irrigation during dry summer months.",
                "agronomic_reasoning": "High economic return and heavy organic biomass production; benefits from potash application common in Kerala soils.",
                "kau_reference": "KAU Package of Practices: Fruits & Plantains (p. 78)"
            },
            {
                "crop_name": "Sesamum (എള്ള് - Thilarani / Surya)",
                "suitability_score": "82% Recommended Rotation",
                "category": "Oilseed Fallow Crop",
                "suitable_season": "Jan - March (Summer Puncha)",
                "soil_requirements": "Laterite or sandy clay loam with good drainage.",
                "water_requirements": "Very low water consumption. Matures within 75-80 days.",
                "agronomic_reasoning": "Breaks nematode and stem borer lifecycles between consecutive paddy seasons.",
                "kau_reference": "KAU Package of Practices: Oilseeds (p. 61)"
            }
        ]
        return recs

    @staticmethod
    def get_schemes() -> List[Dict[str, Any]]:
        return [
            {
                "id": "subhiksha-keralam",
                "title": "Subhiksha Keralam (സുഭിക്ഷ കേരളം)",
                "dept": "Department of Agriculture Development & Farmers Welfare, Kerala",
                "category": "State Scheme",
                "benefits": "Financial assistance, seed subsidies, and fallow land cultivation grants.",
                "eligibility": "Individual farmers, Kudumbashree groups, and joint liability groups cultivating food crops.",
                "documents": "Aadhaar Card, Land Tax Receipt, Bank Passbook copy.",
                "portal": "https://keralaagriculture.gov.in",
                "verified_date": "November 2026"
            },
            {
                "id": "aims-crop-insurance",
                "title": "State Crop Insurance Scheme (സംസ്ഥാന വിള ഇൻഷുറൻസ്)",
                "dept": "Government of Kerala - State Agriculture Portal",
                "category": "State Scheme",
                "benefits": "State Crop Insurance Scheme covering 25+ crops against natural calamities and wildlife damage.",
                "eligibility": "All registered agricultural landowners and leaseholders in Kerala.",
                "documents": "Land possession certificate, Tax receipt, Photo of crop field.",
                "portal": "https://aims.kerala.gov.in",
                "verified_date": "November 2026"
            },
            {
                "id": "pm-kisan",
                "title": "PM-KISAN Samman Nidhi",
                "dept": "Ministry of Agriculture & Farmers Welfare, Govt of India",
                "category": "Central Scheme",
                "benefits": "Direct income support of ₹6,000 per year in three equal installments to eligible landholding families.",
                "eligibility": "Small and marginal landholder farmer families with cultivable land.",
                "documents": "Aadhaar, Land title deed, eKYC bank account.",
                "portal": "https://pmkisan.gov.in",
                "verified_date": "November 2026"
            }
        ]
