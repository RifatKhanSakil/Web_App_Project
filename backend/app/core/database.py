from pymongo import MongoClient
from app.core.config import MONGODB_URL, DATABASE_NAME

client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Exported Collections
animals_collection = db["animals"]
bookings_collection = db["bookings"]
inquiries_collection = db["inquiries"]
contact_collection = db["contact"]