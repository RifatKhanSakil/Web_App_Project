from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class InquiryResponse(InquiryCreate):
    id: str
    created_at: Optional[datetime] = None

    # Standard Pydantic V2 config (fixes the openapi.json 500 error)
    model_config = ConfigDict(from_attributes=True)
    