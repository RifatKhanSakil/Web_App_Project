from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSignUp(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str  # "admin" or "user"

class UserSignIn(BaseModel):
    email: EmailStr
    password: str
    role: str  # "admin" or "user"

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse