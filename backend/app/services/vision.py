import os
import base64
import httpx
from fastapi import UploadFile
from openai import OpenAI
from typing import Union

# Get the API key
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

async def analyze_food_image(source: Union[UploadFile, str]) -> str:
    """
    Analyzes a food image using OpenAI Vision API.
    
    Args:
        source: Either an UploadFile object or a URL string
        
    Returns:
        The identified dish name as a string.
    """
    
    # Create the prompt for food identification
    prompt = """
    Analyze this food image and identify the main dish. 
    Return only the name of the dish (e.g., "Chicken Biryani", "Pizza Margherita", "Caesar Salad").
    Be specific about the type of dish if you can identify it clearly.
    If you see multiple dishes, identify the main/primary dish.
    """

    try:
        # Handle URL input
        if isinstance(source, str):
            print(f"🌐 Processing image from URL: {source}")
            image_url = source
        
        # Handle file upload
        else:
            print(f"📁 Processing uploaded file: {source.filename}")
            # Read the image file
            image_bytes = await source.read()
            
            # Convert to base64
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            image_url = f"data:image/jpeg;base64,{image_base64}"

        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Vision-capable model
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url,
                                "detail": "low"  # For cost efficiency
                            }
                        }
                    ]
                }
            ],
            max_tokens=100,
            temperature=0,
        )
        
        dish_name = response.choices[0].message.content.strip()
        print(f"🍽️ Identified dish: {dish_name}")
        
        return dish_name
        
    except Exception as e:
        print(f"❌ Error in vision analysis: {str(e)}")
        raise Exception(f"Failed to analyze food image: {str(e)}")
