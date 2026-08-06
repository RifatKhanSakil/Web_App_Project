from enum import Enum
from pydantic import BaseModel

class AvailabilityStatus(str, Enum):
    AVAILABLE = "Available"
    BOOKED = "Booked"
    SOLD = "Sold"

class AnimalUpdateStatus(BaseModel):
    availability_status: AvailabilityStatus

# Explicitly rebuild schema so FastAPI / OpenAPI can evaluate it
AnimalUpdateStatus.model_rebuild()