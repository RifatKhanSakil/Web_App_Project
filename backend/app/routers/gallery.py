from fastapi import APIRouter, status
from typing import List, Dict
from app.core.database import db

router = APIRouter(prefix="/gallery", tags=["Gallery"])

@router.get("/", response_model=List[Dict], status_code=status.HTTP_200_OK)
async def get_gallery_images():
    images = []
    cursor = db["gallery"].find({})
    
    async for image in cursor:
        image["_id"] = str(image["_id"])
        images.append(image)
        
    return images