"""
Farmer/Producer Model
Represents individual farmers or FPOs
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Farmer(Base):
    __tablename__ = "farmers"
    
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    name_hi = Column(String(200), nullable=True)  # Hindi name
    phone = Column(String(20), nullable=False)
    
    # Location
    location = Column(String(300), nullable=False)
    location_hi = Column(String(300), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Type & Status
    is_fpo = Column(Boolean, default=False)
    fpo_member_count = Column(Integer, nullable=True)
    verified = Column(Boolean, default=False)
    rating = Column(Float, default=4.5)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    products = relationship("Product", back_populates="farmer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Farmer(id='{self.id}', name='{self.name}')>"
