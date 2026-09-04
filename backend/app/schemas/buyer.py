"""Buyer Schemas"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BuyerBase(BaseModel):
    name: str
    name_hi: Optional[str] = None
    location: str
    location_hi: Optional[str] = None
    latitude: float
    longitude: float
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    buyer_type: str = "restaurant"
    monthly_volume_kg: int = 0
    rating: float = 4.5


class BuyerCreate(BuyerBase):
    id: str


class BuyerResponse(BuyerBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
