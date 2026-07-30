from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Read values from .env
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Connect to MongoDB
client = MongoClient(MONGODB_URL)

# Select the database
database = client[DATABASE_NAME]

# Select the inquiries collection
inquiries_collection = database["inquiries"]

# Test the connection
try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB successfully.")
except Exception as e:
    print("MongoDB Connection Failed:", e)