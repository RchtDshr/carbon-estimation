import os
import json
import asyncio
from openai import OpenAI

# Get the API key and print it for debugging
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

async def estimate_carbon_from_dish(dish: str) -> dict:
    """
    Calls OpenAI LLM to estimate carbon footprint of a dish.
    Returns dict in {dish, estimated_carbon_kg, ingredients}.
    """
    print(f"🤖 Starting LLM estimation for dish: {dish}")
    
    prompt = f"""
    You are a carbon footprint estimation assistant. Please respond with a JSON object.
    
    IMPORTANT: First, determine if the input "{dish}" is food/dish related.
    
    If the input is NOT food-related (like random text, objects, people, places, etc.), respond with this JSON format:
    {{
      "dish": "{dish}",
      "estimated_carbon_kg": -1,
      "ingredients": [],
      "error": "Input does not appear to be food-related. Please enter a food item or dish name."
    }}
    
    If the input IS food-related, provide a normal carbon footprint estimation in this JSON format:
    {{
      "dish": "<actual dish name>",
      "estimated_carbon_kg": <float>,
      "ingredients": [
        {{ "name": "<ingredient>", "carbon_kg": <float> }},
        ...
      ]
    }}
    
    Input: {dish}
    """

    try:
        # Run the synchronous OpenAI call in a thread pool to make it properly async
        loop = asyncio.get_event_loop()
        print("🔄 Making OpenAI API call...")
        
        response = await loop.run_in_executor(
            None,
            lambda: client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0,
            )
        )
        
        print("✅ OpenAI API call successful")
        result = json.loads(response.choices[0].message.content)
        print(f"📊 LLM Result: {result}")
        
        # Check if the result indicates non-food input
        if result.get("estimated_carbon_kg") == -1 and "error" in result:
            error_message = result.get("error", "Input does not appear to be food-related")
            print(f"🚫 Non-food input detected: {error_message}")
            raise ValueError(error_message)
        
        # Remove the error field from successful responses
        if "error" in result:
            result.pop("error")
        
        return result
        
    except Exception as e:
        print(f"❌ OpenAI API Error: {str(e)}")
        print(f"❌ Error type: {type(e)}")
        raise e
