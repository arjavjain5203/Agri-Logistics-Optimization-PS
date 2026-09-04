"""
KrishiFlow AI - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.db.database import engine, Base
from app.api.v1 import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting KrishiFlow AI Backend...")
    print(f"📊 Database: {settings.DATABASE_URL.split('@')[-1]}")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down KrishiFlow AI Backend...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Agricultural Supply Network API",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint - Health check"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "message": "KrishiFlow AI Backend is running!"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "api_version": settings.APP_VERSION
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
