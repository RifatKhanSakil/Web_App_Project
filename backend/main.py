from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.inquiry import router as inquiry_router
from app.routers.livestock import router as livestock_router
from app.routers.gallery import router as gallery_router

app = FastAPI(
    title="Cattle Farm Management API",
    description="Farm Visit & Animal Inquiry REST API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the modular inquiry router
app.include_router(inquiry_router)
app.include_router(livestock_router)
app.include_router(gallery_router)


@app.get("/")
def read_root():
    return {"status": "online", "message": "Cattle Farm Management API is running"}