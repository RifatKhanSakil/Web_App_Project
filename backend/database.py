from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get values from .env
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Connect to MongoDB
client = MongoClient(MONGODB_URL)

# Select database
database = client[DATABASE_NAME]

# Select collection
inquiries_collection = database["inquiries"]

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB successfully.")
except Exception as e:
    print("MongoDB Connection Failed!")
    print(e)