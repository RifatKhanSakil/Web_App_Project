from fastapi import APIRouter, status
from typing import List, Dict
from app.core.database import db

router = APIRouter(prefix="/premium-qurbani", tags=["Premium Qurbani"])

@router.get("/", response_model=List[Dict], status_code=status.HTTP_200_OK)
async def get_premium_qurbani_animals():
    premium_animals = []
    cursor = db["animals"].find({"category": "premium"})
    
    async for item in cursor:
        item["_id"] = str(item["_id"])
        premium_animals.append(item)
        
    return premium_animals