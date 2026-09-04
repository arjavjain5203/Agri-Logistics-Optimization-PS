"""
Order Model
Represents confirmed orders linking demands with suppliers
"""

from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String(50), primary_key=True, index=True)  # e.g., 'KF-ORD-8821'
    demand_id = Column(String(50), ForeignKey("demands.id"), nullable=False)
    
    # Order Details
    crop_name = Column(String(100), nullable=False)
    crop_name_hi = Column(String(100), nullable=True)
    total_quantity_kg = Column(Float, nullable=False)
    grade = Column(String(20), default="Grade A")
    
    # Pricing
    total_amount = Column(Float, nullable=False)
    blended_price_per_kg = Column(Float, nullable=False)
    
    # Fulfillment
    supplier_count = Column(Integer, default=1)
    supplier_ids = Column(Text, nullable=True)  # Comma-separated farmer IDs
    
    # Status
    status = Column(String(20), default="pending")  # pending, inTransit, delivered, cancelled
    
    # Logistics
    optimized_distance_km = Column(Float, nullable=True)
    estimated_cost_inr = Column(Float, nullable=True)
    
    # Dates
    order_date = Column(Date, nullable=False)
    delivery_date = Column(Date, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    demand = relationship("Demand", back_populates="orders")
    
    def __repr__(self):
        return f"<Order(id='{self.id}', status='{self.status}')>"
