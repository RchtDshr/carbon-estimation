import os
import json
import asyncio
from openai import OpenAI

# Get the API key and print it for debugging
api_key = os.getenv("OPENAI_API_KEY")
print(f"OpenAI API Key present: {bool(api_key)}")
print(f"API Key starts with: {api_key[:10] if api_key else 'None'}...")

client = OpenAI(api_key=api_key)

async def estimate_carbon_from_dish(dish: str) -> dict:
    """
    Calls OpenAI LLM to estimate carbon footprint of a dish.
    Returns dict in {dish, estimated_carbon_kg, ingredients}.
    """
    print(f"🤖 Starting LLM estimation for dish: {dish}")
    
    prompt = f"""
    You are a carbon footprint estimation assistant.
    Given a dish name, output a JSON object with the format:
    {{
      "dish": "<dish name>",
      "estimated_carbon_kg": <float>,
      "ingredients": [
        {{ "name": "<ingredient>", "carbon_kg": <float> }},
        ...
      ]
    }}
    Dish: {dish}
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
        return result
        
    except Exception as e:
        print(f"❌ OpenAI API Error: {str(e)}")
        print(f"❌ Error type: {type(e)}")
        raise e
