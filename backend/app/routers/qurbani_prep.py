from fastapi import APIRouter, status
from typing import Dict

router = APIRouter(prefix="/qurbani-prep", tags=["Qurbani Preparation"])

@router.get("/", response_model=Dict[str, object], status_code=status.HTTP_200_OK)
async def get_qurbani_preparation_info():
    return {
        "title": "Qurbani Preparation Guidelines",
        "description": "How our farm prepares livestock to ensure health and religious compliance before delivery.",
        "steps": [
            {
                "step": 1,
                "title": "Health & Vet Screening",
                "detail": "Every animal undergoes a certified veterinary health check 48 hours prior to delivery."
            },
            {
                "step": 2,
                "title": "Special Diet & Hydration",
                "detail": "Switched to organic feed and clean fresh water to maintain peak vitality."
            },
            {
                "step": 3,
                "title": "Sanitation & Grooming",
                "detail": "Animals are washed and cleaned in hygienic pens prior to dispatch."
            }
        ],
        "delivery_notes": "Safe transport arrangements are made in ventilated vehicles."
    }