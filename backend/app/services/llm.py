import os
import json
from openai import OpenAI

# Get the API key and print it for debugging
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

async def estimate_carbon_from_dish(dish: str) -> dict:
    """
    Calls OpenAI LLM to estimate carbon footprint of a dish.
    Returns dict in {dish, estimated_carbon_kg, ingredients}.
    """
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

    response = client.chat.completions.create(
        model="gpt-4o-mini",   # efficient + supports JSON mode
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0,
    )

    return json.loads(response.choices[0].message.content)
