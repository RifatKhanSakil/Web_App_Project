from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.inquiry import router as inquiry_router
from app.routers.livestock import router as livestock_router
from app.routers.gallery import router as gallery_router
from app.routers.contact import router as contact_router
from app.routers.faq import router as faq_router
from app.routers.visiting_info import router as visiting_info_router
from app.routers.livestock_weight import router as livestock_weight_router
from app.routers.eid_sales import router as eid_sales_router
from app.routers.qurbani_prep import router as qurbani_prep_router

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
app.include_router(contact_router)
app.include_router(faq_router)
app.include_router(visiting_info_router)
app.include_router(livestock_weight_router)
app.include_router(eid_sales_router)
app.include_router(qurbani_prep_router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Cattle Farm Management API is running"}