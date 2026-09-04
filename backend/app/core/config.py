"""
Application Configuration
Loads settings from environment variables
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # App Info
    APP_NAME: str = "KrishiFlow AI"
    APP_VERSION: str = "1.0.0"
    
    # API Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://krishiflow:krishiflow123@localhost:5432/krishiflow_db"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            if field_name == 'CORS_ORIGINS':
                return [origin.strip() for origin in raw_val.split(',')]
            return raw_val


settings = Settings()
