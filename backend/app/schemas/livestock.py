from enum import Enum
from pydantic import BaseModel

class AvailabilityStatus(str, Enum):
    AVAILABLE = "Available"
    BOOKED = "Booked"
    SOLD = "Sold"

class AnimalUpdateStatus(BaseModel):
    availability_status: AvailabilityStatus

AnimalUpdateStatus.model_rebuild()