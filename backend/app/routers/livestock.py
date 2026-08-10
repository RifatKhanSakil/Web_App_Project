from fastapi import APIRouter, HTTPException, Query, Depends, status, Form, File, UploadFile
from typing import Optional, List
from bson import ObjectId
import shutil
import os

from app.core.database import animals_collection
from app.core.dependencies import require_admin

router = APIRouter(prefix="/animals", tags=["Livestock"])


def serialize_animal(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc


# ------------------------------------------------------------------------------
# PUBLIC ENDPOINTS (Anyone can view)
# ------------------------------------------------------------------------------

@router.get("", response_model=List[dict])
@router.get("/", response_model=List[dict])
def get_all_animals(category: Optional[str] = Query(None, description="Filter by category")):
    try:
        filter_query = {}
        if category:
            # Case-insensitive regex match handles 'cow', 'Cow', 'goats', etc. seamlessly
            filter_query["category"] = {"$regex": f"^{category}$", "$options": "i"}

        animals = list(animals_collection.find(filter_query))
        return [serialize_animal(animal) for animal in animals]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{animal_id}", response_model=dict)
def get_animal_by_id(animal_id: str):
    try:
        if not ObjectId.is_valid(animal_id):
            raise HTTPException(status_code=400, detail="Invalid Animal ID format")

        animal = animals_collection.find_one({"_id": ObjectId(animal_id)})
        if not animal:
            raise HTTPException(status_code=404, detail="Animal not found")

        return serialize_animal(animal)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------------------------------
# ADMIN-ONLY ENDPOINTS (Requires 'admin' role token)
# ------------------------------------------------------------------------------

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_animal(
    title: str = Form(...),
    category: str = Form(...),
    breed: str = Form(...),
    weight: float = Form(...),
    price: float = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """Add a new animal with physical image storage (Admin Only)"""
    try:
        image_url = None
        if image:
            os.makedirs("static/uploads", exist_ok=True)
            file_location = f"static/uploads/{image.filename}"
            with open(file_location, "wb+") as file_object:
                shutil.copyfileobj(image.file, file_object)
            image_url = f"http://localhost:8000/static/uploads/{image.filename}"

        animal_data = {
            "title": title,
            "category": category,
            "breed": breed,
            "weight": weight,
            "price": price,
            "description": description,
            "image_url": image_url
        }

        result = animals_collection.insert_one(animal_data)
        new_animal = animals_collection.find_one({"_id": result.inserted_id})
        return serialize_animal(new_animal)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{animal_id}", response_model=dict, dependencies=[Depends(require_admin)])
def update_animal(animal_id: str, payload: dict):
    """Update an existing animal's details (Admin Only)"""
    try:
        if not ObjectId.is_valid(animal_id):
            raise HTTPException(status_code=400, detail="Invalid Animal ID format")

        payload.pop("_id", None)
        payload.pop("id", None)

        result = animals_collection.update_one(
            {"_id": ObjectId(animal_id)},
            {"$set": payload}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Animal not found")

        updated_animal = animals_collection.find_one({"_id": ObjectId(animal_id)})
        return serialize_animal(updated_animal)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{animal_id}", dependencies=[Depends(require_admin)])
def delete_animal(animal_id: str):
    """Delete an animal listing (Admin Only)"""
    try:
        if not ObjectId.is_valid(animal_id):
            raise HTTPException(status_code=400, detail="Invalid Animal ID format")

        result = animals_collection.delete_one({"_id": ObjectId(animal_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Animal not found")

        return {"status": "success", "message": f"Animal {animal_id} deleted successfully."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))