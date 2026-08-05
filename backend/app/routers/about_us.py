from fastapi import APIRouter, status
from typing import Dict, List

router = APIRouter(prefix="/about-us", tags=["About Us"])

@router.get("/", response_model=Dict[str, object], status_code=status.HTTP_200_OK)
async def get_about_us_info():
    return {
        "title": "About Our Cattle Farm",
        "mission": "Providing healthy, ethically raised livestock with complete transparency and top-tier customer care.",
        "founded_year": 2022,
        "location": "Gazipur, Bangladesh",
        "core_values": [
            "Ethical & Organic Farming Practices",
            "Transparent Health & Weight Records",
            "Customer Satisfaction & Hassle-Free Delivery"
        ],
        "farm_facilities": [
            "Spacious, ventilated cattle sheds",
            "Regular veterinary health inspections",
            "Balanced organic feed management"
        ]
    }