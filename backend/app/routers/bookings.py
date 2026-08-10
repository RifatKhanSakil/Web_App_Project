from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from bson import ObjectId
from app.core.database import bookings_collection, inquiries_collection
from app.schemas.inquiry import InquiryCreate, BookingCreate

router = APIRouter(prefix="/bookings", tags=["Bookings & Inquiries"])

def serialize_doc(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

# ================= BOOKINGS ROUTES =================

@router.post("/", status_code=status.HTTP_201_CREATED)
@router.post("", status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate):
    try:
        booking_data = booking.model_dump()
        booking_data["status"] = "Pending"
        
        result = bookings_collection.insert_one(booking_data)
        booking_data["id"] = str(result.inserted_id)
        if "_id" in booking_data:
            del booking_data["_id"]
        
        return {"message": "Booking created successfully", "data": booking_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Dict[str, Any]])
@router.get("", response_model=List[Dict[str, Any]])
def get_all_bookings():
    try:
        bookings = list(bookings_collection.find())
        return [serialize_doc(b) for b in bookings]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{booking_id}")
def delete_booking(booking_id: str):
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


# ================= INQUIRIES ROUTES =================

@router.post("/inquiries", status_code=status.HTTP_201_CREATED)
def create_inquiry(inquiry: InquiryCreate):
    try:
        inquiry_data = inquiry.model_dump()
        result = inquiries_collection.insert_one(inquiry_data)
        inquiry_data["id"] = str(result.inserted_id)
        if "_id" in inquiry_data:
            del inquiry_data["_id"]
        
        return {"message": "Inquiry submitted successfully", "data": inquiry_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/inquiries", response_model=List[Dict[str, Any]])
def get_all_inquiries():
    try:
        inquiries = list(inquiries_collection.find())
        return [serialize_doc(i) for i in inquiries]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/inquiries/{inquiry_id}")
def delete_inquiry(inquiry_id: str):
    try:
        if not ObjectId.is_valid(inquiry_id):
            raise HTTPException(status_code=400, detail="Invalid inquiry ID format")
            
        result = inquiries_collection.delete_one({"_id": ObjectId(inquiry_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Inquiry not found")
            
        return {"success": True, "message": "Inquiry deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))