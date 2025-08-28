from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Carbon Footprint API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://frontend:5173"],  # Frontend URLs
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
