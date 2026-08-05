from fastapi import APIRouter, status
from typing import List, Dict
from app.core.database import db

router = APIRouter(prefix="/eid-sales", tags=["Eid Special Sales"])

@router.get("/", response_model=List[Dict], status_code=status.HTTP_200_OK)
async def get_eid_special_sales():
    sales = []
    # Query animals marked for Eid special sale or with special offers
    cursor = db["animals"].find({"is_eid_special": True})
    
    async for item in cursor:
        item["_id"] = str(item["_id"])
        sales.append(item)
        
    return sales