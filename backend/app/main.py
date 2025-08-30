from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.api import estimate,estimate_image

app = FastAPI(title="Carbon Footprint API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
        "http://frontend:5173",   # Docker frontend
        "https://carbon-estimation-frontend.onrender.com",  # Your specific frontend URL
        "https://*.onrender.com", # Render deployments (wildcard)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Carbon Footprint API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "carbon-footprint-backend"}

@app.get("/api/test")
async def test_endpoint():
    return {
        "message": "Backend is working with hot reload!", 
        "data": "This is test data from the backend",
        "timestamp": "Updated!"
    }
    
api_router = APIRouter()
api_router.include_router(estimate.router)
api_router.include_router(estimate_image.router)

# Register once
app.include_router(api_router)