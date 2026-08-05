from fastapi import APIRouter, status
from typing import Dict

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.get("/", response_model=Dict[str, str], status_code=status.HTTP_200_OK)
async def get_contact_info():
    return {
        "farm_name": "Khan Agro",
        "address": "Sataish, Ward#51, Tongi(West), Gazipur City Corporation, Gazipur, Bangladesh",
        "phone": "+880 1521568156",
        "email": "khanagro@gmail.com",
        "visiting_hours": "Sat - Thu: 9:00 AM - 5:00 PM"
    }