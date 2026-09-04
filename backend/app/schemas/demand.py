"""Demand Schemas"""

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class DemandBase(BaseModel):
    buyer_id: str
    crop_id: str
    crop_name: str
    quantity_kg: float
    quality_grade: str = "Grade A"
    delivery_location: str
    delivery_latitude: float
    delivery_longitude: float
    required_by_date: date
    max_budget_per_kg: float


class DemandCreate(DemandBase):
    pass


class DemandResponse(DemandBase):
    id: str
    status: str
    matched_farmer_ids: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
