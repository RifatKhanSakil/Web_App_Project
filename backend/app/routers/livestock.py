from app.schemas.livestock import AnimalUpdateStatus
from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from bson import ObjectId

from app.core.database import db

router = APIRouter(prefix="/animals", tags=["Animals"])

@router.patch("/{animal_id}/status", status_code=status.HTTP_200_OK)
async def update_animal_status(animal_id: str, status_update: AnimalUpdateStatus):
    if not ObjectId.is_valid(animal_id):
        raise HTTPException(status_code=400, detail="Invalid animal ID format")

    updated_animal = await db["animals"].find_one_and_update(
        {"_id": ObjectId(animal_id)},
        {"$set": {"availability_status": status_update.availability_status}},
        return_document=True
    )

    if not updated_animal:
        raise HTTPException(status_code=404, detail="Animal record not found")

    updated_animal["_id"] = str(updated_animal["_id"])
    return updated_animal


@router.get("/", response_model=List[dict], status_code=status.HTTP_200_OK)
async def get_animals(
    category: Optional[str] = Query(
        None, 
        description="Filter animals by category (e.g., Cow, Goat)"
    ),
    is_featured: Optional[bool] = Query(
        None,
        description="Filter animals by featured status (True/False)"
    )
):
    query = {}
    
    if category:
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}
        
    if is_featured is not None:
        query["is_featured"] = is_featured
        
    animals = []
    cursor = db["animals"].find(query)
    
    async for animal in cursor:
        animal["_id"] = str(animal["_id"])
        animals.append(animal)
        
    return animals

