"""Order Schemas"""

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class OrderBase(BaseModel):
    demand_id: str
    crop_name: str
    crop_name_hi: Optional[str] = None
    total_quantity_kg: float
    grade: str = "Grade A"
    total_amount: float
    blended_price_per_kg: float
    supplier_count: int = 1
    supplier_ids: Optional[str] = None
    status: str = "pending"
    optimized_distance_km: Optional[float] = None
    estimated_cost_inr: Optional[float] = None
    order_date: date
    delivery_date: Optional[date] = None


class OrderCreate(OrderBase):
    id: str


class OrderResponse(OrderBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
