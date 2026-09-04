"""Product Schemas"""

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class ProductBase(BaseModel):
    farmer_id: str
    crop_id: str
    crop_name: str
    crop_name_hi: Optional[str] = None
    quantity_kg: float
    price_per_kg: float
    grade: str = "Grade A"
    harvest_date: date
    available_until: Optional[date] = None
    is_available: int = 1


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
