from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from schemas import DishEstimateResponse
from app.services.vision import analyze_food_image
from app.services.llm import estimate_carbon_from_dish
from typing import Optional

router = APIRouter(tags=["estimate"])

@router.post("/estimate/image", response_model=DishEstimateResponse)
async def estimate_from_image(
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None)
):
    try:
        if not file and not image_url:
            raise HTTPException(status_code=400, detail="Either file or image_url must be provided")
        
        if file and image_url:
            raise HTTPException(status_code=400, detail="Provide either file or image_url, not both")

        # 1. Send image to vision model to get dish name
        if file:
            dish_name = await analyze_food_image(file)
        else:
            dish_name = await analyze_food_image(image_url)
            
        print(f"Identified dish from image: {dish_name}")

        # 2. Call LLM to get JSON estimate for carbon footprint
        result = await estimate_carbon_from_dish(dish_name)
        print(f"Carbon estimate result: {result}")
        
        return result

    except Exception as e:
        print(f"Error in estimate_from_image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
