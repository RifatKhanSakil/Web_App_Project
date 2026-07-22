from pymongo import MongoClient
from dotenv import load_dotenv
import os


# Load variables from .env file
load_dotenv()


# Get values from .env
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")


# Connect to MongoDB
client = MongoClient(MONGODB_URL)


# Select the database
database = client[DATABASE_NAME]


# Select the collection
inquiries_collection = database["inquiries"]