from pydantic import BaseModel
from typing import Optional

class LivestockBase(BaseModel):
    tag_id: str
    category: str  # "Cattle" or "Goat"
    breed: str
    weight_kg: float
    price: float
    health_status: str
    is_available: bool = True
    image_url: Optional[str] = None

class LivestockResponse(LivestockBase):
    id: str