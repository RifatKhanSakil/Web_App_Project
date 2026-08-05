from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class InquiryResponse(InquiryCreate):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True