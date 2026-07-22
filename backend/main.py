from fastapi import FastAPI
from pydantic import BaseModel
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from database import inquiries_collection

class Inquiry(BaseModel):
    name: str
    phone: str
    email: str
    animal: str
    purpose: str
    visit_date: str
    message: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {
        "message": "Welcome to Cattle Farm Management System API"
    }


@app.post("/inquiries")
def create_inquiry(inquiry: Inquiry):

    inquiry_data = inquiry.model_dump()

    inquiries_collection.insert_one(inquiry_data)

    return {
        "status": "success",
        "message": "Inquiry submitted successfully."
    }


@app.get("/inquiries")
def get_inquiries():

    inquiries = []

    for inquiry in inquiries_collection.find():

        inquiry["_id"] = str(inquiry["_id"])

        inquiries.append(inquiry)

    return inquiries


@app.delete("/inquiries/{id}")
def delete_inquiry(id: str):

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

