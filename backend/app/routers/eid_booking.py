from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from bson import ObjectId
from app.core.database import bookings_collection # Adjust import based on your db setup

router = APIRouter(prefix="/bookings", tags=["Eid Bookings"])

def serialize_doc(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_booking(booking_data: dict):
    try:
        data = dict(booking_data)
        result = bookings_collection.insert_one(data)
        data["id"] = str(result.inserted_id)
        if "_id" in data:
            del data["_id"]
        return {"success": True, "message": "Booking created successfully", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[Dict[str, Any]])
@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_bookings():
    try:
        bookings = list(bookings_collection.find())
        return [serialize_doc(b) for b in bookings]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{booking_id}")
async def delete_booking(booking_id: str):
    try:
        if not ObjectId.is_valid(booking_id):
            raise HTTPException(status_code=400, detail="Invalid booking ID format")
        
        result = bookings_collection.delete_one({"_id": ObjectId(booking_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Booking not found")
            
        return {"success": True, "message": "Booking deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))