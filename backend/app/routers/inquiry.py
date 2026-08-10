from fastapi import APIRouter, HTTPException, status
from typing import List, Dict
from bson import ObjectId
from app.core.database import db
from app.schemas.inquiry import InquiryCreate

router = APIRouter(
    prefix="/inquiry",
    tags=["Inquiries"]
)

inquiries_collection = db["inquiries"]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_inquiry(inquiry: InquiryCreate):
    inquiry_data = inquiry.model_dump()
    result = await inquiries_collection.insert_one(inquiry_data)
    return {
        "message": "Inquiry submitted successfully",
        "id": str(result.inserted_id),
    }


@router.get("/", response_model=List[Dict], status_code=status.HTTP_200_OK)
async def get_inquiries():
    inquiries = []
    cursor = inquiries_collection.find({})
    async for item in cursor:
        item["_id"] = str(item["_id"])
        inquiries.append(item)
    return inquiries


@router.put("/{inquiry_id}", status_code=status.HTTP_200_OK)
async def update_inquiry(inquiry_id: str, inquiry: InquiryCreate):
    if not ObjectId.is_valid(inquiry_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid inquiry ID format",
        )

    update_data = {k: v for k, v in inquiry.model_dump().items() if v is not None}
    
    update_result = await inquiries_collection.update_one(
        {"_id": ObjectId(inquiry_id)},
        {"$set": update_data}
    )

    if update_result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found",
        )

    return {"message": "Inquiry updated successfully", "id": inquiry_id}


@router.delete("/{inquiry_id}", status_code=status.HTTP_200_OK)
async def delete_inquiry(inquiry_id: str):
    if not ObjectId.is_valid(inquiry_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid inquiry ID format",
        )

    delete_result = await inquiries_collection.delete_one({"_id": ObjectId(inquiry_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found",
        )

    return {"message": "Inquiry deleted successfully", "id": inquiry_id}