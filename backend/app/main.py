from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import main as main_router
import os

app = FastAPI(
    title="Social Media Downloader API",
    description="All-in-one social media content downloader for TikTok, Instagram, X (Twitter), and Snapchat",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(main_router.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Social Media Downloader API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
