from fastapi import APIRouter, status
from typing import Dict, List

router = APIRouter(prefix="/eid-booking", tags=["Eid Booking Information"])

@router.get("/", response_model=Dict[str, object], status_code=status.HTTP_200_OK)
async def get_eid_booking_info():
    return {
        "title": "Eid-ul-Adha Livestock Booking Information",
        "booking_status": "Open",
        "advance_payment_percentage": 20,
        "rules": [
            "20% advance booking amount required to confirm reservation.",
            "Free farm visits are allowed for animal selection upon prior schedule.",
            "Home delivery available up to 2 days before Eid."
        ],
        "important_dates": {
            "booking_start_date": "2026-05-01",
            "booking_end_date": "2026-06-01",
            "delivery_start_date": "2026-06-03"
        }
    }