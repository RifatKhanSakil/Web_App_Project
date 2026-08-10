from fastapi import APIRouter, status
from typing import List, Dict
from app.core.database import db

router = APIRouter(prefix="/livestock-weight", tags=["Livestock Weight"])

@router.get("/", response_model=List[Dict], status_code=status.HTTP_200_OK)
async def get_livestock_weight_info():
    weights = []
    cursor = db["animals"].find({}, {"name": 1, "breed": 1, "weight_kg": 1, "category": 1})
    
    async for item in cursor:
        item["_id"] = str(item["_id"])
        weights.append(item)
        
    return weights