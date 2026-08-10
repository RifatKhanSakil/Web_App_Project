from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import UserSignUp, UserSignIn, TokenResponse, UserResponse
from app.core.database import db 

router = APIRouter(prefix="/auth", tags=["Authentication"])

ADMIN_EMAIL = "adminkhan@gmail.com"
users_collection = db["users"] 

@router.post("/signup", response_model=TokenResponse)
def sign_up(payload: UserSignUp):
    email_clean = payload.email.lower().strip()
    
    if payload.role == "admin" and email_clean != ADMIN_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only '{ADMIN_EMAIL}' is allowed to register as Admin."
        )
    
    existing_user = users_collection.find_one({"email": email_clean})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with this email already exists."
        )

    user_data = {
        "email": email_clean,
        "password": payload.password, 
        "full_name": payload.full_name or email_clean.split('@')[0],
        "role": payload.role
    }
    
    result = users_collection.insert_one(user_data)
    user_data["id"] = str(result.inserted_id)

    token = f"token_{email_clean}"

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(**user_data)
    )

@router.post("/signin", response_model=TokenResponse)
def sign_in(payload: UserSignIn):
    email_clean = payload.email.lower().strip()

    if payload.role == "admin" and email_clean != ADMIN_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. '{email_clean}' cannot log in as Admin."
        )

    user = users_collection.find_one({"email": email_clean})

    if not user or user["password"] != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if user["role"] != payload.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role mismatch. Account is registered as '{user['role']}'."
        )

    user["id"] = str(user["_id"])
    token = f"token_{email_clean}"

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(**user)
    )