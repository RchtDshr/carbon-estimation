from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from schemas import DishEstimateResponse
from app.services.vision import analyze_food_image
from app.services.llm import estimate_carbon_from_dish
from app.services.cache import cache_service
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

        # 2. Check cache first using the identified dish name
        cached_result = await cache_service.get_cached_result(dish_name)
        if cached_result:
            print(f"Cache hit for dish (from image): {dish_name}")
            # Remove cache metadata before returning
            result = {k: v for k, v in cached_result.items() if k not in ['cached_at', 'cache_key']}
            return result
        
        print(f"Cache miss for dish (from image): {dish_name} - calling LLM")

        # 3. Call LLM to get JSON estimate for carbon footprint
        try:
            result = await estimate_carbon_from_dish(dish_name)
            print(f"Carbon estimate result: {result}")
        except ValueError as llm_error:
            # Handle non-food validation from LLM - this means the vision identified something non-food
            print(f"LLM detected non-food item from image analysis: {str(llm_error)}")
            # Return a more appropriate error message for images
            raise HTTPException(status_code=400, detail="This image does not contain food. Please upload a clear image of a dish or meal.")
        except Exception as llm_error:
            print(f"LLM Error: {str(llm_error)}")
            print(f"LLM Error type: {type(llm_error)}")
            raise HTTPException(status_code=500, detail=f"LLM Error: {str(llm_error)}")
        
        # 4. Cache the result for future use
        await cache_service.cache_result(dish_name, result)
        print(f"Cached result for dish (from image): {dish_name}")
        
        return result

    except ValueError as e:
        # Handle validation errors (non-food input/image)
        print(f"Validation Error in estimate_from_image: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Error in estimate_from_image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
