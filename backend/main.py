from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from database import inquiries_collection


# -----------------------------
# FastAPI App Information
# -----------------------------
app = FastAPI(
    title="Cattle Farm Management API",
    description="Farm Visit & Animal Inquiry REST API",
    version="1.0.0"
)


# -----------------------------
# Enable CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Inquiry Data Model
# -----------------------------
class Inquiry(BaseModel):
    name: str
    phone: str
    email: EmailStr
    animal: str
    purpose: str
    visit_date: str
    message: str


# -----------------------------
# Home API
# -----------------------------
@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Welcome to Cattle Farm Management System API"
    }


# -----------------------------
# Create New Inquiry
# -----------------------------
@app.post("/inquiries")
def create_inquiry(inquiry: Inquiry):

    inquiry_data = inquiry.model_dump()

    result = inquiries_collection.insert_one(inquiry_data)

    return {
        "status": "success",
        "message": "Inquiry submitted successfully.",
        "id": str(result.inserted_id)
    }


# -----------------------------
# Get All Inquiries
# -----------------------------
@app.get("/inquiries")
def get_inquiries():

    inquiries = []

    for inquiry in inquiries_collection.find().sort("_id", -1):

        inquiry["_id"] = str(inquiry["_id"])

        inquiries.append(inquiry)

    return inquiries


# -----------------------------
# Delete Inquiry
# -----------------------------
@app.delete("/inquiries/{id}")
def delete_inquiry(id: str):

    try:

        result = inquiries_collection.delete_one(
            {"_id": ObjectId(id)}
        )

        if result.deleted_count == 1:
            return {
                "status": "success",
                "message": "Inquiry deleted successfully."
            }

        return {
            "status": "failed",
            "message": "Inquiry not found."
        }

    except Exception:

        return {
            "status": "failed",
            "message": "Invalid inquiry ID."
        }