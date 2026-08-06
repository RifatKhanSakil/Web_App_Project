from pydantic import BaseModel
from enum import Enum

class AvailabilityStatus(str, Enum):
    AVAILABLE = "Available"
    BOOKED = "Booked"
    SOLD = "Sold"

class AnimalUpdateStatus(BaseModel):
    availability_status: AvailabilityStatus

AnimalUpdateStatus.model_rebuild()