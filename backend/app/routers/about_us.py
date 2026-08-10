from fastapi import APIRouter, status
from pydantic import BaseModel
from typing import List

class AboutUsResponse(BaseModel):
    title: str
    mission: str
    founded_year: int
    location: str
    core_values: List[str]
    farm_facilities: List[str]

router = APIRouter(prefix="/about-us", tags=["About Us"])

@router.get("/", response_model=AboutUsResponse, status_code=status.HTTP_200_OK)
async def get_about_us_info():
    return {
        "title": "About Our Cattle Farm",
        "mission": "Providing healthy livestock with complete transparency and care.",
        "founded_year": 2020,
        "location": "Gazipur, Bangladesh",
        "core_values": ["Ethical Practices", "Transparency", "Animal Welfare"],
        "farm_facilities": ["Ventilated sheds", "24/7 Vet care", "Hygienic feeding areas"]
    }