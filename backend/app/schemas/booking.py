# File: backend/app/schemas/booking.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class BookingCreate(BaseModel):
    customer_name: str
    phone_number: str
    email: Optional[EmailStr] = None
    animal_tag_id: str
    notes: Optional[str] = ""

class BookingResponse(BookingCreate):
    id: str
    status: str = "Pending"