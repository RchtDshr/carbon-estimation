from pydantic import BaseModel
from typing import List

class Ingredient(BaseModel):
    name: str
    carbon_kg: float

class EstimateRequest(BaseModel):
    dish: str

class EstimateResponse(BaseModel):
    dish: str
    estimated_carbon_kg: float
    ingredients: List[Ingredient]

# Alias for image endpoint response
DishEstimateResponse = EstimateResponse
