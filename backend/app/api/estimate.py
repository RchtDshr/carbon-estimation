from fastapi import APIRouter, HTTPException
from schemas import EstimateRequest, EstimateResponse
from app.services.llm import estimate_carbon_from_dish
from app.services.cache import cache_service

router = APIRouter(tags=["estimate"])

@router.post("/estimate", response_model=EstimateResponse)
async def estimate_carbon(request: EstimateRequest):
    try:
        dish_name = request.dish.strip()
        print("In estimate carbon function " , dish_name)
        # Check cache first
        cached_result = await cache_service.get_cached_result(dish_name)
        if cached_result:
            print(f"Cache hit for dish: {dish_name}")
            # Remove cache metadata before returning
            result = {k: v for k, v in cached_result.items() if k not in ['cached_at', 'cache_key']}
            return result
        
        print(f"Cache miss for dish: {dish_name} - calling LLM")
        
        # Get fresh result from LLM
        result = await estimate_carbon_from_dish(dish_name)
        
        # Cache the result for future use
        await cache_service.cache_result(dish_name, result)
        print(f"Cached result for dish: {dish_name}")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
