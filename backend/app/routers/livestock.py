from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

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