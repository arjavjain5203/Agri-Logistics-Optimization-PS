"""
Demand/Procurement Request Model
Represents buyer's procurement requirements
"""

from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Demand(Base):
    __tablename__ = "demands"
    
    id = Column(String(50), primary_key=True, index=True)  # e.g., 'DEM-8821'
    buyer_id = Column(String(50), ForeignKey("buyers.id"), nullable=False)
    
    # Requirement Details
    crop_id = Column(String(50), nullable=False, index=True)
    crop_name = Column(String(100), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    quality_grade = Column(String(20), default="Grade A")
    
    # Delivery
    delivery_location = Column(String(300), nullable=False)
    delivery_latitude = Column(Float, nullable=False)
    delivery_longitude = Column(Float, nullable=False)
    required_by_date = Column(Date, nullable=False)
    
    # Pricing
    max_budget_per_kg = Column(Float, nullable=False)
    
    # Status
    status = Column(String(20), default="pending")  # pending, matched, confirmed, completed
    
    # Matching Results (JSON stored as text)
    matched_farmer_ids = Column(Text, nullable=True)  # Comma-separated farmer IDs
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    buyer = relationship("Buyer", back_populates="demands")
    orders = relationship("Order", back_populates="demand", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Demand(id='{self.id}', crop='{self.crop_name}', qty={self.quantity_kg}kg)>"
