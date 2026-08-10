from fastapi import APIRouter, status
from typing import Dict

router = APIRouter(prefix="/visiting-info", tags=["Visiting Info"])

@router.get("/", response_model=Dict[str, object], status_code=status.HTTP_200_OK)
async def get_visiting_info():
    return {
        "title": "Farm Visiting Guidelines",
        "visiting_hours": "Saturday to Thursday, 9:00 AM - 5:00 PM",
        "guidelines": [
            "Prior appointment or inquiry submission is recommended.",
            "Maintain safety distance near heavy livestock.",
            "Follow biosecurity and hygiene measures at entry points."
        ],
        "location_notes": "Parking available near the main farm entry gate."
    }