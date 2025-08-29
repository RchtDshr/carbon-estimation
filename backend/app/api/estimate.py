from fastapi import APIRouter, HTTPException
from schemas import EstimateRequest, EstimateResponse
from app.services.llm import estimate_carbon_from_dish

router = APIRouter(tags=["estimate"])

@router.post("/estimate", response_model=EstimateResponse)
async def estimate_carbon(request: EstimateRequest):
    try:
        result = await estimate_carbon_from_dish(request.dish)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
