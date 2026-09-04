"""
Product/Crop Model
Represents available agricultural produce from farmers
"""

from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(String(50), ForeignKey("farmers.id"), nullable=False)
    
    # Crop Details
    crop_id = Column(String(50), nullable=False, index=True)  # e.g., 'tomato', 'potato'
    crop_name = Column(String(100), nullable=False)
    crop_name_hi = Column(String(100), nullable=True)
    
    # Availability
    quantity_kg = Column(Float, nullable=False)
    price_per_kg = Column(Float, nullable=False)
    grade = Column(String(20), default="Grade A")  # Grade A, Grade B, etc.
    
    # Dates
    harvest_date = Column(Date, nullable=False)
    available_until = Column(Date, nullable=True)
    
    # Status
    is_available = Column(Integer, default=1)  # 1 = available, 0 = sold/reserved
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    farmer = relationship("Farmer", back_populates="products")
    
    def __repr__(self):
        return f"<Product(id={self.id}, crop='{self.crop_name}', qty={self.quantity_kg}kg)>"
