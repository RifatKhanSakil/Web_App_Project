from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from app.core.database import db
from app.schemas.inquiry import InquiryCreate, InquiryResponse

router = APIRouter(
    prefix="/inquiries",
    tags=["Inquiries"]
)

inquiries_collection = db["inquiries"]


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_inquiry(inquiry: InquiryCreate):
    inquiry_data = inquiry.model_dump()
    result = inquiries_collection.insert_one(inquiry_data)
    return {
        "message": "Inquiry submitted successfully",
        "id": str(result.inserted_id),
    }


@router.get("/")
def get_inquiries():
    inquiries = list(inquiries_collection.find())
    for item in inquiries:
        item["_id"] = str(item["_id"])
    return inquiries


@router.put("/{inquiry_id}")
def update_inquiry(inquiry_id: str, inquiry: InquiryCreate):
    if not ObjectId.is_valid(inquiry_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid inquiry ID format",
        )

    update_data = {k: v for k, v in inquiry.model_dump().items() if v is not None}
    
    update_result = inquiries_collection.update_one(
        {"_id": ObjectId(inquiry_id)},
        {"$set": update_data}
    )

    if update_result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found",
        )

    return {"message": "Inquiry updated successfully", "id": inquiry_id}


@router.delete("/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inquiry(inquiry_id: str):
    if not ObjectId.is_valid(inquiry_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid inquiry ID format",
        )

    delete_result = inquiries_collection.delete_one({"_id": ObjectId(inquiry_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found",
        )