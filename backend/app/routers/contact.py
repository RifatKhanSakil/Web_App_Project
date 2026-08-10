from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from bson import ObjectId
from app.core.database import db

router = APIRouter(prefix="/contact", tags=["Contact"])
contact_collection = db["contact"]

def serialize_doc(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_contact_message(message_data: dict):
    try:
        data = dict(message_data)
        result = contact_collection.insert_one(data)
        data["id"] = str(result.inserted_id)
        if "_id" in data:
            del data["_id"]
        return {"success": True, "message": "Message sent successfully", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/messages", response_model=List[Dict[str, Any]])
@router.get("/messages/", response_model=List[Dict[str, Any]])
async def get_contact_messages():
    try:
        messages = list(contact_collection.find())
        return [serialize_doc(m) for m in messages]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/messages/{message_id}")
async def delete_contact_message(message_id: str):
    try:
        if not ObjectId.is_valid(message_id):
            raise HTTPException(status_code=400, detail="Invalid message ID format")
        
        result = contact_collection.delete_one({"_id": ObjectId(message_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Message not found")
            
        return {"success": True, "message": "Message deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))