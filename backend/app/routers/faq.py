from fastapi import APIRouter, status
from typing import List, Dict

router = APIRouter(prefix="/faq", tags=["FAQ"])

@router.get("/", response_model=List[Dict[str, str]], status_code=status.HTTP_200_OK)
async def get_faqs():
    return [
        {
            "id": "1",
            "question": "How can I schedule a farm visit?",
            "answer": "You can submit a visit request through our website form or contact us directly via phone."
        },
        {
            "id": "2",
            "question": "What types of livestock do you offer?",
            "answer": "We specialize in healthy cattle, including various breeds of cows and goats."
        },
        {
            "id": "3",
            "question": "Are health records provided for animals?",
            "answer": "Yes, complete vaccination and health documentation are provided with every livestock inquiry/purchase."
        }
    ]