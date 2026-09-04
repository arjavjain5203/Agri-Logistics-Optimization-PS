"""Farmer Schemas"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FarmerBase(BaseModel):
    name: str
    name_hi: Optional[str] = None
    phone: str
    location: str
    location_hi: Optional[str] = None
    latitude: float
    longitude: float
    is_fpo: bool = False
    fpo_member_count: Optional[int] = None
    verified: bool = False
    rating: float = 4.5


class FarmerCreate(FarmerBase):
    id: str


class FarmerResponse(FarmerBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
