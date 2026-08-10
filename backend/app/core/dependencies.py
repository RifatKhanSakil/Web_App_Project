from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Dict, Any
from bson import ObjectId
from app.core.database import db  # Assuming your database instance is imported from here

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin")
users_collection = db["users"]

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    # Since your token in auth.py was structured like "token_email@domain.com",
    # we can extract the email from the token string.
    if not token.startswith("token_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = token.replace("token_", "")
    user = users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token or credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Map MongoDB _id to id string for frontend/backend consistency
    user["id"] = str(user["_id"])
    return user

def require_admin(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin permissions required."
        )
    return current_user